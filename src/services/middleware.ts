import { getToken, refreshAccessToken } from "./authService";

/**
 * Custom fetch function to act as a middleware
 * @param input - URL or Request object
 * @param init - Request configuration
 * @returns Response object
 */
export async function customFetch(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  // Request Interceptors here
  // Ensure the latest token is always part of the header
  const token = getToken();

  // How we add the token to the header differ from the input.
  // If it is an immutable Request object, we need to clone a mutable copy and
  // update its header
  let updatedRequest: Request | null = null;
  if (input instanceof Request) {
    updatedRequest = input.clone();
    updatedRequest.headers.set("Authorization", `Bearer ${token}`);
  }
  // If input is an URL with init (HTTP method, headers, content-type) we can
  // simply modify the init
  else {
    const headers = new Headers(init?.headers || {});
    headers.set("Authorization", `Bearer ${token}`);
    updatedRequest = new Request(input, { ...init, headers });
  }

  // Perform actual request
  console.log("Updated Request: ", updatedRequest);
  let response = await fetch(updatedRequest);

  // Response Interceptors here
  // Refresh token - if not success
  if (response.status == 401) {
    console.log("Attempting to refresh token!");
    const refreshSuccess = await refreshAccessToken();
    if (!refreshSuccess) return response;

    // Retry request with new token
    console.log("Retrying request with new token...");
    response = await fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${getToken()}`,
      },
    });
  }

  return response;
}
