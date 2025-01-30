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
import { ArrowRight, Calendar, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mb-12">
      <h2
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight 
        bg-gradient-to-r from-primary via-primary to-primary/70 
        text-transparent bg-clip-text
        dark:from-white dark:via-white dark:to-primary"
      >
        {children}
      </h2>
      <div className="absolute -bottom-2 left-0 w-12 sm:w-20 h-1 bg-primary rounded"></div>
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
                      rounded-2xl shadow-2xl 
                      transition-all duration-300 
                      group-hover:scale-[0.98] group-hover:shadow-xl"
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
              <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-4">
                <CarouselPrevious className="bg-primary/20 hover:bg-primary/30 text-primary" />
                <CarouselNext className="bg-primary/20 hover:bg-primary/30 text-primary" />
              </div>
            </Carousel>
          </div>

          {/* Conference Details Section */}
          <div className="space-y-6">
            <Card
              className="p-6 bg-card text-card-foreground 
              border-none 
              shadow-xl hover:shadow-2xl 
              transition-all duration-300 
              hover:scale-[1.02] 
              group
              relative 
              overflow-hidden
              before:absolute before:inset-0 
              before:bg-gradient-to-br 
              before:from-primary/10 
              before:to-transparent 
              before:opacity-0 
              hover:before:opacity-100 
              before:transition-opacity 
              before:duration-300"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="default" className="text-xs sm:text-sm">
                    <Calendar className="mr-1 sm:mr-2 h-3 w-3" /> Upcoming Event
                  </Badge>
                  <Badge variant="secondary" className="text-xs sm:text-sm">
                    Booking Open
                  </Badge>
                </div>

                <div className="space-y-4">
                  <h3
                    className="text-xl sm:text-2xl font-bold tracking-tight 
                    group-hover:text-primary 
                    transition-colors 
                    bg-gradient-to-r from-foreground via-primary to-primary/70 
                    text-transparent bg-clip-text"
                  >
                    AIBF Annual Conference 2025
                  </h3>

                  <div className="space-y-2">
                    <div className="flex items-center text-muted-foreground text-xs sm:text-sm">
                      <Users className="mr-1 sm:mr-2 h-3 sm:h-4 w-3 sm:w-4 text-primary" />
                      <span>300+ Attendees Expected</span>
                    </div>
                    <div className="flex items-center text-muted-foreground text-xs sm:text-sm">
                      <Calendar className="mr-1 sm:mr-2 h-3 sm:h-4 w-3 sm:w-4 text-primary" />
                      <span>4-Day Family Conference</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-center items-center w-full">
                  <Button
                    variant="default"
                    className="group w-auto px-3 text-xs sm:text-sm"
                    onClick={() => navigate("/conference")}
                  >
                    View Details
                    <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};
