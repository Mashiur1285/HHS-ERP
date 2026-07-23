import {
    Banknote,
    BarChart3,
    Building2,
    CalendarDays,
    HandCoins,
    LayoutDashboard,
    List,
    ReceiptText,
    Settings,
    Stethoscope,
    TestTubeDiagonal,
    Users,
} from 'lucide-react';
import SidebarMultiLevelMenu from './Partials/SidebarMultiLevelMenu';
import SidebarSingleLink from './Partials/SidebarSingleLink';

export default function TheSidebar() {
    return (
        <aside
            id="logo-sidebar"
            className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-linear-to-b from-cyan-600 to-cyan-700 border-r border-cyan-800/40 sm:translate-x-0 shadow-lg"
            aria-label="Sidebar"
        >
            <div className="h-full px-3 pb-4 overflow-y-auto">
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
                    <SidebarSingleLink
                        label="Doctors"
                        href="/doctors"
                        icon={Stethoscope}
                    />
                    <SidebarSingleLink
                        label="Tests"
                        href="/tests"
                        icon={TestTubeDiagonal}
                    />
                    <SidebarSingleLink
                        label="Extra Items"
                        href="/test-additional-items"
                        icon={Banknote}
                    />
                    <SidebarSingleLink
                        label="Bills"
                        href="/bills"
                        icon={ReceiptText}
                    />
                    <SidebarSingleLink
                        label="Agents"
                        href="/agents"
                        icon={Users}
                    />
                    <SidebarMultiLevelMenu
                        label="Commissions"
                        icon={HandCoins}
                        submenu={[
                            { label: 'Doctor Commission', href: '/commissions/doctors', icon: Stethoscope },
                            { label: 'Agent Commission', href: '/commissions/agents', icon: Users },
                        ]}
                    />
                    <SidebarMultiLevelMenu
                        label="Reports"
                        icon={BarChart3}
                        submenu={[
                            { label: 'Sales Report', href: '/reports/sales', icon: List },
                            { label: 'Payment Report', href: '/reports/payments', icon: Banknote },
                            { label: 'Test Report', href: '/reports/tests', icon: TestTubeDiagonal },
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
                        label="Settings"
                        href="/settings"
                        icon={Settings}
                    />
                </ul>
            </div>
        </aside>
    );
}
