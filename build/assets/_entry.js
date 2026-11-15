import { Header, ResetHeader } from "./header-C3rqcRgr.js";
import { NavMenu } from "./navMenu-2E0RMj8K.js";
import { Interactions } from "./interactions-vZ-cwK28.js";
import { Dropdowns } from "./dropdown-CLJX2lrm.js";
import { Forms } from "./form-UfncnyCl.js";
import { Accordions } from "./accordion-CwTFBR5z.js";
import { Collapse } from "./collapse-CBib17UO.js";
import { Carousels } from "./carousel-VVAQes_I.js";
import { Tabs } from "./tabs-CQXi5teO.js";
import { PageNavs } from "./pageNav-BWQMWhaW.js";
import { Filters } from "./filter-BhKxCLcr.js";
import { Map } from "./map-Cz_uLUC5.js";
import { Marquees } from "./marquee-Bezh54Iy.js";
import { Modals } from "./modal-KcZojZ-m.js";
import { Homepage } from "./home-CcwUgWZj.js";
import { Hero } from "./hero-DnMSa2uM.js";
import { HomepageMotion } from "./home-motion-DtuxTvIB.js";
import { Cursor } from "./cursor-AbSUxP3_.js";
import { Animation, PlayAnimations } from "./animation-CTtElpXO.js";
import Lenis from "./vendor-lenis-Dr-F7vXe.js";
import { g as gsap, S as ScrollTrigger } from "./vendor-gsap-Bus_UFKE.js";
import { initDestinationsMega } from "./destinationsmega-DlX3AMky.js";
import { initInspirationMega } from "./inspirationmega-BMmVxmN4.js";

let booted = false;

function safeRun(fn) {
  try {
    fn();
  } catch (err) {
    console.warn("[RedDot Init]", err);
  }
}

function bootSite() {
  if (booted) return;
  booted = true;

  const sbw = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.setProperty("--body-scrollbar-width", `${sbw}px`);
  document.documentElement.classList.remove("reduced-motion-runtime");

  safeRun(() => {
    if (document.querySelector(".siteHeader")) {
      ResetHeader();
      Header();
    }
  });
  safeRun(() => initDestinationsMega());
  safeRun(() => initInspirationMega());
  safeRun(() => {
    if (document.querySelector(".navMenu")) NavMenu();
  });
  safeRun(() => Interactions());
  safeRun(() => {
    if (document.querySelector(".dropdown-container")) Dropdowns();
  });
  safeRun(() => {
    if (document.querySelector(".processForm, [data-autoresize]")) Forms();
  });
  safeRun(() => {
    if (document.querySelector(".filterSidebar, .accommodationAccordion, .itineraryAccordion, .faqAccordion")) Accordions();
  });
  safeRun(() => {
    if (document.querySelector(".collapse")) Collapse();
  });
  safeRun(() => {
    if (document.querySelector(".breadcrumbs__carousel, .cardCarousel, .reviewsCarousel, .articleGallery, .accommodationGallery, .galleryCarousel")) Carousels();
  });
  safeRun(() => {
    if (document.querySelector(".tabs__container")) Tabs();
  });
  safeRun(() => {
    if (document.querySelector(".pageNavLink, .pageNavCarousel")) PageNavs();
  });
  safeRun(() => {
    if (document.querySelector(".filterSidebar--fixed")) Filters();
  });
  safeRun(() => {
    if (document.querySelector(".interactiveMap")) Map();
  });
  safeRun(() => {
    if (document.querySelector(".homeDestinations, .homeVideo, .homeJourney, .homeAccommodation, .homeVideoReviews")) Homepage();
  });
  safeRun(() => {
    if (document.querySelector("[data-marquee-scroll-direction-target]")) Marquees();
  });
  safeRun(() => {
    if (document.querySelector(".venobox")) Modals();
  });

  // Register GSAP ScrollTrigger + Lenis smooth scrolling
  safeRun(() => {
    gsap.registerPlugin(ScrollTrigger);
    window.__refreshScrollTriggers = () => ScrollTrigger.refresh();
    const lenis = new Lenis();
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  });

  // Initialize GSAP scroll & reveal animations
  safeRun(() => {
    if (document.querySelector(".hero, .processHero")) Hero();
  });
  safeRun(() => {
    if (document.querySelector(".homeVideo, .homeJourney")) HomepageMotion();
  });
  safeRun(() => {
    if (document.querySelector(".cursor") && window.matchMedia("(min-width: 960px)").matches) Cursor();
  });
  safeRun(() => {
    if (document.querySelector(".handReveal, .headingReveal, .fadeInReveal, .processDrawers, .destinationsScrollSection, .tailormadeScroll")) {
      Animation();
      PlayAnimations();
    }
  });

  window.addEventListener("load", () => {
    safeRun(() => ScrollTrigger.refresh());
  }, { once: true });
  setTimeout(() => {
    safeRun(() => ScrollTrigger.refresh());
  }, 500);
  setTimeout(() => {
    safeRun(() => ScrollTrigger.refresh());
  }, 1800);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootSite, { once: true });
} else {
  bootSite();
}
