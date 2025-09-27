"use client";

import { useState } from "react";

type CertificateType = "technical" | "cultural" | "sports";

type CertificateData = {
  eventName: string;
  eventDate: string;
};

type SubmittedCertificate = {
  type: CertificateType;
  data: CertificateData;
  file: File;
  preview: string;
};

export default function CertificatePage() {
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateType | "">("");
  const [fileUploads, setFileUploads] = useState<Partial<Record<CertificateType, File | null>>>({
    technical: null,
    cultural: null,
    sports: null,
  });
  const [filePreviews, setFilePreviews] = useState<Partial<Record<CertificateType, string | null>>>({
    technical: null,
    cultural: null,
    sports: null,
  });
  const [formData, setFormData] = useState<Partial<Record<CertificateType, CertificateData>>>({
    technical: { eventName: "", eventDate: "" },
    cultural: { eventName: "", eventDate: "" },
    sports: { eventName: "", eventDate: "" },
  });
  const [error, setError] = useState("");
  const [submittedCertificates, setSubmittedCertificates] = useState<SubmittedCertificate[]>([]);
  const MAX_FILE_SIZE_MB = 5;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: CertificateType) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [type]: { ...prev[type], [name]: value },
    }));
  };

  const handleCertificateSelect = (type: CertificateType) => {
    setSelectedCertificate(type);
    setError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: CertificateType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["application/pdf", "image/png", "image/jpeg"].includes(file.type)) {
      setError("Only PDF or Image files are allowed.");
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File size must be less than ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    setError("");
    setFileUploads(prev => ({ ...prev, [type]: file }));
    setFilePreviews(prev => ({ ...prev, [type]: URL.createObjectURL(file) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCertificate) {
      setError("Please select a certificate type.");
      return;
    }

    const data = formData[selectedCertificate];
    if (!data?.eventName || !data?.eventDate) {
      setError("Please fill in all fields for the selected certificate.");
      return;
    }

    const file = fileUploads[selectedCertificate];
    const preview = filePreviews[selectedCertificate];

    if (!file || !preview) {
      setError("Please upload a file for the selected certificate.");
      return;
    }

    // Add to submittedCertificates
    setSubmittedCertificates(prev => [
      ...prev,
      { type: selectedCertificate, data, file, preview },
    ]);

    // Reset current form for this type
    setFormData(prev => ({
      ...prev,
      [selectedCertificate]: { eventName: "", eventDate: "" },
    }));
    setFileUploads(prev => ({ ...prev, [selectedCertificate]: null }));
    setFilePreviews(prev => ({ ...prev, [selectedCertificate]: null }));
    setSelectedCertificate("");
    setError("");
  };

  const buttonClass = (type: CertificateType) =>
    `py-2 px-5 rounded-2xl font-semibold transition w-full sm:w-auto text-center sm:text-sm ${
      selectedCertificate === type
        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
        : "border border-gray-300 text-gray-700 hover:bg-gradient-to-r hover:from-purple-400 hover:to-indigo-400 hover:text-white"
    }`;

  const handleEdit = (index: number) => {
    const cert = submittedCertificates[index];
    setSelectedCertificate(cert.type);
    setFormData(prev => ({ ...prev, [cert.type]: cert.data }));
    setFileUploads(prev => ({ ...prev, [cert.type]: cert.file }));
    setFilePreviews(prev => ({ ...prev, [cert.type]: cert.preview }));
    setSubmittedCertificates(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 sm:p-6 bg-gradient-to-tr from-[#EDF9FD] to-[#FFFFFF]">
      <div className="w-full max-w-3xl p-8 sm:p-10 bg-white shadow-2xl rounded-3xl border border-gray-200 mb-6">
        <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">
          🏆 Certificate Upload
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Certificate Selection */}
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <button type="button" className={buttonClass("technical")} onClick={() => handleCertificateSelect("technical")}>
              Technical
            </button>
            <button type="button" className={buttonClass("cultural")} onClick={() => handleCertificateSelect("cultural")}>
              Cultural
            </button>
            <button type="button" className={buttonClass("sports")} onClick={() => handleCertificateSelect("sports")}>
              Sports
            </button>
          </div>

          {/* Certificate Form */}
          {selectedCertificate && (
            <div className="flex flex-col gap-3 mt-3">
              <input
                type="text"
                name="eventName"
                placeholder="Event Name"
                value={formData[selectedCertificate]?.eventName}
                onChange={(e) => handleInputChange(e, selectedCertificate)}
                className="border border-gray-300 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition shadow-sm"
                required
              />
              <input
                type="date"
                name="eventDate"
                value={formData[selectedCertificate]?.eventDate}
                onChange={(e) => handleInputChange(e, selectedCertificate)}
                className="border border-gray-300 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition shadow-sm"
                required
              />

              <label className="font-medium text-gray-700 mt-2">
                Upload Certificate (PDF / Image):
              </label>
              <input
                type="file"
                accept="application/pdf,image/png,image/jpeg"
                onChange={(e) => handleFileChange(e, selectedCertificate)}
                className="border border-gray-300 p-3 rounded-2xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 cursor-pointer shadow-sm"
                required
              />
              {fileUploads[selectedCertificate] && (
                <p className="text-gray-700 text-sm mt-1 truncate">
                  Uploaded File: <span className="font-medium">{fileUploads[selectedCertificate]?.name}</span>
                </p>
              )}
              {filePreviews[selectedCertificate] && (
                <div className="mt-3 border border-gray-200 rounded-2xl overflow-hidden shadow-md">
                  <p className="bg-indigo-600 text-white p-2 text-sm font-medium">Preview</p>
                  {fileUploads[selectedCertificate]?.type === "application/pdf" ? (
                    <iframe
                      src={filePreviews[selectedCertificate]!}
                      className="w-full h-56 sm:h-72"
                      title="Certificate Preview"
                    ></iframe>
                  ) : (
                    <img
                      src={filePreviews[selectedCertificate]!}
                      alt="Certificate Preview"
                      className="w-full h-56 sm:h-72 object-contain"
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="mt-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-2xl font-semibold hover:from-purple-500 hover:to-indigo-500 shadow-lg transition-all"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Display Submitted Certificates */}
      {submittedCertificates.length > 0 && (
        <div className="w-full max-w-3xl flex flex-col gap-5">
          <h3 className="text-2xl font-bold text-indigo-700 mb-4">Submitted Certificates</h3>
          {submittedCertificates.map((cert, index) => (
            <div key={index} className="border border-gray-200 p-4 rounded-3xl shadow-md bg-white relative">
              <button
                type="button"
                onClick={() => handleEdit(index)}
                className="absolute top-3 right-3 text-blue-600 font-bold hover:text-blue-800"
              >
                ✎ Edit
              </button>
              <p><span className="font-medium">Type:</span> {cert.type.toUpperCase()}</p>
              <p><span className="font-medium">Event:</span> {cert.data.eventName}</p>
              <p><span className="font-medium">Date:</span> {cert.data.eventDate}</p>
              {cert.file.type === "application/pdf" ? (
                <iframe src={cert.preview} className="w-full h-56 mt-2" title="Certificate Preview"></iframe>
              ) : (
                <img src={cert.preview} alt="Certificate" className="w-full h-56 object-contain mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
