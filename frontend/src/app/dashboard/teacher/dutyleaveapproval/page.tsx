"use client";

import { useState, useEffect } from "react";
import { Calendar, FileText, MapPin, CheckCircle, XCircle, Clock, User, Filter, MessageSquare } from "lucide-react";
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
  advisor?: {
    _id: string;
    name: string;
  };
  event_name: string;
  event_venue: string;
  event_date: string;
  reason: string;
  certificate_url?: string;
  advisor_approval: "Pending" | "Approved" | "Rejected";
  hod_approval: "Pending" | "Approved" | "Rejected";
  advisor_remarks?: string;
  hod_remarks?: string;
  overall_status: string;
  createdAt: string;
};

export default function TeacherDutyLeaveApproval() {
  const [leaves, setLeaves] = useState<DutyLeave[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<"advisor" | "hod">("advisor");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [sectionFilter, setSectionFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [remarksModal, setRemarksModal] = useState<{
    isOpen: boolean;
    leaveId: string;
    action: "Approved" | "Rejected" | null;
    remarks: string;
  }>({
    isOpen: false,
    leaveId: "",
    action: null,
    remarks: "",
  });

  useEffect(() => {
    fetchUserRole();
    fetchDutyLeaves();
  }, []);

  const fetchUserRole = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/teacher/profile", {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setUserRole(data.role === "hod" ? "hod" : "advisor");
      }
    } catch (err) {
      console.error("Error fetching user role:", err);
    }
  };
// In frontend/src/app/dashboard/teacher/dutyleaveapproval/page.tsx
// Update line ~80:
const fetchDutyLeaves = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/duty-leave/teacher", {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      setLeaves(data.data);
    }
  } catch (err) {
    console.error("Error fetching duty leaves:", err);
  } finally {
    setLoading(false);
  }
};

  const openRemarksModal = (leaveId: string, action: "Approved" | "Rejected") => {
    setRemarksModal({
      isOpen: true,
      leaveId,
      action,
      remarks: "",
    });
  };

  const closeRemarksModal = () => {
    setRemarksModal({
      isOpen: false,
      leaveId: "",
      action: null,
      remarks: "",
    });
  };

  // Update handleApproval function around line ~120:
