export const getToken = () => localStorage.getItem("token");
export const getRole = () => localStorage.getItem("role");
export const isApproved = () => localStorage.getItem("is_approved") === "true";

export const setAuthData = ({ token, role, is_approved }) => {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
  localStorage.setItem("is_approved", is_approved);
};

export const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const clearUser = () => {
  localStorage.removeItem("user");
};

export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("is_approved");
  localStorage.removeItem("user");
};

export const logoutUser = () => {
  clearAuthData();
  window.location.href = "/login"; 
};