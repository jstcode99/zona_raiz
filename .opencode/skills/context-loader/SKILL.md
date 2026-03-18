---
name: context-loader
description: >
  Carga automática de contexto inicial cuando se abre un chat con cualquier modelo.
  Lee las skills disponibles, variables de entorno y configuración del proyecto.
  Se ejecuta SIEMPRE al iniciar una sesión de chat.
license: MIT
---

# Context Loader Skill

## Descripción
Este skill proporciona las instrucciones para cargar el contexto inicial cada vez que se abre un chat. 
Su propósito es leer automáticamente la información relevante del proyecto (skills, variables, configuración) 
y presentarla al modelo para que tenga todo el contexto necesario desde el primer momento.

## Funcionalidad

### 1. Lectura de Skills Disponibles
Analiza todos los skills en `.opencode/skills/`:
- Backend Developer
- Frontend Developer
- Start Issue
- Finish Issue
- Linear Planning
- Cualquier otro skill personalizado

### 2. Lectura de Variables de Entorno
Lee `.env` para conocer las configuraciones:
- URLs de APIs
- Claves de Supabase
- Configuraciones de Google Client
- Variables específicas del proyecto

### 3. Lectura de Configuración del Proyecto
Lee `AGENTS.md` para entender:
- Arquitectura del proyecto
- Stack tecnológico
- Convenciones y patrones
- Estructura de directorios

## Flujo de Ejecución

```
Inicio de Chat
    ↓
1. Listar skills disponibles en .opencode/skills/
    ↓
2. Leer archivo .env
    ↓
3. Leer archivo AGENTS.md
    ↓
4. Analizar contenido y resumir
    ↓
5. Establecer contexto inicial para el modelo
```

## Información Cargada

### Skills Disponibles
```
Backend Developer: Guía de arquitectura y convenciones para backend
Finish Issue: Flujo para finalizar issues en Linear
Frontend Developer: (si existe)
Linear Planning: Creación y gestión de issues
Start Issue: Flujo para iniciar trabajo en issues
```

### Variables de Entorno
```
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
GOOGLE_CLIENT_SECRET
SUPABASE_SERVICE_ROLE_KEY
```

### Configuración del Proyecto
```
Stack: Next.js 16+, TypeScript, Supabase, Redis, Tailwind CSS
Arquitectura: Clean/Hexagonal Architecture
Patrones: Server Actions, Ports/Adapters
```

## Ejecución Automática

Este skill debe ser ejecutado SIEMPRE al iniciar una sesión de chat. 
Como skill, se carga en el contexto del agente y debe ser invocado automáticamente en la primera interacción.

### Instrucciones para el Agente:

**Al iniciar cualquier conversación, ejecuta el siguiente flujo:**

1. **Verifica si el contexto ya fue cargado** (para evitar repetición en la misma sesión)
2. **Lee los archivos necesarios**:
   - Lista los skills en `.opencode/skills/`
   - Lee `.env`
   - Lee `AGENTS.md`
3. **Presenta el contexto inicial** al usuario

### Script de Ejecución

El skill incluye un script TypeScript (`execute.ts`) que puedes ejecutar para obtener el contexto:

```bash
npx ts-node .opencode/skills/context-loader/execute.ts
```

### Flujo de Conversación

```
Usuario: Hola, necesito ayuda con el proyecto
→ Agente: [Ejecuta Context Loader automáticamente]
→ Agente: Hola, soy tu asistente para el proyecto Zona Raiz.
          He cargado el contexto inicial:
          
          # Contexto Inicial - Zona Raiz
          
          ## 🛠️ Skills Disponibles (5)
          - backend-developer: Guía de arquitectura y convenciones...
          - finish-issue: Finaliza el trabajo en un issue...
          - ...
          
          ## 🔧 Stack Tecnológico
          - Next.js 16+ App Router (SSR por defecto)
          - TypeScript estricto
          - Supabase (auth + database)
          ...
          
          ¿En qué puedo ayudarte?
```

## Verificación de Estado

Para verificar que el context loader funcionó correctamente:
1. Revisar que se muestran los skills disponibles
2. Confirmar que se leyeron las variables de entorno
3. Validar que se cargó la configuración del proyecto

## Notas Importantes

- Este skill debe ejecutarse SIEMPRE al iniciar un chat
- No requiere invocación manual por parte del usuario
- La información se muestra como contexto inicial
- No modifica archivos ni ejecuta comandos destructivos
- Solo lee y resume información existente
- El agente debe mantener un flag de "contexto cargado" para evitar repetición
