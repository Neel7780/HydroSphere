"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/Navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AnimatedBackground } from "@/src/components/ui/animated-background"
import Link from "next/link"

interface City {
  id: number
  name: string
  state: string
  latitude: number
  longitude: number
  population: number
  renewable_score: number
  water_score: number
  industrial_score: number
  logistics_score: number
  overall_score: number
  custom_score?: number
  created_at?: string
  updated_at?: string
}

// Demo data fallback
const demoCities: City[] = [
  {
    id: 1,
    name: "Mumbai",
    state: "Maharashtra",
    latitude: 19.0760,
    longitude: 72.8777,
    population: 20411274,
    renewable_score: 75.0,
    water_score: 65.0,
    industrial_score: 90.0,
    logistics_score: 95.0,
    overall_score: 81.25,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Delhi",
    state: "Delhi",
    latitude: 28.7041,
    longitude: 77.1025,
    population: 16787941,
    renewable_score: 70.0,
    water_score: 60.0,
    industrial_score: 85.0,
    logistics_score: 90.0,
    overall_score: 76.25,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z"
  },
  {
    id: 3,
    name: "Bangalore",
    state: "Karnataka",
    latitude: 12.9716,
    longitude: 77.5946,
    population: 12425304,
    renewable_score: 85.0,
    water_score: 70.0,
    industrial_score: 80.0,
    logistics_score: 75.0,
    overall_score: 77.5,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z"
  },
  {
    id: 4,
    name: "Chennai",
    state: "Tamil Nadu",
    latitude: 13.0827,
    longitude: 80.2707,
    population: 7088000,
    renewable_score: 80.0,
    water_score: 75.0,
    industrial_score: 75.0,
    logistics_score: 80.0,
    overall_score: 77.5,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z"
  },
  {
    id: 5,
    name: "Hyderabad",
    state: "Telangana",
    latitude: 17.3850,
    longitude: 78.4867,
    population: 6993262,
    renewable_score: 75.0,
    water_score: 70.0,
    industrial_score: 80.0,
    logistics_score: 75.0,
    overall_score: 75.0,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z"
  }
]

