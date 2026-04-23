<?php

namespace App\Http\Controllers\Api\V1\Admin\Master;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Master\StoreOrganizationRequest;
use App\Http\Requests\Admin\Master\UpdateOrganizationRequest;
use App\Http\Resources\Admin\Master\OrganizationResource;
use App\Models\Master\Organization;
use App\Services\Admin\Master\OrganizationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Throwable;

class OrganizationController extends Controller
{
    /**
     * @OA\Get(
     *     path="/admin/organizations",
     *     summary="List all organizations (Institutions)",
     *     tags={"Admin Organizations"},
     *     security={{"cookieAuth": {}}},
     *     @OA\Response(response=200, description="Success")
     * )
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            if ($user->hasRole('super_admin')) {
                $query = Organization::query();
            } else {
                $query = $user->institutionOrganizations();
            }

            $query->whereIn('type', [
                Organization::TYPE_KAMPUS,
                Organization::TYPE_UPT,
            ]);

            if ($search = $request->get('search')) {
                $query->where(function ($builder) use ($search) {
                    $builder
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            }

            if ($type = $request->get('type')) {
                $query->where('type', $type);
            }

            $sortBy = $request->get('sort_by', 'created_at');
            $sortDir = $request->get('sort_dir', 'desc');
            $allowedSorts = ['name', 'type', 'created_at', 'updated_at'];

            if (! in_array($sortBy, $allowedSorts, true)) {
                $sortBy = 'created_at';
            }

            $query->orderBy($sortBy, $sortDir);

            $perPage = min((int) $request->get('per_page', 15), 100);

            return $this->resource(OrganizationResource::collection(
                $query->paginate($perPage)
            ));
        } catch (Throwable $e) {
            Log::error('Organization index error', ['message' => $e->getMessage()]);
            return $this->error('Gagal mengambil data organisasi.', 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/admin/organizations",
     *     summary="Register a new organization",
     *     tags={"Admin Organizations"},
     *     security={{"cookieAuth": {}}},
     *     @OA\RequestBody(
     *         @OA\JsonContent(
     *             required={"name", "type"},
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="type", type="string", example="umkm")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Created")
     * )
     */
    public function store(
        StoreOrganizationRequest $request,
        OrganizationService $service
    ): JsonResponse {
        try {
            $organization = $service->create($request->validated());

            return $this->resource(new OrganizationResource($organization), 'Organisasi berhasil dibuat.', 201);
        } catch (Throwable $e) {
            Log::error('Organization store error', ['message' => $e->getMessage()]);
            return $this->error('Gagal membuat organisasi.', 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/admin/organizations/{organization}",
     *     summary="Show organization detail",
     *     tags={"Admin Organizations"},
     *     security={{"cookieAuth": {}}},
     *     @OA\Parameter(name="organization", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Detail data")
     * )
     */
    public function show(Organization $organization): JsonResponse
    {
        $this->authorize('view', $organization);

        return $this->resource(new OrganizationResource(
            $organization->load([
                'departments',
                'users',
                'umkm',
            ])
        ));
    }

    /**
     * @OA\Put(
     *     path="/admin/organizations/{organization}",
     *     summary="Update organization info",
     *     tags={"Admin Organizations"},
     *     security={{"cookieAuth": {}}},
     *     @OA\Parameter(name="organization", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Updated")
     * )
     */
    public function update(
        UpdateOrganizationRequest $request,
        Organization $organization,
        OrganizationService $service
    ): JsonResponse {
        $this->authorize('update', $organization);

        try {
            $updated = $service->update(
                $organization,
                $request->validated()
            );

            return $this->resource(new OrganizationResource($updated), 'Data organisasi diperbarui.');
        } catch (Throwable $e) {
            Log::error('Organization update error', ['message' => $e->getMessage()]);
            return $this->error('Gagal memperbarui organisasi.', 500);
        }
    }

    /**
     * @OA\Delete(
     *     path="/admin/organizations/{organization}",
     *     summary="Delete organization",
     *     tags={"Admin Organizations"},
     *     security={{"cookieAuth": {}}},
     *     @OA\Parameter(name="organization", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=204, description="Deleted")
     * )
     */
    public function destroy(
        Organization $organization,
        OrganizationService $service
    ): JsonResponse {
        $this->authorize('delete', $organization);

        try {
            $service->delete($organization);
            return $this->ok(null, 'Organisasi berhasil dihapus.', 204);
        } catch (Throwable $e) {
            Log::error('Organization delete error', ['message' => $e->getMessage()]);
            return $this->error('Gagal menghapus organisasi.', 500);
        }
    }
}
