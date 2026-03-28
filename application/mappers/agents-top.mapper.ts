import { LandingAgent } from "../actions/landing.actions";

export function mapAgentsTopRowToEntity(row: {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}): LandingAgent {
  return {
    id: row.id,
    full_name: row.full_name ?? "Agente",
    avatar_url: row.avatar_url,
  };
}
