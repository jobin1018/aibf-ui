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
import { jwtDecode, JwtPayload } from "jwt-decode";
import { toast } from "@/components/ui/use-toast";

interface GoogleJwtPayload extends JwtPayload {
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

export function LoginForm() {
  const navigate = useNavigate();

  const GOOGLE_CLIENT_ID =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    "455863006727-90ker8gpi3f5gol6939p65irjpf6e3o1.apps.googleusercontent.com";

  const handleError = (error: any) => {
    console.error("Google Sign In Failed", error);
    // Add more specific error handling
    if (error.error) {
      switch (error.error) {
        case "popup_blocked":
          alert("Login popup was blocked. Please allow popups for this site.");
          break;
        case "access_denied":
          alert("Access was denied. Please try again or contact support.");
          break;
        default:
          alert(`Login failed: ${error.error}`);
      }
    }
  };

  const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      console.error("No credential received");
      alert("Login failed. No credentials received.");
      return;
    }

    try {
      const response = await axios.post(
        API_ENDPOINTS.GOOGLE_SIGNIN,
        { token: credentialResponse.credential },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { data } = response;

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("google_token", credentialResponse.credential);

      // Decode the Google JWT to get user details
      const decoded = jwtDecode(credentialResponse.credential);
      if (!decoded || typeof decoded !== "object") {
        console.error("Invalid JWT payload");
        alert("Invalid login. Please try again.");
        return;
      }

      const googleJwtPayload = decoded as GoogleJwtPayload;

      // Store user details
      const userDetails = {
        id: data.user.id,
        name: googleJwtPayload.name,
        email: googleJwtPayload.email,
        picture: googleJwtPayload.picture,
      };
      localStorage.setItem("user_details", JSON.stringify(userDetails));

      if (data.user.new_user) {
        // Redirect new users to profile completion page
        navigate("/profile");
        toast({
          title: "Welcome!",
          description: "Please complete your profile to continue.",
        });
      } else {
        // Redirect to conference page for existing users
        navigate("/conference");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (axios.isAxiosError(error)) {
        console.error("API error response:", error.response?.data);
        alert(
          `Login failed: ${error.response?.data?.detail || "Unknown error"}`
        );
      } else {
        alert("An unexpected error occurred during login.");
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-20 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl text-center text-black dark:text-white font-bold">
          Login
        </CardTitle>
        <CardDescription className="text-center text-gray-900 dark:text-gray-200">
          Sign in with your Google account
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center pt-4 pb-6">
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleError as any}
            useOneTap
            auto_select
            type="standard"
            theme="filled_blue"
            size="large"
            text="signin_with"
            shape="rectangular"
          />
        </GoogleOAuthProvider>
      </CardContent>
    </Card>
  );
}
