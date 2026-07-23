<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvoiceSettings extends Model
{
    protected $table = 'invoice_settings';

    protected $guarded = [];

    protected $casts = [
        'show_header'                   => 'boolean',
        'show_footer'                   => 'boolean',
        'show_watermark'                => 'boolean',
        'show_qr'                       => 'boolean',
        'show_test_room_number_on_bill' => 'boolean',
        'invoice_print_top_margin'      => 'decimal:2',
        'header_fields'                 => 'array',
        'footer_fields'                 => 'array',
        'table_columns'                 => 'array',
    ];

    /**
     * The single settings row, created with sensible defaults if missing.
     */
    public static function current(): self
    {
        return static::query()->firstOrCreate([], static::defaults());
    }

    /**
     * Default configuration (mirrors the reference DMS invoice settings).
     *
     * @return array<string, mixed>
     */
    public static function defaults(): array
    {
        return [
            'business_name'          => config('app.name'),
            'address'                => 'House 00, Road 00, Dhaka, Bangladesh',
            'phone'                  => '+880 1700-000000',
            'email'                  => 'info@hospital.test',
            'website'                => null,
            'show_header'            => true,
            'header_text'            => null,
            'header_text_alignment'  => 'center',
            'show_footer'            => false,
            'footer_text'            => 'Thank you for choosing us. Get well soon!',
            'footer_text_alignment'  => 'center',
            'show_watermark'         => true,
            'watermark_type'         => 'payment_status',
            'watermark_orientation'  => 'diagonal',
            'show_qr'                => false,
            'invoice_print_top_margin' => 0,
            'fields_columns'         => '2',
            'show_test_room_number_on_bill' => false,
            'doctor_commission_on'   => 'before',
            'agent_commission_on'    => 'after',
            'header_fields'          => static::defaultHeaderFields(),
            'footer_fields'          => static::defaultFooterFields(),
            'table_columns'          => static::defaultTableColumns(),
        ];
    }

    /** @return array<int, array<string, mixed>> */
    public static function defaultHeaderFields(): array
    {
        return [
            ['key' => 'patient_id',     'label' => 'Patient ID',   'enabled' => true, 'column' => 1],
            ['key' => 'patient_name',   'label' => 'Patient Name', 'enabled' => true, 'column' => 1],
            ['key' => 'sex',            'label' => 'Sex',          'enabled' => true, 'column' => 1],
            ['key' => 'age',            'label' => 'Age',          'enabled' => true, 'column' => 1],
            ['key' => 'bill_no',        'label' => 'Bill No',      'enabled' => true, 'column' => 2],
            ['key' => 'bill_date_time', 'label' => 'Bill Date',    'enabled' => true, 'column' => 2],
            ['key' => 'contact_no',     'label' => 'Contact No',   'enabled' => true, 'column' => 2],
            ['key' => 'patient_type',   'label' => 'Bill Type',    'enabled' => true, 'column' => 2],
            ['key' => 'method',         'label' => 'Method',       'enabled' => true, 'column' => 2],
            ['key' => 'refer_by',       'label' => 'Refer By',     'enabled' => true, 'column' => 0], // full width
        ];
    }

    /** @return array<int, array<string, mixed>> */
    public static function defaultFooterFields(): array
    {
        return [
            ['key' => 'sub_total', 'label' => 'Sub Total', 'enabled' => true],
            ['key' => 'discount',  'label' => 'Discount',  'enabled' => true],
            ['key' => 'total',     'label' => 'Total',     'enabled' => true],
            ['key' => 'paid',      'label' => 'Paid',      'enabled' => true],
            ['key' => 'due',       'label' => 'Due',       'enabled' => true],
        ];
    }

    /** @return array<int, array<string, mixed>> */
    public static function defaultTableColumns(): array
    {
        return [
            ['key' => 'sl',                 'label' => 'SL',                 'enabled' => true],
            ['key' => 'service_particular', 'label' => 'Service Particular', 'enabled' => true],
            ['key' => 'amount',             'label' => 'Price',              'enabled' => true],
            ['key' => 'qty',                'label' => 'Qty',                'enabled' => true],
            ['key' => 'amount_tk',          'label' => 'Amount',             'enabled' => true],
        ];
    }
}
