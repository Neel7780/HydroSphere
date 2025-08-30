// app/api/cities/compare/route.ts
import { NextRequest, NextResponse } from "next/server";
import City from "@/models/City";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const cityIds = searchParams.get("cityIds");

    if (!cityIds) {
      return NextResponse.json(
        { success: false, error: "cityIds parameter is required" },
        { status: 400 }
      );
    }

    const ids = cityIds
      .split(",")
      .map((id) => parseInt(id.trim()))
      .filter((id) => !isNaN(id));

    if (ids.length < 2) {
      return NextResponse.json(
        { success: false, error: "At least 2 valid city IDs required" },
        { status: 400 }
      );
    }

    const cities = await Promise.all(ids.map((id) => City.findById(id)));
    const validCities = cities.filter((c) => c !== null);

    return NextResponse.json({
      success: true,
      comparison: validCities,
    });
  } catch (error) {
    console.error("Error in compareCities:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
