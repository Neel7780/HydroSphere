import { MapView } from "@/components/map-view"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function MapPage() {
  return (
    <main className="mx-auto grid max-w-6xl grid-cols-1 gap-4 p-6 md:grid-cols-[1fr_2fr]">
      <Card>
        <CardHeader>
          <CardTitle>Layers & Legend</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">Toggle layers from the control on the map (top-right).</div>
          <div>
            <div className="mb-2 font-medium">Quick Actions</div>
            <ul className="list-inside list-disc text-sm">
              <li>Center on USA</li>
              <li>Show Renewable Layers</li>
              <li>Reset Zoom</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div>
        <MapView />
      </div>
    </main>
  )
}
