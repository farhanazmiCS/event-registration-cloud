import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          EventHub
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Link href="/events" className="text-gray-600 hover:text-primary">
            Events
          </Link>
          <Link href="/create" className="text-gray-600 hover:text-primary">
            Create Event
          </Link>
        </nav>
        <div className="flex space-x-2">
          <Button variant="outline">Log In</Button>
          <Button>Sign Up</Button>
        </div>
      </div>
    </header>
  )
}

