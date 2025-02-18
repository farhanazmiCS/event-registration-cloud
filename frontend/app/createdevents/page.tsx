"use client";

import { useEffect, useState } from "react";
import { fetchCreatedEvents, deleteEvent } from "../../lib/createdevents_api";
import { useRouter } from "next/navigation";
import EventCard from "../components/EventCard";
import { Pencil, Trash } from "lucide-react";
import { Event } from "../../lib/event_api";

export default function CreatedEvents() {
    const [events, setEvents] = useState<Event[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetchCreatedEvents().then(setEvents);
    }, []);

    const handleDelete = async (eventId: number) => {
        if (confirm("Are you sure you want to delete this event?")) {
            await deleteEvent(eventId);
            setEvents(events.filter((event) => event.id !== eventId));
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h1 className="text-4xl font-bold mb-8">My Created Events</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.length === 0 ? (
                    <p>You haven't created any events.</p>
                ) : (
                    events.map((event) => (
                        <div key={event.id} className="relative">
                            <EventCard event={event} />
                            <div className="absolute top-2 right-2 flex space-x-2">
                                {/* Edit Button */}
                                <button onClick={() => router.push(`/edit/${event.id}`)} className="bg-yellow-500 p-2 rounded">
                                    <Pencil size={16} />
                                </button>

                                {/* Delete Button */}
                                <button onClick={() => handleDelete(event.id)} className="bg-red-500 p-2 rounded">
                                    <Trash size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
