"use client";
import Link from "next/link";
import { useState } from "react";

type TrainingField = "TR101" | "TR102" | "TR103";

interface TrainingEntry {
  studentName: string;
  urn: string;
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

export default function TeacherTrainingPage() {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState("All");
  const [selectedPreview, setSelectedPreview] = useState<TrainingEntry | null>(null);

  // ✅ Hardcoded student training records
  const trainings: TrainingEntry[] = [
    {
      studentName: "Ritika Gupta",
      urn: "2203542",
      year: "Final",
      section: "A",
      trainingField: "TR101",
      organisationName: "Infosys Ltd.",
      organisationDetails: "Global IT services and consulting company.",
      organisationSupervisor: "Mr. Sharma",
      fieldOfWork: "Full Stack Development",
      projectsMade: "Employee Portal",
      projectDescription:
        "A web portal for employees to manage leave, payroll, and performance.",
      trainingDuration: "6 Weeks",
      certificateAwarded: true,
      certificatepdf: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      studentName: "Aman Verma",
      urn: "2203560",
      year: "3rd",
      section: "B",
      trainingField: "TR102",
      organisationName: "TCS",
      organisationDetails: "Tata Consultancy Services, IT and consulting.",
      organisationSupervisor: "Ms. Neha",
      fieldOfWork: "Data Analytics",
      projectsMade: "Customer Churn Prediction",
      projectDescription:
        "Developed ML models to predict customer churn for telecom sector.",
      trainingDuration: "8 Weeks",
      certificateAwarded: false,
    },
  ];

  const filteredTrainings = trainings
    .filter((t) => !selectedYear || t.year === selectedYear)
    .filter((t) => selectedSection === "All" || t.section === selectedSection)
    .sort((a, b) => a.urn.localeCompare(b.urn));

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-tr from-[#EDF9FD] to-[#FFFFFF]">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Back button */}
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

        {/* Year Selection */}
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

        {/* Table after selecting year */}
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

            {/* Trainings Table */}
            <div className="overflow-x-auto shadow-md rounded-2xl bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      URN
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Section
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Training Code
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Organization
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">
                      View
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTrainings.map((t, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">{t.urn}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{t.studentName}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{t.section}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{t.trainingField}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{t.organisationName}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedPreview(t)}
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

        {/* Training Detail Preview */}
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
              <div className="space-y-2 text-gray-700 text-sm">
                <p><strong>Training Code:</strong> {selectedPreview.trainingField}</p>
                <p><strong>Organization:</strong> {selectedPreview.organisationName}</p>
                <p><strong>Details:</strong> {selectedPreview.organisationDetails}</p>
                <p><strong>Supervisor:</strong> {selectedPreview.organisationSupervisor}</p>
                <p><strong>Field of Work:</strong> {selectedPreview.fieldOfWork}</p>
                <p><strong>Projects Made:</strong> {selectedPreview.projectsMade}</p>
                <p><strong>Description:</strong> {selectedPreview.projectDescription}</p>
                <p><strong>Duration:</strong> {selectedPreview.trainingDuration}</p>
                <p>
                  <strong>Certificate Awarded:</strong>{" "}
                  {selectedPreview.certificateAwarded ? "Yes" : "No"}
                </p>
              </div>
              {selectedPreview.certificatepdf && (
                <div className="mt-4">
                  <p className="font-medium text-indigo-700 mb-2">Certificate Preview:</p>
                  <iframe
                    src={selectedPreview.certificatepdf}
                    className="w-full h-80 border rounded-lg"
                    title="Certificate PDF"
                  ></iframe>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
