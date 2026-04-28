<?php

namespace App\Http\Resources\Admin\Master;

use Illuminate\Http\Resources\Json\JsonResource;

class OrganizationResource extends JsonResource
{
    /**
     * The "data" wrapper that should be applied.
     *
     * @var string|null
     */
    public static $wrap = null;

    public function toArray($request)
    {
        $isInstitution = $this->resource instanceof \App\Models\Master\Institution;
        
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'entity_type' => $isInstitution ? 'institution' : 'organization',
            'display_type' => $isInstitution ? 'Kampus / Institusi' : 'Organisasi UMKM / Paguyuban',

            'email' => $this->email,
            'phone' => $this->phone,

            'address' => $this->address,
            'is_active' => (bool) $this->is_active,
            
            'departments' => $this->whenLoaded('departments'),
            'members' => $this->when($isInstitution, function() {
                // If we want to show UMKM members for institution
                return $this->whenLoaded('umkms');
            }, function() {
                // For Organization, maybe it also has umkms
                return $this->whenLoaded('umkms');
            }),

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