function CityCard({ city, rank }: { city: City; rank?: number }) {
  const displayScore = city.custom_score || city.overall_score
  
  return (
    <Card className="bg-card/80 backdrop-blur-md border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {rank && (
              <Badge variant={rank <= 3 ? "default" : "secondary"} className="text-xs">
                #{rank}
              </Badge>
            )}
            <span>{city.name}</span>
          </div>
          <span className="text-lg font-bold text-primary">{displayScore.toFixed(1)}</span>
        </CardTitle>
        <p className="text-muted-foreground">{city.state}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span>Renewable:</span>
            <span className="font-medium">{city.renewable_score}%</span>
          </div>
          <div className="flex justify-between">
            <span>Water:</span>
            <span className="font-medium">{city.water_score}%</span>
          </div>
          <div className="flex justify-between">
            <span>Industrial:</span>
            <span className="font-medium">{city.industrial_score}%</span>
          </div>
          <div className="flex justify-between">
            <span>Logistics:</span>
            <span className="font-medium">{city.logistics_score}%</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-primary/20">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Population:</span>
            <span>{city.population.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Coordinates:</span>
            <span>{city.latitude.toFixed(2)}, {city.longitude.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function TopCitiesPage() {
  const [weights, setWeights] = useState({
    renewable: 25,
    water: 25,
    industrial: 25,
    logistics: 25
  })
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useDemoData, setUseDemoData] = useState(false)

  useEffect(() => {
    fetchCities()
  }, [weights])

  const fetchCities = async () => {
    if (useDemoData) {
      setCities(demoCities)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const queryParams = new URLSearchParams({
        renewable: weights.renewable.toString(),
        water: weights.water.toString(),
        industrial: weights.industrial.toString(),
        logistics: weights.logistics.toString(),
        limit: '5'
      })

      const response = await fetch(`/api/cities/top?${queryParams}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch cities data')
      }
      
      const result = await response.json()
      
      if (result.success) {
        setCities(result.cities)
        setError(null)
      } else {
        throw new Error(result.error || 'Failed to load cities')
      }
    } catch (err) {
      console.error('Cities fetch error:', err)
      setError('Failed to load cities from backend. Using demo data.')
      setCities(demoCities)
    } finally {
      setLoading(false)
    }
  }

  const resetWeights = () => {
    setWeights({ renewable: 25, water: 25, industrial: 25, logistics: 25 })
  }

  const runSimulation = async () => {
    if (useDemoData) {
      alert('Demo mode: Simulation would run with real data when connected to backend')
      return
    }
    
    await fetchCities()
    alert('Simulation completed! Cities re-ranked with new weights.')
  }

  return (
    <>
      <Navigation />
      <AnimatedBackground className="min-h-screen pt-20">
        <main className="mx-auto max-w-6xl space-y-6 p-6">
        <section>
          <Link
            href="/"
            className="mb-2 inline-flex items-center gap-1 text-sm text-foreground/80 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            {"←"} Back to Home
          </Link>
          <h1 className="text-3xl font-semibold">Top 5 Cities - AI-Powered Ranking</h1>
          <p className="text-muted-foreground">
            Multi-factor scoring: renewable potential + water availability + industrial demand + transport connectivity
          </p>
        </section>

        {/* Demo Mode Toggle */}
        <Card className="bg-card/80 backdrop-blur-md border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Demo Mode</Label>
                <p className="text-xs text-muted-foreground">Toggle to see sample data without backend connection</p>
              </div>
              <Button
                variant={useDemoData ? "default" : "outline"}
                onClick={() => setUseDemoData(!useDemoData)}
                size="sm"
              >
                {useDemoData ? "Demo Active" : "Enable Demo"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Scenario Simulator Controls */}
        <Card className="bg-card/80 backdrop-blur-md border-primary/20">
          <CardHeader>
            <CardTitle>Scenario Simulator - What-If Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Factor Weights */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Factor Weights (Total: {Object.values(weights).reduce((a, b) => a + b, 0)}%)</Label>
                
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Renewable Energy: {weights.renewable}%</Label>
                    <Slider
                      value={[weights.renewable]}
                      onValueChange={([value]) => setWeights(prev => ({ ...prev, renewable: value }))}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs">Water Resources: {weights.water}%</Label>
                    <Slider
                      value={[weights.water]}
                      onValueChange={([value]) => setWeights(prev => ({ ...prev, water: value }))}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs">Industrial Demand: {weights.industrial}%</Label>
                    <Slider
                      value={[weights.industrial]}
                      onValueChange={([value]) => setWeights(prev => ({ ...prev, industrial: value }))}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs">Logistics: {weights.logistics}%</Label>
                    <Slider
                      value={[weights.logistics]}
                      onValueChange={([value]) => setWeights(prev => ({ ...prev, logistics: value }))}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Actions</Label>
                <div className="flex gap-2">
                  <Button onClick={resetWeights} variant="outline">
                    Reset Weights
                  </Button>
                  <Button onClick={runSimulation}>
                    Run Simulation
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <Card className="bg-card/80 backdrop-blur-md border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <div className="text-muted-foreground">Loading cities data...</div>
              <div className="text-sm text-muted-foreground mt-2">Setting up your AI-powered ranking system</div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && !useDemoData && (
          <Card className="bg-red-500/10 border-red-500/20">
            <CardContent className="p-4">
              <div className="text-red-600">{error}</div>
            </CardContent>
          </Card>
        )}

        {/* Cities Display */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {cities.length > 0 ? (
            cities.map((city, index) => (
              <CityCard key={city.id} city={city} rank={index + 1} />
            ))
          ) : (
            !loading && (
              <div className="col-span-full text-center p-8 text-muted-foreground">
                No cities found matching your criteria. Try adjusting the weights or enable demo mode.
              </div>
            )
          )}
        </section>

        {/* Current Weights Display */}
        <section className="text-sm text-muted-foreground">
          <p>Current weights applied: Renewable ({weights.renewable}%), Water ({weights.water}%), Industrial ({weights.industrial}%), Logistics ({weights.logistics}%)</p>
          <p className="mt-2">Scores combine multiple factors using AI-powered optimization. Adjust the sliders above to see how different priorities affect city rankings.</p>
        </section>

        {/* Demo Notice */}
        {useDemoData && (
          <section className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-4 rounded-md">
            <p className="font-medium text-blue-800 dark:text-blue-400">Demo Mode Active</p>
            <p className="text-blue-700 dark:text-blue-300 mt-1">
              You're viewing sample data. To see real data and run simulations, connect to your backend database.
            </p>
          </section>
        )}
        </main>
      </AnimatedBackground>
    </>
  )
}
