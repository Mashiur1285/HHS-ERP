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
                className={`flex items-center p-2 text-white/90 rounded-lg hover:bg-white/10 hover:text-white group transition-colors duration-200 ${isActive ? 'bg-white/20 text-white font-medium' : ''}`}
            >
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                </div>
                <span className="ml-3 text-sm tracking-wide truncate">{label}</span>
            </Link>
        </li>
    );
}
