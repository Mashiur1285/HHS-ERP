import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    ArrowRight,
    Banknote,
    ReceiptText,
    Stethoscope,
    TestTubeDiagonal,
    TrendingUp,
    UserPlus,
    Users,
    Wallet,
} from 'lucide-react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatNumber } from '@/lib/format';

interface Summary {
    subtotal: number;
    total: number;
    paid: number;
    due: number;
    discount: number;
    total_bills: number;
    agent_commission: number;
    doctor_commission: number;
}
interface DoctorRef {
    id: number;
    name: string;
    specialties: string | null;
    total: number;
    total_amount: number;
    commission_total: number;
}
interface RecentBill {
    id: number;
    invoice_no: string;
    patient: string;
    doctor: string | null;
    net_amount: number;
    paid_amount: number;
    due_amount: number;
    payment_status: 'Due' | 'Partial' | 'Paid';
    invoice_date: string | null;
}
interface Props {
    monthSummary: Summary;
    todaySummary: Summary;
    salesActivity: { date: string; paid: number; due: number; total: number }[];
    doctorReferences: DoctorRef[];
    patientSummary: { today_new: number; total_patients: number; trend: { date: string; count: number }[] };
    testsSummary: { total_tests: number };
    recentBills: RecentBill[];
    filters: { start_date: string; end_date: string };
}

const statusStyles: Record<string, string> = {
    Paid: 'bg-emerald-50 text-emerald-700',
    Partial: 'bg-amber-50 text-amber-700',
    Due: 'bg-rose-50 text-rose-600',
};

function Kpi({
    icon: Icon,
    label,
    value,
    sub,
    tone,
}: {
    icon: typeof Wallet;
    label: string;
    value: string;
    sub?: string;
    tone: string;
}) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
                <span className={`rounded-xl p-2 ${tone}`}>
                    <Icon className="h-4 w-4" />
                </span>
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
            {sub ? <p className="mt-1 text-xs text-gray-400">{sub}</p> : null}
        </div>
    );
}

const tooltipContentStyle = { borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 };

