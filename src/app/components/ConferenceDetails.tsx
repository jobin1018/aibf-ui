import { Button } from "@/components/ui/button";
import Container from "@/components/ui/Container";
import { Calendar, Clock, MapPin, Users, ArrowRight } from "lucide-react";
import aibf_25_2_poster from "../../assets/aibf_25_2.jpeg";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "@/constants/api";
import { formatTime } from "@/utils/timeFormat";

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
  onRegisterClick: (onSuccess: () => void) => void;
  onRegistrationSuccess?: () => void;
}

// Utility function to calculate days between dates
const calculateDaysBetween = (eventDate: string): number => {
  const today = new Date();
  const event = new Date(eventDate);
  const timeDiff = event.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

export const ConferenceDetails: React.FC<ConferenceDetailsProps> = ({
  onRegisterClick,
  onRegistrationSuccess,
}) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [daysToEvent, setDaysToEvent] = useState<number | null>(null);

  const fetchLatestEvent = async () => {
    try {
      const userDetailsString = localStorage.getItem("user_details");
      const userDetails = userDetailsString
        ? JSON.parse(userDetailsString)
        : null;
      const userEmail = userDetails?.email;

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
        if (latestEvent.start_date) {
          const days = calculateDaysBetween(latestEvent.start_date);
          setDaysToEvent(days);
        }
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestEvent();
  }, []);

  const handleRegisterClick = () => {
    onRegisterClick(() => {
      // Callback to update registration status immediately
      setIsRegistered(true);
      fetchLatestEvent();

      // Call optional registration success callback
      onRegistrationSuccess?.();
    });
  };

  if (loading) {
    return <div>Loading event details...</div>;
  }

  if (!event) {
    return <div>No event details available</div>;
  }

  return (
    <div className="py-16 bg-background">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Event Poster with Modern Styling */}
          <div className="relative group">
            <div
              className="aspect-[3/4] rounded-2xl overflow-hidden 
              shadow-2xl transition-all duration-300 
              group-hover:shadow-xl group-hover:scale-[1.02]"
            >
              <img
                src={event.poster_url || aibf_25_2_poster}
                alt={`${event.name}`}
                className="w-full h-full object-cover 
                transform transition-transform duration-300 
                group-hover:scale-110"
              />
            </div>
            {daysToEvent !== null && (
              <div
                className="absolute top-4 right-4 
                bg-primary/90 text-primary-foreground 
                px-3 py-1 rounded-full text-sm font-semibold
                shadow-lg"
              >
                {daysToEvent} {daysToEvent === 1 ? "day" : "days"} to go
              </div>
            )}
          </div>

          {/* Event Details with Modern Typography and Layout */}
          <div className="space-y-8">
            <div>
              <h1
                className="text-4xl font-extrabold tracking-tight 
                bg-gradient-to-r from-foreground via-primary to-primary/70 
                text-transparent bg-clip-text
                dark:from-white dark:via-white dark:to-primary
                mb-4"
              >
                {event.name}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Modern Details Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  icon: Calendar,
                  title: "Date",
                  content: `${event.start_date} - ${event.end_date}`,
                },
                {
                  icon: Clock,
                  title: "Time",
                  content: `${formatTime(event.start_time)} - ${formatTime(
                    event.end_time
                  )}`,
                },
                {
                  icon: MapPin,
                  title: "Location",
                  content: event.venue,
                },
                {
                  icon: Users,
                  title: "Capacity",
                  content: "Limited to 500 attendees",
                },
              ].map(({ icon: Icon, title, content }, index) => (
                <div
                  key={index}
                  className="bg-card border rounded-xl p-4 
                  hover:shadow-md transition-all duration-300 
                  hover:border-primary/50 group"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className="bg-primary/10 p-3 rounded-full 
                      group-hover:bg-primary/20 transition-colors"
                    >
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{title}</h3>
                      <p className="text-sm text-muted-foreground">{content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Registration Button with Modern Styling */}
            <Button
              size="lg"
              className="w-full group relative 
                bg-gradient-to-r from-primary to-primary/80 
                hover:from-primary/90 hover:to-primary/70
                text-primary-foreground
                transition-all duration-300
                hover:shadow-xl hover:scale-[1.02]"
              onClick={handleRegisterClick}
              disabled={isRegistered}
            >
              {isRegistered ? "Already Registered" : "Register Now"}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>

            {/* Registration Success Message */}
            {isRegistered && (
              <div
                className="mt-4 p-4 
                bg-gradient-to-r from-green-50 to-green-100 
                border border-green-200 
                rounded-xl 
                text-center 
                shadow-md"
              >
                <h2 className="text-xl font-bold text-green-800 mb-2">
                  Registration Confirmed!
                </h2>
                <p className="text-green-600">
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
