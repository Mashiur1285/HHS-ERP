<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInvoiceRequest;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Payment;
use App\Models\Test;
use App\Models\TestAdditionalItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceController extends Controller
{
    /**
     * List all invoices with patient and payments.
     */
    public function index()
    {
        $invoices = Invoice::with(['patient', 'doctor', 'items', 'payments'])
            ->latest()
            ->get();

        return response()->json($invoices);
    }

    /**
     * Show a single invoice with all items and their itemable (Test/AdditionalItem).
     */
    public function show($id)
    {
        $invoice = Invoice::with([
            'patient',
            'doctor',
            'items.itemable.price',
            'payments',
        ])->findOrFail($id);

        return response()->json($invoice);
    }

    /**
     * Inertia bill detail page.
     */
    public function bill(Invoice $invoice): Response
    {
        $invoice->load([
            'patient',
            'doctor',
            'agent',
            'items',
            'payments',
        ]);

        return Inertia::render('bills/show', [
            'invoice' => $this->transformInvoice($invoice),
        ]);
    }

    /**
     * Shared invoice → array transform for the bill detail & receipt pages.
     *
     * @return array<string, mixed>
     */
    private function transformInvoice(Invoice $invoice): array
    {
        return [
            'id'              => $invoice->id,
            'invoice_no'      => $invoice->invoice_no,
            'bill_no'         => $invoice->bill_no,
            'invoice_date'    => optional($invoice->invoice_date)->format('Y-m-d'),
            'invoice_time'    => $invoice->invoice_time,
            'subtotal'        => (float) $invoice->subtotal,
            'discount_amount' => (float) $invoice->discount_amount,
            'discount_value'  => (float) $invoice->discount_value,
            'discount_type'   => $invoice->discount_type,
            'doctor_discount' => (float) $invoice->doctor_discount,
            'doctor_commission_percentage' => (float) $invoice->doctor_commission_percentage,
            'doctor_commission_amount'     => (float) $invoice->doctor_commission_amount,
            'agent_commission_percentage'  => (float) $invoice->agent_commission_percentage,
            'agent_commission_amount'      => (float) $invoice->agent_commission_amount,
            'net_amount'      => (float) $invoice->net_amount,
            'paid_amount'     => (float) $invoice->paid_amount,
            'due_amount'      => (float) $invoice->due_amount,
            'payment_status'  => $invoice->payment_status,
            'patient' => $invoice->patient ? [
                'id'               => $invoice->patient->id,
                'name'             => $invoice->patient->full_name,
                'phone'            => $invoice->patient->phone,
                'gender'           => $invoice->patient->gender?->label(),
                'address'          => $invoice->patient->address,
                'patient_category' => $invoice->patient->patient_category,
            ] : null,
            'doctor' => $invoice->doctor ? [
                'id'          => $invoice->doctor->id,
                'name'        => $invoice->doctor->full_name,
                'designation' => $invoice->doctor->designation,
                'phone'       => $invoice->doctor->personal_number,
            ] : null,
            'agent' => $invoice->agent ? [
                'id'   => $invoice->agent->id,
                'name' => $invoice->agent->name,
            ] : null,
            'items' => $invoice->items->map(fn (InvoiceItem $item) => [
                'id'       => $item->id,
                'name'     => $item->item_name_snapshot,
                'quantity' => $item->quantity,
                'price'    => (float) $item->price_snapshot,
                'total'    => (float) $item->total,
                'type'     => class_basename($item->itemable_type),
            ])->values(),
            'payments' => $invoice->payments->map(fn (Payment $payment) => [
                'id'             => $payment->id,
                'amount'         => (float) $payment->amount,
                'payment_method' => $payment->payment_method,
                'payment_date'   => optional($payment->payment_date)->toIso8601String(),
            ])->values(),
        ];
    }

    public function receipt(Invoice $invoice): Response
    {
        $invoice->load([
            'patient',
            'doctor',
            'items',
            'payments',
        ]);

        return Inertia::render('invoices/receipt', [
            'invoice' => [
                'id' => $invoice->id,
                'invoice_no' => $invoice->invoice_no,
                'bill_no' => $invoice->bill_no,
                'invoice_date' => optional($invoice->invoice_date)->format('Y-m-d'),
                'invoice_time' => $invoice->invoice_time,
                'created_at' => optional($invoice->created_at)->format('d/m/Y, h:i A'),
                'subtotal' => (float) $invoice->subtotal,
                'discount_amount' => (float) $invoice->discount_amount,
                'discount_value' => (float) $invoice->discount_value,
                'discount_type' => $invoice->discount_type,
                'net_amount' => (float) $invoice->net_amount,
                'paid_amount' => (float) $invoice->paid_amount,
                'due_amount' => (float) $invoice->due_amount,
                'payment_status' => $invoice->payment_status,
                'patient' => $invoice->patient ? [
                    'id' => $invoice->patient->id,
                    'patient_id' => $invoice->patient->uhid,
                    'name' => $invoice->patient->full_name,
                    'phone' => $invoice->patient->phone,
                    'gender' => $invoice->patient->gender?->label(),
                    'age' => $invoice->patient->date_of_birth
                        ? \Illuminate\Support\Carbon::parse($invoice->patient->date_of_birth)->age
                        : null,
                    'address' => $invoice->patient->address,
                    'patient_category' => $invoice->patient->patient_category,
                ] : null,
                'doctor' => $invoice->doctor ? [
                    'id' => $invoice->doctor->id,
                    'name' => $invoice->doctor->full_name,
                    'designation' => $invoice->doctor->designation,
                    'phone' => $invoice->doctor->personal_number,
                ] : null,
                'items' => $invoice->items->map(fn (InvoiceItem $item) => [
                    'id' => $item->id,
                    'name' => $item->item_name_snapshot,
                    'quantity' => $item->quantity,
                    'price' => (float) $item->price_snapshot,
                    'total' => (float) $item->total,
                    'type' => class_basename($item->itemable_type),
                ])->values(),
                'payments' => $invoice->payments->map(fn (Payment $payment) => [
                    'id' => $payment->id,
                    'amount' => (float) $payment->amount,
                    'payment_method' => $payment->payment_method,
                    'payment_date' => optional($payment->payment_date)->toIso8601String(),
                ])->values(),
            ],
            'settings' => $this->receiptSettings(),
            'verifyUrl' => url('/bills/'.$invoice->id),
        ]);
    }

    /**
     * Build the dynamic invoice/letterhead settings payload for the receipt.
     *
     * @return array<string, mixed>
     */
    private function receiptSettings(): array
    {
        $s = \App\Models\InvoiceSettings::current();

        return [
            'business_name'          => $s->business_name,
            'address'                => $s->address,
            'phone'                  => $s->phone,
            'email'                  => $s->email,
            'website'                => $s->website,
            'business_logo_url'      => $s->business_logo ? asset('storage/'.$s->business_logo) : null,
            'show_header'            => $s->show_header,
            'header_text'            => $s->header_text,
            'header_text_alignment'  => $s->header_text_alignment,
            'show_footer'            => $s->show_footer,
            'footer_text'            => $s->footer_text,
            'footer_text_alignment'  => $s->footer_text_alignment,
            'show_watermark'         => $s->show_watermark,
            'watermark_type'         => $s->watermark_type,
            'watermark_logo_url'     => $s->watermark_logo ? asset('storage/'.$s->watermark_logo) : null,
            'watermark_orientation'  => $s->watermark_orientation,
            'show_qr'                => $s->show_qr,
            'invoice_print_top_margin' => (float) $s->invoice_print_top_margin,
            'fields_columns'         => $s->fields_columns,
            'header_fields'          => $s->header_fields ?? \App\Models\InvoiceSettings::defaultHeaderFields(),
            'footer_fields'          => $s->footer_fields ?? \App\Models\InvoiceSettings::defaultFooterFields(),
            'table_columns'          => $s->table_columns ?? \App\Models\InvoiceSettings::defaultTableColumns(),
        ];
    }

    /**
     * Create a new invoice.
     *
     * Request body:
     * {
     *   "patient_id": 1,
     *   "doctor_id": 2,           // optional
     *   "discount_type": "flat",  // flat | percent
     *   "discount_value": 100,
     *   "paid_amount": 500,
     *   "payment_method": "cash", // optional, default cash
     *   "tests": [
     *     { "test_id": 1, "price": 500 }
     *   ],
     *   "additional_items": [     // optional
     *     { "item_id": 1, "price": 100 }
     *   ]
     * }
     */
    public function store(StoreInvoiceRequest $request)
    {
        $request->validated();

        DB::beginTransaction();

        try {
            // ── 1. Calculate totals ──────────────────────────────────────────

            $testSubtotal = 0;
            $subtotal     = 0;

            $tests = $request->tests ?? [];
            $additionalItems = $request->additional_items ?? [];

            foreach ($tests as $t) {
                $testSubtotal += $t['price'];
                $subtotal     += $t['price'];
            }
            foreach ($additionalItems as $a) {
                $subtotal += $a['price'];
            }

            $discountType  = $request->discount_type ?? 'flat';
            $discountValue = $request->discount_value ?? 0;

            if ($discountType === 'percent') {
                $discountAmount = ($subtotal * $discountValue) / 100;
            } else {
                $discountAmount = $discountValue;
            }

            $netAmount  = max(0, $subtotal - $discountAmount);
            $paidAmount = $request->paid_amount ?? 0;
            $dueAmount  = max(0, $netAmount - $paidAmount);

            $paymentStatus = 'Due';
            if ($dueAmount <= 0) {
                $paymentStatus = 'Paid';
            } elseif ($paidAmount > 0) {
                $paymentStatus = 'Partial';
            }

            $totalItems = count($tests) + count($additionalItems);

            // ── Commission ───────────────────────────────────────────────────
            // The base amount (before vs after discount) is configurable via
            // Invoice Setup. Default: doctor = before discount, agent = after (net).
            $settings = \App\Models\InvoiceSettings::current();

            // Doctor commission is earned on the TEST amount only. A "doctor
            // discount" is subtracted from the doctor's default commission rate.
            $doctorCommissionPercentage = 0;
            $doctorDiscount             = (float) ($request->doctor_discount ?? 0);

            if ($request->doctor_id) {
                $doctor = \App\Models\Doctor::find($request->doctor_id);
                $baseRate = $request->filled('doctor_commission_percentage')
                    ? (float) $request->doctor_commission_percentage
                    : (float) ($doctor?->commission_percentage ?? 0);
                $doctorCommissionPercentage = max(0, $baseRate - $doctorDiscount);
            }

            // Doctor commission base: full test amount, or the test portion of the
            // net (discount allocated proportionally to the tests) when 'after'.
            $doctorBase = $testSubtotal;
            if ($settings->doctor_commission_on === 'after' && $subtotal > 0) {
                $doctorBase = $testSubtotal * ($netAmount / $subtotal);
            }
            $doctorCommissionAmount = ($doctorBase * $doctorCommissionPercentage) / 100;

            // Agent commission is earned on the whole bill (subtotal or net).
            $agentCommissionPercentage = 0;
            if ($request->agent_id) {
                $agent = \App\Models\Agent::find($request->agent_id);
                $agentCommissionPercentage = $request->filled('agent_commission_percentage')
                    ? (float) $request->agent_commission_percentage
                    : (float) ($agent?->commission_rate ?? 0);
            }
            $agentBase = $settings->agent_commission_on === 'after' ? $netAmount : $subtotal;
            $agentCommissionAmount = ($agentBase * $agentCommissionPercentage) / 100;

            // ── 2. Create Invoice ────────────────────────────────────────────

            $invoice = Invoice::create([
                'patient_id'      => $request->patient_id,
                'doctor_id'       => $request->doctor_id,
                'agent_id'        => $request->agent_id,
                'invoice_no'      => 'INV-' . now()->format('Ymd') . '-' . strtoupper(substr(uniqid(), -6)),
                'bill_no'         => 'BILL-' . time(),
                'total_items'     => $totalItems,
                'subtotal'        => $subtotal,
                'discount_type'   => $discountType,
                'discount_value'  => $discountValue,
                'discount_amount' => $discountAmount,
                'doctor_discount' => $doctorDiscount,
                'doctor_commission_percentage' => $doctorCommissionPercentage,
                'doctor_commission_amount'     => $doctorCommissionAmount,
                'doctor_commission_base'       => $doctorBase,
                'agent_commission_percentage'  => $agentCommissionPercentage,
                'agent_commission_amount'      => $agentCommissionAmount,
                'agent_commission_base'        => $agentBase,
                'net_amount'      => $netAmount,
                'paid_amount'     => $paidAmount,
                'due_amount'      => $dueAmount,
                'payment_status'  => $paymentStatus,
                'invoice_date'    => now()->toDateString(),
                'invoice_time'    => now()->toTimeString(),
            ]);

            // ── 3. Insert InvoiceItems (morph) ────────────────────────────────

            foreach ($tests as $t) {
                $test = Test::findOrFail($t['test_id']);

                InvoiceItem::create([
                    'invoice_id'       => $invoice->id,
                    'itemable_id'      => $test->id,
                    'itemable_type'    => Test::class,
                    'item_name_snapshot' => $test->name,
                    'price_snapshot'   => $t['price'],
                    'quantity'         => 1,
                    'total'            => $t['price'],
                ]);
            }

            foreach ($additionalItems as $a) {
                $item = TestAdditionalItem::findOrFail($a['item_id']);

                InvoiceItem::create([
                    'invoice_id'       => $invoice->id,
                    'itemable_id'      => $item->id,
                    'itemable_type'    => TestAdditionalItem::class,
                    'item_name_snapshot' => $item->name,
                    'price_snapshot'   => $a['price'],
                    'quantity'         => 1,
                    'total'            => $a['price'],
                ]);
            }

            // ── 4. Record Payment (if paid) ───────────────────────────────────

            if ($paidAmount > 0) {
                Payment::create([
                    'invoice_id'     => $invoice->id,
                    'amount'         => $paidAmount,
                    'payment_method' => $request->payment_method ?? 'cash',
                    'payment_date'   => now(),
                ]);
            }

            DB::commit();

            if (! $request->expectsJson()) {
                return redirect()
                    ->route('invoices.receipt', $invoice)
                    ->with('success', 'Invoice created successfully.');
            }

            return response()->json([
                'message' => 'Invoice created successfully.',
                'invoice' => $invoice->load(['items.itemable', 'payments']),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'error'   => 'Invoice creation failed.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
