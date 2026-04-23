<?php

namespace App\Services\Admin\Master;

use App\Models\Umkm\Umkm;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class UmkmService
{
    /**
     * Create a new UMKM and handle logo upload.
     */
    public function create(User $user, array $data): Umkm
    {
        return DB::transaction(function () use ($user, $data) {
            if (Umkm::where('user_id', $user->id)->exists()) {
                abort(409, 'UMKM sudah terdaftar untuk akun ini.');
            }

            // Handle logo separately
            $logo = $data['logo'] ?? null;
            unset($data['logo']);

            if (empty($data['umkm_organization_id'])) {
                abort(422, 'UMKM harus memilih organisasi UMKM binaan UPT.');
            }

            $umkmOrganization = \App\Models\Umkm\UmkmOrganization::query()
                ->with('upt')
                ->findOrFail($data['umkm_organization_id']);

            $data['managed_by_institution_id'] = $umkmOrganization->upt_id;

            $umkm = Umkm::create([
                ...$data,
                'user_id' => $user->id,
            ]);

            if ($logo instanceof UploadedFile) {
                $umkm->addMedia($logo)->toMediaCollection('logos');
            }

            return $umkm;
        });
    }

    /**
     * Update UMKM information and logo.
     */
    public function update(Umkm $umkm, array $data): Umkm
    {
        return DB::transaction(function () use ($umkm, $data) {
            if (isset($data['logo']) && $data['logo'] instanceof UploadedFile) {
                $umkm->addMedia($data['logo'])->toMediaCollection('logos');
                unset($data['logo']);
            }

            $umkm->update($data);

            return $umkm;
        });
    }

    /**
     * Delete UMKM.
     */
    public function delete(Umkm $umkm): void
    {
        DB::transaction(function () use ($umkm) {
            $umkm->delete();
        });
    }
}
