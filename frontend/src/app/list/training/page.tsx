"use client";

import Link from "next/link";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";

type TrainingField = "TR101" | "TR102" | "TR103";

interface TrainingData {
  _id?: string;
  trainingField: TrainingField;
  organisationName: string;
  organisationDetails: string;
  organisationSupervisor: string;
  fieldOfWork: string;
  projectsMade: string;
  projectDescription: string;
  trainingDuration: string;
  certificateAwarded: boolean;
  certificatepdf?: string; // URL from Cloudinary
}

export default function TrainingPage() {
  const [selectedTraining, setSelectedTraining] = useState<TrainingField | "">("");
  const [formData, setFormData] = useState<Partial<TrainingData & { pdfFile?: File; pdfPreview?: string }>>({});
  const [submittedTrainings, setSubmittedTrainings] = useState<TrainingData[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [error, setError] = useState("");

  const MAX_FILE_SIZE_MB = 5;

  // Fetch all trainings from backend
  const fetchTrainings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/Training/me", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      if (res.data.success) setSubmittedTrainings(res.data.data);
    } catch (err) {
      console.error("Error fetching trainings:", err);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, value } = e.target;
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTrainingSelect = (type: TrainingField) => {
    setSelectedTraining(type);
    setFormData((prev) => ({ ...prev, trainingField: type }));
    setError("");
  };

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

    setFormData((prev) => ({
      ...prev,
      pdfFile: file,
      pdfPreview: URL.createObjectURL(file),
    }));
    setError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedTraining) {
      setError("Please select a training type.");
      return;
    }

    const requiredFields = [
      "organisationName",
      "organisationDetails",
      "organisationSupervisor",
      "fieldOfWork",
      "projectsMade",
      "projectDescription",
      "trainingDuration",
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof TrainingData]) {
        setError("Please fill in all required fields.");
        return;
      }
    }

    const payload = new FormData();
    payload.append("trainingField", formData.trainingField!);
    payload.append("organisationName", formData.organisationName!);
    payload.append("organisationDetails", formData.organisationDetails!);
    payload.append("organisationSupervisor", formData.organisationSupervisor!);
    payload.append("fieldOfWork", formData.fieldOfWork!);
    payload.append("projectsMade", formData.projectsMade!);
    payload.append("projectDescription", formData.projectDescription!);
    payload.append("trainingDuration", formData.trainingDuration!);
    payload.append("certificateAwarded", String(formData.certificateAwarded ?? false));
    if (formData.pdfFile) payload.append("certificatepdf", formData.pdfFile);

    try {
      const token = localStorage.getItem("token");
      if (editingIndex !== null && submittedTrainings[editingIndex]?._id) {
        await axios.put(
          `http://localhost:5000/api/Training/${submittedTrainings[editingIndex]._id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );
      } else {
        await axios.post("http://localhost:5000/api/Training", payload, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
      }

      // Refetch all trainings to show full list
      await fetchTrainings();

      setFormData({});
      setSelectedTraining("");
      setEditingIndex(null);
      setError("");
    } catch (err) {
      console.error("Error submitting training:", err);
      setError("Failed to submit training.");
    }
  };

  const handleEdit = (index: number) => {
    const training = submittedTrainings[index];
    setFormData({
      ...training,
      pdfPreview: training.certificatepdf,
    });
    setSelectedTraining(training.trainingField);
    setEditingIndex(index);
  };

  const buttonClass = (type: TrainingField) =>
    `py-2 px-5 rounded-2xl font-semibold transition w-full sm:w-auto text-center sm:text-sm ${
      selectedTraining === type
        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
        : "border border-gray-300 text-gray-700 hover:bg-gradient-to-r hover:from-purple-400 hover:to-indigo-400 hover:text-white"
    }`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-gradient-to-tr from-[#EDF9FD] to-[#FFFFFF]">
      <div className="w-full max-w-3xl p-8 sm:p-10 bg-white shadow-2xl rounded-3xl border border-gray-200">
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

        <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">🎓 Student Training</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <button type="button" className={buttonClass("TR101")} onClick={() => handleTrainingSelect("TR101")}>TR101</button>
            <button type="button" className={buttonClass("TR102")} onClick={() => handleTrainingSelect("TR102")}>TR102</button>
            <button type="button" className={buttonClass("TR103")} onClick={() => handleTrainingSelect("TR103")}>TR103</button>
          </div>

          {selectedTraining && (
            <div className="flex flex-col gap-3 mt-3">
              <input type="text" name="organisationName" placeholder="Organisation Name" value={formData.organisationName || ""} onChange={handleInputChange} className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-300 shadow-sm" required />
              <textarea name="organisationDetails" placeholder="Organisation Details" value={formData.organisationDetails || ""} onChange={handleInputChange} className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-300 shadow-sm resize-none" rows={3} required />
              <input type="text" name="organisationSupervisor" placeholder="Supervisor Name" value={formData.organisationSupervisor || ""} onChange={handleInputChange} className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-300 shadow-sm" required />
              <input type="text" name="fieldOfWork" placeholder="Field of Work" value={formData.fieldOfWork || ""} onChange={handleInputChange} className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-300 shadow-sm" required />
              <input type="text" name="projectsMade" placeholder="Projects Made" value={formData.projectsMade || ""} onChange={handleInputChange} className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-300 shadow-sm" required />
              <textarea name="projectDescription" placeholder="Project Description" value={formData.projectDescription || ""} onChange={handleInputChange} className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-300 shadow-sm resize-none" rows={3} required />
              <input type="text" name="trainingDuration" placeholder="Training Duration (e.g., 4 weeks)" value={formData.trainingDuration || ""} onChange={handleInputChange} className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-300 shadow-sm" required />

              <label className="flex items-center gap-2 mt-2">
                <input type="checkbox" name="certificateAwarded" checked={formData.certificateAwarded || false} onChange={handleInputChange} className="w-5 h-5" />
                Certificate Awarded
              </label>

              <label className="font-medium text-gray-700 mt-2">Upload PDF:</label>
              <input type="file" accept="application/pdf" onChange={handleFileChange} className="border border-gray-300 p-3 rounded-2xl w-full focus:ring-2 focus:ring-indigo-300 shadow-sm" required={!formData.certificatepdf} />

              {formData.pdfPreview && (
                <div className="mt-3 border border-gray-200 rounded-2xl overflow-hidden shadow-md">
                  <p className="bg-indigo-600 text-white p-2 text-sm font-medium">PDF Preview</p>
                  <iframe src={formData.pdfPreview} className="w-full h-56 sm:h-72" title="PDF Preview"></iframe>
                </div>
              )}
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" className="mt-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-2xl font-semibold hover:from-purple-500 hover:to-indigo-500 shadow-lg transition-all">
            {editingIndex !== null ? "Update" : "Submit"}
          </button>
        </form>
      </div>

      {submittedTrainings.length > 0 && (
        <div className="w-full max-w-3xl mt-8">
          <h3 className="text-2xl font-semibold mb-4 text-indigo-700">📑 Submitted Trainings</h3>
          <div className="flex flex-col gap-4">
            {submittedTrainings.map((training, index) => (
              <div key={index} className="p-5 bg-white border rounded-2xl shadow-md flex justify-between items-start">
                <div>
                  <p className="font-bold">{training.organisationName}</p>
                  <p className="text-sm text-gray-600">Supervisor: {training.organisationSupervisor}</p>
                  <p className="text-sm text-gray-600">Field: {training.fieldOfWork}</p>
                  <p className="text-sm text-gray-600">Projects: {training.projectsMade}</p>
                  <p className="text-sm text-gray-600">Description: {training.projectDescription}</p>
                  <p className="text-sm text-gray-600">Duration: {training.trainingDuration}</p>
                  <p className="text-sm text-gray-600">Certificate Awarded: {training.certificateAwarded ? "Yes" : "No"}</p>
                  {training.certificatepdf && (
                    <a
                      href={training.certificatepdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 underline text-sm"
                    >
                      View PDF
                    </a>
                  )}
                </div>
                <button onClick={() => handleEdit(index)} className="px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600">Edit</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
