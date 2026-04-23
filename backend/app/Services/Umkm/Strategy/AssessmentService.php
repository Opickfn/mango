<?php

namespace App\Services\Umkm\Strategy;

use App\Models\Assessment\Answer;
use App\Models\Assessment\AssessmentCategory;
use App\Models\Assessment\AssessmentResult;
use App\Models\Assessment\Recommendation;
use Illuminate\Support\Facades\DB;

class AssessmentService
{
    protected const WEIGHTS = [
        'manajemen' => 0.15,
        'produksi' => 0.25,
        'pemasaran' => 0.15,
        'keuangan' => 0.15,
        'teknologi' => 0.20,
        'sdm' => 0.10,
    ];

    protected const LEVELS = [
        ['max' => 1.8, 'level' => 'Level 1', 'category' => 'Usaha Dasar'],
        ['max' => 2.6, 'level' => 'Level 2', 'category' => 'Mulai Terorganisir'],
        ['max' => 3.4, 'level' => 'Level 3', 'category' => 'Berkembang'],
        ['max' => 4.2, 'level' => 'Level 4', 'category' => 'Maju'],
        ['max' => 5.0, 'level' => 'Level 5', 'category' => 'Siap Ekspansi'],
    ];

    public function getQuestions()
    {
        return AssessmentCategory::query()
            ->where('is_active', true)
            ->with([
                'questions' => function ($query) {
                    $query
                        ->where('is_active', true)
                        ->orderBy('order');
                },
            ])
            ->orderBy('order')
            ->get();
    }

    public function getAssessments(array $filters, $user)
    {
        $query = AssessmentResult::query()
            ->with([
                'recommendations',
                'recommendations.category',
                'umkm',
                'answers.question.category',
            ]);

        if (! $user->hasRole('super_admin')) {
            $umkm = $user->umkm;

            if (! $umkm) {
                return collect([]);
            }

            $query->where('umkm_id', $umkm->id);
        } elseif (isset($filters['umkm_id'])) {
            $query->where('umkm_id', $filters['umkm_id']);
        }

        if (isset($filters['from_date'])) {
            $query->whereDate(
                'created_at',
                '>=',
                $filters['from_date']
            );
        }

        if (isset($filters['to_date'])) {
            $query->whereDate(
                'created_at',
                '<=',
                $filters['to_date']
            );
        }

        if (isset($filters['status'])) {
            $query->where(
                'status',
                $filters['status']
            );
        }

        $query->orderBy(
            $filters['sort_by'] ?? 'created_at',
            $filters['sort_dir'] ?? 'desc'
        );

        return $query->paginate(
            min((int) ($filters['per_page'] ?? 15), 100)
        );
    }

    public function getOrCreateDraft(
        int $umkmId,
        int $userId
    ): AssessmentResult {
        $assessment = AssessmentResult::query()
            ->where('umkm_id', $umkmId)
            ->where('user_id', $userId)
            ->where('status', 'draft')
            ->first();

        if ($assessment) {
            $assessment->load('answers');

            return $assessment;
        }

        return AssessmentResult::create([
            'umkm_id' => $umkmId,
            'user_id' => $userId,
            'status' => 'draft',
            'level' => 'Level 1',
        ]);
    }

    public function submitAnswers(
        AssessmentResult $assessment,
        array $answers
    ): void {
        DB::transaction(function () use (
            $assessment,
            $answers
        ) {
            foreach ($answers as $answer) {
                Answer::updateOrCreate(
                    [
                        'assessment_result_id' => $assessment->id,
                        'question_id' => $answer['question_id'],
                    ],
                    [
                        'value' => $answer['value'],
                        'score' => $answer['score'],
                    ]
                );
            }
        });
    }

    public function process(
        AssessmentResult $result
    ): AssessmentResult {
        return DB::transaction(function () use ($result) {
            $categoryScores = $this->calculateCategoryScores($result);

            $totalScore = $this->calculateTotalScore(
                $categoryScores
            );

            $level = $this->determineLevel($totalScore);

            $result->update([
                'total_score' => $totalScore,
                'level' => $level,
                'status' => 'submitted',
                'submitted_at' => now(),
            ]);

            $this->generateRecommendations(
                $result,
                $categoryScores
            );

            return $result->fresh([
                'recommendations',
            ]);
        });
    }

