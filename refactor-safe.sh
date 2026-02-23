#!/bin/bash

# Script para convertir camelCase/PascalCase a kebab-case
# Solo renombra archivos y carpetas, NO modifica imports ni contenido
# Omite carpetas y archivos críticos de Git, Next.js y Supabase CLI

# ============================================================================
# CONFIGURACIÓN: Patrones a ignorar
# ============================================================================

IGNORED_DIRS=(
    ".git"
    ".next"
    "out"
    "dist"
    "node_modules"
    ".vercel"
    ".turbo"
    "coverage"
    "supabase"
    ".supabase"
    ".husky"
    ".github"
    ".vscode"
)

IGNORED_FILES=(
    ".gitignore"
    ".gitattributes"
    ".gitmodules"
    "next.config.js"
    "next.config.ts"
    "next.config.mjs"
    "middleware.ts"
    "middleware.js"
    "package.json"
    "package-lock.json"
    "yarn.lock"
    "pnpm-lock.yaml"
    "bun.lockb"
    "tsconfig.json"
    "tsconfig.*.json"
    "jsconfig.json"
    ".env"
    ".env.*"
    ".eslintrc.*"
    ".eslintignore"
    ".prettierrc"
    ".prettierignore"
    "postcss.config.*"
    "tailwind.config.*"
    "jest.config.*"
    "vitest.config.*"
    "playwright.config.*"
    "next-env.d.ts"
    "Dockerfile"
    "docker-compose.yml"
    ".dockerignore"
    "README.md"
    "LICENSE"
    ".nvmrc"
    ".node-version"
)

# ============================================================================
# FUNCIONES
# ============================================================================

camel_to_kebab() {
    echo "$1" | sed -E 's/([a-z0-9])([A-Z])/\1-\2/g' | tr '[:upper:]' '[:lower:]'
}

should_ignore_path() {
    local path="$1"
    local rel_path="${path#$TARGET_DIR/}"
    local filename=$(basename "$path")
    
    for ignored in "${IGNORED_DIRS[@]}"; do
        if [[ "$rel_path" == "$ignored"* ]] || [[ "$rel_path" == */"$ignored"* ]]; then
            return 0
        fi
    done
    
    for ignored in "${IGNORED_FILES[@]}"; do
        if [[ "$ignored" == *"*"* ]]; then
            local pattern="${ignored//\*/.*}"
            [[ "$filename" =~ ^$pattern$ ]] && return 0
        elif [[ "$filename" == "$ignored" ]]; then
            return 0
        fi
    done
    
    return 1
}

# ============================================================================
# MAIN
# ============================================================================

TARGET_DIR="${1:-.}"
TARGET_DIR=$(realpath "$TARGET_DIR")

echo "🚀 Renombrando a kebab-case (solo nombres, sin tocar contenido)"
echo "📁 Directorio: $TARGET_DIR"
echo "================================================================"

[[ ! -d "$TARGET_DIR" ]] && { echo "❌ Error: Directorio no existe"; exit 1; }

# ============================================================================
# FASE 1: Analizar
# ============================================================================

echo "📋 Analizando..."

declare -a FILES_TO_RENAME
declare -a DIRS_TO_RENAME

while IFS= read -r -d '' path; do
    should_ignore_path "$path" && continue
    
    name=$(basename "$path")
    [[ "$name" =~ [A-Z] ]] || continue
    
    new_name=$(camel_to_kebab "$name")
    [[ "$name" == "$new_name" ]] && continue
    
    if [[ -d "$path" ]]; then
        DIRS_TO_RENAME+=("$path")
    else
        FILES_TO_RENAME+=("$path")
    fi
done < <(find "$TARGET_DIR" -print0)

echo "   📄 Archivos: ${#FILES_TO_RENAME[@]}"
echo "   📂 Directorios: ${#DIRS_TO_RENAME[@]}"

[[ ${#FILES_TO_RENAME[@]} -eq 0 && ${#DIRS_TO_RENAME[@]} -eq 0 ]] && { echo "✅ Nada que renombrar"; exit 0; }

# Preview
echo ""
echo "🔍 Preview:"
for path in "${FILES_TO_RENAME[@]}" "${DIRS_TO_RENAME[@]}"; do
    rel="${path#$TARGET_DIR/}"
    new=$(camel_to_kebab "$(basename "$path")")
    [[ -d "$path" ]] && echo "   📂 $rel/ → $new/" || echo "   📄 $rel → $new"
done | sort

echo ""
read -p "¿Continuar? (s/N): " confirm
[[ "$confirm" != "s" && "$confirm" != "S" ]] && { echo "❌ Cancelado"; exit 0; }

# ============================================================================
# FASE 2: Renombrar archivos (profundos primero)
# ============================================================================

echo ""
echo "📄 Renombrando archivos..."

printf '%s\n' "${FILES_TO_RENAME[@]}" | awk -F'/' '{print NF, $0}' | sort -rn | cut -d' ' -f2- | \
while read -r old_path; do
    [[ -e "$old_path" ]] || continue
    should_ignore_path "$old_path" && continue
    
    new_name=$(camel_to_kebab "$(basename "$old_path")")
    dir=$(dirname "$old_path")
    new_path="$dir/$new_name"
    
    [[ -e "$new_path" ]] && { echo "   ⚠️  Ya existe: $new_name"; continue; }
    
    mv "$old_path" "$new_path"
    echo "   ✅ ${old_path#$TARGET_DIR/} → $new_name"
done

# ============================================================================
# FASE 3: Renombrar directorios (profundos primero)
# ============================================================================

echo ""
echo "📂 Renombrando directorios..."

printf '%s\n' "${DIRS_TO_RENAME[@]}" | awk -F'/' '{print NF, $0}' | sort -rn | cut -d' ' -f2- | \
while read -r old_path; do
    [[ -d "$old_path" ]] || continue
    should_ignore_path "$old_path" && continue
    
    new_name=$(camel_to_kebab "$(basename "$old_path")")
    dir=$(dirname "$old_path")
    new_path="$dir/$new_name"
    
    [[ -e "$new_path" ]] && { echo "   ⚠️  Ya existe: $new_name/"; continue; }
    
    mv "$old_path" "$new_path"
    echo "   ✅ ${old_path#$TARGET_DIR/}/ → $new_name/"
done

echo ""
echo "================================================================"
echo "✅ Completado"
echo ""
echo "⚠️  IMPORTANTE: Los imports en el código NO se actualizaron."
echo "   Debes actualizar manualmente las rutas de importación:"
echo ""
echo "   Antes: import { x } from './miArchivo'"
echo "   Después: import { x } from './mi-archivo'"
echo ""
echo "   O usa el refactor de tu IDE (VS Code: F2 → Rename Symbol)"