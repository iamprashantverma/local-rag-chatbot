import api from "../api/axios";

// Login user
export const login = async (credentials) => {
  return api.post("/auth/login", credentials);
};

// Register new user
export const signup = async (formData) => {
  return api.post("/auth/signup", formData);
};
