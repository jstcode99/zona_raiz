import { appModule } from "@/application/modules/app.module";
import { detectLang } from "@/i18n/detect-lang";
import { initI18n } from "@/i18n/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const realEstateId = request.nextUrl.searchParams.get("real_estate_id");
  if (!realEstateId) {
    return NextResponse.json(
      { error: "real_estate_id is required" },
      { status: 400 }
    );
  }

  try {
    const lang = detectLang(request)
    const i18n = await initI18n(lang)
    const t = i18n.getFixedT(lang)
    const cookieStore = await cookies()
    const { agentService } = await appModule(lang, { cookies: cookieStore })
    const agents = await agentService.getCachedListAgents(realEstateId);
    return NextResponse.json(agents);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch agents" },
      { status: 500 }
    );
  }
}
