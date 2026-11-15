# Openbill Safaris Uganda

> **Tailor-Made Gorilla Trekking, Chimpanzee Tracking & Big Five Wildlife Safaris Across Uganda, Rwanda, Tanzania and Kenya.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Raine24/openbill-safaris-uganda)

---

## Overview

**Openbill Safaris Uganda SMC-LTD** is a fully licensed, indigenous East African safari tour operator headquartered in Entebbe, Uganda on the shores of Lake Victoria. This repository contains the complete responsive web platform, showcasing tailor-made wildlife itineraries, mountain gorilla permit booking, conservation eco-tourism guidelines, and interactive safari modals.

* **UTB Tour Operator License**: `UTB/RTT/TO/2026/102199`
* **Industry Memberships**: Association of Uganda Tour Operators (AUTO) & Uganda Wildlife Authority (UWA) Registered Operator
* **Conservation Partner**: OpenVision Foundation (501(c)(3) & Community Education Initiatives)

---

## Key Features

* **Tailor-Made Itinerary Engine**: 3-Day Bwindi Gorilla Treks, 3-Day Queen Elizabeth Wildlife Safaris, 10-Day Best of Uganda Expeditions, and cross-border Rwanda/Tanzania/Kenya extensions.
* **Interactive Safari Modals**: Direct modal popups for authentic About Us history, transparent Terms & Conditions, corporate Bank Wire & Card payment instructions, and Leave-No-Trace Eco-Tourism policies.
* **Multi-Device Responsive Experience**: Optimized for Desktop (MacBook Pro), Tablet (iPad Pro), and Mobile (iPhone 15/16 Pro with Dynamic Island).
* **High-Performance Video Hero**: Deferred background safari video loading with fallbacks and zero layout shift (CLS).
* **Vercel Ready**: Pre-configured with `vercel.json` for edge caching, clean URLs, and HTTP security headers.

---

## Directory Structure

```text
├── index.html                           # Main web platform entry point
├── vercel.json                          # Vercel deployment configuration
├── mockup_scene.html                    # 3D responsive device presentation stage
├── openbill-safaris-responsive-mockup.png # 2048x2048 master device mockup
├── openbill-safaris-responsive-mockup.jpg # Optimized presentation preview
├── css/                                 # Production stylesheet bundles
├── js/                                  # Interactive UI, sliders, and modal scripts
├── img/                                 # Brand assets, vectors, and iconography
├── media/                               # Gorilla hero photography and safari video
├── pages/                               # Extracted authentic knowledgebase files
└── site_index.csv                       # Content index and metadata
```

---

## Local Development

To run the site locally:

```bash
# Using Python built-in server
python -m http.server 8080

# Or using Node.js http-server
npx http-server -p 8080
```

Then visit `http://localhost:8080` in your web browser.

---

## Deployment on Vercel

1. Log in to [Vercel](https://vercel.com/).
2. Click **Add New...** → **Project**.
3. Import the `openbill-safaris-uganda` repository from your GitHub account.
4. Keep the Framework Preset as **Other** (Static Site).
5. Click **Deploy**. Vercel will build and assign your production URL within seconds.
