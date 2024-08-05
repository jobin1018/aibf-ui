import { ModeToggle } from "@/components/mode-toggle";
import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Home } from "./Home";
import { RegisterForm } from "./RegisterForm";
import { Hero } from "./Hero";

const routes = [
  {
    href: "/",
    label: "About",
  },
  {
    href: "/",
    label: "Register",
  },
  {
    href: "/",
    label: "Contact Us",
  },
];

export const Layout = () => {
  return (
    <>
      <header className="border-b">
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
      <Hero />
      <Home />
      <RegisterForm />
    </>
  );
};
