import { NextRequest, NextResponse } from "next/server";
import * as SimulationController from "@/controllers/simulationController";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await SimulationController.runSimulation(body);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
