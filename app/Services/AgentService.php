<?php

namespace App\Services;

use App\Models\Agent;
use Illuminate\Pagination\LengthAwarePaginator;

class AgentService
{
    public function list(int $perPage = 15): LengthAwarePaginator
    {
        return Agent::latest()->paginate($perPage);
    }

    public function create(array $data): Agent
    {
        return Agent::create($data);
    }

    public function update(Agent $agent, array $data): Agent
    {
        $agent->update($data);

        return $agent->fresh();
    }

    public function delete(Agent $agent): void
    {
        $agent->delete();
    }
}
