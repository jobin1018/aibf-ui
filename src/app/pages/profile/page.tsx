import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserDetailsForm from "@/app/components/UserDetailsForm";

interface UserDetails {
  email: string;
  name: string;
  picture: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");
  const googleToken = localStorage.getItem("google_token");
  const userDetailsStr = localStorage.getItem("user_details");
  const userDetails: UserDetails | null = userDetailsStr ? JSON.parse(userDetailsStr) : null;

  useEffect(() => {
    // Redirect to login if not authenticated or missing user details
    if (!token || !userDetails) {
      navigate("/login");
    }
  }, [token, userDetails, navigate]);

  const handleProfileComplete = () => {
    navigate("/conference");
  };

  if (!userDetails) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Complete Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <UserDetailsForm
            email={userDetails.email}
            name={userDetails.name}
            token={googleToken || ""}
            onSuccess={handleProfileComplete}
          />
        </CardContent>
      </Card>
    </div>
  );
}
