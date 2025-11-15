"use client";
import { useState } from "react";
import Link from "next/link";
import { FiHome, FiUser, FiFileText, FiMenu } from "react-icons/fi";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(true);

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* SIDEBAR */}
            <div className={`${open ? "w-64" : "w-20"} transition-all duration-300 bg-white shadow-lg`}>
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
            <div className="flex-1 p-8">{children}</div>
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
