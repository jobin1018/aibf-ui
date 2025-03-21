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
import { toast } from "@/components/ui/use-toast";
import { API_ENDPOINTS } from "@/constants/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";

// Define the type for user registration
interface UserRegistration {
  address: string;
  city: string;
  user_name: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  selected_package: string;
  no_of_adults: number;
  no_of_children_9_13: number;
  no_of_children_3_8: number;
  additional_adults: string;
  additional_kids_9_13: string;
  additional_kids_3_8: string;
  registration_date: string;
  payment_status: string;
}

export function DashboardPage() {
  const [registrations, setRegistrations] = useState<UserRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        });
      }
    };

    fetchRegistrations();
  }, []);

  const handleExport = () => {
    try {
      const exportData = registrations.map((reg) => ({
        Name: reg.user_name,
        Email: reg.email,
        Phone: reg.phone,
        City: reg.city,
        Address: reg.address,
        Package: reg.selected_package,
        "No. of Adults": reg.no_of_adults,
        "Additional Adults": reg.additional_adults,
        "No. of Children (9-13)": reg.no_of_children_9_13,
        "No. of Children (3-8)": reg.no_of_children_3_8,
        "Additional Kids (9-13)": reg.additional_kids_9_13,
        "Additional Kids (3-8)": reg.additional_kids_3_8,
        "Registration Date": reg.registration_date
          ? new Date(reg.registration_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "N/A",
        "Payment Status": reg.payment_status,
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Registrations");
      XLSX.writeFile(wb, "aibf-registrations_2025.xlsx");

      toast({
        title: "Success",
        description: "Registration data exported successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to export registration data",
        variant: "destructive",
      });
    }
  };

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
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>No. of Adults</TableHead>
              <TableHead>Additional Adults</TableHead>
              <TableHead>No. of Children (9-13)</TableHead>
              <TableHead>No. of Children (3-8)</TableHead>
              <TableHead>Additional Kids (9-13)</TableHead>
              <TableHead>Additional Kids (3-8)</TableHead>
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">AIBF 2025 - Registered Users</h1>
        {registrations.length > 0 && (
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export to Excel
          </Button>
        )}
      </div>
      {registrations.length === 0 ? (
        <Table>
          <TableCaption>No registrations found</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>No. of Adults</TableHead>
              <TableHead>Additional Adults</TableHead>
              <TableHead>No. of Children (9-13)</TableHead>
              <TableHead>No. of Children (3-8)</TableHead>
              <TableHead>Additional Kids (9-13)</TableHead>
              <TableHead>Additional Kids (3-8)</TableHead>
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
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>No. of Adults</TableHead>
              <TableHead>Additional Adults</TableHead>
              <TableHead>No. of Children (9-13)</TableHead>
              <TableHead>No. of Children (3-8)</TableHead>
              <TableHead>Additional Kids (9-13)</TableHead>
              <TableHead>Additional Kids (3-8)</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead>Payment Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.map((registration) => (
              <TableRow key={registration.id}>
                <TableCell>{registration.user_name}</TableCell>
                <TableCell>{registration.email}</TableCell>
                <TableCell>{registration.phone}</TableCell>
                <TableCell>{registration.city}</TableCell>
                <TableCell>{registration.address}</TableCell>
                <TableCell>{registration.selected_package}</TableCell>
                <TableCell>{registration.no_of_adults}</TableCell>
                <TableCell>{registration.additional_adults}</TableCell>
                <TableCell>{registration.no_of_children_9_13}</TableCell>
                <TableCell>{registration.no_of_children_3_8}</TableCell>
                <TableCell>{registration.additional_kids_9_13}</TableCell>
                <TableCell>{registration.additional_kids_3_8}</TableCell>
                <TableCell>
                  {registration.registration_date
                    ? new Date(
                        registration.registration_date
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      registration.payment_status === "paid"
                        ? "success"
                        : "destructive"
                    }
                  >
                    {registration.payment_status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
