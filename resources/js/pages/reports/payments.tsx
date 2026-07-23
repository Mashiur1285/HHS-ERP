import { Head } from '@inertiajs/react';
import { Banknote, CreditCard, HandCoins, Smartphone, Wallet } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import DateRangeFilter from '@/components/date-range-filter';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/format';

interface Props {
    report: {
        overview: { total_collection: number; total_cash: number; total_card: number; total_mfs: number; total_due: number };
        series: { label: string; cash: number; card: number; mfs: number; collected: number }[];
    };
    filters: { start_date: string; end_date: string };
}

const PALETTE = { cyan: '#06b6d4', emerald: '#10b981', violet: '#8b5cf6' };

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

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { name?: string; value?: number; color?: string }[]; label?: string }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl border border-gray-100 bg-white px-3 py-2 text-xs shadow-md">
            <p className="mb-1 font-semibold text-gray-700">{label}</p>
            {payload.map((entry, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-600">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="capitalize">{entry.name}:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(entry.value)}</span>
                </div>
            ))}
        </div>
    );
}

function BreakdownRow({ label, value, tone }: { label: string; value: number; tone: string }) {
    return (
        <div className="flex items-center justify-between border-b border-gray-50 py-3 last:border-0">
            <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: tone }} />
                <span className="text-sm text-gray-600">{label}</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">{formatCurrency(value)}</span>
        </div>
    );
}

export default function PaymentReport({ report, filters }: Props) {
    const { overview, series } = report;

    return (
        <AppLayout>
            <Head title="Payment Report" />

            <div className="px-6 py-8">
                <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Payment Report</h1>
                        <p className="mt-1 text-sm text-gray-500">Collection breakdown for the selected period</p>
                    </div>
                    <DateRangeFilter routeUrl="/reports/payments" startDate={filters.start_date} endDate={filters.end_date} />
                </div>

                <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    <StatCard icon={Wallet} label="Total Collection" value={formatCurrency(overview.total_collection)} tone="bg-cyan-50 text-cyan-600" />
                    <StatCard icon={Banknote} label="Cash" value={formatCurrency(overview.total_cash)} tone="bg-emerald-50 text-emerald-600" />
                    <StatCard icon={CreditCard} label="Card" value={formatCurrency(overview.total_card)} tone="bg-cyan-50 text-cyan-600" />
                    <StatCard icon={Smartphone} label="MFS" value={formatCurrency(overview.total_mfs)} tone="bg-violet-50 text-violet-600" />
                    <StatCard icon={HandCoins} label="Due" value={formatCurrency(overview.total_due)} tone="bg-rose-50 text-rose-600" />
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-2">
                        <h2 className="mb-4 text-sm font-semibold text-gray-700">Collection by Method</h2>
                        {series.length === 0 ? (
                            <p className="py-16 text-center text-sm text-gray-400">No collections in the selected period</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={series} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                                    <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} />
                                    <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={48} />
                                    <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f8fafc' }} />
                                    <Legend wrapperStyle={{ fontSize: 12 }} />
                                    <Bar dataKey="cash" stackId="a" fill={PALETTE.emerald} radius={[0, 0, 0, 0]} />
                                    <Bar dataKey="card" stackId="a" fill={PALETTE.cyan} radius={[0, 0, 0, 0]} />
                                    <Bar dataKey="mfs" stackId="a" fill={PALETTE.violet} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <h2 className="mb-2 text-sm font-semibold text-gray-700">Method Breakdown</h2>
                        <BreakdownRow label="Cash" value={overview.total_cash} tone={PALETTE.emerald} />
                        <BreakdownRow label="Card" value={overview.total_card} tone={PALETTE.cyan} />
                        <BreakdownRow label="MFS" value={overview.total_mfs} tone={PALETTE.violet} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
