"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ConfirmSignupPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [confirmationCode, setConfirmationCode] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [resendMessage, setResendMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("https://cloud.event-reg.publicvm.com/api/confirm-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, confirmation_code: confirmationCode }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || "Confirmation failed")

      alert("Account confirmed successfully! You can now log in.")
      router.push("/login") // Redirect to login page
    } catch (err) {
      setError(err instanceof Error ? err.message : "Confirmation failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setResendMessage("")
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("https://cloud.event-reg.publicvm.com/api/resend-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || "Resend failed")

      setResendMessage("A new confirmation code has been sent to your email.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Resend failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Confirm Your Account</CardTitle>
          <CardDescription className="text-center">
            Enter the confirmation code sent to your email.
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
            {resendMessage && (
            <Alert variant="default">  {/* Change "success" to "default" */}
                <AlertDescription>{resendMessage}</AlertDescription>
            </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmationCode">Confirmation Code</Label>
              <Input
                id="confirmationCode"
                type="text"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Confirming..." : "Confirm Account"}
            </Button>
            <Button variant="outline" onClick={handleResendCode} className="w-full" disabled={isLoading}>
              {isLoading ? "Resending..." : "Resend Code"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
