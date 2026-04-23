<?php

namespace App\Http\Resources\Auth;

use App\Http\Resources\Admin\Master\UmkmResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public static $wrap = null;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'name' => $this->name,
            'email' => $this->email,
            'email_verified_at' => $this->email_verified_at?->toISOString(),

            'phone' => $this->phone,
            'avatar_url' => $this->getFirstMediaUrl('avatars', 'thumb') ?: null,
            'avatar_original' => $this->getFirstMediaUrl('avatars') ?: null,

            'is_active' => (bool) $this->is_active,

            'roles' => $this->whenLoaded(
                'roles',
                fn () => $this->roles
                    ->pluck('name')
                    ->values()
            ),

            'institutions' => $this->whenLoaded(
                'institutions',
                fn () => $this->institutions
                    ->map(fn ($organization) => [
                        'id' => $organization->id,
                        'name' => $organization->name,
                        'type' => $organization->type,
                    ])
                    ->values()
            ),

            'organizations' => $this->whenLoaded(
                'institutions',
                fn () => $this->institutions
                    ->map(fn ($organization) => [
                        'id' => $organization->id,
                        'name' => $organization->name,
                        'type' => $organization->type,
                    ])
                    ->values()
            ),

            'umkm' => $this->whenLoaded(
                'umkm',
                fn () => new UmkmResource($this->umkm)
            ),

            'umkm_organization' => $this->whenLoaded(
                'umkmOrganization',
                fn () => $this->umkmOrganization ? [
                    'id' => $this->umkmOrganization->id,
                    'name' => $this->umkmOrganization->name,
                ] : null
            ),

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
