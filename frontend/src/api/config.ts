// Set VITE_API_BASE_URL at build time (e.g. in Docker); defaults to the local dev API.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5283/api";
