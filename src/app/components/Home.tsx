import Container from "@/components/ui/Container";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import aibf_25_2_poster from "../../assets/aibf_25_2.jpeg";
import aibf_25_3_poster from "../../assets/aibf_25_3.jpeg";
import aibf_25_4_poster from "../../assets/aibf_25_4.jpeg";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mb-12">
      <h2
        className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight 
        bg-gradient-to-r from-primary via-primary to-primary/70 
        text-transparent bg-clip-text
        dark:from-white dark:via-white dark:to-primary"
      >
        {children}
      </h2>
      <div className="absolute -bottom-2 left-0 w-12 sm:w-20 h-0.5 sm:h-1 bg-primary rounded"></div>
    </div>
  );
}

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background py-16">
      <Container>
        <SectionTitle>Upcoming Conference</SectionTitle>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Carousel Section */}
          <div className="w-full max-w-md mx-auto">
            <Carousel
              className="w-full group"
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent>
                {[aibf_25_2_poster, aibf_25_3_poster, aibf_25_4_poster].map(
                  (poster, index) => (
                    <CarouselItem key={index}>
                      <div
                        className="relative aspect-[3/4] w-full overflow-hidden 
                      rounded-2xl
                      transition-all duration-300 
                      group-hover:scale-[0.98]"
                      >
                        <img
                          className="absolute inset-0 w-full h-full object-cover 
                        transform transition-transform duration-300 
                        hover:scale-105"
                          src={poster}
                          alt={`AIBF Conference 2025 Poster ${index + 1}`}
                          draggable="false"
                        />
                      </div>
                    </CarouselItem>
                  )
                )}
              </CarouselContent>
              <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-2 sm:px-4">
                <CarouselPrevious className="bg-primary/20 hover:bg-primary/30 text-primary h-7 w-7 sm:h-10 sm:w-10" />
                <CarouselNext className="bg-primary/20 hover:bg-primary/30 text-primary h-7 w-7 sm:h-10 sm:w-10" />
              </div>
            </Carousel>
          </div>

          {/* Conference Details Section */}
          <div className="space-y-6">
            <Card
              className="p-6 bg-card text-card-foreground 
              border 
              shadow-sm hover:shadow-md 
              transition-all duration-300 
              hover:scale-[1.01] 
              group
              relative 
              overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary" className="text-xs">
                    Upcoming Event
                  </Badge>
                  <Badge variant="default" className="text-xs">
                    Booking Open
                  </Badge>
                </div>

                <div className="space-y-4">
                  <h3
                    className="text-lg sm:text-xl font-bold tracking-tight 
                    group-hover:text-primary 
                    transition-colors"
                  >
                    AIBF Annual Conference 2025
                  </h3>

                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center text-muted-foreground text-xs sm:text-sm">
                      <Calendar className="mr-2 h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                      <span>April 24-27, 2025</span>
                    </div>
                    <div className="flex items-center text-muted-foreground text-xs sm:text-sm">
                      <svg
                        className="mr-2 h-3 w-3 sm:h-4 sm:w-4 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>4-Day Family Conference</span>
                    </div>
                    <div className="flex items-center text-muted-foreground text-xs sm:text-sm">
                      <svg
                        className="mr-2 h-3 w-3 sm:h-4 sm:w-4 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>CYC The Island</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="default"
                      className="w-full group text-xs sm:text-sm h-8 sm:h-10"
                      onClick={() => navigate("/conference")}
                    >
                      View Details
                      <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};
