// export const backendApiUrl = "http://localhost:8080/api";
export const backendApiUrl = "https://backend.studyadda.me/api";

export const routes = {
  AUTHOR: "author",
  AUTH: "auth",
  BOOK: "book",
  BORROWAL: "borrowal",
  GENRE: "genre",
  USER: "user",
  SEAT: "seat",
  CHECKIN: "checkin",
  PAYMENT: "payment",
  DASHBOARD: "dashboard"
};

export const methods = {
  GET: "get",
  GET_ALL: "getAll",
  POST: "add",
  PUT: "update",
  DELETE: "delete"
};

// apiUrl is a string base URL — used as `${apiUrl}/route/...`
export const apiUrl = backendApiUrl;

// Helper to build individual URL strings
export const buildUrl = (route, method, id = "") =>
  `${backendApiUrl}/${route}/${method}${id ? `/${id}` : ""}`;
