"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

// ✅ FIXED: Use Google Drive Viewer for reliable inline viewing
const getInlineViewUrl = (url: string): string => {
  if (!url) return "";
  return `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(url)}`;
};

type TrainingField = "TR101" | "TR102" | "TR103";

interface TrainingEntry {
  _id: string;
  studentName: string;
  urn: string;
  crn?: string;
  year: string;
  section: string;
  trainingField: TrainingField;
  organisationName: string;
  organisationDetails: string;
  organisationSupervisor: string;
  fieldOfWork: string;
  projectsMade: string;
  projectDescription: string;
  trainingDuration: string;
  certificateAwarded: boolean;
  certificatepdf?: string;
}

const years = ["Final", "3rd", "2nd"];
const sections = ["All", "A", "B"];

const yearMap: Record<string, string> = {
  Final: "4",
  "3rd": "3",
  "2nd": "2",
};

export default function TeacherTrainingPage() {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedPreview, setSelectedPreview] = useState<TrainingEntry | null>(null);
  const [trainings, setTrainings] = useState<TrainingEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/Training/all", {
          withCredentials: true,
        });
        if (res.data.success) {
          const mapped = res.data.data.map((t: any) => {
            return {
              _id: t._id,
              studentName: t.student?.name || "N/A",
              urn: t.student?.URN || "N/A",
              crn: t.student?.CRN || "",
              section: t.student?.section || "N/A",
              year: String(t.student?.year || ""),
              trainingField: t.trainingField,
              organisationName: t.organisationName,
              organisationDetails: t.organisationDetails,
              organisationSupervisor: t.organisationSupervisor,
              fieldOfWork: t.fieldOfWork,
              projectsMade: t.projectsMade,
              projectDescription: t.projectDescription,
              trainingDuration: t.trainingDuration,
              certificateAwarded: t.certificateAwarded,
              certificatepdf: t.certificatepdf || "",
            };
          });

          setTrainings(mapped);
        }
      } catch (err) {
        console.log("Error fetching trainings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainings();
  }, []);

  const filteredTrainings = trainings
    .filter((t) => {
      if (!selectedYear) return true;
      return String(t.year) === yearMap[selectedYear];
    })
    .filter((t) => selectedSection === "All" || t.section === selectedSection)
    .filter((t) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        t.studentName.toLowerCase().includes(term) ||
        t.urn.toLowerCase().includes(term) ||
        (t.crn && t.crn.toLowerCase().includes(term))
      );
    })
    .sort((a, b) => a.urn.localeCompare(b.urn));

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading training records...
      </div>
    );

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-tr from-[#EDF9FD] to-[#FFFFFF]">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <Link
          href={`/dashboard/teacher`}
          className="mb-4 inline-flex items-center justify-center w-10 h-10 bg-indigo-500 text-white rounded-full shadow hover:bg-indigo-600 transition duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
              <h1 className="text-3xl font-bold text-indigo-700 mb-4">
                {selectedYear} Year Trainings
              </h1>
              <button
                onClick={() => {
                  setSelectedYear(null);
                  setSelectedSection("All");
                  setSearchTerm("");
                }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition"
              >
                Back
              </button>
            </div>

            <div className="mb-4 flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Section:</span>
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

              <input
                type="text"
                placeholder="Search by Name, URN, or CRN"
                className="border border-gray-300 rounded-xl px-4 py-2 flex-1 focus:ring-2 focus:ring-indigo-400 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="overflow-x-auto shadow-md rounded-2xl bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium">URN</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Student</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Section</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Training Code</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Organization</th>
                    <th className="px-6 py-3 text-center text-sm font-medium">View</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {filteredTrainings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-gray-500">
                        No matching records found.
                      </td>
                    </tr>
                  ) : (
                    filteredTrainings.map((t) => (
                      <tr key={t._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{t.urn}</td>
                        <td className="px-6 py-4">{t.studentName}</td>
                        <td className="px-6 py-4">{t.section}</td>
                        <td className="px-6 py-4">{t.trainingField}</td>
                        <td className="px-6 py-4">{t.organisationName}</td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => setSelectedPreview(t)}
                            className="bg-indigo-600 text-white px-4 py-1 rounded-xl hover:bg-indigo-700"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {selectedPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-6 max-w-4xl w-full relative shadow-lg max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedPreview(null)}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-xl"
              >
                &times;
              </button>

              <h2 className="text-xl font-semibold mb-4">
                {selectedPreview.studentName} ({selectedPreview.urn})
              </h2>

              <div className="space-y-2 text-gray-700 text-sm">
                <p><strong>Training Code:</strong> {selectedPreview.trainingField}</p>
                <p><strong>Organization:</strong> {selectedPreview.organisationName}</p>
                <p><strong>Details:</strong> {selectedPreview.organisationDetails}</p>
                <p><strong>Supervisor:</strong> {selectedPreview.organisationSupervisor}</p>
                <p><strong>Field of Work:</strong> {selectedPreview.fieldOfWork}</p>
                <p><strong>Projects:</strong> {selectedPreview.projectsMade}</p>
                <p><strong>Description:</strong> {selectedPreview.projectDescription}</p>
                <p><strong>Duration:</strong> {selectedPreview.trainingDuration}</p>
                <p>
                  <strong>Certificate Awarded:</strong>{" "}
                  {selectedPreview.certificateAwarded ? "Yes" : "No"}
                </p>
              </div>

              {/* ✅ FIXED: Certificate PDF with proper view/download */}
              {selectedPreview.certificatepdf && (
                <div className="mt-4 flex gap-4">
                  <a
                    href={getInlineViewUrl(selectedPreview.certificatepdf)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition"
                  >
                    View Certificate
                  </a>

                  <a
                    href={selectedPreview.certificatepdf}
                    download
                    className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition"
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