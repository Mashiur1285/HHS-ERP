<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ResolvesDateRange;
use App\Services\CommissionReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AgentReportController extends Controller
{
    use ResolvesDateRange;

    public function __construct(private CommissionReportService $service) {}

    public function index(Request $request): Response
    {
        [$start, $end] = $this->resolveDateRange($request);
        $search = $request->input('search');

        $rows = $this->service->agentReport($start, $end, $search);

        return Inertia::render('commissions/agents/index', [
            'agentReport' => $rows,
            'summary' => [
                'agent_count'      => count($rows),
                'invoice_total'    => array_sum(array_column($rows, 'invoice_total')),
                'commission_total' => array_sum(array_column($rows, 'commission_total')),
            ],
            'filters' => [
                'start_date' => $start->toDateString(),
                'end_date'   => $end->toDateString(),
                'search'     => $search,
            ],
        ]);
    }
}
