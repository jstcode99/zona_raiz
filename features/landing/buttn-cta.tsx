"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface CtaProps extends React.ComponentProps<"button"> {
  className?: string;
  text: string;
  href: string;
}

export const CtaButton = ({ className, href, text, ...props }: CtaProps) => (
  <Link href={href}>
    <Button
      className={cn(
        "relative text-sm font-medium rounded-full h-10 p-1 ps-4 pe-12 group transition-all duration-500 hover:ps-12 hover:pe-4 w-fit overflow-hidden hover:bg-primary/80",
        className,
      )}
      {...props}
    >
      <span className="relative z-10 transition-all duration-500 hover:cursor-pointer">
        {text}
      </span>
      <div className="absolute right-1 w-8 h-8 bg-background text-foreground rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-36px)] group-hover:rotate-45">
        <ArrowUpRight size={16} />
      </div>
    </Button>
  </Link>
);
