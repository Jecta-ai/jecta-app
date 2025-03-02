import { getCookie } from "cookies-next";

export const fetchWithAuth = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const headers = new Headers(init?.headers || {});
  
  const token = getCookie("token");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  return fetch(input, {
    ...init,
    headers,
  });
};
