import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import TestAdditionalItemForm from './partials/TestAdditionalItemForm';

export default function CreateTestAdditionalItem() {
    return (
        <AppLayout>
            <Head title="Add Test Additional Item" />

            <div className="px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Add Test Additional Item</h1>
                    <p className="mt-1 text-sm text-gray-500">Create billable extra items that can be attached to invoices.</p>
                </div>

                <TestAdditionalItemForm submitUrl="/test-additional-items" method="post" />
            </div>
        </AppLayout>
    );
}
