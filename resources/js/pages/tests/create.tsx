import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import TestForm from './partials/TestForm';

export default function CreateTest() {
    return (
        <AppLayout>
            <Head title="Add Test" />

            <div className="px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Add Test</h1>
                    <p className="mt-1 text-sm text-gray-500">Create a new lab test with price and reporting details.</p>
                </div>

                <TestForm submitUrl="/tests" method="post" />
            </div>
        </AppLayout>
    );
}
