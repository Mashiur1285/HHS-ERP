<?php

namespace App\Http\Controllers;

use App\Http\Requests\Agent\StoreAgentRequest;
use App\Http\Requests\Agent\UpdateAgentRequest;
use App\Models\Agent;
use App\Services\AgentService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AgentController extends Controller
{
    public function __construct(private AgentService $agentService) {}

    public function index(): Response
    {
        return Inertia::render('agents/index', [
            'agents' => $this->agentService->list(),
        ]);
    }

    public function store(StoreAgentRequest $request): RedirectResponse
    {
        $agent = $this->agentService->create($request->validated());

        // When the agent is added from the billing desk, bounce back with the new
        // agent payload so the bill form can auto-select it.
        if ($request->input('redirect_to') === 'bills') {
            return redirect()
                ->route('bills.create')
                ->with('newAgent', [
                    'id'              => $agent->id,
                    'name'            => $agent->name,
                    'agent_id'        => $agent->agent_id,
                    'commission_rate' => (float) $agent->commission_rate,
                ]);
        }

        return redirect()->route('agents.index')->with('success', 'Agent created successfully');
    }

    public function update(UpdateAgentRequest $request, Agent $agent): RedirectResponse
    {
        $this->agentService->update($agent, $request->validated());

        return redirect()->route('agents.index')->with('success', 'Agent updated successfully');
    }

    public function destroy(Agent $agent): RedirectResponse
    {
        $this->agentService->delete($agent);

        return back()->with('success', 'Agent deleted successfully');
    }
}
