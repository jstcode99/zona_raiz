# Task: Implement Import System (XLS Upload, Parse, Preview)

## Parent Issue
- **Linear:** KRO-10

## Sub-Issues
- KRO-63: [KRO-10a] Create XLS upload component with validation
- KRO-64: [KRO-10b] Implement XLS parser with xlsx library
- KRO-65: [KRO-10c] Create preview data grid

---

## KRO-63: [KRO-10a] XLS Upload Component

### Scope
- **Agente:** frontend
- **Rama:** feature/kro-63-xls-upload-component

### Descripción
Crear componente de upload para archivos XLS/XLSX con drag & drop y validación de formato.

### Checklist
- [ ] Crear `features/import/xls-upload.tsx`
- [ ] Usar `react-dropzone` (ya instalado) para drag & drop
- [ ] Validar MIME types: `application/vnd.ms-excel`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- [ ] Validar tamaño máximo: 10MB
- [ ] Mostrar progreso de upload
- [ ] Integrar con botón de acción
- [ ] Añadir traducciones en `locales/es/components.json`

### Restricciones
- Seguir patrón de `features/image-manager/image-dropzone.tsx`
- Usar UI components de shadcn/ui existentes
- No implementar parsing en este componente

### Criterios de Aceptación
- [ ] Dropzone acepta solo archivos .xls y .xlsx
- [ ] Muestra error para archivos inválidos
- [ ] Estado de loading durante upload
- [ ] Traducciones completas en ES/EN

### Casos de Test QA
- [ ] Upload exitoso de archivo .xls válido
- [ ] Upload exitoso de archivo .xlsx válido
- [ ] Rechazo de archivo .csv
- [ ] Rechazo de archivo > 10MB
- [ ] Feedback visual durante drag

---

## KRO-64: [KRO-10b] XLS Parser

### Scope
- **Agente:** backend
- **Rama:** feature/kro-64-xls-parser

### Descripción
Implementar parser para leer archivos XLS/XLSX y convertir a estructura de propiedades.

### Dependencias
- KRO-63 (upload component debe existir primero)

### Checklist
- [ ] Instalar `xlsx` (librería ya disponible en ecosistema)
- [ ] Crear `domain/services/import.service.ts`
- [ ] Crear `domain/ports/import.port.ts` (interfaz abstracta)
- [ ] Crear `infrastructure/adapters/supabase/supabase-import.adapter.ts`
- [ ] Crear `application/mappers/import.mapper.ts`
- [ ] Crear `application/actions/import.actions.ts` (Server Action)
- [ ] Crear `application/validation/import.schema.ts`
- [ ] Registrar servicio en `app.module.ts`

### Mapping Excel → Property

Columnas esperadas en Excel:
```
| A: title | B: description | C: property_type | D: street | E: city | F: state | G: country | H: postal_code | I: bedrooms | J: bathrooms | K: total_area | L: built_area | M: lot_area | N: parking_spots | O: year_built | P: amenities
```

Validaciones por campo:
- `title`: Requerido, 3-200 chars
- `property_type`: Enum (house, apartment, condo, townhouse, land, commercial, office, warehouse, other)
- `bedrooms`, `bathrooms`, `total_area`, etc.: Número o null
- `amenities`: Separados por coma (pool, gym, parking, etc.)

### Restricciones
- Usar patrón de `property.service.ts` para servicios
- Usar patrón de `supabase-property.adapter.ts` para adaptadores
- El parser debe retornar Array<Partial<PropertyEntity>>
- Registrar errores por fila para preview

### Criterios de Aceptación
- [ ] Parser lee archivo XLS/XLSX correctamente
- [ ] Mapea columnas Excel a campos PropertyEntity
- [ ] Valida cada fila y reporta errores
- [ ] Retorna datos con validación exitosa + errores
- [ ] Unit tests para mapper

### Archivos a Crear
```
domain/ports/import.port.ts
domain/services/import.service.ts
infrastructure/adapters/supabase/supabase-import.adapter.ts
application/mappers/import.mapper.ts
application/validation/import.schema.ts
application/actions/import.actions.ts
```

### Casos de Test QA
- [ ] Parser con archivo válido
- [ ] Parser con filas inválidas (reporta errores por fila)
- [ ] Parser con columnas faltantes
- [ ] Parser con tipos de datos incorrectos

---

## KRO-65: [KRO-10c] Preview Data Grid

### Scope
- **Agente:** frontend
- **Rama:** feature/kro-65-preview-data-grid

### Dependencias
- KRO-63 (upload component)
- KRO-64 (parser service)

### Descripción
Crear componente de preview que muestre datos importados en tabla editable antes de confirmar.

### Checklist
- [ ] Crear `features/import/import-preview.tsx`
- [ ] Crear `features/import/import-dialog.tsx`
- [ ] Usar DataTable de `@/components/ui/data-table.tsx`
- [ ] Mostrar columnas: title, property_type, city, bedrooms, bathrooms, status
- [ ] Indicador visual para filas con errores
- [ ] Botones de acción: Cancelar, Confirmar Import
- [ ] Manejar bulk create en Server Action

### Columnas a Mostrar
| Columna | Tipo | Editable |
|---------|------|----------|
| title | text | no |
| property_type | badge | no |
| street | text | no |
| city | text | no |
| bedrooms | number | no |
| bathrooms | number | no |
| status | badge (success/error) | no |

### Restricciones
- Usar patrón de `features/properties/property-table.tsx`
- Integrar con `useServerMutation` hook
- No permitir edición inline (futuro feature)

### Criterios de Aceptación
- [ ] Muestra preview de datos importados
- [ ] Resalta filas con errores en rojo
- [ ] Muestra contador: X propiedades válidas, Y errores
- [ ] Botón confirmar solo activo si hay filas válidas
- [ ] Loading state durante bulk create

### Casos de Test QA
- [ ] Preview con 10+ filas
- [ ] Preview con filas inválidas (errores visibles)
- [ ] Confirmar import exitoso
- [ ] Cancelar import

---

## Dependencias Entre Tasks

```
KRO-63 (Upload) → KRO-65 (Preview)
KRO-64 (Parser) → KRO-65 (Preview)
```

## Notas Técnicas

### Storage Bucket
KRO-66 ya configuró bucket `imports` en Supabase. Usar para:
- Upload temporal de archivos XLS
- Considerar limpieza automática después de import

### Performance
- Para archivos > 1000 filas, usar streaming/pagination en parser
- Considerar Web Worker para parsing pesado

### Traducciones Requeridas
```json
// locales/es/components.json
{
  "import": {
    "drop-here": "Suelta el archivo aquí",
    "drag-drop": "Arrastra un archivo XLS o haz clic para seleccionar",
    "invalid-file": "Archivo inválido. Solo se aceptan .xls y .xlsx",
    "preview-title": "Vista previa de importación",
    "valid-rows": "propiedades válidas",
    "errors": "errores",
    "confirm": "Importar propiedades",
    "cancel": "Cancelar",
    "success": "Se importaron {{count}} propiedades",
    "error": "Error al importar"
  }
}
```

### Supabase Storage Policy (para KRO-66)
```sql
-- Bucket: imports (para KRO-66)
CREATE POLICY "Allow authenticated uploads" ON storage.buckets
  FOR INSERT TO authenticated;
```
