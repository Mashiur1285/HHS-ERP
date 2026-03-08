import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2, UserCheck, UserX } from 'lucide-react';

interface Doctor {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    personal_number: string;
    specialties: string;
    designation: string;
    gender: string;
    is_active: boolean;
    is_system_user: boolean;
}

interface PaginatedDoctors {
    data: Doctor[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Props {
    doctors: PaginatedDoctors;
}

export default function DoctorIndex({ doctors }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this doctor?')) {
            router.delete(`/doctors/${id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Doctors" />

            <div className="px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Doctors</h1>
                        <p className="text-sm text-gray-500 mt-1">{doctors.total} total doctors</p>
                    </div>
                    <Link
                        href="/doctors/create"
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition"
                    >
                        <Plus className="w-4 h-4" />
                        Add Doctor
                    </Link>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">#</th>
                                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Name</th>
                                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Specialties</th>
                                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Phone</th>
                                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                                <th className="text-right px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {doctors.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-gray-400">No doctors found</td>
                                </tr>
                            ) : (
                                doctors.data.map((doctor, index) => (
                                    <tr key={doctor.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-4 text-gray-400">{index + 1}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                                                    {doctor.first_name[0]}{doctor.last_name?.[0] ?? ''}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{doctor.first_name} {doctor.last_name}</p>
                                                    <p className="text-xs text-gray-400">{doctor.designation}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">{doctor.specialties ?? '—'}</td>
                                        <td className="px-5 py-4 text-gray-600">{doctor.personal_number}</td>
                                        <td className="px-5 py-4">
                                            {doctor.is_active ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                                    <UserCheck className="w-3 h-3" /> Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">
                                                    <UserX className="w-3 h-3" /> Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/doctors/${doctor.id}/edit`}
                                                    className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(doctor.id)}
                                                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                                                >
                                                    <Trash2 className="w-4 h-4" />
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
