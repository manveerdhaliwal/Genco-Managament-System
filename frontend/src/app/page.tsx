"use client";
import { useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F8FA] text-gray-800">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center p-4 bg-white shadow-md">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="logo" className="w-10 h-10" />
          <span className="font-bold text-lg">TheGenconians-GMS</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <Link href="/about" className="hover:text-blue-600">About</Link>
          <Link href="/contact" className="hover:text-blue-600">Contact</Link>
          <Link
            href="/sign-up"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Sign Up
          </Link>
        </div>

        
      </nav>

      {/* HERO */}
      <header className="flex flex-col items-center justify-center text-center py-16 px-4 bg-gradient-to-r from-blue-500 to-red-500 text-white">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          Welcome to TheGenconians GMS
        </h1>
        <p className="text-base sm:text-lg md:text-xl max-w-2xl">
          A smart portal for Students, Teachers, and Admins to manage everything in one place.
        </p>
      </header>

      {/* ROLE CARDS */}
      <section className="py-12 px-6 grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-xl transition">
          <img src="/student.png" alt="student" className="w-16 h-16 mb-4" />
          <h2 className="text-lg md:text-xl font-semibold mb-2">Students</h2>
          <p className="text-gray-600">Access training forms, resources, and updates.</p>
          <Link href="/sign-in" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Enter as Student
          </Link>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-xl transition">
          <img src="/teacher.png" alt="teacher" className="w-16 h-16 mb-4" />
          <h2 className="text-lg md:text-xl font-semibold mb-2">Teachers</h2>
          <p className="text-gray-600">Manage student info and oversee training programs.</p>
          <Link href="/sign-in" className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Enter as Teacher
          </Link>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-xl transition sm:col-span-2 md:col-span-1">
          <img src="/profile.png" alt="admin" className="w-16 h-16 mb-4" />
          <h2 className="text-lg md:text-xl font-semibold mb-2">Admins</h2>
          <p className="text-gray-600">Full control of system users and operations.</p>
          <Link href="/sign-in" className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900">
            Enter as Admin
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white py-12 px-6 text-center">
        <h2 className="text-xl md:text-2xl font-bold mb-8">Why TheGenconians GMS?</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto">
          <div className="p-6 bg-gray-50 rounded-xl shadow-md">
            <h3 className="font-semibold text-base md:text-lg mb-2">Student Info Management</h3>
            <p className="text-gray-600 text-sm md:text-base">
              Keep all student data organized and accessible.
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl shadow-md">
            <h3 className="font-semibold text-base md:text-lg mb-2">Training Forms</h3>
            <p className="text-gray-600 text-sm md:text-base">
              Students can submit and teachers can review easily.
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl shadow-md sm:col-span-2 md:col-span-1">
            <h3 className="font-semibold text-base md:text-lg mb-2">Admin Dashboard</h3>
            <p className="text-gray-600 text-sm md:text-base">
              Centralized control for managing the entire system.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto bg-gray-900 text-gray-300 text-center p-6">
        <p>© {new Date().getFullYear()} TheGenconians GMS. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2 flex-wrap text-sm">
          <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white">Terms</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
        </div>
      </footer>
    </div>
  );
}
