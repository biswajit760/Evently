"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      // 👇 ADDED THIS LINE
      position="top-center" 
      toastOptions={{
        classNames: {
          error: 
            "group-[.toaster]:!bg-red-600 group-[.toaster]:!text-white group-[.toaster]:!border-red-700 group-[.toaster]:shadow-lg",
          success: 
            "group-[.toaster]:!bg-green-600 group-[.toaster]:!text-white group-[.toaster]:!border-green-700 group-[.toaster]:shadow-lg",
          warning: 
            "group-[.toaster]:!bg-amber-500 group-[.toaster]:!text-white group-[.toaster]:!border-amber-600 group-[.toaster]:shadow-lg",
          info: 
            "group-[.toaster]:!bg-blue-600 group-[.toaster]:!text-white group-[.toaster]:!border-blue-700 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:!text-zinc-100",
          actionButton: "group-[.toast]:!bg-white group-[.toast]:!text-black",
          cancelButton: "group-[.toast]:!bg-white/20 group-[.toast]:!text-white hover:group-[.toast]:!bg-white/30",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-4 text-white" />,
        info: <InfoIcon className="size-4 text-white" />,
        warning: <TriangleAlertIcon className="size-4 text-white" />,
        error: <OctagonXIcon className="size-4 text-white" />,
        loading: <Loader2Icon className="size-4 animate-spin text-white" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }