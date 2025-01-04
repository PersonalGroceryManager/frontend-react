import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import { UserContext } from "../../contexts/UserContext";

function LogoutButton() {
  let navigate = useNavigate();

  // Access user context object
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("App must be used within a UserContextProvider");
  }

  const { setIsLoggedIn } = userContext;

  const handleLogoutButtonClick = () => {
    logout();
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <button
      id="logout-change-btn"
      className="btn btn-outline-danger my-2 my-sm-0"
      type="submit"
      onClick={handleLogoutButtonClick}
    >
      Logout
    </button>
  );
}

export default LogoutButton;
