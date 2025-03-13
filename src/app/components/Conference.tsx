import { LoginForm } from "./LoginForm";
import { ConferenceDetails } from "./ConferenceDetails";
import { useNavigate } from "react-router-dom";

interface ConferenceDetails {
  // Add conference details interface based on your backend response
  title?: string;
  date?: string;
  description?: string;
}

export function Conference() {
  const isLoggedIn = localStorage.getItem("access") !== null;
  const navigate = useNavigate();

  // If we're on /login path, show the login form
  const isLoginPath = window.location.pathname === "/login";

  if (!isLoggedIn && isLoginPath) {
    return <LoginForm />;
  }

  return (
    <ConferenceDetails
      onRegisterClick={() => {
        navigate("/register");
      }}
    />
  );
}
