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
  adultsCount: z.string().min(0, {
    message: "Please enter number of adults.",
  }),
  kids9to13Count: z.string().min(0, {
    message: "Please enter number of kids aged 9-13.",
  }),
  kids3to8Count: z.string().min(0, {
    message: "Please enter number of kids aged 3-8.",
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
  additionalKids9to13: z
    .array(
      z.object({
        name: z
          .string()
          .min(2, { message: "Name must be at least 2 characters." }),
      })
    )
    .optional(),
  additionalKids3to8: z
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
  onRegistrationComplete?: () => void;
}

const PRICES = {
  adult: 338,
  kids913: 254,
  kids38: 169,
};

const bankDetails = {
  accountName: "AIBF",
  bankName: "ANZ Bank",
  accountNumber: "412910238",
};

export function RegisterForm({ onRegistrationComplete }: RegisterFormProps) {
  const [eventId, setEventId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      adultsCount: "0",
      kids9to13Count: "",
      kids3to8Count: "",
      additionalAdults: [],
      additionalKids9to13: [],
      additionalKids3to8: [],
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
    fields: additionalKids9to13Fields,
    append: appendKid9to13,
    remove: removeKid9to13,
  } = useFieldArray({
    control: form.control,
    name: "additionalKids9to13",
  });

  const {
    fields: additionalKids3to8Fields,
    append: appendKid3to8,
    remove: removeKid3to8,
  } = useFieldArray({
    control: form.control,
    name: "additionalKids3to8",
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

    if (adultsCount > 0) {
      // If we need more fields
      if (currentAdultsLength < adultsCount) {
        const fieldsToAdd = adultsCount - currentAdultsLength;
        for (let i = 0; i < fieldsToAdd; i++) {
          appendAdult({ name: "" });
        }
      }
      // If we need fewer fields
      else if (currentAdultsLength > adultsCount) {
        const fieldsToRemove = currentAdultsLength - adultsCount;
        for (let i = 0; i < fieldsToRemove; i++) {
          removeAdult(currentAdultsLength - 1 - i);
        }
      }
    } else {
      // If count is 0, remove all fields
      const fieldsToRemove = currentAdultsLength;
      for (let i = 0; i < fieldsToRemove; i++) {
        removeAdult(currentAdultsLength - 1 - i);
      }
    }
  }, [form.watch("adultsCount"), appendAdult, removeAdult]);

  useEffect(() => {
    const kids9to13Count = parseInt(
      form.getValues("kids9to13Count") || "0",
      10
    );
    const currentKids9to13Length = additionalKids9to13Fields.length;

    if (currentKids9to13Length < kids9to13Count) {
      // Add more kid fields
      for (let i = currentKids9to13Length; i < kids9to13Count; i++) {
        appendKid9to13({ name: "" });
      }
    } else if (currentKids9to13Length > kids9to13Count) {
      // Remove excess kid fields
      for (let i = currentKids9to13Length; i > kids9to13Count; i--) {
        removeKid9to13(i - 1);
      }
    }
  }, [form.watch("kids9to13Count")]);

  useEffect(() => {
    const kids3to8Count = parseInt(form.getValues("kids3to8Count") || "0", 10);
    const currentKids3to8Length = additionalKids3to8Fields.length;

    if (currentKids3to8Length < kids3to8Count) {
      // Add more kid fields
      for (let i = currentKids3to8Length; i < kids3to8Count; i++) {
        appendKid3to8({ name: "" });
      }
    } else if (currentKids3to8Length > kids3to8Count) {
      // Remove excess kid fields
      for (let i = currentKids3to8Length; i > kids3to8Count; i--) {
        removeKid3to8(i - 1);
      }
    }
  }, [form.watch("kids3to8Count")]);

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

  const calculateTotalFee = () => {
    const additionalAdultsCount = parseInt(
      form.getValues("adultsCount") || "0",
      10
    );
    const totalAdultsCount = 1 + additionalAdultsCount; // Base adult (1) + additional adults

    const kids9to13Count = parseInt(
      form.getValues("kids9to13Count") || "0",
      10
    );
    const kids3to8Count = parseInt(form.getValues("kids3to8Count") || "0", 10);

    return (
      totalAdultsCount * PRICES.adult +
      kids9to13Count * PRICES.kids913 +
      kids3to8Count * PRICES.kids38
    );
  };

  const handleRegistrationSubmit = async (
    values: z.infer<typeof formSchema>
  ) => {
    if (!eventId) {
      console.error("No event ID available");
      return;
    }

    try {
      const registrationData = {
        event_id: eventId,
        email: values.email,
        no_of_adults: parseInt(values.adultsCount, 10),
        no_of_children_9to13: parseInt(values.kids9to13Count, 10),
        no_of_children_3to8: parseInt(values.kids3to8Count, 10),
        additional_adults:
          values.additionalAdults?.map((adult) => adult.name).join(", ") || "",
        additional_kids_9to13:
          values.additionalKids9to13?.map((kid) => kid.name).join(", ") || "",
        additional_kids_3to8:
          values.additionalKids3to8?.map((kid) => kid.name).join(", ") || "",
      };

      // Store registration data in localStorage for payment step
      localStorage.setItem(
        "registration_data",
        JSON.stringify({
          ...registrationData,
          totalAmount: calculateTotalFee(),
        })
      );

      // Move to payment tab
      onRegistrationComplete?.();
    } catch (error) {
      console.error("Registration validation failed:", error);
      toast({
        message: "Please check your registration details and try again.",
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
      <form
        onSubmit={form.handleSubmit(handleRegistrationSubmit)}
        className="space-y-6"
      >
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
                  <FormLabel>Additional Adults (excluding yourself)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kids9to13Count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Kids (9-13)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kids3to8Count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Kids (3-8)</FormLabel>
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

        {additionalKids9to13Fields.length > 0 && (
          <>
            <Separator className="my-4" />
            <h3 className="text-lg font-semibold">Kids (9-13)</h3>
            {additionalKids9to13Fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`additionalKids9to13.${index}.name`}
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

        {additionalKids3to8Fields.length > 0 && (
          <>
            <Separator className="my-4" />
            <h3 className="text-lg font-semibold">Kids (3-8)</h3>
            {additionalKids3to8Fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`additionalKids3to8.${index}.name`}
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
          Continue to Payment
        </Button>
      </form>
    </Form>
  );
}

interface PaymentDetailsProps {
  onSuccess?: () => void;
}

export function PaymentDetails({ onSuccess }: PaymentDetailsProps) {
  const [registrationData, setRegistrationData] = useState<{
    event_id: string;
    email: string;
    no_of_adults: number;
    no_of_children_9to13: number;
    no_of_children_3to8: number;
    additional_adults: string;
    additional_kids_9to13: string;
    additional_kids_3to8: string;
    totalAmount: number;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("registration_data");
    if (data) {
      setRegistrationData(JSON.parse(data));
    }
  }, []);

  const handleCompleteRegistration = async () => {
    if (!registrationData) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.post(API_ENDPOINTS.REGISTRATION, {
        event_id: registrationData.event_id,
        email: registrationData.email,
        no_of_adults: registrationData.no_of_adults,
        no_of_children_9to13: registrationData.no_of_children_9to13,
        no_of_children_3to8: registrationData.no_of_children_3to8,
        additional_adults: registrationData.additional_adults,
        additional_kids_9to13: registrationData.additional_kids_9to13,
        additional_kids_3to8: registrationData.additional_kids_3to8,
        total_amount: registrationData.totalAmount,
      });

      if (response.status === 201) {
        // Clear registration data from localStorage
        localStorage.removeItem("registration_data");
        // Call the success callback
        onSuccess?.();
      }
    } catch (error: any) {
      console.error("Registration submission failed:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to complete registration. Please try again.";
      setError(errorMessage);
      toast({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!registrationData) {
    return <div>Please complete registration first</div>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-3">
        {/* Adults */}
        <div className="flex items-center justify-between py-2 border-b">
          <div>
            <p className="font-medium">Adults</p>
            <p className="text-sm text-gray-500">
              {1 + registrationData.no_of_adults} × ${PRICES.adult}
            </p>
          </div>
          <span className="font-medium">
            ${(1 + registrationData.no_of_adults) * PRICES.adult}
          </span>
        </div>

        {/* Kids 9-13 */}
        {registrationData.no_of_children_9to13 > 0 && (
          <div className="flex items-center justify-between py-2 border-b">
            <div>
              <p className="font-medium">Kids (9-13)</p>
              <p className="text-sm text-gray-500">
                {registrationData.no_of_children_9to13} × ${PRICES.kids913}
              </p>
            </div>
            <span className="font-medium">
              ${registrationData.no_of_children_9to13 * PRICES.kids913}
            </span>
          </div>
        )}

        {/* Kids 3-8 */}
        {registrationData.no_of_children_3to8 > 0 && (
          <div className="flex items-center justify-between py-2 border-b">
            <div>
              <p className="font-medium">Kids (3-8)</p>
              <p className="text-sm text-gray-500">
                {registrationData.no_of_children_3to8} × ${PRICES.kids38}
              </p>
            </div>
            <span className="font-medium">
              ${registrationData.no_of_children_3to8 * PRICES.kids38}
            </span>
          </div>
        )}

        {/* Total */}
        <div className="flex items-center justify-between py-3 font-semibold">
          <span>Total Amount</span>
          <span className="text-lg text-primary">
            ${registrationData.totalAmount}
          </span>
        </div>
      </div>

      {/* Bank Details */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="mb-4 p-3 bg-blue-100 border border-blue-200 rounded-md">
          <p className="text-blue-800 font-medium">
            Please transfer the total amount to this AIBF bank account to
            complete the registration.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Account Name</span>
            <span className="font-medium">{bankDetails.accountName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Bank</span>
            <span className="font-medium">{bankDetails.bankName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Account Number</span>
            <span className="font-medium">{bankDetails.accountNumber}</span>
          </div>
        </div>
      </div>

      <Button
        type="button"
        className="w-full"
        onClick={handleCompleteRegistration}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Completing Registration..." : "Complete Registration"}
      </Button>
    </div>
  );
}
