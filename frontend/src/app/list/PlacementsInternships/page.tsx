// "use client";

// import { useState } from "react";

// interface InternshipEntry {
//   title: string;
//   organization: string;
//   duration: string;
//   description: string;
//   pdfFile: File | null;
//   pdfPreview: string | null;
// }

// export default function PlacementsPage() {
//   const [formData, setFormData] = useState({ name: "", urn: "" });
//   const [entries, setEntries] = useState<InternshipEntry[]>([
//     { title: "", organization: "", duration: "", description: "", pdfFile: null, pdfPreview: null },
//   ]);
//   const [error, setError] = useState("");
//   const [submitted, setSubmitted] = useState(false);

//   const MAX_FILE_SIZE_MB = 5;

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     if (name === "urn" && !/^\d*$/.test(value)) return;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleEntryChange = (index: number, field: keyof InternshipEntry, value: string) => {
//     const updated = [...entries];
//     (updated[index][field] as string) = value;
//     setEntries(updated);
//   };

//   const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (file.type !== "application/pdf") {
//       setError("Only PDF files are allowed.");
//       return;
//     }
//     if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
//       setError(`File size must be less than ${MAX_FILE_SIZE_MB} MB.`);
//       return;
//     }

//     const updated = [...entries];
//     updated[index].pdfFile = file;
//     updated[index].pdfPreview = URL.createObjectURL(file); // keep for preview
//     setEntries(updated);
//     setError("");
//   };

//   const addEntry = () => {
//     setEntries([
//       ...entries,
//       { title: "", organization: "", duration: "", description: "", pdfFile: null, pdfPreview: null },
//     ]);
//   };

//   const removeEntry = (index: number) => {
//     const updated = [...entries];
//     updated.splice(index, 1);
//     setEntries(updated);
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!formData.name || !formData.urn) {
//       setError("Please fill in all required fields.");
//       return;
//     }

//     for (const entry of entries) {
//       if (!entry.title || !entry.organization || !entry.duration) {
//         setError("Please fill in all internship fields.");
//         return;
//       }
//     }

//     console.log("Placements Form Submitted:", { ...formData, internships: entries });
//     alert("Form submitted successfully!");
//     setError("");
//     setSubmitted(true); // hide form
//   };

//   const handleEdit = () => {
//     setSubmitted(false); // bring back form for edit/add
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#EDF9FD] to-[#FFFFFF] p-6">
//       <div className="max-w-4xl w-full p-8 sm:p-10 bg-white shadow-2xl rounded-3xl border border-gray-200">
//         <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">
//           🎯 Placements & Internships
//         </h2>

//         {submitted ? (
//           <div className="text-center flex flex-col items-center gap-6">
//             <h3 className="text-2xl font-bold text-green-600">✅ Submitted Successfully!</h3>
//             <button
//               onClick={handleEdit}
//               className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-indigo-500 transition-all"
//             >
//               + Add / Edit Internship
//             </button>

//             {/* Display Submitted Data */}
//             <div className="w-full mt-6 flex flex-col gap-4">
//               <p><strong>Name:</strong> {formData.name}</p>
//               <p><strong>URN:</strong> {formData.urn}</p>
//               {entries.map((entry, idx) => (
//                 <div key={idx} className="border border-gray-200 p-4 rounded-2xl shadow-sm">
//                   <h4 className="font-semibold text-indigo-700">Internship {idx + 1}</h4>
//                   <p><strong>Title:</strong> {entry.title}</p>
//                   <p><strong>Organization:</strong> {entry.organization}</p>
//                   <p><strong>Duration:</strong> {entry.duration}</p>
//                   <p><strong>Description:</strong> {entry.description || "N/A"}</p>
//                   {entry.pdfPreview && (
//                     <div className="mt-2 border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
//                       <p className="bg-indigo-600 text-white p-2 text-sm font-medium">Certificate PDF</p>
//                       <iframe
//                         src={entry.pdfPreview}
//                         className="w-full h-52 sm:h-64"
//                         title={`PDF Preview ${idx + 1}`}
//                       ></iframe>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit} className="flex flex-col gap-6">
//             {/* Basic Info */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Your Name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 className="border border-gray-300 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition shadow-sm"
//                 required
//               />
//               <input
//                 type="text"
//                 name="urn"
//                 placeholder="URN (Numbers Only)"
//                 value={formData.urn}
//                 onChange={handleInputChange}
//                 className="border border-gray-300 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition shadow-sm"
//                 required
//               />
//             </div>

//             {/* Internship Entries */}
//             <div className="flex flex-col gap-5">
//               {entries.map((entry, idx) => (
//                 <div
//                   key={idx}
//                   className="border border-gray-200 p-6 rounded-3xl shadow-md bg-white transition-all duration-300 hover:shadow-xl relative"
//                 >
//                   {entries.length > 1 && (
//                     <button
//                       type="button"
//                       onClick={() => removeEntry(idx)}
//                       className="absolute top-3 right-3 text-red-500 font-bold text-xl hover:text-red-700"
//                     >
//                       ✕
//                     </button>
//                   )}
//                   <h3 className="text-xl font-semibold mb-4 text-indigo-700">
//                     Internship {idx + 1}
//                   </h3>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <input
//                       type="text"
//                       placeholder="Internship / Job Title"
//                       value={entry.title}
//                       onChange={(e) => handleEntryChange(idx, "title", e.target.value)}
//                       className="border border-gray-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
//                       required
//                     />
//                     <input
//                       type="text"
//                       placeholder="Organization Name"
//                       value={entry.organization}
//                       onChange={(e) => handleEntryChange(idx, "organization", e.target.value)}
//                       className="border border-gray-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
//                       required
//                     />
//                     <input
//                       type="text"
//                       placeholder="Duration (e.g., 3 months)"
//                       value={entry.duration}
//                       onChange={(e) => handleEntryChange(idx, "duration", e.target.value)}
//                       className="border border-gray-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
//                       required
//                     />
//                     <textarea
//                       placeholder="Role Description"
//                       value={entry.description}
//                       onChange={(e) => handleEntryChange(idx, "description", e.target.value)}
//                       className="border border-gray-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition col-span-full"
//                       rows={3}
//                     />
//                   </div>

//                   {/* PDF Upload */}
//                   <div className="flex flex-col gap-2 mt-4">
//                     <label className="font-medium text-gray-700">Upload Certificate (PDF)</label>
//                     <input
//                       type="file"
//                       accept="application/pdf"
//                       onChange={(e) => handleFileChange(idx, e)}
//                       className="border border-gray-300 p-3 rounded-2xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 cursor-pointer transition"
//                       required
//                     />
//                     {entry.pdfFile && (
//                       <p className="text-gray-700 text-sm mt-1 truncate">
//                         Uploaded File: <span className="font-medium">{entry.pdfFile.name}</span>
//                       </p>
//                     )}
//                     {entry.pdfPreview && (
//                       <div className="mt-2 border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
//                         <p className="bg-indigo-600 text-white p-2 text-sm font-medium">PDF Preview</p>
//                         <iframe
//                           src={entry.pdfPreview}
//                           className="w-full h-52 sm:h-64"
//                           title={`PDF Preview ${idx + 1}`}
//                         ></iframe>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Add Another Internship Button */}
//             <div className="flex justify-center">
//               <button
//                 type="button"
//                 onClick={addEntry}
//                 className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-6 rounded-2xl font-semibold hover:from-indigo-400 hover:to-purple-400 shadow-md transition-all"
//               >
//                 + Add Another Internship
//               </button>
//             </div>

//             {error && <p className="text-red-500 text-sm">{error}</p>}

//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-2xl font-semibold hover:from-purple-500 hover:to-indigo-500 shadow-lg transition-all"
//             >
//               Submit
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }





