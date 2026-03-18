---
name: start-issue
description: Inicia el trabajo en un issue de Linear buscando detalles, creando una rama y actualizando el estado a In Progress.
license: MIT
---

# Start Issue Skill

## Flujo para iniciar un issue

### Paso 0: Análisis inicial del entorno
Antes de buscar el issue específico, ejecutar estas comprobaciones:

#### 0.1 Tareas pendientes en Linear
Usa `linear_get_user_issues` con filtro `status: "In Progress"` o `status: "Todo"` para mostrar:
- Issues actualmente en progreso
- Issues pendientes por iniciar
- Prioridades y estimaciones

#### 0.2 Revisar archivos .env disponibles
Buscar archivos .env en el proyecto:
```bash
find . -name ".env*" -type f 2>/dev/null
```
- Verificar si hay .env, .env.example, .env.production
- Confirmar que las variables necesarias están configuradas

#### 0.3 Ver cambios pendientes (git status)
Ejecutar:
```bash
git status
```
Identificar:
- Archivos modificados sin commitear
- Archivos en staging
- Archivos no trackeados
- Si hay commits locales sin push

#### 0.4 Ver ramas pendientes por subir
Ejecutar:
```bash
git branch -r  # ramas en remote
git branch -v   # ramas locales con último commit
```
Identificar:
- Ramas locales que no existen en remote
- Si alguna rama pendiente tiene nombre que coincida con un issue (kro-XXX-xxx)
- Sugerir hacer push de ramas pendientes asociadas a issues

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
1. Ejecuto análisis inicial (tareas pendientes, .env, git status, ramas)
2. Busco el issue con linear_search_issues
3. Muestro los detalles
4. Creo la rama kro-15-apply-lang-server
5. Actualizo el estado a In Progress
6. Agrego comentario inicial
```

---

## Notas importantes
- Si el issue tiene subtareas (KRO-15a, KRO-15b, etc.), menciónalas al usuario
- Si el issue ya está en "In Progress", avisa al usuario
- Si el issue está en "Done", avisa que ya está completado
- El slug del título debe ser lowercase y usar guiones (usa función slugify)
- El análisis inicial (Paso 0) debe ejecutarse siempre, incluso si el usuario especifica un issue directamente
- Si se encuentran ramas pendientes asociadas a issues, sugerir completar o pushear esos cambios primero
- Revisar que no haya conflictos con archivos .env ya existentes antes de crear nueva rama
