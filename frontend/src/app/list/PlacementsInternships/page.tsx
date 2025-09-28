"use client";


import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface PlacementData {
  _id?: string;
  companyName: string;
  role: string;
  package: string;
  companyDescription: string;
  yearOfPlacement: string;
  offerLetterUrl?: string; // Cloudinary PDF URL
  pdfFile?: File;
  pdfPreview?: string;
}

const PlacementsPage: React.FC = () => {
  const [formData, setFormData] = useState<Partial<PlacementData>>({});
  const [submittedPlacements, setSubmittedPlacements] = useState<PlacementData[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [error, setError] = useState("");

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

  // 🔹 Handle PDF upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        setError("Only PDF files are allowed.");
        return;
      }
      setError("");
      setFormData((prev) => ({
        ...prev,
        pdfFile: file,
        pdfPreview: URL.createObjectURL(file),
      }));
    }
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
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 py-10">
        
      <h2 className="text-4xl font-bold mb-8 text-indigo-700">📌 Placement Details</h2>


      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl p-8 bg-white rounded-2xl shadow-lg border border-indigo-100"
      >
        {error && <p className="mb-4 text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="companyName"
            value={formData.companyName || ""}
            onChange={handleChange}
            placeholder="Company Name"
            className="p-3 border rounded-lg"
            required
          />
          <input
            type="text"
            name="role"
            value={formData.role || ""}
            onChange={handleChange}
            placeholder="Role"
            className="p-3 border rounded-lg"
            required
          />
          <input
            type="text"
            name="package"
            value={formData.package || ""}
            onChange={handleChange}
            placeholder="Package"
            className="p-3 border rounded-lg"
            required
          />
          <input
            type="text"
            name="yearOfPlacement"
            value={formData.yearOfPlacement || ""}
            onChange={handleChange}
            placeholder="Year of Placement"
            className="p-3 border rounded-lg"
            required
          />
        </div>

        <textarea
          name="companyDescription"
          value={formData.companyDescription || ""}
          onChange={handleChange}
          placeholder="Company Description"
          className="w-full mt-6 p-3 border rounded-lg"
        />

        {/* PDF Upload */}
        <div className="mt-6">
          <label className="block mb-2 text-sm font-medium">Upload Offer Letter (PDF)</label>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
          {formData.pdfPreview && (
            <a
              href={formData.pdfPreview}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-2 text-indigo-600 underline"
            >
              Preview PDF
            </a>
          )}
        </div>

        <button
          type="submit"
          className="mt-6 w-full px-4 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700"
        >
          {editingIndex !== null ? "Update Placement" : "Submit Placement"}
        </button>
      </form>

      {/* Submitted Placements */}
      {submittedPlacements.length > 0 && (
        <div className="w-full max-w-3xl mt-8">
          <h3 className="text-2xl font-semibold mb-4 text-indigo-700">📑 Submitted Placements</h3>
          <div className="flex flex-col gap-4">
            {submittedPlacements.map((placement, index) => (
              <div
                key={index}
                className="p-5 bg-white border rounded-2xl shadow-md flex justify-between items-start"
              >
                <div>
                  <p className="font-bold">{placement.companyName}</p>
                  <p className="text-sm text-gray-600">Role: {placement.role}</p>
                  <p className="text-sm text-gray-600">Package: {placement.package}</p>
                  <p className="text-sm text-gray-600">Year: {placement.yearOfPlacement}</p>
                  <p className="text-sm text-gray-600">
                    Description: {placement.companyDescription}
                  </p>
                  {placement.offerLetterUrl && (
                    <a
                      href={placement.offerLetterUrl}
                      target="_blank"
                      className="text-indigo-600 underline text-sm"
                    >
                      View PDF
                    </a>
                  )}
                </div>
                <button
                  onClick={() => handleEdit(index)}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600"
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
};

export default PlacementsPage;
