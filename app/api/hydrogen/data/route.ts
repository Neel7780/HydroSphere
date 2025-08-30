import { NextRequest, NextResponse } from "next/server";

// Mock hydrogen production data for the dashboard
const hydrogenData = {
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
    },
    {
      name: "Maharashtra Industrial H2",
      location: "Pune, Maharashtra",
      capacity: "350 MW",
      status: "Operational",
      efficiency: 80,
      coordinates: [18.5204, 73.8567]
    },
    {
      name: "Andhra Pradesh Coastal",
      location: "Visakhapatnam, Andhra Pradesh",
      capacity: "450 MW",
      status: "Under Construction",
      efficiency: 86,
      coordinates: [17.6868, 83.2185]
    }
  ],
  analytics: {
    monthly: [
      { month: "Jan", value: 75 },
      { month: "Feb", value: 82 },
      { month: "Mar", value: 88 },
      { month: "Apr", value: 85 },
      { month: "May", value: 92 },
      { month: "Jun", value: 89 },
      { month: "Jul", value: 94 },
      { month: "Aug", value: 91 }
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
  },
  realtime: {
    currentOutput: 1450,
    peakToday: 1680,
    uptime: 99.7,
    storageCapacity: 75,
    distributionLoad: 60,
    networkHealth: "Excellent"
  }
};

export async function GET(request: NextRequest) {
  try {
    // Add some randomization to make data feel more dynamic
    const dynamicData = {
      ...hydrogenData,
      production: hydrogenData.production + Math.floor(Math.random() * 10) - 5,
      efficiency: hydrogenData.efficiency + Math.floor(Math.random() * 6) - 3,
      storage: hydrogenData.storage + Math.floor(Math.random() * 20) - 10,
      distribution: hydrogenData.distribution + Math.floor(Math.random() * 15) - 7,
      realtime: {
        ...hydrogenData.realtime,
        currentOutput: hydrogenData.realtime.currentOutput + Math.floor(Math.random() * 200) - 100,
        storageCapacity: Math.max(50, Math.min(100, hydrogenData.realtime.storageCapacity + Math.floor(Math.random() * 20) - 10)),
        distributionLoad: Math.max(30, Math.min(90, hydrogenData.realtime.distributionLoad + Math.floor(Math.random() * 20) - 10))
      }
    };

    return NextResponse.json(dynamicData);
  } catch (error) {
    console.error("Error fetching hydrogen data:", error);
    return NextResponse.json(
      { error: "Failed to fetch hydrogen data" },
      { status: 500 }
    );
  }
}
