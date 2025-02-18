"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Header() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check token on mount
    const checkAuth = () => {
      const token = localStorage.getItem("access_token")
      setIsLoggedIn(!!token) // Convert token existence to boolean
    }

    checkAuth() // Run on first mount

    // Listen for storage changes (for login/logout updates)
    window.addEventListener("storage", checkAuth)

    return () => {
      window.removeEventListener("storage", checkAuth)
    }
  }, [])

  const handleLogin = () => {
    router.push("/login")
  }

  const handleLogout = () => {
    // Clear tokens
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("id_token")

    // Update state
    setIsLoggedIn(false)

    // Notify other tabs of logout
    window.dispatchEvent(new Event("storage"))

    // Redirect to login
    router.push("/login")
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-primary">
          EventHub
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-4">
          <Link href="/events" className="text-gray-600 hover:text-primary">
            Events
          </Link>
          <Link href="/create" className="text-gray-600 hover:text-primary">
            Create Event
          </Link>
          <>
              <Link href="/myevents" className="text-gray-600 hover:text-primary">
                My Events
              </Link>
              <Link href="/createdevents" className="text-gray-600 hover:text-primary">
                Created Events
              </Link>
            </>
          {/* {isLoggedIn && (
            <>
              <Link href="/myevents" className="text-gray-600 hover:text-primary">
                My Events
              </Link>
              <Link href="/createdevents" className="text-gray-600 hover:text-primary">
                Created Events
              </Link>
            </>
          )} */}
           
        </nav>

        {/* Auth Buttons */}
        <div className="flex space-x-2">
          {isLoggedIn ? (
            <Button variant="outline" onClick={handleLogout}>
              Log Out
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleLogin}>
                Log In
              </Button>
              <Button>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
