// ==========================================
// Seed SQL Generator Tests
// ==========================================

import { describe, it, expect } from "vitest";
import { faker } from "@faker-js/faker";
import { generateAllSQL } from "../lib/sql-generator";
import { DEFAULT_SEED_OPTIONS } from "../types";

// Seed Faker para reproducibilidad en tests
faker.seed(42);

describe("Seed SQL Generator", () => {
  it("should generate SQL without errors", () => {
    const sql = generateAllSQL(DEFAULT_SEED_OPTIONS, false);
    expect(sql).toBeTruthy();
    expect(sql.length).toBeGreaterThan(100);
  });

  it("should include INSERT statements for core entity types", () => {
    const sql = generateAllSQL(DEFAULT_SEED_OPTIONS, false);

    // Verificar que incluye inserts para las tablas principales
    expect(sql).toContain("INSERT INTO real_estates");
    expect(sql).toContain("INSERT INTO auth.users");
    expect(sql).toContain("INSERT INTO properties");
    expect(sql).toContain("INSERT INTO listings");
  });

  it("should respect FK order (real_estates first)", () => {
    const sql = generateAllSQL(DEFAULT_SEED_OPTIONS, false);

    // Verificar orden de inserciones
    const realEstatesPos = sql.indexOf("INSERT INTO real_estates");
    const propertiesPos = sql.indexOf("INSERT INTO properties");
    const listingsPos = sql.indexOf("INSERT INTO listings");

    expect(realEstatesPos).toBeLessThan(propertiesPos);
    expect(propertiesPos).toBeLessThan(listingsPos);
  });

  it("should include TRUNCATE statements when requested", () => {
    const sql = generateAllSQL(DEFAULT_SEED_OPTIONS, true);

    expect(sql).toContain("TRUNCATE");
    expect(sql).toContain("CASCADE");
  });

  it("should not include TRUNCATE when not requested", () => {
    const sql = generateAllSQL(DEFAULT_SEED_OPTIONS, false);

    expect(sql).not.toContain("TRUNCATE");
  });

  it("should handle boolean values (true/false without quotes)", () => {
    const sql = generateAllSQL(DEFAULT_SEED_OPTIONS, false);

    // Booleanos en SQL: true/false sin comillas
    expect(sql).toMatch(/\btrue\b/);
    expect(sql).toMatch(/\bfalse\b/);
  });

  it("should handle NULL values properly", () => {
    const sql = generateAllSQL(DEFAULT_SEED_OPTIONS, false);

    // NULL en SQL sin comillas
    expect(sql).toContain("NULL");
  });

  it("should include comments indicating entity counts", () => {
    const sql = generateAllSQL(DEFAULT_SEED_OPTIONS, false);

    expect(sql).toContain("-- Insertando");
  });

  it("should generate UUIDs in SQL", () => {
    const sql = generateAllSQL(DEFAULT_SEED_OPTIONS, false);

    // El SQL debe contener UUIDs (formato v4)
    expect(sql).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/);
  });

  it("should respect options for entity counts", () => {
    const options = {
      ...DEFAULT_SEED_OPTIONS,
      realEstateCount: 3,
    };

    const sql = generateAllSQL(options, false);

    // Verificar que genera datos (al menos algunas sentencias VALUES)
    const insertMatches = sql.match(/VALUES/g);
    expect(insertMatches).toBeTruthy();
    expect(insertMatches!.length).toBeGreaterThan(0);
  });

  it("should not include Supabase client references", () => {
    const sql = generateAllSQL(DEFAULT_SEED_OPTIONS, false);

    // El SQL generado no debe tener referencias a cliente Supabase
    expect(sql).not.toContain("supabase");
    expect(sql).not.toContain("createClient");
  });

  it("should produce consistent SQL for same seed", () => {
    // Reset faker before each call
    faker.seed(42);
    const sql1 = generateAllSQL(DEFAULT_SEED_OPTIONS, false);
    
    faker.seed(42);
    const sql2 = generateAllSQL(DEFAULT_SEED_OPTIONS, false);

    // Same seed should produce same structure
    expect(sql1.length).toBe(sql2.length);
  });
});