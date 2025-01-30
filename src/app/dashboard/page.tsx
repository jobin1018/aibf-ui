import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { toast } from "@/components/ui/toast";
import { API_ENDPOINTS } from "@/constants/api";
import { Badge } from "@/components/ui/badge";

// Define the type for user registration
interface UserRegistration {
  user_name: string;
  email: string;
  city: string;
  state: string;
  phone: string;
  additional_adults: number;
  additional_kids: number;
  registration_date: string;
  payment_status: boolean;
}

export const DashboardPage = () => {
  const [registrations, setRegistrations] = useState<UserRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Utility function to format date
  const formatRegistrationDate = (isoDateString: string) => {
    const date = new Date(isoDateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(date);
  };

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(API_ENDPOINTS.REGISTRATION, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        });

        setRegistrations(response.data);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch registrations");
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Unable to fetch registrations",
          variant: "destructive",
          message: "",
        });
      }
    };

    fetchRegistrations();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">
          AIBF 2025 - Registered Users
        </h1>
        <Table>
          <TableCaption>Loading registrations...</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>User Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>City</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Additional Attendees (Adults)</TableHead>
              <TableHead>Additional Attendees (Kids)</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead>Payment Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((row) => (
              <TableRow key={row}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((cell) => (
                  <TableCell key={cell}>
                    <div
                      className="h-4 bg-gray-200 dark:bg-gray-700 
                      rounded w-full animate-pulse"
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">AIBF 2025 - Registered Users</h1>
      {registrations.length === 0 ? (
        <Table>
          <TableCaption>No registrations found</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>User Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>City</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Additional Attendees (Adults)</TableHead>
              <TableHead>Additional Attendees (Kids)</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead>Payment Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((row) => (
              <TableRow key={row}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((cell) => (
                  <TableCell key={cell}>
                    <div
                      className="h-4 bg-gray-200 dark:bg-gray-700 
                      rounded w-full animate-pulse"
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Table>
          <TableCaption>List of Registered Users</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>User Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>City</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Additional Attendees (Adults)</TableHead>
              <TableHead>Additional Attendees (Kids)</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead>Payment Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.map((registration, index) => (
              <TableRow key={index}>
                <TableCell>{registration.user_name}</TableCell>
                <TableCell>{registration.email}</TableCell>
                <TableCell>{registration.city}</TableCell>
                <TableCell>{registration.state}</TableCell>
                <TableCell>{registration.phone}</TableCell>
                <TableCell>{registration.additional_adults}</TableCell>
                <TableCell>{registration.additional_kids}</TableCell>
                <TableCell>
                  {formatRegistrationDate(registration.registration_date)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={registration.payment_status ? "success" : "error"}
                  >
                    {registration.payment_status ? "Paid" : "Pending"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
