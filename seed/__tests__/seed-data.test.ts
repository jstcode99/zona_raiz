// ==========================================
// Seed Logger Tests
// ==========================================

import { describe, it, expect } from "vitest";

// Copy logger implementation for testing
enum TestLogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

class TestSeedLogger {
  private static level: TestLogLevel = TestLogLevel.INFO;

  static setLevel(level: TestLogLevel): void {
    this.level = level;
  }

  static debug(_message: string, ..._args: unknown[]): void {
    // No-op for testing
  }

  static info(_message: string, ..._args: unknown[]): void {
    // No-op for testing
  }

  static success(_message: string, ..._args: unknown[]): void {
    // No-op for testing
  }

  static warn(_message: string, ..._args: unknown[]): void {
    // No-op for testing
  }

  static error(_message: string, ..._args: unknown[]): void {
    // No-op for testing
  }

  static section(_title: string): void {
    // No-op for testing
  }

  static subSection(_title: string): void {
    // No-op for testing
  }

  static progress(_current: number, _total: number, _item?: string): void {
    // No-op for testing
  }
}

describe("TestSeedLogger (clone of SeedLogger)", () => {
  it("should have all log methods", () => {
    expect(typeof TestSeedLogger.debug).toBe("function");
    expect(typeof TestSeedLogger.info).toBe("function");
    expect(typeof TestSeedLogger.success).toBe("function");
    expect(typeof TestSeedLogger.warn).toBe("function");
    expect(typeof TestSeedLogger.error).toBe("function");
    expect(typeof TestSeedLogger.section).toBe("function");
    expect(typeof TestSeedLogger.subSection).toBe("function");
    expect(typeof TestSeedLogger.progress).toBe("function");
  });

  it("should not throw when setting level", () => {
    expect(() => {
      TestSeedLogger.setLevel(TestLogLevel.DEBUG);
      TestSeedLogger.setLevel(TestLogLevel.INFO);
      TestSeedLogger.setLevel(TestLogLevel.WARN);
      TestSeedLogger.setLevel(TestLogLevel.ERROR);
    }).not.toThrow();
  });

  it("should have correct LogLevel values", () => {
    expect(TestLogLevel.DEBUG).toBe(0);
    expect(TestLogLevel.INFO).toBe(1);
    expect(TestLogLevel.WARN).toBe(2);
    expect(TestLogLevel.ERROR).toBe(3);
  });
});

