import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { API_ENDPOINTS } from "@/constants/api";
import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider,
} from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface GoogleJwtPayload {
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

export function LoginForm() {
  const navigate = useNavigate();
  const GOOGLE_CLIENT_ID =
    "455863006727-90ker8gpi3f5gol6939p65irjpf6e3o1.apps.googleusercontent.com";

  const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      console.log(
        "Google login success, sending to backend:",
        credentialResponse
      );

      // Add type check to ensure credential exists
      if (!credentialResponse.credential) {
        console.error("No credential received");
        return;
      }

      const { data } = await axios.post(API_ENDPOINTS.GOOGLE_SIGNIN, {
        token: credentialResponse.credential,
      });

      console.log("Backend response:", data);

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      // Decode the Google JWT to get user details
      const decoded = jwtDecode(credentialResponse.credential);
      if (!decoded || typeof decoded !== "object") {
        console.error("Invalid JWT payload");
        return;
      }

      const googleJwtPayload: GoogleJwtPayload = decoded as GoogleJwtPayload;

      console.log("Decoded token:", googleJwtPayload);

      // Store user details
      const userDetails = {
        name: googleJwtPayload.name,
        email: googleJwtPayload.email,
        picture: googleJwtPayload.picture,
      };
      localStorage.setItem("user_details", JSON.stringify(userDetails));

      if (data.new_user) {
        // Redirect to profile completion for new users
        navigate("/profile");
      } else {
        // Redirect to conference page for existing users
        navigate("/conference");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (axios.isAxiosError(error)) {
        console.error("API error response:", error.response?.data);
      }
    }
  };

  const handleError = () => {
    console.error("Google Sign In Failed");
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Login</CardTitle>
        <CardDescription className="text-center">
          Sign in with your Google account
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleError}
            useOneTap
          />
        </GoogleOAuthProvider>
      </CardContent>
    </Card>
  );
}
