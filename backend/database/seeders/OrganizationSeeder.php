<?php

namespace Database\Seeders;

use App\Models\Master\Organization;
use Illuminate\Database\Seeder;

class OrganizationSeeder extends Seeder
{
    public function run(): void
    {
        Organization::updateOrCreate(
            ['slug' => 'polman-bandung'],
            [
                'name' => 'Polman Bandung',
                'type' => 'kampus',
                'email' => 'admin@polman.ac.id',
                'is_active' => true,
            ]
        );

        Organization::updateOrCreate(
            ['slug' => 'sikim'],
            [
                'name' => 'SIKIM',
                'type' => 'upt',
                'email' => 'sikim@gmail.com',
                'is_active' => true,
            ]
        );
    }
}


