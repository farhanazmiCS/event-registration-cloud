import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function EventDetails() {
  return (
    <div className="max-w-4xl mx-auto">
      <Image
        src="/placeholder.svg?height=400&width=800"
        alt="Event image"
        width={800}
        height={400}
        className="w-full h-64 object-cover rounded-lg mb-8"
      />
      <h1 className="text-3xl font-bold mb-4">Event Title</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="col-span-2">
          <h2 className="text-xl font-semibold mb-2">About this event</h2>
          <p className="text-gray-600 mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur interdum, nisl
            nunc egestas nunc, euismod aliquam nisl nunc eget nunc.
          </p>
          <h2 className="text-xl font-semibold mb-2">Date and time</h2>
          <p className="text-gray-600 mb-4">June 15, 2023 at 7:00 PM</p>
          <h2 className="text-xl font-semibold mb-2">Location</h2>
          <p className="text-gray-600 mb-4">123 Main St, New York, NY 10001</p>
        </div>
        <div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Tickets</h2>
            <p className="text-gray-600 mb-4">$50.00</p>
            <Button className="w-full mb-2">Book Now</Button>
            <p className="text-sm text-gray-500">100 tickets remaining</p>
          </div>
        </div>
      </div>
    </div>
  )
}

