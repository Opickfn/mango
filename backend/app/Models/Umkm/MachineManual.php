<?php

namespace App\Models\Umkm;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MachineManual extends Model
{
    protected $fillable = [
        'umkm_id',
        'machine_name',
        'brand',
        'quantity',
        'condition',
        'notes',
    ];

    protected $casts = [
        'quantity' => 'integer',
    ];

    public function umkm(): BelongsTo
    {
        return $this->belongsTo(Umkm::class);
    }
}
