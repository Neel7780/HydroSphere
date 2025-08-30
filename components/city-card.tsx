"use client"

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

export type City = {
  id: string
  name: string
  state?: string
  score: number
  renewables: number
  cost: number
  infrastructure: number
}

export function CityCard({ city }: { city: City }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-balance">
          {city.name}
          {city.state ? `, ${city.state}` : ""}
        </CardTitle>
        <CardDescription>Overall score: {city.score}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Metric label="Renewables" value={city.renewables} />
        <Metric label="Cost" value={city.cost} />
        <Metric label="Infrastructure" value={city.infrastructure} />
        <div className="pt-2">
          <Button asChild variant="secondary">
            <Link href={`/city/${city.id}`}>View profile</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="grid gap-1">
      <div className="flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <Progress value={value} className="h-2" />
    </div>
  )
}
