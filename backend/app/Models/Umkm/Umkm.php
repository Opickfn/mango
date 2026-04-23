<?php

namespace App\Models\Umkm;

use App\Models\Master\Organization;
use App\Models\User;
use App\Models\Assessment\AssessmentResult;
use App\Models\Mentoring\ConsultationRequest;
use App\Models\Project\Project;
use App\Models\Machine\Machine;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

class Umkm extends Model implements HasMedia
{
      use HasFactory, SoftDeletes, InteractsWithMedia, LogsActivity;

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
        $this->addMediaCollection('logos')
            ->singleFile()
            ->useFallbackUrl('/images/placeholders/company.png');

        $this->addMediaCollection('documents');
    }

    /**
     * Register media conversions.
     */
    public function registerMediaConversions(Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(200)
            ->height(200);
    }

    protected $table = 'umkms';

    protected $fillable = [
        'managed_by_organization_id',
        'managed_by_institution_id',
        'umkm_organization_id',
        'user_id',
        'name',
        'owner_name',
        'nib',
        'sector',
        'established_year',
        'employee_count',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'established_year' => 'integer',
        ];
    }

    public function managingOrganization()
    {
        return $this->belongsTo(Organization::class, 'managed_by_institution_id');
    }

    public function organization()
    {
        return $this->managingOrganization();
    }

    public function umkmOrganization()
    {
        return $this->belongsTo(UmkmOrganization::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function profile()
    {
        return $this->hasOne(BusinessProfile::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function assessmentResults()
    {
        return $this->hasMany(AssessmentResult::class);
    }

    public function consultationRequests()
    {
        return $this->hasMany(ConsultationRequest::class);
    }

    public function productionCapacities()
    {
        return $this->hasMany(ProductionCapacity::class);
    }

    public function machineManuals()
    {
        return $this->hasMany(MachineManual::class);
    }

    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    public function machines()
    {
        return $this->morphMany(Machine::class, 'owner');
    }
}
