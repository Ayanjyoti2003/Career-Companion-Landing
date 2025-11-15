"use client";
import { useState } from "react";
import Link from "next/link";
import { FiHome, FiUser, FiFileText, FiMenu } from "react-icons/fi";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* SIDEBAR - hidden on small screens */}
            <div className={`hidden md:block ${open ? "w-64" : "w-20"} transition-all duration-300 bg-white shadow-lg`}>
                <div className="p-5 flex items-center justify-between">
                    <a href={"/#hero"} target="_blank" rel="noreferrer" className={`${!open && "hidden"}`}>
                        <h1 className="text-xl font-bold text-blue-600">Career Path</h1>
                    </a>
                    <FiMenu
                        onClick={() => setOpen(!open)}
                        className="cursor-pointer text-gray-700 text-xl"
                    />
                </div>

                <nav className="mt-5 space-y-2">
                    <SidebarLink open={open} href="/dashboard" icon={<FiHome />} label="Dashboard" />
                    {/* Profile removed from sidebar by request */}
                    <SidebarLink open={open} href="/dashboard/documents" icon={<FiFileText />} label="Documents" />
                </nav>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1">
                {/* Mobile top bar for navigation */}
                <div className="md:hidden bg-white shadow-sm border-b border-gray-100">
                    <div className="flex items-center justify-between px-4 py-3">
                        <a href={"/#hero"} className="text-lg font-bold text-blue-600">Career Path</a>
                        <button
                            aria-label="Open menu"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="p-2 rounded-md border border-gray-200 bg-white"
                        >
                            <FiMenu className="text-gray-700 text-xl" />
                        </button>
                    </div>
                    {mobileOpen && (
                        <div className="px-4 pb-3">
                            <Link href="/dashboard" className="block py-2">Dashboard</Link>
                            <Link href="/dashboard/documents" className="block py-2">Documents</Link>
                        </div>
                    )}
                </div>

                <div className="p-8">{children}</div>
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
            <div className="flex items-center px-5 py-3 text-gray-700 hover:bg-blue-50 cursor-pointer">
                <span className="text-xl mr-3">{icon}</span>
                {open && <p className="font-medium">{label}</p>}
            </div>
        </Link>
    );
}
