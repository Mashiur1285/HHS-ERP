import { Head, Link, router } from '@inertiajs/react';
import { Banknote, Eye, HandCoins, Plus, ReceiptText, Search, TrendingUp, Wallet } from 'lucide-react';
import { useState } from 'react';
import DateRangeFilter from '@/components/date-range-filter';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/format';

interface BillRow {
    id: number;
    invoice_no: string;
    bill_no: string;
    invoice_date: string | null;
    invoice_time: string | null;
    patient: string;
    patient_phone: string | null;
    doctor: string | null;
    agent: string | null;
    total_items: number;
    net_amount: number;
    paid_amount: number;
    due_amount: number;
    payment_status: 'Due' | 'Partial' | 'Paid';
}

interface Paginated<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
    from: number | null;
    to: number | null;
}

interface Props {
    bills: Paginated<BillRow>;
    summary: { total_bills: number; gross: number; collected: number; due: number };
    filters: { start_date: string; end_date: string; status: string | null; search: string | null };
}

const statusStyles: Record<string, string> = {
    Paid: 'bg-emerald-50 text-emerald-700',
    Partial: 'bg-amber-50 text-amber-700',
    Due: 'bg-rose-50 text-rose-600',
};

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

export default function BillsIndex({ bills, summary, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const applyFilter = (patch: Record<string, string>) => {
        router.get(
            '/bills',
            {
                start_date: filters.start_date,
                end_date: filters.end_date,
                status: filters.status ?? '',
                search,
                ...patch,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    return (
        <AppLayout>
            <Head title="Bills" />

            <div className="px-6 py-8">
                <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Bills</h1>
                        <p className="mt-1 text-sm text-gray-500">{bills.total} bills in the selected period</p>
                    </div>
                    <Link
                        href="/bills/create"
                        className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-700"
                    >
                        <Plus className="h-4 w-4" /> New Bill
                    </Link>
                </div>

                <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard icon={ReceiptText} label="Total Bills" value={String(summary.total_bills)} tone="bg-blue-50 text-blue-600" />
                    <StatCard icon={TrendingUp} label="Gross Amount" value={formatCurrency(summary.gross)} tone="bg-cyan-50 text-cyan-600" />
                    <StatCard icon={Wallet} label="Collected" value={formatCurrency(summary.collected)} tone="bg-emerald-50 text-emerald-600" />
                    <StatCard icon={HandCoins} label="Due" value={formatCurrency(summary.due)} tone="bg-rose-50 text-rose-600" />
                </div>

                <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <DateRangeFilter
                        routeUrl="/bills"
                        startDate={filters.start_date}
                        endDate={filters.end_date}
                        extra={{ status: filters.status ?? '', search: search }}
                    />
                    <div className="flex flex-wrap items-center gap-2">
                        <select
                            value={filters.status ?? ''}
                            onChange={(e) => applyFilter({ status: e.target.value })}
                            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                        >
                            <option value="">All Status</option>
                            <option value="Paid">Paid</option>
                            <option value="Partial">Partial</option>
                            <option value="Due">Due</option>
                        </select>
                        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
                            <Search className="h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilter({ search })}
                                placeholder="Invoice / patient / phone"
                                className="bg-transparent text-sm text-gray-700 outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                <th className="px-5 py-3.5">Invoice</th>
                                <th className="px-5 py-3.5">Patient</th>
                                <th className="px-5 py-3.5">Doctor / Agent</th>
                                <th className="px-5 py-3.5">Date</th>
                                <th className="px-5 py-3.5 text-right">Net</th>
                                <th className="px-5 py-3.5 text-right">Paid</th>
                                <th className="px-5 py-3.5 text-right">Due</th>
                                <th className="px-5 py-3.5 text-center">Status</th>
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {bills.data.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="py-12 text-center text-gray-400">No bills found</td>
                                </tr>
                            ) : (
                                bills.data.map((bill) => (
                                    <tr key={bill.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-4">
                                            <p className="font-medium text-gray-900">{bill.invoice_no}</p>
                                            <p className="text-xs text-gray-400">{bill.total_items} items</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="font-medium text-gray-800">{bill.patient}</p>
                                            <p className="text-xs text-gray-400">{bill.patient_phone ?? '—'}</p>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">
                                            <p>{bill.doctor ?? '—'}</p>
                                            {bill.agent ? <p className="text-xs text-violet-500">Agent: {bill.agent}</p> : null}
                                        </td>
                                        <td className="px-5 py-4 text-gray-500">{bill.invoice_date ?? '—'}</td>
                                        <td className="px-5 py-4 text-right font-medium text-gray-900">{formatCurrency(bill.net_amount)}</td>
                                        <td className="px-5 py-4 text-right text-emerald-600">{formatCurrency(bill.paid_amount)}</td>
                                        <td className="px-5 py-4 text-right text-rose-500">{formatCurrency(bill.due_amount)}</td>
                                        <td className="px-5 py-4 text-center">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[bill.payment_status]}`}>
                                                {bill.payment_status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/bills/${bill.id}`}
                                                    className="rounded-lg p-2 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600"
                                                    title="View"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                {bill.due_amount > 0 ? (
                                                    <Link
                                                        href={`/bills/${bill.id}/collect-payment`}
                                                        className="rounded-lg p-2 text-gray-400 transition hover:bg-emerald-50 hover:text-emerald-600"
                                                        title="Collect payment"
                                                    >
                                                        <Banknote className="h-4 w-4" />
                                                    </Link>
                                                ) : null}
                                                <Link
                                                    href={`/invoices/${bill.id}/receipt`}
                                                    className="rounded-lg p-2 text-gray-400 transition hover:bg-slate-100 hover:text-slate-700"
                                                    title="Receipt"
                                                >
                                                    <ReceiptText className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {bills.links.length > 3 ? (
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-1">
                        {bills.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url, { preserveScroll: true })}
                                className={`rounded-lg px-3 py-1.5 text-sm ${
                                    link.active ? 'bg-cyan-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                                } ${!link.url ? 'cursor-not-allowed opacity-40' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                ) : null}
            </div>
        </AppLayout>
    );
}
