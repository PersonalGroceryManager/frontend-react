import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import NavigateToLoginButton from "./AuthComponents/NavigateToLoginButton";
import LogoutButton from "./AuthComponents/LogoutButton";

function NavigationBar() {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("App must be used within a UserContextProvider");
  }

  const { isLoggedIn } = userContext;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 mb-3">
      <a className="navbar-brand" href="">
        {/* NOTE: THIS PATH IS DELICATE */}
        <img
          src="/frontend-react/assets/grocery-icon.png"
          width="30"
          height="30"
          alt="Grocery Icon"
        />
        {"   " /* For spacing */}
        Personal Grocery Manager
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
        aria-controls="navbarContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarContent">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" href="#/dashboard">
              Dashboard
              {/* <span className="sr-only">(curre nt)</span> */}
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#/receipts">
              Receipts
            </a>
          </li>
          {isLoggedIn ? <LogoutButton /> : <NavigateToLoginButton />}
        </ul>
      </div>
    </nav>
  );
}

export default NavigationBar;
