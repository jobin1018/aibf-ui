import Container from "@/components/ui/Container";

export const TypographyH1 = () => {
  return (
    <div className="flex flex-col items-start">
      <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight sm:text-2xl md:text-3xl lg:text-5xl mb-2">
        Australian
      </h1>
      <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight sm:text-2xl md:text-3xl lg:text-5xl mb-2">
        Indian
      </h1>
      <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight sm:text-2xl md:text-3xl lg:text-5xl">
        Brethren Fellowship
      </h1>
    </div>
  );
};

export function TypographyBlockquote() {
  return (
    <div className="flex flex-col items-start">
      <blockquote className="mt-6 border-l-2 pl-1 italic text-sm">
        "How good and pleasant it is when brothers live together in unity!"
      </blockquote>
    </div>
  );
}

export const Hero = () => {
  return (
    <div className="my-10 py-20">
      <Container>
        <TypographyH1 />
        <TypographyBlockquote />
      </Container>
    </div>
  );
};
