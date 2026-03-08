<?php

namespace App\Services;

use App\Models\Doctor;
use Illuminate\Pagination\LengthAwarePaginator;

class DoctorService
{
    public function list(int $perPage = 15): LengthAwarePaginator
    {
        return Doctor::latest()->paginate($perPage);
    }

    public function create(array $data): Doctor
    {
        return Doctor::create($data);
    }

    public function update(Doctor $doctor, array $data): Doctor
    {
        $doctor->update($data);

        return $doctor->fresh();
    }

    public function delete(Doctor $doctor): void
    {
        $doctor->delete();
    }
}
