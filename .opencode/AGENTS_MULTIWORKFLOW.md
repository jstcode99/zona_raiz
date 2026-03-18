# Guía de Trabajo con Múltiples Agentes en Zona Raiz

## Visión General

Esta guía explica cómo trabajar con dos o más agentes de IA simultáneamente en el proyecto `zona_raiz`, utilizando **Git Worktrees** para aislamiento de ramas y **opencode-ensemble** para coordinación.

## Configuración Instalada

### 1. Plugin opencode-ensemble
- **Instalado**: `@hueyexe/opencode-ensemble`
- **Propósito**: Coordinación automática entre agentes, task board compartido, comunicación

### 2. Agentes Especializados

| Agente | Especialidad | Modelo | Modo |
|--------|--------------|--------|------|
| `frontend-developer` | Next.js, Tailwind, shadcn/ui | Gemini 2.5 Flash | Primary |
| `backend-developer` | Supabase, Clean Architecture, TypeScript | Gemini 2.5 Flash | Primary |
| `planner` | Planificación y estimaciones | Gemini 2.5 Flash | Primary |
| `orchestrator` | Coordinación entre agentes | Gemini 2.5 Flash | Primary |
| `code-reviewer` | Revisión de seguridad y buenas prácticas | Mistral Small | Subagent |
| `test-writer` | Tests TDD | Gemini 2.0 Flash | Subagent |
| `pr-manager` | Gestión de Pull Requests | Mistral Codestral | Subagent |

## Flujo de Trabajo Recomendado

### Opción A: Trabajo en Ramas Diferentes (Recomendado)

#### Paso 1: Preparar entorno
```bash
# Actualizar main
git checkout main
git pull origin main

# Crear worktree para cada agente
git worktree add .opencode/worktrees/frontend feature/frontend-refactor
git worktree add .opencode/worktrees/backend feature/backend-api
```

#### Paso 2: Iniciar agentes en worktrees separados
```bash
# Terminal 1 - Agente Frontend
cd .opencode/worktrees/frontend
opencode

# Terminal 2 - Agente Backend
cd .opencode/worktrees/backend
opencode
```

#### Paso 3: Trabajar en paralelo
Cada agente trabaja en su rama:
- Agente Frontend: Desarrolla componentes UI
- Agente Backend: Desarrolla APIs y lógica de negocio

#### Paso 4: Fusionar cambios
```bash
# Una vez que ambas ramas estén listas
git checkout main
git merge feature/frontend-refactor
git merge feature/backend-api
```

### Opción B: Trabajo con opencode-ensemble

#### Comandos útiles del plugin:
```bash
# Crear equipo de trabajo
/team-create nombre-equipo

# Añadir tareas al board
/team-task-add "Implementar validación de usuarios"

# Verificar estado del equipo
/team-status

# Comunicar entre agentes
/team-message "Backend: API de usuarios lista para revisión"
```

## Mejores Prácticas

### 1. Aislamiento de Ramas
- **Una rama por agente**: Nunca compartir worktrees
- **Nombres descriptivos**: `feature/frontend-auth`, `feature/backend-users`
- **Commits frecuentes**: Cada agente hace commits en su rama

### 2. Coordinación
- **Reuniones virtuales**: Usar `team-message` para sincronización
- **Task board**: Usar opencode-ensemble para tracking
- **Revisión cruzada**: Agente revisor evalúa código del otro

### 3. Git Safety
- **Pull antes de empezar**: `git pull origin main`
- **Merge secuencial**: Fusionar ramas una por una
- **Resolución de conflictos**: Usar agente revisor para ayudar

## Comandos Rápidos

### Gestión de Worktrees
```bash
# Listar worktrees activos
git worktree list

# Eliminar worktree cuando termines
git worktree remove .opencode/worktrees/frontend

# Limpiar worktrees obsoletos
git worktree prune
```

### Gestión de Ramas
```bash
# Ver ramas existentes
git branch -a

# Crear nueva rama desde worktree
git checkout -b feature/nueva-funcionalidad
```

## Escenarios de Uso

