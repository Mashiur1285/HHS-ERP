<?php

namespace App\Models;

use App\Enums\BloodGroup;
use App\Enums\Gender;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Patient extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'guardian_id',
        'created_by',
        'uhid',
        'salutation',
        'first_name',
        'last_name',
        'email',
        'phone',
        'emergency_number',
        'gender',
        'date_of_birth',
        'blood_group',
        'nid_number',
        'relation',
        'patient_category',
        'address',
        'is_active',
    ];

    protected $casts = [
        'gender'        => Gender::class,
        'blood_group'   => BloodGroup::class,
        'date_of_birth' => 'date',
        'is_active'     => 'boolean',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function guardian()
    {
        return $this->belongsTo(Patient::class, 'guardian_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /*
    |--------------------------------------------------------------------------
    | Accessor
    |--------------------------------------------------------------------------
    */

    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }
}