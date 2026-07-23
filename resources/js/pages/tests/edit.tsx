import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import TestForm from './partials/TestForm';

interface TestData {
    id: number;
    name: string;
    short_name: string | null;
    category: string | null;
    description: string | null;
    sample_type: string | null;
    report_delivery_time: number | null;
    price: number;
    is_active: boolean;
}

interface Props {
    test: TestData;
}

export default function EditTest({ test }: Props) {
    return (
        <AppLayout>
            <Head title="Edit Test" />

            <div className="px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Edit Test</h1>
                    <p className="mt-1 text-sm text-gray-500">Update {test.name} information and price.</p>
                </div>

                <TestForm initialData={test} submitUrl={`/tests/${test.id}`} method="put" />
            </div>
        </AppLayout>
    );
}
