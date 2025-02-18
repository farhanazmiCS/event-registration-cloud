export const fetchCreatedEvents = async (): Promise<Event[]> => {
  try {
    const response = await fetch("http://localhost:8000/createdevents", {
      method: "GET",
      credentials: "include", // ✅ Ensures cookies are sent with request
    });

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
    const response = await fetch(`http://localhost:8000/events/${eventId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // ✅ Ensures cookies are sent with request
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
    const response = await fetch(`http://localhost:8000/events/${eventId}`, {
      method: "DELETE",
      credentials: "include", // ✅ Ensures cookies are sent with request
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
    const response = await fetch(`http://localhost:8000/events/${eventId}`, {
      method: "GET",
      credentials: "include", // ✅ Ensures cookies are sent with request
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch event. Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
};
