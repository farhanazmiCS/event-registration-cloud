"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("access_token")

    if (!token) {
      // If no token, redirect to login
      router.push("/login")
    } else {
      // If token exists, allow access
      setIsAuthenticated(true)
    }

    setIsLoading(false)
  }, [router])

  if (isLoading) return null // Prevents flicker before redirect

  return isAuthenticated ? <>{children}</> : null
}
