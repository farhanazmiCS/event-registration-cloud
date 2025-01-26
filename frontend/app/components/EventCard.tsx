import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function EventCard() {
  return (
    <Card>
      <Image
        src="/placeholder.svg?height=200&width=400"
        alt="Event image"
        width={400}
        height={200}
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-2">Event Title</h2>
        <p className="text-gray-600 mb-2">Date: June 15, 2023</p>
        <p className="text-gray-600 mb-2">Location: New York, NY</p>
        <p className="text-gray-600">Price: $50</p>
      </CardContent>
      <CardFooter className="p-4">
        <Button className="w-full">Book Now</Button>
      </CardFooter>
    </Card>
  )
}

