import { NextResponse } from "next/server"
import { notFound } from "next/navigation"

const db: Record<string, any> = {
  austin: {
    id: "austin",
    name: "Austin",
    state: "TX",
    score: 86,
    renewables: 80,
    cost: 75,
    infrastructure: 90,
    notes: "Growing tech hub with expanding renewable initiatives.",
  },
  denver: {
    id: "denver",
    name: "Denver",
    state: "CO",
    score: 82,
    renewables: 78,
    cost: 70,
    infrastructure: 88,
    notes: "High elevation city with strong wind and solar potential.",
  },
  portland: {
    id: "portland",
    name: "Portland",
    state: "OR",
    score: 81,
    renewables: 85,
    cost: 65,
    infrastructure: 80,
    notes: "Progressive policies and strong public transit network.",
  },
  madison: {
    id: "madison",
    name: "Madison",
    state: "WI",
    score: 79,
    renewables: 76,
    cost: 72,
    infrastructure: 82,
    notes: "Balanced costs with solid infrastructure investments.",
  },
  raleigh: {
    id: "raleigh",
    name: "Raleigh",
    state: "NC",
    score: 77,
    renewables: 70,
    cost: 74,
    infrastructure: 79,
    notes: "Research triangle proximity and growing grid resilience.",
  },
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const city = db[params.id]
  if (!city) return notFound()
  return NextResponse.json({ city })
}
