<?php

namespace App\Http\Requests\Agent;

use Illuminate\Foundation\Http\FormRequest;

class StoreAgentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'           => ['required', 'string', 'min:2', 'max:100'],
            'agent_id'       => ['required', 'string', 'max:30', 'unique:agents,agent_id'],
            'contact_number' => ['nullable', 'string', 'max:14', 'unique:agents,contact_number'],
            'address'        => ['nullable', 'string', 'max:255'],
            'commission_rate' => ['required', 'numeric', 'min:0', 'max:100'],
            'status'         => ['boolean'],
        ];
    }
}
