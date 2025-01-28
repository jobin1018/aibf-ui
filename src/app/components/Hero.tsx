import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const TypographyH1 = () => {
  return (
    <div className="flex flex-col items-start space-y-2">
      <h1
        className="text-4xl font-black tracking-tight 
        sm:text-5xl md:text-6xl lg:text-7xl 
        bg-gradient-to-r from-primary via-primary to-primary/70 
        text-transparent bg-clip-text
        dark:from-white dark:via-white dark:to-primary"
      >
        Australian
      </h1>
      <h1
        className="text-4xl font-black tracking-tight 
        sm:text-5xl md:text-6xl lg:text-7xl 
        bg-gradient-to-r from-primary via-primary to-primary/70 
        text-transparent bg-clip-text
        dark:from-white dark:via-white dark:to-primary"
      >
        Indian
      </h1>
      <h1
        className="text-4xl font-black tracking-tight 
        sm:text-5xl md:text-6xl lg:text-7xl 
        bg-gradient-to-r from-primary via-primary to-primary/70 
        text-transparent bg-clip-text
        dark:from-white dark:via-white dark:to-primary"
      >
        Brethren Fellowship
      </h1>
    </div>
  );
};

export function TypographyBlockquote() {
  return (
    <div className="mt-6 max-w-2xl">
      <blockquote className="border-l-4 border-primary pl-4 py-2 italic text-lg text-foreground">
        "How good and pleasant it is when brothers live together in unity!"
      </blockquote>
    </div>
  );
}

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden py-20 bg-background">
      <div className="absolute inset-0 bg-grid-primary/[0.04] pointer-events-none"></div>
      <Container>
        <div className="relative z-10 max-w-4xl mx-auto text-center md:text-left">
          <TypographyH1 />
          <TypographyBlockquote />
          <div className="mt-10 flex items-center justify-center sm:justify-start">
            <Button
              size="lg"
              className="group w-full sm:w-auto"
              onClick={() => navigate("/conference")}
            >
              Register Now
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </Container>
      <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-gradient-to-br from-primary to-background blur-3xl"></div>
    </div>
  );
};
