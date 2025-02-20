"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignupPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [birthdate, setBirthdate] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [familyName, setFamilyName] = useState("")
  const [middleName, setMiddleName] = useState("")
  const [fullName, setFullName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Function to format phone number correctly
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s+/g, "").replace(/[^0-9+]/g, "") // Remove spaces and invalid characters
    
    if (!value.startsWith("+")) {
      value = "+65" + value // Ensure it starts with country code (Default to Singapore)
    }

    setPhoneNumber(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
  
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }
  
    try {
      const response = await fetch("http://localhost:8000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          birthdate,
          phone_number: phoneNumber,
          email,
          family_name: familyName,
          middle_name: middleName,
          name: fullName,
          password,
        }),
      })
  
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || "Signup failed")
  
      alert("Signup successful! Please check your email for the confirmation code." + 
        " An email from AWS has also been sent to you. Please follow the instructions if you wish to receive email notifications.")
      router.push("/confirm") // ✅ Redirect user to confirmation page
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed")
    } finally {
      setIsLoading(false)
    }
  }
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign up</CardTitle>
          <CardDescription className="text-center">
            Create a new account.
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
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthdate">Birthdate</Label>
              <Input id="birthdate" type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+65XXXXXXXX" value={phoneNumber} onChange={handlePhoneChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="familyName">Family Name</Label>
              <Input id="familyName" type="text" value={familyName} onChange={(e) => setFamilyName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input id="middleName" type="text" value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Name</Label>
              <Input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing up..." : "Sign up"}
            </Button>
            <div className="text-center text-sm">
              Have an account already?{" "}
              <Link href="/login" className="text-primary hover:text-primary/90">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
