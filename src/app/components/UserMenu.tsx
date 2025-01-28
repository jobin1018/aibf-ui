import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, LogOut, UserCog, UserCircle } from "lucide-react";

export function UserMenu() {
  const navigate = useNavigate();
  const userDetailsStr = localStorage.getItem("user_details");
  const isLoggedIn = localStorage.getItem("access") !== null;

  let userName = "";
  let userEmail = "";
  try {
    if (userDetailsStr) {
      const userDetails = JSON.parse(userDetailsStr);
      userName = userDetails?.name || "User";
      userEmail = userDetails?.email || "";
    }
  } catch (error) {
    console.error("Error parsing user details:", error);
    userName = "User";
  }

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user_details");
    navigate("/");
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-full 
          bg-primary/10 text-primary 
          hover:bg-primary/20 
          transition-all duration-300 
          group"
        >
          <div
            className="absolute inset-0 rounded-full 
            border-2 border-transparent 
            group-hover:border-primary/30 
            transition-all duration-300"
          ></div>
          <User className="h-5 w-5 relative z-10" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-[250px] p-2 
        bg-card border-none 
        shadow-2xl rounded-xl 
        dark:bg-card/80 backdrop-blur-lg"
        align="end"
      >
        <div
          className="flex items-center space-x-3 p-3 
          bg-primary/5 rounded-lg mb-2"
        >
          <div className="bg-primary/20 p-2 rounded-full">
            <UserCircle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{userName}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[180px]">
              {userEmail}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator className="my-2 bg-primary/10" />

        <DropdownMenuItem
          className="cursor-pointer text-sm 
          hover:bg-primary/10 rounded-md 
          transition-colors duration-200 
          flex items-center
          opacity-50 cursor-not-allowed"
          disabled
        >
          <UserCog className="mr-2 h-4 w-4 text-muted-foreground" />
          Update Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-red-600 dark:text-red-400 
          cursor-pointer text-sm 
          hover:bg-red-50 rounded-md 
          transition-colors duration-200 
          flex items-center"
          onSelect={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
