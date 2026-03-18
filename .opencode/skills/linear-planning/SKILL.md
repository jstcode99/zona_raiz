---
name: linear-planning
description: Template y proceso para crear task.md y issues en Linear con sub-issues por agente
compatibility: opencode
---

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

1. Crear issue principal: título = nombre del feature, descripción = resumen
2. Crear sub-issue backend con el task.md en descripción, asignar a "backend-developer"
3. Crear sub-issue frontend con el task.md en descripción, asignar a "frontend-developer"
4. Crear sub-issue qa con criterios de aceptación, asignar a "test-writer"
5. Estado inicial de todos: "In Progress"
6. Reportar IDs: `[FEATURE-X] principal, [FEATURE-X1] backend, [FEATURE-X2] frontend, [FEATURE-X3] qa`
