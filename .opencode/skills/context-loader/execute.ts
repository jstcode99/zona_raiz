/**
 * Context Loader Skill - Execute Script
 *
 * Este script se ejecuta automáticamente al iniciar un chat con cualquier modelo.
 * Carga el contexto inicial del proyecto leyendo skills, variables de entorno y configuración.
 */

const fs = require("fs");
const path = require("path");

/**
 * Lee y analiza los skills disponibles en .opencode/skills/
 */
function readAvailableSkills(): string[] {
  const skillsDir = path.join(process.cwd(), ".opencode", "skills");
  const skills: string[] = [];

  try {
    if (fs.existsSync(skillsDir)) {
      const entries = fs.readdirSync(skillsDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const skillName = entry.name;
          const skillPath = path.join(skillsDir, skillName, "SKILL.md");

          if (fs.existsSync(skillPath)) {
            const content = fs.readFileSync(skillPath, "utf-8");
            const nameMatch = content.match(/name:\s*(.+)/);
            const descMatch = content.match(/description:\s*>\s*(.+)/);

            if (nameMatch) {
              const name = nameMatch[1].trim();
              const description = descMatch ? descMatch[1].trim() : "";
              skills.push(`${name}: ${description}`);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error leyendo skills:", error);
  }

  return skills;
}

/**
 * Lee las variables de entorno del archivo .env.local
 */
function readEnvironmentVariables(): Record<string, string> {
  const envPath = path.join(process.cwd(), ".env.local");
  const variables: Record<string, string> = {};

  try {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      const lines = content.split("\n");

      for (const line of lines) {
        // Ignorar líneas vacías y comentarios
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith("#")) {
          continue;
        }

        // Parsear variable=valor (manejar valores con espacios y comillas)
        const match = trimmedLine.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          let value = match[2].trim();

          // Eliminar comillas si existen
          if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
          ) {
            value = value.slice(1, -1);
          }

          variables[key] = value;
        }
      }
    }
  } catch (error) {
    console.error("Error leyendo variables de entorno:", error);
  }

  return variables;
}

/**
 * Lee y resume el archivo AGENTS.md
 */
function readAgentsConfig(): {
  stack: string[];
  architecture: string[];
  conventions: string[];
} {
  const agentsPath = path.join(process.cwd(), "AGENTS.md");
  const result = {
    stack: [] as string[],
    architecture: [] as string[],
    conventions: [] as string[],
  };

  try {
    if (fs.existsSync(agentsPath)) {
      const content = fs.readFileSync(agentsPath, "utf-8");

      // Extraer stack tecnológico
      const stackMatch = content.match(/## Stack\s*\n([\s\S]*?)\n---/);
      if (stackMatch && stackMatch[1]) {
        const stackLines = stackMatch[1].split("\n");
        stackLines.forEach((line: string) => {
          const cleanLine = line.replace(/^-/, "").trim();
          if (cleanLine) {
            result.stack.push(cleanLine);
          }
        });
      }

      // Extraer arquitectura
      const archMatch = content.match(/## Arquitectura[\s\S]*?(\d+\.\s|---)/);
      if (archMatch) {
        const archStart =
          content.indexOf("## Arquitectura") + "## Arquitectura".length;
        const archEnd = content.indexOf("---", archStart);
        if (archEnd > archStart) {
          const archSection = content.substring(archStart, archEnd);
          const archLines = archSection.split("\n");
          archLines.forEach((line: string) => {
            const cleanLine = line
              .replace(/^-/, "")
              .replace(/^\d+\./, "")
              .trim();
            if (cleanLine && cleanLine.length > 5) {
              result.architecture.push(cleanLine);
            }
          });
        }
      }

      // Extraer convenciones
      const convMatch = content.match(/## Convenciones\s*\n([\s\S]*?)--/);
      if (convMatch && convMatch[1]) {
        const convLines = convMatch[1].split("\n");
        convLines.forEach((line: string) => {
          const cleanLine = line.replace(/^-/, "").trim();
          if (cleanLine && cleanLine.includes(":")) {
            result.conventions.push(cleanLine);
          }
        });
      }
    }
  } catch (error) {
    console.error("Error leyendo AGENTS.md:", error);
  }

  return result;
}

/**
 * Genera el mensaje de contexto inicial
 */
function generateContextMessage(): string {
  const skills = readAvailableSkills();
  const envVars = readEnvironmentVariables();
  const agentsConfig = readAgentsConfig();

  // Filtrar variables sensibles
  const filteredEnvVars = Object.keys(envVars)
    .filter((key) => !key.includes("SECRET") && !key.includes("KEY"))
    .slice(0, 5); // Limitar a 5 variables para no saturar

  let message = `# Contexto Inicial - Zona Raiz\n\n`;
  message += `## 🛠️ Skills Disponibles (${skills.length})\n`;
  skills.forEach((skill) => {
    message += `- ${skill}\n`;
  });

  message += `\n## 🔧 Stack Tecnológico\n`;
  agentsConfig.stack.forEach((item) => {
    message += `- ${item}\n`;
  });

  message += `\n## 🏗️ Arquitectura\n`;
  agentsConfig.architecture.forEach((item) => {
    message += `- ${item}\n`;
  });

  message += `\n## 📋 Variables de Entorno Configuradas\n`;
  filteredEnvVars.forEach((key) => {
    const value = envVars[key];
    const displayValue =
      value.length > 20 ? `${value.substring(0, 20)}...` : value;
    message += `- ${key}: ${displayValue}\n`;
  });

  message += `\n## ⚡ Convenciones del Proyecto\n`;
  agentsConfig.conventions.slice(0, 5).forEach((item) => {
    message += `- ${item}\n`;
  });

  message += `\n---\n`;
  message += `Contexto cargado exitosamente. Estoy listo para ayudarte con el proyecto Zona Raiz.\n`;

  return message;
}

// Exportar función principal
function initializeContext(): string {
  return generateContextMessage();
}

// Si se ejecuta directamente
if (require.main === module) {
  console.log(initializeContext());
}

module.exports = { initializeContext };
