<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'patient_id',
        'doctor_id',
        'agent_id',
        'invoice_no',
        'bill_no',
        'total_items',
        'subtotal',
        'discount_type',
        'discount_value',
        'discount_amount',
        'doctor_discount',
        'doctor_commission_percentage',
        'doctor_commission_amount',
        'doctor_commission_base',
        'agent_commission_percentage',
        'agent_commission_amount',
        'agent_commission_base',
        'net_amount',
        'paid_amount',
        'due_amount',
        'payment_status',
        'invoice_date',
        'invoice_time',
    ];

    protected $casts = [
        'subtotal'                     => 'decimal:2',
        'discount_value'               => 'decimal:2',
        'discount_amount'              => 'decimal:2',
        'doctor_discount'              => 'decimal:2',
        'doctor_commission_percentage' => 'decimal:2',
        'doctor_commission_amount'     => 'decimal:2',
        'doctor_commission_base'       => 'decimal:2',
        'agent_commission_percentage'  => 'decimal:2',
        'agent_commission_amount'      => 'decimal:2',
        'agent_commission_base'        => 'decimal:2',
        'net_amount'                   => 'decimal:2',
        'paid_amount'                  => 'decimal:2',
        'due_amount'                   => 'decimal:2',
        'invoice_date'                 => 'date',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    public function agent()
    {
        return $this->belongsTo(Agent::class);
    }

    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
