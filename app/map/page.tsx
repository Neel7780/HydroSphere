"use client"

import { InteractiveMap } from "@/components/InteractiveMap"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/Navigation"
import { AnimatedBackground } from "@/components/animated-background"

export default function MapPage() {
  return (
    <>
      <Navigation />
      <AnimatedBackground className="min-h-screen">
        <main className="mx-auto max-w-6xl p-6 pt-24">
          <div className="bg-card/80 backdrop-blur-md border border-primary/20 rounded-lg p-4">
            <InteractiveMap />
          </div>
        </main>
      </AnimatedBackground>
    </>
  )
}
