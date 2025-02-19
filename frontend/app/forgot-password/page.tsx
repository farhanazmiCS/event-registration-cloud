"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Failed to send reset code");

      setMessage("A password reset code has been sent to your email.");

      // ✅ Redirect user to Reset Password page, passing the username
      setTimeout(() => {
        router.push(`/reset-password?username=${encodeURIComponent(username)}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>
        <form onSubmit={handleForgotPassword} className="space-y-4">
          {error && <p className="text-red-500 text-center">{error}</p>}
          {message && <p className="text-green-500 text-center">{message}</p>}
          <input
            type="text"
            placeholder="Enter your username or email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Send Reset Code
          </button>
        </form>
      </div>
    </div>
  );
}
