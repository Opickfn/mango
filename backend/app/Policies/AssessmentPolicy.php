<?php

namespace App\Policies;

use App\Models\Assessment\AssessmentResult;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class AssessmentPolicy
{
    public function view(
        User $user,
        AssessmentResult $assessment
    ): bool {
        if ($user->hasRole('super_admin')) {
            return true;
        }

        if ($assessment->user_id === $user->id) {
            return true;
        }

        $umkm = $assessment->umkm;

        if (! $umkm) {
            return false;
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
        AssessmentResult $assessment
    ): bool {
        if ($user->hasRole('super_admin')) {
            return true;
        }

        return $assessment->user_id === $user->id
            && $assessment->status === 'draft';
    }

    public function delete(
        User $user,
        AssessmentResult $assessment
    ): bool {
        if ($user->hasRole('super_admin')) {
            return true;
        }

        return $assessment->user_id === $user->id
            && $assessment->status === 'draft';
    }
}
