<?php

namespace App\Services;

use App\Models\Agent;
use App\Models\Doctor;
use App\Models\Invoice;
use App\Models\Test;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class CommissionReportService
{
    /**
     * Doctor commission report grouped by doctor within a date range.
     *
     * @return array<int, array<string, mixed>>
     */
    public function doctorReport(Carbon $start, Carbon $end, ?string $search = null): array
    {
        // Invoice-level commission totals. "test_amount" is the base commission was
        // actually charged on (captured per-invoice at creation), so it reconciles:
        // test_amount × percentage === commission_total.
        $commission = Invoice::query()
            ->whereNotNull('doctor_id')
            ->whereBetween('invoice_date', [$start->toDateString(), $end->toDateString()])
            ->groupBy('doctor_id')
            ->selectRaw('doctor_id,
                COUNT(*) as invoice_count,
                COALESCE(SUM(doctor_commission_amount), 0) as commission_total,
                COALESCE(SUM(doctor_commission_base), 0) as test_amount,
                COALESCE(AVG(NULLIF(doctor_commission_percentage, 0)), 0) as avg_percentage')
            ->get()
            ->keyBy('doctor_id');

        // Count of referred test line items per doctor.
        $testCounts = DB::table('invoice_items')
            ->join('invoices', 'invoice_items.invoice_id', '=', 'invoices.id')
            ->where('invoice_items.itemable_type', Test::class)
            ->whereNotNull('invoices.doctor_id')
            ->whereBetween('invoices.invoice_date', [$start->toDateString(), $end->toDateString()])
            ->groupBy('invoices.doctor_id')
            ->selectRaw('invoices.doctor_id, COUNT(invoice_items.id) as no_of_tests')
            ->pluck('no_of_tests', 'doctor_id');

        return Doctor::query()
            ->whereIn('id', $commission->keys())
            ->when($search, fn ($q) => $q->where(function ($sub) use ($search) {
                $sub->where('first_name', 'ilike', "%{$search}%")
                    ->orWhere('last_name', 'ilike', "%{$search}%");
            }))
            ->get()
            ->map(function (Doctor $doctor) use ($commission, $testCounts) {
                $c = $commission->get($doctor->id);

                return [
                    'id'                => $doctor->id,
                    'name'              => $doctor->full_name,
                    'specialties'       => $doctor->specialties,
                    'percentage'        => (float) ($c->avg_percentage ?? $doctor->commission_percentage),
                    'no_of_tests'       => (int) ($testCounts[$doctor->id] ?? 0),
                    'test_amount'       => (float) ($c->test_amount ?? 0),
                    'invoice_count'     => (int) ($c->invoice_count ?? 0),
                    'commission_total'  => (float) ($c->commission_total ?? 0),
                ];
            })
            ->sortByDesc('commission_total')
            ->values()
            ->all();
    }

    /**
     * Per-test reference breakdown for a single doctor.
     *
     * @return array<string, mixed>
     */
    public function singleDoctor(Doctor $doctor, Carbon $start, Carbon $end, ?string $search = null): array
    {
        $rows = DB::table('invoice_items')
            ->join('invoices', 'invoice_items.invoice_id', '=', 'invoices.id')
            ->join('tests', 'invoice_items.itemable_id', '=', 'tests.id')
            ->where('invoice_items.itemable_type', Test::class)
            ->where('invoices.doctor_id', $doctor->id)
            ->whereBetween('invoices.invoice_date', [$start->toDateString(), $end->toDateString()])
            ->when($search, fn ($q) => $q->where('tests.name', 'ilike', "%{$search}%"))
            ->groupBy('tests.id', 'tests.name', 'tests.short_name')
            ->selectRaw('tests.name, tests.short_name,
                COUNT(invoice_items.id) as ref_count,
                COALESCE(SUM(invoice_items.total), 0) as test_amount,
                COALESCE(SUM(invoice_items.total * invoices.doctor_commission_percentage / 100), 0) as commission_total')
            ->orderByDesc('ref_count')
            ->get();

        return [
            'references'        => $rows,
            'total_refer'       => (int) $rows->sum('ref_count'),
            'total_commission'  => (float) $rows->sum('commission_total'),
        ];
    }

    /**
     * Agent commission report grouped by agent within a date range.
     *
     * @return array<int, array<string, mixed>>
     */
    public function agentReport(Carbon $start, Carbon $end, ?string $search = null): array
    {
        // "Invoice total" is the amount commission was actually charged on
        // (captured per-invoice at creation), so the report always reconciles:
        // percentage × invoice_total === commission_total.
        $commission = Invoice::query()
            ->whereNotNull('agent_id')
            ->whereBetween('invoice_date', [$start->toDateString(), $end->toDateString()])
            ->groupBy('agent_id')
            ->selectRaw('agent_id,
                COUNT(*) as invoice_count,
                COALESCE(SUM(agent_commission_base), 0) as invoice_total,
                COALESCE(SUM(agent_commission_amount), 0) as commission_total')
            ->get()
            ->keyBy('agent_id');

        return Agent::query()
            ->whereIn('id', $commission->keys())
            ->when($search, fn ($q) => $q->where('name', 'ilike', "%{$search}%"))
            ->get()
            ->map(function (Agent $agent) use ($commission) {
                $c = $commission->get($agent->id);

                return [
                    'id'               => $agent->id,
                    'name'             => $agent->name,
                    'agent_id'         => $agent->agent_id,
                    'percentage'       => (float) $agent->commission_rate,
                    'invoice_count'    => (int) ($c->invoice_count ?? 0),
                    'invoice_total'    => (float) ($c->invoice_total ?? 0),
                    'commission_total' => (float) ($c->commission_total ?? 0),
                ];
            })
            ->sortByDesc('commission_total')
            ->values()
            ->all();
    }
}
