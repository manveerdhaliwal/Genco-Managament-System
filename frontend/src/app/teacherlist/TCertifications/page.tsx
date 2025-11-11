"use client";

import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";

type CertificateType = "technical" | "cultural" | "sports";

interface CertificateEntry {
  _id: string;
  type: CertificateType;
  eventName: string;
  date: string;
  certificateUrl: string; // ✅ correctly maps from backend
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

  // ✅ Fetch all certificates from backend
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/Certificate/all", {
          withCredentials: true,
        });

        if (res.data.success) {
          const mapped = res.data.data.map((c: any) => ({
            _id: c._id,
            type: c.type,
            eventName: c.eventName,
            date: c.date,

            // ✅ Cloudinary inline PDF preview
            certificateUrl: c.certificateUrl
              ? c.certificateUrl.replace(
                  "/upload/",
                  "/upload/fl_content_type:application/pdf/fl_disposition:inline/"
                )
              : "",

            // ✅ Correct student mapping
            studentName: c.student?.name || "N/A",
            urn: c.student?.URN || "N/A",
            section: c.student?.section || "N/A",
            year: String(c.student?.year || ""),
          }));

          setCertificates(mapped);
        }
      } catch (err) {
        console.error("Error fetching certificates:", err);
      }
    };

    fetchCertificates();
  }, []);

  // ✅ Apply filters
  const filteredCertificates = certificates
    .filter((c) => {
      if (!selectedYear) return true;
      return c.year === yearMap[selectedYear];
    })
    .filter((c) => selectedSection === "All" || c.section === selectedSection)
    .sort((a, b) => a.urn.localeCompare(b.urn));

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-tr from-[#EDF9FD] to-[#FFFFFF]">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        {/* BACK BUTTON */}
        <Link
          href={`/dashboard/teacher`}
          className="mb-4 inline-flex items-center justify-center w-10 h-10 bg-indigo-500 text-white rounded-full shadow hover:bg-indigo-600 transition duration-200"
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
                  className="cursor-pointer bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center hover:shadow-xl transition"
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
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-indigo-700 mb-4">
                {selectedYear} Year Certificates
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

            {/* SECTION FILTER */}
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

            {/* TABLE */}
            <div className="overflow-x-auto shadow-md rounded-2xl bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium">URN</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Student</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Section</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Type</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Event</th>
                    <th className="px-6 py-3 text-center text-sm font-medium">View</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {filteredCertificates.map((c) => (
                    <tr key={c._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{c.urn}</td>
                      <td className="px-6 py-4">{c.studentName}</td>
                      <td className="px-6 py-4">{c.section}</td>
                      <td className="px-6 py-4">{c.type}</td>
                      <td className="px-6 py-4">{c.eventName}</td>

                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedPreview(c)}
                          className="bg-indigo-600 text-white px-4 py-1 rounded-xl hover:bg-indigo-700"
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

        {/* ✅ PREVIEW POPUP */}
        {selectedPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-6 max-w-4xl w-full relative shadow-lg">
              <button
                onClick={() => setSelectedPreview(null)}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-xl"
              >
                &times;
              </button>

              <h2 className="text-xl font-semibold mb-4">
                {selectedPreview.studentName} ({selectedPreview.urn})
              </h2>

              <p><strong>Type:</strong> {selectedPreview.type}</p>
              <p><strong>Event:</strong> {selectedPreview.eventName}</p>
              <p><strong>Date:</strong> {selectedPreview.date}</p>

              {selectedPreview.certificateUrl && (
                <div className="mt-4">
                  <p className="font-medium text-indigo-700 mb-2">Certificate:</p>

                  <embed
                    src={selectedPreview.certificateUrl}
                    type="application/pdf"
                    className="w-full h-80 border rounded-lg"
                  />

                  {/* ✅ Download original (not inline manipulated) */}
                  <a
                    href={selectedPreview.certificateUrl.replace(
                      "/fl_content_type:application/pdf/fl_disposition:inline/",
                      ""
                    )}
                    download
                    target="_blank"
                    className="mt-3 inline-block bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700"
                  >
                    Download Certificate
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
