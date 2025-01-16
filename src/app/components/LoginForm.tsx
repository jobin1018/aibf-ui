import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse,
} from "@react-oauth/google";
import axios from "axios";

const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
  const token = credentialResponse.credential;

  if (!token) {
    console.error("No credential received from Google");
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:8003/users/api/google-signin/",
      {
        token: token,
      }
    );
    console.log("JWT:", response.data);

    // Store JWT for authenticated requests
    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);
  } catch (error) {
    console.error("Google Sign-In error:", error);
  }
};

export function LoginForm() {
  return (
    <Card className="mx-auto max-w-sm mt-40">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link to="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
          {/* <Button variant="outline" className="w-full"> */}
          <GoogleOAuthProvider clientId="455863006727-90ker8gpi3f5gol6939p65irjpf6e3o1.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => console.error("Google Sign-In failed")}
            />
          </GoogleOAuthProvider>
          {/* </Button> */}
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="#" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
