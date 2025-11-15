import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import ProfileAvatar from "./ProfileAvatar";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/signin");

    const user = await prisma.user.findUnique({
        where: { email: session.user?.email ?? "" },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            hasCompletedProfile: true,
        },
    });

    if (!user?.hasCompletedProfile) {
        redirect("/dashboard/profile");
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 p-4 sm:p-6">
            <div className="max-w-6xl mx-auto min-w-0">

                {/* HEADER CARD */}
                <div className="bg-white shadow-md rounded-2xl p-5 sm:p-6 border border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                    <div className="flex items-center gap-4">
                        {/* Avatar Component */}
                        {/* @ts-ignore */}
                        <ProfileAvatar initialImage={user?.image} />

                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                                Welcome, {user?.name || "Student"} 👋
                            </h1>
                            <p className="text-gray-500 text-sm sm:text-base">{user?.email}</p>
                        </div>
                    </div>

                    <Link
                        href="/dashboard/profile?edit=1"
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Edit Profile
                    </Link>
                </div>

                {/* GRID CARDS */}
                <section className="mt-7 grid gap-6 md:grid-cols-2">

                    <DashboardCard
                        title="Guidance Test 🎯"
                        desc="Take our AI-powered test to discover your best-suited career paths and strengths."
                        href="/dashboard/test"
                        btn="Start Test →"
                    />

                    <DashboardCard
                        title="Career Roadmap 🚀"
                        desc="View your personalized roadmap with milestones, projects, and recommendations."
                        href="/dashboard/career-map"
                        btn="View Career Map →"
                    />

                    <DashboardCard
                        title="Skills & Courses 📘"
                        desc="Track your skills, follow learning paths, and find the right resources."
                        href="/dashboard/skills"
                        btn="View Skills →"
                    />

                    <DashboardCard
                        title="Documents 📁"
                        desc="Manage your resume, certificates, and important files in one secure place."
                        href="/dashboard/documents"
                        btn="Manage Documents →"
                    />
                </section>

            </div>
        </main>
    );
}

function DashboardCard({
    title,
    desc,
    href,
    btn,
}: {
    title: string;
    desc: string;
    href: string;
    btn: string;
}) {
    return (
        <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">{title}</h2>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">{desc}</p>

            <Link
                href={href}
                className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
                {btn}
            </Link>
        </div>
    );
}
