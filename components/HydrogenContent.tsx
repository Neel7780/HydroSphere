"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AnimatedBackground } from "@/components/animated-background"
import { useRouter } from "next/navigation"
import { ArrowLeft, Zap, Leaf, Recycle, Globe, Factory, Droplets } from "lucide-react"

export const HydrogenContent = () => {
  const router = useRouter()

  const features = [
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Clean Energy Production",
      description:
        "Hydrogen fuel produces only water vapor as a byproduct, making it a completely clean energy source.",
    },
    {
      icon: <Recycle className="w-8 h-8" />,
      title: "Renewable Integration",
      description: "Green hydrogen is produced using renewable energy sources like solar and wind power.",
    },
    {
      icon: <Factory className="w-8 h-8" />,
      title: "Industrial Applications",
      description: "Perfect for heavy industries, steel production, and chemical processes requiring high energy.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "High Energy Density",
      description: "Hydrogen contains more energy per unit weight than traditional fossil fuels.",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Impact",
      description: "Potential to reduce global greenhouse gas emissions by up to 10% by 2050.",
    },
    {
      icon: <Droplets className="w-8 h-8" />,
      title: "Water Production",
      description: "The only emission from hydrogen fuel cells is pure water, contributing to environmental health.",
    },
  ]

  return (
    <AnimatedBackground className="min-h-screen">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="text-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hydrosphere
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-light tracking-wide text-foreground mb-6 drop-shadow-lg">
            Greenhouse Hydrogen
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Revolutionizing clean energy with sustainable hydrogen fuel technology for a greener tomorrow
          </p>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center group cursor-pointer">
            <div className="bg-card/80 backdrop-blur-md border border-primary/20 rounded-2xl p-8 hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="text-4xl font-bold text-primary mb-2">80%</div>
              <div className="text-muted-foreground">Emission Reduction</div>
            </div>
          </div>
          <div className="text-center group cursor-pointer">
            <div className="bg-card/80 backdrop-blur-md border border-primary/20 rounded-2xl p-8 hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="text-4xl font-bold text-primary mb-2">3x</div>
              <div className="text-muted-foreground">Energy Efficiency</div>
            </div>
          </div>
          <div className="text-center group cursor-pointer">
            <div className="bg-card/80 backdrop-blur-md border border-primary/20 rounded-2xl p-8 hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">Clean Emissions</div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-card/80 backdrop-blur-md border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-xl group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit group-hover:bg-primary/20 transition-colors">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-center leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button
            onClick={() => router.push("/simulate")}
            className="glow-button px-8 py-4 text-lg font-medium tracking-wider rounded-full bg-primary/20 border-2 border-primary/30 text-foreground hover:text-primary-foreground hover:bg-primary/40 backdrop-blur-md transition-all duration-500 hover:scale-105 hover:shadow-2xl"
          >
            Start Simulation
          </Button>
        </div>
      </div>
    </AnimatedBackground>
  )
} 