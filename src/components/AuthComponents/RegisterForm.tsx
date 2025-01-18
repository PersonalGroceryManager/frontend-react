import { useState, useEffect, useRef } from "react";
import { register } from "../../services/authService";
import "./RegisterForm.css";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const navigate = useNavigate();

  // Username and password regular expressions
  const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

  // Utilize useState to allow React to manage these components, enabling
  // dynamic input handling, validation, etc.
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const registerStatusIndicator = useRef<HTMLParagraphElement | null>(null);

  // Whether the username input cohere to regex
  const [validName, setValidName] = useState(false);
  useEffect(() => {
    setValidName(USER_REGEX.test(username));
  }, [username]);

  // Whether the password input cohere to regex
  const [validPwd, setValidPwd] = useState(false);
  useEffect(() => {
    setValidPwd(PWD_REGEX.test(password));
  }, [password]);

  // Whether the password and repeated password matches
  const [validMatch, setValidMatch] = useState(true);
  useEffect(() => {
    setValidMatch(password === repeatedPassword);
  });

  // Handle the focus of all input fields to ensure warnings only appear on
  // focused elements
  const [usernameFocus, setUsernameFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [repeatedPasswordFocus, setRepeatedPasswordFocus] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    // Prevent default form submission behaviour which refreshes page
    event.preventDefault();

    setIsLoading(true);
    const status = await register(username, email, password);

    if (status) {
      navigate("/login");
    }
    // Registration failed - show a warning
    else {
      registerStatusIndicator.current?.classList.remove("offscreen");
      registerStatusIndicator.current?.classList.add("warning");
      console.error("Login Failed");
    }
    setIsLoading(false);
  }

  // Remove the warning when user attempts to modify username, password or repeated password
  useEffect(() => {
    registerStatusIndicator.current?.classList.add("offscreen");
    registerStatusIndicator.current?.classList.remove("warning");
  }, [email, username, password, repeatedPassword]);

  return (
    <form id="register-form" onSubmit={handleSubmit}>
      <div className="form-group mb-3">
        <label htmlFor="registerEmail">Email address</label>
        <input
          type="email"
          className="form-control"
          id="registerEmail"
          aria-describedby="emailHelp"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <small id="emailHelp" className="form-text text-muted">
          We'll never share your email with anyone else.
        </small>
      </div>
      <div className="form-group mb-3">
        <label htmlFor="registerUsername">Username</label>
        <input
          type="text"
          className="form-control"
          id="registerUsername"
          placeholder="Enter username"
          onChange={(e) => setUsername(e.target.value)}
          onFocus={() => setUsernameFocus(true)}
          onBlur={() => setUsernameFocus(false)}
          autoComplete="false"
        ></input>
        <p
          id="uidnote"
          className={
            usernameFocus && username && !validName
              ? "instructions"
              : "offscreen"
          }
        >
          {/* <FontAwesomeIcon icon={faInfoCircle} /> */}
          4 to 24 characters.
          <br />
          Must begin with a letter.
          <br />
          Letters, numbers, underscores, hyphens allowed.
        </p>
      </div>
      <div className="form-group mb-3">
        <label htmlFor="registerPassword">Password</label>
        <input
          type="password"
          className="form-control"
          id="registerPassword"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setPasswordFocus(true)}
          onBlur={() => setPasswordFocus(false)}
        ></input>
        <p
          id="pwdnote"
          // Add pwdFocus to enable message only when
          className={
            passwordFocus && password && !validPwd
              ? "instructions"
              : "offscreen"
          }
        >
          {/* <FontAwesomeIcon icon={faInfoCircle} /> */}
          8 to 24 characters.
          <br />
          Must include uppercase and lowercase letters, a number and a special
          character.
          <br />
          Allowed special characters:{" "}
          <span aria-label="exclamation mark">!</span>{" "}
          <span aria-label="at symbol">@</span>{" "}
          <span aria-label="hashtag">#</span>{" "}
          <span aria-label="dollar sign">$</span>{" "}
          <span aria-label="percent">%</span>
        </p>
      </div>
      <div className="form-group  mb-3">
        <label htmlFor="registerPassword2">Repeat Password</label>
        <input
          type="password"
          className="form-control"
          id="registerPassword2"
          placeholder="Repeat your password"
          onChange={(e) => setRepeatedPassword(e.target.value)}
          onFocus={() => setRepeatedPasswordFocus(true)}
          onBlur={() => setRepeatedPasswordFocus(false)}
        ></input>
        <p
          id="confirm-note"
          className={
            repeatedPasswordFocus && repeatedPassword && !validMatch
              ? "instructions"
              : "offscreen"
          }
        >
          Must match the first password field
        </p>
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={!validName || !validPwd || !validMatch || isLoading}
      >
        {isLoading ? (
          <>
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            <span className="sr-only">Loading...</span>
          </>
        ) : (
          "Register"
        )}
      </button>
      <p className="offscreen mt-2" ref={registerStatusIndicator}>
        <i className="bi bi-exclamation-triangle-fill p-2"></i>Registration
        failed. Please try again.
      </p>
    </form>
  );
}

export default RegisterForm;
