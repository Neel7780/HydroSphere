import { NextRequest, NextResponse } from "next/server";
import * as MapController from "@/controllers/mapController";

export async function GET(req: NextRequest) {
  try {
    const data = await MapController.getMapData(req);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
