// ==========================================
// Seed Data Integrity Tests
// ==========================================

import { describe, it, expect } from "vitest";
import { REAL_ESTATES, PROPERTIES, LISTINGS, PROPERTY_IMAGES } from "../data";
import { generateTestProfiles } from "../lib/seeders/profile.seeder";
import { generateFavorites } from "../lib/seeders/favorite.seeder";
import { generateInquiries } from "../lib/seeders/inquiry.seeder";
import { formatNumber, formatBytes, generateSlug, generateUUID } from "../lib/logger";

// UUID v4 validation regex pattern
const UUID_V4_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe("Seed Data Integrity - Real Estates", () => {
  it("should have at least 2 real estates", () => {
    expect(REAL_ESTATES.length).toBeGreaterThanOrEqual(2);
  });

  it("should have unique IDs for all real estates", () => {
    const ids = new Set(REAL_ESTATES.map((re) => re.id));
    expect(ids.size).toBe(REAL_ESTATES.length);
  });

  it("should have valid UUID v4 format for all real estate IDs", () => {
    REAL_ESTATES.forEach((re) => {
      expect(re.id).toMatch(UUID_V4_PATTERN);
    });
  });

  it("should have valid required fields for all real estates", () => {
    REAL_ESTATES.forEach((re) => {
      expect(re.id).toBeTruthy();
      expect(re.name).toBeTruthy();
      expect(re.description).toBeTruthy();
      expect(re.whatsapp).toBeTruthy();
      expect(re.street).toBeTruthy();
      expect(re.city).toBeTruthy();
      expect(re.state).toBeTruthy();
      expect(re.postalCode).toBeTruthy();
      expect(re.country).toBeTruthy();
    });
  });

  it("should have unique names for all real estates", () => {
    const names = new Set(REAL_ESTATES.map((re) => re.name));
    expect(names.size).toBe(REAL_ESTATES.length);
  });

  it("should have valid whatsapp numbers (argentinian format)", () => {
    REAL_ESTATES.forEach((re) => {
      expect(re.whatsapp).toMatch(/^\+549/);
    });
  });
});

describe("Seed Data Integrity - Properties", () => {
  it("should have at least 10 properties", () => {
    expect(PROPERTIES.length).toBeGreaterThanOrEqual(10);
  });

  it("should have unique IDs for all properties", () => {
    const ids = new Set(PROPERTIES.map((p) => p.id));
    expect(ids.size).toBe(PROPERTIES.length);
  });

  it("should have valid UUID v4 format for all property IDs", () => {
    PROPERTIES.forEach((p) => {
      expect(p.id).toMatch(UUID_V4_PATTERN);
    });
  });

  it("should have valid required fields for all properties", () => {
    PROPERTIES.forEach((p) => {
      expect(p.id).toBeTruthy();
      expect(p.realEstateId).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.slug).toBeTruthy();
      expect(p.city).toBeTruthy();
      expect(p.state).toBeTruthy();
      expect(p.country).toBeTruthy();
    });
  });

  it("should have unique slugs for all properties", () => {
    const slugs = new Set(PROPERTIES.map((p) => p.slug));
    expect(slugs.size).toBe(PROPERTIES.length);
  });

  it("should have valid slugs (URL-safe)", () => {
    PROPERTIES.forEach((p) => {
      expect(p.slug).toMatch(/^[a-z0-9-]+$/);
    });
  });

  it("should have properties referencing existing real estates", () => {
    const reIds = new Set(REAL_ESTATES.map((re) => re.id));
    PROPERTIES.forEach((p) => {
      expect(reIds.has(p.realEstateId)).toBe(true);
    });
  });

  it("should have at least one property per real estate", () => {
    REAL_ESTATES.forEach((re) => {
      const count = PROPERTIES.filter((p) => p.realEstateId === re.id).length;
      expect(count).toBeGreaterThan(0);
    });
  });

  it("should have unique property IDs globally", () => {
    const allIds = PROPERTIES.map((p) => p.id);
    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(allIds.length);
  });

  it("should have at least one property per real estate", () => {
    const reIds = new Set(REAL_ESTATES.map((re) => re.id));
    reIds.forEach((reId) => {
      const count = PROPERTIES.filter((p) => p.realEstateId === reId).length;
      expect(count).toBeGreaterThan(0);
    });
  });

  it("should have valid property types", () => {
    const validTypes = [
      "apartment", "house", "condo", "land",
      "commercial", "office", "warehouse", "other",
    ];
    PROPERTIES.forEach((p) => {
      expect(validTypes).toContain(p.propertyType);
    });
  });

  it("should have valid numeric fields (bedrooms, bathrooms, areas)", () => {
    PROPERTIES.forEach((p) => {
      if (p.bedrooms !== undefined) expect(p.bedrooms).toBeGreaterThanOrEqual(0);
      if (p.bathrooms !== undefined) expect(p.bathrooms).toBeGreaterThanOrEqual(0);
      if (p.totalArea !== undefined) expect(p.totalArea).toBeGreaterThan(0);
      if (p.builtArea !== undefined) expect(p.builtArea).toBeGreaterThan(0);
      if (p.yearBuilt !== undefined) expect(p.yearBuilt).toBeGreaterThan(1800);
      if (p.yearBuilt !== undefined) expect(p.yearBuilt).toBeLessThanOrEqual(new Date().getFullYear() + 2);
    });
  });

  it("should have unique geographic coordinates", () => {
    const coords = new Set(
      PROPERTIES
        .filter((p) => p.latitude !== undefined && p.longitude !== undefined)
        .map((p) => `${p.latitude},${p.longitude}`)
    );
    const propertiesWithCoords = PROPERTIES.filter(
      (p) => p.latitude !== undefined && p.longitude !== undefined
    );
    expect(coords.size).toBe(propertiesWithCoords.length);
  });
});

