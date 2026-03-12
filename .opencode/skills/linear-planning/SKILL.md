---
name: linear-planning
description: Analiza el proyecto y crea issues en Linear con categorías, prioridades y team UUID correcto. También actualiza estado, prioridad, asignado y comentarios de issues existentes.
license: MIT
---

# Linear Planning Skill

## Antes de crear o actualizar issues
1. Usa el MCP de Linear para obtener el team ID correcto — busca el team por nombre y extrae su UUID
2. Nunca uses el key corto (ej: KRO), siempre el UUID completo
3. Para actualizar, obtén primero el UUID del issue con `linear_search_issues` o `linear_list_issues`

---

## Análisis del proyecto
Escanea el código buscando:
- `TODO`, `FIXME`, `HACK`, `XXX` en comentarios
- Funciones vacías o con `pass`/`throw new Error('not implemented')`
- Endpoints sin lógica
- Archivos sin tests correspondientes

---

## Categorías y prioridades
| Categoría | Label | Prioridad |
|-----------|-------|-----------|
| Bug / deuda técnica | bug | urgent |
| Feature pendiente | feature | high |
| Tests faltantes | testing | medium |
| Rendimiento | performance | medium |
| Documentación | docs | low |

---

## Formato de cada issue
- **Título**: acción + contexto (ej: "Implementar validación en endpoint /auth/login")
- **Descripción**: archivo, línea, contexto de por qué es necesario

---

## Actualizar issues existentes

### Cambiar estado (mover entre columnas)
1. Obtén los workflow states disponibles con `linear_list_workflow_states`
2. Usa el `stateId` correspondiente para actualizar

Estados comunes:
| Estado | Cuándo usarlo |
|--------|--------------|
| Todo | Issue creado, sin iniciar |
| In Progress | Trabajo iniciado |
| In Review | En revisión / PR abierto |
| Done | Completado |
| Cancelled | Descartado |

### Cambiar prioridad
Valores válidos: `0` = Sin prioridad, `1` = Urgent, `2` = High, `3` = Medium, `4` = Low

### Agregar comentario
Usa `linear_create_comment` con el UUID del issue para documentar avances, blockers o decisiones.

### Flujo recomendado al trabajar un issue
1. Busca el issue con `linear_search_issues` por título o identificador (ej: KRO-42)
2. Muévelo a **In Progress** al empezar
3. Agrega comentario con el plan de implementación
4. Al terminar muévelo a **Done** y agrega comentario con resumen de cambios

### Flujo recomendado al encontrar un blocker
1. Agrega comentario al issue describiendo el blocker
2. Cambia prioridad a **Urgent** si bloquea otros issues
3. Crea un nuevo issue relacionado si el blocker requiere trabajo separado

---

## Si el MCP de Linear falla
Usa el MCP de curl con los scripts en `scripts.md` como alternativa para cualquier operación.