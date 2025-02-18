"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

export default function CreateEvent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    start_time: "",
    end_time: "",
    price: 0,
    max_attendees: 0,
    organizer_cognito_sub: "org-12345", // Placeholder, replace with actual user info if needed
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/"); // Redirect to homepage after successful creation
      } else {
        console.error("Failed to create event");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Create New Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
          <Input id="title" name="title" placeholder="Event Title" value={formData.title} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Event Description</label>
          <Textarea id="description" name="description" placeholder="Event Description" value={formData.description} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
          <Input id="location" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">Start Time</label>
          <Input type="datetime-local" id="start_time" name="start_time" value={formData.start_time} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">End Time</label>
          <Input type="datetime-local" id="end_time" name="end_time" value={formData.end_time} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
          <Input type="number" id="price" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="max_attendees" className="block text-sm font-medium text-gray-700">Maximum Attendees</label>
          <Input type="number" id="max_attendees" name="max_attendees" placeholder="Max Attendees" value={formData.max_attendees} onChange={handleChange} required />
        </div>

        <Button type="submit" className="w-full">Create Event</Button>
      </form>
    </div>
  );
}
