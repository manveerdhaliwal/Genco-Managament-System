"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import axios from "axios";

type CertificateType = "Technical" | "Cultural" | "Sports";

interface CertificateData {
  _id?: string;
  type: CertificateType;
  eventName: string;
  date: string;
  fileUrl?: string; // URL from backend
}

export default function CertificatePage() {
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateType | "">("");
  const [formData, setFormData] = useState<Partial<CertificateData>>({});
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submittedCertificates, setSubmittedCertificates] = useState<CertificateData[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [error, setError] = useState("");
  const MAX_FILE_SIZE_MB = 5;

  // 🔹 Fetch existing certificates
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/Certificate/me", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (res.data.success) {
          setSubmittedCertificates(
            res.data.data.map((c: any) => ({
              _id: c._id,
              type: c.type.toLowerCase(),
              eventName: c.eventName,
              date: c.date?.split("T")[0] || "",
              fileUrl: c.fileUrl,
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching certificates:", err);
      }
    };

    fetchCertificates();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCertificateSelect = (type: CertificateType) => {
    setSelectedCertificate(type);
    setFormData(prev => ({ ...prev, type }));
    setError("");
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!["application/pdf", "image/png", "image/jpeg"].includes(f.type)) {
      setError("Only PDF or Image files are allowed.");
      return;
    }
    if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File size must be less than ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    setError("");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedCertificate) {
      setError("Please select a certificate type.");
      return;
    }
    if (!formData?.eventName || !formData?.date) {
      setError("Please fill in all required fields.");
      return;
    }

    const token = localStorage.getItem("token");
    const formDataToSend = new FormData();
    formDataToSend.append("type", selectedCertificate);
    formDataToSend.append("eventName", formData.eventName!);
    formDataToSend.append("date", formData.date!);
    if (file) formDataToSend.append("certificateFile", file);

    try {
      let res;
      if (editingIndex !== null && submittedCertificates[editingIndex]._id) {
        // 🔄 Update existing
        res = await axios.put(
          `http://localhost:5000/api/Certificate/update/${submittedCertificates[editingIndex]._id}`,
          formDataToSend,
          { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
        );
      } else {
        // 🆕 New upload
        res = await axios.post("http://localhost:5000/api/Certificate/save", formDataToSend, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
      }

      if (res.data.success) {
        const savedCert: CertificateData = {
          _id: res.data.data._id,
          type: res.data.data.type.toLowerCase(),
          eventName: res.data.data.eventName,
          date: res.data.data.date?.split("T")[0] || "",
          fileUrl: res.data.data.fileUrl,
        };

        const updatedList =
          editingIndex !== null
            ? submittedCertificates.map((c, i) => (i === editingIndex ? savedCert : c))
            : [...submittedCertificates, savedCert];

        setSubmittedCertificates(updatedList);
        setFormData({});
        setSelectedCertificate("");
        setFile(null);
        setPreview(null);
        setEditingIndex(null);
        setError("");
      }
    } catch (err) {
      console.error("Error saving certificate:", err);
      setError("Error saving certificate.");
    }
  };

  const handleEdit = (index: number) => {
    const cert = submittedCertificates[index];
    setFormData(cert);
    setSelectedCertificate(cert.type);
    setPreview(cert.fileUrl || null);
    setEditingIndex(index);
  };

  const buttonClass = (type: CertificateType) =>
    `py-2 px-5 rounded-2xl font-semibold transition w-full sm:w-auto text-center sm:text-sm ${
      selectedCertificate === type
        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
        : "border border-gray-300 text-gray-700 hover:bg-gradient-to-r hover:from-purple-400 hover:to-indigo-400 hover:text-white"
    }`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-gradient-to-tr from-[#EDF9FD] to-[#FFFFFF]">
      <div className="w-full max-w-3xl p-8 sm:p-10 bg-white shadow-2xl rounded-3xl border border-gray-200">
        {/* Back Button */}
        <Link
          href="/dashboard/student"
          className="mb-4 inline-flex items-center justify-center w-10 h-10 bg-indigo-500 text-white rounded-full shadow hover:bg-indigo-600 transition duration-200"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">🎓 Certificates</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Certificate Type Selection */}
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <button type="button" className={buttonClass("Technical")} onClick={() => handleCertificateSelect("Technical")}>
              Technical
            </button>
            <button type="button" className={buttonClass("Cultural")} onClick={() => handleCertificateSelect("Cultural")}>
              Cultural
            </button>
            <button type="button" className={buttonClass("Sports")} onClick={() => handleCertificateSelect("Sports")}>
              Sports
            </button>
          </div>

          {selectedCertificate && (
            <div className="flex flex-col gap-3 mt-3">
              <input
                type="text"
                name="eventName"
                placeholder="Event Name"
                value={formData?.eventName || ""}
                onChange={handleInputChange}
                className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-300 shadow-sm"
                required
              />
              <input
                type="date"
                name="date"
                value={formData?.date || ""}
                onChange={handleInputChange}
                className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-300 shadow-sm"
                required
              />
              <input
                type="file"
                accept="application/pdf,image/png,image/jpeg"
                onChange={handleFileChange}
                className="border border-gray-300 p-3 rounded-2xl"
              />
              {preview && (
                <div className="mt-3 border border-gray-200 rounded-2xl overflow-hidden shadow-md">
                  <p className="bg-indigo-600 text-white p-2 text-sm font-medium">Preview</p>
                  {file?.type === "application/pdf" ? (
                    <iframe src={preview} className="w-full h-56" title="Certificate Preview"></iframe>
                  ) : (
                    <img src={preview} alt="Certificate Preview" className="w-full h-56 object-contain" />
                  )}
                </div>
              )}
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" className="mt-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-2xl font-semibold shadow-lg">
            {editingIndex !== null ? "Update" : "Submit"}
          </button>
        </form>
      </div>

      {/* Submitted Certificates */}
      {submittedCertificates.length > 0 && (
        <div className="w-full max-w-3xl mt-8">
          <h3 className="text-2xl font-semibold mb-4 text-indigo-700">📑 Submitted Certificates</h3>
          <div className="flex flex-col gap-4">
            {submittedCertificates.map((cert, index) => (
              <div key={index} className="p-5 bg-white border rounded-2xl shadow-md flex justify-between items-start">
                <div>
                  <p className="font-bold">{cert.eventName}</p>
                  <p className="text-sm text-gray-600">📅 {cert.date}</p>
                  {cert.fileUrl && (
                    cert.fileUrl.endsWith(".pdf") ? (
                      <iframe src={cert.fileUrl} className="w-full h-40 mt-2"></iframe>
                    ) : (
                      <img src={cert.fileUrl} alt="Certificate" className="w-full h-40 object-contain mt-2" />
                    )
                  )}
                </div>
                <button onClick={() => handleEdit(index)} className="px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600">
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
