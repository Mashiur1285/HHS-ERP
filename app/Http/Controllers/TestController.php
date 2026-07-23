<?php

namespace App\Http\Controllers;

use App\Http\Requests\Test\StoreTestRequest;
use App\Http\Requests\Test\UpdateTestRequest;
use App\Models\Test;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TestController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('tests/index', [
            'tests' => Test::query()
                ->with('price')
                ->latest()
                ->paginate(15)
                ->through(fn (Test $test) => [
                    'id' => $test->id,
                    'name' => $test->name,
                    'short_name' => $test->short_name,
                    'category' => $test->category,
                    'sample_type' => $test->sample_type,
                    'report_delivery_time' => $test->report_delivery_time,
                    'price' => (float) $test->price_amount,
                    'is_active' => $test->is_active,
                ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('tests/create');
    }

    public function store(StoreTestRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated): void {
            $test = Test::create([
                'name' => $validated['name'],
                'short_name' => $validated['short_name'] ?? null,
                'category' => $validated['category'] ?? null,
                'description' => $validated['description'] ?? null,
                'sample_type' => $validated['sample_type'] ?? null,
                'report_delivery_time' => $validated['report_delivery_time'] ?? null,
                'is_active' => $validated['is_active'] ?? true,
            ]);

            $test->price()->create([
                'amount' => $validated['price'],
            ]);
        });

        return redirect()->route('tests.index')->with('success', 'Test created successfully');
    }

    public function edit(Test $test): Response
    {
        $test->load('price');

        return Inertia::render('tests/edit', [
            'test' => [
                'id' => $test->id,
                'name' => $test->name,
                'short_name' => $test->short_name,
                'category' => $test->category,
                'description' => $test->description,
                'sample_type' => $test->sample_type,
                'report_delivery_time' => $test->report_delivery_time,
                'price' => (float) $test->price_amount,
                'is_active' => $test->is_active,
            ],
        ]);
    }

    public function update(UpdateTestRequest $request, Test $test): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated, $test): void {
            $test->update([
                'name' => $validated['name'],
                'short_name' => $validated['short_name'] ?? null,
                'category' => $validated['category'] ?? null,
                'description' => $validated['description'] ?? null,
                'sample_type' => $validated['sample_type'] ?? null,
                'report_delivery_time' => $validated['report_delivery_time'] ?? null,
                'is_active' => $validated['is_active'] ?? false,
            ]);

            $test->price()->updateOrCreate([], [
                'amount' => $validated['price'],
            ]);
        });

        return redirect()->route('tests.index')->with('success', 'Test updated successfully');
    }

    public function destroy(Test $test): RedirectResponse
    {
        DB::transaction(function () use ($test): void {
            $test->price()->delete();
            $test->delete();
        });

        return back()->with('success', 'Test deleted successfully');
    }
}
