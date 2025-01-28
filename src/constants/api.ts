export const API_ROOT_URL = "http://localhost:8003";

export const API_ENDPOINTS = {
  GOOGLE_SIGNIN: `${API_ROOT_URL}/users/api/google-signin/`,
  COMPLETE_PROFILE: `${API_ROOT_URL}/users/api/complete-profile/`,
  CONTACT: `${API_ROOT_URL}/api/contact/`,
  EVENTS: `${API_ROOT_URL}/users/events/`,
  REGISTRATION: `${API_ROOT_URL}/users/registrations/`,
} as const;
