import { NextRequest, NextResponse } from "next/server";
import { SimulationController } from "@/controllers/simulationController";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Attach the id to the request URL for the controller
    req.nextUrl.pathname = `/api/simulation/${params.id}`;
    return await SimulationController.getSimulation(req);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
