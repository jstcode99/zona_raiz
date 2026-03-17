---
name: finish-issue
description: Finaliza el trabajo en un issue: actualiza estado en Linear, hace commit, push y cambia de rama, cuando el usuario valide todos los cambios.
license: MIT
---

# Finish Issue Skill

## Flujo para finalizar un issue

### Paso 1: Obtener información del issue
Pregunta al usuario el UUID o identificador del issue (ej: "6c714116-ae1b-49f7-a5d6-62f92676bbc8" o "KRO-7f").

Si solo tiene el identificador corto, busca el UUID usando GraphQL:
```graphql
query { issues(filter: { title: { contains: "KRO-7f" } }) { nodes { id title state { name } } } }
```

### Paso 2: Mostrar estado actual
Muestra al usuario el estado actual del issue y pregunta si desea proceder.

### Paso 3: Actualizar estado en Linear
Usa GraphQL para actualizar el estado a "Done":
- StateId para Done: `7ba6cc41-9207-4daa-9b25-a10fbd622d4b`

```graphql
mutation { 
  issueUpdate(id: "UUID_DEL_ISSUE", input: { stateId: "7ba6cc41-9207-4daa-9b25-a10fbd622d4b" }) { 
    success 
    issue { id title state { name } } 
  } 
}
```

### Paso 4: Agregar comentario de completado
Usa `linear_add_comment` para documentar la завершение:
- body: "Completado. [breve resumen de lo hecho]"

### Paso 5: Hacer commit
Usa git para hacer commit con mensaje corto asociando el issue:
- Formato: `[KRO-N] Descripción corta`
- Ejemplo: `[KRO-7f] Add listings by status chart`

Ejecuta:
```bash
git add .
git commit -m "[KRO-7f] Add listings by status chart"
```

### Paso 6: Hacer push
```bash
git push -u origin kro-7f-create-bar-chart-listings-by-status
```

### Paso 7: Cambiar a rama principal
```bash
git checkout main
# o
git checkout master
```

---

## Ejemplo de uso

```
Usuario: Terminé el issue KRO-7f
Tú: 
0. Valida todo lo que genere para continuar
1. Actualizo el estado a Done en Linear
2. Agrego comentario de completado
3. Hacemos commit y push
4. Cambio a la rama principal
```

---

## Notas importantes
- Siempre pregunta al usuario el resumen de lo hecho para el comentario
- El mensaje de commit debe ser corto (máx 50-72 caracteres)
- Asocia siempre el issue con el prefijo [KRO-N]
- Confirma con el usuario antes de proceder con cada paso
- Si hay archivos敏感的 (credenciales, .env), adviértele al usuario
- Confirma con el usuario antes de hacer push, commits o cambios en linear
