import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import TestAdditionalItemForm from './partials/TestAdditionalItemForm';

interface AdditionalItemData {
    id: number;
    name: string;
    description: string | null;
    price: number;
    is_active: boolean;
}

interface Props {
    item: AdditionalItemData;
}

export default function EditTestAdditionalItem({ item }: Props) {
    return (
        <AppLayout>
            <Head title="Edit Test Additional Item" />

            <div className="px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Edit Test Additional Item</h1>
                    <p className="mt-1 text-sm text-gray-500">Update {item.name} information and price.</p>
                </div>

                <TestAdditionalItemForm initialData={item} submitUrl={`/test-additional-items/${item.id}`} method="put" />
            </div>
        </AppLayout>
    );
}
