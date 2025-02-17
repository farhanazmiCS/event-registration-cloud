import { Event } from "./event_api"; // Import Event interface

export const fetchMyEvents = async (userSub: string = "org-12345"): Promise<Event[]> => {
    try {
      const response = await fetch(`http://localhost:8080/my-events?user_sub=${encodeURIComponent(userSub)}`);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch registered events. Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (!Array.isArray(data.events)) {
        throw new Error("Invalid data format received from API.");
      }
  
      return data.events as Event[];
    } catch (error) {
      console.error("Error fetching registered events:", error);
      return [];
    }
  };
  