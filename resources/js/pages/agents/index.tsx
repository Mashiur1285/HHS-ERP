import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Loader2, Pencil, Plus, Trash2, UserCheck, UserX, X } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface Agent {
    id: number;
    name: string;
    agent_id: string;
    contact_number: string | null;
    address: string | null;
    status: boolean;
    commission_rate: number | string;
}

interface Paginated<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
}

interface Props {
    agents: Paginated<Agent>;
}

export default function AgentsIndex({ agents }: Props) {
    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const redirectToBills =
        typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('redirect') === 'bills';

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        agent_id: '',
        contact_number: '',
        address: '',
        commission_rate: '',
        status: true,
    });

    const openCreate = () => {
        reset();
        clearErrors();
        setEditingId(null);
        setOpen(true);
    };

    const openEdit = (agent: Agent) => {
        clearErrors();
        setEditingId(agent.id);
        setData({
            name: agent.name,
            agent_id: agent.agent_id,
            contact_number: agent.contact_number ?? '',
            address: agent.address ?? '',
            commission_rate: String(agent.commission_rate),
            status: agent.status,
        });
        setOpen(true);
    };

    const close = () => {
        setOpen(false);
        setEditingId(null);
        reset();
        clearErrors();
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingId !== null) {
            put(`/agents/${editingId}`, { onSuccess: close });
        } else {
            post('/agents', { onSuccess: close });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this agent?')) {
            router.delete(`/agents/${id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Agents" />

            <div className="px-6 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Agents</h1>
                        <p className="mt-1 text-sm text-gray-500">{agents.total} total agents</p>
                        {redirectToBills ? (
                            <Link href="/bills/create" className="mt-1 inline-block text-xs font-medium text-cyan-600 hover:text-cyan-700">
                                Return to billing
                            </Link>
                        ) : null}
                    </div>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4" />
                        Add Agent
                    </button>
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                <th className="px-5 py-3.5">#</th>
                                <th className="px-5 py-3.5">Name</th>
                                <th className="px-5 py-3.5">Agent ID</th>
                                <th className="px-5 py-3.5">Contact</th>
                                <th className="px-5 py-3.5">Address</th>
                                <th className="px-5 py-3.5">Commission Rate</th>
                                <th className="px-5 py-3.5">Status</th>
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {agents.data.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-gray-400">No agents found</td>
                                </tr>
                            ) : (
                                agents.data.map((agent, index) => (
                                    <tr key={agent.id} className="transition-colors hover:bg-gray-50">
                                        <td className="px-5 py-4 text-gray-400">{index + 1}</td>
                                        <td className="px-5 py-4 font-medium text-gray-900">{agent.name}</td>
                                        <td className="px-5 py-4 text-gray-600">{agent.agent_id}</td>
                                        <td className="px-5 py-4 text-gray-600">{agent.contact_number ?? '—'}</td>
                                        <td className="px-5 py-4 text-gray-600">{agent.address ?? '—'}</td>
                                        <td className="px-5 py-4 text-gray-600">{`${agent.commission_rate}%`}</td>
                                        <td className="px-5 py-4">
                                            {agent.status ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                                                    <UserCheck className="h-3 w-3" /> Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                                                    <UserX className="h-3 w-3" /> Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEdit(agent)}
                                                    className="rounded-lg p-2 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(agent.id)}
                                                    className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {agents.links.length > 3 ? (
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-1">
                        {agents.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url, { preserveScroll: true })}
                                className={`rounded-lg px-3 py-1.5 text-sm ${
                                    link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                                } ${!link.url ? 'cursor-not-allowed opacity-40' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                ) : null}
            </div>

            {open ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-lg">
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-900">{editingId !== null ? 'Edit Agent' : 'Add Agent'}</h2>
                            <button onClick={close} className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={submit} className="space-y-5 p-6">
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 transition placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Agent ID <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.agent_id}
                                        onChange={(e) => setData('agent_id', e.target.value)}
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 transition placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.agent_id && <p className="mt-1 text-xs text-red-500">{errors.agent_id}</p>}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Contact Number</label>
                                    <input
                                        type="text"
                                        value={data.contact_number}
                                        onChange={(e) => setData('contact_number', e.target.value)}
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 transition placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.contact_number && <p className="mt-1 text-xs text-red-500">{errors.contact_number}</p>}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Commission Rate <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500">
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.commission_rate}
                                            onChange={(e) => setData('commission_rate', e.target.value)}
                                            className="w-full bg-transparent px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                                        />
                                        <span className="px-3 text-sm text-gray-400">%</span>
                                    </div>
                                    {errors.commission_rate && <p className="mt-1 text-xs text-red-500">{errors.commission_rate}</p>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Address</label>
                                    <textarea
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        rows={3}
                                        className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 transition placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                                </div>
                            </div>

                            <label className="flex w-fit cursor-pointer items-center gap-3">
                                <div
                                    onClick={() => setData('status', !data.status)}
                                    className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${data.status ? 'bg-blue-600' : 'bg-gray-300'}`}
                                >
                                    <span
                                        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${data.status ? 'translate-x-6' : 'translate-x-1'}`}
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Active</p>
                                    <p className="text-xs text-gray-400">Enable this agent for billing</p>
                                </div>
                            </label>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={close}
                                    className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
                                >
                                    {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {editingId !== null ? 'Update Agent' : 'Save Agent'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}
        </AppLayout>
    );
}
