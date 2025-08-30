import { NextRequest, NextResponse } from "next/server";
import * as CityController from "@/controllers/cityController";

export async function GET(req: NextRequest) {
  try {
    const data = await CityController.getTopCities(req);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
