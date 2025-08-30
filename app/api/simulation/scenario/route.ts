import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { weights, constraints, scenario_name } = await request.json();
    
    // Validate weights
    const totalWeight = Object.values(weights).reduce((sum: number, weight: any) => sum + weight, 0);
    if (Math.abs(totalWeight - 100) > 0.01) {
      return NextResponse.json({
        success: false,
        error: "Weights must sum to 100"
      }, { status: 400 });
    }

    // Get cities with custom scoring based on weights
    const { data: cities, error } = await supabase
      .from('cities')
      .select(`
        id,
        name,
        state,
        latitude,
        longitude,
        renewable_score,
        water_score,
        industrial_score,
        logistics_score
      `);

    if (error) {
      throw error;
    }

    // Apply custom scoring algorithm
    const scoredCities = cities.map(city => {
      const customScore = (
        (city.renewable_score * weights.renewable / 100) +
        (city.water_score * weights.water / 100) +
        (city.industrial_score * weights.industrial / 100) +
        (city.logistics_score * weights.logistics / 100)
      );

      return {
        ...city,
        custom_score: customScore,
        meets_constraints: (
          city.renewable_score >= (constraints?.min_renewable || 0) &&
          city.water_score >= (constraints?.min_water || 0) &&
          city.industrial_score >= (constraints?.min_industrial || 0) &&
          city.logistics_score >= (constraints?.min_logistics || 0)
        )
      };
    });

    // Filter by constraints and sort by score
    const filteredCities = scoredCities
      .filter(city => city.meets_constraints)
      .sort((a, b) => b.custom_score - a.custom_score);

    // Save simulation scenario
    const { data: savedScenario, error: saveError } = await supabase
      .from('simulation_scenarios')
      .insert({
        scenario_name: scenario_name || `Scenario_${Date.now()}`,
        weights: weights,
        constraints: constraints,
        results: {
          top_cities: filteredCities.slice(0, 5),
          total_cities_analyzed: cities.length,
          cities_meeting_constraints: filteredCities.length,
          average_score: filteredCities.reduce((sum, city) => sum + city.custom_score, 0) / filteredCities.length
        }
      })
      .select()
      .single();

    if (saveError) {
      console.warn("Could not save scenario:", saveError);
    }

    return NextResponse.json({
      success: true,
      scenario: savedScenario,
      results: {
        top_cities: filteredCities.slice(0, 5),
        total_cities_analyzed: cities.length,
        cities_meeting_constraints: filteredCities.length,
        average_score: filteredCities.reduce((sum, city) => sum + city.custom_score, 0) / filteredCities.length,
        weights_applied: weights,
        constraints_applied: constraints
      }
    });
  } catch (error) {
    console.error("Error in scenario simulation:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
} 