"use client";

import { useEffect, useState } from "react";
// Assumed components/types from your original file
import UserCard from "@/components/UserCard";
import EventCalendar, { EventData } from "@/components/EventCalendar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import axios from "axios";
// Icons for better visual appeal
import { Calendar, CheckSquare, Clock, Trophy } from "lucide-react"; 

// --- Type Definitions (Kept as is) ---
type ProjectData = {
  name: string;
  urn: string;
  projectTitle: string;
  description: string;
  guideName: string;
  status: "ongoing" | "completed";
  projectLink: string;
};

type CertificateData = {
  _id?: string;
  type: string;
  eventName: string;
  date: string;
  fileUrl?: string;
};

type DutyLeave = {
  _id: string;
  advisor_approval: "Pending" | "Approved" | "Rejected";
  event_name: string;
  event_date: string;
};
// --- End Type Definitions ---

const StudentPage = () => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [dutyLeaveSummary, setDutyLeaveSummary] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true); // Added loading state

  // --- Data Fetching Logic (Kept as is) ---
  useEffect(() => {
    const savedProjects = localStorage.getItem("projects");
    if (savedProjects) setProjects(JSON.parse(savedProjects));
  }, []);

  useEffect(() => {
    const fetchCertificates = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/Certificate/me", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (res.data.success) {
          const fetchedCertificates = res.data.data.map((c: any) => ({
            _id: c._id,
            type: c.type.charAt(0).toUpperCase() + c.type.slice(1),
            eventName: c.eventName,
            date: c.date?.split("T")[0] || "",
            fileUrl: c.certificateUrl,
          }));
          setCertificates(fetchedCertificates);
        }
      } catch (err) {
        console.error("Error fetching certificates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/events", {
          withCredentials: true,
        });

        if (res.data.success) {
          const today = new Date();
          const upcomingEvents = res.data.events
            .filter((event: EventData) => new Date(event.date) >= today)
            .sort(
              (a: EventData, b: EventData) =>
                new Date(a.date).getTime() - new Date(b.date).getTime()
            )
            .slice(0, 4);

          setEvents(upcomingEvents);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchDutyLeaves = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/duty-leave/my-leaves",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        if (res.data.success) {
          const leaves: DutyLeave[] = res.data.data;
          const summary = {
            pending: leaves.filter((l) => l.advisor_approval === "Pending").length,
            approved: leaves.filter((l) => l.advisor_approval === "Approved").length,
            rejected: leaves.filter((l) => l.advisor_approval === "Rejected").length,
          };
          setDutyLeaveSummary(summary);
        }
      } catch (err) {
        console.error("Error fetching duty leaves:", err);
      }
    };

    fetchDutyLeaves();
  }, []);
  // --- End Data Fetching Logic ---

  // Enhanced UserCard Mapping with custom colors and icons
  const userCardData = [
    {
      type: "Upcoming Events",
      value: events.length,
      icon: Calendar,
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      iconColor: "text-blue-600",
      valueColor: "text-blue-600",
    },
    {
      type: "Certificates Achieved",
      value: certificates.length,
      icon: Trophy,
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      iconColor: "text-green-600",
      valueColor: "text-green-600",
    },
    {
      type: "Active Projects",
      value: projects.length,
      icon: CheckSquare,
      bgColor: "bg-purple-100",
      textColor: "text-purple-800",
      iconColor: "text-purple-600",
      valueColor: "text-purple-600",
    },
    {
      type: "Duty Leaves",
      value: `${dutyLeaveSummary.pending} Pending, ${dutyLeaveSummary.approved} Approved`,
      icon: Clock,
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      iconColor: "text-yellow-600",
      valueColor: "text-yellow-800",
    },
  ];

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6 border-b-2 border-blue-500 pb-1 inline-block">
        📚 Student Dashboard
      </h1>
      
      <div className="flex gap-6 flex-col lg:flex-row">
        {/* LEFT SECTION (Main Content) */}
        <div className="w-full lg:w-2/3 space-y-6">
          
          {/* 1. USER STATS CARDS (2x2 Matrix) */}
          {/* Use grid-cols-2 for all screen sizes (sm and up) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userCardData.map((card, index) => (
              <div
                key={index}
                // Reduced padding (p-4) and size (text-3xl) for a compact look
                className={`p-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl ${card.bgColor} flex flex-col justify-between transform hover:scale-[1.03]`}
              >
                <div className={`flex items-center justify-between mb-3`}>
                  <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                  {/* Reduced font size for type */}
                  <p className={`text-sm font-semibold ${card.textColor} text-right`}>{card.type}</p>
                </div>
                {/* Reduced font size for value */}
                <p className={`text-3xl font-bold ${card.valueColor}`}>
                  {typeof card.value === 'number' ? card.value : (
                    <>
                      <span className="text-blue-600">{dutyLeaveSummary.pending}</span> Pending
                      <span className="text-gray-500 mx-1">/</span>
                      <span className="text-green-600">{dutyLeaveSummary.approved}</span> Approved
                    </>
                  )}
                </p>
              </div>
            ))}
          </div>

          {/* 2. UNIVERSITY CAROUSEL */}
          {/* Reduced padding (p-4) and height (h-72) */}
          <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Campus Highlights</h2>
            <Carousel className="w-full relative">
              <CarouselContent className="-ml-2">
                <CarouselItem className="pl-2">
                  <div className="rounded-xl h-72 flex items-center justify-center w-full overflow-hidden shadow-md">
                    <img
                      src="/gndec1.jpeg"
                      alt="Slide 1"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem className="pl-2">
                  <div className="rounded-xl h-72 flex items-center justify-center w-full overflow-hidden shadow-md">
                    <img
                      src="/gndec2.jpeg"
                      alt="Slide 2"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem className="pl-2">
                  <div className="rounded-xl h-72 flex items-center justify-center w-full overflow-hidden shadow-md">
                    <img
                      src="/gndec3.jpg"
                      alt="Slide 3"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                </CarouselItem>
              </CarouselContent>
              {/* Simplified Carousel Navigation */}
              <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8" />
              <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8" />
            </Carousel>
          </div>
        </div>

        {/* RIGHT SECTION (Calendar/Events) */}
        <div className="w-full lg:w-1/3 flex flex-col space-y-6">
          {/* 3. EVENT CALENDAR */}
          {/* Reduced padding (p-4) and shadow */}
          <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-3 border-b pb-1 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-red-500" /> Upcoming Events
            </h2>
            <EventCalendar events={events} />
            {events.length === 0 && (
                <p className="text-center text-gray-500 mt-3 p-3 text-sm bg-gray-50 rounded-lg">
                    No upcoming events scheduled.
                </p>
            )}
          </div>

          {/* Optional: Quick Access Links / Tips Card */}
          {/* Reduced padding (p-4) and font size */}
          
        </div>
      </div>
    </div>
  );
};

export default StudentPage;