import { Head } from '@inertiajs/react';
import { FlaskConical, Layers, Stethoscope, Wallet } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import DateRangeFilter from '@/components/date-range-filter';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/format';

interface Props {
    report: {
        overview: { total_tests: number; test_amount: number; unique_tests: number; referred_tests: number };
        series: { label: string; total_tests: number; test_amount: number }[];
        top_tests: { test_name: string; department_name: string | null; sales_count: number; sales_amount: number }[];
        referrals: { doctor_name: string; total_referrals: number }[];
    };
    filters: { start_date: string; end_date: string };
}

const PALETTE = { cyan: '#06b6d4', violet: '#8b5cf6' };

function StatCard({ icon: Icon, label, value, tone }: { icon: typeof Wallet; label: string; value: string; tone: string }) {
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

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { name?: string; value?: number; color?: string; dataKey?: string | number }[]; label?: string }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl border border-gray-100 bg-white px-3 py-2 text-xs shadow-md">
            <p className="mb-1 font-semibold text-gray-700">{label}</p>
            {payload.map((entry, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-600">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="capitalize">{String(entry.name).replace(/_/g, ' ')}:</span>
                    <span className="font-medium text-gray-900">
                        {entry.dataKey === 'test_amount' ? formatCurrency(entry.value) : entry.value}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default function TestReport({ report, filters }: Props) {
    const { overview, series, top_tests, referrals } = report;
    const maxReferrals = Math.max(1, ...referrals.map((r) => r.total_referrals));

    return (
        <AppLayout>
            <Head title="Test Report" />

            <div className="px-6 py-8">
                <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Test Report</h1>
                        <p className="mt-1 text-sm text-gray-500">Test volume and referrals for the selected period</p>
                    </div>
                    <DateRangeFilter routeUrl="/reports/tests" startDate={filters.start_date} endDate={filters.end_date} />
                </div>

                <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard icon={FlaskConical} label="Total Tests" value={String(overview.total_tests)} tone="bg-cyan-50 text-cyan-600" />
                    <StatCard icon={Layers} label="Unique Tests" value={String(overview.unique_tests)} tone="bg-violet-50 text-violet-600" />
                    <StatCard icon={Stethoscope} label="Referred Tests" value={String(overview.referred_tests)} tone="bg-amber-50 text-amber-600" />
                    <StatCard icon={Wallet} label="Test Amount" value={formatCurrency(overview.test_amount)} tone="bg-emerald-50 text-emerald-600" />
                </div>

                <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <h2 className="mb-4 text-sm font-semibold text-gray-700">Tests Over Time</h2>
                    {series.length === 0 ? (
                        <p className="py-16 text-center text-sm text-gray-400">No tests in the selected period</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={series} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="testsFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={PALETTE.cyan} stopOpacity={0.25} />
                                        <stop offset="100%" stopColor={PALETTE.cyan} stopOpacity={0.02} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                                <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={48} />
                                <Tooltip content={<ChartTooltip />} />
                                <Area type="monotone" dataKey="total_tests" stroke={PALETTE.cyan} strokeWidth={2} fill="url(#testsFill)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <div className="border-b border-gray-100 px-5 py-4">
                            <h2 className="text-sm font-semibold text-gray-700">Top Tests</h2>
                        </div>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    <th className="px-5 py-3">Test Name</th>
                                    <th className="px-5 py-3 text-right">Sales</th>
                                    <th className="px-5 py-3 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {top_tests.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="py-12 text-center text-gray-400">No tests found</td>
                                    </tr>
                                ) : (
                                    top_tests.map((test, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="px-5 py-4">
                                                <p className="font-medium text-gray-800">{test.test_name}</p>
                                                <p className="text-xs text-gray-400">{test.department_name ?? '—'}</p>
                                            </td>
                                            <td className="px-5 py-4 text-right text-gray-600">{test.sales_count}</td>
                                            <td className="px-5 py-4 text-right font-medium text-gray-900">{formatCurrency(test.sales_amount)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <h2 className="mb-4 text-sm font-semibold text-gray-700">Doctor Referrals</h2>
                        {referrals.length === 0 ? (
                            <p className="py-12 text-center text-sm text-gray-400">No referrals found</p>
                        ) : (
                            <div className="space-y-3">
                                {referrals.map((ref, i) => (
                                    <div key={i}>
                                        <div className="mb-1 flex items-center justify-between text-sm">
                                            <span className="text-gray-700">{ref.doctor_name}</span>
                                            <span className="font-semibold text-gray-900">{ref.total_referrals}</span>
                                        </div>
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                                            <div
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${(ref.total_referrals / maxReferrals) * 100}%`,
                                                    backgroundColor: PALETTE.violet,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
