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
import { PRICES, bankDetails } from "@/constants/fees";

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
  selectedMeals: z.array(z.enum(["breakfast", "lunch", "dinner"])).optional(),
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

const MealType = {
  BREAKFAST: "breakfast",
  LUNCH: "lunch",
  DINNER: "dinner",
} as const;

type MealType = (typeof MealType)[keyof typeof MealType];

export const RegisterForm = ({ onRegistrationComplete }: RegisterFormProps) => {
  const [eventId, setEventId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      package: "",
      adultsCount: "0",
      kids9to13Count: "0",
      kids3to8Count: "0",
      selectedMeals: [],
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

  const watchPackage = form.watch("package");
  const watchAdultsCount = form.watch("adultsCount");
  const watchKids913Count = form.watch("kids9to13Count");
  const watchKids38Count = form.watch("kids3to8Count");
  const watchSelectedMeals = form.watch("selectedMeals");

  const calculateTotalFee = (values: z.infer<typeof formSchema>) => {
    const selectedPackage = PRICES[values.package as keyof typeof PRICES];
    if (!selectedPackage) return 0;

    // Add 1 to adultsCount for the registering user
    const adultsCount = 1 + (parseInt(values.adultsCount) || 0);
    const kids913Count = parseInt(values.kids9to13Count) || 0;
    const kids38Count = parseInt(values.kids3to8Count) || 0;

    let total = 0;

    if (values.package === "Day Visitors") {
      // Base entry fee ($16) for all attendees
      const entryFee = selectedPackage.adult;
      const totalPeople = adultsCount + kids913Count + kids38Count;
      total = totalPeople * entryFee;

      // Add meal costs if selected
      if (values.selectedMeals?.length && "mealPrices" in selectedPackage) {
        const { mealPrices } = selectedPackage;
        const mealCount = values.selectedMeals.length;

        // Multiply full meal price by number of meals selected
        total += adultsCount * mealPrices.adult * mealCount;
        total += kids913Count * mealPrices.kids913 * mealCount;
        total += kids38Count * mealPrices.kids38 * mealCount;
      }
    } else {
      // Regular package calculation
      total =
        adultsCount * selectedPackage.adult +
        kids913Count * selectedPackage.kids913 +
        kids38Count * selectedPackage.kids38;
    }

    return total;
  };

  // Update total when relevant fields change
  useEffect(() => {
    const total = calculateTotalFee({
      package: watchPackage,
      adultsCount: watchAdultsCount,
      kids9to13Count: watchKids913Count,
      kids3to8Count: watchKids38Count,
      selectedMeals: watchSelectedMeals,
      email: "",
    });
    setTotalAmount(total);
  }, [
    calculateTotalFee,
    watchPackage,
    watchAdultsCount,
    watchKids913Count,
    watchKids38Count,
    watchSelectedMeals,
  ]);

  const handleRegistrationSubmit = async (
    values: z.infer<typeof formSchema>
  ) => {
    if (!eventId) {
      console.error("No event ID available");
      return;
    }

    try {
      const totalFee = calculateTotalFee(values);
      console.log("values", values);
      const registrationData = {
        event_id: eventId,
        email: values.email,
        selected_package: values.package,
        adults_count: parseInt(values.adultsCount),
        kids_9_to_13_count: parseInt(values.kids9to13Count),
        kids_3_to_8_count: parseInt(values.kids3to8Count),
        selected_meals: values.selectedMeals?.join(", ") || "",
        additional_adults:
          values.additionalAdults?.map((adult) => adult.name).join(", ") || "",
        additional_kids_9_13:
          values.additionalKids9to13?.map((kid) => kid.name).join(", ") || "",
        additional_kids_3_8:
          values.additionalKids3to8?.map((kid) => kid.name).join(", ") || "",
        total_amount: totalFee,
      };

      // Store registration data in localStorage for payment step
      localStorage.setItem(
        "registration_data",
        JSON.stringify(registrationData)
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
        className="space-y-6"
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
              <FormLabel className="text-sm sm:text-base">
                Select Package
              </FormLabel>
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

        {watchPackage === "Day Visitors" && (
          <FormField
            control={form.control}
            name="selectedMeals"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Select Meals</FormLabel>
                <p className="text-sm text-muted-foreground mb-2">
                  Cost per meal: Adults ($19), Children 9-13 ($15), Children 3-8
                  ($10)
                </p>
                <div className="flex flex-col space-y-2">
                  {[MealType.BREAKFAST, MealType.LUNCH, MealType.DINNER].map(
                    (meal) => (
                      <div key={meal} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={field.value?.includes(meal)}
                          onChange={(e) => {
                            const updatedMeals = e.target.checked
                              ? [...(field.value || []), meal]
                              : (field.value || []).filter((m) => m !== meal);
                            field.onChange(updatedMeals);
                          }}
                          className="h-4 w-4"
                        />
                        <span className="text-sm capitalize">{meal}</span>
                      </div>
                    )
                  )}
                </div>
              </FormItem>
            )}
          />
        )}

        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-base sm:text-lg font-semibold">
            Additional Attendees
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <FormField
              control={form.control}
              name="adultsCount"
              render={({ field }) => (
                <FormItem className="space-y-2 sm:space-y-3">
                  <FormLabel className="text-sm sm:text-base">
                    Additional Adults (excluding yourself)
                  </FormLabel>
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
                  <FormLabel className="text-sm sm:text-base">
                    Number of Kids (9-13)
                  </FormLabel>
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
                  <FormLabel className="text-sm sm:text-base">
                    Number of Kids (3-8)
                  </FormLabel>
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
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
              Adults
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {additionalAdultsFields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`additionalAdults.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="space-y-2 sm:space-y-3">
                      <FormLabel className="text-sm sm:text-base">
                        Adult Name ({index + 1})
                      </FormLabel>
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
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
              Kids (9-13)
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {additionalKids9to13Fields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`additionalKids9to13.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="space-y-2 sm:space-y-3">
                      <FormLabel className="text-sm sm:text-base">
                        Kid Name ({index + 1})
                      </FormLabel>
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
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
              Kids (3-8)
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {additionalKids3to8Fields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`additionalKids3to8.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="space-y-2 sm:space-y-3">
                      <FormLabel className="text-sm sm:text-base">
                        Kid Name ({index + 1})
                      </FormLabel>
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

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total Amount:</span>
            <span className="text-lg font-bold">${totalAmount.toFixed(2)}</span>
          </div>
          {watchPackage === "Day Visitors" && (
            <div className="text-sm text-muted-foreground mt-2">
              <p>
                Entry Fee: $
                {(1 +
                  parseInt(watchAdultsCount) +
                  parseInt(watchKids913Count) +
                  parseInt(watchKids38Count)) *
                  16}
              </p>
              {(watchSelectedMeals ?? []).length > 0 && (
                <p>
                  Meals: $
                  {totalAmount -
                    (1 +
                      parseInt(watchAdultsCount) +
                      parseInt(watchKids913Count) +
                      parseInt(watchKids38Count)) *
                      16}
                </p>
              )}
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-10 text-sm sm:text-base mt-6"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Continue to Payment"}
        </Button>
      </form>
    </Form>
  );
};

interface PaymentDetailsProps {
  onSuccess?: () => void;
}

export const PaymentDetails = ({ onSuccess }: PaymentDetailsProps) => {
  const [registrationData, setRegistrationData] = useState<any>(null);

  useEffect(() => {
    const storedData = localStorage.getItem("registration_data");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setRegistrationData(parsedData);
    }
  }, []);

  const handlePaymentSubmit = async () => {
    try {
      const registrationData = JSON.parse(
        localStorage.getItem("registration_data") || ""
      );

      // Create registration in backend
      const response = await axios.post(
        API_ENDPOINTS.REGISTRATION,
        registrationData
      );

      if (!response.data) {
        throw new Error("Failed to create registration");
      }

      toast({
        title: "Success",
        description: "Registration completed successfully.",
      });
      onSuccess?.();
    } catch (error) {
      console.error("Registration failed:", error);
      toast({
        title: "Registration Failed",
        description:
          error instanceof Error
            ? error.message
            : "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  if (!registrationData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Payment Details</h3>
        <div className="space-y-2">
          <p className="text-sm">
            Selected Package: {registrationData.selected_package}
          </p>
          <p className="text-sm">
            Number of Adults: {registrationData.no_of_adults}
          </p>
          <p className="text-sm">
            Children (9-13): {registrationData.no_of_children_9_13}
          </p>
          <p className="text-sm">
            Children (3-8): {registrationData.no_of_children_3_8}
          </p>
          {registrationData.selected_package === "Day Visitors" && (
            <p className="text-sm">
              Meals Included: {registrationData.selected_meals}
            </p>
          )}
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Amount:</span>
              <span className="text-lg font-bold">
                ${registrationData.total_amount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-base font-semibold">Bank Transfer Details</h4>
        <div className="space-y-2 text-sm">
          <p>Account Name: {bankDetails.accountName}</p>
          <p>Bank Name: {bankDetails.bankName}</p>
          <p>Account Number: {bankDetails.accountNumber}</p>
          <p>BSB: {bankDetails.bsb}</p>
          <div className="mt-4 p-4 bg-primary/5 rounded-lg">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                1. Please transfer the total amount ($
                {registrationData.total_amount.toFixed(2)}) to the above
                mentioned bank account and send the receipt to
                aibfmelb@gmail.com
              </p>
              <p className="text-sm text-muted-foreground">
                2. Click Complete Registration to finish the registration
                process.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Button type="button" onClick={handlePaymentSubmit} className="w-full">
        Complete Registration
      </Button>
    </div>
  );
};
