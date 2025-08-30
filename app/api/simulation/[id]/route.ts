import { NextRequest, NextResponse } from "next/server";
import * as SimulationController from "@/controllers/simulationController";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await SimulationController.getSimulation(params.id);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
