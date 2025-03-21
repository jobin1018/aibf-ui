import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { API_ENDPOINTS } from "@/constants/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const userFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
});

type UserFormData = z.infer<typeof userFormSchema>;

interface UserDetailsFormProps {
  email: string;
  token: string;
  onSuccess: () => void;
}

export default function UserDetailsForm({
  email,
  token,
  onSuccess,
}: UserDetailsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email,
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
    },
  });

  const onSubmit = async (data: UserFormData) => {
    if (!email || !token) {
      alert("Missing authentication details. Please log in again.");
      return;
    }

    try {
      await axios.post(API_ENDPOINTS.COMPLETE_PROFILE, {
        ...data,
        token,
      });

      // Store user details
      localStorage.setItem("user_details", JSON.stringify(data));
      onSuccess();
    } catch (error) {
      console.error("Profile completion error:", error);
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
        <Input id="email" {...register("email")} disabled />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
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
      <Button type="submit" className="w-full">
        Complete Profile
      </Button>
    </form>
  );
}
