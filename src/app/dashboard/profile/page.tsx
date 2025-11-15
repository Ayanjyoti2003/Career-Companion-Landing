import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileFormClient from "./ProfileFormClient";

export default async function ProfilePage({ searchParams }: { searchParams?: any }) {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/signin");

    const user = await prisma.user.findUnique({
        where: { email: session.user?.email ?? "" },
        select: { id: true, hasCompletedProfile: true },
    });

    // `searchParams` may be a Promise in the App Router; await it before accessing
    const params = searchParams ? await searchParams : undefined;
    const isEdit = (() => {
        const v = params?.edit;
        if (!v) return false;
        if (Array.isArray(v)) return v.includes("1") || v.includes("true");
        return v === "1" || String(v).toLowerCase() === "true";
    })();

    // If profile already completed and not explicitly editing, send back to dashboard
    if (user?.hasCompletedProfile && !isEdit) redirect("/dashboard");

    // Fetch existing profile to prefill the form (if any)
    let profileData = null;
    let academics: any[] = [];
    if (user) {
        profileData = await prisma.profile.findUnique({ where: { userId: user.id } });
        academics = await prisma.academic.findMany({ where: { userId: user.id } });
    }

    // Pass profile + user name + academics to client so the form can prefill more fields
    const initialData = {
        ...profileData,
        name: user?.id ? (await prisma.user.findUnique({ where: { id: user.id }, select: { name: true } }))?.name : undefined,
        academics,
    };

    return <ProfileFormClient initialData={initialData} />;
}
