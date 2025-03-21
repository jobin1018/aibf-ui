// List of allowed email addresses
export const ALLOWED_EMAILS = [
  "jobinjoseph1018@gmail.com",
  "johnylizy@gmail.com",
  "ben.phil205@gmail.com",
  "bibinarpil2002@yahoo.com",
];

export const hasDashboardAccess = (): boolean => {
  const userDetailsStr = localStorage.getItem("user_details");
  console.log("User details from localStorage:", userDetailsStr);

  if (!userDetailsStr) {
    console.log("No user details found in localStorage");
    return false;
  }

  try {
    const userDetails = JSON.parse(userDetailsStr);
    const userEmail = userDetails.email;
    console.log("User email:", userEmail);
    console.log(
      "Is email in allowed list:",
      ALLOWED_EMAILS.includes(userEmail)
    );
    return ALLOWED_EMAILS.includes(userEmail);
  } catch (error) {
    console.error("Error checking user access:", error);
    return false;
  }
};
