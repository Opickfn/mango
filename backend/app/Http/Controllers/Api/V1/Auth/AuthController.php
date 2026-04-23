<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\Auth\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class AuthController extends Controller
{
    /**
     * @OA\Get(
     *     path="/v1/me",
     *     summary="Get authenticated user profile",
     *     tags={"Auth"},
     *     security={{"cookieAuth": {}}},
     *     @OA\Response(
     *         response=200,
     *         description="User profile fetched successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function me(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'message' => 'Unauthenticated',
                ], 401);
            }

            $user->load([
                'institutions',
                'roles',
                'umkm',
                'umkmOrganization',
                'umkm.profile',
            ]);

            return $this->ok([
                'user' => new UserResource($user),
                'is_super_admin' => $user->hasRole('super_admin'),
            ], 'Authenticated user fetched successfully');
        } catch (Throwable $e) {
            Log::error('Auth me error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->error('Failed to fetch authenticated user', 500);
        }
    }
}

