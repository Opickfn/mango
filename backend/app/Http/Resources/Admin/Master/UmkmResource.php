<?php

namespace App\Http\Resources\Admin\Master;

use Illuminate\Http\Resources\Json\JsonResource;

class UmkmResource extends JsonResource
{
    /**
     * The "data" wrapper that should be applied.
     *
     * @var string|null
     */
    public static $wrap = null;

    public function toArray($request)
    {
        return [
            'id' => $this->id,

            'name' => $this->name,
            'owner_name' => $this->owner_name,
            'logo_url' => $this->getFirstMediaUrl('logos', 'thumb') ?: null,
            'logo_original' => $this->getFirstMediaUrl('logos') ?: null,
            'sector' => $this->sector,
            'nib' => $this->nib,
            'established_year' => $this->established_year,
            'employee_count' => $this->employee_count,

            'is_active' => (bool) $this->is_active,
            'managed_by_institution_id' => $this->managed_by_institution_id,
            'managed_by_organization_id' => $this->managed_by_institution_id,
            'organization_id' => $this->managed_by_institution_id,
            'umkm_organization_id' => $this->umkm_organization_id,
            'user_id' => $this->user_id,

            'managed_by_institution' => $this->whenLoaded('managingOrganization', function () {
                return [
                    'id' => $this->managingOrganization->id,
                    'name' => $this->managingOrganization->name,
                    'type' => $this->managingOrganization->type,
                ];
            }),

            'managed_by_organization' => $this->whenLoaded('managingOrganization', function () {
                return [
                    'id' => $this->managingOrganization->id,
                    'name' => $this->managingOrganization->name,
                    'type' => $this->managingOrganization->type,
                ];
            }),

            'organization' => $this->whenLoaded('umkmOrganization', function () {
                return [
                    'id' => $this->umkmOrganization->id,
                    'name' => $this->umkmOrganization->name,
                    'type' => 'umkm_organization',
                ];
            }),

            'umkm_organization' => $this->whenLoaded('umkmOrganization', function () {
                return [
                    'id' => $this->umkmOrganization->id,
                    'name' => $this->umkmOrganization->name,
                    'email' => $this->umkmOrganization->email,
                    'phone' => $this->umkmOrganization->phone,
                    'upt_id' => $this->umkmOrganization->upt_id,
                    'upt' => $this->umkmOrganization->relationLoaded('upt')
                        ? [
                            'id' => $this->umkmOrganization->upt?->id,
                            'name' => $this->umkmOrganization->upt?->name,
                            'type' => $this->umkmOrganization->upt?->type,
                        ]
                        : null,
                ];
            }),

            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                ];
            }),

            'products_count' => $this->whenCounted('products'),

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
