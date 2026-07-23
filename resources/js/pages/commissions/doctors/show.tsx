import DateRangeFilter from '@/components/date-range-filter';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/format';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BadgePercent, MapPin, Mail, Phone, Stethoscope } from 'lucide-react';

interface Doctor {
    id: number;
    name: string;
    specialties: string | null;
    designation: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    commission_percentage: number;
}

interface Reference {
    name: string;
    short_name: string | null;
    ref_count: number;
    test_amount: number;
    commission_total: number;
}

interface Props {
    doctor: Doctor;
    references: Reference[];
    totalRefer: number;
    totalCommission: number;
    filters: { start_date: string; end_date: string; search: string | null };
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Phone; label: string; value: string }) {
    return (
        <div className="flex items-start gap-3">
            <span className="mt-0.5 rounded-lg bg-gray-50 p-2 text-gray-400">
                <Icon className="h-4 w-4" />
            </span>
            <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
                <p className="text-sm text-gray-700">{value}</p>
            </div>
        </div>
    );
}

export default function DoctorCommissionShow({ doctor, references, totalRefer, totalCommission, filters }: Props) {
    return (
        <AppLayout>
            <Head title={doctor.name} />

            <div className="px-6 py-8">
                <div className="mb-6 flex items-center gap-3">
                    <Link
                        href="/commissions/doctors"
                        className="rounded-xl border border-gray-200 bg-white p-2 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{doctor.name}</h1>
                        <p className="mt-1 text-sm text-gray-500">{doctor.specialties ?? '—'}</p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                    <div>
                        <div className="mb-4">
                            <DateRangeFilter
                                routeUrl={`/commissions/doctors/${doctor.id}`}
                                startDate={filters.start_date}
                                endDate={filters.end_date}
                                extra={{ search: filters.search ?? '' }}
                            />
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                                <h2 className="text-sm font-semibold text-gray-900">Test References</h2>
                                <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                    Total Refer: {totalRefer}
                                </span>
                            </div>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        <th className="px-5 py-3.5">Test Name</th>
                                        <th className="px-5 py-3.5 text-right">Number of Refer</th>
                                        <th className="px-5 py-3.5 text-right">Test Amount</th>
                                        <th className="px-5 py-3.5 text-right">Commission</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {references.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="py-12 text-center text-gray-400">No test references found</td>
                                        </tr>
                                    ) : (
                                        references.map((ref, i) => (
                                            <tr key={i} className="hover:bg-gray-50">
                                                <td className="px-5 py-4">
                                                    <p className="font-medium text-gray-900">{ref.name}</p>
                                                    <p className="text-xs text-gray-400">{ref.short_name ?? '—'}</p>
                                                </td>
                                                <td className="px-5 py-4 text-right text-gray-600">{ref.ref_count}</td>
                                                <td className="px-5 py-4 text-right font-medium text-gray-900">{formatCurrency(ref.test_amount)}</td>
                                                <td className="px-5 py-4 text-right font-bold text-cyan-600">{formatCurrency(ref.commission_total)}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                                {references.length > 0 ? (
                                    <tfoot>
                                        <tr className="border-t border-gray-100 bg-gray-50 text-sm font-semibold text-gray-900">
                                            <td className="px-5 py-4" colSpan={3}>Total Commission</td>
                                            <td className="px-5 py-4 text-right text-cyan-600">{formatCurrency(totalCommission)}</td>
                                        </tr>
                                    </tfoot>
                                ) : null}
                            </table>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <h2 className="mb-5 text-xs font-semibold uppercase tracking-widest text-gray-400">Doctor Information</h2>
                        <div className="space-y-4">
                            <InfoRow icon={Stethoscope} label="Designation" value={doctor.designation ?? '—'} />
                            <InfoRow icon={Stethoscope} label="Specialties" value={doctor.specialties ?? '—'} />
                            <InfoRow icon={Phone} label="Phone" value={doctor.phone ?? '—'} />
                            <InfoRow icon={Mail} label="Email" value={doctor.email ?? '—'} />
                            <InfoRow icon={MapPin} label="Address" value={doctor.address ?? '—'} />
                            <InfoRow icon={BadgePercent} label="Commission" value={`${doctor.commission_percentage}%`} />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