    public function getChartData(
        AssessmentResult $result
    ): array {
        $scores = $this->calculateCategoryScores($result);
        $data = [];

        $categories = AssessmentCategory::query()
            ->where('is_active', true)
            ->get();

        foreach ($categories as $category) {
            $data[] = [
                'subject' => $category->name,
                'score' => (float) ($scores[$category->slug]['avg'] ?? 0),
                'fullMark' => 5,
            ];
        }

        return $data;
    }

    public function calculateCategoryScores(
        AssessmentResult $result
    ): array {
        $scores = [];

        $categories = AssessmentCategory::query()
            ->where('is_active', true)
            ->get();

        foreach ($categories as $category) {
            $avgScore = Answer::query()
                ->where(
                    'assessment_result_id',
                    $result->id
                )
                ->whereHas(
                    'question',
                    function ($query) use ($category) {
                        $query->where(
                            'assessment_category_id',
                            $category->id
                        );
                    }
                )
                ->avg('score');

            $scores[$category->slug] = [
                'id' => $category->id,
                'avg' => (float) ($avgScore ?? 0),
            ];
        }

        return $scores;
    }

    protected function calculateTotalScore(
        array $categoryScores
    ): float {
        $totalScore = 0;

        foreach (self::WEIGHTS as $slug => $weight) {
            $avg = $categoryScores[$slug]['avg'] ?? 0;

            $totalScore += $avg * $weight;
        }

        return (float) $totalScore;
    }

    protected function determineLevel(
        float $totalScore
    ): string {
        foreach (self::LEVELS as $range) {
            if ($totalScore <= $range['max']) {
                return $range['level'];
            }
        }

        return 'Level 5';
    }

    protected function generateRecommendations(
        AssessmentResult $result,
        array $categoryScores
    ): void {
        $result->recommendations()->delete();

        foreach ($categoryScores as $slug => $data) {
            $avg = $data['avg'];

            $gapScore = 5.0 - $avg;

            if ($gapScore <= 0) {
                continue;
            }

            Recommendation::create([
                'assessment_result_id' => $result->id,
                'assessment_category_id' => $data['id'],
                'gap_score' => $gapScore,
                'priority' => $this->determinePriority($gapScore),
                'recommendation_text' => $this->getRecommendationText(
                    $slug,
                    $result->level,
                    $this->determinePriority($gapScore)
                ),
            ]);
        }
    }

    protected function determinePriority(
        float $gapScore
    ): string {
        if ($gapScore > 2) {
            return 'high';
        }

        if ($gapScore > 1) {
            return 'medium';
        }

        return 'low';
    }

    protected function getRecommendationText(
        string $slug,
        string $level,
        string $priority
    ): string {
        $interventions = [
            'Level 1' => [
                'manajemen' => 'Perbaikan legalitas usaha dan penyusunan SOP dasar.',
                'keuangan' => 'Peningkatan literasi keuangan dasar dan pencatatan sederhana.',
            ],
            'Level 2' => [
                'produksi' => 'Implementasi manajemen produksi dasar.',
                'keuangan' => 'Pendampingan akses KUR.',
                'teknologi' => 'Digitalisasi dasar operasional.',
            ],
            'Level 3' => [
                'teknologi' => 'Adopsi teknologi tepat guna.',
                'manajemen' => 'Standarisasi SOP operasional.',
                'pemasaran' => 'Pengembangan marketing digital.',
            ],
            'Level 4' => [
                'teknologi' => 'Integrasi CNC atau teknologi manufaktur lanjut.',
                'keuangan' => 'Coaching manajemen keuangan strategis.',
                'sdm' => 'Peningkatan kemitraan industri.',
            ],
            'Level 5' => [
                'produksi' => 'Inovasi produk berkelanjutan.',
                'pemasaran' => 'Ekspansi pasar nasional/internasional.',
                'manajemen' => 'Replikasi model bisnis.',
            ],
        ];

        return $interventions[$level][$slug]
            ?? "Fokus pada peningkatan dimensi {$slug} untuk mencapai tahap selanjutnya.";
    }
}
