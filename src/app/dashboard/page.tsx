import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import ProfileAvatar from "./ProfileAvatar";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/signin");

    // Fetch user profile completion (from Prisma)
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

    // FIRST TIME USER → Redirect to Profile page
    if (!user?.hasCompletedProfile) {
        redirect("/dashboard/profile");
    }

    return (
        <main className="min-h-screen p-6 bg-gradient-to-b from-blue-50 via-white to-blue-100">
            <div className="max-w-6xl mx-auto">

                {/* HEADER */}
                <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        {/* Client-side avatar with hover upload */}
                        {/* @ts-ignore */}
                        <ProfileAvatar initialImage={user?.image} />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Welcome, {user?.name || "Student"} 👋
                            </h1>
                            <p className="text-gray-500">{user?.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/dashboard/profile?edit=1" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all">
                            Edit Profile
                        </Link>
                    </div>
                </div>

                {/* GRID SECTIONS */}
                <div className="mt-8 grid md:grid-cols-2 gap-6">

                    {/* GUIDANCE TEST */}
                    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            Guidance Test 🎯
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Take our AI-powered guidance test to discover your best-suited
                            career paths, strengths, and recommended learning roadmap.
                        </p>

                        <Link
                            href="/dashboard/test"
                            className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all"
                        >
                            Start Test →
                        </Link>
                    </div>

                    {/* CAREER MAP */}
                    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            Career Roadmap 🚀
                        </h2>
                        <p className="text-gray-600 mb-4">
                            View your personalized career map with milestones, projects,
                            certifications, and role-based recommendations.
                        </p>

                        <Link
                            href="/dashboard/career-map"
                            className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all"
                        >
                            View Career Map →
                        </Link>
                    </div>

                    {/* SKILLS & LEARNING */}
                    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            Skills & Courses 📘
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Track your skills, follow curated learning paths, and find the
                            right resources to grow your expertise.
                        </p>

                        <Link
                            href="/dashboard/skills"
                            className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all"
                        >
                            View Skills →
                        </Link>
                    </div>

                    {/* DOCUMENTS */}
                    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            Documents 📁
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Manage your resume, certificates, academic mark sheets and other
                            important files in one secure place.
                        </p>

                        <Link
                            href="/dashboard/documents"
                            className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all"
                        >
                            Manage Documents →
                        </Link>
                    </div>

                </div>

            </div>
        </main>
    );
}
