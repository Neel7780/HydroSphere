import { NextResponse } from "next/server"

export async function GET() {
  const cities = [
    { id: "austin", name: "Austin", state: "TX", score: 86, renewables: 80, cost: 75, infrastructure: 90 },
    { id: "denver", name: "Denver", state: "CO", score: 82, renewables: 78, cost: 70, infrastructure: 88 },
    { id: "portland", name: "Portland", state: "OR", score: 81, renewables: 85, cost: 65, infrastructure: 80 },
    { id: "madison", name: "Madison", state: "WI", score: 79, renewables: 76, cost: 72, infrastructure: 82 },
    { id: "raleigh", name: "Raleigh", state: "NC", score: 77, renewables: 70, cost: 74, infrastructure: 79 },
  ]
  return NextResponse.json({ cities })
}
