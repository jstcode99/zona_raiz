#!/usr/bin/env npx ts-node
/**
 * validate-architecture.ts
 *
 * Valida que el proyecto respete las reglas de Clean Architecture:
 *   1. Los domain/* no importan de infrastructure/* ni application/*
 *   2. Los adapters implementan su Port correspondiente
 *   3. Todo adapter está registrado en appModule
 *   4. Todo service está registrado en appModule
 *   5. Los Server Actions no importan adapters directamente
 *   6. Los Server Actions no contienen queries de Supabase
 *
 * USO (el agente lo ejecuta automáticamente antes de finalizar cambios backend):
 *   npx ts-node scripts/validate-architecture.ts
 *   npx ts-node scripts/validate-architecture.ts --fix   ← muestra sugerencias de corrección
 *
 * SALIDA:
 *   Exit 0 → sin violaciones
 *   Exit 1 → hay violaciones (lista detallada en stdout)
 */

import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

// ─── Configuración ────────────────────────────────────────────────────────────

const ROOT = process.cwd();
const SHOW_FIX = process.argv.includes("--fix");

const PATHS = {
  domain:         path.join(ROOT, "domain"),
  infrastructure: path.join(ROOT, "infrastructure/adapters/supabase"),
  actions:        path.join(ROOT, "application/actions"),
  appModule:      path.join(ROOT, "application/modules/app.module.ts"),
  ports:          path.join(ROOT, "domain/ports"),
  services:       path.join(ROOT, "domain/services"),
};

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Violation {
  rule: string;
  file: string;
  detail: string;
  fix?: string;
}

// ─── Utilidades ───────────────────────────────────────────────────────────────

function readFile(filePath: string): string {
  try { return fs.readFileSync(filePath, "utf-8"); }
  catch { return ""; }
}

function findFiles(dir: string, ext = ".ts"): string[] {
  if (!fs.existsSync(dir)) return [];
  const results: string[] = [];

  function walk(current: string) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(ext)) results.push(full);
    }
  }
  walk(dir);
  return results;
}

function relPath(filePath: string): string {
  return path.relative(ROOT, filePath);
}

/** Extrae líneas que contienen el patrón, con su número de línea */
function matchLines(content: string, pattern: RegExp): Array<{ line: number; text: string }> {
  return content.split("\n")
    .map((text, i) => ({ line: i + 1, text }))
    .filter(({ text }) => pattern.test(text));
}

// ─── Reglas de validación ─────────────────────────────────────────────────────

const violations: Violation[] = [];

function addViolation(v: Violation) { violations.push(v); }

/**
 * Regla 1 — domain/* no debe importar de infrastructure/* ni application/*
 */
