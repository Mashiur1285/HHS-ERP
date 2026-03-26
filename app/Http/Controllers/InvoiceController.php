<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Payment;
use App\Models\Test;
use App\Models\TestAdditionalItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
    public function store(Request $request)
    {
        $request->validate([
            'patient_id'                  => 'required|exists:patients,id',
            'doctor_id'                   => 'nullable|exists:doctors,id',
            'discount_type'               => 'nullable|in:flat,percent',
            'discount_value'              => 'nullable|numeric|min:0',
            'paid_amount'                 => 'nullable|numeric|min:0',
            'payment_method'              => 'nullable|string',
            'tests'                       => 'nullable|array',
            'tests.*.test_id'             => 'required_with:tests|exists:tests,id',
            'tests.*.price'               => 'required_with:tests|numeric|min:0',
            'additional_items'            => 'nullable|array',
            'additional_items.*.item_id'  => 'required_with:additional_items|exists:test_additional_items,id',
            'additional_items.*.price'    => 'required_with:additional_items|numeric|min:0',
        ]);

        DB::beginTransaction();

        try {
            // ── 1. Calculate totals ──────────────────────────────────────────

            $subtotal = 0;

            $tests = $request->tests ?? [];
            $additionalItems = $request->additional_items ?? [];

            foreach ($tests as $t) {
                $subtotal += $t['price'];
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

            // ── 2. Create Invoice ────────────────────────────────────────────

            $invoice = Invoice::create([
                'patient_id'      => $request->patient_id,
                'doctor_id'       => $request->doctor_id,
                'invoice_no'      => 'INV-' . now()->format('Ymd') . '-' . strtoupper(substr(uniqid(), -6)),
                'bill_no'         => 'BILL-' . time(),
                'total_items'     => $totalItems,
                'subtotal'        => $subtotal,
                'discount_type'   => $discountType,
                'discount_value'  => $discountValue,
                'discount_amount' => $discountAmount,
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
