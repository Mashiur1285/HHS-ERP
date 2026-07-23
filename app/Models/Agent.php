<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Agent extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'contact_number',
        'agent_id',
        'address',
        'status',
        'commission_rate',
    ];

    protected $casts = [
        'status'          => 'boolean',
        'commission_rate' => 'decimal:2',
    ];

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
}
