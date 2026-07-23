<?php

namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;

class InvoiceSettingsUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'business_name'          => ['nullable', 'string', 'max:255'],
            'address'                => ['nullable', 'string', 'max:500'],
            'phone'                  => ['nullable', 'string', 'max:255'],
            'email'                  => ['nullable', 'string', 'max:255'],
            'website'                => ['nullable', 'string', 'max:255'],
            'business_logo'          => ['nullable', 'image', 'max:2048'],
            'remove_business_logo'   => ['nullable', 'boolean'],
            'show_header'            => ['boolean'],
            'header_text'            => ['nullable', 'string', 'max:2000'],
            'header_text_alignment'  => ['nullable', 'in:left,center,right'],

            'show_footer'            => ['boolean'],
            'footer_text'            => ['nullable', 'string', 'max:2000'],
            'footer_text_alignment'  => ['nullable', 'in:left,center,right'],

            'show_watermark'         => ['boolean'],
            'watermark_type'         => ['nullable', 'in:payment_status,logo'],
            'watermark_logo'         => ['nullable', 'image', 'max:2048'],
            'remove_watermark_logo'  => ['nullable', 'boolean'],
            'watermark_orientation'  => ['nullable', 'in:horizontal,diagonal,obtuse'],

            'show_qr'                => ['boolean'],
            'invoice_print_top_margin' => ['nullable', 'numeric', 'min:0', 'max:5'],

            'fields_columns'         => ['nullable', 'in:1,2'],
            'show_test_room_number_on_bill' => ['boolean'],

            'doctor_commission_on'   => ['nullable', 'in:before,after'],
            'agent_commission_on'    => ['nullable', 'in:before,after'],

            'header_fields'          => ['nullable', 'array'],
            'header_fields.*.key'     => ['required', 'string'],
            'header_fields.*.label'   => ['required', 'string', 'max:60'],
            'header_fields.*.enabled' => ['boolean'],
            'header_fields.*.column'  => ['nullable', 'integer', 'in:0,1,2'],

            'footer_fields'          => ['nullable', 'array'],
            'footer_fields.*.key'     => ['required', 'string'],
            'footer_fields.*.label'   => ['required', 'string', 'max:60'],
            'footer_fields.*.enabled' => ['boolean'],

            'table_columns'          => ['nullable', 'array'],
            'table_columns.*.key'     => ['required', 'string'],
            'table_columns.*.label'   => ['required', 'string', 'max:60'],
            'table_columns.*.enabled' => ['boolean'],
        ];
    }
}
