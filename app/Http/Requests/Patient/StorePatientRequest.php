<?php

namespace App\Http\Requests\Patient;

use App\Enums\BloodGroup;
use App\Enums\Gender;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePatientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'guardian_id'      => ['nullable', 'exists:patients,id'],
            'uhid'             => ['nullable', 'string', 'max:50', Rule::unique('patients','uhid')],
            'salutation'       => ['nullable', 'string', 'max:10'],
            'first_name'       => ['required', 'string', 'max:100'],
            'last_name'        => ['nullable', 'string', 'max:100'],
            'email'            => ['nullable', 'email', 'max:150'],
            'phone'            => ['required', 'string', 'max:20'],
            'emergency_number' => ['nullable', 'string', 'max:20'],
            'gender'           => ['required', Rule::enum(Gender::class)],
            'date_of_birth'    => ['nullable', 'date'],
            'blood_group'      => ['nullable', Rule::enum(BloodGroup::class)],
            'nid_number'       => ['nullable', 'string', 'max:20'],
            'relation'         => ['nullable', 'string', 'max:50'],
            'patient_category' => ['nullable', 'string', 'max:20'],
            'address'          => ['nullable', 'string'],
            'is_active'        => ['boolean'],
        ];
    }
}