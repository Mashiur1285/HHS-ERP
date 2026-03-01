import { Link, router, usePage } from '@inertiajs/react';
import { ChevronDown, KeyRound, LogOut, Menu } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Auth } from '@/types';

export default function TheNavbar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setDropdownOpen(false);
        };
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <nav
            id="the-navbar"
            className="fixed top-0 z-[100] w-full bg-white border-b border-gray-200 shadow"
        >
            <div className="px-3 py-2 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                    {/* Left: hamburger + logo */}
                    <div className="flex items-center justify-start">
                        <button
                            type="button"
                            className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        >
                            <span className="sr-only">Open sidebar</span>
                            <Menu className="w-6 h-6" />
                        </button>
                        <Link href="/dashboard" className="flex ml-2 md:mr-24">
                            <span className="font-semibold text-gray-800 text-lg whitespace-nowrap">
                                Hospital Management
                            </span>
                        </Link>
                    </div>

                    {/* Right: user dropdown */}
                    <div className="hidden sm:flex sm:items-center sm:ml-6">
                        <div className="ml-3 relative" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setDropdownOpen((prev) => !prev)}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                            >
                                {auth.user.name}
                                <ChevronDown className="ml-2 -mr-0.5 h-4 w-4" />
                            </button>

                            {/* Full screen overlay */}
                            {dropdownOpen && (
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setDropdownOpen(false)}
                                />
                            )}

                            {/* Dropdown content */}
                            {dropdownOpen && (
                                <div
                                    className="absolute right-0 z-50 mt-2 w-48 rounded-md shadow-lg origin-top-right transition ease-out duration-200"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    <div className="rounded-md ring-1 ring-black ring-opacity-5 py-1 bg-white">
                                        <Link
                                            href="/settings/password"
                                            className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition duration-150 ease-in-out"
                                        >
                                            <KeyRound className="w-4 h-4" />
                                            Change Password
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition duration-150 ease-in-out"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Log Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
