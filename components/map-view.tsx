"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Layers, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"

export const MapView = () => {
  return (
    <div className="w-full h-[600px] relative">
      {/* Map Placeholder */}
      <div className="w-full h-full bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-primary/20 rounded-lg flex items-center justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border border-primary/30 rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 border border-primary/30 rounded-full"></div>
          <div className="absolute bottom-20 left-1/3 w-12 h-12 border border-primary/30 rounded-full"></div>
          <div className="absolute bottom-40 right-1/3 w-24 h-24 border border-primary/30 rounded-full"></div>
        </div>
        
        {/* Center Content */}
        <div className="text-center z-10">
          <MapPin className="w-16 h-16 mx-auto mb-4 text-primary/60" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Interactive Map</h3>
          <p className="text-muted-foreground mb-6">Hydrogen infrastructure and renewable energy mapping</p>
          
          {/* Map Controls */}
          <div className="flex items-center justify-center space-x-4">
            <Button variant="outline" size="sm" className="border-primary/30 text-foreground hover:bg-primary/10">
              <Layers className="w-4 h-4 mr-2" />
              Layers
            </Button>
            <Button variant="outline" size="sm" className="border-primary/30 text-foreground hover:bg-primary/10">
              <ZoomIn className="w-4 h-4 mr-2" />
              Zoom In
            </Button>
            <Button variant="outline" size="sm" className="border-primary/30 text-foreground hover:bg-primary/10">
              <ZoomOut className="w-4 h-4 mr-2" />
              Zoom Out
            </Button>
            <Button variant="outline" size="sm" className="border-primary/30 text-foreground hover:bg-primary/10">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Map Legend */}
      <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-md border border-primary/20 rounded-lg p-3">
        <h4 className="text-sm font-medium text-foreground mb-2">Legend</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-muted-foreground">Hydrogen Stations</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-muted-foreground">Solar Farms</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-muted-foreground">Wind Farms</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            <span className="text-muted-foreground">Electrolysis Plants</span>
          </div>
        </div>
      </div>
    </div>
  )
} 