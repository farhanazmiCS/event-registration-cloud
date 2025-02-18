// "use client"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"

// export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
//   const router = useRouter()
//   const [isLoading, setIsLoading] = useState(true)
//   const [isAuthenticated, setIsAuthenticated] = useState(false)

//   useEffect(() => {
//     const token = localStorage.getItem("access_token")

//     if (!token) {
//       // If no token, redirect to login
//       router.push("/login")
//     } else {
//       // If token exists, allow access
//       setIsAuthenticated(true)
//     }

//     setIsLoading(false)
//   }, [router])

//   if (isLoading) return null // Prevents flicker before redirect

//   return isAuthenticated ? <>{children}</> : null
// }


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/user-profile", {
          method: "GET",
          credentials: "include", // ✅ Automatically sends cookies
        });

        if (!response.ok) {
          throw new Error("Unauthorized");
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error("User is not authenticated, redirecting to login...");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [router]);

  if (isLoading) return null; // Prevents flicker before redirect

  return isAuthenticated ? <>{children}</> : null;
}
