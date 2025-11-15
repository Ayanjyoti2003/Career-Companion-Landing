import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { level, ...rest } = await req.json();

    const user = await prisma.user.findUnique({
        where: { email: session.user?.email ?? "" },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Each level stored separately
    await prisma.academic.upsert({
        where: {
            userId_level: { userId: user.id, level },
        },
        update: rest,
        create: {
            userId: user.id,
            level,
            ...rest,
        },
    });

    return NextResponse.json({ success: true });
}
