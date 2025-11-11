"use client";

import React, { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaTachometerAlt,
  FaUsers,
  FaProjectDiagram,
  FaChartPie,
  FaSignOutAlt,
  FaPlus,
} from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";

interface LayoutProps {
  children: ReactNode;
}

interface Event {
  _id?: string;
  title: string;
  date: string;
  description?: string;
}

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", description: "" });

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // ✅ Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/events", { withCredentials: true });
        if (res.data.success) setEvents(res.data.events);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  // ✅ Add new event
  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.date) return;
    try {
      const res = await axios.post(
        "http://localhost:5000/api/events",
        newEvent,
        { withCredentials: true }
      );
      if (res.data.success) {
        setEvents([...events, res.data.event]);
        setNewEvent({ title: "", date: "", description: "" });
      }
    } catch (err) {
      console.error("Error adding event:", err);
    }
  };

  // ✅ Logout handler
  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        console.log("Logged out successfully");
        router.push("/");
      } else {
        console.error("Logout failed:", data.message);
        router.push("/");
      }
    } catch (err) {
      console.error("Error logging out:", err);
      router.push("/");
    }
  };

  return (
    <div className="h-screen flex bg-[#F7F8FA]">
      {/* Sidebar */}
      <aside
        className={`transition-all duration-300 flex flex-col justify-between bg-white border-r border-gray-200`}
        style={{ width: isSidebarOpen ? "16rem" : "5rem" }}
      >
        {/* Logo + Toggle */}
        <div>
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="logo" width={36} height={36} />
              {isSidebarOpen && (
                <span className="font-semibold text-gray-700 text-sm">
                  TheGenconians-GMS
                </span>
              )}
            </Link>
            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {isSidebarOpen ? "‹" : "›"}
            </button>
          </div>

          {/* Navigation */}
          <nav className="mt-6">
            <ul>
              {[
                { icon: <FaTachometerAlt />, label: "Dashboard", href: "/dashboard" },
                { icon: <FaUsers />, label: "Users", href: "/dashboard/users" },
                { icon: <FaProjectDiagram />, label: "Projects", href: "/dashboard/projects" },
                { icon: <FaChartPie />, label: "Reports", href: "/dashboard/reports" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#F1F5F9] hover:text-blue-600 rounded-lg mx-2 my-1 transition"
                  >
                    <span className="text-lg">{item.icon}</span>
                    {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* ✅ Logout Button */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full text-gray-700 hover:text-red-500 hover:bg-[#F1F5F9] p-2 rounded-lg transition"
          >
            <FaSignOutAlt className="text-lg" />
            {isSidebarOpen && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Section */}
      <main className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <h1 className="text-lg font-semibold text-gray-800">Welcome, Admin</h1>
          <div className="flex items-center gap-3">
            <span className="text-gray-600 font-medium text-sm">Admin Name</span>
            <img
              src="/avatar.png"
              alt="Profile"
              className="w-9 h-9 rounded-full border border-gray-300"
            />
          </div>
        </header>

        {/* Content */}
        <section className="flex-1 overflow-y-auto p-6 space-y-6">
          {children}

          {/* Recent Events Section (unchanged logic) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-800">Recent Events</h2>
              <button
                onClick={handleAddEvent}
                className="flex items-center px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition text-sm font-medium"
              >
                <FaPlus className="mr-2" /> Add Event
              </button>
            </div>

            {/* Event Form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <input
                type="text"
                placeholder="Event Title"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
              <input
                type="date"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              />
              <input
                type="text"
                placeholder="Description"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
            </div>

            {/* Event List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event) => (
                <div
                  key={event._id || event.title}
                  className="border border-gray-200 rounded-xl p-4 bg-[#F9FAFB] hover:shadow-md transition"
                >
                  <h3 className="text-base font-semibold text-gray-800">{event.title}</h3>
                  <p className="text-sm text-gray-500 mb-1">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                  {event.description && (
                    <p className="text-sm text-gray-600">{event.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 p-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} TheGenconians-GMS. All rights reserved.
        </footer>
      </main>
    </div>
  );
};

export default Layout;
