// BrowserRouter replaced by HashRouter for compatibility with GitHub pages
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ReceiptsPage from "./pages/ReceiptsPage";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserContext } from "./contexts/UserContext";
import { useContext } from "react";

const basename = "/frontend-react"; // Subpath

function App() {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("App must be used within a UserContextProvider");
  }

  const { isLoggedIn } = userContext;

  return (
    <>
      <Router basename={basename}>
        <NavigationBar />
        <main>
          <Routes>
            {/* Default route: check if authenticated, redirect to /dashboard or /login */}
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <Navigate to="/dashboard" /> // Redirect to dashboard if authenticated
                ) : (
                  <Navigate to="/login" /> // Redirect to login if not authenticated
                )
              }
            />
            <Route
              path="dashboard"
              element={<ProtectedRoute element={<Dashboard />} />}
            />

            <Route path="/login" element={<Login />} />
            <Route
              path="/receipts"
              element={<ProtectedRoute element={<ReceiptsPage />} />}
            />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </Router>
    </>
  );
}

export default App;
