---
name: finish-issue
description: Termina el trabajo — commit semántico, push de rama y actualiza Linear a In Review
compatibility: opencode
---

## Pasos

1. `git add -A`
2. `git commit -m "<tipo>(<scope>): <descripción>"` — sigue las reglas de git
3. `git push origin <rama-actual>`
4. Actualiza el issue en Linear a "In Review"
5. Confirma: `pushed: <rama> — Linear: In Review`
