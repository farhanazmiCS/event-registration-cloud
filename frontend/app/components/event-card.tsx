import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Calendar, MapPin } from "lucide-react"

interface Event {
  id: number
  title: string
  description: string
  start_time: string
  end_time: string
  location: string
  price: number
}

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <h3 className="font-semibold text-lg">{event.title}</h3>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-muted-foreground line-clamp-2 mb-4">{event.description}</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <time>{new Date(event.start_time).toLocaleDateString()}</time>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <p className="text-lg font-semibold">${event.price.toFixed(2)}</p>
      </CardFooter>
    </Card>
  )
}

