<?php

namespace Database\Seeders;

use App\Models\Umkm\BusinessProfile;
use App\Models\Umkm\Umkm;
use Illuminate\Database\Seeder;

class BusinessProfileSeeder extends Seeder
{
    public function run(): void
    {
        $umkm = Umkm::first();

        if (! $umkm) {
            return;
        }

        BusinessProfile::updateOrCreate(
            ['umkm_id' => $umkm->id],
            [
                'vision' => 'Menjadi UMKM unggulan di bidang makanan ringan',
                'mission' => 'Menghasilkan produk berkualitas dan memperluas pasar',
                'main_product' => 'Keripik Singkong Premium',
                'annual_revenue' => 10000000,
                'market_target' => 'Retail dan marketplace online',
            ]
        );
    }
}



