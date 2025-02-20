import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link"; // Import Link for navigation
import { Event } from "../../lib/event_api"; // Fixed double slash

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
        <p className="text-gray-600 mb-2">
          Date: {new Date(event.start_time).toLocaleDateString()} -{" "}
          {new Date(event.end_time).toLocaleDateString()}
        </p>
        <p className="text-gray-600 mb-2">Location: {event.location}</p>
        <p className="text-gray-600">Price: ${event.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4">
        <Link href={`/events/${event.id}`}>
          <Button className="w-full">More Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