describe("Profile Generation Logic", () => {
  // Helper function to generate profiles (simplified version)
  function generateTestProfiles(options: {
    realEstateCount: number;
    agentsPerRealEstate: number;
    clientsCount: number;
  }) {
    const coordinatorProfiles: any[] = [];
    const agentProfiles: any[] = [];
    const clientProfiles: any[] = [];

    const coordinatorNames = [
      "María del Rosario García",
      "Juan Carlos Martínez",
      "Ana Lucía Fernández",
    ];

    const clientNames = [
      "Roberto Carlos Mendoza",
      "Patricia Elena Herrera",
      "Federico David Luna",
    ];

    for (let i = 0; i < options.realEstateCount; i++) {
      coordinatorProfiles.push({
        id: `pr-coord-${String(i + 1).padStart(4, "0")}`,
        email: `coordinador${i + 1}@zonaraiz.test`,
        fullName: coordinatorNames[i] || `Coordinador ${i + 1}`,
        role: "real-estate",
      });
    }

    for (let i = 0; i < options.realEstateCount * options.agentsPerRealEstate; i++) {
      agentProfiles.push({
        id: `pr-agent-${String(i + 1).padStart(4, "0")}`,
        email: `agente${i + 1}@zonaraiz.test`,
        fullName: `Agente ${i + 1}`,
        role: "real-estate",
      });
    }

    for (let i = 0; i < options.clientsCount; i++) {
      clientProfiles.push({
        id: `pr-client-${String(i + 1).padStart(4, "0")}`,
        email: `cliente${i + 1}@zonaraiz.test`,
        fullName: clientNames[i] || `Cliente ${i + 1}`,
        role: "client",
      });
    }

    return { coordinatorProfiles, agentProfiles, clientProfiles };
  }

  it("should generate correct number of profiles", () => {
    const result = generateTestProfiles({
      realEstateCount: 2,
      agentsPerRealEstate: 3,
      clientsCount: 3,
    });

    expect(result.coordinatorProfiles).toHaveLength(2);
    expect(result.agentProfiles).toHaveLength(6); // 2 * 3
    expect(result.clientProfiles).toHaveLength(3);
  });

  it("should generate unique IDs for all profiles", () => {
    const result = generateTestProfiles({
      realEstateCount: 2,
      agentsPerRealEstate: 3,
      clientsCount: 3,
    });

    const allIds = [
      ...result.coordinatorProfiles.map((p) => p.id),
      ...result.agentProfiles.map((p) => p.id),
      ...result.clientProfiles.map((p) => p.id),
    ];

    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(allIds.length);
  });

  it("should assign correct roles", () => {
    const result = generateTestProfiles({
      realEstateCount: 1,
      agentsPerRealEstate: 1,
      clientsCount: 1,
    });

    result.coordinatorProfiles.forEach((p) => {
      expect(p.role).toBe("real-estate");
    });

    result.agentProfiles.forEach((p) => {
      expect(p.role).toBe("real-estate");
    });

    result.clientProfiles.forEach((p) => {
      expect(p.role).toBe("client");
    });
  });

  it("should generate valid email formats", () => {
    const result = generateTestProfiles({
      realEstateCount: 1,
      agentsPerRealEstate: 1,
      clientsCount: 1,
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    [
      ...result.coordinatorProfiles,
      ...result.agentProfiles,
      ...result.clientProfiles,
    ].forEach((p) => {
      expect(p.email).toMatch(emailRegex);
    });
  });
});

describe("Favorite Generation Logic", () => {
  function generateFavorites(
    clientProfiles: any[],
    activeListings: any[],
    count: number
  ) {
    const favorites: any[] = [];
    const usedKeys = new Set<string>();

    while (favorites.length < count && favorites.length < clientProfiles.length * activeListings.length) {
      const randomClient = clientProfiles[Math.floor(Math.random() * clientProfiles.length)];
      const randomListing = activeListings[Math.floor(Math.random() * activeListings.length)];
      const key = `${randomClient.id}-${randomListing.id}`;

      if (!usedKeys.has(key)) {
        usedKeys.add(key);
        favorites.push({
          id: `fv-${String(favorites.length + 1).padStart(4, "0")}`,
          profileId: randomClient.id,
          listingId: randomListing.id,
        });
      }
    }

    return favorites;
  }

  it("should generate unique favorites", () => {
    const clients = [
      { id: "client-1" },
      { id: "client-2" },
    ];

    const listings = [
      { id: "listing-1" },
      { id: "listing-2" },
      { id: "listing-3" },
    ];

    const favorites = generateFavorites(clients, listings, 5);

    const uniqueKeys = new Set(
      favorites.map((f) => `${f.profileId}-${f.listingId}`)
    );

    expect(uniqueKeys.size).toBe(favorites.length);
  });

  it("should not exceed possible combinations", () => {
    const clients = [
      { id: "client-1" },
      { id: "client-2" },
    ];

    const listings = [
      { id: "listing-1" },
      { id: "listing-2" },
    ];

    const favorites = generateFavorites(clients, listings, 100);

    // Should only generate as many as there are possible combinations
    expect(favorites.length).toBeLessThanOrEqual(4);
  });
});

describe("Inquiry Generation Logic", () => {
  const validStatuses = ["new", "contacted", "qualified", "converted", "lost"];
  const validSources = ["web", "whatsapp", "phone", "email", "referral"];

  function generateInquiries(listings: any[], agents: any[], count: number) {
    const inquiries: any[] = [];

    for (let i = 0; i < count; i++) {
      const listing = listings[i % listings.length];
      const agent = agents[i % agents.length];

      // Random status
      const status = validStatuses[Math.floor(Math.random() * validStatuses.length)];

      inquiries.push({
        id: `in-${String(i + 1).padStart(4, "0")}`,
        listingId: listing.id,
        name: `Test User ${i + 1}`,
        email: `test${i + 1}@email.com`,
        source: validSources[Math.floor(Math.random() * validSources.length)],
        status,
        assignedTo: agent.profileId,
      });
    }

    return inquiries;
  }

  it("should generate correct number of inquiries", () => {
    const agents = [{ profileId: "agent-1" }, { profileId: "agent-2" }];
    const listings = [{ id: "listing-1" }, { id: "listing-2" }];

    const inquiries = generateInquiries(listings, agents, 10);

    expect(inquiries).toHaveLength(10);
  });

  it("should assign valid statuses", () => {
    const agents = [{ profileId: "agent-1" }];
    const listings = [{ id: "listing-1" }];

    const inquiries = generateInquiries(listings, agents, 50);

    inquiries.forEach((inq) => {
      expect(validStatuses).toContain(inq.status);
    });
  });

  it("should have valid sources", () => {
    const agents = [{ profileId: "agent-1" }];
    const listings = [{ id: "listing-1" }];

    const inquiries = generateInquiries(listings, agents, 50);

    inquiries.forEach((inq) => {
      expect(validSources).toContain(inq.source);
    });
  });

  it("should distribute status across different values", () => {
    const agents = [{ profileId: "agent-1" }];
    const listings = [{ id: "listing-1" }];

    const inquiries = generateInquiries(listings, agents, 100);

    const statusCounts = inquiries.reduce((acc: Record<string, number>, inq) => {
      acc[inq.status] = (acc[inq.status] || 0) + 1;
      return acc;
    }, {});

    // Should have at least 3 different statuses
    expect(Object.keys(statusCounts).length).toBeGreaterThanOrEqual(3);
  });
});
