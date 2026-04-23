<?php

namespace App\Models\Project;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Deliverable extends Model
{
     protected $fillable = [
        'iteration_id',
        'action_plan_id',
        'title',
        'description',
        'file_path',
        'url',
    ];

    public function iteration(): BelongsTo
    {
        return $this->belongsTo(Iteration::class);
    }

    public function actionPlan(): BelongsTo
    {
        return $this->belongsTo(ActionPlan::class);
    }
}
