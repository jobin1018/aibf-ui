import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RegisterForm } from "../components/RegisterForm";
import { ConferenceDetails } from "../components/ConferenceDetails";

export default function ConferencePage() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  return (
    <>
      <ConferenceDetails onRegisterClick={() => setShowRegisterModal(true)} />

      <Dialog open={showRegisterModal} onOpenChange={setShowRegisterModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Conference Registration</DialogTitle>
            <DialogDescription>
              Fill in your details to register for the conference.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <RegisterForm onSuccess={() => setShowRegisterModal(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
