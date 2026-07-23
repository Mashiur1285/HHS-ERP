<?php

namespace App\Http\Controllers\Concerns;

use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

trait ResolvesDateRange
{
    /**
     * Resolve a [start, end] range from the request, falling back to the given
     * defaults (defaults to the current month). Always returns mutable
     * Illuminate\Support\Carbon instances so callers can safely mutate them.
     *
     * @return array{0: Carbon, 1: Carbon}
     */
    protected function resolveDateRange(Request $request, ?CarbonInterface $defaultStart = null, ?CarbonInterface $defaultEnd = null): array
    {
        $start = $request->filled('start_date')
            ? Carbon::parse($request->input('start_date'))->startOfDay()
            : Carbon::parse($defaultStart ?? Carbon::now()->startOfMonth())->startOfDay();

        $end = $request->filled('end_date')
            ? Carbon::parse($request->input('end_date'))->endOfDay()
            : Carbon::parse($defaultEnd ?? Carbon::now())->endOfDay();

        if ($end->lessThan($start)) {
            [$start, $end] = [$end->copy()->startOfDay(), $start->copy()->endOfDay()];
        }

        return [$start, $end];
    }
}
