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

  // Fetch cities with current weights
  const queryParams = new URLSearchParams({
    renewable: weights.renewable.toString(),
    water: weights.water.toString(),
    industrial: weights.industrial.toString(),
    logistics: weights.logistics.toString(),
    limit: '5'
  })

  const { data, error, mutate } = useSWR<{ cities: City[], weights: any }>(
    `/api/cities/top?${queryParams}`,
    fetcher
  )

  const runSimulation = async () => {
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
        {error && <div className="text-red-600">Failed to load cities.</div>}
        {!data && !error && (
          <Card>
            <CardContent className="p-6">Loading...</CardContent>
          </Card>
        )}
        {data?.cities.map((c) => (
          <CityCard key={c.id} city={c} />
        ))}
      </section>

      {/* Current Weights Display */}
      {data?.weights && (
        <section className="text-sm text-muted-foreground">
          <p>Current weights applied: Renewable ({data.weights.renewable}%), Water ({data.weights.water}%), Industrial ({data.weights.industrial}%), Logistics ({data.weights.logistics}%)</p>
          <p className="mt-2">Scores combine multiple factors using AI-powered optimization. Adjust the sliders above to see how different priorities affect city rankings.</p>
        </section>
      )}
    </main>
  )
}
