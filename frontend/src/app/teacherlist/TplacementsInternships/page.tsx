"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";

interface PlacementEntry {
  _id?: string;
  studentName: string;
  urn: string;
  section: string;
  title: string;
  organization: string;
  description: string;
  year: string;              // ✅ backend student year added
  yearOfPlacement: string;
  pdfPreview: string | null;
}

const years = ["Final", "3rd", "2nd"];
const sections = ["All", "A", "B"];

export default function PlacementInternshipPage() {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState("All");
  const [placements, setPlacements] = useState<PlacementEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:5000/api/Placement/allPlacements",
          { withCredentials: true }
        );

        if (res.data.success) {
          const mapped = res.data.data.map((p: any) => ({
            _id: p._id,
            studentName: p.student?.name,
            urn: p.student?.URN,
            section: p.student?.section,
            title: p.role,
            organization: p.companyName,
            description: p.companyDescription,
            year: String(p.student?.year || ""),   // ✅ IMPORTANT!
            yearOfPlacement: p.yearOfPlacement,
            pdfPreview: p.offerLetterUrl || null,
          }));

          setPlacements(mapped);
        } else {
          setError(res.data.message || "No placements found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch placements");
      } finally {
        setLoading(false);
      }
    };

    fetchPlacements();
  }, []);

  // ✅ Convert UI label → actual year number
  const yearMap: Record<string, string> = {
    Final: "4",
    "3rd": "3",
    "2nd": "2",
  };

  const activeYear = selectedYear ? yearMap[selectedYear] : "";

  // ✅ Correct filtering
  const filteredPlacements = placements
    .filter((p) => (selectedYear ? p.year === activeYear : true))
    .filter((p) => selectedSection === "All" || p.section === selectedSection)
    .sort((a, b) => a.urn.localeCompare(b.urn));

  if (loading) return <p className="p-6">Loading placements...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

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
                  className="cursor-pointer bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition"
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
              <h1 className="text-3xl font-bold text-indigo-700 mb-4">
                {selectedYear} Year Placements
              </h1>

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

            {/* Section filter */}
            <div className="mb-4 flex gap-4 items-center">
              <span className="font-medium text-gray-700">Filter by Section:</span>
              <select
                className="border border-gray-300 rounded-xl px-4 py-2"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                {sections.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
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
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Offer Letter</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {filteredPlacements.map((p, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">{p.urn}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{p.studentName}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{p.section}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{p.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{p.organization}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{p.description}</td>
                      <td className="px-6 py-4 text-center">
                        {p.pdfPreview ? (
                          <a
                            href={p.pdfPreview}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-indigo-600 text-white px-4 py-1 rounded-xl hover:bg-indigo-700 transition"
                          >
                            View
                          </a>
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
      </div>
    </div>
  );
}
