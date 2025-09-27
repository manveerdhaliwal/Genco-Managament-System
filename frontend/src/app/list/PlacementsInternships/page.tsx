"use client";
import Link from "next/link";
import { useState } from "react";

interface PlacementEntry {
  title: string;
  organization: string;
  description: string;
  yearOfPlacement: string;
  pdfFile: File | null;
  pdfPreview: string | null;
}

export default function PlacementsPage() {
  const [entry, setEntry] = useState<PlacementEntry>({
    title: "",
    organization: "",
    description: "",
    yearOfPlacement: "",
    pdfFile: null,
    pdfPreview: null,
  });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const MAX_FILE_SIZE_MB = 5;

  const handleChange = (field: keyof PlacementEntry, value: string) => {
    setEntry((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setEntry((prev) => ({
      ...prev,
      pdfFile: file,
      pdfPreview: URL.createObjectURL(file),
    }));
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entry.title || !entry.organization || !entry.yearOfPlacement) {
      setError("Please fill in all required fields.");
      return;
    }
    console.log("Placement Submitted:", entry);
    setError("");
    setSubmitted(true);
  };

  const handleEdit = () => setSubmitted(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => (currentYear - i).toString());

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#EDF9FD] to-[#FFFFFF] p-6">
      <div className="max-w-4xl w-full p-8 sm:p-10 bg-white shadow-2xl rounded-3xl border border-gray-200">
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
          🎯 Placement
        </h2>

        {submitted ? (
          <div className="text-center flex flex-col items-center gap-6">
            <h3 className="text-2xl font-bold text-green-600">
              ✅ Submitted Successfully!
            </h3>

            <div className="w-full mt-6 border border-gray-200 p-4 rounded-2xl shadow-sm">
              <p><strong>Title:</strong> {entry.title}</p>
              <p><strong>Organization:</strong> {entry.organization}</p>
              <p><strong>Year of Placement:</strong> {entry.yearOfPlacement}</p>
              <p><strong>Description:</strong> {entry.description || "N/A"}</p>
              {entry.pdfPreview && (
                <div className="mt-2 border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                  <p className="bg-indigo-600 text-white p-2 text-sm font-medium">
                    Certificate PDF
                  </p>
                  <iframe
                    src={entry.pdfPreview}
                    className="w-full h-52 sm:h-64"
                    title="PDF Preview"
                  ></iframe>
                </div>
              )}
            </div>

            <button
              onClick={handleEdit}
              className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-indigo-500 transition-all"
            >
              Edit Placement
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="border border-gray-200 p-6 rounded-3xl shadow-md bg-white transition-all duration-300 hover:shadow-xl">
              <h3 className="text-xl font-semibold mb-4 text-indigo-700">Placement Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Job Title"
                  value={entry.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="border border-gray-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                  required
                />
                <input
                  type="text"
                  placeholder="Organization Name"
                  value={entry.organization}
                  onChange={(e) => handleChange("organization", e.target.value)}
                  className="border border-gray-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                  required
                />
                <select
                  value={entry.yearOfPlacement}
                  onChange={(e) => handleChange("yearOfPlacement", e.target.value)}
                  className="border border-gray-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                  required
                >
                  <option value="">Select Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <textarea
                  placeholder="Role Description"
                  value={entry.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="border border-gray-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-300 transition col-span-full"
                  rows={3}
                />
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <label className="font-medium text-gray-700">
                  Upload Offer Letter / Certificate (PDF)
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="border border-gray-300 p-3 rounded-2xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer transition"
                  required
                />
                {entry.pdfFile && (
                  <p className="text-gray-700 text-sm mt-1 truncate">
                    Uploaded File: <span className="font-medium">{entry.pdfFile.name}</span>
                  </p>
                )}
                {entry.pdfPreview && (
                  <div className="mt-2 border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <p className="bg-indigo-600 text-white p-2 text-sm font-medium">PDF Preview</p>
                    <iframe
                      src={entry.pdfPreview}
                      className="w-full h-52 sm:h-64"
                      title="PDF Preview"
                    ></iframe>
                  </div>
                )}
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-2xl font-semibold hover:from-purple-500 hover:to-indigo-500 shadow-lg transition-all"
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
