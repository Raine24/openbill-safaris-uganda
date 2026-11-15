import os
import sys
import time
import math
import random
import subprocess
from playwright.sync_api import sync_playwright
import imageio_ffmpeg

def bezier_point(p0, p1, p2, p3, t):
    u = 1 - t
    tt = t * t
    uu = u * u
    uuu = uu * u
    ttt = tt * t
    x = uuu * p0[0] + 3 * uu * t * p1[0] + 3 * u * tt * p2[0] + ttt * p3[0]
    y = uuu * p0[1] + 3 * uu * t * p1[1] + 3 * u * tt * p2[1] + ttt * p3[1]
    return x, y

def generate_human_path(start, end, steps=24):
    dx = end[0] - start[0]
    dy = end[1] - start[1]
    dist = math.hypot(dx, dy)
    if dist < 5:
        return [end]
    
    # Slight curved perpendicular deviation
    dev = (random.random() - 0.5) * dist * 0.22
    nx = -dy / (dist + 1e-6)
    ny = dx / (dist + 1e-6)
    
    p0 = start
    p1 = (start[0] + dx * 0.33 + nx * dev, start[1] + dy * 0.33 + ny * dev)
    p2 = (start[0] + dx * 0.66 + nx * dev * 0.7, start[1] + dy * 0.66 + ny * dev * 0.7)
    p3 = end
    
    path = []
    for i in range(1, steps + 1):
        t = i / steps
        smooth_t = t * t * (3 - 2 * t)
        pt = bezier_point(p0, p1, p2, p3, smooth_t)
        # Subtle subpixel organic jitter
        jx = (random.random() - 0.5) * 1.2 if i < steps else 0
        jy = (random.random() - 0.5) * 1.2 if i < steps else 0
        path.append((pt[0] + jx, pt[1] + jy))
    return path

CURSOR_INJECTION_SCRIPT = """
(() => {
    if (document.getElementById('human-virtual-cursor')) return;
    const cursor = document.createElement('div');
    cursor.id = 'human-virtual-cursor';
    cursor.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.55));">
      <path d="M5.5 3.2L18.8 12.2L12.5 13.5L16.2 20.8L13.8 22L10.1 14.7L5.5 18.5V3.2Z" fill="#141414" stroke="#ffffff" stroke-width="1.6" stroke-linejoin="round"/>
    </svg>
    `;
    cursor.style.position = 'fixed';
    cursor.style.left = '0px';
    cursor.style.top = '0px';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '2147483647';
    cursor.style.transform = 'translate(960px, 540px)';
    cursor.style.willChange = 'transform';
    cursor.style.transition = 'transform 0.035s cubic-bezier(0.2, 0, 0.2, 1)';
    document.body.appendChild(cursor);

    window.__setCursorPos = (x, y) => {
        cursor.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
    };
    window.__setCursorClick = (down) => {
        const currentTransform = cursor.style.transform.split(' scale')[0];
        cursor.style.transform = down ? `${currentTransform} scale(0.88)` : currentTransform;
    };

    window.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }, { passive: true });
})();
"""

class HumanNavigator:
    def __init__(self, page):
        self.page = page
        self.cur_x = 960.0
        self.cur_y = 540.0
        self.page.evaluate(CURSOR_INJECTION_SCRIPT)
        self.page.evaluate(f"window.__setCursorPos({self.cur_x}, {self.cur_y})")

    def move_to(self, target_x, target_y, duration_sec=0.5, steps=25):
        path = generate_human_path((self.cur_x, self.cur_y), (target_x, target_y), steps=steps)
        step_delay = duration_sec / max(1, len(path))
        for pt in path:
            self.cur_x, self.cur_y = pt
            self.page.evaluate(f"window.__setCursorPos({self.cur_x}, {self.cur_y})")
            self.page.mouse.move(self.cur_x, self.cur_y)
            time.sleep(step_delay)
        # Settle
        time.sleep(0.05)

    def click_at(self, target_x, target_y):
        self.move_to(target_x, target_y, duration_sec=0.45)
        # Visual click press
        self.page.evaluate("window.__setCursorClick(true)")
        time.sleep(0.08)
        self.page.mouse.click(self.cur_x, self.cur_y)
        self.page.evaluate("window.__setCursorClick(false)")
        time.sleep(0.12)

    def reading_pause(self, seconds=2.0, subtle_drift=True):
        start = time.time()
        while time.time() - start < seconds:
            if subtle_drift and random.random() < 0.35:
                # Slight human reading eye drift (10-30px)
                dx = (random.random() - 0.5) * 25
                dy = (random.random() - 0.5) * 12
                nx = max(100, min(1820, self.cur_x + dx))
                ny = max(80, min(1000, self.cur_y + dy))
                self.move_to(nx, ny, duration_sec=0.35, steps=8)
            time.sleep(0.3)

    def scroll_burst(self, distance, duration_sec=0.45, steps=12):
        step_delay = duration_sec / steps
        for i in range(1, steps + 1):
            t = i / steps
            # Ease out cubic velocity
            ease = 1 - math.pow(1 - t, 3)
            prev_ease = 1 - math.pow(1 - (i - 1) / steps, 3)
            dy = distance * (ease - prev_ease)
            self.page.mouse.wheel(0, dy)
            time.sleep(step_delay)

    def human_scroll_to_y(self, target_y, burst_size=400):
        current_y = self.page.evaluate("() => window.scrollY")
        while abs(target_y - current_y) > 80:
            diff = target_y - current_y
            direction = 1 if diff > 0 else -1
            amt = min(abs(diff), burst_size + random.randint(-40, 60))
            self.scroll_burst(direction * amt, duration_sec=random.uniform(0.35, 0.5), steps=random.randint(10, 14))
            # Natural micro-pause between wheel swipes
            time.sleep(random.uniform(0.15, 0.35))
            current_y = self.page.evaluate("() => window.scrollY")
            
        # Micro correction to settle
        final_diff = target_y - current_y
        if abs(final_diff) > 20:
            self.scroll_burst(final_diff, duration_sec=0.3, steps=8)
            time.sleep(0.2)

