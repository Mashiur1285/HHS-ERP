import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, TestTubeDiagonal, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface TestRow {
    id: number;
    name: string;
    short_name: string | null;
    category: string | null;
    sample_type: string | null;
    report_delivery_time: number | null;
    price: number;
    is_active: boolean;
}

interface PaginatedTests {
    data: TestRow[];
    total: number;
}

interface Props {
    tests: PaginatedTests;
}

export default function TestsIndex({ tests }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this test?')) {
            router.delete(`/tests/${id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Tests" />

            <div className="px-6 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Tests</h1>
                        <p className="mt-1 text-sm text-gray-500">{tests.total} total tests</p>
                    </div>
                    <Link
                        href="/tests/create"
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4" />
                        Add Test
                    </Link>
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50">
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Name</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Category</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Sample</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">TAT</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Price</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {tests.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-gray-400">
                                        No tests found
                                    </td>
                                </tr>
                            ) : (
                                tests.data.map((test) => (
                                    <tr key={test.id} className="transition hover:bg-gray-50">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                                    <TestTubeDiagonal className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{test.name}</p>
                                                    <p className="text-xs text-gray-400">{test.short_name || 'No short name'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">{test.category || '—'}</td>
                                        <td className="px-5 py-4 text-gray-600">{test.sample_type || '—'}</td>
                                        <td className="px-5 py-4 text-gray-600">
                                            {test.report_delivery_time ? `${test.report_delivery_time} hrs` : '—'}
                                        </td>
                                        <td className="px-5 py-4 font-medium text-cyan-600">৳{Number(test.price).toFixed(2)}</td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                                    test.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                                                }`}
                                            >
                                                {test.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/tests/${test.id}/edit`}
                                                    className="rounded-lg p-2 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(test.id)}
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
            </div>
        </AppLayout>
    );
}
