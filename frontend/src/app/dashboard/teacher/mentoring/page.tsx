"use client";

import Link from "next/link";

const mentees = [
  {
    name: "Moyemoye",
    roll: "2203542",
    track: "Machine Learning",
    phone: "+91-9876543210",
    email: "moyemoye@example.com",
    cgpa: "9.1",
  },
  {
    name: "Aman Singh",
    roll: "2203543",
    track: "Data Science",
    phone: "+91-9876543211",
    email: "aman@example.com",
    cgpa: "8.7",
  },
  {
    name: "Neha Kaur",
    roll: "2203544",
    track: "Cybersecurity",
    phone: "+91-9876543212",
    email: "neha@example.com",
    cgpa: "8.9",
  },
];

export default function MentoringListPage() {
  const sortedMentees = [...mentees].sort((a, b) => a.roll.localeCompare(b.roll));

  return (
    <div className="p-6">
      {/* Back Button */}
      <Link
  href={`/dashboard/teacher`}
  className="mb-4 inline-flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full shadow hover:bg-green-600 transition duration-200"
  aria-label="Go back"
>
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
  </svg>
</Link>

      <h1 className="text-2xl font-bold mb-4">Mentoring List</h1>

      <table className="table-auto border-collapse border border-gray-300 w-full text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Roll Number</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Track</th>
            <th className="border border-gray-300 px-4 py-2">Phone</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">CGPA</th>
          </tr>
        </thead>
        <tbody>
          {sortedMentees.map((mentee) => (
            <tr key={mentee.roll} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{mentee.roll}</td>
              <td className="border border-gray-300 px-4 py-2">{mentee.name}</td>
              <td className="border border-gray-300 px-4 py-2">{mentee.track}</td>
              <td className="border border-gray-300 px-4 py-2">{mentee.phone}</td>
              <td className="border border-gray-300 px-4 py-2">{mentee.email}</td>
              <td className="border border-gray-300 px-4 py-2">{mentee.cgpa}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
