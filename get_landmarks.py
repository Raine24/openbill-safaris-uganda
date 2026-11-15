from playwright.sync_api import sync_playwright

p = sync_playwright().start()
b = p.chromium.launch(channel='chrome', headless=True)
page = b.new_page(viewport={'width': 1920, 'height': 1080})
page.goto('http://localhost:8080', wait_until='domcontentloaded')
page.wait_for_timeout(1000)

data = page.evaluate("""() => {
    const landmarks = [];
    const elements = document.querySelectorAll(
        'header, section, footer, [id], .hero, .homeDestinations, .homeVideo, .homeJourney, .homeAccommodationSection, .callToAction, .siteFooter, .rd-chat'
    );
    const seen = new Set();
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const height = rect.height;
        const id = el.id || '';
        const cls = (el.className || '').toString().slice(0, 40);
        const heading = el.querySelector('h1, h2, h3, h4')?.innerText?.slice(0, 50) || '';
        
        // Filter out tiny or hidden elements
        if (height > 50 && !seen.has(top)) {
            seen.add(top);
            landmarks.push({
                tag: el.tagName.toLowerCase(),
                id,
                cls,
                top: Math.round(top),
                height: Math.round(height),
                heading
            });
        }
    });
    landmarks.sort((a, b) => a.top - b.top);
    return {
        totalHeight: document.body.scrollHeight,
        landmarks
    };
}""")

print(f"Total Page Height: {data['totalHeight']}px")
print(f"Key Landmarks ({len(data['landmarks'])}):")
for lm in data['landmarks']:
    print(f"Top {lm['top']:5d}px | H {lm['height']:5d}px | <{lm['tag']}> #{lm['id']} ({lm['cls']}) -> '{lm['heading']}'")

b.close()
p.stop()
