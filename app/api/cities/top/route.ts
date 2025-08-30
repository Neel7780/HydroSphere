import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');
    const weights = {
      renewable: parseFloat(searchParams.get('renewable') || '25'),
      water: parseFloat(searchParams.get('water') || '25'),
      industrial: parseFloat(searchParams.get('industrial') || '25'),
      logistics: parseFloat(searchParams.get('logistics') || '25')
    };

    // Get top cities with custom scoring
    const { data: cities, error } = await supabase
      .from('cities')
      .select(`
        id,
        name,
        state,
        latitude,
        longitude,
        population,
        renewable_score,
        water_score,
        industrial_score,
        logistics_score,
        overall_score
      `)
      .order('overall_score', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    // Apply custom weights if different from default
    if (weights.renewable !== 25 || weights.water !== 25 || weights.industrial !== 25 || weights.logistics !== 25) {
      cities.forEach(city => {
        city.custom_score = (
          (city.renewable_score * weights.renewable / 100) +
          (city.water_score * weights.water / 100) +
          (city.industrial_score * weights.industrial / 100) +
          (city.logistics_score * weights.logistics / 100)
        );
      });
      
      cities.sort((a, b) => (b.custom_score || 0) - (a.custom_score || 0));
    }

    return NextResponse.json({
      success: true,
      cities: cities,
      weights: weights
    });
  } catch (error) {
    console.error("Error in getTopCities:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
