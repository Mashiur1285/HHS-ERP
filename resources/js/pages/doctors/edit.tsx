import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import DoctorForm from './partials/DoctorForm';

interface EnumCase {
    name: string;
    value: string;
}

interface Doctor {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    personal_number: string;
    emergency_number: string;
    bmdc: string;
    specialties: string;
    designation: string;
    date_of_birth: string;
    gender: string;
    blood_group: string;
    address: string;
    is_system_user: boolean;
}

interface Props {
    doctor: Doctor;
    genders: EnumCase[];
    bloodGroups: EnumCase[];
}

export default function EditDoctor({ doctor, genders, bloodGroups }: Props) {
    return (
        <AppLayout>
            <Head title="Edit Doctor" />

            <div className="px-6 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Edit Doctor</h1>
                    <p className="text-sm text-gray-500 mt-1">Update the information for {doctor.first_name} {doctor.last_name}</p>
                </div>

                <DoctorForm
                    genders={genders}
                    bloodGroups={bloodGroups}
                    initialData={doctor}
                    submitUrl={`/doctors/${doctor.id}`}
                    method="put"
                />
            </div>
        </AppLayout>
    );
}
