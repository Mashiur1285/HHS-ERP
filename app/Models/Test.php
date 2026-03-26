<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Test extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'short_name',
        'category',
        'description',
        'sample_type',
        'report_delivery_time',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    /**
     * A Test has one Price (polymorphic).
     */
    public function price()
    {
        return $this->morphOne(Price::class, 'itemable');
    }

    /**
     * A Test can appear on many InvoiceItems (polymorphic).
     */
    public function invoiceItems()
    {
        return $this->morphMany(InvoiceItem::class, 'itemable');
    }

    /*
    |--------------------------------------------------------------------------
    | Accessor
    |--------------------------------------------------------------------------
    */

    public function getPriceAmountAttribute(): float
    {
        return $this->price?->amount ?? 0;
    }
}
