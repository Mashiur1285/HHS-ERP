<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ResolvesDateRange;
use App\Models\Agent;
use App\Models\Doctor;
use App\Models\Invoice;
use App\Models\Patient;
use App\Models\Test;
use App\Models\TestAdditionalItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BillController extends Controller
{
    use ResolvesDateRange;

    /**
     * Bill listing with filters and summary totals.
     */
    public function index(Request $request): Response
    {
        [$start, $end] = $this->resolveDateRange($request, now()->startOfMonth(), now());
        $status = $request->input('status');
        $search = $request->input('search');

        $query = Invoice::query()
            ->with(['patient', 'doctor', 'agent'])
            ->whereBetween('invoice_date', [$start->toDateString(), $end->toDateString()])
            ->when($status, fn ($q) => $q->where('payment_status', $status))
            ->when($search, function ($q) use ($search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('invoice_no', 'ilike', "%{$search}%")
                        ->orWhere('bill_no', 'ilike', "%{$search}%")
                        ->orWhereHas('patient', function ($p) use ($search) {
                            $p->where('first_name', 'ilike', "%{$search}%")
                                ->orWhere('last_name', 'ilike', "%{$search}%")
                                ->orWhere('phone', 'ilike', "%{$search}%");
                        });
                });
            });

        // Summary over the filtered set (before pagination).
        $summary = [
            'total_bills' => (clone $query)->count(),
            'gross'       => (float) (clone $query)->sum('net_amount'),
            'collected'   => (float) (clone $query)->sum('paid_amount'),
            'due'         => (float) (clone $query)->sum('due_amount'),
        ];

        $bills = $query->latest()->paginate(15)->withQueryString()
            ->through(fn (Invoice $invoice) => [
                'id'             => $invoice->id,
                'invoice_no'     => $invoice->invoice_no,
                'bill_no'        => $invoice->bill_no,
                'invoice_date'   => optional($invoice->invoice_date)->format('Y-m-d'),
                'invoice_time'   => $invoice->invoice_time,
                'patient'        => $invoice->patient ? $invoice->patient->full_name : '—',
                'patient_phone'  => $invoice->patient?->phone,
                'doctor'         => $invoice->doctor?->full_name,
                'agent'          => $invoice->agent?->name,
                'total_items'    => $invoice->total_items,
                'net_amount'     => (float) $invoice->net_amount,
                'paid_amount'    => (float) $invoice->paid_amount,
                'due_amount'     => (float) $invoice->due_amount,
                'payment_status' => $invoice->payment_status,
            ]);

        return Inertia::render('bills/index', [
            'bills'   => $bills,
            'summary' => $summary,
            'filters' => [
                'start_date' => $start->toDateString(),
                'end_date'   => $end->toDateString(),
                'status'     => $status,
                'search'     => $search,
            ],
        ]);
    }

    /**
     * The billing desk — register a patient and generate a bill.
     */
    public function create(): Response
    {
        $settings = \App\Models\InvoiceSettings::current();

        return Inertia::render('bills/create', [
            'commissionSettings' => [
                'doctor_commission_on' => $settings->doctor_commission_on,
                'agent_commission_on'  => $settings->agent_commission_on,
            ],
            'patients' => Patient::query()
                ->latest()
                ->get([
                    'id',
                    'first_name',
                    'last_name',
                    'phone',
                    'gender',
                    'address',
                    'patient_category',
                ]),
            'doctors' => Doctor::query()
                ->where('is_active', true)
                ->latest()
                ->get([
                    'id',
                    'first_name',
                    'last_name',
                    'personal_number',
                    'designation',
                    'specialties',
                    'commission_percentage',
                ]),
            'agents' => Agent::query()
                ->where('status', true)
                ->latest()
                ->get(['id', 'name', 'agent_id', 'commission_rate']),
            'tests' => Test::query()
                ->with('price')
                ->where('is_active', true)
                ->orderBy('category')
                ->orderBy('name')
                ->get()
                ->map(fn (Test $test) => [
                    'id' => $test->id,
                    'name' => $test->name,
                    'category' => $test->category,
                    'short_name' => $test->short_name,
                    'price' => (float) $test->price_amount,
                    'item_type' => 'test',
                ]),
            'additionalItems' => TestAdditionalItem::query()
                ->with('price')
                ->where('is_active', true)
                ->orderBy('name')
                ->get()
                ->map(fn (TestAdditionalItem $item) => [
                    'id' => $item->id,
                    'name' => $item->name,
                    'category' => 'Additional Item',
                    'short_name' => null,
                    'price' => (float) $item->price_amount,
                    'item_type' => 'additional_item',
                ]),
        ]);
    }
}
