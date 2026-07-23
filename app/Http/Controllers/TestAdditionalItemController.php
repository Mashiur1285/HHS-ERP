<?php

namespace App\Http\Controllers;

use App\Http\Requests\TestAdditionalItem\StoreTestAdditionalItemRequest;
use App\Http\Requests\TestAdditionalItem\UpdateTestAdditionalItemRequest;
use App\Models\TestAdditionalItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TestAdditionalItemController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('test-additional-items/index', [
            'items' => TestAdditionalItem::query()
                ->with('price')
                ->latest()
                ->paginate(15)
                ->through(fn (TestAdditionalItem $item) => [
                    'id' => $item->id,
                    'name' => $item->name,
                    'description' => $item->description,
                    'price' => (float) $item->price_amount,
                    'is_active' => $item->is_active,
                ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('test-additional-items/create');
    }

    public function store(StoreTestAdditionalItemRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated): void {
            $item = TestAdditionalItem::create([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'is_active' => $validated['is_active'] ?? true,
            ]);

            $item->price()->create([
                'amount' => $validated['price'],
            ]);
        });

        return redirect()->route('test-additional-items.index')->with('success', 'Additional item created successfully');
    }

    public function edit(TestAdditionalItem $testAdditionalItem): Response
    {
        $testAdditionalItem->load('price');

        return Inertia::render('test-additional-items/edit', [
            'item' => [
                'id' => $testAdditionalItem->id,
                'name' => $testAdditionalItem->name,
                'description' => $testAdditionalItem->description,
                'price' => (float) $testAdditionalItem->price_amount,
                'is_active' => $testAdditionalItem->is_active,
            ],
        ]);
    }

    public function update(UpdateTestAdditionalItemRequest $request, TestAdditionalItem $testAdditionalItem): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated, $testAdditionalItem): void {
            $testAdditionalItem->update([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'is_active' => $validated['is_active'] ?? false,
            ]);

            $testAdditionalItem->price()->updateOrCreate([], [
                'amount' => $validated['price'],
            ]);
        });

        return redirect()->route('test-additional-items.index')->with('success', 'Additional item updated successfully');
    }

    public function destroy(TestAdditionalItem $testAdditionalItem): RedirectResponse
    {
        DB::transaction(function () use ($testAdditionalItem): void {
            $testAdditionalItem->price()->delete();
            $testAdditionalItem->delete();
        });

        return back()->with('success', 'Additional item deleted successfully');
    }
}
