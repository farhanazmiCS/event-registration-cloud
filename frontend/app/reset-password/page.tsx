"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [confirmationCode, setConfirmationCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);
  
    try {
      const response = await fetch("https://cloud.event-reg.publicvm.com/api/confirm-forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,  // ✅ Now sending "username" instead of "email"
          confirmation_code: confirmationCode,
          new_password: newPassword,
        }),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Failed to reset password");
  
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl">Reset password</CardTitle>
          <CardDescription>Enter your email, confirmation code, and new password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Email</div>
              <Input
                type="email"
                placeholder="Enter your email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Confirmation Code</div>
              <Input
                type="text"
                placeholder="Enter the confirmation code"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">New Password</div>
              <Input
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {error && <div className="text-sm text-red-500 text-center">{error}</div>}
            {message && <div className="text-sm text-green-500 text-center">{message}</div>}

            <Button type="submit" className="w-full bg-black hover:bg-black/90" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
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

