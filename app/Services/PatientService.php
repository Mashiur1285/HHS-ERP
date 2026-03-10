<?php

namespace App\Services;

use App\Models\Patient;
use Illuminate\Pagination\LengthAwarePaginator;

class PatientService
{
    public function list(int $perPage = 15): LengthAwarePaginator
    {
        return Patient::latest()->paginate($perPage);
    }

    public function create(array $data): Patient
    {
        return Patient::create($data);
    }

    public function update(Patient $patient, array $data): Patient
    {
        $patient->update($data);

        return $patient->fresh();
    }

    public function delete(Patient $patient): void
    {
        $patient->delete();
    }
}

