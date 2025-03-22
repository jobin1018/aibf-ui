import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RegisterForm, PaymentDetails } from "@/app/components/RegisterForm";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { feeStructure } from "@/constants/fees";

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
    <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        {/* Fee Structure Section */}
        <div className="lg:col-span-1">
          <Card className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
              Fee Structure
            </h2>
            <div className="space-y-4 sm:space-y-6">
              {feeStructure.map((pkg) => (
                <div
                  key={pkg.name}
                  className="border-b pb-3 sm:pb-4 last:border-0"
                >
                  <h3 className="font-medium text-base sm:text-lg">
                    {pkg.name}
                  </h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs sm:text-sm">
                      <span className="font-medium">Adult (14+):</span> $
                      {pkg.adultPrice}
                    </p>
                    <p className="text-xs sm:text-sm">
                      <span className="font-medium">Children (9-13):</span> $
                      {pkg.child9to13Price}
                    </p>
                    <p className="text-xs sm:text-sm">
                      <span className="font-medium">Children (3-8):</span> $
                      {pkg.child3to8Price}
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                    {pkg.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Registration Form Section */}
        <div className="lg:col-span-2">
          <h1 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">
            Event Registration
          </h1>

          <Tabs value={activeTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-8">
              <TabsTrigger
                value="registration"
                className="text-sm sm:text-base"
              >
                1. Registration Details
              </TabsTrigger>
              <TabsTrigger
                value="payment"
                disabled={activeTab === "registration"}
                className="text-sm sm:text-base"
              >
                2. Payment Details
              </TabsTrigger>
            </TabsList>

            <Card className="p-4 sm:p-6">
              <TabsContent value="registration">
                <div className="space-y-3 sm:space-y-4">
                  <h2 className="text-lg sm:text-xl font-semibold">
                    Registration Information
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Please fill in the details of all attendees.
                  </p>
                  <RegisterForm
                    onRegistrationComplete={handleRegistrationComplete}
                  />
                </div>
              </TabsContent>

              <TabsContent value="payment">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                    <h2 className="text-lg sm:text-xl font-semibold">
                      Payment Details
                    </h2>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("registration")}
                      size="sm"
                      className="w-full sm:w-auto text-sm"
                    >
                      Back to Registration
                    </Button>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground">
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
