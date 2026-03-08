import {
    Banknote,
    Building2,
    CalendarDays,
    LayoutDashboard,
    List,
    Settings,
    Stethoscope,
    UserPlus,
    Users,
} from 'lucide-react';
import SidebarMultiLevelMenu from './Partials/SidebarMultiLevelMenu';
import SidebarSingleLink from './Partials/SidebarSingleLink';

export default function TheSidebar() {
    return (
        <aside
            id="logo-sidebar"
            className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 shadow"
            aria-label="Sidebar"
        >
            <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
                <ul className="space-y-2 font-medium">
                    <SidebarSingleLink
                        label="Dashboard"
                        href="/dashboard"
                        icon={LayoutDashboard}
                    />
                    <SidebarSingleLink
                        label="Patients"
                        href="/patients"
                        icon={Users}
                    />
                    <SidebarMultiLevelMenu
                        label="Doctors"
                        icon={Stethoscope}
                        submenu={[
                            { label: 'All Doctors', href: '/doctors', icon: List },
                            { label: 'Add Doctor', href: '/doctors/create', icon: UserPlus },
                        ]}
                    />
                    <SidebarSingleLink
                        label="Departments"
                        href="/departments"
                        icon={Building2}
                    />
                    <SidebarSingleLink
                        label="Appointments"
                        href="/appointments"
                        icon={CalendarDays}
                    />
                    <SidebarSingleLink
                        label="Bills"
                        href="/bills"
                        icon={Banknote}
                    />
                    <SidebarSingleLink
                        label="Settings"
                        href="/settings"
                        icon={Settings}
                    />
                </ul>
            </div>
        </aside>
    );
}
