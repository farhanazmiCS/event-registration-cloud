import { Event } from "./event_api";

export const fetchMyEvents = async (): Promise<Event[]> => {
  try {
    const response = await fetch("http://localhost:8000/my-events", {
      method: "GET",
      credentials: "include", // ✅ Ensures cookies are sent
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch registered events. Status: ${response.status}`);
    }

    const data = await response.json();
    return data.events as Event[];
  } catch (error) {
    console.error("Error fetching registered events:", error);
    return [];
  }
};
