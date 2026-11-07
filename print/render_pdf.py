#!/usr/bin/env python3
"""Renderiza print/*.html a imprimir/*.pdf con Chrome headless (Playwright).
Uso: python3 print/render_pdf.py hojas_adn_secreto souvenir"""
import json, sys
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = Path(__file__).resolve().parent.parent

def render(names):
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path="/usr/bin/google-chrome")
        pg = b.new_page()
        for n in names:
            src = BASE / "print" / f"{n}.html"
            out = BASE / "imprimir" / f"{n}.pdf"
            pg.goto(src.as_uri(), wait_until="networkidle")
            pg.evaluate("document.fonts.ready")
            pg.wait_for_timeout(300)
            pg.emulate_media(media="print")
            summ = pg.evaluate("window.SUMMARY||null")
            if summ:
                print(json.dumps({k: v for k, v in summ.items() if k != "list"}, ensure_ascii=False))
            pg.pdf(path=str(out), format="A4", print_background=True, prefer_css_page_size=True)
            print("->", out)
        b.close()

if __name__ == "__main__":
    render(sys.argv[1:] or ["hojas_adn_secreto", "souvenir"])
