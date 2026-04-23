<?php

namespace App\Policies;

use App\Models\Umkm\Umkm;
use App\Models\User;

class UmkmPolicy
{
    public function view(
        User $user,
        Umkm $umkm
    ): bool {
        if ($user->hasRole('super_admin')) {
            return true;
        }

        if ($umkm->user_id === $user->id) {
            return true;
        }

        return $user->institutions()
            ->where(
                'institutions.id',
                $umkm->managed_by_institution_id
            )
            ->exists();
    }

    public function update(
        User $user,
        Umkm $umkm
    ): bool {
        if ($umkm->user_id === $user->id) {
            return true;
        }

        return $user->hasRole('super_admin')
            || (
                $user->hasAnyRole([
                    'admin',
                    'upt',
                ]) &&
                $user->institutions()
                    ->where(
                        'institutions.id',
                        $umkm->managed_by_institution_id
                    )
                    ->exists()
            );
    }

    public function delete(
        User $user,
        Umkm $umkm
    ): bool {
        if ($user->hasRole('super_admin')) {
            return true;
        }

        return $user->hasAnyRole([
            'admin',
            'upt',
        ]) &&
        $user->institutions()
            ->where(
                'institutions.id',
                $umkm->managed_by_institution_id
            )
            ->exists();
    }

    public function approve(
        User $user,
        Umkm $umkm
    ): bool {
        if ($user->hasRole('super_admin')) {
            return true;
        }

        return $user->hasAnyRole([
            'admin',
            'upt',
        ]) &&
        $user->institutions()
            ->where(
                'institutions.id',
                $umkm->managed_by_institution_id
            )
            ->exists();
    }
}
