export const getToken = () => localStorage.getItem("token");
export const getRole = () => localStorage.getItem("role");
export const isApproved = () => localStorage.getItem("is_approved") === "true";

export const setAuthData = ({ token, role, is_approved }) => {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
  localStorage.setItem("is_approved", is_approved);
};

export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("is_approved");
};