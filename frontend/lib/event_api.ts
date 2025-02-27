 // Define the Event interface to ensure type safety
 export interface Event {
  id: number;
  organizer_cognito_sub: string;
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
  price: number;
  quantity: number;
  created_at: string;
}

// Fetch events from the FastAPI backend
export const fetchEvents = async (): Promise<Event[]> => {
  try {
    const response = await fetch("https://cloud.event-reg.publicvm.com/events");

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Failed to fetch events. Status: ${response.status}`);
    }

    const data = await response.json();

    // Validate if the response contains the expected 'events' property
    if (!Array.isArray(data.events)) {
      throw new Error("Invalid data format received from API.");
    }

    return data.events as Event[];
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};