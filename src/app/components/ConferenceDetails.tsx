import { Button } from "@/components/ui/button";
import Container from "@/components/ui/Container";
import { Calendar, MapPin, ArrowRight, DollarSign, Check } from "lucide-react";
import aibf_25_2_poster from "../../assets/aibf_25_2.jpeg";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "@/constants/api";
import { feeStructure } from "@/constants/fees";

interface Event {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  venue: string;
  poster_url: string;
  is_registered?: boolean;
}

interface ConferenceDetailsProps {
  onRegisterClick: () => void;
  onRegistrationSuccess?: () => void;
}

// Utility function to calculate days to the event
const calculateDaysToEvent = (): number => {
  const today = new Date();
  const eventStart = new Date("2025-04-24");
  const timeDiff = eventStart.getTime() - today.getTime();
  return Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));
};

export const ConferenceDetails: React.FC<ConferenceDetailsProps> = ({
  onRegisterClick,
}) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [daysToEvent, setDaysToEvent] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasCompleteProfile, setHasCompleteProfile] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isRegistrationClosed, ] = useState(true);

  const checkProfileCompleteness = (userDetails: any) => {
    return !!(
      userDetails?.city &&
      userDetails?.state &&
      userDetails?.address &&
      userDetails?.phone
    );
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const response = await axios.get(${API_ENDPOINTS.USERS}${userId}/);
      const userDetails = response.data;
      setHasCompleteProfile(checkProfileCompleteness(userDetails));
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setHasCompleteProfile(false);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const fetchLatestEvent = async () => {
    try {
      const userDetailsString = localStorage.getItem("user_details");
      const userDetails = userDetailsString
        ? JSON.parse(userDetailsString)
        : null;
      const userEmail = userDetails?.email;
      const userId = userDetails?.id;

      setIsLoggedIn(!!userEmail);

      if (userId) {
        fetchUserProfile(userId);
      } else {
        setIsLoadingProfile(false);
      }

      const params: { latest?: boolean; email?: string } = { latest: true };
      if (userEmail) {
        params.email = userEmail;
      }

      const response = await axios.get(API_ENDPOINTS.EVENTS, { params });

      if (response.data && response.data.length > 0) {
        const latestEvent = response.data[0];
        setEvent(latestEvent);

        // Set registration status
        setIsRegistered(latestEvent.is_registered || false);

        // Calculate days to event
        setDaysToEvent(calculateDaysToEvent());
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkLoginStatus = () => {
      const hasAccess = localStorage.getItem("access") !== null;
      setIsLoggedIn(hasAccess);
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  useEffect(() => {
    fetchLatestEvent();
  }, []);

  if (loading) {
    return (
      <div className="py-8 sm:py-16 bg-background">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 items-start">
            {/* Skeleton Poster */}
            <div className="relative group max-w-md mx-auto lg:max-w-none w-full">
              <div
                className="aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden 
                bg-gray-200 dark:bg-gray-700 animate-pulse"
              />
              <div
                className="absolute top-2 sm:top-4 right-2 sm:right-4 
                bg-gray-300 dark:bg-gray-600 
                w-24 h-8 rounded-full animate-pulse"
              />
            </div>

            {/* Skeleton Details */}
            <div className="space-y-6 sm:space-y-8">
              <div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 w-3/4 animate-pulse" />
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              </div>

              {/* Skeleton Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                    rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center space-x-3 sm:space-x-4 animate-pulse"
                  >
                    <div
                      className="bg-gray-300 dark:bg-gray-600 
                      p-2 sm:p-3 rounded-full w-12 h-12"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Skeleton Button */}
              <div
                className="h-12 bg-gray-200 dark:bg-gray-700 
                rounded-lg sm:rounded-xl w-full lg:w-2/3 animate-pulse"
              />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="py-8 sm:py-16 bg-background">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 items-start">
            {/* Skeleton Poster */}
            <div className="relative group max-w-md mx-auto lg:max-w-none w-full">
              <div
                className="aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden 
                bg-gray-200 dark:bg-gray-700 animate-pulse"
              />
              <div
                className="absolute top-2 sm:top-4 right-2 sm:right-4 
                bg-gray-300 dark:bg-gray-600 
                w-24 h-8 rounded-full animate-pulse"
              />
            </div>

            {/* Skeleton Details */}
            <div className="space-y-6 sm:space-y-8">
              <div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 w-3/4 animate-pulse" />
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              </div>

              {/* Skeleton Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                    rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center space-x-3 sm:space-x-4 animate-pulse"
                  >
                    <div
                      className="bg-gray-300 dark:bg-gray-600 
                      p-2 sm:p-3 rounded-full w-12 h-12"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Skeleton Button */}
              <div
                className="h-12 bg-gray-200 dark:bg-gray-700 
                rounded-lg sm:rounded-xl w-full lg:w-2/3 animate-pulse"
              />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-16 bg-background">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 items-start">
          {/* Event Poster with Modern Styling */}
          <div className="relative group max-w-md mx-auto lg:max-w-none w-full">
            <div
              className="aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden 
              shadow-lg sm:shadow-2xl transition-all duration-300 
              group-hover:shadow-xl group-hover:scale-[1.02]"
            >
              <img
                src={event.poster_url || aibf_25_2_poster}
                alt={${event.name}}
                className="w-full h-full object-cover 
                transform transition-transform duration-300 
                group-hover:scale-110"
              />
            </div>
            {daysToEvent !== null && (
              <div
                className="absolute top-2 sm:top-4 right-2 sm:right-4 
                bg-primary/90 text-primary-foreground 
                px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold
                shadow-lg"
              >
                {daysToEvent} {daysToEvent === 1 ? "day" : "days"} to go
              </div>
            )}
          </div>

          {/* Event Details with Modern Typography and Layout */}
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h1
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight 
                bg-gradient-to-r from-foreground via-primary to-primary/70 
                text-transparent bg-clip-text
                dark:from-white dark:via-white dark:to-primary
                mb-3 sm:mb-4"
              >
                {event.name}
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Modern Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {[
                {
                  icon: Calendar,
                  title: "Event Dates",
                  content: "April 24 - 27, 2025",
                },
                {
                  icon: MapPin,
                  title: "Location",
                  content: event.venue,
                },
                {
                  icon: DollarSign,
                  title: "Fee Structure",
                  content: (
                    <div className="space-y-3 sm:space-y-4">
                      {feeStructure.map((pkg) => (
                        <div key={pkg.name} className="space-y-2">
                          <h4 className="font-semibold text-primary text-sm sm:text-base">
                            {pkg.name}
                          </h4>
                          <div className="space-y-1 text-xs sm:text-sm">
                            {pkg.isDayVisitor ? (
                              <>
                                <div className="flex justify-between">
                                  <span>Entry Fee (Per Person)</span>
                                  <span className="font-semibold">
                                    ${pkg.adultPrice}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 mb-2">
                                  Optional Meal Prices:
                                </p>
                                <div className="flex justify-between">
                                  <span>Adult (14+)</span>
                                  <span className="font-semibold">
                                    ${pkg.mealPrices?.adult}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Children (9-13)</span>
                                  <span className="font-semibold">
                                    ${pkg.mealPrices?.kids913}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Children (3-8)</span>
                                  <span className="font-semibold">
                                    ${pkg.mealPrices?.kids38}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex justify-between">
                                  <span>Adult (14+)</span>
                                  <span className="font-semibold">
                                    ${pkg.adultPrice}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Children (9-13)</span>
                                  <span className="font-semibold">
                                    ${pkg.child9to13Price}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Children (3-8)</span>
                                  <span className="font-semibold">
                                    ${pkg.child3to8Price}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {pkg.description}
                            {(pkg.name === "Package 1 (Thu-Sun)" ||
                              pkg.name === "Package 2 (Fri-Sun)") && (
                              <span className="text-xs text-green-600 block mt-1 italic">
                                50% Discount Offer: Applied automatically on the
                                total amount at checkout!
                              </span>
                            )}
                          </p>
                        </div>
                      ))}

                      {/* Additional Information */}
                      <div className="space-y-1 text-xs text-muted-foreground mt-3 sm:mt-4 text-left">
                        <p className="font-semibold mb-2">Please Note:</p>
                        <p>• All prices include GST.</p>
                        <p>
                          • The camp is{" "}
                          <span className="font-medium">free</span> for infants
                          under 3 years.
                        </p>
                        <p>
                          •{" "}
                          <span className="font-medium">
                            No registration fees
                          </span>{" "}
                          are required for interstate guests.
                        </p>
                        <p>
                          • Families from Victoria are required to pay a
                          <span className="font-medium">
                            {" "}
                            registration fee of $100
                          </span>
                          .
                        </p>
                        <p>
                          • A <span className="font-medium">50% discount</span>{" "}
                          applies to accommodation and food expenses for Package
                          1 and Package 2.
                        </p>
                        <p>
                          • Check in Time{" "}
                          <span className="font-medium">Thursday 4:00 PM</span>{" "}
                          and Check out Time{" "}
                          <span className="font-medium">Sunday 1:00 PM</span>.
                        </p>
                      </div>
                    </div>
                  ),
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={bg-card border rounded-lg sm:rounded-xl p-3 sm:p-4 
                  hover:shadow-md transition-all duration-300 
                  hover:border-primary/50 group
                  ${
                    item.title === "Fee Structure"
                      ? "col-span-1 sm:col-span-2"
                      : ""
                  }}
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div
                      className="bg-primary/10 p-2 sm:p-3 rounded-full 
                      group-hover:bg-primary/20 transition-colors"
                    >
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-sm sm:text-base">
                        {item.title}
                      </h3>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        {item.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Register Button */}
            <div className="flex flex-col items-center gap-3">
              <Button
                onClick={onRegisterClick}
                className="w-full lg:w-2/3 h-9 sm:h-10 text-sm sm:text-base group"
                disabled={
                  isRegistrationClosed ||
                  isRegistered ||
                  !isLoggedIn ||
                  (isLoggedIn && !hasCompleteProfile)
                }
              >
                {isRegistrationClosed ? (
                    <>
                      Registration Closed
                      <Check className="ml-2 h-4 w-4 text-destructive" />
                    </>
                   )
                 : isRegistered ? (
                  <>
                    Already Registered
                    <Check className="ml-2 h-4 w-4 text-green-500" />
                  </>
                ) : !isLoggedIn ? (
                  <>
                    Register Now
                    <ArrowRight className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                  </>
                ) : !hasCompleteProfile ? (
                  <>
                    Complete Profile to Register
                    <ArrowRight className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </>
                ) : (
                  <>
                    Register Now
                    <ArrowRight className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
              {!isLoggedIn && !isRegistered && (
                <p className="text-sm text-muted-foreground">
                  Please{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = "/login";
                    }}
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    login
                  </a>{" "}
                  to register for the conference
                </p>
              )}
              {isLoggedIn &&
                !isRegistered &&
                !hasCompleteProfile &&
                !isLoadingProfile && (
                  <p className="text-sm text-muted-foreground">
                    Please{" "}
                    <a
                      href="/profile"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      update your profile
                    </a>{" "}
                    with required details to register
                  </p>
                )}
            </div>

            {/* Registration Success Message */}
            {isRegistered && (
              <div
                className="mt-4 p-3 sm:p-4 
                bg-gradient-to-r from-green-50 to-green-100 
                border border-green-200 
                rounded-lg sm:rounded-xl 
                text-center 
                shadow-md"
              >
                <h2 className="text-lg sm:text-xl font-bold text-green-800 mb-2">
                  Thank you for your registration!
                </h2>
                <p className="text-sm sm:text-base text-green-600">
                  We look forward to seeing you at the event.
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
