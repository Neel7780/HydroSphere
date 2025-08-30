"use client"

import { useState } from "react"
import useSWR from "swr"
import { CityCard, type City } from "@/components/city-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

// Demo data fallback for when API is not connected
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

export default function TopCitiesPage() {
  const [weights, setWeights] = useState({
    renewable: 25,
    water: 25,
    industrial: 25,
    logistics: 25
  })
  const [constraints, setConstraints] = useState({
    min_renewable: 0,
    min_water: 0,
    min_industrial: 0,
    min_logistics: 0
  })
  const [scenarioName, setScenarioName] = useState("")
  const [useDemoData, setUseDemoData] = useState(false)

  // Fetch cities with current weights
  const queryParams = new URLSearchParams({
    renewable: weights.renewable.toString(),
    water: weights.water.toString(),
    industrial: weights.industrial.toString(),
    logistics: weights.logistics.toString(),
    limit: '5'
  })

  const { data, error, mutate } = useSWR<{ cities: City[], weights: any }>(
    useDemoData ? null : `/api/cities/top?${queryParams}`,
    fetcher
  )

  const runSimulation = async () => {
    if (useDemoData) {
      alert('Demo mode: Simulation would run with real data when connected to Supabase')
      return
    }

    try {
      const response = await fetch('/api/simulation/scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weights,
          constraints,
          scenario_name: scenarioName || `Scenario_${Date.now()}`
        })
      })
      
      const result = await response.json()
      if (result.success) {
        // Refresh the cities data
        mutate()
        alert('Simulation completed successfully!')
      }
    } catch (error) {
      console.error('Simulation error:', error)
      alert('Simulation failed. Please try again.')
    }
  }

  const resetWeights = () => {
    setWeights({ renewable: 25, water: 25, industrial: 25, logistics: 25 })
    setConstraints({ min_renewable: 0, min_water: 0, min_industrial: 0, min_logistics: 0 })
  }

  // Use demo data if API fails or user chooses to
  const displayCities = useDemoData ? demoCities : (data?.cities || [])
  const displayWeights = useDemoData ? weights : (data?.weights || weights)

  return (
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
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Demo Mode</Label>
              <p className="text-xs text-muted-foreground">Toggle to see sample data without Supabase connection</p>
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
      <Card>
        <CardHeader>
          <CardTitle>Scenario Simulator - What-If Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Factor Weights */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Factor Weights (Total: {Object.values(weights).reduce((a, b) => a + b, 0)})</Label>
              
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

            {/* Constraints */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Minimum Score Constraints</Label>
              
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Min Renewable: {constraints.min_renewable}</Label>
                  <Slider
                    value={[constraints.min_renewable]}
                    onValueChange={([value]) => setConstraints(prev => ({ ...prev, min_renewable: value }))}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Label className="text-xs">Min Water: {constraints.min_water}</Label>
                  <Slider
                    value={[constraints.min_water]}
                    onValueChange={([value]) => setConstraints(prev => ({ ...prev, min_water: value }))}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Label className="text-xs">Min Industrial: {constraints.min_industrial}</Label>
                  <Slider
                    value={[constraints.min_industrial]}
                    onValueChange={([value]) => setConstraints(prev => ({ ...prev, min_industrial: value }))}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Label className="text-xs">Min Logistics: {constraints.min_logistics}</Label>
                  <Slider
                    value={[constraints.min_logistics]}
                    onValueChange={([value]) => setConstraints(prev => ({ ...prev, min_logistics: value }))}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Scenario Name and Actions */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Label htmlFor="scenario-name">Scenario Name (Optional)</Label>
              <input
                id="scenario-name"
                type="text"
                placeholder="e.g., Solar Priority Scenario"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={resetWeights} variant="outline">
                Reset Weights
              </Button>
              <Button onClick={runSimulation}>
                Run Simulation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cities Display */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {error && !useDemoData && (
          <div className="col-span-full text-red-600 p-4 bg-red-50 rounded-md">
            Failed to load cities from API. Switching to demo mode or check your Supabase connection.
          </div>
        )}
        
        {!data && !error && !useDemoData && (
          <div className="col-span-full">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-gray-600">Loading cities data...</div>
                <div className="text-sm text-gray-500 mt-2">Setting up your AI-powered ranking system</div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {displayCities && displayCities.length > 0 ? (
          displayCities.map((c) => (
            <CityCard key={c.id} city={c} />
          ))
        ) : (
          <div className="col-span-full text-center p-8 text-gray-600">
            No cities found matching your criteria. Try adjusting the weights or constraints.
          </div>
        )}
      </section>

      {/* Current Weights Display */}
      <section className="text-sm text-muted-foreground">
        <p>Current weights applied: Renewable ({displayWeights.renewable}%), Water ({displayWeights.water}%), Industrial ({displayWeights.industrial}%), Logistics ({displayWeights.logistics}%)</p>
        <p className="mt-2">Scores combine multiple factors using AI-powered optimization. Adjust the sliders above to see how different priorities affect city rankings.</p>
      </section>

      {/* Demo Notice */}
      {useDemoData && (
        <section className="text-sm text-muted-foreground bg-blue-50 p-4 rounded-md">
          <p className="font-medium text-blue-800">Demo Mode Active</p>
          <p className="text-blue-700 mt-1">
            You're viewing sample data. To see real data and run simulations, set up your Supabase database following the setup guide.
          </p>
        </section>
      )}
    </main>
  )
}
