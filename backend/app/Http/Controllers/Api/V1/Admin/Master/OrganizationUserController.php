<?php

namespace App\Http\Controllers\Api\V1\Admin\Master;

use App\Http\Controllers\Controller;
use App\Models\Master\Organization;
use App\Models\Master\OrganizationUser;
use App\Models\User;
use App\Notifications\Auth\UmkmStatusUpdated;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Throwable;

class OrganizationUserController extends Controller
{
    public function index(
        Request $request,
        Organization $organization
    ): JsonResponse {
        $this->authorize('view', $organization);

        try {
            $query = $organization->users()
                ->withPivot([
                    'id',
                    'is_active',
                    'joined_at',
                    'department_id',
                ])
                ->with('roles');

            if (! is_null($request->get('is_active'))) {
                $query->wherePivot(
                    'is_active',
                    $request->boolean('is_active')
                );
            }

            $sortBy = $request->get(
                'sort_by',
                'users.created_at'
            );

            $sortDir = $request->get(
                'sort_dir',
                'desc'
            );

            $query->orderBy($sortBy, $sortDir);

            $perPage = min(
                (int) $request->get('per_page', 15),
                100
            );

            return response()->json(
                $query->paginate($perPage)
            );
        } catch (Throwable $e) {
            Log::error(
                'Organization user index error',
                ['message' => $e->getMessage()]
            );

            return response()->json([
                'message' => 'Failed to fetch organization members',
            ], 500);
        }
    }

    public function update(
        Request $request,
        Organization $organization,
        User $user
    ): JsonResponse {
        $this->authorize('update', $organization);

        $validated = $request->validate([
            'is_active' => ['required', 'boolean'],
        ]);

        try {
            $membership = OrganizationUser::query()
                ->where('institution_id', $organization->id)
                ->where('user_id', $user->id)
                ->firstOrFail();

            $membership->update([
                'is_active' => $validated['is_active'],
                'joined_at' => $validated['is_active']
                    ? ($membership->joined_at ?? now())
                    : $membership->joined_at,
            ]);

            if (
                $validated['is_active'] &&
                $user->umkm
            ) {
                $user->notify(
                    new UmkmStatusUpdated(
                        $user->umkm,
                        'active'
                    )
                );
            }

            return response()->json([
                'message' => 'Member status updated successfully',
            ]);
        } catch (Throwable $e) {
            Log::error(
                'Organization user update error',
                ['message' => $e->getMessage()]
            );

            return response()->json([
                'message' => 'Failed to update member status',
            ], 500);
        }
    }

    public function destroy(
        Organization $organization,
        User $user
    ): JsonResponse {
        $this->authorize('delete', $organization);

        try {
            $organization->users()->detach($user->id);

            return response()->noContent();
        } catch (Throwable $e) {
            Log::error(
                'Organization user delete error',
                ['message' => $e->getMessage()]
            );

            return response()->json([
                'message' => 'Failed to remove member',
            ], 500);
        }
    }
}
