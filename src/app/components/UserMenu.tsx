import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface UserDetails {
  name: string;
  email: string;
}

export const UserMenu = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(() => {
    const userDetailsStr = localStorage.getItem("user_details");
    return userDetailsStr ? JSON.parse(userDetailsStr) : null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const userDetailsStr = localStorage.getItem("user_details");
      setUserDetails(userDetailsStr ? JSON.parse(userDetailsStr) : null);
    };

    // Listen for storage events (for cross-window updates)
    window.addEventListener("storage", handleStorageChange);

    // Listen for custom events from login/logout
    window.addEventListener("userStateChange", handleStorageChange);

    // Check localStorage periodically for changes
    const interval = setInterval(() => {
      const currentUserDetails = localStorage.getItem("user_details");
      if (currentUserDetails !== JSON.stringify(userDetails)) {
        handleStorageChange();
      }
    }, 100);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userStateChange", handleStorageChange);
      clearInterval(interval);
    };
  }, [userDetails]);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("user_details");
    // Dispatch custom event for header update
    window.dispatchEvent(new Event("userStateChange"));
    navigate("/login");
  };

  const handleUpdateProfile = () => {
    navigate("/update-profile");
  };

  if (!userDetails) {
    return (
      <Button variant="outline" asChild>
        <a href="/login">Login</a>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full 
          bg-gradient-to-br from-primary/10 to-primary/5 
          text-primary hover:from-primary/15 hover:to-primary/10 
          transition-all duration-200 group"
        >
          <div
            className="absolute inset-0 rounded-full 
            border border-primary/10 
            group-hover:border-primary/20 
            transition-colors duration-200"
          ></div>
          <span className="text-sm sm:text-lg font-semibold relative z-10">
            {userDetails.name[0]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[260px] p-2 
        bg-background/95 backdrop-blur-sm border border-border/50 
        shadow-lg rounded-lg"
        align="end"
      >
        <div
          className="flex items-center space-x-3 p-2.5 
          bg-gradient-to-br from-primary/5 to-transparent 
          rounded-lg border border-primary/5"
        >
          <div
            className="bg-gradient-to-br from-primary/10 to-primary/5 
            p-1.5 sm:p-2 rounded-full border border-primary/10"
          >
            <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
              {userDetails.name}
            </p>
            <p className="text-[11px] sm:text-xs text-muted-foreground truncate">
              {userDetails.email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator className="my-1.5 bg-border/50" />

        <DropdownMenuItem
          className="text-primary cursor-pointer text-xs sm:text-sm px-2.5 py-2
          hover:bg-primary/10 dark:hover:bg-primary/20 
          rounded-md transition-colors duration-200 
          flex items-center"
          onSelect={handleUpdateProfile}
        >
          <Settings className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Update Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-red-600 dark:text-red-400 
          cursor-pointer text-xs sm:text-sm px-2.5 py-2
          hover:bg-red-50/50 dark:hover:bg-red-950/50 
          rounded-md transition-colors duration-200 
          flex items-center"
          onSelect={handleLogout}
        >
          <LogOut className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
