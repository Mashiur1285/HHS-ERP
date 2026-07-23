import DateRangeFilter from '@/components/date-range-filter';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/format';
import { Head, router } from '@inertiajs/react';
import { HandCoins, Search, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';

interface Row {
    id: number;
    name: string;
    agent_id: string;
    percentage: number;
    invoice_count: number;
    invoice_total: number;
    commission_total: number;
}

interface Props {
    agentReport: Row[];
    summary: { agent_count: number; invoice_total: number; commission_total: number };
    filters: { start_date: string; end_date: string; search: string | null };
}

function StatCard({ icon: Icon, label, value, tone }: { icon: typeof Users; label: string; value: string; tone: string }) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
                <span className={`rounded-xl p-2 ${tone}`}>
                    <Icon className="h-4 w-4" />
                </span>
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
        </div>
    );
}

export default function AgentCommissionIndex({ agentReport, summary, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const applySearch = () => {
        router.get(
            '/commissions/agents',
            { start_date: filters.start_date, end_date: filters.end_date, search },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    return (
        <AppLayout>
            <Head title="Agent Commission Report" />

            <div className="px-6 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Agent Commission Report</h1>
                    <p className="mt-1 text-sm text-gray-500">Commission earned by agents in the selected period</p>
                </div>

                <div className="mb-6 grid gap-4 sm:grid-cols-3">
                    <StatCard icon={Users} label="Agents" value={String(summary.agent_count)} tone="bg-blue-50 text-blue-600" />
                    <StatCard icon={TrendingUp} label="Invoice Total" value={formatCurrency(summary.invoice_total)} tone="bg-cyan-50 text-cyan-600" />
                    <StatCard icon={HandCoins} label="Commission Total" value={formatCurrency(summary.commission_total)} tone="bg-emerald-50 text-emerald-600" />
                </div>

                <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <DateRangeFilter
                        routeUrl="/commissions/agents"
                        startDate={filters.start_date}
                        endDate={filters.end_date}
                        extra={{ search }}
                    />
                    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
                        <Search className="h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applySearch()}
                            placeholder="Agent name"
                            className="bg-transparent text-sm text-gray-700 outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                <th className="px-5 py-3.5">Agent Name</th>
                                <th className="px-5 py-3.5">Percentage</th>
                                <th className="px-5 py-3.5 text-right">No. of Invoices</th>
                                <th className="px-5 py-3.5 text-right">Invoice Total</th>
                                <th className="px-5 py-3.5 text-right">Commission Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {agentReport.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-gray-400">No agent commissions found</td>
                                </tr>
                            ) : (
                                agentReport.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-4">
                                            <p className="font-medium text-gray-900">{row.name}</p>
                                            <p className="text-xs text-gray-400">#{row.agent_id}</p>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">{`${row.percentage}%`}</td>
                                        <td className="px-5 py-4 text-right text-gray-600">{row.invoice_count}</td>
                                        <td className="px-5 py-4 text-right font-medium text-gray-900">{formatCurrency(row.invoice_total)}</td>
                                        <td className="px-5 py-4 text-right font-bold text-cyan-600">{formatCurrency(row.commission_total)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
