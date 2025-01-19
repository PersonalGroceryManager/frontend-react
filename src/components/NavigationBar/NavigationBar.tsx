import { useContext } from "react";
import "./NavigationBar.css";
import { UserContext } from "../../contexts/UserContext";
import NavigateToLoginButton from "../AuthComponents/NavigateToLoginButton";
import LogoutButton from "../AuthComponents/LogoutButton";

function NavigationBar() {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("App must be used within a UserContextProvider");
  }

  const { isLoggedIn } = userContext;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top px-3">
      <a className="navbar-brand" href="">
        Personal Grocery Manager
      </a>
      <button
        className="navbar-toggler"
        type="button"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
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
