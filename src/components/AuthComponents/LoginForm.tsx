import { useRef, useState, useEffect, useContext } from "react";
import { login } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import "./LoginForm.css";

function LoginForm() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const loginStatusIndicator = useRef<HTMLParagraphElement | null>(null);
  const navigate = useNavigate();

  // Access user context object
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("App must be used within a UserContextProvider");
  }

  const { isLoggedIn, setIsLoggedIn } = userContext;

  // Reset the warning message to offscreen whenever username and password is
  // modified
  useEffect(() => {
    loginStatusIndicator.current?.classList.add("offscreen");
    loginStatusIndicator.current?.classList.remove("warning");
  }, [username, password]);

  const handleSubmit = async (event: React.FormEvent) => {
    // Prevent default behaviour of page reload upon submission
    event.preventDefault();

    setIsLoading(true);

    console.log(
      "Attempting to login with credentials " + username + " " + password
    );
    const status = await login(username, password);

    // Redirect to dashboard upon successful login
    if (status) {
      setIsLoggedIn(true);
    } else {
      loginStatusIndicator.current?.classList.remove("offscreen");
      loginStatusIndicator.current?.classList.add("warning");
      console.error("Login Failed");
    }

    setIsLoading(false);
  };

  // Within the LoginForm component
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn]);

  const handleRegisterLink = async (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault();
    navigate("/register");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="loginUsername">Username</label>
        <input
          type="text"
          className="form-control mb-3"
          id="loginUsername"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        ></input>
      </div>

      <div className="form-group">
        <label htmlFor="loginPassword">Password</label>
        <input
          type="password"
          className="form-control mb-3"
          id="loginPassword"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
      </div>

      <button
        className="btn btn-primary mb-3"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            {" " /* For spacing */}
            Loading...
          </>
        ) : (
          "Login"
        )}
      </button>

      <p>
        <a className="link-primary" href="#" onClick={handleRegisterLink}>
          Register
        </a>{" "}
        if you are a new user
      </p>

      <p className="offscreen" ref={loginStatusIndicator}>
        <i className="bi bi-exclamation-triangle-fill p-2"></i>Login failed.
        Please try again.
      </p>
    </form>
  );
}

export default LoginForm;
