import { NextRequest, NextResponse } from "next/server";
import * as SimulationController from "@/controllers/simulationController";

export async function GET(req: NextRequest) {
  try {
    const data = await SimulationController.getSimulationHistory(req);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
