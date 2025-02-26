import { getCookie } from "cookies-next";

/**
 * Enhanced fetch function that automatically adds auth token from cookies
 * Usage is identical to the standard fetch API
 */
export const fetchWithAuth = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  // Create a new headers object from the provided headers or a new empty one
  const headers = new Headers(init?.headers || {});
  
  // Add the token to the Authorization header if it exists
  const token = getCookie("token");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  // Call fetch with the modified headers
  return fetch(input, {
    ...init,
    headers,
  });
};
