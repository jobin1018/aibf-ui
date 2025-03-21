import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";

export const UserMenu = () => {
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
    window.location.href = "/login";
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
          className="relative h-10 w-10 rounded-full 
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
          <span className="text-lg font-semibold relative z-10">
            {userDetails.name[0]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-[250px] p-2 
        bg-background/95 backdrop-blur-sm border border-border/50 
        shadow-lg rounded-lg"
        align="end"
      >
        <div
          className="flex items-center space-x-3 p-3 
          bg-gradient-to-br from-primary/5 to-transparent 
          rounded-lg border border-primary/5"
        >
          <div
            className="bg-gradient-to-br from-primary/10 to-primary/5 
            p-2 rounded-full border border-primary/10"
          >
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {userDetails.name}
            </p>
            <p className="text-xs text-muted-foreground truncate max-w-[180px]">
              {userDetails.email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator className="my-2 bg-border/50" />

        <DropdownMenuItem
          className="text-red-600 dark:text-red-400 
          cursor-pointer text-sm 
          hover:bg-red-50/50 dark:hover:bg-red-950/50 
          rounded-md transition-colors duration-200 
          flex items-center"
          onSelect={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
