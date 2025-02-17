"use client";

import { useEffect, useState } from "react";
import {fetchMyEvents } from "@/lib/myevents_api";
import EventCard from "../components/EventCard";

import { Event } from "../../lib/event_api"; // Reuse the Event interface

export default function MyEvents({ userSub = "org-12345" }) {
  const [myEvents, setMyEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetchMyEvents(userSub).then(setMyEvents);
  }, [userSub]);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Registered Events for {userSub}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myEvents.length === 0 ? (
          <p>No registered events found.</p>
        ) : (
          myEvents.map((event) => <EventCard key={event.id} event={event} />)
        )}
      </div>
    </div>
  );
}
