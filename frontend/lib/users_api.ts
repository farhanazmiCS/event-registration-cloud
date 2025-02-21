export const fetchUsers = async () => {
    try {
      const response = await fetch("https://cloud.event-reg.publicvm.com/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      return data.users;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };
  