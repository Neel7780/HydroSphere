import { NextRequest, NextResponse } from "next/server";
import * as HydrobotController from "@/controllers/hydrobotController";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await HydrobotController.chat(body);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
