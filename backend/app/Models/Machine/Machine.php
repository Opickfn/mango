<?php

namespace App\Models\Machine;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Machine extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'code',
        'type',
        'brand',
        'description',
        'location',
        'owner_id',
        'owner_type',
        'status',
        'hourly_rate',
        'is_iot_enabled',
    ];

    public function owner(): MorphTo
    {
        return $this->morphTo();
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(MachineReservation::class);
    }
}
