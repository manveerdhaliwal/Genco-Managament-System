"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";

interface ActivityData {
  societyName: string;
  role: string;
  duration: string;
  description: string;
}

export default function ActivitiesPage() {
  const [formData, setFormData] = useState<Partial<ActivityData>>({});
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [error, setError] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const requiredFields: (keyof ActivityData)[] = ["societyName", "role", "duration", "description"];

    for (const field of requiredFields) {
      if (!formData[field]) {
        setError("Please fill in all required fields.");
        return;
      }
    }

    const newActivity: ActivityData = {
      societyName: formData.societyName!,
      role: formData.role!,
      duration: formData.duration!,
      description: formData.description!,
    };

    if (editingIndex !== null) {
      const updatedActivities = activities.map((a, i) => (i === editingIndex ? newActivity : a));
      setActivities(updatedActivities);
    } else {
      setActivities([...activities, newActivity]);
    }

    setFormData({});
    setEditingIndex(null);
    setError("");
  };

  const handleEdit = (index: number) => {
    setFormData(activities[index]);
    setEditingIndex(index);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gradient-to-tr from-[#EDF9FD] to-[#FFFFFF]">
      <div className="w-full max-w-3xl p-8 bg-white shadow-2xl rounded-3xl border border-gray-200">
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

        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">📝 Student Activities</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="societyName"
            placeholder="Society Name"
            value={formData.societyName || ""}
            onChange={handleInputChange}
            className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-300 shadow-sm"
          />
          <input
            type="text"
            name="role"
            placeholder="Your Role / Post"
            value={formData.role || ""}
            onChange={handleInputChange}
            className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-300 shadow-sm"
          />
          <input
            type="text"
            name="duration"
            placeholder="Duration (e.g., Jan 2024 - May 2024)"
            value={formData.duration || ""}
            onChange={handleInputChange}
            className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-300 shadow-sm"
          />
          <textarea
            name="description"
            placeholder="Description of your activities"
            value={formData.description || ""}
            onChange={handleInputChange}
            className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-300 shadow-sm resize-none"
            rows={3}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-2xl font-semibold hover:from-purple-500 hover:to-indigo-500 shadow-lg"
          >
            {editingIndex !== null ? "Update" : "Add Activity"}
          </button>
        </form>
      </div>

      {activities.length > 0 && (
        <div className="w-full max-w-3xl mt-6 flex flex-col gap-4">
          <h3 className="text-2xl font-semibold mb-2 text-indigo-700">📑 Submitted Activities</h3>
          {activities.map((activity, index) => (
            <div key={index} className="p-4 bg-white border rounded-2xl shadow-md flex justify-between items-start">
              <div>
                <p className="font-bold">{activity.societyName} ({activity.role})</p>
                <p className="text-sm text-gray-600">Duration: {activity.duration}</p>
                <p className="text-sm text-gray-600">Description: {activity.description}</p>
              </div>
              <button onClick={() => handleEdit(index)} className="px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600">
                Edit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
