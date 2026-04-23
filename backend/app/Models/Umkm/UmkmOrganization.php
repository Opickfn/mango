<?php

namespace App\Models\Umkm;

use App\Models\Master\Organization;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class UmkmOrganization extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'upt_id',
        'name',
        'slug',
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
        static::creating(function (self $organization): void {
            if (empty($organization->slug) && ! empty($organization->name)) {
                $organization->slug = Str::slug($organization->name).'-'.time();
            }
        });
    }

    public function upt(): BelongsTo
    {
        return $this->belongsTo(Organization::class, 'upt_id');
    }

    public function umkm(): HasOne
    {
        return $this->hasOne(Umkm::class);
    }
}
