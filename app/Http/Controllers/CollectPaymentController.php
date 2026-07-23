<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CollectPaymentController extends Controller
{
    public function edit(Invoice $invoice): Response
    {
        $invoice->load(['patient', 'payments']);

        return Inertia::render('bills/collect-payment', [
            'invoice' => [
                'id'             => $invoice->id,
                'invoice_no'     => $invoice->invoice_no,
                'bill_no'        => $invoice->bill_no,
                'net_amount'     => (float) $invoice->net_amount,
                'paid_amount'    => (float) $invoice->paid_amount,
                'due_amount'     => (float) $invoice->due_amount,
                'payment_status' => $invoice->payment_status,
                'patient'        => $invoice->patient?->full_name,
                'patient_phone'  => $invoice->patient?->phone,
                'payments'       => $invoice->payments->map(fn (Payment $p) => [
                    'id'             => $p->id,
                    'amount'         => (float) $p->amount,
                    'payment_method' => $p->payment_method,
                    'payment_date'   => optional($p->payment_date)->toIso8601String(),
                ])->values(),
            ],
        ]);
    }

    public function update(Request $request, Invoice $invoice): RedirectResponse
    {
        $validated = $request->validate([
            'amount'         => ['required', 'numeric', 'min:0.01', 'max:' . max(0.01, (float) $invoice->due_amount)],
            'payment_method' => ['nullable', 'string'],
            'note'           => ['nullable', 'string', 'max:255'],
        ]);

        DB::transaction(function () use ($invoice, $validated) {
            Payment::create([
                'invoice_id'     => $invoice->id,
                'amount'         => $validated['amount'],
                'payment_method' => $validated['payment_method'] ?? 'cash',
                'note'           => $validated['note'] ?? null,
                'payment_date'   => now(),
            ]);

            $paid = (float) $invoice->paid_amount + (float) $validated['amount'];
            $due  = max(0, (float) $invoice->net_amount - $paid);

            $invoice->update([
                'paid_amount'    => $paid,
                'due_amount'     => $due,
                'payment_status' => $due <= 0 ? 'Paid' : 'Partial',
            ]);
        });

        return redirect()
            ->route('bills.show', $invoice)
            ->with('success', 'Payment collected successfully.');
    }
}
