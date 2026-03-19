---
name: linear-planning
description: Template y proceso para crear task.md y issues en Linear. SOLO Linear - nunca usar GitHub Issues u otro board.
compatibility: opencode
---

## ⚠️ IMPORTANTE: Solo Linear

**NUNCA usar:**
- GitHub Issues
- Trello, Asana, Jira u otros
- Tableros distintos a Linear

**SIEMPRE usar Linear** para todas las issues del proyecto.

## Template task.md

```md
# Task: [nombre del feature]

## Scope
- **Agente:** backend | frontend | qa
- **Issue Linear:** [ID]
- **Rama:** feature/[id]-[nombre]

## Descripción
[qué debe hacer este agente — máximo 3 líneas]

## Checklist
- [ ] [paso concreto 1]
- [ ] [paso concreto 2]

## Restricciones
- Seguir patrones en: [archivo de referencia]
- No modificar: [archivos fuera de scope]

## Criterios de aceptación
- [ ] [criterio verificable 1]
- [ ] [criterio verificable 2]

## Casos de test para QA
- [ ] [caso E2E]
- [ ] [caso edge]
```

## Proceso Linear

**REGLAS OBLIGATORIAS:**
- ❌ NO crear issues en GitHub
- ❌ NO crear issues en otros sistemas
- ✅ SIEMPRE crear en Linear
- ✅ Si la issue ya existe en otro sistema, migrarla a Linear primero

**Pasos:**

1. Verificar que NO existe la issue en GitHub u otro sistema
2. Crear issue principal en Linear: título = nombre del feature, descripción = resumen
3. Crear sub-issue backend con el task.md en descripción, asignar a "backend-developer"
4. Crear sub-issue frontend con el task.md en descripción, asignar a "frontend-developer"
5. Crear sub-issue qa con criterios de aceptación, asignar a "test-writer"
6. Estado inicial de todos: "In Progress"
7. Reportar IDs: `[FEATURE-X] principal, [FEATURE-X1] backend, [FEATURE-X2] frontend, [FEATURE-X3] qa`
