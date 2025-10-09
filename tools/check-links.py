#!/usr/bin/env python3
"""
Script simple pour vérifier les liens dans le projet
Utilisation: python check-links.py
"""

import os
import re
from pathlib import Path

def find_html_files():
    """Trouve tous les fichiers HTML"""
    return list(Path('.').rglob('*.html'))

def find_css_js_references():
    """Trouve les références CSS et JS dans les fichiers HTML"""
    html_files = find_html_files()
    references = []

    for html_file in html_files:
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()

            # Trouver les liens CSS
            css_links = re.findall(r'href="([^"]*\.css[^"]*)"', content)
            for link in css_links:
                if not link.startswith('http'):
                    references.append((str(html_file), link, 'css'))

            # Trouver les scripts JS
            js_scripts = re.findall(r'src="([^"]*\.js[^"]*)"', content)
            for script in js_scripts:
                if not script.startswith('http'):
                    references.append((str(html_file), script, 'js'))

            # Trouver les images
            images = re.findall(r'src="([^"]*\.(png|jpg|jpeg|gif|svg|webp)[^"]*)"', content)
            for img, ext in images:
                if not img.startswith('http'):
                    references.append((str(html_file), img, 'image'))

        except Exception as e:
            print(f"Erreur lors de la lecture de {html_file}: {e}")

    return references

def check_file_exists(file_path):
    """Vérifie si un fichier existe (ignore les paramètres de requête)"""
    # Enlever les paramètres de requête (?v=...)
    clean_path = file_path.split('?')[0]
    return Path(clean_path).exists()

def main():
    print("🔍 Vérification des liens dans le projet...\n")

    references = find_css_js_references()
    broken_links = []

    for html_file, ref, ref_type in references:
        # Convertir les chemins relatifs en absolus
        if ref.startswith('./'):
            ref = ref[2:]
        elif ref.startswith('/'):
            ref = ref[1:]  # Enlever le / au début pour les chemins locaux

        if not check_file_exists(ref):
            broken_links.append((html_file, ref, ref_type))

    if broken_links:
        print("❌ Liens brisés trouvés:")
        for html_file, ref, ref_type in broken_links:
            print(f"  - {html_file} → {ref} ({ref_type})")
        print(f"\nTotal: {len(broken_links)} liens brisés")
    else:
        print("✅ Aucun lien brisé trouvé !")

    print(f"\nTotal de références vérifiées: {len(references)}")

if __name__ == "__main__":
    main()