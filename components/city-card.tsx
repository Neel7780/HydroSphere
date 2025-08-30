"use client"

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

export type City = {
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
  created_at: string
  updated_at: string
}

export function CityCard({ city }: { city: City }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-balance">
          {city.name}, {city.state}
        </CardTitle>
        <CardDescription>
          Overall Score: {city.overall_score.toFixed(1)} | Population: {city.population.toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Metric label="Renewable Energy" value={city.renewable_score} color="bg-green-500" />
        <Metric label="Water Resources" value={city.water_score} color="bg-blue-500" />
        <Metric label="Industrial Demand" value={city.industrial_score} color="bg-orange-500" />
        <Metric label="Logistics" value={city.logistics_score} color="bg-purple-500" />
        <div className="pt-2">
          <Button asChild variant="secondary" className="w-full">
            <Link href={`/city/${city.id}`}>View Profile</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function Metric({ label, value, color }: { label: string; value: number; color: string }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-orange-600"
    return "text-red-600"
  }

  return (
    <div className="grid gap-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-700">{label}</span>
        <span className={`font-medium ${getScoreColor(value)}`}>{value.toFixed(1)}</span>
      </div>
      <Progress 
        value={value} 
        className="h-2" 
        style={{
          '--progress-background': color
        } as React.CSSProperties}
      />
    </div>
  )
}
