<?php

namespace App\Http\Requests\Agent;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAgentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $agentId = $this->route('agent')->id ?? null;

        return [
            'name'           => ['required', 'string', 'min:2', 'max:100'],
            'agent_id'       => ['required', 'string', 'max:30', Rule::unique('agents', 'agent_id')->ignore($agentId)],
            'contact_number' => ['nullable', 'string', 'max:14', Rule::unique('agents', 'contact_number')->ignore($agentId)],
            'address'        => ['nullable', 'string', 'max:255'],
            'commission_rate' => ['required', 'numeric', 'min:0', 'max:100'],
            'status'         => ['boolean'],
        ];
    }
}
