import os
import time
from playwright.sync_api import sync_playwright

ROOT = r"C:\Users\Baker\Documents\DEMOS\Uganda Safaris"
URL = "http://127.0.0.1:8081/index.html"

def capture_all():
    print("Starting capture...", flush=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge", headless=True)

        # ----------------------------------------------------
        # 1. Desktop (MacBook Pro: 1496x942 -> viewport 1600x1008 @ 2x)
        # ----------------------------------------------------
        print("Capturing Desktop...", flush=True)
        ctx_d = browser.new_context(viewport={"width": 1600, "height": 1008}, device_scale_factor=2)
        page_d = ctx_d.new_page()
        page_d.goto(URL, wait_until="load")
        time.sleep(0.5)

        page_d.evaluate("""() => {
            const video = document.querySelector('.homeHero__video');
            if (video) video.remove();
            const poster = document.querySelector('.homeHero__poster');
            if (poster) {
                poster.style.opacity = '1';
                poster.style.display = 'block';
                poster.style.visibility = 'visible';
                poster.style.position = 'absolute';
                poster.style.inset = '0';
                poster.style.width = '100%';
                poster.style.height = '100%';
                poster.style.objectFit = 'cover';
                poster.style.zIndex = '1';
            }
            document.querySelectorAll('.headingReveal, .fadeInReveal, .homeHero__content *').forEach(el => {
                el.style.opacity = '1';
                el.style.visibility = 'visible';
                el.style.transform = 'none';
            });
        }""")
        time.sleep(0.5)
        out_d = os.path.join(ROOT, "mockup_screen_desktop.png")
        page_d.screenshot(path=out_d)
        print("Desktop captured:", out_d, os.path.getsize(out_d), flush=True)
        ctx_d.close()

        # ----------------------------------------------------
        # 2. Tablet (iPad: 484x658 -> viewport 840x1142 @ 2x)
        # ----------------------------------------------------
        print("Capturing Tablet...", flush=True)
        ctx_t = browser.new_context(viewport={"width": 840, "height": 1142}, device_scale_factor=2)
        page_t = ctx_t.new_page()
        page_t.goto(URL, wait_until="load")
        time.sleep(0.5)

        page_t.evaluate("""() => {
            const video = document.querySelector('.homeHero__video');
            if (video) video.remove();
            const poster = document.querySelector('.homeHero__poster');
            if (poster) {
                poster.style.opacity = '1';
                poster.style.display = 'block';
                poster.style.visibility = 'visible';
                poster.style.position = 'absolute';
                poster.style.inset = '0';
                poster.style.width = '100%';
                poster.style.height = '100%';
                poster.style.objectFit = 'cover';
                poster.style.zIndex = '1';
            }
            document.querySelectorAll('.headingReveal, .fadeInReveal, .homeHero__content *').forEach(el => {
                el.style.opacity = '1';
                el.style.visibility = 'visible';
                el.style.transform = 'none';
            });
        }""")
        time.sleep(0.5)
        out_t = os.path.join(ROOT, "mockup_screen_tablet.png")
        page_t.screenshot(path=out_t)
        print("Tablet captured:", out_t, os.path.getsize(out_t), flush=True)
        ctx_t.close()

        # ----------------------------------------------------
        # 3. Mobile (iPhone 15/16 Pro: 286x650 -> viewport 390x886 @ 2x)
        # ----------------------------------------------------
        print("Capturing Mobile...", flush=True)
        ctx_m = browser.new_context(viewport={"width": 390, "height": 886}, device_scale_factor=2, is_mobile=True)
        page_m = ctx_m.new_page()
        page_m.goto(URL, wait_until="load")
        time.sleep(0.5)

        page_m.evaluate("""() => {
            const video = document.querySelector('.homeHero__video');
            if (video) video.remove();
            const poster = document.querySelector('.homeHero__poster');
            if (poster) {
                poster.style.opacity = '1';
                poster.style.display = 'block';
                poster.style.visibility = 'visible';
                poster.style.position = 'absolute';
                poster.style.inset = '0';
                poster.style.width = '100%';
                poster.style.height = '100%';
                poster.style.objectFit = 'cover';
                poster.style.zIndex = '1';
            }
            document.querySelectorAll('.headingReveal, .fadeInReveal, .homeHero__content *').forEach(el => {
                el.style.opacity = '1';
                el.style.visibility = 'visible';
                el.style.transform = 'none';
            });

            // Adjust header for iPhone Dynamic Island
            const header = document.querySelector('.siteHeader') || document.querySelector('header');
            if (header) {
                header.style.paddingTop = '32px';
            }
        }""")
        time.sleep(0.5)
        out_m = os.path.join(ROOT, "mockup_screen_mobile.png")
        page_m.screenshot(path=out_m)
        print("Mobile captured:", out_m, os.path.getsize(out_m), flush=True)
        ctx_m.close()

        browser.close()
    print("All 3 Openbill Safaris device screens captured with pixel-perfect fidelity!", flush=True)

if __name__ == "__main__":
    capture_all()
