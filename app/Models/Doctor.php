<?php

namespace App\Models;

use App\Enums\BloodGroup;
use App\Enums\Gender;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Doctor extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'personal_number',
        'emergency_number',
        'bmdc',
        'specialties',
        'designation',
        'date_of_birth',
        'gender',
        'blood_group',
        'address',
        'is_system_user',
        'is_active',
    ];

    protected $casts = [
        'gender'         => Gender::class,
        'blood_group'    => BloodGroup::class,
        'date_of_birth'  => 'date',
        'is_system_user' => 'boolean',
        'is_active'      => 'boolean',
    ];

    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }
    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
}
