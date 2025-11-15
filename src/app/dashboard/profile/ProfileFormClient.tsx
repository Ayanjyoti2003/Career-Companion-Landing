"use client";

import { useState } from "react";

function formatDateForInput(d: any) {
    if (!d) return "";
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

export default function ProfileFormClient({ initialData }: { initialData?: any }) {
    function findAcademicMark(levelKey: string) {
        if (!initialData?.academics) return "";
        const found = initialData.academics.find((a: any) => {
            const lvl = String(a.level || "").toLowerCase();
            return lvl === levelKey || lvl.includes(levelKey);
        });
        return found?.marks ?? "";
    }

    const [formData, setFormData] = useState(() => ({
        fullName: initialData?.name ?? initialData?.fullName ?? "",
        dob: initialData ? formatDateForInput(initialData.dob) : "",
        phone: initialData?.phone ?? "",
        gender: initialData?.gender ?? "",
        address: initialData?.address ?? "",
        city: initialData?.city ?? "",
        state: initialData?.state ?? "",
        nationality: initialData?.nationality ?? "",
        skills: initialData?.skills ?? "",
        interests: initialData?.interests ?? "",
        careerGoals: initialData?.careerGoals ?? "",
    }));

    const [academics, setAcademics] = useState(() => {
        // Ensure at least one education entry is visible by default (Entry 1)
        if (!initialData?.academics || initialData.academics.length === 0) return [
            { level: "", school: "", board: "", course: "", branch: "", passingYear: "", marks: "", marksheet: null },
        ];

        return initialData.academics.map((a: any) => ({
            level: a.level ?? "",
            school: a.school ?? "",
            board: a.board ?? "",
            course: a.course ?? "",
            branch: a.branch ?? "",
            passingYear: a.passingYear?.toString() ?? "",
            marks: a.marks ?? "",
            marksheet: null,
        }));
    });

    const [docs, setDocs] = useState<any[]>([]);

    function handleChange(e: any) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    // file handling is done per-academic via handleAcademicFileChange

    function handleAcademicChange(index: number, field: string, value: any) {
        const copy = [...academics];
        // @ts-ignore
        copy[index][field] = value;
        setAcademics(copy);
    }

    function handleAcademicFileChange(index: number, file: File | null) {
        const copy = [...academics];
        // @ts-ignore
        copy[index].marksheet = file;
        setAcademics(copy);
    }

    function handleAddAcademic() {
        setAcademics([...academics, { level: "", school: "", board: "", course: "", branch: "", passingYear: "", marks: "", marksheet: null }]);
    }

    function handleRemoveAcademic(i: number) {
        const copy = academics.filter((_: any, idx: number) => idx !== i);
        // Always keep at least one entry visible
        if (copy.length === 0) {
            setAcademics([{ level: "", school: "", board: "", course: "", branch: "", passingYear: "", marks: "", marksheet: null }]);
        } else {
            setAcademics(copy);
        }
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        try {
            // 1) Save personal profile data (Profile fields + optionally fullName)
            const payload = {
                fullName: formData.fullName || null,
                dob: formData.dob || null,
                phone: formData.phone || null,
                gender: formData.gender || null,
                address: formData.address || null,
                city: formData.city || null,
                state: formData.state || null,
                nationality: formData.nationality || null,
                skills: formData.skills || null,
                interests: formData.interests || null,
                careerGoals: formData.careerGoals || null,
            };

            const res = await fetch("/api/profile/personal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to save profile");

            // 2) For each academic entry: upload marksheet via server endpoint and upsert academic + create document
            for (const a of academics) {
                let marksheetUrl: string | null = null;
                // @ts-ignore
                const file: File | null = a.marksheet ?? null;
                if (file) {
                    try {
                        const form = new FormData();
                        form.append("file", file);
                        const uploadRes = await fetch("/api/upload", { method: "POST", body: form });
                        if (uploadRes.ok) {
                            const j = await uploadRes.json();
                            marksheetUrl = j.url ?? null;
                            if (marksheetUrl) {
                                await fetch("/api/profile/document", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ type: `${a.level}-marksheet`, url: marksheetUrl }),
                                });
                            }
                        } else {
                            console.error("Upload failed for", a.level);
                        }
                    } catch (upErr) {
                        console.error("Upload error", upErr);
                    }
                }

                // upsert academic row
                await fetch("/api/profile/academic", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        level: a.level,
                        school: a.school,
                        board: a.board,
                        course: a.course,
                        branch: a.branch,
                        passingYear: a.passingYear ? Number(a.passingYear) : null,
                        marks: a.marks,
                        marksheetUrl,
                    }),
                });
            }

            // 3) Mark profile complete
            const completeRes = await fetch("/api/profile/complete", { method: "POST" });
            if (!completeRes.ok) throw new Error("Failed to complete profile");

            // Redirect
            window.location.href = "/dashboard";
        } catch (err) {
            console.error(err);
            alert("There was an error saving your profile. Please try again.");
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-black">Your Profile</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-xl grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* PERSONAL DETAILS */}
                <ProfileField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
                <ProfileField label="Date of Birth" type="date" name="dob" value={formData.dob} onChange={handleChange} />
                <ProfileField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />

                <div>
                    <label className="block text-black font-medium mb-1">Gender</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:outline-none text-black"
                    >
                        <option value="">Select</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Prefer not to say</option>
                    </select>
                </div>

                <ProfileField label="Address" name="address" value={formData.address} onChange={handleChange} />

                {/* ADDITIONAL PROFILE FIELDS */}
                <ProfileField label="City" name="city" value={formData.city} onChange={handleChange} />
                <ProfileField label="State" name="state" value={formData.state} onChange={handleChange} />
                <ProfileField label="Nationality" name="nationality" value={formData.nationality} onChange={handleChange} />
                <div className="col-span-2">
                    <label className="block text-black font-medium mb-1">Skills</label>
                    <textarea name="skills" value={formData.skills} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:outline-none text-black" />
                </div>
                <div className="col-span-2">
                    <label className="block text-black font-medium mb-1">Career Goals</label>
                    <textarea name="careerGoals" value={formData.careerGoals} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:outline-none text-black" />
                </div>

                {/* EDUCATION: dynamic list */}
                <div className="col-span-2">
                    <h2 className="text-xl font-semibold mb-3 text-black">Education</h2>
                    {academics.map((a: any, idx: number) => (
                        <div key={idx} className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                            <div className="flex items-center justify-between mb-2">
                                <strong className="text-black">{a.level || `Entry ${idx + 1}`}</strong>
                                <div>
                                    <button type="button" onClick={() => handleRemoveAcademic(idx)} className="text-sm text-red-600">Remove</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <ProfileField label="School / Institute" name={`school-${idx}`} value={a.school} onChange={(e: any) => handleAcademicChange(idx, "school", e.target.value)} />
                                <ProfileField label="Board" name={`board-${idx}`} value={a.board} onChange={(e: any) => handleAcademicChange(idx, "board", e.target.value)} />
                                <ProfileField label="Course / Program" name={`course-${idx}`} value={a.course} onChange={(e: any) => handleAcademicChange(idx, "course", e.target.value)} />
                                <ProfileField label="Branch" name={`branch-${idx}`} value={a.branch} onChange={(e: any) => handleAcademicChange(idx, "branch", e.target.value)} />
                                <ProfileField label="Passing Year" name={`passingYear-${idx}`} value={a.passingYear} onChange={(e: any) => handleAcademicChange(idx, "passingYear", e.target.value)} />
                                <ProfileField label="Marks (%)" name={`marks-${idx}`} value={a.marks} onChange={(e: any) => handleAcademicChange(idx, "marks", e.target.value)} />
                                <div className="col-span-2">
                                    <label className="block text-black font-medium mb-1">Marksheet</label>
                                    <input type="file" onChange={(e: any) => handleAcademicFileChange(idx, e.target.files[0])} className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-black" />
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="mt-2">
                        <button
                            type="button"
                            onClick={handleAddAcademic}
                            aria-label="Add academic entry"
                            title="Add academic entry"
                            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="col-span-2">
                    <button className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                        Save Profile
                    </button>
                </div>
            </form>
        </div>
    );
}

function ProfileField({ label, name, value, onChange, type = "text" }: any) {
    return (
        <div>
            <label className="block text-black font-medium mb-1">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:outline-none text-black"
            />
        </div>
    );
}

function FileField({ label, name, onChange }: any) {
    return (
        <div>
            <label className="block text-black font-medium mb-1">{label}</label>
            <input
                type="file"
                name={name}
                onChange={onChange}
                className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-black"
            />
        </div>
    );
}
