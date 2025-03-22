import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { API_ENDPOINTS } from "@/constants/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
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

  useEffect(() => {
    const initializeForm = async () => {
      try {
        setIsLoading(true);
        // Get registration data from localStorage if not in update mode
        if (!isUpdate) {
          const registrationData = localStorage.getItem("registration_data");
          if (registrationData) {
            const parsedData = JSON.parse(registrationData);
            if (parsedData.email) {
              setValue("email", parsedData.email);
            }
          }
        }
      } catch (error) {
        console.error("Error initializing form:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeForm();
  }, [isUpdate, setValue]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!isUpdate || !userId || !token) return;

      try {
        setIsLoading(true);
        const response = await axios.get(`${API_ENDPOINTS.USERS}/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = response.data;
        setValue("name", userData.name);
        setValue("email", userData.email);
        setValue("phone", userData.phone);
        setValue("city", userData.city);
        setValue("address", userData.address);
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast({
          title: "Error",
          description: "Failed to load user details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [isUpdate, userId, token, setValue]);

  useEffect(() => {
    if (email) {
      setValue("email", email);
    }
  }, [email, setValue]);

  const onSubmit = async (data: UserFormData) => {
    try {
      setIsSubmitting(true);
      if (!token) {
        alert("Missing authentication details. Please log in again.");
        return;
      }

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
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          {/* Name field skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>

          {/* Email field skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>

          {/* Phone field skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>

          {/* Address field skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>

          {/* City field skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>

          {/* State field skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>

        {/* Submit button skeleton */}
        <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
      </div>
    );
  }

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
        {isSubmitting ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin border-2 border-white border-t-2 border-t-gray-500 rounded-full" />
            {isUpdate ? "Updating Profile..." : "Completing Profile..."}
          </>
        ) : isUpdate ? (
          "Update Profile"
        ) : (
          "Complete Profile"
        )}
      </Button>
    </form>
  );
}
