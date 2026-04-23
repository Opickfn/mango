<?php

namespace App\Http\Resources\Umkm\Strategy;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecommendationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'assessment_result_id' => $this->assessment_result_id,
            'category' => $this->category,
            'content' => $this->content,
            'priority' => $this->priority,
        ];
    }
}


