

// "use client";

// import React, { ReactNode, useState } from "react";
// import Link from "next/link";
// import { FaTachometerAlt, FaUsers, FaProjectDiagram, FaChartPie, FaSignOutAlt, FaPlus } from "react-icons/fa";

// interface LayoutProps {
//   children: ReactNode;
// }

// interface Event {
//   id: number;
//   title: string;
//   date: string;
//   description: string;
// }

// const Layout = ({ children }: LayoutProps) => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [events, setEvents] = useState<Event[]>([
//     { id: 1, title: "Orientation Day", date: "2025-09-10", description: "Welcome new students to the campus." },
//     { id: 2, title: "Tech Workshop", date: "2025-09-15", description: "Hands-on AI & ML workshop for students." },
//   ]);

//   const [newEvent, setNewEvent] = useState({ title: "", date: "", description: "" });

//   const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

//   const handleAddEvent = () => {
//     if (newEvent.title && newEvent.date) {
//       const id = events.length ? events[events.length - 1].id + 1 : 1;
//       setEvents([...events, { id, ...newEvent }]);
//       setNewEvent({ title: "", date: "", description: "" });
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside
//         className={`bg-gray-800 text-white transition-all duration-300 ${
//           isSidebarOpen ? "w-64" : "w-20"
//         } flex flex-col`}
//       >
//         <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
//           <span className={`${isSidebarOpen ? "text-xl" : "text-2xl"} font-bold`}>
//             {isSidebarOpen ? "Admin Dashboard" : "AD"}
//           </span>
//           <button
//             className="text-gray-300 focus:outline-none"
//             onClick={toggleSidebar}
//           >
//             {isSidebarOpen ? "<" : ">"}
//           </button>
//         </div>

//         <nav className="flex-1 mt-4">
//           <ul>
//             <li>
//               <Link
//                 href="/dashboard"
//                 className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors"
//               >
//                 <FaTachometerAlt className="mr-3" />
//                 {isSidebarOpen && "Dashboard"}
//               </Link>
//             </li>
//             <li>
//               <Link
//                 href="/dashboard/users"
//                 className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors"
//               >
//                 <FaUsers className="mr-3" />
//                 {isSidebarOpen && "Users"}
//               </Link>
//             </li>
//             <li>
//               <Link
//                 href="/dashboard/projects"
//                 className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors"
//               >
//                 <FaProjectDiagram className="mr-3" />
//                 {isSidebarOpen && "Projects"}
//               </Link>
//             </li>
//             <li>
//               <Link
//                 href="/dashboard/reports"
//                 className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors"
//               >
//                 <FaChartPie className="mr-3" />
//                 {isSidebarOpen && "Reports"}
//               </Link>
//             </li>
//           </ul>
//         </nav>

//         <div className="px-4 py-4 border-t border-gray-700">
//           <button className="flex items-center w-full hover:bg-gray-700 px-4 py-2 rounded">
//             <FaSignOutAlt className="mr-3" />
//             {isSidebarOpen && "Logout"}
//           </button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 overflow-auto">
//         {/* Top Navbar */}
//         <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
//           <h1 className="text-2xl font-bold">Welcome, Admin</h1>
//           <div className="flex items-center space-x-4">
//             <span className="text-gray-700">Admin Name</span>
//             <img
//               src="/avatar.png"
//               alt="Profile"
//               className="w-10 h-10 rounded-full border border-gray-300"
//             />
//           </div>
//         </header>

//         {/* Page Content */}
//         <section className="p-6 space-y-6">
//           {children}

//           {/* Recent Events Section */}
//           <div className="bg-white shadow rounded p-6">
//             <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
//               Recent Events
//               <button
//                 onClick={handleAddEvent}
//                 className="flex items-center bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
//               >
//                 <FaPlus className="mr-2" /> Add Event
//               </button>
//             </h2>

//             {/* New Event Form */}
//             <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
//               <input
//                 type="text"
//                 placeholder="Event Title"
//                 className="border p-2 rounded w-full"
//                 value={newEvent.title}
//                 onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
//               />
//               <input
//                 type="date"
//                 className="border p-2 rounded w-full"
//                 value={newEvent.date}
//                 onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
//               />
//               <input
//                 type="text"
//                 placeholder="Description"
//                 className="border p-2 rounded w-full"
//                 value={newEvent.description}
//                 onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
//               />
//             </div>

//             {/* Event List */}
//             <ul className="space-y-2">
//               {events.map((event) => (
//                 <li key={event.id} className="border p-3 rounded hover:bg-gray-50 transition">
//                   <h3 className="font-semibold">{event.title}</h3>
//                   <p className="text-gray-500 text-sm">{event.date}</p>
//                   {event.description && <p className="text-gray-700">{event.description}</p>}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default Layout;



"use client";

import React, { ReactNode, useState } from "react";
import Link from "next/link";
import { FaTachometerAlt, FaUsers, FaProjectDiagram, FaChartPie, FaSignOutAlt, FaPlus } from "react-icons/fa";

interface LayoutProps {
  children: ReactNode;
}

interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
}

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [events, setEvents] = useState<Event[]>([
    { id: 1, title: "Orientation Day", date: "2025-09-10", description: "Welcome new students to the campus." },
    { id: 2, title: "Tech Workshop", date: "2025-09-15", description: "Hands-on AI & ML workshop for students." },
  ]);

  const [newEvent, setNewEvent] = useState({ title: "", date: "", description: "" });

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date) {
      const id = events.length ? events[events.length - 1].id + 1 : 1;
      setEvents([...events, { id, ...newEvent }]);
      setNewEvent({ title: "", date: "", description: "" });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`transition-all duration-300 flex flex-col shadow-lg`}
        style={{ width: isSidebarOpen ? "16rem" : "4rem", backgroundColor: "#1E293B" }}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          <span className={`${isSidebarOpen ? "text-xl" : "text-2xl"} font-bold text-white`}>
            {isSidebarOpen ? "Admin Panel" : "AP"}
          </span>
          <button onClick={toggleSidebar} className="focus:outline-none text-gray-300">
            {isSidebarOpen ? "<" : ">"}
          </button>
        </div>

        <nav className="flex-1 mt-6">
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
                  className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded-lg mx-2 my-1"
                >
                  {item.icon}
                  {isSidebarOpen && <span className="ml-3">{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="px-4 py-4 border-t border-gray-700">
          <button className="flex items-center w-full px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition">
            <FaSignOutAlt className="mr-3" />
            {isSidebarOpen && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Navbar */}
        <header className="flex items-center justify-between px-6 py-4 shadow bg-white sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-800">Welcome, Admin</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 font-medium">Admin Name</span>
            <img
              src="/avatar.png"
              alt="Profile"
              className="w-10 h-10 rounded-full border border-gray-300"
            />
          </div>
        </header>

        {/* Page Content */}
        <section className="p-6 space-y-6">
          {children}

          {/* Recent Events Section */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Recent Events</h2>
              <button
                onClick={handleAddEvent}
                className="flex items-center px-3 py-1 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-300 text-gray-900 font-medium hover:from-yellow-300 hover:to-yellow-200 transition"
              >
                <FaPlus className="mr-2" /> Add Event
              </button>
            </div>

            {/* New Event Form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <input
                type="text"
                placeholder="Event Title"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
              <input
                type="date"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              />
              <input
                type="text"
                placeholder="Description"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
            </div>

            {/* Event List */}
            <div className="grid md:grid-cols-2 gap-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition bg-gray-50"
                >
                  <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
                  <p className="text-gray-500 text-sm mb-2">{event.date}</p>
                  {event.description && <p className="text-gray-700">{event.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Layout;



