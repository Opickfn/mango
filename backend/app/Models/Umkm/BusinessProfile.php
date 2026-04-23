<?php

namespace App\Models\Umkm;

use Illuminate\Database\Eloquent\Model;

class BusinessProfile extends Model
{
     protected $fillable = [
        'umkm_id',
        'vision',
        'mission',
        'main_product',
        'annual_revenue',
        'market_target',
    ];

    public function umkm()
    {
        return $this->belongsTo(Umkm::class);
    }
}
