"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchEvents, Event } from "@/lib/event_api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Fetch the event details based on ID
async function getEventById(id: number): Promise<Event | null> {
  try {
    const events = await fetchEvents();
    return events.find((event) => event.id === id) || null;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [isEventLoading, setIsEventLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!params.id) return;

      setIsEventLoading(true);
      const eventData = await getEventById(Number(params.id));
      setEvent(eventData);
      setIsEventLoading(false);
    };

    fetchEvent();
  }, [params.id]);

  const handlePayment = async () => {
    if (!event) return;

    setIsLoading(true);
    setError("");

    try {
        const response = await fetch("http://localhost:8000/api/payments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                event_id: event.id,
                amount: event.price,
                card_number: cardNumber,
                expiry_date: expiry,
                cvv: cvv,
            }),
          });
      
          const data = await response.json();
      
          if (!response.ok) {
              console.error("Payment error:", data);
              const errorMessage = Array.isArray(data.detail)
                ? data.detail.map((d: { msg: string }) => d.msg).join(", ")
                : data.detail;
              throw new Error(errorMessage || "Payment failed");
          }
      
          alert("Payment successful!");
          router.push("/dashboard");
    } catch (error) {
        if (error instanceof Error) {
            setError(error.message);
        } else {
            setError("Failed to process payment. Please try again.");
        }
    } finally {
        setIsLoading(false);
    }
  };

  if (isEventLoading) return <p>Loading event details...</p>;
  if (!event) return <p>Event not found.</p>;

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Payment for {event.title}</h1>
      <p className="mb-4">Amount: ${event.price.toFixed(2)}</p>

      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-2">
        <Label htmlFor="card">Card Number</Label>
        <Input id="card" type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required />

        <Label htmlFor="expiry">Expiry Date (MM/YY)</Label>
        <Input id="expiry" type="text" value={expiry} onChange={(e) => setExpiry(e.target.value)} required />

        <Label htmlFor="cvv">CVV</Label>
        <Input id="cvv" type="text" value={cvv} onChange={(e) => setCvv(e.target.value)} required />
      </div>

      <Button onClick={handlePayment} disabled={isLoading} className="mt-4 w-full">
        {isLoading ? "Processing..." : "Pay Now"}
      </Button>
    </div>
  );
}
