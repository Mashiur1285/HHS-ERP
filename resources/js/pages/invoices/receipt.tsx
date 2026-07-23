import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Printer } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

type ReceiptPatient = {
    id: number;
    patient_id: string | null;
    name: string;
    phone: string | null;
    gender: string | null;
    age: number | null;
    address: string | null;
    patient_category: string | null;
};

type ReceiptDoctor = { id: number; name: string; designation: string | null; phone: string | null };
type ReceiptItem = { id: number; name: string; quantity: number; price: number; total: number; type: string };
type ReceiptPayment = { id: number; amount: number; payment_method: string; payment_date: string | null };

type ReceiptInvoice = {
    id: number;
    invoice_no: string;
    bill_no: string | null;
    invoice_date: string | null;
    invoice_time: string | null;
    created_at: string | null;
    subtotal: number;
    discount_amount: number;
    net_amount: number;
    paid_amount: number;
    due_amount: number;
    payment_status: string;
    patient: ReceiptPatient | null;
    doctor: ReceiptDoctor | null;
    items: ReceiptItem[];
    payments: ReceiptPayment[];
};

type Field = { key: string; label: string; enabled: boolean; column?: number };

type Settings = {
    business_name: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
    business_logo_url: string | null;
    show_header: boolean;
    header_text: string | null;
    header_text_alignment: 'left' | 'center' | 'right';
    show_footer: boolean;
    footer_text: string | null;
    footer_text_alignment: 'left' | 'center' | 'right';
    show_watermark: boolean;
    watermark_type: 'payment_status' | 'logo';
    watermark_logo_url: string | null;
    watermark_orientation: 'horizontal' | 'diagonal' | 'obtuse';
    show_qr: boolean;
    invoice_print_top_margin: number;
    fields_columns: '1' | '2';
    header_fields: Field[];
    footer_fields: Field[];
    table_columns: Field[];
};

interface Props {
    invoice: ReceiptInvoice;
    settings: Settings;
    verifyUrl: string;
}

