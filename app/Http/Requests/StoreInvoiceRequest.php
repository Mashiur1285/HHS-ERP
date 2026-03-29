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
        'discount_type' => 'nullable|in:flat,percent',
        'discount_value' => 'nullable|numeric|min:0',
        'paid_amount' => 'nullable|numeric|min:0',
        'payment_method' => 'nullable|string',

        'tests' => 'nullable|array',
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
