"use client"

import { type ReactNode, useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"

export default function Providers({ children }: { children: ReactNode }) {
  // ensure a single QueryClient instance per browser session
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {children}
        {/* Keep global toasters mounted once at root like in the original app */}
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  )
}
