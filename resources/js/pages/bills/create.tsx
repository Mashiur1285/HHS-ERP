import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    BadgePercent,
    Check,
    ChevronDown,
    CreditCard,
    HandCoins,
    Loader2,
    Plus,
    ReceiptText,
    Search,
    Stethoscope,
    TestTubeDiagonal,
    Trash2,
    UserPlus,
    UserRoundSearch,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import AppLayout from '@/layouts/app-layout';

type Patient = {
    id: number;
    first_name: string;
    last_name: string | null;
    phone: string;
    gender: string | null;
    address: string | null;
    patient_category: string | null;
};

type Doctor = {
    id: number;
    first_name: string;
    last_name: string | null;
    personal_number: string | null;
    designation: string | null;
    specialties: string | null;
    commission_percentage: number | string | null;
};

type Agent = {
    id: number;
    name: string;
    agent_id: string;
    commission_rate: number | string;
};

type TestItem = {
    id: number;
    name: string;
    category: string | null;
    short_name: string | null;
    price: number;
    item_type: 'test' | 'additional_item';
};

type InvoiceFormData = {
    patient_id: number | null;
    doctor_id: number | null;
    agent_id: number | null;
    discount_type: 'flat' | 'percent';
    discount_value: number;
    doctor_discount: number;
    doctor_commission_percentage: number;
    agent_commission_percentage: number;
    paid_amount: number;
    payment_method: string;
    tests: Array<{ test_id: number; price: number }>;
    additional_items: Array<{ item_id: number; price: number }>;
};

interface Props {
    patients: Patient[];
    doctors: Doctor[];
    agents: Agent[];
    tests: TestItem[];
    additionalItems: TestItem[];
    commissionSettings: { doctor_commission_on: string; agent_commission_on: string };
}

const panelClasses =
    'rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.28)] md:p-7';
const inputClasses =
    'w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100';

function normalizePhone(value: string) {
    return value.replace(/\D/g, '');
}

function formatCurrency(value: number) {
    return `৳${Math.round(value)}`;
}

function fullName(firstName: string, lastName?: string | null) {
    return `${firstName} ${lastName ?? ''}`.trim();
}

const modalInput =
    'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100';
const modalLabel = 'mb-1 block text-xs font-semibold text-slate-600';

function Modal({ title, subtitle, onClose, children }: { title: string; subtitle?: string; onClose: () => void; children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm" onClick={onClose}>
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="mb-5 flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                        {subtitle ? <p className="text-xs text-slate-500">{subtitle}</p> : null}
                    </div>
                    <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

function SubmitRow({ processing, onClose, label }: { processing: boolean; onClose: () => void; label: string }) {
    return (
        <div className="mt-5 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
                Cancel
            </button>
            <button type="submit" disabled={processing} className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-60">
                {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                {label}
            </button>
        </div>
    );
}

function QuickPatientModal({ onClose }: { onClose: () => void }) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        phone: '',
        gender: 'male',
        patient_category: '',
        redirect_to: 'bills',
    });
    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/patients', { preserveState: true, preserveScroll: true, onSuccess: onClose });
    };
    return (
        <Modal title="Quick Add Patient" subtitle="Add the basics now — complete the rest later from Edit." onClose={onClose}>
            <form onSubmit={submit}>
                <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                        <label className={modalLabel}>First Name *</label>
                        <input value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} className={modalInput} autoFocus />
                        {errors.first_name ? <p className="mt-1 text-xs text-rose-500">{errors.first_name}</p> : null}
                    </div>
                    <div>
                        <label className={modalLabel}>Last Name</label>
                        <input value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} className={modalInput} />
                    </div>
                    <div>
                        <label className={modalLabel}>Phone *</label>
                        <input value={data.phone} onChange={(e) => setData('phone', e.target.value)} className={modalInput} placeholder="01XXXXXXXXX" />
                        {errors.phone ? <p className="mt-1 text-xs text-rose-500">{errors.phone}</p> : null}
                    </div>
                    <div>
                        <label className={modalLabel}>Gender</label>
                        <select value={data.gender} onChange={(e) => setData('gender', e.target.value)} className={modalInput}>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Others</option>
                        </select>
                    </div>
                    <div className="sm:col-span-2">
                        <label className={modalLabel}>Category</label>
                        <input value={data.patient_category} onChange={(e) => setData('patient_category', e.target.value)} className={modalInput} placeholder="e.g. Outdoor" />
                    </div>
                </div>
                <SubmitRow processing={processing} onClose={onClose} label="Save & Select" />
            </form>
        </Modal>
    );
}

