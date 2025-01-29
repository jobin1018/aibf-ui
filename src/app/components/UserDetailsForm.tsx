import { useState } from "react";
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
import axios from "axios";
import { API_ENDPOINTS } from "@/constants/api";

interface UserDetailsFormProps {
  email: string;
  token: string;
  onSuccess: (response: any) => void;
}

export function UserDetailsForm({
  email,
  token,
  onSuccess,
}: UserDetailsFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    organization: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_ENDPOINTS.COMPLETE_PROFILE, {
        ...formData,
        email,
        token,
      });

      // Store user details
      const userDetails = {
        name: formData.name,
        email: email,
        phone: formData.phone,
        organization: formData.organization,
      };
      localStorage.setItem("user_details", JSON.stringify(userDetails));

      onSuccess(response.data);
    } catch (error) {
      console.error("Profile completion error:", error);
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Complete Your Profile</CardTitle>
        <CardDescription>Please provide additional details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="organization">Organization</Label>
            <Input
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Complete Profile
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
