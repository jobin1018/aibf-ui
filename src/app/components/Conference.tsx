import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { ConferenceDetails } from "./ConferenceDetails";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RegisterForm } from "./RegisterForm";

interface ConferenceDetails {
  // Add conference details interface based on your backend response
  title?: string;
  date?: string;
  description?: string;
}

export function Conference() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const isLoggedIn = localStorage.getItem("access") !== null;

  // If we're on /login path, show the login form
  const isLoginPath = window.location.pathname === "/login";

  if (!isLoggedIn && isLoginPath) {
    return <LoginForm />;
  }

  const handleRegistrationSuccess = () => {
    // Close the modal
    setShowRegisterModal(false);

    // Trigger refetch by updating the refetchTrigger
    setRefetchTrigger((prev) => prev + 1);
  };

  return (
    <>
      <ConferenceDetails
        key={refetchTrigger}
        onRegisterClick={() => {
          // Simply open the registration modal
          setShowRegisterModal(true);
        }}
      />

      <Dialog open={showRegisterModal} onOpenChange={setShowRegisterModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Conference Registration</DialogTitle>
            <DialogDescription>
              Fill in your details to register for the conference.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <RegisterForm onSuccess={handleRegistrationSuccess} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
