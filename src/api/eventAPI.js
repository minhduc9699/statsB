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
  getMatchEvents: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/matches/${id}/events`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching match with ID ${id}:`, error);
      throw error;
    }
  },
};

export default eventAPI;
