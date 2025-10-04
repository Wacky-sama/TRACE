import axios from "axios";

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

/**
 * Check if a username is available for registration
 * @param {string} username - The username to check
 * @returns {Promise<{available: boolean, message: string}>}
 */
export const checkUsernameAvailability = async (username) => {
  try {
    const response = await publicApi.post("/users/check-username", {
      username: username.trim(),
    });
    return response.data;
  } catch (error) {
    console.error("Error checking username:", error);
    throw error;
  }
};

// You can add other public auth-related functions here later
// export const login = async (credentials) => { ... }
// export const register = async (userData) => { ... }