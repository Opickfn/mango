<?php

namespace App\Models;

use App\Models\Master\Department;
use App\Models\Master\Organization;
use App\Models\Master\OrganizationUser;
use App\Models\Umkm\Umkm;
use App\Models\Umkm\UmkmOrganization;
use App\Models\Assessment\AssessmentResult;
use App\Models\Mentoring\ConsultationRequest;
use App\Models\Mentoring\MentorAssignment;
use App\Models\Mentoring\ConsultationNote;
use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Collection;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

class User extends Authenticatable implements MustVerifyEmail, HasMedia
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, HasRoles, Notifiable, TwoFactorAuthenticatable, InteractsWithMedia, LogsActivity;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'avatar',
        'is_active',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

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

    /**
     * Register media collections.
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('avatars')
            ->singleFile()
            ->useFallbackUrl('/images/placeholders/avatar.png');
    }

    /**
     * Register media conversions.
     */
    public function registerMediaConversions(Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(100)
            ->height(100)
            ->sharpen(10);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function organizations(): BelongsToMany
    {
        return $this->belongsToMany(Organization::class, 'institution_user', 'user_id', 'institution_id')
            ->using(OrganizationUser::class)
            ->withPivot(['department_id', 'is_active', 'joined_at'])
            ->withTimestamps()
            ->wherePivot('is_active', true);
    }

    public function institutions(): BelongsToMany
    {
        return $this->organizations();
    }

    public function institutionOrganizations(): BelongsToMany
    {
        return $this->organizations()->whereIn('institutions.type', [
            Organization::TYPE_KAMPUS,
            Organization::TYPE_UPT,
        ]);
    }

    public function belongsToOrganization(Organization $organization): bool
    {
        return $this->organizations()
            ->where('institutions.id', $organization->id)
            ->exists();
    }

    public function departmentIn(Organization $organization): ?Department
    {
        $pivot = $this->organizations()
            ->where('institutions.id', $organization->id)
            ->first()?->pivot;

        if (! $pivot?->department_id) {
            return null;
        }

        return Department::find($pivot->department_id);
    }

    public function rolesInOrganization(
        Organization $organization,
    ): Collection {
        return $this->roles()
            ->where(
                config('permission.column_names.team_foreign_key'),
                $organization->id,
            )
            ->get();
    }

    public function isSuperAdmin(): bool
    {
        return $this->hasRole('super_admin');
    }

    public function umkm()
    {
        return $this->hasOne(Umkm::class);
    }

    public function umkmOrganization()
    {
        return $this->hasOne(UmkmOrganization::class);
    }

    public function assessmentResults()
    {
        return $this->hasMany(AssessmentResult::class);
    }

    public function consultationRequests()
    {
        return $this->hasMany(ConsultationRequest::class);
    }

    public function mentorAssignments()
    {
        return $this->hasMany(MentorAssignment::class, 'mentor_user_id');
    }

    public function consultationNotes()
    {
        return $this->hasMany(ConsultationNote::class, 'author_id');
    }
}
