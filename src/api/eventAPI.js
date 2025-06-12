import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const eventAPI = {
  createEvent: async (matchId,eventData) => {
    try {
      const response = await axios.post(`${BASE_URL}/matches/${matchId}/events`, eventData);
      return response.data;
    } catch (error) {
      console.error("Error creating match:", error);
      throw error;
    }
  },
};

export default eventAPI;
