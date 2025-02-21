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
        const response = await fetch("https://cloud.event-reg.publicvm.com/api/user-profile", {
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
      await fetch("https://cloud.event-reg.publicvm.com/api/logout", {
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
          
          {isLoggedIn && (
            <Link href="/create" className="text-gray-600 hover:text-primary">
              Create Event
            </Link>
          )}
        </nav>

        {/* Auth Buttons */}
        <div className="flex space-x-2">
          {isLoggedIn ? (
            <>
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                <User className="w-4 h-4 mr-1" />
                Dashboard
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
