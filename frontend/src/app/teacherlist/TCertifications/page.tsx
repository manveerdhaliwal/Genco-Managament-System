"use client";

import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";

// ✅ Google Drive Viewer for reliable inline PDF viewing
const getInlineViewUrl = (url: string): string => {
  if (!url) return "";
  return `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(url)}`;
};

type CertificateType = "technical" | "cultural" | "sports";

interface CertificateEntry {
  _id: string;
  type: CertificateType;
  eventName: string;
  date: string;
  certificateUrl: string;
  studentName: string;
  urn: string;
  section: string;
  year: string;
}

const years = ["Final", "3rd", "2nd"];
const sections = ["All", "A", "B"];

const yearMap: Record<string, string> = {
  Final: "4",
  "3rd": "3",
  "2nd": "2",
};

export default function TeacherCertificatePage() {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState("All");
  const [certificates, setCertificates] = useState<CertificateEntry[]>([]);
  const [selectedPreview, setSelectedPreview] = useState<CertificateEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/Certificate/all", {
          withCredentials: true,
        });

        if (res.data.success) {
          const mapped = res.data.data.map((c: any) => ({
            _id: c._id,
            type: c.type,
            eventName: c.eventName,
            date: c.date?.split("T")[0] || "",
            certificateUrl: c.certificateUrl || "",
            studentName: c.student?.name || "N/A",
            urn: c.student?.URN || "N/A",
            section: c.student?.section || "N/A",
            year: String(c.student?.year || ""),
          }));

          setCertificates(mapped);
        }
      } catch (err) {
        console.error("Error fetching certificates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const filteredCertificates = certificates
    .filter((c) => (!selectedYear ? true : c.year === yearMap[selectedYear]))
    .filter((c) => (selectedSection === "All" ? true : c.section === selectedSection))
    .filter((c) =>
      searchQuery
        ? [c.studentName, c.urn, c.eventName, c.type]
            .some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()))
        : true
    )
    .sort((a, b) => a.urn.localeCompare(b.urn));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading certificates...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-tr from-[#EDF9FD] to-[#FFFFFF]">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* BACK BUTTON */}
        <Link
          href={`/dashboard/teacher`}
          className="mb-4 inline-flex items-center justify-center w-10 h-10 bg-indigo-500 text-white rounded-full shadow hover:bg-indigo-600 transition duration-200"
          aria-label="Go back"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>

        {/* YEAR SELECTION */}
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

        {/* CERTIFICATE TABLE */}
        {selectedYear && (
          <>
            <div className="flex justify-between items-center flex-wrap gap-3">
              <h1 className="text-3xl font-bold text-indigo-700 mb-4">
                {selectedYear} Year Certificates
              </h1>
              <button
                onClick={() => {
                  setSelectedYear(null);
                  setSelectedSection("All");
                  setSearchQuery("");
                }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition"
              >
                Back
              </button>
            </div>

            {/* SECTION & SEARCH FILTER */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
              <div className="flex gap-4 items-center">
                <span className="font-medium text-gray-700">Section:</span>
                <select
                  className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                >
                  {sections.map((sec) => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>
              </div>

              {/* Search bar */}
              <input
                type="text"
                placeholder="Search by name, URN, event, or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-2 w-full sm:w-80 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto shadow-md rounded-2xl bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">URN</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Student</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Section</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Event</th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">View</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {filteredCertificates.length > 0 ? (
                    filteredCertificates.map((c) => (
                      <tr key={c._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-800">{c.urn}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{c.studentName}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{c.section}</td>
                        <td className="px-6 py-4 text-sm text-gray-800 capitalize">{c.type}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{c.eventName}</td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => setSelectedPreview(c)}
                            className="bg-indigo-600 text-white px-4 py-1 rounded-xl hover:bg-indigo-700 transition"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-6 text-gray-500 italic"
                      >
                        No results found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ✅ PREVIEW POPUP */}
        {selectedPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-6 max-w-4xl w-full relative shadow-lg max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedPreview(null)}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-2xl w-8 h-8 flex items-center justify-center"
              >
                &times;
              </button>

              <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
                {selectedPreview.studentName} ({selectedPreview.urn})
              </h2>

              <div className="space-y-2 text-gray-700 text-sm">
                <p><strong>Section:</strong> {selectedPreview.section}</p>
                <p><strong>Type:</strong> <span className="capitalize">{selectedPreview.type}</span></p>
                <p><strong>Event:</strong> {selectedPreview.eventName}</p>
                <p><strong>Date:</strong> {selectedPreview.date}</p>
              </div>

              {/* ✅ View and Download Buttons */}
              {selectedPreview.certificateUrl && (
                <div className="mt-6 flex gap-4 flex-wrap">
                  <a
                    href={getInlineViewUrl(selectedPreview.certificateUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition"
                  >
                    View Certificate
                  </a>

                  <a
                    href={selectedPreview.certificateUrl}
                    download
                    className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition"
                  >
                    Download Certificate
                  </a>
                </div>
              )}

              {!selectedPreview.certificateUrl && (
                <p className="mt-6 text-gray-500 italic">No certificate file available</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}