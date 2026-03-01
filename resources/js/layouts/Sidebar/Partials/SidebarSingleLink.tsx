import { Link, usePage } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

interface Props {
    href: string;
    label: string;
    icon: LucideIcon;
    active?: boolean;
}

export default function SidebarSingleLink({ href, label, icon: Icon, active = false }: Props) {
    const page = usePage();

    const isActive = (() => {
        if (active) return true;
        const currentUrl = page.url.split('?')[0];
        const menuUrl = href.includes('://') ? new URL(href).pathname : href.split('?')[0];
        return currentUrl === menuUrl || currentUrl.startsWith(menuUrl + '/');
    })();

    return (
        <li>
            <Link
                href={href}
                className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group transition-colors duration-200 ${isActive ? 'bg-gray-100' : ''}`}
            >
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-700" />
                </div>
                <span className="ml-3 text-sm tracking-wide truncate">{label}</span>
            </Link>
        </li>
    );
}
