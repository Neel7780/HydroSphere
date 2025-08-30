"use client"

import { Button } from "@/components/ui/button"
import { AnimatedBackground } from "@/src/components/ui/animated-background"
import { useRouter } from "next/navigation"

export const HydrosphereLanding = () => {
  const router = useRouter()

  const handleVisit = () => {
    router.push("/hydrogen")
  }

  return (
    <AnimatedBackground className="min-h-screen flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <h1 className="text-6xl md:text-8xl font-light tracking-[0.2em] text-foreground mb-16 drop-shadow-lg animate-glow-pulse">
          HYDROSPHERE
        </h1>

        <Button
          onClick={handleVisit}
          className="glow-button px-12 py-6 text-lg font-medium tracking-wider rounded-full bg-transparent border-2 border-primary/30 text-foreground hover:text-primary-foreground hover:bg-primary/20 backdrop-blur-md transition-all duration-500 hover:scale-105 hover:shadow-2xl"
        >
          Visit
        </Button>
      </div>
    </AnimatedBackground>
  )
}
