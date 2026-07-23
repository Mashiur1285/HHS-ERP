<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ResolvesDateRange;
use App\Services\DashboardService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    use ResolvesDateRange;

    public function __construct(private DashboardService $dashboard) {}

    public function index(Request $request): Response
    {
        // KPI cards default to the current month; the chart shows the last 14 days.
        // Use mutable Illuminate Carbon everywhere (the app's now() is immutable).
        [$start, $end] = $this->resolveDateRange($request, Carbon::now()->startOfMonth(), Carbon::now());

        $todayStart = Carbon::now()->startOfDay();
        $chartStart = Carbon::now()->subDays(13)->startOfDay();

        return Inertia::render('dashboard', [
            'monthSummary'  => $this->dashboard->salesSummary($start, $end),
            'todaySummary'  => $this->dashboard->salesSummary($todayStart, Carbon::now()),
            'salesActivity' => $this->dashboard->salesActivity($chartStart, Carbon::now()),
            'doctorReferences' => $this->dashboard->doctorReferences($start, $end),
            'patientSummary' => $this->dashboard->patientSummary(),
            'testsSummary'  => $this->dashboard->testsSummary($start, $end),
            'recentBills'   => $this->dashboard->recentBills(),
            'filters' => [
                'start_date' => $start->toDateString(),
                'end_date'   => $end->toDateString(),
            ],
        ]);
    }
}
