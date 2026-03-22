// ==========================================
// Logger utility for seed scripts
// ==========================================

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export class SeedLogger {
  private static level: LogLevel = LogLevel.INFO;

  static setLevel(level: LogLevel): void {
    this.level = level;
  }

  static debug(message: string, ...args: unknown[]): void {
    if (this.level <= LogLevel.DEBUG) {
      console.log(`\x1b[90m[DEBUG]\x1b[0m ${message}`, ...args);
    }
  }

  static info(message: string, ...args: unknown[]): void {
    if (this.level <= LogLevel.INFO) {
      console.log(`\x1b[36m[INFO]\x1b[0m ${message}`, ...args);
    }
  }

  static success(message: string, ...args: unknown[]): void {
    if (this.level <= LogLevel.INFO) {
      console.log(`\x1b[32m[SUCCESS]\x1b[0m ${message}`, ...args);
    }
  }

  static warn(message: string, ...args: unknown[]): void {
    if (this.level <= LogLevel.WARN) {
      console.warn(`\x1b[33m[WARN]\x1b[0m ${message}`, ...args);
    }
  }

  static error(message: string, ...args: unknown[]): void {
    if (this.level <= LogLevel.ERROR) {
      console.error(`\x1b[31m[ERROR]\x1b[0m ${message}`, ...args);
    }
  }

  static section(title: string): void {
    console.log("\n" + "=".repeat(60));
    console.log(`  ${title}`);
    console.log("=".repeat(60));
  }

  static subSection(title: string): void {
    console.log("\n" + "-".repeat(40));
    console.log(`  ${title}`);
    console.log("-".repeat(40));
  }

  static progress(current: number, total: number, item?: string): void {
    const percentage = Math.round((current / total) * 100);
    const bar = "█".repeat(Math.round(percentage / 5)) + "░".repeat(20 - Math.round(percentage / 5));
    const itemText = item ? ` - ${item}` : "";
    process.stdout.write(`\r[${bar}] ${percentage}%${itemText}`);
    if (current === total) {
      process.stdout.write("\n");
    }
  }
}

/**
 * Formatea un número con separadores de miles.
 */
export function formatNumber(num: number): string {
  return num.toLocaleString("es-AR");
}

/**
 * Formatea bytes a una cadena legible.
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Genera un slug URL-safe a partir de un string.
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 50);
}

/**
 * Genera un UUID v4 simple.
 */
export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Retraso simple para evitar sobrecargar la BD.
 */
export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
