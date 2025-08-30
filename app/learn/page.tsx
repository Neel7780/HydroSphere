"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/Navigation"

const modules = [
  { id: "basics", title: "Basics", desc: "Foundations of clean energy and location factors." },
  { id: "policies", title: "Policies", desc: "Regulatory landscape and incentives overview." },
  { id: "applications", title: "Applications", desc: "Real-world use cases and deployments." },
  { id: "motivation", title: "Motivation", desc: "Why optimize for location and infrastructure." },
  { id: "comparisons", title: "Comparisons", desc: "Trade-offs across cities and regions." },
]

export default function LearnPage() {
  return (
    <>
      <Navigation />
      <main className="mx-auto max-w-5xl space-y-6 p-6 pt-24">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold">Learn Hub</h1>
        <p className="text-muted-foreground">A structured path through essential concepts and resources.</p>
      </header>

      <nav className="flex flex-wrap gap-2">
        {modules.map((m) => (
          <a key={m.id} href={`#${m.id}`} className="rounded-md bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200">
            {m.title}
          </a>
        ))}
      </nav>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {modules.map((m) => (
          <Card key={m.id} id={m.id}>
            <CardHeader>
              <CardTitle>{m.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{m.desc}</CardContent>
          </Card>
        ))}
      </div>
      </main>
    </>
  )
}
