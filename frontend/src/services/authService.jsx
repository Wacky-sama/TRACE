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

/**
 * Check if an email is available for registration
 * @param {string} email - The email to check
 * @returns {Promise<{available: boolean, message: string}>}
 */
export const checkEmailAvailability = async (email) => {
  try {
    const response = await publicApi.post("/users/check-email", {
      email: email.trim(),
    });
    return response.data;
  } catch (error) {
    console.error("Error checking email:", error);
    throw error;
  }
};

// You can add other public auth-related functions here later
// export const login = async (credentials) => { ... }
// export const register = async (userData) => { ... }