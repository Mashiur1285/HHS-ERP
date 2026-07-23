import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Banknote, ChevronDown } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/format';

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
    net_amount: number;
    paid_amount: number;
    due_amount: number;
    payment_status: string;
    patient: string | null;
    patient_phone: string | null;
    payments: Payment[];
}

const inputClasses =
    'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100';

export default function CollectPayment({ invoice }: { invoice: Invoice }) {
    const { data, setData, put, processing, errors } = useForm({
        amount: invoice.due_amount,
        payment_method: 'cash',
        note: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/bills/${invoice.id}/collect-payment`, { preserveScroll: true });
    };

    return (
        <AppLayout>
            <Head title={`Collect Payment · ${invoice.invoice_no}`} />

            <div className="px-6 py-8">
                <div className="mb-6 flex items-center gap-3">
                    <Link href={`/bills/${invoice.id}`} className="rounded-xl border border-gray-200 bg-white p-2 text-gray-500 hover:text-gray-900">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Collect Payment</h1>
                        <p className="text-sm text-gray-500">{invoice.invoice_no} · {invoice.patient ?? '—'}</p>
                    </div>
                </div>

                <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Outstanding</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between"><span className="text-sm text-gray-500">Net Amount</span><span className="font-medium text-gray-900">{formatCurrency(invoice.net_amount)}</span></div>
                            <div className="flex items-center justify-between"><span className="text-sm text-gray-500">Already Paid</span><span className="font-medium text-emerald-600">{formatCurrency(invoice.paid_amount)}</span></div>
                            <div className="border-t border-gray-100 pt-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-base font-semibold text-gray-700">Due</span>
                                    <span className="text-2xl font-bold text-rose-500">{formatCurrency(invoice.due_amount)}</span>
                                </div>
                            </div>
                        </div>

                        {invoice.payments.length > 0 ? (
                            <div className="mt-6">
                                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">History</p>
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

                    <form onSubmit={submit} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">New Payment</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">Amount</label>
                                <input
                                    type="number"
                                    min={0.01}
                                    max={invoice.due_amount}
                                    step="0.01"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', Number(e.target.value || 0))}
                                    className={inputClasses}
                                />
                                {errors.amount ? <p className="mt-1 text-xs text-rose-500">{errors.amount}</p> : null}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">Method</label>
                                <div className="relative">
                                    <select
                                        value={data.payment_method}
                                        onChange={(e) => setData('payment_method', e.target.value)}
                                        className={`${inputClasses} appearance-none pr-10`}
                                    >
                                        <option value="cash">Cash</option>
                                        <option value="card">Card</option>
                                        <option value="mobile-banking">Mobile Banking</option>
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">Note (optional)</label>
                                <input type="text" value={data.note} onChange={(e) => setData('note', e.target.value)} className={inputClasses} placeholder="Reference / remarks" />
                            </div>

                            <button
                                type="submit"
                                disabled={processing || data.amount <= 0}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                            >
                                <Banknote className="h-4 w-4" />
                                {processing ? 'Processing...' : `Collect ${formatCurrency(data.amount)}`}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
