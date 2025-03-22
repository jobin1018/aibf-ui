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
import { Download, Check, X } from "lucide-react";
import * as XLSX from "xlsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  selected_meals: string;
  no_of_adults: number;
  no_of_children_9_13: number;
  no_of_children_3_8: number;
  additional_adults: string;
  additional_kids_9_13: string;
  additional_kids_3_8: string;
  registration_date: string;
  payment_status: boolean;
}

export function DashboardPage() {
  const [registrations, setRegistrations] = useState<UserRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
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
        "Selected Meals": reg.selected_meals,
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
        "Payment Status": reg.payment_status ? "Paid" : "Pending",
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

  const handlePaymentStatusChange = async (
    registrationId: string,
    newStatus: boolean
  ) => {
    try {
      await axios.patch(
        `${API_ENDPOINTS.REGISTRATION}${registrationId}/`,
        { payment_status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );

      // Update local state
      setRegistrations((prevRegistrations) =>
        prevRegistrations.map((reg) =>
          reg.id === registrationId
            ? { ...reg, payment_status: newStatus }
            : reg
        )
      );

      toast({
        title: "Success",
        description: "Payment status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment status",
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
              <TableHead>Selected Meals</TableHead>
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
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((cell) => (
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
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-bold">
          AIBF 2025 - Registered Users
        </h1>
        {registrations.length > 0 && (
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            className="w-full md:w-auto"
          >
            <Download className="md:mr-2 h-4 w-4" />
            <span className="hidden md:inline">Export to Excel</span>
          </Button>
        )}
      </div>
      {registrations.length === 0 ? (
        <div className="overflow-x-auto rounded-lg border">
          <Table className="min-w-[800px] md:min-w-full">
            <TableCaption>No registrations found</TableCaption>
            <TableHeader className="bg-gray-50 dark:bg-gray-800">
              <TableRow>
                <TableHead className="px-2 md:px-4 py-2 text-xs md:text-sm">
                  Name
                </TableHead>
                <TableHead className="px-2 md:px-4 py-2 text-xs md:text-sm">
                  Email
                </TableHead>
                <TableHead className="px-2 md:px-4 py-2 text-xs md:text-sm">
                  Phone
                </TableHead>
                <TableHead className="px-2 md:px-4 py-2 text-xs md:text-sm">
                  City
                </TableHead>
                <TableHead className="px-2 md:px-4 py-2 text-xs md:text-sm">
                  Address
                </TableHead>
                <TableHead className="px-2 md:px-4 py-2 text-xs md:text-sm">
                  Package
                </TableHead>
                <TableHead className="px-2 md:px-4 py-2 text-xs md:text-sm">
                  Selected Meals
                </TableHead>
                <TableHead className="px-2 md:px-4 py-2 text-xs md:text-sm">
                  No. of Adults
                </TableHead>
                <TableHead className="px-2 md:px-4 py-2 text-xs md:text-sm">
                  Additional Adults
                </TableHead>
                <TableHead className="px-2 md:px-4 py-2 text-xs md:text-sm">
                  No. of Children (9-13)
                </TableHead>
                <TableHead className="px-2 md:px-4 py-2 text-xs md:text-sm">
                  No. of Children (3-8)
                </TableHead>
                <TableHead className="px-2 md:px-4 py-2 text-xs md:text-sm">
                  Additional Kids (9-13)
                </TableHead>
                <TableHead className="px-2 md:px-4 py-2 text-xs md:text-sm">
                  Additional Kids (3-8)
                </TableHead>
                <TableHead className="px-2 md:px-4 py-2 text-xs md:text-sm">
                  Registration Date
                </TableHead>
                <TableHead className="px-2 md:px-4 py-2 text-xs md:text-sm">
                  Payment Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((row) => (
                <TableRow key={row}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((cell) => (
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
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table className="min-w-[800px] md:min-w-full">
            <TableCaption>List of Registered Users</TableCaption>
            <TableHeader className="bg-gray-50 dark:bg-gray-800">
              <TableRow>
                <TableHead className="px-2 md:px-4 py-2 text-xs md:text-sm">
                  Name
                </TableHead>
                <TableHead className="px-2 md:px-4 py-2 text-xs md:text-sm">
                  Email
                </TableHead>
                <TableHead className="px-2 md:px-4 py-2 text-xs md:text-sm">
                  Phone
                </TableHead>
                <TableHead className="px-2 md:px-4 py-2 text-xs md:text-sm">
                  City
                </TableHead>
                <TableHead className="px-2 md:px-4 py-2 text-xs md:text-sm">
                  Address
                </TableHead>
                <TableHead className="px-2 md:px-4 py-2 text-xs md:text-sm">
                  Package
                </TableHead>
                <TableHead className="px-2 md:px-4 py-2 text-xs md:text-sm">
                  Selected Meals
                </TableHead>
                <TableHead className="px-2 md:px-4 py-2 text-xs md:text-sm">
                  No. of Adults
                </TableHead>
                <TableHead className="px-2 md:px-4 py-2 text-xs md:text-sm">
                  Additional Adults
                </TableHead>
                <TableHead className="px-2 md:px-4 py-2 text-xs md:text-sm">
                  No. of Children (9-13)
                </TableHead>
                <TableHead className="px-2 md:px-4 py-2 text-xs md:text-sm">
                  No. of Children (3-8)
                </TableHead>
                <TableHead className="px-2 md:px-4 py-2 text-xs md:text-sm">
                  Additional Kids (9-13)
                </TableHead>
                <TableHead className="px-2 md:px-4 py-2 text-xs md:text-sm">
                  Additional Kids (3-8)
                </TableHead>
                <TableHead className="px-2 md:px-4 py-2 text-xs md:text-sm">
                  Registration Date
                </TableHead>
                <TableHead className="px-2 md:px-4 py-2 text-xs md:text-sm">
                  Payment Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.map((registration) => (
                <TableRow key={registration.id}>
                  <TableCell className="px-2 md:px-4 py-2 text-xs md:text-sm">
                    {registration.user_name}
                  </TableCell>
                  <TableCell className="px-2 md:px-4 py-2 text-xs md:text-sm">
                    {registration.email}
                  </TableCell>
                  <TableCell className="px-2 md:px-4 py-2 text-xs md:text-sm">
                    {registration.phone}
                  </TableCell>
                  <TableCell className="px-2 md:px-4 py-2 text-xs md:text-sm">
                    {registration.city}
                  </TableCell>
                  <TableCell className="px-2 md:px-4 py-2 text-xs md:text-sm">
                    {registration.address}
                  </TableCell>
                  <TableCell className="px-2 md:px-4 py-2 text-xs md:text-sm">
                    {registration.selected_package}
                  </TableCell>
                  <TableCell className="px-2 md:px-4 py-2 text-xs md:text-sm">
                    {registration.selected_meals}
                  </TableCell>
                  <TableCell className="px-2 md:px-4 py-2 text-xs md:text-sm">
                    {registration.no_of_adults}
                  </TableCell>
                  <TableCell className="px-2 md:px-4 py-2 text-xs md:text-sm">
                    {registration.additional_adults}
                  </TableCell>
                  <TableCell className="px-2 md:px-4 py-2 text-xs md:text-sm">
                    {registration.no_of_children_9_13}
                  </TableCell>
                  <TableCell className="px-2 md:px-4 py-2 text-xs md:text-sm">
                    {registration.no_of_children_3_8}
                  </TableCell>
                  <TableCell className="px-2 md:px-4 py-2 text-xs md:text-sm">
                    {registration.additional_kids_9_13}
                  </TableCell>
                  <TableCell className="px-2 md:px-4 py-2 text-xs md:text-sm">
                    {registration.additional_kids_3_8}
                  </TableCell>
                  <TableCell className="px-2 md:px-4 py-2 text-xs md:text-sm">
                    {registration.registration_date
                      ? new Date(
                          registration.registration_date
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: window.innerWidth < 768 ? "short" : "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </TableCell>
                  <TableCell className="px-2 md:px-4 py-2 text-xs md:text-sm">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-full justify-start p-0 font-normal"
                        >
                          <Badge
                            className="text-xs md:text-sm cursor-pointer"
                            variant={
                              registration.payment_status
                                ? "success"
                                : "destructive"
                            }
                          >
                            {registration.payment_status ? "Paid" : "Pending"}
                          </Badge>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            handlePaymentStatusChange(registration.id, true)
                          }
                          className="text-green-600"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Mark as Paid
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handlePaymentStatusChange(registration.id, false)
                          }
                          className="text-red-600"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Mark as Pending
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
