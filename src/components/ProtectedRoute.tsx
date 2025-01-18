import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { isAuthenticated } from "../services/authService";

function ProtectedRoute({ element }: { element: JSX.Element }) {
  const [authStatus, setAuthStatus] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      const isAuth = await isAuthenticated(); // Await the async function
      setAuthStatus(isAuth); // Set the authentication status
    };

    checkAuthentication();
  }, []); // Only run on component mount

  if (authStatus === null) {
    // Optionally, you could return a loading spinner or placeholder while the check is in progress
    return <div>Loading...</div>;
  }

  if (!authStatus) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  console.log("This protected route is available since user is authenticated.");
  return element;
}

export default ProtectedRoute;