def record_walkthrough():
    video_dir = os.path.abspath('walkthrough_raw')
    os.makedirs(video_dir, exist_ok=True)
    for f in os.listdir(video_dir):
        try: os.remove(os.path.join(video_dir, f))
        except: pass

    final_mp4 = os.path.abspath('Openbill_Safaris_Uganda_Walkthrough.mp4')
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()

    print('Launching Chrome with Playwright 1080p video recorder...', flush=True)
    p = sync_playwright().start()
    b = p.chromium.launch(channel='chrome', headless=True)
    ctx = b.new_context(
        viewport={'width': 1920, 'height': 1080},
        record_video_dir=video_dir,
        record_video_size={'width': 1920, 'height': 1080}
    )
    page = ctx.new_page()

    print('Navigating to http://localhost:8080...', flush=True)
    page.goto('http://localhost:8080', wait_until='domcontentloaded')
    time.sleep(2)
    nav = HumanNavigator(page)

    print('=== SCENE 1: Hero & Mega Navigation & Search ===', flush=True)
    time.sleep(1.0)
    # Cursor glides to header navigation
    nav.move_to(380, 45, duration_sec=0.7)  # Destinations
    time.sleep(0.5)
    nav.move_to(510, 45, duration_sec=0.5)  # Safari Types
    time.sleep(0.4)
    nav.move_to(650, 45, duration_sec=0.5)  # Curated Itineraries
    time.sleep(0.4)
    nav.move_to(1650, 45, duration_sec=0.8) # Tailor-made Quote CTA
    time.sleep(0.4)
    # Click search button
    nav.click_at(1841, 31)
    time.sleep(1.2)
    # Hover search suggestions
    nav.move_to(680, 220, duration_sec=0.6)
    time.sleep(0.6)
    nav.move_to(820, 220, duration_sec=0.5)
    time.sleep(0.6)
    # Close search overlay
    nav.click_at(1845, 44)
    time.sleep(1.0)
    # Settle on hero title
    nav.move_to(640, 540, duration_sec=0.7)
    nav.reading_pause(2.0)

    print('=== SCENE 2: Introduction & Operator Accreditation ===', flush=True)
    nav.human_scroll_to_y(1080, burst_size=420)
    nav.move_to(700, 450, duration_sec=0.6)
    nav.reading_pause(2.2)
    # Hover accreditation credentials
    nav.move_to(960, 680, duration_sec=0.7)
    time.sleep(1.0)

    print('=== SCENE 3: East Africa Destinations ===', flush=True)
    nav.human_scroll_to_y(2247, burst_size=440)
    nav.move_to(450, 480, duration_sec=0.8) # Uganda card
    time.sleep(1.2)
    nav.move_to(850, 480, duration_sec=0.7) # Rwanda card
    time.sleep(1.0)
    nav.move_to(1250, 480, duration_sec=0.7) # Tanzania card
    time.sleep(1.0)
    nav.move_to(1620, 480, duration_sec=0.7) # Kenya card
    nav.reading_pause(1.8)

    print('=== SCENE 4: Safari Experiences & Trip Types ===', flush=True)
    nav.human_scroll_to_y(3882, burst_size=420)
    nav.move_to(420, 520, duration_sec=0.8) # Gorilla trekking card
    time.sleep(1.2)
    nav.move_to(880, 520, duration_sec=0.7) # Chimpanzee tracking card
    time.sleep(1.0)
    nav.move_to(1340, 520, duration_sec=0.7) # Wildlife safari card
    nav.reading_pause(1.8)

    print('=== SCENE 5: Wilderness Video & Landscape Showcase ===', flush=True)
    nav.human_scroll_to_y(5200, burst_size=460)
    nav.move_to(960, 500, duration_sec=0.6)
    nav.reading_pause(2.5)

    print('=== SCENE 6: How It Works & Guarantees ===', flush=True)
    nav.human_scroll_to_y(6880, burst_size=440)
    nav.move_to(420, 540, duration_sec=0.8)
    time.sleep(0.8)
    nav.move_to(880, 540, duration_sec=0.6)
    time.sleep(0.8)
    nav.move_to(1340, 540, duration_sec=0.6)
    nav.reading_pause(2.0)

    print('=== SCENE 7: Featured Curated Itineraries & Modal Exploration ===', flush=True)
    nav.human_scroll_to_y(8212, burst_size=420)
    nav.move_to(600, 320, duration_sec=0.6) # Itinerary tabs
    time.sleep(0.8)
    # Hover 10 Days Best of Uganda Card
    nav.move_to(450, 560, duration_sec=0.7)
    time.sleep(1.2)
    # Click button to open itinerary detail modal!
    print('Opening Itinerary Details Modal...', flush=True)
    page.evaluate("() => { if (window.openSafariModal) window.openSafariModal('itinerary', 'ug-10d-best'); }")
    time.sleep(1.5)
    # Move cursor inside modal and explore
    nav.move_to(960, 480, duration_sec=0.6)
    time.sleep(1.5)
    # Scroll slightly inside modal dialog
    page.mouse.wheel(0, 350)
    time.sleep(1.5)
    # Click modal close button
    close_btn = page.query_selector('.obModal__close')
    if close_btn:
        box = close_btn.bounding_box()
        if box:
            nav.click_at(box['x'] + box['width']/2, box['y'] + box['height']/2)
    else:
        page.evaluate("() => document.getElementById('openbillSafariModal')?.close()")
    time.sleep(1.2)

    # Hover 3-Days Gorilla Trekking card
    nav.human_scroll_to_y(9300, burst_size=380)
    nav.move_to(880, 540, duration_sec=0.7)
    nav.reading_pause(2.0)

    print('=== SCENE 8: Verified Traveler Reviews ===', flush=True)
    nav.human_scroll_to_y(11576, burst_size=420)
    nav.move_to(850, 520, duration_sec=0.7)
    nav.reading_pause(2.2)

    print('=== SCENE 9: Hand-Picked Wilderness Stays ===', flush=True)
    nav.human_scroll_to_y(12752, burst_size=440)
    nav.move_to(460, 520, duration_sec=0.8)
    time.sleep(1.0)
    nav.move_to(960, 520, duration_sec=0.7)
    time.sleep(1.0)
    nav.move_to(1440, 520, duration_sec=0.7)
    nav.reading_pause(1.8)

    print('=== SCENE 10: OpenVision Foundation ===', flush=True)
    nav.human_scroll_to_y(14238, burst_size=440)
    nav.move_to(750, 560, duration_sec=0.8)
    nav.reading_pause(2.2)

    print('=== SCENE 11: Safari Insights & Planning Guides ===', flush=True)
    nav.human_scroll_to_y(15800, burst_size=450)
    nav.move_to(500, 540, duration_sec=0.8)
    time.sleep(1.2)
    nav.move_to(1000, 540, duration_sec=0.7)
    nav.reading_pause(2.0)

    print('=== SCENE 12: Call To Action & Luxury Footer ===', flush=True)
    nav.human_scroll_to_y(20649, burst_size=450)
    nav.move_to(960, 620, duration_sec=0.7) # Start Planning button
    time.sleep(1.5)
    # Glide into footer
    nav.human_scroll_to_y(21584, burst_size=380)
    nav.move_to(960, 480, duration_sec=0.8) # Footer credentials / license
    time.sleep(1.0)
    nav.move_to(1480, 550, duration_sec=0.7) # Newsletter signup
    nav.reading_pause(2.5)

    print('Finalizing video recording...', flush=True)
    ctx.close()
    b.close()
    p.stop()

    # Locate raw webm
    raw_files = [f for f in os.listdir(video_dir) if f.endswith('.webm')]
    if not raw_files:
        print('Error: No recorded webm found in', video_dir)
        return False
    raw_path = os.path.join(video_dir, raw_files[0])
    raw_size_mb = os.path.getsize(raw_path) / (1024 * 1024)
    print(f'Raw WebM recorded: {raw_path} ({raw_size_mb:.2f} MB)', flush=True)

    print(f'Transcoding to high-definition MP4: {final_mp4}...', flush=True)
    cmd = [
        ffmpeg_exe,
        '-y',
        '-i', raw_path,
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-preset', 'slow',
        '-crf', '18',
        '-movflags', '+faststart',
        final_mp4
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0 and os.path.exists(final_mp4):
        mp4_size_mb = os.path.getsize(final_mp4) / (1024 * 1024)
        print(f'SUCCESS! MP4 created: {final_mp4} ({mp4_size_mb:.2f} MB)', flush=True)
        return True
    else:
        print('FFmpeg error:', res.stderr, flush=True)
        return False

if __name__ == '__main__':
    record_walkthrough()
