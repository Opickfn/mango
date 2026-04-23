<?php

namespace Database\Seeders;

use App\Models\Umkm\Product;
use App\Models\Umkm\Umkm;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $umkm = Umkm::first();

        if (! $umkm) {
            return;
        }

        Product::updateOrCreate(
            ['name' => 'Spare Part CNC Housing'],
            [
                'umkm_id' => $umkm->id,
                'sku' => 'MFG-001',
                'unit' => 'pcs',
                'price' => 125000,
                'is_active' => true,
            ]
        );

        Product::updateOrCreate(
            ['name' => 'Bracket Stainless Presisi'],
            [
                'umkm_id' => $umkm->id,
                'sku' => 'MFG-002',
                'unit' => 'pcs',
                'price' => 98000,
                'is_active' => true,
            ]
        );
    }
}