function checkDomainIsolation() {
  const domainFiles = [
    ...findFiles(path.join(ROOT, "domain/entities")),
    ...findFiles(path.join(ROOT, "domain/ports")),
    ...findFiles(path.join(ROOT, "domain/services")),
  ];

  const forbiddenPatterns = [
    /from\s+["'].*infrastructure/,
    /from\s+["'].*application/,
    /from\s+["']@\/infrastructure/,
    /from\s+["']@\/application/,
  ];

  for (const file of domainFiles) {
    const content = readFile(file);
    for (const pattern of forbiddenPatterns) {
      const hits = matchLines(content, pattern);
      for (const hit of hits) {
        addViolation({
          rule: "R1 · Aislamiento de dominio",
          file: relPath(file),
          detail: `Línea ${hit.line}: importa desde infraestructura/aplicación → "${hit.text.trim()}"`,
          fix: "Mueve la lógica al adapter o crea un Port que abstraiga la dependencia.",
        });
      }
    }
  }
}

/**
 * Regla 2 — Cada adapter debe implementar su Port con "implements Supabase*Port"
 *           y el Port debe existir en domain/ports/
 */
function checkAdaptersImplementPorts() {
  const adapters = findFiles(PATHS.infrastructure);

  for (const adapterFile of adapters) {
    const content = readFile(adapterFile);
    const baseName = path.basename(adapterFile, ".ts"); // supabase-inquiry.adapter
    // supabase-inquiry.adapter → inquiry
    const resourceName = baseName.replace(/^supabase-/, "").replace(/\.adapter$/, "");
    const expectedPort = `${resourceName}.port.ts`;
    const portPath = path.join(PATHS.ports, expectedPort);

    // Verificar que el archivo implements algo
    if (!content.includes("implements ")) {
      addViolation({
        rule: "R2 · Adapter implementa Port",
        file: relPath(adapterFile),
        detail: `El adapter no tiene cláusula "implements". Debe implementar su Port.`,
        fix: `Agrega "implements ${toPascal(resourceName)}Port" a la clase y crea ${relPath(portPath)} si no existe.`,
      });
      continue;
    }

    // Verificar que el Port exista en domain/ports/
    if (!fs.existsSync(portPath)) {
      addViolation({
        rule: "R2 · Adapter implementa Port",
        file: relPath(adapterFile),
        detail: `No existe el Port esperado: ${relPath(portPath)}`,
        fix: `Crea domain/ports/${expectedPort} con la interfaz ${toPascal(resourceName)}Port.`,
      });
    }
  }
}

/**
 * Regla 3 — Todo adapter instanciado en un Service Action debe venir de appModule
 */
function checkActionsUseAppModule() {
  const actions = findFiles(PATHS.actions);

  for (const actionFile of actions) {
    const content = readFile(actionFile);

    // ¿Importa algún Adapter directamente?
    const adapterImports = matchLines(content, /from\s+["'].*adapters\/supabase/);
    for (const hit of adapterImports) {
      addViolation({
        rule: "R3 · Actions solo usan appModule",
        file: relPath(actionFile),
        detail: `Línea ${hit.line}: importa un adapter directamente → "${hit.text.trim()}"`,
        fix: `Elimina el import y obtén el servicio desde: const { xService } = await appModule(lang, { cookies: cookieStore })`,
      });
    }

    // ¿Contiene queries de Supabase?
    const supabaseQueries = matchLines(content, /\.from\s*\(\s*["']/);
    for (const hit of supabaseQueries) {
      addViolation({
        rule: "R3 · Actions solo usan appModule",
        file: relPath(actionFile),
        detail: `Línea ${hit.line}: query de Supabase en un Action → "${hit.text.trim()}"`,
        fix: `Mueve esta query al adapter correspondiente y expónla como método del service.`,
      });
    }
  }
}

/**
 * Regla 4 — Todo adapter instanciado en appModule debe tener su service también registrado
 */
function checkAppModuleConsistency() {
  if (!fs.existsSync(PATHS.appModule)) {
    addViolation({
      rule: "R4 · Consistencia de appModule",
      file: "application/modules/app.module.ts",
      detail: "No se encontró el archivo appModule.",
      fix: "Verifica que la ruta sea application/modules/app.module.ts",
    });
    return;
  }

  const content = readFile(PATHS.appModule);

  // Detectar adapters instanciados: new SupabaseXxxAdapter(...)
  const adapterInstances = [...content.matchAll(/new\s+Supabase(\w+)Adapter\s*\(/g)]
    .map(m => m[1]); // ["Auth", "Profile", "Agent", ...]

  // Detectar services instanciados: new XxxService(...)
  const serviceInstances = [...content.matchAll(/new\s+(\w+)Service\s*\(/g)]
    .map(m => m[1]); // ["Auth", "Agent", ...]

  for (const adapterName of adapterInstances) {
    // CookiesAdapter no tiene service propio, es un caso especial
    if (["Cookies", "Session"].includes(adapterName)) continue;

    const hasService = serviceInstances.some(
      s => s.toLowerCase() === adapterName.toLowerCase()
    );

    if (!hasService) {
      addViolation({
        rule: "R4 · Consistencia de appModule",
        file: relPath(PATHS.appModule),
        detail: `Supabase${adapterName}Adapter está instanciado pero no hay ${adapterName}Service registrado.`,
        fix: `Agrega:\n  const ${toCamel(adapterName)}Service = new ${adapterName}Service(${toCamel(adapterName)}Adapter);\n  y expórtalo en el return de appModule.`,
      });
    }
  }

  // Verificar que todo service esté en el return
  const returnBlock = content.match(/return\s*\{([^}]+)\}/s)?.[1] ?? "";
  for (const serviceName of serviceInstances) {
    const varName = `${toCamel(serviceName)}Service`;
    if (!returnBlock.includes(varName)) {
      addViolation({
        rule: "R4 · Consistencia de appModule",
        file: relPath(PATHS.appModule),
        detail: `${varName} está instanciado pero no aparece en el return de appModule.`,
        fix: `Agrega "${varName}," dentro del bloque return { ... } de appModule.`,
      });
    }
  }
}

/**
 * Regla 5 — Services no deben contener lógica de Supabase
 */
function checkServicePurity() {
  const services = findFiles(PATHS.services);

  for (const serviceFile of services) {
    const content = readFile(serviceFile);

    const supabaseUsage = matchLines(content, /supabase|SupabaseClient|from\s*\(\s*["']/i);
    for (const hit of supabaseUsage) {
      addViolation({
        rule: "R5 · Pureza de Services",
        file: relPath(serviceFile),
        detail: `Línea ${hit.line}: lógica de Supabase en Service → "${hit.text.trim()}"`,
        fix: `Mueve esta lógica al adapter e inyéctala via Port.`,
      });
    }
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toPascal(str: string): string {
  return str.split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join("");
}

function toCamel(str: string): string {
  const p = toPascal(str);
  return p.charAt(0).toLowerCase() + p.slice(1);
}

// ─── Reporte ──────────────────────────────────────────────────────────────────

function printReport() {
  const total = violations.length;
  const sep = "─".repeat(72);

  if (total === 0) {
    console.log("\n✅  Sin violaciones de arquitectura detectadas.\n");
    return;
  }

  console.log(`\n❌  Se encontraron ${total} violación(es) de arquitectura:\n`);

  // Agrupar por regla
  const byRule = violations.reduce<Record<string, Violation[]>>((acc, v) => {
    (acc[v.rule] ??= []).push(v);
    return acc;
  }, {});

  for (const [rule, vList] of Object.entries(byRule)) {
    console.log(`\n${sep}`);
    console.log(`  ${rule}  (${vList.length})`);
    console.log(sep);

    for (const v of vList) {
      console.log(`\n  📄 ${v.file}`);
      console.log(`     ${v.detail}`);
      if (SHOW_FIX && v.fix) {
        console.log(`\n  💡 Sugerencia:`);
        v.fix.split("\n").forEach(l => console.log(`     ${l}`));
      }
    }
  }

  console.log(`\n${sep}`);
  console.log(`  Total: ${total} violación(es)${SHOW_FIX ? "" : "  →  Ejecuta con --fix para ver sugerencias"}`);
  console.log(`${sep}\n`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log("🔍 Validando arquitectura Clean...\n");

checkDomainIsolation();
checkAdaptersImplementPorts();
checkActionsUseAppModule();
checkAppModuleConsistency();
checkServicePurity();

printReport();

process.exit(violations.length > 0 ? 1 : 0);