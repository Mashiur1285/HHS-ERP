import DateRangeFilter from '@/components/date-range-filter';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/format';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, FlaskConical, HandCoins, Search, Stethoscope } from 'lucide-react';
import { useState } from 'react';

interface Row {
    id: number;
    name: string;
    specialties: string | null;
    percentage: number;
    no_of_tests: number;
    test_amount: number;
    invoice_count: number;
    commission_total: number;
}

interface Props {
    doctorReferences: Row[];
    summary: { doctor_count: number; test_amount: number; commission_total: number };
    filters: { start_date: string; end_date: string; search: string | null };
}

function StatCard({ icon: Icon, label, value, tone }: { icon: typeof Stethoscope; label: string; value: string; tone: string }) {
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

export default function DoctorCommissionIndex({ doctorReferences, summary, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const applySearch = () => {
        router.get(
            '/commissions/doctors',
            { start_date: filters.start_date, end_date: filters.end_date, search },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    return (
        <AppLayout>
            <Head title="Doctor Commission Report" />

            <div className="px-6 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Doctor Commission Report</h1>
                    <p className="mt-1 text-sm text-gray-500">Commission earned by referring doctors in the selected period</p>
                </div>

                <div className="mb-6 grid gap-4 sm:grid-cols-3">
                    <StatCard icon={Stethoscope} label="Doctors" value={String(summary.doctor_count)} tone="bg-blue-50 text-blue-600" />
                    <StatCard icon={FlaskConical} label="Test Amount" value={formatCurrency(summary.test_amount)} tone="bg-cyan-50 text-cyan-600" />
                    <StatCard icon={HandCoins} label="Commission Total" value={formatCurrency(summary.commission_total)} tone="bg-emerald-50 text-emerald-600" />
                </div>

                <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <DateRangeFilter
                        routeUrl="/commissions/doctors"
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
                            placeholder="Doctor name"
                            className="bg-transparent text-sm text-gray-700 outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                <th className="px-5 py-3.5">Doctor Name</th>
                                <th className="px-5 py-3.5">Percentage</th>
                                <th className="px-5 py-3.5 text-right">No. of Tests</th>
                                <th className="px-5 py-3.5 text-right">Test Amount</th>
                                <th className="px-5 py-3.5 text-right">Commission Total</th>
                                <th className="px-5 py-3.5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {doctorReferences.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-gray-400">No doctor commissions found</td>
                                </tr>
                            ) : (
                                doctorReferences.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-4">
                                            <p className="font-medium text-gray-900">{row.name}</p>
                                            <p className="text-xs text-gray-400">{row.specialties ?? '—'}</p>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">{`${row.percentage}%`}</td>
                                        <td className="px-5 py-4 text-right text-gray-600">{row.no_of_tests}</td>
                                        <td className="px-5 py-4 text-right font-medium text-gray-900">{formatCurrency(row.test_amount)}</td>
                                        <td className="px-5 py-4 text-right font-bold text-cyan-600">{formatCurrency(row.commission_total)}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end">
                                                <Link
                                                    href={`/commissions/doctors/${row.id}`}
                                                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                                                >
                                                    <Eye className="h-4 w-4" /> Details
                                                </Link>
                                            </div>
                                        </td>
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
