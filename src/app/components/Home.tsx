import Container from "@/components/ui/Container";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import aibf_25_logo from "../../assets/aibf_25_logo.jpeg";
import aibf_24_logo from "../../assets/aibf_24_logo.jpeg";

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
                src={aibf_25_logo}
                alt="Your alt text"
              />
            </CarouselItem>
            <CarouselItem>
              <img
                className="min-h-[100%] min-w-[100%]"
                src={aibf_24_logo}
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
