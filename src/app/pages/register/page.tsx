import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RegisterForm, PaymentDetails } from "@/app/components/RegisterForm";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const RegisterPage = () => {
  const [activeTab, setActiveTab] = useState("registration");
  const navigate = useNavigate();

  const handleRegistrationComplete = () => {
    setActiveTab("payment");
  };

  const handlePaymentComplete = () => {
    // Redirect to success page or dashboard
    navigate("/dashboard");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
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
  );
};

export default RegisterPage;
