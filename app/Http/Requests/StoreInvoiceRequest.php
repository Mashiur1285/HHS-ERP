<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInvoiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
    public function rules(): array
{
    return [
        'patient_id' => 'required|exists:patients,id',
        'doctor_id' => 'nullable|exists:doctors,id',
        'agent_id' => 'nullable|exists:agents,id',
        'discount_type' => 'nullable|in:flat,percent',
        'discount_value' => 'nullable|numeric|min:0',
        'doctor_discount' => 'nullable|numeric|min:0|max:100',
        'doctor_commission_percentage' => 'nullable|numeric|min:0|max:100',
        'agent_commission_percentage' => 'nullable|numeric|min:0|max:100',
        'paid_amount' => 'nullable|numeric|min:0',
        'payment_method' => 'nullable|string',

        'tests' => 'required_without:additional_items|array|min:1',
        'tests.*.test_id' => 'required_with:tests|exists:tests,id',
        'tests.*.price' => 'required_with:tests|numeric|min:0',

        'additional_items' => 'nullable|array',
        'additional_items.*.item_id' => 'required_with:additional_items|exists:test_additional_items,id',
        'additional_items.*.price' => 'required_with:additional_items|numeric|min:0',
    ];
}

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
   
}
