import { ConferenceDetails } from "./ConferenceDetails";
import { useNavigate } from "react-router-dom";

interface ConferenceDetails {
  // Add conference details interface based on your backend response
  title?: string;
  date?: string;
  description?: string;
}

export function Conference() {
  const navigate = useNavigate();

  return (
    <ConferenceDetails
      onRegisterClick={() => {
        navigate("/register");
      }}
    />
  );
}
