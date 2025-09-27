"use client";

import Link from "next/link";

const classesData = {
  "cse-final-year": {
    name: "CSE Final Year",
    students: ["Ritika", "Aman", "Priya"],
  },
  "cse-3rd-year": {
    name: "CSE 3rd Year",
    students: ["Rohit", "Simran", "Arjun"],
  },
    "cse-2nd-year": {
    name: "CSE 2nd Year",
    students: ["Rohit", "Simran", "Arjun"],
  },
};

export default function ClassPage() {
  return (
    <div className="p-6">
<Link
  href={`/dashboard/teacher`}
  className="mb-4 inline-flex items-center justify-center w-10 h-10 bg-indigo-500 text-white rounded-full shadow hover:bg-indigo-600 transition duration-200"
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
      <h1 className="text-2xl font-bold mb-4">Classes</h1>
      <ul className="space-y-4">
        {Object.entries(classesData).map(([classId, classInfo]) => (
          <li
            key={classId}
            className="border p-4 rounded-lg shadow-md flex justify-between items-center"
          >
            <span>{classInfo.name}</span>
            <Link
              href={`/dashboard/teacher/classstudent?classId=${classId}`}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              View Students
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
