"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function CityDetailPage({ params }: { params: { id: string } }) {
  const { data, error } = useSWR<{ city: any }>(`/api/cities/${params.id}`, fetcher)

  if (error) {
    return <main className="mx-auto max-w-3xl p-6">Failed to load city.</main>
  }
  if (!data) {
    return <main className="mx-auto max-w-3xl p-6">Loading...</main>
  }

  const city = data.city

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <section className="space-y-1">
        <h1 className="text-3xl font-semibold">
          {city.name}, {city.state}
        </h1>
        <p className="text-muted-foreground">Comprehensive profile and key metrics</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Score</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{city.score}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Renewables</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{city.renewables}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Infrastructure</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{city.infrastructure}</CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">{city.notes}</CardContent>
      </Card>
    </main>
  )
}
