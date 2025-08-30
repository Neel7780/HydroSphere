"use client"

import { useMemo } from "react"
import { useAppStore } from "@/store/app-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Navigation } from "@/components/Navigation"

type City = {
  id: string
  name: string
  renewables: number
  cost: number
  infrastructure: number
}

const MOCK: City[] = [
  { id: "austin", name: "Austin, TX", renewables: 80, cost: 75, infrastructure: 90 },
  { id: "denver", name: "Denver, CO", renewables: 78, cost: 70, infrastructure: 88 },
  { id: "portland", name: "Portland, OR", renewables: 85, cost: 65, infrastructure: 80 },
]

export default function SimulatePage() {
  const { weights, setWeight, isValid } = useAppStore()

  const ranked = useMemo(() => {
    const sum = weights.cost + weights.renewables + weights.infrastructure
    const w = sum === 0 ? { cost: 0, renewables: 0, infrastructure: 0 } : weights
    return [...MOCK]
      .map((c) => ({
        ...c,
        score: Math.round((c.cost * w.cost + c.renewables * w.renewables + c.infrastructure * w.infrastructure) / 100),
      }))
      .sort((a, b) => b.score - a.score)
  }, [weights])

  return (
    <>
      <Navigation />
      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 p-6 pt-24 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Weights</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <WeightRow label="Cost" value={weights.cost} onChange={(v) => setWeight("cost", v)} />
          <WeightRow label="Renewables" value={weights.renewables} onChange={(v) => setWeight("renewables", v)} />
          <WeightRow
            label="Infrastructure"
            value={weights.infrastructure}
            onChange={(v) => setWeight("infrastructure", v)}
          />
          <div className={`text-sm ${isValid ? "text-teal-700" : "text-red-600"}`}>
            Total: {weights.cost + weights.renewables + weights.infrastructure}% {!isValid && "(must equal 100%)"}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!isValid && (
            <div className="text-sm text-red-600">Adjust weights until total equals 100% to view results.</div>
          )}
          {isValid &&
            ranked.map((c, idx) => (
              <div key={c.id} className="flex items-center justify-between rounded-md border p-3">
                <div className="font-medium">
                  {idx + 1}. {c.name}
                </div>
                <div className="rounded bg-amber-100 px-2 py-1 text-sm font-semibold text-amber-800">{c.score}</div>
              </div>
            ))}
        </CardContent>
      </Card>
      </main>
    </>
  )
}

function WeightRow({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <div className="text-sm">{value}%</div>
      </div>
      <Slider value={[value]} min={0} max={100} step={1} onValueChange={(v) => onChange(v[0] ?? 0)} />
    </div>
  )
}
