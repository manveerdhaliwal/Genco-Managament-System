"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

type Student = {
  name: string;
 // roll: string;
  CRN: string;
  URN: string;
  phone?: string;
  address?: string;
  track?: string;
  avgCgpa?: string;
  training?: string;
  certifications?: string;
  projects?: string;
  linkedin?: string;
  github?: string;
  photo?: string;
  certificatePdf?: string;
  internshipPdf?: string;
  researchPaperUrl?: string;
  year: string; // important to categorize
  section:string;
};

export default function StudentListPage() {
  const searchParams = useSearchParams();
  const classId = searchParams.get("classId"); // e.g., cse-final-year
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/teacher/mystudents", {
          method: "GET",
          credentials: "include", // important if using cookie-based auth
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch students");
          setLoading(false);
          return;
        }

        if (!Array.isArray(data.students)) {
          setError("Invalid data received from server");
          setLoading(false);
          return;
        }

        setStudents(data.students);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Something went wrong");
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) return <p className="p-6">Loading students...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  // Map classId to year
  const yearMap: Record<string, string> = {
    "cse-2nd-year": "2",
    "cse-3rd-year": "3",
    "cse-final-year": "4",
  };

  const yearFilter = yearMap[classId || ""] || "";

  const filteredStudents = students.filter((s) => String(s.year) === yearFilter);


  return (
    <div className="p-6">
      <Link
        href={`/dashboard/teacher/class`}
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

      <h1 className="text-2xl font-bold mb-4">
        {classId?.replace(/-/g, " ").toUpperCase()} - Students
      </h1>

      {filteredStudents.length === 0 ? (
        <p>No students found for this year.</p>
      ) : (
        <table className="table-auto border-collapse border border-gray-300 w-full text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">CRN</th>
              <th className="border border-gray-300 px-4 py-2">URN</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Section</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.CRN} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{student.CRN}</td>
                <td className="border border-gray-300 px-4 py-2">{student.URN}</td>
                <td className="border border-gray-300 px-4 py-2">{student.name}</td>
                <td className="border border-gray-300 px-4 py-2">{student.section || "-"}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <Link
                    href={`/dashboard/teacher/studentdetail?roll=${student.CRN}`}
                    className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


