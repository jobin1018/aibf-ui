import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { API_ENDPOINTS } from "@/constants/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React from "react";
import { toast } from "@/components/ui/use-toast";

const userFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
});

type UserFormData = z.infer<typeof userFormSchema>;

interface UserDetailsFormProps {
  email: string;
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  token: string;
  onSuccess: () => void;
  isUpdate?: boolean;
  userId?: number;
}

export default function UserDetailsForm({
  email,
  name,
  phone = "",
  address = "",
  city = "",
  state = "",
  token,
  onSuccess,
  isUpdate = false,
  userId,
}: UserDetailsFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name,
      phone,
      address,
      city,
      state,
    },
  });

  // Ensure email is always set in the form
  React.useEffect(() => {
    setValue("email", email);
  }, [email, setValue]);

  const onSubmit = async (data: UserFormData) => {
    if (!token) {
      alert("Missing authentication details. Please log in again.");
      return;
    }

    try {
      if (isUpdate && userId) {
        // Update existing profile
        await axios.patch(
          `${API_ENDPOINTS.USERS}${userId}/`,
          { ...data },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // For update, keep the existing ID from local storage
        const existingDetails = JSON.parse(
          localStorage.getItem("user_details") || "{}"
        );
        localStorage.setItem(
          "user_details",
          JSON.stringify({
            ...data,
            id: existingDetails.id,
            picture: existingDetails.picture,
          })
        );
      } else {
        // Create new profile
        const response = await axios.post(API_ENDPOINTS.COMPLETE_PROFILE, {
          ...data,
          token,
        });

        // Store user details with ID from response
        localStorage.setItem(
          "user_details",
          JSON.stringify({
            ...data,
            id: response.data.id,
            picture: response.data.picture || "",
          })
        );
      }

      onSuccess();
    } catch (error) {
      console.error("Profile error:", error);
      toast({
        title: "Error",
        description: isUpdate
          ? "Failed to update profile"
          : "Failed to create profile",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" {...register("name")} placeholder="Full Name" />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          {...register("email")}
          readOnly
          disabled
          className="opacity-50"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" {...register("phone")} placeholder="Phone Number" />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          {...register("address")}
          placeholder="Street Address"
        />
        {errors.address && (
          <p className="text-sm text-red-500">{errors.address.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input id="city" {...register("city")} placeholder="City" />
        {errors.city && (
          <p className="text-sm text-red-500">{errors.city.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="state">State</Label>
        <Input id="state" {...register("state")} placeholder="State" />
        {errors.state && (
          <p className="text-sm text-red-500">{errors.state.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isUpdate ? "Update Profile" : "Complete Profile"}
      </Button>
    </form>
  );
}
