<?php

namespace App\Http\Controllers;

use App\Enums\BloodGroup;
use App\Enums\Gender;
use App\Http\Requests\Doctor\StoreDoctorRequest;
use App\Http\Requests\Doctor\UpdateDoctorRequest;
use App\Models\Doctor;
use App\Services\DoctorService;
use Inertia\Inertia;
use Inertia\Response;

class DoctorController extends Controller
{
    public function __construct(private DoctorService $doctorService) {}

    public function index(): Response
    {
        return Inertia::render('doctors/index', [
            'doctors' => $this->doctorService->list(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('doctors/create', [
            'genders'     => Gender::cases(),
            'bloodGroups' => BloodGroup::cases(),
        ]);
    }

    public function store(StoreDoctorRequest $request)
    {
        $this->doctorService->create($request->validated());

        return redirect()->route('doctors.index')->with('success', 'Doctor created successfully');
    }

    public function edit(Doctor $doctor): Response
    {
        return Inertia::render('doctors/edit', [
            'doctor'      => $doctor,
            'genders'     => Gender::cases(),
            'bloodGroups' => BloodGroup::cases(),
        ]);
    }

    public function update(UpdateDoctorRequest $request, Doctor $doctor)
    {
        $this->doctorService->update($doctor, $request->validated());

        return redirect()->route('doctors.index')->with('success', 'Doctor updated successfully');
    }

    public function destroy(Doctor $doctor)
    {
        $this->doctorService->delete($doctor);

        return back()->with('success', 'Doctor deleted successfully');
    }
}