function QuickDoctorModal({ onClose }: { onClose: () => void }) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        personal_number: '',
        gender: 'male',
        designation: '',
        specialties: '',
        commission_percentage: 0,
        redirect_to: 'bills',
    });
    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/doctors', { preserveState: true, preserveScroll: true, onSuccess: onClose });
    };
    return (
        <Modal title="Quick Add Doctor" subtitle="Add the basics now — complete the rest later from Edit." onClose={onClose}>
            <form onSubmit={submit}>
                <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                        <label className={modalLabel}>First Name *</label>
                        <input value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} className={modalInput} autoFocus />
                        {errors.first_name ? <p className="mt-1 text-xs text-rose-500">{errors.first_name}</p> : null}
                    </div>
                    <div>
                        <label className={modalLabel}>Last Name</label>
                        <input value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} className={modalInput} />
                    </div>
                    <div>
                        <label className={modalLabel}>Phone *</label>
                        <input value={data.personal_number} onChange={(e) => setData('personal_number', e.target.value)} className={modalInput} placeholder="01XXXXXXXXX" />
                        {errors.personal_number ? <p className="mt-1 text-xs text-rose-500">{errors.personal_number}</p> : null}
                    </div>
                    <div>
                        <label className={modalLabel}>Gender</label>
                        <select value={data.gender} onChange={(e) => setData('gender', e.target.value)} className={modalInput}>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Others</option>
                        </select>
                    </div>
                    <div>
                        <label className={modalLabel}>Designation</label>
                        <input value={data.designation} onChange={(e) => setData('designation', e.target.value)} className={modalInput} />
                    </div>
                    <div>
                        <label className={modalLabel}>Commission (%)</label>
                        <input type="number" min={0} max={100} step="0.01" value={data.commission_percentage} onChange={(e) => setData('commission_percentage', Number(e.target.value || 0))} className={modalInput} />
                    </div>
                    <div className="sm:col-span-2">
                        <label className={modalLabel}>Specialties</label>
                        <input value={data.specialties} onChange={(e) => setData('specialties', e.target.value)} className={modalInput} />
                    </div>
                </div>
                <SubmitRow processing={processing} onClose={onClose} label="Save & Select" />
            </form>
        </Modal>
    );
}

function QuickAgentModal({ onClose }: { onClose: () => void }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        agent_id: '',
        commission_rate: 0,
        contact_number: '',
        address: '',
        redirect_to: 'bills',
    });
    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/agents', { preserveState: true, preserveScroll: true, onSuccess: onClose });
    };
    return (
        <Modal title="Quick Add Agent" subtitle="Add the basics now — complete the rest later from Edit." onClose={onClose}>
            <form onSubmit={submit}>
                <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                        <label className={modalLabel}>Name *</label>
                        <input value={data.name} onChange={(e) => setData('name', e.target.value)} className={modalInput} autoFocus />
                        {errors.name ? <p className="mt-1 text-xs text-rose-500">{errors.name}</p> : null}
                    </div>
                    <div>
                        <label className={modalLabel}>Agent ID *</label>
                        <input value={data.agent_id} onChange={(e) => setData('agent_id', e.target.value)} className={modalInput} placeholder="e.g. AG-001" />
                        {errors.agent_id ? <p className="mt-1 text-xs text-rose-500">{errors.agent_id}</p> : null}
                    </div>
                    <div>
                        <label className={modalLabel}>Commission Rate (%) *</label>
                        <input type="number" min={0} max={100} step="0.01" value={data.commission_rate} onChange={(e) => setData('commission_rate', Number(e.target.value || 0))} className={modalInput} />
                        {errors.commission_rate ? <p className="mt-1 text-xs text-rose-500">{errors.commission_rate}</p> : null}
                    </div>
                    <div>
                        <label className={modalLabel}>Contact Number</label>
                        <input value={data.contact_number} onChange={(e) => setData('contact_number', e.target.value)} className={modalInput} />
                    </div>
                    <div className="sm:col-span-2">
                        <label className={modalLabel}>Address</label>
                        <input value={data.address} onChange={(e) => setData('address', e.target.value)} className={modalInput} />
                    </div>
                </div>
                <SubmitRow processing={processing} onClose={onClose} label="Save & Select" />
            </form>
        </Modal>
    );
}

