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
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UserDetailsForm from "@/app/components/UserDetailsForm"; // Import UserDetailsForm
import { toast } from "@/components/ui/toast";

interface GoogleJwtPayload extends JwtPayload {
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

export function LoginForm() {
  const navigate = useNavigate();
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserToken, setNewUserToken] = useState("");

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
    console.log("Credential Response:", credentialResponse);

    if (!credentialResponse.credential) {
      console.error("No credential received");
      alert("Login failed. No credentials received.");
      return;
    }

    try {
      console.log("Sending Google Credential:", credentialResponse.credential);
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
      console.log("Backend Login Response:", data);

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      // Decode the Google JWT to get user details
      const decoded = jwtDecode(credentialResponse.credential);
      if (!decoded || typeof decoded !== "object") {
        console.error("Invalid JWT payload");
        alert("Invalid login. Please try again.");
        return;
      }

      const googleJwtPayload = decoded as GoogleJwtPayload;

      console.log("Decoded token:", googleJwtPayload);

      // Store user details
      const userDetails = {
        name: googleJwtPayload.name,
        email: googleJwtPayload.email,
        picture: googleJwtPayload.picture,
      };
      localStorage.setItem("user_details", JSON.stringify(userDetails));

      console.log("data.user.new_user", data.user.new_user);
      if (data.user.new_user) {
        // Open modal for new users to complete profile
        setNewUserEmail(googleJwtPayload.email);
        setNewUserToken(credentialResponse.credential);
        setIsUserDetailsModalOpen(true);
        console.log("usedetailsmodal", isUserDetailsModalOpen);
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

  const handleProfileComplete = () => {
    toast({
      title: "User Created",
      message: "Profile Completed Successfully",
    });
    setIsUserDetailsModalOpen(false);
    navigate("/conference");
  };

  return (
    <>
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

      <Dialog
        open={isUserDetailsModalOpen}
        onOpenChange={() => {
          // Do nothing to prevent closing
          toast({
            title: "Profile Completion Required",
            description: "You must complete your profile to continue.",
            type: "error",
            message: "",
          });
        }}
      >
        <DialogContent
          // Additional prevention of closing
          onEscapeKeyDown={(e) => {
            e.preventDefault();
            toast({
              title: "Profile Completion Required",
              description: "You must complete your profile to continue.",
              type: "error",
              message: "",
            });
          }}
          onPointerDownOutside={(e) => {
            e.preventDefault();
            toast({
              title: "Profile Completion Required",
              description: "You must complete your profile to continue.",
              type: "error",
              message: "",
            });
          }}
        >
          <DialogHeader>
            <DialogTitle>Complete Your Profile</DialogTitle>
            <p className="text-sm text-muted-foreground">
              You must complete your profile to access the application
            </p>
          </DialogHeader>
          <UserDetailsForm
            email={newUserEmail}
            token={newUserToken}
            onSuccess={handleProfileComplete}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
