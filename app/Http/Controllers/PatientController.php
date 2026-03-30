<?php

namespace App\Http\Controllers;

use App\Enums\BloodGroup;
use App\Enums\Gender;
use App\Http\Requests\Patient\StorePatientRequest;
use App\Http\Requests\Patient\UpdatePatientRequest;
use App\Models\Patient;
use App\Models\DraftPatient;
use App\Services\PatientService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PatientController extends Controller
{
    public function __construct(private PatientService $patientService) {}

    public function index(): Response
    {
        return Inertia::render('patients/index', [
           'patients' => $this->patientService->list(),
           'drafts'   => DraftPatient::latest()->get(),
        ]);
    }

    public function create(Request $request): Response
    {
        $draft = null;
        if ($request->has('draft_id')) {
            $draft = DraftPatient::find($request->draft_id);
        }

        return Inertia::render('patients/create', [
            'draft'       => $draft,
            'genders'     => collect(Gender::cases())->map(fn($g) => ['name' => $g->label(), 'value' => $g->value]),
            'bloodGroups' => collect(BloodGroup::cases())->map(fn($bg) => ['name' => $bg->value, 'value' => $bg->value]),
        ]);
    }

    public function store(StorePatientRequest $request)
    {

        $data = $request->validated();

        $data['created_by'] = auth()->id();

        $this->patientService->create($data);

        // If a draft was converted, delete it
        if ($request->filled('draft_id')) {
            DraftPatient::where('id', $request->draft_id)->delete();
        }

        return redirect()->route('patients.index')
            ->with('success', 'Patient created successfully');
    }

    public function edit(Patient $patient): Response
    {
        return Inertia::render('patients/edit', [
            'patient'     => $patient,
            'genders'     => collect(Gender::cases())->map(fn($g) => ['name' => $g->label(), 'value' => $g->value]),
            'bloodGroups' => collect(BloodGroup::cases())->map(fn($bg) => ['name' => $bg->value, 'value' => $bg->value]),
        ]);
    }

    public function update(UpdatePatientRequest $request, Patient $patient)
    {
        $this->patientService->update($patient, $request->validated());

        return redirect()->route('patients.index')
            ->with('success', 'Patient updated successfully');
    }

    public function destroy(Patient $patient)
    {
        $this->patientService->delete($patient);

        return back()->with('success', 'Patient deleted successfully');
    }
}
