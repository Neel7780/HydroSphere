"use client"

import useSWR from "swr"
import { CityCard, type City } from "@/components/city-card"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function TopCitiesPage() {
  const { data, error } = useSWR<{ cities: City[] }>("/api/top-cities", fetcher)

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-6">
      <section>
        <Link
          href="/"
          className="mb-2 inline-flex items-center gap-1 text-sm text-foreground/80 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          {"←"} Back to Home
        </Link>
        <h1 className="text-3xl font-semibold">Top 5 Cities</h1>
        <p className="text-muted-foreground">Ranked by a transparent methodology with mock data for this demo.</p>
      </section>

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

      <section className="text-sm text-muted-foreground">
        Scores combine Renewables, Cost, and Infrastructure using weights. This demo uses static mock data and a simple
        weighted sum to rank cities.
      </section>
    </main>
  )
}
