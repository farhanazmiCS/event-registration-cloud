import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from "@/components/ui/select"
import EventCard from "./components/EventCard"

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Discover Events Near You</h1>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <Input placeholder="Search events..." className="flex-grow" />
          <Select>
            <option value="">All Categories</option>
            <option value="music">Music</option>
            <option value="sports">Sports</option>
            <option value="arts">Arts</option>
          </Select>
          <Select>
            <option value="">All Locations</option>
            <option value="new-york">New York</option>
            <option value="los-angeles">Los Angeles</option>
            <option value="chicago">Chicago</option>
          </Select>
          <Button>Search</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <EventCard />
        <EventCard />
        <EventCard />
        {/* Add more EventCard components as needed */}
      </div>
    </div>
  )
}

