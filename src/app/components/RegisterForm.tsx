import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { API_ENDPOINTS } from "@/constants/api";
import { toast } from "@/components/ui/toast";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  adultsCount: z.string().min(1, {
    message: "Please enter number of adults.",
  }),
  kidsCount: z.string().min(0, {
    message: "Please enter number of kids.",
  }),
  additionalAdults: z
    .array(
      z.object({
        name: z
          .string()
          .min(2, { message: "Name must be at least 2 characters." }),
      })
    )
    .optional(),
  additionalKids: z
    .array(
      z.object({
        name: z
          .string()
          .min(2, { message: "Name must be at least 2 characters." }),
      })
    )
    .optional(),
});

interface RegisterFormProps {
  onSuccess?: (refetchEvents: () => void) => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [eventId, setEventId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      adultsCount: "",
      kidsCount: "",
      additionalAdults: [],
      additionalKids: [],
    },
  });

  const {
    fields: additionalAdultsFields,
    append: appendAdult,
    remove: removeAdult,
  } = useFieldArray({
    control: form.control,
    name: "additionalAdults",
  });

  const {
    fields: additionalKidsFields,
    append: appendKid,
    remove: removeKid,
  } = useFieldArray({
    control: form.control,
    name: "additionalKids",
  });

  const fetchLatestEvent = async () => {
    try {
      const userDetailsString = localStorage.getItem("user_details");

      if (!userDetailsString) {
        console.error("No user details found");
        return null;
      }

      const userDetails = JSON.parse(userDetailsString);
      const userEmail = userDetails.email;

      if (!userEmail) {
        console.error("No user email found in user details");
        return null;
      }

      const response = await axios.get(API_ENDPOINTS.EVENTS, {
        params: {
          email: userEmail,
        },
      });

      if (response.data && response.data.length > 0) {
        return response.data[0].id;
      }

      return null;
    } catch (error) {
      console.error("Error fetching events:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchLatestEventAsync = async () => {
      const eventId = await fetchLatestEvent();
      if (eventId) {
        setEventId(eventId);
      } else {
        setError("No events found");
      }
      setIsLoading(false);
    };

    fetchLatestEventAsync();
  }, []);

  useEffect(() => {
    const adultsCount = parseInt(form.getValues("adultsCount") || "0", 10);
    const currentAdultsLength = additionalAdultsFields.length;

    if (currentAdultsLength < adultsCount) {
      // Add more adult fields
      for (let i = currentAdultsLength; i < adultsCount; i++) {
        appendAdult({ name: "" });
      }
    } else if (currentAdultsLength > adultsCount) {
      // Remove excess adult fields
      for (let i = currentAdultsLength; i > adultsCount; i--) {
        removeAdult(i - 1);
      }
    }
  }, [form.watch("adultsCount")]);

  useEffect(() => {
    const kidsCount = parseInt(form.getValues("kidsCount") || "0", 10);
    const currentKidsLength = additionalKidsFields.length;

    if (currentKidsLength < kidsCount) {
      // Add more kid fields
      for (let i = currentKidsLength; i < kidsCount; i++) {
        appendKid({ name: "" });
      }
    } else if (currentKidsLength > kidsCount) {
      // Remove excess kid fields
      for (let i = currentKidsLength; i > kidsCount; i--) {
        removeKid(i - 1);
      }
    }
  }, [form.watch("kidsCount")]);

  useEffect(() => {
    // Get user details from localStorage
    const userDetailsStr = localStorage.getItem("user_details");
    if (userDetailsStr) {
      try {
        const userDetails = JSON.parse(userDetailsStr);
        if (userDetails.email) {
          form.setValue("email", userDetails.email);
        }
      } catch (error) {
        console.error("Error parsing user details:", error);
      }
    }
  }, [form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!eventId) {
      console.error("No event ID available");
      return;
    }

    try {
      const registrationData = {
        event_id: eventId,
        email: values.email,
        no_of_adults: parseInt(values.adultsCount, 10),
        no_of_children: parseInt(values.kidsCount, 10),
        additional_adults:
          values.additionalAdults?.map((adult) => adult.name).join(", ") || "",
        additional_kids:
          values.additionalKids?.map((kid) => kid.name).join(", ") || "",
      };

      console.log(
        "Registration Payload:",
        JSON.stringify(registrationData, null, 2)
      );

      const response = await axios.post(
        API_ENDPOINTS.REGISTRATION,
        registrationData
      );

      // Handle successful registration
      console.log("Registration successful:", response.data);

      // Show success toast
      toast({
        message: "Registration successful!",
        type: "success",
      });

      // Reset form after successful submission
      form.reset();

      // Pass refetch function to onSuccess callback
      onSuccess?.(() => fetchLatestEvent());
    } catch (error) {
      // Handle registration error
      console.error("Registration failed:", error);

      // Show error toast
      toast({
        message: "Registration failed. Please try again.",
        type: "error",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="your.email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Additional Attendees</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="adultsCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Adults</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kidsCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Kids</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {additionalAdultsFields.length > 0 && (
          <>
            <Separator className="my-4" />
            <h3 className="text-lg font-semibold">Adults</h3>
            {additionalAdultsFields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`additionalAdults.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adult Name ({index + 1})</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </>
        )}

        {additionalKidsFields.length > 0 && (
          <>
            <Separator className="my-4" />
            <h3 className="text-lg font-semibold">Kids</h3>
            {additionalKidsFields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`additionalKids.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kid Name ({index + 1})</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </>
        )}

        <Button type="submit" className="w-full">
          Register
        </Button>
      </form>
    </Form>
  );
}
