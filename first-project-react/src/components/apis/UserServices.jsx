import { RequestAPI } from "@/hooks/RequestAPI";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URI;

const getAuthHeaders = (contentType = "application/json") => ({
  Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("accessToken") : ""}`,
  "Content-Type": contentType,
});

const GET_ALL_USERS = () => {
  return RequestAPI("GET", `${API_URL}/api/users`, getAuthHeaders());
};

const CREATE_USER = (payload) => {
  return RequestAPI("POST", `${API_URL}/api/users`, getAuthHeaders(), payload);
};

const UPDATE_USER = (userId, payload) => {
  return RequestAPI("PUT", `${API_URL}/api/users/${userId}`, getAuthHeaders(), payload);
};

const DELETE_USER = (userId) => {
  return RequestAPI("DELETE", `${API_URL}/api/users/${userId}`, getAuthHeaders());
};

const UPDATE_USER_STATUS = (userId, isActive) => {
  return RequestAPI(
    "PATCH",
    `${API_URL}/api/users/${userId}`,
    getAuthHeaders(),
    { is_active: isActive },
  );
};

export { GET_ALL_USERS, CREATE_USER, UPDATE_USER, DELETE_USER, UPDATE_USER_STATUS };
