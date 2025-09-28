
"use client";

import React, { useState } from "react";

interface LeaveRequest {
  eventName: string;
  category: string;
  startDate: string;
  endDate: string;
  society: string;
}

interface LeaveStatus {
  mentor: "Pending" | "Approved" | "Rejected";
  hod: "Pending" | "Approved" | "Rejected";
  principal: "Pending" | "Approved" | "Rejected";
}

export default function DutyLeavePage() {
  const [formData, setFormData] = useState<LeaveRequest>({
    eventName: "",
    category: "",
    startDate: "",
    endDate: "",
    society: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<LeaveStatus>({
    mentor: "Pending",
    hod: "Pending",
    principal: "Pending",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    // Mock auto-approve Mentor, keep others pending
    setStatus({ mentor: "Approved", hod: "Pending", principal: "Pending" });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">
        📌 Duty Leave Application
      </h1>

      {!submitted ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4"
        >
          <input
            type="text"
            name="eventName"
            placeholder="Event Name"
            value={formData.eventName}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />

          {/* From - To Date Range */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                From
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>

            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                To
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
          </div>

          <input
            type="text"
            name="society"
            placeholder="Society"
            value={formData.society}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Submit Application
          </button>
        </form>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700">
            📑 Application Submitted
          </h2>
          <p>
            <strong>Event:</strong> {formData.eventName}
          </p>
          <p>
            <strong>Category:</strong> {formData.category}
          </p>
          <p>
            <strong>Period:</strong> {formData.startDate} → {formData.endDate}
          </p>
          <p>
            <strong>Society:</strong> {formData.society}
          </p>

          <div className="mt-6 space-y-2">
            <p>
              Mentor Status:{" "}
              <span
                className={
                  status.mentor === "Approved"
                    ? "text-green-600"
                    : "text-orange-500"
                }
              >
                {status.mentor}
              </span>
            </p>
            <p>
              HOD Status:{" "}
              <span
                className={
                  status.hod === "Approved"
                    ? "text-green-600"
                    : "text-orange-500"
                }
              >
                {status.hod}
              </span>
            </p>
            <p>
              Principal Status:{" "}
              <span
                className={
                  status.principal === "Approved"
                    ? "text-green-600"
                    : "text-orange-500"
                }
              >
                {status.principal}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

