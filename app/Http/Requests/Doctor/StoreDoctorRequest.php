<?php

namespace App\Http\Requests\Doctor;

use App\Enums\BloodGroup;
use App\Enums\Gender;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDoctorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name'       => ['required', 'string', 'max:50'],
            'last_name'        => ['nullable', 'string', 'max:50'],
            'email'            => ['nullable', 'email', 'max:100', 'unique:doctors,email'],
            'personal_number'  => ['required', 'string', 'max:14'],
            'emergency_number' => ['nullable', 'string', 'max:14'],
            'bmdc'             => ['nullable', 'string', 'max:16'],
            'specialties'      => ['nullable', 'string'],
            'designation'      => ['nullable', 'string'],
            'date_of_birth'    => ['nullable', 'date'],
            'gender'           => ['required', Rule::enum(Gender::class)],
            'blood_group'      => ['nullable', Rule::enum(BloodGroup::class)],
            'address'          => ['nullable', 'string'],
            'is_system_user'   => ['boolean'],
        ];
    }
}
