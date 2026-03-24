// ==========================================
// Seed Data Integrity Tests - Con Faker.js
// ==========================================

import { describe, it, expect, beforeAll } from "vitest";
import { faker } from "@faker-js/faker";
import type {
  SeedRealEstate,
  SeedProperty,
  SeedListing,
  SeedPropertyImage,
  SeedFavorite,
  SeedProfile,
  SeedAgent,
} from "../types";
import {
  generateFakeRealEstates,
  generateFakeProperties,
  generateFakeListings,
  generateFakePropertyImages,
  generateFakeProfiles,
  generateFakeFavorites,
} from "../lib/faker-data";
import { generateInquiries } from "../lib/seeders/inquiry.seeder";
import {
  formatNumber,
  formatBytes,
  generateSlug,
  generateUUID,
} from "../lib/logger";

// Seed Faker para reproducibilidad en tests
faker.seed(42);

// Generar datos fake para los tests
const TEST_REAL_ESTATES = generateFakeRealEstates(3);
const TEST_PROPERTIES = generateFakeProperties(
  15,
  TEST_REAL_ESTATES.map((re) => re.id),
);
const TEST_LISTINGS = generateFakeListings(
  TEST_PROPERTIES.length,
  TEST_PROPERTIES,
  TEST_REAL_ESTATES[0]?.whatsapp || "+5491100000000",
);
const TEST_IMAGES = generateFakePropertyImages(0, TEST_PROPERTIES);

