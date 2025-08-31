"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Map, MessageSquare, Play, BookOpen, BarChart3, Trophy } from "lucide-react"

export const Navigation = () => {
  const router = useRouter()

  const navItems = [
    {
      icon: <Map className="w-5 h-5" />,
      label: "Map",
      path: "/map",
      description: "Interactive mapping and visualization"
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      label: "Top Cities",
      path: "/top-cities",
      description: "AI-powered city rankings"
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      label: "Chatbot",
      path: "/chatbot",
      description: "AI-powered assistance"
    },
    {
      icon: <Play className="w-5 h-5" />,
      label: "Simulate",
      path: "/simulator",
      description: "Run simulations and scenarios"
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: "Learn",
      path: "/learn",
      description: "Educational content and resources"
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      label: "Content",
      path: "/content",
      description: "Data and analytics"
    }
  ]

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-primary/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="text-2xl font-light tracking-wider text-foreground cursor-pointer hover:text-primary transition-colors"
            onClick={() => router.push("/")}
          >
            HYDROSPHERE
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                onClick={() => router.push(item.path)}
                className="text-foreground hover:text-primary hover:bg-primary/10 transition-colors group"
              >
                <span className="mr-2 group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                {item.label}
              </Button>
            ))}
          </nav>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="text-foreground hover:text-primary"
            >
              Menu
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 