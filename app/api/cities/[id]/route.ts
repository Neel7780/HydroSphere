// app/api/cities/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import City from "@/models/City";
import { pool } from "@/lib/database";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const cityId = parseInt(context.params.id);

    if (isNaN(cityId)) {
      return NextResponse.json(
        { success: false, error: "Invalid city ID format" },
        { status: 400 }
      );
    }

    const cityDetails = await City.findById(cityId);
    if (!cityDetails) {
      return NextResponse.json(
        { success: false, error: "City not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      city: cityDetails,
    });
  } catch (error) {
    console.error("Error in getCityDetails:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
