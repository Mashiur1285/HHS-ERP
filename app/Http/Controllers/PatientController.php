<?php

namespace App\Http\Controllers;

use App\Enums\BloodGroup;
use App\Enums\Gender;
use App\Http\Requests\Patient\StorePatientRequest;
use App\Http\Requests\Patient\UpdatePatientRequest;
use App\Models\Patient;
use App\Services\PatientService;
use Inertia\Inertia;
use Inertia\Response;

class PatientController extends Controller
{
    public function __construct(private PatientService $patientService) {}

    public function index(): Response
    {
        return Inertia::render('patients/index', [
            'patients' => $this->patientService->list(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('patients/create', [
            'genders'     => Gender::cases(),
            'bloodGroups' => BloodGroup::cases(),
        ]);
    }

    public function store(StorePatientRequest $request)
    {
        $this->patientService->create($request->validated());

        return redirect()->route('patients.index')
            ->with('success', 'Patient created successfully');
    }

    public function edit(Patient $patient): Response
    {
        return Inertia::render('patients/edit', [
            'patient'     => $patient,
            'genders'     => Gender::cases(),
            'bloodGroups' => BloodGroup::cases(),
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