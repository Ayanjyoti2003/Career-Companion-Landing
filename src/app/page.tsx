"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Brain,
  FileText,
  GraduationCap,
  Users,
  LineChart,
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { FiPhoneCall } from "react-icons/fi";
import HeroSection from "./home page/hero section/page";

export default function LandingPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setStatus("An error occurred. Try again later.");
    }
  };



  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 text-gray-800">
      {/* 🌐 Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 shadow-sm bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <Link href={"/#hero"} className="text-2xl font-bold text-blue-600">Career-Companion</Link>
        <div className="space-x-6 text-sm font-medium">
          <Link href="#features" className="hover:text-blue-600">
            Features
          </Link>
          <Link href="#how" className="hover:text-blue-600">
            How It Works
          </Link>
          <Link href="#contact" className="hover:text-blue-600">
            Contact
          </Link>
          <Link
            href="/signin"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* 💡 Hero Section */}
      <HeroSection />

      {/* ⚙️ Features Section */}
      <section id="features" className="py-20 px-8 bg-white">
        <h2 className="text-4xl font-bold text-center mb-12">What You Get</h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <FeatureCard
            icon={<FileText className="w-10 h-10 text-blue-600" />}
            title="AI Resume Builder"
            desc="Create ATS-friendly resumes, analyze your strengths, and match your profile with top opportunities."
          />
          <FeatureCard
            icon={<Brain className="w-10 h-10 text-blue-600" />}
            title="Personalized Learning Path"
            desc="AI recommends skills, mini projects, and certifications tailored to your goals."
          />
          <FeatureCard
            icon={<Users className="w-10 h-10 text-blue-600" />}
            title="Mentor & Interview Support"
            desc="Practice interviews with AI or connect with mentors to improve your confidence and performance."
          />
          <FeatureCard
            icon={<LineChart className="w-10 h-10 text-blue-600" />}
            title="Career Analytics"
            desc="Track your job applications, skill progress, and get actionable feedback with visual insights."
          />
          <FeatureCard
            icon={<GraduationCap className="w-10 h-10 text-blue-600" />}
            title="Career Domain Guidance"
            desc="Discover your best-fit domains based on interests, strengths, and market trends."
          />
          <FeatureCard
            icon={<ArrowRight className="w-10 h-10 text-blue-600" />}
            title="AI Career Coach"
            desc="Chat with your 24×7 AI companion to get advice, career tips, and personalized guidance."
          />
        </div>
      </section>

      {/* 🧭 How It Works */}
      <section id="how" className="py-20 px-8 bg-blue-50">
        <h2 className="text-4xl font-bold text-center mb-12">
          Your Career Journey Simplified
        </h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-8 text-center">
          <StepCard
            step="1"
            title="Join the Platform"
            desc="Sign up and explore career domains tailored for you."
          />
          <StepCard
            step="2"
            title="Build Your Skills"
            desc="Follow AI-recommended learning paths and mini projects."
          />
          <StepCard
            step="3"
            title="Create Resume"
            desc="Generate smart, ATS-friendly resumes instantly."
          />
          <StepCard
            step="4"
            title="Get Hired!"
            desc="Apply confidently with personalized job matches and feedback."
          />
        </div>
      </section>

      {/* 📩 Contact Section */}
      <section id="contact" className="py-20 px-8 bg-white">
        <h2 className="text-4xl font-bold text-center mb-8">
          Get in Touch 📬
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-xl mx-auto">
          Have questions, feedback, or partnership ideas? We’d love to hear from
          you. Drop your message below and we’ll get back to you soon.
        </p>

        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto bg-blue-50 p-8 rounded-2xl shadow-md border border-blue-100"
        >
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Your full name"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Type your message here..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            Send Message
          </button>

          {status && (
            <p className="text-center mt-4 text-sm text-blue-700">{status}</p>
          )}
        </form>
      </section>

      {/* 🦶 Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Left Section */}
          <div>
            <h2 className="text-2xl font-bold">
              <span className="text-blue-600">Career</span>
              <span className="text-gray-500">Companion</span>.in
            </h2>

            <p className="text-gray-500 mt-3">
              Your personal AI-powered mentor to help you explore careers, build resumes,
              and make confident future decisions.
            </p>

            <p className="text-gray-700 font-medium mt-5">Follow us on:</p>
            <div className="flex space-x-4 mt-2 text-gray-600">
              <FaFacebookF className="cursor-pointer hover:text-blue-600 transition" />
              <FaInstagram className="cursor-pointer hover:text-pink-500 transition" />
              <FaTwitter className="cursor-pointer hover:text-blue-400 transition" />
              <FaLinkedinIn className="cursor-pointer hover:text-blue-700 transition" />
            </div>
          </div>

          {/* Middle Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>

            <input
              type="text"
              placeholder="Search Career"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-5 focus:ring-1 focus:ring-blue-500"
            />

            <ul className="space-y-2 text-gray-700">
              <li className="hover:underline cursor-pointer">Our Story</li>
              <li className="hover:underline cursor-pointer">Blogs</li>
              <li className="hover:underline cursor-pointer">FAQ</li>
              <li className="hover:underline cursor-pointer">Careers</li>
              <li className="hover:underline cursor-pointer">Resources</li>
              <li className="hover:underline cursor-pointer">Events & Programs</li>
              <li className="hover:underline cursor-pointer">Contact Us</li>
            </ul>
          </div>

          {/* Right Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Need to Chat?</h3>
            <p className="text-gray-500 mb-4">
              We're here to help with any questions you may have.
            </p>

            <div className="flex items-center space-x-2 bg-blue-100 text-blue-700 w-fit px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-200 transition">
              <FiPhoneCall className="text-lg" />
              <span className="font-medium">+91 1234567891</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-10 pt-4 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} CareerPath.in — All Rights Reserved.
        </div>
      </footer>
    </main>
  );
}

// Reusable Components
function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  );
}

function StepCard({
  step,
  title,
  desc,
}: {
  step: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
      <div className="text-blue-600 font-bold text-3xl mb-3">{step}</div>
      <h4 className="font-semibold text-lg mb-2">{title}</h4>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  );
}
