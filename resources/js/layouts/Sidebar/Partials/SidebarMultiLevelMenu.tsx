import { usePage } from '@inertiajs/react';
import { ChevronDown, LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import SidebarSingleLink from './SidebarSingleLink';

export interface SubmenuItem {
    label: string;
    href: string;
    icon: LucideIcon;
}

interface Props {
    label: string;
    icon: LucideIcon;
    submenu: SubmenuItem[];
}

export default function SidebarMultiLevelMenu({ label, icon: Icon, submenu }: Props) {
    const page = usePage();
    const [isOpen, setIsOpen] = useState(false);

    const isActiveUrl = (href: string): boolean => {
        const currentUrl = page.url.split('?')[0];
        const menuUrl = href.includes('://') ? new URL(href).pathname : href.split('?')[0];
        return currentUrl === menuUrl || currentUrl.startsWith(menuUrl + '/');
    };

    const isActive = submenu.some((item) => isActiveUrl(item.href));

    useEffect(() => {
        if (isActive) setIsOpen(true);
    }, [isActive]);

    return (
        <li>
            <div className="flex flex-col space-y-1">
                <div
                    className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group cursor-pointer transition-colors duration-200 ${isActive ? 'bg-gray-100' : ''}`}
                    onClick={() => setIsOpen((prev) => !prev)}
                >
                    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-gray-700" />
                    </div>
                    <span className="ml-3 text-sm tracking-wide truncate flex-1">{label}</span>
                    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        <ChevronDown
                            className={`w-3 h-4 text-gray-700 transition-transform duration-200 ease-in-out ${isOpen ? 'rotate-180' : ''}`}
                        />
                    </div>
                </div>

                {isOpen && (
                    <ul className="ml-6 space-y-1">
                        {submenu.map((item) => (
                            <SidebarSingleLink
                                key={item.href}
                                label={item.label}
                                href={item.href}
                                icon={item.icon}
                            />
                        ))}
                    </ul>
                )}
            </div>
        </li>
    );
}
