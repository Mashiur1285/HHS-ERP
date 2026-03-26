<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvoiceItem extends Model
{
    protected $fillable = [
        'invoice_id',
        'itemable_id',
        'itemable_type',
        'item_name_snapshot',
        'price_snapshot',
        'quantity',
        'total',
    ];

    protected $casts = [
        'price_snapshot' => 'decimal:2',
        'total'          => 'decimal:2',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    /**
     * Polymorphic: itemable is either a Test or a TestAdditionalItem.
     */
    public function itemable()
    {
        return $this->morphTo();
    }
}
