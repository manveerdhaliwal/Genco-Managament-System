"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";

type PaperType = "Journal" | "Conference" | "Workshop";

interface PaperData {
  _id?: string;
  studentName: string;
  urn: string;
  section: string;
  paperTitle: string;
  publicationName: string;
  publicationDate: string;
  paperLink: string;
  doi?: string;
  facultyName?: string;
  paperType: PaperType;
}

const years = ["Final", "3rd", "2nd"];
const sections = ["All", "A", "B"];

export default function ResearchPaperPage() {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState("All");
  const [papers, setPapers] = useState<PaperData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPaper, setSelectedPaper] = useState<PaperData | null>(null);

 useEffect(() => {
  const fetchPapers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/Research/studentpapers", {
        withCredentials: true, // if using cookies
      });

      if (res.data.success) {
        // Map backend response to frontend-friendly fields
        const mapped = res.data.data.map((p: any) => ({
          _id: p._id,
          studentName: p.student.name,
          urn: p.student.URN,
          section: p.student.section,
          paperTitle: p.paperTitle,
          publicationName: p.journalName,
          publicationDate: new Date(p.date).toISOString().split("T")[0],
          paperLink: p.linkOfPaper,
          doi: p.doi,
          facultyName: p.facultyMentor,
          paperType: p.type,
        }));
        setPapers(mapped);
      } else {
        setError(res.data.message || "No papers found");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch papers");
    } finally {
      setLoading(false);
    }
  };

  fetchPapers();
}, []);

  // Filter by year and section
  const yearMap: Record<string, number> = { "Final": 4, "3rd": 3, "2nd": 2 };
  const filteredPapers = papers
    .filter((p) => p.section === selectedSection || selectedSection === "All")
    .filter((p) => {
      if (!selectedYear) return true;
      return p.studentName && yearMap[selectedYear] ? true : false; // adjust later if student year available
    })
    .sort((a, b) => a.urn.localeCompare(b.urn));

  if (loading) return <p className="p-6">Loading papers...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-tr from-[#EDF9FD] to-[#FFFFFF]">
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
              <h1 className="text-3xl font-bold text-indigo-700 mb-4">{selectedYear} Year Papers</h1>
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
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPapers.map((paper) => (
                    <tr key={paper._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">{paper.urn}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{paper.studentName}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{paper.section}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{paper.paperTitle}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{paper.paperType}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedPaper(paper)}
                          className="bg-indigo-600 text-white px-4 py-1 rounded-xl hover:bg-indigo-700 transition"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Popup / Modal */}
        {selectedPaper && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-4 max-w-4xl w-full relative">
              <button
                onClick={() => setSelectedPaper(null)}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-xl"
              >
                &times;
              </button>
              <h2 className="text-xl font-semibold mb-4">{selectedPaper.studentName} - {selectedPaper.paperTitle}</h2>
              <p className="mb-2"><strong>URN:</strong> {selectedPaper.urn}</p>
              <p className="mb-2"><strong>Section:</strong> {selectedPaper.section}</p>
              <p className="mb-2"><strong>Publication:</strong> {selectedPaper.publicationName}</p>
              <p className="mb-2"><strong>Date:</strong> {selectedPaper.publicationDate}</p>
              {selectedPaper.doi && <p className="mb-2"><strong>DOI:</strong> {selectedPaper.doi}</p>}
              {selectedPaper.facultyName && <p className="mb-2"><strong>Faculty:</strong> {selectedPaper.facultyName}</p>}
              <p className="mb-2">
                <strong>Link:</strong>{" "}
                <a href={selectedPaper.paperLink} target="_blank" className="text-indigo-600 hover:underline">
                  {selectedPaper.paperLink}
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
