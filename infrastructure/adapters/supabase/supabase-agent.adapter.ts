import { mapAgentsTopRowToEntity } from "@/application/mappers/agents-top.mapper";
import { mapRealEstateAgentRowToEntity } from "@/application/mappers/real-estate-agent.mapper";
import { ProfileEntity } from "@/domain/entities/profile.entity";
import { EAgentRole } from "@/domain/entities/real-estate-agent.entity";
import { AgentPort } from "@/domain/ports/agent.port";
import { LandingAgent } from "@/domain/types/landing.types";
import { SupabaseClient } from "@supabase/supabase-js";

export class SupabaseAgentAdapter implements AgentPort {
  constructor(private readonly supabase: SupabaseClient) {}

  async addAgent(
    realEstateId: string,
    profile_id: string,
    role: EAgentRole = EAgentRole.Agent,
  ): Promise<void> {
    const { error } = await this.supabase.from("real_estate_agents").insert({
      real_estate_id: realEstateId,
      profile_id: profile_id,
      role: role,
    });
    if (error) {
      console.warn(error);
      throw new Error(error.message);
    }
  }

  async removeAgent(realEstateId: string, profile_id: string): Promise<void> {
    const { error } = await this.supabase
      .from("real_estate_agents")
      .delete()
      .eq("real_estate_id", realEstateId)
      .eq("profile_id", profile_id);

    if (error) throw new Error(error.message);
  }

  async listAgents(realEstateId: string): Promise<ProfileEntity[]> {
    const { data, error } = await this.supabase
      .from("real_estate_agents")
      .select(
        `
        profile:profiles (
          id,
          full_name,
          avatar_url,
          phone,
          role,
          created_at
        )
      `,
      )
      .eq("real_estate_id", realEstateId);

    if (error) throw new Error(error.message);

    return data.map((p) => mapRealEstateAgentRowToEntity(p.profile));
  }

  async getTopAgents(limit: number): Promise<LandingAgent[]> {
    const { data, error } = await this.supabase
      .from("real_estate_agents")
      .select(
        `
        profile:profiles (
          id,
          full_name,
          avatar_url
        )
      `,
      )
      .eq("role", "agent")
      .limit(limit);

    if (error) throw new Error(error.message);

    const profiles = data.filter((a) => a.profile);
    return profiles ? profiles.map((p) => mapAgentsTopRowToEntity(p)) : [];
  }
}
