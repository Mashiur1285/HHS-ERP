import { Link, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import type { FormEvent } from 'react';

interface AdditionalItemData {
    id?: number;
    name: string;
    description: string | null;
    price: number;
    is_active: boolean;
}

interface Props {
    initialData?: AdditionalItemData;
    submitUrl: string;
    method?: 'post' | 'put';
}

const inputClasses =
    'w-full rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100';

export default function TestAdditionalItemForm({ initialData, submitUrl, method = 'post' }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: initialData?.name ?? '',
        description: initialData?.description ?? '',
        price: initialData?.price ?? 0,
        is_active: initialData?.is_active ?? true,
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (method === 'put') {
            put(submitUrl);
            return;
        }

        post(submitUrl);
    };

    return (
        <form onSubmit={submit} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="grid gap-6 p-6 md:p-8">
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Item Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(event) => setData('name', event.target.value)}
                        className={inputClasses}
                        placeholder="Urgent Delivery Charge"
                    />
                    {errors.name ? <p className="mt-1 text-xs text-red-500">{errors.name}</p> : null}
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Price <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={data.price}
                        onChange={(event) => setData('price', Number(event.target.value || 0))}
                        className={inputClasses}
                        placeholder="100"
                    />
                    {errors.price ? <p className="mt-1 text-xs text-red-500">{errors.price}</p> : null}
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        value={data.description}
                        onChange={(event) => setData('description', event.target.value)}
                        className={`${inputClasses} min-h-28 resize-y`}
                        placeholder="Optional note about the additional item"
                    />
                    {errors.description ? <p className="mt-1 text-xs text-red-500">{errors.description}</p> : null}
                </div>

                <div>
                    <label className="inline-flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3">
                        <input
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(event) => setData('is_active', event.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Active item</span>
                    </label>
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-5 md:px-8">
                <Link
                    href="/test-additional-items"
                    className="rounded-full border border-gray-300 px-5 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                    {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {method === 'put' ? 'Update Item' : 'Create Item'}
                </button>
            </div>
        </form>
    );
}
