<?php

namespace App\Models\Machine;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReservationApproval extends Model
{
    public function reservation(): BelongsTo
    {
        return $this->belongsTo(MachineReservation::class, 'machine_reservation_id');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approver_user_id');
    }

    protected $fillable = [
        'machine_reservation_id',
        'approver_user_id',
        'action',
        'comment',
    ];

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(MachineReservation::class, 'machine_reservation_id');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approver_user_id');
    }
}
