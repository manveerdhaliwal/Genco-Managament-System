"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function DutyLeaveForm() {
  const [formData, setFormData] = useState({
    event_name: "",
    event_venue: "",
    event_date: "",
    reason: "",
    certificate_url: "",
  });
  
  const [myLeaves, setMyLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  const fetchMyLeaves = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/duty-leave/my-leaves", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMyLeaves(data.data || []);
    } catch (err) {
      console.error("Error fetching leaves:", err);
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      
      const res = await fetch("http://localhost:5000/api/duty-leave/", {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(data.message);
        setFormData({
          event_name: "",
          event_venue: "",
          event_date: "",
          reason: "",
          certificate_url: "",
        });
        fetchMyLeaves();
      } else {
        setError(data.message || "Failed to submit");
      }
    } catch (err) {
      setError("Failed to submit duty leave");
    } finally {
      setLoading(false);
    }
  };

  const getOverallStatusBadge = (leave: any) => {
    const status = leave.overall_status;
    const colors: any = {
      "Pending": "bg-yellow-100 text-yellow-800 border-yellow-300",
      "Advisor Approved": "bg-blue-100 text-blue-800 border-blue-300",
      "Fully Approved": "bg-green-100 text-green-800 border-green-300",
      "Rejected": "bg-red-100 text-red-800 border-red-300",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${colors[status]}`}>
        {status}
      </span>
    );
  };

  const getProgressSteps = (leave: any) => {
    const steps = [
      { label: "Submitted", status: "complete" },
      { 
        label: "Advisor", 
        status: leave.advisor_approval === "Approved" ? "complete" : 
                leave.advisor_approval === "Rejected" ? "rejected" : "pending"
      },
      { 
        label: "HoD", 
        status: leave.hod_approval === "Approved" ? "complete" : 
                leave.hod_approval === "Rejected" ? "rejected" :
                leave.hod_approval === "Pending" ? "pending" : "inactive"
      },
    ];

    return (
      <div className="flex items-center justify-between mt-4 mb-2">
        {steps.map((step: any, index: number) => (
          <div key={index} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                step.status === "complete" ? "bg-green-500 text-white" :
                step.status === "rejected" ? "bg-red-500 text-white" :
                step.status === "pending" ? "bg-yellow-500 text-white" :
                "bg-gray-300 text-gray-600"
              }`}>
                {step.status === "complete" ? "✓" : 
                 step.status === "rejected" ? "✗" :
                 step.status === "pending" ? "⏳" : index + 1}
              </div>
              <span className="text-xs mt-1 font-medium">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-2 ${
                step.status === "complete" ? "bg-green-500" : "bg-gray-300"
              }`} />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/dashboard/student"
          className="mb-4 inline-flex items-center justify-center w-10 h-10 bg-indigo-500 text-white rounded-full shadow hover:bg-indigo-600 transition duration-200"
          aria-label="Go back"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>

        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-8">
          📝 Duty Leave Application
        </h1>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Submit New Application</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Event Name *</label>
              <input
                type="text"
                name="event_name"
                value={formData.event_name}
                onChange={handleChange}
                placeholder="e.g., Tech Fest 2024"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Event Venue *</label>
              <input
                type="text"
                name="event_venue"
                value={formData.event_venue}
                onChange={handleChange}
                placeholder="e.g., Auditorium"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Event Date *</label>
              <input
                type="date"
                name="event_date"
                value={formData.event_date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Certificate URL</label>
              <input
                type="url"
                name="certificate_url"
                value={formData.certificate_url}
                onChange={handleChange}
                placeholder="https://example.com/certificate.pdf"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">Reason *</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows={4}
                placeholder="Explain why you need duty leave..."
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="md:col-span-2 flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-lg shadow-lg transition disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Application 🚀"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Applications</h2>
          
          {myLeaves.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No duty leave applications yet</p>
          ) : (
            <div className="space-y-6">
              {myLeaves.map((leave: any) => (
                <div key={leave._id} className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{leave.event_name}</h3>
                      <p className="text-sm text-gray-600">📍 {leave.event_venue}</p>
                      <p className="text-sm text-gray-600">📅 {new Date(leave.event_date).toLocaleDateString()}</p>
                    </div>
                    {getOverallStatusBadge(leave)}
                  </div>

                  {getProgressSteps(leave)}
                  
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">
                      <strong>Reason:</strong> {leave.reason}
                    </p>
                  </div>
                  
                  {leave.advisor && (
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Advisor:</strong> {leave.advisor.name}
                    </p>
                  )}
                  
                  {leave.advisor_remarks && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <p className="text-sm font-semibold text-blue-900">Advisor Remarks:</p>
                      <p className="text-sm text-blue-800">{leave.advisor_remarks}</p>
                    </div>
                  )}
                  
                  {leave.hod_remarks && (
                    <div className="mt-3 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                      <p className="text-sm font-semibold text-purple-900">HoD Remarks:</p>
                      <p className="text-sm text-purple-800">{leave.hod_remarks}</p>
                    </div>
                  )}
                  
                  {leave.certificate_url && (
                    <a 
                      href={leave.certificate_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 hover:underline mt-3 inline-block"
                    >
                      📄 View Certificate
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}