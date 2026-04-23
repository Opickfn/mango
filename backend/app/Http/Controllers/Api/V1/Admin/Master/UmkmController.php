<?php
namespace App\Http\Controllers\Api\V1\Admin\Master;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\Master\UmkmResource;
use App\Models\Umkm\Umkm;
use App\Services\Admin\Master\UmkmService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class UmkmController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = $request->user();

            if ($user->hasRole('super_admin')) {
                $query = Umkm::query();
            } else {
                $organizationIds = $user->institutionOrganizations()
                    ->pluck('institutions.id');

                $query = Umkm::query()
                    ->whereIn('managed_by_institution_id', $organizationIds);
            }

            $query->with([
                'managingOrganization',
                'umkmOrganization.upt',
                'user',
                'profile',
                'products',
            ]);

            if ($search = $request->get('search')) {
                $query->where(function ($builder) use ($search) {
                    $builder
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('owner_name', 'like', "%{$search}%");
                });
            }

            if ($sector = $request->get('sector')) {
                $query->where('sector', $sector);
            }

            if (!is_null($request->get('is_active'))) {
                $query->where(
                    'is_active',
                    $request->boolean('is_active')
                );
            }

            $sortBy = $request->get('sort_by', 'created_at');
            $sortDir = $request->get('sort_dir', 'desc');

            $query->orderBy($sortBy, $sortDir);

            $perPage = min((int) $request->get('per_page', 15), 100);

            return UmkmResource::collection(
                $query->paginate($perPage)
            );
        } catch (Throwable $e) {
            Log::error('UMKM index error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Failed to fetch UMKM',
            ], 500);
        }
    }
}
