"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");  // ✅ Define username state
  const [confirmationCode, setConfirmationCode] = useState("");  // ✅ Define confirmationCode state
  const [newPassword, setNewPassword] = useState("");  // ✅ Define newPassword state
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch("http://localhost:8000/api/confirm-forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: username,  // ✅ Ensure field name matches backend
          confirmation_code: confirmationCode,  // ✅ Ensure field name matches backend
          new_password: newPassword,  // ✅ Ensure field name matches backend
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Failed to reset password");

      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>
        <form onSubmit={handleResetPassword} className="space-y-4">
          {error && <p className="text-red-500 text-center">{error}</p>}
          {message && <p className="text-green-500 text-center">{message}</p>}
          
          <input
            type="text"
            placeholder="Enter your email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            placeholder="Enter the confirmation code"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="password"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />

          <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
