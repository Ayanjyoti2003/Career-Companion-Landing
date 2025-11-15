import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();

    // Copy only allowed Profile fields into payloadProfile to avoid passing unexpected keys to Prisma
    const allowed = [
        "dob",
        "phone",
        "gender",
        "address",
        "city",
        "state",
        "nationality",
        "skills",
        "interests",
        "careerGoals",
    ];

    const payloadProfile: any = {};
    for (const key of allowed) {
        if (key in data) payloadProfile[key] = data[key];
    }

    // Normalize dob: accept date-only strings like "YYYY-MM-DD" and convert to JS Date
    if (payloadProfile.dob) {
        const parsed = new Date(payloadProfile.dob);
        if (Number.isNaN(parsed.getTime())) {
            return NextResponse.json({ error: "Invalid date format for dob" }, { status: 400 });
        }
        payloadProfile.dob = parsed;
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user?.email ?? "" },
        include: { profile: true },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Create or update profile
    try {
        // If fullName provided, update user.name as well
        if (data.fullName) {
            try {
                await prisma.user.update({ where: { id: user.id }, data: { name: data.fullName } });
            } catch (e) {
                console.error("Failed updating user name:", e);
            }
        }

        await prisma.profile.upsert({
            where: { userId: user.id },
            update: { ...payloadProfile },
            create: { ...payloadProfile, userId: user.id },
        });
    } catch (err) {
        console.error("Error saving profile:", err);
        return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
