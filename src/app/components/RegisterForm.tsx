import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Separator } from "../../components/ui/separator";
import axios from "axios";
import { API_ENDPOINTS } from "../../constants/api";
import { toast } from "../../components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  package: z
    .string({
      required_error: "Please select a package.",
    })
    .min(1, {
      message: "Please select a package.",
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
  onSuccess?: () => void;
}

const PRICES = {
  "4-Day Package (Thu-Sun)": {
    adult: 340,
    kids913: 255,
    kids38: 170,
  },
  "3-Day Package (Fri-Sun)": {
    adult: 250,
    kids913: 190,
    kids38: 130,
  },
  "2-Day Package (Sat-Sun)": {
    adult: 135,
    kids913: 105,
    kids38: 70,
  },
  "Day Visitors": {
    adult: 36, // Entry + 1 meal
    kids913: 31, // Entry + 1 meal
    kids38: 26, // Entry + 1 meal
  },
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
      package: "",
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
    const selectedPackage = form.getValues("package");
    if (!selectedPackage) return 0;

    const packagePrices = PRICES[selectedPackage as keyof typeof PRICES];
    if (!packagePrices) return 0;

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
      totalAdultsCount * packagePrices.adult +
      kids9to13Count * packagePrices.kids913 +
      kids3to8Count * packagePrices.kids38
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
        selected_package: values.package,
        no_of_adults: 1 + parseInt(values.adultsCount, 10),
        no_of_children_9_13: parseInt(values.kids9to13Count, 10),
        no_of_children_3_8: parseInt(values.kids3to8Count, 10),
        additional_adults:
          values.additionalAdults?.map((adult) => adult.name).join(", ") || "",
        additional_kids_9_13:
          values.additionalKids9to13?.map((kid) => kid.name).join(", ") || "",
        additional_kids_3_8:
          values.additionalKids3to8?.map((kid) => kid.name).join(", ") || "",
        totalAmount: calculateTotalFee(),
      };

      // Store registration data in localStorage for payment step
      localStorage.setItem(
        "registration_data",
        JSON.stringify({
          ...registrationData,
        })
      );

      // Move to payment tab
      onRegistrationComplete?.();
    } catch (error) {
      console.error("Registration validation failed:", error);
      toast({
        title: "Registration Failed",
        description: "Please check your registration details and try again.",
        variant: "destructive",
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
        className="space-y-4 sm:space-y-6"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2 sm:space-y-3">
              <FormLabel className="text-sm sm:text-base">Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="your.email@example.com" 
                  className="h-9 sm:h-10 text-sm sm:text-base" 
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-xs sm:text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="package"
          render={({ field }) => (
            <FormItem className="space-y-2 sm:space-y-3">
              <FormLabel className="text-sm sm:text-base">Select Package</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-9 sm:h-10 text-sm sm:text-base">
                    <SelectValue placeholder="Select a package" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white dark:bg-gray-950 z-50 text-sm sm:text-base">
                  <SelectItem value="4-Day Package (Thu-Sun)">
                    4-Day Package (Thu-Sun)
                  </SelectItem>
                  <SelectItem value="3-Day Package (Fri-Sun)">
                    3-Day Package (Fri-Sun)
                  </SelectItem>
                  <SelectItem value="2-Day Package (Sat-Sun)">
                    2-Day Package (Sat-Sun)
                  </SelectItem>
                  <SelectItem value="Day Visitors">Day Visitors</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-xs sm:text-sm" />
            </FormItem>
          )}
        />

        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-base sm:text-lg font-semibold">Additional Attendees</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <FormField
              control={form.control}
              name="adultsCount"
              render={({ field }) => (
                <FormItem className="space-y-2 sm:space-y-3">
                  <FormLabel className="text-sm sm:text-base">Additional Adults (excluding yourself)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      placeholder="0" 
                      className="h-9 sm:h-10 text-sm sm:text-base"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kids9to13Count"
              render={({ field }) => (
                <FormItem className="space-y-2 sm:space-y-3">
                  <FormLabel className="text-sm sm:text-base">Number of Kids (9-13)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      className="h-9 sm:h-10 text-sm sm:text-base"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kids3to8Count"
              render={({ field }) => (
                <FormItem className="space-y-2 sm:space-y-3">
                  <FormLabel className="text-sm sm:text-base">Number of Kids (3-8)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      className="h-9 sm:h-10 text-sm sm:text-base"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
          </div>
        </div>

        {additionalAdultsFields.length > 0 && (
          <>
            <Separator className="my-3 sm:my-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Adults</h3>
            <div className="space-y-3 sm:space-y-4">
              {additionalAdultsFields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`additionalAdults.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="space-y-2 sm:space-y-3">
                      <FormLabel className="text-sm sm:text-base">Adult Name ({index + 1})</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Full name" 
                          className="h-9 sm:h-10 text-sm sm:text-base"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </>
        )}

        {additionalKids9to13Fields.length > 0 && (
          <>
            <Separator className="my-3 sm:my-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Kids (9-13)</h3>
            <div className="space-y-3 sm:space-y-4">
              {additionalKids9to13Fields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`additionalKids9to13.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="space-y-2 sm:space-y-3">
                      <FormLabel className="text-sm sm:text-base">Kid Name ({index + 1})</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Full name" 
                          className="h-9 sm:h-10 text-sm sm:text-base"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </>
        )}

        {additionalKids3to8Fields.length > 0 && (
          <>
            <Separator className="my-3 sm:my-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Kids (3-8)</h3>
            <div className="space-y-3 sm:space-y-4">
              {additionalKids3to8Fields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`additionalKids3to8.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="space-y-2 sm:space-y-3">
                      <FormLabel className="text-sm sm:text-base">Kid Name ({index + 1})</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Full name" 
                          className="h-9 sm:h-10 text-sm sm:text-base"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </>
        )}

        <Button type="submit" className="w-full h-9 sm:h-10 text-sm sm:text-base mt-4 sm:mt-6">
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
  const navigate = useNavigate();
  const [registrationData, setRegistrationData] = useState<{
    event_id: string;
    email: string;
    selected_package: string;
    no_of_adults: number;
    no_of_children_9_13: number;
    no_of_children_3_8: number;
    additional_adults: string;
    additional_kids_9_13: string;
    additional_kids_3_8: string;
    totalAmount: number;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("registration_data");
    if (data) {
      setRegistrationData(JSON.parse(data));
      console.log("registrationData", registrationData);
    }
  }, []);

  const handleCompleteRegistration = async () => {
    console.log("registrationData", registrationData);
    if (!registrationData) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.post(API_ENDPOINTS.REGISTRATION, {
        event_id: registrationData.event_id,
        email: registrationData.email,
        selected_package: registrationData.selected_package,
        no_of_adults: registrationData.no_of_adults,
        no_of_children_9_13: registrationData.no_of_children_9_13,
        no_of_children_3_8: registrationData.no_of_children_3_8,
        additional_adults: registrationData.additional_adults,
        additional_kids_9_13: registrationData.additional_kids_9_13,
        additional_kids_3_8: registrationData.additional_kids_3_8,
        total_amount: registrationData.totalAmount,
      });

      if (response.status === 201) {
        // Clear registration data from localStorage
        localStorage.removeItem("registration_data");
        setRegistrationData(null);
        toast({
          title: "Success",
          description: "Registration completed successfully!",
        });
        onSuccess?.();
        navigate("/conference");
      }
    } catch (error: unknown) {
      console.error("Registration submission failed:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "An unknown error occurred";
      setError(errorMessage);
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!registrationData) {
    return (
      <div className="text-center py-4 sm:py-6">
        <p className="text-sm sm:text-base text-muted-foreground">No registration data found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold">Registration Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base">
          <div>
            <p className="text-muted-foreground">Email:</p>
            <p className="font-medium">{registrationData.email}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Package:</p>
            <p className="font-medium">{registrationData.selected_package}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total Adults:</p>
            <p className="font-medium">{registrationData.no_of_adults}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Kids (9-13):</p>
            <p className="font-medium">{registrationData.no_of_children_9_13}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Kids (3-8):</p>
            <p className="font-medium">{registrationData.no_of_children_3_8}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total Amount:</p>
            <p className="font-medium">${registrationData.totalAmount}</p>
          </div>
        </div>
      </div>

      <Separator className="my-3 sm:my-4" />

      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold">Bank Details</h3>
        <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
          <div>
            <p className="text-muted-foreground">Account Name:</p>
            <p className="font-medium">{bankDetails.accountName}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Bank Name:</p>
            <p className="font-medium">{bankDetails.bankName}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Account Number:</p>
            <p className="font-medium">{bankDetails.accountNumber}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4 pt-2 sm:pt-3">
        <h4 className="text-sm sm:text-base font-medium text-muted-foreground">Important Notes:</h4>
        <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-sm sm:text-base text-muted-foreground">
          <li>Please include your email in the payment reference</li>
          <li>Send your payment receipt to registration@aibf.org</li>
          <li>Your registration will be confirmed after payment verification</li>
        </ul>
      </div>

      {error && (
        <div className="text-sm sm:text-base text-red-500 mt-2 sm:mt-3">
          Error: {error}
        </div>
      )}

      <Button
        onClick={handleCompleteRegistration}
        className="w-full h-9 sm:h-10 text-sm sm:text-base mt-4 sm:mt-6"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Processing..." : "Complete Registration"}
      </Button>
    </div>
  );
}
