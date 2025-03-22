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
    mode: "onChange",
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
      setIsLoading(true);
      try {
        const eventId = await fetchLatestEvent();
        if (eventId) {
          setEventId(eventId);
        } else {
          setError("No events found");
        }
      } catch (error) {
        console.error("Error fetching latest event:", error);
        setError("Failed to fetch event details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestEventAsync();
  }, []);

  useEffect(() => {
    const adultsCount = parseInt(form.watch("adultsCount") || "0", 10);
    const currentFields = additionalAdultsFields || [];

    if (adultsCount === 0) {
      // If count is 0, remove all fields
      for (let i = currentFields.length - 1; i >= 0; i--) {
        removeAdult(i);
      }
    } else if (adultsCount > currentFields.length) {
      // Add fields if needed
      for (let i = currentFields.length; i < adultsCount; i++) {
        appendAdult({ name: "" });
      }
    } else if (adultsCount < currentFields.length) {
      // Remove excess fields
      for (let i = currentFields.length - 1; i >= adultsCount; i--) {
        removeAdult(i);
      }
    }
  }, [
    form.watch("adultsCount"),
    removeAdult,
    appendAdult,
    additionalAdultsFields,
  ]);

  useEffect(() => {
    const kids9to13Count = parseInt(form.watch("kids9to13Count") || "0", 10);
    const currentFields = additionalKids9to13Fields || [];

    if (kids9to13Count === 0) {
      // If count is 0, remove all fields
      for (let i = currentFields.length - 1; i >= 0; i--) {
        removeKid9to13(i);
      }
    } else if (kids9to13Count > currentFields.length) {
      // Add fields if needed
      for (let i = currentFields.length; i < kids9to13Count; i++) {
        appendKid9to13({ name: "" });
      }
    } else if (kids9to13Count < currentFields.length) {
      // Remove excess fields
      for (let i = currentFields.length - 1; i >= kids9to13Count; i--) {
        removeKid9to13(i);
      }
    }
  }, [
    form.watch("kids9to13Count"),
    removeKid9to13,
    appendKid9to13,
    additionalKids9to13Fields,
  ]);

  useEffect(() => {
    const kids3to8Count = parseInt(form.watch("kids3to8Count") || "0", 10);
    const currentFields = additionalKids3to8Fields || [];

    if (kids3to8Count === 0) {
      // If count is 0, remove all fields
      for (let i = currentFields.length - 1; i >= 0; i--) {
        removeKid3to8(i);
      }
    } else if (kids3to8Count > currentFields.length) {
      // Add fields if needed
      for (let i = currentFields.length; i < kids3to8Count; i++) {
        appendKid3to8({ name: "" });
      }
    } else if (kids3to8Count < currentFields.length) {
      // Remove excess fields
      for (let i = currentFields.length - 1; i >= kids3to8Count; i--) {
        removeKid3to8(i);
      }
    }
  }, [
    form.watch("kids3to8Count"),
    removeKid3to8,
    appendKid3to8,
    additionalKids3to8Fields,
  ]);

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
      const registrationData = {
        event_id: eventId,
        email: values.email,
        selected_package: values.package,
        no_of_adults:
          (values.adultsCount ? parseInt(values.adultsCount) : 0) + 1, // Add 1 for the registering person
        no_of_children_9_13: values.kids9to13Count
          ? parseInt(values.kids9to13Count)
          : 0,
        no_of_children_3_8: values.kids3to8Count
          ? parseInt(values.kids3to8Count)
          : 0,
        selected_meals: values.selectedMeals?.join(", ") || "",
        additional_adults:
          values.additionalAdults?.map((adult) => adult.name).join(", ") || "",
        additional_kids_9_13:
          values.additionalKids9to13?.map((kid) => kid.name).join(", ") || "",
        additional_kids_3_8:
          values.additionalKids3to8?.map((kid) => kid.name).join(", ") || "",
        total_amount: totalFee,
        original_amount: totalFee,
        discounted_amount:
          values.package === "4-Day Package (Thu-Sun)" ||
          values.package === "3-Day Package (Fri-Sun)"
            ? totalFee * 0.5
            : totalFee,
        total_fee: (() => {
          const userDetails = JSON.parse(
            localStorage.getItem("user_details") || "{}"
          );
          const userState = (userDetails?.state || "").toLowerCase();
          const regFee =
            userState === "victoria" || userState === "vic" ? 100 : 0;
          const baseAmount =
            values.package === "4-Day Package (Thu-Sun)" ||
            values.package === "3-Day Package (Fri-Sun)"
              ? totalFee * 0.5 // Apply 50% discount for 3-day and 4-day packages
              : totalFee; // No discount for other packages
          return baseAmount + regFee;
        })(),
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
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          {/* Email field skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>

          {/* Package selection skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>

          {/* Adults count skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>

          {/* Children count skeletons */}
          <div className="space-y-2">
            <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>

          {/* Meals selection skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>

        {/* Submit button skeleton */}
        <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
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
                      defaultValue="0"
                      placeholder="0"
                      className="h-9 sm:h-10 text-sm sm:text-base"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? "0" : value);
                      }}
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
                      min="0"
                      defaultValue="0"
                      placeholder="0"
                      className="h-9 sm:h-10 text-sm sm:text-base"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? "0" : value);
                      }}
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
                      min="0"
                      defaultValue="0"
                      placeholder="0"
                      className="h-9 sm:h-10 text-sm sm:text-base"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? "0" : value);
                      }}
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem("registration_data");
    if (storedData) {
      const parsedData = JSON.parse(storedData);

      // Calculate discounted amount for 3-day and 4-day packages
      if (
        parsedData.selected_package === "3-Day Package (Fri-Sun)" ||
        parsedData.selected_package === "4-Day Package (Thu-Sun)"
      ) {
        const originalAmount = parsedData.total_amount;
        const discountedAmount = originalAmount * 0.5; // 50% discount
        parsedData.discounted_amount = discountedAmount;
        parsedData.discount_percentage = 50;
        parsedData.original_amount = originalAmount;
      }

      setRegistrationData(parsedData);
    }
  }, []);

  const handlePaymentSubmit = async () => {
    try {
      setIsSubmitting(true);
      const registrationData = JSON.parse(
        localStorage.getItem("registration_data") || ""
      );

      // If it's a 3-day or 4-day package, use the discounted amount
      if (
        registrationData.selected_package === "3-Day Package (Fri-Sun)" ||
        registrationData.selected_package === "4-Day Package (Thu-Sun)"
      ) {
        registrationData.total_amount = registrationData.total_amount * 0.5;
      }

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
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!registrationData) {
    return null;
  }

  const isDiscountedPackage =
    registrationData.selected_package === "3-Day Package (Fri-Sun)" ||
    registrationData.selected_package === "4-Day Package (Thu-Sun)";

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
            <div className="flex flex-col space-y-2">
              {isDiscountedPackage && (
                <>
                  <div className="flex justify-between items-center text-sm">
                    <span>Original Amount:</span>
                    <span className="line-through">
                      ${registrationData.original_amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-green-600">
                    <span>Discount (50%):</span>
                    <span>
                      -$
                      {(
                        registrationData.original_amount -
                        registrationData.discounted_amount
                      ).toFixed(2)}
                    </span>
                  </div>
                </>
              )}
              {(() => {
                const userDetails = JSON.parse(
                  localStorage.getItem("user_details") || "{}"
                );
                const userState = (userDetails?.state || "").toLowerCase();
                const regFee =
                  userState === "victoria" || userState === "vic" ? 100 : 0;
                return (
                  <div className="flex justify-between items-center text-sm">
                    <span>Registration Fee:</span>
                    <span>${regFee.toFixed(2)}</span>
                  </div>
                );
              })()}
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-semibold">Final Amount:</span>
                <span className="text-lg font-bold">
                  $
                  {(() => {
                    const userDetails = JSON.parse(
                      localStorage.getItem("user_details") || "{}"
                    );
                    const userState = (userDetails?.state || "").toLowerCase();
                    const regFee =
                      userState === "victoria" || userState === "vic" ? 100 : 0;
                    const baseAmount = isDiscountedPackage
                      ? registrationData.discounted_amount
                      : registrationData.total_amount;
                    return (baseAmount + regFee).toFixed(2);
                  })()}
                </span>
              </div>
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
                1. Please transfer the{" "}
                {isDiscountedPackage ? "discounted " : ""}amount ($
                {(isDiscountedPackage
                  ? registrationData.discounted_amount
                  : registrationData.total_amount
                ).toFixed(2)}
                ) to the above mentioned bank account and send the receipt to
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

      <Button
        type="button"
        onClick={handlePaymentSubmit}
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
            <span className="ml-2">Completing Registration...</span>
          </div>
        ) : (
          "Complete Registration"
        )}
      </Button>
    </div>
  );
};
