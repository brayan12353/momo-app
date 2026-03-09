<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    /**
     * Mass assignable fields
     */
    protected $fillable = [
        'sender_id',
        'receiver_id',
        'operator_id',
        'transaction_type',
        'amount',
        'commission',
        'customer_phone',
        'agent_phone',
        'photo',
        'transaction_time',
        'status',
    ];

    /**
     * Prevent updates (immutability)
     */
    protected static function booted()
    {
        static::updating(function () {
            abort(403, 'Transactions cannot be modified once created.');
        });
    }

    /**
     * Relationships
     */

    // Agent (sender)
    public function agent()
{
    return $this->belongsTo(User::class, 'sender_id');
}

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    // Receiver (for transfers)
    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    // Operator (MTN, Orange, etc.)
    public function operator()
    {
        return $this->belongsTo(Operator::class);
    }
}
