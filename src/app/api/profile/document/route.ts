import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { type, url } = await req.json(); // url from Cloudinary

    const user = await prisma.user.findUnique({
        where: { email: session.user?.email ?? "" },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    await prisma.document.create({
        data: { userId: user.id, type, url },
    });

    return NextResponse.json({ success: true });
}
