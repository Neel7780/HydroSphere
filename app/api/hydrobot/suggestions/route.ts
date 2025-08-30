import { NextRequest, NextResponse } from "next/server";
import * as HydrobotController from "@/src/controllers/hydrobotController";

export async function GET(req: NextRequest) {
  try {
    const data = await HydrobotController.getSuggestions();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
