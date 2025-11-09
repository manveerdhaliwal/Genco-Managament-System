"use client";

import { useState, useEffect } from "react";
import { Calendar, FileText, MapPin, CheckCircle, XCircle, Clock, User, Filter } from "lucide-react";
import Link from "next/link";

type DutyLeave = {
  _id: string;
  student: {
    _id: string;
    name: string;
    CRN: string;
    URN: string;
    branch: string;
    year: string;
    section?: string;
  };
  event_name: string;
  event_venue: string;
  event_date: string;
  reason: string;
  certificate_url?: string;
  hod_approval: "Pending" | "Approved" | "Rejected";
  mentor_approval: "Pending" | "Approved" | "Rejected";
  createdAt: string;
};

export default function AdvisorDutyLeaveApproval() {
  const [leaves, setLeaves] = useState<DutyLeave[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [sectionFilter, setSectionFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAdvisorDutyLeaves();
  }, []);

  const fetchAdvisorDutyLeaves = async () => {
    try {
      const token = localStorage.getItem("token");
      // Endpoint should return duty leaves for all students in Advisor's branch
      const res = await fetch("http://localhost:5000/api/dutyleave/advisor", {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setLeaves(data);
      }
    } catch (err) {
      console.error("Error fetching advisor duty leaves:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (leaveId: string, status: "Approved" | "Rejected") => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/dutyleave/advisor/approval", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          leaveId,
          mentor_approval: status,
        }),
      });

      if (res.ok) {
        alert(`Duty leave ${status.toLowerCase()} successfully!`);
        fetchAdvisorDutyLeaves();
      } else {
        alert("Failed to update approval status");
      }
    } catch (err) {
      console.error("Error updating approval:", err);
      alert("Error updating approval status");
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      Approved: "bg-green-100 text-green-800 border-green-300",
      Rejected: "bg-red-100 text-red-800 border-red-300",
    };
    const icons = {
      Pending: <Clock className="w-4 h-4" />,
      Approved: <CheckCircle className="w-4 h-4" />,
      Rejected: <XCircle className="w-4 h-4" />,
    };
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {status}
      </span>
    );
  };

  // Get unique years and sections for filters
  const uniqueYears = Array.from(new Set(leaves.map(l => l.student.year))).sort();
  const uniqueSections = Array.from(new Set(leaves.map(l => l.student.section).filter(Boolean))).sort();

  // Apply filters
  const filteredLeaves = leaves.filter((leave) => {
    // Approval status filter
    if (filter === "pending" && leave.mentor_approval !== "Pending") return false;
    if (filter === "approved" && leave.mentor_approval !== "Approved") return false;
    if (filter === "rejected" && leave.mentor_approval !== "Rejected") return false;

    // Year filter
    if (yearFilter !== "all" && leave.student.year !== yearFilter) return false;

    // Section filter
    if (sectionFilter !== "all" && leave.student.section !== sectionFilter) return false;

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        leave.student.name.toLowerCase().includes(query) ||
        leave.student.CRN.toLowerCase().includes(query) ||
        leave.student.URN.toLowerCase().includes(query) ||
        leave.event_name.toLowerCase().includes(query)
      );
    }

    return true;
  });

  if (loading) {
    return <div className="p-6 text-center">Loading duty leaves...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Back Button */}
      <Link
        href="/dashboard/teacher"
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

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Department Duty Leave Approvals (Advisor)</h1>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by student name, CRN, URN, or event..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Filter Section */}
      <div className="mb-6 bg-white p-4 rounded-xl shadow">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Approval Status</label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 rounded-lg text-sm transition ${
                  filter === "all" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-3 py-1 rounded-lg text-sm transition ${
                  filter === "pending" ? "bg-yellow-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter("approved")}
                className={`px-3 py-1 rounded-lg text-sm transition ${
                  filter === "approved" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setFilter("rejected")}
                className={`px-3 py-1 rounded-lg text-sm transition ${
                  filter === "rejected" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Rejected
              </button>
            </div>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Years</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>Year {year}</option>
              ))}
            </select>
          </div>

          {/* Section Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Sections</option>
              {uniqueSections.map(section => (
                <option key={section} value={section}>Section {section}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Total</p>
          <p className="text-2xl font-bold text-gray-800">{leaves.length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow border border-yellow-200">
          <p className="text-yellow-800 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-800">
            {leaves.filter(l => l.mentor_approval === "Pending").length}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow border border-green-200">
          <p className="text-green-800 text-sm">Approved</p>
          <p className="text-2xl font-bold text-green-800">
            {leaves.filter(l => l.mentor_approval === "Approved").length}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow border border-red-200">
          <p className="text-red-800 text-sm">Rejected</p>
          <p className="text-2xl font-bold text-red-800">
            {leaves.filter(l => l.mentor_approval === "Rejected").length}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow border border-blue-200">
          <p className="text-blue-800 text-sm">Filtered</p>
          <p className="text-2xl font-bold text-blue-800">{filteredLeaves.length}</p>
        </div>
      </div>

      {/* Duty Leaves List */}
      <div className="space-y-4">
        {filteredLeaves.length === 0 ? (
          <div className="bg-white p-12 rounded-xl shadow text-center">
            <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No duty leave applications found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          filteredLeaves.map((leave) => (
            <div key={leave._id} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-200 border border-gray-100">
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div className="flex-1">
                  {/* Student Info */}
                  <div className="flex items-start gap-3 mb-4 bg-indigo-50 p-4 rounded-lg">
                    <User className="w-5 h-5 text-indigo-600 mt-1" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-lg">{leave.student.name}</p>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <p className="text-sm text-gray-600">CRN: {leave.student.CRN}</p>
                        <p className="text-sm text-gray-600">URN: {leave.student.URN}</p>
                        <p className="text-sm text-gray-600">Year: {leave.student.year}</p>
                        <p className="text-sm text-gray-600">
                          Section: {leave.student.section || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600 col-span-2">Branch: {leave.student.branch}</p>
                      </div>
                    </div>
                  </div>

                  {/* Event Details */}
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{leave.event_name}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{leave.event_venue}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(leave.event_date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-600 mt-2">
                      <span className="font-medium">Reason:</span> {leave.reason}
                    </p>
                    {leave.certificate_url && (
                      <a
                        href={leave.certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline text-sm flex items-center gap-1"
                      >
                        <FileText className="w-4 h-4" />
                        View Certificate
                      </a>
                    )}
                  </div>
                </div>

                {/* Approval Section */}
                <div className="flex flex-col gap-4 lg:w-72">
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Advisor Approval (You)</p>
                      {getStatusBadge(leave.mentor_approval)}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">HOD Approval</p>
                      {getStatusBadge(leave.hod_approval)}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {leave.mentor_approval === "Pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproval(leave._id, "Approved")}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleApproval(leave._id, "Rejected")}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-400">
                Applied on: {new Date(leave.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}