function formatNumber(value: number) {
    return Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function toWordsUnderThousand(value: number): string {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    if (value < 20) return ones[value];
    if (value < 100) return `${tens[Math.floor(value / 10)]}${value % 10 ? ` ${ones[value % 10]}` : ''}`;
    return `${ones[Math.floor(value / 100)]} Hundred${value % 100 ? ` ${toWordsUnderThousand(value % 100)}` : ''}`;
}
function amountToWords(value: number) {
    const integer = Math.floor(value);
    if (integer === 0) return 'Zero Taka';
    const parts: string[] = [];
    const millions = Math.floor(integer / 1000000);
    const thousands = Math.floor((integer % 1000000) / 1000);
    const remainder = integer % 1000;
    if (millions) parts.push(`${toWordsUnderThousand(millions)} Million`);
    if (thousands) parts.push(`${toWordsUnderThousand(thousands)} Thousand`);
    if (remainder) parts.push(toWordsUnderThousand(remainder));
    return `${parts.join(' ')} Taka`;
}

const alignClass: Record<string, string> = { left: 'text-left', center: 'text-center', right: 'text-right' };
const watermarkRotation: Record<string, string> = { horizontal: 'rotate-0', diagonal: '-rotate-45', obtuse: 'rotate-45' };

export default function InvoiceReceipt({ invoice, settings, verifyUrl }: Props) {
    const page = usePage<{ auth?: { user?: { name?: string } } }>();
    const postedBy = page.props.auth?.user?.name ?? 'N/A';
    const status = (invoice.payment_status || '').toUpperCase();

    const billDateTime = invoice.created_at ?? [invoice.invoice_date, invoice.invoice_time].filter(Boolean).join(', ');

    // ── Header field value resolver ───────────────────────────────
    const headerValue = (key: string): string => {
        const map: Record<string, string> = {
            patient_id: invoice.patient?.patient_id || `PID-${invoice.patient?.id ?? ''}`,
            patient_name: invoice.patient?.name || '-',
            sex: invoice.patient?.gender || '-',
            age: invoice.patient?.age != null ? `${invoice.patient.age} Yrs` : '-',
            bill_no: invoice.invoice_no,
            bill_date_time: billDateTime || '-',
            contact_no: invoice.patient?.phone || '-',
            patient_type: invoice.patient?.patient_category || 'Outdoor',
            method: (invoice.payments[0]?.payment_method || 'cash').replace('-', ' '),
            refer_by: invoice.doctor?.name || '-',
        };
        return map[key] ?? '-';
    };

    const enabledHeader = settings.header_fields.filter((f) => f.enabled);
    const fullWidthFields = enabledHeader.filter((f) => (f.column ?? 0) === 0);
    const col1 = enabledHeader.filter((f) => f.column === 1);
    const col2 = enabledHeader.filter((f) => f.column === 2);
    const singleColFields = enabledHeader.filter((f) => (f.column ?? 0) !== 0);

    const infoRow = (f: Field) => (
        <div key={f.key} className="flex justify-start gap-1">
            <span className="flex w-[92px] shrink-0 justify-between">
                <span>{f.label}</span>
                <span className="font-semibold">:</span>
            </span>
            <b className="uppercase">{headerValue(f.key)}</b>
        </div>
    );

    // ── Table columns ─────────────────────────────────────────────
    const cols = settings.table_columns.filter((c) => c.enabled);
    const colWidth: Record<string, string> = {
        sl: 'w-[8%]',
        service_particular: 'w-auto',
        delivery_date: 'w-[16%]',
        amount: 'w-[15%]',
        qty: 'w-[12%]',
        amount_tk: 'w-[16%]',
    };
    const cellAlign = (key: string) => (key === 'service_particular' ? 'text-left' : key === 'amount' || key === 'amount_tk' ? 'text-right' : 'text-center');
    const cellValue = (item: ReceiptItem, index: number, key: string): string => {
        const map: Record<string, string> = {
            sl: String(index + 1),
            service_particular: item.name,
            delivery_date: '-',
            amount: formatNumber(item.price),
            qty: String(item.quantity),
            amount_tk: formatNumber(item.total),
        };
        return map[key] ?? '';
    };

    // ── Footer summary ────────────────────────────────────────────
    const footerValue: Record<string, number> = {
        sub_total: invoice.subtotal,
        discount: invoice.discount_amount,
        total: invoice.net_amount,
        paid: invoice.paid_amount,
        due: invoice.due_amount,
    };
    const summary = settings.footer_fields
        .filter((f) => f.enabled)
        .filter((f) => !(f.key === 'due' && invoice.due_amount <= 0))
        .map((f) => ({ label: f.label, value: footerValue[f.key] ?? 0 }));
    const footerColspan = Math.max(1, cols.length - 2);

    const printStyles = `
@media print {
    @page { size: A5; margin: ${(settings.invoice_print_top_margin || 0.5).toFixed(2)}in 8mm 8mm 8mm; }
    body { margin: 0 !important; }
    .no-print { display: none !important; }
    .receipt-sheet { box-shadow: none !important; border: 0 !important; margin: 0 !important; width: 100% !important; max-width: 100% !important; }
    aside, header, nav { display: none !important; }
}`;

    return (
        <AppLayout>
            <Head title={`Receipt ${invoice.invoice_no}`} />
            <style>{printStyles}</style>

            <div className="min-h-[calc(100vh-4rem)] bg-slate-100 px-4 py-6 print:bg-white print:p-0">
                <div className="no-print mx-auto mb-4 flex max-w-[600px] items-center justify-between">
                    <Link href="/bills" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300">
                        <ArrowLeft className="h-4 w-4" /> Back to Bills
                    </Link>
                    <div className="flex items-center gap-2">
                        <Link href="/settings/invoice" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300">
                            Invoice Setup
                        </Link>
                        <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700">
                            <Printer className="h-4 w-4" /> Print
                        </button>
                    </div>
                </div>

                <div className="receipt-sheet mx-auto max-w-[600px] bg-white px-6 py-5 text-black shadow-lg print:max-w-none print:px-0 print:shadow-none">
                    {/* Header / letterhead */}
                    {settings.show_header ? (
                        <div className={alignClass[settings.header_text_alignment] ?? 'text-center'}>
                            {settings.header_text ? (
                                <div className="whitespace-pre-line text-[12px]">{settings.header_text}</div>
                            ) : (
                                <div className={`flex items-center gap-3 ${settings.header_text_alignment === 'center' ? 'justify-center' : settings.header_text_alignment === 'right' ? 'justify-end' : 'justify-start'}`}>
                                    {settings.business_logo_url ? (
                                        <img src={settings.business_logo_url} alt="logo" className="h-[54px] object-contain mix-blend-multiply" />
                                    ) : null}
                                    <div className={alignClass[settings.header_text_alignment] ?? 'text-center'}>
                                        <h1 className="text-xl font-black uppercase tracking-wide">{settings.business_name}</h1>
                                        {settings.address ? <p className="text-[11px] text-gray-700">{settings.address}</p> : null}
                                        <p className="text-[11px] text-gray-700">
                                            {settings.phone ? <>Phone: {settings.phone}</> : null}
                                            {settings.phone && settings.email ? ' • ' : ''}
                                            {settings.email}
                                            {settings.website ? ` • ${settings.website}` : ''}
                                        </p>
                                    </div>
                                </div>
                            )}
                            <hr className="mt-1 border-gray-400" />
                        </div>
                    ) : null}

                    {/* Money Receipt title bar */}
                    <div className="mt-2 grid min-h-[38px] grid-cols-[1fr_auto_1fr] items-center gap-2 border-y-2 border-solid border-black py-1">
                        <div />
                        <p className="text-center text-lg font-black">Money Receipt</p>
                        <div className="flex flex-col items-end justify-center">
                            <div aria-hidden="true" className="h-5 w-28 bg-[repeating-linear-gradient(90deg,_#000_0px,_#000_1.5px,_transparent_1.5px,_transparent_3px,_#000_3px,_#000_4px,_transparent_4px,_transparent_6px)]" />
                            <span className="mt-0.5 text-[9px] tracking-wider">{invoice.invoice_no}</span>
                        </div>
                    </div>

                    {/* Bill info */}
                    <section className="mt-2">
                        {settings.fields_columns === '2' ? (
                            <div className="grid grid-cols-2 gap-x-4 text-[12px]">
                                <div className="space-y-0.5">{col1.map(infoRow)}</div>
                                <div className="space-y-0.5">{col2.map(infoRow)}</div>
                            </div>
                        ) : (
                            <div className="space-y-0.5 text-[12px]">{singleColFields.map(infoRow)}</div>
                        )}
                        {fullWidthFields.map((f) => (
                            <div key={f.key} className="mt-0.5 flex justify-start gap-1 text-[12px]">
                                <span className="flex w-[92px] shrink-0 justify-between">
                                    <span>{f.label}</span>
                                    <span className="font-semibold">:</span>
                                </span>
                                <b className="uppercase">{headerValue(f.key)}</b>
                            </div>
                        ))}
                    </section>

                    {/* Items table + watermark */}
                    <div className="relative mt-2">
                        <table className="w-full table-fixed border-collapse border border-solid border-black">
                            <colgroup>
                                {cols.map((c) => (
                                    <col key={c.key} className={colWidth[c.key] ?? ''} />
                                ))}
                            </colgroup>
                            <thead>
                                <tr>
                                    {cols.map((c) => (
                                        <th key={c.key} className={`border border-solid border-black px-1 py-1 text-xs font-semibold text-gray-900 ${cellAlign(c.key)}`}>
                                            {c.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="text-gray-800">
                                {invoice.items.map((item, i) => (
                                    <tr key={item.id} className={i % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                        {cols.map((c) => (
                                            <td key={c.key} className={`border border-solid border-black px-1 py-0.5 text-xs ${cellAlign(c.key)}`}>
                                                {cellValue(item, i, c.key)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                {summary.map((row, index) => (
                                    <tr key={row.label}>
                                        {index === 0 ? (
                                            <td rowSpan={summary.length} colSpan={footerColspan} className="border-0 px-1 py-1 align-bottom">
                                                <div className="flex justify-center">
                                                    <div className="inline-flex h-8 min-w-[68px] items-center justify-center rounded-full border-2 border-solid border-black px-3 text-xs font-bold uppercase leading-none">
                                                        {status}
                                                    </div>
                                                </div>
                                                <div className="mt-2 text-[10px] font-semibold capitalize italic leading-tight">
                                                    In words : {amountToWords(Number(invoice.net_amount))} only
                                                </div>
                                            </td>
                                        ) : null}
                                        <td className="border border-solid border-black px-1 py-0.5 text-xs font-medium">{row.label}</td>
                                        <td className="border border-solid border-black px-1 py-0.5 text-right text-xs font-medium">{formatNumber(row.value)}</td>
                                    </tr>
                                ))}
                            </tfoot>
                        </table>

                        {/* Watermark */}
                        {settings.show_watermark ? (
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10">
                                {settings.watermark_type === 'logo' && settings.watermark_logo_url ? (
                                    <img src={settings.watermark_logo_url} alt="" className={`h-[220px] w-[220px] object-contain ${watermarkRotation[settings.watermark_orientation]}`} />
                                ) : (
                                    <span className={`text-[3.5rem] font-black uppercase text-gray-500 ${watermarkRotation[settings.watermark_orientation]}`}>{status}</span>
                                )}
                            </div>
                        ) : null}
                    </div>

                    {/* Footer */}
                    <section className="mt-8 print:mt-6">
                        <div className="flex items-end justify-between">
                            <div className="flex flex-col items-center gap-1 text-center">
                                <div className="h-8 w-32 border-b border-solid border-black" />
                                <div className="text-[10px] font-semibold leading-none">Authorized Signature</div>
                            </div>
                            {settings.show_qr ? (
                                <div className="text-center text-[9px] text-gray-500">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=${encodeURIComponent(verifyUrl)}`}
                                        alt="QR"
                                        className="mx-auto mb-1 h-14 w-14 print:hidden"
                                    />
                                    <div className="mx-auto mb-1 hidden h-14 w-14 items-center justify-center border border-dashed border-gray-400 print:flex">QR</div>
                                    <span>Scan to verify</span>
                                </div>
                            ) : (
                                <div />
                            )}
                            <div className="w-1/3 text-right text-[11px]">
                                <p>Posted By: <span className="font-semibold">{postedBy}</span></p>
                            </div>
                        </div>

                        {settings.show_footer && settings.footer_text ? (
                            <>
                                <hr className="mt-3 border-gray-400" />
                                <div className={`mt-1 whitespace-pre-line text-[10px] text-gray-600 ${alignClass[settings.footer_text_alignment] ?? 'text-center'}`}>
                                    {settings.footer_text}
                                </div>
                            </>
                        ) : (
                            <p className="mt-4 text-center text-[9px] text-gray-400">This is a computer-generated receipt.</p>
                        )}
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
