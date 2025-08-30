import { NextResponse } from "next/server";

export function errorHandler(err: any) {
  console.error("Error:", err);

  if (err.code && err.code.startsWith("23")) {
    return NextResponse.json({ success: false, error: "Database constraint violation" }, { status: 400 });
  }
  if (err.name === "ValidationError") {
    return NextResponse.json({ success: false, error: "Validation Error", message: err.message }, { status: 400 });
  }
  return NextResponse.json(
    { success: false, error: "Internal Server Error", message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong" },
    { status: 500 }
  );
}
