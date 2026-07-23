<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Concerns\ResolvesDateRange;
use App\Http\Controllers\Controller;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentReportController extends Controller
{
    use ResolvesDateRange;

    public function __construct(private ReportService $reports) {}

    public function index(Request $request): Response
    {
        [$start, $end] = $this->resolveDateRange($request, now()->startOfMonth(), now());

        return Inertia::render('reports/payments', [
            'report'  => $this->reports->paymentReport($start, $end),
            'filters' => [
                'start_date' => $start->toDateString(),
                'end_date'   => $end->toDateString(),
            ],
        ]);
    }
}
