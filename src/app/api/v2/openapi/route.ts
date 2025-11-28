import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const specPath = path.join(process.cwd(), "openapi.yaml");

  try {
    const spec = await fs.promises.readFile(specPath, "utf-8");

    return new NextResponse(spec, {
      status: 200,
      headers: {
        "content-type": "text/yaml; charset=utf-8",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "OpenAPI spec not found" },
      { status: 500 }
    );
  }
}
