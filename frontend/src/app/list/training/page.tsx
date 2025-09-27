"use client";
import Link from "next/link";
import { useState } from "react";

type TrainingField = "TR101" | "TR102" | "TR103";

type TrainingFormData = {
  trainingField: TrainingField;
  organisationName: string;
  organisationDetails: string;
  organisationSupervisor: string;
  fieldOfWork: string;
  projectsMade: string;
  projectDescription: string;
  pdfFile?: File | null;
  pdfPreview?: string | null;
};

export default function TrainingPage() {
  const [selectedTraining, setSelectedTraining] = useState<TrainingField | "">("");
  const [formData, setFormData] = useState<Partial<TrainingFormData>>({});
  const [submittedTrainings, setSubmittedTrainings] = useState<TrainingFormData[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [error, setError] = useState("");

  const MAX_FILE_SIZE_MB = 5;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const { name } = target;

    const value = target instanceof HTMLInputElement ? target.value : target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTrainingSelect = (type: TrainingField) => {
    setSelectedTraining(type);
    setFormData((prev) => ({ ...prev, trainingField: type }));
    setError("");
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

    setError("");
    setFormData((prev) => ({
      ...prev,
      pdfFile: file,
      pdfPreview: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
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
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof TrainingFormData]) {
        setError("Please fill in all required fields.");
        return;
      }
    }

    if (!formData.pdfFile) {
      setError("Please upload a PDF for the training.");
      return;
    }

    if (editingIndex !== null) {
      const updated = [...submittedTrainings];
      updated[editingIndex] = formData as TrainingFormData;
      setSubmittedTrainings(updated);
      setEditingIndex(null);
    } else {
      setSubmittedTrainings((prev) => [...prev, formData as TrainingFormData]);
    }

    setFormData({});
    setSelectedTraining("");
    setError("");
  };

  const handleEdit = (index: number) => {
    setFormData(submittedTrainings[index]);
    setSelectedTraining(submittedTrainings[index].trainingField);
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
        <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">
          🎓 Student Training
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <button type="button" className={buttonClass("TR101")} onClick={() => handleTrainingSelect("TR101")}>
              TR101
            </button>
            <button type="button" className={buttonClass("TR102")} onClick={() => handleTrainingSelect("TR102")}>
              TR102
            </button>
            <button type="button" className={buttonClass("TR103")} onClick={() => handleTrainingSelect("TR103")}>
              TR103
            </button>
          </div>

          {selectedTraining && (
            <div className="flex flex-col gap-3 mt-3">
              <input
                type="text"
                name="organisationName"
                placeholder="Organisation Name"
                value={formData?.organisationName || ""}
                onChange={handleInputChange}
                className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-300 shadow-sm"
                required
              />
              <textarea
                name="organisationDetails"
                placeholder="Organisation Details"
                value={formData?.organisationDetails || ""}
                onChange={handleInputChange}
                className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-300 shadow-sm resize-none"
                rows={3}
                required
              />
              <input
                type="text"
                name="organisationSupervisor"
                placeholder="Supervisor Name"
                value={formData?.organisationSupervisor || ""}
                onChange={handleInputChange}
                className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-300 shadow-sm"
                required
              />
              <input
                type="text"
                name="fieldOfWork"
                placeholder="Field of Work"
                value={formData?.fieldOfWork || ""}
                onChange={handleInputChange}
                className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-300 shadow-sm"
                required
              />
              <input
                type="text"
                name="projectsMade"
                placeholder="Projects Made"
                value={formData?.projectsMade || ""}
                onChange={handleInputChange}
                className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-300 shadow-sm"
                required
              />
              <textarea
                name="projectDescription"
                placeholder="Project Description"
                value={formData?.projectDescription || ""}
                onChange={handleInputChange}
                className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-300 shadow-sm resize-none"
                rows={3}
                required
              />

              <label className="font-medium text-gray-700 mt-2">Upload PDF:</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="border border-gray-300 p-3 rounded-2xl w-full focus:ring-2 focus:ring-indigo-300 shadow-sm"
                required={!formData?.pdfFile}
              />
              {formData?.pdfFile && (
                <p className="text-gray-700 text-sm mt-1 truncate">
                  Uploaded File: <span className="font-medium">{formData.pdfFile.name}</span>
                </p>
              )}
              {formData?.pdfPreview && (
                <div className="mt-3 border border-gray-200 rounded-2xl overflow-hidden shadow-md">
                  <p className="bg-indigo-600 text-white p-2 text-sm font-medium">PDF Preview</p>
                  <iframe src={formData.pdfPreview} className="w-full h-56 sm:h-72" title="PDF Preview"></iframe>
                </div>
              )}
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="mt-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-2xl font-semibold hover:from-purple-500 hover:to-indigo-500 shadow-lg transition-all"
          >
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
                  {training.pdfPreview && (
                    <a
                      href={training.pdfPreview}
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
}
