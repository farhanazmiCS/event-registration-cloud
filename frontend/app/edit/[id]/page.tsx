"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchEventById, updateEvent } from "../../../lib/createdevents_api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Event } from "../../../lib/event_api";


export default function EditEvent() {
  const { id } = useParams();
  const eventId = Array.isArray(id) ? id[0] : id; // Ensure it's a string
  const router = useRouter();
  const [formData, setFormData] = useState<Event | null>(null);

  useEffect(() => {
    if (eventId) {
      fetchEventById(eventId).then(setFormData);
    }
  }, [eventId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      await updateEvent(Number(id), formData);
      router.push("/createdevents"); // Redirect after update
    } catch (error) {
      console.error("Failed to update event", error);
    }
  };

  if (!formData) return <p>Loading event details...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Edit Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
          <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Event Description</label>
          <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
          <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
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
          <Input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Maximum Attendees</label>
          <Input type="number" id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} required />
        </div>

        <Button type="submit" className="w-full">Save Changes</Button>
      </form>
    </div>
  );
}
