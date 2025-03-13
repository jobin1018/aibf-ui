import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function ConferencePage() {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/register");
  };

  /* Conference Section */
}
<section className="py-16 bg-gradient-to-b from-white to-gray-50">
  <div className="container mx-auto px-4">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Join Us at the Conference
        </h2>
        <p className="text-lg text-gray-600">
          Experience an unforgettable day of learning, networking, and growth
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Left Column - Event Details */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Event Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Date</p>
                  <p className="text-gray-600">Saturday, March 16, 2024</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Time</p>
                  <p className="text-gray-600">9:00 AM - 5:00 PM</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Location</p>
                  <p className="text-gray-600">Melbourne Convention Centre</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Pricing
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Adults</span>
                <span className="font-medium">$338</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Kids (9-13)</span>
                <span className="font-medium">$254</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Kids (3-8)</span>
                <span className="font-medium">$169</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Registration */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Register Now
          </h3>
          <p className="text-gray-600 mb-6">
            Secure your spot at this exciting event. Early registration is
            recommended as spaces are limited.
          </p>
          <Button
            onClick={handleRegisterClick}
            className="w-full bg-primary hover:bg-primary/90"
          >
            Register Now
          </Button>
        </div>
      </div>
    </div>
  </div>
</section>;
