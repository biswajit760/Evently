import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base Layout
        "flex h-10 w-full rounded-md px-3 py-2 text-sm",
        
        // Colors & Borders (Default State)
        "border border-input bg-transparent file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "placeholder:text-muted-foreground text-foreground",
        
        // Focus States (Ring)
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        
        // Disabled State
        "disabled:cursor-not-allowed disabled:opacity-50",
        
        // Allow Overrides (Crucial for the Search component to strip borders)
        className
      )}
      {...props}
    />
  )
}

export { Input }