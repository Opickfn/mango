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
        return [
            'id' => $this->id,

            'name' => $this->name,
            'type' => $this->type,
            'entity_type' => 'institution',

            'email' => $this->email,
            'phone' => $this->phone,

            'address' => $this->address,
            'city' => $this->city,
            'province' => $this->province,
            'postal_code' => $this->postal_code,

            'is_active' => (bool) $this->is_active,
            'departments' => $this->whenLoaded('departments'),

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}

