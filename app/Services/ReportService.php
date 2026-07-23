<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Test;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class ReportService
{
    /**
     * Pick a bucket granularity from the length of the range.
     */
    public function granularity(Carbon $start, Carbon $end): string
    {
        $days = $start->diffInDays($end);

        return match (true) {
            $days > 366 => 'year',
            $days > 31  => 'month',
            $days > 7   => 'week',
            default     => 'day',
        };
    }

    private function bucketLabel(string $granularity, string $bucket): string
    {
        $date = Carbon::parse($bucket);

        return match ($granularity) {
            'year'  => $date->format('Y'),
            'month' => $date->format('M Y'),
            'week'  => 'Wk ' . $date->format('d M'),
            default => $date->format('d M'),
        };
    }

    /**
     * Sales report: summary totals, per-period series, and top tests.
     *
     * @return array<string, mixed>
     */
    public function salesReport(Carbon $start, Carbon $end): array
    {
        $granularity = $this->granularity($start, $end);

        $base = Invoice::query()->whereBetween('invoice_date', [$start->toDateString(), $end->toDateString()]);

        $summary = [
            'total_sales'      => (float) (clone $base)->sum('net_amount'),
            'total_paid'       => (float) (clone $base)->sum('paid_amount'),
            'total_due'        => (float) (clone $base)->sum('due_amount'),
            'total_discount'   => (float) (clone $base)->sum('discount_amount'),
            'doctor_commission' => (float) (clone $base)->sum('doctor_commission_amount'),
            'agent_commission'  => (float) (clone $base)->sum('agent_commission_amount'),
            'total_bills'      => (int) (clone $base)->count(),
        ];
        $days = max(1, $start->diffInDays($end) + 1);
        $summary['average_sales'] = round($summary['total_sales'] / $days, 2);

        $rows = Invoice::query()
            ->whereBetween('invoice_date', [$start->toDateString(), $end->toDateString()])
            ->selectRaw("date_trunc(?, invoice_date) as bucket", [$granularity])
            ->selectRaw('COALESCE(SUM(net_amount),0) as sales_total')
            ->selectRaw('COALESCE(SUM(paid_amount),0) as paid')
            ->selectRaw('COALESCE(SUM(due_amount),0) as due')
            ->selectRaw('COALESCE(SUM(discount_amount),0) as discount')
            ->selectRaw('COALESCE(SUM(doctor_commission_amount),0) as doctor_commission')
            ->selectRaw('COALESCE(SUM(agent_commission_amount),0) as agent_commission')
            ->groupBy('bucket')
            ->orderBy('bucket')
            ->get()
            ->map(fn ($r) => [
                'label'             => $this->bucketLabel($granularity, $r->bucket),
                'sales_total'       => (float) $r->sales_total,
                'paid'              => (float) $r->paid,
                'due'               => (float) $r->due,
                'discount'          => (float) $r->discount,
                'doctor_commission' => (float) $r->doctor_commission,
                'agent_commission'  => (float) $r->agent_commission,
            ])
            ->all();

        return [
            'summary'   => $summary,
            'series'    => $rows,
            'top_tests' => $this->topTests($start, $end),
        ];
    }

    /**
     * Top selling tests by quantity + amount.
     *
     * @return array<int, array<string, mixed>>
     */
    public function topTests(Carbon $start, Carbon $end, int $limit = 8): array
    {
        return DB::table('invoice_items')
            ->join('invoices', 'invoice_items.invoice_id', '=', 'invoices.id')
            ->join('tests', 'invoice_items.itemable_id', '=', 'tests.id')
            ->where('invoice_items.itemable_type', Test::class)
            ->whereBetween('invoices.invoice_date', [$start->toDateString(), $end->toDateString()])
            ->groupBy('tests.id', 'tests.name', 'tests.category')
            ->selectRaw('tests.name as test_name, tests.category as department_name,
                SUM(invoice_items.quantity) as sales_count,
                COALESCE(SUM(invoice_items.total),0) as sales_amount')
            ->orderByDesc('sales_amount')
            ->limit($limit)
            ->get()
            ->map(fn ($r) => [
                'test_name'       => $r->test_name,
                'department_name' => $r->department_name,
                'sales_count'     => (int) $r->sales_count,
                'sales_amount'    => (float) $r->sales_amount,
            ])
            ->all();
    }

    /**
     * Payment report: collection overview, per-period series, method breakdown.
     *
     * @return array<string, mixed>
     */
    public function paymentReport(Carbon $start, Carbon $end): array
    {
        $granularity = $this->granularity($start, $end);

        $base = Payment::query()->whereBetween('payment_date', [$start->copy()->startOfDay(), $end->copy()->endOfDay()]);

        $methodTotal = fn (array $methods) => (float) (clone $base)
            ->whereIn('payment_method', $methods)->sum('amount');

        $overview = [
            'total_collection' => (float) (clone $base)->sum('amount'),
            'total_cash'       => $methodTotal(['cash']),
            'total_card'       => $methodTotal(['card']),
            'total_mfs'        => $methodTotal(['mobile-banking', 'mfs', 'bkash', 'nagad', 'rocket']),
            'total_due'        => (float) Invoice::query()
                ->whereBetween('invoice_date', [$start->toDateString(), $end->toDateString()])
                ->sum('due_amount'),
        ];

        $rows = Payment::query()
            ->whereBetween('payment_date', [$start->copy()->startOfDay(), $end->copy()->endOfDay()])
            ->selectRaw("date_trunc(?, payment_date) as bucket", [$granularity])
            ->selectRaw("COALESCE(SUM(CASE WHEN payment_method = 'cash' THEN amount ELSE 0 END),0) as cash")
            ->selectRaw("COALESCE(SUM(CASE WHEN payment_method = 'card' THEN amount ELSE 0 END),0) as card")
            ->selectRaw("COALESCE(SUM(CASE WHEN payment_method IN ('mobile-banking','mfs','bkash','nagad','rocket') THEN amount ELSE 0 END),0) as mfs")
            ->selectRaw('COALESCE(SUM(amount),0) as collected')
            ->groupBy('bucket')
            ->orderBy('bucket')
            ->get()
            ->map(fn ($r) => [
                'label'     => $this->bucketLabel($granularity, $r->bucket),
                'cash'      => (float) $r->cash,
                'card'      => (float) $r->card,
                'mfs'       => (float) $r->mfs,
                'collected' => (float) $r->collected,
            ])
            ->all();

        return [
            'overview' => $overview,
            'series'   => $rows,
        ];
    }

    /**
     * Test report: overall counts, per-period series, top tests, doctor referrals.
     *
     * @return array<string, mixed>
     */
    public function testReport(Carbon $start, Carbon $end): array
    {
        $granularity = $this->granularity($start, $end);

        $itemBase = DB::table('invoice_items')
            ->join('invoices', 'invoice_items.invoice_id', '=', 'invoices.id')
            ->where('invoice_items.itemable_type', Test::class)
            ->whereBetween('invoices.invoice_date', [$start->toDateString(), $end->toDateString()]);

        $overview = [
            'total_tests'  => (int) (clone $itemBase)->sum('invoice_items.quantity'),
            'test_amount'  => (float) (clone $itemBase)->sum('invoice_items.total'),
            'unique_tests' => (int) (clone $itemBase)->distinct('invoice_items.itemable_id')->count('invoice_items.itemable_id'),
            'referred_tests' => (int) DB::table('invoice_items')
                ->join('invoices', 'invoice_items.invoice_id', '=', 'invoices.id')
                ->where('invoice_items.itemable_type', Test::class)
                ->whereNotNull('invoices.doctor_id')
                ->whereBetween('invoices.invoice_date', [$start->toDateString(), $end->toDateString()])
                ->count(),
        ];

        $series = DB::table('invoice_items')
            ->join('invoices', 'invoice_items.invoice_id', '=', 'invoices.id')
            ->where('invoice_items.itemable_type', Test::class)
            ->whereBetween('invoices.invoice_date', [$start->toDateString(), $end->toDateString()])
            ->selectRaw("date_trunc(?, invoices.invoice_date) as bucket", [$granularity])
            ->selectRaw('SUM(invoice_items.quantity) as total_tests')
            ->selectRaw('COALESCE(SUM(invoice_items.total),0) as test_amount')
            ->groupBy('bucket')
            ->orderBy('bucket')
            ->get()
            ->map(fn ($r) => [
                'label'       => $this->bucketLabel($granularity, $r->bucket),
                'total_tests' => (int) $r->total_tests,
                'test_amount' => (float) $r->test_amount,
            ])
            ->all();

        $referrals = DB::table('invoices')
            ->join('doctors', 'invoices.doctor_id', '=', 'doctors.id')
            ->join('invoice_items', function ($j) {
                $j->on('invoice_items.invoice_id', '=', 'invoices.id')
                    ->where('invoice_items.itemable_type', '=', Test::class);
            })
            ->whereBetween('invoices.invoice_date', [$start->toDateString(), $end->toDateString()])
            ->groupBy('doctors.id', 'doctors.first_name', 'doctors.last_name')
            ->selectRaw("CONCAT(doctors.first_name, ' ', COALESCE(doctors.last_name,'')) as doctor_name,
                COUNT(invoice_items.id) as total_referrals")
            ->orderByDesc('total_referrals')
            ->limit(8)
            ->get()
            ->map(fn ($r) => [
                'doctor_name'     => trim($r->doctor_name),
                'total_referrals' => (int) $r->total_referrals,
            ])
            ->all();

        return [
            'overview'   => $overview,
            'series'     => $series,
            'top_tests'  => $this->topTests($start, $end),
            'referrals'  => $referrals,
        ];
    }
}
