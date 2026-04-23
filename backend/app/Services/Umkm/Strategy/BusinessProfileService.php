<?php

namespace App\Services\Umkm\Strategy;

use App\Models\Umkm\BusinessProfile;
use App\Models\Umkm\Umkm;

class BusinessProfileService
{
    public function upsert(Umkm $umkm, array $data)
    {
        return BusinessProfile::updateOrCreate(
            ['umkm_id' => $umkm->id],
            $data
        );
    }
}



