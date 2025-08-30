import { NextRequest } from "next/server";
import MapController from "@/controllers/mapController";

export async function GET(req: NextRequest) {
  return MapController.getMapData(req);
}
