"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import axios from "axios";

// ✅ Google Drive Viewer for reliable inline PDF viewing
const getInlineViewUrl = (url: string): string => {
  if (!url) return "";
  return `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(url)}`;
};

type CertificateType = "Technical" | "Cultural" | "Sports";

interface CertificateData {
  _id?: string;
  type: CertificateType;
  eventName: string;
  date: string;
  fileUrl?: string;
}

export default function CertificatePage() {
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateType | "">("");
  const [formData, setFormData] = useState<Partial<CertificateData>>({});
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");
  const [submittedCertificates, setSubmittedCertificates] = useState<CertificateData[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [error, setError] = useState("");
  const MAX_FILE_SIZE_MB = 5;

  const formatType = (type: string): CertificateType =>
    (type.charAt(0).toUpperCase() + type.slice(1)) as CertificateType;

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
              type: formatType(c.type),
              eventName: c.eventName,
              date: c.date?.split("T")[0] || "",
              fileUrl: c.certificateUrl,
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
    
    // Create preview URL for local file
    if (f.type === "application/pdf") {
      setFilePreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCertificate || !formData?.eventName || !formData?.date) {
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
        res = await axios.put(
          `http://localhost:5000/api/Certificate/update/${submittedCertificates[editingIndex]._id}`,
          formDataToSend,
          { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
        );
      } else {
        res = await axios.post("http://localhost:5000/api/Certificate/save", formDataToSend, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
      }

      if (res.data.success) {
        const savedCert: CertificateData = {
          _id: res.data.data._id,
          type: formatType(res.data.data.type),
          eventName: res.data.data.eventName,
          date: res.data.data.date?.split("T")[0] || "",
          fileUrl: res.data.data.certificateUrl,
        };

        const updatedList =
          editingIndex !== null
            ? submittedCertificates.map((c, i) => (i === editingIndex ? savedCert : c))
            : [...submittedCertificates, savedCert];

        setSubmittedCertificates(updatedList);
        setFormData({});
        setSelectedCertificate("");
        setFile(null);
        setFilePreview("");
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
    setFile(null);
    setFilePreview("");
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
        <Link
          href="/dashboard/student"
          className="mb-4 inline-flex items-center justify-center w-10 h-10 bg-indigo-500 text-white rounded-full shadow hover:bg-indigo-600 transition duration-200"
          aria-label="Go back"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">🎓 Certificates</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
              
              <label className="font-medium text-gray-700 mt-2">
                Upload Certificate (PDF/Image) - Max {MAX_FILE_SIZE_MB}MB
              </label>
              <input
                type="file"
                accept="application/pdf,image/png,image/jpeg"
                onChange={handleFileChange}
                className="border border-gray-300 p-3 rounded-2xl focus:ring-2 focus:ring-indigo-300"
              />
              
              {filePreview && (
                <div className="mt-3 border border-gray-200 rounded-2xl overflow-hidden shadow-md">
                  <p className="bg-indigo-600 text-white p-2 text-sm font-medium">File Preview</p>
                  <iframe src={filePreview} className="w-full h-56 sm:h-72" title="File Preview"></iframe>
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

      {submittedCertificates.length > 0 && (
        <div className="w-full max-w-3xl mt-8">
          <h3 className="text-2xl font-semibold mb-4 text-indigo-700">📑 Submitted Certificates</h3>
          <div className="flex flex-col gap-4">
            {submittedCertificates.map((cert, index) => (
              <div
                key={index}
                className="p-5 bg-white border rounded-2xl shadow-md flex justify-between items-start"
              >
                <div className="flex-1 pr-4">
                  <p className="font-bold text-lg">{cert.eventName}</p>
                  <p className="text-sm text-gray-600">📅 {cert.date}</p>
                  <p className="text-sm text-indigo-600 font-medium">🎯 {cert.type}</p>

                  {/* ✅ View and Download Buttons */}
                  {cert.fileUrl && (
                    <div className="flex gap-3 mt-3">
                      <a
                        href={getInlineViewUrl(cert.fileUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                      >
                        View Certificate
                      </a>
                      <a
                        href={cert.fileUrl}
                        download
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        Download
                      </a>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleEdit(index)}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition"
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