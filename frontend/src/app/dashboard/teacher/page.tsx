"use client";

import Link from "next/link";


export default function TeacherDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Teacher Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Classes Section */}
        <div className="border rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Manage Classes</h2>
          <p className="mb-4 text-gray-600">
            View and manage your assigned classes and students.
          </p>
          <Link
            href="/dashboard/teacher/class"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Go to Classes
          </Link>
        </div>

        {/* Mentoring Students Section */}
        <div className="border rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Mentoring Students</h2>
          <p className="mb-4 text-gray-600">
            View and guide your assigned mentee students.
          </p>
          <Link
            href="/dashboard/teacher/mentoring"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            View Mentoring List
          </Link>
        </div>

      </div>
    </div>
  );
}
