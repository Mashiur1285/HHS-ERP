<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\InvoiceSettingsUpdateRequest;
use App\Models\InvoiceSettings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceSettingsController extends Controller
{
    public function edit(): Response
    {
        $settings = InvoiceSettings::current();

        return Inertia::render('settings/invoice', [
            'settings' => $this->transform($settings),
        ]);
    }

    public function update(InvoiceSettingsUpdateRequest $request): RedirectResponse
    {
        $settings = InvoiceSettings::current();
        $data = $request->safe()->except([
            'business_logo', 'watermark_logo', 'remove_business_logo', 'remove_watermark_logo',
        ]);

        // Booleans that may be absent from the payload default to false.
        foreach (['show_header', 'show_footer', 'show_watermark', 'show_qr', 'show_test_room_number_on_bill'] as $flag) {
            $data[$flag] = (bool) $request->boolean($flag);
        }

        // Normalise field arrays (FormData sends booleans as "0"/"1" strings).
        foreach (['header_fields', 'footer_fields', 'table_columns'] as $listKey) {
            if (isset($data[$listKey]) && is_array($data[$listKey])) {
                $data[$listKey] = array_values(array_map(function ($field) {
                    $field['enabled'] = filter_var($field['enabled'] ?? false, FILTER_VALIDATE_BOOLEAN);
                    if (array_key_exists('column', $field)) {
                        $field['column'] = (int) $field['column'];
                    }
                    return $field;
                }, $data[$listKey]));
            }
        }

        // Business logo upload / removal.
        if ($request->hasFile('business_logo')) {
            $this->deleteFile($settings->business_logo);
            $data['business_logo'] = $request->file('business_logo')->store('invoice-settings', 'public');
        } elseif ($request->boolean('remove_business_logo')) {
            $this->deleteFile($settings->business_logo);
            $data['business_logo'] = null;
        }

        // Watermark logo upload / removal.
        if ($request->hasFile('watermark_logo')) {
            $this->deleteFile($settings->watermark_logo);
            $data['watermark_logo'] = $request->file('watermark_logo')->store('invoice-settings', 'public');
        } elseif ($request->boolean('remove_watermark_logo')) {
            $this->deleteFile($settings->watermark_logo);
            $data['watermark_logo'] = null;
        }

        $settings->update($data);

        return back()->with('success', 'Invoice settings updated successfully.');
    }

    private function deleteFile(?string $path): void
    {
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function transform(InvoiceSettings $settings): array
    {
        return [
            'business_name'          => $settings->business_name,
            'address'                => $settings->address,
            'phone'                  => $settings->phone,
            'email'                  => $settings->email,
            'website'                => $settings->website,
            'business_logo'          => $settings->business_logo,
            'business_logo_url'      => $settings->business_logo ? asset('storage/'.$settings->business_logo) : null,
            'show_header'            => $settings->show_header,
            'header_text'            => $settings->header_text,
            'header_text_alignment'  => $settings->header_text_alignment,
            'show_footer'            => $settings->show_footer,
            'footer_text'            => $settings->footer_text,
            'footer_text_alignment'  => $settings->footer_text_alignment,
            'show_watermark'         => $settings->show_watermark,
            'watermark_type'         => $settings->watermark_type,
            'watermark_logo'         => $settings->watermark_logo,
            'watermark_logo_url'     => $settings->watermark_logo ? asset('storage/'.$settings->watermark_logo) : null,
            'watermark_orientation'  => $settings->watermark_orientation,
            'show_qr'                => $settings->show_qr,
            'invoice_print_top_margin' => (float) $settings->invoice_print_top_margin,
            'fields_columns'         => $settings->fields_columns,
            'show_test_room_number_on_bill' => $settings->show_test_room_number_on_bill,
            'doctor_commission_on'   => $settings->doctor_commission_on,
            'agent_commission_on'    => $settings->agent_commission_on,
            'header_fields'          => $settings->header_fields ?? InvoiceSettings::defaultHeaderFields(),
            'footer_fields'          => $settings->footer_fields ?? InvoiceSettings::defaultFooterFields(),
            'table_columns'          => $settings->table_columns ?? InvoiceSettings::defaultTableColumns(),
        ];
    }
}
