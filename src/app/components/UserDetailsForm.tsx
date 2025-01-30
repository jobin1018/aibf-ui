import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { API_ENDPOINTS } from "@/constants/api";

interface UserDetailsFormProps {
  email: string;
  token: string;
  onSuccess: () => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
}

export default function UserDetailsForm({
  email,
  token,
  onSuccess,
}: UserDetailsFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: email,
    phone: "",
    address: "",
    city: "",
    state: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !token) {
      alert("Missing authentication details. Please log in again.");
      return;
    }

    try {
      void (await axios.post(API_ENDPOINTS.COMPLETE_PROFILE, {
        ...formData,
        token,
      }));

      // Store user details
      localStorage.setItem("user_details", JSON.stringify(formData));

      onSuccess();
    } catch (error) {
      console.error("Profile completion error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" value={formData.email} disabled />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          placeholder="Street Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="state">State</Label>
        <Input
          id="state"
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Complete Profile
      </Button>
    </form>
  );
}