export default function Dashboard({
    monthSummary,
    todaySummary,
    salesActivity,
    doctorReferences,
    patientSummary,
    testsSummary,
    recentBills,
}: Props) {
    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="px-6 py-8">
                <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p className="mt-1 text-sm text-gray-500">Overview of today &amp; this month</p>
                    </div>
                    <Link
                        href="/bills/create"
                        className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-700"
                    >
                        <ReceiptText className="h-4 w-4" /> New Bill
                    </Link>
                </div>

                {/* Big month overview tile */}
                {(() => {
                    const breakdown = [
                        { label: 'Collected', value: monthSummary.paid, color: '#10b981' },
                        { label: 'Due', value: monthSummary.due, color: '#f43f5e' },
                        { label: 'Discount', value: monthSummary.discount, color: '#f59e0b' },
                        { label: 'Doctor Commission', value: monthSummary.doctor_commission, color: '#06b6d4' },
                        { label: 'Agent Commission', value: monthSummary.agent_commission, color: '#8b5cf6' },
                    ];
                    const chartData = breakdown.filter((b) => b.value > 0);
                    return (
                        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <div className="mb-5 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">This Month · Overview</p>
                                    <h2 className="mt-1 text-lg font-semibold text-gray-800">Sales &amp; Collection Summary</h2>
                                </div>
                                <span className="rounded-xl bg-cyan-50 p-2.5 text-cyan-600">
                                    <TrendingUp className="h-5 w-5" />
                                </span>
                            </div>

                            <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr] xl:grid-cols-[1fr_1.6fr]">
                                {/* Headline totals */}
                                <div className="flex flex-col justify-center gap-5">
                                    <div>
                                        <p className="text-sm text-gray-500">Total Sales</p>
                                        <p className="mt-1 text-4xl font-bold tracking-tight text-gray-900">{formatCurrency(monthSummary.total)}</p>
                                        <p className="mt-1 text-xs text-gray-400">{monthSummary.total_bills} bills · Subtotal {formatCurrency(monthSummary.subtotal)}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="rounded-xl bg-emerald-50 px-4 py-3">
                                            <p className="text-xs font-medium text-emerald-700/70">Collected</p>
                                            <p className="mt-0.5 text-xl font-bold text-emerald-700">{formatCurrency(monthSummary.paid)}</p>
                                        </div>
                                        <div className="rounded-xl bg-rose-50 px-4 py-3">
                                            <p className="text-xs font-medium text-rose-700/70">Due</p>
                                            <p className="mt-0.5 text-xl font-bold text-rose-600">{formatCurrency(monthSummary.due)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Donut + breakdown */}
                                <div className="grid items-center gap-4 sm:grid-cols-[180px_1fr]">
                                    <div className="relative h-[180px]">
                                        {chartData.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie data={chartData} dataKey="value" nameKey="label" innerRadius={52} outerRadius={80} paddingAngle={2} stroke="none">
                                                        {chartData.map((entry) => (
                                                            <Cell key={entry.label} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip contentStyle={tooltipContentStyle} formatter={(v) => formatCurrency(Number(v))} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-sm text-gray-400">No data</div>
                                        )}
                                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-[10px] uppercase tracking-wider text-gray-400">Total</span>
                                            <span className="text-sm font-bold text-gray-800">{formatCurrency(monthSummary.total)}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2.5">
                                        {breakdown.map((b) => (
                                            <div key={b.label} className="flex items-center justify-between">
                                                <span className="flex items-center gap-2 text-sm text-gray-600">
                                                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: b.color }} />
                                                    {b.label}
                                                </span>
                                                <span className="text-sm font-semibold text-gray-900">{formatCurrency(b.value)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })()}

                {/* Today's KPIs */}
                <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Kpi icon={Wallet} label="Today Collection" value={formatCurrency(todaySummary.paid)} sub={`${todaySummary.total_bills} bills today`} tone="bg-emerald-50 text-emerald-600" />
                    <Kpi icon={Banknote} label="Today Due" value={formatCurrency(todaySummary.due)} tone="bg-rose-50 text-rose-600" />
                    <Kpi icon={UserPlus} label="New Patients (Today)" value={formatNumber(patientSummary.today_new)} sub={`${formatNumber(patientSummary.total_patients)} total`} tone="bg-blue-50 text-blue-600" />
                    <Kpi icon={TestTubeDiagonal} label="Tests (This Month)" value={formatNumber(testsSummary.total_tests)} tone="bg-cyan-50 text-cyan-600" />
                </div>

                <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
                    {/* Sales activity */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-2">
                            <Activity className="h-4 w-4 text-cyan-600" />
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Sales Activity · Last 14 days</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={salesActivity} margin={{ left: -10, right: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={tooltipContentStyle} formatter={(v) => formatCurrency(Number(v))} />
                                <Line type="monotone" dataKey="paid" stroke="#10b981" strokeWidth={2} dot={false} name="Paid" />
                                <Line type="monotone" dataKey="due" stroke="#f43f5e" strokeWidth={2} dot={false} name="Due" />
                                <Line type="monotone" dataKey="total" stroke="#06b6d4" strokeWidth={2} dot={false} name="Total" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Patient trend */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Patients · Last 7 days</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={patientSummary.trend} margin={{ left: -20, right: 10 }}>
                                <defs>
                                    <linearGradient id="patientFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={tooltipContentStyle} />
                                <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} fill="url(#patientFill)" name="Patients" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
                    {/* Recent bills */}
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Recent Bills</h3>
                            <Link href="/bills" className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 hover:text-cyan-700">
                                View all <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    <th className="px-6 py-3">Invoice</th>
                                    <th className="px-6 py-3">Patient</th>
                                    <th className="px-6 py-3 text-right">Net</th>
                                    <th className="px-6 py-3 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentBills.length === 0 ? (
                                    <tr><td colSpan={4} className="py-10 text-center text-gray-400">No bills yet</td></tr>
                                ) : (
                                    recentBills.map((bill) => (
                                        <tr key={bill.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-3">
                                                <Link href={`/bills/${bill.id}`} className="font-medium text-gray-900 hover:text-cyan-600">{bill.invoice_no}</Link>
                                                <p className="text-xs text-gray-400">{bill.invoice_date ?? ''}</p>
                                            </td>
                                            <td className="px-6 py-3 text-gray-600">{bill.patient}</td>
                                            <td className="px-6 py-3 text-right font-medium text-gray-900">{formatCurrency(bill.net_amount)}</td>
                                            <td className="px-6 py-3 text-center">
                                                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[bill.payment_status]}`}>{bill.payment_status}</span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Top doctor references */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Stethoscope className="h-4 w-4 text-cyan-600" />
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Top Doctor References</h3>
                            </div>
                            <Link href="/commissions/doctors" className="text-xs font-semibold text-cyan-600 hover:text-cyan-700">Report</Link>
                        </div>
                        {doctorReferences.length === 0 ? (
                            <p className="py-8 text-center text-sm text-gray-400">No references in this period</p>
                        ) : (
                            <>
                                <ResponsiveContainer width="100%" height={160}>
                                    <BarChart data={doctorReferences} margin={{ left: -20, right: 10 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
                                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval={0} />
                                        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={tooltipContentStyle} />
                                        <Bar dataKey="total" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Bills" />
                                    </BarChart>
                                </ResponsiveContainer>
                                <div className="mt-4 space-y-2">
                                    {doctorReferences.map((doc) => (
                                        <div key={doc.id} className="flex items-center justify-between text-sm">
                                            <div className="min-w-0">
                                                <p className="truncate font-medium text-gray-800">{doc.name}</p>
                                                <p className="truncate text-xs text-gray-400">{doc.specialties ?? 'General'}</p>
                                            </div>
                                            <span className="font-semibold text-gray-900">{formatCurrency(doc.total_amount)}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
