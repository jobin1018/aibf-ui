import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { API_ENDPOINTS } from "@/constants/api";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
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
  total_amount: number;
  total_fee: number;
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
        "Total Fee": reg.total_fee,
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

  const handleStatusChange = async (
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
        <div className="relative overflow-hidden border rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="sticky left-0 z-30 bg-gray-50 dark:bg-gray-800 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[150px]">
                    Name
                  </th>
                  <th className="sticky left-[150px] z-30 bg-gray-50 dark:bg-gray-800 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[200px]">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider min-w-[120px]">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Package
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Selected Meals
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    No. of Adults
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Additional Adults
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    No. of Children (9-13)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    No. of Children (3-8)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Additional Kids (9-13)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Additional Kids (3-8)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Registration Date
                  </th>
                  <th className="sticky right-[180px] z-30 bg-gray-50 dark:bg-gray-800 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[120px]">
                    Total Fee
                  </th>
                  <th className="sticky right-0 z-30 bg-gray-50 dark:bg-gray-800 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[180px]">
                    Payment Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-950 divide-y divide-gray-200 dark:divide-gray-800">
                {[1, 2, 3, 4, 5].map((row) => (
                  <tr key={row}>
                    {[
                      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
                    ].map((cell) => (
                      <td
                        key={cell}
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          cell === 1
                            ? "sticky left-0 z-20 bg-white dark:bg-gray-950 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[150px]"
                            : cell === 2
                            ? "sticky left-[150px] z-20 bg-white dark:bg-gray-950 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[200px]"
                            : cell === 15
                            ? "sticky right-[180px] z-20 bg-white dark:bg-gray-950 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[120px]"
                            : cell === 16
                            ? "sticky right-0 z-20 bg-white dark:bg-gray-950 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[180px]"
                            : cell === 3
                            ? "min-w-[120px]"
                            : ""
                        }`}
                      >
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
        <div className="relative overflow-hidden border rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="sticky left-0 z-30 bg-gray-50 dark:bg-gray-800 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[150px]">
                    Name
                  </th>
                  <th className="sticky left-[150px] z-30 bg-gray-50 dark:bg-gray-800 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[200px]">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider min-w-[120px]">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Package
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Selected Meals
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    No. of Adults
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Additional Adults
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    No. of Children (9-13)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    No. of Children (3-8)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Additional Kids (9-13)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Additional Kids (3-8)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Registration Date
                  </th>
                  <th className="sticky right-[180px] z-30 bg-gray-50 dark:bg-gray-800 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[120px]">
                    Total Fee
                  </th>
                  <th className="sticky right-0 z-30 bg-gray-50 dark:bg-gray-800 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[180px]">
                    Payment Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-950 divide-y divide-gray-200 dark:divide-gray-800">
                {[1, 2, 3].map((row) => (
                  <tr key={row}>
                    {[
                      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
                    ].map((cell) => (
                      <td
                        key={cell}
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          cell === 1
                            ? "sticky left-0 z-20 bg-white dark:bg-gray-950 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[150px]"
                            : cell === 2
                            ? "sticky left-[150px] z-20 bg-white dark:bg-gray-950 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[200px]"
                            : cell === 15
                            ? "sticky right-[180px] z-20 bg-white dark:bg-gray-950 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[120px]"
                            : cell === 16
                            ? "sticky right-0 z-20 bg-white dark:bg-gray-950 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[180px]"
                            : cell === 3
                            ? "min-w-[120px]"
                            : ""
                        }`}
                      >
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden border rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="sticky left-0 z-30 bg-gray-50 dark:bg-gray-800 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[150px]">
                    Name
                  </th>
                  <th className="sticky left-[150px] z-30 bg-gray-50 dark:bg-gray-800 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[200px]">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider min-w-[120px]">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Package
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Selected Meals
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    No. of Adults
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Additional Adults
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    No. of Children (9-13)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    No. of Children (3-8)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Additional Kids (9-13)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Additional Kids (3-8)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Registration Date
                  </th>
                  <th className="sticky right-[180px] z-30 bg-gray-50 dark:bg-gray-800 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[120px]">
                    Total Fee
                  </th>
                  <th className="sticky right-0 z-30 bg-gray-50 dark:bg-gray-800 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[180px]">
                    Payment Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-950 divide-y divide-gray-200 dark:divide-gray-800">
                {registrations.map((registration) => (
                  <tr key={registration.id}>
                    <td className="sticky left-0 z-20 bg-white dark:bg-gray-950 px-6 py-4 whitespace-nowrap text-sm shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[150px]">
                      {registration.user_name}
                    </td>
                    <td className="sticky left-[150px] z-20 bg-white dark:bg-gray-950 px-6 py-4 whitespace-nowrap text-sm shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[200px]">
                      {registration.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm min-w-[120px]">
                      {registration.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {registration.city}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {registration.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {registration.selected_package}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {registration.selected_meals}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {registration.no_of_adults}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {registration.additional_adults}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {registration.no_of_children_9_13}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {registration.no_of_children_3_8}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {registration.additional_kids_9_13}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {registration.additional_kids_3_8}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(
                        registration.registration_date
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="sticky right-[180px] z-20 bg-white dark:bg-gray-950 px-6 py-4 whitespace-nowrap text-sm shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[120px] font-medium">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                        ${registration.total_fee}
                      </span>
                    </td>
                    <td className="sticky right-0 z-20 bg-white dark:bg-gray-950 px-6 py-4 whitespace-nowrap text-sm shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[180px]">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant={
                              registration.payment_status
                                ? "default"
                                : "destructive"
                            }
                            size="sm"
                            className={`cursor-pointer ${
                              registration.payment_status
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : ""
                            }`}
                          >
                            {registration.payment_status ? "Paid" : "Pending"}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg">
                          <DropdownMenuLabel className="font-medium border-b border-gray-200 dark:border-gray-800">
                            Change Payment Status
                          </DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(registration.id, true)
                            }
                            className="cursor-pointer hover:bg-green-50 dark:hover:bg-green-950 flex items-center gap-2 focus:bg-green-50 dark:focus:bg-green-950"
                          >
                            <span className="h-2 w-2 rounded-full bg-green-500"></span>
                            Mark as Paid
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(registration.id, false)
                            }
                            className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-950 flex items-center gap-2 focus:bg-red-50 dark:focus:bg-red-950"
                          >
                            <span className="h-2 w-2 rounded-full bg-red-500"></span>
                            Mark as Pending
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
