<?php

namespace App\Http\Controllers\Api\V1\Umkm\Machine;

use App\Http\Controllers\Controller;
use App\Http\Resources\Umkm\Machine\MachineResource;
use App\Models\Machine\Machine;
use App\Models\Master\Organization;
use App\Models\Umkm\Umkm;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Log;
use Throwable;

class MachineController extends Controller
{
    public function index(Request $request): JsonResponse|AnonymousResourceCollection
    {
        try {
            $query = Machine::query()
                ->with('owner');

            if ($type = $request->get('type')) {
                $query->where('type', $type);
            }

            if ($status = $request->get('status')) {
                $query->where('status', $status);
            }

            $sortBy = $request->get('sort_by', 'created_at');
            $sortDir = $request->get('sort_dir', 'desc');
            $query->orderBy($sortBy, $sortDir);

            $perPage = min((int) $request->get('per_page', 15), 100);

            return MachineResource::collection($query->paginate($perPage));
        } catch (Throwable $e) {
            Log::error('Machine index error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Failed to fetch machines',
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'unique:machines,code'],
            'type' => ['required', 'string'],
            'brand' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'location' => ['nullable', 'string'],
            'hourly_rate' => ['required', 'numeric', 'min:0'],
            'owner_id' => ['required', 'integer'],
            'owner_type' => [
                'required',
                'in:umkm,institution,organization',
            ],
        ]);

        try {
            $ownerType = match ($validated['owner_type']) {
                'umkm' => \App\Models\Umkm\Umkm::class,
                'institution' => \App\Models\Master\Institution::class,
                'organization' => \App\Models\Master\Organization::class,
                default => \App\Models\Master\Organization::class,
            };

            $machine = Machine::create([
                'name' => $validated['name'],
                'slug' => \Illuminate\Support\Str::slug($validated['name'] . '-' . $validated['code']),
                'code' => $validated['code'],
                'type' => $validated['type'],
                'brand' => $validated['brand'] ?? null,
                'description' => $validated['description'] ?? null,
                'location' => $validated['location'] ?? null,
                'hourly_rate' => $validated['hourly_rate'],
                'owner_id' => $validated['owner_id'],
                'owner_type' => $ownerType,
                'status' => 'available',
            ]);

            return response()->json([
                'message' => 'Machine registered successfully',
                'data' => new MachineResource($machine),
            ], 201);
        } catch (Throwable $e) {
            Log::error('Machine store error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Failed to create machine',
            ], 500);
        }
    }

    public function show(Machine $machine): JsonResponse|MachineResource
    {
        try {
            return new MachineResource($machine->load([
                'owner',
                'reservations.requesterUmkm',
            ]));
        } catch (Throwable $e) {
            Log::error('Machine show error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Failed to fetch machine',
            ], 500);
        }
    }
}
