#!/bin/bash
# Highway Express Backup Script
# Run this script to backup the database and uploaded images

DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="./backups/$DATE"

echo "🔄 Starting Highway Express backup..."
echo "Backup directory: $BACKUP_DIR"

mkdir -p "$BACKUP_DIR"

# Backup SQLite database
if [ -f "./dev.db" ]; then
  cp ./dev.db "$BACKUP_DIR/database.db"
  echo "✅ Database backed up"
else
  echo "⚠️  Database file not found"
fi

# Backup uploaded images
if [ -d "./public/uploads" ]; then
  cp -r ./public/uploads "$BACKUP_DIR/uploads"
  echo "✅ Images backed up"
else
  echo "ℹ️  No uploads directory found"
fi

echo ""
echo "✅ Backup complete: $BACKUP_DIR"
echo "Files backed up:"
ls -la "$BACKUP_DIR"
