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
| `frontend-developer` | Next.js, Tailwind, shadcn/ui | Claude Sonnet 4 | Primary |
| `backend-developer` | Supabase, Clean Architecture, TypeScript | Claude Sonnet 4 | Primary |
| `code-reviewer` | Revisión de seguridad y buenas prácticas | GPT-4 Turbo | Subagent |
| `test-writer` | Tests TDD | Claude Haiku 4 | Subagent |

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
claude

# Terminal 2 - Agente Backend
cd .opencode/worktrees/backend
claude
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

## Referencias

- **opencode-ensemble**: https://github.com/hueyexe/opencode-ensemble
- **Git Worktrees**: https://git-scm.com/docs/git-worktree
- **Documentación opencode**: https://dev.opencode.ai/docs/agents/

---

**Última actualización**: 2026-03-17
**Proyecto**: Zona Raiz
