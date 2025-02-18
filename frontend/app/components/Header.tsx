"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname(); // ✅ Detects route changes
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // ✅ Check authentication status whenever the route changes
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/user-profile", {
          method: "GET",
          credentials: "include", // ✅ Sends cookies automatically
        });

        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, [pathname]); // ✅ Re-run on route change

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        credentials: "include",
      });

      setIsLoggedIn(false);
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

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
          {isLoggedIn && (
            <>
              <Link href="/myevents" className="text-gray-600 hover:text-primary">
                My Events
              </Link>
              <Link href="/createdevents" className="text-gray-600 hover:text-primary">
                Created Events
              </Link>
            </>
          )} 
           
          {isLoggedIn && (
            <Link href="/profile" className="text-gray-600 hover:text-primary flex items-center">
              <User className="w-4 h-4 mr-1" />
              Profile
            </Link>
          )}
        </nav>

        {/* Auth Buttons */}
        <div className="flex space-x-2">
          {isLoggedIn ? (
            <>
              <Button variant="outline" onClick={() => router.push("/profile")}>
                <User className="w-4 h-4 mr-1" />
                Profile
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => router.push("/login")}>
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
  );
}
