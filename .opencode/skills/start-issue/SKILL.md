---
name: start-issue
description: Inicia el trabajo en un issue de Linear buscando detalles, creando una rama y actualizando el estado a In Progress.
license: MIT
---

# Start Issue Skill

## Flujo para iniciar un issue

### Paso 1: Buscar el issue
Usa `linear_search_issues` para obtener los detalles del issue:
- Busca por el identificador (ej: "KRO-15", "KRO-44")
- O por descripción/título

### Paso 2: Mostrar detalles al usuario
Extrae y muestra:
- **ID**: El identificador corto (ej: KRO-15)
- **UUID**: Para actualizaciones
- **Título**: Título completo del issue
- **Descripción**: Si existe
- **Prioridad**: Valor numérico (0-4)
- **Estado**: Estado actual
- **Etiquetas**: Si tiene

### Paso 3: Crear la rama
1. Genera el nombre de rama usando el formato: `kro-{numero}-{slug-titulo}`
   - Ejemplo: `kro-15-apply-lang-server`
2. Usa el comando git:
   ```bash
   git checkout -b kro-{numero}-{slug-titulo}
   ```

### Paso 4: Actualizar estado en Linear
Usa `linear_update_issue` con:
- `id`: El UUID del issue
- `status`: "In Progress" (busca el stateId correcto)

### Paso 5: Agregar comentario inicial
Usa `linear_add_comment` para documentar que empezarás a trabajar:
- body: "Empezando a trabajar en este issue. [tu plan/resumen]"

---

## Ejemplo de uso

```
Usuario: quiero trabajar en KRO-15
Tú: 
1. Busco el issue con linear_search_issues
2. Muestro los detalles
3. Creo la rama kro-15-apply-lang-server
4. Actualizo el estado a In Progress
5. Agrego comentario inicial
```

---

## Notas importantes
- Si el issue tiene subtareas (KRO-15a, KRO-15b, etc.), menciónalas al usuario
- Si el issue ya está en "In Progress", avisa al usuario
- Si el issue está en "Done", avisa que ya está completado
- El slug del título debe ser lowercase y usar guiones (usa función slugify)
