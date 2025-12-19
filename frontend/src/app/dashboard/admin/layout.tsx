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
import { withAuth } from "@/lib/withAuth";

interface LayoutProps {
  children: ReactNode;
}

interface Event {
  _id?: string;
  title: string;
  date: string;
  description?: string;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    description: "",
  });

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/events", {
          withCredentials: true,
        });
        if (res.data.success) setEvents(res.data.events);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.date) return;
    try {
      const res = await axios.post("http://localhost:5000/api/events", newEvent, {
        withCredentials: true,
      });
      if (res.data.success) {
        setEvents([...events, res.data.event]);
        setNewEvent({ title: "", date: "", description: "" });
      }
    } catch (err) {
      console.error("Error adding event:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      localStorage.clear();
      router.push("/login");
    }
  };

  return withAuth({
    allowedRoles: ["admin"], // 🔐 ADMIN ONLY
    children: (
      <div className="h-screen flex bg-[#F7F8FA]">
        {/* Sidebar */}
        <aside
          className="transition-all duration-300 flex flex-col justify-between bg-white border-r border-gray-200"
          style={{ width: isSidebarOpen ? "16rem" : "5rem" }}
        >
          <div>
            <div className="flex items-center justify-between px-4 py-4 border-b">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.png" alt="logo" width={36} height={36} />
                {isSidebarOpen && (
                  <span className="font-semibold text-gray-700 text-sm">
                    TheGenconians-GMS
                  </span>
                )}
              </Link>
              <button onClick={toggleSidebar}>
                {isSidebarOpen ? "‹" : "›"}
              </button>
            </div>

            <nav className="mt-6">
              {[
                { icon: <FaTachometerAlt />, label: "Dashboard", href: "/dashboard/admin" },
                { icon: <FaUsers />, label: "Users", href: "/dashboard/admin/users" },
                { icon: <FaProjectDiagram />, label: "Projects", href: "/dashboard/admin/projects" },
                { icon: <FaChartPie />, label: "Reports", href: "/dashboard/admin/reports" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 mx-2 my-1 rounded-lg hover:bg-gray-100"
                >
                  {item.icon}
                  {isSidebarOpen && <span>{item.label}</span>}
                </Link>
              ))}
            </nav>
          </div>

          <div className="border-t p-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full hover:text-red-500"
            >
              <FaSignOutAlt />
              {isSidebarOpen && "Logout"}
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col">
          <header className="px-6 py-4 bg-white border-b shadow-sm">
            <h1 className="font-semibold">Welcome, Admin</h1>
          </header>

          <section className="flex-1 p-6 overflow-y-auto">{children}</section>

          <footer className="border-t p-4 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} TheGenconians-GMS
          </footer>
        </main>
      </div>
    ),
  });
}
