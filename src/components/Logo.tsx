import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <span
      className={cn(
        "text-xl sm:text-3xl font-black tracking-tight",
        "bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent",
        "hover:opacity-90 transition-opacity",
        "uppercase",
        className
      )}
    >
      AIBF
    </span>
  );
}
