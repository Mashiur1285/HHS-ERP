import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import PatientForm from './partials/PatientForm';

interface EnumCase {
    name: string;
    value: string;
}

interface Props {
    genders: EnumCase[];
    bloodGroups: EnumCase[];
    draft?: any;
}

export default function CreatePatient({ genders, bloodGroups, draft }: Props) {
    return (
        <AppLayout>
            <Head title="Add Patient" />

            <div className="px-6 py-6 max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-4">Add Patient</h1>
                    
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200">
                        <button className="px-1 py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600 mr-8">
                            Personal Information
                        </button>
                        <button className="px-1 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                            Patient History
                        </button>
                    </div>
                </div>

                <div className="mt-6">
                    <PatientForm
                        initialData={draft}
                        draftId={draft?.id}
                        genders={genders}
                        bloodGroups={bloodGroups}
                        submitUrl="/patients"
                        method="post"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
