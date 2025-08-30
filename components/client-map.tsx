"use client"

import { useEffect, useState } from "react"
import "leaflet/dist/leaflet.css"
import { MapContainer, TileLayer, Marker, Popup, LayersControl, Circle, Polygon } from "react-leaflet"
import L from "leaflet"

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

interface MapLayer {
  id: string
  name: string
  type: string
  data: any[]
  style: any
}

export default function ClientMap() {
  const [mounted, setMounted] = useState(false)
  const [layers, setLayers] = useState<MapLayer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    fetchMapLayers()
  }, [])

  const fetchMapLayers = async () => {
    try {
      const response = await fetch('/api/map/layers')
      const data = await response.json()
      if (data.success) {
        setLayers(data.layers)
      }
    } catch (error) {
      console.error('Error fetching map layers:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted || loading) {
    return <div className="h-[70vh] w-full rounded-md bg-gray-100 flex items-center justify-center">
      <div className="text-gray-600">Loading map data...</div>
    </div>
  }

  const renderLayer = (layer: MapLayer) => {
    switch (layer.type) {
      case 'markers':
        return layer.data.map((item: any, index: number) => (
          <Marker 
            key={`${layer.id}-${index}`}
            position={[item.latitude || item.lat, item.longitude || item.lng]} 
            icon={defaultIcon}
          >
            <Popup>
              <div className="grid gap-1">
                <div className="font-medium">{item.name || `Item ${index + 1}`}</div>
                <div className="text-sm text-gray-600">{layer.name}</div>
              </div>
            </Popup>
          </Marker>
        ))
      
      case 'polygon':
        return layer.data.map((item: any, index: number) => (
          <Polygon
            key={`${layer.id}-${index}`}
            positions={item.geom?.coordinates?.[0] || []}
            pathOptions={{
              fillColor: layer.style.fillColor,
              fillOpacity: layer.style.fillOpacity,
              color: layer.style.color,
              weight: layer.style.weight
            }}
          >
            <Popup>
              <div className="grid gap-1">
                <div className="font-medium">{item.name || `Zone ${index + 1}`}</div>
                <div className="text-sm text-gray-600">{layer.name}</div>
              </div>
            </Popup>
          </Polygon>
        ))
      
      case 'heatmap':
        return layer.data.map((item: any, index: number) => (
          <Circle
            key={`${layer.id}-${index}`}
            center={[item.latitude || item.lat, item.longitude || item.lng]}
            radius={layer.style.radius || 20}
            pathOptions={{
              fillColor: item.overall_score > 80 ? '#4caf50' : 
                         item.overall_score > 60 ? '#ff9800' : '#f44336',
              fillOpacity: 0.6,
              color: '#333',
              weight: 1
            }}
          >
            <Popup>
              <div className="grid gap-1">
                <div className="font-medium">{item.name || `Cluster ${index + 1}`}</div>
                <div className="text-sm text-gray-600">Score: {item.overall_score || 'N/A'}</div>
              </div>
            </Popup>
          </Circle>
        ))
      
      default:
        return null
    }
  }

  return (
    <div className="h-[70vh] w-full overflow-hidden rounded-md border">
      <MapContainer 
        center={[23.5937, 78.9629]} // Center of India
        zoom={5} 
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
          
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution="&copy; Esri"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>

          {/* Dynamic layers from API */}
          {layers.map(layer => (
            <LayersControl.Overlay 
              key={layer.id}
              checked={layer.id === 'city_scores'} 
              name={layer.name}
            >
              {renderLayer(layer)}
            </LayersControl.Overlay>
          ))}
        </LayersControl>

        {/* Render all layers */}
        {layers.map(layer => renderLayer(layer))}
      </MapContainer>
    </div>
  )
} 