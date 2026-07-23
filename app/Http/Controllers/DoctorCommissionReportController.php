<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ResolvesDateRange;
use App\Models\Doctor;
use App\Services\CommissionReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DoctorCommissionReportController extends Controller
{
    use ResolvesDateRange;

    public function __construct(private CommissionReportService $service) {}

    public function index(Request $request): Response
    {
        [$start, $end] = $this->resolveDateRange($request);
        $search = $request->input('search');

        $rows = $this->service->doctorReport($start, $end, $search);

        return Inertia::render('commissions/doctors/index', [
            'doctorReferences' => $rows,
            'summary' => [
                'doctor_count'     => count($rows),
                'test_amount'      => array_sum(array_column($rows, 'test_amount')),
                'commission_total' => array_sum(array_column($rows, 'commission_total')),
            ],
            'filters' => [
                'start_date' => $start->toDateString(),
                'end_date'   => $end->toDateString(),
                'search'     => $search,
            ],
        ]);
    }

    public function show(Request $request, Doctor $doctor): Response
    {
        [$start, $end] = $this->resolveDateRange($request);
        $search = $request->input('search');

        $data = $this->service->singleDoctor($doctor, $start, $end, $search);

        return Inertia::render('commissions/doctors/show', [
            'doctor' => [
                'id'                    => $doctor->id,
                'name'                  => $doctor->full_name,
                'specialties'           => $doctor->specialties,
                'designation'           => $doctor->designation,
                'email'                 => $doctor->email,
                'phone'                 => $doctor->personal_number,
                'address'               => $doctor->address,
                'commission_percentage' => (float) $doctor->commission_percentage,
            ],
            'references'      => $data['references'],
            'totalRefer'      => $data['total_refer'],
            'totalCommission' => $data['total_commission'],
            'filters' => [
                'start_date' => $start->toDateString(),
                'end_date'   => $end->toDateString(),
                'search'     => $search,
            ],
        ]);
    }
}
