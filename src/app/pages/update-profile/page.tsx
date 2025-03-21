import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserDetailsForm from "@/app/components/UserDetailsForm";
import axios from "axios";
import { API_ENDPOINTS } from "@/constants/api";
import { toast } from "@/components/ui/use-toast";

interface UserDetails {
  email: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  picture: string;
  id: number;
}

export default function UpdateProfilePage() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("access");
  const userDetailsStr = localStorage.getItem("user_details");
  const storedUserDetails: UserDetails | null = userDetailsStr
    ? JSON.parse(userDetailsStr)
    : null;

  useEffect(() => {
    // Redirect to login if not authenticated or missing user details
    if (!token || !storedUserDetails?.id) {
      navigate("/login");
      return;
    }

    // Fetch user profile using ID from local storage
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINTS.USERS}${storedUserDetails.id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserProfile(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast({
          title: "Error",
          description: "Failed to fetch user profile",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [token, navigate, storedUserDetails?.id]);

  const handleUpdateSuccess = () => {
    toast({
      title: "Success",
      description: "Profile updated successfully",
    });
    navigate("/conference");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!userProfile) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Update Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UserDetailsForm
            email={userProfile.email}
            name={userProfile.name}
            phone={userProfile.phone}
            address={userProfile.address}
            city={userProfile.city}
            state={userProfile.state}
            token={token || ""}
            onSuccess={handleUpdateSuccess}
            isUpdate={true}
            userId={userProfile.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
