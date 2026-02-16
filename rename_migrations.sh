#!/bin/bash

# Carpeta de migraciones
MIGRATIONS_DIR="supabase/migrations"

# Carpeta temporal para nuevas migraciones
NEW_DIR="$MIGRATIONS_DIR/new_migrations"
mkdir -p "$NEW_DIR"

# Contador de segundos para generar prefijos únicos
COUNTER=0

# Recorre cada archivo SQL en la carpeta de migraciones
for FILE in "$MIGRATIONS_DIR"/*.sql; do
  BASENAME=$(basename "$FILE")
  # Generar timestamp nuevo + contador para que nunca se repita
  NEW_TIMESTAMP=$(date +"%Y%m%d%H%M%S")
  NEW_TIMESTAMP=$(($NEW_TIMESTAMP + $COUNTER))
  NEW_NAME="${NEW_TIMESTAMP}_${BASENAME#*_}"

  echo "Copiando $BASENAME → $NEW_NAME"
  cp "$FILE" "$NEW_DIR/$NEW_NAME"

  COUNTER=$(($COUNTER + 1))
done

echo "Todas las migraciones fueron copiadas con nuevos prefijos en $NEW_DIR"
