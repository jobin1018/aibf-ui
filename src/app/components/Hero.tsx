import Container from "@/components/ui/Container";
import { TextEffect } from "@/components/ui/TextEffect";

export const TypographyH1 = () => {
  return (
    <div className="flex flex-col items-start">
      <TextEffect
        className="text-2xl font-extrabold tracking-tight sm:text-2xl md:text-3xl lg:text-5xl mb-2"
        per="char"
        as="h1"
        preset="blur"
      >
        Australian
      </TextEffect>
      <TextEffect
        className="text-2xl font-extrabold tracking-tight sm:text-2xl md:text-3xl lg:text-5xl mb-2"
        per="char"
        as="h1"
        preset="blur"
      >
        Indian
      </TextEffect>
      <TextEffect
        className="text-2xl font-extrabold tracking-tight sm:text-2xl md:text-3xl lg:text-5xl mb-2"
        per="char"
        as="h1"
        preset="blur"
      >
        Brethren Fellowship
      </TextEffect>
    </div>
  );
};

export function TypographyBlockquote() {
  return (
    <div className="flex flex-col items-start">
      <blockquote className="mt-6 border-l-2 pl-1 italic text-sm">-
        <TextEffect per="word" preset="blur">
          "How good and pleasant it is when brothers live together in unity!"
        </TextEffect>
      </blockquote>
    </div>
  );
}

export const Hero = () => {
  return (
    <div className="my-10 py-20">
      <Container>
        {/* <div
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/2351719/pexels-photo-2351719.jpeg')",
            height: "100%",
            // marginTop: "-70px",
            // fontSize: "50px",
            // backgroundSize: "cover",
            // backgroundRepeat: "no-repeat",
          }}
          className="bg-cover bg-center"
        > */}
        {/* </div> */}
        <TypographyH1 />
        <TypographyBlockquote />
      </Container>
    </div>
  );
};
