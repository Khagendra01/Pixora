import { NextRequest, NextResponse } from "next/server";
import { CodexLogger } from "@/app/actions/codexLogger";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const stats = searchParams.get("stats") === "true";

    const logger = new CodexLogger("api");

    if (stats) {
      const logStats = await logger.getLogStats();
      return NextResponse.json(logStats);
    }

    if (sessionId) {
      const logs = await logger.getSessionLogs(sessionId);
      return NextResponse.json(logs);
    }

    const allLogs = await logger.getAllLogs();
    return NextResponse.json(allLogs);
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}
