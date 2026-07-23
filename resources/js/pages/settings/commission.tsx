import { Head, useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Commission settings',
        href: '/settings/commission',
    },
];

interface Props {
    settings: {
        doctor_commission_on: string;
        agent_commission_on: string;
    };
}

const selectClass =
    'w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring';

export default function CommissionSettings({ settings }: Props) {
    const { data, setData, post, processing, recentlySuccessful } = useForm({
        doctor_commission_on: settings.doctor_commission_on ?? 'before',
        agent_commission_on: settings.agent_commission_on ?? 'after',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/settings/commission', { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Commission settings" />

            <h1 className="sr-only">Commission settings</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Commission calculation"
                        description="Choose whether commission is calculated on the amount before or after the bill discount."
                    />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="doctor_commission_on">Doctor commission on</Label>
                            <select
                                id="doctor_commission_on"
                                value={data.doctor_commission_on}
                                onChange={(e) => setData('doctor_commission_on', e.target.value)}
                                className={selectClass}
                            >
                                <option value="before">Before discount (test amount)</option>
                                <option value="after">After discount (net)</option>
                            </select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="agent_commission_on">Agent commission on</Label>
                            <select
                                id="agent_commission_on"
                                value={data.agent_commission_on}
                                onChange={(e) => setData('agent_commission_on', e.target.value)}
                                className={selectClass}
                            >
                                <option value="before">Before discount (subtotal)</option>
                                <option value="after">After discount (net)</option>
                            </select>
                        </div>

                        <p className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
                            Tip: charging commission <b>after discount</b> protects your margin — you won&apos;t pay commission on
                            money you discounted away. This applies to new bills only; already-created bills keep their
                            original commission.
                        </p>

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                Save
                            </Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
