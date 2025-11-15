"use client";

import { useState, useRef } from "react";

export default function ProfileAvatar({ initialImage }: { initialImage?: string | null }) {
    const [image, setImage] = useState<string | null>(initialImage ?? null);
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);

            // Upload file to server upload route
            const form = new FormData();
            form.append("file", file);

            const uploadRes = await fetch("/api/upload", { method: "POST", body: form });
            if (!uploadRes.ok) throw new Error("Upload failed");
            const j = await uploadRes.json();
            const url = j.url;

            // Set on user via profile avatar route
            const setRes = await fetch("/api/profile/avatar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: url }),
            });
            if (!setRes.ok) throw new Error("Failed to update avatar");

            setImage(url);
        } catch (err) {
            console.error(err);
            alert("Failed to upload avatar. See console.");
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="relative inline-block">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500">
                <img src={image || "/default-avatar.png"} alt="Profile" className="w-full h-full object-cover" />
            </div>

            <label
                title="Change profile picture"
                className="absolute inset-0 flex items-end justify-end p-1 opacity-0 hover:opacity-100 transition-opacity"
                style={{ pointerEvents: "auto" }}
            >
                <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="bg-white bg-opacity-80 p-1 rounded-full shadow-md hover:bg-opacity-100"
                >
                    {uploading ? (
                        <svg className="w-5 h-5 animate-spin text-blue-600" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3v4M8 3v4m-5 4h18" />
                        </svg>
                    )}
                </button>
            </label>
        </div>
    );
}
