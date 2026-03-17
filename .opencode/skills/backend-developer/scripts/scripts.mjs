#!/usr/bin/env node
/**
 * dev-check.mjs
 *
 * Utilidades de desarrollo: ejecuta lint, type-check y tests
 * de forma ordenada con salida clara. El agente lo genera y
 * el desarrollador lo ejecuta; también puede correrlo el agente
 * cuando tiene acceso a terminal.
 *
 * USO:
 *   node scripts/dev-check.mjs              ← corre todo
 *   node scripts/dev-check.mjs lint         ← solo lint
 *   node scripts/dev-check.mjs types        ← solo TypeScript
 *   node scripts/dev-check.mjs test         ← solo tests
 *   node scripts/dev-check.mjs arch         ← solo validación de arquitectura
 *   node scripts/dev-check.mjs lint types   ← combinaciones
 *
 * SALIDA:
 *   Exit 0 → todo pasó
 *   Exit 1 → al menos una tarea falló (resumen al final)
 */

import { execSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();
const args = process.argv.slice(2);
const ALL = args.length === 0;

// ─── Colores ANSI ─────────────────────────────────────────────────────────────
const c = {
  reset:  "\x1b[0m",
  bold:   "\x1b[1m",
  dim:    "\x1b[2m",
  green:  "\x1b[32m",
  red:    "\x1b[31m",
  yellow: "\x1b[33m",
  cyan:   "\x1b[36m",
  white:  "\x1b[37m",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function banner(title) {
  const line = "─".repeat(60);
  console.log(`\n${c.cyan}${line}${c.reset}`);
  console.log(`${c.bold}${c.white}  ${title}${c.reset}`);
  console.log(`${c.cyan}${line}${c.reset}\n`);
}

function run(label, cmd, { optional = false } = {}) {
  const start = Date.now();
  process.stdout.write(`  ${c.dim}▶${c.reset} ${label} ... `);

  try {
    const output = execSync(cmd, {
      cwd: ROOT,
      stdio: ["pipe", "pipe", "pipe"],
      encoding: "utf-8",
    });
    const ms = Date.now() - start;
    console.log(`${c.green}✔ OK${c.reset} ${c.dim}(${ms}ms)${c.reset}`);
    if (output.trim()) console.log(c.dim + output.trim() + c.reset);
    return { ok: true, label, output };
  } catch (err) {
    const ms = Date.now() - start;
    const tag = optional ? `${c.yellow}⚠ SKIP${c.reset}` : `${c.red}✘ FAIL${c.reset}`;
    console.log(`${tag} ${c.dim}(${ms}ms)${c.reset}`);

    const errorOutput = (err.stdout || "") + (err.stderr || "");
    if (errorOutput.trim()) {
      console.log("");
      errorOutput.trim().split("\n").forEach(l => console.log(`    ${c.dim}${l}${c.reset}`));
      console.log("");
    }
    return { ok: optional, label, output: errorOutput, optional };
  }
}

function shouldRun(...keys) {
  return ALL || keys.some(k => args.includes(k));
}

// ─── Detección de package manager ─────────────────────────────────────────────
function detectPM() {
  if (existsSync(join(ROOT, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(ROOT, "yarn.lock")))      return "yarn";
  return "npm";
}
const PM = detectPM();
const RUN = `${PM} run`;

// ─── Tareas ───────────────────────────────────────────────────────────────────
const results = [];

// ── 1. Validación de arquitectura ──────────────────────────────────────────
if (shouldRun("arch", "architecture")) {
  banner("Validación de Arquitectura Clean");

  const archScript = join(ROOT, "scripts/validate-architecture.ts");
  if (existsSync(archScript)) {
    results.push(run("Reglas Clean Architecture", `npx ts-node ${archScript}`));
  } else {
    console.log(`  ${c.yellow}⚠${c.reset} ${c.dim}validate-architecture.ts no encontrado, saltando.${c.reset}\n`);
  }
}

// ── 2. Lint ────────────────────────────────────────────────────────────────
if (shouldRun("lint")) {
  banner("ESLint");

  // Lint sobre directorios relevantes del backend
  const lintDirs = ["domain", "infrastructure", "application"].filter(d =>
    existsSync(join(ROOT, d))
  );

  if (lintDirs.length > 0) {
    results.push(run(
      `ESLint en ${lintDirs.join(", ")}`,
      `npx eslint ${lintDirs.join(" ")} --ext .ts,.tsx --max-warnings 0`
    ));
  } else {
    // Fallback: lint de todo el proyecto
    results.push(run("ESLint (proyecto completo)", `${RUN} lint`));
  }
}

// ── 3. Type-check ──────────────────────────────────────────────────────────
if (shouldRun("types", "type-check", "tsc")) {
  banner("TypeScript");

  results.push(run(
    "tsc --noEmit",
    "npx tsc --noEmit --pretty"
  ));
}

// ── 4. Tests ───────────────────────────────────────────────────────────────
if (shouldRun("test", "tests")) {
  banner("Tests");

  // Detectar framework de tests
  const hasVitest = existsSync(join(ROOT, "vitest.config.ts")) ||
                    existsSync(join(ROOT, "vitest.config.js"));
  const hasJest   = existsSync(join(ROOT, "jest.config.ts")) ||
                    existsSync(join(ROOT, "jest.config.js"));

  if (hasVitest) {
    results.push(run("Vitest (unit)", "npx vitest run --reporter=verbose"));
  } else if (hasJest) {
    results.push(run("Jest (unit)", "npx jest --passWithNoTests --verbose"));
  } else {
    // Intentar con el script del package.json
    results.push(run("Tests", `${RUN} test`, { optional: true }));
  }
}

// ─── Resumen final ────────────────────────────────────────────────────────────
const line = "═".repeat(60);
const passed  = results.filter(r => r.ok);
const failed  = results.filter(r => !r.ok);

console.log(`\n${c.bold}${line}${c.reset}`);
console.log(`${c.bold}  Resumen${c.reset}`);
console.log(`${c.bold}${line}${c.reset}\n`);

for (const r of results) {
  const icon = r.ok ? `${c.green}✔${c.reset}` : `${c.red}✘${c.reset}`;
  console.log(`  ${icon}  ${r.label}`);
}

console.log(`\n  ${c.dim}Total: ${results.length} | ` +
  `${c.green}${passed.length} OK${c.reset}${c.dim} | ` +
  (failed.length > 0
    ? `${c.red}${failed.length} FAILED${c.reset}`
    : `${c.green}0 FAILED${c.reset}`) +
  c.reset
);

console.log("");

if (failed.length > 0) {
  console.log(`${c.red}${c.bold}  ✘ Hay errores que resolver antes de continuar.${c.reset}\n`);
  process.exit(1);
} else {
  console.log(`${c.green}${c.bold}  ✔ Todo en orden.${c.reset}\n`);
  process.exit(0);
}