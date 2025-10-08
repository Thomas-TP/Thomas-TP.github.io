#!/usr/bin/env python3
"""
Script de nettoyage des fichiers temporaires
Utilisation: python tools/clean.py
"""

import os
import glob
from pathlib import Path

def clean_temp_files():
    """Nettoie les fichiers temporaires courants"""
    temp_patterns = [
        "*.tmp",
        "*.temp",
        "*.log",
        "*.cache",
        "__pycache__",
        "*.pyc",
        ".DS_Store",
        "Thumbs.db",
        "lighthouse-report.html"
    ]

    cleaned_files = []

    for pattern in temp_patterns:
        for file_path in glob.glob(pattern, recursive=True):
            if os.path.exists(file_path):
                try:
                    if os.path.isdir(file_path):
                        import shutil
                        shutil.rmtree(file_path)
                        cleaned_files.append(f"📁 Supprimé: {file_path}")
                    else:
                        os.remove(file_path)
                        cleaned_files.append(f"🗑️ Supprimé: {file_path}")
                except Exception as e:
                    print(f"❌ Erreur lors de la suppression de {file_path}: {e}")

    if cleaned_files:
        print("🧹 Fichiers nettoyés:")
        for file in cleaned_files:
            print(f"  {file}")
        print(f"\n✅ {len(cleaned_files)} fichiers supprimés")
    else:
        print("✨ Aucun fichier temporaire trouvé")

if __name__ == "__main__":
    clean_temp_files()