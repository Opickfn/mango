<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Master\UpdateOrganizationRequest;
use App\Http\Resources\Admin\Master\OrganizationResource;
use App\Models\Master\Organization;
use App\Services\Admin\Master\OrganizationService;
use Illuminate\Http\Request;
use Throwable;

class OrganizationController extends Controller
{
    public function index(Request $request)
    {
        try {
            $organizations = $request->user()
                ->institutionOrganizations()
                ->with('departments')
                ->get();

            return OrganizationResource::collection($organizations);

        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to fetch organizations',
            ], 500);
        }
    }

    public function show(Request $request, Organization $organization)
    {
        $this->authorize('view', $organization);

        return new OrganizationResource(
            $organization->load('departments')
        );
    }

    public function update(UpdateOrganizationRequest $request, Organization $organization, OrganizationService $service)
    {
        $this->authorize('update', $organization);

        try {
            $updated = $service->update($organization, $request->validated());

            return new OrganizationResource($updated);

        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to update organization',
            ], 500);
        }
    }
}

