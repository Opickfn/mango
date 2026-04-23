<?php

namespace Database\Seeders;

use App\Models\Master\Department;
use App\Models\Master\Organization;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $kampus = Organization::where('type', 'kampus')->first();

        if (! $kampus) {
            return;
        }

        $departments = [
            ['name' => 'P3M', 'description' => 'Penelitian dan Pengabdian Masyarakat'],
            ['name' => 'Inkubator Bisnis', 'description' => 'Kealumnian dan Inkubator'],
            ['name' => 'DPP Konsultasi', 'description' => 'Divisi Pengembangan Produk'],
            ['name' => 'PBL', 'description' => 'Project Based Learning Mahasiswa'],
        ];

        foreach ($departments as $dept) {
            Department::updateOrCreate(
                [
                    'institution_id' => $kampus->id,
                    'slug' => strtolower(str_replace(' ', '-', $dept['name'])),
                ],
                [
                    'institution_id' => $kampus->id,
                    'name' => $dept['name'],
                    'description' => $dept['description'],
                    'is_active' => true,
                ]
            );
        }
    }
}

