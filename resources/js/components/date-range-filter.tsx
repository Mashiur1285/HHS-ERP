import { router } from '@inertiajs/react';
import { CalendarDays } from 'lucide-react';
import { useState } from 'react';

interface Props {
    routeUrl: string;
    startDate: string;
    endDate: string;
    /** Extra query params to preserve on reload (e.g. status, search). */
    extra?: Record<string, string | number | null | undefined>;
}

const presets: { label: string; get: () => [string, string] }[] = [
    {
        label: 'Today',
        get: () => {
            const d = new Date().toISOString().slice(0, 10);
            return [d, d];
        },
    },
    {
        label: 'This Week',
        get: () => {
            const now = new Date();
            const day = now.getDay();
            const start = new Date(now);
            start.setDate(now.getDate() - day);
            return [start.toISOString().slice(0, 10), now.toISOString().slice(0, 10)];
        },
    },
    {
        label: 'This Month',
        get: () => {
            const now = new Date();
            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            return [start.toISOString().slice(0, 10), now.toISOString().slice(0, 10)];
        },
    },
    {
        label: 'This Year',
        get: () => {
            const now = new Date();
            const start = new Date(now.getFullYear(), 0, 1);
            return [start.toISOString().slice(0, 10), now.toISOString().slice(0, 10)];
        },
    },
];

export default function DateRangeFilter({ routeUrl, startDate, endDate, extra = {} }: Props) {
    const [start, setStart] = useState(startDate);
    const [end, setEnd] = useState(endDate);

    const apply = (s: string, e: string) => {
        setStart(s);
        setEnd(e);
        router.get(
            routeUrl,
            { ...extra, start_date: s, end_date: e },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
                <CalendarDays className="h-4 w-4 text-gray-400" />
                <input
                    type="date"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className="bg-transparent text-sm text-gray-700 outline-none"
                />
                <span className="text-gray-300">—</span>
                <input
                    type="date"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    className="bg-transparent text-sm text-gray-700 outline-none"
                />
            </div>
            <button
                onClick={() => apply(start, end)}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
                Apply
            </button>
            {presets.map((p) => (
                <button
                    key={p.label}
                    onClick={() => {
                        const [s, e] = p.get();
                        apply(s, e);
                    }}
                    className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 transition hover:border-blue-300 hover:text-blue-700"
                >
                    {p.label}
                </button>
            ))}
        </div>
    );
}
