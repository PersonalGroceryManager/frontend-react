import { useNavigate } from "react-router-dom";

function NavigateToLoginButton() {
  const navigate = useNavigate();

  const handleLoginButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <button
      id="login-page-btn"
      className="btn btn-outline-success my-2 my-sm-0"
      type="button"
      onClick={handleLoginButtonClick}
    >
      Login
    </button>
  );
}

export default NavigateToLoginButton;
