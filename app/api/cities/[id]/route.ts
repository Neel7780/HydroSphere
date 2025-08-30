// app/api/cities/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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

    // Get city details with Supabase
    const { data: city, error } = await supabase
      .from('cities')
      .select(`
        *,
        renewable_data (*),
        water_resources (*),
        industrial_data (*),
        logistics_data (*)
      `)
      .eq('id', cityId)
      .single();

    if (error || !city) {
      return NextResponse.json(
        { success: false, error: "City not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      city: city,
    });
  } catch (error) {
    console.error("Error in getCityDetails:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