describe("Seed Data Integrity - Listings", () => {
  it("should have at least 5 active listings", () => {
    const activeListings = LISTINGS.filter((l) => l.status === "active");
    expect(activeListings.length).toBeGreaterThanOrEqual(5);
  });

  it("should have unique IDs for all listings", () => {
    const ids = new Set(LISTINGS.map((l) => l.id));
    expect(ids.size).toBe(LISTINGS.length);
  });

  it("should have valid UUID v4 format for all listing IDs", () => {
    LISTINGS.forEach((l) => {
      expect(l.id).toMatch(UUID_V4_PATTERN);
    });
  });

  it("should have valid required fields for all listings", () => {
    LISTINGS.forEach((l) => {
      expect(l.id).toBeTruthy();
      expect(l.propertyId).toBeTruthy();
      expect(l.listingType).toBeTruthy();
      expect(l.price).toBeGreaterThan(0);
      expect(l.currency).toBeTruthy();
      expect(l.whatsappContact).toBeTruthy();
      expect(l.status).toBeTruthy();
    });
  });

  it("should have valid listing types", () => {
    LISTINGS.forEach((l) => {
      expect(["sale", "rent"]).toContain(l.listingType);
    });
  });

  it("should have valid statuses", () => {
    const validStatuses = ["active", "draft", "paused", "sold", "rented", "expired"];
    LISTINGS.forEach((l) => {
      expect(validStatuses).toContain(l.status);
    });
  });

  it("should have valid currencies", () => {
    LISTINGS.forEach((l) => {
      expect(["USD", "ARS"]).toContain(l.currency);
    });
  });

  it("should have at least 1 featured listing", () => {
    const featured = LISTINGS.filter((l) => l.featured);
    expect(featured.length).toBeGreaterThanOrEqual(1);
  });

  it("should have valid statistics (views, inquiries, whatsapp clicks)", () => {
    LISTINGS.forEach((l) => {
      expect(l.viewsCount).toBeGreaterThanOrEqual(0);
      expect(l.inquiriesCount).toBeGreaterThanOrEqual(0);
      expect(l.whatsappClicks).toBeGreaterThanOrEqual(0);
    });
  });

  it("should have listings referencing existing properties", () => {
    const propIds = new Set(PROPERTIES.map((p) => p.id));
    LISTINGS.forEach((l) => {
      expect(propIds.has(l.propertyId)).toBe(true);
    });
  });

  it("should have featured listings with future expiration dates", () => {
    LISTINGS.filter((l) => l.featured).forEach((l) => {
      if (l.featuredUntil) {
        const until = new Date(l.featuredUntil);
        expect(until.getTime()).toBeGreaterThan(Date.now());
      }
    });
  });

  it("should have at least 1 sale listing", () => {
    const saleListings = LISTINGS.filter((l) => l.listingType === "sale");
    expect(saleListings.length).toBeGreaterThanOrEqual(1);
  });

  it("should have at least 1 rent listing", () => {
    const rentListings = LISTINGS.filter((l) => l.listingType === "rent");
    expect(rentListings.length).toBeGreaterThanOrEqual(1);
  });
});

