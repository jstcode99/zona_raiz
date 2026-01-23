import fs from 'fs'
import path from 'path'
import ts from 'typescript'
import openapiTS, { astToString } from 'openapi-typescript'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config({
  path: '.env.local',
})

// -----------------------------
// Helpers de tipos TS
// -----------------------------
const BLOB = ts.factory.createTypeReferenceNode(
  ts.factory.createIdentifier('Blob')
)

const DATE = ts.factory.createTypeReferenceNode(
  ts.factory.createIdentifier('Date')
)

const NULL = ts.factory.createLiteralTypeNode(
  ts.factory.createNull()
)

// -----------------------------
// Validación de ENV
// -----------------------------
const API_URL = process.env.API_URL
const API_DOCS_TOKEN = process.env.API_DOCS_TOKEN

if (!API_URL || !API_DOCS_TOKEN) {
  console.error('❌ Missing required environment variables')
  console.error({
    API_URL,
    API_DOCS_TOKEN: API_DOCS_TOKEN ? '***' : undefined,
  })
  process.exit(1)
}

// -----------------------------
// URLs OpenAPI
// -----------------------------
const urlJsonApis = [
  API_URL.replace(
    'api/v1',
    'api/docs.json?api-docs.json'
  )
]

// -----------------------------
// Paths
// -----------------------------
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const outputDir = path.resolve(__dirname, '../types/api')

// Asegurar directorio destino
fs.mkdirSync(outputDir, { recursive: true })

// -----------------------------
// Generación
// -----------------------------
async function generateSchemas() {
  for (const [index, urlJson] of urlJsonApis.entries()) {
    console.log(`⏳ Fetching OpenAPI schema: ${urlJson}`)

    const response = await fetch(urlJson, {
      headers: {
        Authorization: `Bearer ${API_DOCS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(
        `❌ Error fetching schema (${response.status}): ${response.statusText}`
      )
    }

    const schema = await response.json()

    const ast = await openapiTS(schema, {
      transform(schemaObject, metadata) {
        // date-time → Date
        if (schemaObject.format === 'date-time') {
          return schemaObject.nullable
            ? ts.factory.createUnionTypeNode([DATE, NULL])
            : DATE
        }

        // binary → Blob / File
        if (schemaObject.format === 'binary') {
          if (metadata.path.endsWith('multipart/form-data')) {
            return schemaObject.nullable ? 'File | null' : 'File'
          }

          if (metadata.path.endsWith('application/octet-stream')) {
            return schemaObject.nullable ? 'Blob | null' : 'Blob'
          }

          return schemaObject.nullable
            ? ts.factory.createUnionTypeNode([BLOB, NULL])
            : BLOB
        }

        return undefined
      },

      enumValues: true,
      rootTypes: true,
      rootTypesNoSchemaPrefix: true,
      makePathsEnum: true,
      generatePathParams: true,
      alphabetize: true,
      additionalProperties: true,
    })

    let content = astToString(ast)

    // -----------------------------
    // Fix ApiPaths (:id → {id})
    // -----------------------------
    const enumRegex =
      /(export\s+enum\s+ApiPaths\s*{)([\s\S]*?)(\n?\s*})/

    content = content.replace(
      enumRegex,
      (match, start, enumBody, end) => {
        const modifiedBody = enumBody.replace(
          /:([a-zA-Z0-9_]+)/g,
          '{$1}'
        )
        return `${start}${modifiedBody}${end}`
      }
    )

    const fileName =
      index === 0 ? 'schema.ts' : 'schema-calc.ts'

    const outputPath = path.join(outputDir, fileName)

    fs.writeFileSync(outputPath, content)

    console.log(`✅ Schema generated: ${outputPath}`)
  }
}

// -----------------------------
// Run
// -----------------------------
generateSchemas().catch((err) => {
  console.error('❌ Failed to generate schemas')
  console.error(err)
  process.exit(1)
})
