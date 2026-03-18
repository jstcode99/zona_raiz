---
name: start-issue
description: Inicia el trabajo en un issue — crea la rama, hace checkout y actualiza Linear a In Progress
compatibility: opencode
---

## Pasos

1. Lee el ID del issue de Linear de tu task.md
2. Crea la rama: `git checkout -b feature/<issue-id>-<nombre-corto>`
3. Actualiza el issue en Linear a "In Progress"
4. Confirma: `rama creada: feature/<issue-id>-<nombre-corto>`
