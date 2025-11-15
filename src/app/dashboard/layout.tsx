"use client";
import { useState } from "react";
import Link from "next/link";
import { FiHome, FiFileText, FiMenu } from "react-icons/fi";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen flex bg-gray-50">

            {/* DESKTOP SIDEBAR */}
            <aside
                className={`hidden md:flex flex-col 
                ${open ? "w-64" : "w-20"} 
                transition-all duration-300 bg-white shadow-lg`}
            >
                <div className="p-5 flex items-center justify-between">
                    {open && (
                        <Link href="/#hero" target="_blank" rel="noreferrer">
                            <h1 className="text-xl font-bold text-blue-600">Career Path</h1>
                        </Link>
                    )}

                    <FiMenu
                        onClick={() => setOpen(!open)}
                        className="cursor-pointer text-gray-700 text-xl"
                    />
                </div>

                <nav className="mt-4 space-y-1">
                    <SidebarLink open={open} href="/dashboard" icon={<FiHome />} label="Dashboard" />
                    <SidebarLink open={open} href="/dashboard/documents" icon={<FiFileText />} label="Documents" />
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col">

                {/* MOBILE TOP BAR */}
                <div className="md:hidden bg-white border-b border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between px-4 py-3">
                        <Link href="/#hero" className="text-lg font-bold text-blue-600">Career Path</Link>

                        <button
                            aria-label="Open menu"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="p-2 rounded-md border border-gray-200"
                        >
                            <FiMenu className="text-gray-700 text-xl" />
                        </button>
                    </div>

                    {mobileOpen && (
                        <div className="px-4 pb-3 space-y-2 text-gray-700">
                            <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block py-2">
                                Dashboard
                            </Link>
                            <Link href="/dashboard/documents" onClick={() => setMobileOpen(false)} className="block py-2">
                                Documents
                            </Link>
                        </div>
                    )}
                </div>

                {/* CONTENT */}
                <main className="p-4 sm:p-6 lg:p-8 min-w-0">{children}</main>
            </div>
        </div>
    );
}

function SidebarLink({
    open,
    href,
    icon,
    label,
}: {
    open: boolean;
    href: string;
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <Link href={href}>
            <div className="flex items-center px-5 py-3 text-gray-700 hover:bg-blue-50 cursor-pointer transition-all">
                <span className="text-xl">{icon}</span>
                {open && <p className="ml-3 font-medium">{label}</p>}
            </div>
        </Link>
    );
}
