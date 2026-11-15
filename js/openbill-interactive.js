/**
 * Openbill Safaris Uganda — Red Dot Design System Interactive Engine
 * Powers:
 * 1. Local Search API (/search/results) for #siteSearch
 * 2. Local Travel Assistant API (/chat/*) for .rd-chat
 * 3. Local Newsletter Subscription (/newsletter/subscribe)
 * 4. Interactive Itinerary Detail & Free Quote Modal + Destination Filter + Favourites
 * 5. Graceful fallback if opened via file:// protocol
 */
(function () {
  'use strict';

  const CATALOG = [
    {
      id: 'ug-10d-best',
      title: '10 Days Best of Uganda Gorilla, Chimpanzee and Wildlife Safari Tour',
      destination: 'Uganda',
      category: 'Long Safaris · Primate & Big Five',
      duration: '9 nights / 10 days',
      price: 'From $3,450 per person',
      badge: 'Bestseller',
      type: 'Itinerary',
      url: '#itinerary-ug-10d-best',
      image: 'https://openbillsafarisuganda.com/wp-content/uploads/2025/03/3-Days-Gorilla-Trekking-Safari-in-Uganda-3.jpg',
      description: 'Our flagship circuit through Ziwa Rhino Sanctuary, Murchison Falls, Kibale Forest chimpanzee tracking, Queen Elizabeth Kazinga Channel, and Bwindi mountain gorillas.',
      route: ['Entebbe & Ziwa Rhinos', 'Murchison Falls NP (2N)', 'Kibale Forest Chimpanzees (2N)', 'Queen Elizabeth & Ishasha (2N)', 'Bwindi Impenetrable Forest (2N)', 'Lake Mburo & Equator (1N)'],
      highlights: [
        'One-hour face-to-face encounter with habituated mountain gorillas in Bwindi Impenetrable National Park',
        'Chimpanzee trekking in Kibale Forest — the primate capital of the world with 13 primate species',
        'Private boat cruise to the base of Murchison Falls & along the hippo-filled Kazinga Channel',
        'Search for tree-climbing lions in Ishasha and track white rhinos on foot at Ziwa Sanctuary'
      ]
    },
    {
      id: 'ug-3d-gorilla',
      title: '3 Days Gorilla Trekking Safari in Uganda',
      destination: 'Uganda',
      category: 'Short Safaris · Primate Trekking',
      duration: '2 nights / 3 days',
      price: 'From $1,490 per person (incl. permit)',
      badge: 'Most Popular',
      type: 'Itinerary',
      url: '#itinerary-ug-3d-gorilla',
      image: 'https://openbillsafarisuganda.com/wp-content/uploads/2025/03/fabio-gorilla-group.jpg',
      description: 'An focused, high-impact expedition via the Equator or Kigali into Bwindi Impenetrable National Park for a life-changing mountain gorilla encounter and Batwa cultural immersion.',
      route: ['Entebbe / Kigali Pickup & Equator Stop', 'Bwindi Impenetrable Forest (2N)', 'Gorilla Trekking & Batwa Cultural Trail', 'Return to Entebbe or Kigali'],
      highlights: [
        'Guaranteed Uganda Wildlife Authority (UWA) Mountain Gorilla Trekking Permit arranged by Openbill Safaris',
        'Expert UTB-licensed driver-guide in a private 4x4 safari Land Cruiser',
        'Optional Batwa forest heritage walk and canoe excursion on tranquil Lake Bunyonyi',
        'Direct contribution to local conservation & OpenVision Foundation community initiatives'
      ]
    },
    {
      id: 'ug-3d-murchison',
      title: '3 Days Murchison Falls National Park Safari',
      destination: 'Uganda',
      category: 'Short Safaris · Big Five & Nile',
      duration: '2 nights / 3 days',
      price: 'From $890 per person',
      badge: 'Classic Wildlife',
      type: 'Itinerary',
      url: '#itinerary-ug-3d-murchison',
      image: 'https://openbillsafarisuganda.com/wp-content/uploads/2022/07/3-Days-Murchison-Falls-National-Park-Safari-4.jpg',
      description: 'Witness the world’s most powerful waterfall where the Victoria Nile surges through a 7-metre gorge, paired with Rothschild giraffe, lion, elephant, and rhino tracking.',
      route: ['Kampala / Entebbe to Ziwa Rhino Sanctuary', 'Top of Murchison Falls Hike', 'Buligi Savannah Game Drives & Victoria Nile Boat Cruise', 'Return via Budongo Forest'],
      highlights: [
        'On-foot white rhino tracking with rangers at Ziwa Rhino Sanctuary',
        'Hike to the thunderous Top of Murchison Falls where the Nile plunges 43 metres',
        'Afternoon Victoria Nile launch cruise spotting Nile crocodiles, hippos, elephants, and shoebills',
        'Sunrise savannah game drive across the Buligi plains searching for lions, leopards, and Jackson’s hartebeest'
      ]
    },
    {
      id: 'ug-3d-queen',
      title: '3 Days Safari to Queen Elizabeth National Park',
      destination: 'Uganda',
      category: 'Short Safaris · Savannah & Kazinga',
      duration: '2 nights / 3 days',
      price: 'From $860 per person',
      badge: 'Bestseller',
      type: 'Itinerary',
      url: '#itinerary-ug-3d-queen',
      image: 'https://openbillsafarisuganda.com/wp-content/uploads/2025/03/6-Days-Uganda-Safari-Tour-to-Queen-Elizabeth-and-Murchison-Falls-National-Parks-5.jpg',
      description: 'Explore Uganda’s most biodiverse savannah park framed by the Rwenzori Mountains, featuring Kasenyi plains game drives, Kazinga Channel boat safari, and crater lakes.',
      route: ['Entebbe to Queen Elizabeth NP via Equator', 'Kasenyi Plains Game Drive & Kazinga Channel Boat Cruise', 'Kyambura Gorge Chimps / Katwe Salt Crater & Return'],
      highlights: [
        'Private afternoon boat cruise on the Kazinga Channel — home to Africa’s densest concentration of hippos',
        'Over 600 bird species recorded, making it a premier East African birding sanctuary',
        'Morning game drive across Kasenyi mating grounds for lions, Uganda kob, and buffalo herds',
        'Scenic photo stops at the Kayabwe Equator monument and Rubirizi Twin Crater Lakes'
      ]
    },
    {
      id: 'ug-5d-flyin-habituation',
      title: 'Sky to Jungle: 5-Day Luxury Gorilla Habituation Safari in Uganda',
      destination: 'Uganda',
      category: 'Luxury Fly-In · Gorilla Habituation',
      duration: '4 nights / 5 days',
      price: 'From $4,850 per person',
      badge: 'Luxury Fly-In',
      type: 'Itinerary',
      url: '#itinerary-ug-5d-flyin-habituation',
      image: 'https://openbillsafarisuganda.com/wp-content/uploads/2025/09/Fabio-and-clelia-luxury-safari-fort-portal-tea-plantations-e1784731188183-416x239.jpg',
      description: 'Fly directly from Entebbe to Kisoro/Kihihi in scheduled bush aircraft and spend four full hours alongside researchers and trackers on the Mountain Gorilla Habituation Experience.',
      route: ['Entebbe Boutique Hotel Welcome (1N)', 'Bush Flight to Southern Bwindi / Rushaga (3N)', 'Full 4-Hour Gorilla Habituation Experience', 'Private Forest Spa & Bush Flight to Entebbe'],
      highlights: [
        'Exclusive 4-hour Mountain Gorilla Habituation permit (limited to 4 guests per family group)',
        'Round-trip domestic bush flights skipping long overland transfers',
        'Hand-picked luxury forest sanctuary stays with private butler service and volcano views',
        'Private sundowners and conservation briefing with senior trackers'
      ]
    },
    {
      id: 'ug-rw-10d-cross',
      title: '10-Day Best of Rwanda & Uganda Cross-Border Safari Expedition',
      destination: 'Rwanda',
      category: 'Multi-Country · Primates & Big Five',
      duration: '9 nights / 10 days',
      price: 'From $4,290 per person',
      badge: 'Cross-Border',
      type: 'Itinerary',
      url: '#itinerary-ug-rw-10d-cross',
      image: 'https://openbillsafarisuganda.com/wp-content/uploads/2026/10/Gemini_Generated_Image_8xtkwy8xtkwy8xtk-768x419.jpg',
      description: 'Connect the Land of a Thousand Hills with the Pearl of Africa: Kigali, Nyungwe Canopy Walk, Lake Kivu, Volcanoes golden monkeys, Bwindi gorillas, and Queen Elizabeth NP.',
      route: ['Kigali & Nyungwe Forest NP (2N)', 'Lake Kivu & Volcanoes NP (2N)', 'Bwindi Impenetrable Forest Uganda (2N)', 'Queen Elizabeth NP (2N)', 'Entebbe Departure (1N)'],
      highlights: [
        'Seamless single East African Tourist Visa cross-border logistics handled end-to-end',
        'Chimpanzee trekking & suspended rainforest canopy walk in Nyungwe National Park',
        'Mountain gorilla trekking in Bwindi + golden monkey tracking in the Virunga Volcanoes',
        'Savannah game drives and Kazinga Channel launch cruise in Queen Elizabeth National Park'
      ]
    },
    {
      id: 'ug-5d-mgahinga',
      title: '5 Days 4 Nights Mgahinga Gorillas, Golden Monkeys & Lake Bunyonyi Safari',
      destination: 'Uganda',
      category: 'Short Safaris · Virunga & Lakes',
      duration: '4 nights / 5 days',
      price: 'From $2,150 per person',
      badge: 'Primate & Lake',
      type: 'Itinerary',
      url: '#itinerary-ug-5d-mgahinga',
      image: 'https://openbillsafarisuganda.com/wp-content/uploads/2025/03/3-Days-Gorilla-Trekking-Safari-in-Uganda-5.jpg',
      description: 'Track both endangered mountain gorillas and playful golden monkeys in the mist-shrouded Virunga volcanoes of Mgahinga, then unwind across the 29 islands of Lake Bunyonyi.',
      route: ['Entebbe / Kigali to Mgahinga Gorilla NP (2N)', 'Mountain Gorilla & Golden Monkey Tracking', 'Lake Bunyonyi Island Retreat (2N)', 'Return via Ankole Long-Horned Cattle Country'],
      highlights: [
        'Double primate encounter: Nyakagezi mountain gorilla group + bamboo forest golden monkeys',
        'Dugout canoe island hopping and birdwatching on bilharzia-free Lake Bunyonyi',
        'Dramatic views of Mount Muhabura, Mount Gahinga, and Mount Sabyinyo'
      ]
    },
    {
      id: 'ug-14d-ultimate',
      title: '14 Days Best of Uganda Wildlife, Chimpanzee and Gorilla Trekking Safari',
      destination: 'Uganda',
      category: 'Long Safaris · Grand Circuit',
      duration: '13 nights / 14 days',
      price: 'From $4,680 per person',
      badge: 'Grand Circuit',
      type: 'Itinerary',
      url: '#itinerary-ug-14d-ultimate',
      image: 'https://openbillsafarisuganda.com/wp-content/uploads/2025/03/9-Days-Best-of-Uganda-Wildlife-Safari-tour-10.jpg',
      description: 'The definitive two-week Pearl of Africa expedition covering Sipi Falls, Kidepo Valley, Murchison Falls, Kibale chimpanzees, Queen Elizabeth, Bwindi gorillas, and Lake Mburo.',
      route: ['Jinja Source of the Nile & Sipi Falls (2N)', 'Kidepo Valley & Murchison Falls (4N)', 'Kibale Forest & Queen Elizabeth NP (4N)', 'Bwindi Gorillas, Bunyonyi & Lake Mburo (3N)'],
      highlights: [
        'Visits all major Ugandan national parks plus Mabamba Swamp shoebill stork tracking',
        'Guided walking safari amongst zebras, elands, and impalas in Lake Mburo National Park',
        'Arabica coffee tour and triple-waterfall hike at Sipi Falls on the slopes of Mount Elgon'
      ]
    },
    {
      id: 'rw-4d-gorilla-kivu',
      title: '4 Days Rwanda Gorilla Trekking and Lake Kivu Luxury Escape',
      destination: 'Rwanda',
      category: 'Rwanda Safaris · Primate & Lake',
      duration: '3 nights / 4 days',
      price: 'From $2,890 per person',
      badge: 'Rwanda Classic',
      type: 'Itinerary',
      url: '#itinerary-rw-4d-gorilla-kivu',
      image: 'https://openbillsafarisuganda.com/wp-content/uploads/2025/03/4-Days-Rwanda-Gorilla-and-Lake-Kivu-Safari-2-636x306.jpg',
      description: 'Combine Kigali’s vibrant cultural heritage with mountain gorilla trekking in Volcanoes National Park, the Iby’Iwacu Cultural Village, and emerald shores of Lake Kivu.',
      route: ['Kigali City Tour & Transfer to Musanze (1N)', 'Volcanoes NP Gorilla Trekking & Iby’Iwacu (1N)', 'Lake Kivu Boat Cruise & Rubavu Relaxation (1N)', 'Return to Kigali'],
      highlights: [
        'Mountain gorilla trekking in the legendary Virunga massif made famous by Dian Fossey',
        'Private sunset boat excursion on Lake Kivu’s islands and coffee-washing stations',
        'Guided visit to the Kigali Genocide Memorial and Ellen DeGeneres Campus of the Dian Fossey Gorilla Fund'
      ]
    },
    {
      id: 'tz-10d-wildlife',
      title: '10 Days Best of Tanzania Wildlife, Serengeti Migration & Ngorongoro Safari',
      destination: 'Tanzania',
      category: 'Tanzania Safaris · Great Migration',
      duration: '9 nights / 10 days',
      price: 'From $3,980 per person',
      badge: 'Great Migration',
      type: 'Itinerary',
      url: '#itinerary-tz-10d-wildlife',
      image: 'https://openbillsafarisuganda.com/wp-content/uploads/2025/03/10-Days-Best-Of-Tanzania-Wildlife-Safari-Tour-7-306x306.jpg',
      description: 'Experience Tanzania’s legendary Northern Circuit: giant elephant herds beneath Tarangire baobabs, tree-climbing lions of Lake Manyara, endless Serengeti plains, and Ngorongoro Crater.',
      route: ['Arusha & Tarangire NP (2N)', 'Lake Manyara & Karatu Highlands (2N)', 'Central & Northern Serengeti NP (3N)', 'Ngorongoro Crater Rim & Floor Game Drive (2N)'],
      highlights: [
        'Full-day descent 600 metres into the Ngorongoro Crater — the world’s largest intact volcanic caldera',
        'Track the Great Wildebeest & Zebra Migration across the Serengeti ecosystems',
        'Authentic Maasai boma cultural visit and optional hot-air balloon safari at dawn'
      ]
    },
    {
      id: 'ke-10d-wildlife',
      title: '10 Days Best of Kenya Wildlife Safari — Maasai Mara, Amboseli & Nakuru',
      destination: 'Kenya',
      category: 'Kenya Safaris · Big Five Classic',
      duration: '9 nights / 10 days',
      price: 'From $3,650 per person',
      badge: 'Big Five',
      type: 'Itinerary',
      url: '#itinerary-ke-10d-wildlife',
      image: 'https://openbillsafarisuganda.com/wp-content/uploads/2022/07/GetPaidStock.com-67d03cbbc1b39-636x306.jpg',
      description: 'Iconic Kenyan savannah vistas from Amboseli’s red-tusked elephants beneath Mount Kilimanjaro to Lake Naivasha, Lake Nakuru rhinos, and the predator-rich Maasai Mara.',
      route: ['Nairobi & Amboseli NP (2N)', 'Lake Naivasha & Hell’s Gate (2N)', 'Lake Nakuru Rhino Sanctuary (2N)', 'Maasai Mara National Reserve (3N)'],
      highlights: [
        'Unrivalled Big Five predator sightings (lion, leopard, cheetah) across the Maasai Mara',
        'Postcard views of snow-capped Mount Kilimanjaro framing Amboseli elephant herds',
        'Walking & cycling safari in Hell’s Gate National Park and boat ride on Lake Naivasha'
      ]
    },
    {
      id: 'ea-20d-multi',
      title: '20 Days Kenya – Uganda – Rwanda Primates & Wildlife Grand Odyssey',
      destination: 'Multi-Country',
      category: 'Multi-Country · 3-Nation Odyssey',
      duration: '19 nights / 20 days',
      price: 'From $7,450 per person',
      badge: 'Epic Odyssey',
      type: 'Itinerary',
      url: '#itinerary-ea-20d-multi',
      image: 'https://openbillsafarisuganda.com/wp-content/uploads/2025/03/20-Days-Best-Uganda-safari-tour-8.jpg',
      description: 'The ultimate East African expedition uniting Kenya’s Maasai Mara & Amboseli with Uganda’s Murchison Falls, Kibale & Bwindi, and Rwanda’s Volcanoes & Lake Kivu.',
      route: ['Kenya: Amboseli, Nakuru & Maasai Mara (7N)', 'Uganda: Murchison, Kibale, Queen Elizabeth & Bwindi (9N)', 'Rwanda: Volcanoes NP, Lake Kivu & Kigali (3N)'],
      highlights: [
        'Combines the Great Migration savannahs of Kenya with rainforest primates of Uganda & Rwanda',
        'Dedicated private 4x4 safari vehicles and expert local guides in each country',
        'Includes Mabamba Shoebill tracking, Kazinga Channel cruise, and Bwindi gorilla permit'
      ]
    },
    {
      id: 'ug-1d-shoebill',
      title: '1-Day Uganda Shoebill Tracking Tour at Mabamba Bay Wetlands',
      destination: 'Uganda',
      category: 'Short Safaris · Birding & Nature',
      duration: 'Full Day Excursion',
      price: 'From $195 per person',
      badge: 'Rare Birding',
      type: 'Experience',
      url: '#itinerary-ug-1d-shoebill',
      image: 'https://openbillsafarisuganda.com/wp-content/uploads/2025/09/mt3-416x280.jpg',
      description: 'Glide by traditional wooden canoe through the papyrus channels of Mabamba Swamp on Lake Victoria — a Ramsar wetland and premier sanctuary of the prehistoric Shoebill Stork.',
      route: ['Early Morning Pickup in Entebbe / Kampala', 'Canoe Excursion in Mabamba Bay Wetlands', 'Optional Uganda Wildlife Conservation Education Centre Visit'],
      highlights: [
        'Guided by specialist local wetland birders with a 95%+ shoebill spotting success rate',
        'Spot malachite kingfishers, African jacanas, papyrus gonoleks, and blue-breasted bee-eaters'
      ]
    },
    {
      id: 'ug-1d-jinja',
      title: '1 Day White Water Rafting & Source of the Nile Adventure in Jinja',
      destination: 'Uganda',
      category: 'Short Safaris · Adventure',
      duration: 'Full Day Excursion',
      price: 'From $240 per person',
      badge: 'Adventure',
      type: 'Experience',
      url: '#itinerary-ug-1d-jinja',
      image: 'https://openbillsafarisuganda.com/wp-content/uploads/2025/03/IMG-20250313-WA0004-416x280.jpg',
      description: 'Conquer Grade 4 & 5 rapids on the Victoria Nile in Jinja, visit Ssezibwa Falls and Mabira Rainforest, and take a sunset boat cruise to the exact Source of the River Nile.',
      route: ['Kampala Pickup & Ssezibwa Falls', 'Mabira Forest Zip-lining / Walk', 'White Water Rafting or Tubing on the Nile', 'Source of the Nile Boat Cruise'],
      highlights: [
        'World-class safety kayak team and riverside buffet lunch included',
        'Optional quad biking, bungee jumping, or horseback riding along the Nile banks'
      ]
    },
    {
      id: 'ug-15d-honeymoon',
      title: '15 Days Best of Uganda Honeymoon & Romantic Luxury Safari',
      destination: 'Uganda',
      category: 'Long Safaris · Honeymoon & Luxury',
      duration: '14 nights / 15 days',
      price: 'From $5,490 per person',
      badge: 'Honeymoon',
      type: 'Itinerary',
      url: '#itinerary-ug-15d-honeymoon',
      image: 'https://openbillsafarisuganda.com/wp-content/uploads/2025/03/fabio-clelia-queen-eliz-416x280.jpg',
      description: 'Crafted for couples celebrating love: private bush dinners, crater lake infinity pools around Fort Portal, intimate Kazinga sundowners, Bwindi gorilla trekking, and Ssese Islands.',
      route: ['Entebbe Lakeside Romance (2N)', 'Murchison Nile River Lodge (3N)', 'Fort Portal Crater Lakes & Kibale (3N)', 'Queen Elizabeth & Ishasha Wilderness (3N)', 'Bwindi Sanctuary & Lake Bunyonyi (4N)'],
      highlights: [
        'Private bush breakfast, Equator champagne toast, and candlelit dinner overlooking the Nile',
        'Luxury cottages with private decks facing Bwindi Impenetrable Rainforest'
      ]
    },
    {
      id: 'charity-openvision',
      title: 'Travel for Charity — OpenVision Foundation Uganda Impact Journeys',
      destination: 'Uganda',
      category: 'Positive Impact · Philanthropy',
      duration: 'Custom Add-On or Dedicated Trip',
      price: '100% Community Direct Support',
      badge: 'Positive Impact',
      type: 'Positive Travel',
      url: '#itinerary-charity-openvision',
      image: 'https://openbillsafarisuganda.com/wp-content/uploads/2025/11/IMG_20250731_172523_0-416x280.jpg',
      description: 'Bridge wildlife tourism with tangible social impact. Visit and support community education, clean water, youth empowerment, and conservation projects led by OpenVision Foundation Uganda.',
      route: ['Entebbe & Kampala Community Schools', 'Bwindi Batwa & Conservation Livelihood Projects', 'Hands-On Volunteering or Philanthropic Sponsorship'],
      highlights: [
        'Every Openbill Safaris booking contributes directly to OpenVision Foundation Uganda',
        'Transparent, ethical community engagement designed in partnership with local leaders'
      ]
    }
  ];

  // Store catalog globally for quick access
  window.OPENBILL_CATALOG = CATALOG;

  // ---------------------------------------------------------------------------
  // 1. FETCH INTERCEPTOR FOR LOCAL SEARCH, CHAT & NEWSLETTER
  // ---------------------------------------------------------------------------
  const nativeFetch = window.fetch ? window.fetch.bind(window) : null;
  let chatSession = {
    reference: 'ob-safari-' + Math.random().toString(36).slice(2, 9),
    status: 'bot',
    typing: false,
    needs_bot: false,
    visitor_name: 'Guest',
    messages: []
  };

  function generateAssistantReply(userMsg) {
    const q = (userMsg || '').toLowerCase();
    if (q.includes('gorilla') || q.includes('permit') || q.includes('bwindi') || q.includes('mgahinga')) {
      return {
        body: 'Mountain gorilla trekking is our signature experience! In Uganda (Bwindi Impenetrable Forest & Mgahinga), UWA permits cost $800 per person for 1 hour with a habituated gorilla family, or $1,500 for the 4-hour Gorilla Habituation Experience. In Rwanda (Volcanoes NP), permits are $1,500. Openbill Safaris secures your permits directly with UWA/RDB as part of your tailor-made package. Would you like a 3-Day Bwindi express quote or a 10-Day Uganda Primates & Wildlife itinerary?',
        citations: [
          { title: '3 Days Gorilla Trekking Safari in Uganda', url: 'https://www.reddottours.com/#itinerary-ug-3d-gorilla' },
          { title: '10 Days Best of Uganda Gorilla, Chimpanzee & Wildlife', url: 'https://www.reddottours.com/#itinerary-ug-10d-best' }
        ]
      };
    }
    if (q.includes('price') || q.includes('cost') || q.includes('budget') || q.includes('quote')) {
      return {
        body: 'Our safaris are tailor-made to your comfort level (Budget, Mid-Range Boutique, or 5-Star Luxury). Short 3-day wildlife safaris to Murchison Falls or Queen Elizabeth start around $860–$890 per person, 3-day Gorilla Trekking starts around $1,490 (permit included), and our 10-day Best of Uganda circuit starts from $3,450 per person. You can click "Request A Free Quote" anytime or share your travel dates here!',
        citations: [
          { title: '3 Days Murchison Falls National Park Safari', url: 'https://www.reddottours.com/#itinerary-ug-3d-murchison' }
        ]
      };
    }
    if (q.includes('when') || q.includes('month') || q.includes('weather') || q.includes('season') || q.includes('best time')) {
      return {
        body: 'East Africa is a year-round destination! The two peak dry seasons — June to September and December to February — offer the firmest forest trails for gorilla & chimpanzee trekking in Uganda and Rwanda, plus exceptional savannah game viewing. March to May and October to November bring lush emerald scenery, migratory birds, and quieter parks.',
        citations: []
      };
    }
    if (q.includes('charity') || q.includes('openvision') || q.includes('community') || q.includes('donate')) {
      return {
        body: 'OpenVision Foundation Uganda is our philanthropic heart. A portion of every safari booked with Openbill Safaris funds community schooling, healthcare outreach, and conservation awareness around Uganda’s national parks. Guests can also visit or participate in community impact projects during their journey.',
        citations: []
      };
    }
    if (q.includes('contact') || q.includes('whatsapp') || q.includes('phone') || q.includes('email') || q.includes('emma')) {
      return {
        body: 'You can reach Makoha Emma and our Entebbe safari team directly via WhatsApp/Phone at +256 745 843863 or +256 708 975329, or by email at openbillsafarisuganda@gmail.com. We are fully licensed by the Uganda Tourism Board (UTB/RTT/TO/2026/102199).',
        citations: []
      };
    }
    return {
      body: 'Welcome to Openbill Safaris Uganda! Whether you are dreaming of mountain gorilla trekking in Bwindi, a boat cruise at Murchison Falls & Kazinga Channel, tracking the rare Shoebill Stork, or combining Uganda, Rwanda, Kenya & Tanzania, our Entebbe specialists craft every journey around you. Tell us which destinations or number of days you have in mind!',
      citations: [
        { title: '10 Days Best of Uganda Gorilla, Chimpanzee & Wildlife', url: 'https://www.reddottours.com/#itinerary-ug-10d-best' }
      ]
    };
  }

  window.fetch = async function (input, init) {
    const rawUrl = typeof input === 'string' ? input : (input && input.url ? input.url : '');
    let parsed;
    try {
      parsed = new URL(rawUrl, window.location.origin);
    } catch (_) {
      parsed = { pathname: rawUrl, searchParams: new URLSearchParams() };
    }

    // 1. Intercept Search Endpoint
    if (parsed.pathname && parsed.pathname.includes('/search/results')) {
      if (parsed.searchParams && parsed.searchParams.get('warm') === '1') {
        return new Response(JSON.stringify({ ready: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      const q = (parsed.searchParams ? parsed.searchParams.get('q') : '') || '';
      const cleanQ = q.trim().toLowerCase();
      const matches = CATALOG.filter(item => {
        return (
          item.title.toLowerCase().includes(cleanQ) ||
          item.destination.toLowerCase().includes(cleanQ) ||
          item.category.toLowerCase().includes(cleanQ) ||
          item.description.toLowerCase().includes(cleanQ) ||
          item.highlights.some(h => h.toLowerCase().includes(cleanQ))
        );
      }).map(item => ({
        title: item.title,
        url: window.location.origin + window.location.pathname + item.url,
        type: item.destination + ' · ' + item.type,
        description: item.duration + ' · ' + item.price + ' — ' + item.description
      }));

      return new Response(
        JSON.stringify({
          total: matches.length,
          has_more: false,
          partial: false,
          results: matches.slice(0, 20)
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Intercept Chat Widget Endpoints
    if (rawUrl.includes('/chat/')) {
      const bodyObj = init && init.body ? JSON.parse(init.body) : {};
      if (rawUrl.includes('/chat/state')) {
        return new Response(
          JSON.stringify({
            enabled: true,
            csrf_token: 'openbill-local-csrf-token',
            consultant_available: true,
            bot_enabled: true,
            conversation: chatSession.messages.length ? chatSession : null
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      if (rawUrl.includes('/chat/start')) {
        const visitorName = bodyObj.name || 'Traveller';
        chatSession.visitor_name = visitorName;
        chatSession.status = 'bot';
        chatSession.messages = [
          {
            id: 1,
            kind: 'bot',
            sender_name: 'Openbill Safari Specialist (Emma)',
            body: `Webale & welcome, ${visitorName}! Thank you for connecting with Openbill Safaris Uganda in Entebbe. How can we help plan your East African gorilla, chimpanzee, or wildlife safari today?`,
            created_at: new Date().toISOString(),
            citations: []
          }
        ];
        if (bodyObj.enquiry && bodyObj.enquiry.trim()) {
          chatSession.messages.push({
            id: 2,
            kind: 'visitor',
            sender_name: visitorName,
            body: bodyObj.enquiry.trim(),
            created_at: new Date().toISOString()
          });
          const reply = generateAssistantReply(bodyObj.enquiry);
          chatSession.messages.push({
            id: 3,
            kind: 'bot',
            sender_name: 'Openbill Safari Specialist (Emma)',
            body: reply.body,
            created_at: new Date().toISOString(),
            citations: []
          });
        }
        return new Response(
          JSON.stringify({
            enabled: true,
            csrf_token: 'openbill-local-csrf-token',
            consultant_available: true,
            bot_enabled: true,
            conversation: chatSession
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      if (rawUrl.includes('/chat/messages')) {
        const msgText = (bodyObj.message || '').trim();
        const nextId = chatSession.messages.length + 1;
        chatSession.messages.push({
          id: nextId,
          kind: 'visitor',
          sender_name: chatSession.visitor_name || 'You',
          body: msgText,
          created_at: new Date().toISOString()
        });
        chatSession.needs_bot = true;
        return new Response(
          JSON.stringify({
            enabled: true,
            csrf_token: 'openbill-local-csrf-token',
            consultant_available: true,
            bot_enabled: true,
            conversation: chatSession
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      if (rawUrl.includes('/chat/respond')) {
        const lastVisitorMsg = [...chatSession.messages].reverse().find(m => m.kind === 'visitor');
        const reply = generateAssistantReply(lastVisitorMsg ? lastVisitorMsg.body : '');
        chatSession.needs_bot = false;
        chatSession.messages.push({
          id: chatSession.messages.length + 1,
          kind: 'bot',
          sender_name: 'Openbill Safari Specialist (Emma)',
          body: reply.body,
          created_at: new Date().toISOString(),
          citations: []
        });
        return new Response(
          JSON.stringify({
            enabled: true,
            csrf_token: 'openbill-local-csrf-token',
            consultant_available: true,
            bot_enabled: true,
            conversation: chatSession
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      if (rawUrl.includes('/chat/consultant')) {
        chatSession.status = 'live';
        chatSession.messages.push({
          id: chatSession.messages.length + 1,
          kind: 'agent',
          sender_name: 'Makoha Emma · Senior Safari Planner',
          body: 'I have been notified of your chat! We will also follow up via email/WhatsApp (+256 745 843863) with a tailored route & permit availability check.',
          created_at: new Date().toISOString()
        });
        return new Response(
          JSON.stringify({
            enabled: true,
            csrf_token: 'openbill-local-csrf-token',
            consultant_available: true,
            bot_enabled: true,
            conversation: chatSession
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      if (rawUrl.includes('/chat/close')) {
        chatSession.status = 'closed';
        return new Response(
          JSON.stringify({
            enabled: true,
            csrf_token: 'openbill-local-csrf-token',
            consultant_available: true,
            bot_enabled: true,
            conversation: chatSession
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      if (rawUrl.includes('/chat/typing')) {
        return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
    }

    // 3. Intercept Newsletter Subscription
    if (rawUrl.includes('/newsletter/subscribe')) {
      return new Response(
        JSON.stringify({
          message: 'Webale nyo! Thank you for subscribing to Openbill Safaris Uganda field dispatches & conservation updates.'
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (nativeFetch) {
      return nativeFetch(input, init);
    }
    return Promise.reject(new Error('Fetch unavailable'));
  };

  // ---------------------------------------------------------------------------
  // 2. INTERACTIVE SAFARI ITINERARY & FREE QUOTE MODAL + FAVOURITES WISHLIST
  // ---------------------------------------------------------------------------
  const FAV_KEY = 'openbill_favourite_safaris_v1';
  function getFavourites() {
    try {
      return JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
    } catch (_) {
      return [];
    }
  }
  function saveFavourites(list) {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(list));
    } catch (_) {}
    updateFavouriteBadges();
  }
  function toggleFavourite(id) {
    const list = getFavourites();
    const idx = list.indexOf(id);
    if (idx > -1) list.splice(idx, 1);
    else list.push(id);
    saveFavourites(list);
    return list.includes(id);
  }
  function updateFavouriteBadges() {
    const count = getFavourites().length;
    document.querySelectorAll('[data-fav-count]').forEach(el => {
      el.textContent = count > 0 ? String(count) : '';
      el.hidden = count === 0;
    });
    document.querySelectorAll('[data-fav-btn]').forEach(btn => {
      const id = btn.getAttribute('data-fav-btn');
      const active = getFavourites().includes(id);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      btn.classList.toggle('is-Saved', active);
      const label = btn.querySelector('[data-fav-label]');
      if (label) label.textContent = active ? 'Saved to Trip Wishlist' : 'Save to Wishlist';
    });
  }

  function openSafariModal(mode, itemId) {
  window.openSafariModal = openSafariModal;
    const dialog = document.getElementById('openbillSafariModal');
    if (!dialog) return;
    const item = CATALOG.find(x => x.id === itemId) || CATALOG[0];
    const bodyEl = dialog.querySelector('[data-ob-modal-body]');
    const titleEl = dialog.querySelector('[data-ob-modal-title]');
    const eyebrowEl = dialog.querySelector('[data-ob-modal-eyebrow]');

    if (mode === 'favourites') {
      const favIds = getFavourites();
      const favItems = CATALOG.filter(x => favIds.includes(x.id));
      eyebrowEl.textContent = 'Your Curated Safari Shortlist';
      titleEl.innerHTML = 'Saved <i>Safari</i> Ideas';
      if (!favItems.length) {
        bodyEl.innerHTML = `
          <div class="obModal__empty">
            <p class="obModal__lead">You haven’t saved any safari packages to your shortlist yet. Explore our signature Uganda, Rwanda, Kenya & Tanzania itineraries and click "Save to Wishlist" on any journey that inspires you.</p>
            <div style="margin-top: 1.5rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <button type="button" class="btn btn--fill" data-ob-switch-quote="ug-10d-best"><span class="btn__label">Plan a Tailor-Made Safari</span></button>
              <button type="button" class="btn" data-ob-close-scroll="#curated-itineraries"><span class="btn__label">Browse Featured Packages</span></button>
            </div>
          </div>
        `;
      } else {
        bodyEl.innerHTML = `
          <p class="obModal__lead">You have ${favItems.length} saved safari${favItems.length > 1 ? 's' : ''} ready to customize with our Entebbe specialists.</p>
          <div class="obModal__favGrid">
            ${favItems.map(f => `
              <div class="obModal__favCard">
                <img src="${f.image}" alt="${f.title}" loading="lazy" />
                <div class="obModal__favCardBody">
                  <span class="obModal__tag">${f.destination} · ${f.duration}</span>
                  <h4>${f.title}</h4>
                  <p>${f.price}</p>
                  <div class="obModal__favActions">
                    <button type="button" class="btn btn--fill" data-ob-open-itinerary="${f.id}"><span class="btn__label">View Route & Enquire</span></button>
                    <button type="button" class="obModal__removeBtn" data-ob-remove-fav="${f.id}">Remove</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }
    } else if (mode === 'about') {
      eyebrowEl.textContent = 'Entebbe, Uganda • Established Eco-Tour Operator';
      titleEl.innerHTML = 'About <i>Openbill Safaris</i> Uganda';
      bodyEl.innerHTML = `
        <div class="obModal__lead" style="font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem; color: #3c342d;">
          <p><strong>Openbill Safaris Uganda SMC-LTD</strong> is an indigenous luxury and mid-range eco-tour company headquartered in Entebbe on the shores of Lake Victoria. Founded by native Ugandan naturalists and seasoned wilderness directors, we craft 100% tailor-made private safaris across Uganda, Rwanda, Tanzania, and Kenya.</p>
        </div>

        <div style="margin-bottom: 2rem;">
          <h4 style="font-family: var(--token-font-serif); font-size: 1.25rem; margin-bottom: 0.5rem; color: #2c2623;">The African Openbill Stork — Our Heritage</h4>
          <p style="line-height: 1.6; margin-bottom: 1rem; color: #5c5448;">Our name is inspired by the African Openbill Stork (<em>Anastomus lamelligerus</em>), an iconic wading bird native to Uganda's waterways and marshes. With its unique gap between upper and lower mandibles, the stork is nature's master at extracting freshwater mussels with gentle precision. In that same spirit, we bring the patience, specialized insight, and local tracking heritage required to unlock the most intimate and unforgettable encounters in the African wild.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
          <div style="background: rgba(44, 38, 35, 0.04); padding: 1.25rem; border-radius: 12px; border: 1px solid rgba(44,38,35,0.08);">
            <h5 style="font-weight: 600; margin-bottom: 0.35rem; color: #2c2623;">Native Born & Certified Guides</h5>
            <p style="font-size: 0.9rem; line-height: 1.5; color: #6b6357; margin: 0;">Our driver-guides are lifelong Ugandan naturalists accredited by the Uganda Wildlife Authority (UWA) and USAGA, fluent in wildlife behavior, ornithology, and local culture.</p>
          </div>
          <div style="background: rgba(44, 38, 35, 0.04); padding: 1.25rem; border-radius: 12px; border: 1px solid rgba(44,38,35,0.08);">
            <h5 style="font-weight: 600; margin-bottom: 0.35rem; color: #2c2623;">Custom 4x4 Expedition Fleet</h5>
            <p style="font-size: 0.9rem; line-height: 1.5; color: #6b6357; margin: 0;">Maintained to strict mechanical standards: customized long-wheelbase Toyota Land Cruisers with pop-up photography roofs, high-lift suspension, onboard charging ports, and coolers.</p>
          </div>
          <div style="background: rgba(44, 38, 35, 0.04); padding: 1.25rem; border-radius: 12px; border: 1px solid rgba(44,38,35,0.08);">
            <h5 style="font-weight: 600; margin-bottom: 0.35rem; color: #2c2623;">Direct UWA Permit Licensing</h5>
            <p style="font-size: 0.9rem; line-height: 1.5; color: #6b6357; margin: 0;">As a licensed UTB tour operator (UTB/RTT/TO/2026/102199), we handle guaranteed permit allocations directly with the Uganda Wildlife Authority and Rwanda Development Board.</p>
          </div>
          <div style="background: rgba(44, 38, 35, 0.04); padding: 1.25rem; border-radius: 12px; border: 1px solid rgba(44,38,35,0.08);">
            <h5 style="font-weight: 600; margin-bottom: 0.35rem; color: #2c2623;">OpenVision Foundation Uganda</h5>
            <p style="font-size: 0.9rem; line-height: 1.5; color: #6b6357; margin: 0;">Every booking supports our registered charitable initiative, funding school fees, healthcare clinics, clean water boreholes, and ranger family welfare in national park buffer zones.</p>
          </div>
        </div>

        <div style="border-top: 1px solid rgba(44, 38, 35, 0.1); padding-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap;">
          <button type="button" class="btn btn--fill" data-ob-switch-quote="ug-10d-best">
            <span class="btn__label">Request a Tailor-Made Safari</span>
          </button>
          <a class="btn" href="https://wa.me/256745843863?text=Hello%20Openbill%20Safaris%20Uganda!%20I%20would%20like%20to%20know%20more%20about%20your%20safaris" target="_blank" rel="noopener noreferrer">
            <span class="btn__label">WhatsApp Entebbe Office (+256 745 843863)</span>
          </a>
        </div>
      `;
    } else if (mode === 'terms') {
      eyebrowEl.textContent = 'Legal & Booking Agreement • Effective 2025';
      titleEl.innerHTML = 'Terms & <i>Conditions</i>';
      bodyEl.innerHTML = `
        <div style="font-size: 0.95rem; line-height: 1.6; color: #4a4239; max-height: 65vh; overflow-y: auto; padding-right: 0.75rem;">
          <div style="padding-bottom: 1rem; border-bottom: 1px solid rgba(44,38,35,0.1); margin-bottom: 1.25rem;">
            <p style="margin: 0; font-weight: 500;"><strong>Openbill Safaris Uganda SMC-LTD</strong> — Registered Tour Operator</p>
            <p style="margin: 0; font-size: 0.85rem; color: #7a7269;">Uganda Tourism Board License: UTB/RTT/TO/2026/102199 • Entebbe, Uganda</p>
          </div>

          <h4 style="font-family: var(--token-font-serif); font-size: 1.15rem; color: #2c2623; margin-top: 1.25rem; margin-bottom: 0.5rem;">1. Booking, Deposit & Payment Schedule</h4>
          <ul style="padding-left: 1.25rem; margin-bottom: 1rem;">
            <li><strong>50% Deposit:</strong> Required upon written confirmation to secure lodge reservations, vehicle fleet allocation, and private driver-guide schedules.</li>
            <li><strong>50% Balance:</strong> Must be settled in full no later than thirty (30) days prior to the safari departure date.</li>
            <li><strong>Late Bookings:</strong> Any booking confirmed within 30 days of scheduled departure must be paid in full immediately.</li>
            <li><strong>Gorilla & Chimpanzee Trekking Permits:</strong> By statutory law of the Uganda Wildlife Authority (UWA) and Rwanda Development Board (RDB), primate tracking permits must be paid 100% upfront at the time of booking. Primate permits are strictly non-refundable and non-transferable once issued.</li>
          </ul>

          <h4 style="font-family: var(--token-font-serif); font-size: 1.15rem; color: #2c2623; margin-top: 1.25rem; margin-bottom: 0.5rem;">2. Cancellation & Refund Policy</h4>
          <p style="margin-bottom: 0.75rem;">Cancellation requests must be communicated in writing to <code>openbillsafarisuganda@gmail.com</code>. The applicable cancellation charges are determined by the date written notice is received:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.25rem; font-size: 0.88rem; text-align: left;">
            <thead>
              <tr style="border-bottom: 2px solid #2c2623; color: #2c2623;">
                <th style="padding: 6px 8px;">Notice Period Before Departure</th>
                <th style="padding: 6px 8px;">Cancellation Fee (% Total Safari Cost)</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid rgba(44,38,35,0.1);">
                <td style="padding: 6px 8px;">60 days or more</td>
                <td style="padding: 6px 8px;">Full Refund (less non-refundable UWA/RDB permits)</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(44,38,35,0.1);">
                <td style="padding: 6px 8px;">45 to 59 days</td>
                <td style="padding: 6px 8px;">30% of total package cost</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(44,38,35,0.1);">
                <td style="padding: 6px 8px;">30 to 44 days</td>
                <td style="padding: 6px 8px;">50% of total package cost</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(44,38,35,0.1);">
                <td style="padding: 6px 8px;">15 to 29 days</td>
                <td style="padding: 6px 8px;">75% of total package cost</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(44,38,35,0.1);">
                <td style="padding: 6px 8px;">Less than 15 days / No-Show</td>
                <td style="padding: 6px 8px;">100% of total package cost (No refund)</td>
              </tr>
            </tbody>
          </table>

          <h4 style="font-family: var(--token-font-serif); font-size: 1.15rem; color: #2c2623; margin-top: 1.25rem; margin-bottom: 0.5rem;">3. Force Majeure & Free Rescheduling</h4>
          <p style="margin-bottom: 1rem;">If uncontrollable global events, international flight suspensions, border closures, or declared natural catastrophes prevent travel, Openbill Safaris Uganda guarantees the option to reschedule your safari within twelve (12) months at no administrative penalty, subject to third-party lodge seasonality and UWA permit rollover policies.</p>

          <h4 style="font-family: var(--token-font-serif); font-size: 1.15rem; color: #2c2623; margin-top: 1.25rem; margin-bottom: 0.5rem;">4. Health, Visas & Mandatory Travel Insurance</h4>
          <ul style="padding-left: 1.25rem; margin-bottom: 1rem;">
            <li>Clients must possess a valid passport (minimum 6 months validity) and obtain appropriate entry visas (such as the East Africa Tourist Visa) prior to arrival.</li>
            <li>Yellow Fever vaccination certificate is mandatory for border entry into Uganda.</li>
            <li>All clients are required to maintain comprehensive international travel insurance covering emergency medical treatment, airborne evacuation (e.g., AMREF Flying Doctors), luggage loss, and trip cancellation.</li>
          </ul>

          <h4 style="font-family: var(--token-font-serif); font-size: 1.15rem; color: #2c2623; margin-top: 1.25rem; margin-bottom: 0.5rem;">5. Governing Jurisdiction</h4>
          <p style="margin-bottom: 1.5rem;">All contracts and operations are governed exclusively by the Laws of the Republic of Uganda under the regulatory jurisdiction of the Uganda Tourism Board.</p>
        </div>
      `;
    } else if (mode === 'payments') {
      eyebrowEl.textContent = 'Financial Integrity & Payment Channels';
      titleEl.innerHTML = 'Payment <i>Methods</i> & Guidelines';
      bodyEl.innerHTML = `
        <div style="font-size: 0.95rem; line-height: 1.6; color: #4a4239; max-height: 65vh; overflow-y: auto; padding-right: 0.75rem;">
          <p class="obModal__lead" style="margin-bottom: 1.25rem;">We offer secure, transparent, and direct payment channels for all international travelers. All payments are acknowledged immediately with formal company receipts.</p>

          <div style="display: flex; flex-direction: column; gap: 1.25rem; margin-bottom: 1.5rem;">
            <div style="border: 1px solid rgba(44,38,35,0.12); border-radius: 10px; padding: 1.25rem; background: rgba(44,38,35,0.02);">
              <h4 style="font-family: var(--token-font-serif); font-size: 1.15rem; color: #2c2623; margin-bottom: 0.4rem;">1. Corporate Bank Wire Transfer (USD / EUR)</h4>
              <p style="margin-bottom: 0.5rem; font-size: 0.9rem;">Direct telegraphic wire to our official corporate business bank account in Entebbe, Uganda. Official bank details and SWIFT/BIC codes are provided exclusively on formal company invoices bearing our official seal and registration.</p>
              <p style="margin: 0; font-size: 0.85rem; color: #7a7269;"><em>Note: Intermediary bank wire transfer charges are the responsibility of the remitter.</em></p>
            </div>

            <div style="border: 1px solid rgba(44,38,35,0.12); border-radius: 10px; padding: 1.25rem; background: rgba(44,38,35,0.02);">
              <h4 style="font-family: var(--token-font-serif); font-size: 1.15rem; color: #2c2623; margin-bottom: 0.4rem;">2. Secure Online Credit / Debit Card (256-bit SSL)</h4>
              <p style="margin-bottom: 0.5rem; font-size: 0.9rem;">We accept Visa, MasterCard, and American Express via our encrypted gateway. A direct payment link corresponding to your verified invoice number will be issued by our reservations desk.</p>
              <p style="margin: 0; font-size: 0.85rem; color: #7a7269;"><em>Standard card processing fees (typically 3.5%) are handled transparently during checkout.</em></p>
            </div>

            <div style="border: 1px solid rgba(44,38,35,0.12); border-radius: 10px; padding: 1.25rem; background: rgba(44,38,35,0.02);">
              <h4 style="font-family: var(--token-font-serif); font-size: 1.15rem; color: #2c2623; margin-bottom: 0.4rem;">3. Cash on Arrival (By Written Authorization)</h4>
              <p style="margin-bottom: 0.5rem; font-size: 0.9rem;">Balance payments may be settled in cash upon arrival at our Entebbe office or directly with your lead safari director when explicitly authorized in writing by the Managing Director.</p>
              <p style="margin: 0; font-size: 0.85rem; color: #7a7269;"><strong>Bank of Uganda Rule:</strong> US Dollar banknotes must be printed in the year 2009 or newer, and must be uncreased, without tears or ink stamps.</p>
            </div>
          </div>

          <div style="border-top: 1px solid rgba(44, 38, 35, 0.1); padding-top: 1.25rem; display: flex; gap: 1rem; flex-wrap: wrap;">
            <a class="btn btn--fill" href="tel:+256708975329">
              <span class="btn__label">Call Entebbe Finance Desk (+256 708 975329)</span>
            </a>
            <a class="btn" href="https://wa.me/256745843863?text=Hello%20Openbill%20Safaris%20Finance,%20I%20have%20a%20payment%20inquiry" target="_blank" rel="noopener noreferrer">
              <span class="btn__label">WhatsApp Finance Support</span>
            </a>
          </div>
        </div>
      `;
    } else if (mode === 'ecotourism') {
      eyebrowEl.textContent = 'Conservation & Primate Viewing Ethics';
      titleEl.innerHTML = 'Sustainable <i>Eco-Tourism</i> Charter';
      bodyEl.innerHTML = `
        <div style="font-size: 0.95rem; line-height: 1.6; color: #4a4239; max-height: 65vh; overflow-y: auto; padding-right: 0.75rem;">
          <p class="obModal__lead" style="margin-bottom: 1.25rem;">At Openbill Safaris Uganda, wildlife conservation and community benefit are the core pillars of our existence. We strictly follow the Uganda Wildlife Authority (UWA) wildlife codes.</p>

          <h4 style="font-family: var(--token-font-serif); font-size: 1.15rem; color: #2c2623; margin-bottom: 0.4rem;">Primate Trekking Code of Conduct</h4>
          <ul style="padding-left: 1.25rem; margin-bottom: 1.25rem;">
            <li><strong>7 to 10-Meter Distance:</strong> Travelers must maintain a strict distance of at least 7 to 10 meters from mountain gorillas and chimpanzees at all times.</li>
            <li><strong>Protective Face Masks:</strong> Clean medical masks must be worn during primate observation to eliminate airborne viral transmission to endangered primates.</li>
            <li><strong>Strict 60-Minute Observation:</strong> Time spent with any habituated gorilla family is strictly capped at one (1) hour to prevent animal stress.</li>
            <li><strong>No Flash Photography:</strong> Flash camera settings are strictly prohibited as they frighten wildlife.</li>
          </ul>

          <h4 style="font-family: var(--token-font-serif); font-size: 1.15rem; color: #2c2623; margin-bottom: 0.4rem;">Wilderness Stewardship & Fair Wages</h4>
          <p style="margin-bottom: 1rem;">We maintain a zero single-use plastic policy inside our 4x4 vehicles, provide stainless-steel water refills, and contract exclusively with eco-certified safari lodges. All our driver-guides, local trackers, and porters receive ethical living wages above national industry averages.</p>
        </div>
      `;
    } else if (mode === 'quote') {
      const preselected = itemId ? (CATALOG.find(x => x.id === itemId)?.title || itemId) : 'Tailor-Made East Africa Safari';
      eyebrowEl.textContent = 'Every Openbill Safari starts with a blank page';
      titleEl.innerHTML = 'Request a <i>Free</i> Safari Quote';
      bodyEl.innerHTML = `
        <p class="obModal__lead">Speak directly with Makoha Emma and our Uganda Tourism Board licensed team (UTB/RTT/TO/2026/102199). Tell us what you love and we will craft a bespoke route, check UWA gorilla permit availability, and send a transparent quote within 24 hours.</p>
        <form id="obQuoteForm" class="obModal__form">
          <div class="obModal__formGrid">
            <div class="obModal__field">
              <label for="obQuoteName">Your Full Name <span>*</span></label>
              <input id="obQuoteName" name="name" type="text" required placeholder="e.g. Dr. Clara Vance" />
            </div>
            <div class="obModal__field">
              <label for="obQuoteEmail">Email Address <span>*</span></label>
              <input id="obQuoteEmail" name="email" type="email" required placeholder="you@example.com" />
            </div>
            <div class="obModal__field">
              <label for="obQuotePhone">WhatsApp / Telephone (with country code) <span>*</span></label>
              <input id="obQuotePhone" name="phone" type="tel" required placeholder="+44 7700 900123" />
            </div>
            <div class="obModal__field">
              <label for="obQuoteDest">Primary Destination(s)</label>
              <select id="obQuoteDest" name="destination">
                <option value="Uganda (Gorillas, Chimps & Savannah)">Uganda (Gorillas, Chimps & Savannah)</option>
                <option value="Uganda & Rwanda Cross-Border">Uganda & Rwanda Cross-Border</option>
                <option value="Rwanda (Volcanoes, Nyungwe & Akagera)">Rwanda (Volcanoes, Nyungwe & Akagera)</option>
                <option value="Kenya & Uganda Combined">Kenya & Uganda Combined</option>
                <option value="Tanzania (Serengeti & Ngorongoro)">Tanzania (Serengeti & Ngorongoro)</option>
                <option value="East Africa Grand Circuit (UG/RW/KE/TZ)">East Africa Grand Circuit (UG/RW/KE/TZ)</option>
              </select>
            </div>
            <div class="obModal__field">
              <label for="obQuotePackage">Inspired By Package / Safari Style</label>
              <input id="obQuotePackage" name="package" type="text" value="${preselected.replace(/"/g, '&quot;')}" />
            </div>
            <div class="obModal__field">
              <label for="obQuoteTier">Preferred Comfort & Accommodation Tier</label>
              <select id="obQuoteTier" name="tier">
                <option value="Hand-Picked Boutique & Eco-Luxury">Hand-Picked Boutique & Eco-Luxury</option>
                <option value="5-Star Exclusive Fly-In Luxury">5-Star Exclusive Fly-In Luxury</option>
                <option value="Mid-Range Classic Safari Lodges">Mid-Range Classic Safari Lodges</option>
                <option value="Adventure & Smart Value">Adventure & Smart Value</option>
              </select>
            </div>
          </div>
          <div class="obModal__field" style="margin-top: 1rem;">
            <label for="obQuoteNotes">Tell Us About Your Dream Trip (Dates, Travellers, Interests)</label>
            <textarea id="obQuoteNotes" name="notes" rows="3" placeholder="Number of travellers, preferred travel month, gorilla/chimpanzee permits needed, or OpenVision Foundation charity visit…"></textarea>
          </div>
          <div class="obModal__formFooter">
            <button type="submit" class="btn btn--fill">
              <span class="btn__label">Send Free Quote Request</span>
            </button>
            <a class="btn" href="https://wa.me/256745843863?text=${encodeURIComponent('Hello Openbill Safaris Uganda! I would like to enquire about: ' + preselected)}" target="_blank" rel="noopener noreferrer">
              <span class="btn__label">Chat on WhatsApp (+256 745 843863)</span>
            </a>
          </div>
          <p id="obQuoteStatus" class="obModal__status" role="status" aria-live="polite" hidden></p>
        </form>
      `;
      const form = bodyEl.querySelector('#obQuoteForm');
      form?.addEventListener('submit', e => {
        e.preventDefault();
        if (!form.reportValidity()) return;
        const status = bodyEl.querySelector('#obQuoteStatus');
        const nameVal = form.elements.namedItem('name').value;
        status.hidden = false;
        status.textContent = `Webale nyo, ${nameVal}! Your tailor-made safari enquiry has been logged for our Entebbe specialists (openbillsafarisuganda@gmail.com · +256 745 843863). We will reply within 24 hours with a custom itinerary & UWA permit check.`;
        form.reset();
      });
    } else {
      // Itinerary detail view
      const isFav = getFavourites().includes(item.id);
      eyebrowEl.textContent = `${item.destination} · ${item.category}`;
      titleEl.textContent = item.title;
      bodyEl.innerHTML = `
        <div class="obModal__hero">
          <img src="${item.image}" alt="${item.title}" />
          <div class="obModal__heroMeta">
            <span class="obModal__pill">${item.badge}</span>
            <span class="obModal__pill">${item.duration}</span>
            <span class="obModal__pill obModal__pill--strong">${item.price}</span>
          </div>
        </div>
        <p class="obModal__lead">${item.description}</p>
        <div class="obModal__columns">
          <div>
            <h4 class="obModal__subhead">Sample Route & Stops</h4>
            <ol class="obModal__routeList">
              ${item.route.map(step => `<li>${step}</li>`).join('')}
            </ol>
          </div>
          <div>
            <h4 class="obModal__subhead">Signature Highlights & Inclusions</h4>
            <ul class="obModal__highlightList">
              ${item.highlights.map(h => `<li>${h}</li>`).join('')}
            </ul>
          </div>
        </div>
        <div class="obModal__actionsBar">
          <button type="button" class="btn btn--fill" data-ob-switch-quote="${item.id}">
            <span class="btn__label">Tailor This Safari / Get Free Quote</span>
          </button>
          <button type="button" class="btn" data-fav-btn="${item.id}" aria-pressed="${isFav ? 'true' : 'false'}">
            <span class="btn__label" data-fav-label>${isFav ? 'Saved to Trip Wishlist' : 'Save to Wishlist'}</span>
          </button>
          <a class="btn" href="https://wa.me/256745843863?text=${encodeURIComponent('Hello Openbill Safaris! I am interested in the ' + item.title)}" target="_blank" rel="noopener noreferrer">
            <span class="btn__label">WhatsApp Specialist</span>
          </a>
        </div>
      `;
    }

    if (!dialog.open) {
      dialog.showModal();
    }
  }

  function initInteractiveHandlers() {
    // Wire up modal close & delegation
    const dialog = document.getElementById('openbillSafariModal');
    if (dialog) {
      dialog.addEventListener('click', e => {
        if (e.target === dialog || e.target.closest('[data-ob-modal-close]')) {
          dialog.close();
          return;
        }
        const quoteTrigger = e.target.closest('[data-ob-switch-quote]');
        if (quoteTrigger) {
          openSafariModal('quote', quoteTrigger.getAttribute('data-ob-switch-quote'));
          return;
        }
        const itinTrigger = e.target.closest('[data-ob-open-itinerary]');
        if (itinTrigger) {
          openSafariModal('itinerary', itinTrigger.getAttribute('data-ob-open-itinerary'));
          return;
        }
        const removeFav = e.target.closest('[data-ob-remove-fav]');
        if (removeFav) {
          toggleFavourite(removeFav.getAttribute('data-ob-remove-fav'));
          openSafariModal('favourites');
          return;
        }
        const favBtn = e.target.closest('[data-fav-btn]');
        if (favBtn) {
          toggleFavourite(favBtn.getAttribute('data-fav-btn'));
          return;
        }
        const closeScroll = e.target.closest('[data-ob-close-scroll]');
        if (closeScroll) {
          const targetSel = closeScroll.getAttribute('data-ob-close-scroll');
          dialog.close();
          document.querySelector(targetSel)?.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Intercept clicks on #itinerary-... or #plan-your-trip or #favourite links across the page
    document.addEventListener('click', e => {
      const favToggle = e.target.closest('[data-card-fav]');
      if (favToggle) {
        e.preventDefault();
        e.stopPropagation();
        toggleFavourite(favToggle.getAttribute('data-card-fav'));
        return;
      }

      const link = e.target.closest('a[href], button[data-safari-action]');
      if (!link) return;

      const action = link.getAttribute('data-safari-action');
      if (action === 'quote') {
        e.preventDefault();
        openSafariModal('quote', link.getAttribute('data-safari-id') || '');
        return;
      }
      if (action === 'favourites') {
        e.preventDefault();
        openSafariModal('favourites');
        return;
      }
      if (action === 'itinerary') {
        e.preventDefault();
        openSafariModal('itinerary', link.getAttribute('data-safari-id') || 'ug-10d-best');
        return;
      }
      if (action === 'about') {
        e.preventDefault();
        openSafariModal('about');
        return;
      }
      if (action === 'terms') {
        e.preventDefault();
        openSafariModal('terms');
        return;
      }
      if (action === 'payments') {
        e.preventDefault();
        openSafariModal('payments');
        return;
      }
      if (action === 'ecotourism') {
        e.preventDefault();
        openSafariModal('ecotourism');
        return;
      }

      const href = link.getAttribute('href') || '';
      if (href.includes('#terms-and-conditions') || href.includes('terms-and-conditions')) {
        e.preventDefault();
        document.body.classList.remove('siteSearch--is-open', 'navMenu--is-open', 'siteHeaderDropdown--is-open');
        openSafariModal('terms');
        return;
      }
      if (href.includes('#payments') || href.includes('payments')) {
        e.preventDefault();
        document.body.classList.remove('siteSearch--is-open', 'navMenu--is-open', 'siteHeaderDropdown--is-open');
        openSafariModal('payments');
        return;
      }
      if (href.includes('#eco-tourism') || href.includes('eco-tourism')) {
        e.preventDefault();
        document.body.classList.remove('siteSearch--is-open', 'navMenu--is-open', 'siteHeaderDropdown--is-open');
        openSafariModal('ecotourism');
        return;
      }
      if (href.includes('#about-story') || href.includes('#about-us') || href.includes('about-us')) {
        e.preventDefault();
        document.body.classList.remove('siteSearch--is-open', 'navMenu--is-open', 'siteHeaderDropdown--is-open');
        openSafariModal('about');
        return;
      }
      if (href.includes('#itinerary-')) {
        e.preventDefault();
        const id = href.split('#itinerary-')[1];
        document.body.classList.remove('siteSearch--is-open', 'navMenu--is-open', 'siteHeaderDropdown--is-open');
        openSafariModal('itinerary', id);
        return;
      }
      if (href === '#plan-your-trip' || href === '/plan-your-trip') {
        e.preventDefault();
        document.body.classList.remove('navMenu--is-open', 'siteHeaderDropdown--is-open');
        openSafariModal('quote', link.getAttribute('data-safari-id') || '');
        return;
      }
      if (href.includes('#favourite')) {
        e.preventDefault();
        document.body.classList.remove('navMenu--is-open', 'siteHeaderDropdown--is-open');
        openSafariModal('favourites');
        return;
      }
    });

    // Destination Filter Pills above Featured Safari Packages
    const filterBtns = document.querySelectorAll('[data-package-filter]');
    const packageCards = document.querySelectorAll('.itinerariesListings [data-package-dest]');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const dest = btn.getAttribute('data-package-filter');
        filterBtns.forEach(b => {
          b.classList.toggle('active', b === btn);
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
        packageCards.forEach(card => {
          const cardDests = (card.getAttribute('data-package-dest') || '').split(',');
          const match = dest === 'all' || cardDests.includes(dest);
          card.style.display = match ? '' : 'none';
        });
        window.__refreshScrollTriggers?.();
      });
    });

    // Back-to-top button in footer
    document.querySelector('.siteFooter__toplink')?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Fallback UI controllers if opened directly via file:// where ES modules are blocked by CORS
    if (window.location.protocol === 'file:') {
      initFileProtocolFallback();
    }

    updateFavouriteBadges();
  }

  function initFileProtocolFallback() {
    const header = document.querySelector('.siteHeader');
    const onScroll = () => {
      if (!header) return;
      if (window.scrollY > 40) {
        header.classList.add('siteHeader--scrolled');
        header.classList.remove('siteHeader--inverted');
      } else if (!document.body.classList.contains('siteHeaderDropdown--is-open')) {
        header.classList.remove('siteHeader--scrolled');
        header.classList.add('siteHeader--inverted');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Header Mega Menus fallback
    const dropdownBtns = document.querySelectorAll('.siteHeader__navigation button[data-dropdown]');
    const dropdownPanels = document.querySelectorAll('.siteHeaderDropdown__panel');
    dropdownBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-dropdown');
        const panel = document.getElementById(targetId);
        const isOpen = panel?.classList.contains('is-active');
        dropdownPanels.forEach(p => p.classList.remove('is-active'));
        dropdownBtns.forEach(b => b.classList.remove('is-active'));
        if (!isOpen && panel) {
          panel.classList.add('is-active');
          btn.classList.add('is-active');
          document.body.classList.add('siteHeaderDropdown--is-open');
          header?.classList.remove('siteHeader--inverted');
        } else {
          document.body.classList.remove('siteHeaderDropdown--is-open');
          onScroll();
        }
      });
    });

    // Search open/close fallback
    document.querySelector('.siteHeader__search button')?.addEventListener('click', () => {
      document.body.classList.add('siteSearch--is-open');
      document.getElementById('siteSearch')?.setAttribute('aria-hidden', 'false');
      document.getElementById('searchInput')?.focus();
    });
    document.querySelector('.siteSearch__close')?.addEventListener('click', () => {
      document.body.classList.remove('siteSearch--is-open');
      document.getElementById('siteSearch')?.setAttribute('aria-hidden', 'true');
    });

    // Tabs fallback
    document.querySelectorAll('.tabs__button').forEach(tabBtn => {
      tabBtn.addEventListener('click', () => {
        const container = tabBtn.closest('.tabs__container');
        if (!container) return;
        const tabId = tabBtn.getAttribute('data-tab');
        container.querySelectorAll('.tabs__button').forEach(b => b.classList.toggle('active', b === tabBtn));
        container.querySelectorAll('.tabs__content').forEach(c => c.classList.toggle('active', c.id === tabId));
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInteractiveHandlers, { once: true });
  } else {
    initInteractiveHandlers();
  }
  window.openSafariModal = openSafariModal;
})();