// UUID v4 validation regex pattern
const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe("Seed Data Integrity - Real Estates (Faker)", () => {
  it("should have at least 2 real estates", () => {
    expect(TEST_REAL_ESTATES.length).toBeGreaterThanOrEqual(2);
  });

  it("should have unique IDs for all real estates", () => {
    const ids = new Set(TEST_REAL_ESTATES.map((re) => re.id));
    expect(ids.size).toBe(TEST_REAL_ESTATES.length);
  });

  it("should have valid UUID format for all real estate IDs", () => {
    TEST_REAL_ESTATES.forEach((re) => {
      expect(re.id).toMatch(UUID_V4_PATTERN);
    });
  });

  it("should have valid required fields for all real estates", () => {
    TEST_REAL_ESTATES.forEach((re) => {
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
    const names = new Set(TEST_REAL_ESTATES.map((re) => re.name));
    expect(names.size).toBe(TEST_REAL_ESTATES.length);
  });

  it("should have valid whatsapp numbers (argentinian format)", () => {
    TEST_REAL_ESTATES.forEach((re) => {
      expect(re.whatsapp).toMatch(/^\+549/);
    });
  });
});

describe("Seed Data Integrity - Properties (Faker)", () => {
  it("should have at least 10 properties", () => {
    expect(TEST_PROPERTIES.length).toBeGreaterThanOrEqual(10);
  });

  it("should have unique IDs for all properties", () => {
    const ids = new Set(TEST_PROPERTIES.map((p) => p.id));
    expect(ids.size).toBe(TEST_PROPERTIES.length);
  });

  it("should have valid UUID format for all property IDs", () => {
    TEST_PROPERTIES.forEach((p) => {
      expect(p.id).toMatch(UUID_V4_PATTERN);
    });
  });

  it("should have valid required fields for all properties", () => {
    TEST_PROPERTIES.forEach((p) => {
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
    const slugs = new Set(TEST_PROPERTIES.map((p) => p.slug));
    expect(slugs.size).toBe(TEST_PROPERTIES.length);
  });

  it("should have valid slugs (URL-safe)", () => {
    TEST_PROPERTIES.forEach((p) => {
      expect(p.slug).toMatch(/^[a-z0-9-]+$/);
    });
  });

  it("should have properties referencing existing real estates", () => {
    const reIds = new Set(TEST_REAL_ESTATES.map((re) => re.id));
    TEST_PROPERTIES.forEach((p) => {
      expect(reIds.has(p.realEstateId)).toBe(true);
    });
  });

  it("should have at least one property per real estate", () => {
    TEST_REAL_ESTATES.forEach((re) => {
      const count = TEST_PROPERTIES.filter(
        (p) => p.realEstateId === re.id,
      ).length;
      expect(count).toBeGreaterThan(0);
    });
  });

  it("should have valid property types", () => {
    const validTypes = [
      "apartment",
      "house",
      "condo",
      "land",
      "commercial",
      "office",
      "warehouse",
      "other",
    ];
    TEST_PROPERTIES.forEach((p) => {
      expect(validTypes).toContain(p.propertyType);
    });
  });

  it("should have valid numeric fields (bedrooms, bathrooms, areas)", () => {
    TEST_PROPERTIES.forEach((p) => {
      if (p.bedrooms !== undefined)
        expect(p.bedrooms).toBeGreaterThanOrEqual(0);
      if (p.bathrooms !== undefined)
        expect(p.bathrooms).toBeGreaterThanOrEqual(0);
      if (p.totalArea !== undefined) expect(p.totalArea).toBeGreaterThan(0);
      if (p.builtArea !== undefined) expect(p.builtArea).toBeGreaterThan(0);
      if (p.yearBuilt !== undefined) {
        expect(p.yearBuilt).toBeGreaterThan(1800);
        expect(p.yearBuilt).toBeLessThanOrEqual(new Date().getFullYear() + 2);
      }
    });
  });

  it("should have valid geographic coordinates", () => {
    TEST_PROPERTIES.forEach((p) => {
      if (p.latitude !== undefined && p.longitude !== undefined) {
        // Verificar que las coordenadas sean números válidos
        expect(typeof p.latitude).toBe("number");
        expect(typeof p.longitude).toBe("number");
        expect(p.latitude).not.toBeNaN();
        expect(p.longitude).not.toBeNaN();
      }
    });
  });
});

describe("Seed Data Integrity - Listings (Faker)", () => {
  it("should have at least 5 active listings", () => {
    const activeListings = TEST_LISTINGS.filter((l) => l.status === "active");
    expect(activeListings.length).toBeGreaterThanOrEqual(5);
  });

  it("should have unique IDs for all listings", () => {
    const ids = new Set(TEST_LISTINGS.map((l) => l.id));
    expect(ids.size).toBe(TEST_LISTINGS.length);
  });

  it("should have valid UUID format for all listing IDs", () => {
    TEST_LISTINGS.forEach((l) => {
      expect(l.id).toMatch(UUID_V4_PATTERN);
    });
  });

  it("should have valid required fields for all listings", () => {
    TEST_LISTINGS.forEach((l) => {
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
    TEST_LISTINGS.forEach((l) => {
      expect(["sale", "rent"]).toContain(l.listingType);
    });
  });

  it("should have valid statuses", () => {
    const validStatuses = ["active", "draft", "sold", "rented", "expired"];
    TEST_LISTINGS.forEach((l) => {
      expect(validStatuses).toContain(l.status);
    });
  });

  it("should have valid currencies", () => {
    TEST_LISTINGS.forEach((l) => {
      expect(["USD", "ARS"]).toContain(l.currency);
    });
  });

  it("should have valid statistics (views, inquiries, whatsapp clicks)", () => {
    TEST_LISTINGS.forEach((l) => {
      expect(l.viewsCount).toBeGreaterThanOrEqual(0);
      expect(l.enquiriesCount).toBeGreaterThanOrEqual(0);
      expect(l.whatsappClicks).toBeGreaterThanOrEqual(0);
    });
  });

  it("should have listings referencing existing properties", () => {
    const propIds = new Set(TEST_PROPERTIES.map((p) => p.id));
    TEST_LISTINGS.forEach((l) => {
      expect(propIds.has(l.propertyId)).toBe(true);
    });
  });

  it("should have featured listings with future expiration dates", () => {
    TEST_LISTINGS.filter((l) => l.featured).forEach((l) => {
      if (l.featuredUntil) {
        const until = new Date(l.featuredUntil);
        expect(until.getTime()).toBeGreaterThan(Date.now());
      }
    });
  });

  it("should have at least 1 sale listing", () => {
    const saleListings = TEST_LISTINGS.filter((l) => l.listingType === "sale");
    expect(saleListings.length).toBeGreaterThanOrEqual(1);
  });

  it("should have at least 1 rent listing", () => {
    const rentListings = TEST_LISTINGS.filter((l) => l.listingType === "rent");
    expect(rentListings.length).toBeGreaterThanOrEqual(1);
  });
});

describe("Seed Data Integrity - Property Images (Faker)", () => {
  it("should have images referencing existing properties", () => {
    const propIdSet = new Set(TEST_PROPERTIES.map((p) => p.id));
    TEST_IMAGES.forEach((img) => {
      expect(propIdSet.has(img.propertyId)).toBe(true);
    });
  });

  it("should have unique IDs for all images", () => {
    const ids = new Set(TEST_IMAGES.map((img) => img.id));
    expect(ids.size).toBe(TEST_IMAGES.length);
  });

  it("should have valid UUID format for all property image IDs", () => {
    TEST_IMAGES.forEach((img) => {
      expect(img.id).toMatch(UUID_V4_PATTERN);
    });
  });

  it("should have exactly one primary image per property that has images", () => {
    const propIdsWithImages = new Set(TEST_IMAGES.map((img) => img.propertyId));

    propIdsWithImages.forEach((propId) => {
      const primaryCount = TEST_IMAGES.filter(
        (img) => img.propertyId === propId && img.isPrimary,
      ).length;
      expect(primaryCount).toBe(1);
    });
  });

  it("should have valid display orders", () => {
    TEST_IMAGES.forEach((img) => {
      expect(img.displayOrder).toBeGreaterThanOrEqual(0);
    });
  });

  it("should have valid image dimensions", () => {
    TEST_IMAGES.forEach((img) => {
      if (img.width !== undefined) expect(img.width).toBeGreaterThan(0);
      if (img.height !== undefined) expect(img.height).toBeGreaterThan(0);
    });
  });

  it("should have valid file sizes", () => {
    TEST_IMAGES.forEach((img) => {
      if (img.fileSize !== undefined) {
        expect(img.fileSize).toBeGreaterThan(0);
        expect(img.fileSize).toBeLessThan(10 * 1024 * 1024); // Less than 10MB
      }
    });
  });
});

describe("Profile Generator (Faker)", () => {
  it("should generate unique coordinator IDs", () => {
    const result = generateFakeProfiles({
      coordinators: 2,
      agentsPerCoordinator: 3,
      clients: 3,
    });

    const coordinatorIds = new Set(result.coordinators.map((p) => p.id));
    expect(coordinatorIds.size).toBe(result.coordinators.length);
  });

  it("should generate unique agent IDs", () => {
    const result = generateFakeProfiles({
      coordinators: 2,
      agentsPerCoordinator: 3,
      clients: 3,
    });

    const agentIds = new Set(result.agents.map((p) => p.id));
    expect(agentIds.size).toBe(result.agents.length);
  });

  it("should generate unique client IDs", () => {
    const result = generateFakeProfiles({
      coordinators: 2,
      agentsPerCoordinator: 3,
      clients: 3,
    });

    const clientIds = new Set(result.clients.map((p) => p.id));
    expect(clientIds.size).toBe(result.clients.length);
  });

  it("should generate all IDs globally unique", () => {
    const result = generateFakeProfiles({
      coordinators: 2,
      agentsPerCoordinator: 3,
      clients: 3,
    });

    const allIds = [
      ...result.coordinators.map((p) => p.id),
      ...result.agents.map((p) => p.id),
      ...result.clients.map((p) => p.id),
    ];

    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(allIds.length);
  });

  it("should generate correct number of coordinators per real estate", () => {
    const result = generateFakeProfiles({
      coordinators: 3,
      agentsPerCoordinator: 3,
      clients: 3,
    });

    expect(result.coordinators.length).toBe(3);
  });

  it("should generate correct number of agents", () => {
    const result = generateFakeProfiles({
      coordinators: 2,
      agentsPerCoordinator: 4,
      clients: 2,
    });

    expect(result.agents.length).toBe(8);
  });

  it("should generate valid email formats for all profiles", () => {
    const result = generateFakeProfiles({
      coordinators: 2,
      agentsPerCoordinator: 3,
      clients: 3,
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    [...result.coordinators, ...result.agents, ...result.clients].forEach(
      (p) => {
        expect(p.email).toMatch(emailRegex);
      },
    );
  });

  it("should assign 'real-estate' role to coordinators and agents", () => {
    const result = generateFakeProfiles({
      coordinators: 1,
      agentsPerCoordinator: 1,
      clients: 0,
    });

    result.coordinators.forEach((p) => {
      expect(p.role).toBe("real-estate");
    });
    result.agents.forEach((p) => {
      expect(p.role).toBe("real-estate");
    });
  });

  it("should assign 'client' role to clients", () => {
    const result = generateFakeProfiles({
      coordinators: 1,
      agentsPerCoordinator: 1,
      clients: 1,
    });

    result.clients.forEach((p) => {
      expect(p.role).toBe("client");
    });
  });

  it("should generate valid argentinian phone numbers", () => {
    const result = generateFakeProfiles({
      coordinators: 2,
      agentsPerCoordinator: 3,
      clients: 3,
    });

    [...result.coordinators, ...result.agents, ...result.clients].forEach(
      (p) => {
        expect(p.phone).toMatch(/^\+549/);
      },
    );
  });

  it("should handle zero counts gracefully", () => {
    const result = generateFakeProfiles({
      coordinators: 0,
      agentsPerCoordinator: 0,
      clients: 0,
    });

    expect(result.coordinators).toHaveLength(0);
    expect(result.agents).toHaveLength(0);
    expect(result.clients).toHaveLength(0);
  });
});

describe("Favorite Generator", () => {
  it("should generate unique favorites (no duplicate client-listing pairs)", () => {
    const clients = [
      {
        id: "client-1",
        email: "c1@test.com",
        fullName: "Client 1",
        phone: "+54911",
        role: "client" as const,
      },
      {
        id: "client-2",
        email: "c2@test.com",
        fullName: "Client 2",
        phone: "+54911",
        role: "client" as const,
      },
    ];

    const listings = [
      {
        id: "li-1",
        propertyId: "pr-1",
        agentId: "ag-1",
        listingType: "sale" as const,
        price: 100000,
        currency: "USD" as const,
        priceNegotiable: true,
        whatsappContact: "+54911",
        expensesIncluded: true,
        status: "active" as const,
        featured: false,
        viewsCount: 0,
        enquiriesCount: 0,
        whatsappClicks: 0,
      },
      {
        id: "li-2",
        propertyId: "pr-2",
        agentId: "ag-1",
        listingType: "sale" as const,
        price: 100000,
        currency: "USD" as const,
        priceNegotiable: true,
        whatsappContact: "+54911",
        expensesIncluded: true,
        status: "active" as const,
        featured: false,
        viewsCount: 0,
        enquiriesCount: 0,
        whatsappClicks: 0,
      },
      {
        id: "li-3",
        propertyId: "pr-3",
        agentId: "ag-1",
        listingType: "sale" as const,
        price: 100000,
        currency: "USD" as const,
        priceNegotiable: true,
        whatsappContact: "+54911",
        expensesIncluded: true,
        status: "active" as const,
        featured: false,
        viewsCount: 0,
        enquiriesCount: 0,
        whatsappClicks: 0,
      },
    ];

    const favorites = generateFakeFavorites(5, clients, listings);

    const pairs = favorites.map((f) => `${f.profileId}-${f.listingId}`);
    const uniquePairs = new Set(pairs);
    expect(uniquePairs.size).toBe(pairs.length);
  });

  it("should not generate more favorites than possible combinations", () => {
    const clients = [
      {
        id: "client-1",
        email: "c@test.com",
        fullName: "C",
        phone: "+54911",
        role: "client" as const,
      },
    ];
    const listings = [
      {
        id: "li-1",
        propertyId: "pr-1",
        agentId: "ag-1",
        listingType: "sale" as const,
        price: 100,
        currency: "USD" as const,
        priceNegotiable: true,
        whatsappContact: "+54911",
        expensesIncluded: true,
        status: "active" as const,
        featured: false,
        viewsCount: 0,
        enquiriesCount: 0,
        whatsappClicks: 0,
      },
    ];

    const favorites = generateFakeFavorites(100, clients, listings);
    expect(favorites.length).toBeLessThanOrEqual(1);
  });

  it("should return empty array when no clients or listings", () => {
    const favorites = generateFakeFavorites(5, [], []);
    expect(favorites).toHaveLength(0);
  });

  it("should respect count parameter", () => {
    const clients = [
      {
        id: "client-1",
        email: "c1@test.com",
        fullName: "C1",
        phone: "+54911",
        role: "client" as const,
      },
      {
        id: "client-2",
        email: "c2@test.com",
        fullName: "C2",
        phone: "+54911",
        role: "client" as const,
      },
      {
        id: "client-3",
        email: "c3@test.com",
        fullName: "C3",
        phone: "+54911",
        role: "client" as const,
      },
    ];
    const listings = [
      {
        id: "li-1",
        propertyId: "pr-1",
        agentId: "ag-1",
        listingType: "sale" as const,
        price: 100,
        currency: "USD" as const,
        priceNegotiable: true,
        whatsappContact: "+54911",
        expensesIncluded: true,
        status: "active" as const,
        featured: false,
        viewsCount: 0,
        enquiriesCount: 0,
        whatsappClicks: 0,
      },
      {
        id: "li-2",
        propertyId: "pr-2",
        agentId: "ag-1",
        listingType: "sale" as const,
        price: 100,
        currency: "USD" as const,
        priceNegotiable: true,
        whatsappContact: "+54911",
        expensesIncluded: true,
        status: "active" as const,
        featured: false,
        viewsCount: 0,
        enquiriesCount: 0,
        whatsappClicks: 0,
      },
    ];

    const favorites = generateFakeFavorites(3, clients, listings);
    expect(favorites.length).toBe(3);
  });
});

describe("Inquiry Generator", () => {
  it("should generate correct number of inquiries", () => {
    const listings = [
      {
        id: "li-1",
        propertyId: "pr-1",
        agentId: "ag-1",
        listingType: "sale" as const,
        price: 100,
        currency: "USD" as const,
        priceNegotiable: true,
        whatsappContact: "+54911",
        expensesIncluded: true,
        status: "active" as const,
        featured: false,
        viewsCount: 0,
        enquiriesCount: 0,
        whatsappClicks: 0,
      },
    ];
    const agents = [
      { profileId: "agent-1", realEstateId: "re-1", role: "agent" as const },
    ];

    const inquiries = generateInquiries(listings, agents, 10);
    expect(inquiries).toHaveLength(10);
  });

  it("should assign valid statuses", () => {
    const listings = [
      {
        id: "li-1",
        propertyId: "pr-1",
        agentId: "ag-1",
        listingType: "sale" as const,
        price: 100,
        currency: "USD" as const,
        priceNegotiable: true,
        whatsappContact: "+54911",
        expensesIncluded: true,
        status: "active" as const,
        featured: false,
        viewsCount: 0,
        enquiriesCount: 0,
        whatsappClicks: 0,
      },
    ];
    const agents = [
      { profileId: "agent-1", realEstateId: "re-1", role: "agent" as const },
    ];

    const validStatuses = [
      "new",
      "contacted",
      "qualified",
      "converted",
      "lost",
    ];
    const inquiries = generateInquiries(listings, agents, 50);

    inquiries.forEach((inq) => {
      expect(validStatuses).toContain(inq.status);
    });
  });

  it("should assign valid sources", () => {
    const listings = [
      {
        id: "li-1",
        propertyId: "pr-1",
        agentId: "ag-1",
        listingType: "sale" as const,
        price: 100,
        currency: "USD" as const,
        priceNegotiable: true,
        whatsappContact: "+54911",
        expensesIncluded: true,
        status: "active" as const,
        featured: false,
        viewsCount: 0,
        enquiriesCount: 0,
        whatsappClicks: 0,
      },
    ];
    const agents = [
      { profileId: "agent-1", realEstateId: "re-1", role: "agent" as const },
    ];

    const validSources = ["web", "whatsapp", "phone", "email", "referral"];
    const inquiries = generateInquiries(listings, agents, 50);

    inquiries.forEach((inq) => {
      expect(validSources).toContain(inq.source);
    });
  });

  it("should distribute status across different values", () => {
    const listings = [
      {
        id: "li-1",
        propertyId: "pr-1",
        agentId: "ag-1",
        listingType: "sale" as const,
        price: 100,
        currency: "USD" as const,
        priceNegotiable: true,
        whatsappContact: "+54911",
        expensesIncluded: true,
        status: "active" as const,
        featured: false,
        viewsCount: 0,
        enquiriesCount: 0,
        whatsappClicks: 0,
      },
    ];
    const agents = [
      { profileId: "agent-1", realEstateId: "re-1", role: "agent" as const },
    ];

    const inquiries = generateInquiries(listings, agents, 100);

    const statusCounts = inquiries.reduce(
      (acc: Record<string, number>, inq) => {
        acc[inq.status] = (acc[inq.status] || 0) + 1;
        return acc;
      },
      {},
    );

    expect(Object.keys(statusCounts).length).toBeGreaterThanOrEqual(2);
  });

  it("should reference active listings only", () => {
    const listings = [
      {
        id: "li-1",
        propertyId: "pr-1",
        agentId: "ag-1",
        listingType: "sale" as const,
        price: 100,
        currency: "USD" as const,
        priceNegotiable: true,
        whatsappContact: "+54911",
        expensesIncluded: true,
        status: "active" as const,
        featured: false,
        viewsCount: 0,
        enquiriesCount: 0,
        whatsappClicks: 0,
      },
      {
        id: "li-2",
        propertyId: "pr-2",
        agentId: "ag-1",
        listingType: "sale" as const,
        price: 100,
        currency: "USD" as const,
        priceNegotiable: true,
        whatsappContact: "+54911",
        expensesIncluded: true,
        status: "draft" as const,
        featured: false,
        viewsCount: 0,
        enquiriesCount: 0,
        whatsappClicks: 0,
      },
    ];
    const agents = [
      { profileId: "agent-1", realEstateId: "re-1", role: "agent" as const },
    ];

    const inquiries = generateInquiries(listings, agents, 20);

    inquiries.forEach((inq) => {
      expect(inq.listingId).toBe("li-1"); // Only active listings
    });
  });

  it("should assign agents from the provided list", () => {
    const listings = [
      {
        id: "li-1",
        propertyId: "pr-1",
        agentId: "ag-1",
        listingType: "sale" as const,
        price: 100,
        currency: "USD" as const,
        priceNegotiable: true,
        whatsappContact: "+54911",
        expensesIncluded: true,
        status: "active" as const,
        featured: false,
        viewsCount: 0,
        enquiriesCount: 0,
        whatsappClicks: 0,
      },
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
    expect(generateSlug("Departamento 3 ambientes!!!")).toBe(
      "departamento-3-ambientes",
    );
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
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
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

describe("Seed Acceptance Criteria (Faker)", () => {
  it("should have 2+ real estates", () => {
    expect(TEST_REAL_ESTATES.length).toBeGreaterThanOrEqual(2);
  });

  it("should have 10+ properties", () => {
    expect(TEST_PROPERTIES.length).toBeGreaterThanOrEqual(10);
  });

  it("should have 5+ active listings", () => {
    const active = TEST_LISTINGS.filter((l) => l.status === "active");
    expect(active.length).toBeGreaterThanOrEqual(5);
  });

  it("should have properties distributed across all real estates", () => {
    TEST_REAL_ESTATES.forEach((re) => {
      const count = TEST_PROPERTIES.filter(
        (p) => p.realEstateId === re.id,
      ).length;
      expect(count).toBeGreaterThan(0);
    });
  });

  it("should have listings distributed across multiple properties", () => {
    const uniquePropertyIds = new Set(TEST_LISTINGS.map((l) => l.propertyId));
    expect(uniquePropertyIds.size).toBeGreaterThanOrEqual(5);
  });
});

describe("Global ID Integrity (Faker)", () => {
  it("should have all IDs globally unique across all entities", () => {
    const allIds = [
      ...TEST_REAL_ESTATES.map((re) => re.id),
      ...TEST_PROPERTIES.map((p) => p.id),
      ...TEST_LISTINGS.map((l) => l.id),
      ...TEST_IMAGES.map((img) => img.id),
    ];

    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(allIds.length);
  });

  it("should have all IDs in valid UUID format across all entities", () => {
    const allEntities = [
      ...TEST_REAL_ESTATES.map((re) => ({ type: "real_estate", id: re.id })),
      ...TEST_PROPERTIES.map((p) => ({ type: "property", id: p.id })),
      ...TEST_LISTINGS.map((l) => ({ type: "listing", id: l.id })),
      ...TEST_IMAGES.map((img) => ({ type: "property_image", id: img.id })),
    ];

    allEntities.forEach(({ type, id }) => {
      expect(id).toMatch(UUID_V4_PATTERN);
    });
  });

  it("should have realEstateId references pointing to existing real estates", () => {
    const reIds = new Set(TEST_REAL_ESTATES.map((re) => re.id));
    TEST_PROPERTIES.forEach((p) => {
      expect(reIds.has(p.realEstateId)).toBe(true);
    });
  });

  it("should have propertyId references pointing to existing properties", () => {
    const propIds = new Set(TEST_PROPERTIES.map((p) => p.id));

    TEST_LISTINGS.forEach((l) => {
      expect(propIds.has(l.propertyId)).toBe(true);
    });

    TEST_IMAGES.forEach((img) => {
      expect(propIds.has(img.propertyId)).toBe(true);
    });
  });
});

describe("Faker.js Reproducibility", () => {
  it("should generate same data with same seed", () => {
    // Generar datos dos veces con el mismo seed
    faker.seed(42);
    const realEstates1 = generateFakeRealEstates(3);

    faker.seed(42);
    const realEstates2 = generateFakeRealEstates(3);

    // Los datos deben ser idénticos
    expect(realEstates1).toEqual(realEstates2);
  });

  it("should generate different data with different seeds", () => {
    faker.seed(42);
    const realEstates1 = generateFakeRealEstates(3);

    faker.seed(123);
    const realEstates2 = generateFakeRealEstates(3);

    // Los IDs de UUID deben ser diferentes entre seeds
    const ids1 = realEstates1.map((re) => re.id);
    const ids2 = realEstates2.map((re) => re.id);

    // Verificar que al menos algunos IDs sean diferentes
    const allSame = ids1.every((id, i) => id === ids2[i]);
    expect(allSame).toBe(false);
  });
});
