"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

/* ================= TYPES ================= */

type ProjectStatus = "ongoing" | "completed";

interface ProjectEntry {
  _id: string;
  studentName: string;
  urn: string;
  section: string;
  year: string;

  projectName: string;
  projectDescription: string;
  projectGuide: string;
  projectStatus: ProjectStatus;

  githubRepoUrl?: string;
  hostedUrl?: string;
}

/* ================= CONSTANTS ================= */

const years = ["Final", "3rd", "2nd"];
const sections = ["All", "A", "B"];

const yearMap: Record<string, string> = {
  Final: "4",
  "3rd": "3",
  "2nd": "2",
};

/* ================= COMPONENT ================= */

export default function TeacherProjectsPage() {
  const [projects, setProjects] = useState<ProjectEntry[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState("All");
  const [selectedProject, setSelectedProject] = useState<ProjectEntry | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PROJECTS ================= */

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          "http://localhost:5000/api/Projects",
          { withCredentials: true }
        );

        if (res.data.success) {
          const mapped: ProjectEntry[] = res.data.data.map((p: any) => ({
            _id: p._id,
            studentName: p.student?.name || "N/A",
            urn: p.student?.URN || "N/A",
            section: p.student?.section || "N/A",
            year: String(p.student?.year || ""),

            projectName: p.projectName,
            projectDescription: p.projectDescription,
            projectGuide: p.projectGuide,
            projectStatus: p.projectStatus ?? "ongoing",

            githubRepoUrl: p.githubRepoUrl,
            hostedUrl: p.hostedUrl,
          }));

          setProjects(mapped);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  /* ================= FILTERS ================= */

  const filteredProjects = projects
    .filter((p) => {
      if (!selectedYear) return true;
      return p.year === yearMap[selectedYear];
    })
    .filter((p) => selectedSection === "All" || p.section === selectedSection)
    .sort((a, b) => a.urn.localeCompare(b.urn));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading projects...
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-tr from-[#EDF9FD] to-[#FFFFFF]">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        {/* BACK */}
        <Link
          href="/dashboard/teacher"
          className="inline-flex w-10 h-10 items-center justify-center bg-indigo-500 text-white rounded-full hover:bg-indigo-600"
        >
          ←
        </Link>

        {/* YEAR SELECTION */}
        {!selectedYear && (
          <>
            <h1 className="text-3xl font-bold text-indigo-700">
              Select Year
            </h1>

            <div className="grid sm:grid-cols-3 gap-6">
              {years.map((year) => (
                <div
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className="cursor-pointer bg-white p-6 rounded-2xl shadow hover:shadow-xl text-center"
                >
                  <h2 className="text-xl font-semibold text-indigo-700">
                    {year} Year
                  </h2>
                </div>
              ))}
            </div>
          </>
        )}

        {/* TABLE */}
        {selectedYear && (
          <>
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-indigo-700">
                {selectedYear} Year Projects
              </h1>

              <button
                onClick={() => {
                  setSelectedYear(null);
                  setSelectedSection("All");
                }}
                className="bg-gray-200 px-4 py-2 rounded-xl"
              >
                Back
              </button>
            </div>

            {/* SECTION FILTER */}
            <div className="flex items-center gap-3">
              <span className="font-medium">Section:</span>
              <select
                className="border rounded-xl px-4 py-2"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                {sections.map((sec) => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>
            </div>

            {/* PROJECT TABLE */}
            <div className="overflow-x-auto bg-white rounded-2xl shadow">
              <table className="min-w-full divide-y">
                <thead className="bg-indigo-100">
                  <tr>
                    <th className="px-6 py-3">URN</th>
                    <th className="px-6 py-3">Student</th>
                    <th className="px-6 py-3">Section</th>
                    <th className="px-6 py-3">Project</th>
                    <th className="px-6 py-3">Guide</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-center">View</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProjects.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-6 text-gray-500">
                        No project records found
                      </td>
                    </tr>
                  ) : (
                    filteredProjects.map((p) => (
                      <tr key={p._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{p.urn}</td>
                        <td className="px-6 py-4">{p.studentName}</td>
                        <td className="px-6 py-4">{p.section}</td>
                        <td className="px-6 py-4">{p.projectName}</td>
                        <td className="px-6 py-4">{p.projectGuide}</td>

                        {/* STATUS BADGE */}
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              p.projectStatus === "completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {p.projectStatus.toUpperCase()}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => setSelectedProject(p)}
                            className="bg-indigo-600 text-white px-4 py-1 rounded-xl"
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

        {/* ================= MODAL ================= */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-3xl p-6 max-w-3xl w-full relative">
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-3 right-3 text-xl font-bold"
              >
                ×
              </button>

              <h2 className="text-xl font-semibold mb-4">
                {selectedProject.studentName} – {selectedProject.projectName}
              </h2>

              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>URN:</strong> {selectedProject.urn}</p>
                <p><strong>Guide:</strong> {selectedProject.projectGuide}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      selectedProject.projectStatus === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {selectedProject.projectStatus.toUpperCase()}
                  </span>
                </p>
                <p><strong>Description:</strong> {selectedProject.projectDescription}</p>

                {/* GITHUB */}
                {selectedProject.githubRepoUrl && (
                  <p>
                    <strong>GitHub:</strong>{" "}
                    <a
                      href={selectedProject.githubRepoUrl}
                      target="_blank"
                      className="text-indigo-600 underline"
                    >
                      View Repository
                    </a>
                  </p>
                )}

                {/* LIVE DEMO */}
                {selectedProject.hostedUrl && (
                  <p>
                    <strong>Live URL:</strong>{" "}
                    <a
                      href={selectedProject.hostedUrl}
                      target="_blank"
                      className="text-indigo-600 underline"
                    >
                      Open Demo
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
