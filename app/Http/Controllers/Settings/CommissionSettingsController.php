<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\InvoiceSettings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommissionSettingsController extends Controller
{
    public function edit(): Response
    {
        $settings = InvoiceSettings::current();

        return Inertia::render('settings/commission', [
            'settings' => [
                'doctor_commission_on' => $settings->doctor_commission_on,
                'agent_commission_on'  => $settings->agent_commission_on,
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'doctor_commission_on' => ['required', 'in:before,after'],
            'agent_commission_on'  => ['required', 'in:before,after'],
        ]);

        InvoiceSettings::current()->update($validated);

        return back()->with('success', 'Commission settings updated successfully.');
    }
}
