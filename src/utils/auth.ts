// List of allowed email addresses
export const ALLOWED_EMAILS = [
  "jobinjoseph1018@gmail.com",
  "johnylizy@gmail.com",
  "ben.phil205@gmail.com",
  "bibinarpil2002@gmail.com",
];

export const hasDashboardAccess = (): boolean => {
  const userDetailsStr = localStorage.getItem("user_details");

  if (!userDetailsStr) {
    return false;
  }

  try {
    const userDetails = JSON.parse(userDetailsStr);
    const userEmail = userDetails.email;
    return ALLOWED_EMAILS.includes(userEmail);
  } catch (error) {
    return false;
  }
};
