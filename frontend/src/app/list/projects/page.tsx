"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

type ProjectStatus = "ongoing" | "completed";

type ProjectData = {
  name: string;
  urn: string;
  projectTitle: string;
  description: string;
  guideName: string;
  status: ProjectStatus;
  projectLink: string; // GitHub / demo link
};

export default function ProjectPage() {
  const [formData, setFormData] = useState<ProjectData>({
    name: "",
    urn: "",
    projectTitle: "",
    description: "",
    guideName: "",
    status: "ongoing",
    projectLink: "",
  });

  const [submittedProjects, setSubmittedProjects] = useState<ProjectData[]>([]);
  const [error, setError] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(true);

  // Load saved projects from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("projects");
    if (saved) setSubmittedProjects(JSON.parse(saved));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "urn" && !/^\d*$/.test(value)) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as ProjectStatus;
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.name ||
      !formData.urn ||
      !formData.projectTitle ||
      !formData.description ||
      !formData.guideName ||
      !formData.status ||
      !formData.projectLink
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const updatedProjects = [...submittedProjects, formData];
    setSubmittedProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));

    setError("");
    setIsFormVisible(false);
  };

  const handleEdit = (index: number) => {
    setFormData(submittedProjects[index]);
    setSubmittedProjects((prev) => prev.filter((_, i) => i !== index));
    localStorage.setItem(
      "projects",
      JSON.stringify(submittedProjects.filter((_, i) => i !== index))
    );
    setIsFormVisible(true);
  };

  const handleAddNew = () => {
    setFormData({
      name: "",
      urn: "",
      projectTitle: "",
      description: "",
      guideName: "",
      status: "ongoing",
      projectLink: "",
    });
    setIsFormVisible(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 sm:p-6 bg-gradient-to-tr from-[#EDF9FD] to-[#FFFFFF]">
      <div className="w-full max-w-3xl p-8 sm:p-10 bg-white shadow-2xl rounded-3xl border border-gray-200 mb-6">
        <Link
          href="/dashboard/student"
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

        <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">
          💡 Project Submission
        </h2>

        {isFormVisible && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex gap-6 items-center">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="ongoing"
                  checked={formData.status === "ongoing"}
                  onChange={handleStatusChange}
                  className="w-4 h-4 accent-indigo-600"
                />
                Ongoing
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="completed"
                  checked={formData.status === "completed"}
                  onChange={handleStatusChange}
                  className="w-4 h-4 accent-indigo-600"
                />
                Completed
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                className="border border-gray-300 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition shadow-sm"
                required
              />
              <input
                type="text"
                name="urn"
                placeholder="URN"
                value={formData.urn}
                onChange={handleInputChange}
                className="border border-gray-300 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition shadow-sm"
                required
              />
            </div>

            <input
              type="text"
              name="projectTitle"
              placeholder="Project Title"
              value={formData.projectTitle}
              onChange={handleInputChange}
              className="border border-gray-300 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition shadow-sm"
              required
            />

            <textarea
              name="description"
              placeholder="Project Description"
              value={formData.description}
              onChange={handleInputChange}
              className="border border-gray-300 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition shadow-sm"
              rows={4}
              required
            />

            <input
              type="text"
              name="guideName"
              placeholder="Guide / Mentor Name"
              value={formData.guideName}
              onChange={handleInputChange}
              className="border border-gray-300 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition shadow-sm"
              required
            />

            <input
              type="text"
              name="projectLink"
              placeholder="Project Link / Repository (GitHub)"
              value={formData.projectLink}
              onChange={handleInputChange}
              className="border border-gray-300 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition shadow-sm"
              required
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="mt-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-2xl font-semibold hover:from-purple-500 hover:to-indigo-500 shadow-lg transition-all"
            >
              Submit
            </button>
          </form>
        )}

        {!isFormVisible && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleAddNew}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 px-6 rounded-2xl font-semibold hover:from-indigo-400 hover:to-purple-400 shadow-md transition-all"
            >
              + Add New Project
            </button>
          </div>
        )}
      </div>

      {submittedProjects.length > 0 && (
        <div className="w-full max-w-3xl flex flex-col gap-5">
          <h3 className="text-2xl font-bold text-indigo-700 mb-4">Submitted Projects</h3>
          {submittedProjects.map((proj, index) => (
            <div key={index} className="border border-gray-200 p-4 rounded-3xl shadow-md bg-white relative">
              <button
                type="button"
                onClick={() => handleEdit(index)}
                className="absolute top-3 right-3 text-blue-600 font-bold hover:text-blue-800"
              >
                ✎ Edit
              </button>
              <p><span className="font-medium">Status:</span> {proj.status.toUpperCase()}</p>
              <p><span className="font-medium">Name:</span> {proj.name}</p>
              <p><span className="font-medium">URN:</span> {proj.urn}</p>
              <p><span className="font-medium">Title:</span> {proj.projectTitle}</p>
              <p><span className="font-medium">Guide:</span> {proj.guideName}</p>
              <p><span className="font-medium">Description:</span> {proj.description}</p>
              <p>
                <span className="font-medium">Link:</span>{" "}
                <a href={proj.projectLink} target="_blank" className="text-indigo-600 hover:underline">
                  {proj.projectLink}
                </a>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


