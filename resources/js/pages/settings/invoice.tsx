import { Head, useForm } from '@inertiajs/react';
import { ImageUp, Loader2, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import AppLayout from '@/layouts/app-layout';

type Field = { key: string; label: string; enabled: boolean; column?: number };

interface Settings {
    business_name: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
    business_logo_url: string | null;
    show_header: boolean;
    header_text: string | null;
    header_text_alignment: string;
    show_footer: boolean;
    footer_text: string | null;
    footer_text_alignment: string;
    show_watermark: boolean;
    watermark_type: string;
    watermark_logo_url: string | null;
    watermark_orientation: string;
    show_qr: boolean;
    invoice_print_top_margin: number;
    fields_columns: string;
    show_test_room_number_on_bill: boolean;
    header_fields: Field[];
    footer_fields: Field[];
    table_columns: Field[];
}

interface Props {
    settings: Settings;
}

const card = 'rounded-2xl border border-gray-100 bg-white p-6 shadow-sm';
const label = 'block text-sm font-medium text-gray-700 mb-1.5';
const input =
    'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition';
const sectionTitle = 'text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4';

function Toggle({ checked, onChange, title, desc }: { checked: boolean; onChange: (v: boolean) => void; title: string; desc?: string }) {
    return (
        <label className="flex cursor-pointer items-center gap-3">
            <div
                onClick={() => onChange(!checked)}
                className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
                <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-700">{title}</p>
                {desc ? <p className="text-xs text-gray-400">{desc}</p> : null}
            </div>
        </label>
    );
}

const alignClass: Record<string, string> = { left: 'text-left', center: 'text-center', right: 'text-right' };
const rotationClass: Record<string, string> = { horizontal: 'rotate-0', diagonal: '-rotate-45', obtuse: 'rotate-45' };

export default function InvoiceSetup({ settings }: Props) {
    const [logoPreview, setLogoPreview] = useState<string | null>(settings.business_logo_url);
    const [watermarkPreview, setWatermarkPreview] = useState<string | null>(settings.watermark_logo_url);
    const [saved, setSaved] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        business_name: settings.business_name ?? '',
        address: settings.address ?? '',
        phone: settings.phone ?? '',
        email: settings.email ?? '',
        website: settings.website ?? '',
        business_logo: null as File | null,
        remove_business_logo: false as boolean,
        show_header: settings.show_header,
        header_text: settings.header_text ?? '',
        header_text_alignment: settings.header_text_alignment,
        show_footer: settings.show_footer,
        footer_text: settings.footer_text ?? '',
        footer_text_alignment: settings.footer_text_alignment,
        show_watermark: settings.show_watermark,
        watermark_type: settings.watermark_type,
        watermark_logo: null as File | null,
        remove_watermark_logo: false as boolean,
        watermark_orientation: settings.watermark_orientation,
        show_qr: settings.show_qr,
        invoice_print_top_margin: settings.invoice_print_top_margin,
        fields_columns: settings.fields_columns,
        show_test_room_number_on_bill: settings.show_test_room_number_on_bill,
        header_fields: settings.header_fields,
        footer_fields: settings.footer_fields,
        table_columns: settings.table_columns,
    });

    const patch = setData;

    const updateField = (listKey: 'header_fields' | 'footer_fields' | 'table_columns', fieldKey: string, changes: Partial<Field>) => {
        setData(
            listKey,
            data[listKey].map((f) => (f.key === fieldKey ? { ...f, ...changes } : f)),
        );
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        setSaved(false);
        post('/settings/invoice', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setSaved(true);
                setData('business_logo', null);
                setData('watermark_logo', null);
                setData('remove_business_logo', false);
                setData('remove_watermark_logo', false);
            },
        });
    };

    // preview helpers
    const enabledHeader = data.header_fields.filter((f) => f.enabled);
    const previewValue: Record<string, string> = {
        patient_id: 'PID-1024',
        patient_name: 'Rahim Uddin',
        sex: 'Male',
        age: '34 Yrs',
        bill_no: 'INV-20260723-AB12',
        bill_date_time: '23/07/2026, 11:30 AM',
        contact_no: '01711-000000',
        patient_type: 'Outdoor',
        method: 'cash',
        refer_by: 'Dr. Karim Ahmed',
    };

    return (
        <AppLayout>
            <Head title="Invoice Setup" />

            <div className="px-6 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Invoice Setup</h1>
                    <p className="mt-1 text-sm text-gray-500">Configure the letterhead, fields and columns that appear on the printed money receipt.</p>
                </div>

                {saved ? (
                    <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                        Invoice settings saved.
                    </div>
                ) : null}

                <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
                    {/* ── Controls ─────────────────────────────────────── */}
                    <div className="space-y-6">
                        {/* Business / letterhead */}
                        <div className={card}>
                            <h2 className={sectionTitle}>Business / Letterhead</h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <label className={label}>Business Name</label>
                                    <input value={data.business_name} onChange={(e) => patch('business_name', e.target.value)} className={input} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className={label}>Address</label>
                                    <input value={data.address} onChange={(e) => patch('address', e.target.value)} className={input} />
                                </div>
                                <div>
                                    <label className={label}>Phone</label>
                                    <input value={data.phone} onChange={(e) => patch('phone', e.target.value)} className={input} />
                                </div>
                                <div>
                                    <label className={label}>Email</label>
                                    <input value={data.email} onChange={(e) => patch('email', e.target.value)} className={input} />
                                </div>
                                <div>
                                    <label className={label}>Website</label>
                                    <input value={data.website} onChange={(e) => patch('website', e.target.value)} className={input} />
                                </div>
                                <div>
                                    <label className={label}>Logo</label>
                                    <div className="flex items-center gap-3">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="logo" className="h-12 w-12 rounded border border-gray-200 object-contain" />
                                        ) : null}
                                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">
                                            <ImageUp className="h-4 w-4" /> Upload
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0] ?? null;
                                                    patch('business_logo', file);
                                                    patch('remove_business_logo', false);
                                                    setLogoPreview(file ? URL.createObjectURL(file) : logoPreview);
                                                }}
                                            />
                                        </label>
                                        {logoPreview ? (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    patch('business_logo', null);
                                                    patch('remove_business_logo', true);
                                                    setLogoPreview(null);
                                                }}
                                                className="text-gray-400 hover:text-rose-500"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        ) : null}
                                    </div>
                                    {errors.business_logo ? <p className="mt-1 text-xs text-rose-500">{errors.business_logo}</p> : null}
                                </div>
                            </div>
                        </div>

                        {/* Header & footer */}
                        <div className={card}>
                            <h2 className={sectionTitle}>Header & Footer</h2>
                            <div className="space-y-4">
                                <Toggle checked={data.show_header} onChange={(v) => patch('show_header', v)} title="Show header" desc="Display letterhead/business info at the top." />
                                {data.show_header ? (
                                    <div className="grid gap-3 md:grid-cols-[1fr_140px]">
                                        <div>
                                            <label className={label}>Custom header text (optional)</label>
                                            <textarea value={data.header_text} onChange={(e) => patch('header_text', e.target.value)} rows={2} className={input} placeholder="Overrides logo/business block if set" />
                                        </div>
                                        <div>
                                            <label className={label}>Alignment</label>
                                            <select value={data.header_text_alignment} onChange={(e) => patch('header_text_alignment', e.target.value)} className={input}>
                                                <option value="left">Left</option>
                                                <option value="center">Center</option>
                                                <option value="right">Right</option>
                                            </select>
                                        </div>
                                    </div>
                                ) : null}

                                <div className="border-t border-gray-100 pt-4">
                                    <Toggle checked={data.show_footer} onChange={(v) => patch('show_footer', v)} title="Show footer note" desc="Printed at the bottom of the receipt." />
                                    {data.show_footer ? (
                                        <div className="mt-3 grid gap-3 md:grid-cols-[1fr_140px]">
                                            <div>
                                                <label className={label}>Footer text</label>
                                                <textarea value={data.footer_text} onChange={(e) => patch('footer_text', e.target.value)} rows={2} className={input} />
                                            </div>
                                            <div>
                                                <label className={label}>Alignment</label>
                                                <select value={data.footer_text_alignment} onChange={(e) => patch('footer_text_alignment', e.target.value)} className={input}>
                                                    <option value="left">Left</option>
                                                    <option value="center">Center</option>
                                                    <option value="right">Right</option>
                                                </select>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        {/* Watermark, QR, margin */}
                        <div className={card}>
                            <h2 className={sectionTitle}>Watermark, QR & Print</h2>
                            <div className="space-y-4">
                                <Toggle checked={data.show_watermark} onChange={(v) => patch('show_watermark', v)} title="Show watermark" />
                                {data.show_watermark ? (
                                    <div className="grid gap-3 md:grid-cols-3">
                                        <div>
                                            <label className={label}>Type</label>
                                            <select value={data.watermark_type} onChange={(e) => patch('watermark_type', e.target.value)} className={input}>
                                                <option value="payment_status">Payment Status</option>
                                                <option value="logo">Logo</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className={label}>Orientation</label>
                                            <select value={data.watermark_orientation} onChange={(e) => patch('watermark_orientation', e.target.value)} className={input}>
                                                <option value="horizontal">Horizontal</option>
                                                <option value="diagonal">Diagonal</option>
                                                <option value="obtuse">Obtuse</option>
                                            </select>
                                        </div>
                                        {data.watermark_type === 'logo' ? (
                                            <div>
                                                <label className={label}>Watermark Logo</label>
                                                <div className="flex items-center gap-2">
                                                    {watermarkPreview ? <img src={watermarkPreview} alt="wm" className="h-10 w-10 rounded border border-gray-200 object-contain" /> : null}
                                                    <label className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 hover:bg-gray-100">
                                                        <ImageUp className="h-3.5 w-3.5" /> Upload
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0] ?? null;
                                                                patch('watermark_logo', file);
                                                                patch('remove_watermark_logo', false);
                                                                setWatermarkPreview(file ? URL.createObjectURL(file) : watermarkPreview);
                                                            }}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                ) : null}

                                <div className="grid gap-4 border-t border-gray-100 pt-4 md:grid-cols-2">
                                    <Toggle checked={data.show_qr} onChange={(v) => patch('show_qr', v)} title="Show QR code" desc="Adds a verification QR in the footer." />
                                    <div>
                                        <label className={label}>Print top margin (inch)</label>
                                        <input type="number" step="0.1" min={0} max={5} value={data.invoice_print_top_margin} onChange={(e) => patch('invoice_print_top_margin', Number(e.target.value || 0))} className={input} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Patient info fields */}
                        <div className={card}>
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className={`${sectionTitle} mb-0`}>Patient Info Fields</h2>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="text-gray-400">Columns:</span>
                                    <select value={data.fields_columns} onChange={(e) => patch('fields_columns', e.target.value)} className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1">
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {data.header_fields.map((f) => (
                                    <div key={f.key} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-3 py-2">
                                        <label className="flex items-center gap-2 text-sm text-gray-700">
                                            <input type="checkbox" checked={f.enabled} onChange={(e) => updateField('header_fields', f.key, { enabled: e.target.checked })} className="h-4 w-4 accent-blue-600" />
                                            {f.label}
                                        </label>
                                        <select
                                            value={f.column ?? 0}
                                            onChange={(e) => updateField('header_fields', f.key, { column: Number(e.target.value) })}
                                            className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs"
                                        >
                                            <option value={1}>Column 1</option>
                                            <option value={2}>Column 2</option>
                                            <option value={0}>Full width</option>
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Table columns & footer summary */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className={card}>
                                <h2 className={sectionTitle}>Table Columns</h2>
                                <div className="space-y-2">
                                    {data.table_columns.map((c) => (
                                        <label key={c.key} className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                                            <input type="checkbox" checked={c.enabled} onChange={(e) => updateField('table_columns', c.key, { enabled: e.target.checked })} className="h-4 w-4 accent-blue-600" />
                                            {c.label}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className={card}>
                                <h2 className={sectionTitle}>Footer Summary</h2>
                                <div className="space-y-2">
                                    {data.footer_fields.map((f) => (
                                        <label key={f.key} className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                                            <input type="checkbox" checked={f.enabled} onChange={(e) => updateField('footer_fields', f.key, { enabled: e.target.checked })} className="h-4 w-4 accent-blue-600" />
                                            {f.label}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button type="submit" disabled={processing} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">
                            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Save Settings
                        </button>
                    </div>

                    {/* ── Live preview ─────────────────────────────────── */}
                    <div className="xl:sticky xl:top-6 xl:self-start">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">Live Preview</p>
                        <div className="relative rounded-2xl border border-gray-200 bg-white p-5 text-black shadow-sm">
                            {data.show_header ? (
                                <div className={alignClass[data.header_text_alignment] ?? 'text-center'}>
                                    {data.header_text ? (
                                        <div className="whitespace-pre-line text-[11px]">{data.header_text}</div>
                                    ) : (
                                        <div className={`flex items-center gap-2 ${data.header_text_alignment === 'center' ? 'justify-center' : data.header_text_alignment === 'right' ? 'justify-end' : 'justify-start'}`}>
                                            {logoPreview ? <img src={logoPreview} alt="" className="h-8 object-contain" /> : null}
                                            <div>
                                                <p className="text-base font-black uppercase">{data.business_name || 'Business Name'}</p>
                                                <p className="text-[10px] text-gray-600">{data.address}</p>
                                                <p className="text-[10px] text-gray-600">{[data.phone, data.email].filter(Boolean).join(' • ')}</p>
                                            </div>
                                        </div>
                                    )}
                                    <hr className="mt-1 border-gray-400" />
                                </div>
                            ) : null}

                            <div className="mt-2 border-y-2 border-black py-0.5 text-center text-sm font-black">Money Receipt</div>

                            <div className={`mt-2 grid ${data.fields_columns === '2' ? 'grid-cols-2' : 'grid-cols-1'} gap-x-3 text-[10px]`}>
                                {enabledHeader.filter((f) => (f.column ?? 0) !== 0 && (data.fields_columns === '1' || f.column === 1)).map((f) => (
                                    <div key={f.key} className="flex gap-1">
                                        <span className="w-[70px] shrink-0">{f.label}</span>:
                                        <b className="uppercase">{previewValue[f.key]}</b>
                                    </div>
                                ))}
                                {data.fields_columns === '2' ? (
                                    <div className="space-y-0.5">
                                        {enabledHeader.filter((f) => f.column === 2).map((f) => (
                                            <div key={f.key} className="flex gap-1">
                                                <span className="w-[70px] shrink-0">{f.label}</span>:
                                                <b className="uppercase">{previewValue[f.key]}</b>
                                            </div>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                            {enabledHeader.filter((f) => (f.column ?? 0) === 0).map((f) => (
                                <div key={f.key} className="mt-0.5 flex gap-1 text-[10px]">
                                    <span className="w-[70px] shrink-0">{f.label}</span>:
                                    <b className="uppercase">{previewValue[f.key]}</b>
                                </div>
                            ))}

                            <table className="mt-2 w-full table-fixed border-collapse border border-black text-[9px]">
                                <thead>
                                    <tr>
                                        {data.table_columns.filter((c) => c.enabled).map((c) => (
                                            <th key={c.key} className="border border-black px-1 py-0.5">{c.label}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-gray-100">
                                        {data.table_columns.filter((c) => c.enabled).map((c) => (
                                            <td key={c.key} className="border border-black px-1 py-0.5 text-center">
                                                {c.key === 'service_particular' ? 'CBC' : c.key === 'sl' ? '1' : c.key === 'qty' ? '1' : '500.00'}
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>

                            <div className="mt-2 flex flex-col items-end gap-0.5 text-[10px]">
                                {data.footer_fields.filter((f) => f.enabled).map((f) => (
                                    <div key={f.key} className="flex w-32 justify-between">
                                        <span>{f.label}</span>
                                        <b>500.00</b>
                                    </div>
                                ))}
                            </div>

                            {data.show_watermark ? (
                                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10">
                                    <span className={`text-4xl font-black uppercase text-gray-500 ${rotationClass[data.watermark_orientation]}`}>
                                        {data.watermark_type === 'logo' ? 'LOGO' : 'PAID'}
                                    </span>
                                </div>
                            ) : null}

                            {data.show_footer && data.footer_text ? (
                                <p className={`mt-3 border-t border-gray-300 pt-1 text-[9px] text-gray-600 ${alignClass[data.footer_text_alignment] ?? 'text-center'}`}>{data.footer_text}</p>
                            ) : null}
                        </div>
                        <p className="mt-2 text-xs text-gray-400">Preview uses sample data. Print a real bill receipt to see the final output.</p>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
