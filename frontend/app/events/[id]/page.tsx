import { fetchEvents, Event } from "@/lib/event_api";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Fetch the event details based on ID
async function getEventById(id: number): Promise<Event | null> {
  try {
    const events = await fetchEvents();
    return events.find((event) => event.id === id) || null;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}

export default async function EventDetails({ params }: { params: { id: string } }) {
  const event = await getEventById(Number(params.id));

  if (!event) {
    return <p>Event not found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Image
        src="/placeholder.svg?height=400&width=800"
        alt={event.title}
        width={800}
        height={400}
        className="w-full h-64 object-cover rounded-lg mb-8"
      />
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="col-span-2">
          <h2 className="text-xl font-semibold mb-2">About this event</h2>
          <p className="text-gray-600 mb-4">{event.description}</p>

          <h2 className="text-xl font-semibold mb-2">Date and time</h2>
          <p className="text-gray-600 mb-4">
            {new Date(event.start_time).toLocaleString()} -{" "}
            {new Date(event.end_time).toLocaleString()}
          </p>

          <h2 className="text-xl font-semibold mb-2">Location</h2>
          <p className="text-gray-600 mb-4">{event.location}</p>
        </div>

        <div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Tickets</h2>
            <p className="text-gray-600 mb-4">${event.price.toFixed(2)}</p>
            <Button className="w-full mb-2">Book Now</Button>
            <p className="text-sm text-gray-500">
              {event.max_attendees} tickets remaining
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
