import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full min-w-0 rounded-md border border-input bg-paper px-3 text-base text-foreground shadow-none transition-[box-shadow,border-color] duration-150 outline-none placeholder:text-muted-foreground/80 focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-28 w-full rounded-md border border-input bg-paper px-3 py-2 text-base text-foreground outline-none placeholder:text-muted-foreground/80 focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-[3px] disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "text-xs font-medium tracking-wide text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Input, Textarea, Label };
