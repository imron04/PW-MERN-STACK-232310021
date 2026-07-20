import { RequestAPI } from "@/hooks/RequestAPI";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URI;

const getAuthHeaders = (contentType = "application/json") => ({
  Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("accessToken") : ""}`,
  "Content-Type": contentType,
});

const GET_ALL_BOOK = () => {
  return RequestAPI("GET", `${API_URL}/api/books`, getAuthHeaders());
};

const CREATE_BOOK = (payload) => {
  return RequestAPI(
    "POST",
    `${API_URL}/api/books`,
    getAuthHeaders("multipart/form-data"),
    payload,
  );
};

const GET_BOOK_BY_ID = (book_id) => {
  return RequestAPI("GET", `${API_URL}/api/books/${book_id}`, getAuthHeaders());
};

const UPDATE_BOOK = (book_id, payload) => {
  return RequestAPI(
    "PUT",
    `${API_URL}/api/books/${book_id}`,
    getAuthHeaders("multipart/form-data"),
    payload,
  );
};

const DELETE_BOOK = (book_id) => {
  return RequestAPI(
    "DELETE",
    `${API_URL}/api/books/${book_id}`,
    getAuthHeaders(),
  );
};

export { GET_ALL_BOOK, GET_BOOK_BY_ID, CREATE_BOOK, UPDATE_BOOK, DELETE_BOOK };
