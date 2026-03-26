<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Price extends Model
{
    protected $fillable = [
        'itemable_id',
        'itemable_type',
        'amount',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    /**
     * Get the parent itemable model (Test or TestAdditionalItem).
     */
    public function itemable()
    {
        return $this->morphTo();
    }
}