### Escenario 1: Desarrollo Full-Stack
- **Agente 1 (Frontend)**: Desarrolla interfaz de usuario
- **Agente 2 (Backend)**: Desarrolla APIs y base de datos
- **Coordinación**: Reunión diaria vía `team-message`

### Escenario 2: Desarrollo + Revisión
- **Agente 1 (Implementador)**: Desarrolla funcionalidad
- **Agente 2 (Revisor)**: Revisa código y escribe tests
- **Flujo**: Desarrollo → Revisión → Ajustes → Merge

### Escenario 3: Feature Paralelas
- **Agente 1**: Feature A (ej: sistema de favoritos)
- **Agente 2**: Feature B (ej: notificaciones)
- **Integración**: Merge ambas features en main

## Troubleshooting

### Problema: Conflictos de Git
**Solución**:
```bash
# 1. Cada agente hace stash de sus cambios
git stash

# 2. Actualizar main
git checkout main
git pull origin main

# 3. Re-aplicar cambios
git stash pop

# 4. Resolver conflictos si los hay
```

### Problema: Sincronización de Contexto
**Solución**: Usar el context-loader skill para compartir información del proyecto.

### Problema: Duplicación de Trabajo
**Solución**: Usar task board de opencode-ensemble para asignar tareas claras.

## Flujo de Trabajo con Nuevos Agentes

### Proceso Completo: Planning → Orchestration → PR Management

```
┌─────────────────────────────────────────────────────────────────┐
│  1. PLANNING (planner) - Gemini 2.5 Flash                      │
├─────────────────────────────────────────────────────────────────┤
│  • Analiza requirements del usuario                            │
│  • Crea task board en Linear                                   │
│  • Estima esfuerzo (puntos Fibonacci)                          │
│  • Prioriza y asigna tareas a agentes                          │
└───────────────────────────────┬─────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│  2. DEVELOPMENT (frontend + backend) - Gemini 2.5 Flash         │
├─────────────────────────────────────────────────────────────────┤
│  • Trabajan en paralelo (worktrees)                            │
│  • Commits frecuentes en sus ramas                             │
│  • Actualizan task board                                       │
└───────────────────────────────┬─────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│  3. ORCHESTRATION (orchestrator) - Gemini 2.5 Flash             │
├─────────────────────────────────────────────────────────────────┤
│  • Monitoriza progreso de tareas                               │
│  • Facilita comunicación (team-message)                        │
│  • Resuelve bloqueos entre agentes                             │
│  • Actualiza task board en Linear                              │
└───────────────────────────────┬─────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│  4. PR MANAGEMENT (pr-manager) - Mistral Codestral              │
├─────────────────────────────────────────────────────────────────┤
│  • Detecta tareas completadas                                  │
│  • Crea Pull Request en GitHub                                 │
│  • Asigna code-reviewer y test-writer                          │
│  • Monitorea checks CI/CD                                      │
│  • Merge cuando todo pasa                                      │
└───────────────────────────────┬─────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│  5. REVIEW & TEST (code-reviewer + test-writer)                 │
├─────────────────────────────────────────────────────────────────┤
│  • Revisión de seguridad y buenas prácticas (Mistral Small)    │
│  • Escritura de tests TDD (Gemini 2.0 Flash)                   │
│  • Aprobación de PR para merge                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Comandos con Nuevos Agentes

```bash
# Verificar estado del equipo (orchestrator)
/team-status

# Enviar mensaje entre agentes (orchestrator)
/team-message "Backend: API lista para revisión"

# Añadir tarea al board (orchestrator)
/team-task-add "Implementar validación de usuarios"

# Crear issue en Linear (planner)
/linear-create-issue --title "Tarea" --teamId "team-id" --priority 2

# Verificar issues asignados (planner)
/linear-get-user-issues --limit 20

# Ver Pull Requests (pr-manager)
gh pr list

# Crear PR (pr-manager)
gh pr create --title "Feature X" --body "Descripción" --base main --head feature-x
```

## Referencias

- **opencode-ensemble**: https://github.com/hueyexe/opencode-ensemble
- **Git Worktrees**: https://git-scm.com/docs/git-worktree
- **Documentación opencode**: https://dev.opencode.ai/docs/agents/

---

**Última actualización**: 2026-03-18
**Proyecto**: Zona Raiz
