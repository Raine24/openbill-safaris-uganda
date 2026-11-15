import os
import shutil
from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = r"C:\Users\Baker\Documents\DEMOS\Uganda Safaris"
HTML_URL = "http://127.0.0.1:8081/mockup_scene.html"
OUT_PNG = os.path.join(ROOT, "openbill-safaris-responsive-mockup.png")
OUT_JPG = os.path.join(ROOT, "openbill-safaris-responsive-mockup.jpg")
ARTIFACT_DIR = r"C:\Users\Baker\.gemini\antigravity\brain\acec5ba1-67f8-4990-8182-e3c2f2fe56ac"

def render():
    print("Launching browser for 2048x2048 mockup render...", flush=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge", headless=True)
        page = browser.new_page(viewport={"width": 2048, "height": 2048})
        page.goto(HTML_URL, wait_until="load")
        page.wait_for_timeout(1000)
        page.screenshot(path=OUT_PNG)
        browser.close()
    
    print("Saved PNG:", OUT_PNG, os.path.getsize(OUT_PNG), flush=True)
    
    # Save high-res JPEG
    img = Image.open(OUT_PNG).convert("RGB")
    img.save(OUT_JPG, quality=95, optimize=True)
    print("Saved JPG:", OUT_JPG, os.path.getsize(OUT_JPG), flush=True)

    # Copy to artifact directory for embedding and chat preview
    art_jpg = os.path.join(ARTIFACT_DIR, "openbill-safaris-responsive-mockup.jpg")
    art_png = os.path.join(ARTIFACT_DIR, "openbill-safaris-responsive-mockup.png")
    shutil.copyfile(OUT_JPG, art_jpg)
    shutil.copyfile(OUT_PNG, art_png)
    print("Copied to artifacts:", art_jpg, flush=True)

if __name__ == "__main__":
    render()
