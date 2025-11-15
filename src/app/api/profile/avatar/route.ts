import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const image = data?.image;
    if (!image || typeof image !== "string") return NextResponse.json({ error: "Invalid image" }, { status: 400 });

    try {
        const user = await prisma.user.update({
            where: { email: session.user?.email ?? "" },
            data: { image },
            select: { id: true, image: true },
        });

        return NextResponse.json({ success: true, image: user.image });
    } catch (err) {
        console.error("Failed to update avatar:", err);
        return NextResponse.json({ error: "Failed to update avatar" }, { status: 500 });
    }
}
