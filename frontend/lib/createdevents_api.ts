import { Event } from "./event_api";

export const fetchCreatedEvents = async (userSub: string = "org-12345"): Promise<Event[]> => {
  try {
    const response = await fetch(`http://localhost:8080/createdevents?user_sub=${encodeURIComponent(userSub)}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch created events. Status: ${response.status}`);
    }

    const data = await response.json();
    return data.events as Event[];
  } catch (error) {
    console.error("Error fetching created events:", error);
    return [];
  }
};

export const updateEvent = async (eventId: number, updatedData: Partial<Event>) => {
    try {
      const response = await fetch(`http://localhost:8080/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update event. Status: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  };
  
  export const deleteEvent = async (eventId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/events/${eventId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error(`Failed to delete event. Status: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  };
  
  export const fetchEventById = async (eventId: string): Promise<Event | null> => {
    try {
      const response = await fetch(`http://localhost:8080/events/${eventId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch event. Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching event:", error);
      return null;
    }
  };