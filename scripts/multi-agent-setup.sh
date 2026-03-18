#!/bin/bash

# Script de utilidad para configurar trabajo con múltiples agentes
# Uso: ./scripts/multi-agent-setup.sh [frontend|backend|both]

set -e

echo "=== Configuración de Trabajo con Múltiples Agentes ==="
echo ""

# Verificar si estamos en un repositorio git
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: No estás en un directorio de git"
    exit 1
fi

# Actualizar main
echo "1. Actualizando main..."
git checkout main
git pull origin main
echo "✅ Main actualizado"
echo ""

# Función para crear worktree
setup_worktree() {
    local branch_name=$1
    local worktree_path=$2
    local description=$3

    echo "2. Configurando worktree para $description..."
    if git worktree list | grep -q "$worktree_path"; then
        echo "⚠️  Worktree ya existe en $worktree_path"
    else
        git worktree add "$worktree_path" "feature/$branch_name"
        echo "✅ Worktree creado: $worktree_path"
    fi
    echo ""
}

# Opciones de configuración
case "${1:-both}" in
    "frontend")
        setup_worktree "frontend-agent" ".opencode/worktrees/frontend" "Agente Frontend"
        ;;
    "backend")
        setup_worktree "backend-agent" ".opencode/worktrees/backend" "Agente Backend"
        ;;
    "both")
        setup_worktree "frontend-agent" ".opencode/worktrees/frontend" "Agente Frontend"
        setup_worktree "backend-agent" ".opencode/worktrees/backend" "Agente Backend"
        ;;
    *)
        echo "❌ Opción inválida: $1"
        echo "Uso: $0 [frontend|backend|both]"
        exit 1
        ;;
esac

echo "=== Resumen de Worktrees ==="
git worktree list
echo ""

echo "✅ Configuración completada"
echo ""
echo "Para iniciar los agentes:"
echo "  cd .opencode/worktrees/frontend && opencode"
echo "  cd .opencode/worktrees/backend && opencode"
echo ""
echo "Documentación: .opencode/AGENTS_MULTIWORKFLOW.md"
