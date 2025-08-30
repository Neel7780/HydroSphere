"use client"

import { useEffect, useState } from "react"
import "leaflet/dist/leaflet.css"
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet"
import L from "leaflet"

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

type CityMarker = {
  id: string
  name: string
  position: [number, number]
}

const demoCities: CityMarker[] = [
  { id: "austin", name: "Austin, TX", position: [30.2672, -97.7431] },
  { id: "denver", name: "Denver, CO", position: [39.7392, -104.9903] },
  { id: "portland", name: "Portland, OR", position: [45.5152, -122.6784] },
]

export default function ClientMap() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-[70vh] w-full rounded-md bg-gray-100" />
  }

  return (
    <div className="h-[70vh] w-full overflow-hidden rounded-md border">
      <MapContainer 
        center={[39.5, -98.35]} 
        zoom={4} 
        style={{ height: "100%", width: "100%" }} 
        attributionControl={true}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          {/* Overlay layers (mock toggles) */}
          <LayersControl.Overlay checked name="Solar">
            <TileLayer 
              opacity={0.25} 
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Wind">
            <TileLayer 
              opacity={0.15} 
              url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" 
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Water">
            <TileLayer 
              opacity={0.15} 
              url="https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png" 
            />
          </LayersControl.Overlay>
        </LayersControl>

        {demoCities.map((c) => (
          <Marker 
            position={c.position} 
            key={c.id} 
            icon={defaultIcon}
          >
            <Popup>
              <div className="grid gap-1">
                <div className="font-medium">{c.name}</div>
                <a className="text-teal-700 underline" href={`/city/${c.id}`}>
                  View profile
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
} 