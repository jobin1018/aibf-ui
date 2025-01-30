import { ModeToggle } from "@/components/mode-toggle";
import Container from "@/components/ui/Container";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { UserMenu } from "./app/components/UserMenu";

const routes = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/conference",
    label: "Conference",
  },
  {
    href: "/dashboard",
    label: "Dashboard",
  },
  {
    href: "/contact",
    label: "Contact Us",
  },
];

export const Header = () => {
  return (
    <header className="border-b mb-2 sm:mb-5">
      <Container>
        <div className="relative flex h-16 items-center">
          {/* Mobile menu button */}
          <div className="flex md:hidden absolute left-0">
            <Sheet>
              <SheetTrigger>
                <Menu className="h-6 w-6 text-foreground hover:text-primary transition-colors" />
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[300px] sm:w-[400px] bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60"
              >
                <div className="flex flex-col h-full">
                  {/* Mobile Menu Header */}
                  <div className="flex items-center justify-between border-b pb-4 mb-6">
                    <div className="flex items-center space-x-4">
                      <a
                        href="/"
                        className="text-xl font-bold tracking-tight text-foreground hover:text-primary transition-colors"
                      >
                        AIBF
                      </a>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <nav className="flex-grow space-y-2">
                    {routes.map((item, index) => (
                      <a
                        key={index}
                        href={item.href}
                        className="block px-4 py-3 text-lg font-medium text-foreground 
                        hover:bg-primary/10 hover:text-primary 
                        rounded-lg transition-all duration-300 
                        focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        {item.label}
                      </a>
                    ))}
                  </nav>

                  {/* Mobile Menu Footer */}
                  <div className="mt-auto border-t pt-4">
                    <UserMenu />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo - centered */}
          <div className="flex-1 flex justify-center items-center">
            <a
              href="/"
              className="text-xl font-bold tracking-tight text-black dark:text-white hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              AIBF
            </a>
          </div>

          {/* Desktop navigation - pushed to the right */}
          <div className="flex-1 flex justify-end hidden md:flex">
            <NavigationMenu>
              <NavigationMenuList className="gap-4">
                {routes.map((item, index) => (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink
                      href={item.href}
                      className={navigationMenuTriggerStyle()}
                    >
                      {item.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side buttons */}
          <div className="flex-none flex items-center space-x-4">
            <ModeToggle />
            <UserMenu />
          </div>
        </div>
      </Container>
    </header>
  );
};
