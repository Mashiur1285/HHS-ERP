import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Search, FileText, Eye, Edit, Trash2 } from 'lucide-react';

interface PaginatedData {
    data: any[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Props {
    patients: PaginatedData;
    drafts: any[];
}

export default function Index({ patients, drafts }: Props) {
    const [activeTab, setActiveTab] = useState<'all' | 'drafts'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const deleteDraft = (id: number) => {
        if (confirm('Are you sure you want to delete this draft?')) {
            router.delete(`/patients/draft/${id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Patients" />

            <div className="px-6 py-6 max-w-7xl mx-auto">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6 font-medium text-sm">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`px-4 py-3 mr-4 focus:outline-none transition-colors ${
                            activeTab === 'all'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        All Patient
                    </button>
                    <button
                        onClick={() => setActiveTab('drafts')}
                        className={`px-4 py-3 focus:outline-none transition-colors ${
                            activeTab === 'drafts'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Drafts
                    </button>
                </div>

                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
                    
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full md:w-64 transition"
                                placeholder="Search by name, phone or Patient ID"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Link
                            href="/patients/create"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap"
                        >
                            + Create Patient
                        </Link>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-gray-100 text-gray-600 font-medium">
                                <tr>
                                    <th className="px-6 py-4">SL</th>
                                    <th className="px-6 py-4">PATIENT ID</th>
                                    <th className="px-6 py-4">NAME</th>
                                    <th className="px-6 py-4">PHONE</th>
                                    <th className="px-6 py-4">GENDER</th>
                                    <th className="px-6 py-4">AGE</th>
                                    <th className="px-6 py-4">STATUS</th>
                                    <th className="px-6 py-4 text-center">ACTION</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {activeTab === 'all' ? (
                                    patients.data.length > 0 ? (
                                        patients.data.map((patient, index) => (
                                            <tr key={patient.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 text-gray-600">{index + 1}</td>
                                                <td className="px-6 py-4 font-medium text-gray-900">{patient.uhid || 'N/A'}</td>
                                                <td className="px-6 py-4">{patient.first_name} {patient.last_name}</td>
                                                <td className="px-6 py-4">{patient.phone}</td>
                                                <td className="px-6 py-4 capitalize">{patient.gender}</td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {patient.date_of_birth ? 'Calculated via dob' : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {/* Toggle Switch mock */}
                                                    <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer">
                                                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition">
                                                            <FileText className="w-4 h-4" />
                                                        </button>
                                                        <button className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition">
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <Link href={`/patients/${patient.id}/edit`} className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition">
                                                            <Edit className="w-4 h-4" />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                                No patients found.
                                            </td>
                                        </tr>
                                    )
                                ) : (
                                    drafts.length > 0 ? (
                                        drafts.map((draft, index) => (
                                            <tr key={draft.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 text-gray-600">{index + 1}</td>
                                                <td className="px-6 py-4 text-gray-400 italic">Draft</td>
                                                <td className="px-6 py-4">
                                                    {draft.first_name || draft.last_name 
                                                        ? `${draft.first_name || ''} ${draft.last_name || ''}`
                                                        : <span className="text-gray-400 italic">Unnamed</span>}
                                                </td>
                                                <td className="px-6 py-4">{draft.phone || <span className="text-gray-400 italic">N/A</span>}</td>
                                                <td className="px-6 py-4 capitalize">{draft.gender || <span className="text-gray-400 italic">N/A</span>}</td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {draft.age_years ? `${draft.age_years}Y ` : ''} 
                                                    {draft.age_months ? `${draft.age_months}M ` : ''} 
                                                    {draft.age_days ? `${draft.age_days}D` : ''}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">Draft</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Link 
                                                            href={`/patients/create?draft_id=${draft.id}`} 
                                                            className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition"
                                                            title="Resume Draft"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Link>
                                                        <button 
                                                            onClick={() => deleteDraft(draft.id)}
                                                            className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition"
                                                            title="Delete Draft"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                                No drafts found.
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
