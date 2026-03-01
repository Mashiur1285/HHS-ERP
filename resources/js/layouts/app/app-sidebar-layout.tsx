import TheFooter from '@/layouts/TheFooter';
import TheNavbar from '@/layouts/Navbar/TheNavbar';
import TheSidebar from '@/layouts/Sidebar/TheSidebar';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({ children }: AppLayoutProps) {
    return (
        <div>
            <TheNavbar />
            <TheSidebar />

            <div className="flex flex-col min-h-screen justify-between transition-all duration-200 px-4 sm:ml-64 pt-[72px] print:p-0 print:sm:ml-0">
                <div className="flex-1">
                    {children}
                </div>
                <TheFooter />
            </div>
        </div>
    );
}