const handleApproval = async () => {
  if (!remarksModal.action || !remarksModal.leaveId) return;

  try {
    const token = localStorage.getItem("token");
    const payload = {
      leaveId: remarksModal.leaveId,
      advisor_approval: remarksModal.action,
      advisor_remarks: remarksModal.remarks,
    };

    const res = await fetch("http://localhost:5000/api/duty-leave/advisor-approval", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      alert(`Duty leave ${remarksModal.action.toLowerCase()} successfully!`);
      closeRemarksModal();
      fetchDutyLeaves();
    } else {
      alert(data.message || "Failed to update approval status");
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

  const getProgressSteps = (leave: DutyLeave) => {
    const steps = [
      { label: "Submitted", status: "complete" },
      {
        label: "Advisor",
        status:
          leave.advisor_approval === "Approved"
            ? "complete"
            : leave.advisor_approval === "Rejected"
            ? "rejected"
            : "pending",
      },
      {
        label: "HoD",
        status:
          leave.hod_approval === "Approved"
            ? "complete"
            : leave.hod_approval === "Rejected"
            ? "rejected"
            : leave.advisor_approval === "Approved"
            ? "pending"
            : "inactive",
      },
    ];

    return (
      <div className="flex items-center justify-between mt-4 mb-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  step.status === "complete"
                    ? "bg-green-500 text-white"
                    : step.status === "rejected"
                    ? "bg-red-500 text-white"
                    : step.status === "pending"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {step.status === "complete"
                  ? "✓"
                  : step.status === "rejected"
                  ? "✗"
                  : step.status === "pending"
                  ? "⏳"
                  : index + 1}
              </div>
              <span className="text-xs mt-1 font-medium">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  step.status === "complete" ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  // Get unique years and sections for filters
  const uniqueYears = Array.from(new Set(leaves.map((l) => l.student.year))).sort();
  const uniqueSections = Array.from(
    new Set(leaves.map((l) => l.student.section).filter(Boolean))
  ).sort();

  // Apply filters
  const filteredLeaves = leaves.filter((leave) => {
    // Determine which approval status to check based on role
    const relevantStatus = userRole === "advisor" ? leave.advisor_approval : leave.hod_approval;

    // Approval status filter
    if (filter === "pending" && relevantStatus !== "Pending") return false;
    if (filter === "approved" && relevantStatus !== "Approved") return false;
    if (filter === "rejected" && relevantStatus !== "Rejected") return false;

    // For HOD, only show leaves where advisor has approved (or if checking all/rejected)
    if (userRole === "hod" && filter === "pending" && leave.advisor_approval !== "Approved") {
      return false;
    }

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
        className={`mb-4 inline-flex items-center justify-center w-10 h-10 text-white rounded-full shadow transition duration-200 ${
          userRole === "hod"
            ? "bg-indigo-500 hover:bg-indigo-600"
            : "bg-green-500 hover:bg-green-600"
        }`}
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
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {userRole === "hod" ? "HOD Duty Leave Approvals" : "Advisor Duty Leave Approvals"}
          </h1>
          <p className="text-gray-600 mt-1">
            {userRole === "hod"
              ? "Review and approve duty leaves for your department"
              : "Review and approve duty leaves for your mentee students"}
          </p>
        </div>
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
                  filter === "all"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-3 py-1 rounded-lg text-sm transition ${
                  filter === "pending"
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter("approved")}
                className={`px-3 py-1 rounded-lg text-sm transition ${
                  filter === "approved"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setFilter("rejected")}
                className={`px-3 py-1 rounded-lg text-sm transition ${
                  filter === "rejected"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
              {uniqueYears.map((year) => (
                <option key={year} value={year}>
                  Year {year}
                </option>
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
              {uniqueSections.map((section) => (
                <option key={section} value={section}>
                  Section {section}
                </option>
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
            {
              leaves.filter((l) =>
                userRole === "advisor" ? l.advisor_approval === "Pending" : l.hod_approval === "Pending"
              ).length
            }
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow border border-green-200">
          <p className="text-green-800 text-sm">Approved</p>
          <p className="text-2xl font-bold text-green-800">
            {
              leaves.filter((l) =>
                userRole === "advisor" ? l.advisor_approval === "Approved" : l.hod_approval === "Approved"
              ).length
            }
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow border border-red-200">
          <p className="text-red-800 text-sm">Rejected</p>
          <p className="text-2xl font-bold text-red-800">
            {
              leaves.filter((l) =>
                userRole === "advisor" ? l.advisor_approval === "Rejected" : l.hod_approval === "Rejected"
              ).length
            }
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
          filteredLeaves.map((leave) => {
            const relevantStatus =
              userRole === "advisor" ? leave.advisor_approval : leave.hod_approval;
            const canApprove =
              (userRole === "advisor" && leave.advisor_approval === "Pending") ||
              (userRole === "hod" &&
                leave.hod_approval === "Pending" &&
                leave.advisor_approval === "Approved");

            return (
              <div
                key={leave._id}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-200 border border-gray-100"
              >
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
                          <p className="text-sm text-gray-600 col-span-2">
                            Branch: {leave.student.branch}
                          </p>
                          {leave.advisor && userRole === "hod" && (
                            <p className="text-sm text-gray-600 col-span-2">
                              Advisor: {leave.advisor.name}
                            </p>
                          )}
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

                    {/* Progress Steps */}
                    {getProgressSteps(leave)}

                    {/* Remarks Display */}
                    {leave.advisor_remarks && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                        <p className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Advisor Remarks:
                        </p>
                        <p className="text-sm text-blue-800">{leave.advisor_remarks}</p>
                      </div>
                    )}

                    {leave.hod_remarks && (
                      <div className="mt-3 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                        <p className="text-sm font-semibold text-purple-900 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          HoD Remarks:
                        </p>
                        <p className="text-sm text-purple-800">{leave.hod_remarks}</p>
                      </div>
                    )}
                  </div>

                  {/* Approval Section */}
                  <div className="flex flex-col gap-4 lg:w-72">
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Advisor Approval {userRole === "advisor" && "(You)"}
                        </p>
                        {getStatusBadge(leave.advisor_approval)}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          HOD Approval {userRole === "hod" && "(You)"}
                        </p>
                        {getStatusBadge(leave.hod_approval)}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Overall Status</p>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                          {leave.overall_status}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {canApprove && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => openRemarksModal(leave._id, "Approved")}
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => openRemarksModal(leave._id, "Rejected")}
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    Applied on: {new Date(leave.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Remarks Modal */}
      {remarksModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {remarksModal.action} Duty Leave
            </h3>
            <p className="text-gray-600 mb-4">
              Please provide remarks for your decision (optional):
            </p>
            <textarea
              value={remarksModal.remarks}
              onChange={(e) =>
                setRemarksModal({ ...remarksModal, remarks: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4"
              placeholder="Enter your remarks here..."
            />
            <div className="flex gap-3">
              <button
                onClick={closeRemarksModal}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleApproval}
                className={`flex-1 px-4 py-2 rounded-lg transition font-semibold text-white ${
                  remarksModal.action === "Approved"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Confirm {remarksModal.action}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}