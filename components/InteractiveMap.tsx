"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Layers, ZoomIn, ZoomOut, RotateCcw, X } from "lucide-react"
import dynamic from 'next/dynamic'

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css'

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })
const CircleMarker = dynamic(() => import('react-leaflet').then(mod => mod.CircleMarker), { ssr: false })

interface CityData {
  id: number
  name: string
  state: string
  scores: {
    renewable: number
    water: number
    industrial: number
    logistics: number
    overall: number
  }
  category?: string
  color?: string
  coordinates?: [number, number]
  population?: number
}

interface MapData {
  type: 'FeatureCollection'
  features: Array<{
    type: 'Feature'
    geometry: {
      type: 'Point'
      coordinates: [number, number]
    }
    properties: CityData
  }>
}

export const InteractiveMap = () => {
  const [mapData, setMapData] = useState<MapData | null>(null)
  const [selectedLayer, setSelectedLayer] = useState('all')
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })

  const layers = [
    { id: 'all', name: 'All Cities', color: 'bg-primary' },
    { id: 'renewable', name: 'Renewable Energy', color: 'bg-green-500' },
    { id: 'industrial', name: 'Industrial', color: 'bg-blue-500' },
    { id: 'water', name: 'Water Resources', color: 'bg-cyan-500' },
    { id: 'logistics', name: 'Logistics', color: 'bg-orange-500' }
  ]

  const [mapStats, setMapStats] = useState<any>(null)
  const [mapLayers, setMapLayers] = useState<any[]>([])

  // Fetch map statistics and layers
  useEffect(() => {
    fetchMapStats()
    fetchMapLayers()
  }, [])

  const fetchMapStats = async () => {
    try {
      const response = await fetch('/api/map/stats')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setMapStats(result.stats)
        }
      }
    } catch (error) {
      console.error('Failed to fetch map stats:', error)
    }
  }

  const fetchMapLayers = async () => {
    try {
      const response = await fetch('/api/map/layers')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setMapLayers(result.layers)
        }
      }
    } catch (error) {
      console.error('Failed to fetch map layers:', error)
    }
  }

  useEffect(() => {
    fetchMapData()
  }, [selectedLayer])

  const fetchMapData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/map/cities?layer=${selectedLayer}&minScore=0`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch map data')
      }
      
      const result = await response.json()
      
      if (result.success && result.data) {
        // Process the real backend data
        const processedData = {
          ...result.data,
          features: result.data.features.map((feature: any) => ({
            ...feature,
            properties: {
              ...feature.properties,
              category: getCityCategory(feature.properties.scores.overall),
              color: getScoreColor(feature.properties.scores.overall),
              coordinates: feature.geometry.coordinates
            }
          }))
        }
        setMapData(processedData)
        setError(null)
      } else {
        throw new Error(result.error || 'Failed to load map data')
      }
    } catch (err) {
      console.error('Map data fetch error:', err)
      setError('Failed to load map data from backend.')
      setMapData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleCityClick = (city: CityData) => {
    setSelectedCity(city)
  }

  const getCityCategory = (score: number): string => {
    if (score >= 80) return 'high_potential'
    if (score >= 65) return 'medium_potential'
    if (score >= 50) return 'developing'
    return 'low_potential'
  }

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#10B981' // green
    if (score >= 65) return '#F59E0B' // yellow
    if (score >= 50) return '#EF4444' // orange
    return '#DC2626' // red
  }

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.5, 3))
  }

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.5, 0.5))
  }

  const resetView = () => {
    setSelectedCity(null)
    setSelectedLayer('all')
    setZoomLevel(1)
    setPanOffset({ x: 0, y: 0 })
    fetchMapData()
  }

  // Fix Leaflet icon issue
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const L = require('leaflet')
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      })
    }
  }, [])

  return (
    <div className="w-full h-[600px] relative">
        {/* Loading State */}
        {loading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[1000]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading map data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute top-4 left-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3 z-[1000]">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Layer Controls - Left overlay on map */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md border border-gray-200 rounded-lg p-4 shadow-lg z-[1000]" style={{ width: '280px' }}>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Layers & Legend</h4>
          <p className="text-sm text-gray-600 mb-4">Toggle layers from the control on the map (top-right).</p>
          
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-900 mb-2">Quick Actions</h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Center on India</li>
              <li>• Show Renewable Layers</li>
              <li>• Reset Zoom</li>
            </ul>
          </div>

          <div className="space-y-2">
            {layers.map((layer) => (
              <Button
                key={layer.id}
                variant={selectedLayer === layer.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedLayer(layer.id)}
                className="w-full justify-start text-xs bg-white hover:bg-gray-50 border border-gray-200"
              >
                <div className={`w-3 h-3 rounded-full mr-2 ${layer.color}`} />
                {layer.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Leaflet Map Container - Full width */}
        <div className="w-full h-[600px] relative rounded-lg overflow-hidden" style={{ height: '600px' }}>
          {typeof window !== 'undefined' && (
            <MapContainer
              center={[20.5937, 78.9629]} // Center of India
              zoom={5}
              scrollWheelZoom={true}
              style={{ height: '600px', width: '100%', zIndex: 0 }}
              className="leaflet-container"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                maxZoom={18}
                tileSize={256}
              />
              
              {/* City Markers */}
              {mapData && !loading && mapData.features.map((feature, index) => {
                const city = feature.properties
                const coords = feature.geometry.coordinates
                
                if (!coords || coords.length < 2) {
                  return null
                }
                
                // Leaflet uses [lat, lng] format - ensure it's a proper tuple
                const position: [number, number] = [coords[1], coords[0]]
                
                return (
                  <CircleMarker
                    key={city.id}
                    center={position}
                    radius={15}
                    fillColor={getScoreColor(city.scores.overall)}
                    color="#ffffff"
                    weight={3}
                    opacity={1}
                    fillOpacity={0.9}
                    eventHandlers={{
                      click: () => handleCityClick(city),
                    }}
                  >
                    <Popup>
                      <div className="text-sm min-w-[200px]">
                        <div className="font-medium text-gray-900 text-base">{city.name}</div>
                        <div className="text-gray-600 text-sm">{city.state}</div>
                        <div className="text-blue-600 font-medium mt-1">Score: {city.scores.overall.toFixed(1)}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Population: {city.population?.toLocaleString() || 'N/A'}
                        </div>
                        <div className="mt-2 space-y-1 border-t pt-2">
                          <div className="flex justify-between text-xs">
                            <span>Renewable:</span>
                            <span className="font-medium">{city.scores.renewable.toFixed(1)}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Water:</span>
                            <span className="font-medium">{city.scores.water.toFixed(1)}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Industrial:</span>
                            <span className="font-medium">{city.scores.industrial.toFixed(1)}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Logistics:</span>
                            <span className="font-medium">{city.scores.logistics.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                )
              })}
            </MapContainer>
          )}
        </div>

        {/* Map Legend & Stats - Top right overlay */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md border border-gray-200 rounded-lg p-4 shadow-lg z-[1000]" style={{ width: '200px' }}>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Legend & Stats</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-700">High Potential (80+)</span>
              </div>
              {mapStats && <span className="text-gray-900 font-medium">{mapStats.distribution?.high || 0}</span>}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-gray-700">Medium Potential (65-79)</span>
              </div>
              {mapStats && <span className="text-gray-900 font-medium">{mapStats.distribution?.medium || 0}</span>}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                <span className="text-gray-700">Developing (50-64)</span>
              </div>
              {mapStats && <span className="text-gray-900 font-medium">{mapStats.distribution?.low || 0}</span>}
            </div>
            {mapStats && (
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">Total Cities:</span>
                  <span className="text-gray-900 font-medium">{mapStats.totalCities}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Avg Score:</span>
                  <span className="text-gray-900 font-medium">{mapStats.averageScore}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* City Details Panel */}
        {selectedCity && (
          <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-md border border-primary/20 rounded-lg p-4 max-w-xs z-[1000]">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-foreground">{selectedCity.name}</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedCity(null)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm text-muted-foreground mb-2">{selectedCity.state}</div>
            <div className="text-lg font-semibold text-primary mb-2">
              Score: {selectedCity.scores.overall.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground mb-3">
              Population: {selectedCity.population?.toLocaleString() || 'N/A'}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Renewable Energy</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-secondary rounded-full h-1.5">
                    <div 
                      className="bg-green-500 h-1.5 rounded-full" 
                      style={{ width: `${(selectedCity.scores.renewable / 100) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-8">{selectedCity.scores.renewable.toFixed(1)}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Water Resources</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-secondary rounded-full h-1.5">
                    <div 
                      className="bg-blue-500 h-1.5 rounded-full" 
                      style={{ width: `${(selectedCity.scores.water / 100) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-8">{selectedCity.scores.water.toFixed(1)}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Industrial Infrastructure</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-secondary rounded-full h-1.5">
                    <div 
                      className="bg-orange-500 h-1.5 rounded-full" 
                      style={{ width: `${(selectedCity.scores.industrial / 100) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-8">{selectedCity.scores.industrial.toFixed(1)}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Logistics & Transport</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-secondary rounded-full h-1.5">
                    <div 
                      className="bg-purple-500 h-1.5 rounded-full" 
                      style={{ width: `${(selectedCity.scores.logistics / 100) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-8">{selectedCity.scores.logistics.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}
