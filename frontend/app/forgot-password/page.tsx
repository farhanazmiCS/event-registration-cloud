// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function ForgotPasswordPage() {
//   const router = useRouter();
//   const [username, setUsername] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const handleForgotPassword = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");

//     try {
//       const response = await fetch("http://localhost:8000/api/forgot-password", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username }),
//       });

//       const data = await response.json();
//       if (!response.ok) throw new Error(data.detail || "Failed to send reset code");

//       setMessage("A password reset code has been sent to your email.");

//       // ✅ Redirect user to Reset Password page, passing the username
//       setTimeout(() => {
//         router.push(`/reset-password?username=${encodeURIComponent(username)}`);
//       }, 1500);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An error occurred");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="bg-white p-8 rounded-lg shadow-md w-96">
//         <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>
//         <form onSubmit={handleForgotPassword} className="space-y-4">
//           {error && <p className="text-red-500 text-center">{error}</p>}
//           {message && <p className="text-green-500 text-center">{message}</p>}
//           <input
//             type="text"
//             placeholder="Enter your username or email"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//             className="w-full p-2 border rounded"
//           />
//           <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
//             Send Reset Code
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }


"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:8000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || "Failed to send reset code")

      setMessage("A password reset code has been sent to your email.")

      setTimeout(() => {
        router.push(`/reset-password?username=${encodeURIComponent(username)}`)
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl">Forgot password</CardTitle>
          <CardDescription>Enter your username or email and we&apos;ll send you a reset code</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Username or Email</div>
              <Input
                placeholder="Enter your username or email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            {error && <div className="text-sm text-red-500 text-center">{error}</div>}
            {message && <div className="text-sm text-green-500 text-center">{message}</div>}
            <Button type="submit" className="w-full bg-black hover:bg-black/90" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Code"}
            </Button>
            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

