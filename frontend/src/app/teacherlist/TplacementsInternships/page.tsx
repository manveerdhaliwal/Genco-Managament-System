"use client";
import Link from "next/link";
import { useState } from "react";

interface PlacementEntry {
  studentName: string;
  urn: string;
  section: string;
  title: string;
  organization: string;
  description: string;
  yearOfPlacement: string; // "Final", "3rd", "2nd"
  pdfPreview: string | null;
}

// Hardcoded demo data
const allPlacements: PlacementEntry[] = [
  {
    studentName: "Ritika Gupta",
    urn: "2203542",
    section: "A",
    title: "Software Engineer",
    organization: "Google",
    description: "Joined as SDE-1",
    yearOfPlacement: "Final",
    pdfPreview: "/pdfs/ritika_placement.pdf",
  },
  {
    studentName: "John Doe",
    urn: "2203545",
    section: "B",
    title: "Data Analyst",
    organization: "Microsoft",
    description: "Joined as Data Analyst",
    yearOfPlacement: "3rd",
    pdfPreview: "/pdfs/john_placement.pdf",
  },
  {
    studentName: "Alice Smith",
    urn: "2203543",
    section: "B",
    title: "Frontend Developer",
    organization: "Amazon",
    description: "Joined as Frontend Developer",
    yearOfPlacement: "Final",
    pdfPreview: "/pdfs/alice_placement.pdf",
  },
  {
    studentName: "Bob Johnson",
    urn: "2203541",
    section: "A",
    title: "Intern",
    organization: "TCS",
    description: "Summer Internship",
    yearOfPlacement: "2nd",
    pdfPreview: "/pdfs/bob_internship.pdf",
  },
];

const years = ["Final", "3rd", "2nd"];
const sections = ["All", "A", "B"];

export default function PlacementInternshipPage() {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState("All");
  const [selectedPreview, setSelectedPreview] = useState<PlacementEntry | null>(null);

  const filteredPlacements = allPlacements
    .filter((p) => p.yearOfPlacement === selectedYear && (selectedSection === "All" || p.section === selectedSection))
    .sort((a, b) => a.urn.localeCompare(b.urn));

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-tr from-[#EDF9FD] to-[#FFFFFF]">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
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

        {!selectedYear && (
          <>
            <h1 className="text-3xl font-bold text-indigo-700 mb-4">Select Year</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {years.map((year) => (
                <div
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className="cursor-pointer bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center justify-center hover:shadow-xl transition"
                >
                  <h2 className="text-xl font-semibold text-indigo-700">{year} Year</h2>
                </div>
              ))}
            </div>
          </>
        )}

        {selectedYear && (
          <>
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-indigo-700 mb-4">{selectedYear} Year Placements</h1>
              <button
                onClick={() => {
                  setSelectedYear(null);
                  setSelectedSection("All");
                }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition"
              >
                Back
              </button>
            </div>

            {/* Section Filter */}
            <div className="mb-4 flex gap-4 items-center">
              <span className="font-medium text-gray-700">Filter by Section:</span>
              <select
                className="border border-gray-300 rounded-xl px-4 py-2"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                {sections.map((sec) => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto shadow-md rounded-2xl bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">URN</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Student</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Section</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Organization</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPlacements.map((p, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">{p.urn}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{p.studentName}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{p.section}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{p.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{p.organization}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{p.description}</td>
                      <td className="px-6 py-4 text-center">
                        {p.pdfPreview ? (
                          <button
                            onClick={() => setSelectedPreview(p)}
                            className="bg-indigo-600 text-white px-4 py-1 rounded-xl hover:bg-indigo-700 transition"
                          >
                            View
                          </button>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Modal / Popup */}
        {selectedPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-4 max-w-4xl w-full relative">
              <button
                onClick={() => setSelectedPreview(null)}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-xl"
              >
                &times;
              </button>
              <h2 className="text-xl font-semibold mb-4">{selectedPreview.studentName} - {selectedPreview.title}</h2>
              {selectedPreview.pdfPreview && (
                <iframe
                  src={selectedPreview.pdfPreview}
                  className="w-full h-96"
                  title="Placement PDF"
                ></iframe>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
