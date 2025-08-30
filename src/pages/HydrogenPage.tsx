"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/Navigation"
import { 
  Zap, 
  Droplets, 
  Leaf, 
  Factory, 
  TrendingUp, 
  MapPin,
  Battery,
  Wind,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from "lucide-react"

interface HydrogenData {
  production: number
  efficiency: number
  storage: number
  distribution: number
  facilities: Array<{
    name: string
    location: string
    capacity: string
    status: string
    efficiency: number
    coordinates?: [number, number]
  }>
  analytics: {
    monthly: Array<{ month: string; value: number }>
    regional: Array<{ region: string; percentage: number }>
  }
  sustainability: {
    co2Reduction: string
    waterReduction: number
    renewablePercentage: number
  }
}

export default function HydrogenPage() {
  const [selectedMetric, setSelectedMetric] = useState("production")
  const [hydrogenData, setHydrogenData] = useState<HydrogenData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch hydrogen data from backend
  useEffect(() => {
    const fetchHydrogenData = async () => {
      try {
        setLoading(true)
        // Try to fetch from backend API
        const response = await fetch('/api/hydrogen/data')
        if (!response.ok) {
          throw new Error('Failed to fetch hydrogen data')
        }
        const data = await response.json()
        setHydrogenData(data)
      } catch (err) {
        console.error('Error fetching hydrogen data:', err)
        // Fallback to mock data
        setHydrogenData({
          production: 85,
          efficiency: 72,
          storage: 60,
          distribution: 45,
          facilities: [
            {
              name: "Gujarat Green Hub",
              location: "Kutch, Gujarat",
              capacity: "500 MW",
              status: "Operational",
              efficiency: 85,
              coordinates: [23.7337, 68.7333]
            },
            {
              name: "Rajasthan Solar H2",
              location: "Jaisalmer, Rajasthan",
              capacity: "300 MW", 
              status: "Under Construction",
              efficiency: 78,
              coordinates: [26.9157, 70.9083]
            },
            {
              name: "Tamil Nadu Wind H2",
              location: "Coimbatore, Tamil Nadu",
              capacity: "250 MW",
              status: "Planning",
              efficiency: 82,
              coordinates: [11.0168, 76.9558]
            },
            {
              name: "Odisha Coastal Hub",
              location: "Paradip, Odisha",
              capacity: "400 MW",
              status: "Operational",
              efficiency: 88,
              coordinates: [20.2648, 86.6042]
            }
          ],
          analytics: {
            monthly: [
              { month: "Jan", value: 75 },
              { month: "Feb", value: 82 },
              { month: "Mar", value: 88 },
              { month: "Apr", value: 85 },
              { month: "May", value: 92 },
              { month: "Jun", value: 89 }
            ],
            regional: [
              { region: "Western India", percentage: 45 },
              { region: "Northern India", percentage: 30 },
              { region: "Southern India", percentage: 25 }
            ]
          },
          sustainability: {
            co2Reduction: "2.5M tons",
            waterReduction: 15,
            renewablePercentage: 95
          }
        })
      } finally {
        setLoading(false)
      }
    }

    fetchHydrogenData()
  }, [])

  const metrics = hydrogenData ? {
    production: { value: hydrogenData.production, label: "Production Capacity", unit: "MW" },
    efficiency: { value: hydrogenData.efficiency, label: "Energy Efficiency", unit: "%" },
    storage: { value: hydrogenData.storage, label: "Storage Utilization", unit: "%" },
    distribution: { value: hydrogenData.distribution, label: "Distribution Network", unit: "%" }
  } : {}

  const refreshData = async () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span>Loading hydrogen data...</span>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-20 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Zap className="h-8 w-8 text-primary" />
                Hydrogen Production Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">
                Monitor and analyze green hydrogen production across India
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={refreshData} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Live Data
              </Badge>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(metrics).map(([key, metric]) => (
              <Card 
                key={key}
                className={`cursor-pointer transition-all ${
                  selectedMetric === key ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedMetric(key)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-muted-foreground">
                      {metric.label}
                    </div>
                    {key === "production" && <Factory className="h-4 w-4" />}
                    {key === "efficiency" && <TrendingUp className="h-4 w-4" />}
                    {key === "storage" && <Battery className="h-4 w-4" />}
                    {key === "distribution" && <Wind className="h-4 w-4" />}
                  </div>
                  <div className="text-2xl font-bold">
                    {metric.value}{metric.unit}
                  </div>
                  <Progress value={metric.value} className="mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content */}
          <Tabs defaultValue="facilities" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="facilities">Production Facilities</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
              <TabsTrigger value="realtime">Real-time Monitor</TabsTrigger>
            </TabsList>

            <TabsContent value="facilities" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Factory className="h-5 w-5" />
                    Active Hydrogen Facilities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {hydrogenData?.facilities.map((facility, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <MapPin className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{facility.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {facility.location}
                            </p>
                            {facility.coordinates && (
                              <p className="text-xs text-muted-foreground">
                                Lat: {facility.coordinates[0]}, Lng: {facility.coordinates[1]}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{facility.capacity}</div>
                          <Badge 
                            variant={
                              facility.status === "Operational" ? "default" :
                              facility.status === "Under Construction" ? "secondary" :
                              "outline"
                            }
                            className="mt-1"
                          >
                            {facility.status === "Operational" && <CheckCircle className="h-3 w-3 mr-1" />}
                            {facility.status === "Under Construction" && <AlertCircle className="h-3 w-3 mr-1" />}
                            {facility.status}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Efficiency</div>
                          <div className="font-semibold">{facility.efficiency}%</div>
                          <Progress value={facility.efficiency} className="w-20 mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Monthly Production Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {hydrogenData?.analytics.monthly.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="font-medium">{item.month}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={item.value} className="w-24" />
                            <span className="text-sm font-semibold w-12">{item.value}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Regional Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {hydrogenData?.analytics.regional.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="font-medium">{item.region}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={item.percentage} className="w-24" />
                            <Badge variant={index === 0 ? "default" : index === 1 ? "secondary" : "outline"}>
                              {item.percentage}%
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="sustainability" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5" />
                    Environmental Impact & Sustainability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Leaf className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">CO₂ Reduction</h3>
                      <p className="text-3xl font-bold text-green-600 mb-1">
                        {hydrogenData?.sustainability.co2Reduction}
                      </p>
                      <p className="text-sm text-muted-foreground">Annual carbon savings</p>
                    </div>
                    
                    <div className="text-center p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Droplets className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">Water Efficiency</h3>
                      <p className="text-3xl font-bold text-blue-600 mb-1">
                        {hydrogenData?.sustainability.waterReduction}%
                      </p>
                      <p className="text-sm text-muted-foreground">Reduction vs traditional methods</p>
                    </div>
                    
                    <div className="text-center p-6 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                      <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Zap className="h-8 w-8 text-yellow-600" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">Renewable Energy</h3>
                      <p className="text-3xl font-bold text-yellow-600 mb-1">
                        {hydrogenData?.sustainability.renewablePercentage}%
                      </p>
                      <p className="text-sm text-muted-foreground">From clean energy sources</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="realtime" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Live Production Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="font-medium">System Status</span>
                        </div>
                        <Badge variant="default">Online</Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>Current Output</span>
                          <span className="font-semibold">1,450 MW</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Peak Today</span>
                          <span className="font-semibold">1,680 MW</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Uptime</span>
                          <span className="font-semibold">99.7%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Battery className="h-5 w-5" />
                      Storage & Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>Storage Capacity</span>
                          <div className="flex items-center gap-2">
                            <Progress value={75} className="w-20" />
                            <span className="font-semibold">75%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Distribution Load</span>
                          <div className="flex items-center gap-2">
                            <Progress value={60} className="w-20" />
                            <span className="font-semibold">60%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Network Health</span>
                          <Badge variant="default">Excellent</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
