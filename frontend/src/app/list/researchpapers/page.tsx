"use client";
import Link from "next/link";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";


type PaperType = "journal" | "conference" | "workshop";

interface PaperData {
  _id?: string;
  paperTitle: string;
  publicationName: string;
  publicationDate: string;
  paperLink: string;
  doi?: string;
  facultyName?: string;
  paperType: PaperType;
}

export default function ResearchPaperPage() {

  const [selectedPaper, setSelectedPaper] = useState<PaperType | "">("");
  const [formData, setFormData] = useState<Partial<PaperData>>({});
  const [submittedPapers, setSubmittedPapers] = useState<PaperData[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [error, setError] = useState("");

  // Fetch existing papers
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/Research/me", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (res.data.success) {
          setSubmittedPapers(
            res.data.data.map((p: any) => ({
              _id: p._id,
              paperTitle: p.paperTitle,
              publicationName: p.journalName,
              publicationDate: p.date?.split("T")[0] || "",
              paperLink: p.linkOfPaper,
              doi: p.doi || "",
              facultyName: p.facultyMentor || "",
              paperType: p.type.toLowerCase(),
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching research papers:", err);
      }
    };

    fetchPapers();
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaperSelect = (type: PaperType) => {
    setSelectedPaper(type);
    setFormData((prev) => ({ ...prev, paperType: type }));
    setError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!selectedPaper) {
    setError("Please select a paper type.");
    return;
  }

  if (
    !formData?.paperTitle ||
    !formData?.publicationName ||
    !formData?.publicationDate ||
    !formData?.paperLink
  ) {
    setError("Please fill in all required fields.");
    return;
  }

  const payload = {
    paperTitle: formData.paperTitle,
    journalName: formData.publicationName,
    date: formData.publicationDate,
    linkOfPaper: formData.paperLink,
    doi: formData.doi,
    facultyMentor: formData.facultyName,
    type: formData.paperType
  ? formData.paperType.charAt(0).toUpperCase() + formData.paperType.slice(1)
  : "",

  };

  try {
    const token = localStorage.getItem("token");
    let res;

    if (editingIndex !== null && submittedPapers[editingIndex]._id) {
      // 🔄 Update existing paper
      res = await axios.put(
        `http://localhost:5000/api/Research/update/${submittedPapers[editingIndex]._id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
    } else {
      // 🆕 Save new paper
      res = await axios.post(
        "http://localhost:5000/api/Research/save",
        payload,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
    }

    if (res.data.success) {
      const savedPaper = {
        _id: res.data.data._id, // ✅ MongoDB _id from backend
        paperTitle: res.data.data.paperTitle,
        publicationName: res.data.data.journalName,
        publicationDate: res.data.data.date?.split("T")[0] || "",
        paperLink: res.data.data.linkOfPaper,
        doi: res.data.data.doi || "",
        facultyName: res.data.data.facultyMentor || "",
        paperType: res.data.data.type.toLowerCase(),
      };

      const updatedList =
        editingIndex !== null
          ? submittedPapers.map((p, i) => (i === editingIndex ? savedPaper : p))
          : [...submittedPapers, savedPaper];

      setSubmittedPapers(updatedList);
      setFormData({});
      setSelectedPaper("");
      setEditingIndex(null);
      setError("");
    }
  } catch (err) {
    console.error("Error submitting paper:", err);
  }
};


  const handleEdit = (index: number) => {
    setFormData(submittedPapers[index]);
    setSelectedPaper(submittedPapers[index].paperType);
    setEditingIndex(index);
  };

  const buttonClass = (type: PaperType) =>
    `py-2 px-5 rounded-2xl font-semibold transition w-full sm:w-auto text-center sm:text-sm ${
      selectedPaper === type
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
          📄 Published Research Papers
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Paper Type Selection */}
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <button type="button" className={buttonClass("journal")} onClick={() => handlePaperSelect("journal")}>Journal</button>
            <button type="button" className={buttonClass("conference")} onClick={() => handlePaperSelect("conference")}>Conference</button>
            <button type="button" className={buttonClass("workshop")} onClick={() => handlePaperSelect("workshop")}>Workshop</button>
          </div>

          {/* Paper Form */}
          {selectedPaper && (
            <div className="flex flex-col gap-3 mt-3">
              <input type="text" name="paperTitle" placeholder="Paper Title" value={formData?.paperTitle || ""} onChange={handleInputChange} className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-300 shadow-sm" required />
              <input type="text" name="publicationName" placeholder="Journal / Conference Name" value={formData?.publicationName || ""} onChange={handleInputChange} className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-300 shadow-sm" required />
              <input type="date" name="publicationDate" value={formData?.publicationDate || ""} onChange={handleInputChange} className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-300 shadow-sm" required />
              <input type="text" name="paperLink" placeholder="Link to Paper" value={formData?.paperLink || ""} onChange={handleInputChange} className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-300 shadow-sm" required />
              <input type="text" name="doi" placeholder="DOI (Optional)" value={formData?.doi || ""} onChange={handleInputChange} className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-300 shadow-sm" />
              <input type="text" name="facultyName" placeholder="Faculty Mentor (Optional)" value={formData?.facultyName || ""} onChange={handleInputChange} className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-300 shadow-sm" />
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" className="mt-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-2xl font-semibold hover:from-purple-500 hover:to-indigo-500 shadow-lg transition-all">
            {editingIndex !== null ? "Update" : "Submit"}
          </button>
        </form>
      </div>

      {/* Submitted Papers List */}
      {submittedPapers.length > 0 && (
        <div className="w-full max-w-3xl mt-8">
          <h3 className="text-2xl font-semibold mb-4 text-indigo-700">📑 Submitted Papers</h3>
          <div className="flex flex-col gap-4">
            {submittedPapers.map((paper, index) => (
              <div key={index} className="p-5 bg-white border rounded-2xl shadow-md flex justify-between items-start">
                <div>
                  <p className="font-bold">{paper.paperTitle}</p>
                  <p className="text-sm text-gray-600">{paper.publicationName}</p>
                  <p className="text-sm text-gray-600">📅 {paper.publicationDate} | 🔗 <a href={paper.paperLink} target="_blank" className="text-indigo-600 underline">Link</a></p>
                  {paper.doi && <p className="text-sm">DOI: {paper.doi}</p>}
                  {paper.facultyName && <p className="text-sm">👨‍🏫 Faculty: {paper.facultyName}</p>}
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
