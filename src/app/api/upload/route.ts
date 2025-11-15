import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as any;

        if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        if (!cloudName) {
            console.error("CLOUDINARY_CLOUD_NAME missing");
            return NextResponse.json({ error: "Cloudinary not configured" }, { status: 500 });
        }

        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;
        const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

        // If API key/secret are present, perform a signed upload. Otherwise fall back to unsigned preset.
        const uploadForm = new FormData();
        uploadForm.append("file", file);

        if (apiKey && apiSecret) {
            // Signed upload: compute timestamp and signature
            const timestamp = Math.floor(Date.now() / 1000);
            // Only signing timestamp; if you need to sign more params, include them in paramsToSign sorted alphabetically
            const paramsToSign = `timestamp=${timestamp}`;
            const signature = crypto.createHash("sha1").update(paramsToSign + apiSecret).digest("hex");

            uploadForm.append("api_key", apiKey);
            uploadForm.append("timestamp", String(timestamp));
            uploadForm.append("signature", signature);
        } else if (uploadPreset) {
            uploadForm.append("upload_preset", uploadPreset);
        } else {
            console.error("No Cloudinary upload credentials configured");
            return NextResponse.json({ error: "Cloudinary not configured" }, { status: 500 });
        }

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
            method: "POST",
            body: uploadForm as any,
        });

        if (!uploadRes.ok) {
            const text = await uploadRes.text();
            console.error("Cloudinary upload failed:", text);
            // Return debug details in non-production to help diagnose
            if (process.env.NODE_ENV !== "production") {
                return NextResponse.json({ error: "Upload failed", details: text }, { status: 502 });
            }
            return NextResponse.json({ error: "Upload failed" }, { status: 502 });
        }

        const json = await uploadRes.json();
        return NextResponse.json({ url: json.secure_url });
    } catch (err) {
        console.error("Upload route error:", err);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

