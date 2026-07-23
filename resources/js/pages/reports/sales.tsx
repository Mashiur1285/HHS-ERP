import { Head } from '@inertiajs/react';
import { HandCoins, Percent, ReceiptText, TrendingUp, UserCog, Users, Wallet } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import DateRangeFilter from '@/components/date-range-filter';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/format';

interface Props {
    report: {
        summary: {
            total_sales: number;
            total_paid: number;
            total_due: number;
            total_discount: number;
            doctor_commission: number;
            agent_commission: number;
            total_bills: number;
            average_sales: number;
        };
        series: {
            label: string;
            sales_total: number;
            paid: number;
            due: number;
            discount: number;
            doctor_commission: number;
            agent_commission: number;
        }[];
        top_tests: { test_name: string; department_name: string | null; sales_count: number; sales_amount: number }[];
    };
    filters: { start_date: string; end_date: string };
}

const PALETTE = { cyan: '#06b6d4', emerald: '#10b981', rose: '#f43f5e', violet: '#8b5cf6', amber: '#f59e0b' };

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

function ChartTooltip({ active, payload, label, currency = true }: { active?: boolean; payload?: { name?: string; value?: number; color?: string }[]; label?: string; currency?: boolean }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl border border-gray-100 bg-white px-3 py-2 text-xs shadow-md">
            <p className="mb-1 font-semibold text-gray-700">{label}</p>
            {payload.map((entry, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-600">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="capitalize">{entry.name?.replace(/_/g, ' ')}:</span>
                    <span className="font-medium text-gray-900">{currency ? formatCurrency(entry.value) : entry.value}</span>
                </div>
            ))}
        </div>
    );
}

function CommissionRow({ label, value, tone }: { label: string; value: number; tone: string }) {
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

export default function SalesReport({ report, filters }: Props) {
    const { summary, series, top_tests } = report;

    return (
        <AppLayout>
            <Head title="Sales Report" />

            <div className="px-6 py-8">
                <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Sales Report</h1>
                        <p className="mt-1 text-sm text-gray-500">Sales performance for the selected period</p>
                    </div>
                    <DateRangeFilter routeUrl="/reports/sales" startDate={filters.start_date} endDate={filters.end_date} />
                </div>

                <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    <StatCard icon={TrendingUp} label="Total Sales" value={formatCurrency(summary.total_sales)} tone="bg-cyan-50 text-cyan-600" />
                    <StatCard icon={Wallet} label="Total Paid" value={formatCurrency(summary.total_paid)} tone="bg-emerald-50 text-emerald-600" />
                    <StatCard icon={HandCoins} label="Total Due" value={formatCurrency(summary.total_due)} tone="bg-rose-50 text-rose-600" />
                    <StatCard icon={TrendingUp} label="Avg / Day" value={formatCurrency(summary.average_sales)} tone="bg-violet-50 text-violet-600" />
                    <StatCard icon={ReceiptText} label="Total Bills" value={String(summary.total_bills)} tone="bg-blue-50 text-blue-600" />
                </div>

                <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <h2 className="mb-4 text-sm font-semibold text-gray-700">Sales Activity</h2>
                    {series.length === 0 ? (
                        <p className="py-16 text-center text-sm text-gray-400">No sales in the selected period</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={series} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                                <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={48} />
                                <Tooltip content={<ChartTooltip />} />
                                <Line type="monotone" dataKey="paid" stroke={PALETTE.emerald} strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="due" stroke={PALETTE.rose} strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="sales_total" stroke={PALETTE.cyan} strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <h2 className="mb-2 text-sm font-semibold text-gray-700">Commission Overview</h2>
                        <CommissionRow label="Doctor Commission" value={summary.doctor_commission} tone={PALETTE.violet} />
                        <CommissionRow label="Agent Commission" value={summary.agent_commission} tone={PALETTE.amber} />
                        <CommissionRow label="Total Discount" value={summary.total_discount} tone={PALETTE.rose} />
                        <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
                            <UserCog className="h-4 w-4" />
                            <Users className="h-4 w-4" />
                            <Percent className="h-4 w-4" />
                            <span>Payouts and discounts across the period</span>
                        </div>
                    </div>

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
                </div>
            </div>
        </AppLayout>
    );
}
