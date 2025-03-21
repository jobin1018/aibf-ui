import { Facebook, Mail, Youtube } from "lucide-react";
import Container from "./ui/Container";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/10">
      <Container>
        <div className="py-8">
          <div className="flex items-center justify-center gap-8 mb-8">
            <a
              href="mailto:aibfmelb@gmail.com"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="h-5 w-5" />
            </a>
            <a
              href="https://www.facebook.com/share/15z5Q124dX/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="https://www.youtube.com/channel/UCNRHcWZcGNMzgasFyRfSoqQ"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Youtube className="h-5 w-5" />
            </a>
          </div>

          <div className="border-t border-border/5">
            <div className="flex flex-col items-center pt-8">
              <p className="text-xs tracking-wide text-muted-foreground/60">
                &copy; {currentYear} Australian Indian Brethren Fellowship
              </p>
              <p className="text-xs text-muted-foreground/40 mt-1">
                All rights reserved
              </p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