describe("Seed Data Integrity - Property Images", () => {
  it("should have images referencing existing properties", () => {
    const propIdSet = new Set(PROPERTIES.map((p) => p.id));
    PROPERTY_IMAGES.forEach((img) => {
      expect(propIdSet.has(img.propertyId)).toBe(true);
    });
  });

  it("should have unique IDs for all images", () => {
    const ids = new Set(PROPERTY_IMAGES.map((img) => img.id));
    expect(ids.size).toBe(PROPERTY_IMAGES.length);
  });

  it("should have valid UUID v4 format for all property image IDs", () => {
    PROPERTY_IMAGES.forEach((img) => {
      expect(img.id).toMatch(UUID_V4_PATTERN);
    });
  });

  it("should have exactly one primary image per property that has images", () => {
    const propIdsWithImages = new Set(PROPERTY_IMAGES.map((img) => img.propertyId));

    propIdsWithImages.forEach((propId) => {
      const primaryCount = PROPERTY_IMAGES.filter(
        (img) => img.propertyId === propId && img.isPrimary
      ).length;
      expect(primaryCount).toBe(1);
    });
  });

  it("should have valid display orders", () => {
    PROPERTY_IMAGES.forEach((img) => {
      expect(img.displayOrder).toBeGreaterThanOrEqual(0);
    });
  });

  it("should have valid image dimensions", () => {
    PROPERTY_IMAGES.forEach((img) => {
      if (img.width !== undefined) expect(img.width).toBeGreaterThan(0);
      if (img.height !== undefined) expect(img.height).toBeGreaterThan(0);
    });
  });

  it("should have valid file sizes", () => {
    PROPERTY_IMAGES.forEach((img) => {
      if (img.fileSize !== undefined) {
        expect(img.fileSize).toBeGreaterThan(0);
        expect(img.fileSize).toBeLessThan(10 * 1024 * 1024); // Less than 10MB
      }
    });
  });
});

