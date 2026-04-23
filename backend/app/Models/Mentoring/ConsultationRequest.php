<?php

namespace App\Models\Mentoring;

use App\Models\Umkm\Umkm;
use App\Models\User;
use App\Models\Master\Department;
use App\Models\Mentoring\MentorAssignment;
use App\Models\Mentoring\ConsultationSession;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

class ConsultationRequest extends Model
{
    use HasFactory, LogsActivity;

    /**
     * Configure activity logging.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }

    protected $fillable = [
        'institution_id',
        'umkm_id',
        'requested_by',
        'topic',
        'description',
        'status',
        'department_id',
    ];

    public function umkm(): BelongsTo
    {
        return $this->belongsTo(Umkm::class);
    }

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function institution(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Master\Organization::class, 'institution_id');
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(MentorAssignment::class);
    }

    public function sessions(): HasMany
    {
        return $this->hasMany(ConsultationSession::class);
    }
}
