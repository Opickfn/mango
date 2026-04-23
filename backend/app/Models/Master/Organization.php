<?php

namespace App\Models\Master;

use App\Models\Machine\Machine;
use App\Models\Umkm\Umkm;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

class Organization extends Model
{
     use HasFactory, SoftDeletes, LogsActivity;

    protected $table = 'institutions';

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

    const TYPE_KAMPUS = 'kampus';

    const TYPE_UPT = 'upt';

    protected $fillable = [
        'name',
        'slug',
        'type',
        'email',
        'phone',
        'address',
        'city',
        'province',
        'postal_code',
        'logo',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (self $org) {
            if (empty($org->slug)) {
                $org->slug = Str::slug($org->name).'-'.time();
            }
        });

        static::updating(function (self $org) {
            if ($org->isDirty('name')) {
                $org->slug = Str::slug($org->name).'-'.time();
            }
        });
    }

    public function departments()
    {
        return $this->hasMany(Department::class, 'institution_id');
    }

    public function machines()
    {
        return $this->morphMany(Machine::class, 'owner');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'institution_user', 'institution_id', 'user_id')
            ->using(OrganizationUser::class)
            ->withPivot(['department_id', 'is_active', 'joined_at'])
            ->withTimestamps();
    }

    public function activeUsers(): BelongsToMany
    {
        return $this->users()->wherePivot('is_active', true);
    }

    public function usersByDepartment(Department|int $department): BelongsToMany
    {
        $id = $department instanceof Department ? $department->id : $department;

        return $this->activeUsers()->wherePivot('department_id', $id);
    }

    public function umkm(): HasMany
    {
        return $this->hasMany(Umkm::class, 'managed_by_institution_id');
    }

    public function isKampus(): bool
    {
        return $this->type === self::TYPE_KAMPUS;
    }

    public function isUpt(): bool
    {
        return $this->type === self::TYPE_UPT;
    }

    public function requiresDepartment(): bool
    {
        return $this->type === self::TYPE_KAMPUS;
    }
}