describe("Profile Generator", () => {
  it("should generate unique coordinator IDs", () => {
    const result = generateTestProfiles({
      realEstateCount: 2,
      agentsPerRealEstate: 3,
      clientsCount: 3,
    });

    const coordinatorIds = new Set(result.coordinatorProfiles.map((p) => p.id));
    expect(coordinatorIds.size).toBe(result.coordinatorProfiles.length);
  });

  it("should generate unique agent IDs", () => {
    const result = generateTestProfiles({
      realEstateCount: 2,
      agentsPerRealEstate: 3,
      clientsCount: 3,
    });

    const agentIds = new Set(result.agentProfiles.map((p) => p.id));
    expect(agentIds.size).toBe(result.agentProfiles.length);
  });

  it("should generate unique client IDs", () => {
    const result = generateTestProfiles({
      realEstateCount: 2,
      agentsPerRealEstate: 3,
      clientsCount: 3,
    });

    const clientIds = new Set(result.clientProfiles.map((p) => p.id));
    expect(clientIds.size).toBe(result.clientProfiles.length);
  });

  it("should generate all IDs globally unique", () => {
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

  it("should generate correct number of coordinators per real estate", () => {
    const result = generateTestProfiles({
      realEstateCount: 3,
      agentsPerRealEstate: 3,
      clientsCount: 3,
    });

    expect(result.coordinatorProfiles.length).toBe(3);
  });

  it("should generate correct number of agents", () => {
    const result = generateTestProfiles({
      realEstateCount: 2,
      agentsPerRealEstate: 4,
      clientsCount: 2,
    });

    expect(result.agentProfiles.length).toBe(8);
  });

  it("should generate valid email formats for all profiles", () => {
    const result = generateTestProfiles({
      realEstateCount: 2,
      agentsPerRealEstate: 3,
      clientsCount: 3,
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

  it("should assign 'real-estate' role to coordinators and agents", () => {
    const result = generateTestProfiles({
      realEstateCount: 1,
      agentsPerRealEstate: 1,
      clientsCount: 0,
    });

    result.coordinatorProfiles.forEach((p) => {
      expect(p.role).toBe("real-estate");
    });
    result.agentProfiles.forEach((p) => {
      expect(p.role).toBe("real-estate");
    });
  });

  it("should assign 'client' role to clients", () => {
    const result = generateTestProfiles({
      realEstateCount: 1,
      agentsPerRealEstate: 1,
      clientsCount: 1,
    });

    result.clientProfiles.forEach((p) => {
      expect(p.role).toBe("client");
    });
  });

  it("should generate valid argentinian phone numbers", () => {
    const result = generateTestProfiles({
      realEstateCount: 2,
      agentsPerRealEstate: 3,
      clientsCount: 3,
    });

    [
      ...result.coordinatorProfiles,
      ...result.agentProfiles,
      ...result.clientProfiles,
    ].forEach((p) => {
      expect(p.phone).toMatch(/^\+549/);
    });
  });

  it("should handle zero counts gracefully", () => {
    const result = generateTestProfiles({
      realEstateCount: 0,
      agentsPerRealEstate: 0,
      clientsCount: 0,
    });

    expect(result.coordinatorProfiles).toHaveLength(0);
    expect(result.agentProfiles).toHaveLength(0);
    expect(result.clientProfiles).toHaveLength(0);
  });
});

describe("Favorite Generator", () => {
  it("should generate unique favorites (no duplicate client-listing pairs)", () => {
    const clients = [
      { id: "client-1", email: "c1@test.com", fullName: "Client 1", phone: "+54911", role: "client" as const },
      { id: "client-2", email: "c2@test.com", fullName: "Client 2", phone: "+54911", role: "client" as const },
    ];

    const listings = [
      { id: "li-1", propertyId: "pr-1", agentId: "ag-1", listingType: "sale" as const, price: 100000, currency: "USD" as const, priceNegotiable: true, whatsappContact: "+54911", expensesIncluded: true, status: "active" as const, featured: false, viewsCount: 0, inquiriesCount: 0, whatsappClicks: 0 },
      { id: "li-2", propertyId: "pr-2", agentId: "ag-1", listingType: "sale" as const, price: 100000, currency: "USD" as const, priceNegotiable: true, whatsappContact: "+54911", expensesIncluded: true, status: "active" as const, featured: false, viewsCount: 0, inquiriesCount: 0, whatsappClicks: 0 },
      { id: "li-3", propertyId: "pr-3", agentId: "ag-1", listingType: "sale" as const, price: 100000, currency: "USD" as const, priceNegotiable: true, whatsappContact: "+54911", expensesIncluded: true, status: "active" as const, featured: false, viewsCount: 0, inquiriesCount: 0, whatsappClicks: 0 },
    ];

    const favorites = generateFavorites(clients, listings, 5);

    const pairs = favorites.map((f) => `${f.profileId}-${f.listingId}`);
    const uniquePairs = new Set(pairs);
    expect(uniquePairs.size).toBe(pairs.length);
  });

  it("should not generate more favorites than possible combinations", () => {
    const clients = [
      { id: "client-1", email: "c@test.com", fullName: "C", phone: "+54911", role: "client" as const },
    ];
    const listings = [
      { id: "li-1", propertyId: "pr-1", agentId: "ag-1", listingType: "sale" as const, price: 100, currency: "USD" as const, priceNegotiable: true, whatsappContact: "+54911", expensesIncluded: true, status: "active" as const, featured: false, viewsCount: 0, inquiriesCount: 0, whatsappClicks: 0 },
    ];

    const favorites = generateFavorites(clients, listings, 100);
    expect(favorites.length).toBeLessThanOrEqual(1);
  });

  it("should return empty array when no clients or listings", () => {
    const favorites = generateFavorites([], [], 5);
    expect(favorites).toHaveLength(0);
  });

  it("should respect count parameter", () => {
    const clients = [
      { id: "client-1", email: "c1@test.com", fullName: "C1", phone: "+54911", role: "client" as const },
      { id: "client-2", email: "c2@test.com", fullName: "C2", phone: "+54911", role: "client" as const },
      { id: "client-3", email: "c3@test.com", fullName: "C3", phone: "+54911", role: "client" as const },
    ];
    const listings = [
      { id: "li-1", propertyId: "pr-1", agentId: "ag-1", listingType: "sale" as const, price: 100, currency: "USD" as const, priceNegotiable: true, whatsappContact: "+54911", expensesIncluded: true, status: "active" as const, featured: false, viewsCount: 0, inquiriesCount: 0, whatsappClicks: 0 },
      { id: "li-2", propertyId: "pr-2", agentId: "ag-1", listingType: "sale" as const, price: 100, currency: "USD" as const, priceNegotiable: true, whatsappContact: "+54911", expensesIncluded: true, status: "active" as const, featured: false, viewsCount: 0, inquiriesCount: 0, whatsappClicks: 0 },
    ];

    const favorites = generateFavorites(clients, listings, 3);
    expect(favorites.length).toBe(3);
  });
});

describe("Inquiry Generator", () => {
  it("should generate correct number of inquiries", () => {
    const listings = [
      { id: "li-1", propertyId: "pr-1", agentId: "ag-1", listingType: "sale" as const, price: 100, currency: "USD" as const, priceNegotiable: true, whatsappContact: "+54911", expensesIncluded: true, status: "active" as const, featured: false, viewsCount: 0, inquiriesCount: 0, whatsappClicks: 0 },
    ];
    const agents = [{ profileId: "agent-1", realEstateId: "re-1", role: "agent" as const }];

    const inquiries = generateInquiries(listings, agents, 10);
    expect(inquiries).toHaveLength(10);
  });

  it("should assign valid statuses", () => {
    const listings = [
      { id: "li-1", propertyId: "pr-1", agentId: "ag-1", listingType: "sale" as const, price: 100, currency: "USD" as const, priceNegotiable: true, whatsappContact: "+54911", expensesIncluded: true, status: "active" as const, featured: false, viewsCount: 0, inquiriesCount: 0, whatsappClicks: 0 },
    ];
    const agents = [{ profileId: "agent-1", realEstateId: "re-1", role: "agent" as const }];

    const validStatuses = ["new", "contacted", "qualified", "converted", "lost"];
    const inquiries = generateInquiries(listings, agents, 50);

    inquiries.forEach((inq) => {
      expect(validStatuses).toContain(inq.status);
    });
  });

  it("should assign valid sources", () => {
    const listings = [
      { id: "li-1", propertyId: "pr-1", agentId: "ag-1", listingType: "sale" as const, price: 100, currency: "USD" as const, priceNegotiable: true, whatsappContact: "+54911", expensesIncluded: true, status: "active" as const, featured: false, viewsCount: 0, inquiriesCount: 0, whatsappClicks: 0 },
    ];
    const agents = [{ profileId: "agent-1", realEstateId: "re-1", role: "agent" as const }];

    const validSources = ["web", "whatsapp", "phone", "email", "referral"];
    const inquiries = generateInquiries(listings, agents, 50);

    inquiries.forEach((inq) => {
      expect(validSources).toContain(inq.source);
    });
  });

  it("should distribute status across different values", () => {
    const listings = [
      { id: "li-1", propertyId: "pr-1", agentId: "ag-1", listingType: "sale" as const, price: 100, currency: "USD" as const, priceNegotiable: true, whatsappContact: "+54911", expensesIncluded: true, status: "active" as const, featured: false, viewsCount: 0, inquiriesCount: 0, whatsappClicks: 0 },
    ];
    const agents = [{ profileId: "agent-1", realEstateId: "re-1", role: "agent" as const }];

    const inquiries = generateInquiries(listings, agents, 100);

    const statusCounts = inquiries.reduce(
      (acc: Record<string, number>, inq) => {
        acc[inq.status] = (acc[inq.status] || 0) + 1;
        return acc;
      },
      {}
    );

    expect(Object.keys(statusCounts).length).toBeGreaterThanOrEqual(2);
  });

  it("should reference active listings only", () => {
    const listings = [
      { id: "li-1", propertyId: "pr-1", agentId: "ag-1", listingType: "sale" as const, price: 100, currency: "USD" as const, priceNegotiable: true, whatsappContact: "+54911", expensesIncluded: true, status: "active" as const, featured: false, viewsCount: 0, inquiriesCount: 0, whatsappClicks: 0 },
      { id: "li-2", propertyId: "pr-2", agentId: "ag-1", listingType: "sale" as const, price: 100, currency: "USD" as const, priceNegotiable: true, whatsappContact: "+54911", expensesIncluded: true, status: "draft" as const, featured: false, viewsCount: 0, inquiriesCount: 0, whatsappClicks: 0 },
    ];
    const agents = [{ profileId: "agent-1", realEstateId: "re-1", role: "agent" as const }];

    const inquiries = generateInquiries(listings, agents, 20);

    inquiries.forEach((inq) => {
      expect(inq.listingId).toBe("li-1"); // Only active listings
    });
  });

  it("should assign agents from the provided list", () => {
    const listings = [
      { id: "li-1", propertyId: "pr-1", agentId: "ag-1", listingType: "sale" as const, price: 100, currency: "USD" as const, priceNegotiable: true, whatsappContact: "+54911", expensesIncluded: true, status: "active" as const, featured: false, viewsCount: 0, inquiriesCount: 0, whatsappClicks: 0 },
    ];
    const agents = [
      { profileId: "agent-1", realEstateId: "re-1", role: "agent" as const },
      { profileId: "agent-2", realEstateId: "re-1", role: "agent" as const },
    ];

    const inquiries = generateInquiries(listings, agents, 20);

    inquiries.forEach((inq) => {
      expect(["agent-1", "agent-2"]).toContain(inq.assignedTo);
    });
  });
});

describe("Logger Utilities", () => {
  it("should format numbers with thousands separator (es-AR locale)", () => {
    expect(formatNumber(1000)).toBe("1.000");
    expect(formatNumber(1234567)).toBe("1.234.567");
    expect(formatNumber(0)).toBe("0");
  });

  it("should format bytes correctly", () => {
    expect(formatBytes(0)).toBe("0 Bytes");
    expect(formatBytes(1024)).toBe("1 KB");
    expect(formatBytes(1048576)).toBe("1 MB");
    expect(formatBytes(1536)).toBe("1.5 KB");
  });

  it("should generate URL-safe slugs", () => {
    expect(generateSlug("Casa en Venta")).toBe("casa-en-venta");
    expect(generateSlug("Departamento 3 ambientes!!!")).toBe("departamento-3-ambientes");
    expect(generateSlug("  Multiple   Spaces  ")).toBe("multiple-spaces");
    expect(generateSlug("Calle-Avenida_123")).toBe("calle-avenida_123");
  });

  it("should truncate slugs to 50 characters", () => {
    const longSlug = generateSlug("a".repeat(100));
    expect(longSlug.length).toBeLessThanOrEqual(50);
  });

  it("should generate valid UUIDs", () => {
    const uuid = generateUUID();
    expect(uuid).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
  });

  it("should generate unique UUIDs", () => {
    const uuids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      uuids.add(generateUUID());
    }
    expect(uuids.size).toBe(100);
  });
});

describe("Seed Acceptance Criteria", () => {
  it("should have 2+ real estates", () => {
    expect(REAL_ESTATES.length).toBeGreaterThanOrEqual(2);
  });

  it("should have 10+ properties", () => {
    expect(PROPERTIES.length).toBeGreaterThanOrEqual(10);
  });

  it("should have 5+ active listings", () => {
    const active = LISTINGS.filter((l) => l.status === "active");
    expect(active.length).toBeGreaterThanOrEqual(5);
  });

  it("should have properties distributed across all real estates", () => {
    REAL_ESTATES.forEach((re) => {
      const count = PROPERTIES.filter((p) => p.realEstateId === re.id).length;
      expect(count).toBeGreaterThan(0);
    });
  });

  it("should have listings distributed across multiple properties", () => {
    const uniquePropertyIds = new Set(LISTINGS.map((l) => l.propertyId));
    expect(uniquePropertyIds.size).toBeGreaterThanOrEqual(5);
  });
});

describe("Global ID Integrity", () => {
  it("should have all IDs globally unique across all entities", () => {
    const allIds = [
      ...REAL_ESTATES.map((re) => re.id),
      ...PROPERTIES.map((p) => p.id),
      ...LISTINGS.map((l) => l.id),
      ...PROPERTY_IMAGES.map((img) => img.id),
    ];

    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(allIds.length);
  });

  it("should have all IDs in valid UUID v4 format across all entities", () => {
    const allEntities = [
      ...REAL_ESTATES.map((re) => ({ type: "real_estate", id: re.id })),
      ...PROPERTIES.map((p) => ({ type: "property", id: p.id })),
      ...LISTINGS.map((l) => ({ type: "listing", id: l.id })),
      ...PROPERTY_IMAGES.map((img) => ({ type: "property_image", id: img.id })),
    ];

    allEntities.forEach(({ type, id }) => {
      expect(id).toMatch(UUID_V4_PATTERN);
    });
  });

  it("should have realEstateId references pointing to existing real estates", () => {
    const reIds = new Set(REAL_ESTATES.map((re) => re.id));
    PROPERTIES.forEach((p) => {
      expect(reIds.has(p.realEstateId)).toBe(true);
    });
  });

  it("should have propertyId references pointing to existing properties", () => {
    const propIds = new Set(PROPERTIES.map((p) => p.id));

    LISTINGS.forEach((l) => {
      expect(propIds.has(l.propertyId)).toBe(true);
    });

    PROPERTY_IMAGES.forEach((img) => {
      expect(propIds.has(img.propertyId)).toBe(true);
    });
  });
});
