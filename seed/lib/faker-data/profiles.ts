// ==========================================
// Profiles Generator for Seed
// ==========================================

import { faker } from "@faker-js/faker";
import type { SeedProfile } from "../../types";
import { EUserRole } from "@/domain/entities/profile.entity";

/**
 * Genera perfiles fake (coordinadores, agentes, clientes).
 */
export function generateFakeProfiles(options: {
  coordinators: number;
  agentsPerCoordinator: number;
  clients: number;
}): {
  coordinators: SeedProfile[];
  agents: SeedProfile[];
  clients: SeedProfile[];
} {
  const coordinators: SeedProfile[] = [];
  const agents: SeedProfile[] = [];
  const clients: SeedProfile[] = [];

  // Generar coordinadores
  for (let i = 0; i < options.coordinators; i++) {
    coordinators.push({
      id: faker.string.uuid(),
      email: `coordinador${i + 1}@zonaraiz.test`,
      full_name: faker.person.fullName(),
      phone: `+57 ${faker.number.int({ min: 10000000, max: 99999999 })}`,
      role: EUserRole.RealEstate,
      avatar_url: faker.image.url({ width: 200, height: 200 }),
    });
  }

  // Generar agentes
  for (
    let i = 0;
    i < options.coordinators * options.agentsPerCoordinator;
    i++
  ) {
    agents.push({
      id: faker.string.uuid(),
      email: `agente${i + 1}@zonaraiz.test`,
      full_name: faker.person.fullName(),
      phone: `+57 ${faker.number.int({ min: 10000000, max: 99999999 })}`,
      role: EUserRole.RealEstate,
      avatar_url: faker.image.url({ width: 200, height: 200 }),
    });
  }

  // Generar clientes
  for (let i = 0; i < options.clients; i++) {
    clients.push({
      id: faker.string.uuid(),
      email: `cliente${i + 1}@zonaraiz.test`,
      full_name: faker.person.fullName(),
      phone: `+57 ${faker.number.int({ min: 10000000, max: 99999999 })}`,
      role: EUserRole.Client,
      avatar_url: faker.image.url({ width: 200, height: 200 }),
    });
  }

  return { coordinators, agents, clients };
}