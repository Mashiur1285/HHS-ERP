import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import DoctorForm from './partials/DoctorForm';

interface EnumCase {
    name: string;
    value: string;
}

interface Props {
    genders: EnumCase[];
    bloodGroups: EnumCase[];
}

export default function CreateDoctor({ genders, bloodGroups }: Props) {
    return (
        <AppLayout>
            <Head title="Add Doctor" />

            <div className="px-6 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Add Doctor</h1>
                    <p className="text-sm text-gray-500 mt-1">Fill in the information below to register a new doctor</p>
                </div>

                <DoctorForm
                    genders={genders}
                    bloodGroups={bloodGroups}
                    submitUrl="/doctors"
                    method="post"
                />
            </div>
        </AppLayout>
    );
}
