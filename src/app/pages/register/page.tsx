import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RegisterForm, PaymentDetails } from "@/app/components/RegisterForm";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface FeePackage {
  name: string;
  description: string;
  adultPrice: number;
  child9to13Price: number;
  child3to8Price: number;
}

const feeStructure: FeePackage[] = [
  {
    name: "4-Day Package (Thu-Sun)",
    description:
      "Includes 3 nights accommodation & 9 meals (3*Breakfast included)",
    adultPrice: 340,
    child9to13Price: 255,
    child3to8Price: 170,
  },
  {
    name: "3-Day Package (Fri-Sun)",
    description:
      "Includes 2 nights accommodation & 8 meals (2*Breakfast included)",
    adultPrice: 250,
    child9to13Price: 190,
    child3to8Price: 130,
  },
  {
    name: "2-Day Package (Sat-Sun)",
    description:
      "Includes 1 night accommodation & 5 meals (1*Breakfast included)",
    adultPrice: 135,
    child9to13Price: 105,
    child3to8Price: 70,
  },
  {
    name: "Day Visitors",
    description: "Entry and meal options for day visitors",
    adultPrice: 36, // Entry + 1 meal
    child9to13Price: 31, // Entry + 1 meal
    child3to8Price: 26, // Entry + 1 meal
  },
];

const RegisterPage = () => {
  const [activeTab, setActiveTab] = useState("registration");
  const navigate = useNavigate();

  const handleRegistrationComplete = () => {
    setActiveTab("payment");
  };

  const handlePaymentComplete = () => {
    navigate("/dashboard");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Fee Structure Section */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Fee Structure</h2>
            <div className="space-y-6">
              {feeStructure.map((pkg) => (
                <div key={pkg.name} className="border-b pb-4 last:border-0">
                  <h3 className="font-medium text-lg">{pkg.name}</h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Adult (14+):</span> $
                      {pkg.adultPrice}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Children (9-13):</span> $
                      {pkg.child9to13Price}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Children (3-8):</span> $
                      {pkg.child3to8Price}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {pkg.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Registration Form Section */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold text-center mb-6">
            Event Registration
          </h1>

          <Tabs value={activeTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="registration">
                1. Registration Details
              </TabsTrigger>
              <TabsTrigger
                value="payment"
                disabled={activeTab === "registration"}
              >
                2. Payment Details
              </TabsTrigger>
            </TabsList>

            <Card className="p-6">
              <TabsContent value="registration">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">
                    Registration Information
                  </h2>
                  <p className="text-gray-600">
                    Please fill in the details of all attendees.
                  </p>
                  <RegisterForm
                    onRegistrationComplete={handleRegistrationComplete}
                  />
                </div>
              </TabsContent>

              <TabsContent value="payment">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Payment Details</h2>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("registration")}
                    >
                      Back to Registration
                    </Button>
                  </div>
                  <p className="text-gray-600">
                    Review your registration and complete the payment.
                  </p>
                  <PaymentDetails onSuccess={handlePaymentComplete} />
                </div>
              </TabsContent>
            </Card>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
