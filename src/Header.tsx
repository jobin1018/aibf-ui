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
import { Logo } from "./components/Logo";
import { hasDashboardAccess } from "@/utils/auth";
import { useEffect, useState } from "react";

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
    requiresAccess: true,
  },
  {
    href: "/contact",
    label: "Contact Us",
  },
];

export const Header = () => {
  const [hasAccess, setHasAccess] = useState(hasDashboardAccess());

  useEffect(() => {
    const handleStorageChange = () => {
      setHasAccess(hasDashboardAccess());
    };

    // Listen for storage events (for cross-window updates)
    window.addEventListener("storage", handleStorageChange);

    // Listen for custom events from login/logout
    window.addEventListener("userStateChange", handleStorageChange);

    // Check access periodically for changes
    const interval = setInterval(() => {
      const currentAccess = hasDashboardAccess();
      if (currentAccess !== hasAccess) {
        setHasAccess(currentAccess);
      }
    }, 100);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userStateChange", handleStorageChange);
      clearInterval(interval);
    };
  }, [hasAccess]);

  const filteredRoutes = routes.filter(
    (route) => !route.requiresAccess || hasAccess
  );

  return (
    <header className="border-b mb-2 sm:mb-5">
      <Container>
        <div className="relative flex h-16 items-center justify-between">
          {/* Logo - leftmost position */}
          <div className="flex-none">
            <a
              href="/"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Logo />
            </a>
          </div>

          {/* Right side elements */}
          <div className="flex items-center space-x-4">
            {/* Desktop navigation */}
            <div className="hidden md:flex">
              <NavigationMenu>
                <NavigationMenuList className="gap-4">
                  {filteredRoutes.map((item, index) => (
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

            {/* Theme toggle and user menu */}
            <ModeToggle />
            <div className="hidden md:block">
              <UserMenu />
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <Sheet>
                <SheetTrigger>
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-foreground hover:text-primary transition-colors" />
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[280px] sm:w-[320px] bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60 p-4 sm:p-6"
                >
                  <div className="flex flex-col h-full -mt-2">
                    {/* Mobile Menu Header */}
                    <div className="flex items-center justify-between border-b border-border/40 pb-3">
                      <div className="flex items-center">
                        <a
                          href="/"
                          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <Logo />
                        </a>
                      </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-grow mt-5">
                      <div className="space-y-0.5">
                        {filteredRoutes.map((item, index) => (
                          <a
                            key={index}
                            href={item.href}
                            className="flex items-center px-3 py-2.5 text-sm font-medium text-muted-foreground
                            hover:bg-primary/5 hover:text-primary active:bg-primary/10
                            rounded-lg transition-all duration-200 -mx-1
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                          >
                            {item.href === "/" && (
                              <svg className="mr-2.5 h-[18px] w-[18px] opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
                            )}
                            {item.href === "/conference" && (
                              <svg className="mr-2.5 h-[18px] w-[18px] opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            )}
                            {item.href === "/dashboard" && (
                              <svg className="mr-2.5 h-[18px] w-[18px] opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                            )}
                            {item.href === "/contact" && (
                              <svg className="mr-2.5 h-[18px] w-[18px] opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            )}
                            {item.label}
                          </a>
                        ))}
                      </div>
                    </nav>

                    {/* Mobile Menu Footer */}
                    <div className="mt-auto pt-4 border-t border-border/40">
                      <div className="flex items-center justify-between px-2">
                        <ModeToggle />
                        <UserMenu />
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
};
