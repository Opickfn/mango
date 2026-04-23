<?php

namespace App\Http\Resources\Umkm\Strategy;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BusinessProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'umkm_id' => $this->umkm_id,
            'vision' => $this->vision,
            'mission' => $this->mission,
            'core_products' => $this->core_products,
            'target_market' => $this->target_market,
            'annual_revenue' => $this->annual_revenue,
        ];
    }
}


