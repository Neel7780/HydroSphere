"use client"

import { Navigation } from "@/components/Navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapView } from "@/components/map-view"
import { AnimatedBackground } from "@/src/components/ui/animated-background"

export default function MappingPage() {
  return (
    <>
      <Navigation />
      <AnimatedBackground className="min-h-screen pt-20">
        <main className="mx-auto grid max-w-6xl grid-cols-1 gap-4 p-6 md:grid-cols-[1fr_2fr]">
          <Card className="bg-card/80 backdrop-blur-md border-primary/20 hover:border-primary/40 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-foreground">Interactive Mapping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Explore renewable energy infrastructure and hydrogen production facilities across different regions.
              </div>
              <div>
                <div className="mb-2 font-medium text-foreground">Features</div>
                <ul className="list-inside list-disc text-sm text-muted-foreground">
                  <li>Real-time facility locations</li>
                  <li>Production capacity visualization</li>
                  <li>Regional analysis tools</li>
                  <li>Infrastructure planning</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="bg-card/80 backdrop-blur-md border border-primary/20 rounded-lg p-4">
            <MapView />
          </div>
        </main>
      </AnimatedBackground>
    </>
  )
}
