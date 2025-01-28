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
          <div className="flex md:hidden">
            <Sheet>
              <SheetTrigger>
                <Menu className="h-6 w-6" />
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <NavigationMenu>
                  <NavigationMenuList className="flex flex-col gap-4">
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
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <div className="flex-none">
            <a
              href="/"
              className="text-xl font-bold tracking-tight text-white hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              AIBF
            </a>
          </div>

          {/* Desktop navigation - pushed to the right */}
          <div className="flex-1 flex justify-end">
            <NavigationMenu>
              <NavigationMenuList className="hidden md:flex gap-4">
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
          <div className="flex-none flex items-center space-x-4 ml-8">
            <ModeToggle />
            <UserMenu />
          </div>
        </div>
      </Container>
    </header>
  );
};
