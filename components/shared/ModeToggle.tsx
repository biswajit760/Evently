"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function ModeToggle() {
  // 1. Use resolvedTheme to handle "system" preferences correctly
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // 2. Wait until mounted to avoid Hydration Mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Render a placeholder or nothing while loading to prevent layout shift
    return <div className="h-9 w-16" /> 
  }

  // 3. Check resolvedTheme instead of theme
  const isDark = resolvedTheme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative flex h-8 w-16 items-center rounded-full border",
        "transition-colors duration-300",
        isDark
          ? "bg-zinc-900 border-zinc-700"
          : "bg-zinc-100 border-zinc-300"
      )}
      aria-label="Toggle theme"
    >
      <span
        className={cn(
          "absolute left-1 flex h-6 w-6 items-center justify-center rounded-full",
          "bg-white shadow-md transition-transform duration-300", // Changed transition-all to transition-transform for better performance
          // 4. Ensure the translate class is applied based on resolvedTheme
          isDark && "translate-x-7 bg-zinc-800"
        )}
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-yellow-300" />
        ) : (
          <Sun className="h-4 w-4 text-orange-500" />
        )}
      </span>
    </button>
  )
}