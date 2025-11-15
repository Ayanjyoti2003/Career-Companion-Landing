"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl: "/dashboard",
        });
        if (res?.error) setError("Invalid email or password");
        else window.location.href = "/dashboard";
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
            <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-md w-full border border-gray-100">
                <h1 className="text-3xl font-bold text-center mb-2 text-blue-600">Welcome Back 👋</h1>
                <p className="text-gray-500 text-center mb-8">Sign in to continue your career journey</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all">
                        Sign In
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-3 text-gray-500 text-sm">or</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* OAuth Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                        className="flex items-center justify-center w-full bg-white border border-gray-300 rounded-lg py-2 hover:shadow-md transition-all"
                    >
                        <FcGoogle className="text-2xl mr-3 drop-shadow-sm" />
                        <span className="text-gray-700 font-medium">Sign in with Google</span>
                    </button>


                    <button
                        onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                        className="flex items-center justify-center w-full bg-gray-900 text-white rounded-lg py-2 hover:bg-gray-800 transition-all shadow-sm"
                    >
                        <FaGithub className="text-xl mr-3" />
                        <span className="font-medium">Sign in with GitHub</span>
                    </button>

                </div>

                <p className="text-sm text-gray-600 text-center mt-6">
                    Don’t have an account?{" "}
                    <Link href="/signup" className="text-blue-600 font-medium hover:underline">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}
