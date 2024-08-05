import Container from "@/components/ui/Container";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import poster from "../assets/poster.jpg";

export function TypographyH3() {
  return (
    <h3 className="scroll-m-20 text-2xl border-l-4 pl-2 font-semibold tracking-tight flex flex-start">
      Upcoming Conference
    </h3>
  );
}

export const Home = () => {
  return (
    <Container>
      <TypographyH3 />
      <div className="my-10 flex items-center justify-center">
        <Carousel>
          <CarouselContent>
            <CarouselItem>
              <img
                className="min-h-[100%] min-w-[100%]"
                src={
                  "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/easter-convention-banner-template-design-914ce714138b49b586513fa0ba004636_screen.jpg"
                }
                alt="Your alt text"
              />
            </CarouselItem>
            <CarouselItem>
              <img
                className="min-h-[100%] min-w-[100%]"
                src={
                  "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/youth-convention-design-template-1dd8611d8975f4bc1bf050b7839b055f_screen.jpg"
                }
                alt="Your alt text"
              />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </Container>
  );
};