export default function BillsCreate({ patients, doctors, agents, tests, additionalItems, commissionSettings }: Props) {
    const page = usePage<{
        flash?: {
            newAgent?: { id: number; name: string; agent_id: string; commission_rate: number };
            newPatient?: { id: number; first_name: string; last_name: string | null; phone: string };
            newDoctor?: { id: number; first_name: string; last_name: string | null };
        };
    }>();
    const [phoneQuery, setPhoneQuery] = useState('');
    const [doctorQuery, setDoctorQuery] = useState('');
    const [agentQuery, setAgentQuery] = useState('');
    const [testQuery, setTestQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [submitMessage, setSubmitMessage] = useState('');
    const [patientModalOpen, setPatientModalOpen] = useState(false);
    const [doctorModalOpen, setDoctorModalOpen] = useState(false);
    const [agentModalOpen, setAgentModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<InvoiceFormData>({
        patient_id: null,
        doctor_id: null,
        agent_id: null,
        discount_type: 'flat',
        discount_value: 0,
        doctor_discount: 0,
        doctor_commission_percentage: 0,
        agent_commission_percentage: 0,
        paid_amount: 0,
        payment_method: 'cash',
        tests: [],
        additional_items: [],
    });

    const catalogItems = [...tests, ...additionalItems];
    const categories = ['all', ...new Set(catalogItems.map((test) => test.category || 'Uncategorized'))];

    const phoneMatches = patients.filter((patient) => {
        if (!phoneQuery.trim()) return false;
        return normalizePhone(patient.phone).includes(normalizePhone(phoneQuery));
    });

    const selectedPatient = patients.find((patient) => patient.id === data.patient_id) ?? null;
    const hasPatientSearch = phoneQuery.trim().length > 0;

    const filteredDoctors = doctors.filter((doctor) => {
        if (!doctorQuery.trim()) return false;
        const haystack = [
            fullName(doctor.first_name, doctor.last_name),
            doctor.personal_number ?? '',
            doctor.specialties ?? '',
            doctor.designation ?? '',
        ]
            .join(' ')
            .toLowerCase();
        return haystack.includes(doctorQuery.toLowerCase());
    });

    const selectedDoctor = doctors.find((doctor) => doctor.id === data.doctor_id) ?? null;
    const hasDoctorSearch = doctorQuery.trim().length > 0;
    const doctorBaseRate = Number(selectedDoctor?.commission_percentage ?? 0);

    const filteredAgents = agents.filter((agent) => {
        if (!agentQuery.trim()) return false;
        return [agent.name, agent.agent_id].join(' ').toLowerCase().includes(agentQuery.toLowerCase());
    });
    const selectedAgent = agents.find((agent) => agent.id === data.agent_id) ?? null;

    const filteredTests = catalogItems.filter((test) => {
        const matchesCategory =
            categoryFilter === 'all' || (test.category || 'Uncategorized') === categoryFilter;
        const matchesQuery =
            !testQuery.trim() ||
            [test.name, test.short_name ?? '', test.category ?? '']
                .join(' ')
                .toLowerCase()
                .includes(testQuery.toLowerCase());
        return matchesCategory && matchesQuery;
    });

    const selectedTests = data.tests
        .map((selected) => catalogItems.find((t) => t.item_type === 'test' && t.id === selected.test_id))
        .filter((t): t is TestItem => Boolean(t));
    const selectedAdditionalItems = data.additional_items
        .map((selected) => catalogItems.find((i) => i.item_type === 'additional_item' && i.id === selected.item_id))
        .filter((i): i is TestItem => Boolean(i));

    const testSubtotal = data.tests.reduce((sum, item) => sum + Number(item.price || 0), 0);
    const subtotal =
        testSubtotal + data.additional_items.reduce((sum, item) => sum + Number(item.price || 0), 0);
    const discountAmount =
        data.discount_type === 'percent'
            ? (subtotal * Number(data.discount_value || 0)) / 100
            : Number(data.discount_value || 0);
    const netAmount = Math.max(0, subtotal - discountAmount);
    const dueAmount = Math.max(0, netAmount - Number(data.paid_amount || 0));

    const effectiveDoctorPct = Math.max(0, doctorBaseRate - Number(data.doctor_discount || 0));
    const doctorBase =
        commissionSettings.doctor_commission_on === 'after' && subtotal > 0
            ? testSubtotal * (netAmount / subtotal)
            : testSubtotal;
    const doctorCommission = (doctorBase * effectiveDoctorPct) / 100;
    const agentRate = Number(selectedAgent?.commission_rate ?? 0);
    const agentBase = commissionSettings.agent_commission_on === 'after' ? netAmount : subtotal;
    const agentCommission = (agentBase * agentRate) / 100;

    // keep form commission fields in sync so the server persists the same values
    useEffect(() => {
        setData('doctor_commission_percentage', effectiveDoctorPct);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [effectiveDoctorPct]);
    useEffect(() => {
        setData('agent_commission_percentage', agentRate);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [agentRate]);

    // auto-select newly-created records flashed back from the quick-add modals
    const newAgent = page.props.flash?.newAgent;
    const newPatient = page.props.flash?.newPatient;
    const newDoctor = page.props.flash?.newDoctor;
    useEffect(() => {
        if (newAgent) {
            setData('agent_id', newAgent.id);
            setAgentQuery(newAgent.name);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newAgent?.id]);
    useEffect(() => {
        if (newPatient) {
            setData('patient_id', newPatient.id);
            setPhoneQuery(newPatient.phone);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newPatient?.id]);
    useEffect(() => {
        if (newDoctor) {
            setData('doctor_id', newDoctor.id);
            setDoctorQuery(fullName(newDoctor.first_name, newDoctor.last_name));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newDoctor?.id]);

    useEffect(() => {
        if (!phoneQuery.trim()) return;
        const exactMatch = patients.find(
            (patient) => normalizePhone(patient.phone) === normalizePhone(phoneQuery),
        );
        if (exactMatch) setData('patient_id', exactMatch.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [patients, phoneQuery]);

    const toggleTest = (test: TestItem) => {
        if (test.item_type === 'additional_item') {
            const exists = data.additional_items.some((item) => item.item_id === test.id);
            if (exists) {
                setData('additional_items', data.additional_items.filter((item) => item.item_id !== test.id));
                return;
            }
            setData('additional_items', [...data.additional_items, { item_id: test.id, price: test.price }]);
            return;
        }
        const exists = data.tests.some((item) => item.test_id === test.id);
        if (exists) {
            setData('tests', data.tests.filter((item) => item.test_id !== test.id));
            return;
        }
        setData('tests', [...data.tests, { test_id: test.id, price: test.price }]);
    };

    const removeTest = (item: TestItem) => {
        if (item.item_type === 'additional_item') {
            setData('additional_items', data.additional_items.filter((s) => s.item_id !== item.id));
            return;
        }
        setData('tests', data.tests.filter((s) => s.test_id !== item.id));
    };

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitMessage('');
        post('/bills', {
            preserveScroll: true,
            onSuccess: () => {
                setSubmitMessage('Bill generated successfully.');
                setPhoneQuery('');
                setDoctorQuery('');
                setAgentQuery('');
                setTestQuery('');
                setCategoryFilter('all');
                reset();
            },
        });
    };

    const selectedCount = data.tests.length + data.additional_items.length;

    return (
        <AppLayout>
            <Head title="New Bill" />

            <div className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.12),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#eef5fb_100%)] px-4 py-6 md:px-6">
                <div className="mx-auto max-w-[1600px]">
                    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-700/70">Billing Desk</p>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                                Register patient and generate bills
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-slate-500">
                                Patient lookup, doctor reference, agent, test selection and payment summary stay in one workflow.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href="/bills"
                                className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur transition hover:text-cyan-700"
                            >
                                All Bills
                            </Link>
                            <div className="rounded-2xl border border-cyan-100 bg-white/80 px-4 py-3 text-right shadow-sm backdrop-blur">
                                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Selected tests</p>
                                <p className="mt-1 text-2xl font-semibold text-slate-950">{selectedCount}</p>
                            </div>
                        </div>
                    </div>

                    {submitMessage ? (
                        <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                            {submitMessage}
                        </div>
                    ) : null}

                    <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[1.05fr_1.05fr_1fr]">
                        {/* ── Patient / Doctor / Agent ─────────────────────────── */}
                        <section className={panelClasses}>
                            <div className="flex items-center gap-3">
                                <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-600">
                                    <UserRoundSearch className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-semibold text-slate-950">Patient Information</h2>
                                    <p className="text-sm text-slate-500">Search by phone and attach the patient to this bill.</p>
                                </div>
                            </div>

                            <div className="mt-8 space-y-6">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                                        Search by phone number <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                value={phoneQuery}
                                                onChange={(event) => setPhoneQuery(event.target.value)}
                                                placeholder="01711128702"
                                                className={`${inputClasses} pl-12`}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setPatientModalOpen(true)}
                                            title="Quick add patient"
                                            className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-2xl bg-cyan-600 text-white transition hover:bg-cyan-700"
                                        >
                                            <Plus className="h-5 w-5" />
                                        </button>
                                    </div>
                                    {errors.patient_id ? <p className="mt-2 text-xs text-rose-500">{errors.patient_id}</p> : null}
                                </div>

                                {selectedPatient ? (
                                    <div className="rounded-[1.6rem] border border-amber-200 bg-amber-50/70 p-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-xs uppercase tracking-[0.24em] text-amber-700/70">Selected patient</p>
                                                <h3 className="mt-2 text-xl font-semibold text-slate-950">
                                                    {fullName(selectedPatient.first_name, selectedPatient.last_name)}
                                                </h3>
                                                <div className="mt-2 grid gap-1 text-sm text-slate-600">
                                                    <p>Phone: {selectedPatient.phone}</p>
                                                    <p>Gender: {selectedPatient.gender || 'Not set'}</p>
                                                    <p>Address: {selectedPatient.address || 'Not available'}</p>
                                                </div>
                                            </div>
                                            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                                                {selectedPatient.patient_category || 'Patient'}
                                            </span>
                                        </div>
                                    </div>
                                ) : hasPatientSearch && phoneMatches.length === 0 ? (
                                    <div className="rounded-[1.6rem] border border-amber-200 bg-amber-50/70 p-4">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-xl font-semibold text-amber-600">Patient not found</p>
                                                <p className="mt-1 text-sm text-amber-700/80">No existing record matched this phone number.</p>
                                            </div>
                                            <Link
                                                href="/patients/create"
                                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
                                            >
                                                <UserPlus className="h-5 w-5" /> Add Patient
                                            </Link>
                                        </div>
                                    </div>
                                ) : null}

                                {hasPatientSearch && phoneMatches.length > 0 && !selectedPatient ? (
                                    <div className="space-y-2">
                                        <p className="text-sm font-semibold text-slate-700">Matching patients</p>
                                        {phoneMatches.slice(0, 4).map((patient) => (
                                            <button
                                                key={patient.id}
                                                type="button"
                                                onClick={() => {
                                                    setData('patient_id', patient.id);
                                                    setPhoneQuery(patient.phone);
                                                }}
                                                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:border-cyan-300 hover:bg-cyan-50"
                                            >
                                                <div>
                                                    <p className="font-medium text-slate-900">{fullName(patient.first_name, patient.last_name)}</p>
                                                    <p className="text-sm text-slate-500">{patient.phone}</p>
                                                </div>
                                                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Select</span>
                                            </button>
                                        ))}
                                    </div>
                                ) : null}

                                {/* Doctor reference */}
                                <div className="border-t border-slate-200 pt-6">
                                    <div className="mb-3 flex items-center gap-2 text-slate-900">
                                        <Stethoscope className="h-5 w-5 text-cyan-600" />
                                        <h3 className="text-xl font-semibold">Doctor Reference</h3>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                value={doctorQuery}
                                                onChange={(event) => setDoctorQuery(event.target.value)}
                                                placeholder="Doctor name / mobile / specialty"
                                                className={`${inputClasses} pl-12`}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setDoctorModalOpen(true)}
                                            title="Quick add doctor"
                                            className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-2xl bg-cyan-600 text-white transition hover:bg-cyan-700"
                                        >
                                            <Plus className="h-5 w-5" />
                                        </button>
                                    </div>

                                    {selectedDoctor ? (
                                        <div className="mt-3 rounded-[1.6rem] border border-cyan-200 bg-cyan-50/80 p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="text-lg font-semibold text-slate-950">
                                                        {fullName(selectedDoctor.first_name, selectedDoctor.last_name)}
                                                    </p>
                                                    <p className="mt-1 text-sm text-slate-600">{selectedDoctor.designation || 'Doctor'}</p>
                                                    <p className="mt-1 text-sm text-slate-500">
                                                        {selectedDoctor.personal_number || 'No phone'} • {selectedDoctor.specialties || 'General'}
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setData('doctor_id', null);
                                                        setData('doctor_discount', 0);
                                                    }}
                                                    className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 transition hover:text-slate-900"
                                                >
                                                    Clear
                                                </button>
                                            </div>

                                            {/* Doctor commission + discount */}
                                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                                <div className="rounded-2xl bg-white px-4 py-3">
                                                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Doctor Commission</p>
                                                    <p className="mt-1 text-lg font-semibold text-cyan-700">{effectiveDoctorPct}%</p>
                                                </div>
                                                <div>
                                                    <label className="mb-1 block text-xs font-semibold text-slate-500">
                                                        Doctor Discount % (max {doctorBaseRate})
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        max={doctorBaseRate}
                                                        value={data.doctor_discount}
                                                        onChange={(e) =>
                                                            setData(
                                                                'doctor_discount',
                                                                Math.min(doctorBaseRate, Math.max(0, Number(e.target.value || 0))),
                                                            )
                                                        }
                                                        className={inputClasses}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}

                                    <div className="mt-3 space-y-2">
                                        {filteredDoctors.slice(0, 4).map((doctor) => (
                                            <button
                                                key={doctor.id}
                                                type="button"
                                                onClick={() => {
                                                    setData('doctor_id', doctor.id);
                                                    setDoctorQuery(fullName(doctor.first_name, doctor.last_name));
                                                }}
                                                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                                                    data.doctor_id === doctor.id
                                                        ? 'border-cyan-300 bg-cyan-50'
                                                        : 'border-slate-200 bg-white hover:border-cyan-200 hover:bg-slate-50'
                                                }`}
                                            >
                                                <div>
                                                    <p className="font-medium text-slate-900">{fullName(doctor.first_name, doctor.last_name)}</p>
                                                    <p className="text-sm text-slate-500">
                                                        {doctor.personal_number || 'No phone'} • Comm. {Number(doctor.commission_percentage ?? 0)}%
                                                    </p>
                                                </div>
                                                {data.doctor_id === doctor.id ? <Check className="h-5 w-5 text-cyan-600" /> : null}
                                            </button>
                                        ))}
                                    </div>

                                    {hasDoctorSearch && !selectedDoctor && !filteredDoctors.length ? (
                                        <div className="mt-3 rounded-[1.6rem] border border-slate-200 bg-slate-50 p-4 text-center">
                                            <p className="text-lg font-semibold text-slate-500">Doctor not found</p>
                                            <Link
                                                href="/doctors/create"
                                                className="mt-3 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                                            >
                                                <UserPlus className="h-4 w-4" /> Add Doctor
                                            </Link>
                                        </div>
                                    ) : null}
                                </div>

                                {/* Agent reference */}
                                <div className="border-t border-slate-200 pt-6">
                                    <div className="mb-3 flex items-center gap-2 text-slate-900">
                                        <Users className="h-5 w-5 text-cyan-600" />
                                        <h3 className="text-xl font-semibold">Agent (Marketing)</h3>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                value={agentQuery}
                                                onChange={(event) => setAgentQuery(event.target.value)}
                                                placeholder="Agent name or ID"
                                                className={`${inputClasses} pl-12`}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setAgentModalOpen(true)}
                                            title="Quick add agent"
                                            className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-2xl bg-cyan-600 text-white transition hover:bg-cyan-700"
                                        >
                                            <Plus className="h-5 w-5" />
                                        </button>
                                    </div>

                                    {selectedAgent ? (
                                        <div className="mt-3 flex items-center justify-between rounded-[1.6rem] border border-violet-200 bg-violet-50/70 p-4">
                                            <div>
                                                <p className="text-lg font-semibold text-slate-950">{selectedAgent.name}</p>
                                                <p className="mt-1 text-sm text-slate-500">
                                                    #{selectedAgent.agent_id} • Comm. {agentRate}%
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setData('agent_id', null);
                                                    setAgentQuery('');
                                                }}
                                                className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 transition hover:text-slate-900"
                                            >
                                                Clear
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="mt-3 space-y-2">
                                            {filteredAgents.slice(0, 4).map((agent) => (
                                                <button
                                                    key={agent.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setData('agent_id', agent.id);
                                                        setAgentQuery(agent.name);
                                                    }}
                                                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-violet-200 hover:bg-slate-50"
                                                >
                                                    <div>
                                                        <p className="font-medium text-slate-900">{agent.name}</p>
                                                        <p className="text-sm text-slate-500">#{agent.agent_id} • {Number(agent.commission_rate)}%</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* ── Test selection ───────────────────────────────────── */}
                        <section className={panelClasses}>
                            <div className="flex items-center gap-3">
                                <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-600">
                                    <TestTubeDiagonal className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-semibold text-slate-950">Select Tests</h2>
                                    <p className="text-sm text-slate-500">Search investigations and extra items, then add them to the bill.</p>
                                </div>
                            </div>

                            <div className="mt-8 flex flex-col gap-4">
                                <div className="relative">
                                    <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={testQuery}
                                        onChange={(event) => setTestQuery(event.target.value)}
                                        placeholder="Search tests"
                                        className={`${inputClasses} pl-12`}
                                    />
                                </div>
                                <div className="relative">
                                    <select
                                        value={categoryFilter}
                                        onChange={(event) => setCategoryFilter(event.target.value)}
                                        className={`${inputClasses} appearance-none pr-12`}
                                    >
                                        {categories.map((category) => (
                                            <option key={category} value={category}>
                                                {category === 'all' ? 'All Categories' : category}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                </div>
                            </div>
                            {errors.tests ? <p className="mt-2 text-xs text-rose-500">{errors.tests}</p> : null}

                            <div className="mt-6 max-h-[820px] space-y-4 overflow-y-auto pr-1">
                                {filteredTests.map((test) => {
                                    const selected =
                                        test.item_type === 'additional_item'
                                            ? data.additional_items.some((item) => item.item_id === test.id)
                                            : data.tests.some((item) => item.test_id === test.id);
                                    return (
                                        <button
                                            key={`${test.item_type}-${test.id}`}
                                            type="button"
                                            onClick={() => toggleTest(test)}
                                            className={`flex w-full items-center gap-4 rounded-[1.7rem] border px-5 py-5 text-left transition ${
                                                selected
                                                    ? 'border-cyan-300 bg-cyan-50/70 shadow-[0_18px_38px_-30px_rgba(8,145,178,0.55)]'
                                                    : 'border-slate-200 bg-white hover:border-cyan-200 hover:bg-slate-50'
                                            }`}
                                        >
                                            <div
                                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                                                    selected ? 'border-cyan-500 bg-cyan-500 text-white' : 'border-cyan-500/80 bg-white text-transparent'
                                                }`}
                                            >
                                                <Check className="h-4 w-4" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xl font-semibold leading-tight text-slate-950">{test.name}</p>
                                                <p className="mt-1 text-sm text-slate-500">{test.category || 'Uncategorized'}</p>
                                                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                                                    {test.item_type === 'additional_item' ? 'Additional Item' : 'Test'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-semibold text-cyan-600">{formatCurrency(test.price)}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                                {!filteredTests.length ? (
                                    <div className="rounded-[1.7rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-slate-500">
                                        No test matched the current search.
                                    </div>
                                ) : null}
                            </div>
                        </section>

                        {/* ── Bill & payment ───────────────────────────────────── */}
                        <section className={panelClasses}>
                            <div className="flex items-center gap-3">
                                <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-600">
                                    <ReceiptText className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-semibold text-slate-950">Bill & Payment</h2>
                                    <p className="text-sm text-slate-500">Review line items, apply discount and collect payment.</p>
                                </div>
                            </div>

                            <div className="mt-8 space-y-5">
                                <div className="space-y-1">
                                    {selectedTests.length || selectedAdditionalItems.length ? (
                                        [...selectedTests, ...selectedAdditionalItems].map((test) => (
                                            <div
                                                key={`${test.item_type}-${test.id}`}
                                                className="flex items-center justify-between gap-4 border-b border-slate-200 py-3"
                                            >
                                                <div className="min-w-0">
                                                    <p className="truncate text-lg font-medium text-slate-900">{test.name}</p>
                                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                                        {test.item_type === 'additional_item' ? 'Additional Item' : 'Test'}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-xl font-semibold text-slate-900">{formatCurrency(test.price)}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTest(test)}
                                                        className="text-slate-400 transition hover:text-rose-500"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="rounded-[1.6rem] border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">
                                            No tests selected yet.
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between border-t border-slate-200 pt-5 text-lg text-slate-700">
                                    <span>Subtotal ({selectedCount} items)</span>
                                    <span className="font-semibold text-slate-950">{formatCurrency(subtotal)}</span>
                                </div>

                                <div className="rounded-[1.7rem] border border-slate-200 bg-slate-50 p-5">
                                    <div className="mb-4 flex items-center gap-3">
                                        <BadgePercent className="h-5 w-5 text-slate-500" />
                                        <h3 className="text-lg font-semibold text-slate-900">Discount</h3>
                                    </div>
                                    <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
                                        <div className="relative">
                                            <select
                                                value={data.discount_type}
                                                onChange={(event) => setData('discount_type', event.target.value as 'flat' | 'percent')}
                                                className={`${inputClasses} appearance-none pr-12`}
                                            >
                                                <option value="flat">৳ Flat</option>
                                                <option value="percent">% Percent</option>
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                        </div>
                                        <input
                                            type="number"
                                            min="0"
                                            value={data.discount_value}
                                            onChange={(event) => setData('discount_value', Number(event.target.value || 0))}
                                            placeholder="0"
                                            className={inputClasses}
                                        />
                                    </div>
                                </div>

                                <div className="border-y border-slate-200 py-5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-3xl font-semibold tracking-tight text-slate-950">Net Amount</span>
                                        <span className="text-3xl font-semibold tracking-tight text-cyan-600">{formatCurrency(netAmount)}</span>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                                        <span>Discount applied</span>
                                        <span>{formatCurrency(discountAmount)}</span>
                                    </div>
                                </div>

                                {/* Commission preview */}
                                {(selectedDoctor || selectedAgent) && (
                                    <div className="rounded-[1.7rem] border border-slate-200 bg-slate-50 p-5">
                                        <div className="mb-3 flex items-center gap-3">
                                            <HandCoins className="h-5 w-5 text-slate-500" />
                                            <h3 className="text-lg font-semibold text-slate-900">Commission</h3>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            {selectedDoctor && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-500">
                                                        Doctor ({effectiveDoctorPct}% of test {commissionSettings.doctor_commission_on === 'after' ? 'net' : 'amount'})
                                                    </span>
                                                    <span className="font-semibold text-slate-800">{formatCurrency(doctorCommission)}</span>
                                                </div>
                                            )}
                                            {selectedAgent && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-500">
                                                        Agent ({agentRate}% of {commissionSettings.agent_commission_on === 'after' ? 'net' : 'subtotal'})
                                                    </span>
                                                    <span className="font-semibold text-slate-800">{formatCurrency(agentCommission)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="rounded-[1.7rem] border border-slate-200 bg-slate-50 p-5">
                                    <div className="mb-4 flex items-center gap-3">
                                        <CreditCard className="h-5 w-5 text-slate-500" />
                                        <h3 className="text-lg font-semibold text-slate-900">Payment</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <select
                                                value={data.payment_method}
                                                onChange={(event) => setData('payment_method', event.target.value)}
                                                className={`${inputClasses} appearance-none pr-12`}
                                            >
                                                <option value="cash">Cash</option>
                                                <option value="card">Card</option>
                                                <option value="mobile-banking">Mobile Banking</option>
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                        </div>
                                        <div className="grid gap-3 sm:grid-cols-[1fr_124px]">
                                            <input
                                                type="number"
                                                min="0"
                                                value={data.paid_amount}
                                                onChange={(event) => setData('paid_amount', Number(event.target.value || 0))}
                                                placeholder="Paid amount"
                                                className={inputClasses}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setData('paid_amount', netAmount)}
                                                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
                                            >
                                                Full Pay
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                                            <span className="text-sm text-slate-500">Due after payment</span>
                                            <span className="text-lg font-semibold text-slate-950">{formatCurrency(dueAmount)}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing || !data.patient_id || selectedCount === 0}
                                    className="w-full rounded-[1.7rem] bg-cyan-600 px-6 py-5 text-lg font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-cyan-300"
                                >
                                    {processing ? 'Generating...' : 'Generate Bill & Receipt'}
                                </button>
                            </div>
                        </section>
                    </form>
                </div>
            </div>

            {patientModalOpen ? <QuickPatientModal onClose={() => setPatientModalOpen(false)} /> : null}
            {doctorModalOpen ? <QuickDoctorModal onClose={() => setDoctorModalOpen(false)} /> : null}
            {agentModalOpen ? <QuickAgentModal onClose={() => setAgentModalOpen(false)} /> : null}
        </AppLayout>
    );
}
