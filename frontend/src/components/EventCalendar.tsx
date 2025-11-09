"use client";

import Image from "next/image";
import { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

export type EventData = {
  _id: string;
  title: string;
  date: string; // ISO string from backend
  description?: string;
};

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const EventCalendar = ({ events }: { events: EventData[] }) => {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div className="bg-white p-4 rounded-md">
      {/* Calendar */}
      <Calendar onChange={onChange} value={value} />

      {/* Header */}
      <div className="flex items-center justify-between mt-4 mb-2">
        <h1 className="text-xl font-semibold">Events</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>

      {/* Event List */}
      <div className="flex flex-col gap-4">
        {events.length ? (
          events.map(event => (
            <div
              key={event._id}
              className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-MyYellow even:border-t-MyPurple"
            >
              <div className="flex items-center justify-between">
                <h1 className="font-semibold text-gray-600">{event.title}</h1>
                <span className="text-gray-300 text-xs">
                  {new Date(event.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              {event.description && (
                <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No upcoming events.</p>
        )}
      </div>
    </div>
  );
};

export default EventCalendar;