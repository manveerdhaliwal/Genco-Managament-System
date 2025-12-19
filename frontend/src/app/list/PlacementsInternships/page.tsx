"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import Link from "next/link";

// ✅ Google Drive Viewer for reliable inline PDF viewing
const getInlineViewUrl = (url: string): string => {
  if (!url) return "";
  return `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(url)}`;
};

interface PlacementData {
  _id?: string;
  companyName: string;
  role: string;
  package: string;
  companyDescription: string;
  yearOfPlacement: string;
  offerLetterUrl?: string;
  pdfFile?: File;
  pdfPreview?: string;
}

const PlacementsPage: React.FC = () => {
  const [formData, setFormData] = useState<Partial<PlacementData>>({});
  const [submittedPlacements, setSubmittedPlacements] = useState<PlacementData[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [error, setError] = useState("");

  const MAX_FILE_SIZE_MB = 5;

  // 🔹 Fetch existing placements on load
  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/Placement/me", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        if (res.data.success) setSubmittedPlacements(res.data.data);
      } catch (err) {
        console.error("Error fetching placements:", err);
      }
    };
    fetchPlacements();
  }, []);

  // 🔹 Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Handle PDF upload with validation
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File size must be less than ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    setError("");
    setFormData((prev) => ({
      ...prev,
      pdfFile: file,
      pdfPreview: URL.createObjectURL(file),
    }));
  };

  // 🔹 Submit form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const requiredFields = ["companyName", "role", "package", "yearOfPlacement"];
    for (const field of requiredFields) {
      if (!formData[field as keyof PlacementData]) {
        setError("Please fill in all required fields.");
        return;
      }
    }

    const payload = new FormData();
    payload.append("companyName", formData.companyName!);
    payload.append("role", formData.role!);
    payload.append("package", formData.package!);
    payload.append("companyDescription", formData.companyDescription || "");
    payload.append("yearOfPlacement", formData.yearOfPlacement!);
    if (formData.pdfFile) payload.append("offerLetter", formData.pdfFile);

    try {
      const token = localStorage.getItem("token");
      let res;

      if (editingIndex !== null && submittedPlacements[editingIndex]._id) {
        // Update
        res = await axios.put(
          `http://localhost:5000/api/Placement/${submittedPlacements[editingIndex]._id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );
      } else {
        // Create
        res = await axios.post("http://localhost:5000/api/Placement", payload, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
      }

      if (res.data.success) {
        const savedPlacement: PlacementData = res.data.data;
        const updatedList =
          editingIndex !== null
            ? submittedPlacements.map((p, i) => (i === editingIndex ? savedPlacement : p))
            : [...submittedPlacements, savedPlacement];

        setSubmittedPlacements(updatedList);
        setFormData({});
        setEditingIndex(null);
        setError("");
      }
    } catch (err) {
      console.error("Error submitting placement:", err);
      setError("Failed to submit placement.");
    }
  };

  // 🔹 Edit placement
  const handleEdit = (index: number) => {
    const placement = submittedPlacements[index];
    setFormData({
      ...placement,
      pdfFile: undefined,
      pdfPreview: placement.offerLetterUrl,
    });
    setEditingIndex(index);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 py-10 px-4">
      <div className="w-full max-w-4xl">
        {/* Back Button */}
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
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>

        <h2 className="text-4xl font-bold mb-8 text-indigo-700">📌 Placement Details</h2>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full p-8 bg-white rounded-2xl shadow-lg border border-indigo-100"
        >
          {error && <p className="mb-4 text-red-500 text-sm">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="companyName"
              value={formData.companyName || ""}
              onChange={handleChange}
              placeholder="Company Name"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              required
            />
            <input
              type="text"
              name="role"
              value={formData.role || ""}
              onChange={handleChange}
              placeholder="Role"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              required
            />
            <input
              type="text"
              name="package"
              value={formData.package || ""}
              onChange={handleChange}
              placeholder="Package (e.g., 12 LPA)"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              required
            />
            <input
              type="text"
              name="yearOfPlacement"
              value={formData.yearOfPlacement || ""}
              onChange={handleChange}
              placeholder="Year of Placement (e.g., 2024)"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              required
            />
          </div>

          <textarea
            name="companyDescription"
            value={formData.companyDescription || ""}
            onChange={handleChange}
            placeholder="Company Description"
            className="w-full mt-6 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none resize-none"
            rows={4}
          />

          {/* PDF Upload */}
          <div className="mt-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Upload Offer Letter (PDF) - Max {MAX_FILE_SIZE_MB}MB
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            />
            {formData.pdfPreview && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <iframe
                  src={formData.pdfPreview}
                  className="w-full h-64 rounded border"
                  title="PDF Preview"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="mt-6 w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-indigo-500 shadow-lg transition-all"
          >
            {editingIndex !== null ? "Update Placement" : "Submit Placement"}
          </button>
        </form>

        {/* Submitted Placements */}
        {submittedPlacements.length > 0 && (
          <div className="w-full mt-8">
            <h3 className="text-2xl font-semibold mb-4 text-indigo-700">📑 Submitted Placements</h3>
            <div className="flex flex-col gap-4">
              {submittedPlacements.map((placement, index) => (
                <div
                  key={index}
                  className="p-5 bg-white border border-gray-200 rounded-2xl shadow-md flex flex-col sm:flex-row justify-between items-start gap-4"
                >
                  <div className="flex-1">
                    <p className="font-bold text-lg text-gray-800">{placement.companyName}</p>
                    <p className="text-sm text-gray-600">Role: {placement.role}</p>
                    <p className="text-sm text-gray-600">Package: {placement.package}</p>
                    <p className="text-sm text-gray-600">Year: {placement.yearOfPlacement}</p>
                    {placement.companyDescription && (
                      <p className="text-sm text-gray-600 mt-1">
                        Description: {placement.companyDescription}
                      </p>
                    )}

                    {/* ✅ View and Download Buttons */}
                    {placement.offerLetterUrl && (
                      <div className="flex gap-3 mt-3">
                        <a
                          href={getInlineViewUrl(placement.offerLetterUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                        >
                          View Offer Letter
                        </a>
                        <a
                          href={placement.offerLetterUrl}
                          download
                          className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                          Download
                        </a>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleEdit(index)}
                    className="px-5 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition whitespace-nowrap"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlacementsPage;