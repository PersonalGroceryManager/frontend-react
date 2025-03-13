import { jwtVerify } from "jose";
import { jwtDecode } from "jwt-decode";
import { customFetch } from "./middleware";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

/**
 * Attempts to register a new user and navigate them to the login page if
 * successful
 *
 * @param {string} username - The username of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the login
 * was successful, or `false` otherwise.
 * @throws {Error} Throws an error if the register process encounters an
 * unexpected issue.
 */
export const register = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const request = new Request(API_BASE_URL + "/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const response = await fetch(request);
    console.log("Register response status: " + String(response.status));

    if (!response.ok) {
      throw new Error("Register Failed.");
    }

    console.log("Register successful!");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

/**
 * Attempts to log in a user and stores the access token in local storage if
 * successful.
 *
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the login
 * was successful, or `false` otherwise.
 * @throws {Error} Throws an error if the login process encounters an
 * unexpected issue.
 */
export const login = async (username: string, password: string) => {
  try {
    const request = new Request(API_BASE_URL + "/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const response = await fetch(request);
    console.log("Login response status: " + String(response.status));

    if (!response.ok) {
      throw new Error("Login failed.");
    }

    const data = await response.json();

    // Response validation
    if (
      !data ||
      typeof data !== "object" ||
      !("access_token" in data) ||
      !("refresh_token" in data)
    ) {
      throw new Error("Invalid response format: 'token' missing or malformed");
    }

    // Storing tokens in localStorage
    // TODO: Store with HTTP only for security
    const accessToken = data["access_token"];
    const refreshToken = data["refresh_token"];
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    console.log("Logged in!");

    return true;
  } catch (error) {
    console.error("Login error", error);
    return false;
  }
};

// Function to get the JWT token from localStorage
export const getToken = () => {
  return localStorage.getItem("access_token");
};

// Function to get the refresh token from local storage
export const getRefreshToken = () => {
  return localStorage.getItem("refresh_token");
};

let refreshPromise: Promise<string> | null = null;
export const refreshAccessToken = async (): Promise<boolean> => {
  if (refreshPromise) {
    console.log("Waiting for ongoing refresh...");
    await refreshPromise; // Wait for the first refresh to complete
    return true;
  }

  refreshPromise = (async () => {
    try {
      console.log("Refreshing token...");
      const response = await fetch(`${API_BASE_URL}/users/refresh`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getRefreshToken()}` },
      });

      if (!response.ok) throw new Error("Refresh failed");

      const data = await response.json();
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        console.log("Token refresh successful!");
        return data.access_token;
      }

      throw new Error("No access token in response");
    } catch (err) {
      console.error("Token refresh error:", err);
      return "";
    } finally {
      refreshPromise = null; // Reset so future refreshes can happen
    }
  })();

  await refreshPromise;
  return !!getToken();
};

// Function to get the user ID from the token
export const getUserIDFromToken = () => {
  const token = getToken();
  if (!token) {
    console.log("No access token found in local storage.");
    return 0;
  }

  try {
    const decoded = jwtDecode(token);
    console.log("Decoded Token: ", decoded);
    return decoded?.sub;
  } catch (error) {
    console.error("Invalid Token: ", error);
    return 0;
  }
};

// Function to check if the user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const token = getToken();
  if (!token) {
    console.log("isAuthenticated: Token does not exist.");
    return false;
  }
  console.log("isAuthenticated: Token exists.");

  const encodedKey = new TextEncoder().encode(SECRET_KEY);
  try {
    const { payload } = await jwtVerify(token, encodedKey);
    console.log("Token is valid:", payload);
    return true;
  } catch (err) {
    console.log("Invalid token");
    return false;
  }
};

// Function to logout the user
export const logout = () => {
  localStorage.removeItem("access_token");
};

// Function to convert a username to its ID
export const getUserIDFromName = async (
  username: string
): Promise<number | null> => {
  try {
    const response = await customFetch(
      `${API_BASE_URL}/users/resolve/${username}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      console.error(
        `Failed to resolve username ${username}:`,
        response.statusText
      );
      return null;
    }

    const data = await response.json(); // Assuming API returns a JSON response
    if (!data || typeof data.user_id !== "number") {
      console.error("Invalid response format:", data);
      return null;
    }

    return data.user_id;
  } catch (error) {
    console.error("Error resolving username to user ID:", error);
    return null;
  }
};

// Function to convert a user ID to its username
export const getUsernameFromID = async (
  userID: number
): Promise<string | null> => {
  try {
    const response = await customFetch(
      `${API_BASE_URL}/users/resolve/${userID}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      console.error(
        `Failed to resolve user ID ${userID}:`,
        response.statusText
      );
      return null;
    }

    const data = await response.json(); // Assuming API returns a JSON response
    if (!data || typeof data.username !== "string") {
      console.error("Invalid response format:", data);
      return null;
    }

    return data.username;
  } catch (error) {
    console.error("Error resolving username to user ID:", error);
    return null;
  }
};

// Function to fetch user spending
export const getUserSpending = async (): Promise<
  { receipt_id: number; slot_time: Date; cost: number }[]
> => {
  const request = new Request(API_BASE_URL + "/users/costs", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
  });
  const response = await customFetch(request);
  if (!response.ok) {
    return [];
  }
  const data: { receipt_id: number; slot_time: string; cost: number }[] =
    await response.json();

  // Convert date string to date object and sort it
  const formattedData: {
    receipt_id: number;
    slot_time: Date;
    cost: number;
  }[] = data
    .map((entry) => ({
      ...entry,
      slot_time: new Date(entry.slot_time),
    }))
    .sort(
      (a, b) =>
        new Date(a.slot_time).getTime() - new Date(b.slot_time).getTime()
    );

  return formattedData;
};
