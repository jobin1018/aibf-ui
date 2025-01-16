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

const routes = [
  {
    href: "/home",
    label: "Home",
  },
  {
    href: "/login",
    label: "Conference",
  },
  {
    href: "/dashboard",
    label: "Dashboard",
  },
  {
    href: "/",
    label: "Contact Us",
  },
];

export const Header = () => {
  return (
    <header className="border-b mb-2 sm:mb-5">
      <Container>
        <div className="flex items-center justify-between py-4 w-full">
          <div className="flex items-center justify-between">
            <Sheet>
              <SheetTrigger>
                <Menu className="h-6 md:hidden" />
              </SheetTrigger>
              <SheetContent side={"left"} className="w-[300px] sm:w-[400px]">
                <NavigationMenu className="flex flex-col gap-4">
                  <NavigationMenuList className="flex flex-col gap-4">
                    {routes.map((item, index) => {
                      return (
                        <NavigationMenuItem key={index}>
                          <NavigationMenuLink
                            href={item.href}
                            className={navigationMenuTriggerStyle()}
                          >
                            {item.label}
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                      );
                    })}
                  </NavigationMenuList>
                </NavigationMenu>
              </SheetContent>
            </Sheet>
            <div className="text-xl font-bold ml-4">AIBF</div>
          </div>
          <NavigationMenu className="flex space-x-4">
            <NavigationMenuList>
              {routes.map((item, index) => {
                return (
                  <NavigationMenuItem key={index} className="hidden md:flex">
                    <NavigationMenuLink
                      href={item.href}
                      className={navigationMenuTriggerStyle()}
                    >
                      {item.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}

              <NavigationMenuItem>
                <ModeToggle />
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </Container>
    </header>
  );
};
