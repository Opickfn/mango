<?php

namespace Database\Seeders;

use App\Models\Assessment\AssessmentCategory;
use App\Models\Assessment\Question;
use Illuminate\Database\Seeder;

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            'manajemen' => [
                'Apakah usaha Anda sudah memiliki legalitas lengkap (NIB, Izin Usaha, dll)?',
                'Apakah terdapat struktur organisasi yang jelas?',
                'Apakah sudah ada SOP untuk operasional rutin?',
            ],
            'produksi' => [
                'Apakah proses produksi sudah terstandarisasi?',
                'Bagaimana tingkat otomasi pada lini produksi Anda?',
                'Apakah dilakukan pengendalian kualitas (QC) pada setiap produk?',
            ],
            'pemasaran' => [
                'Seberapa luas jangkauan pasar produk Anda saat ini?',
                'Apakah Anda sudah menggunakan platform digital untuk pemasaran?',
                'Apakah brand usaha Anda sudah terdaftar/dikenal luas?',
            ],
            'keuangan' => [
                'Apakah dilakukan pencatatan keuangan secara rutin?',
                'Apakah keuangan usaha sudah terpisah dari keuangan pribadi?',
                'Apakah Anda memiliki laporan arus kas bulanan?',
            ],
            'teknologi' => [
                'Bagaimana kondisi peralatan produksi utama Anda?',
                'Seberapa jauh adopsi teknologi digital dalam operasional harian?',
                'Apakah dilakukan pemeliharaan (maintenance) rutin pada mesin?',
            ],
            'sdm' => [
                'Apakah karyawan Anda memiliki keterampilan teknis yang memadai?',
                'Apakah dilakukan pelatihan berkala bagi tenaga kerja?',
                'Bagaimana tingkat kompetensi manajerial dalam tim Anda?',
            ],
        ];

        foreach ($data as $slug => $questions) {
            $category = AssessmentCategory::where('slug', $slug)->first();
            if ($category) {
                foreach ($questions as $index => $text) {
                    Question::updateOrCreate(
                        [
                            'assessment_category_id' => $category->id,
                            'text'                   => $text,
                        ],
                        [
                            'type'      => 'scale',
                            'weight'    => 1.0,
                            'order'     => $index + 1,
                            'is_active' => true,
                        ]
                    );
                }
            }
        }
    }
}



