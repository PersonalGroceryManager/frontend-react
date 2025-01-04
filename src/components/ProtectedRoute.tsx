import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../services/authService";

function ProtectedRoute({ element }: { element: JSX.Element }) {
  console.log(
    "Attempting to access protected route - User Authenticated? " +
      isAuthenticated()
  );
  if (!isAuthenticated()) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" replace />;
  }
  console.log("This protected route is available since user is authenticated.");
  return element;
}

export default ProtectedRoute;