"use client";

import { useState } from "react";

interface PlacementEntry {
  title: string;
  organization: string;
  duration: string;
  description: string;
  yearOfPlacement: string;
  pdfFile: File | null;
  pdfPreview: string | null;
}

export default function PlacementsPage() {
  const [entries, setEntries] = useState<PlacementEntry[]>([
    {
      title: "",
      organization: "",
      duration: "",
      description: "",
      yearOfPlacement: "",
      pdfFile: null,
      pdfPreview: null,
    },
  ]);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const MAX_FILE_SIZE_MB = 5;

  const handleEntryChange = (
    index: number,
    field: keyof PlacementEntry,
    value: string
  ) => {
    const updated = [...entries];
    (updated[index][field] as string) = value;
    setEntries(updated);
  };

  const handleFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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

    const updated = [...entries];
    updated[index].pdfFile = file;
    updated[index].pdfPreview = URL.createObjectURL(file);
    setEntries(updated);
    setError("");
  };

  const addEntry = () => {
    setEntries([
      ...entries,
      {
        title: "",
        organization: "",
        duration: "",
        description: "",
        yearOfPlacement: "",
        pdfFile: null,
        pdfPreview: null,
      },
    ]);
  };

  const removeEntry = (index: number) => {
    const updated = [...entries];
    updated.splice(index, 1);
    setEntries(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    for (const entry of entries) {
      if (
        !entry.title ||
        !entry.organization ||
        !entry.duration ||
        !entry.yearOfPlacement
      ) {
        setError("Please fill in all placement fields.");
        return;
      }
    }

    console.log("Placements Form Submitted:", { placements: entries });
    alert("Form submitted successfully!");
    setError("");
    setSubmitted(true);
  };

  const handleEdit = () => {
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#EDF9FD] to-[#FFFFFF] p-6">
      <div className="max-w-4xl w-full p-8 sm:p-10 bg-white shadow-2xl rounded-3xl border border-gray-200">
        <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">
          🎯 Placements
        </h2>

        {submitted ? (
          <div className="text-center flex flex-col items-center gap-6">
            <h3 className="text-2xl font-bold text-green-600">
              ✅ Submitted Successfully!
            </h3>
            {/* <button
              onClick={handleEdit}
              className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-indigo-500 transition-all"
            >
              + Add / Edit Placement
            </button> */}

            {/* Display Submitted Data */}
            <div className="w-full mt-6 flex flex-col gap-4">
              {entries.map((entry, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 p-4 rounded-2xl shadow-sm"
                >
                  <h4 className="font-semibold text-indigo-700">
                    Placement 
                  </h4>
                  <p>
                    <strong>Title:</strong> {entry.title}
                  </p>
                  <p>
                    <strong>Organization:</strong> {entry.organization}
                  </p>
                  <p>
                    <strong>Duration:</strong> {entry.duration}
                  </p>
                  <p>
                    <strong>Year of Placement:</strong> {entry.yearOfPlacement}
                  </p>
                  <p>
                    <strong>Description:</strong> {entry.description || "N/A"}
                  </p>
                  {entry.pdfPreview && (
                    <div className="mt-2 border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                      <p className="bg-indigo-600 text-white p-2 text-sm font-medium">
                        Certificate PDF
                      </p>
                      <iframe
                        src={entry.pdfPreview}
                        className="w-full h-52 sm:h-64"
                        title={`PDF Preview ${idx + 1}`}
                      ></iframe>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Placement Entries */}
            <div className="flex flex-col gap-5">
              {entries.map((entry, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 p-6 rounded-3xl shadow-md bg-white transition-all duration-300 hover:shadow-xl relative"
                >
                  {entries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEntry(idx)}
                      className="absolute top-3 right-3 text-red-500 font-bold text-xl hover:text-red-700"
                    >
                      ✕
                    </button>
                  )}
                  <h3 className="text-xl font-semibold mb-4 text-indigo-700">
                    Placement {idx + 1}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Job Title"
                      value={entry.title}
                      onChange={(e) =>
                        handleEntryChange(idx, "title", e.target.value)
                      }
                      className="border border-gray-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Organization Name"
                      value={entry.organization}
                      onChange={(e) =>
                        handleEntryChange(idx, "organization", e.target.value)
                      }
                      className="border border-gray-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g., 6 months)"
                      value={entry.duration}
                      onChange={(e) =>
                        handleEntryChange(idx, "duration", e.target.value)
                      }
                      className="border border-gray-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Year of Placement (e.g., 2025)"
                      value={entry.yearOfPlacement}
                      onChange={(e) =>
                        handleEntryChange(idx, "yearOfPlacement", e.target.value)
                      }
                      className="border border-gray-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                      required
                    />
                    <textarea
                      placeholder="Role Description"
                      value={entry.description}
                      onChange={(e) =>
                        handleEntryChange(idx, "description", e.target.value)
                      }
                      className="border border-gray-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition col-span-full"
                      rows={3}
                    />
                  </div>

                  {/* PDF Upload */}
                  <div className="flex flex-col gap-2 mt-4">
                    <label className="font-medium text-gray-700">
                      Upload Offer Letter / Certificate (PDF)
                    </label>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => handleFileChange(idx, e)}
                      className="border border-gray-300 p-3 rounded-2xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 cursor-pointer transition"
                      required
                    />
                    {entry.pdfFile && (
                      <p className="text-gray-700 text-sm mt-1 truncate">
                        Uploaded File:{" "}
                        <span className="font-medium">{entry.pdfFile.name}</span>
                      </p>
                    )}
                    {entry.pdfPreview && (
                      <div className="mt-2 border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                        <p className="bg-indigo-600 text-white p-2 text-sm font-medium">
                          PDF Preview
                        </p>
                        <iframe
                          src={entry.pdfPreview}
                          className="w-full h-52 sm:h-64"
                          title={`PDF Preview ${idx + 1}`}
                        ></iframe>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Another Placement Button
            <div className="flex justify-center">
              <button
                type="button"
                onClick={addEntry}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-6 rounded-2xl font-semibold hover:from-indigo-400 hover:to-purple-400 shadow-md transition-all"
              >
                + Add Another Placement
              </button>
            </div> */}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Submit Button */}
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
