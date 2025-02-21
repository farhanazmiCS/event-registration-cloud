"use client";

import { useEffect, useState } from "react";
import { Event, fetchEvents} from "../lib/event_api";
import EventCard from "./components/EventCard";

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchEvents().then(setEvents);
  }, []);

  // Filter events based on search query (location/title)
  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Browse Events</h1>

      {/* Search Filter */}
      <input
        type="text"
        placeholder="Search events by title or location..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length === 0 ? (
          <p>No events match your search.</p>
        ) : (
          filteredEvents.map((event) => <EventCard key={event.id} event={event} />)
        )}
      </div>
    </div>
  );
}
