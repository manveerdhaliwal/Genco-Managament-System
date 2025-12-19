"use client";

import Link from "next/link";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";

/* ================= TYPES ================= */

type ProjectStatus = "ongoing" | "completed";

interface ProjectData {
  _id?: string;
  projectName: string;
  projectDescription: string;
  projectGuide: string;
  projectStatus: ProjectStatus;
  githubRepoUrl?: string;
  hostedUrl?: string;
}

/* ================= COMPONENT ================= */

export default function ProjectPage() {
  const [formData, setFormData] = useState<Partial<ProjectData>>({
    projectStatus: "ongoing",
  });

  const [submittedProjects, setSubmittedProjects] = useState<ProjectData[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [error, setError] = useState("");

  /* ================= FETCH PROJECTS ================= */

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/Projects/me", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (res.data.success) {
        setSubmittedProjects(res.data.data);
      }
    } catch (err) {
      console.error("Fetch projects error:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  /* ================= HANDLERS ================= */

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      projectStatus: e.target.value as ProjectStatus,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const requiredFields = [
      "projectName",
      "projectDescription",
      "projectGuide",
      "projectStatus",
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof ProjectData]) {
        setError("Please fill all required fields.");
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");

      if (editingIndex !== null && submittedProjects[editingIndex]?._id) {
        // UPDATE
        await axios.put(
          `http://localhost:5000/api/Projects/${submittedProjects[editingIndex]._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
      } else {
        // CREATE
        await axios.post("http://localhost:5000/api/Projects", formData, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
      }

      await fetchProjects();
      setFormData({ projectStatus: "ongoing" });
      setEditingIndex(null);
      setError("");
    } catch (err) {
      console.error("Submit project error:", err);
      setError("Failed to submit project.");
    }
  };

  const handleEdit = (index: number) => {
    setFormData(submittedProjects[index]);
    setEditingIndex(index);
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gradient-to-tr from-[#EDF9FD] to-[#FFFFFF]">
      <div className="w-full max-w-3xl p-8 bg-white shadow-2xl rounded-3xl border border-gray-200">
        <Link
          href="/dashboard/student"
          className="mb-4 inline-flex items-center justify-center w-10 h-10 bg-indigo-500 text-white rounded-full shadow hover:bg-indigo-600"
        >
          ←
        </Link>

        <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">
          💡 Student Project
        </h2>

        {/* ================= FORM ================= */}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* STATUS */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="ongoing"
                checked={formData.projectStatus === "ongoing"}
                onChange={handleStatusChange}
              />
              Ongoing
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="completed"
                checked={formData.projectStatus === "completed"}
                onChange={handleStatusChange}
              />
              Completed
            </label>
          </div>

          <input
            name="projectName"
            placeholder="Project Name"
            value={formData.projectName || ""}
            onChange={handleInputChange}
            className="border p-4 rounded-2xl"
            required
          />

          <textarea
            name="projectDescription"
            placeholder="Project Description"
            value={formData.projectDescription || ""}
            onChange={handleInputChange}
            rows={4}
            className="border p-4 rounded-2xl"
            required
          />

          <input
            name="projectGuide"
            placeholder="Project Guide / Mentor"
            value={formData.projectGuide || ""}
            onChange={handleInputChange}
            className="border p-4 rounded-2xl"
            required
          />

          <input
            name="githubRepoUrl"
            placeholder="GitHub Repository URL"
            value={formData.githubRepoUrl || ""}
            onChange={handleInputChange}
            className="border p-4 rounded-2xl"
          />

          <input
            name="hostedUrl"
            placeholder="Hosted URL (optional)"
            value={formData.hostedUrl || ""}
            onChange={handleInputChange}
            className="border p-4 rounded-2xl"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-2xl font-semibold"
          >
            {editingIndex !== null ? "Update Project" : "Submit Project"}
          </button>
        </form>
      </div>

      {/* ================= LIST ================= */}

      {submittedProjects.length > 0 && (
        <div className="w-full max-w-3xl mt-8">
          <h3 className="text-2xl font-bold text-indigo-700 mb-4">
            📂 Submitted Projects
          </h3>

          <div className="flex flex-col gap-4">
            {submittedProjects.map((project, index) => (
              <div
                key={project._id}
                className="p-5 bg-white border rounded-2xl shadow-md flex justify-between"
              >
                <div>
                  <p className="font-bold">{project.projectName}</p>
                  <p className="text-sm">Status: {project.projectStatus}</p>
                  <p className="text-sm">Guide: {project.projectGuide}</p>
                  <p className="text-sm">{project.projectDescription}</p>

                  {project.githubRepoUrl && (
                    <a
                      href={project.githubRepoUrl}
                      target="_blank"
                      className="text-indigo-600 underline text-sm"
                    >
                      GitHub Repo
                    </a>
                  )}

                  {project.hostedUrl && (
                    <p>
                      <a
                        href={project.hostedUrl}
                        target="_blank"
                        className="text-indigo-600 underline text-sm"
                      >
                        Live Demo
                      </a>
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleEdit(index)}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-xl"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
