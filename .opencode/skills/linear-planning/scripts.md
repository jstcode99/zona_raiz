# Linear API Scripts via Curl

Usa estos scripts cuando necesites interactuar con la API de Linear directamente.
El endpoint siempre es `https://api.linear.app/graphql` y requiere el header
`Authorization: $LINEAR_API_KEY`.

---

## 1. Obtener Teams y sus UUIDs

Usa esto **siempre antes de crear issues** para obtener el `teamId` correcto.

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: $LINEAR_API_KEY" \
  --data '{ "query": "query Teams { teams { nodes { id name key } }}" }' \
  https://api.linear.app/graphql
```

Extrae el campo `id` del team con key `KRO` (o el que corresponda) y úsalo como `teamId`.

---

## 2. Crear un Issue

Reemplaza `TEAM_UUID`, `TITULO`, `DESCRIPCION` y `PRIORITY` antes de ejecutar.
Prioridades: `0` = Sin prioridad, `1` = Urgent, `2` = High, `3` = Medium, `4` = Low.

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: $LINEAR_API_KEY" \
  --data '{
    "query": "mutation IssueCreate { issueCreate(input: { title: \"TITULO\", description: \"DESCRIPCION\", teamId: \"TEAM_UUID\", priority: PRIORITY }) { success issue { id identifier title url } } }"
  }' \
  https://api.linear.app/graphql
```

---

## 3. Listar Issues del Team

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: $LINEAR_API_KEY" \
  --data '{
    "query": "query TeamIssues { team(id: \"TEAM_UUID\") { issues { nodes { id identifier title priority state { name } } } } }"
  }' \
  https://api.linear.app/graphql
```

---

## 4. Obtener Workflow States (columnas del board)

Necesario para mover issues entre estados (Todo → In Progress → Done).

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: $LINEAR_API_KEY" \
  --data '{ "query": "query States { workflowStates { nodes { id name type } } }" }' \
  https://api.linear.app/graphql
```

---

## 5. Actualizar estado de un Issue

Obtén el `stateId` del script anterior, luego actualiza el issue por su `ISSUE_UUID`.

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: $LINEAR_API_KEY" \
  --data '{
    "query": "mutation IssueUpdate { issueUpdate(id: \"ISSUE_UUID\", input: { stateId: \"STATE_UUID\" }) { success issue { id identifier title state { name } } } }"
  }' \
  https://api.linear.app/graphql
```

---

## 6. Buscar Issues por texto

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: $LINEAR_API_KEY" \
  --data '{
    "query": "query SearchIssues { issueSearch(query: \"TEXTO_A_BUSCAR\") { nodes { id identifier title state { name } priority } } }"
  }' \
  https://api.linear.app/graphql
```

---

## 7. Obtener Proyectos del Team

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: $LINEAR_API_KEY" \
  --data '{
    "query": "query Projects { projects { nodes { id name state } } }"
  }' \
  https://api.linear.app/graphql
```

---

## Flujo recomendado para crear issues masivos

1. Ejecuta el script **#1** para obtener el `teamId` UUID
2. Ejecuta el script **#4** para obtener los `stateId` de cada columna
3. Analiza el código del proyecto buscando TODOs, FIXMEs y funcionalidades incompletas
4. Por cada hallazgo ejecuta el script **#2** con el `teamId` obtenido
5. Confirma con el script **#3** que los issues quedaron creados correctamente

---

## Variables de entorno requeridas

| Variable | Descripción |
|----------|-------------|
| `LINEAR_API_KEY` | Personal API Key desde linear.app → Settings → Security & Access |

> **Nunca uses el key corto del team (ej: `KRO`).  
> Siempre usa el UUID completo obtenido del script #1.**