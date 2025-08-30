"use client"

import { useState } from "react"
import { Navigation } from "@/components/Navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { AnimatedBackground } from "@/src/components/ui/animated-background"
import { Play, RotateCcw, Settings } from "lucide-react"

interface SimulationParams {
  capacity: number
  efficiency: number
  renewablePercentage: number
  storageCapacity: number
}

export default function SimulatorPage() {
  const [params, setParams] = useState<SimulationParams>({
    capacity: 500,
    efficiency: 75,
    renewablePercentage: 85,
    storageCapacity: 60
  })
  
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<any>(null)

  const runSimulation = () => {
    setIsRunning(true)
    
    // Simulate processing time
    setTimeout(() => {
      const mockResults = {
        annualProduction: Math.round(params.capacity * params.efficiency * 8760 / 100),
        co2Reduction: Math.round(params.capacity * params.renewablePercentage * 2.1 / 100),
        efficiency: params.efficiency,
        costSavings: Math.round(params.capacity * 0.08 * params.efficiency / 100)
      }
      setResults(mockResults)
      setIsRunning(false)
    }, 2000)
  }

  const resetSimulation = () => {
    setParams({
      capacity: 500,
      efficiency: 75,
      renewablePercentage: 85,
      storageCapacity: 60
    })
    setResults(null)
  }

  return (
    <>
      <Navigation />
      <AnimatedBackground className="min-h-screen pt-20">
        <main className="mx-auto max-w-6xl p-6">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-light text-foreground mb-4">Hydrogen Production Simulator</h1>
            <p className="text-muted-foreground text-lg">
              Model and optimize hydrogen production scenarios with real-time parameter adjustments
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Parameters Panel */}
            <Card className="bg-card/80 backdrop-blur-md border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Simulation Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Production Capacity: {params.capacity} MW</Label>
                  <Slider
                    value={[params.capacity]}
                    onValueChange={(value) => setParams({...params, capacity: value[0]})}
                    max={2000}
                    min={100}
                    step={50}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Energy Efficiency: {params.efficiency}%</Label>
                  <Slider
                    value={[params.efficiency]}
                    onValueChange={(value) => setParams({...params, efficiency: value[0]})}
                    max={95}
                    min={50}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Renewable Energy: {params.renewablePercentage}%</Label>
                  <Slider
                    value={[params.renewablePercentage]}
                    onValueChange={(value) => setParams({...params, renewablePercentage: value[0]})}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Storage Capacity: {params.storageCapacity}%</Label>
                  <Slider
                    value={[params.storageCapacity]}
                    onValueChange={(value) => setParams({...params, storageCapacity: value[0]})}
                    max={100}
                    min={20}
                    step={10}
                    className="w-full"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={runSimulation} 
                    disabled={isRunning}
                    className="flex-1"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {isRunning ? "Running..." : "Run Simulation"}
                  </Button>
                  <Button 
                    onClick={resetSimulation} 
                    variant="outline"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results Panel */}
            <Card className="bg-card/80 backdrop-blur-md border-primary/20">
              <CardHeader>
                <CardTitle>Simulation Results</CardTitle>
              </CardHeader>
              <CardContent>
                {!results && !isRunning && (
                  <div className="text-center py-12 text-muted-foreground">
                    Adjust parameters and run simulation to see results
                  </div>
                )}

                {isRunning && (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Processing simulation...</p>
                  </div>
                )}

                {results && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-primary/10 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-primary">
                          {results.annualProduction.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">MWh/year</div>
                        <div className="text-xs text-muted-foreground mt-1">Annual Production</div>
                      </div>

                      <div className="bg-green-500/10 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {results.co2Reduction.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">tons CO₂</div>
                        <div className="text-xs text-muted-foreground mt-1">Annual Reduction</div>
                      </div>

                      <div className="bg-blue-500/10 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {results.efficiency}%
                        </div>
                        <div className="text-sm text-muted-foreground">Efficiency</div>
                        <div className="text-xs text-muted-foreground mt-1">System Performance</div>
                      </div>

                      <div className="bg-yellow-500/10 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          ${results.costSavings}M
                        </div>
                        <div className="text-sm text-muted-foreground">Savings</div>
                        <div className="text-xs text-muted-foreground mt-1">Annual Cost Reduction</div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-2">Simulation Summary</h4>
                      <p className="text-sm text-muted-foreground">
                        Based on your parameters, this hydrogen production facility would generate{" "}
                        <span className="font-semibold">{results.annualProduction.toLocaleString()} MWh</span> annually,
                        reducing CO₂ emissions by <span className="font-semibold">{results.co2Reduction.toLocaleString()} tons</span>{" "}
                        and saving approximately <span className="font-semibold">${results.costSavings}M</span> in operational costs.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </AnimatedBackground>
    </>
  )
}
