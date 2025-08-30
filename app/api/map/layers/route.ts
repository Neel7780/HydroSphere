import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    // Get renewable energy zones data
    const { data: renewableZones, error: renewableError } = await supabase
      .from('renewable_zones')
      .select('*');

    // Get water resources data
    const { data: waterResources, error: waterError } = await supabase
      .from('water_resources')
      .select('*');

    // Get industrial clusters data
    const { data: industrialClusters, error: industrialError } = await supabase
      .from('industrial_clusters')
      .select('*');

    // Get logistics infrastructure data
    const { data: logisticsInfra, error: logisticsError } = await supabase
      .from('logistics_infrastructure')
      .select('*');

    // Get cities with scores for heatmap
    const { data: cities, error: citiesError } = await supabase
      .from('cities')
      .select('id, name, latitude, longitude, overall_score, renewable_score, water_score, industrial_score, logistics_score');

    if (renewableError || waterError || industrialError || logisticsError || citiesError) {
      console.warn("Some data fetch errors:", { renewableError, waterError, industrialError, logisticsError, citiesError });
    }

    return NextResponse.json({
      success: true,
      layers: [
        {
          id: 'renewable_zones',
          name: 'Renewable Energy Zones',
          type: 'polygon',
          data: renewableZones || [],
          style: {
            fillColor: '#ffeb3b',
            fillOpacity: 0.6,
            color: '#f57f17',
            weight: 2
          }
        },
        {
          id: 'water_resources',
          name: 'Water Resource Mapping',
          type: 'polygon',
          data: waterResources || [],
          style: {
            fillColor: '#2196f3',
            fillOpacity: 0.5,
            color: '#1976d2',
            weight: 2
          }
        },
        {
          id: 'industrial_clusters',
          name: 'Industrial Clusters',
          type: 'heatmap',
          data: industrialClusters || [],
          style: {
            radius: 20,
            blur: 15,
            maxZoom: 10
          }
        },
        {
          id: 'logistics_infrastructure',
          name: 'Logistics Infrastructure',
          type: 'markers',
          data: logisticsInfra || [],
          style: {
            icon: '🏭',
            size: 'medium'
          }
        },
        {
          id: 'city_scores',
          name: 'City Scores Heatmap',
          type: 'heatmap',
          data: cities || [],
          style: {
            radius: 25,
            blur: 20,
            maxZoom: 12
          }
        }
      ]
    });
  } catch (error) {
    console.error("Error in getMapLayers:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
