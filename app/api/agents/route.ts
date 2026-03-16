import { NextRequest, NextResponse } from "next/server";
import { agentModule } from "@/application/modules/agent.module";

export async function GET(request: NextRequest) {
  const realEstateId = request.nextUrl.searchParams.get("real_estate_id");
  if (!realEstateId) {
    return NextResponse.json(
      { error: "real_estate_id is required" },
      { status: 400 }
    );
  }

  try {
    const { agentService } = await agentModule();
    const agents = await agentService.getCachedListAgents(realEstateId);
    return NextResponse.json(agents);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch agents" },
      { status: 500 }
    );
  }
}
