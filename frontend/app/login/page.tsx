// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { AlertCircle } from "lucide-react"
// import { Alert, AlertDescription } from "@/components/ui/alert"

// export default function LoginPage() {
//   const router = useRouter()
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [error, setError] = useState("")
//   const [isLoading, setIsLoading] = useState(false)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError("")
//     setIsLoading(true)
  
//     try {
//       const response = await fetch("http://localhost:8000/api/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       })
  
//       const data = await response.json()
  
//       if (!response.ok) {
//         throw new Error(data.detail || "Failed to login")
//       }
  
//       // Store tokens in local storage or cookies
//       localStorage.setItem("access_token", data.access_token)
//       localStorage.setItem("refresh_token", data.refresh_token)
//       localStorage.setItem("id_token", data.id_token)
  
//       router.push("/dashboard")  // Redirect on successful login
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Invalid email or password")
//     } finally {
//       setIsLoading(false)
//     }
//   }  

//   const fetchUserData = async () => {
//     const token = localStorage.getItem("access_token")
//     if (!token) {
//       console.error("No access token found")
//       return
//     }
  
//     const response = await fetch("http://localhost:8000/api/protected", {
//       method: "GET",
//       headers: {
//         "Authorization": `Bearer ${token}`
//       }
//     })
  
//     if (response.ok) {
//       const data = await response.json()
//       console.log("User data:", data)
//     } else {
//       console.error("Unauthorized request")
//     }
//   }
  

//   const handleLogout = () => {
//     localStorage.removeItem("access_token")
//     localStorage.removeItem("refresh_token")
//     localStorage.removeItem("id_token")
//     router.push("/login")  // Redirect to login
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <Card className="w-full max-w-md">
//         <CardHeader className="space-y-1">
//           <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
//           <CardDescription className="text-center">
//             Enter your email and password to access your account
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {error && (
//               <Alert variant="destructive">
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             )}
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="you@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <Label htmlFor="password">Password</Label>
//                 <Link href="/forgot-password" className="text-sm text-primary hover:text-primary/90">
//                   Forgot password?
//                 </Link>
//               </div>
//               <Input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//             <Button type="submit" className="w-full" disabled={isLoading}>
//               {isLoading ? "Signing in..." : "Sign in"}
//             </Button>
//             <div className="text-center text-sm">
//               Don&apos;t have an account?{" "}
//               <Link href="/signup" className="text-primary hover:text-primary/90">
//                 Sign up
//               </Link>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (token) {
      router.push("/dashboard") // Redirect if already logged in
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
  
    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })
  
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || "Failed to login")
  
      // Store tokens
      localStorage.setItem("access_token", data.access_token)
      localStorage.setItem("refresh_token", data.refresh_token)
      localStorage.setItem("id_token", data.id_token)
  
      // Notify header of login state change
      window.dispatchEvent(new Event("storage"))
  
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  const refreshAccessToken = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: localStorage.getItem("refresh_token") }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error("Session expired. Please log in again.")

      localStorage.setItem("access_token", data.access_token)
    } catch {
      handleLogout() // Logout if refresh fails
    }
  }

  const fetchUserData = async () => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      console.error("No access token found")
      return
    }

    const response = await fetch("http://localhost:8000/api/protected", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })

    if (response.status === 401) {
      await refreshAccessToken() // Refresh token if unauthorized
      return fetchUserData() // Retry after refresh
    }

    if (response.ok) {
      const data = await response.json()
      console.log("User data:", data)
    } else {
      console.error("Unauthorized request")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("id_token")
    router.push("/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:text-primary/90">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:text-primary/90">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
