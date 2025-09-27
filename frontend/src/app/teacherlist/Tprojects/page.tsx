"use client";
import Link from "next/link";
import { useState } from "react";

interface ProjectData {
  studentName: string;
  urn: string;
  section: string;
  projectTitle: string;
  description: string;
  guideName: string;
  status: "ongoing" | "completed";
  projectLink: string; // GitHub / demo link
}

const allProjects: ProjectData[] = [
  {
    studentName: "Ritika Gupta",
    urn: "2203542",
    section: "A",
    projectTitle: "AI Trip Planner",
    description: "An AI-powered trip planning app",
    guideName: "Dr. Sharma",
    status: "completed",
    projectLink: "https://github.com/ritika/ai-trip-planner",
  },
  {
    studentName: "John Doe",
    urn: "2203545",
    section: "B",
    projectTitle: "Data Analytics Dashboard",
    description: "Interactive data visualization dashboard",
    guideName: "Prof. Verma",
    status: "ongoing",
    projectLink: "https://github.com/johndoe/data-dashboard",
  },
  {
    studentName: "Alice Smith",
    urn: "2203543",
    section: "B",
    projectTitle: "Frontend Portfolio",
    description: "Portfolio website with animations",
    guideName: "Dr. Kaur",
    status: "completed",
    projectLink: "https://github.com/alice/frontend-portfolio",
  },
];

const years = ["Final", "3rd", "2nd"];
const sections = ["All", "A", "B"];

export default function ProjectsPage() {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState("All");
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  // Filter and sort by URN
  const filteredProjects = allProjects
    .filter((p) => p.section === selectedSection || selectedSection === "All")
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
              <h1 className="text-3xl font-bold text-indigo-700 mb-4">{selectedYear} Year Projects</h1>
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
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Guide</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProjects.map((proj, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">{proj.urn}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{proj.studentName}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{proj.section}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{proj.projectTitle}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{proj.guideName}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{proj.status.toUpperCase()}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedProject(proj)}
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
        {selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-4 max-w-4xl w-full relative">
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-xl"
              >
                &times;
              </button>
              <h2 className="text-xl font-semibold mb-4">{selectedProject.studentName} - {selectedProject.projectTitle}</h2>
              <p className="mb-2"><strong>URN:</strong> {selectedProject.urn}</p>
              <p className="mb-2"><strong>Guide:</strong> {selectedProject.guideName}</p>
              <p className="mb-2"><strong>Status:</strong> {selectedProject.status.toUpperCase()}</p>
              <p className="mb-2"><strong>Description:</strong> {selectedProject.description}</p>
              <p className="mb-2">
                <strong>Project Link:</strong>{" "}
                <a href={selectedProject.projectLink} target="_blank" className="text-indigo-600 hover:underline">
                  {selectedProject.projectLink}
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
