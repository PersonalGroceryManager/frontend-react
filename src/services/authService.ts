import { jwtDecode } from "jwt-decode";

const API_BASE_URL = "http://localhost:5000";

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
    if (!data || typeof data !== "object" || !("access_token" in data)) {
      throw new Error("Invalid response format: 'token' missing or malformed");
    }

    // Storing tokens in localStorage
    // TODO: Store with HTTP only for security
    const token = data["access_token"];
    localStorage.setItem("access_token", token);
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
export const isAuthenticated = () => {
  const token_available = !!getToken();
  console.log("isAuthenticated: Does token exists? " + token_available);
  return !!getToken(); // Returns true if a token exists, false otherwise
};

// Function to logout the user
export const logout = () => {
  localStorage.removeItem("access_token");
};
