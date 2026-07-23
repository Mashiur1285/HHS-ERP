<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Patient;
use App\Models\Payment;
use App\Models\Test;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    /**
     * Sales/collection summary over a date range.
     *
     * @return array<string, mixed>
     */
    public function salesSummary(Carbon $start, Carbon $end): array
    {
        $base = Invoice::query()->whereBetween('invoice_date', [$start->toDateString(), $end->toDateString()]);

        return [
            'subtotal'          => (float) (clone $base)->sum('subtotal'),
            'total'             => (float) (clone $base)->sum('net_amount'),
            'paid'              => (float) (clone $base)->sum('paid_amount'),
            'due'               => (float) (clone $base)->sum('due_amount'),
            'discount'          => (float) (clone $base)->sum('discount_amount'),
            'total_bills'       => (int) (clone $base)->count(),
            'agent_commission'  => (float) (clone $base)->sum('agent_commission_amount'),
            'doctor_commission' => (float) (clone $base)->sum('doctor_commission_amount'),
        ];
    }

    /**
     * Daily paid/due activity for the sales-overview chart.
     *
     * @return array<int, array<string, mixed>>
     */
    public function salesActivity(Carbon $start, Carbon $end): array
    {
        $rows = Invoice::query()
            ->whereBetween('invoice_date', [$start->toDateString(), $end->toDateString()])
            ->selectRaw('invoice_date as date')
            ->selectRaw('COALESCE(SUM(paid_amount),0) as paid')
            ->selectRaw('COALESCE(SUM(due_amount),0) as due')
            ->selectRaw('COALESCE(SUM(net_amount),0) as total')
            ->groupBy('invoice_date')
            ->orderBy('invoice_date')
            ->get()
            ->keyBy(fn ($r) => Carbon::parse($r->date)->toDateString());

        // Build a continuous daily range so gaps show as zero.
        $series = [];
        for ($day = $start->copy()->startOfDay(); $day->lte($end); $day->addDay()) {
            $key = $day->toDateString();
            $row = $rows->get($key);
            $series[] = [
                'date'  => $day->format('d M'),
                'paid'  => (float) ($row->paid ?? 0),
                'due'   => (float) ($row->due ?? 0),
                'total' => (float) ($row->total ?? 0),
            ];
        }

        return $series;
    }

    /**
     * Top referring doctors within a range.
     *
     * @return array<int, array<string, mixed>>
     */
    public function doctorReferences(Carbon $start, Carbon $end, int $limit = 5): array
    {
        return DB::table('invoices')
            ->join('doctors', 'invoices.doctor_id', '=', 'doctors.id')
            ->whereBetween('invoices.invoice_date', [$start->toDateString(), $end->toDateString()])
            ->groupBy('doctors.id', 'doctors.first_name', 'doctors.last_name', 'doctors.specialties')
            ->selectRaw("doctors.id,
                CONCAT(doctors.first_name, ' ', COALESCE(doctors.last_name,'')) as name,
                doctors.specialties,
                COUNT(invoices.id) as total,
                COALESCE(SUM(invoices.net_amount),0) as total_amount,
                COALESCE(SUM(invoices.doctor_commission_amount),0) as commission_total")
            ->orderByDesc('total_amount')
            ->limit($limit)
            ->get()
            ->map(fn ($r) => [
                'id'               => $r->id,
                'name'             => trim($r->name),
                'specialties'      => $r->specialties,
                'total'            => (int) $r->total,
                'total_amount'     => (float) $r->total_amount,
                'commission_total' => (float) $r->commission_total,
            ])
            ->all();
    }

    /**
     * Patient counts: today's total + new, plus a 7-day trend.
     *
     * @return array<string, mixed>
     */
    public function patientSummary(): array
    {
        $todayNew = Patient::query()->whereDate('created_at', today())->count();
        $totalPatients = Patient::query()->count();

        $trend = [];
        for ($i = 6; $i >= 0; $i--) {
            $day = today()->copy()->subDays($i);
            $trend[] = [
                'date'  => $day->format('D'),
                'count' => Patient::query()->whereDate('created_at', $day)->count(),
            ];
        }

        return [
            'today_new'      => $todayNew,
            'total_patients' => $totalPatients,
            'trend'          => $trend,
        ];
    }

    /**
     * Test counts for a range.
     *
     * @return array<string, mixed>
     */
    public function testsSummary(Carbon $start, Carbon $end): array
    {
        $count = DB::table('invoice_items')
            ->join('invoices', 'invoice_items.invoice_id', '=', 'invoices.id')
            ->where('invoice_items.itemable_type', Test::class)
            ->whereBetween('invoices.invoice_date', [$start->toDateString(), $end->toDateString()])
            ->sum('invoice_items.quantity');

        return [
            'total_tests' => (int) $count,
        ];
    }

    /**
     * Most recent bills for the dashboard table.
     *
     * @return array<int, array<string, mixed>>
     */
    public function recentBills(int $limit = 8): array
    {
        return Invoice::query()
            ->with(['patient', 'doctor'])
            ->latest()
            ->limit($limit)
            ->get()
            ->map(fn (Invoice $invoice) => [
                'id'             => $invoice->id,
                'invoice_no'     => $invoice->invoice_no,
                'patient'        => $invoice->patient?->full_name ?? '—',
                'doctor'         => $invoice->doctor?->full_name,
                'net_amount'     => (float) $invoice->net_amount,
                'paid_amount'    => (float) $invoice->paid_amount,
                'due_amount'     => (float) $invoice->due_amount,
                'payment_status' => $invoice->payment_status,
                'invoice_date'   => optional($invoice->invoice_date)->format('Y-m-d'),
            ])
            ->all();
    }
}
