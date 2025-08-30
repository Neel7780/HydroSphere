// app/api/cities/top/route.ts
import { NextRequest, NextResponse } from "next/server";
import City from "@/models/City";
import { pool } from "@/lib/database";

interface CustomWeights {
  renewable?: number;
  water?: number;
  industrial?: number;
  logistics?: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const limit = parseInt(searchParams.get("limit") || "5");
    const weights = searchParams.get("weights");

    if (isNaN(limit) || limit < 1 || limit > 50) {
      return NextResponse.json(
        { success: false, error: "Invalid limit parameter. Must be between 1 and 50." },
        { status: 400 }
      );
    }

    let cities: any[] = [];
    let appliedWeights: CustomWeights;

    if (weights) {
      try {
        const weightObj: CustomWeights = JSON.parse(weights);
        const totalWeight =
          (weightObj.renewable || 0) +
          (weightObj.water || 0) +
          (weightObj.industrial || 0) +
          (weightObj.logistics || 0);

        if (Math.abs(totalWeight - 100) > 1) {
          return NextResponse.json(
            { success: false, error: "Weights must sum to 100%. Current sum: " + totalWeight },
            { status: 400 }
          );
        }

        cities = await City.findWithCustomWeights(weightObj);
        cities = cities.slice(0, limit);
        appliedWeights = weightObj;
      } catch {
        return NextResponse.json(
          { success: false, error: "Invalid weights JSON format" },
          { status: 400 }
        );
      }
    } else {
      cities = await City.findTopCities(limit);
      appliedWeights = { renewable: 25, water: 25, industrial: 25, logistics: 25 };
    }

    const citiesWithDetails = await Promise.all(
      cities.map(async (city) => {
        const details = await City.findById(city.id);
        if (!details) return { ...city, details: null };

        return {
          id: city.id,
          name: city.name,
          state: city.state,
          latitude: city.latitude,
          longitude: city.longitude,
          population: city.population,
          coordinates: [city.longitude, city.latitude],
          scores: {
            renewable: parseFloat(city.renewable_score) || 0,
            water: parseFloat(city.water_score) || 0,
            industrial: parseFloat(city.industrial_score) || 0,
            logistics: parseFloat(city.logistics_score) || 0,
            overall: parseFloat(city.overall_score || city.custom_score) || 0,
          },
          details,
          rank: cities.findIndex((c) => c.id === city.id) + 1,
        };
      })
    );

    return NextResponse.json({
      success: true,
      cities: citiesWithDetails.filter((city) => city.details !== null),
      metadata: {
        total_returned: citiesWithDetails.length,
        criteria_used: appliedWeights,
        ranking_method: weights ? "custom_weighted" : "default_equal_weights",
        last_updated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error in getTopCities:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function getTopCities(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const limit = parseInt(searchParams.get("limit") || "5");

  if (isNaN(limit) || limit < 1 || limit > 50) {
    throw new Error("Invalid limit parameter. Must be between 1 and 50.");
  }

  const cities = await City.findTopCities(limit);

  return {
    success: true,
    cities,
  };
}