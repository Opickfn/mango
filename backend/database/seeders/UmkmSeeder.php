<?php

namespace Database\Seeders;

use App\Models\Master\Organization;
use App\Models\Umkm\Umkm;
use App\Models\Umkm\UmkmOrganization;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class UmkmSeeder extends Seeder
{
    public function run(): void
    {
        $org = Organization::where('slug', 'sikim')->first();
        $user = User::where('email', 'umkm@gmail.com')->first();

        if (! $org || ! $user) {
            return;
        }

        $umkmOrganization = UmkmOrganization::updateOrCreate(
            [
                'upt_id' => $org->id,
                'slug' => Str::slug('Konveksi Jaya').'-'.$org->id,
            ],
            [
                'name' => 'Konveksi Jaya',
                'email' => $user->email,
                'phone' => $user->phone,
                'is_active' => true,
            ]
        );

        Umkm::updateOrCreate(
            ['user_id' => $user->id],
            [
                'managed_by_institution_id' => $org->id,
                'umkm_organization_id' => $umkmOrganization->id,
                'name' => 'Konveksi Jaya',
                'owner_name' => 'Budi',
                'sector' => 'Fashion',
                'employee_count' => 8,
                'is_active' => true,
            ]
        );
    }
}
