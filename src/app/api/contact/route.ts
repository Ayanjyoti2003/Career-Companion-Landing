import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const { name, email, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // Configure transporter
        const transporter = nodemailer.createTransport({
            service: "gmail", // change this if not using Gmail
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Define the email content
        const mailOptions = {
            from: `"Career Companion Contact" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_RECEIVER,
            subject: `New Message from ${name}`,
            text: `
        You have a new contact form message:
        -------------------------------------
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
            html: `
        <h2>New Contact Form Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Email send failed:", error);
        return NextResponse.json({ error: "Email failed to send" }, { status: 500 });
    }
}
