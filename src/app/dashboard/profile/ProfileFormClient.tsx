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

interface Academic {
    level: string;
    school: string;
    board: string;
    course: string;
    branch: string;
    passingYear: string;
    marks: string;
    marksheet: File | null;
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

    const [academics, setAcademics] = useState<Academic[]>(() => {
        if (!initialData?.academics || initialData.academics.length === 0)
            return [
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

    function handleChange(e: any) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handleAcademicChange(index: number, field: keyof Academic, value: any) {
        const copy = [...academics];
        (copy[index] as any)[field] = value;
        setAcademics(copy);
    }

    function handleAcademicFileChange(index: number, file: File | null) {
        const copy = [...academics];
        copy[index].marksheet = file;
        setAcademics(copy);
    }

    function handleAddAcademic() {
        setAcademics([
            ...academics,
            { level: "", school: "", board: "", course: "", branch: "", passingYear: "", marks: "", marksheet: null },
        ]);
    }

    function handleRemoveAcademic(i: number) {
        const copy = academics.filter((_, idx) => idx !== i);
        if (copy.length === 0) {
            setAcademics([{ level: "", school: "", board: "", course: "", branch: "", passingYear: "", marks: "", marksheet: null }]);
        } else {
            setAcademics(copy);
        }
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        try {
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

            for (const a of academics) {
                let marksheetUrl: string | null = null;
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
                        }
                    } catch (err) {
                        console.error("Upload error", err);
                    }
                }

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

            const completeRes = await fetch("/api/profile/complete", { method: "POST" });
            if (!completeRes.ok) throw new Error("Failed to complete profile");

            window.location.href = "/dashboard";
        } catch (err) {
            console.error(err);
            alert("There was an error saving your profile. Please try again.");
        }
    }

    return (
        <>
            <div className="pb-24 md:pb-0">
                <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-black">Your Profile</h1>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-4 md:p-6 shadow-md rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-full md:max-w-4xl mx-auto"
                >
                    <ProfileField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
                    <ProfileField label="Date of Birth" type="date" name="dob" value={formData.dob} onChange={handleChange} />
                    <ProfileField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />

                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-black font-medium mb-1">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full min-w-0 border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:outline-none text-black"
                        >
                            <option value="">Select</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Prefer not to say</option>
                        </select>
                    </div>

                    <ProfileField label="Address" name="address" value={formData.address} onChange={handleChange} />
                    <ProfileField label="City" name="city" value={formData.city} onChange={handleChange} />
                    <ProfileField label="State" name="state" value={formData.state} onChange={handleChange} />
                    <ProfileField label="Nationality" name="nationality" value={formData.nationality} onChange={handleChange} />

                    <TextAreaField label="Skills" name="skills" value={formData.skills} onChange={handleChange} />
                    <TextAreaField label="Career Goals" name="careerGoals" value={formData.careerGoals} onChange={handleChange} />

                    {/* EDUCATION SECTION */}
                    <div className="col-span-2">
                        <h2 className="text-xl md:text-2xl font-semibold mb-3 text-black">Education</h2>

                        {academics.map((a: any, idx: number) => (
                            <div
                                key={idx}
                                className="mb-4 p-3 md:p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3"
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <strong className="text-black">{a.level || `Entry ${idx + 1}`}</strong>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveAcademic(idx)}
                                        className="text-sm text-red-600 px-2 py-1 rounded hover:bg-red-100"
                                    >
                                        Remove
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full min-w-0">
                                    <ProfileField
                                        label="School / Institute"
                                        name={`school-${idx}`}
                                        value={a.school}
                                        onChange={(e: any) => handleAcademicChange(idx, "school", e.target.value)}
                                    />
                                    <ProfileField
                                        label="Board"
                                        name={`board-${idx}`}
                                        value={a.board}
                                        onChange={(e: any) => handleAcademicChange(idx, "board", e.target.value)}
                                    />
                                    <ProfileField
                                        label="Course / Program"
                                        name={`course-${idx}`}
                                        value={a.course}
                                        onChange={(e: any) => handleAcademicChange(idx, "course", e.target.value)}
                                    />
                                    <ProfileField
                                        label="Branch"
                                        name={`branch-${idx}`}
                                        value={a.branch}
                                        onChange={(e: any) => handleAcademicChange(idx, "branch", e.target.value)}
                                    />
                                    <ProfileField
                                        label="Passing Year"
                                        name={`passingYear-${idx}`}
                                        value={a.passingYear}
                                        onChange={(e: any) => handleAcademicChange(idx, "passingYear", e.target.value)}
                                    />
                                    <ProfileField
                                        label="Marks (%)"
                                        name={`marks-${idx}`}
                                        value={a.marks}
                                        onChange={(e: any) => handleAcademicChange(idx, "marks", e.target.value)}
                                    />

                                    <div className="col-span-2">
                                        <label className="block text-black font-medium mb-1">Marksheet</label>
                                        <input
                                            type="file"
                                            onChange={(e: any) => handleAcademicFileChange(idx, e.target.files[0])}
                                            className="block w-full text-sm text-gray-600 
                                              file:mr-3 file:py-2 file:px-4 
                                              file:border-0 file:text-sm 
                                              file:bg-blue-600 file:text-white 
                                              file:rounded-lg file:cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={handleAddAcademic}
                            className="mt-2 inline-flex items-center justify-center w-12 h-12 md:w-10 md:h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                            aria-label="Add academic entry"
                        >
                            +
                        </button>
                    </div>

                    {/* DESKTOP SAVE BUTTON */}
                    <div className="col-span-2 hidden md:block">
                        <button className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                            Save Profile
                        </button>
                    </div>
                </form>
            </div>

            {/* MOBILE STICKY SAVE BUTTON */}
            <div className="fixed bottom-0 left-0 right-0 p-3 bg-white border-t shadow-md md:hidden">
                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
                >
                    Save Profile
                </button>
            </div>
        </>
    );
}

function ProfileField({ label, name, value, onChange, type = "text" }: any) {
    return (
        <div className="w-full min-w-0 col-span-2 md:col-span-1">
            <label className="block text-black font-medium mb-1">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-base focus:ring-blue-500 focus:outline-none text-black"
            />
        </div>
    );
}

function TextAreaField({ label, name, value, onChange }: any) {
    return (
        <div className="col-span-2 w-full min-w-0 md:col-span-1">
            <label className="block text-black font-medium mb-1">{label}</label>
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                className="w-full min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-base focus:ring-blue-500 focus:outline-none text-black"
                rows={3}
            />
        </div>
    );
}
