import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Banknote, HandCoins, Printer, User } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/format';

interface Item {
    id: number;
    name: string;
    quantity: number;
    price: number;
    total: number;
    type: string;
}
interface Payment {
    id: number;
    amount: number;
    payment_method: string;
    payment_date: string | null;
}
interface Invoice {
    id: number;
    invoice_no: string;
    bill_no: string;
    invoice_date: string | null;
    invoice_time: string | null;
    subtotal: number;
    discount_amount: number;
    doctor_discount: number;
    doctor_commission_percentage: number;
    doctor_commission_amount: number;
    agent_commission_percentage: number;
    agent_commission_amount: number;
    net_amount: number;
    paid_amount: number;
    due_amount: number;
    payment_status: 'Due' | 'Partial' | 'Paid';
    patient: { name: string; phone: string; gender: string | null; address: string | null; patient_category: string | null } | null;
    doctor: { name: string; designation: string | null; phone: string | null } | null;
    agent: { name: string } | null;
    items: Item[];
    payments: Payment[];
}

const statusStyles: Record<string, string> = {
    Paid: 'bg-emerald-50 text-emerald-700',
    Partial: 'bg-amber-50 text-amber-700',
    Due: 'bg-rose-50 text-rose-600',
};

function Row({ label, value, strong = false, tone = '' }: { label: string; value: string; strong?: boolean; tone?: string }) {
    return (
        <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-500">{label}</span>
            <span className={`${strong ? 'text-lg font-bold' : 'text-sm font-medium'} ${tone || 'text-gray-900'}`}>{value}</span>
        </div>
    );
}

export default function BillShow({ invoice }: { invoice: Invoice }) {
    return (
        <AppLayout>
            <Head title={`Bill ${invoice.invoice_no}`} />

            <div className="px-6 py-8">
                <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/bills" className="rounded-xl border border-gray-200 bg-white p-2 text-gray-500 hover:text-gray-900">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{invoice.invoice_no}</h1>
                            <p className="text-sm text-gray-500">
                                {formatDate(invoice.invoice_date)} · Bill #{invoice.bill_no}
                            </p>
                        </div>
                        <span className={`ml-2 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[invoice.payment_status]}`}>
                            {invoice.payment_status}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {invoice.due_amount > 0 ? (
                            <Link
                                href={`/bills/${invoice.id}/collect-payment`}
                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
                            >
                                <Banknote className="h-4 w-4" /> Collect Payment
                            </Link>
                        ) : null}
                        <Link
                            href={`/invoices/${invoice.id}/receipt`}
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            <Printer className="h-4 w-4" /> Receipt
                        </Link>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                    <div className="space-y-6">
                        {/* People */}
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                                <div className="mb-2 flex items-center gap-2 text-gray-400"><User className="h-4 w-4" /><span className="text-xs font-semibold uppercase">Patient</span></div>
                                <p className="font-semibold text-gray-900">{invoice.patient?.name ?? '—'}</p>
                                <p className="text-sm text-gray-500">{invoice.patient?.phone ?? '—'}</p>
                                <p className="text-xs text-gray-400">{invoice.patient?.gender ?? ''}</p>
                            </div>
                            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                                <div className="mb-2 flex items-center gap-2 text-gray-400"><span className="text-xs font-semibold uppercase">Doctor</span></div>
                                <p className="font-semibold text-gray-900">{invoice.doctor?.name ?? '—'}</p>
                                <p className="text-sm text-gray-500">{invoice.doctor?.designation ?? ''}</p>
                            </div>
                            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                                <div className="mb-2 flex items-center gap-2 text-gray-400"><span className="text-xs font-semibold uppercase">Agent</span></div>
                                <p className="font-semibold text-gray-900">{invoice.agent?.name ?? '—'}</p>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        <th className="px-5 py-3.5">Item</th>
                                        <th className="px-5 py-3.5">Type</th>
                                        <th className="px-5 py-3.5 text-center">Qty</th>
                                        <th className="px-5 py-3.5 text-right">Price</th>
                                        <th className="px-5 py-3.5 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {invoice.items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-5 py-3.5 font-medium text-gray-800">{item.name}</td>
                                            <td className="px-5 py-3.5 text-gray-500">{item.type}</td>
                                            <td className="px-5 py-3.5 text-center text-gray-600">{item.quantity}</td>
                                            <td className="px-5 py-3.5 text-right text-gray-600">{formatCurrency(item.price)}</td>
                                            <td className="px-5 py-3.5 text-right font-medium text-gray-900">{formatCurrency(item.total)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Payments */}
                        {invoice.payments.length > 0 ? (
                            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">Payment History</h3>
                                <div className="divide-y divide-gray-50">
                                    {invoice.payments.map((p) => (
                                        <div key={p.id} className="flex items-center justify-between py-2 text-sm">
                                            <span className="capitalize text-gray-600">{p.payment_method.replace('-', ' ')}</span>
                                            <span className="text-gray-400">{p.payment_date ? formatDate(p.payment_date) : ''}</span>
                                            <span className="font-medium text-emerald-600">{formatCurrency(p.amount)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>

                    {/* Summary */}
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-400">Bill Summary</h3>
                            <Row label="Subtotal" value={formatCurrency(invoice.subtotal)} />
                            <Row label="Discount" value={`- ${formatCurrency(invoice.discount_amount)}`} tone="text-rose-500" />
                            <div className="my-2 border-t border-gray-100" />
                            <Row label="Net Amount" value={formatCurrency(invoice.net_amount)} strong tone="text-cyan-600" />
                            <Row label="Paid" value={formatCurrency(invoice.paid_amount)} tone="text-emerald-600" />
                            <Row label="Due" value={formatCurrency(invoice.due_amount)} tone="text-rose-500" />
                        </div>

                        {(invoice.doctor_commission_amount > 0 || invoice.agent_commission_amount > 0) && (
                            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                                <div className="mb-2 flex items-center gap-2 text-gray-400">
                                    <HandCoins className="h-4 w-4" />
                                    <span className="text-sm font-semibold uppercase tracking-wider">Commission</span>
                                </div>
                                {invoice.doctor_commission_amount > 0 && (
                                    <Row label={`Doctor (${invoice.doctor_commission_percentage}%)`} value={formatCurrency(invoice.doctor_commission_amount)} />
                                )}
                                {invoice.agent_commission_amount > 0 && (
                                    <Row label={`Agent (${invoice.agent_commission_percentage}%)`} value={formatCurrency(invoice.agent_commission_amount)} />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
