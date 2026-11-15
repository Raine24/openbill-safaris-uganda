(() => {
  // build/assets/header-C3rqcRgr.js
  function V(n3 = () => window.sessionStorage, u3 = Date.now) {
    const t2 = "reddot:site-search:v1", c = /* @__PURE__ */ new Map();
    let h2 = false;
    const v3 = (s3, l3) => JSON.stringify([s3.toLowerCase(), l3]), w4 = (s3) => s3 && Number.isFinite(s3.expires) && s3.expires > u3() && s3.expires <= u3() + 3e4 && s3.data?.partial === false && Array.isArray(s3.data.results) && s3.data.results.length <= 20 && Number.isInteger(s3.data.total) && s3.data.total >= s3.data.results.length && typeof s3.data.has_more == "boolean" && s3.data.results.every((l3) => l3 && ["title", "url", "type", "description"].every((d2) => typeof l3[d2] == "string"));
    function E5() {
      if (!h2) {
        h2 = true;
        try {
          const s3 = n3()?.getItem(t2);
          if (!s3 || s3.length > 1e6) return;
          const l3 = JSON.parse(s3);
          if (!Array.isArray(l3) || l3.length > 30) return;
          l3.forEach((d2) => {
            Array.isArray(d2) && typeof d2[0] == "string" && w4(d2[1]) && c.set(d2[0], d2[1]);
          });
        } catch {
        }
      }
    }
    return { get(s3, l3) {
      E5();
      const d2 = v3(s3, l3), a20 = c.get(d2);
      return a20 && a20.expires > u3() ? a20.data : (c.delete(d2), null);
    }, set(s3, l3, d2) {
      E5();
      const a20 = { data: d2, expires: u3() + 3e4 };
      if (!w4(a20)) return;
      for (const [q7, A4] of c) A4.expires <= u3() && c.delete(q7);
      const S3 = v3(s3, l3);
      c.delete(S3), c.set(S3, a20), c.size > 30 && c.delete(c.keys().next().value);
      try {
        n3()?.setItem(t2, JSON.stringify([...c]));
      } catch {
      }
    } };
  }
  function Y() {
    const n3 = document.querySelector(".siteSearch"), u3 = n3?.querySelector("form[data-search-endpoint]");
    if (!u3) return () => {
    };
    const t2 = u3.querySelector("input"), m3 = n3.querySelector(".siteSearch__status"), y3 = n3.querySelector(".siteSearch__results"), c = n3.querySelector(".siteSearch__list"), h2 = n3.querySelector(".siteSearch__more"), v3 = n3.querySelector(".siteSearch__retry"), w4 = n3.querySelector(".siteSearch__clear"), E5 = n3.querySelector(".siteSearch__suggestions"), s3 = n3.querySelector("[data-search-result-arrow]"), l3 = [...document.querySelectorAll(".siteSearch__toggle")], d2 = new AbortController(), a20 = { signal: d2.signal }, S3 = m3.textContent, q7 = V();
    let A4, f4, b4 = 0, C4 = 1, H5 = 1, x4, k3, L2, D5 = 0, R4 = false, $3 = [];
    async function O3() {
      if (L2 || Date.now() < D5) return;
      L2 = new AbortController();
      const e = L2, r = setTimeout(() => e.abort(), 12e3);
      try {
        const o2 = new URL(u3.dataset.searchEndpoint, location.origin);
        o2.searchParams.set("warm", "1");
        const p3 = await fetch(o2, { headers: { Accept: "application/json" }, signal: e.signal }), g4 = p3.ok ? await p3.json() : null;
        D5 = Date.now() + (g4?.ready ? 6e4 : 5e3);
      } catch {
        D5 = Date.now() + 5e3;
      } finally {
        clearTimeout(r), L2 = null;
      }
    }
    function T2(e) {
      n3.dataset.searchState = e, E5.hidden = e !== "idle", w4.hidden = !t2.value;
    }
    function I2() {
      clearTimeout(A4), b4++, f4?.abort(), y3.setAttribute("aria-busy", "false"), h2.disabled = false;
    }
    function M4(e = true) {
      if (I2(), document.body.classList.remove("siteSearch--is-open"), n3.setAttribute("aria-hidden", "true"), n3.inert = true, $3.forEach(([r, o2]) => {
        r.inert = o2;
      }), $3 = [], l3.forEach((r) => r.setAttribute("aria-expanded", "false")), e) {
        const r = x4?.closest(".navMenu") ? document.querySelector(".navMenu__btn") : x4;
        (r?.getClientRects().length && getComputedStyle(r).visibility === "visible" ? r : document.querySelector(".navMenu__btn"))?.focus({ preventScroll: true });
      }
    }
    function j3(e) {
      O3(), x4 = e, document.body.classList.remove("navMenu--is-open", "siteHeaderDropdown--is-open"), n3.inert = false, n3.setAttribute("aria-hidden", "false"), document.body.classList.add("siteSearch--is-open");
      for (let r = n3; r.parentElement; r = r.parentElement) {
        for (const o2 of r.parentElement.children) o2 !== r && o2 instanceof HTMLElement && !["SCRIPT", "STYLE", "LINK"].includes(o2.tagName) && ($3.push([o2, o2.inert]), o2.inert = true);
        if (r.parentElement === document.body) break;
      }
      l3.forEach((r) => r.setAttribute("aria-expanded", "true")), t2.focus({ preventScroll: true }), t2.value.trim() && _7(1);
    }
    function J3(e) {
      const r = new URL(e.url, location.origin);
      if (r.origin !== location.origin || !["http:", "https:"].includes(r.protocol)) return null;
      const o2 = document.createElement("li"), p3 = document.createElement("a");
      p3.href = r.href, p3.className = "siteSearch__result";
      const g4 = document.createElement("span"), i3 = document.createElement("span");
      i3.className = "siteSearch__result-title", i3.textContent = e.title;
      const N5 = document.createElement("span");
      N5.className = "siteSearch__result-description", N5.textContent = e.description;
      const P3 = document.createElement("span");
      return P3.className = "siteSearch__result-type", P3.textContent = e.type, g4.append(i3), e.description && g4.append(N5), p3.append(P3, g4, s3.content.cloneNode(true)), o2.append(p3), c.append(o2), p3;
    }
    async function _7(e = 1) {
      I2();
      const r = t2.value.trim(), o2 = b4;
      if (v3.hidden = true, h2.hidden = true, H5 = e, e === 1 && c.replaceChildren(), !r) {
        T2("idle"), m3.textContent = S3;
        return;
      }
      f4 = new AbortController();
      const p3 = f4, g4 = setTimeout(() => p3.abort(), 15e3);
      y3.setAttribute("aria-busy", "true"), h2.disabled = true, T2("loading"), m3.textContent = "Searching\u2026";
      try {
        let i3 = q7.get(r, e);
        const N5 = !!i3;
        if (!i3) {
          const U3 = new URL(u3.dataset.searchEndpoint, location.origin);
          U3.searchParams.set("q", r), U3.searchParams.set("page", e);
          const K3 = await fetch(U3, { headers: { Accept: "application/json" }, signal: p3.signal });
          if (!K3.ok) throw new Error("Search unavailable");
          i3 = await K3.json();
        }
        if (o2 !== b4) return;
        if (!Array.isArray(i3.results)) throw new Error("Invalid search response");
        N5 || q7.set(r, e, i3);
        const P3 = i3.results.map(J3).filter(Boolean);
        C4 = e;
        const z2 = c.children.length;
        T2(i3.total ? "results" : "empty"), m3.textContent = i3.total ? z2 < i3.total ? `Showing ${z2} of ${i3.total} results` : `${i3.total} result${i3.total === 1 ? "" : "s"} found` : `No results for \u201C${r}\u201D. Try a destination, hotel or different keyword.`, i3.partial && (m3.textContent += " Some results are temporarily unavailable. Please try again."), h2.hidden = !i3.has_more, v3.hidden = !i3.partial, i3.partial && (H5 = 1), e > 1 && P3[0]?.focus();
      } catch {
        if (o2 !== b4) return;
        T2("error"), m3.textContent = "Search is temporarily unavailable. Please try again.", v3.hidden = false;
      } finally {
        clearTimeout(g4), o2 === b4 && (y3.setAttribute("aria-busy", "false"), h2.disabled = false);
      }
    }
    l3.forEach((e) => {
      e.tagName === "BUTTON" && (e.setAttribute("aria-controls", n3.id), e.setAttribute("aria-expanded", "false")), e.addEventListener("click", () => {
        document.body.classList.contains("siteSearch--is-open") ? M4() : j3(e);
      }, a20), n3.contains(e) || (e.addEventListener("pointerenter", () => {
        navigator.connection?.saveData || (k3 = setTimeout(O3, 120));
      }, a20), e.addEventListener("pointerleave", () => clearTimeout(k3), a20), e.addEventListener("focus", O3, a20));
    });
    function B3() {
      I2(), c.replaceChildren(), h2.hidden = v3.hidden = true, T2(t2.value.trim() ? "loading" : "idle"), m3.textContent = t2.value.trim() ? "Searching\u2026" : S3, !R4 && t2.value.trim() && (A4 = setTimeout(() => _7(1), q7.get(t2.value.trim(), 1) ? 0 : 80));
    }
    t2.addEventListener("input", B3, a20), t2.addEventListener("compositionstart", () => {
      R4 = true, I2();
    }, a20), t2.addEventListener("compositionend", () => {
      R4 = false, B3();
    }, a20), u3.addEventListener("submit", (e) => {
      e.preventDefault(), R4 || _7(1);
    }, a20), h2.addEventListener("click", () => _7(C4 + 1), a20), v3.addEventListener("click", () => _7(H5), a20), w4.addEventListener("click", () => {
      t2.value = "", _7(1), t2.focus({ preventScroll: true });
    }, a20), E5.querySelectorAll("[data-search-query]").forEach((e) => {
      e.addEventListener("click", () => {
        t2.value = e.dataset.searchQuery, t2.focus({ preventScroll: true }), _7(1);
      }, a20);
    }), n3.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.preventDefault(), M4();
        return;
      }
      if (e.key !== "Tab") return;
      const r = [...n3.querySelectorAll("button, input, a[href]")].filter((g4) => !g4.disabled && g4.getClientRects().length), o2 = r[0], p3 = r.at(-1);
      e.shiftKey && document.activeElement === o2 ? (e.preventDefault(), p3?.focus()) : !e.shiftKey && document.activeElement === p3 && (e.preventDefault(), o2?.focus());
    }, a20), c.addEventListener("click", (e) => {
      e.target.closest("a") && M4(false);
    }, a20);
    function F3() {
      if (location.hash !== "#site-search" && !location.hash.startsWith("#site-search?")) return;
      const e = new URLSearchParams(location.hash.slice(12));
      t2.value = [...e.get("q") || ""].slice(0, 100).join(""), history.replaceState(history.state, "", location.pathname + location.search), document.body.classList.contains("siteSearch--is-open") ? _7(1) : j3(document.querySelector(".siteHeader .siteSearch__toggle"));
    }
    return window.addEventListener("hashchange", F3, a20), F3(), () => {
      M4(false), clearTimeout(k3), L2?.abort(), d2.abort();
    };
  }
  function Q() {
    let n3;
    const u3 = document.querySelector(".siteHeader");
    if (!u3 || u3.dataset.headerInitialized === "true") return;
    window.siteHeaderCleanup?.(), u3.dataset.headerInitialized = "true";
    const t2 = new AbortController();
    function m3() {
      n3 = u3.offsetHeight, document.body.style.setProperty("--header-height", `${n3}px`);
    }
    let y3;
    function c() {
      y3 = null, u3.classList.toggle("siteHeader--scrolled", window.scrollY > 100);
    }
    function h2() {
      y3 || (y3 = window.requestAnimationFrame(c));
    }
    c(), window.addEventListener("scroll", h2, { passive: true, signal: t2.signal }), m3(), window.addEventListener("resize", m3, { signal: t2.signal });
    const v3 = Y(), w4 = document.querySelectorAll(".siteHeaderDropdown__toggle"), E5 = document.querySelector(".siteHeaderDropdown__background");
    let s3, l3 = false, d2 = false;
    function a20() {
      document.body.classList.remove("siteHeaderDropdown--is-open"), w4.forEach((f4) => f4.classList.remove("is-active")), E5?.style.setProperty("height", "0");
    }
    function S3() {
      l3 = true, d2 = true, document.body.classList.add("is-scrolling"), a20(), clearTimeout(s3), s3 = setTimeout(() => {
        l3 = false, document.body.classList.remove("is-scrolling");
      }, 250);
    }
    function q7() {
      return !l3 && !d2;
    }
    function A4(f4) {
      d2 && (f4?.target instanceof Element && u3.contains(f4.target) || (d2 = false));
    }
    window.addEventListener("scroll", S3, { passive: true, signal: t2.signal }), window.addEventListener("wheel", S3, { passive: true, signal: t2.signal }), window.addEventListener("touchmove", S3, { passive: true, signal: t2.signal }), window.addEventListener("mousemove", A4, { passive: true, signal: t2.signal }), u3.addEventListener("mouseleave", A4, { signal: t2.signal }), w4.forEach((f4) => {
      const b4 = f4.dataset.dropdown, C4 = document.querySelector(`.siteHeaderDropdown#${b4}`);
      if (!C4) return;
      const H5 = f4.querySelector(":scope > a, :scope > button") || f4;
      let x4 = C4.offsetHeight;
      function k3() {
        q7() && (x4 = C4.scrollHeight, document.body.classList.add("siteHeaderDropdown--is-open"), w4.forEach((D5) => {
          D5 !== f4 && D5.classList.remove("is-active");
        }), f4.classList.add("is-active"), E5?.style.setProperty("height", `${x4 + n3}px`));
      }
      function L2() {
        if (b4 !== "destinationsDropdown") {
          k3();
          return;
        }
        k3();
      }
      b4 === "destinationsDropdown" ? H5.addEventListener("mousemove", L2, { signal: t2.signal }) : H5.addEventListener("mouseenter", L2, { signal: t2.signal }), H5.addEventListener("focus", () => {
        k3();
      }, { signal: t2.signal }), f4.addEventListener("mouseleave", () => {
        a20();
      }, { signal: t2.signal });
    }), window.siteHeaderCleanup = () => {
      v3(), clearTimeout(s3), y3 && window.cancelAnimationFrame(y3), document.body.classList.remove("is-scrolling"), t2.abort();
    };
  }
  function W() {
    document.body.classList.remove("navMenu--is-open"), document.body.classList.remove("siteHeaderDropdown--is-open"), document.body.classList.remove("siteSearch--is-open"), document.querySelectorAll(".siteHeaderDropdown__toggle.is-active").forEach((n3) => {
      n3.classList.remove("is-active");
    }), document.querySelector(".siteHeaderDropdown__background")?.style.setProperty("height", "0");
  }

  // build/assets/vendor-accordion-NUN0ooKf.js
  function y(c) {
    return c && c.__esModule && Object.prototype.hasOwnProperty.call(c, "default") ? c.default : c;
  }
  var f = { exports: {} };
  var E;
  function C() {
    return E || (E = 1, (function(c) {
      (function(A4) {
        let d2 = 0;
        const m3 = function(h2, g4) {
          const p3 = "js-enabled", v3 = this;
          let u3 = false;
          if (Array.isArray(h2)) return !!h2.length && h2.map((e) => new m3(e, g4));
          const n3 = { init() {
            this.options = Object.assign({ duration: 500, ariaEnabled: true, collapse: true, showMultiple: false, onlyChildNodes: true, openOnInit: [], elementClass: "ac", triggerClass: "ac-trigger", panelClass: "ac-panel", activeClass: "is-active", beforeOpen: () => {
            }, onOpen: () => {
            }, beforeClose: () => {
            }, onClose: () => {
            } }, g4);
            const e = typeof h2 == "string";
            this.container = e ? document.querySelector(h2) : h2, this.createDefinitions(), v3.attachEvents();
          }, createDefinitions() {
            const { elementClass: e, openOnInit: t2, onlyChildNodes: s3 } = this.options, o2 = s3 ? this.container.childNodes : this.container.querySelectorAll(a20(e));
            this.elements = Array.from(o2).filter((i3) => i3.classList && i3.classList.contains(e)), this.firstElement = this.elements[0], this.lastElement = this.elements[this.elements.length - 1], this.elements.filter((i3) => !i3.classList.contains(p3)).forEach((i3) => {
              i3.classList.add(p3), this.generateIDs(i3), this.setARIA(i3), this.setTransition(i3);
              const r = this.elements.indexOf(i3);
              d2++, t2.includes(r) ? this.showElement(i3, false) : this.closeElement(i3, false);
            });
          }, setTransition(e) {
            let t2 = arguments.length > 1 && arguments[1] !== void 0 && arguments[1];
            const { duration: s3, panelClass: o2 } = this.options;
            e.querySelector(a20(o2)).style.transitionDuration = t2 ? null : "".concat(s3, "ms");
          }, generateIDs(e) {
            const { triggerClass: t2, panelClass: s3 } = this.options, o2 = e.querySelector(a20(t2)), i3 = e.querySelector(a20(s3));
            e.setAttribute("id", e.id || "ac-".concat(d2)), o2.setAttribute("id", o2.id || "ac-trigger-".concat(d2)), i3.setAttribute("id", i3.id || "ac-panel-".concat(d2));
          }, removeIDs(e) {
            const { triggerClass: t2, panelClass: s3 } = this.options, o2 = e.querySelector(a20(t2)), i3 = e.querySelector(a20(s3));
            e.id.startsWith("ac-") && e.removeAttribute("id"), o2.id.startsWith("ac-") && o2.removeAttribute("id"), i3.id.startsWith("ac-") && i3.removeAttribute("id");
          }, setARIA(e) {
            const { ariaEnabled: t2, triggerClass: s3, panelClass: o2 } = this.options;
            if (!t2) return;
            const i3 = e.querySelector(a20(s3)), r = e.querySelector(a20(o2));
            i3.setAttribute("role", "button"), i3.setAttribute("aria-controls", r.id), i3.setAttribute("aria-disabled", false), i3.setAttribute("aria-expanded", false), r.setAttribute("role", "region"), r.setAttribute("aria-labelledby", i3.id);
          }, updateARIA(e, t2) {
            let { ariaExpanded: s3, ariaDisabled: o2 } = t2;
            const { ariaEnabled: i3, triggerClass: r } = this.options;
            if (!i3) return;
            const l3 = e.querySelector(a20(r));
            l3.setAttribute("aria-expanded", s3), l3.setAttribute("aria-disabled", o2);
          }, removeARIA(e) {
            const { ariaEnabled: t2, triggerClass: s3, panelClass: o2 } = this.options;
            if (!t2) return;
            const i3 = e.querySelector(a20(s3)), r = e.querySelector(a20(o2));
            i3.removeAttribute("role"), i3.removeAttribute("aria-controls"), i3.removeAttribute("aria-disabled"), i3.removeAttribute("aria-expanded"), r.removeAttribute("role"), r.removeAttribute("aria-labelledby");
          }, focus(e, t2) {
            e.preventDefault();
            const { triggerClass: s3 } = this.options;
            t2.querySelector(a20(s3)).focus();
          }, focusFirstElement(e) {
            this.focus(e, this.firstElement), this.currFocusedIdx = 0;
          }, focusLastElement(e) {
            this.focus(e, this.lastElement), this.currFocusedIdx = this.elements.length - 1;
          }, focusNextElement(e) {
            const t2 = this.currFocusedIdx + 1;
            if (t2 > this.elements.length - 1) return this.focusFirstElement(e);
            this.focus(e, this.elements[t2]), this.currFocusedIdx = t2;
          }, focusPrevElement(e) {
            const t2 = this.currFocusedIdx - 1;
            if (t2 < 0) return this.focusLastElement(e);
            this.focus(e, this.elements[t2]), this.currFocusedIdx = t2;
          }, showElement(e) {
            let t2 = !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
            const { panelClass: s3, activeClass: o2, collapse: i3, beforeOpen: r } = this.options;
            t2 && r(e);
            const l3 = e.querySelector(a20(s3)), b4 = l3.scrollHeight;
            e.classList.add(o2), requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                l3.style.height = t2 ? "".concat(b4, "px") : "auto";
              });
            }), this.updateARIA(e, { ariaExpanded: true, ariaDisabled: !i3 });
          }, closeElement(e) {
            let t2 = !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
            const { panelClass: s3, activeClass: o2, beforeClose: i3 } = this.options, r = e.querySelector(a20(s3)), l3 = r.scrollHeight;
            e.classList.remove(o2), t2 ? (i3(e), requestAnimationFrame(() => {
              r.style.height = "".concat(l3, "px"), requestAnimationFrame(() => {
                r.style.height = 0;
              });
            })) : r.style.height = 0, this.updateARIA(e, { ariaExpanded: false, ariaDisabled: false });
          }, toggleElement(e) {
            const { activeClass: t2, collapse: s3 } = this.options, o2 = e.classList.contains(t2);
            if (!o2 || s3) return o2 ? this.closeElement(e) : this.showElement(e);
          }, closeElements() {
            const { activeClass: e, showMultiple: t2 } = this.options;
            t2 || this.elements.forEach((s3, o2) => {
              s3.classList.contains(e) && o2 !== this.currFocusedIdx && this.closeElement(s3);
            });
          }, handleClick(e) {
            const t2 = e.currentTarget;
            this.elements.forEach((s3, o2) => {
              s3.contains(t2) && e.target.nodeName !== "A" && (this.currFocusedIdx = o2, this.closeElements(), this.focus(e, s3), this.toggleElement(s3));
            });
          }, handleKeydown(e) {
            switch (e.key) {
              case "ArrowUp":
                return this.focusPrevElement(e);
              case "ArrowDown":
                return this.focusNextElement(e);
              case "Home":
                return this.focusFirstElement(e);
              case "End":
                return this.focusLastElement(e);
              default:
                return null;
            }
          }, handleFocus(e) {
            const t2 = e.currentTarget, s3 = this.elements.find((o2) => o2.contains(t2));
            this.currFocusedIdx = this.elements.indexOf(s3);
          }, handleTransitionEnd(e) {
            if (e.stopPropagation(), e.propertyName !== "height") return;
            const { onOpen: t2, onClose: s3 } = this.options, o2 = e.currentTarget, i3 = parseInt(o2.style.height), r = this.elements.find((l3) => l3.contains(o2));
            i3 > 0 ? (o2.style.height = "auto", t2(r)) : s3(r);
          } };
          this.attachEvents = () => {
            if (u3) return;
            const { triggerClass: e, panelClass: t2 } = n3.options;
            n3.handleClick = n3.handleClick.bind(n3), n3.handleKeydown = n3.handleKeydown.bind(n3), n3.handleFocus = n3.handleFocus.bind(n3), n3.handleTransitionEnd = n3.handleTransitionEnd.bind(n3), n3.elements.forEach((s3) => {
              const o2 = s3.querySelector(a20(e)), i3 = s3.querySelector(a20(t2));
              o2.addEventListener("click", n3.handleClick), o2.addEventListener("keydown", n3.handleKeydown), o2.addEventListener("focus", n3.handleFocus), i3.addEventListener("transitionend", n3.handleTransitionEnd);
            }), u3 = true;
          }, this.detachEvents = () => {
            if (!u3) return;
            const { triggerClass: e, panelClass: t2 } = n3.options;
            n3.elements.forEach((s3) => {
              const o2 = s3.querySelector(a20(e)), i3 = s3.querySelector(a20(t2));
              o2.removeEventListener("click", n3.handleClick), o2.removeEventListener("keydown", n3.handleKeydown), o2.removeEventListener("focus", n3.handleFocus), i3.removeEventListener("transitionend", n3.handleTransitionEnd);
            }), u3 = false;
          }, this.toggle = (e) => {
            const t2 = n3.elements[e];
            t2 && n3.toggleElement(t2);
          }, this.open = (e) => {
            const t2 = n3.elements[e];
            t2 && n3.showElement(t2);
          }, this.openAll = () => {
            const { activeClass: e, onOpen: t2 } = n3.options;
            n3.elements.forEach((s3) => {
              s3.classList.contains(e) || (n3.showElement(s3, false), t2(s3));
            });
          }, this.close = (e) => {
            const t2 = n3.elements[e];
            t2 && n3.closeElement(t2);
          }, this.closeAll = () => {
            const { activeClass: e, onClose: t2 } = n3.options;
            n3.elements.forEach((s3) => {
              s3.classList.contains(e) && (n3.closeElement(s3, false), t2(s3));
            });
          }, this.destroy = () => {
            this.detachEvents(), this.openAll(), n3.elements.forEach((e) => {
              n3.removeIDs(e), n3.removeARIA(e), n3.setTransition(e, true), e.classList.remove(p3);
            }), u3 = true;
          }, this.update = () => {
            n3.createDefinitions(), this.detachEvents(), this.attachEvents();
          };
          const a20 = (e) => ".".concat(CSS.escape(e));
          n3.init();
        };
        c.exports !== void 0 ? c.exports = m3 : A4.Accordion = m3;
      })(window);
    })(f)), f.exports;
  }
  var q = C();
  var x = y(q);

  // build/assets/navMenu-2E0RMj8K.js
  var m = {};
  var b = {};
  var M;
  function E2() {
    return M || (M = 1, (function(c) {
      Object.defineProperty(c, "__esModule", { value: true }), c.getUniqId = function() {
        return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
      }, c.getWindowWidth = function() {
        return document && document.documentElement ? document.documentElement.clientWidth : window && window.innerWidth ? window.innerWidth : 0;
      }, c.getWindowHeight = function() {
        return window.innerHeight || document.documentElement.clientHeight || 0;
      }, c.hasClass = function(i3, u3) {
        return i3.classList ? i3.classList.contains(u3) : new RegExp("(^| )" + u3 + "( |$)", "gi").test(i3.className);
      }, c.addClass = function(i3, u3) {
        i3.classList ? i3.classList.add(u3) : i3.className += " " + u3;
      }, c.removeClass = function(i3, u3) {
        i3.classList ? i3.classList.remove(u3) : i3.className = i3.className.replace(new RegExp("(^|\\b)" + u3.split(" ").join("|") + "(\\b|$)", "gi"), " ");
      }, c.getScrollTop = function() {
        return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      }, c.wrap = function(i3, u3) {
        i3.parentNode.insertBefore(u3, i3), u3.appendChild(i3);
      }, c.after = function(i3, u3) {
        i3.insertAdjacentHTML("afterend", u3);
      }, c.isIE = function() {
        var i3 = window.navigator.userAgent.toLowerCase();
        return !!(i3.match(/(msie|MSIE)/) || i3.match(/(T|t)rident/));
      }, c.triggerEvent = function(i3, u3, l3) {
        var v3;
        window.CustomEvent ? v3 = new CustomEvent(u3, { cancelable: true }) : (v3 = document.createEvent("CustomEvent"), v3.initCustomEvent(u3, false, false, l3)), i3.dispatchEvent(v3);
      }, c.append = function(i3, u3) {
        var l3 = document.createElement("div");
        for (l3.innerHTML = u3; l3.children.length > 0; ) i3.appendChild(l3.children[0]);
      }, c.prepend = function(i3, u3) {
        var l3 = document.createElement("div");
        for (l3.innerHTML = u3; l3.children.length > 0; ) i3.insertBefore(l3.children[0], i3.firstChild);
      }, c.matches = function(i3, u3) {
        for (var l3 = (i3.document || i3.ownerDocument).querySelectorAll(u3), v3 = l3.length; --v3 >= 0 && l3.item(v3) !== i3; ) ;
        return v3 > -1;
      }, c.findAncestor = function(i3, u3) {
        if (typeof i3.closest == "function") return i3.closest(u3) || null;
        for (; i3 && i3 !== document; ) {
          if (c.matches(i3, u3)) return i3;
          i3 = i3.parentElement;
        }
        return null;
      };
    })(b)), b;
  }
  var g;
  function _() {
    if (g) return m;
    g = 1;
    var c = m && m.__assign || function() {
      return c = Object.assign || function(d2) {
        for (var a20, e = 1, n3 = arguments.length; e < n3; e++) {
          a20 = arguments[e];
          for (var r in a20) Object.prototype.hasOwnProperty.call(a20, r) && (d2[r] = a20[r]);
        }
        return d2;
      }, c.apply(this, arguments);
    }, i3 = m && m.__awaiter || function(d2, a20, e, n3) {
      function r(t2) {
        return t2 instanceof e ? t2 : new e(function(o2) {
          o2(t2);
        });
      }
      return new (e || (e = Promise))(function(t2, o2) {
        function f4(h2) {
          try {
            s3(n3.next(h2));
          } catch (y3) {
            o2(y3);
          }
        }
        function p3(h2) {
          try {
            s3(n3.throw(h2));
          } catch (y3) {
            o2(y3);
          }
        }
        function s3(h2) {
          h2.done ? t2(h2.value) : r(h2.value).then(f4, p3);
        }
        s3((n3 = n3.apply(d2, a20 || [])).next());
      });
    }, u3 = m && m.__generator || function(d2, a20) {
      var e = { label: 0, sent: function() {
        if (t2[0] & 1) throw t2[1];
        return t2[1];
      }, trys: [], ops: [] }, n3, r, t2, o2;
      return o2 = { next: f4(0), throw: f4(1), return: f4(2) }, typeof Symbol == "function" && (o2[Symbol.iterator] = function() {
        return this;
      }), o2;
      function f4(s3) {
        return function(h2) {
          return p3([s3, h2]);
        };
      }
      function p3(s3) {
        if (n3) throw new TypeError("Generator is already executing.");
        for (; e; ) try {
          if (n3 = 1, r && (t2 = s3[0] & 2 ? r.return : s3[0] ? r.throw || ((t2 = r.return) && t2.call(r), 0) : r.next) && !(t2 = t2.call(r, s3[1])).done) return t2;
          switch (r = 0, t2 && (s3 = [s3[0] & 2, t2.value]), s3[0]) {
            case 0:
            case 1:
              t2 = s3;
              break;
            case 4:
              return e.label++, { value: s3[1], done: false };
            case 5:
              e.label++, r = s3[1], s3 = [0];
              continue;
            case 7:
              s3 = e.ops.pop(), e.trys.pop();
              continue;
            default:
              if (t2 = e.trys, !(t2 = t2.length > 0 && t2[t2.length - 1]) && (s3[0] === 6 || s3[0] === 2)) {
                e = 0;
                continue;
              }
              if (s3[0] === 3 && (!t2 || s3[1] > t2[0] && s3[1] < t2[3])) {
                e.label = s3[1];
                break;
              }
              if (s3[0] === 6 && e.label < t2[1]) {
                e.label = t2[1], t2 = s3;
                break;
              }
              if (t2 && e.label < t2[2]) {
                e.label = t2[2], e.ops.push(s3);
                break;
              }
              t2[2] && e.ops.pop(), e.trys.pop();
              continue;
          }
          s3 = a20.call(d2, e);
        } catch (h2) {
          s3 = [6, h2], r = 0;
        } finally {
          n3 = t2 = 0;
        }
        if (s3[0] & 5) throw s3[1];
        return { value: s3[0] ? s3[1] : void 0, done: true };
      }
    };
    Object.defineProperty(m, "__esModule", { value: true });
    var l3 = E2(), v3 = { backBtnClass: "js-menu-back-btn", disableMenuClass: "js-disable-menu", activeMenuClass: "active", flattenedClass: "flattened", collapseClass: "js-collapse", fetchAttribute: "data-fetch-url", linkOnToggle: false, prependHTML: function(d2) {
      return '<li><a href="#" class="js-menu-back-btn">\u2190 Back </a></li>';
    }, appendHTML: function(d2) {
      return '<span class="multi-menu-arrow"></span>';
    }, levelLimit: 1 / 0 }, w4 = (function() {
      function d2(a20, e) {
        e === void 0 && (e = {}), this.childCount = 0, this.multiMenu = typeof a20 == "string" ? document.querySelector(a20) : a20, this.opt = c(c({}, v3), e), l3.addClass(this.multiMenu, "multi-menu"), this.setMenu(this.multiMenu.querySelectorAll("ul")), this.setActiveMenu();
      }
      return d2.prototype.setLevels = function(a20, e) {
        var n3 = this;
        [].forEach.call(a20, function(t2) {
          if (!t2.dataset.level) {
            var o2 = 0, f4 = t2, p3 = "ul ul", s3 = false;
            if (l3.hasClass(t2, n3.opt.disableMenuClass)) {
              var h2 = t2.querySelectorAll("ul");
              [].forEach.call(h2, function(C4) {
                l3.addClass(C4, n3.opt.disableMenuClass);
              });
              return;
            }
            for (; f4 !== null; ) {
              if (o2 += 1, o2 > n3.opt.levelLimit) {
                s3 = true;
                break;
              }
              f4 = l3.findAncestor(f4, p3), p3 += " ul";
            }
            if (!s3) {
              var y3 = l3.findAncestor(t2.parentElement, "ul");
              y3 && (t2.dataset.parentId = y3.dataset.id), t2.dataset.id || (t2.dataset.id = "" + n3.childCount, n3.childCount++), t2.dataset.level = o2 + e;
            }
          }
        });
        var r = this.getMaxLevel();
        [].forEach.call(a20, function(t2) {
          t2.style.zIndex = "" + (r - parseInt(t2.dataset.level, 10));
        });
      }, d2.prototype.getMaxLevel = function() {
        var a20 = 0;
        return [].forEach.call(this.multiMenu.querySelectorAll("ul"), function(e) {
          var n3 = parseInt(e.dataset.level, 10);
          n3 > a20 && (a20 = n3);
        }), a20;
      }, d2.prototype.flattenList = function(a20) {
        var e = this;
        [].forEach.call(a20, function(n3) {
          if (!l3.hasClass(n3, e.opt.flattenedClass)) {
            if (n3.previousElementSibling && n3.previousElementSibling.dataset && (n3.previousElementSibling.dataset.ulId = n3.dataset.id, l3.append(n3.previousElementSibling, e.opt.appendHTML(n3.previousElementSibling))), e.opt.prependHTML) {
              var r = e.multiMenu.querySelector('[data-ul-id="' + n3.dataset.id + '"]');
              r && l3.prepend(n3, e.opt.prependHTML(r));
            }
            e.multiMenu.appendChild(n3), l3.addClass(n3, e.opt.flattenedClass);
          }
        });
      }, d2.prototype.backLink = function(a20) {
        var e = this, n3 = l3.findAncestor(a20, "ul"), r = n3.dataset.parentId;
        if (r) {
          var t2 = this.multiMenu.querySelectorAll("ul");
          [].forEach.call(t2, function(f4) {
            l3.removeClass(f4, e.opt.activeMenuClass);
          });
          var o2 = [].find.call(t2, function(f4) {
            return f4.dataset.id === r;
          });
          o2.style.display = "block", setTimeout(function() {
            l3.addClass(o2, e.opt.activeMenuClass), o2.style.transform = "translateX(0)";
          }, 100), this.fetchList(o2);
        }
      }, d2.prototype.fetchList = function(a20) {
        var e = this, n3 = a20.querySelectorAll("a");
        [].forEach.call(n3, function(r) {
          return i3(e, void 0, void 0, function() {
            var t2, o2, f4;
            return u3(this, function(p3) {
              switch (p3.label) {
                case 0:
                  return r ? (t2 = r.getAttribute(this.opt.fetchAttribute), t2 ? [4, fetch(t2)] : [2]) : [2];
                case 1:
                  return o2 = p3.sent(), [4, o2.text()];
                case 2:
                  return f4 = p3.sent(), r.removeAttribute(this.opt.fetchAttribute), r.insertAdjacentHTML("afterend", f4), this.setMenu(this.multiMenu.querySelectorAll("ul"), parseInt(a20.dataset.level, 10)), [2];
              }
            });
          });
        });
      }, d2.prototype.forwardLink = function(a20) {
        var e = this, n3 = l3.findAncestor(a20, "ul");
        n3.style.transform = "translateX(-100%)";
        var r = this.multiMenu.querySelectorAll("ul");
        [].forEach.call(r, function(t2) {
          if (l3.removeClass(t2, e.opt.activeMenuClass), a20.dataset.ulId === t2.dataset.id || t2 === n3) {
            t2.style.display = "block", setTimeout(function() {
              a20.dataset.ulId === t2.dataset.id && l3.addClass(t2, e.opt.activeMenuClass);
            }, 100), e.fetchList(t2);
            return;
          }
          l3.hasClass(t2, e.opt.disableMenuClass) || (t2.style.display = "none");
        });
      }, d2.prototype.setLink = function(a20) {
        var e = this;
        l3.hasClass(a20, this.opt.backBtnClass) && (l3.addClass(a20, this.opt.collapseClass), a20.addEventListener("click", function(n3) {
          n3.preventDefault(), e.backLink(a20);
        })), a20.dataset.ulId && (l3.addClass(a20, this.opt.collapseClass), a20.addEventListener("click", function(n3) {
          (!e.opt.linkOnToggle || !a20.href || !n3.target.dataset.ulId) && (n3.preventDefault(), e.forwardLink(a20));
        }));
      }, d2.prototype.setActiveMenu = function() {
        var a20 = this, e = this.multiMenu.querySelectorAll("ul"), n3 = [].find.call(e, function(t2) {
          return !!l3.hasClass(t2, a20.opt.activeMenuClass);
        });
        if (!n3) {
          e && e[0] && l3.addClass(e[0], this.opt.activeMenuClass);
          return;
        }
        var r = this.multiMenu.querySelectorAll("ul");
        [].forEach.call(r, function(t2) {
          if (n3 === t2) {
            t2.style.display = "block";
            return;
          }
          if (n3.dataset.parentId === t2.dataset.id) for (var o2 = t2; o2.style.transform = "translateX(-100%)", o2.dataset.parentId; ) o2 = a20.multiMenu.querySelector('[data-id="' + o2.dataset.parentId + '"]');
          else t2.style.display = "none";
        });
      }, d2.prototype.setMenu = function(a20, e) {
        var n3 = this;
        e === void 0 && (e = 0), this.setLevels(a20, e), this.flattenList(a20);
        var r = this.multiMenu.querySelectorAll("a:not(." + this.opt.collapseClass + ")");
        [].forEach.call(r, function(t2) {
          n3.setLink(t2);
        });
      }, d2;
    })();
    return m.default = w4, m;
  }
  var A = _();
  var S = y(A);
  function q2() {
    new S(".navMenu__nav", { prependHTML: (i3) => `<li class="navMenu__title"><a href="#" class="js-menu-back-btn" aria-label="Back to previous menu"><span class="btn__icon" aria-hidden="true"><span class="btn__icon-stroke"><svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="none" viewBox="0 0 50 50"><circle vector-effect="non-scaling-stroke" cx="25" cy="25" r="24" stroke="currentColor" stroke-dasharray="1 3" stroke-linecap="round" stroke-linejoin="round"/></svg></span><svg><use href="#line-arrowLeft"/></svg></span></a><span class="label">${i3.dataset.title}</span></li>` }), document.querySelector(".navMenu"), document.querySelectorAll(".navMenu__toggle").forEach((i3) => {
      i3.addEventListener("click", () => {
        document.body.classList.toggle("navMenu--is-open");
      });
    });
  }

  // build/assets/interactions-vZ-cwK28.js
  function t() {
    document.querySelector(".siteFooter__toplink")?.addEventListener("click", () => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }), document.querySelectorAll(".card__favourite").forEach((e) => {
      e.addEventListener("click", () => e.classList.toggle("is-favourited"));
    }), document.querySelectorAll(".card__overlay-toggle").forEach((e) => {
      e.addEventListener("click", () => {
        e.closest(".card")?.classList.toggle("overlay-active");
      });
    });
  }

  // build/assets/dropdown-CLJX2lrm.js
  function g2() {
    document.querySelectorAll(".dropdown-container").forEach((t2) => {
      const e = t2.querySelector(".dropdown-button"), c = t2.querySelector(".dropdown-button-label"), o2 = t2.querySelector(".dropdown-list"), d2 = document.querySelector("body");
      function r(n3) {
        n3.stopPropagation(), t2.classList.toggle("is-open"), i3();
      }
      function i3() {
        const n3 = o2.clientHeight, a20 = window.innerHeight, p3 = e.getBoundingClientRect().top;
        a20 - p3 < n3 + 50 ? (o2.classList.remove("position-bottom"), o2.classList.add("position-top")) : (o2.classList.remove("position-top"), o2.classList.add("position-bottom"));
      }
      function s3(n3) {
        t2.classList.toggle("is-open"), c.innerText = n3.target.innerText;
      }
      function l3(n3) {
        !o2.contains(n3.target) && t2.classList.contains("is-open") && t2.classList.remove("is-open");
      }
      e.addEventListener("click", r), window.addEventListener("scroll", i3), o2.addEventListener("click", s3), o2.addEventListener("click", s3), d2.addEventListener("click", l3);
    });
  }

  // build/assets/form-UfncnyCl.js
  function _2() {
    document.querySelectorAll(".processForm__hidden-toggle").forEach((e) => {
      const l3 = e.dataset.toggle, t2 = e.querySelector("input"), r = document.getElementById(l3);
      function n3() {
        t2.checked ? r.classList.add("is-revealed") : r.classList.remove("is-revealed");
      }
      n3(), document.addEventListener("click", n3);
    }), document.querySelectorAll("[data-autoresize]").forEach((e) => {
      e.style.boxSizing = "border-box";
      let l3 = e.offsetHeight - e.clientHeight;
      e.addEventListener("input", (t2) => {
        t2.target.style.height = "auto", t2.target.style.height = t2.target.scrollHeight + l3 + "px";
      }), e.removeAttribute("data-autoresize");
    }), document.querySelectorAll(".processForm__range").forEach((e) => {
      const l3 = e.querySelector(".processForm__range-track-inner"), t2 = e.querySelector(".processForm__range-mininput"), r = e.querySelector(".processForm__range-maxinput"), n3 = e.querySelector(".processForm__range-minvalue"), i3 = e.querySelector(".processForm__range-maxvalue"), u3 = 1e3;
      let o2, s3;
      const m3 = () => {
        let a20 = parseInt(t2.min), y3 = parseInt(t2.max) - a20, x4 = parseInt(t2.value), c = 100 / (y3 / (x4 - a20)) + "%";
        l3.style.left = c, n3.style.left = c;
        let S3 = window.getComputedStyle(l3).getPropertyValue("left");
        e.querySelector(".processForm__range-track").style.setProperty("--left-value", S3);
      }, d2 = () => {
        let a20 = parseInt(r.min), y3 = parseInt(r.max) - a20, x4 = parseInt(r.value), c = 100 - 100 / (y3 / (x4 - a20)) + "%";
        l3.style.right = c, i3.style.right = c;
        let S3 = window.getComputedStyle(l3).getPropertyValue("right");
        e.querySelector(".processForm__range-track").style.setProperty("--right-value", S3);
      }, g4 = () => {
        o2 = parseInt(t2.value), n3.innerHTML = o2.toLocaleString("en-US");
      }, p3 = () => {
        s3 = parseInt(r.value), i3.innerHTML = s3.toLocaleString("en-US");
      };
      g4(), p3(), m3(), d2(), t2.addEventListener("input", (a20) => {
        g4(), m3(), t2.style.zIndex = "2", r.style.zIndex = "0", n3.style.zIndex = "2", i3.style.zIndex = "0", s3 - o2 < u3 && (t2.value = s3 - u3, g4(), m3());
      }), r.addEventListener("input", (a20) => {
        p3(), d2(), t2.style.zIndex = "0", r.style.zIndex = "2", n3.style.zIndex = "0", i3.style.zIndex = "2", s3 - o2 < u3 && (r.value = o2 + u3, p3(), d2());
      });
    });
  }

  // build/assets/accordion-CwTFBR5z.js
  var o = () => window.__refreshScrollTriggers?.();
  function f2() {
    const i3 = document.querySelectorAll(".filterSidebar"), t2 = document.querySelectorAll(".filterSidebar__accordion"), l3 = document.querySelectorAll(".accommodationAccordion"), s3 = document.querySelectorAll(".itineraryAccordion"), a20 = document.querySelectorAll(".faqAccordion"), r = window.matchMedia("(max-width: 1199px)");
    i3.forEach((n3) => {
      const c = new x(n3, { onOpen: function() {
        o();
      }, onClose: function() {
        o();
      } });
      r.matches ? c.closeAll() : c.openAll(), window.addEventListener("resize", () => {
        r.matches ? c.closeAll() : c.openAll();
      });
    }), t2.forEach((n3) => {
      new x(n3, { openOnInit: [0], collapse: false, onOpen: function() {
        o();
      }, onClose: function() {
        o();
      } });
    }), l3.forEach((n3) => {
      new x(n3, { onOpen: function() {
        o();
      }, onClose: function() {
        o();
      } });
    }), s3.forEach((n3) => {
      new x(n3, { openOnInit: [0], onOpen: function() {
        o();
      }, onClose: function() {
        o();
      } });
    }), a20.forEach((n3) => {
      new x(n3, { onOpen: function() {
        o();
      }, onClose: function() {
        o();
      } });
    });
  }

  // build/assets/collapse-CBib17UO.js
  var n = () => window.__refreshScrollTriggers?.();
  function i() {
    document.querySelectorAll(".collapse").forEach((e) => {
      const r = e.dataset.collapse, o2 = document.querySelector(`.collapse__btn[data-collapse="${r}"]`), s3 = o2.querySelector(".btn__label"), t2 = e.querySelector(".collapse__container");
      let c = t2.offsetHeight, l3;
      o2.addEventListener("click", () => {
        c = t2.offsetHeight, l3 = !l3, l3 ? (s3.innerHTML = "View less", e.classList.add("is-open"), e.style.height = `${c}px`, n()) : (s3.innerHTML = "View more", e.classList.remove("is-open"), e.style.height = "250px", n());
      });
    });
  }

  // build/assets/vendor-swiper-DiasGK5H.js
  function pe(i3) {
    return i3 !== null && typeof i3 == "object" && "constructor" in i3 && i3.constructor === Object;
  }
  function ue(i3, e) {
    i3 === void 0 && (i3 = {}), e === void 0 && (e = {});
    const t2 = ["__proto__", "constructor", "prototype"];
    Object.keys(e).filter((s3) => t2.indexOf(s3) < 0).forEach((s3) => {
      typeof i3[s3] > "u" ? i3[s3] = e[s3] : pe(e[s3]) && pe(i3[s3]) && Object.keys(e[s3]).length > 0 && ue(i3[s3], e[s3]);
    });
  }
  var Se = { body: {}, addEventListener() {
  }, removeEventListener() {
  }, activeElement: { blur() {
  }, nodeName: "" }, querySelector() {
    return null;
  }, querySelectorAll() {
    return [];
  }, getElementById() {
    return null;
  }, createEvent() {
    return { initEvent() {
    } };
  }, createElement() {
    return { children: [], childNodes: [], style: {}, setAttribute() {
    }, getElementsByTagName() {
      return [];
    } };
  }, createElementNS() {
    return {};
  }, importNode() {
    return null;
  }, location: { hash: "", host: "", hostname: "", href: "", origin: "", pathname: "", protocol: "", search: "" } };
  function H() {
    const i3 = typeof document < "u" ? document : {};
    return ue(i3, Se), i3;
  }
  var ze = { document: Se, navigator: { userAgent: "" }, location: { hash: "", host: "", hostname: "", href: "", origin: "", pathname: "", protocol: "", search: "" }, history: { replaceState() {
  }, pushState() {
  }, go() {
  }, back() {
  } }, CustomEvent: function() {
    return this;
  }, addEventListener() {
  }, removeEventListener() {
  }, getComputedStyle() {
    return { getPropertyValue() {
      return "";
    } };
  }, Image() {
  }, Date() {
  }, screen: {}, setTimeout() {
  }, clearTimeout() {
  }, matchMedia() {
    return {};
  }, requestAnimationFrame(i3) {
    return typeof setTimeout > "u" ? (i3(), null) : setTimeout(i3, 0);
  }, cancelAnimationFrame(i3) {
    typeof setTimeout > "u" || clearTimeout(i3);
  } };
  function V2() {
    const i3 = typeof window < "u" ? window : {};
    return ue(i3, ze), i3;
  }
  function ke(i3) {
    return i3 === void 0 && (i3 = ""), i3.trim().split(" ").filter((e) => !!e.trim());
  }
  function De(i3) {
    const e = i3;
    Object.keys(e).forEach((t2) => {
      try {
        e[t2] = null;
      } catch {
      }
      try {
        delete e[t2];
      } catch {
      }
    });
  }
  function J(i3, e) {
    return e === void 0 && (e = 0), setTimeout(i3, e);
  }
  function j() {
    return Date.now();
  }
  function Ge(i3) {
    const e = V2();
    let t2;
    return e.getComputedStyle && (t2 = e.getComputedStyle(i3, null)), !t2 && i3.currentStyle && (t2 = i3.currentStyle), t2 || (t2 = i3.style), t2;
  }
  function $e(i3, e) {
    e === void 0 && (e = "x");
    const t2 = V2();
    let s3, n3, r;
    const o2 = Ge(i3);
    return t2.WebKitCSSMatrix ? (n3 = o2.transform || o2.webkitTransform, n3.split(",").length > 6 && (n3 = n3.split(", ").map((a20) => a20.replace(",", ".")).join(", ")), r = new t2.WebKitCSSMatrix(n3 === "none" ? "" : n3)) : (r = o2.MozTransform || o2.OTransform || o2.MsTransform || o2.msTransform || o2.transform || o2.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,"), s3 = r.toString().split(",")), e === "x" && (t2.WebKitCSSMatrix ? n3 = r.m41 : s3.length === 16 ? n3 = parseFloat(s3[12]) : n3 = parseFloat(s3[4])), e === "y" && (t2.WebKitCSSMatrix ? n3 = r.m42 : s3.length === 16 ? n3 = parseFloat(s3[13]) : n3 = parseFloat(s3[5])), n3 || 0;
  }
  function K(i3) {
    return typeof i3 == "object" && i3 !== null && i3.constructor && Object.prototype.toString.call(i3).slice(8, -1) === "Object";
  }
  function Be(i3) {
    return typeof window < "u" && typeof window.HTMLElement < "u" ? i3 instanceof HTMLElement : i3 && (i3.nodeType === 1 || i3.nodeType === 11);
  }
  function F() {
    const i3 = Object(arguments.length <= 0 ? void 0 : arguments[0]), e = ["__proto__", "constructor", "prototype"];
    for (let t2 = 1; t2 < arguments.length; t2 += 1) {
      const s3 = t2 < 0 || arguments.length <= t2 ? void 0 : arguments[t2];
      if (s3 != null && !Be(s3)) {
        const n3 = Object.keys(Object(s3)).filter((r) => e.indexOf(r) < 0);
        for (let r = 0, o2 = n3.length; r < o2; r += 1) {
          const a20 = n3[r], d2 = Object.getOwnPropertyDescriptor(s3, a20);
          d2 !== void 0 && d2.enumerable && (K(i3[a20]) && K(s3[a20]) ? s3[a20].__swiper__ ? i3[a20] = s3[a20] : F(i3[a20], s3[a20]) : !K(i3[a20]) && K(s3[a20]) ? (i3[a20] = {}, s3[a20].__swiper__ ? i3[a20] = s3[a20] : F(i3[a20], s3[a20])) : i3[a20] = s3[a20]);
        }
      }
    }
    return i3;
  }
  function Q2(i3, e, t2) {
    i3.style.setProperty(e, t2);
  }
  function Te(i3) {
    let { swiper: e, targetPosition: t2, side: s3 } = i3;
    const n3 = V2(), r = -e.translate;
    let o2 = null, a20;
    const d2 = e.params.speed;
    e.wrapperEl.style.scrollSnapType = "none", n3.cancelAnimationFrame(e.cssModeFrameID);
    const l3 = t2 > r ? "next" : "prev", c = (h2, g4) => l3 === "next" && h2 >= g4 || l3 === "prev" && h2 <= g4, f4 = () => {
      a20 = (/* @__PURE__ */ new Date()).getTime(), o2 === null && (o2 = a20);
      const h2 = Math.max(Math.min((a20 - o2) / d2, 1), 0), g4 = 0.5 - Math.cos(h2 * Math.PI) / 2;
      let m3 = r + g4 * (t2 - r);
      if (c(m3, t2) && (m3 = t2), e.wrapperEl.scrollTo({ [s3]: m3 }), c(m3, t2)) {
        e.wrapperEl.style.overflow = "hidden", e.wrapperEl.style.scrollSnapType = "", setTimeout(() => {
          e.wrapperEl.style.overflow = "", e.wrapperEl.scrollTo({ [s3]: m3 });
        }), n3.cancelAnimationFrame(e.cssModeFrameID);
        return;
      }
      e.cssModeFrameID = n3.requestAnimationFrame(f4);
    };
    f4();
  }
  function ie(i3) {
    return i3.querySelector(".swiper-slide-transform") || i3.shadowRoot && i3.shadowRoot.querySelector(".swiper-slide-transform") || i3;
  }
  function N(i3, e) {
    e === void 0 && (e = "");
    const t2 = V2(), s3 = [...i3.children];
    return t2.HTMLSlotElement && i3 instanceof HTMLSlotElement && s3.push(...i3.assignedElements()), e ? s3.filter((n3) => n3.matches(e)) : s3;
  }
  function Ve(i3, e) {
    const t2 = [e];
    for (; t2.length > 0; ) {
      const s3 = t2.shift();
      if (i3 === s3) return true;
      t2.push(...s3.children, ...s3.shadowRoot ? s3.shadowRoot.children : [], ...s3.assignedElements ? s3.assignedElements() : []);
    }
  }
  function Fe(i3, e) {
    const t2 = V2();
    let s3 = e.contains(i3);
    return !s3 && t2.HTMLSlotElement && e instanceof HTMLSlotElement && (s3 = [...e.assignedElements()].includes(i3), s3 || (s3 = Ve(i3, e))), s3;
  }
  function ee(i3) {
    try {
      console.warn(i3);
      return;
    } catch {
    }
  }
  function Y2(i3, e) {
    e === void 0 && (e = []);
    const t2 = document.createElement(i3);
    return t2.classList.add(...Array.isArray(e) ? e : ke(e)), t2;
  }
  function Ne(i3, e) {
    const t2 = [];
    for (; i3.previousElementSibling; ) {
      const s3 = i3.previousElementSibling;
      e ? s3.matches(e) && t2.push(s3) : t2.push(s3), i3 = s3;
    }
    return t2;
  }
  function _e(i3, e) {
    const t2 = [];
    for (; i3.nextElementSibling; ) {
      const s3 = i3.nextElementSibling;
      e ? s3.matches(e) && t2.push(s3) : t2.push(s3), i3 = s3;
    }
    return t2;
  }
  function R(i3, e) {
    return V2().getComputedStyle(i3, null).getPropertyValue(e);
  }
  function te(i3) {
    let e = i3, t2;
    if (e) {
      for (t2 = 0; (e = e.previousSibling) !== null; ) e.nodeType === 1 && (t2 += 1);
      return t2;
    }
  }
  function be(i3, e) {
    const t2 = [];
    let s3 = i3.parentElement;
    for (; s3; ) e ? s3.matches(e) && t2.push(s3) : t2.push(s3), s3 = s3.parentElement;
    return t2;
  }
  function X(i3, e) {
    function t2(s3) {
      s3.target === i3 && (e.call(i3, s3), i3.removeEventListener("transitionend", t2));
    }
    e && i3.addEventListener("transitionend", t2);
  }
  function ce(i3, e, t2) {
    const s3 = V2();
    return i3[e === "width" ? "offsetWidth" : "offsetHeight"] + parseFloat(s3.getComputedStyle(i3, null).getPropertyValue(e === "width" ? "margin-right" : "margin-top")) + parseFloat(s3.getComputedStyle(i3, null).getPropertyValue(e === "width" ? "margin-left" : "margin-bottom"));
  }
  function $(i3) {
    return (Array.isArray(i3) ? i3 : [i3]).filter((e) => !!e);
  }
  function He(i3) {
    return (e) => Math.abs(e) > 0 && i3.browser && i3.browser.need3dFix && Math.abs(e) % 90 === 0 ? e + 1e-3 : e;
  }
  function me(i3, e) {
    e === void 0 && (e = ""), typeof trustedTypes < "u" ? i3.innerHTML = trustedTypes.createPolicy("html", { createHTML: (t2) => t2 }).createHTML(e) : i3.innerHTML = e;
  }
  var se;
  function Re() {
    const i3 = V2(), e = H();
    return { smoothScroll: e.documentElement && e.documentElement.style && "scrollBehavior" in e.documentElement.style, touch: !!("ontouchstart" in i3 || i3.DocumentTouch && e instanceof i3.DocumentTouch) };
  }
  function xe() {
    return se || (se = Re()), se;
  }
  var re;
  function qe(i3) {
    let { userAgent: e } = i3 === void 0 ? {} : i3;
    const t2 = xe(), s3 = V2(), n3 = s3.navigator.platform, r = e || s3.navigator.userAgent, o2 = { ios: false, android: false }, a20 = s3.screen.width, d2 = s3.screen.height, l3 = r.match(/(Android);?[\s\/]+([\d.]+)?/);
    let c = r.match(/(iPad).*OS\s([\d_]+)/);
    const f4 = r.match(/(iPod)(.*OS\s([\d_]+))?/), h2 = !c && r.match(/(iPhone\sOS|iOS)\s([\d_]+)/), g4 = n3 === "Win32";
    let m3 = n3 === "MacIntel";
    const v3 = ["1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810"];
    return !c && m3 && t2.touch && v3.indexOf(`${a20}x${d2}`) >= 0 && (c = r.match(/(Version)\/([\d.]+)/), c || (c = [0, 1, "13_0_0"]), m3 = false), l3 && !g4 && (o2.os = "android", o2.android = true), (c || h2 || f4) && (o2.os = "ios", o2.ios = true), o2;
  }
  function Ee(i3) {
    return i3 === void 0 && (i3 = {}), re || (re = qe(i3)), re;
  }
  var ne;
  function je() {
    const i3 = V2(), e = Ee();
    let t2 = false;
    function s3() {
      const a20 = i3.navigator.userAgent.toLowerCase();
      return a20.indexOf("safari") >= 0 && a20.indexOf("chrome") < 0 && a20.indexOf("android") < 0;
    }
    if (s3()) {
      const a20 = String(i3.navigator.userAgent);
      if (a20.includes("Version/")) {
        const [d2, l3] = a20.split("Version/")[1].split(" ")[0].split(".").map((c) => Number(c));
        t2 = d2 < 16 || d2 === 16 && l3 < 2;
      }
    }
    const n3 = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(i3.navigator.userAgent), r = s3(), o2 = r || n3 && e.ios;
    return { isSafari: t2 || r, needPerspectiveFix: t2, need3dFix: o2, isWebView: n3 };
  }
  function Me() {
    return ne || (ne = je()), ne;
  }
  function We(i3) {
    let { swiper: e, on: t2, emit: s3 } = i3;
    const n3 = V2();
    let r = null, o2 = null;
    const a20 = () => {
      !e || e.destroyed || !e.initialized || (s3("beforeResize"), s3("resize"));
    }, d2 = () => {
      !e || e.destroyed || !e.initialized || (r = new ResizeObserver((f4) => {
        o2 = n3.requestAnimationFrame(() => {
          const { width: h2, height: g4 } = e;
          let m3 = h2, v3 = g4;
          f4.forEach((S3) => {
            let { contentBoxSize: w4, contentRect: u3, target: p3 } = S3;
            p3 && p3 !== e.el || (m3 = u3 ? u3.width : (w4[0] || w4).inlineSize, v3 = u3 ? u3.height : (w4[0] || w4).blockSize);
          }), (m3 !== h2 || v3 !== g4) && a20();
        });
      }), r.observe(e.el));
    }, l3 = () => {
      o2 && n3.cancelAnimationFrame(o2), r && r.unobserve && e.el && (r.unobserve(e.el), r = null);
    }, c = () => {
      !e || e.destroyed || !e.initialized || s3("orientationchange");
    };
    t2("init", () => {
      if (e.params.resizeObserver && typeof n3.ResizeObserver < "u") {
        d2();
        return;
      }
      n3.addEventListener("resize", a20), n3.addEventListener("orientationchange", c);
    }), t2("destroy", () => {
      l3(), n3.removeEventListener("resize", a20), n3.removeEventListener("orientationchange", c);
    });
  }
  function Xe(i3) {
    let { swiper: e, extendParams: t2, on: s3, emit: n3 } = i3;
    const r = [], o2 = V2(), a20 = function(c, f4) {
      f4 === void 0 && (f4 = {});
      const h2 = o2.MutationObserver || o2.WebkitMutationObserver, g4 = new h2((m3) => {
        if (e.__preventObserver__) return;
        if (m3.length === 1) {
          n3("observerUpdate", m3[0]);
          return;
        }
        const v3 = function() {
          n3("observerUpdate", m3[0]);
        };
        o2.requestAnimationFrame ? o2.requestAnimationFrame(v3) : o2.setTimeout(v3, 0);
      });
      g4.observe(c, { attributes: typeof f4.attributes > "u" ? true : f4.attributes, childList: e.isElement || (typeof f4.childList > "u" ? true : f4).childList, characterData: typeof f4.characterData > "u" ? true : f4.characterData }), r.push(g4);
    }, d2 = () => {
      if (e.params.observer) {
        if (e.params.observeParents) {
          const c = be(e.hostEl);
          for (let f4 = 0; f4 < c.length; f4 += 1) a20(c[f4]);
        }
        a20(e.hostEl, { childList: e.params.observeSlideChildren }), a20(e.wrapperEl, { attributes: false });
      }
    }, l3 = () => {
      r.forEach((c) => {
        c.disconnect();
      }), r.splice(0, r.length);
    };
    t2({ observer: false, observeParents: false, observeSlideChildren: false }), s3("init", d2), s3("destroy", l3);
  }
  var Ye = { on(i3, e, t2) {
    const s3 = this;
    if (!s3.eventsListeners || s3.destroyed || typeof e != "function") return s3;
    const n3 = t2 ? "unshift" : "push";
    return i3.split(" ").forEach((r) => {
      s3.eventsListeners[r] || (s3.eventsListeners[r] = []), s3.eventsListeners[r][n3](e);
    }), s3;
  }, once(i3, e, t2) {
    const s3 = this;
    if (!s3.eventsListeners || s3.destroyed || typeof e != "function") return s3;
    function n3() {
      s3.off(i3, n3), n3.__emitterProxy && delete n3.__emitterProxy;
      for (var r = arguments.length, o2 = new Array(r), a20 = 0; a20 < r; a20++) o2[a20] = arguments[a20];
      e.apply(s3, o2);
    }
    return n3.__emitterProxy = e, s3.on(i3, n3, t2);
  }, onAny(i3, e) {
    const t2 = this;
    if (!t2.eventsListeners || t2.destroyed || typeof i3 != "function") return t2;
    const s3 = e ? "unshift" : "push";
    return t2.eventsAnyListeners.indexOf(i3) < 0 && t2.eventsAnyListeners[s3](i3), t2;
  }, offAny(i3) {
    const e = this;
    if (!e.eventsListeners || e.destroyed || !e.eventsAnyListeners) return e;
    const t2 = e.eventsAnyListeners.indexOf(i3);
    return t2 >= 0 && e.eventsAnyListeners.splice(t2, 1), e;
  }, off(i3, e) {
    const t2 = this;
    return !t2.eventsListeners || t2.destroyed || !t2.eventsListeners || i3.split(" ").forEach((s3) => {
      typeof e > "u" ? t2.eventsListeners[s3] = [] : t2.eventsListeners[s3] && t2.eventsListeners[s3].forEach((n3, r) => {
        (n3 === e || n3.__emitterProxy && n3.__emitterProxy === e) && t2.eventsListeners[s3].splice(r, 1);
      });
    }), t2;
  }, emit() {
    const i3 = this;
    if (!i3.eventsListeners || i3.destroyed || !i3.eventsListeners) return i3;
    let e, t2, s3;
    for (var n3 = arguments.length, r = new Array(n3), o2 = 0; o2 < n3; o2++) r[o2] = arguments[o2];
    return typeof r[0] == "string" || Array.isArray(r[0]) ? (e = r[0], t2 = r.slice(1, r.length), s3 = i3) : (e = r[0].events, t2 = r[0].data, s3 = r[0].context || i3), t2.unshift(s3), (Array.isArray(e) ? e : e.split(" ")).forEach((d2) => {
      i3.eventsAnyListeners && i3.eventsAnyListeners.length && i3.eventsAnyListeners.forEach((l3) => {
        l3.apply(s3, [d2, ...t2]);
      }), i3.eventsListeners && i3.eventsListeners[d2] && i3.eventsListeners[d2].forEach((l3) => {
        l3.apply(s3, t2);
      });
    }), i3;
  } };
  function Ue() {
    const i3 = this;
    let e, t2;
    const s3 = i3.el;
    typeof i3.params.width < "u" && i3.params.width !== null ? e = i3.params.width : e = s3.clientWidth, typeof i3.params.height < "u" && i3.params.height !== null ? t2 = i3.params.height : t2 = s3.clientHeight, !(e === 0 && i3.isHorizontal() || t2 === 0 && i3.isVertical()) && (e = e - parseInt(R(s3, "padding-left") || 0, 10) - parseInt(R(s3, "padding-right") || 0, 10), t2 = t2 - parseInt(R(s3, "padding-top") || 0, 10) - parseInt(R(s3, "padding-bottom") || 0, 10), Number.isNaN(e) && (e = 0), Number.isNaN(t2) && (t2 = 0), Object.assign(i3, { width: e, height: t2, size: i3.isHorizontal() ? e : t2 }));
  }
  function Ke() {
    const i3 = this;
    function e(b4, x4) {
      return parseFloat(b4.getPropertyValue(i3.getDirectionLabel(x4)) || 0);
    }
    const t2 = i3.params, { wrapperEl: s3, slidesEl: n3, size: r, rtlTranslate: o2, wrongRTL: a20 } = i3, d2 = i3.virtual && t2.virtual.enabled, l3 = d2 ? i3.virtual.slides.length : i3.slides.length, c = N(n3, `.${i3.params.slideClass}, swiper-slide`), f4 = d2 ? i3.virtual.slides.length : c.length;
    let h2 = [];
    const g4 = [], m3 = [];
    let v3 = t2.slidesOffsetBefore;
    typeof v3 == "function" && (v3 = t2.slidesOffsetBefore.call(i3));
    let S3 = t2.slidesOffsetAfter;
    typeof S3 == "function" && (S3 = t2.slidesOffsetAfter.call(i3));
    const w4 = i3.snapGrid.length, u3 = i3.slidesGrid.length;
    let p3 = t2.spaceBetween, y3 = -v3, T2 = 0, P3 = 0;
    if (typeof r > "u") return;
    typeof p3 == "string" && p3.indexOf("%") >= 0 ? p3 = parseFloat(p3.replace("%", "")) / 100 * r : typeof p3 == "string" && (p3 = parseFloat(p3)), i3.virtualSize = -p3, c.forEach((b4) => {
      o2 ? b4.style.marginLeft = "" : b4.style.marginRight = "", b4.style.marginBottom = "", b4.style.marginTop = "";
    }), t2.centeredSlides && t2.cssMode && (Q2(s3, "--swiper-centered-offset-before", ""), Q2(s3, "--swiper-centered-offset-after", ""));
    const M4 = t2.grid && t2.grid.rows > 1 && i3.grid;
    M4 ? i3.grid.initSlides(c) : i3.grid && i3.grid.unsetSlides();
    let E5;
    const C4 = t2.slidesPerView === "auto" && t2.breakpoints && Object.keys(t2.breakpoints).filter((b4) => typeof t2.breakpoints[b4].slidesPerView < "u").length > 0;
    for (let b4 = 0; b4 < f4; b4 += 1) {
      E5 = 0;
      let x4;
      if (c[b4] && (x4 = c[b4]), M4 && i3.grid.updateSlide(b4, x4, c), !(c[b4] && R(x4, "display") === "none")) {
        if (t2.slidesPerView === "auto") {
          C4 && (c[b4].style[i3.getDirectionLabel("width")] = "");
          const I2 = getComputedStyle(x4), A4 = x4.style.transform, z2 = x4.style.webkitTransform;
          if (A4 && (x4.style.transform = "none"), z2 && (x4.style.webkitTransform = "none"), t2.roundLengths) E5 = i3.isHorizontal() ? ce(x4, "width") : ce(x4, "height");
          else {
            const k3 = e(I2, "width"), L2 = e(I2, "padding-left"), G3 = e(I2, "padding-right"), O3 = e(I2, "margin-left"), D5 = e(I2, "margin-right"), B3 = I2.getPropertyValue("box-sizing");
            if (B3 && B3 === "border-box") E5 = k3 + O3 + D5;
            else {
              const { clientWidth: q7, offsetWidth: U3 } = x4;
              E5 = k3 + L2 + G3 + O3 + D5 + (U3 - q7);
            }
          }
          A4 && (x4.style.transform = A4), z2 && (x4.style.webkitTransform = z2), t2.roundLengths && (E5 = Math.floor(E5));
        } else E5 = (r - (t2.slidesPerView - 1) * p3) / t2.slidesPerView, t2.roundLengths && (E5 = Math.floor(E5)), c[b4] && (c[b4].style[i3.getDirectionLabel("width")] = `${E5}px`);
        c[b4] && (c[b4].swiperSlideSize = E5), m3.push(E5), t2.centeredSlides ? (y3 = y3 + E5 / 2 + T2 / 2 + p3, T2 === 0 && b4 !== 0 && (y3 = y3 - r / 2 - p3), b4 === 0 && (y3 = y3 - r / 2 - p3), Math.abs(y3) < 1 / 1e3 && (y3 = 0), t2.roundLengths && (y3 = Math.floor(y3)), P3 % t2.slidesPerGroup === 0 && h2.push(y3), g4.push(y3)) : (t2.roundLengths && (y3 = Math.floor(y3)), (P3 - Math.min(i3.params.slidesPerGroupSkip, P3)) % i3.params.slidesPerGroup === 0 && h2.push(y3), g4.push(y3), y3 = y3 + E5 + p3), i3.virtualSize += E5 + p3, T2 = E5, P3 += 1;
      }
    }
    if (i3.virtualSize = Math.max(i3.virtualSize, r) + S3, o2 && a20 && (t2.effect === "slide" || t2.effect === "coverflow") && (s3.style.width = `${i3.virtualSize + p3}px`), t2.setWrapperSize && (s3.style[i3.getDirectionLabel("width")] = `${i3.virtualSize + p3}px`), M4 && i3.grid.updateWrapperSize(E5, h2), !t2.centeredSlides) {
      const b4 = [];
      for (let x4 = 0; x4 < h2.length; x4 += 1) {
        let I2 = h2[x4];
        t2.roundLengths && (I2 = Math.floor(I2)), h2[x4] <= i3.virtualSize - r && b4.push(I2);
      }
      h2 = b4, Math.floor(i3.virtualSize - r) - Math.floor(h2[h2.length - 1]) > 1 && h2.push(i3.virtualSize - r);
    }
    if (d2 && t2.loop) {
      const b4 = m3[0] + p3;
      if (t2.slidesPerGroup > 1) {
        const x4 = Math.ceil((i3.virtual.slidesBefore + i3.virtual.slidesAfter) / t2.slidesPerGroup), I2 = b4 * t2.slidesPerGroup;
        for (let A4 = 0; A4 < x4; A4 += 1) h2.push(h2[h2.length - 1] + I2);
      }
      for (let x4 = 0; x4 < i3.virtual.slidesBefore + i3.virtual.slidesAfter; x4 += 1) t2.slidesPerGroup === 1 && h2.push(h2[h2.length - 1] + b4), g4.push(g4[g4.length - 1] + b4), i3.virtualSize += b4;
    }
    if (h2.length === 0 && (h2 = [0]), p3 !== 0) {
      const b4 = i3.isHorizontal() && o2 ? "marginLeft" : i3.getDirectionLabel("marginRight");
      c.filter((x4, I2) => !t2.cssMode || t2.loop ? true : I2 !== c.length - 1).forEach((x4) => {
        x4.style[b4] = `${p3}px`;
      });
    }
    if (t2.centeredSlides && t2.centeredSlidesBounds) {
      let b4 = 0;
      m3.forEach((I2) => {
        b4 += I2 + (p3 || 0);
      }), b4 -= p3;
      const x4 = b4 > r ? b4 - r : 0;
      h2 = h2.map((I2) => I2 <= 0 ? -v3 : I2 > x4 ? x4 + S3 : I2);
    }
    if (t2.centerInsufficientSlides) {
      let b4 = 0;
      m3.forEach((I2) => {
        b4 += I2 + (p3 || 0);
      }), b4 -= p3;
      const x4 = (t2.slidesOffsetBefore || 0) + (t2.slidesOffsetAfter || 0);
      if (b4 + x4 < r) {
        const I2 = (r - b4 - x4) / 2;
        h2.forEach((A4, z2) => {
          h2[z2] = A4 - I2;
        }), g4.forEach((A4, z2) => {
          g4[z2] = A4 + I2;
        });
      }
    }
    if (Object.assign(i3, { slides: c, snapGrid: h2, slidesGrid: g4, slidesSizesGrid: m3 }), t2.centeredSlides && t2.cssMode && !t2.centeredSlidesBounds) {
      Q2(s3, "--swiper-centered-offset-before", `${-h2[0]}px`), Q2(s3, "--swiper-centered-offset-after", `${i3.size / 2 - m3[m3.length - 1] / 2}px`);
      const b4 = -i3.snapGrid[0], x4 = -i3.slidesGrid[0];
      i3.snapGrid = i3.snapGrid.map((I2) => I2 + b4), i3.slidesGrid = i3.slidesGrid.map((I2) => I2 + x4);
    }
    if (f4 !== l3 && i3.emit("slidesLengthChange"), h2.length !== w4 && (i3.params.watchOverflow && i3.checkOverflow(), i3.emit("snapGridLengthChange")), g4.length !== u3 && i3.emit("slidesGridLengthChange"), t2.watchSlidesProgress && i3.updateSlidesOffset(), i3.emit("slidesUpdated"), !d2 && !t2.cssMode && (t2.effect === "slide" || t2.effect === "fade")) {
      const b4 = `${t2.containerModifierClass}backface-hidden`, x4 = i3.el.classList.contains(b4);
      f4 <= t2.maxBackfaceHiddenSlides ? x4 || i3.el.classList.add(b4) : x4 && i3.el.classList.remove(b4);
    }
  }
  function Qe(i3) {
    const e = this, t2 = [], s3 = e.virtual && e.params.virtual.enabled;
    let n3 = 0, r;
    typeof i3 == "number" ? e.setTransition(i3) : i3 === true && e.setTransition(e.params.speed);
    const o2 = (a20) => s3 ? e.slides[e.getSlideIndexByData(a20)] : e.slides[a20];
    if (e.params.slidesPerView !== "auto" && e.params.slidesPerView > 1) if (e.params.centeredSlides) (e.visibleSlides || []).forEach((a20) => {
      t2.push(a20);
    });
    else for (r = 0; r < Math.ceil(e.params.slidesPerView); r += 1) {
      const a20 = e.activeIndex + r;
      if (a20 > e.slides.length && !s3) break;
      t2.push(o2(a20));
    }
    else t2.push(o2(e.activeIndex));
    for (r = 0; r < t2.length; r += 1) if (typeof t2[r] < "u") {
      const a20 = t2[r].offsetHeight;
      n3 = a20 > n3 ? a20 : n3;
    }
    (n3 || n3 === 0) && (e.wrapperEl.style.height = `${n3}px`);
  }
  function Ze() {
    const i3 = this, e = i3.slides, t2 = i3.isElement ? i3.isHorizontal() ? i3.wrapperEl.offsetLeft : i3.wrapperEl.offsetTop : 0;
    for (let s3 = 0; s3 < e.length; s3 += 1) e[s3].swiperSlideOffset = (i3.isHorizontal() ? e[s3].offsetLeft : e[s3].offsetTop) - t2 - i3.cssOverflowAdjustment();
  }
  var he = (i3, e, t2) => {
    e && !i3.classList.contains(t2) ? i3.classList.add(t2) : !e && i3.classList.contains(t2) && i3.classList.remove(t2);
  };
  function Je(i3) {
    i3 === void 0 && (i3 = this && this.translate || 0);
    const e = this, t2 = e.params, { slides: s3, rtlTranslate: n3, snapGrid: r } = e;
    if (s3.length === 0) return;
    typeof s3[0].swiperSlideOffset > "u" && e.updateSlidesOffset();
    let o2 = -i3;
    n3 && (o2 = i3), e.visibleSlidesIndexes = [], e.visibleSlides = [];
    let a20 = t2.spaceBetween;
    typeof a20 == "string" && a20.indexOf("%") >= 0 ? a20 = parseFloat(a20.replace("%", "")) / 100 * e.size : typeof a20 == "string" && (a20 = parseFloat(a20));
    for (let d2 = 0; d2 < s3.length; d2 += 1) {
      const l3 = s3[d2];
      let c = l3.swiperSlideOffset;
      t2.cssMode && t2.centeredSlides && (c -= s3[0].swiperSlideOffset);
      const f4 = (o2 + (t2.centeredSlides ? e.minTranslate() : 0) - c) / (l3.swiperSlideSize + a20), h2 = (o2 - r[0] + (t2.centeredSlides ? e.minTranslate() : 0) - c) / (l3.swiperSlideSize + a20), g4 = -(o2 - c), m3 = g4 + e.slidesSizesGrid[d2], v3 = g4 >= 0 && g4 <= e.size - e.slidesSizesGrid[d2], S3 = g4 >= 0 && g4 < e.size - 1 || m3 > 1 && m3 <= e.size || g4 <= 0 && m3 >= e.size;
      S3 && (e.visibleSlides.push(l3), e.visibleSlidesIndexes.push(d2)), he(l3, S3, t2.slideVisibleClass), he(l3, v3, t2.slideFullyVisibleClass), l3.progress = n3 ? -f4 : f4, l3.originalProgress = n3 ? -h2 : h2;
    }
  }
  function et(i3) {
    const e = this;
    if (typeof i3 > "u") {
      const c = e.rtlTranslate ? -1 : 1;
      i3 = e && e.translate && e.translate * c || 0;
    }
    const t2 = e.params, s3 = e.maxTranslate() - e.minTranslate();
    let { progress: n3, isBeginning: r, isEnd: o2, progressLoop: a20 } = e;
    const d2 = r, l3 = o2;
    if (s3 === 0) n3 = 0, r = true, o2 = true;
    else {
      n3 = (i3 - e.minTranslate()) / s3;
      const c = Math.abs(i3 - e.minTranslate()) < 1, f4 = Math.abs(i3 - e.maxTranslate()) < 1;
      r = c || n3 <= 0, o2 = f4 || n3 >= 1, c && (n3 = 0), f4 && (n3 = 1);
    }
    if (t2.loop) {
      const c = e.getSlideIndexByData(0), f4 = e.getSlideIndexByData(e.slides.length - 1), h2 = e.slidesGrid[c], g4 = e.slidesGrid[f4], m3 = e.slidesGrid[e.slidesGrid.length - 1], v3 = Math.abs(i3);
      v3 >= h2 ? a20 = (v3 - h2) / m3 : a20 = (v3 + m3 - g4) / m3, a20 > 1 && (a20 -= 1);
    }
    Object.assign(e, { progress: n3, progressLoop: a20, isBeginning: r, isEnd: o2 }), (t2.watchSlidesProgress || t2.centeredSlides && t2.autoHeight) && e.updateSlidesProgress(i3), r && !d2 && e.emit("reachBeginning toEdge"), o2 && !l3 && e.emit("reachEnd toEdge"), (d2 && !r || l3 && !o2) && e.emit("fromEdge"), e.emit("progress", n3);
  }
  var ae = (i3, e, t2) => {
    e && !i3.classList.contains(t2) ? i3.classList.add(t2) : !e && i3.classList.contains(t2) && i3.classList.remove(t2);
  };
  function tt() {
    const i3 = this, { slides: e, params: t2, slidesEl: s3, activeIndex: n3 } = i3, r = i3.virtual && t2.virtual.enabled, o2 = i3.grid && t2.grid && t2.grid.rows > 1, a20 = (f4) => N(s3, `.${t2.slideClass}${f4}, swiper-slide${f4}`)[0];
    let d2, l3, c;
    if (r) if (t2.loop) {
      let f4 = n3 - i3.virtual.slidesBefore;
      f4 < 0 && (f4 = i3.virtual.slides.length + f4), f4 >= i3.virtual.slides.length && (f4 -= i3.virtual.slides.length), d2 = a20(`[data-swiper-slide-index="${f4}"]`);
    } else d2 = a20(`[data-swiper-slide-index="${n3}"]`);
    else o2 ? (d2 = e.find((f4) => f4.column === n3), c = e.find((f4) => f4.column === n3 + 1), l3 = e.find((f4) => f4.column === n3 - 1)) : d2 = e[n3];
    d2 && (o2 || (c = _e(d2, `.${t2.slideClass}, swiper-slide`)[0], t2.loop && !c && (c = e[0]), l3 = Ne(d2, `.${t2.slideClass}, swiper-slide`)[0], t2.loop && !l3 === 0 && (l3 = e[e.length - 1]))), e.forEach((f4) => {
      ae(f4, f4 === d2, t2.slideActiveClass), ae(f4, f4 === c, t2.slideNextClass), ae(f4, f4 === l3, t2.slidePrevClass);
    }), i3.emitSlidesClasses();
  }
  var Z = (i3, e) => {
    if (!i3 || i3.destroyed || !i3.params) return;
    const t2 = () => i3.isElement ? "swiper-slide" : `.${i3.params.slideClass}`, s3 = e.closest(t2());
    if (s3) {
      let n3 = s3.querySelector(`.${i3.params.lazyPreloaderClass}`);
      !n3 && i3.isElement && (s3.shadowRoot ? n3 = s3.shadowRoot.querySelector(`.${i3.params.lazyPreloaderClass}`) : requestAnimationFrame(() => {
        s3.shadowRoot && (n3 = s3.shadowRoot.querySelector(`.${i3.params.lazyPreloaderClass}`), n3 && n3.remove());
      })), n3 && n3.remove();
    }
  };
  var le = (i3, e) => {
    if (!i3.slides[e]) return;
    const t2 = i3.slides[e].querySelector('[loading="lazy"]');
    t2 && t2.removeAttribute("loading");
  };
  var fe = (i3) => {
    if (!i3 || i3.destroyed || !i3.params) return;
    let e = i3.params.lazyPreloadPrevNext;
    const t2 = i3.slides.length;
    if (!t2 || !e || e < 0) return;
    e = Math.min(e, t2);
    const s3 = i3.params.slidesPerView === "auto" ? i3.slidesPerViewDynamic() : Math.ceil(i3.params.slidesPerView), n3 = i3.activeIndex;
    if (i3.params.grid && i3.params.grid.rows > 1) {
      const o2 = n3, a20 = [o2 - e];
      a20.push(...Array.from({ length: e }).map((d2, l3) => o2 + s3 + l3)), i3.slides.forEach((d2, l3) => {
        a20.includes(d2.column) && le(i3, l3);
      });
      return;
    }
    const r = n3 + s3 - 1;
    if (i3.params.rewind || i3.params.loop) for (let o2 = n3 - e; o2 <= r + e; o2 += 1) {
      const a20 = (o2 % t2 + t2) % t2;
      (a20 < n3 || a20 > r) && le(i3, a20);
    }
    else for (let o2 = Math.max(n3 - e, 0); o2 <= Math.min(r + e, t2 - 1); o2 += 1) o2 !== n3 && (o2 > r || o2 < n3) && le(i3, o2);
  };
  function it(i3) {
    const { slidesGrid: e, params: t2 } = i3, s3 = i3.rtlTranslate ? i3.translate : -i3.translate;
    let n3;
    for (let r = 0; r < e.length; r += 1) typeof e[r + 1] < "u" ? s3 >= e[r] && s3 < e[r + 1] - (e[r + 1] - e[r]) / 2 ? n3 = r : s3 >= e[r] && s3 < e[r + 1] && (n3 = r + 1) : s3 >= e[r] && (n3 = r);
    return t2.normalizeSlideIndex && (n3 < 0 || typeof n3 > "u") && (n3 = 0), n3;
  }
  function st(i3) {
    const e = this, t2 = e.rtlTranslate ? e.translate : -e.translate, { snapGrid: s3, params: n3, activeIndex: r, realIndex: o2, snapIndex: a20 } = e;
    let d2 = i3, l3;
    const c = (g4) => {
      let m3 = g4 - e.virtual.slidesBefore;
      return m3 < 0 && (m3 = e.virtual.slides.length + m3), m3 >= e.virtual.slides.length && (m3 -= e.virtual.slides.length), m3;
    };
    if (typeof d2 > "u" && (d2 = it(e)), s3.indexOf(t2) >= 0) l3 = s3.indexOf(t2);
    else {
      const g4 = Math.min(n3.slidesPerGroupSkip, d2);
      l3 = g4 + Math.floor((d2 - g4) / n3.slidesPerGroup);
    }
    if (l3 >= s3.length && (l3 = s3.length - 1), d2 === r && !e.params.loop) {
      l3 !== a20 && (e.snapIndex = l3, e.emit("snapIndexChange"));
      return;
    }
    if (d2 === r && e.params.loop && e.virtual && e.params.virtual.enabled) {
      e.realIndex = c(d2);
      return;
    }
    const f4 = e.grid && n3.grid && n3.grid.rows > 1;
    let h2;
    if (e.virtual && n3.virtual.enabled && n3.loop) h2 = c(d2);
    else if (f4) {
      const g4 = e.slides.find((v3) => v3.column === d2);
      let m3 = parseInt(g4.getAttribute("data-swiper-slide-index"), 10);
      Number.isNaN(m3) && (m3 = Math.max(e.slides.indexOf(g4), 0)), h2 = Math.floor(m3 / n3.grid.rows);
    } else if (e.slides[d2]) {
      const g4 = e.slides[d2].getAttribute("data-swiper-slide-index");
      g4 ? h2 = parseInt(g4, 10) : h2 = d2;
    } else h2 = d2;
    Object.assign(e, { previousSnapIndex: a20, snapIndex: l3, previousRealIndex: o2, realIndex: h2, previousIndex: r, activeIndex: d2 }), e.initialized && fe(e), e.emit("activeIndexChange"), e.emit("snapIndexChange"), (e.initialized || e.params.runCallbacksOnInit) && (o2 !== h2 && e.emit("realIndexChange"), e.emit("slideChange"));
  }
  function rt(i3, e) {
    const t2 = this, s3 = t2.params;
    let n3 = i3.closest(`.${s3.slideClass}, swiper-slide`);
    !n3 && t2.isElement && e && e.length > 1 && e.includes(i3) && [...e.slice(e.indexOf(i3) + 1, e.length)].forEach((a20) => {
      !n3 && a20.matches && a20.matches(`.${s3.slideClass}, swiper-slide`) && (n3 = a20);
    });
    let r = false, o2;
    if (n3) {
      for (let a20 = 0; a20 < t2.slides.length; a20 += 1) if (t2.slides[a20] === n3) {
        r = true, o2 = a20;
        break;
      }
    }
    if (n3 && r) t2.clickedSlide = n3, t2.virtual && t2.params.virtual.enabled ? t2.clickedIndex = parseInt(n3.getAttribute("data-swiper-slide-index"), 10) : t2.clickedIndex = o2;
    else {
      t2.clickedSlide = void 0, t2.clickedIndex = void 0;
      return;
    }
    s3.slideToClickedSlide && t2.clickedIndex !== void 0 && t2.clickedIndex !== t2.activeIndex && t2.slideToClickedSlide();
  }
  var nt = { updateSize: Ue, updateSlides: Ke, updateAutoHeight: Qe, updateSlidesOffset: Ze, updateSlidesProgress: Je, updateProgress: et, updateSlidesClasses: tt, updateActiveIndex: st, updateClickedSlide: rt };
  function at(i3) {
    i3 === void 0 && (i3 = this.isHorizontal() ? "x" : "y");
    const e = this, { params: t2, rtlTranslate: s3, translate: n3, wrapperEl: r } = e;
    if (t2.virtualTranslate) return s3 ? -n3 : n3;
    if (t2.cssMode) return n3;
    let o2 = $e(r, i3);
    return o2 += e.cssOverflowAdjustment(), s3 && (o2 = -o2), o2 || 0;
  }
  function lt(i3, e) {
    const t2 = this, { rtlTranslate: s3, params: n3, wrapperEl: r, progress: o2 } = t2;
    let a20 = 0, d2 = 0;
    const l3 = 0;
    t2.isHorizontal() ? a20 = s3 ? -i3 : i3 : d2 = i3, n3.roundLengths && (a20 = Math.floor(a20), d2 = Math.floor(d2)), t2.previousTranslate = t2.translate, t2.translate = t2.isHorizontal() ? a20 : d2, n3.cssMode ? r[t2.isHorizontal() ? "scrollLeft" : "scrollTop"] = t2.isHorizontal() ? -a20 : -d2 : n3.virtualTranslate || (t2.isHorizontal() ? a20 -= t2.cssOverflowAdjustment() : d2 -= t2.cssOverflowAdjustment(), r.style.transform = `translate3d(${a20}px, ${d2}px, ${l3}px)`);
    let c;
    const f4 = t2.maxTranslate() - t2.minTranslate();
    f4 === 0 ? c = 0 : c = (i3 - t2.minTranslate()) / f4, c !== o2 && t2.updateProgress(i3), t2.emit("setTranslate", t2.translate, e);
  }
  function ot() {
    return -this.snapGrid[0];
  }
  function dt() {
    return -this.snapGrid[this.snapGrid.length - 1];
  }
  function ct(i3, e, t2, s3, n3) {
    i3 === void 0 && (i3 = 0), e === void 0 && (e = this.params.speed), t2 === void 0 && (t2 = true), s3 === void 0 && (s3 = true);
    const r = this, { params: o2, wrapperEl: a20 } = r;
    if (r.animating && o2.preventInteractionOnTransition) return false;
    const d2 = r.minTranslate(), l3 = r.maxTranslate();
    let c;
    if (s3 && i3 > d2 ? c = d2 : s3 && i3 < l3 ? c = l3 : c = i3, r.updateProgress(c), o2.cssMode) {
      const f4 = r.isHorizontal();
      if (e === 0) a20[f4 ? "scrollLeft" : "scrollTop"] = -c;
      else {
        if (!r.support.smoothScroll) return Te({ swiper: r, targetPosition: -c, side: f4 ? "left" : "top" }), true;
        a20.scrollTo({ [f4 ? "left" : "top"]: -c, behavior: "smooth" });
      }
      return true;
    }
    return e === 0 ? (r.setTransition(0), r.setTranslate(c), t2 && (r.emit("beforeTransitionStart", e, n3), r.emit("transitionEnd"))) : (r.setTransition(e), r.setTranslate(c), t2 && (r.emit("beforeTransitionStart", e, n3), r.emit("transitionStart")), r.animating || (r.animating = true, r.onTranslateToWrapperTransitionEnd || (r.onTranslateToWrapperTransitionEnd = function(h2) {
      !r || r.destroyed || h2.target === this && (r.wrapperEl.removeEventListener("transitionend", r.onTranslateToWrapperTransitionEnd), r.onTranslateToWrapperTransitionEnd = null, delete r.onTranslateToWrapperTransitionEnd, r.animating = false, t2 && r.emit("transitionEnd"));
    }), r.wrapperEl.addEventListener("transitionend", r.onTranslateToWrapperTransitionEnd))), true;
  }
  var ft = { getTranslate: at, setTranslate: lt, minTranslate: ot, maxTranslate: dt, translateTo: ct };
  function ut(i3, e) {
    const t2 = this;
    t2.params.cssMode || (t2.wrapperEl.style.transitionDuration = `${i3}ms`, t2.wrapperEl.style.transitionDelay = i3 === 0 ? "0ms" : ""), t2.emit("setTransition", i3, e);
  }
  function Pe(i3) {
    let { swiper: e, runCallbacks: t2, direction: s3, step: n3 } = i3;
    const { activeIndex: r, previousIndex: o2 } = e;
    let a20 = s3;
    a20 || (r > o2 ? a20 = "next" : r < o2 ? a20 = "prev" : a20 = "reset"), e.emit(`transition${n3}`), t2 && a20 === "reset" ? e.emit(`slideResetTransition${n3}`) : t2 && r !== o2 && (e.emit(`slideChangeTransition${n3}`), a20 === "next" ? e.emit(`slideNextTransition${n3}`) : e.emit(`slidePrevTransition${n3}`));
  }
  function pt(i3, e) {
    i3 === void 0 && (i3 = true);
    const t2 = this, { params: s3 } = t2;
    s3.cssMode || (s3.autoHeight && t2.updateAutoHeight(), Pe({ swiper: t2, runCallbacks: i3, direction: e, step: "Start" }));
  }
  function mt(i3, e) {
    i3 === void 0 && (i3 = true);
    const t2 = this, { params: s3 } = t2;
    t2.animating = false, !s3.cssMode && (t2.setTransition(0), Pe({ swiper: t2, runCallbacks: i3, direction: e, step: "End" }));
  }
  var ht = { setTransition: ut, transitionStart: pt, transitionEnd: mt };
  function gt(i3, e, t2, s3, n3) {
    i3 === void 0 && (i3 = 0), t2 === void 0 && (t2 = true), typeof i3 == "string" && (i3 = parseInt(i3, 10));
    const r = this;
    let o2 = i3;
    o2 < 0 && (o2 = 0);
    const { params: a20, snapGrid: d2, slidesGrid: l3, previousIndex: c, activeIndex: f4, rtlTranslate: h2, wrapperEl: g4, enabled: m3 } = r;
    if (!m3 && !s3 && !n3 || r.destroyed || r.animating && a20.preventInteractionOnTransition) return false;
    typeof e > "u" && (e = r.params.speed);
    const v3 = Math.min(r.params.slidesPerGroupSkip, o2);
    let S3 = v3 + Math.floor((o2 - v3) / r.params.slidesPerGroup);
    S3 >= d2.length && (S3 = d2.length - 1);
    const w4 = -d2[S3];
    if (a20.normalizeSlideIndex) for (let M4 = 0; M4 < l3.length; M4 += 1) {
      const E5 = -Math.floor(w4 * 100), C4 = Math.floor(l3[M4] * 100), b4 = Math.floor(l3[M4 + 1] * 100);
      typeof l3[M4 + 1] < "u" ? E5 >= C4 && E5 < b4 - (b4 - C4) / 2 ? o2 = M4 : E5 >= C4 && E5 < b4 && (o2 = M4 + 1) : E5 >= C4 && (o2 = M4);
    }
    if (r.initialized && o2 !== f4 && (!r.allowSlideNext && (h2 ? w4 > r.translate && w4 > r.minTranslate() : w4 < r.translate && w4 < r.minTranslate()) || !r.allowSlidePrev && w4 > r.translate && w4 > r.maxTranslate() && (f4 || 0) !== o2)) return false;
    o2 !== (c || 0) && t2 && r.emit("beforeSlideChangeStart"), r.updateProgress(w4);
    let u3;
    o2 > f4 ? u3 = "next" : o2 < f4 ? u3 = "prev" : u3 = "reset";
    const p3 = r.virtual && r.params.virtual.enabled;
    if (!(p3 && n3) && (h2 && -w4 === r.translate || !h2 && w4 === r.translate)) return r.updateActiveIndex(o2), a20.autoHeight && r.updateAutoHeight(), r.updateSlidesClasses(), a20.effect !== "slide" && r.setTranslate(w4), u3 !== "reset" && (r.transitionStart(t2, u3), r.transitionEnd(t2, u3)), false;
    if (a20.cssMode) {
      const M4 = r.isHorizontal(), E5 = h2 ? w4 : -w4;
      if (e === 0) p3 && (r.wrapperEl.style.scrollSnapType = "none", r._immediateVirtual = true), p3 && !r._cssModeVirtualInitialSet && r.params.initialSlide > 0 ? (r._cssModeVirtualInitialSet = true, requestAnimationFrame(() => {
        g4[M4 ? "scrollLeft" : "scrollTop"] = E5;
      })) : g4[M4 ? "scrollLeft" : "scrollTop"] = E5, p3 && requestAnimationFrame(() => {
        r.wrapperEl.style.scrollSnapType = "", r._immediateVirtual = false;
      });
      else {
        if (!r.support.smoothScroll) return Te({ swiper: r, targetPosition: E5, side: M4 ? "left" : "top" }), true;
        g4.scrollTo({ [M4 ? "left" : "top"]: E5, behavior: "smooth" });
      }
      return true;
    }
    const P3 = Me().isSafari;
    return p3 && !n3 && P3 && r.isElement && r.virtual.update(false, false, o2), r.setTransition(e), r.setTranslate(w4), r.updateActiveIndex(o2), r.updateSlidesClasses(), r.emit("beforeTransitionStart", e, s3), r.transitionStart(t2, u3), e === 0 ? r.transitionEnd(t2, u3) : r.animating || (r.animating = true, r.onSlideToWrapperTransitionEnd || (r.onSlideToWrapperTransitionEnd = function(E5) {
      !r || r.destroyed || E5.target === this && (r.wrapperEl.removeEventListener("transitionend", r.onSlideToWrapperTransitionEnd), r.onSlideToWrapperTransitionEnd = null, delete r.onSlideToWrapperTransitionEnd, r.transitionEnd(t2, u3));
    }), r.wrapperEl.addEventListener("transitionend", r.onSlideToWrapperTransitionEnd)), true;
  }
  function vt(i3, e, t2, s3) {
    i3 === void 0 && (i3 = 0), t2 === void 0 && (t2 = true), typeof i3 == "string" && (i3 = parseInt(i3, 10));
    const n3 = this;
    if (n3.destroyed) return;
    typeof e > "u" && (e = n3.params.speed);
    const r = n3.grid && n3.params.grid && n3.params.grid.rows > 1;
    let o2 = i3;
    if (n3.params.loop) if (n3.virtual && n3.params.virtual.enabled) o2 = o2 + n3.virtual.slidesBefore;
    else {
      let a20;
      if (r) {
        const h2 = o2 * n3.params.grid.rows;
        a20 = n3.slides.find((g4) => g4.getAttribute("data-swiper-slide-index") * 1 === h2).column;
      } else a20 = n3.getSlideIndexByData(o2);
      const d2 = r ? Math.ceil(n3.slides.length / n3.params.grid.rows) : n3.slides.length, { centeredSlides: l3 } = n3.params;
      let c = n3.params.slidesPerView;
      c === "auto" ? c = n3.slidesPerViewDynamic() : (c = Math.ceil(parseFloat(n3.params.slidesPerView, 10)), l3 && c % 2 === 0 && (c = c + 1));
      let f4 = d2 - a20 < c;
      if (l3 && (f4 = f4 || a20 < Math.ceil(c / 2)), s3 && l3 && n3.params.slidesPerView !== "auto" && !r && (f4 = false), f4) {
        const h2 = l3 ? a20 < n3.activeIndex ? "prev" : "next" : a20 - n3.activeIndex - 1 < n3.params.slidesPerView ? "next" : "prev";
        n3.loopFix({ direction: h2, slideTo: true, activeSlideIndex: h2 === "next" ? a20 + 1 : a20 - d2 + 1, slideRealIndex: h2 === "next" ? n3.realIndex : void 0 });
      }
      if (r) {
        const h2 = o2 * n3.params.grid.rows;
        o2 = n3.slides.find((g4) => g4.getAttribute("data-swiper-slide-index") * 1 === h2).column;
      } else o2 = n3.getSlideIndexByData(o2);
    }
    return requestAnimationFrame(() => {
      n3.slideTo(o2, e, t2, s3);
    }), n3;
  }
  function wt(i3, e, t2) {
    e === void 0 && (e = true);
    const s3 = this, { enabled: n3, params: r, animating: o2 } = s3;
    if (!n3 || s3.destroyed) return s3;
    typeof i3 > "u" && (i3 = s3.params.speed);
    let a20 = r.slidesPerGroup;
    r.slidesPerView === "auto" && r.slidesPerGroup === 1 && r.slidesPerGroupAuto && (a20 = Math.max(s3.slidesPerViewDynamic("current", true), 1));
    const d2 = s3.activeIndex < r.slidesPerGroupSkip ? 1 : a20, l3 = s3.virtual && r.virtual.enabled;
    if (r.loop) {
      if (o2 && !l3 && r.loopPreventsSliding) return false;
      if (s3.loopFix({ direction: "next" }), s3._clientLeft = s3.wrapperEl.clientLeft, s3.activeIndex === s3.slides.length - 1 && r.cssMode) return requestAnimationFrame(() => {
        s3.slideTo(s3.activeIndex + d2, i3, e, t2);
      }), true;
    }
    return r.rewind && s3.isEnd ? s3.slideTo(0, i3, e, t2) : s3.slideTo(s3.activeIndex + d2, i3, e, t2);
  }
  function yt(i3, e, t2) {
    e === void 0 && (e = true);
    const s3 = this, { params: n3, snapGrid: r, slidesGrid: o2, rtlTranslate: a20, enabled: d2, animating: l3 } = s3;
    if (!d2 || s3.destroyed) return s3;
    typeof i3 > "u" && (i3 = s3.params.speed);
    const c = s3.virtual && n3.virtual.enabled;
    if (n3.loop) {
      if (l3 && !c && n3.loopPreventsSliding) return false;
      s3.loopFix({ direction: "prev" }), s3._clientLeft = s3.wrapperEl.clientLeft;
    }
    const f4 = a20 ? s3.translate : -s3.translate;
    function h2(u3) {
      return u3 < 0 ? -Math.floor(Math.abs(u3)) : Math.floor(u3);
    }
    const g4 = h2(f4), m3 = r.map((u3) => h2(u3)), v3 = n3.freeMode && n3.freeMode.enabled;
    let S3 = r[m3.indexOf(g4) - 1];
    if (typeof S3 > "u" && (n3.cssMode || v3)) {
      let u3;
      r.forEach((p3, y3) => {
        g4 >= p3 && (u3 = y3);
      }), typeof u3 < "u" && (S3 = v3 ? r[u3] : r[u3 > 0 ? u3 - 1 : u3]);
    }
    let w4 = 0;
    if (typeof S3 < "u" && (w4 = o2.indexOf(S3), w4 < 0 && (w4 = s3.activeIndex - 1), n3.slidesPerView === "auto" && n3.slidesPerGroup === 1 && n3.slidesPerGroupAuto && (w4 = w4 - s3.slidesPerViewDynamic("previous", true) + 1, w4 = Math.max(w4, 0))), n3.rewind && s3.isBeginning) {
      const u3 = s3.params.virtual && s3.params.virtual.enabled && s3.virtual ? s3.virtual.slides.length - 1 : s3.slides.length - 1;
      return s3.slideTo(u3, i3, e, t2);
    } else if (n3.loop && s3.activeIndex === 0 && n3.cssMode) return requestAnimationFrame(() => {
      s3.slideTo(w4, i3, e, t2);
    }), true;
    return s3.slideTo(w4, i3, e, t2);
  }
  function St(i3, e, t2) {
    e === void 0 && (e = true);
    const s3 = this;
    if (!s3.destroyed) return typeof i3 > "u" && (i3 = s3.params.speed), s3.slideTo(s3.activeIndex, i3, e, t2);
  }
  function Tt(i3, e, t2, s3) {
    e === void 0 && (e = true), s3 === void 0 && (s3 = 0.5);
    const n3 = this;
    if (n3.destroyed) return;
    typeof i3 > "u" && (i3 = n3.params.speed);
    let r = n3.activeIndex;
    const o2 = Math.min(n3.params.slidesPerGroupSkip, r), a20 = o2 + Math.floor((r - o2) / n3.params.slidesPerGroup), d2 = n3.rtlTranslate ? n3.translate : -n3.translate;
    if (d2 >= n3.snapGrid[a20]) {
      const l3 = n3.snapGrid[a20], c = n3.snapGrid[a20 + 1];
      d2 - l3 > (c - l3) * s3 && (r += n3.params.slidesPerGroup);
    } else {
      const l3 = n3.snapGrid[a20 - 1], c = n3.snapGrid[a20];
      d2 - l3 <= (c - l3) * s3 && (r -= n3.params.slidesPerGroup);
    }
    return r = Math.max(r, 0), r = Math.min(r, n3.slidesGrid.length - 1), n3.slideTo(r, i3, e, t2);
  }
  function bt() {
    const i3 = this;
    if (i3.destroyed) return;
    const { params: e, slidesEl: t2 } = i3, s3 = e.slidesPerView === "auto" ? i3.slidesPerViewDynamic() : e.slidesPerView;
    let n3 = i3.clickedIndex, r;
    const o2 = i3.isElement ? "swiper-slide" : `.${e.slideClass}`;
    if (e.loop) {
      if (i3.animating) return;
      r = parseInt(i3.clickedSlide.getAttribute("data-swiper-slide-index"), 10), e.centeredSlides ? n3 < i3.loopedSlides - s3 / 2 || n3 > i3.slides.length - i3.loopedSlides + s3 / 2 ? (i3.loopFix(), n3 = i3.getSlideIndex(N(t2, `${o2}[data-swiper-slide-index="${r}"]`)[0]), J(() => {
        i3.slideTo(n3);
      })) : i3.slideTo(n3) : n3 > i3.slides.length - s3 ? (i3.loopFix(), n3 = i3.getSlideIndex(N(t2, `${o2}[data-swiper-slide-index="${r}"]`)[0]), J(() => {
        i3.slideTo(n3);
      })) : i3.slideTo(n3);
    } else i3.slideTo(n3);
  }
  var xt = { slideTo: gt, slideToLoop: vt, slideNext: wt, slidePrev: yt, slideReset: St, slideToClosest: Tt, slideToClickedSlide: bt };
  function Et(i3, e) {
    const t2 = this, { params: s3, slidesEl: n3 } = t2;
    if (!s3.loop || t2.virtual && t2.params.virtual.enabled) return;
    const r = () => {
      N(n3, `.${s3.slideClass}, swiper-slide`).forEach((h2, g4) => {
        h2.setAttribute("data-swiper-slide-index", g4);
      });
    }, o2 = t2.grid && s3.grid && s3.grid.rows > 1, a20 = s3.slidesPerGroup * (o2 ? s3.grid.rows : 1), d2 = t2.slides.length % a20 !== 0, l3 = o2 && t2.slides.length % s3.grid.rows !== 0, c = (f4) => {
      for (let h2 = 0; h2 < f4; h2 += 1) {
        const g4 = t2.isElement ? Y2("swiper-slide", [s3.slideBlankClass]) : Y2("div", [s3.slideClass, s3.slideBlankClass]);
        t2.slidesEl.append(g4);
      }
    };
    if (d2) {
      if (s3.loopAddBlankSlides) {
        const f4 = a20 - t2.slides.length % a20;
        c(f4), t2.recalcSlides(), t2.updateSlides();
      } else ee("Swiper Loop Warning: The number of slides is not even to slidesPerGroup, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
      r();
    } else if (l3) {
      if (s3.loopAddBlankSlides) {
        const f4 = s3.grid.rows - t2.slides.length % s3.grid.rows;
        c(f4), t2.recalcSlides(), t2.updateSlides();
      } else ee("Swiper Loop Warning: The number of slides is not even to grid.rows, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
      r();
    } else r();
    t2.loopFix({ slideRealIndex: i3, direction: s3.centeredSlides ? void 0 : "next", initial: e });
  }
  function Mt(i3) {
    let { slideRealIndex: e, slideTo: t2 = true, direction: s3, setTranslate: n3, activeSlideIndex: r, initial: o2, byController: a20, byMousewheel: d2 } = i3 === void 0 ? {} : i3;
    const l3 = this;
    if (!l3.params.loop) return;
    l3.emit("beforeLoopFix");
    const { slides: c, allowSlidePrev: f4, allowSlideNext: h2, slidesEl: g4, params: m3 } = l3, { centeredSlides: v3, initialSlide: S3 } = m3;
    if (l3.allowSlidePrev = true, l3.allowSlideNext = true, l3.virtual && m3.virtual.enabled) {
      t2 && (!m3.centeredSlides && l3.snapIndex === 0 ? l3.slideTo(l3.virtual.slides.length, 0, false, true) : m3.centeredSlides && l3.snapIndex < m3.slidesPerView ? l3.slideTo(l3.virtual.slides.length + l3.snapIndex, 0, false, true) : l3.snapIndex === l3.snapGrid.length - 1 && l3.slideTo(l3.virtual.slidesBefore, 0, false, true)), l3.allowSlidePrev = f4, l3.allowSlideNext = h2, l3.emit("loopFix");
      return;
    }
    let w4 = m3.slidesPerView;
    w4 === "auto" ? w4 = l3.slidesPerViewDynamic() : (w4 = Math.ceil(parseFloat(m3.slidesPerView, 10)), v3 && w4 % 2 === 0 && (w4 = w4 + 1));
    const u3 = m3.slidesPerGroupAuto ? w4 : m3.slidesPerGroup;
    let p3 = u3;
    p3 % u3 !== 0 && (p3 += u3 - p3 % u3), p3 += m3.loopAdditionalSlides, l3.loopedSlides = p3;
    const y3 = l3.grid && m3.grid && m3.grid.rows > 1;
    c.length < w4 + p3 || l3.params.effect === "cards" && c.length < w4 + p3 * 2 ? ee("Swiper Loop Warning: The number of slides is not enough for loop mode, it will be disabled or not function properly. You need to add more slides (or make duplicates) or lower the values of slidesPerView and slidesPerGroup parameters") : y3 && m3.grid.fill === "row" && ee("Swiper Loop Warning: Loop mode is not compatible with grid.fill = `row`");
    const T2 = [], P3 = [], M4 = y3 ? Math.ceil(c.length / m3.grid.rows) : c.length, E5 = o2 && M4 - S3 < w4 && !v3;
    let C4 = E5 ? S3 : l3.activeIndex;
    typeof r > "u" ? r = l3.getSlideIndex(c.find((L2) => L2.classList.contains(m3.slideActiveClass))) : C4 = r;
    const b4 = s3 === "next" || !s3, x4 = s3 === "prev" || !s3;
    let I2 = 0, A4 = 0;
    const k3 = (y3 ? c[r].column : r) + (v3 && typeof n3 > "u" ? -w4 / 2 + 0.5 : 0);
    if (k3 < p3) {
      I2 = Math.max(p3 - k3, u3);
      for (let L2 = 0; L2 < p3 - k3; L2 += 1) {
        const G3 = L2 - Math.floor(L2 / M4) * M4;
        if (y3) {
          const O3 = M4 - G3 - 1;
          for (let D5 = c.length - 1; D5 >= 0; D5 -= 1) c[D5].column === O3 && T2.push(D5);
        } else T2.push(M4 - G3 - 1);
      }
    } else if (k3 + w4 > M4 - p3) {
      A4 = Math.max(k3 - (M4 - p3 * 2), u3), E5 && (A4 = Math.max(A4, w4 - M4 + S3 + 1));
      for (let L2 = 0; L2 < A4; L2 += 1) {
        const G3 = L2 - Math.floor(L2 / M4) * M4;
        y3 ? c.forEach((O3, D5) => {
          O3.column === G3 && P3.push(D5);
        }) : P3.push(G3);
      }
    }
    if (l3.__preventObserver__ = true, requestAnimationFrame(() => {
      l3.__preventObserver__ = false;
    }), l3.params.effect === "cards" && c.length < w4 + p3 * 2 && (P3.includes(r) && P3.splice(P3.indexOf(r), 1), T2.includes(r) && T2.splice(T2.indexOf(r), 1)), x4 && T2.forEach((L2) => {
      c[L2].swiperLoopMoveDOM = true, g4.prepend(c[L2]), c[L2].swiperLoopMoveDOM = false;
    }), b4 && P3.forEach((L2) => {
      c[L2].swiperLoopMoveDOM = true, g4.append(c[L2]), c[L2].swiperLoopMoveDOM = false;
    }), l3.recalcSlides(), m3.slidesPerView === "auto" ? l3.updateSlides() : y3 && (T2.length > 0 && x4 || P3.length > 0 && b4) && l3.slides.forEach((L2, G3) => {
      l3.grid.updateSlide(G3, L2, l3.slides);
    }), m3.watchSlidesProgress && l3.updateSlidesOffset(), t2) {
      if (T2.length > 0 && x4) {
        if (typeof e > "u") {
          const L2 = l3.slidesGrid[C4], O3 = l3.slidesGrid[C4 + I2] - L2;
          d2 ? l3.setTranslate(l3.translate - O3) : (l3.slideTo(C4 + Math.ceil(I2), 0, false, true), n3 && (l3.touchEventsData.startTranslate = l3.touchEventsData.startTranslate - O3, l3.touchEventsData.currentTranslate = l3.touchEventsData.currentTranslate - O3));
        } else if (n3) {
          const L2 = y3 ? T2.length / m3.grid.rows : T2.length;
          l3.slideTo(l3.activeIndex + L2, 0, false, true), l3.touchEventsData.currentTranslate = l3.translate;
        }
      } else if (P3.length > 0 && b4) if (typeof e > "u") {
        const L2 = l3.slidesGrid[C4], O3 = l3.slidesGrid[C4 - A4] - L2;
        d2 ? l3.setTranslate(l3.translate - O3) : (l3.slideTo(C4 - A4, 0, false, true), n3 && (l3.touchEventsData.startTranslate = l3.touchEventsData.startTranslate - O3, l3.touchEventsData.currentTranslate = l3.touchEventsData.currentTranslate - O3));
      } else {
        const L2 = y3 ? P3.length / m3.grid.rows : P3.length;
        l3.slideTo(l3.activeIndex - L2, 0, false, true);
      }
    }
    if (l3.allowSlidePrev = f4, l3.allowSlideNext = h2, l3.controller && l3.controller.control && !a20) {
      const L2 = { slideRealIndex: e, direction: s3, setTranslate: n3, activeSlideIndex: r, byController: true };
      Array.isArray(l3.controller.control) ? l3.controller.control.forEach((G3) => {
        !G3.destroyed && G3.params.loop && G3.loopFix({ ...L2, slideTo: G3.params.slidesPerView === m3.slidesPerView ? t2 : false });
      }) : l3.controller.control instanceof l3.constructor && l3.controller.control.params.loop && l3.controller.control.loopFix({ ...L2, slideTo: l3.controller.control.params.slidesPerView === m3.slidesPerView ? t2 : false });
    }
    l3.emit("loopFix");
  }
  function Pt() {
    const i3 = this, { params: e, slidesEl: t2 } = i3;
    if (!e.loop || !t2 || i3.virtual && i3.params.virtual.enabled) return;
    i3.recalcSlides();
    const s3 = [];
    i3.slides.forEach((n3) => {
      const r = typeof n3.swiperSlideIndex > "u" ? n3.getAttribute("data-swiper-slide-index") * 1 : n3.swiperSlideIndex;
      s3[r] = n3;
    }), i3.slides.forEach((n3) => {
      n3.removeAttribute("data-swiper-slide-index");
    }), s3.forEach((n3) => {
      t2.append(n3);
    }), i3.recalcSlides(), i3.slideTo(i3.realIndex, 0);
  }
  var Ct = { loopCreate: Et, loopFix: Mt, loopDestroy: Pt };
  function Lt(i3) {
    const e = this;
    if (!e.params.simulateTouch || e.params.watchOverflow && e.isLocked || e.params.cssMode) return;
    const t2 = e.params.touchEventsTarget === "container" ? e.el : e.wrapperEl;
    e.isElement && (e.__preventObserver__ = true), t2.style.cursor = "move", t2.style.cursor = i3 ? "grabbing" : "grab", e.isElement && requestAnimationFrame(() => {
      e.__preventObserver__ = false;
    });
  }
  function It() {
    const i3 = this;
    i3.params.watchOverflow && i3.isLocked || i3.params.cssMode || (i3.isElement && (i3.__preventObserver__ = true), i3[i3.params.touchEventsTarget === "container" ? "el" : "wrapperEl"].style.cursor = "", i3.isElement && requestAnimationFrame(() => {
      i3.__preventObserver__ = false;
    }));
  }
  var At = { setGrabCursor: Lt, unsetGrabCursor: It };
  function Ot(i3, e) {
    e === void 0 && (e = this);
    function t2(s3) {
      if (!s3 || s3 === H() || s3 === V2()) return null;
      s3.assignedSlot && (s3 = s3.assignedSlot);
      const n3 = s3.closest(i3);
      return !n3 && !s3.getRootNode ? null : n3 || t2(s3.getRootNode().host);
    }
    return t2(e);
  }
  function ge(i3, e, t2) {
    const s3 = V2(), { params: n3 } = i3, r = n3.edgeSwipeDetection, o2 = n3.edgeSwipeThreshold;
    return r && (t2 <= o2 || t2 >= s3.innerWidth - o2) ? r === "prevent" ? (e.preventDefault(), true) : false : true;
  }
  function zt(i3) {
    const e = this, t2 = H();
    let s3 = i3;
    s3.originalEvent && (s3 = s3.originalEvent);
    const n3 = e.touchEventsData;
    if (s3.type === "pointerdown") {
      if (n3.pointerId !== null && n3.pointerId !== s3.pointerId) return;
      n3.pointerId = s3.pointerId;
    } else s3.type === "touchstart" && s3.targetTouches.length === 1 && (n3.touchId = s3.targetTouches[0].identifier);
    if (s3.type === "touchstart") {
      ge(e, s3, s3.targetTouches[0].pageX);
      return;
    }
    const { params: r, touches: o2, enabled: a20 } = e;
    if (!a20 || !r.simulateTouch && s3.pointerType === "mouse" || e.animating && r.preventInteractionOnTransition) return;
    !e.animating && r.cssMode && r.loop && e.loopFix();
    let d2 = s3.target;
    if (r.touchEventsTarget === "wrapper" && !Fe(d2, e.wrapperEl) || "which" in s3 && s3.which === 3 || "button" in s3 && s3.button > 0 || n3.isTouched && n3.isMoved) return;
    const l3 = !!r.noSwipingClass && r.noSwipingClass !== "", c = s3.composedPath ? s3.composedPath() : s3.path;
    l3 && s3.target && s3.target.shadowRoot && c && (d2 = c[0]);
    const f4 = r.noSwipingSelector ? r.noSwipingSelector : `.${r.noSwipingClass}`, h2 = !!(s3.target && s3.target.shadowRoot);
    if (r.noSwiping && (h2 ? Ot(f4, d2) : d2.closest(f4))) {
      e.allowClick = true;
      return;
    }
    if (r.swipeHandler && !d2.closest(r.swipeHandler)) return;
    o2.currentX = s3.pageX, o2.currentY = s3.pageY;
    const g4 = o2.currentX, m3 = o2.currentY;
    if (!ge(e, s3, g4)) return;
    Object.assign(n3, { isTouched: true, isMoved: false, allowTouchCallbacks: true, isScrolling: void 0, startMoving: void 0 }), o2.startX = g4, o2.startY = m3, n3.touchStartTime = j(), e.allowClick = true, e.updateSize(), e.swipeDirection = void 0, r.threshold > 0 && (n3.allowThresholdMove = false);
    let v3 = true;
    d2.matches(n3.focusableElements) && (v3 = false, d2.nodeName === "SELECT" && (n3.isTouched = false)), t2.activeElement && t2.activeElement.matches(n3.focusableElements) && t2.activeElement !== d2 && (s3.pointerType === "mouse" || s3.pointerType !== "mouse" && !d2.matches(n3.focusableElements)) && t2.activeElement.blur();
    const S3 = v3 && e.allowTouchMove && r.touchStartPreventDefault;
    (r.touchStartForcePreventDefault || S3) && !d2.isContentEditable && s3.preventDefault(), r.freeMode && r.freeMode.enabled && e.freeMode && e.animating && !r.cssMode && e.freeMode.onTouchStart(), e.emit("touchStart", s3);
  }
  function kt(i3) {
    const e = H(), t2 = this, s3 = t2.touchEventsData, { params: n3, touches: r, rtlTranslate: o2, enabled: a20 } = t2;
    if (!a20 || !n3.simulateTouch && i3.pointerType === "mouse") return;
    let d2 = i3;
    if (d2.originalEvent && (d2 = d2.originalEvent), d2.type === "pointermove" && (s3.touchId !== null || d2.pointerId !== s3.pointerId)) return;
    let l3;
    if (d2.type === "touchmove") {
      if (l3 = [...d2.changedTouches].find((T2) => T2.identifier === s3.touchId), !l3 || l3.identifier !== s3.touchId) return;
    } else l3 = d2;
    if (!s3.isTouched) {
      s3.startMoving && s3.isScrolling && t2.emit("touchMoveOpposite", d2);
      return;
    }
    const c = l3.pageX, f4 = l3.pageY;
    if (d2.preventedByNestedSwiper) {
      r.startX = c, r.startY = f4;
      return;
    }
    if (!t2.allowTouchMove) {
      d2.target.matches(s3.focusableElements) || (t2.allowClick = false), s3.isTouched && (Object.assign(r, { startX: c, startY: f4, currentX: c, currentY: f4 }), s3.touchStartTime = j());
      return;
    }
    if (n3.touchReleaseOnEdges && !n3.loop) if (t2.isVertical()) {
      if (f4 < r.startY && t2.translate <= t2.maxTranslate() || f4 > r.startY && t2.translate >= t2.minTranslate()) {
        s3.isTouched = false, s3.isMoved = false;
        return;
      }
    } else {
      if (o2 && (c > r.startX && -t2.translate <= t2.maxTranslate() || c < r.startX && -t2.translate >= t2.minTranslate())) return;
      if (!o2 && (c < r.startX && t2.translate <= t2.maxTranslate() || c > r.startX && t2.translate >= t2.minTranslate())) return;
    }
    if (e.activeElement && e.activeElement.matches(s3.focusableElements) && e.activeElement !== d2.target && d2.pointerType !== "mouse" && e.activeElement.blur(), e.activeElement && d2.target === e.activeElement && d2.target.matches(s3.focusableElements)) {
      s3.isMoved = true, t2.allowClick = false;
      return;
    }
    s3.allowTouchCallbacks && t2.emit("touchMove", d2), r.previousX = r.currentX, r.previousY = r.currentY, r.currentX = c, r.currentY = f4;
    const h2 = r.currentX - r.startX, g4 = r.currentY - r.startY;
    if (t2.params.threshold && Math.sqrt(h2 ** 2 + g4 ** 2) < t2.params.threshold) return;
    if (typeof s3.isScrolling > "u") {
      let T2;
      t2.isHorizontal() && r.currentY === r.startY || t2.isVertical() && r.currentX === r.startX ? s3.isScrolling = false : h2 * h2 + g4 * g4 >= 25 && (T2 = Math.atan2(Math.abs(g4), Math.abs(h2)) * 180 / Math.PI, s3.isScrolling = t2.isHorizontal() ? T2 > n3.touchAngle : 90 - T2 > n3.touchAngle);
    }
    if (s3.isScrolling && t2.emit("touchMoveOpposite", d2), typeof s3.startMoving > "u" && (r.currentX !== r.startX || r.currentY !== r.startY) && (s3.startMoving = true), s3.isScrolling || d2.type === "touchmove" && s3.preventTouchMoveFromPointerMove) {
      s3.isTouched = false;
      return;
    }
    if (!s3.startMoving) return;
    t2.allowClick = false, !n3.cssMode && d2.cancelable && d2.preventDefault(), n3.touchMoveStopPropagation && !n3.nested && d2.stopPropagation();
    let m3 = t2.isHorizontal() ? h2 : g4, v3 = t2.isHorizontal() ? r.currentX - r.previousX : r.currentY - r.previousY;
    n3.oneWayMovement && (m3 = Math.abs(m3) * (o2 ? 1 : -1), v3 = Math.abs(v3) * (o2 ? 1 : -1)), r.diff = m3, m3 *= n3.touchRatio, o2 && (m3 = -m3, v3 = -v3);
    const S3 = t2.touchesDirection;
    t2.swipeDirection = m3 > 0 ? "prev" : "next", t2.touchesDirection = v3 > 0 ? "prev" : "next";
    const w4 = t2.params.loop && !n3.cssMode, u3 = t2.touchesDirection === "next" && t2.allowSlideNext || t2.touchesDirection === "prev" && t2.allowSlidePrev;
    if (!s3.isMoved) {
      if (w4 && u3 && t2.loopFix({ direction: t2.swipeDirection }), s3.startTranslate = t2.getTranslate(), t2.setTransition(0), t2.animating) {
        const T2 = new window.CustomEvent("transitionend", { bubbles: true, cancelable: true, detail: { bySwiperTouchMove: true } });
        t2.wrapperEl.dispatchEvent(T2);
      }
      s3.allowMomentumBounce = false, n3.grabCursor && (t2.allowSlideNext === true || t2.allowSlidePrev === true) && t2.setGrabCursor(true), t2.emit("sliderFirstMove", d2);
    }
    if ((/* @__PURE__ */ new Date()).getTime(), n3._loopSwapReset !== false && s3.isMoved && s3.allowThresholdMove && S3 !== t2.touchesDirection && w4 && u3 && Math.abs(m3) >= 1) {
      Object.assign(r, { startX: c, startY: f4, currentX: c, currentY: f4, startTranslate: s3.currentTranslate }), s3.loopSwapReset = true, s3.startTranslate = s3.currentTranslate;
      return;
    }
    t2.emit("sliderMove", d2), s3.isMoved = true, s3.currentTranslate = m3 + s3.startTranslate;
    let p3 = true, y3 = n3.resistanceRatio;
    if (n3.touchReleaseOnEdges && (y3 = 0), m3 > 0 ? (w4 && u3 && s3.allowThresholdMove && s3.currentTranslate > (n3.centeredSlides ? t2.minTranslate() - t2.slidesSizesGrid[t2.activeIndex + 1] - (n3.slidesPerView !== "auto" && t2.slides.length - n3.slidesPerView >= 2 ? t2.slidesSizesGrid[t2.activeIndex + 1] + t2.params.spaceBetween : 0) - t2.params.spaceBetween : t2.minTranslate()) && t2.loopFix({ direction: "prev", setTranslate: true, activeSlideIndex: 0 }), s3.currentTranslate > t2.minTranslate() && (p3 = false, n3.resistance && (s3.currentTranslate = t2.minTranslate() - 1 + (-t2.minTranslate() + s3.startTranslate + m3) ** y3))) : m3 < 0 && (w4 && u3 && s3.allowThresholdMove && s3.currentTranslate < (n3.centeredSlides ? t2.maxTranslate() + t2.slidesSizesGrid[t2.slidesSizesGrid.length - 1] + t2.params.spaceBetween + (n3.slidesPerView !== "auto" && t2.slides.length - n3.slidesPerView >= 2 ? t2.slidesSizesGrid[t2.slidesSizesGrid.length - 1] + t2.params.spaceBetween : 0) : t2.maxTranslate()) && t2.loopFix({ direction: "next", setTranslate: true, activeSlideIndex: t2.slides.length - (n3.slidesPerView === "auto" ? t2.slidesPerViewDynamic() : Math.ceil(parseFloat(n3.slidesPerView, 10))) }), s3.currentTranslate < t2.maxTranslate() && (p3 = false, n3.resistance && (s3.currentTranslate = t2.maxTranslate() + 1 - (t2.maxTranslate() - s3.startTranslate - m3) ** y3))), p3 && (d2.preventedByNestedSwiper = true), !t2.allowSlideNext && t2.swipeDirection === "next" && s3.currentTranslate < s3.startTranslate && (s3.currentTranslate = s3.startTranslate), !t2.allowSlidePrev && t2.swipeDirection === "prev" && s3.currentTranslate > s3.startTranslate && (s3.currentTranslate = s3.startTranslate), !t2.allowSlidePrev && !t2.allowSlideNext && (s3.currentTranslate = s3.startTranslate), n3.threshold > 0) if (Math.abs(m3) > n3.threshold || s3.allowThresholdMove) {
      if (!s3.allowThresholdMove) {
        s3.allowThresholdMove = true, r.startX = r.currentX, r.startY = r.currentY, s3.currentTranslate = s3.startTranslate, r.diff = t2.isHorizontal() ? r.currentX - r.startX : r.currentY - r.startY;
        return;
      }
    } else {
      s3.currentTranslate = s3.startTranslate;
      return;
    }
    !n3.followFinger || n3.cssMode || ((n3.freeMode && n3.freeMode.enabled && t2.freeMode || n3.watchSlidesProgress) && (t2.updateActiveIndex(), t2.updateSlidesClasses()), n3.freeMode && n3.freeMode.enabled && t2.freeMode && t2.freeMode.onTouchMove(), t2.updateProgress(s3.currentTranslate), t2.setTranslate(s3.currentTranslate));
  }
  function Dt(i3) {
    const e = this, t2 = e.touchEventsData;
    let s3 = i3;
    s3.originalEvent && (s3 = s3.originalEvent);
    let n3;
    if (s3.type === "touchend" || s3.type === "touchcancel") {
      if (n3 = [...s3.changedTouches].find((T2) => T2.identifier === t2.touchId), !n3 || n3.identifier !== t2.touchId) return;
    } else {
      if (t2.touchId !== null || s3.pointerId !== t2.pointerId) return;
      n3 = s3;
    }
    if (["pointercancel", "pointerout", "pointerleave", "contextmenu"].includes(s3.type) && !(["pointercancel", "contextmenu"].includes(s3.type) && (e.browser.isSafari || e.browser.isWebView))) return;
    t2.pointerId = null, t2.touchId = null;
    const { params: o2, touches: a20, rtlTranslate: d2, slidesGrid: l3, enabled: c } = e;
    if (!c || !o2.simulateTouch && s3.pointerType === "mouse") return;
    if (t2.allowTouchCallbacks && e.emit("touchEnd", s3), t2.allowTouchCallbacks = false, !t2.isTouched) {
      t2.isMoved && o2.grabCursor && e.setGrabCursor(false), t2.isMoved = false, t2.startMoving = false;
      return;
    }
    o2.grabCursor && t2.isMoved && t2.isTouched && (e.allowSlideNext === true || e.allowSlidePrev === true) && e.setGrabCursor(false);
    const f4 = j(), h2 = f4 - t2.touchStartTime;
    if (e.allowClick) {
      const T2 = s3.path || s3.composedPath && s3.composedPath();
      e.updateClickedSlide(T2 && T2[0] || s3.target, T2), e.emit("tap click", s3), h2 < 300 && f4 - t2.lastClickTime < 300 && e.emit("doubleTap doubleClick", s3);
    }
    if (t2.lastClickTime = j(), J(() => {
      e.destroyed || (e.allowClick = true);
    }), !t2.isTouched || !t2.isMoved || !e.swipeDirection || a20.diff === 0 && !t2.loopSwapReset || t2.currentTranslate === t2.startTranslate && !t2.loopSwapReset) {
      t2.isTouched = false, t2.isMoved = false, t2.startMoving = false;
      return;
    }
    t2.isTouched = false, t2.isMoved = false, t2.startMoving = false;
    let g4;
    if (o2.followFinger ? g4 = d2 ? e.translate : -e.translate : g4 = -t2.currentTranslate, o2.cssMode) return;
    if (o2.freeMode && o2.freeMode.enabled) {
      e.freeMode.onTouchEnd({ currentPos: g4 });
      return;
    }
    const m3 = g4 >= -e.maxTranslate() && !e.params.loop;
    let v3 = 0, S3 = e.slidesSizesGrid[0];
    for (let T2 = 0; T2 < l3.length; T2 += T2 < o2.slidesPerGroupSkip ? 1 : o2.slidesPerGroup) {
      const P3 = T2 < o2.slidesPerGroupSkip - 1 ? 1 : o2.slidesPerGroup;
      typeof l3[T2 + P3] < "u" ? (m3 || g4 >= l3[T2] && g4 < l3[T2 + P3]) && (v3 = T2, S3 = l3[T2 + P3] - l3[T2]) : (m3 || g4 >= l3[T2]) && (v3 = T2, S3 = l3[l3.length - 1] - l3[l3.length - 2]);
    }
    let w4 = null, u3 = null;
    o2.rewind && (e.isBeginning ? u3 = o2.virtual && o2.virtual.enabled && e.virtual ? e.virtual.slides.length - 1 : e.slides.length - 1 : e.isEnd && (w4 = 0));
    const p3 = (g4 - l3[v3]) / S3, y3 = v3 < o2.slidesPerGroupSkip - 1 ? 1 : o2.slidesPerGroup;
    if (h2 > o2.longSwipesMs) {
      if (!o2.longSwipes) {
        e.slideTo(e.activeIndex);
        return;
      }
      e.swipeDirection === "next" && (p3 >= o2.longSwipesRatio ? e.slideTo(o2.rewind && e.isEnd ? w4 : v3 + y3) : e.slideTo(v3)), e.swipeDirection === "prev" && (p3 > 1 - o2.longSwipesRatio ? e.slideTo(v3 + y3) : u3 !== null && p3 < 0 && Math.abs(p3) > o2.longSwipesRatio ? e.slideTo(u3) : e.slideTo(v3));
    } else {
      if (!o2.shortSwipes) {
        e.slideTo(e.activeIndex);
        return;
      }
      e.navigation && (s3.target === e.navigation.nextEl || s3.target === e.navigation.prevEl) ? s3.target === e.navigation.nextEl ? e.slideTo(v3 + y3) : e.slideTo(v3) : (e.swipeDirection === "next" && e.slideTo(w4 !== null ? w4 : v3 + y3), e.swipeDirection === "prev" && e.slideTo(u3 !== null ? u3 : v3));
    }
  }
  function ve() {
    const i3 = this, { params: e, el: t2 } = i3;
    if (t2 && t2.offsetWidth === 0) return;
    e.breakpoints && i3.setBreakpoint();
    const { allowSlideNext: s3, allowSlidePrev: n3, snapGrid: r } = i3, o2 = i3.virtual && i3.params.virtual.enabled;
    i3.allowSlideNext = true, i3.allowSlidePrev = true, i3.updateSize(), i3.updateSlides(), i3.updateSlidesClasses();
    const a20 = o2 && e.loop;
    (e.slidesPerView === "auto" || e.slidesPerView > 1) && i3.isEnd && !i3.isBeginning && !i3.params.centeredSlides && !a20 ? i3.slideTo(i3.slides.length - 1, 0, false, true) : i3.params.loop && !o2 ? i3.slideToLoop(i3.realIndex, 0, false, true) : i3.slideTo(i3.activeIndex, 0, false, true), i3.autoplay && i3.autoplay.running && i3.autoplay.paused && (clearTimeout(i3.autoplay.resizeTimeout), i3.autoplay.resizeTimeout = setTimeout(() => {
      i3.autoplay && i3.autoplay.running && i3.autoplay.paused && i3.autoplay.resume();
    }, 500)), i3.allowSlidePrev = n3, i3.allowSlideNext = s3, i3.params.watchOverflow && r !== i3.snapGrid && i3.checkOverflow();
  }
  function Gt(i3) {
    const e = this;
    e.enabled && (e.allowClick || (e.params.preventClicks && i3.preventDefault(), e.params.preventClicksPropagation && e.animating && (i3.stopPropagation(), i3.stopImmediatePropagation())));
  }
  function $t() {
    const i3 = this, { wrapperEl: e, rtlTranslate: t2, enabled: s3 } = i3;
    if (!s3) return;
    i3.previousTranslate = i3.translate, i3.isHorizontal() ? i3.translate = -e.scrollLeft : i3.translate = -e.scrollTop, i3.translate === 0 && (i3.translate = 0), i3.updateActiveIndex(), i3.updateSlidesClasses();
    let n3;
    const r = i3.maxTranslate() - i3.minTranslate();
    r === 0 ? n3 = 0 : n3 = (i3.translate - i3.minTranslate()) / r, n3 !== i3.progress && i3.updateProgress(t2 ? -i3.translate : i3.translate), i3.emit("setTranslate", i3.translate, false);
  }
  function Bt(i3) {
    const e = this;
    Z(e, i3.target), !(e.params.cssMode || e.params.slidesPerView !== "auto" && !e.params.autoHeight) && e.update();
  }
  function Vt() {
    const i3 = this;
    i3.documentTouchHandlerProceeded || (i3.documentTouchHandlerProceeded = true, i3.params.touchReleaseOnEdges && (i3.el.style.touchAction = "auto"));
  }
  var Ce = (i3, e) => {
    const t2 = H(), { params: s3, el: n3, wrapperEl: r, device: o2 } = i3, a20 = !!s3.nested, d2 = e === "on" ? "addEventListener" : "removeEventListener", l3 = e;
    !n3 || typeof n3 == "string" || (t2[d2]("touchstart", i3.onDocumentTouchStart, { passive: false, capture: a20 }), n3[d2]("touchstart", i3.onTouchStart, { passive: false }), n3[d2]("pointerdown", i3.onTouchStart, { passive: false }), t2[d2]("touchmove", i3.onTouchMove, { passive: false, capture: a20 }), t2[d2]("pointermove", i3.onTouchMove, { passive: false, capture: a20 }), t2[d2]("touchend", i3.onTouchEnd, { passive: true }), t2[d2]("pointerup", i3.onTouchEnd, { passive: true }), t2[d2]("pointercancel", i3.onTouchEnd, { passive: true }), t2[d2]("touchcancel", i3.onTouchEnd, { passive: true }), t2[d2]("pointerout", i3.onTouchEnd, { passive: true }), t2[d2]("pointerleave", i3.onTouchEnd, { passive: true }), t2[d2]("contextmenu", i3.onTouchEnd, { passive: true }), (s3.preventClicks || s3.preventClicksPropagation) && n3[d2]("click", i3.onClick, true), s3.cssMode && r[d2]("scroll", i3.onScroll), s3.updateOnWindowResize ? i3[l3](o2.ios || o2.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", ve, true) : i3[l3]("observerUpdate", ve, true), n3[d2]("load", i3.onLoad, { capture: true }));
  };
  function Ft() {
    const i3 = this, { params: e } = i3;
    i3.onTouchStart = zt.bind(i3), i3.onTouchMove = kt.bind(i3), i3.onTouchEnd = Dt.bind(i3), i3.onDocumentTouchStart = Vt.bind(i3), e.cssMode && (i3.onScroll = $t.bind(i3)), i3.onClick = Gt.bind(i3), i3.onLoad = Bt.bind(i3), Ce(i3, "on");
  }
  function Nt() {
    Ce(this, "off");
  }
  var _t = { attachEvents: Ft, detachEvents: Nt };
  var we = (i3, e) => i3.grid && e.grid && e.grid.rows > 1;
  function Ht() {
    const i3 = this, { realIndex: e, initialized: t2, params: s3, el: n3 } = i3, r = s3.breakpoints;
    if (!r || r && Object.keys(r).length === 0) return;
    const o2 = H(), a20 = s3.breakpointsBase === "window" || !s3.breakpointsBase ? s3.breakpointsBase : "container", d2 = ["window", "container"].includes(s3.breakpointsBase) || !s3.breakpointsBase ? i3.el : o2.querySelector(s3.breakpointsBase), l3 = i3.getBreakpoint(r, a20, d2);
    if (!l3 || i3.currentBreakpoint === l3) return;
    const f4 = (l3 in r ? r[l3] : void 0) || i3.originalParams, h2 = we(i3, s3), g4 = we(i3, f4), m3 = i3.params.grabCursor, v3 = f4.grabCursor, S3 = s3.enabled;
    h2 && !g4 ? (n3.classList.remove(`${s3.containerModifierClass}grid`, `${s3.containerModifierClass}grid-column`), i3.emitContainerClasses()) : !h2 && g4 && (n3.classList.add(`${s3.containerModifierClass}grid`), (f4.grid.fill && f4.grid.fill === "column" || !f4.grid.fill && s3.grid.fill === "column") && n3.classList.add(`${s3.containerModifierClass}grid-column`), i3.emitContainerClasses()), m3 && !v3 ? i3.unsetGrabCursor() : !m3 && v3 && i3.setGrabCursor(), ["navigation", "pagination", "scrollbar"].forEach((P3) => {
      if (typeof f4[P3] > "u") return;
      const M4 = s3[P3] && s3[P3].enabled, E5 = f4[P3] && f4[P3].enabled;
      M4 && !E5 && i3[P3].disable(), !M4 && E5 && i3[P3].enable();
    });
    const w4 = f4.direction && f4.direction !== s3.direction, u3 = s3.loop && (f4.slidesPerView !== s3.slidesPerView || w4), p3 = s3.loop;
    w4 && t2 && i3.changeDirection(), F(i3.params, f4);
    const y3 = i3.params.enabled, T2 = i3.params.loop;
    Object.assign(i3, { allowTouchMove: i3.params.allowTouchMove, allowSlideNext: i3.params.allowSlideNext, allowSlidePrev: i3.params.allowSlidePrev }), S3 && !y3 ? i3.disable() : !S3 && y3 && i3.enable(), i3.currentBreakpoint = l3, i3.emit("_beforeBreakpoint", f4), t2 && (u3 ? (i3.loopDestroy(), i3.loopCreate(e), i3.updateSlides()) : !p3 && T2 ? (i3.loopCreate(e), i3.updateSlides()) : p3 && !T2 && i3.loopDestroy()), i3.emit("breakpoint", f4);
  }
  function Rt(i3, e, t2) {
    if (e === void 0 && (e = "window"), !i3 || e === "container" && !t2) return;
    let s3 = false;
    const n3 = V2(), r = e === "window" ? n3.innerHeight : t2.clientHeight, o2 = Object.keys(i3).map((a20) => {
      if (typeof a20 == "string" && a20.indexOf("@") === 0) {
        const d2 = parseFloat(a20.substr(1));
        return { value: r * d2, point: a20 };
      }
      return { value: a20, point: a20 };
    });
    o2.sort((a20, d2) => parseInt(a20.value, 10) - parseInt(d2.value, 10));
    for (let a20 = 0; a20 < o2.length; a20 += 1) {
      const { point: d2, value: l3 } = o2[a20];
      e === "window" ? n3.matchMedia(`(min-width: ${l3}px)`).matches && (s3 = d2) : l3 <= t2.clientWidth && (s3 = d2);
    }
    return s3 || "max";
  }
  var qt = { setBreakpoint: Ht, getBreakpoint: Rt };
  function jt(i3, e) {
    const t2 = [];
    return i3.forEach((s3) => {
      typeof s3 == "object" ? Object.keys(s3).forEach((n3) => {
        s3[n3] && t2.push(e + n3);
      }) : typeof s3 == "string" && t2.push(e + s3);
    }), t2;
  }
  function Wt() {
    const i3 = this, { classNames: e, params: t2, rtl: s3, el: n3, device: r } = i3, o2 = jt(["initialized", t2.direction, { "free-mode": i3.params.freeMode && t2.freeMode.enabled }, { autoheight: t2.autoHeight }, { rtl: s3 }, { grid: t2.grid && t2.grid.rows > 1 }, { "grid-column": t2.grid && t2.grid.rows > 1 && t2.grid.fill === "column" }, { android: r.android }, { ios: r.ios }, { "css-mode": t2.cssMode }, { centered: t2.cssMode && t2.centeredSlides }, { "watch-progress": t2.watchSlidesProgress }], t2.containerModifierClass);
    e.push(...o2), n3.classList.add(...e), i3.emitContainerClasses();
  }
  function Xt() {
    const i3 = this, { el: e, classNames: t2 } = i3;
    !e || typeof e == "string" || (e.classList.remove(...t2), i3.emitContainerClasses());
  }
  var Yt = { addClasses: Wt, removeClasses: Xt };
  function Ut() {
    const i3 = this, { isLocked: e, params: t2 } = i3, { slidesOffsetBefore: s3 } = t2;
    if (s3) {
      const n3 = i3.slides.length - 1, r = i3.slidesGrid[n3] + i3.slidesSizesGrid[n3] + s3 * 2;
      i3.isLocked = i3.size > r;
    } else i3.isLocked = i3.snapGrid.length === 1;
    t2.allowSlideNext === true && (i3.allowSlideNext = !i3.isLocked), t2.allowSlidePrev === true && (i3.allowSlidePrev = !i3.isLocked), e && e !== i3.isLocked && (i3.isEnd = false), e !== i3.isLocked && i3.emit(i3.isLocked ? "lock" : "unlock");
  }
  var Kt = { checkOverflow: Ut };
  var ye = { init: true, direction: "horizontal", oneWayMovement: false, swiperElementNodeName: "SWIPER-CONTAINER", touchEventsTarget: "wrapper", initialSlide: 0, speed: 300, cssMode: false, updateOnWindowResize: true, resizeObserver: true, nested: false, createElements: false, eventsPrefix: "swiper", enabled: true, focusableElements: "input, select, option, textarea, button, video, label", width: null, height: null, preventInteractionOnTransition: false, userAgent: null, url: null, edgeSwipeDetection: false, edgeSwipeThreshold: 20, autoHeight: false, setWrapperSize: false, virtualTranslate: false, effect: "slide", breakpoints: void 0, breakpointsBase: "window", spaceBetween: 0, slidesPerView: 1, slidesPerGroup: 1, slidesPerGroupSkip: 0, slidesPerGroupAuto: false, centeredSlides: false, centeredSlidesBounds: false, slidesOffsetBefore: 0, slidesOffsetAfter: 0, normalizeSlideIndex: true, centerInsufficientSlides: false, watchOverflow: true, roundLengths: false, touchRatio: 1, touchAngle: 45, simulateTouch: true, shortSwipes: true, longSwipes: true, longSwipesRatio: 0.5, longSwipesMs: 300, followFinger: true, allowTouchMove: true, threshold: 5, touchMoveStopPropagation: false, touchStartPreventDefault: true, touchStartForcePreventDefault: false, touchReleaseOnEdges: false, uniqueNavElements: true, resistance: true, resistanceRatio: 0.85, watchSlidesProgress: false, grabCursor: false, preventClicks: true, preventClicksPropagation: true, slideToClickedSlide: false, loop: false, loopAddBlankSlides: true, loopAdditionalSlides: 0, loopPreventsSliding: true, rewind: false, allowSlidePrev: true, allowSlideNext: true, swipeHandler: null, noSwiping: true, noSwipingClass: "swiper-no-swiping", noSwipingSelector: null, passiveListeners: true, maxBackfaceHiddenSlides: 10, containerModifierClass: "swiper-", slideClass: "swiper-slide", slideBlankClass: "swiper-slide-blank", slideActiveClass: "swiper-slide-active", slideVisibleClass: "swiper-slide-visible", slideFullyVisibleClass: "swiper-slide-fully-visible", slideNextClass: "swiper-slide-next", slidePrevClass: "swiper-slide-prev", wrapperClass: "swiper-wrapper", lazyPreloaderClass: "swiper-lazy-preloader", lazyPreloadPrevNext: 0, runCallbacksOnInit: true, _emitClasses: false };
  function Qt(i3, e) {
    return function(s3) {
      s3 === void 0 && (s3 = {});
      const n3 = Object.keys(s3)[0], r = s3[n3];
      if (typeof r != "object" || r === null) {
        F(e, s3);
        return;
      }
      if (i3[n3] === true && (i3[n3] = { enabled: true }), n3 === "navigation" && i3[n3] && i3[n3].enabled && !i3[n3].prevEl && !i3[n3].nextEl && (i3[n3].auto = true), ["pagination", "scrollbar"].indexOf(n3) >= 0 && i3[n3] && i3[n3].enabled && !i3[n3].el && (i3[n3].auto = true), !(n3 in i3 && "enabled" in r)) {
        F(e, s3);
        return;
      }
      typeof i3[n3] == "object" && !("enabled" in i3[n3]) && (i3[n3].enabled = true), i3[n3] || (i3[n3] = { enabled: false }), F(e, s3);
    };
  }
  var oe = { eventsEmitter: Ye, update: nt, translate: ft, transition: ht, slide: xt, loop: Ct, grabCursor: At, events: _t, breakpoints: qt, checkOverflow: Kt, classes: Yt };
  var de = {};
  var _3 = class __ {
    constructor() {
      let e, t2;
      for (var s3 = arguments.length, n3 = new Array(s3), r = 0; r < s3; r++) n3[r] = arguments[r];
      n3.length === 1 && n3[0].constructor && Object.prototype.toString.call(n3[0]).slice(8, -1) === "Object" ? t2 = n3[0] : [e, t2] = n3, t2 || (t2 = {}), t2 = F({}, t2), e && !t2.el && (t2.el = e);
      const o2 = H();
      if (t2.el && typeof t2.el == "string" && o2.querySelectorAll(t2.el).length > 1) {
        const c = [];
        return o2.querySelectorAll(t2.el).forEach((f4) => {
          const h2 = F({}, t2, { el: f4 });
          c.push(new __(h2));
        }), c;
      }
      const a20 = this;
      a20.__swiper__ = true, a20.support = xe(), a20.device = Ee({ userAgent: t2.userAgent }), a20.browser = Me(), a20.eventsListeners = {}, a20.eventsAnyListeners = [], a20.modules = [...a20.__modules__], t2.modules && Array.isArray(t2.modules) && a20.modules.push(...t2.modules);
      const d2 = {};
      a20.modules.forEach((c) => {
        c({ params: t2, swiper: a20, extendParams: Qt(t2, d2), on: a20.on.bind(a20), once: a20.once.bind(a20), off: a20.off.bind(a20), emit: a20.emit.bind(a20) });
      });
      const l3 = F({}, ye, d2);
      return a20.params = F({}, l3, de, t2), a20.originalParams = F({}, a20.params), a20.passedParams = F({}, t2), a20.params && a20.params.on && Object.keys(a20.params.on).forEach((c) => {
        a20.on(c, a20.params.on[c]);
      }), a20.params && a20.params.onAny && a20.onAny(a20.params.onAny), Object.assign(a20, { enabled: a20.params.enabled, el: e, classNames: [], slides: [], slidesGrid: [], snapGrid: [], slidesSizesGrid: [], isHorizontal() {
        return a20.params.direction === "horizontal";
      }, isVertical() {
        return a20.params.direction === "vertical";
      }, activeIndex: 0, realIndex: 0, isBeginning: true, isEnd: false, translate: 0, previousTranslate: 0, progress: 0, velocity: 0, animating: false, cssOverflowAdjustment() {
        return Math.trunc(this.translate / 2 ** 23) * 2 ** 23;
      }, allowSlideNext: a20.params.allowSlideNext, allowSlidePrev: a20.params.allowSlidePrev, touchEventsData: { isTouched: void 0, isMoved: void 0, allowTouchCallbacks: void 0, touchStartTime: void 0, isScrolling: void 0, currentTranslate: void 0, startTranslate: void 0, allowThresholdMove: void 0, focusableElements: a20.params.focusableElements, lastClickTime: 0, clickTimeout: void 0, velocities: [], allowMomentumBounce: void 0, startMoving: void 0, pointerId: null, touchId: null }, allowClick: true, allowTouchMove: a20.params.allowTouchMove, touches: { startX: 0, startY: 0, currentX: 0, currentY: 0, diff: 0 }, imagesToLoad: [], imagesLoaded: 0 }), a20.emit("_swiper"), a20.params.init && a20.init(), a20;
    }
    getDirectionLabel(e) {
      return this.isHorizontal() ? e : { width: "height", "margin-top": "margin-left", "margin-bottom ": "margin-right", "margin-left": "margin-top", "margin-right": "margin-bottom", "padding-left": "padding-top", "padding-right": "padding-bottom", marginRight: "marginBottom" }[e];
    }
    getSlideIndex(e) {
      const { slidesEl: t2, params: s3 } = this, n3 = N(t2, `.${s3.slideClass}, swiper-slide`), r = te(n3[0]);
      return te(e) - r;
    }
    getSlideIndexByData(e) {
      return this.getSlideIndex(this.slides.find((t2) => t2.getAttribute("data-swiper-slide-index") * 1 === e));
    }
    recalcSlides() {
      const e = this, { slidesEl: t2, params: s3 } = e;
      e.slides = N(t2, `.${s3.slideClass}, swiper-slide`);
    }
    enable() {
      const e = this;
      e.enabled || (e.enabled = true, e.params.grabCursor && e.setGrabCursor(), e.emit("enable"));
    }
    disable() {
      const e = this;
      e.enabled && (e.enabled = false, e.params.grabCursor && e.unsetGrabCursor(), e.emit("disable"));
    }
    setProgress(e, t2) {
      const s3 = this;
      e = Math.min(Math.max(e, 0), 1);
      const n3 = s3.minTranslate(), o2 = (s3.maxTranslate() - n3) * e + n3;
      s3.translateTo(o2, typeof t2 > "u" ? 0 : t2), s3.updateActiveIndex(), s3.updateSlidesClasses();
    }
    emitContainerClasses() {
      const e = this;
      if (!e.params._emitClasses || !e.el) return;
      const t2 = e.el.className.split(" ").filter((s3) => s3.indexOf("swiper") === 0 || s3.indexOf(e.params.containerModifierClass) === 0);
      e.emit("_containerClasses", t2.join(" "));
    }
    getSlideClasses(e) {
      const t2 = this;
      return t2.destroyed ? "" : e.className.split(" ").filter((s3) => s3.indexOf("swiper-slide") === 0 || s3.indexOf(t2.params.slideClass) === 0).join(" ");
    }
    emitSlidesClasses() {
      const e = this;
      if (!e.params._emitClasses || !e.el) return;
      const t2 = [];
      e.slides.forEach((s3) => {
        const n3 = e.getSlideClasses(s3);
        t2.push({ slideEl: s3, classNames: n3 }), e.emit("_slideClass", s3, n3);
      }), e.emit("_slideClasses", t2);
    }
    slidesPerViewDynamic(e, t2) {
      e === void 0 && (e = "current"), t2 === void 0 && (t2 = false);
      const s3 = this, { params: n3, slides: r, slidesGrid: o2, slidesSizesGrid: a20, size: d2, activeIndex: l3 } = s3;
      let c = 1;
      if (typeof n3.slidesPerView == "number") return n3.slidesPerView;
      if (n3.centeredSlides) {
        let f4 = r[l3] ? Math.ceil(r[l3].swiperSlideSize) : 0, h2;
        for (let g4 = l3 + 1; g4 < r.length; g4 += 1) r[g4] && !h2 && (f4 += Math.ceil(r[g4].swiperSlideSize), c += 1, f4 > d2 && (h2 = true));
        for (let g4 = l3 - 1; g4 >= 0; g4 -= 1) r[g4] && !h2 && (f4 += r[g4].swiperSlideSize, c += 1, f4 > d2 && (h2 = true));
      } else if (e === "current") for (let f4 = l3 + 1; f4 < r.length; f4 += 1) (t2 ? o2[f4] + a20[f4] - o2[l3] < d2 : o2[f4] - o2[l3] < d2) && (c += 1);
      else for (let f4 = l3 - 1; f4 >= 0; f4 -= 1) o2[l3] - o2[f4] < d2 && (c += 1);
      return c;
    }
    update() {
      const e = this;
      if (!e || e.destroyed) return;
      const { snapGrid: t2, params: s3 } = e;
      s3.breakpoints && e.setBreakpoint(), [...e.el.querySelectorAll('[loading="lazy"]')].forEach((o2) => {
        o2.complete && Z(e, o2);
      }), e.updateSize(), e.updateSlides(), e.updateProgress(), e.updateSlidesClasses();
      function n3() {
        const o2 = e.rtlTranslate ? e.translate * -1 : e.translate, a20 = Math.min(Math.max(o2, e.maxTranslate()), e.minTranslate());
        e.setTranslate(a20), e.updateActiveIndex(), e.updateSlidesClasses();
      }
      let r;
      if (s3.freeMode && s3.freeMode.enabled && !s3.cssMode) n3(), s3.autoHeight && e.updateAutoHeight();
      else {
        if ((s3.slidesPerView === "auto" || s3.slidesPerView > 1) && e.isEnd && !s3.centeredSlides) {
          const o2 = e.virtual && s3.virtual.enabled ? e.virtual.slides : e.slides;
          r = e.slideTo(o2.length - 1, 0, false, true);
        } else r = e.slideTo(e.activeIndex, 0, false, true);
        r || n3();
      }
      s3.watchOverflow && t2 !== e.snapGrid && e.checkOverflow(), e.emit("update");
    }
    changeDirection(e, t2) {
      t2 === void 0 && (t2 = true);
      const s3 = this, n3 = s3.params.direction;
      return e || (e = n3 === "horizontal" ? "vertical" : "horizontal"), e === n3 || e !== "horizontal" && e !== "vertical" || (s3.el.classList.remove(`${s3.params.containerModifierClass}${n3}`), s3.el.classList.add(`${s3.params.containerModifierClass}${e}`), s3.emitContainerClasses(), s3.params.direction = e, s3.slides.forEach((r) => {
        e === "vertical" ? r.style.width = "" : r.style.height = "";
      }), s3.emit("changeDirection"), t2 && s3.update()), s3;
    }
    changeLanguageDirection(e) {
      const t2 = this;
      t2.rtl && e === "rtl" || !t2.rtl && e === "ltr" || (t2.rtl = e === "rtl", t2.rtlTranslate = t2.params.direction === "horizontal" && t2.rtl, t2.rtl ? (t2.el.classList.add(`${t2.params.containerModifierClass}rtl`), t2.el.dir = "rtl") : (t2.el.classList.remove(`${t2.params.containerModifierClass}rtl`), t2.el.dir = "ltr"), t2.update());
    }
    mount(e) {
      const t2 = this;
      if (t2.mounted) return true;
      let s3 = e || t2.params.el;
      if (typeof s3 == "string" && (s3 = document.querySelector(s3)), !s3) return false;
      s3.swiper = t2, s3.parentNode && s3.parentNode.host && s3.parentNode.host.nodeName === t2.params.swiperElementNodeName.toUpperCase() && (t2.isElement = true);
      const n3 = () => `.${(t2.params.wrapperClass || "").trim().split(" ").join(".")}`;
      let o2 = s3 && s3.shadowRoot && s3.shadowRoot.querySelector ? s3.shadowRoot.querySelector(n3()) : N(s3, n3())[0];
      return !o2 && t2.params.createElements && (o2 = Y2("div", t2.params.wrapperClass), s3.append(o2), N(s3, `.${t2.params.slideClass}`).forEach((a20) => {
        o2.append(a20);
      })), Object.assign(t2, { el: s3, wrapperEl: o2, slidesEl: t2.isElement && !s3.parentNode.host.slideSlots ? s3.parentNode.host : o2, hostEl: t2.isElement ? s3.parentNode.host : s3, mounted: true, rtl: s3.dir.toLowerCase() === "rtl" || R(s3, "direction") === "rtl", rtlTranslate: t2.params.direction === "horizontal" && (s3.dir.toLowerCase() === "rtl" || R(s3, "direction") === "rtl"), wrongRTL: R(o2, "display") === "-webkit-box" }), true;
    }
    init(e) {
      const t2 = this;
      if (t2.initialized || t2.mount(e) === false) return t2;
      t2.emit("beforeInit"), t2.params.breakpoints && t2.setBreakpoint(), t2.addClasses(), t2.updateSize(), t2.updateSlides(), t2.params.watchOverflow && t2.checkOverflow(), t2.params.grabCursor && t2.enabled && t2.setGrabCursor(), t2.params.loop && t2.virtual && t2.params.virtual.enabled ? t2.slideTo(t2.params.initialSlide + t2.virtual.slidesBefore, 0, t2.params.runCallbacksOnInit, false, true) : t2.slideTo(t2.params.initialSlide, 0, t2.params.runCallbacksOnInit, false, true), t2.params.loop && t2.loopCreate(void 0, true), t2.attachEvents();
      const n3 = [...t2.el.querySelectorAll('[loading="lazy"]')];
      return t2.isElement && n3.push(...t2.hostEl.querySelectorAll('[loading="lazy"]')), n3.forEach((r) => {
        r.complete ? Z(t2, r) : r.addEventListener("load", (o2) => {
          Z(t2, o2.target);
        });
      }), fe(t2), t2.initialized = true, fe(t2), t2.emit("init"), t2.emit("afterInit"), t2;
    }
    destroy(e, t2) {
      e === void 0 && (e = true), t2 === void 0 && (t2 = true);
      const s3 = this, { params: n3, el: r, wrapperEl: o2, slides: a20 } = s3;
      return typeof s3.params > "u" || s3.destroyed || (s3.emit("beforeDestroy"), s3.initialized = false, s3.detachEvents(), n3.loop && s3.loopDestroy(), t2 && (s3.removeClasses(), r && typeof r != "string" && r.removeAttribute("style"), o2 && o2.removeAttribute("style"), a20 && a20.length && a20.forEach((d2) => {
        d2.classList.remove(n3.slideVisibleClass, n3.slideFullyVisibleClass, n3.slideActiveClass, n3.slideNextClass, n3.slidePrevClass), d2.removeAttribute("style"), d2.removeAttribute("data-swiper-slide-index");
      })), s3.emit("destroy"), Object.keys(s3.eventsListeners).forEach((d2) => {
        s3.off(d2);
      }), e !== false && (s3.el && typeof s3.el != "string" && (s3.el.swiper = null), De(s3)), s3.destroyed = true), null;
    }
    static extendDefaults(e) {
      F(de, e);
    }
    static get extendedDefaults() {
      return de;
    }
    static get defaults() {
      return ye;
    }
    static installModule(e) {
      __.prototype.__modules__ || (__.prototype.__modules__ = []);
      const t2 = __.prototype.__modules__;
      typeof e == "function" && t2.indexOf(e) < 0 && t2.push(e);
    }
    static use(e) {
      return Array.isArray(e) ? (e.forEach((t2) => __.installModule(t2)), __) : (__.installModule(e), __);
    }
  };
  Object.keys(oe).forEach((i3) => {
    Object.keys(oe[i3]).forEach((e) => {
      _3.prototype[e] = oe[i3][e];
    });
  });
  _3.use([We, Xe]);
  function Le(i3, e, t2, s3) {
    return i3.params.createElements && Object.keys(s3).forEach((n3) => {
      if (!t2[n3] && t2.auto === true) {
        let r = N(i3.el, `.${s3[n3]}`)[0];
        r || (r = Y2("div", s3[n3]), r.className = s3[n3], i3.el.append(r)), t2[n3] = r, e[n3] = r;
      }
    }), t2;
  }
  function Jt(i3) {
    let { swiper: e, extendParams: t2, on: s3, emit: n3 } = i3;
    t2({ navigation: { nextEl: null, prevEl: null, hideOnClick: false, disabledClass: "swiper-button-disabled", hiddenClass: "swiper-button-hidden", lockClass: "swiper-button-lock", navigationDisabledClass: "swiper-navigation-disabled" } }), e.navigation = { nextEl: null, prevEl: null };
    function r(m3) {
      let v3;
      return m3 && typeof m3 == "string" && e.isElement && (v3 = e.el.querySelector(m3) || e.hostEl.querySelector(m3), v3) ? v3 : (m3 && (typeof m3 == "string" && (v3 = [...document.querySelectorAll(m3)]), e.params.uniqueNavElements && typeof m3 == "string" && v3 && v3.length > 1 && e.el.querySelectorAll(m3).length === 1 ? v3 = e.el.querySelector(m3) : v3 && v3.length === 1 && (v3 = v3[0])), m3 && !v3 ? m3 : v3);
    }
    function o2(m3, v3) {
      const S3 = e.params.navigation;
      m3 = $(m3), m3.forEach((w4) => {
        w4 && (w4.classList[v3 ? "add" : "remove"](...S3.disabledClass.split(" ")), w4.tagName === "BUTTON" && (w4.disabled = v3), e.params.watchOverflow && e.enabled && w4.classList[e.isLocked ? "add" : "remove"](S3.lockClass));
      });
    }
    function a20() {
      const { nextEl: m3, prevEl: v3 } = e.navigation;
      if (e.params.loop) {
        o2(v3, false), o2(m3, false);
        return;
      }
      o2(v3, e.isBeginning && !e.params.rewind), o2(m3, e.isEnd && !e.params.rewind);
    }
    function d2(m3) {
      m3.preventDefault(), !(e.isBeginning && !e.params.loop && !e.params.rewind) && (e.slidePrev(), n3("navigationPrev"));
    }
    function l3(m3) {
      m3.preventDefault(), !(e.isEnd && !e.params.loop && !e.params.rewind) && (e.slideNext(), n3("navigationNext"));
    }
    function c() {
      const m3 = e.params.navigation;
      if (e.params.navigation = Le(e, e.originalParams.navigation, e.params.navigation, { nextEl: "swiper-button-next", prevEl: "swiper-button-prev" }), !(m3.nextEl || m3.prevEl)) return;
      let v3 = r(m3.nextEl), S3 = r(m3.prevEl);
      Object.assign(e.navigation, { nextEl: v3, prevEl: S3 }), v3 = $(v3), S3 = $(S3);
      const w4 = (u3, p3) => {
        u3 && u3.addEventListener("click", p3 === "next" ? l3 : d2), !e.enabled && u3 && u3.classList.add(...m3.lockClass.split(" "));
      };
      v3.forEach((u3) => w4(u3, "next")), S3.forEach((u3) => w4(u3, "prev"));
    }
    function f4() {
      let { nextEl: m3, prevEl: v3 } = e.navigation;
      m3 = $(m3), v3 = $(v3);
      const S3 = (w4, u3) => {
        w4.removeEventListener("click", u3 === "next" ? l3 : d2), w4.classList.remove(...e.params.navigation.disabledClass.split(" "));
      };
      m3.forEach((w4) => S3(w4, "next")), v3.forEach((w4) => S3(w4, "prev"));
    }
    s3("init", () => {
      e.params.navigation.enabled === false ? g4() : (c(), a20());
    }), s3("toEdge fromEdge lock unlock", () => {
      a20();
    }), s3("destroy", () => {
      f4();
    }), s3("enable disable", () => {
      let { nextEl: m3, prevEl: v3 } = e.navigation;
      if (m3 = $(m3), v3 = $(v3), e.enabled) {
        a20();
        return;
      }
      [...m3, ...v3].filter((S3) => !!S3).forEach((S3) => S3.classList.add(e.params.navigation.lockClass));
    }), s3("click", (m3, v3) => {
      let { nextEl: S3, prevEl: w4 } = e.navigation;
      S3 = $(S3), w4 = $(w4);
      const u3 = v3.target;
      let p3 = w4.includes(u3) || S3.includes(u3);
      if (e.isElement && !p3) {
        const y3 = v3.path || v3.composedPath && v3.composedPath();
        y3 && (p3 = y3.find((T2) => S3.includes(T2) || w4.includes(T2)));
      }
      if (e.params.navigation.hideOnClick && !p3) {
        if (e.pagination && e.params.pagination && e.params.pagination.clickable && (e.pagination.el === u3 || e.pagination.el.contains(u3))) return;
        let y3;
        S3.length ? y3 = S3[0].classList.contains(e.params.navigation.hiddenClass) : w4.length && (y3 = w4[0].classList.contains(e.params.navigation.hiddenClass)), n3(y3 === true ? "navigationShow" : "navigationHide"), [...S3, ...w4].filter((T2) => !!T2).forEach((T2) => T2.classList.toggle(e.params.navigation.hiddenClass));
      }
    });
    const h2 = () => {
      e.el.classList.remove(...e.params.navigation.navigationDisabledClass.split(" ")), c(), a20();
    }, g4 = () => {
      e.el.classList.add(...e.params.navigation.navigationDisabledClass.split(" ")), f4();
    };
    Object.assign(e.navigation, { enable: h2, disable: g4, update: a20, init: c, destroy: f4 });
  }
  function W2(i3) {
    return i3 === void 0 && (i3 = ""), `.${i3.trim().replace(/([\.:!+\/])/g, "\\$1").replace(/ /g, ".")}`;
  }
  function ei(i3) {
    let { swiper: e, extendParams: t2, on: s3, emit: n3 } = i3;
    const r = "swiper-pagination";
    t2({ pagination: { el: null, bulletElement: "span", clickable: false, hideOnClick: false, renderBullet: null, renderProgressbar: null, renderFraction: null, renderCustom: null, progressbarOpposite: false, type: "bullets", dynamicBullets: false, dynamicMainBullets: 1, formatFractionCurrent: (u3) => u3, formatFractionTotal: (u3) => u3, bulletClass: `${r}-bullet`, bulletActiveClass: `${r}-bullet-active`, modifierClass: `${r}-`, currentClass: `${r}-current`, totalClass: `${r}-total`, hiddenClass: `${r}-hidden`, progressbarFillClass: `${r}-progressbar-fill`, progressbarOppositeClass: `${r}-progressbar-opposite`, clickableClass: `${r}-clickable`, lockClass: `${r}-lock`, horizontalClass: `${r}-horizontal`, verticalClass: `${r}-vertical`, paginationDisabledClass: `${r}-disabled` } }), e.pagination = { el: null, bullets: [] };
    let o2, a20 = 0;
    function d2() {
      return !e.params.pagination.el || !e.pagination.el || Array.isArray(e.pagination.el) && e.pagination.el.length === 0;
    }
    function l3(u3, p3) {
      const { bulletActiveClass: y3 } = e.params.pagination;
      u3 && (u3 = u3[`${p3 === "prev" ? "previous" : "next"}ElementSibling`], u3 && (u3.classList.add(`${y3}-${p3}`), u3 = u3[`${p3 === "prev" ? "previous" : "next"}ElementSibling`], u3 && u3.classList.add(`${y3}-${p3}-${p3}`)));
    }
    function c(u3, p3, y3) {
      if (u3 = u3 % y3, p3 = p3 % y3, p3 === u3 + 1) return "next";
      if (p3 === u3 - 1) return "previous";
    }
    function f4(u3) {
      const p3 = u3.target.closest(W2(e.params.pagination.bulletClass));
      if (!p3) return;
      u3.preventDefault();
      const y3 = te(p3) * e.params.slidesPerGroup;
      if (e.params.loop) {
        if (e.realIndex === y3) return;
        const T2 = c(e.realIndex, y3, e.slides.length);
        T2 === "next" ? e.slideNext() : T2 === "previous" ? e.slidePrev() : e.slideToLoop(y3);
      } else e.slideTo(y3);
    }
    function h2() {
      const u3 = e.rtl, p3 = e.params.pagination;
      if (d2()) return;
      let y3 = e.pagination.el;
      y3 = $(y3);
      let T2, P3;
      const M4 = e.virtual && e.params.virtual.enabled ? e.virtual.slides.length : e.slides.length, E5 = e.params.loop ? Math.ceil(M4 / e.params.slidesPerGroup) : e.snapGrid.length;
      if (e.params.loop ? (P3 = e.previousRealIndex || 0, T2 = e.params.slidesPerGroup > 1 ? Math.floor(e.realIndex / e.params.slidesPerGroup) : e.realIndex) : typeof e.snapIndex < "u" ? (T2 = e.snapIndex, P3 = e.previousSnapIndex) : (P3 = e.previousIndex || 0, T2 = e.activeIndex || 0), p3.type === "bullets" && e.pagination.bullets && e.pagination.bullets.length > 0) {
        const C4 = e.pagination.bullets;
        let b4, x4, I2;
        if (p3.dynamicBullets && (o2 = ce(C4[0], e.isHorizontal() ? "width" : "height"), y3.forEach((A4) => {
          A4.style[e.isHorizontal() ? "width" : "height"] = `${o2 * (p3.dynamicMainBullets + 4)}px`;
        }), p3.dynamicMainBullets > 1 && P3 !== void 0 && (a20 += T2 - (P3 || 0), a20 > p3.dynamicMainBullets - 1 ? a20 = p3.dynamicMainBullets - 1 : a20 < 0 && (a20 = 0)), b4 = Math.max(T2 - a20, 0), x4 = b4 + (Math.min(C4.length, p3.dynamicMainBullets) - 1), I2 = (x4 + b4) / 2), C4.forEach((A4) => {
          const z2 = [...["", "-next", "-next-next", "-prev", "-prev-prev", "-main"].map((k3) => `${p3.bulletActiveClass}${k3}`)].map((k3) => typeof k3 == "string" && k3.includes(" ") ? k3.split(" ") : k3).flat();
          A4.classList.remove(...z2);
        }), y3.length > 1) C4.forEach((A4) => {
          const z2 = te(A4);
          z2 === T2 ? A4.classList.add(...p3.bulletActiveClass.split(" ")) : e.isElement && A4.setAttribute("part", "bullet"), p3.dynamicBullets && (z2 >= b4 && z2 <= x4 && A4.classList.add(...`${p3.bulletActiveClass}-main`.split(" ")), z2 === b4 && l3(A4, "prev"), z2 === x4 && l3(A4, "next"));
        });
        else {
          const A4 = C4[T2];
          if (A4 && A4.classList.add(...p3.bulletActiveClass.split(" ")), e.isElement && C4.forEach((z2, k3) => {
            z2.setAttribute("part", k3 === T2 ? "bullet-active" : "bullet");
          }), p3.dynamicBullets) {
            const z2 = C4[b4], k3 = C4[x4];
            for (let L2 = b4; L2 <= x4; L2 += 1) C4[L2] && C4[L2].classList.add(...`${p3.bulletActiveClass}-main`.split(" "));
            l3(z2, "prev"), l3(k3, "next");
          }
        }
        if (p3.dynamicBullets) {
          const A4 = Math.min(C4.length, p3.dynamicMainBullets + 4), z2 = (o2 * A4 - o2) / 2 - I2 * o2, k3 = u3 ? "right" : "left";
          C4.forEach((L2) => {
            L2.style[e.isHorizontal() ? k3 : "top"] = `${z2}px`;
          });
        }
      }
      y3.forEach((C4, b4) => {
        if (p3.type === "fraction" && (C4.querySelectorAll(W2(p3.currentClass)).forEach((x4) => {
          x4.textContent = p3.formatFractionCurrent(T2 + 1);
        }), C4.querySelectorAll(W2(p3.totalClass)).forEach((x4) => {
          x4.textContent = p3.formatFractionTotal(E5);
        })), p3.type === "progressbar") {
          let x4;
          p3.progressbarOpposite ? x4 = e.isHorizontal() ? "vertical" : "horizontal" : x4 = e.isHorizontal() ? "horizontal" : "vertical";
          const I2 = (T2 + 1) / E5;
          let A4 = 1, z2 = 1;
          x4 === "horizontal" ? A4 = I2 : z2 = I2, C4.querySelectorAll(W2(p3.progressbarFillClass)).forEach((k3) => {
            k3.style.transform = `translate3d(0,0,0) scaleX(${A4}) scaleY(${z2})`, k3.style.transitionDuration = `${e.params.speed}ms`;
          });
        }
        p3.type === "custom" && p3.renderCustom ? (me(C4, p3.renderCustom(e, T2 + 1, E5)), b4 === 0 && n3("paginationRender", C4)) : (b4 === 0 && n3("paginationRender", C4), n3("paginationUpdate", C4)), e.params.watchOverflow && e.enabled && C4.classList[e.isLocked ? "add" : "remove"](p3.lockClass);
      });
    }
    function g4() {
      const u3 = e.params.pagination;
      if (d2()) return;
      const p3 = e.virtual && e.params.virtual.enabled ? e.virtual.slides.length : e.grid && e.params.grid.rows > 1 ? e.slides.length / Math.ceil(e.params.grid.rows) : e.slides.length;
      let y3 = e.pagination.el;
      y3 = $(y3);
      let T2 = "";
      if (u3.type === "bullets") {
        let P3 = e.params.loop ? Math.ceil(p3 / e.params.slidesPerGroup) : e.snapGrid.length;
        e.params.freeMode && e.params.freeMode.enabled && P3 > p3 && (P3 = p3);
        for (let M4 = 0; M4 < P3; M4 += 1) u3.renderBullet ? T2 += u3.renderBullet.call(e, M4, u3.bulletClass) : T2 += `<${u3.bulletElement} ${e.isElement ? 'part="bullet"' : ""} class="${u3.bulletClass}"></${u3.bulletElement}>`;
      }
      u3.type === "fraction" && (u3.renderFraction ? T2 = u3.renderFraction.call(e, u3.currentClass, u3.totalClass) : T2 = `<span class="${u3.currentClass}"></span> / <span class="${u3.totalClass}"></span>`), u3.type === "progressbar" && (u3.renderProgressbar ? T2 = u3.renderProgressbar.call(e, u3.progressbarFillClass) : T2 = `<span class="${u3.progressbarFillClass}"></span>`), e.pagination.bullets = [], y3.forEach((P3) => {
        u3.type !== "custom" && me(P3, T2 || ""), u3.type === "bullets" && e.pagination.bullets.push(...P3.querySelectorAll(W2(u3.bulletClass)));
      }), u3.type !== "custom" && n3("paginationRender", y3[0]);
    }
    function m3() {
      e.params.pagination = Le(e, e.originalParams.pagination, e.params.pagination, { el: "swiper-pagination" });
      const u3 = e.params.pagination;
      if (!u3.el) return;
      let p3;
      typeof u3.el == "string" && e.isElement && (p3 = e.el.querySelector(u3.el)), !p3 && typeof u3.el == "string" && (p3 = [...document.querySelectorAll(u3.el)]), p3 || (p3 = u3.el), !(!p3 || p3.length === 0) && (e.params.uniqueNavElements && typeof u3.el == "string" && Array.isArray(p3) && p3.length > 1 && (p3 = [...e.el.querySelectorAll(u3.el)], p3.length > 1 && (p3 = p3.find((y3) => be(y3, ".swiper")[0] === e.el))), Array.isArray(p3) && p3.length === 1 && (p3 = p3[0]), Object.assign(e.pagination, { el: p3 }), p3 = $(p3), p3.forEach((y3) => {
        u3.type === "bullets" && u3.clickable && y3.classList.add(...(u3.clickableClass || "").split(" ")), y3.classList.add(u3.modifierClass + u3.type), y3.classList.add(e.isHorizontal() ? u3.horizontalClass : u3.verticalClass), u3.type === "bullets" && u3.dynamicBullets && (y3.classList.add(`${u3.modifierClass}${u3.type}-dynamic`), a20 = 0, u3.dynamicMainBullets < 1 && (u3.dynamicMainBullets = 1)), u3.type === "progressbar" && u3.progressbarOpposite && y3.classList.add(u3.progressbarOppositeClass), u3.clickable && y3.addEventListener("click", f4), e.enabled || y3.classList.add(u3.lockClass);
      }));
    }
    function v3() {
      const u3 = e.params.pagination;
      if (d2()) return;
      let p3 = e.pagination.el;
      p3 && (p3 = $(p3), p3.forEach((y3) => {
        y3.classList.remove(u3.hiddenClass), y3.classList.remove(u3.modifierClass + u3.type), y3.classList.remove(e.isHorizontal() ? u3.horizontalClass : u3.verticalClass), u3.clickable && (y3.classList.remove(...(u3.clickableClass || "").split(" ")), y3.removeEventListener("click", f4));
      })), e.pagination.bullets && e.pagination.bullets.forEach((y3) => y3.classList.remove(...u3.bulletActiveClass.split(" ")));
    }
    s3("changeDirection", () => {
      if (!e.pagination || !e.pagination.el) return;
      const u3 = e.params.pagination;
      let { el: p3 } = e.pagination;
      p3 = $(p3), p3.forEach((y3) => {
        y3.classList.remove(u3.horizontalClass, u3.verticalClass), y3.classList.add(e.isHorizontal() ? u3.horizontalClass : u3.verticalClass);
      });
    }), s3("init", () => {
      e.params.pagination.enabled === false ? w4() : (m3(), g4(), h2());
    }), s3("activeIndexChange", () => {
      typeof e.snapIndex > "u" && h2();
    }), s3("snapIndexChange", () => {
      h2();
    }), s3("snapGridLengthChange", () => {
      g4(), h2();
    }), s3("destroy", () => {
      v3();
    }), s3("enable disable", () => {
      let { el: u3 } = e.pagination;
      u3 && (u3 = $(u3), u3.forEach((p3) => p3.classList[e.enabled ? "remove" : "add"](e.params.pagination.lockClass)));
    }), s3("lock unlock", () => {
      h2();
    }), s3("click", (u3, p3) => {
      const y3 = p3.target, T2 = $(e.pagination.el);
      if (e.params.pagination.el && e.params.pagination.hideOnClick && T2 && T2.length > 0 && !y3.classList.contains(e.params.pagination.bulletClass)) {
        if (e.navigation && (e.navigation.nextEl && y3 === e.navigation.nextEl || e.navigation.prevEl && y3 === e.navigation.prevEl)) return;
        const P3 = T2[0].classList.contains(e.params.pagination.hiddenClass);
        n3(P3 === true ? "paginationShow" : "paginationHide"), T2.forEach((M4) => M4.classList.toggle(e.params.pagination.hiddenClass));
      }
    });
    const S3 = () => {
      e.el.classList.remove(e.params.pagination.paginationDisabledClass);
      let { el: u3 } = e.pagination;
      u3 && (u3 = $(u3), u3.forEach((p3) => p3.classList.remove(e.params.pagination.paginationDisabledClass))), m3(), g4(), h2();
    }, w4 = () => {
      e.el.classList.add(e.params.pagination.paginationDisabledClass);
      let { el: u3 } = e.pagination;
      u3 && (u3 = $(u3), u3.forEach((p3) => p3.classList.add(e.params.pagination.paginationDisabledClass))), v3();
    };
    Object.assign(e.pagination, { enable: S3, disable: w4, render: g4, update: h2, init: m3, destroy: v3 });
  }
  function ti(i3) {
    let { swiper: e, extendParams: t2, on: s3 } = i3;
    t2({ parallax: { enabled: false } });
    const n3 = "[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]", r = (d2, l3) => {
      const { rtl: c } = e, f4 = c ? -1 : 1, h2 = d2.getAttribute("data-swiper-parallax") || "0";
      let g4 = d2.getAttribute("data-swiper-parallax-x"), m3 = d2.getAttribute("data-swiper-parallax-y");
      const v3 = d2.getAttribute("data-swiper-parallax-scale"), S3 = d2.getAttribute("data-swiper-parallax-opacity"), w4 = d2.getAttribute("data-swiper-parallax-rotate");
      if (g4 || m3 ? (g4 = g4 || "0", m3 = m3 || "0") : e.isHorizontal() ? (g4 = h2, m3 = "0") : (m3 = h2, g4 = "0"), g4.indexOf("%") >= 0 ? g4 = `${parseInt(g4, 10) * l3 * f4}%` : g4 = `${g4 * l3 * f4}px`, m3.indexOf("%") >= 0 ? m3 = `${parseInt(m3, 10) * l3}%` : m3 = `${m3 * l3}px`, typeof S3 < "u" && S3 !== null) {
        const p3 = S3 - (S3 - 1) * (1 - Math.abs(l3));
        d2.style.opacity = p3;
      }
      let u3 = `translate3d(${g4}, ${m3}, 0px)`;
      if (typeof v3 < "u" && v3 !== null) {
        const p3 = v3 - (v3 - 1) * (1 - Math.abs(l3));
        u3 += ` scale(${p3})`;
      }
      if (w4 && typeof w4 < "u" && w4 !== null) {
        const p3 = w4 * l3 * -1;
        u3 += ` rotate(${p3}deg)`;
      }
      d2.style.transform = u3;
    }, o2 = () => {
      const { el: d2, slides: l3, progress: c, snapGrid: f4, isElement: h2 } = e, g4 = N(d2, n3);
      e.isElement && g4.push(...N(e.hostEl, n3)), g4.forEach((m3) => {
        r(m3, c);
      }), l3.forEach((m3, v3) => {
        let S3 = m3.progress;
        e.params.slidesPerGroup > 1 && e.params.slidesPerView !== "auto" && (S3 += Math.ceil(v3 / 2) - c * (f4.length - 1)), S3 = Math.min(Math.max(S3, -1), 1), m3.querySelectorAll(`${n3}, [data-swiper-parallax-rotate]`).forEach((w4) => {
          r(w4, S3);
        });
      });
    }, a20 = function(d2) {
      d2 === void 0 && (d2 = e.params.speed);
      const { el: l3, hostEl: c } = e, f4 = [...l3.querySelectorAll(n3)];
      e.isElement && f4.push(...c.querySelectorAll(n3)), f4.forEach((h2) => {
        let g4 = parseInt(h2.getAttribute("data-swiper-parallax-duration"), 10) || d2;
        d2 === 0 && (g4 = 0), h2.style.transitionDuration = `${g4}ms`;
      });
    };
    s3("beforeInit", () => {
      e.params.parallax.enabled && (e.params.watchSlidesProgress = true, e.originalParams.watchSlidesProgress = true);
    }), s3("init", () => {
      e.params.parallax.enabled && o2();
    }), s3("setTranslate", () => {
      e.params.parallax.enabled && o2();
    }), s3("setTransition", (d2, l3) => {
      e.params.parallax.enabled && a20(l3);
    });
  }
  function ii(i3) {
    let { swiper: e, extendParams: t2, on: s3 } = i3;
    t2({ controller: { control: void 0, inverse: false, by: "slide" } }), e.controller = { control: void 0 };
    function n3(l3, c) {
      const f4 = /* @__PURE__ */ (function() {
        let v3, S3, w4;
        return (u3, p3) => {
          for (S3 = -1, v3 = u3.length; v3 - S3 > 1; ) w4 = v3 + S3 >> 1, u3[w4] <= p3 ? S3 = w4 : v3 = w4;
          return v3;
        };
      })();
      this.x = l3, this.y = c, this.lastIndex = l3.length - 1;
      let h2, g4;
      return this.interpolate = function(v3) {
        return v3 ? (g4 = f4(this.x, v3), h2 = g4 - 1, (v3 - this.x[h2]) * (this.y[g4] - this.y[h2]) / (this.x[g4] - this.x[h2]) + this.y[h2]) : 0;
      }, this;
    }
    function r(l3) {
      e.controller.spline = e.params.loop ? new n3(e.slidesGrid, l3.slidesGrid) : new n3(e.snapGrid, l3.snapGrid);
    }
    function o2(l3, c) {
      const f4 = e.controller.control;
      let h2, g4;
      const m3 = e.constructor;
      function v3(S3) {
        if (S3.destroyed) return;
        const w4 = e.rtlTranslate ? -e.translate : e.translate;
        e.params.controller.by === "slide" && (r(S3), g4 = -e.controller.spline.interpolate(-w4)), (!g4 || e.params.controller.by === "container") && (h2 = (S3.maxTranslate() - S3.minTranslate()) / (e.maxTranslate() - e.minTranslate()), (Number.isNaN(h2) || !Number.isFinite(h2)) && (h2 = 1), g4 = (w4 - e.minTranslate()) * h2 + S3.minTranslate()), e.params.controller.inverse && (g4 = S3.maxTranslate() - g4), S3.updateProgress(g4), S3.setTranslate(g4, e), S3.updateActiveIndex(), S3.updateSlidesClasses();
      }
      if (Array.isArray(f4)) for (let S3 = 0; S3 < f4.length; S3 += 1) f4[S3] !== c && f4[S3] instanceof m3 && v3(f4[S3]);
      else f4 instanceof m3 && c !== f4 && v3(f4);
    }
    function a20(l3, c) {
      const f4 = e.constructor, h2 = e.controller.control;
      let g4;
      function m3(v3) {
        v3.destroyed || (v3.setTransition(l3, e), l3 !== 0 && (v3.transitionStart(), v3.params.autoHeight && J(() => {
          v3.updateAutoHeight();
        }), X(v3.wrapperEl, () => {
          h2 && v3.transitionEnd();
        })));
      }
      if (Array.isArray(h2)) for (g4 = 0; g4 < h2.length; g4 += 1) h2[g4] !== c && h2[g4] instanceof f4 && m3(h2[g4]);
      else h2 instanceof f4 && c !== h2 && m3(h2);
    }
    function d2() {
      e.controller.control && e.controller.spline && (e.controller.spline = void 0, delete e.controller.spline);
    }
    s3("beforeInit", () => {
      if (typeof window < "u" && (typeof e.params.controller.control == "string" || e.params.controller.control instanceof HTMLElement)) {
        (typeof e.params.controller.control == "string" ? [...document.querySelectorAll(e.params.controller.control)] : [e.params.controller.control]).forEach((c) => {
          if (e.controller.control || (e.controller.control = []), c && c.swiper) e.controller.control.push(c.swiper);
          else if (c) {
            const f4 = `${e.params.eventsPrefix}init`, h2 = (g4) => {
              e.controller.control.push(g4.detail[0]), e.update(), c.removeEventListener(f4, h2);
            };
            c.addEventListener(f4, h2);
          }
        });
        return;
      }
      e.controller.control = e.params.controller.control;
    }), s3("update", () => {
      d2();
    }), s3("resize", () => {
      d2();
    }), s3("observerUpdate", () => {
      d2();
    }), s3("setTranslate", (l3, c, f4) => {
      !e.controller.control || e.controller.control.destroyed || e.controller.setTranslate(c, f4);
    }), s3("setTransition", (l3, c, f4) => {
      !e.controller.control || e.controller.control.destroyed || e.controller.setTransition(c, f4);
    }), Object.assign(e.controller, { setTranslate: o2, setTransition: a20 });
  }
  function si(i3) {
    let { swiper: e, extendParams: t2, on: s3, emit: n3, params: r } = i3;
    e.autoplay = { running: false, paused: false, timeLeft: 0 }, t2({ autoplay: { enabled: false, delay: 3e3, waitForTransition: true, disableOnInteraction: false, stopOnLastSlide: false, reverseDirection: false, pauseOnMouseEnter: false } });
    let o2, a20, d2 = r && r.autoplay ? r.autoplay.delay : 3e3, l3 = r && r.autoplay ? r.autoplay.delay : 3e3, c, f4 = (/* @__PURE__ */ new Date()).getTime(), h2, g4, m3, v3, S3, w4, u3;
    function p3(O3) {
      !e || e.destroyed || !e.wrapperEl || O3.target === e.wrapperEl && (e.wrapperEl.removeEventListener("transitionend", p3), !(u3 || O3.detail && O3.detail.bySwiperTouchMove) && b4());
    }
    const y3 = () => {
      if (e.destroyed || !e.autoplay.running) return;
      e.autoplay.paused ? h2 = true : h2 && (l3 = c, h2 = false);
      const O3 = e.autoplay.paused ? c : f4 + l3 - (/* @__PURE__ */ new Date()).getTime();
      e.autoplay.timeLeft = O3, n3("autoplayTimeLeft", O3, O3 / d2), a20 = requestAnimationFrame(() => {
        y3();
      });
    }, T2 = () => {
      let O3;
      return e.virtual && e.params.virtual.enabled ? O3 = e.slides.find((B3) => B3.classList.contains("swiper-slide-active")) : O3 = e.slides[e.activeIndex], O3 ? parseInt(O3.getAttribute("data-swiper-autoplay"), 10) : void 0;
    }, P3 = (O3) => {
      if (e.destroyed || !e.autoplay.running) return;
      cancelAnimationFrame(a20), y3();
      let D5 = typeof O3 > "u" ? e.params.autoplay.delay : O3;
      d2 = e.params.autoplay.delay, l3 = e.params.autoplay.delay;
      const B3 = T2();
      !Number.isNaN(B3) && B3 > 0 && typeof O3 > "u" && (D5 = B3, d2 = B3, l3 = B3), c = D5;
      const q7 = e.params.speed, U3 = () => {
        !e || e.destroyed || (e.params.autoplay.reverseDirection ? !e.isBeginning || e.params.loop || e.params.rewind ? (e.slidePrev(q7, true, true), n3("autoplay")) : e.params.autoplay.stopOnLastSlide || (e.slideTo(e.slides.length - 1, q7, true, true), n3("autoplay")) : !e.isEnd || e.params.loop || e.params.rewind ? (e.slideNext(q7, true, true), n3("autoplay")) : e.params.autoplay.stopOnLastSlide || (e.slideTo(0, q7, true, true), n3("autoplay")), e.params.cssMode && (f4 = (/* @__PURE__ */ new Date()).getTime(), requestAnimationFrame(() => {
          P3();
        })));
      };
      return D5 > 0 ? (clearTimeout(o2), o2 = setTimeout(() => {
        U3();
      }, D5)) : requestAnimationFrame(() => {
        U3();
      }), D5;
    }, M4 = () => {
      f4 = (/* @__PURE__ */ new Date()).getTime(), e.autoplay.running = true, P3(), n3("autoplayStart");
    }, E5 = () => {
      e.autoplay.running = false, clearTimeout(o2), cancelAnimationFrame(a20), n3("autoplayStop");
    }, C4 = (O3, D5) => {
      if (e.destroyed || !e.autoplay.running) return;
      clearTimeout(o2), O3 || (w4 = true);
      const B3 = () => {
        n3("autoplayPause"), e.params.autoplay.waitForTransition ? e.wrapperEl.addEventListener("transitionend", p3) : b4();
      };
      if (e.autoplay.paused = true, D5) {
        S3 && (c = e.params.autoplay.delay), S3 = false, B3();
        return;
      }
      c = (c || e.params.autoplay.delay) - ((/* @__PURE__ */ new Date()).getTime() - f4), !(e.isEnd && c < 0 && !e.params.loop) && (c < 0 && (c = 0), B3());
    }, b4 = () => {
      e.isEnd && c < 0 && !e.params.loop || e.destroyed || !e.autoplay.running || (f4 = (/* @__PURE__ */ new Date()).getTime(), w4 ? (w4 = false, P3(c)) : P3(), e.autoplay.paused = false, n3("autoplayResume"));
    }, x4 = () => {
      if (e.destroyed || !e.autoplay.running) return;
      const O3 = H();
      O3.visibilityState === "hidden" && (w4 = true, C4(true)), O3.visibilityState === "visible" && b4();
    }, I2 = (O3) => {
      O3.pointerType === "mouse" && (w4 = true, u3 = true, !(e.animating || e.autoplay.paused) && C4(true));
    }, A4 = (O3) => {
      O3.pointerType === "mouse" && (u3 = false, e.autoplay.paused && b4());
    }, z2 = () => {
      e.params.autoplay.pauseOnMouseEnter && (e.el.addEventListener("pointerenter", I2), e.el.addEventListener("pointerleave", A4));
    }, k3 = () => {
      e.el && typeof e.el != "string" && (e.el.removeEventListener("pointerenter", I2), e.el.removeEventListener("pointerleave", A4));
    }, L2 = () => {
      H().addEventListener("visibilitychange", x4);
    }, G3 = () => {
      H().removeEventListener("visibilitychange", x4);
    };
    s3("init", () => {
      e.params.autoplay.enabled && (z2(), L2(), M4());
    }), s3("destroy", () => {
      k3(), G3(), e.autoplay.running && E5();
    }), s3("_freeModeStaticRelease", () => {
      (m3 || w4) && b4();
    }), s3("_freeModeNoMomentumRelease", () => {
      e.params.autoplay.disableOnInteraction ? E5() : C4(true, true);
    }), s3("beforeTransitionStart", (O3, D5, B3) => {
      e.destroyed || !e.autoplay.running || (B3 || !e.params.autoplay.disableOnInteraction ? C4(true, true) : E5());
    }), s3("sliderFirstMove", () => {
      if (!(e.destroyed || !e.autoplay.running)) {
        if (e.params.autoplay.disableOnInteraction) {
          E5();
          return;
        }
        g4 = true, m3 = false, w4 = false, v3 = setTimeout(() => {
          w4 = true, m3 = true, C4(true);
        }, 200);
      }
    }), s3("touchEnd", () => {
      if (!(e.destroyed || !e.autoplay.running || !g4)) {
        if (clearTimeout(v3), clearTimeout(o2), e.params.autoplay.disableOnInteraction) {
          m3 = false, g4 = false;
          return;
        }
        m3 && e.params.cssMode && b4(), m3 = false, g4 = false;
      }
    }), s3("slideChange", () => {
      e.destroyed || !e.autoplay.running || (S3 = true);
    }), Object.assign(e.autoplay, { start: M4, stop: E5, pause: C4, resume: b4 });
  }
  function ri(i3) {
    let { swiper: e, extendParams: t2, emit: s3, once: n3 } = i3;
    t2({ freeMode: { enabled: false, momentum: true, momentumRatio: 1, momentumBounce: true, momentumBounceRatio: 1, momentumVelocityRatio: 1, sticky: false, minimumVelocity: 0.02 } });
    function r() {
      if (e.params.cssMode) return;
      const d2 = e.getTranslate();
      e.setTranslate(d2), e.setTransition(0), e.touchEventsData.velocities.length = 0, e.freeMode.onTouchEnd({ currentPos: e.rtl ? e.translate : -e.translate });
    }
    function o2() {
      if (e.params.cssMode) return;
      const { touchEventsData: d2, touches: l3 } = e;
      d2.velocities.length === 0 && d2.velocities.push({ position: l3[e.isHorizontal() ? "startX" : "startY"], time: d2.touchStartTime }), d2.velocities.push({ position: l3[e.isHorizontal() ? "currentX" : "currentY"], time: j() });
    }
    function a20(d2) {
      let { currentPos: l3 } = d2;
      if (e.params.cssMode) return;
      const { params: c, wrapperEl: f4, rtlTranslate: h2, snapGrid: g4, touchEventsData: m3 } = e, S3 = j() - m3.touchStartTime;
      if (l3 < -e.minTranslate()) {
        e.slideTo(e.activeIndex);
        return;
      }
      if (l3 > -e.maxTranslate()) {
        e.slides.length < g4.length ? e.slideTo(g4.length - 1) : e.slideTo(e.slides.length - 1);
        return;
      }
      if (c.freeMode.momentum) {
        if (m3.velocities.length > 1) {
          const E5 = m3.velocities.pop(), C4 = m3.velocities.pop(), b4 = E5.position - C4.position, x4 = E5.time - C4.time;
          e.velocity = b4 / x4, e.velocity /= 2, Math.abs(e.velocity) < c.freeMode.minimumVelocity && (e.velocity = 0), (x4 > 150 || j() - E5.time > 300) && (e.velocity = 0);
        } else e.velocity = 0;
        e.velocity *= c.freeMode.momentumVelocityRatio, m3.velocities.length = 0;
        let w4 = 1e3 * c.freeMode.momentumRatio;
        const u3 = e.velocity * w4;
        let p3 = e.translate + u3;
        h2 && (p3 = -p3);
        let y3 = false, T2;
        const P3 = Math.abs(e.velocity) * 20 * c.freeMode.momentumBounceRatio;
        let M4;
        if (p3 < e.maxTranslate()) c.freeMode.momentumBounce ? (p3 + e.maxTranslate() < -P3 && (p3 = e.maxTranslate() - P3), T2 = e.maxTranslate(), y3 = true, m3.allowMomentumBounce = true) : p3 = e.maxTranslate(), c.loop && c.centeredSlides && (M4 = true);
        else if (p3 > e.minTranslate()) c.freeMode.momentumBounce ? (p3 - e.minTranslate() > P3 && (p3 = e.minTranslate() + P3), T2 = e.minTranslate(), y3 = true, m3.allowMomentumBounce = true) : p3 = e.minTranslate(), c.loop && c.centeredSlides && (M4 = true);
        else if (c.freeMode.sticky) {
          let E5;
          for (let C4 = 0; C4 < g4.length; C4 += 1) if (g4[C4] > -p3) {
            E5 = C4;
            break;
          }
          Math.abs(g4[E5] - p3) < Math.abs(g4[E5 - 1] - p3) || e.swipeDirection === "next" ? p3 = g4[E5] : p3 = g4[E5 - 1], p3 = -p3;
        }
        if (M4 && n3("transitionEnd", () => {
          e.loopFix();
        }), e.velocity !== 0) {
          if (h2 ? w4 = Math.abs((-p3 - e.translate) / e.velocity) : w4 = Math.abs((p3 - e.translate) / e.velocity), c.freeMode.sticky) {
            const E5 = Math.abs((h2 ? -p3 : p3) - e.translate), C4 = e.slidesSizesGrid[e.activeIndex];
            E5 < C4 ? w4 = c.speed : E5 < 2 * C4 ? w4 = c.speed * 1.5 : w4 = c.speed * 2.5;
          }
        } else if (c.freeMode.sticky) {
          e.slideToClosest();
          return;
        }
        c.freeMode.momentumBounce && y3 ? (e.updateProgress(T2), e.setTransition(w4), e.setTranslate(p3), e.transitionStart(true, e.swipeDirection), e.animating = true, X(f4, () => {
          !e || e.destroyed || !m3.allowMomentumBounce || (s3("momentumBounce"), e.setTransition(c.speed), setTimeout(() => {
            e.setTranslate(T2), X(f4, () => {
              !e || e.destroyed || e.transitionEnd();
            });
          }, 0));
        })) : e.velocity ? (s3("_freeModeNoMomentumRelease"), e.updateProgress(p3), e.setTransition(w4), e.setTranslate(p3), e.transitionStart(true, e.swipeDirection), e.animating || (e.animating = true, X(f4, () => {
          !e || e.destroyed || e.transitionEnd();
        }))) : e.updateProgress(p3), e.updateActiveIndex(), e.updateSlidesClasses();
      } else if (c.freeMode.sticky) {
        e.slideToClosest();
        return;
      } else c.freeMode && s3("_freeModeNoMomentumRelease");
      (!c.freeMode.momentum || S3 >= c.longSwipesMs) && (s3("_freeModeStaticRelease"), e.updateProgress(), e.updateActiveIndex(), e.updateSlidesClasses());
    }
    Object.assign(e, { freeMode: { onTouchStart: r, onTouchMove: o2, onTouchEnd: a20 } });
  }
  function Ie(i3) {
    const { effect: e, swiper: t2, on: s3, setTranslate: n3, setTransition: r, overwriteParams: o2, perspective: a20, recreateShadows: d2, getEffectParams: l3 } = i3;
    s3("beforeInit", () => {
      if (t2.params.effect !== e) return;
      t2.classNames.push(`${t2.params.containerModifierClass}${e}`), a20 && a20() && t2.classNames.push(`${t2.params.containerModifierClass}3d`);
      const f4 = o2 ? o2() : {};
      Object.assign(t2.params, f4), Object.assign(t2.originalParams, f4);
    }), s3("setTranslate _virtualUpdated", () => {
      t2.params.effect === e && n3();
    }), s3("setTransition", (f4, h2) => {
      t2.params.effect === e && r(h2);
    }), s3("transitionEnd", () => {
      if (t2.params.effect === e && d2) {
        if (!l3 || !l3().slideShadows) return;
        t2.slides.forEach((f4) => {
          f4.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach((h2) => h2.remove());
        }), d2();
      }
    });
    let c;
    s3("virtualUpdate", () => {
      t2.params.effect === e && (t2.slides.length || (c = true), requestAnimationFrame(() => {
        c && t2.slides && t2.slides.length && (n3(), c = false);
      }));
    });
  }
  function Ae(i3, e) {
    const t2 = ie(e);
    return t2 !== e && (t2.style.backfaceVisibility = "hidden", t2.style["-webkit-backface-visibility"] = "hidden"), t2;
  }
  function Oe(i3) {
    let { swiper: e, duration: t2, transformElements: s3, allSlides: n3 } = i3;
    const { activeIndex: r } = e, o2 = (a20) => a20.parentElement ? a20.parentElement : e.slides.find((l3) => l3.shadowRoot && l3.shadowRoot === a20.parentNode);
    if (e.params.virtualTranslate && t2 !== 0) {
      let a20 = false, d2;
      n3 ? d2 = s3 : d2 = s3.filter((l3) => {
        const c = l3.classList.contains("swiper-slide-transform") ? o2(l3) : l3;
        return e.getSlideIndex(c) === r;
      }), d2.forEach((l3) => {
        X(l3, () => {
          if (a20 || !e || e.destroyed) return;
          a20 = true, e.animating = false;
          const c = new window.CustomEvent("transitionend", { bubbles: true, cancelable: true });
          e.wrapperEl.dispatchEvent(c);
        });
      });
    }
  }
  function ni(i3) {
    let { swiper: e, extendParams: t2, on: s3 } = i3;
    t2({ fadeEffect: { crossFade: false } }), Ie({ effect: "fade", swiper: e, on: s3, setTranslate: () => {
      const { slides: o2 } = e, a20 = e.params.fadeEffect;
      for (let d2 = 0; d2 < o2.length; d2 += 1) {
        const l3 = e.slides[d2];
        let f4 = -l3.swiperSlideOffset;
        e.params.virtualTranslate || (f4 -= e.translate);
        let h2 = 0;
        e.isHorizontal() || (h2 = f4, f4 = 0);
        const g4 = e.params.fadeEffect.crossFade ? Math.max(1 - Math.abs(l3.progress), 0) : 1 + Math.min(Math.max(l3.progress, -1), 0), m3 = Ae(a20, l3);
        m3.style.opacity = g4, m3.style.transform = `translate3d(${f4}px, ${h2}px, 0px)`;
      }
    }, setTransition: (o2) => {
      const a20 = e.slides.map((d2) => ie(d2));
      a20.forEach((d2) => {
        d2.style.transitionDuration = `${o2}ms`;
      }), Oe({ swiper: e, duration: o2, transformElements: a20, allSlides: true });
    }, overwriteParams: () => ({ slidesPerView: 1, slidesPerGroup: 1, watchSlidesProgress: true, spaceBetween: 0, virtualTranslate: !e.params.cssMode }) });
  }
  function Zt(i3, e, t2) {
    const s3 = `swiper-slide-shadow${` swiper-slide-shadow-${i3}`}`, n3 = ie(e);
    let r = n3.querySelector(`.${s3.split(" ").join(".")}`);
    return r || (r = Y2("div", s3.split(" ")), n3.append(r)), r;
  }
  function ai(i3) {
    let { swiper: e, extendParams: t2, on: s3 } = i3;
    t2({ creativeEffect: { limitProgress: 1, shadowPerProgress: false, progressMultiplier: 1, perspective: true, prev: { translate: [0, 0, 0], rotate: [0, 0, 0], opacity: 1, scale: 1 }, next: { translate: [0, 0, 0], rotate: [0, 0, 0], opacity: 1, scale: 1 } } });
    const n3 = (a20) => typeof a20 == "string" ? a20 : `${a20}px`;
    Ie({ effect: "creative", swiper: e, on: s3, setTranslate: () => {
      const { slides: a20, wrapperEl: d2, slidesSizesGrid: l3 } = e, c = e.params.creativeEffect, { progressMultiplier: f4 } = c, h2 = e.params.centeredSlides, g4 = He(e);
      if (h2) {
        const m3 = l3[0] / 2 - e.params.slidesOffsetBefore || 0;
        d2.style.transform = `translateX(calc(50% - ${m3}px))`;
      }
      for (let m3 = 0; m3 < a20.length; m3 += 1) {
        const v3 = a20[m3], S3 = v3.progress, w4 = Math.min(Math.max(v3.progress, -c.limitProgress), c.limitProgress);
        let u3 = w4;
        h2 || (u3 = Math.min(Math.max(v3.originalProgress, -c.limitProgress), c.limitProgress));
        const p3 = v3.swiperSlideOffset, y3 = [e.params.cssMode ? -p3 - e.translate : -p3, 0, 0], T2 = [0, 0, 0];
        let P3 = false;
        e.isHorizontal() || (y3[1] = y3[0], y3[0] = 0);
        let M4 = { translate: [0, 0, 0], rotate: [0, 0, 0], scale: 1, opacity: 1 };
        w4 < 0 ? (M4 = c.next, P3 = true) : w4 > 0 && (M4 = c.prev, P3 = true), y3.forEach((z2, k3) => {
          y3[k3] = `calc(${z2}px + (${n3(M4.translate[k3])} * ${Math.abs(w4 * f4)}))`;
        }), T2.forEach((z2, k3) => {
          let L2 = M4.rotate[k3] * Math.abs(w4 * f4);
          T2[k3] = L2;
        }), v3.style.zIndex = -Math.abs(Math.round(S3)) + a20.length;
        const E5 = y3.join(", "), C4 = `rotateX(${g4(T2[0])}deg) rotateY(${g4(T2[1])}deg) rotateZ(${g4(T2[2])}deg)`, b4 = u3 < 0 ? `scale(${1 + (1 - M4.scale) * u3 * f4})` : `scale(${1 - (1 - M4.scale) * u3 * f4})`, x4 = u3 < 0 ? 1 + (1 - M4.opacity) * u3 * f4 : 1 - (1 - M4.opacity) * u3 * f4, I2 = `translate3d(${E5}) ${C4} ${b4}`;
        if (P3 && M4.shadow || !P3) {
          let z2 = v3.querySelector(".swiper-slide-shadow");
          if (!z2 && M4.shadow && (z2 = Zt("creative", v3)), z2) {
            const k3 = c.shadowPerProgress ? w4 * (1 / c.limitProgress) : w4;
            z2.style.opacity = Math.min(Math.max(Math.abs(k3), 0), 1);
          }
        }
        const A4 = Ae(c, v3);
        A4.style.transform = I2, A4.style.opacity = x4, M4.origin && (A4.style.transformOrigin = M4.origin);
      }
    }, setTransition: (a20) => {
      const d2 = e.slides.map((l3) => ie(l3));
      d2.forEach((l3) => {
        l3.style.transitionDuration = `${a20}ms`, l3.querySelectorAll(".swiper-slide-shadow").forEach((c) => {
          c.style.transitionDuration = `${a20}ms`;
        });
      }), Oe({ swiper: e, duration: a20, transformElements: d2, allSlides: true });
    }, perspective: () => e.params.creativeEffect.perspective, overwriteParams: () => ({ watchSlidesProgress: true, virtualTranslate: !e.params.cssMode }) });
  }

  // build/assets/carousel-VVAQes_I.js
  var p = () => window.__refreshScrollTriggers?.();
  function q3() {
    const u3 = document.querySelectorAll(".breadcrumbs__carousel"), B3 = document.querySelectorAll(".cardCarousel"), f4 = document.querySelectorAll(".reviewsCarousel"), P3 = document.querySelectorAll(".articleGallery"), V4 = document.querySelectorAll(".accommodationGallery"), v3 = document.querySelectorAll(".galleryCarousel");
    u3.forEach((e) => {
      e.classList.contains("swiper-initialized") || new _3(e, { modules: [ri], slidesPerView: "auto", freeMode: true });
    }), B3.forEach((e) => {
      if (e.classList.contains("swiper-initialized")) return;
      const s3 = e.id;
      e.dataset.slides;
      const t2 = document.querySelector(`.cardCarousel__prev[data-carousel="${s3}"]`), a20 = document.querySelector(`.cardCarousel__next[data-carousel="${s3}"]`), r = { modules: [Jt], maxBackfaceHiddenSlides: 10, spaceBetween: 12, slidesPerView: 1.1, navigation: { prevEl: t2, nextEl: a20 } };
      function i3() {
        e.classList.contains("cardCarousel--with-sidebar") ? r.breakpoints = { 600: { spaceBetween: 14, slidesPerView: 1.5 }, 800: { spaceBetween: 16, slidesPerView: 1.8 }, 1e3: { spaceBetween: 18, slidesPerView: 2.1 }, 1200: { spaceBetween: 20, slidesPerView: 1.9 }, 1400: { spaceBetween: 22, slidesPerView: 2 }, 1600: { spaceBetween: 24, slidesPerView: 2.1 }, 1800: { spaceBetween: 26, slidesPerView: 2.2 }, 2e3: { spaceBetween: 28, slidesPerView: 2.3 }, 2200: { spaceBetween: 30, slidesPerView: 2.4 }, 2400: { spaceBetween: 32, slidesPerView: 2.5 } } : e.classList.contains("cardCarousel--experiences") ? r.breakpoints = { 500: { spaceBetween: 12, slidesPerView: 1.3 }, 600: { spaceBetween: 14, slidesPerView: 1.5 }, 700: { spaceBetween: 14, slidesPerView: 2 }, 800: { spaceBetween: 16, slidesPerView: 2.5 }, 1e3: { spaceBetween: 18, slidesPerView: 3 }, 1200: { spaceBetween: 20, slidesPerView: 3.5 }, 1400: { spaceBetween: 22, slidesPerView: 4 }, 1600: { spaceBetween: 24, slidesPerView: 4 }, 1800: { spaceBetween: 26, slidesPerView: 4 }, 2e3: { spaceBetween: 28, slidesPerView: 4 }, 2200: { spaceBetween: 30, slidesPerView: 4 }, 2400: { spaceBetween: 32, slidesPerView: 4 } } : e.classList.contains("cardCarousel--subpages") ? r.breakpoints = { 600: { spaceBetween: 14, slidesPerView: 1.5 }, 800: { spaceBetween: 16, slidesPerView: 2 }, 1e3: { spaceBetween: 18, slidesPerView: 2.5 }, 1200: { spaceBetween: 20, slidesPerView: 3 }, 1400: { spaceBetween: 22, slidesPerView: 3 }, 1600: { spaceBetween: 24, slidesPerView: 3 }, 1800: { spaceBetween: 26, slidesPerView: 3 }, 2e3: { spaceBetween: 28, slidesPerView: 3 }, 2200: { spaceBetween: 30, slidesPerView: 3 }, 2400: { spaceBetween: 32, slidesPerView: 3 } } : e.classList.contains("cardCarousel--team") ? (r.centerInsufficientSlides = true, r.breakpoints = { 600: { spaceBetween: 14, slidesPerView: 1.5 }, 800: { spaceBetween: 16, slidesPerView: 2 }, 1e3: { spaceBetween: 18, slidesPerView: 2.5 }, 1200: { spaceBetween: 20, slidesPerView: 3 }, 1400: { spaceBetween: 22, slidesPerView: 3 }, 1600: { spaceBetween: 24, slidesPerView: 3 }, 1800: { spaceBetween: 26, slidesPerView: 4 }, 2e3: { spaceBetween: 28, slidesPerView: 4 }, 2200: { spaceBetween: 30, slidesPerView: 4 }, 2400: { spaceBetween: 32, slidesPerView: 4 } }) : r.slidesPerView = 3;
      }
      i3(), new _3(e, r);
    }), f4.forEach((e) => {
      const s3 = e.querySelector(".reviewsCarousel__container");
      if (!s3 || s3.classList.contains("swiper-initialized")) return;
      const t2 = e.querySelector(".reviewsCarousel__prev"), a20 = e.querySelector(".reviewsCarousel__next"), r = s3.querySelectorAll(":scope > .swiper-wrapper > .swiper-slide").length > 1;
      new _3(s3, { modules: [ai, Jt], loop: r, speed: 500, effect: "creative", creativeEffect: { prev: { translate: [0, -80, 0], opacity: 0 }, next: { translate: [0, 80, 0], opacity: 0 } }, navigation: { prevEl: t2, nextEl: a20 } });
    }), v3.forEach((e) => {
      if (e.classList.contains("swiper-initialized")) return;
      const s3 = e.querySelector(".galleryCarousel__prev"), t2 = e.querySelector(".galleryCarousel__next"), a20 = e.querySelectorAll(":scope > .swiper-wrapper > .swiper-slide").length > 1, r = new _3(e, { modules: [si, Jt], maxBackfaceHiddenSlides: 10, loop: a20, slidesPerView: "auto", spaceBetween: 12, centeredSlides: true, slideToClickedSlide: true, observer: true, observeParents: true, resizeObserver: true, autoplay: { delay: 1500, disableOnInteraction: false }, navigation: { prevEl: s3, nextEl: t2 }, breakpoints: { 600: { spaceBetween: 14 }, 800: { spaceBetween: 16 }, 1e3: { spaceBetween: 18 }, 1200: { spaceBetween: 20 }, 1400: { spaceBetween: 22 }, 1600: { spaceBetween: 24 }, 1800: { spaceBetween: 26 }, 2e3: { spaceBetween: 28 }, 2200: { spaceBetween: 30 }, 2400: { spaceBetween: 32 } } }), i3 = () => {
        requestAnimationFrame(() => {
          r.update(), r.loopFix(), p();
        });
      }, m3 = e.querySelectorAll("img"), o2 = Array.from(m3).filter((c) => !c.complete);
      o2.length === 0 ? i3() : o2.forEach((c) => {
        c.addEventListener("load", i3, { once: true }), c.addEventListener("error", i3, { once: true });
      }), window.addEventListener("load", i3, { once: true });
    }), P3.forEach((e) => {
      const s3 = e.querySelector(".articleGallery__carousel");
      if (!s3 || s3.classList.contains("swiper-initialized")) return;
      const t2 = e.querySelector(".articleGallery__prev"), a20 = e.querySelector(".articleGallery__next"), r = e.querySelector(".articleGallery__pagination"), i3 = s3.querySelectorAll(":scope > .swiper-wrapper > .swiper-slide").length > 1;
      new _3(s3, { modules: [ni, Jt, ei], loop: i3, effect: "fade", fadeEffect: { crossFade: true }, navigation: { prevEl: t2, nextEl: a20 }, pagination: { el: r, clickable: true }, on: { slideChange: function() {
        p();
      } } });
    }), V4.forEach((e) => {
      if (e.classList.contains("swiper-initialized")) return;
      const s3 = e.querySelector(".accommodationGallery__prev"), t2 = e.querySelector(".accommodationGallery__next");
      new _3(e, { modules: [ai, Jt, ei], effect: "creative", creativeEffect: { prev: { translate: ["-25%", 0, 0], scale: 0.8, shadow: true }, next: { translate: ["25%", 0, 0], scale: 0.8, shadow: true } }, grabCursor: true, navigation: { prevEl: s3, nextEl: t2 } });
    });
  }

  // build/assets/tabs-CQXi5teO.js
  var u = () => window.__refreshScrollTriggers?.();
  function B() {
    document.querySelectorAll(".tabs__container").forEach((s3) => {
      if (s3.querySelector(".tabs__nav-carousel")) {
        const t2 = s3.querySelector(".tabs__nav-carousel"), e = s3.querySelector(".tabs__nav-prev"), a20 = s3.querySelector(".tabs__nav-next");
        s3.classList.contains("weatherTabs") ? new _3(t2, { modules: [Jt], spaceBetween: 4, slidesPerView: 4, navigation: { prevEl: e, nextEl: a20 }, breakpoints: { 500: { spaceBetween: 4, slidesPerView: 5 }, 600: { spaceBetween: 5, slidesPerView: 6 }, 700: { spaceBetween: 5, slidesPerView: 7 }, 800: { spaceBetween: 6, slidesPerView: 8 }, 900: { spaceBetween: 6, slidesPerView: 9 }, 1e3: { spaceBetween: 7, slidesPerView: 10 }, 1100: { spaceBetween: 7, slidesPerView: 11 }, 1100: { spaceBetween: 8, slidesPerView: 12 } } }) : s3.classList.contains("tabs--stripped") ? new _3(t2, { modules: [Jt], spaceBetween: 24, slidesPerView: "auto", navigation: { prevEl: e, nextEl: a20 }, breakpoints: { 900: { spaceBetween: 27 }, 1400: { spaceBetween: 30 }, 1900: { spaceBetween: 33 }, 2400: { spaceBetween: 36 } } }) : new _3(t2, { modules: [Jt], spaceBetween: 4, slidesPerView: "auto", navigation: { prevEl: e, nextEl: a20 } });
      }
      const o2 = s3.querySelector(":scope > .tabs__nav"), i3 = s3.querySelector(":scope > .tabs__content"), r = o2.querySelectorAll(".tabs__btn");
      function w4(t2) {
        for (var e = 0; e < r.length; e++) r[e].classList.remove("active");
        var a20 = t2.currentTarget;
        a20.classList.add("active"), t2.preventDefault();
        var l3 = i3.querySelectorAll(":scope > .tabs__pane");
        for (e = 0; e < l3.length; e++) l3[e].classList.remove("active");
        var p3 = t2.currentTarget, v3 = p3.dataset.tabPane, d2 = s3.querySelector(`#${v3}`);
        d2.classList.add("active"), setTimeout(u, 100);
      }
      r.forEach((t2) => {
        t2.addEventListener("click", w4);
      });
    });
  }

  // build/assets/vendor-gsap-Bus_UFKE.js
  function tr(a20) {
    if (a20 === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return a20;
  }
  function ia(a20, e) {
    a20.prototype = Object.create(e.prototype), a20.prototype.constructor = a20, a20.__proto__ = e;
  }
  var Tt2 = { autoSleep: 120, force3D: "auto", nullTargetWarn: 1, units: { lineHeight: "" } };
  var gi = { duration: 0.5, overwrite: false, delay: 0 };
  var Ws;
  var Ye2;
  var le2;
  var Et2 = 1e8;
  var ne2 = 1 / Et2;
  var hs = Math.PI * 2;
  var Ou = hs / 4;
  var Mu = 0;
  var na = Math.sqrt;
  var Eu = Math.cos;
  var Du = Math.sin;
  var ze2 = function(e) {
    return typeof e == "string";
  };
  var pe2 = function(e) {
    return typeof e == "function";
  };
  var or = function(e) {
    return typeof e == "number";
  };
  var Xs = function(e) {
    return typeof e > "u";
  };
  var Qt2 = function(e) {
    return typeof e == "object";
  };
  var ut2 = function(e) {
    return e !== false;
  };
  var Vs = function() {
    return typeof window < "u";
  };
  var fn = function(e) {
    return pe2(e) || ze2(e);
  };
  var sa = typeof ArrayBuffer == "function" && ArrayBuffer.isView || function() {
  };
  var je2 = Array.isArray;
  var _s = /(?:-?\.?\d|\.)+/gi;
  var oa = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g;
  var ai2 = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g;
  var jn = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi;
  var aa = /[+-]=-?[.\d]+/;
  var ua = /[^,'"\[\]\s]+/gi;
  var Au = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i;
  var ce2;
  var Vt2;
  var ds;
  var $s;
  var St2 = {};
  var An = {};
  var la;
  var fa = function(e) {
    return (An = mi(e, St2)) && ht2;
  };
  var Us = function(e, r) {
    return console.warn("Invalid property", e, "set to", r, "Missing plugin? gsap.registerPlugin()");
  };
  var ji = function(e, r) {
    return !r && console.warn(e);
  };
  var ca = function(e, r) {
    return e && (St2[e] = r) && An && (An[e] = r) || St2;
  };
  var Ki = function() {
    return 0;
  };
  var Ru = { suppressEvents: true, isStart: true, kill: false };
  var Tn = { suppressEvents: true, kill: false };
  var zu = { suppressEvents: true };
  var Gs = {};
  var xr = [];
  var ps = {};
  var ha;
  var yt2 = {};
  var Kn = {};
  var go = 30;
  var Sn = [];
  var Hs = "";
  var qs = function(e) {
    var r = e[0], t2, i3;
    if (Qt2(r) || pe2(r) || (e = [e]), !(t2 = (r._gsap || {}).harness)) {
      for (i3 = Sn.length; i3-- && !Sn[i3].targetTest(r); ) ;
      t2 = Sn[i3];
    }
    for (i3 = e.length; i3--; ) e[i3] && (e[i3]._gsap || (e[i3]._gsap = new La(e[i3], t2))) || e.splice(i3, 1);
    return e;
  };
  var Br = function(e) {
    return e._gsap || qs(Dt2(e))[0]._gsap;
  };
  var _a = function(e, r, t2) {
    return (t2 = e[r]) && pe2(t2) ? e[r]() : Xs(t2) && e.getAttribute && e.getAttribute(r) || t2;
  };
  var lt2 = function(e, r) {
    return (e = e.split(",")).forEach(r) || e;
  };
  var ve2 = function(e) {
    return Math.round(e * 1e5) / 1e5 || 0;
  };
  var Ce2 = function(e) {
    return Math.round(e * 1e7) / 1e7 || 0;
  };
  var fi = function(e, r) {
    var t2 = r.charAt(0), i3 = parseFloat(r.substr(2));
    return e = parseFloat(e), t2 === "+" ? e + i3 : t2 === "-" ? e - i3 : t2 === "*" ? e * i3 : e / i3;
  };
  var Fu = function(e, r) {
    for (var t2 = r.length, i3 = 0; e.indexOf(r[i3]) < 0 && ++i3 < t2; ) ;
    return i3 < t2;
  };
  var Rn = function() {
    var e = xr.length, r = xr.slice(0), t2, i3;
    for (ps = {}, xr.length = 0, t2 = 0; t2 < e; t2++) i3 = r[t2], i3 && i3._lazy && (i3.render(i3._lazy[0], i3._lazy[1], true)._lazy = 0);
  };
  var Qs = function(e) {
    return !!(e._initted || e._startAt || e.add);
  };
  var da = function(e, r, t2, i3) {
    xr.length && !Ye2 && Rn(), e.render(r, t2, !!(Ye2 && r < 0 && Qs(e))), xr.length && !Ye2 && Rn();
  };
  var pa = function(e) {
    var r = parseFloat(e);
    return (r || r === 0) && (e + "").match(ua).length < 2 ? r : ze2(e) ? e.trim() : e;
  };
  var ga = function(e) {
    return e;
  };
  var Ct2 = function(e, r) {
    for (var t2 in r) t2 in e || (e[t2] = r[t2]);
    return e;
  };
  var Lu = function(e) {
    return function(r, t2) {
      for (var i3 in t2) i3 in r || i3 === "duration" && e || i3 === "ease" || (r[i3] = t2[i3]);
    };
  };
  var mi = function(e, r) {
    for (var t2 in r) e[t2] = r[t2];
    return e;
  };
  var mo = function a(e, r) {
    for (var t2 in r) t2 !== "__proto__" && t2 !== "constructor" && t2 !== "prototype" && (e[t2] = Qt2(r[t2]) ? a(e[t2] || (e[t2] = {}), r[t2]) : r[t2]);
    return e;
  };
  var zn = function(e, r) {
    var t2 = {}, i3;
    for (i3 in e) i3 in r || (t2[i3] = e[i3]);
    return t2;
  };
  var Ii = function(e) {
    var r = e.parent || ce2, t2 = e.keyframes ? Lu(je2(e.keyframes)) : Ct2;
    if (ut2(e.inherit)) for (; r; ) t2(e, r.vars.defaults), r = r.parent || r._dp;
    return e;
  };
  var Nu = function(e, r) {
    for (var t2 = e.length, i3 = t2 === r.length; i3 && t2-- && e[t2] === r[t2]; ) ;
    return t2 < 0;
  };
  var ma = function(e, r, t2, i3, n3) {
    var s3 = e[i3], o2;
    if (n3) for (o2 = r[n3]; s3 && s3[n3] > o2; ) s3 = s3._prev;
    return s3 ? (r._next = s3._next, s3._next = r) : (r._next = e[t2], e[t2] = r), r._next ? r._next._prev = r : e[i3] = r, r._prev = s3, r.parent = r._dp = e, r;
  };
  var Un = function(e, r, t2, i3) {
    t2 === void 0 && (t2 = "_first"), i3 === void 0 && (i3 = "_last");
    var n3 = r._prev, s3 = r._next;
    n3 ? n3._next = s3 : e[t2] === r && (e[t2] = s3), s3 ? s3._prev = n3 : e[i3] === r && (e[i3] = n3), r._next = r._prev = r.parent = null;
  };
  var Tr = function(e, r) {
    e.parent && (!r || e.parent.autoRemoveChildren) && e.parent.remove && e.parent.remove(e), e._act = 0;
  };
  var Yr = function(e, r) {
    if (e && (!r || r._end > e._dur || r._start < 0)) for (var t2 = e; t2; ) t2._dirty = 1, t2 = t2.parent;
    return e;
  };
  var Iu = function(e) {
    for (var r = e.parent; r && r.parent; ) r._dirty = 1, r.totalDuration(), r = r.parent;
    return e;
  };
  var gs = function(e, r, t2, i3) {
    return e._startAt && (Ye2 ? e._startAt.revert(Tn) : e.vars.immediateRender && !e.vars.autoRevert || e._startAt.render(r, true, i3));
  };
  var Bu = function a2(e) {
    return !e || e._ts && a2(e.parent);
  };
  var yo = function(e) {
    return e._repeat ? yi(e._tTime, e = e.duration() + e._rDelay) * e : 0;
  };
  var yi = function(e, r) {
    var t2 = Math.floor(e = Ce2(e / r));
    return e && t2 === e ? t2 - 1 : t2;
  };
  var Fn = function(e, r) {
    return (e - r._start) * r._ts + (r._ts >= 0 ? 0 : r._dirty ? r.totalDuration() : r._tDur);
  };
  var Gn = function(e) {
    return e._end = Ce2(e._start + (e._tDur / Math.abs(e._ts || e._rts || ne2) || 0));
  };
  var Hn = function(e, r) {
    var t2 = e._dp;
    return t2 && t2.smoothChildTiming && e._ts && (e._start = Ce2(t2._time - (e._ts > 0 ? r / e._ts : ((e._dirty ? e.totalDuration() : e._tDur) - r) / -e._ts)), Gn(e), t2._dirty || Yr(t2, e)), e;
  };
  var ya = function(e, r) {
    var t2;
    if ((r._time || !r._dur && r._initted || r._start < e._time && (r._dur || !r.add)) && (t2 = Fn(e.rawTime(), r), (!r._dur || on(0, r.totalDuration(), t2) - r._tTime > ne2) && r.render(t2, true)), Yr(e, r)._dp && e._initted && e._time >= e._dur && e._ts) {
      if (e._dur < e.duration()) for (t2 = e; t2._dp; ) t2.rawTime() >= 0 && t2.totalTime(t2._tTime), t2 = t2._dp;
      e._zTime = -ne2;
    }
  };
  var Ut2 = function(e, r, t2, i3) {
    return r.parent && Tr(r), r._start = Ce2((or(t2) ? t2 : t2 || e !== ce2 ? Pt2(e, t2, r) : e._time) + r._delay), r._end = Ce2(r._start + (r.totalDuration() / Math.abs(r.timeScale()) || 0)), ma(e, r, "_first", "_last", e._sort ? "_start" : 0), ms(r) || (e._recent = r), i3 || ya(e, r), e._ts < 0 && Hn(e, e._tTime), e;
  };
  var va = function(e, r) {
    return (St2.ScrollTrigger || Us("scrollTrigger", r)) && St2.ScrollTrigger.create(r, e);
  };
  var xa = function(e, r, t2, i3, n3) {
    if (Ks(e, r, n3), !e._initted) return 1;
    if (!t2 && e._pt && !Ye2 && (e._dur && e.vars.lazy !== false || !e._dur && e.vars.lazy) && ha !== xt2.frame) return xr.push(e), e._lazy = [n3, i3], 1;
  };
  var Yu = function a3(e) {
    var r = e.parent;
    return r && r._ts && r._initted && !r._lock && (r.rawTime() < 0 || a3(r));
  };
  var ms = function(e) {
    var r = e.data;
    return r === "isFromStart" || r === "isStart";
  };
  var Wu = function(e, r, t2, i3) {
    var n3 = e.ratio, s3 = r < 0 || !r && (!e._start && Yu(e) && !(!e._initted && ms(e)) || (e._ts < 0 || e._dp._ts < 0) && !ms(e)) ? 0 : 1, o2 = e._rDelay, u3 = 0, l3, f4, h2;
    if (o2 && e._repeat && (u3 = on(0, e._tDur, r), f4 = yi(u3, o2), e._yoyo && f4 & 1 && (s3 = 1 - s3), f4 !== yi(e._tTime, o2) && (n3 = 1 - s3, e.vars.repeatRefresh && e._initted && e.invalidate())), s3 !== n3 || Ye2 || i3 || e._zTime === ne2 || !r && e._zTime) {
      if (!e._initted && xa(e, r, i3, t2, u3)) return;
      for (h2 = e._zTime, e._zTime = r || (t2 ? ne2 : 0), t2 || (t2 = r && !h2), e.ratio = s3, e._from && (s3 = 1 - s3), e._time = 0, e._tTime = u3, l3 = e._pt; l3; ) l3.r(s3, l3.d), l3 = l3._next;
      r < 0 && gs(e, r, t2, true), e._onUpdate && !t2 && bt2(e, "onUpdate"), u3 && e._repeat && !t2 && e.parent && bt2(e, "onRepeat"), (r >= e._tDur || r < 0) && e.ratio === s3 && (s3 && Tr(e, 1), !t2 && !Ye2 && (bt2(e, s3 ? "onComplete" : "onReverseComplete", true), e._prom && e._prom()));
    } else e._zTime || (e._zTime = r);
  };
  var Xu = function(e, r, t2) {
    var i3;
    if (t2 > r) for (i3 = e._first; i3 && i3._start <= t2; ) {
      if (i3.data === "isPause" && i3._start > r) return i3;
      i3 = i3._next;
    }
    else for (i3 = e._last; i3 && i3._start >= t2; ) {
      if (i3.data === "isPause" && i3._start < r) return i3;
      i3 = i3._prev;
    }
  };
  var vi = function(e, r, t2, i3) {
    var n3 = e._repeat, s3 = Ce2(r) || 0, o2 = e._tTime / e._tDur;
    return o2 && !i3 && (e._time *= s3 / e._dur), e._dur = s3, e._tDur = n3 ? n3 < 0 ? 1e10 : Ce2(s3 * (n3 + 1) + e._rDelay * n3) : s3, o2 > 0 && !i3 && Hn(e, e._tTime = e._tDur * o2), e.parent && Gn(e), t2 || Yr(e.parent, e), e;
  };
  var vo = function(e) {
    return e instanceof Ie2 ? Yr(e) : vi(e, e._dur);
  };
  var Vu = { _start: 0, endTime: Ki, totalDuration: Ki };
  var Pt2 = function a4(e, r, t2) {
    var i3 = e.labels, n3 = e._recent || Vu, s3 = e.duration() >= Et2 ? n3.endTime(false) : e._dur, o2, u3, l3;
    return ze2(r) && (isNaN(r) || r in i3) ? (u3 = r.charAt(0), l3 = r.substr(-1) === "%", o2 = r.indexOf("="), u3 === "<" || u3 === ">" ? (o2 >= 0 && (r = r.replace(/=/, "")), (u3 === "<" ? n3._start : n3.endTime(n3._repeat >= 0)) + (parseFloat(r.substr(1)) || 0) * (l3 ? (o2 < 0 ? n3 : t2).totalDuration() / 100 : 1)) : o2 < 0 ? (r in i3 || (i3[r] = s3), i3[r]) : (u3 = parseFloat(r.charAt(o2 - 1) + r.substr(o2 + 1)), l3 && t2 && (u3 = u3 / 100 * (je2(t2) ? t2[0] : t2).totalDuration()), o2 > 1 ? a4(e, r.substr(0, o2 - 1), t2) + u3 : s3 + u3)) : r == null ? s3 : +r;
  };
  var Bi = function(e, r, t2) {
    var i3 = or(r[1]), n3 = (i3 ? 2 : 1) + (e < 2 ? 0 : 1), s3 = r[n3], o2, u3;
    if (i3 && (s3.duration = r[1]), s3.parent = t2, e) {
      for (o2 = s3, u3 = t2; u3 && !("immediateRender" in o2); ) o2 = u3.vars.defaults || {}, u3 = ut2(u3.vars.inherit) && u3.parent;
      s3.immediateRender = ut2(o2.immediateRender), e < 2 ? s3.runBackwards = 1 : s3.startAt = r[n3 - 1];
    }
    return new xe2(r[0], s3, r[n3 + 1]);
  };
  var kr = function(e, r) {
    return e || e === 0 ? r(e) : r;
  };
  var on = function(e, r, t2) {
    return t2 < e ? e : t2 > r ? r : t2;
  };
  var qe2 = function(e, r) {
    return !ze2(e) || !(r = Au.exec(e)) ? "" : r[1];
  };
  var $u = function(e, r, t2) {
    return kr(t2, function(i3) {
      return on(e, r, i3);
    });
  };
  var ys = [].slice;
  var wa = function(e, r) {
    return e && Qt2(e) && "length" in e && (!r && !e.length || e.length - 1 in e && Qt2(e[0])) && !e.nodeType && e !== Vt2;
  };
  var Uu = function(e, r, t2) {
    return t2 === void 0 && (t2 = []), e.forEach(function(i3) {
      var n3;
      return ze2(i3) && !r || wa(i3, 1) ? (n3 = t2).push.apply(n3, Dt2(i3)) : t2.push(i3);
    }) || t2;
  };
  var Dt2 = function(e, r, t2) {
    return le2 && !r && le2.selector ? le2.selector(e) : ze2(e) && !t2 && (ds || !xi()) ? ys.call((r || $s).querySelectorAll(e), 0) : je2(e) ? Uu(e, t2) : wa(e) ? ys.call(e, 0) : e ? [e] : [];
  };
  var vs = function(e) {
    return e = Dt2(e)[0] || ji("Invalid scope") || {}, function(r) {
      var t2 = e.current || e.nativeElement || e;
      return Dt2(r, t2.querySelectorAll ? t2 : t2 === e ? ji("Invalid scope") || $s.createElement("div") : e);
    };
  };
  var ba = function(e) {
    return e.sort(function() {
      return 0.5 - Math.random();
    });
  };
  var Ta = function(e) {
    if (pe2(e)) return e;
    var r = Qt2(e) ? e : { each: e }, t2 = Wr(r.ease), i3 = r.from || 0, n3 = parseFloat(r.base) || 0, s3 = {}, o2 = i3 > 0 && i3 < 1, u3 = isNaN(i3) || o2, l3 = r.axis, f4 = i3, h2 = i3;
    return ze2(i3) ? f4 = h2 = { center: 0.5, edges: 0.5, end: 1 }[i3] || 0 : !o2 && u3 && (f4 = i3[0], h2 = i3[1]), function(d2, c, g4) {
      var _7 = (g4 || r).length, m3 = s3[_7], T2, b4, P3, v3, y3, S3, w4, C4, k3;
      if (!m3) {
        if (k3 = r.grid === "auto" ? 0 : (r.grid || [1, Et2])[1], !k3) {
          for (w4 = -Et2; w4 < (w4 = g4[k3++].getBoundingClientRect().left) && k3 < _7; ) ;
          k3 < _7 && k3--;
        }
        for (m3 = s3[_7] = [], T2 = u3 ? Math.min(k3, _7) * f4 - 0.5 : i3 % k3, b4 = k3 === Et2 ? 0 : u3 ? _7 * h2 / k3 - 0.5 : i3 / k3 | 0, w4 = 0, C4 = Et2, S3 = 0; S3 < _7; S3++) P3 = S3 % k3 - T2, v3 = b4 - (S3 / k3 | 0), m3[S3] = y3 = l3 ? Math.abs(l3 === "y" ? v3 : P3) : na(P3 * P3 + v3 * v3), y3 > w4 && (w4 = y3), y3 < C4 && (C4 = y3);
        i3 === "random" && ba(m3), m3.max = w4 - C4, m3.min = C4, m3.v = _7 = (parseFloat(r.amount) || parseFloat(r.each) * (k3 > _7 ? _7 - 1 : l3 ? l3 === "y" ? _7 / k3 : k3 : Math.max(k3, _7 / k3)) || 0) * (i3 === "edges" ? -1 : 1), m3.b = _7 < 0 ? n3 - _7 : n3, m3.u = qe2(r.amount || r.each) || 0, t2 = t2 && _7 < 0 ? Ra(t2) : t2;
      }
      return _7 = (m3[d2] - m3.min) / m3.max || 0, Ce2(m3.b + (t2 ? t2(_7) : _7) * m3.v) + m3.u;
    };
  };
  var xs = function(e) {
    var r = Math.pow(10, ((e + "").split(".")[1] || "").length);
    return function(t2) {
      var i3 = Ce2(Math.round(parseFloat(t2) / e) * e * r);
      return (i3 - i3 % 1) / r + (or(t2) ? 0 : qe2(t2));
    };
  };
  var Sa = function(e, r) {
    var t2 = je2(e), i3, n3;
    return !t2 && Qt2(e) && (i3 = t2 = e.radius || Et2, e.values ? (e = Dt2(e.values), (n3 = !or(e[0])) && (i3 *= i3)) : e = xs(e.increment)), kr(r, t2 ? pe2(e) ? function(s3) {
      return n3 = e(s3), Math.abs(n3 - s3) <= i3 ? n3 : s3;
    } : function(s3) {
      for (var o2 = parseFloat(n3 ? s3.x : s3), u3 = parseFloat(n3 ? s3.y : 0), l3 = Et2, f4 = 0, h2 = e.length, d2, c; h2--; ) n3 ? (d2 = e[h2].x - o2, c = e[h2].y - u3, d2 = d2 * d2 + c * c) : d2 = Math.abs(e[h2] - o2), d2 < l3 && (l3 = d2, f4 = h2);
      return f4 = !i3 || l3 <= i3 ? e[f4] : s3, n3 || f4 === s3 || or(s3) ? f4 : f4 + qe2(s3);
    } : xs(e));
  };
  var Ca = function(e, r, t2, i3) {
    return kr(je2(e) ? !r : t2 === true ? !!(t2 = 0) : !i3, function() {
      return je2(e) ? e[~~(Math.random() * e.length)] : (t2 = t2 || 1e-5) && (i3 = t2 < 1 ? Math.pow(10, (t2 + "").length - 2) : 1) && Math.floor(Math.round((e - t2 / 2 + Math.random() * (r - e + t2 * 0.99)) / t2) * t2 * i3) / i3;
    });
  };
  var Gu = function() {
    for (var e = arguments.length, r = new Array(e), t2 = 0; t2 < e; t2++) r[t2] = arguments[t2];
    return function(i3) {
      return r.reduce(function(n3, s3) {
        return s3(n3);
      }, i3);
    };
  };
  var Hu = function(e, r) {
    return function(t2) {
      return e(parseFloat(t2)) + (r || qe2(t2));
    };
  };
  var qu = function(e, r, t2) {
    return Pa(e, r, 0, 1, t2);
  };
  var ka = function(e, r, t2) {
    return kr(t2, function(i3) {
      return e[~~r(i3)];
    });
  };
  var Qu = function a5(e, r, t2) {
    var i3 = r - e;
    return je2(e) ? ka(e, a5(0, e.length), r) : kr(t2, function(n3) {
      return (i3 + (n3 - e) % i3) % i3 + e;
    });
  };
  var ju = function a6(e, r, t2) {
    var i3 = r - e, n3 = i3 * 2;
    return je2(e) ? ka(e, a6(0, e.length - 1), r) : kr(t2, function(s3) {
      return s3 = (n3 + (s3 - e) % n3) % n3 || 0, e + (s3 > i3 ? n3 - s3 : s3);
    });
  };
  var Zi = function(e) {
    for (var r = 0, t2 = "", i3, n3, s3, o2; ~(i3 = e.indexOf("random(", r)); ) s3 = e.indexOf(")", i3), o2 = e.charAt(i3 + 7) === "[", n3 = e.substr(i3 + 7, s3 - i3 - 7).match(o2 ? ua : _s), t2 += e.substr(r, i3 - r) + Ca(o2 ? n3 : +n3[0], o2 ? 0 : +n3[1], +n3[2] || 1e-5), r = s3 + 1;
    return t2 + e.substr(r, e.length - r);
  };
  var Pa = function(e, r, t2, i3, n3) {
    var s3 = r - e, o2 = i3 - t2;
    return kr(n3, function(u3) {
      return t2 + ((u3 - e) / s3 * o2 || 0);
    });
  };
  var Ku = function a7(e, r, t2, i3) {
    var n3 = isNaN(e + r) ? 0 : function(c) {
      return (1 - c) * e + c * r;
    };
    if (!n3) {
      var s3 = ze2(e), o2 = {}, u3, l3, f4, h2, d2;
      if (t2 === true && (i3 = 1) && (t2 = null), s3) e = { p: e }, r = { p: r };
      else if (je2(e) && !je2(r)) {
        for (f4 = [], h2 = e.length, d2 = h2 - 2, l3 = 1; l3 < h2; l3++) f4.push(a7(e[l3 - 1], e[l3]));
        h2--, n3 = function(g4) {
          g4 *= h2;
          var _7 = Math.min(d2, ~~g4);
          return f4[_7](g4 - _7);
        }, t2 = r;
      } else i3 || (e = mi(je2(e) ? [] : {}, e));
      if (!f4) {
        for (u3 in r) js.call(o2, e, u3, "get", r[u3]);
        n3 = function(g4) {
          return eo(g4, o2) || (s3 ? e.p : e);
        };
      }
    }
    return kr(t2, n3);
  };
  var xo = function(e, r, t2) {
    var i3 = e.labels, n3 = Et2, s3, o2, u3;
    for (s3 in i3) o2 = i3[s3] - r, o2 < 0 == !!t2 && o2 && n3 > (o2 = Math.abs(o2)) && (u3 = s3, n3 = o2);
    return u3;
  };
  var bt2 = function(e, r, t2) {
    var i3 = e.vars, n3 = i3[r], s3 = le2, o2 = e._ctx, u3, l3, f4;
    if (n3) return u3 = i3[r + "Params"], l3 = i3.callbackScope || e, t2 && xr.length && Rn(), o2 && (le2 = o2), f4 = u3 ? n3.apply(l3, u3) : n3.call(l3), le2 = s3, f4;
  };
  var Di = function(e) {
    return Tr(e), e.scrollTrigger && e.scrollTrigger.kill(!!Ye2), e.progress() < 1 && bt2(e, "onInterrupt"), e;
  };
  var ui;
  var Oa = [];
  var Ma = function(e) {
    if (e) if (e = !e.name && e.default || e, Vs() || e.headless) {
      var r = e.name, t2 = pe2(e), i3 = r && !t2 && e.init ? function() {
        this._props = [];
      } : e, n3 = { init: Ki, render: eo, add: js, kill: _l, modifier: hl, rawVars: 0 }, s3 = { targetTest: 0, get: 0, getSetter: Js, aliases: {}, register: 0 };
      if (xi(), e !== i3) {
        if (yt2[r]) return;
        Ct2(i3, Ct2(zn(e, n3), s3)), mi(i3.prototype, mi(n3, zn(e, s3))), yt2[i3.prop = r] = i3, e.targetTest && (Sn.push(i3), Gs[r] = 1), r = (r === "css" ? "CSS" : r.charAt(0).toUpperCase() + r.substr(1)) + "Plugin";
      }
      ca(r, i3), e.register && e.register(ht2, i3, ft2);
    } else Oa.push(e);
  };
  var ie2 = 255;
  var Ai = { aqua: [0, ie2, ie2], lime: [0, ie2, 0], silver: [192, 192, 192], black: [0, 0, 0], maroon: [128, 0, 0], teal: [0, 128, 128], blue: [0, 0, ie2], navy: [0, 0, 128], white: [ie2, ie2, ie2], olive: [128, 128, 0], yellow: [ie2, ie2, 0], orange: [ie2, 165, 0], gray: [128, 128, 128], purple: [128, 0, 128], green: [0, 128, 0], red: [ie2, 0, 0], pink: [ie2, 192, 203], cyan: [0, ie2, ie2], transparent: [ie2, ie2, ie2, 0] };
  var Zn = function(e, r, t2) {
    return e += e < 0 ? 1 : e > 1 ? -1 : 0, (e * 6 < 1 ? r + (t2 - r) * e * 6 : e < 0.5 ? t2 : e * 3 < 2 ? r + (t2 - r) * (2 / 3 - e) * 6 : r) * ie2 + 0.5 | 0;
  };
  var Ea = function(e, r, t2) {
    var i3 = e ? or(e) ? [e >> 16, e >> 8 & ie2, e & ie2] : 0 : Ai.black, n3, s3, o2, u3, l3, f4, h2, d2, c, g4;
    if (!i3) {
      if (e.substr(-1) === "," && (e = e.substr(0, e.length - 1)), Ai[e]) i3 = Ai[e];
      else if (e.charAt(0) === "#") {
        if (e.length < 6 && (n3 = e.charAt(1), s3 = e.charAt(2), o2 = e.charAt(3), e = "#" + n3 + n3 + s3 + s3 + o2 + o2 + (e.length === 5 ? e.charAt(4) + e.charAt(4) : "")), e.length === 9) return i3 = parseInt(e.substr(1, 6), 16), [i3 >> 16, i3 >> 8 & ie2, i3 & ie2, parseInt(e.substr(7), 16) / 255];
        e = parseInt(e.substr(1), 16), i3 = [e >> 16, e >> 8 & ie2, e & ie2];
      } else if (e.substr(0, 3) === "hsl") {
        if (i3 = g4 = e.match(_s), !r) u3 = +i3[0] % 360 / 360, l3 = +i3[1] / 100, f4 = +i3[2] / 100, s3 = f4 <= 0.5 ? f4 * (l3 + 1) : f4 + l3 - f4 * l3, n3 = f4 * 2 - s3, i3.length > 3 && (i3[3] *= 1), i3[0] = Zn(u3 + 1 / 3, n3, s3), i3[1] = Zn(u3, n3, s3), i3[2] = Zn(u3 - 1 / 3, n3, s3);
        else if (~e.indexOf("=")) return i3 = e.match(oa), t2 && i3.length < 4 && (i3[3] = 1), i3;
      } else i3 = e.match(_s) || Ai.transparent;
      i3 = i3.map(Number);
    }
    return r && !g4 && (n3 = i3[0] / ie2, s3 = i3[1] / ie2, o2 = i3[2] / ie2, h2 = Math.max(n3, s3, o2), d2 = Math.min(n3, s3, o2), f4 = (h2 + d2) / 2, h2 === d2 ? u3 = l3 = 0 : (c = h2 - d2, l3 = f4 > 0.5 ? c / (2 - h2 - d2) : c / (h2 + d2), u3 = h2 === n3 ? (s3 - o2) / c + (s3 < o2 ? 6 : 0) : h2 === s3 ? (o2 - n3) / c + 2 : (n3 - s3) / c + 4, u3 *= 60), i3[0] = ~~(u3 + 0.5), i3[1] = ~~(l3 * 100 + 0.5), i3[2] = ~~(f4 * 100 + 0.5)), t2 && i3.length < 4 && (i3[3] = 1), i3;
  };
  var Da = function(e) {
    var r = [], t2 = [], i3 = -1;
    return e.split(wr).forEach(function(n3) {
      var s3 = n3.match(ai2) || [];
      r.push.apply(r, s3), t2.push(i3 += s3.length + 1);
    }), r.c = t2, r;
  };
  var wo = function(e, r, t2) {
    var i3 = "", n3 = (e + i3).match(wr), s3 = r ? "hsla(" : "rgba(", o2 = 0, u3, l3, f4, h2;
    if (!n3) return e;
    if (n3 = n3.map(function(d2) {
      return (d2 = Ea(d2, r, 1)) && s3 + (r ? d2[0] + "," + d2[1] + "%," + d2[2] + "%," + d2[3] : d2.join(",")) + ")";
    }), t2 && (f4 = Da(e), u3 = t2.c, u3.join(i3) !== f4.c.join(i3))) for (l3 = e.replace(wr, "1").split(ai2), h2 = l3.length - 1; o2 < h2; o2++) i3 += l3[o2] + (~u3.indexOf(o2) ? n3.shift() || s3 + "0,0,0,0)" : (f4.length ? f4 : n3.length ? n3 : t2).shift());
    if (!l3) for (l3 = e.split(wr), h2 = l3.length - 1; o2 < h2; o2++) i3 += l3[o2] + n3[o2];
    return i3 + l3[h2];
  };
  var wr = (function() {
    var a20 = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b", e;
    for (e in Ai) a20 += "|" + e + "\\b";
    return new RegExp(a20 + ")", "gi");
  })();
  var Zu = /hsl[a]?\(/;
  var Aa = function(e) {
    var r = e.join(" "), t2;
    if (wr.lastIndex = 0, wr.test(r)) return t2 = Zu.test(r), e[1] = wo(e[1], t2), e[0] = wo(e[0], t2, Da(e[1])), true;
  };
  var Ji;
  var xt2 = (function() {
    var a20 = Date.now, e = 500, r = 33, t2 = a20(), i3 = t2, n3 = 1e3 / 240, s3 = n3, o2 = [], u3, l3, f4, h2, d2, c, g4 = function _7(m3) {
      var T2 = a20() - i3, b4 = m3 === true, P3, v3, y3, S3;
      if ((T2 > e || T2 < 0) && (t2 += T2 - r), i3 += T2, y3 = i3 - t2, P3 = y3 - s3, (P3 > 0 || b4) && (S3 = ++h2.frame, d2 = y3 - h2.time * 1e3, h2.time = y3 = y3 / 1e3, s3 += P3 + (P3 >= n3 ? 4 : n3 - P3), v3 = 1), b4 || (u3 = l3(_7)), v3) for (c = 0; c < o2.length; c++) o2[c](y3, d2, S3, m3);
    };
    return h2 = { time: 0, frame: 0, tick: function() {
      g4(true);
    }, deltaRatio: function(m3) {
      return d2 / (1e3 / (m3 || 60));
    }, wake: function() {
      la && (!ds && Vs() && (Vt2 = ds = window, $s = Vt2.document || {}, St2.gsap = ht2, (Vt2.gsapVersions || (Vt2.gsapVersions = [])).push(ht2.version), fa(An || Vt2.GreenSockGlobals || !Vt2.gsap && Vt2 || {}), Oa.forEach(Ma)), f4 = typeof requestAnimationFrame < "u" && requestAnimationFrame, u3 && h2.sleep(), l3 = f4 || function(m3) {
        return setTimeout(m3, s3 - h2.time * 1e3 + 1 | 0);
      }, Ji = 1, g4(2));
    }, sleep: function() {
      (f4 ? cancelAnimationFrame : clearTimeout)(u3), Ji = 0, l3 = Ki;
    }, lagSmoothing: function(m3, T2) {
      e = m3 || 1 / 0, r = Math.min(T2 || 33, e);
    }, fps: function(m3) {
      n3 = 1e3 / (m3 || 240), s3 = h2.time * 1e3 + n3;
    }, add: function(m3, T2, b4) {
      var P3 = T2 ? function(v3, y3, S3, w4) {
        m3(v3, y3, S3, w4), h2.remove(P3);
      } : m3;
      return h2.remove(m3), o2[b4 ? "unshift" : "push"](P3), xi(), P3;
    }, remove: function(m3, T2) {
      ~(T2 = o2.indexOf(m3)) && o2.splice(T2, 1) && c >= T2 && c--;
    }, _listeners: o2 }, h2;
  })();
  var xi = function() {
    return !Ji && xt2.wake();
  };
  var Z2 = {};
  var Ju = /^[\d.\-M][\d.\-,\s]/;
  var el = /["']/g;
  var tl = function(e) {
    for (var r = {}, t2 = e.substr(1, e.length - 3).split(":"), i3 = t2[0], n3 = 1, s3 = t2.length, o2, u3, l3; n3 < s3; n3++) u3 = t2[n3], o2 = n3 !== s3 - 1 ? u3.lastIndexOf(",") : u3.length, l3 = u3.substr(0, o2), r[i3] = isNaN(l3) ? l3.replace(el, "").trim() : +l3, i3 = u3.substr(o2 + 1).trim();
    return r;
  };
  var rl = function(e) {
    var r = e.indexOf("(") + 1, t2 = e.indexOf(")"), i3 = e.indexOf("(", r);
    return e.substring(r, ~i3 && i3 < t2 ? e.indexOf(")", t2 + 1) : t2);
  };
  var il = function(e) {
    var r = (e + "").split("("), t2 = Z2[r[0]];
    return t2 && r.length > 1 && t2.config ? t2.config.apply(null, ~e.indexOf("{") ? [tl(r[1])] : rl(e).split(",").map(pa)) : Z2._CE && Ju.test(e) ? Z2._CE("", e) : t2;
  };
  var Ra = function(e) {
    return function(r) {
      return 1 - e(1 - r);
    };
  };
  var za = function a8(e, r) {
    for (var t2 = e._first, i3; t2; ) t2 instanceof Ie2 ? a8(t2, r) : t2.vars.yoyoEase && (!t2._yoyo || !t2._repeat) && t2._yoyo !== r && (t2.timeline ? a8(t2.timeline, r) : (i3 = t2._ease, t2._ease = t2._yEase, t2._yEase = i3, t2._yoyo = r)), t2 = t2._next;
  };
  var Wr = function(e, r) {
    return e && (pe2(e) ? e : Z2[e] || il(e)) || r;
  };
  var jr = function(e, r, t2, i3) {
    t2 === void 0 && (t2 = function(u3) {
      return 1 - r(1 - u3);
    }), i3 === void 0 && (i3 = function(u3) {
      return u3 < 0.5 ? r(u3 * 2) / 2 : 1 - r((1 - u3) * 2) / 2;
    });
    var n3 = { easeIn: r, easeOut: t2, easeInOut: i3 }, s3;
    return lt2(e, function(o2) {
      Z2[o2] = St2[o2] = n3, Z2[s3 = o2.toLowerCase()] = t2;
      for (var u3 in n3) Z2[s3 + (u3 === "easeIn" ? ".in" : u3 === "easeOut" ? ".out" : ".inOut")] = Z2[o2 + "." + u3] = n3[u3];
    }), n3;
  };
  var Fa = function(e) {
    return function(r) {
      return r < 0.5 ? (1 - e(1 - r * 2)) / 2 : 0.5 + e((r - 0.5) * 2) / 2;
    };
  };
  var Jn = function a9(e, r, t2) {
    var i3 = r >= 1 ? r : 1, n3 = (t2 || (e ? 0.3 : 0.45)) / (r < 1 ? r : 1), s3 = n3 / hs * (Math.asin(1 / i3) || 0), o2 = function(f4) {
      return f4 === 1 ? 1 : i3 * Math.pow(2, -10 * f4) * Du((f4 - s3) * n3) + 1;
    }, u3 = e === "out" ? o2 : e === "in" ? function(l3) {
      return 1 - o2(1 - l3);
    } : Fa(o2);
    return n3 = hs / n3, u3.config = function(l3, f4) {
      return a9(e, l3, f4);
    }, u3;
  };
  var es = function a10(e, r) {
    r === void 0 && (r = 1.70158);
    var t2 = function(s3) {
      return s3 ? --s3 * s3 * ((r + 1) * s3 + r) + 1 : 0;
    }, i3 = e === "out" ? t2 : e === "in" ? function(n3) {
      return 1 - t2(1 - n3);
    } : Fa(t2);
    return i3.config = function(n3) {
      return a10(e, n3);
    }, i3;
  };
  lt2("Linear,Quad,Cubic,Quart,Quint,Strong", function(a20, e) {
    var r = e < 5 ? e + 1 : e;
    jr(a20 + ",Power" + (r - 1), e ? function(t2) {
      return Math.pow(t2, r);
    } : function(t2) {
      return t2;
    }, function(t2) {
      return 1 - Math.pow(1 - t2, r);
    }, function(t2) {
      return t2 < 0.5 ? Math.pow(t2 * 2, r) / 2 : 1 - Math.pow((1 - t2) * 2, r) / 2;
    });
  });
  Z2.Linear.easeNone = Z2.none = Z2.Linear.easeIn;
  jr("Elastic", Jn("in"), Jn("out"), Jn());
  (function(a20, e) {
    var r = 1 / e, t2 = 2 * r, i3 = 2.5 * r, n3 = function(o2) {
      return o2 < r ? a20 * o2 * o2 : o2 < t2 ? a20 * Math.pow(o2 - 1.5 / e, 2) + 0.75 : o2 < i3 ? a20 * (o2 -= 2.25 / e) * o2 + 0.9375 : a20 * Math.pow(o2 - 2.625 / e, 2) + 0.984375;
    };
    jr("Bounce", function(s3) {
      return 1 - n3(1 - s3);
    }, n3);
  })(7.5625, 2.75);
  jr("Expo", function(a20) {
    return Math.pow(2, 10 * (a20 - 1)) * a20 + a20 * a20 * a20 * a20 * a20 * a20 * (1 - a20);
  });
  jr("Circ", function(a20) {
    return -(na(1 - a20 * a20) - 1);
  });
  jr("Sine", function(a20) {
    return a20 === 1 ? 1 : -Eu(a20 * Ou) + 1;
  });
  jr("Back", es("in"), es("out"), es());
  Z2.SteppedEase = Z2.steps = St2.SteppedEase = { config: function(e, r) {
    e === void 0 && (e = 1);
    var t2 = 1 / e, i3 = e + (r ? 0 : 1), n3 = r ? 1 : 0, s3 = 1 - ne2;
    return function(o2) {
      return ((i3 * on(0, s3, o2) | 0) + n3) * t2;
    };
  } };
  gi.ease = Z2["quad.out"];
  lt2("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function(a20) {
    return Hs += a20 + "," + a20 + "Params,";
  });
  var La = function(e, r) {
    this.id = Mu++, e._gsap = this, this.target = e, this.harness = r, this.get = r ? r.get : _a, this.set = r ? r.getSetter : Js;
  };
  var en = (function() {
    function a20(r) {
      this.vars = r, this._delay = +r.delay || 0, (this._repeat = r.repeat === 1 / 0 ? -2 : r.repeat || 0) && (this._rDelay = r.repeatDelay || 0, this._yoyo = !!r.yoyo || !!r.yoyoEase), this._ts = 1, vi(this, +r.duration, 1, 1), this.data = r.data, le2 && (this._ctx = le2, le2.data.push(this)), Ji || xt2.wake();
    }
    var e = a20.prototype;
    return e.delay = function(t2) {
      return t2 || t2 === 0 ? (this.parent && this.parent.smoothChildTiming && this.startTime(this._start + t2 - this._delay), this._delay = t2, this) : this._delay;
    }, e.duration = function(t2) {
      return arguments.length ? this.totalDuration(this._repeat > 0 ? t2 + (t2 + this._rDelay) * this._repeat : t2) : this.totalDuration() && this._dur;
    }, e.totalDuration = function(t2) {
      return arguments.length ? (this._dirty = 0, vi(this, this._repeat < 0 ? t2 : (t2 - this._repeat * this._rDelay) / (this._repeat + 1))) : this._tDur;
    }, e.totalTime = function(t2, i3) {
      if (xi(), !arguments.length) return this._tTime;
      var n3 = this._dp;
      if (n3 && n3.smoothChildTiming && this._ts) {
        for (Hn(this, t2), !n3._dp || n3.parent || ya(n3, this); n3 && n3.parent; ) n3.parent._time !== n3._start + (n3._ts >= 0 ? n3._tTime / n3._ts : (n3.totalDuration() - n3._tTime) / -n3._ts) && n3.totalTime(n3._tTime, true), n3 = n3.parent;
        !this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && t2 < this._tDur || this._ts < 0 && t2 > 0 || !this._tDur && !t2) && Ut2(this._dp, this, this._start - this._delay);
      }
      return (this._tTime !== t2 || !this._dur && !i3 || this._initted && Math.abs(this._zTime) === ne2 || !t2 && !this._initted && (this.add || this._ptLookup)) && (this._ts || (this._pTime = t2), da(this, t2, i3)), this;
    }, e.time = function(t2, i3) {
      return arguments.length ? this.totalTime(Math.min(this.totalDuration(), t2 + yo(this)) % (this._dur + this._rDelay) || (t2 ? this._dur : 0), i3) : this._time;
    }, e.totalProgress = function(t2, i3) {
      return arguments.length ? this.totalTime(this.totalDuration() * t2, i3) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() >= 0 && this._initted ? 1 : 0;
    }, e.progress = function(t2, i3) {
      return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - t2 : t2) + yo(this), i3) : this.duration() ? Math.min(1, this._time / this._dur) : this.rawTime() > 0 ? 1 : 0;
    }, e.iteration = function(t2, i3) {
      var n3 = this.duration() + this._rDelay;
      return arguments.length ? this.totalTime(this._time + (t2 - 1) * n3, i3) : this._repeat ? yi(this._tTime, n3) + 1 : 1;
    }, e.timeScale = function(t2, i3) {
      if (!arguments.length) return this._rts === -ne2 ? 0 : this._rts;
      if (this._rts === t2) return this;
      var n3 = this.parent && this._ts ? Fn(this.parent._time, this) : this._tTime;
      return this._rts = +t2 || 0, this._ts = this._ps || t2 === -ne2 ? 0 : this._rts, this.totalTime(on(-Math.abs(this._delay), this.totalDuration(), n3), i3 !== false), Gn(this), Iu(this);
    }, e.paused = function(t2) {
      return arguments.length ? (this._ps !== t2 && (this._ps = t2, t2 ? (this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()), this._ts = this._act = 0) : (xi(), this._ts = this._rts, this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== ne2 && (this._tTime -= ne2)))), this) : this._ps;
    }, e.startTime = function(t2) {
      if (arguments.length) {
        this._start = t2;
        var i3 = this.parent || this._dp;
        return i3 && (i3._sort || !this.parent) && Ut2(i3, this, t2 - this._delay), this;
      }
      return this._start;
    }, e.endTime = function(t2) {
      return this._start + (ut2(t2) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
    }, e.rawTime = function(t2) {
      var i3 = this.parent || this._dp;
      return i3 ? t2 && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : this._ts ? Fn(i3.rawTime(t2), this) : this._tTime : this._tTime;
    }, e.revert = function(t2) {
      t2 === void 0 && (t2 = zu);
      var i3 = Ye2;
      return Ye2 = t2, Qs(this) && (this.timeline && this.timeline.revert(t2), this.totalTime(-0.01, t2.suppressEvents)), this.data !== "nested" && t2.kill !== false && this.kill(), Ye2 = i3, this;
    }, e.globalTime = function(t2) {
      for (var i3 = this, n3 = arguments.length ? t2 : i3.rawTime(); i3; ) n3 = i3._start + n3 / (Math.abs(i3._ts) || 1), i3 = i3._dp;
      return !this.parent && this._sat ? this._sat.globalTime(t2) : n3;
    }, e.repeat = function(t2) {
      return arguments.length ? (this._repeat = t2 === 1 / 0 ? -2 : t2, vo(this)) : this._repeat === -2 ? 1 / 0 : this._repeat;
    }, e.repeatDelay = function(t2) {
      if (arguments.length) {
        var i3 = this._time;
        return this._rDelay = t2, vo(this), i3 ? this.time(i3) : this;
      }
      return this._rDelay;
    }, e.yoyo = function(t2) {
      return arguments.length ? (this._yoyo = t2, this) : this._yoyo;
    }, e.seek = function(t2, i3) {
      return this.totalTime(Pt2(this, t2), ut2(i3));
    }, e.restart = function(t2, i3) {
      return this.play().totalTime(t2 ? -this._delay : 0, ut2(i3)), this._dur || (this._zTime = -ne2), this;
    }, e.play = function(t2, i3) {
      return t2 != null && this.seek(t2, i3), this.reversed(false).paused(false);
    }, e.reverse = function(t2, i3) {
      return t2 != null && this.seek(t2 || this.totalDuration(), i3), this.reversed(true).paused(false);
    }, e.pause = function(t2, i3) {
      return t2 != null && this.seek(t2, i3), this.paused(true);
    }, e.resume = function() {
      return this.paused(false);
    }, e.reversed = function(t2) {
      return arguments.length ? (!!t2 !== this.reversed() && this.timeScale(-this._rts || (t2 ? -ne2 : 0)), this) : this._rts < 0;
    }, e.invalidate = function() {
      return this._initted = this._act = 0, this._zTime = -ne2, this;
    }, e.isActive = function() {
      var t2 = this.parent || this._dp, i3 = this._start, n3;
      return !!(!t2 || this._ts && this._initted && t2.isActive() && (n3 = t2.rawTime(true)) >= i3 && n3 < this.endTime(true) - ne2);
    }, e.eventCallback = function(t2, i3, n3) {
      var s3 = this.vars;
      return arguments.length > 1 ? (i3 ? (s3[t2] = i3, n3 && (s3[t2 + "Params"] = n3), t2 === "onUpdate" && (this._onUpdate = i3)) : delete s3[t2], this) : s3[t2];
    }, e.then = function(t2) {
      var i3 = this;
      return new Promise(function(n3) {
        var s3 = pe2(t2) ? t2 : ga, o2 = function() {
          var l3 = i3.then;
          i3.then = null, pe2(s3) && (s3 = s3(i3)) && (s3.then || s3 === i3) && (i3.then = l3), n3(s3), i3.then = l3;
        };
        i3._initted && i3.totalProgress() === 1 && i3._ts >= 0 || !i3._tTime && i3._ts < 0 ? o2() : i3._prom = o2;
      });
    }, e.kill = function() {
      Di(this);
    }, a20;
  })();
  Ct2(en.prototype, { _time: 0, _start: 0, _end: 0, _tTime: 0, _tDur: 0, _dirty: 0, _repeat: 0, _yoyo: false, parent: null, _initted: false, _rDelay: 0, _ts: 1, _dp: 0, ratio: 0, _zTime: -ne2, _prom: 0, _ps: false, _rts: 1 });
  var Ie2 = (function(a20) {
    ia(e, a20);
    function e(t2, i3) {
      var n3;
      return t2 === void 0 && (t2 = {}), n3 = a20.call(this, t2) || this, n3.labels = {}, n3.smoothChildTiming = !!t2.smoothChildTiming, n3.autoRemoveChildren = !!t2.autoRemoveChildren, n3._sort = ut2(t2.sortChildren), ce2 && Ut2(t2.parent || ce2, tr(n3), i3), t2.reversed && n3.reverse(), t2.paused && n3.paused(true), t2.scrollTrigger && va(tr(n3), t2.scrollTrigger), n3;
    }
    var r = e.prototype;
    return r.to = function(i3, n3, s3) {
      return Bi(0, arguments, this), this;
    }, r.from = function(i3, n3, s3) {
      return Bi(1, arguments, this), this;
    }, r.fromTo = function(i3, n3, s3, o2) {
      return Bi(2, arguments, this), this;
    }, r.set = function(i3, n3, s3) {
      return n3.duration = 0, n3.parent = this, Ii(n3).repeatDelay || (n3.repeat = 0), n3.immediateRender = !!n3.immediateRender, new xe2(i3, n3, Pt2(this, s3), 1), this;
    }, r.call = function(i3, n3, s3) {
      return Ut2(this, xe2.delayedCall(0, i3, n3), s3);
    }, r.staggerTo = function(i3, n3, s3, o2, u3, l3, f4) {
      return s3.duration = n3, s3.stagger = s3.stagger || o2, s3.onComplete = l3, s3.onCompleteParams = f4, s3.parent = this, new xe2(i3, s3, Pt2(this, u3)), this;
    }, r.staggerFrom = function(i3, n3, s3, o2, u3, l3, f4) {
      return s3.runBackwards = 1, Ii(s3).immediateRender = ut2(s3.immediateRender), this.staggerTo(i3, n3, s3, o2, u3, l3, f4);
    }, r.staggerFromTo = function(i3, n3, s3, o2, u3, l3, f4, h2) {
      return o2.startAt = s3, Ii(o2).immediateRender = ut2(o2.immediateRender), this.staggerTo(i3, n3, o2, u3, l3, f4, h2);
    }, r.render = function(i3, n3, s3) {
      var o2 = this._time, u3 = this._dirty ? this.totalDuration() : this._tDur, l3 = this._dur, f4 = i3 <= 0 ? 0 : Ce2(i3), h2 = this._zTime < 0 != i3 < 0 && (this._initted || !l3), d2, c, g4, _7, m3, T2, b4, P3, v3, y3, S3, w4;
      if (this !== ce2 && f4 > u3 && i3 >= 0 && (f4 = u3), f4 !== this._tTime || s3 || h2) {
        if (o2 !== this._time && l3 && (f4 += this._time - o2, i3 += this._time - o2), d2 = f4, v3 = this._start, P3 = this._ts, T2 = !P3, h2 && (l3 || (o2 = this._zTime), (i3 || !n3) && (this._zTime = i3)), this._repeat) {
          if (S3 = this._yoyo, m3 = l3 + this._rDelay, this._repeat < -1 && i3 < 0) return this.totalTime(m3 * 100 + i3, n3, s3);
          if (d2 = Ce2(f4 % m3), f4 === u3 ? (_7 = this._repeat, d2 = l3) : (y3 = Ce2(f4 / m3), _7 = ~~y3, _7 && _7 === y3 && (d2 = l3, _7--), d2 > l3 && (d2 = l3)), y3 = yi(this._tTime, m3), !o2 && this._tTime && y3 !== _7 && this._tTime - y3 * m3 - this._dur <= 0 && (y3 = _7), S3 && _7 & 1 && (d2 = l3 - d2, w4 = 1), _7 !== y3 && !this._lock) {
            var C4 = S3 && y3 & 1, k3 = C4 === (S3 && _7 & 1);
            if (_7 < y3 && (C4 = !C4), o2 = C4 ? 0 : f4 % l3 ? l3 : f4, this._lock = 1, this.render(o2 || (w4 ? 0 : Ce2(_7 * m3)), n3, !l3)._lock = 0, this._tTime = f4, !n3 && this.parent && bt2(this, "onRepeat"), this.vars.repeatRefresh && !w4 && (this.invalidate()._lock = 1), o2 && o2 !== this._time || T2 !== !this._ts || this.vars.onRepeat && !this.parent && !this._act) return this;
            if (l3 = this._dur, u3 = this._tDur, k3 && (this._lock = 2, o2 = C4 ? l3 : -1e-4, this.render(o2, true), this.vars.repeatRefresh && !w4 && this.invalidate()), this._lock = 0, !this._ts && !T2) return this;
            za(this, w4);
          }
        }
        if (this._hasPause && !this._forcing && this._lock < 2 && (b4 = Xu(this, Ce2(o2), Ce2(d2)), b4 && (f4 -= d2 - (d2 = b4._start))), this._tTime = f4, this._time = d2, this._act = !P3, this._initted || (this._onUpdate = this.vars.onUpdate, this._initted = 1, this._zTime = i3, o2 = 0), !o2 && f4 && !n3 && !y3 && (bt2(this, "onStart"), this._tTime !== f4)) return this;
        if (d2 >= o2 && i3 >= 0) for (c = this._first; c; ) {
          if (g4 = c._next, (c._act || d2 >= c._start) && c._ts && b4 !== c) {
            if (c.parent !== this) return this.render(i3, n3, s3);
            if (c.render(c._ts > 0 ? (d2 - c._start) * c._ts : (c._dirty ? c.totalDuration() : c._tDur) + (d2 - c._start) * c._ts, n3, s3), d2 !== this._time || !this._ts && !T2) {
              b4 = 0, g4 && (f4 += this._zTime = -ne2);
              break;
            }
          }
          c = g4;
        }
        else {
          c = this._last;
          for (var O3 = i3 < 0 ? i3 : d2; c; ) {
            if (g4 = c._prev, (c._act || O3 <= c._end) && c._ts && b4 !== c) {
              if (c.parent !== this) return this.render(i3, n3, s3);
              if (c.render(c._ts > 0 ? (O3 - c._start) * c._ts : (c._dirty ? c.totalDuration() : c._tDur) + (O3 - c._start) * c._ts, n3, s3 || Ye2 && Qs(c)), d2 !== this._time || !this._ts && !T2) {
                b4 = 0, g4 && (f4 += this._zTime = O3 ? -ne2 : ne2);
                break;
              }
            }
            c = g4;
          }
        }
        if (b4 && !n3 && (this.pause(), b4.render(d2 >= o2 ? 0 : -ne2)._zTime = d2 >= o2 ? 1 : -1, this._ts)) return this._start = v3, Gn(this), this.render(i3, n3, s3);
        this._onUpdate && !n3 && bt2(this, "onUpdate", true), (f4 === u3 && this._tTime >= this.totalDuration() || !f4 && o2) && (v3 === this._start || Math.abs(P3) !== Math.abs(this._ts)) && (this._lock || ((i3 || !l3) && (f4 === u3 && this._ts > 0 || !f4 && this._ts < 0) && Tr(this, 1), !n3 && !(i3 < 0 && !o2) && (f4 || o2 || !u3) && (bt2(this, f4 === u3 && i3 >= 0 ? "onComplete" : "onReverseComplete", true), this._prom && !(f4 < u3 && this.timeScale() > 0) && this._prom())));
      }
      return this;
    }, r.add = function(i3, n3) {
      var s3 = this;
      if (or(n3) || (n3 = Pt2(this, n3, i3)), !(i3 instanceof en)) {
        if (je2(i3)) return i3.forEach(function(o2) {
          return s3.add(o2, n3);
        }), this;
        if (ze2(i3)) return this.addLabel(i3, n3);
        if (pe2(i3)) i3 = xe2.delayedCall(0, i3);
        else return this;
      }
      return this !== i3 ? Ut2(this, i3, n3) : this;
    }, r.getChildren = function(i3, n3, s3, o2) {
      i3 === void 0 && (i3 = true), n3 === void 0 && (n3 = true), s3 === void 0 && (s3 = true), o2 === void 0 && (o2 = -Et2);
      for (var u3 = [], l3 = this._first; l3; ) l3._start >= o2 && (l3 instanceof xe2 ? n3 && u3.push(l3) : (s3 && u3.push(l3), i3 && u3.push.apply(u3, l3.getChildren(true, n3, s3)))), l3 = l3._next;
      return u3;
    }, r.getById = function(i3) {
      for (var n3 = this.getChildren(1, 1, 1), s3 = n3.length; s3--; ) if (n3[s3].vars.id === i3) return n3[s3];
    }, r.remove = function(i3) {
      return ze2(i3) ? this.removeLabel(i3) : pe2(i3) ? this.killTweensOf(i3) : (i3.parent === this && Un(this, i3), i3 === this._recent && (this._recent = this._last), Yr(this));
    }, r.totalTime = function(i3, n3) {
      return arguments.length ? (this._forcing = 1, !this._dp && this._ts && (this._start = Ce2(xt2.time - (this._ts > 0 ? i3 / this._ts : (this.totalDuration() - i3) / -this._ts))), a20.prototype.totalTime.call(this, i3, n3), this._forcing = 0, this) : this._tTime;
    }, r.addLabel = function(i3, n3) {
      return this.labels[i3] = Pt2(this, n3), this;
    }, r.removeLabel = function(i3) {
      return delete this.labels[i3], this;
    }, r.addPause = function(i3, n3, s3) {
      var o2 = xe2.delayedCall(0, n3 || Ki, s3);
      return o2.data = "isPause", this._hasPause = 1, Ut2(this, o2, Pt2(this, i3));
    }, r.removePause = function(i3) {
      var n3 = this._first;
      for (i3 = Pt2(this, i3); n3; ) n3._start === i3 && n3.data === "isPause" && Tr(n3), n3 = n3._next;
    }, r.killTweensOf = function(i3, n3, s3) {
      for (var o2 = this.getTweensOf(i3, s3), u3 = o2.length; u3--; ) pr !== o2[u3] && o2[u3].kill(i3, n3);
      return this;
    }, r.getTweensOf = function(i3, n3) {
      for (var s3 = [], o2 = Dt2(i3), u3 = this._first, l3 = or(n3), f4; u3; ) u3 instanceof xe2 ? Fu(u3._targets, o2) && (l3 ? (!pr || u3._initted && u3._ts) && u3.globalTime(0) <= n3 && u3.globalTime(u3.totalDuration()) > n3 : !n3 || u3.isActive()) && s3.push(u3) : (f4 = u3.getTweensOf(o2, n3)).length && s3.push.apply(s3, f4), u3 = u3._next;
      return s3;
    }, r.tweenTo = function(i3, n3) {
      n3 = n3 || {};
      var s3 = this, o2 = Pt2(s3, i3), u3 = n3, l3 = u3.startAt, f4 = u3.onStart, h2 = u3.onStartParams, d2 = u3.immediateRender, c, g4 = xe2.to(s3, Ct2({ ease: n3.ease || "none", lazy: false, immediateRender: false, time: o2, overwrite: "auto", duration: n3.duration || Math.abs((o2 - (l3 && "time" in l3 ? l3.time : s3._time)) / s3.timeScale()) || ne2, onStart: function() {
        if (s3.pause(), !c) {
          var m3 = n3.duration || Math.abs((o2 - (l3 && "time" in l3 ? l3.time : s3._time)) / s3.timeScale());
          g4._dur !== m3 && vi(g4, m3, 0, 1).render(g4._time, true, true), c = 1;
        }
        f4 && f4.apply(g4, h2 || []);
      } }, n3));
      return d2 ? g4.render(0) : g4;
    }, r.tweenFromTo = function(i3, n3, s3) {
      return this.tweenTo(n3, Ct2({ startAt: { time: Pt2(this, i3) } }, s3));
    }, r.recent = function() {
      return this._recent;
    }, r.nextLabel = function(i3) {
      return i3 === void 0 && (i3 = this._time), xo(this, Pt2(this, i3));
    }, r.previousLabel = function(i3) {
      return i3 === void 0 && (i3 = this._time), xo(this, Pt2(this, i3), 1);
    }, r.currentLabel = function(i3) {
      return arguments.length ? this.seek(i3, true) : this.previousLabel(this._time + ne2);
    }, r.shiftChildren = function(i3, n3, s3) {
      s3 === void 0 && (s3 = 0);
      for (var o2 = this._first, u3 = this.labels, l3; o2; ) o2._start >= s3 && (o2._start += i3, o2._end += i3), o2 = o2._next;
      if (n3) for (l3 in u3) u3[l3] >= s3 && (u3[l3] += i3);
      return Yr(this);
    }, r.invalidate = function(i3) {
      var n3 = this._first;
      for (this._lock = 0; n3; ) n3.invalidate(i3), n3 = n3._next;
      return a20.prototype.invalidate.call(this, i3);
    }, r.clear = function(i3) {
      i3 === void 0 && (i3 = true);
      for (var n3 = this._first, s3; n3; ) s3 = n3._next, this.remove(n3), n3 = s3;
      return this._dp && (this._time = this._tTime = this._pTime = 0), i3 && (this.labels = {}), Yr(this);
    }, r.totalDuration = function(i3) {
      var n3 = 0, s3 = this, o2 = s3._last, u3 = Et2, l3, f4, h2;
      if (arguments.length) return s3.timeScale((s3._repeat < 0 ? s3.duration() : s3.totalDuration()) / (s3.reversed() ? -i3 : i3));
      if (s3._dirty) {
        for (h2 = s3.parent; o2; ) l3 = o2._prev, o2._dirty && o2.totalDuration(), f4 = o2._start, f4 > u3 && s3._sort && o2._ts && !s3._lock ? (s3._lock = 1, Ut2(s3, o2, f4 - o2._delay, 1)._lock = 0) : u3 = f4, f4 < 0 && o2._ts && (n3 -= f4, (!h2 && !s3._dp || h2 && h2.smoothChildTiming) && (s3._start += f4 / s3._ts, s3._time -= f4, s3._tTime -= f4), s3.shiftChildren(-f4, false, -1 / 0), u3 = 0), o2._end > n3 && o2._ts && (n3 = o2._end), o2 = l3;
        vi(s3, s3 === ce2 && s3._time > n3 ? s3._time : n3, 1, 1), s3._dirty = 0;
      }
      return s3._tDur;
    }, e.updateRoot = function(i3) {
      if (ce2._ts && (da(ce2, Fn(i3, ce2)), ha = xt2.frame), xt2.frame >= go) {
        go += Tt2.autoSleep || 120;
        var n3 = ce2._first;
        if ((!n3 || !n3._ts) && Tt2.autoSleep && xt2._listeners.length < 2) {
          for (; n3 && !n3._ts; ) n3 = n3._next;
          n3 || xt2.sleep();
        }
      }
    }, e;
  })(en);
  Ct2(Ie2.prototype, { _lock: 0, _hasPause: 0, _forcing: 0 });
  var nl = function(e, r, t2, i3, n3, s3, o2) {
    var u3 = new ft2(this._pt, e, r, 0, 1, Xa, null, n3), l3 = 0, f4 = 0, h2, d2, c, g4, _7, m3, T2, b4;
    for (u3.b = t2, u3.e = i3, t2 += "", i3 += "", (T2 = ~i3.indexOf("random(")) && (i3 = Zi(i3)), s3 && (b4 = [t2, i3], s3(b4, e, r), t2 = b4[0], i3 = b4[1]), d2 = t2.match(jn) || []; h2 = jn.exec(i3); ) g4 = h2[0], _7 = i3.substring(l3, h2.index), c ? c = (c + 1) % 5 : _7.substr(-5) === "rgba(" && (c = 1), g4 !== d2[f4++] && (m3 = parseFloat(d2[f4 - 1]) || 0, u3._pt = { _next: u3._pt, p: _7 || f4 === 1 ? _7 : ",", s: m3, c: g4.charAt(1) === "=" ? fi(m3, g4) - m3 : parseFloat(g4) - m3, m: c && c < 4 ? Math.round : 0 }, l3 = jn.lastIndex);
    return u3.c = l3 < i3.length ? i3.substring(l3, i3.length) : "", u3.fp = o2, (aa.test(i3) || T2) && (u3.e = 0), this._pt = u3, u3;
  };
  var js = function(e, r, t2, i3, n3, s3, o2, u3, l3, f4) {
    pe2(i3) && (i3 = i3(n3 || 0, e, s3));
    var h2 = e[r], d2 = t2 !== "get" ? t2 : pe2(h2) ? l3 ? e[r.indexOf("set") || !pe2(e["get" + r.substr(3)]) ? r : "get" + r.substr(3)](l3) : e[r]() : h2, c = pe2(h2) ? l3 ? ll : Ya : Zs, g4;
    if (ze2(i3) && (~i3.indexOf("random(") && (i3 = Zi(i3)), i3.charAt(1) === "=" && (g4 = fi(d2, i3) + (qe2(d2) || 0), (g4 || g4 === 0) && (i3 = g4))), !f4 || d2 !== i3 || ws) return !isNaN(d2 * i3) && i3 !== "" ? (g4 = new ft2(this._pt, e, r, +d2 || 0, i3 - (d2 || 0), typeof h2 == "boolean" ? cl : Wa, 0, c), l3 && (g4.fp = l3), o2 && g4.modifier(o2, this, e), this._pt = g4) : (!h2 && !(r in e) && Us(r, i3), nl.call(this, e, r, d2, i3, c, u3 || Tt2.stringFilter, l3));
  };
  var sl = function(e, r, t2, i3, n3) {
    if (pe2(e) && (e = Yi(e, n3, r, t2, i3)), !Qt2(e) || e.style && e.nodeType || je2(e) || sa(e)) return ze2(e) ? Yi(e, n3, r, t2, i3) : e;
    var s3 = {}, o2;
    for (o2 in e) s3[o2] = Yi(e[o2], n3, r, t2, i3);
    return s3;
  };
  var Na = function(e, r, t2, i3, n3, s3) {
    var o2, u3, l3, f4;
    if (yt2[e] && (o2 = new yt2[e]()).init(n3, o2.rawVars ? r[e] : sl(r[e], i3, n3, s3, t2), t2, i3, s3) !== false && (t2._pt = u3 = new ft2(t2._pt, n3, e, 0, 1, o2.render, o2, 0, o2.priority), t2 !== ui)) for (l3 = t2._ptLookup[t2._targets.indexOf(n3)], f4 = o2._props.length; f4--; ) l3[o2._props[f4]] = u3;
    return o2;
  };
  var pr;
  var ws;
  var Ks = function a11(e, r, t2) {
    var i3 = e.vars, n3 = i3.ease, s3 = i3.startAt, o2 = i3.immediateRender, u3 = i3.lazy, l3 = i3.onUpdate, f4 = i3.runBackwards, h2 = i3.yoyoEase, d2 = i3.keyframes, c = i3.autoRevert, g4 = e._dur, _7 = e._startAt, m3 = e._targets, T2 = e.parent, b4 = T2 && T2.data === "nested" ? T2.vars.targets : m3, P3 = e._overwrite === "auto" && !Ws, v3 = e.timeline, y3, S3, w4, C4, k3, O3, F3, M4, A4, N5, B3, I2, R4;
    if (v3 && (!d2 || !n3) && (n3 = "none"), e._ease = Wr(n3, gi.ease), e._yEase = h2 ? Ra(Wr(h2 === true ? n3 : h2, gi.ease)) : 0, h2 && e._yoyo && !e._repeat && (h2 = e._yEase, e._yEase = e._ease, e._ease = h2), e._from = !v3 && !!i3.runBackwards, !v3 || d2 && !i3.stagger) {
      if (M4 = m3[0] ? Br(m3[0]).harness : 0, I2 = M4 && i3[M4.prop], y3 = zn(i3, Gs), _7 && (_7._zTime < 0 && _7.progress(1), r < 0 && f4 && o2 && !c ? _7.render(-1, true) : _7.revert(f4 && g4 ? Tn : Ru), _7._lazy = 0), s3) {
        if (Tr(e._startAt = xe2.set(m3, Ct2({ data: "isStart", overwrite: false, parent: T2, immediateRender: true, lazy: !_7 && ut2(u3), startAt: null, delay: 0, onUpdate: l3 && function() {
          return bt2(e, "onUpdate");
        }, stagger: 0 }, s3))), e._startAt._dp = 0, e._startAt._sat = e, r < 0 && (Ye2 || !o2 && !c) && e._startAt.revert(Tn), o2 && g4 && r <= 0 && t2 <= 0) {
          r && (e._zTime = r);
          return;
        }
      } else if (f4 && g4 && !_7) {
        if (r && (o2 = false), w4 = Ct2({ overwrite: false, data: "isFromStart", lazy: o2 && !_7 && ut2(u3), immediateRender: o2, stagger: 0, parent: T2 }, y3), I2 && (w4[M4.prop] = I2), Tr(e._startAt = xe2.set(m3, w4)), e._startAt._dp = 0, e._startAt._sat = e, r < 0 && (Ye2 ? e._startAt.revert(Tn) : e._startAt.render(-1, true)), e._zTime = r, !o2) a11(e._startAt, ne2, ne2);
        else if (!r) return;
      }
      for (e._pt = e._ptCache = 0, u3 = g4 && ut2(u3) || u3 && !g4, S3 = 0; S3 < m3.length; S3++) {
        if (k3 = m3[S3], F3 = k3._gsap || qs(m3)[S3]._gsap, e._ptLookup[S3] = N5 = {}, ps[F3.id] && xr.length && Rn(), B3 = b4 === m3 ? S3 : b4.indexOf(k3), M4 && (A4 = new M4()).init(k3, I2 || y3, e, B3, b4) !== false && (e._pt = C4 = new ft2(e._pt, k3, A4.name, 0, 1, A4.render, A4, 0, A4.priority), A4._props.forEach(function($3) {
          N5[$3] = C4;
        }), A4.priority && (O3 = 1)), !M4 || I2) for (w4 in y3) yt2[w4] && (A4 = Na(w4, y3, e, B3, k3, b4)) ? A4.priority && (O3 = 1) : N5[w4] = C4 = js.call(e, k3, w4, "get", y3[w4], B3, b4, 0, i3.stringFilter);
        e._op && e._op[S3] && e.kill(k3, e._op[S3]), P3 && e._pt && (pr = e, ce2.killTweensOf(k3, N5, e.globalTime(r)), R4 = !e.parent, pr = 0), e._pt && u3 && (ps[F3.id] = 1);
      }
      O3 && Va(e), e._onInit && e._onInit(e);
    }
    e._onUpdate = l3, e._initted = (!e._op || e._pt) && !R4, d2 && r <= 0 && v3.render(Et2, true, true);
  };
  var ol = function(e, r, t2, i3, n3, s3, o2, u3) {
    var l3 = (e._pt && e._ptCache || (e._ptCache = {}))[r], f4, h2, d2, c;
    if (!l3) for (l3 = e._ptCache[r] = [], d2 = e._ptLookup, c = e._targets.length; c--; ) {
      if (f4 = d2[c][r], f4 && f4.d && f4.d._pt) for (f4 = f4.d._pt; f4 && f4.p !== r && f4.fp !== r; ) f4 = f4._next;
      if (!f4) return ws = 1, e.vars[r] = "+=0", Ks(e, o2), ws = 0, u3 ? ji(r + " not eligible for reset") : 1;
      l3.push(f4);
    }
    for (c = l3.length; c--; ) h2 = l3[c], f4 = h2._pt || h2, f4.s = (i3 || i3 === 0) && !n3 ? i3 : f4.s + (i3 || 0) + s3 * f4.c, f4.c = t2 - f4.s, h2.e && (h2.e = ve2(t2) + qe2(h2.e)), h2.b && (h2.b = f4.s + qe2(h2.b));
  };
  var al = function(e, r) {
    var t2 = e[0] ? Br(e[0]).harness : 0, i3 = t2 && t2.aliases, n3, s3, o2, u3;
    if (!i3) return r;
    n3 = mi({}, r);
    for (s3 in i3) if (s3 in n3) for (u3 = i3[s3].split(","), o2 = u3.length; o2--; ) n3[u3[o2]] = n3[s3];
    return n3;
  };
  var ul = function(e, r, t2, i3) {
    var n3 = r.ease || i3 || "power1.inOut", s3, o2;
    if (je2(r)) o2 = t2[e] || (t2[e] = []), r.forEach(function(u3, l3) {
      return o2.push({ t: l3 / (r.length - 1) * 100, v: u3, e: n3 });
    });
    else for (s3 in r) o2 = t2[s3] || (t2[s3] = []), s3 === "ease" || o2.push({ t: parseFloat(e), v: r[s3], e: n3 });
  };
  var Yi = function(e, r, t2, i3, n3) {
    return pe2(e) ? e.call(r, t2, i3, n3) : ze2(e) && ~e.indexOf("random(") ? Zi(e) : e;
  };
  var Ia = Hs + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert";
  var Ba = {};
  lt2(Ia + ",id,stagger,delay,duration,paused,scrollTrigger", function(a20) {
    return Ba[a20] = 1;
  });
  var xe2 = (function(a20) {
    ia(e, a20);
    function e(t2, i3, n3, s3) {
      var o2;
      typeof i3 == "number" && (n3.duration = i3, i3 = n3, n3 = null), o2 = a20.call(this, s3 ? i3 : Ii(i3)) || this;
      var u3 = o2.vars, l3 = u3.duration, f4 = u3.delay, h2 = u3.immediateRender, d2 = u3.stagger, c = u3.overwrite, g4 = u3.keyframes, _7 = u3.defaults, m3 = u3.scrollTrigger, T2 = u3.yoyoEase, b4 = i3.parent || ce2, P3 = (je2(t2) || sa(t2) ? or(t2[0]) : "length" in i3) ? [t2] : Dt2(t2), v3, y3, S3, w4, C4, k3, O3, F3;
      if (o2._targets = P3.length ? qs(P3) : ji("GSAP target " + t2 + " not found. https://gsap.com", !Tt2.nullTargetWarn) || [], o2._ptLookup = [], o2._overwrite = c, g4 || d2 || fn(l3) || fn(f4)) {
        if (i3 = o2.vars, v3 = o2.timeline = new Ie2({ data: "nested", defaults: _7 || {}, targets: b4 && b4.data === "nested" ? b4.vars.targets : P3 }), v3.kill(), v3.parent = v3._dp = tr(o2), v3._start = 0, d2 || fn(l3) || fn(f4)) {
          if (w4 = P3.length, O3 = d2 && Ta(d2), Qt2(d2)) for (C4 in d2) ~Ia.indexOf(C4) && (F3 || (F3 = {}), F3[C4] = d2[C4]);
          for (y3 = 0; y3 < w4; y3++) S3 = zn(i3, Ba), S3.stagger = 0, T2 && (S3.yoyoEase = T2), F3 && mi(S3, F3), k3 = P3[y3], S3.duration = +Yi(l3, tr(o2), y3, k3, P3), S3.delay = (+Yi(f4, tr(o2), y3, k3, P3) || 0) - o2._delay, !d2 && w4 === 1 && S3.delay && (o2._delay = f4 = S3.delay, o2._start += f4, S3.delay = 0), v3.to(k3, S3, O3 ? O3(y3, k3, P3) : 0), v3._ease = Z2.none;
          v3.duration() ? l3 = f4 = 0 : o2.timeline = 0;
        } else if (g4) {
          Ii(Ct2(v3.vars.defaults, { ease: "none" })), v3._ease = Wr(g4.ease || i3.ease || "none");
          var M4 = 0, A4, N5, B3;
          if (je2(g4)) g4.forEach(function(I2) {
            return v3.to(P3, I2, ">");
          }), v3.duration();
          else {
            S3 = {};
            for (C4 in g4) C4 === "ease" || C4 === "easeEach" || ul(C4, g4[C4], S3, g4.easeEach);
            for (C4 in S3) for (A4 = S3[C4].sort(function(I2, R4) {
              return I2.t - R4.t;
            }), M4 = 0, y3 = 0; y3 < A4.length; y3++) N5 = A4[y3], B3 = { ease: N5.e, duration: (N5.t - (y3 ? A4[y3 - 1].t : 0)) / 100 * l3 }, B3[C4] = N5.v, v3.to(P3, B3, M4), M4 += B3.duration;
            v3.duration() < l3 && v3.to({}, { duration: l3 - v3.duration() });
          }
        }
        l3 || o2.duration(l3 = v3.duration());
      } else o2.timeline = 0;
      return c === true && !Ws && (pr = tr(o2), ce2.killTweensOf(P3), pr = 0), Ut2(b4, tr(o2), n3), i3.reversed && o2.reverse(), i3.paused && o2.paused(true), (h2 || !l3 && !g4 && o2._start === Ce2(b4._time) && ut2(h2) && Bu(tr(o2)) && b4.data !== "nested") && (o2._tTime = -ne2, o2.render(Math.max(0, -f4) || 0)), m3 && va(tr(o2), m3), o2;
    }
    var r = e.prototype;
    return r.render = function(i3, n3, s3) {
      var o2 = this._time, u3 = this._tDur, l3 = this._dur, f4 = i3 < 0, h2 = i3 > u3 - ne2 && !f4 ? u3 : i3 < ne2 ? 0 : i3, d2, c, g4, _7, m3, T2, b4, P3, v3;
      if (!l3) Wu(this, i3, n3, s3);
      else if (h2 !== this._tTime || !i3 || s3 || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== f4 || this._lazy) {
        if (d2 = h2, P3 = this.timeline, this._repeat) {
          if (_7 = l3 + this._rDelay, this._repeat < -1 && f4) return this.totalTime(_7 * 100 + i3, n3, s3);
          if (d2 = Ce2(h2 % _7), h2 === u3 ? (g4 = this._repeat, d2 = l3) : (m3 = Ce2(h2 / _7), g4 = ~~m3, g4 && g4 === m3 ? (d2 = l3, g4--) : d2 > l3 && (d2 = l3)), T2 = this._yoyo && g4 & 1, T2 && (v3 = this._yEase, d2 = l3 - d2), m3 = yi(this._tTime, _7), d2 === o2 && !s3 && this._initted && g4 === m3) return this._tTime = h2, this;
          g4 !== m3 && (P3 && this._yEase && za(P3, T2), this.vars.repeatRefresh && !T2 && !this._lock && d2 !== _7 && this._initted && (this._lock = s3 = 1, this.render(Ce2(_7 * g4), true).invalidate()._lock = 0));
        }
        if (!this._initted) {
          if (xa(this, f4 ? i3 : d2, s3, n3, h2)) return this._tTime = 0, this;
          if (o2 !== this._time && !(s3 && this.vars.repeatRefresh && g4 !== m3)) return this;
          if (l3 !== this._dur) return this.render(i3, n3, s3);
        }
        if (this._tTime = h2, this._time = d2, !this._act && this._ts && (this._act = 1, this._lazy = 0), this.ratio = b4 = (v3 || this._ease)(d2 / l3), this._from && (this.ratio = b4 = 1 - b4), !o2 && h2 && !n3 && !m3 && (bt2(this, "onStart"), this._tTime !== h2)) return this;
        for (c = this._pt; c; ) c.r(b4, c.d), c = c._next;
        P3 && P3.render(i3 < 0 ? i3 : P3._dur * P3._ease(d2 / this._dur), n3, s3) || this._startAt && (this._zTime = i3), this._onUpdate && !n3 && (f4 && gs(this, i3, n3, s3), bt2(this, "onUpdate")), this._repeat && g4 !== m3 && this.vars.onRepeat && !n3 && this.parent && bt2(this, "onRepeat"), (h2 === this._tDur || !h2) && this._tTime === h2 && (f4 && !this._onUpdate && gs(this, i3, true, true), (i3 || !l3) && (h2 === this._tDur && this._ts > 0 || !h2 && this._ts < 0) && Tr(this, 1), !n3 && !(f4 && !o2) && (h2 || o2 || T2) && (bt2(this, h2 === u3 ? "onComplete" : "onReverseComplete", true), this._prom && !(h2 < u3 && this.timeScale() > 0) && this._prom()));
      }
      return this;
    }, r.targets = function() {
      return this._targets;
    }, r.invalidate = function(i3) {
      return (!i3 || !this.vars.runBackwards) && (this._startAt = 0), this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0, this._ptLookup = [], this.timeline && this.timeline.invalidate(i3), a20.prototype.invalidate.call(this, i3);
    }, r.resetTo = function(i3, n3, s3, o2, u3) {
      Ji || xt2.wake(), this._ts || this.play();
      var l3 = Math.min(this._dur, (this._dp._time - this._start) * this._ts), f4;
      return this._initted || Ks(this, l3), f4 = this._ease(l3 / this._dur), ol(this, i3, n3, s3, o2, f4, l3, u3) ? this.resetTo(i3, n3, s3, o2, 1) : (Hn(this, 0), this.parent || ma(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0), this.render(0));
    }, r.kill = function(i3, n3) {
      if (n3 === void 0 && (n3 = "all"), !i3 && (!n3 || n3 === "all")) return this._lazy = this._pt = 0, this.parent ? Di(this) : this.scrollTrigger && this.scrollTrigger.kill(!!Ye2), this;
      if (this.timeline) {
        var s3 = this.timeline.totalDuration();
        return this.timeline.killTweensOf(i3, n3, pr && pr.vars.overwrite !== true)._first || Di(this), this.parent && s3 !== this.timeline.totalDuration() && vi(this, this._dur * this.timeline._tDur / s3, 0, 1), this;
      }
      var o2 = this._targets, u3 = i3 ? Dt2(i3) : o2, l3 = this._ptLookup, f4 = this._pt, h2, d2, c, g4, _7, m3, T2;
      if ((!n3 || n3 === "all") && Nu(o2, u3)) return n3 === "all" && (this._pt = 0), Di(this);
      for (h2 = this._op = this._op || [], n3 !== "all" && (ze2(n3) && (_7 = {}, lt2(n3, function(b4) {
        return _7[b4] = 1;
      }), n3 = _7), n3 = al(o2, n3)), T2 = o2.length; T2--; ) if (~u3.indexOf(o2[T2])) {
        d2 = l3[T2], n3 === "all" ? (h2[T2] = n3, g4 = d2, c = {}) : (c = h2[T2] = h2[T2] || {}, g4 = n3);
        for (_7 in g4) m3 = d2 && d2[_7], m3 && ((!("kill" in m3.d) || m3.d.kill(_7) === true) && Un(this, m3, "_pt"), delete d2[_7]), c !== "all" && (c[_7] = 1);
      }
      return this._initted && !this._pt && f4 && Di(this), this;
    }, e.to = function(i3, n3) {
      return new e(i3, n3, arguments[2]);
    }, e.from = function(i3, n3) {
      return Bi(1, arguments);
    }, e.delayedCall = function(i3, n3, s3, o2) {
      return new e(n3, 0, { immediateRender: false, lazy: false, overwrite: false, delay: i3, onComplete: n3, onReverseComplete: n3, onCompleteParams: s3, onReverseCompleteParams: s3, callbackScope: o2 });
    }, e.fromTo = function(i3, n3, s3) {
      return Bi(2, arguments);
    }, e.set = function(i3, n3) {
      return n3.duration = 0, n3.repeatDelay || (n3.repeat = 0), new e(i3, n3);
    }, e.killTweensOf = function(i3, n3, s3) {
      return ce2.killTweensOf(i3, n3, s3);
    }, e;
  })(en);
  Ct2(xe2.prototype, { _targets: [], _lazy: 0, _startAt: 0, _op: 0, _onInit: 0 });
  lt2("staggerTo,staggerFrom,staggerFromTo", function(a20) {
    xe2[a20] = function() {
      var e = new Ie2(), r = ys.call(arguments, 0);
      return r.splice(a20 === "staggerFromTo" ? 5 : 4, 0, 0), e[a20].apply(e, r);
    };
  });
  var Zs = function(e, r, t2) {
    return e[r] = t2;
  };
  var Ya = function(e, r, t2) {
    return e[r](t2);
  };
  var ll = function(e, r, t2, i3) {
    return e[r](i3.fp, t2);
  };
  var fl = function(e, r, t2) {
    return e.setAttribute(r, t2);
  };
  var Js = function(e, r) {
    return pe2(e[r]) ? Ya : Xs(e[r]) && e.setAttribute ? fl : Zs;
  };
  var Wa = function(e, r) {
    return r.set(r.t, r.p, Math.round((r.s + r.c * e) * 1e6) / 1e6, r);
  };
  var cl = function(e, r) {
    return r.set(r.t, r.p, !!(r.s + r.c * e), r);
  };
  var Xa = function(e, r) {
    var t2 = r._pt, i3 = "";
    if (!e && r.b) i3 = r.b;
    else if (e === 1 && r.e) i3 = r.e;
    else {
      for (; t2; ) i3 = t2.p + (t2.m ? t2.m(t2.s + t2.c * e) : Math.round((t2.s + t2.c * e) * 1e4) / 1e4) + i3, t2 = t2._next;
      i3 += r.c;
    }
    r.set(r.t, r.p, i3, r);
  };
  var eo = function(e, r) {
    for (var t2 = r._pt; t2; ) t2.r(e, t2.d), t2 = t2._next;
  };
  var hl = function(e, r, t2, i3) {
    for (var n3 = this._pt, s3; n3; ) s3 = n3._next, n3.p === i3 && n3.modifier(e, r, t2), n3 = s3;
  };
  var _l = function(e) {
    for (var r = this._pt, t2, i3; r; ) i3 = r._next, r.p === e && !r.op || r.op === e ? Un(this, r, "_pt") : r.dep || (t2 = 1), r = i3;
    return !t2;
  };
  var dl = function(e, r, t2, i3) {
    i3.mSet(e, r, i3.m.call(i3.tween, t2, i3.mt), i3);
  };
  var Va = function(e) {
    for (var r = e._pt, t2, i3, n3, s3; r; ) {
      for (t2 = r._next, i3 = n3; i3 && i3.pr > r.pr; ) i3 = i3._next;
      (r._prev = i3 ? i3._prev : s3) ? r._prev._next = r : n3 = r, (r._next = i3) ? i3._prev = r : s3 = r, r = t2;
    }
    e._pt = n3;
  };
  var ft2 = (function() {
    function a20(r, t2, i3, n3, s3, o2, u3, l3, f4) {
      this.t = t2, this.s = n3, this.c = s3, this.p = i3, this.r = o2 || Wa, this.d = u3 || this, this.set = l3 || Zs, this.pr = f4 || 0, this._next = r, r && (r._prev = this);
    }
    var e = a20.prototype;
    return e.modifier = function(t2, i3, n3) {
      this.mSet = this.mSet || this.set, this.set = dl, this.m = t2, this.mt = n3, this.tween = i3;
    }, a20;
  })();
  lt2(Hs + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", function(a20) {
    return Gs[a20] = 1;
  });
  St2.TweenMax = St2.TweenLite = xe2;
  St2.TimelineLite = St2.TimelineMax = Ie2;
  ce2 = new Ie2({ sortChildren: false, defaults: gi, autoRemoveChildren: true, id: "root", smoothChildTiming: true });
  Tt2.stringFilter = Aa;
  var Xr = [];
  var Cn = {};
  var pl = [];
  var bo = 0;
  var gl = 0;
  var ts = function(e) {
    return (Cn[e] || pl).map(function(r) {
      return r();
    });
  };
  var bs = function() {
    var e = Date.now(), r = [];
    e - bo > 2 && (ts("matchMediaInit"), Xr.forEach(function(t2) {
      var i3 = t2.queries, n3 = t2.conditions, s3, o2, u3, l3;
      for (o2 in i3) s3 = Vt2.matchMedia(i3[o2]).matches, s3 && (u3 = 1), s3 !== n3[o2] && (n3[o2] = s3, l3 = 1);
      l3 && (t2.revert(), u3 && r.push(t2));
    }), ts("matchMediaRevert"), r.forEach(function(t2) {
      return t2.onMatch(t2, function(i3) {
        return t2.add(null, i3);
      });
    }), bo = e, ts("matchMedia"));
  };
  var $a = (function() {
    function a20(r, t2) {
      this.selector = t2 && vs(t2), this.data = [], this._r = [], this.isReverted = false, this.id = gl++, r && this.add(r);
    }
    var e = a20.prototype;
    return e.add = function(t2, i3, n3) {
      pe2(t2) && (n3 = i3, i3 = t2, t2 = pe2);
      var s3 = this, o2 = function() {
        var l3 = le2, f4 = s3.selector, h2;
        return l3 && l3 !== s3 && l3.data.push(s3), n3 && (s3.selector = vs(n3)), le2 = s3, h2 = i3.apply(s3, arguments), pe2(h2) && s3._r.push(h2), le2 = l3, s3.selector = f4, s3.isReverted = false, h2;
      };
      return s3.last = o2, t2 === pe2 ? o2(s3, function(u3) {
        return s3.add(null, u3);
      }) : t2 ? s3[t2] = o2 : o2;
    }, e.ignore = function(t2) {
      var i3 = le2;
      le2 = null, t2(this), le2 = i3;
    }, e.getTweens = function() {
      var t2 = [];
      return this.data.forEach(function(i3) {
        return i3 instanceof a20 ? t2.push.apply(t2, i3.getTweens()) : i3 instanceof xe2 && !(i3.parent && i3.parent.data === "nested") && t2.push(i3);
      }), t2;
    }, e.clear = function() {
      this._r.length = this.data.length = 0;
    }, e.kill = function(t2, i3) {
      var n3 = this;
      if (t2 ? (function() {
        for (var o2 = n3.getTweens(), u3 = n3.data.length, l3; u3--; ) l3 = n3.data[u3], l3.data === "isFlip" && (l3.revert(), l3.getChildren(true, true, false).forEach(function(f4) {
          return o2.splice(o2.indexOf(f4), 1);
        }));
        for (o2.map(function(f4) {
          return { g: f4._dur || f4._delay || f4._sat && !f4._sat.vars.immediateRender ? f4.globalTime(0) : -1 / 0, t: f4 };
        }).sort(function(f4, h2) {
          return h2.g - f4.g || -1 / 0;
        }).forEach(function(f4) {
          return f4.t.revert(t2);
        }), u3 = n3.data.length; u3--; ) l3 = n3.data[u3], l3 instanceof Ie2 ? l3.data !== "nested" && (l3.scrollTrigger && l3.scrollTrigger.revert(), l3.kill()) : !(l3 instanceof xe2) && l3.revert && l3.revert(t2);
        n3._r.forEach(function(f4) {
          return f4(t2, n3);
        }), n3.isReverted = true;
      })() : this.data.forEach(function(o2) {
        return o2.kill && o2.kill();
      }), this.clear(), i3) for (var s3 = Xr.length; s3--; ) Xr[s3].id === this.id && Xr.splice(s3, 1);
    }, e.revert = function(t2) {
      this.kill(t2 || {});
    }, a20;
  })();
  var ml = (function() {
    function a20(r) {
      this.contexts = [], this.scope = r, le2 && le2.data.push(this);
    }
    var e = a20.prototype;
    return e.add = function(t2, i3, n3) {
      Qt2(t2) || (t2 = { matches: t2 });
      var s3 = new $a(0, n3 || this.scope), o2 = s3.conditions = {}, u3, l3, f4;
      le2 && !s3.selector && (s3.selector = le2.selector), this.contexts.push(s3), i3 = s3.add("onMatch", i3), s3.queries = t2;
      for (l3 in t2) l3 === "all" ? f4 = 1 : (u3 = Vt2.matchMedia(t2[l3]), u3 && (Xr.indexOf(s3) < 0 && Xr.push(s3), (o2[l3] = u3.matches) && (f4 = 1), u3.addListener ? u3.addListener(bs) : u3.addEventListener("change", bs)));
      return f4 && i3(s3, function(h2) {
        return s3.add(null, h2);
      }), this;
    }, e.revert = function(t2) {
      this.kill(t2 || {});
    }, e.kill = function(t2) {
      this.contexts.forEach(function(i3) {
        return i3.kill(t2, true);
      });
    }, a20;
  })();
  var Ln = { registerPlugin: function() {
    for (var e = arguments.length, r = new Array(e), t2 = 0; t2 < e; t2++) r[t2] = arguments[t2];
    r.forEach(function(i3) {
      return Ma(i3);
    });
  }, timeline: function(e) {
    return new Ie2(e);
  }, getTweensOf: function(e, r) {
    return ce2.getTweensOf(e, r);
  }, getProperty: function(e, r, t2, i3) {
    ze2(e) && (e = Dt2(e)[0]);
    var n3 = Br(e || {}).get, s3 = t2 ? ga : pa;
    return t2 === "native" && (t2 = ""), e && (r ? s3((yt2[r] && yt2[r].get || n3)(e, r, t2, i3)) : function(o2, u3, l3) {
      return s3((yt2[o2] && yt2[o2].get || n3)(e, o2, u3, l3));
    });
  }, quickSetter: function(e, r, t2) {
    if (e = Dt2(e), e.length > 1) {
      var i3 = e.map(function(f4) {
        return ht2.quickSetter(f4, r, t2);
      }), n3 = i3.length;
      return function(f4) {
        for (var h2 = n3; h2--; ) i3[h2](f4);
      };
    }
    e = e[0] || {};
    var s3 = yt2[r], o2 = Br(e), u3 = o2.harness && (o2.harness.aliases || {})[r] || r, l3 = s3 ? function(f4) {
      var h2 = new s3();
      ui._pt = 0, h2.init(e, t2 ? f4 + t2 : f4, ui, 0, [e]), h2.render(1, h2), ui._pt && eo(1, ui);
    } : o2.set(e, u3);
    return s3 ? l3 : function(f4) {
      return l3(e, u3, t2 ? f4 + t2 : f4, o2, 1);
    };
  }, quickTo: function(e, r, t2) {
    var i3, n3 = ht2.to(e, Ct2((i3 = {}, i3[r] = "+=0.1", i3.paused = true, i3.stagger = 0, i3), t2 || {})), s3 = function(u3, l3, f4) {
      return n3.resetTo(r, u3, l3, f4);
    };
    return s3.tween = n3, s3;
  }, isTweening: function(e) {
    return ce2.getTweensOf(e, true).length > 0;
  }, defaults: function(e) {
    return e && e.ease && (e.ease = Wr(e.ease, gi.ease)), mo(gi, e || {});
  }, config: function(e) {
    return mo(Tt2, e || {});
  }, registerEffect: function(e) {
    var r = e.name, t2 = e.effect, i3 = e.plugins, n3 = e.defaults, s3 = e.extendTimeline;
    (i3 || "").split(",").forEach(function(o2) {
      return o2 && !yt2[o2] && !St2[o2] && ji(r + " effect requires " + o2 + " plugin.");
    }), Kn[r] = function(o2, u3, l3) {
      return t2(Dt2(o2), Ct2(u3 || {}, n3), l3);
    }, s3 && (Ie2.prototype[r] = function(o2, u3, l3) {
      return this.add(Kn[r](o2, Qt2(u3) ? u3 : (l3 = u3) && {}, this), l3);
    });
  }, registerEase: function(e, r) {
    Z2[e] = Wr(r);
  }, parseEase: function(e, r) {
    return arguments.length ? Wr(e, r) : Z2;
  }, getById: function(e) {
    return ce2.getById(e);
  }, exportRoot: function(e, r) {
    e === void 0 && (e = {});
    var t2 = new Ie2(e), i3, n3;
    for (t2.smoothChildTiming = ut2(e.smoothChildTiming), ce2.remove(t2), t2._dp = 0, t2._time = t2._tTime = ce2._time, i3 = ce2._first; i3; ) n3 = i3._next, (r || !(!i3._dur && i3 instanceof xe2 && i3.vars.onComplete === i3._targets[0])) && Ut2(t2, i3, i3._start - i3._delay), i3 = n3;
    return Ut2(ce2, t2, 0), t2;
  }, context: function(e, r) {
    return e ? new $a(e, r) : le2;
  }, matchMedia: function(e) {
    return new ml(e);
  }, matchMediaRefresh: function() {
    return Xr.forEach(function(e) {
      var r = e.conditions, t2, i3;
      for (i3 in r) r[i3] && (r[i3] = false, t2 = 1);
      t2 && e.revert();
    }) || bs();
  }, addEventListener: function(e, r) {
    var t2 = Cn[e] || (Cn[e] = []);
    ~t2.indexOf(r) || t2.push(r);
  }, removeEventListener: function(e, r) {
    var t2 = Cn[e], i3 = t2 && t2.indexOf(r);
    i3 >= 0 && t2.splice(i3, 1);
  }, utils: { wrap: Qu, wrapYoyo: ju, distribute: Ta, random: Ca, snap: Sa, normalize: qu, getUnit: qe2, clamp: $u, splitColor: Ea, toArray: Dt2, selector: vs, mapRange: Pa, pipe: Gu, unitize: Hu, interpolate: Ku, shuffle: ba }, install: fa, effects: Kn, ticker: xt2, updateRoot: Ie2.updateRoot, plugins: yt2, globalTimeline: ce2, core: { PropTween: ft2, globals: ca, Tween: xe2, Timeline: Ie2, Animation: en, getCache: Br, _removeLinkedListItem: Un, reverting: function() {
    return Ye2;
  }, context: function(e) {
    return e && le2 && (le2.data.push(e), e._ctx = le2), le2;
  }, suppressOverwrites: function(e) {
    return Ws = e;
  } } };
  lt2("to,from,fromTo,delayedCall,set,killTweensOf", function(a20) {
    return Ln[a20] = xe2[a20];
  });
  xt2.add(Ie2.updateRoot);
  ui = Ln.to({}, { duration: 0 });
  var yl = function(e, r) {
    for (var t2 = e._pt; t2 && t2.p !== r && t2.op !== r && t2.fp !== r; ) t2 = t2._next;
    return t2;
  };
  var vl = function(e, r) {
    var t2 = e._targets, i3, n3, s3;
    for (i3 in r) for (n3 = t2.length; n3--; ) s3 = e._ptLookup[n3][i3], s3 && (s3 = s3.d) && (s3._pt && (s3 = yl(s3, i3)), s3 && s3.modifier && s3.modifier(r[i3], e, t2[n3], i3));
  };
  var rs = function(e, r) {
    return { name: e, headless: 1, rawVars: 1, init: function(i3, n3, s3) {
      s3._onInit = function(o2) {
        var u3, l3;
        if (ze2(n3) && (u3 = {}, lt2(n3, function(f4) {
          return u3[f4] = 1;
        }), n3 = u3), r) {
          u3 = {};
          for (l3 in n3) u3[l3] = r(n3[l3]);
          n3 = u3;
        }
        vl(o2, n3);
      };
    } };
  };
  var ht2 = Ln.registerPlugin({ name: "attr", init: function(e, r, t2, i3, n3) {
    var s3, o2, u3;
    this.tween = t2;
    for (s3 in r) u3 = e.getAttribute(s3) || "", o2 = this.add(e, "setAttribute", (u3 || 0) + "", r[s3], i3, n3, 0, 0, s3), o2.op = s3, o2.b = u3, this._props.push(s3);
  }, render: function(e, r) {
    for (var t2 = r._pt; t2; ) Ye2 ? t2.set(t2.t, t2.p, t2.b, t2) : t2.r(e, t2.d), t2 = t2._next;
  } }, { name: "endArray", headless: 1, init: function(e, r) {
    for (var t2 = r.length; t2--; ) this.add(e, t2, e[t2] || 0, r[t2], 0, 0, 0, 0, 0, 1);
  } }, rs("roundProps", xs), rs("modifiers"), rs("snap", Sa)) || Ln;
  xe2.version = Ie2.version = ht2.version = "3.13.0";
  la = 1;
  Vs() && xi();
  var xl = Z2.Power0;
  var wl = Z2.Power1;
  var bl = Z2.Power2;
  var Tl = Z2.Power3;
  var Sl = Z2.Power4;
  var Cl = Z2.Linear;
  var kl = Z2.Quad;
  var Pl = Z2.Cubic;
  var Ol = Z2.Quart;
  var Ml = Z2.Quint;
  var El = Z2.Strong;
  var Dl = Z2.Elastic;
  var Al = Z2.Back;
  var Rl = Z2.SteppedEase;
  var zl = Z2.Bounce;
  var Fl = Z2.Sine;
  var Ll = Z2.Expo;
  var Nl = Z2.Circ;
  var To;
  var gr;
  var ci;
  var to;
  var Nr;
  var So;
  var ro;
  var Il = function() {
    return typeof window < "u";
  };
  var ar = {};
  var zr = 180 / Math.PI;
  var hi = Math.PI / 180;
  var ei2 = Math.atan2;
  var Co = 1e8;
  var io = /([A-Z])/g;
  var Bl = /(left|right|width|margin|padding|x)/i;
  var Yl = /[\s,\(]\S/;
  var Gt2 = { autoAlpha: "opacity,visibility", scale: "scaleX,scaleY", alpha: "opacity" };
  var Ts = function(e, r) {
    return r.set(r.t, r.p, Math.round((r.s + r.c * e) * 1e4) / 1e4 + r.u, r);
  };
  var Wl = function(e, r) {
    return r.set(r.t, r.p, e === 1 ? r.e : Math.round((r.s + r.c * e) * 1e4) / 1e4 + r.u, r);
  };
  var Xl = function(e, r) {
    return r.set(r.t, r.p, e ? Math.round((r.s + r.c * e) * 1e4) / 1e4 + r.u : r.b, r);
  };
  var Vl = function(e, r) {
    var t2 = r.s + r.c * e;
    r.set(r.t, r.p, ~~(t2 + (t2 < 0 ? -0.5 : 0.5)) + r.u, r);
  };
  var Ua = function(e, r) {
    return r.set(r.t, r.p, e ? r.e : r.b, r);
  };
  var Ga = function(e, r) {
    return r.set(r.t, r.p, e !== 1 ? r.b : r.e, r);
  };
  var $l = function(e, r, t2) {
    return e.style[r] = t2;
  };
  var Ul = function(e, r, t2) {
    return e.style.setProperty(r, t2);
  };
  var Gl = function(e, r, t2) {
    return e._gsap[r] = t2;
  };
  var Hl = function(e, r, t2) {
    return e._gsap.scaleX = e._gsap.scaleY = t2;
  };
  var ql = function(e, r, t2, i3, n3) {
    var s3 = e._gsap;
    s3.scaleX = s3.scaleY = t2, s3.renderTransform(n3, s3);
  };
  var Ql = function(e, r, t2, i3, n3) {
    var s3 = e._gsap;
    s3[r] = t2, s3.renderTransform(n3, s3);
  };
  var he2 = "transform";
  var ct2 = he2 + "Origin";
  var jl = function a12(e, r) {
    var t2 = this, i3 = this.target, n3 = i3.style, s3 = i3._gsap;
    if (e in ar && n3) {
      if (this.tfm = this.tfm || {}, e !== "transform") e = Gt2[e] || e, ~e.indexOf(",") ? e.split(",").forEach(function(o2) {
        return t2.tfm[o2] = rr(i3, o2);
      }) : this.tfm[e] = s3.x ? s3[e] : rr(i3, e), e === ct2 && (this.tfm.zOrigin = s3.zOrigin);
      else return Gt2.transform.split(",").forEach(function(o2) {
        return a12.call(t2, o2, r);
      });
      if (this.props.indexOf(he2) >= 0) return;
      s3.svg && (this.svgo = i3.getAttribute("data-svg-origin"), this.props.push(ct2, r, "")), e = he2;
    }
    (n3 || r) && this.props.push(e, r, n3[e]);
  };
  var Ha = function(e) {
    e.translate && (e.removeProperty("translate"), e.removeProperty("scale"), e.removeProperty("rotate"));
  };
  var Kl = function() {
    var e = this.props, r = this.target, t2 = r.style, i3 = r._gsap, n3, s3;
    for (n3 = 0; n3 < e.length; n3 += 3) e[n3 + 1] ? e[n3 + 1] === 2 ? r[e[n3]](e[n3 + 2]) : r[e[n3]] = e[n3 + 2] : e[n3 + 2] ? t2[e[n3]] = e[n3 + 2] : t2.removeProperty(e[n3].substr(0, 2) === "--" ? e[n3] : e[n3].replace(io, "-$1").toLowerCase());
    if (this.tfm) {
      for (s3 in this.tfm) i3[s3] = this.tfm[s3];
      i3.svg && (i3.renderTransform(), r.setAttribute("data-svg-origin", this.svgo || "")), n3 = ro(), (!n3 || !n3.isStart) && !t2[he2] && (Ha(t2), i3.zOrigin && t2[ct2] && (t2[ct2] += " " + i3.zOrigin + "px", i3.zOrigin = 0, i3.renderTransform()), i3.uncache = 1);
    }
  };
  var qa = function(e, r) {
    var t2 = { target: e, props: [], revert: Kl, save: jl };
    return e._gsap || ht2.core.getCache(e), r && e.style && e.nodeType && r.split(",").forEach(function(i3) {
      return t2.save(i3);
    }), t2;
  };
  var Qa;
  var Ss = function(e, r) {
    var t2 = gr.createElementNS ? gr.createElementNS((r || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), e) : gr.createElement(e);
    return t2 && t2.style ? t2 : gr.createElement(e);
  };
  var At2 = function a13(e, r, t2) {
    var i3 = getComputedStyle(e);
    return i3[r] || i3.getPropertyValue(r.replace(io, "-$1").toLowerCase()) || i3.getPropertyValue(r) || !t2 && a13(e, wi(r) || r, 1) || "";
  };
  var ko = "O,Moz,ms,Ms,Webkit".split(",");
  var wi = function(e, r, t2) {
    var i3 = r || Nr, n3 = i3.style, s3 = 5;
    if (e in n3 && !t2) return e;
    for (e = e.charAt(0).toUpperCase() + e.substr(1); s3-- && !(ko[s3] + e in n3); ) ;
    return s3 < 0 ? null : (s3 === 3 ? "ms" : s3 >= 0 ? ko[s3] : "") + e;
  };
  var Cs = function() {
    Il() && window.document && (To = window, gr = To.document, ci = gr.documentElement, Nr = Ss("div") || { style: {} }, Ss("div"), he2 = wi(he2), ct2 = he2 + "Origin", Nr.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0", Qa = !!wi("perspective"), ro = ht2.core.reverting, to = 1);
  };
  var Po = function(e) {
    var r = e.ownerSVGElement, t2 = Ss("svg", r && r.getAttribute("xmlns") || "http://www.w3.org/2000/svg"), i3 = e.cloneNode(true), n3;
    i3.style.display = "block", t2.appendChild(i3), ci.appendChild(t2);
    try {
      n3 = i3.getBBox();
    } catch {
    }
    return t2.removeChild(i3), ci.removeChild(t2), n3;
  };
  var Oo = function(e, r) {
    for (var t2 = r.length; t2--; ) if (e.hasAttribute(r[t2])) return e.getAttribute(r[t2]);
  };
  var ja = function(e) {
    var r, t2;
    try {
      r = e.getBBox();
    } catch {
      r = Po(e), t2 = 1;
    }
    return r && (r.width || r.height) || t2 || (r = Po(e)), r && !r.width && !r.x && !r.y ? { x: +Oo(e, ["x", "cx", "x1"]) || 0, y: +Oo(e, ["y", "cy", "y1"]) || 0, width: 0, height: 0 } : r;
  };
  var Ka = function(e) {
    return !!(e.getCTM && (!e.parentNode || e.ownerSVGElement) && ja(e));
  };
  var Gr = function(e, r) {
    if (r) {
      var t2 = e.style, i3;
      r in ar && r !== ct2 && (r = he2), t2.removeProperty ? (i3 = r.substr(0, 2), (i3 === "ms" || r.substr(0, 6) === "webkit") && (r = "-" + r), t2.removeProperty(i3 === "--" ? r : r.replace(io, "-$1").toLowerCase())) : t2.removeAttribute(r);
    }
  };
  var mr = function(e, r, t2, i3, n3, s3) {
    var o2 = new ft2(e._pt, r, t2, 0, 1, s3 ? Ga : Ua);
    return e._pt = o2, o2.b = i3, o2.e = n3, e._props.push(t2), o2;
  };
  var Mo = { deg: 1, rad: 1, turn: 1 };
  var Zl = { grid: 1, flex: 1 };
  var Sr = function a14(e, r, t2, i3) {
    var n3 = parseFloat(t2) || 0, s3 = (t2 + "").trim().substr((n3 + "").length) || "px", o2 = Nr.style, u3 = Bl.test(r), l3 = e.tagName.toLowerCase() === "svg", f4 = (l3 ? "client" : "offset") + (u3 ? "Width" : "Height"), h2 = 100, d2 = i3 === "px", c = i3 === "%", g4, _7, m3, T2;
    if (i3 === s3 || !n3 || Mo[i3] || Mo[s3]) return n3;
    if (s3 !== "px" && !d2 && (n3 = a14(e, r, t2, "px")), T2 = e.getCTM && Ka(e), (c || s3 === "%") && (ar[r] || ~r.indexOf("adius"))) return g4 = T2 ? e.getBBox()[u3 ? "width" : "height"] : e[f4], ve2(c ? n3 / g4 * h2 : n3 / 100 * g4);
    if (o2[u3 ? "width" : "height"] = h2 + (d2 ? s3 : i3), _7 = i3 !== "rem" && ~r.indexOf("adius") || i3 === "em" && e.appendChild && !l3 ? e : e.parentNode, T2 && (_7 = (e.ownerSVGElement || {}).parentNode), (!_7 || _7 === gr || !_7.appendChild) && (_7 = gr.body), m3 = _7._gsap, m3 && c && m3.width && u3 && m3.time === xt2.time && !m3.uncache) return ve2(n3 / m3.width * h2);
    if (c && (r === "height" || r === "width")) {
      var b4 = e.style[r];
      e.style[r] = h2 + i3, g4 = e[f4], b4 ? e.style[r] = b4 : Gr(e, r);
    } else (c || s3 === "%") && !Zl[At2(_7, "display")] && (o2.position = At2(e, "position")), _7 === e && (o2.position = "static"), _7.appendChild(Nr), g4 = Nr[f4], _7.removeChild(Nr), o2.position = "absolute";
    return u3 && c && (m3 = Br(_7), m3.time = xt2.time, m3.width = _7[f4]), ve2(d2 ? g4 * n3 / h2 : g4 && n3 ? h2 / g4 * n3 : 0);
  };
  var rr = function(e, r, t2, i3) {
    var n3;
    return to || Cs(), r in Gt2 && r !== "transform" && (r = Gt2[r], ~r.indexOf(",") && (r = r.split(",")[0])), ar[r] && r !== "transform" ? (n3 = rn(e, i3), n3 = r !== "transformOrigin" ? n3[r] : n3.svg ? n3.origin : In(At2(e, ct2)) + " " + n3.zOrigin + "px") : (n3 = e.style[r], (!n3 || n3 === "auto" || i3 || ~(n3 + "").indexOf("calc(")) && (n3 = Nn[r] && Nn[r](e, r, t2) || At2(e, r) || _a(e, r) || (r === "opacity" ? 1 : 0))), t2 && !~(n3 + "").trim().indexOf(" ") ? Sr(e, r, n3, t2) + t2 : n3;
  };
  var Jl = function(e, r, t2, i3) {
    if (!t2 || t2 === "none") {
      var n3 = wi(r, e, 1), s3 = n3 && At2(e, n3, 1);
      s3 && s3 !== t2 ? (r = n3, t2 = s3) : r === "borderColor" && (t2 = At2(e, "borderTopColor"));
    }
    var o2 = new ft2(this._pt, e.style, r, 0, 1, Xa), u3 = 0, l3 = 0, f4, h2, d2, c, g4, _7, m3, T2, b4, P3, v3, y3;
    if (o2.b = t2, o2.e = i3, t2 += "", i3 += "", i3.substring(0, 6) === "var(--" && (i3 = At2(e, i3.substring(4, i3.indexOf(")")))), i3 === "auto" && (_7 = e.style[r], e.style[r] = i3, i3 = At2(e, r) || i3, _7 ? e.style[r] = _7 : Gr(e, r)), f4 = [t2, i3], Aa(f4), t2 = f4[0], i3 = f4[1], d2 = t2.match(ai2) || [], y3 = i3.match(ai2) || [], y3.length) {
      for (; h2 = ai2.exec(i3); ) m3 = h2[0], b4 = i3.substring(u3, h2.index), g4 ? g4 = (g4 + 1) % 5 : (b4.substr(-5) === "rgba(" || b4.substr(-5) === "hsla(") && (g4 = 1), m3 !== (_7 = d2[l3++] || "") && (c = parseFloat(_7) || 0, v3 = _7.substr((c + "").length), m3.charAt(1) === "=" && (m3 = fi(c, m3) + v3), T2 = parseFloat(m3), P3 = m3.substr((T2 + "").length), u3 = ai2.lastIndex - P3.length, P3 || (P3 = P3 || Tt2.units[r] || v3, u3 === i3.length && (i3 += P3, o2.e += P3)), v3 !== P3 && (c = Sr(e, r, _7, P3) || 0), o2._pt = { _next: o2._pt, p: b4 || l3 === 1 ? b4 : ",", s: c, c: T2 - c, m: g4 && g4 < 4 || r === "zIndex" ? Math.round : 0 });
      o2.c = u3 < i3.length ? i3.substring(u3, i3.length) : "";
    } else o2.r = r === "display" && i3 === "none" ? Ga : Ua;
    return aa.test(i3) && (o2.e = 0), this._pt = o2, o2;
  };
  var Eo = { top: "0%", bottom: "100%", left: "0%", right: "100%", center: "50%" };
  var ef = function(e) {
    var r = e.split(" "), t2 = r[0], i3 = r[1] || "50%";
    return (t2 === "top" || t2 === "bottom" || i3 === "left" || i3 === "right") && (e = t2, t2 = i3, i3 = e), r[0] = Eo[t2] || t2, r[1] = Eo[i3] || i3, r.join(" ");
  };
  var tf = function(e, r) {
    if (r.tween && r.tween._time === r.tween._dur) {
      var t2 = r.t, i3 = t2.style, n3 = r.u, s3 = t2._gsap, o2, u3, l3;
      if (n3 === "all" || n3 === true) i3.cssText = "", u3 = 1;
      else for (n3 = n3.split(","), l3 = n3.length; --l3 > -1; ) o2 = n3[l3], ar[o2] && (u3 = 1, o2 = o2 === "transformOrigin" ? ct2 : he2), Gr(t2, o2);
      u3 && (Gr(t2, he2), s3 && (s3.svg && t2.removeAttribute("transform"), i3.scale = i3.rotate = i3.translate = "none", rn(t2, 1), s3.uncache = 1, Ha(i3)));
    }
  };
  var Nn = { clearProps: function(e, r, t2, i3, n3) {
    if (n3.data !== "isFromStart") {
      var s3 = e._pt = new ft2(e._pt, r, t2, 0, 0, tf);
      return s3.u = i3, s3.pr = -10, s3.tween = n3, e._props.push(t2), 1;
    }
  } };
  var tn = [1, 0, 0, 1, 0, 0];
  var Za = {};
  var Ja = function(e) {
    return e === "matrix(1, 0, 0, 1, 0, 0)" || e === "none" || !e;
  };
  var Do = function(e) {
    var r = At2(e, he2);
    return Ja(r) ? tn : r.substr(7).match(oa).map(ve2);
  };
  var no = function(e, r) {
    var t2 = e._gsap || Br(e), i3 = e.style, n3 = Do(e), s3, o2, u3, l3;
    return t2.svg && e.getAttribute("transform") ? (u3 = e.transform.baseVal.consolidate().matrix, n3 = [u3.a, u3.b, u3.c, u3.d, u3.e, u3.f], n3.join(",") === "1,0,0,1,0,0" ? tn : n3) : (n3 === tn && !e.offsetParent && e !== ci && !t2.svg && (u3 = i3.display, i3.display = "block", s3 = e.parentNode, (!s3 || !e.offsetParent && !e.getBoundingClientRect().width) && (l3 = 1, o2 = e.nextElementSibling, ci.appendChild(e)), n3 = Do(e), u3 ? i3.display = u3 : Gr(e, "display"), l3 && (o2 ? s3.insertBefore(e, o2) : s3 ? s3.appendChild(e) : ci.removeChild(e))), r && n3.length > 6 ? [n3[0], n3[1], n3[4], n3[5], n3[12], n3[13]] : n3);
  };
  var ks = function(e, r, t2, i3, n3, s3) {
    var o2 = e._gsap, u3 = n3 || no(e, true), l3 = o2.xOrigin || 0, f4 = o2.yOrigin || 0, h2 = o2.xOffset || 0, d2 = o2.yOffset || 0, c = u3[0], g4 = u3[1], _7 = u3[2], m3 = u3[3], T2 = u3[4], b4 = u3[5], P3 = r.split(" "), v3 = parseFloat(P3[0]) || 0, y3 = parseFloat(P3[1]) || 0, S3, w4, C4, k3;
    t2 ? u3 !== tn && (w4 = c * m3 - g4 * _7) && (C4 = v3 * (m3 / w4) + y3 * (-_7 / w4) + (_7 * b4 - m3 * T2) / w4, k3 = v3 * (-g4 / w4) + y3 * (c / w4) - (c * b4 - g4 * T2) / w4, v3 = C4, y3 = k3) : (S3 = ja(e), v3 = S3.x + (~P3[0].indexOf("%") ? v3 / 100 * S3.width : v3), y3 = S3.y + (~(P3[1] || P3[0]).indexOf("%") ? y3 / 100 * S3.height : y3)), i3 || i3 !== false && o2.smooth ? (T2 = v3 - l3, b4 = y3 - f4, o2.xOffset = h2 + (T2 * c + b4 * _7) - T2, o2.yOffset = d2 + (T2 * g4 + b4 * m3) - b4) : o2.xOffset = o2.yOffset = 0, o2.xOrigin = v3, o2.yOrigin = y3, o2.smooth = !!i3, o2.origin = r, o2.originIsAbsolute = !!t2, e.style[ct2] = "0px 0px", s3 && (mr(s3, o2, "xOrigin", l3, v3), mr(s3, o2, "yOrigin", f4, y3), mr(s3, o2, "xOffset", h2, o2.xOffset), mr(s3, o2, "yOffset", d2, o2.yOffset)), e.setAttribute("data-svg-origin", v3 + " " + y3);
  };
  var rn = function(e, r) {
    var t2 = e._gsap || new La(e);
    if ("x" in t2 && !r && !t2.uncache) return t2;
    var i3 = e.style, n3 = t2.scaleX < 0, s3 = "px", o2 = "deg", u3 = getComputedStyle(e), l3 = At2(e, ct2) || "0", f4, h2, d2, c, g4, _7, m3, T2, b4, P3, v3, y3, S3, w4, C4, k3, O3, F3, M4, A4, N5, B3, I2, R4, $3, X4, p3, j3, se3, ke3, ae3, Fe2;
    return f4 = h2 = d2 = _7 = m3 = T2 = b4 = P3 = v3 = 0, c = g4 = 1, t2.svg = !!(e.getCTM && Ka(e)), u3.translate && ((u3.translate !== "none" || u3.scale !== "none" || u3.rotate !== "none") && (i3[he2] = (u3.translate !== "none" ? "translate3d(" + (u3.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") " : "") + (u3.rotate !== "none" ? "rotate(" + u3.rotate + ") " : "") + (u3.scale !== "none" ? "scale(" + u3.scale.split(" ").join(",") + ") " : "") + (u3[he2] !== "none" ? u3[he2] : "")), i3.scale = i3.rotate = i3.translate = "none"), w4 = no(e, t2.svg), t2.svg && (t2.uncache ? ($3 = e.getBBox(), l3 = t2.xOrigin - $3.x + "px " + (t2.yOrigin - $3.y) + "px", R4 = "") : R4 = !r && e.getAttribute("data-svg-origin"), ks(e, R4 || l3, !!R4 || t2.originIsAbsolute, t2.smooth !== false, w4)), y3 = t2.xOrigin || 0, S3 = t2.yOrigin || 0, w4 !== tn && (F3 = w4[0], M4 = w4[1], A4 = w4[2], N5 = w4[3], f4 = B3 = w4[4], h2 = I2 = w4[5], w4.length === 6 ? (c = Math.sqrt(F3 * F3 + M4 * M4), g4 = Math.sqrt(N5 * N5 + A4 * A4), _7 = F3 || M4 ? ei2(M4, F3) * zr : 0, b4 = A4 || N5 ? ei2(A4, N5) * zr + _7 : 0, b4 && (g4 *= Math.abs(Math.cos(b4 * hi))), t2.svg && (f4 -= y3 - (y3 * F3 + S3 * A4), h2 -= S3 - (y3 * M4 + S3 * N5))) : (Fe2 = w4[6], ke3 = w4[7], p3 = w4[8], j3 = w4[9], se3 = w4[10], ae3 = w4[11], f4 = w4[12], h2 = w4[13], d2 = w4[14], C4 = ei2(Fe2, se3), m3 = C4 * zr, C4 && (k3 = Math.cos(-C4), O3 = Math.sin(-C4), R4 = B3 * k3 + p3 * O3, $3 = I2 * k3 + j3 * O3, X4 = Fe2 * k3 + se3 * O3, p3 = B3 * -O3 + p3 * k3, j3 = I2 * -O3 + j3 * k3, se3 = Fe2 * -O3 + se3 * k3, ae3 = ke3 * -O3 + ae3 * k3, B3 = R4, I2 = $3, Fe2 = X4), C4 = ei2(-A4, se3), T2 = C4 * zr, C4 && (k3 = Math.cos(-C4), O3 = Math.sin(-C4), R4 = F3 * k3 - p3 * O3, $3 = M4 * k3 - j3 * O3, X4 = A4 * k3 - se3 * O3, ae3 = N5 * O3 + ae3 * k3, F3 = R4, M4 = $3, A4 = X4), C4 = ei2(M4, F3), _7 = C4 * zr, C4 && (k3 = Math.cos(C4), O3 = Math.sin(C4), R4 = F3 * k3 + M4 * O3, $3 = B3 * k3 + I2 * O3, M4 = M4 * k3 - F3 * O3, I2 = I2 * k3 - B3 * O3, F3 = R4, B3 = $3), m3 && Math.abs(m3) + Math.abs(_7) > 359.9 && (m3 = _7 = 0, T2 = 180 - T2), c = ve2(Math.sqrt(F3 * F3 + M4 * M4 + A4 * A4)), g4 = ve2(Math.sqrt(I2 * I2 + Fe2 * Fe2)), C4 = ei2(B3, I2), b4 = Math.abs(C4) > 2e-4 ? C4 * zr : 0, v3 = ae3 ? 1 / (ae3 < 0 ? -ae3 : ae3) : 0), t2.svg && (R4 = e.getAttribute("transform"), t2.forceCSS = e.setAttribute("transform", "") || !Ja(At2(e, he2)), R4 && e.setAttribute("transform", R4))), Math.abs(b4) > 90 && Math.abs(b4) < 270 && (n3 ? (c *= -1, b4 += _7 <= 0 ? 180 : -180, _7 += _7 <= 0 ? 180 : -180) : (g4 *= -1, b4 += b4 <= 0 ? 180 : -180)), r = r || t2.uncache, t2.x = f4 - ((t2.xPercent = f4 && (!r && t2.xPercent || (Math.round(e.offsetWidth / 2) === Math.round(-f4) ? -50 : 0))) ? e.offsetWidth * t2.xPercent / 100 : 0) + s3, t2.y = h2 - ((t2.yPercent = h2 && (!r && t2.yPercent || (Math.round(e.offsetHeight / 2) === Math.round(-h2) ? -50 : 0))) ? e.offsetHeight * t2.yPercent / 100 : 0) + s3, t2.z = d2 + s3, t2.scaleX = ve2(c), t2.scaleY = ve2(g4), t2.rotation = ve2(_7) + o2, t2.rotationX = ve2(m3) + o2, t2.rotationY = ve2(T2) + o2, t2.skewX = b4 + o2, t2.skewY = P3 + o2, t2.transformPerspective = v3 + s3, (t2.zOrigin = parseFloat(l3.split(" ")[2]) || !r && t2.zOrigin || 0) && (i3[ct2] = In(l3)), t2.xOffset = t2.yOffset = 0, t2.force3D = Tt2.force3D, t2.renderTransform = t2.svg ? nf : Qa ? eu : rf, t2.uncache = 0, t2;
  };
  var In = function(e) {
    return (e = e.split(" "))[0] + " " + e[1];
  };
  var is = function(e, r, t2) {
    var i3 = qe2(r);
    return ve2(parseFloat(r) + parseFloat(Sr(e, "x", t2 + "px", i3))) + i3;
  };
  var rf = function(e, r) {
    r.z = "0px", r.rotationY = r.rotationX = "0deg", r.force3D = 0, eu(e, r);
  };
  var Ar = "0deg";
  var Pi = "0px";
  var Rr = ") ";
  var eu = function(e, r) {
    var t2 = r || this, i3 = t2.xPercent, n3 = t2.yPercent, s3 = t2.x, o2 = t2.y, u3 = t2.z, l3 = t2.rotation, f4 = t2.rotationY, h2 = t2.rotationX, d2 = t2.skewX, c = t2.skewY, g4 = t2.scaleX, _7 = t2.scaleY, m3 = t2.transformPerspective, T2 = t2.force3D, b4 = t2.target, P3 = t2.zOrigin, v3 = "", y3 = T2 === "auto" && e && e !== 1 || T2 === true;
    if (P3 && (h2 !== Ar || f4 !== Ar)) {
      var S3 = parseFloat(f4) * hi, w4 = Math.sin(S3), C4 = Math.cos(S3), k3;
      S3 = parseFloat(h2) * hi, k3 = Math.cos(S3), s3 = is(b4, s3, w4 * k3 * -P3), o2 = is(b4, o2, -Math.sin(S3) * -P3), u3 = is(b4, u3, C4 * k3 * -P3 + P3);
    }
    m3 !== Pi && (v3 += "perspective(" + m3 + Rr), (i3 || n3) && (v3 += "translate(" + i3 + "%, " + n3 + "%) "), (y3 || s3 !== Pi || o2 !== Pi || u3 !== Pi) && (v3 += u3 !== Pi || y3 ? "translate3d(" + s3 + ", " + o2 + ", " + u3 + ") " : "translate(" + s3 + ", " + o2 + Rr), l3 !== Ar && (v3 += "rotate(" + l3 + Rr), f4 !== Ar && (v3 += "rotateY(" + f4 + Rr), h2 !== Ar && (v3 += "rotateX(" + h2 + Rr), (d2 !== Ar || c !== Ar) && (v3 += "skew(" + d2 + ", " + c + Rr), (g4 !== 1 || _7 !== 1) && (v3 += "scale(" + g4 + ", " + _7 + Rr), b4.style[he2] = v3 || "translate(0, 0)";
  };
  var nf = function(e, r) {
    var t2 = r || this, i3 = t2.xPercent, n3 = t2.yPercent, s3 = t2.x, o2 = t2.y, u3 = t2.rotation, l3 = t2.skewX, f4 = t2.skewY, h2 = t2.scaleX, d2 = t2.scaleY, c = t2.target, g4 = t2.xOrigin, _7 = t2.yOrigin, m3 = t2.xOffset, T2 = t2.yOffset, b4 = t2.forceCSS, P3 = parseFloat(s3), v3 = parseFloat(o2), y3, S3, w4, C4, k3;
    u3 = parseFloat(u3), l3 = parseFloat(l3), f4 = parseFloat(f4), f4 && (f4 = parseFloat(f4), l3 += f4, u3 += f4), u3 || l3 ? (u3 *= hi, l3 *= hi, y3 = Math.cos(u3) * h2, S3 = Math.sin(u3) * h2, w4 = Math.sin(u3 - l3) * -d2, C4 = Math.cos(u3 - l3) * d2, l3 && (f4 *= hi, k3 = Math.tan(l3 - f4), k3 = Math.sqrt(1 + k3 * k3), w4 *= k3, C4 *= k3, f4 && (k3 = Math.tan(f4), k3 = Math.sqrt(1 + k3 * k3), y3 *= k3, S3 *= k3)), y3 = ve2(y3), S3 = ve2(S3), w4 = ve2(w4), C4 = ve2(C4)) : (y3 = h2, C4 = d2, S3 = w4 = 0), (P3 && !~(s3 + "").indexOf("px") || v3 && !~(o2 + "").indexOf("px")) && (P3 = Sr(c, "x", s3, "px"), v3 = Sr(c, "y", o2, "px")), (g4 || _7 || m3 || T2) && (P3 = ve2(P3 + g4 - (g4 * y3 + _7 * w4) + m3), v3 = ve2(v3 + _7 - (g4 * S3 + _7 * C4) + T2)), (i3 || n3) && (k3 = c.getBBox(), P3 = ve2(P3 + i3 / 100 * k3.width), v3 = ve2(v3 + n3 / 100 * k3.height)), k3 = "matrix(" + y3 + "," + S3 + "," + w4 + "," + C4 + "," + P3 + "," + v3 + ")", c.setAttribute("transform", k3), b4 && (c.style[he2] = k3);
  };
  var sf = function(e, r, t2, i3, n3) {
    var s3 = 360, o2 = ze2(n3), u3 = parseFloat(n3) * (o2 && ~n3.indexOf("rad") ? zr : 1), l3 = u3 - i3, f4 = i3 + l3 + "deg", h2, d2;
    return o2 && (h2 = n3.split("_")[1], h2 === "short" && (l3 %= s3, l3 !== l3 % (s3 / 2) && (l3 += l3 < 0 ? s3 : -s3)), h2 === "cw" && l3 < 0 ? l3 = (l3 + s3 * Co) % s3 - ~~(l3 / s3) * s3 : h2 === "ccw" && l3 > 0 && (l3 = (l3 - s3 * Co) % s3 - ~~(l3 / s3) * s3)), e._pt = d2 = new ft2(e._pt, r, t2, i3, l3, Wl), d2.e = f4, d2.u = "deg", e._props.push(t2), d2;
  };
  var Ao = function(e, r) {
    for (var t2 in r) e[t2] = r[t2];
    return e;
  };
  var of = function(e, r, t2) {
    var i3 = Ao({}, t2._gsap), n3 = "perspective,force3D,transformOrigin,svgOrigin", s3 = t2.style, o2, u3, l3, f4, h2, d2, c, g4;
    i3.svg ? (l3 = t2.getAttribute("transform"), t2.setAttribute("transform", ""), s3[he2] = r, o2 = rn(t2, 1), Gr(t2, he2), t2.setAttribute("transform", l3)) : (l3 = getComputedStyle(t2)[he2], s3[he2] = r, o2 = rn(t2, 1), s3[he2] = l3);
    for (u3 in ar) l3 = i3[u3], f4 = o2[u3], l3 !== f4 && n3.indexOf(u3) < 0 && (c = qe2(l3), g4 = qe2(f4), h2 = c !== g4 ? Sr(t2, u3, l3, g4) : parseFloat(l3), d2 = parseFloat(f4), e._pt = new ft2(e._pt, o2, u3, h2, d2 - h2, Ts), e._pt.u = g4 || 0, e._props.push(u3));
    Ao(o2, i3);
  };
  lt2("padding,margin,Width,Radius", function(a20, e) {
    var r = "Top", t2 = "Right", i3 = "Bottom", n3 = "Left", s3 = (e < 3 ? [r, t2, i3, n3] : [r + n3, r + t2, i3 + t2, i3 + n3]).map(function(o2) {
      return e < 2 ? a20 + o2 : "border" + o2 + a20;
    });
    Nn[e > 1 ? "border" + a20 : a20] = function(o2, u3, l3, f4, h2) {
      var d2, c;
      if (arguments.length < 4) return d2 = s3.map(function(g4) {
        return rr(o2, g4, l3);
      }), c = d2.join(" "), c.split(d2[0]).length === 5 ? d2[0] : c;
      d2 = (f4 + "").split(" "), c = {}, s3.forEach(function(g4, _7) {
        return c[g4] = d2[_7] = d2[_7] || d2[(_7 - 1) / 2 | 0];
      }), o2.init(u3, c, h2);
    };
  });
  var so = { name: "css", register: Cs, targetTest: function(e) {
    return e.style && e.nodeType;
  }, init: function(e, r, t2, i3, n3) {
    var s3 = this._props, o2 = e.style, u3 = t2.vars.startAt, l3, f4, h2, d2, c, g4, _7, m3, T2, b4, P3, v3, y3, S3, w4, C4;
    to || Cs(), this.styles = this.styles || qa(e), C4 = this.styles.props, this.tween = t2;
    for (_7 in r) if (_7 !== "autoRound" && (f4 = r[_7], !(yt2[_7] && Na(_7, r, t2, i3, e, n3)))) {
      if (c = typeof f4, g4 = Nn[_7], c === "function" && (f4 = f4.call(t2, i3, e, n3), c = typeof f4), c === "string" && ~f4.indexOf("random(") && (f4 = Zi(f4)), g4) g4(this, e, _7, f4, t2) && (w4 = 1);
      else if (_7.substr(0, 2) === "--") l3 = (getComputedStyle(e).getPropertyValue(_7) + "").trim(), f4 += "", wr.lastIndex = 0, wr.test(l3) || (m3 = qe2(l3), T2 = qe2(f4)), T2 ? m3 !== T2 && (l3 = Sr(e, _7, l3, T2) + T2) : m3 && (f4 += m3), this.add(o2, "setProperty", l3, f4, i3, n3, 0, 0, _7), s3.push(_7), C4.push(_7, 0, o2[_7]);
      else if (c !== "undefined") {
        if (u3 && _7 in u3 ? (l3 = typeof u3[_7] == "function" ? u3[_7].call(t2, i3, e, n3) : u3[_7], ze2(l3) && ~l3.indexOf("random(") && (l3 = Zi(l3)), qe2(l3 + "") || l3 === "auto" || (l3 += Tt2.units[_7] || qe2(rr(e, _7)) || ""), (l3 + "").charAt(1) === "=" && (l3 = rr(e, _7))) : l3 = rr(e, _7), d2 = parseFloat(l3), b4 = c === "string" && f4.charAt(1) === "=" && f4.substr(0, 2), b4 && (f4 = f4.substr(2)), h2 = parseFloat(f4), _7 in Gt2 && (_7 === "autoAlpha" && (d2 === 1 && rr(e, "visibility") === "hidden" && h2 && (d2 = 0), C4.push("visibility", 0, o2.visibility), mr(this, o2, "visibility", d2 ? "inherit" : "hidden", h2 ? "inherit" : "hidden", !h2)), _7 !== "scale" && _7 !== "transform" && (_7 = Gt2[_7], ~_7.indexOf(",") && (_7 = _7.split(",")[0]))), P3 = _7 in ar, P3) {
          if (this.styles.save(_7), c === "string" && f4.substring(0, 6) === "var(--" && (f4 = At2(e, f4.substring(4, f4.indexOf(")"))), h2 = parseFloat(f4)), v3 || (y3 = e._gsap, y3.renderTransform && !r.parseTransform || rn(e, r.parseTransform), S3 = r.smoothOrigin !== false && y3.smooth, v3 = this._pt = new ft2(this._pt, o2, he2, 0, 1, y3.renderTransform, y3, 0, -1), v3.dep = 1), _7 === "scale") this._pt = new ft2(this._pt, y3, "scaleY", y3.scaleY, (b4 ? fi(y3.scaleY, b4 + h2) : h2) - y3.scaleY || 0, Ts), this._pt.u = 0, s3.push("scaleY", _7), _7 += "X";
          else if (_7 === "transformOrigin") {
            C4.push(ct2, 0, o2[ct2]), f4 = ef(f4), y3.svg ? ks(e, f4, 0, S3, 0, this) : (T2 = parseFloat(f4.split(" ")[2]) || 0, T2 !== y3.zOrigin && mr(this, y3, "zOrigin", y3.zOrigin, T2), mr(this, o2, _7, In(l3), In(f4)));
            continue;
          } else if (_7 === "svgOrigin") {
            ks(e, f4, 1, S3, 0, this);
            continue;
          } else if (_7 in Za) {
            sf(this, y3, _7, d2, b4 ? fi(d2, b4 + f4) : f4);
            continue;
          } else if (_7 === "smoothOrigin") {
            mr(this, y3, "smooth", y3.smooth, f4);
            continue;
          } else if (_7 === "force3D") {
            y3[_7] = f4;
            continue;
          } else if (_7 === "transform") {
            of(this, f4, e);
            continue;
          }
        } else _7 in o2 || (_7 = wi(_7) || _7);
        if (P3 || (h2 || h2 === 0) && (d2 || d2 === 0) && !Yl.test(f4) && _7 in o2) m3 = (l3 + "").substr((d2 + "").length), h2 || (h2 = 0), T2 = qe2(f4) || (_7 in Tt2.units ? Tt2.units[_7] : m3), m3 !== T2 && (d2 = Sr(e, _7, l3, T2)), this._pt = new ft2(this._pt, P3 ? y3 : o2, _7, d2, (b4 ? fi(d2, b4 + h2) : h2) - d2, !P3 && (T2 === "px" || _7 === "zIndex") && r.autoRound !== false ? Vl : Ts), this._pt.u = T2 || 0, m3 !== T2 && T2 !== "%" && (this._pt.b = l3, this._pt.r = Xl);
        else if (_7 in o2) Jl.call(this, e, _7, l3, b4 ? b4 + f4 : f4);
        else if (_7 in e) this.add(e, _7, l3 || e[_7], b4 ? b4 + f4 : f4, i3, n3);
        else if (_7 !== "parseTransform") {
          Us(_7, f4);
          continue;
        }
        P3 || (_7 in o2 ? C4.push(_7, 0, o2[_7]) : typeof e[_7] == "function" ? C4.push(_7, 2, e[_7]()) : C4.push(_7, 1, l3 || e[_7])), s3.push(_7);
      }
    }
    w4 && Va(this);
  }, render: function(e, r) {
    if (r.tween._time || !ro()) for (var t2 = r._pt; t2; ) t2.r(e, t2.d), t2 = t2._next;
    else r.styles.revert();
  }, get: rr, aliases: Gt2, getSetter: function(e, r, t2) {
    var i3 = Gt2[r];
    return i3 && i3.indexOf(",") < 0 && (r = i3), r in ar && r !== ct2 && (e._gsap.x || rr(e, "x")) ? t2 && So === t2 ? r === "scale" ? Hl : Gl : (So = t2 || {}) && (r === "scale" ? ql : Ql) : e.style && !Xs(e.style[r]) ? $l : ~r.indexOf("-") ? Ul : Js(e, r);
  }, core: { _removeProperty: Gr, _getMatrix: no } };
  ht2.utils.checkPrefix = wi;
  ht2.core.getStyleSaver = qa;
  (function(a20, e, r, t2) {
    var i3 = lt2(a20 + "," + e + "," + r, function(n3) {
      ar[n3] = 1;
    });
    lt2(e, function(n3) {
      Tt2.units[n3] = "deg", Za[n3] = 1;
    }), Gt2[i3[13]] = a20 + "," + e, lt2(t2, function(n3) {
      var s3 = n3.split(":");
      Gt2[s3[1]] = i3[s3[0]];
    });
  })("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");
  lt2("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function(a20) {
    Tt2.units[a20] = "px";
  });
  ht2.registerPlugin(so);
  var Ps = ht2.registerPlugin(so) || ht2;
  var af = Ps.core.Tween;
  var Df = Object.freeze(Object.defineProperty({ __proto__: null, Back: Al, Bounce: zl, CSSPlugin: so, Circ: Nl, Cubic: Pl, Elastic: Dl, Expo: Ll, Linear: Cl, Power0: xl, Power1: wl, Power2: bl, Power3: Tl, Power4: Sl, Quad: kl, Quart: Ol, Quint: Ml, Sine: Fl, SteppedEase: Rl, Strong: El, TimelineLite: Ie2, TimelineMax: Ie2, TweenLite: xe2, TweenMax: af, default: Ps, gsap: Ps }, Symbol.toStringTag, { value: "Module" }));
  function uf(a20, e) {
    for (var r = 0; r < e.length; r++) {
      var t2 = e[r];
      t2.enumerable = t2.enumerable || false, t2.configurable = true, "value" in t2 && (t2.writable = true), Object.defineProperty(a20, t2.key, t2);
    }
  }
  function lf(a20, e, r) {
    return e && uf(a20.prototype, e), a20;
  }
  var Be2;
  var kn;
  var wt2;
  var yr;
  var vr;
  var _i;
  var tu;
  var Fr;
  var Wi;
  var ru;
  var nr;
  var Bt2;
  var iu;
  var nu = function() {
    return Be2 || typeof window < "u" && (Be2 = window.gsap) && Be2.registerPlugin && Be2;
  };
  var su = 1;
  var li = [];
  var H2 = [];
  var qt2 = [];
  var Xi = Date.now;
  var Os = function(e, r) {
    return r;
  };
  var ff = function() {
    var e = Wi.core, r = e.bridge || {}, t2 = e._scrollers, i3 = e._proxies;
    t2.push.apply(t2, H2), i3.push.apply(i3, qt2), H2 = t2, qt2 = i3, Os = function(s3, o2) {
      return r[s3](o2);
    };
  };
  var br = function(e, r) {
    return ~qt2.indexOf(e) && qt2[qt2.indexOf(e) + 1][r];
  };
  var Vi = function(e) {
    return !!~ru.indexOf(e);
  };
  var et2 = function(e, r, t2, i3, n3) {
    return e.addEventListener(r, t2, { passive: i3 !== false, capture: !!n3 });
  };
  var Je2 = function(e, r, t2, i3) {
    return e.removeEventListener(r, t2, !!i3);
  };
  var cn = "scrollLeft";
  var hn = "scrollTop";
  var Ms = function() {
    return nr && nr.isPressed || H2.cache++;
  };
  var Bn = function(e, r) {
    var t2 = function i3(n3) {
      if (n3 || n3 === 0) {
        su && (wt2.history.scrollRestoration = "manual");
        var s3 = nr && nr.isPressed;
        n3 = i3.v = Math.round(n3) || (nr && nr.iOS ? 1 : 0), e(n3), i3.cacheID = H2.cache, s3 && Os("ss", n3);
      } else (r || H2.cache !== i3.cacheID || Os("ref")) && (i3.cacheID = H2.cache, i3.v = e());
      return i3.v + i3.offset;
    };
    return t2.offset = 0, e && t2;
  };
  var nt2 = { s: cn, p: "left", p2: "Left", os: "right", os2: "Right", d: "width", d2: "Width", a: "x", sc: Bn(function(a20) {
    return arguments.length ? wt2.scrollTo(a20, Me2.sc()) : wt2.pageXOffset || yr[cn] || vr[cn] || _i[cn] || 0;
  }) };
  var Me2 = { s: hn, p: "top", p2: "Top", os: "bottom", os2: "Bottom", d: "height", d2: "Height", a: "y", op: nt2, sc: Bn(function(a20) {
    return arguments.length ? wt2.scrollTo(nt2.sc(), a20) : wt2.pageYOffset || yr[hn] || vr[hn] || _i[hn] || 0;
  }) };
  var at2 = function(e, r) {
    return (r && r._ctx && r._ctx.selector || Be2.utils.toArray)(e)[0] || (typeof e == "string" && Be2.config().nullTargetWarn !== false ? console.warn("Element not found:", e) : null);
  };
  var cf = function(e, r) {
    for (var t2 = r.length; t2--; ) if (r[t2] === e || r[t2].contains(e)) return true;
    return false;
  };
  var Cr = function(e, r) {
    var t2 = r.s, i3 = r.sc;
    Vi(e) && (e = yr.scrollingElement || vr);
    var n3 = H2.indexOf(e), s3 = i3 === Me2.sc ? 1 : 2;
    !~n3 && (n3 = H2.push(e) - 1), H2[n3 + s3] || et2(e, "scroll", Ms);
    var o2 = H2[n3 + s3], u3 = o2 || (H2[n3 + s3] = Bn(br(e, t2), true) || (Vi(e) ? i3 : Bn(function(l3) {
      return arguments.length ? e[t2] = l3 : e[t2];
    })));
    return u3.target = e, o2 || (u3.smooth = Be2.getProperty(e, "scrollBehavior") === "smooth"), u3;
  };
  var Es = function(e, r, t2) {
    var i3 = e, n3 = e, s3 = Xi(), o2 = s3, u3 = r || 50, l3 = Math.max(500, u3 * 3), f4 = function(g4, _7) {
      var m3 = Xi();
      _7 || m3 - s3 > u3 ? (n3 = i3, i3 = g4, o2 = s3, s3 = m3) : t2 ? i3 += g4 : i3 = n3 + (g4 - n3) / (m3 - o2) * (s3 - o2);
    }, h2 = function() {
      n3 = i3 = t2 ? 0 : i3, o2 = s3 = 0;
    }, d2 = function(g4) {
      var _7 = o2, m3 = n3, T2 = Xi();
      return (g4 || g4 === 0) && g4 !== i3 && f4(g4), s3 === o2 || T2 - o2 > l3 ? 0 : (i3 + (t2 ? m3 : -m3)) / ((t2 ? T2 : s3) - _7) * 1e3;
    };
    return { update: f4, reset: h2, getVelocity: d2 };
  };
  var Oi = function(e, r) {
    return r && !e._gsapAllow && e.preventDefault(), e.changedTouches ? e.changedTouches[0] : e;
  };
  var Ro = function(e) {
    var r = Math.max.apply(Math, e), t2 = Math.min.apply(Math, e);
    return Math.abs(r) >= Math.abs(t2) ? r : t2;
  };
  var ou = function() {
    Wi = Be2.core.globals().ScrollTrigger, Wi && Wi.core && ff();
  };
  var au = function(e) {
    return Be2 = e || nu(), !kn && Be2 && typeof document < "u" && document.body && (wt2 = window, yr = document, vr = yr.documentElement, _i = yr.body, ru = [wt2, yr, vr, _i], Be2.utils.clamp, iu = Be2.core.context || function() {
    }, Fr = "onpointerenter" in _i ? "pointer" : "mouse", tu = we2.isTouch = wt2.matchMedia && wt2.matchMedia("(hover: none), (pointer: coarse)").matches ? 1 : "ontouchstart" in wt2 || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0 ? 2 : 0, Bt2 = we2.eventTypes = ("ontouchstart" in vr ? "touchstart,touchmove,touchcancel,touchend" : "onpointerdown" in vr ? "pointerdown,pointermove,pointercancel,pointerup" : "mousedown,mousemove,mouseup,mouseup").split(","), setTimeout(function() {
      return su = 0;
    }, 500), ou(), kn = 1), kn;
  };
  nt2.op = Me2;
  H2.cache = 0;
  var we2 = (function() {
    function a20(r) {
      this.init(r);
    }
    var e = a20.prototype;
    return e.init = function(t2) {
      kn || au(Be2) || console.warn("Please gsap.registerPlugin(Observer)"), Wi || ou();
      var i3 = t2.tolerance, n3 = t2.dragMinimum, s3 = t2.type, o2 = t2.target, u3 = t2.lineHeight, l3 = t2.debounce, f4 = t2.preventDefault, h2 = t2.onStop, d2 = t2.onStopDelay, c = t2.ignore, g4 = t2.wheelSpeed, _7 = t2.event, m3 = t2.onDragStart, T2 = t2.onDragEnd, b4 = t2.onDrag, P3 = t2.onPress, v3 = t2.onRelease, y3 = t2.onRight, S3 = t2.onLeft, w4 = t2.onUp, C4 = t2.onDown, k3 = t2.onChangeX, O3 = t2.onChangeY, F3 = t2.onChange, M4 = t2.onToggleX, A4 = t2.onToggleY, N5 = t2.onHover, B3 = t2.onHoverEnd, I2 = t2.onMove, R4 = t2.ignoreCheck, $3 = t2.isNormalizer, X4 = t2.onGestureStart, p3 = t2.onGestureEnd, j3 = t2.onWheel, se3 = t2.onEnable, ke3 = t2.onDisable, ae3 = t2.onClick, Fe2 = t2.scrollSpeed, We2 = t2.capture, be2 = t2.allowClicks, Ke2 = t2.lockAxis, Xe3 = t2.onLockAxis;
      this.target = o2 = at2(o2) || vr, this.vars = t2, c && (c = Be2.utils.toArray(c)), i3 = i3 || 1e-9, n3 = n3 || 0, g4 = g4 || 1, Fe2 = Fe2 || 1, s3 = s3 || "wheel,touch,pointer", l3 = l3 !== false, u3 || (u3 = parseFloat(wt2.getComputedStyle(_i).lineHeight) || 22);
      var ur, Ze2, st2, J3, ge3, ot2, _t2, x4 = this, dt2 = 0, jt2 = 0, lr = t2.passive || !f4 && t2.passive !== false, _e3 = Cr(o2, nt2), Kt2 = Cr(o2, Me2), fr = _e3(), Pr = Kt2(), Ee3 = ~s3.indexOf("touch") && !~s3.indexOf("pointer") && Bt2[0] === "pointerdown", cr = Vi(o2), me3 = o2.ownerDocument || yr, zt2 = [0, 0, 0], kt2 = [0, 0, 0], Zt2 = 0, Ti = function() {
        return Zt2 = Xi();
      }, Te3 = function(L2, ee3) {
        return (x4.event = L2) && c && cf(L2.target, c) || ee3 && Ee3 && L2.pointerType !== "touch" || R4 && R4(L2, ee3);
      }, an = function() {
        x4._vx.reset(), x4._vy.reset(), Ze2.pause(), h2 && h2(x4);
      }, Jt2 = function() {
        var L2 = x4.deltaX = Ro(zt2), ee3 = x4.deltaY = Ro(kt2), E5 = Math.abs(L2) >= i3, Y5 = Math.abs(ee3) >= i3;
        F3 && (E5 || Y5) && F3(x4, L2, ee3, zt2, kt2), E5 && (y3 && x4.deltaX > 0 && y3(x4), S3 && x4.deltaX < 0 && S3(x4), k3 && k3(x4), M4 && x4.deltaX < 0 != dt2 < 0 && M4(x4), dt2 = x4.deltaX, zt2[0] = zt2[1] = zt2[2] = 0), Y5 && (C4 && x4.deltaY > 0 && C4(x4), w4 && x4.deltaY < 0 && w4(x4), O3 && O3(x4), A4 && x4.deltaY < 0 != jt2 < 0 && A4(x4), jt2 = x4.deltaY, kt2[0] = kt2[1] = kt2[2] = 0), (J3 || st2) && (I2 && I2(x4), st2 && (m3 && st2 === 1 && m3(x4), b4 && b4(x4), st2 = 0), J3 = false), ot2 && !(ot2 = false) && Xe3 && Xe3(x4), ge3 && (j3(x4), ge3 = false), ur = 0;
      }, Kr = function(L2, ee3, E5) {
        zt2[E5] += L2, kt2[E5] += ee3, x4._vx.update(L2), x4._vy.update(ee3), l3 ? ur || (ur = requestAnimationFrame(Jt2)) : Jt2();
      }, Zr = function(L2, ee3) {
        Ke2 && !_t2 && (x4.axis = _t2 = Math.abs(L2) > Math.abs(ee3) ? "x" : "y", ot2 = true), _t2 !== "y" && (zt2[2] += L2, x4._vx.update(L2, true)), _t2 !== "x" && (kt2[2] += ee3, x4._vy.update(ee3, true)), l3 ? ur || (ur = requestAnimationFrame(Jt2)) : Jt2();
      }, hr = function(L2) {
        if (!Te3(L2, 1)) {
          L2 = Oi(L2, f4);
          var ee3 = L2.clientX, E5 = L2.clientY, Y5 = ee3 - x4.x, z2 = E5 - x4.y, W5 = x4.isDragging;
          x4.x = ee3, x4.y = E5, (W5 || (Y5 || z2) && (Math.abs(x4.startX - ee3) >= n3 || Math.abs(x4.startY - E5) >= n3)) && (st2 = W5 ? 2 : 1, W5 || (x4.isDragging = true), Zr(Y5, z2));
        }
      }, Or = x4.onPress = function(V4) {
        Te3(V4, 1) || V4 && V4.button || (x4.axis = _t2 = null, Ze2.pause(), x4.isPressed = true, V4 = Oi(V4), dt2 = jt2 = 0, x4.startX = x4.x = V4.clientX, x4.startY = x4.y = V4.clientY, x4._vx.reset(), x4._vy.reset(), et2($3 ? o2 : me3, Bt2[1], hr, lr, true), x4.deltaX = x4.deltaY = 0, P3 && P3(x4));
      }, Q4 = x4.onRelease = function(V4) {
        if (!Te3(V4, 1)) {
          Je2($3 ? o2 : me3, Bt2[1], hr, true);
          var L2 = !isNaN(x4.y - x4.startY), ee3 = x4.isDragging, E5 = ee3 && (Math.abs(x4.x - x4.startX) > 3 || Math.abs(x4.y - x4.startY) > 3), Y5 = Oi(V4);
          !E5 && L2 && (x4._vx.reset(), x4._vy.reset(), f4 && be2 && Be2.delayedCall(0.08, function() {
            if (Xi() - Zt2 > 300 && !V4.defaultPrevented) {
              if (V4.target.click) V4.target.click();
              else if (me3.createEvent) {
                var z2 = me3.createEvent("MouseEvents");
                z2.initMouseEvent("click", true, true, wt2, 1, Y5.screenX, Y5.screenY, Y5.clientX, Y5.clientY, false, false, false, false, 0, null), V4.target.dispatchEvent(z2);
              }
            }
          })), x4.isDragging = x4.isGesturing = x4.isPressed = false, h2 && ee3 && !$3 && Ze2.restart(true), st2 && Jt2(), T2 && ee3 && T2(x4), v3 && v3(x4, E5);
        }
      }, Mr = function(L2) {
        return L2.touches && L2.touches.length > 1 && (x4.isGesturing = true) && X4(L2, x4.isDragging);
      }, Ft2 = function() {
        return (x4.isGesturing = false) || p3(x4);
      }, Lt2 = function(L2) {
        if (!Te3(L2)) {
          var ee3 = _e3(), E5 = Kt2();
          Kr((ee3 - fr) * Fe2, (E5 - Pr) * Fe2, 1), fr = ee3, Pr = E5, h2 && Ze2.restart(true);
        }
      }, Nt2 = function(L2) {
        if (!Te3(L2)) {
          L2 = Oi(L2, f4), j3 && (ge3 = true);
          var ee3 = (L2.deltaMode === 1 ? u3 : L2.deltaMode === 2 ? wt2.innerHeight : 1) * g4;
          Kr(L2.deltaX * ee3, L2.deltaY * ee3, 0), h2 && !$3 && Ze2.restart(true);
        }
      }, Er = function(L2) {
        if (!Te3(L2)) {
          var ee3 = L2.clientX, E5 = L2.clientY, Y5 = ee3 - x4.x, z2 = E5 - x4.y;
          x4.x = ee3, x4.y = E5, J3 = true, h2 && Ze2.restart(true), (Y5 || z2) && Zr(Y5, z2);
        }
      }, Jr = function(L2) {
        x4.event = L2, N5(x4);
      }, er = function(L2) {
        x4.event = L2, B3(x4);
      }, Si = function(L2) {
        return Te3(L2) || Oi(L2, f4) && ae3(x4);
      };
      Ze2 = x4._dc = Be2.delayedCall(d2 || 0.25, an).pause(), x4.deltaX = x4.deltaY = 0, x4._vx = Es(0, 50, true), x4._vy = Es(0, 50, true), x4.scrollX = _e3, x4.scrollY = Kt2, x4.isDragging = x4.isGesturing = x4.isPressed = false, iu(this), x4.enable = function(V4) {
        return x4.isEnabled || (et2(cr ? me3 : o2, "scroll", Ms), s3.indexOf("scroll") >= 0 && et2(cr ? me3 : o2, "scroll", Lt2, lr, We2), s3.indexOf("wheel") >= 0 && et2(o2, "wheel", Nt2, lr, We2), (s3.indexOf("touch") >= 0 && tu || s3.indexOf("pointer") >= 0) && (et2(o2, Bt2[0], Or, lr, We2), et2(me3, Bt2[2], Q4), et2(me3, Bt2[3], Q4), be2 && et2(o2, "click", Ti, true, true), ae3 && et2(o2, "click", Si), X4 && et2(me3, "gesturestart", Mr), p3 && et2(me3, "gestureend", Ft2), N5 && et2(o2, Fr + "enter", Jr), B3 && et2(o2, Fr + "leave", er), I2 && et2(o2, Fr + "move", Er)), x4.isEnabled = true, x4.isDragging = x4.isGesturing = x4.isPressed = J3 = st2 = false, x4._vx.reset(), x4._vy.reset(), fr = _e3(), Pr = Kt2(), V4 && V4.type && Or(V4), se3 && se3(x4)), x4;
      }, x4.disable = function() {
        x4.isEnabled && (li.filter(function(V4) {
          return V4 !== x4 && Vi(V4.target);
        }).length || Je2(cr ? me3 : o2, "scroll", Ms), x4.isPressed && (x4._vx.reset(), x4._vy.reset(), Je2($3 ? o2 : me3, Bt2[1], hr, true)), Je2(cr ? me3 : o2, "scroll", Lt2, We2), Je2(o2, "wheel", Nt2, We2), Je2(o2, Bt2[0], Or, We2), Je2(me3, Bt2[2], Q4), Je2(me3, Bt2[3], Q4), Je2(o2, "click", Ti, true), Je2(o2, "click", Si), Je2(me3, "gesturestart", Mr), Je2(me3, "gestureend", Ft2), Je2(o2, Fr + "enter", Jr), Je2(o2, Fr + "leave", er), Je2(o2, Fr + "move", Er), x4.isEnabled = x4.isPressed = x4.isDragging = false, ke3 && ke3(x4));
      }, x4.kill = x4.revert = function() {
        x4.disable();
        var V4 = li.indexOf(x4);
        V4 >= 0 && li.splice(V4, 1), nr === x4 && (nr = 0);
      }, li.push(x4), $3 && Vi(o2) && (nr = x4), x4.enable(_7);
    }, lf(a20, [{ key: "velocityX", get: function() {
      return this._vx.getVelocity();
    } }, { key: "velocityY", get: function() {
      return this._vy.getVelocity();
    } }]), a20;
  })();
  we2.version = "3.13.0";
  we2.create = function(a20) {
    return new we2(a20);
  };
  we2.register = au;
  we2.getAll = function() {
    return li.slice();
  };
  we2.getById = function(a20) {
    return li.filter(function(e) {
      return e.vars.id === a20;
    })[0];
  };
  nu() && Be2.registerPlugin(we2);
  var D;
  var si2;
  var G;
  var oe2;
  var vt2;
  var te2;
  var oo;
  var Yn;
  var nn;
  var $i;
  var Ri;
  var _n;
  var Ge2;
  var qn;
  var Ds;
  var rt2;
  var zo;
  var Fo;
  var oi;
  var uu;
  var ns;
  var lu;
  var tt2;
  var As;
  var fu;
  var cu;
  var dr;
  var Rs;
  var ao;
  var di;
  var uo;
  var Wn;
  var zs;
  var ss;
  var dn = 1;
  var He2 = Date.now;
  var os = He2();
  var Rt2 = 0;
  var zi = 0;
  var Lo = function(e, r, t2) {
    var i3 = mt2(e) && (e.substr(0, 6) === "clamp(" || e.indexOf("max") > -1);
    return t2["_" + r + "Clamp"] = i3, i3 ? e.substr(6, e.length - 7) : e;
  };
  var No = function(e, r) {
    return r && (!mt2(e) || e.substr(0, 6) !== "clamp(") ? "clamp(" + e + ")" : e;
  };
  var hf = function a15() {
    return zi && requestAnimationFrame(a15);
  };
  var Io = function() {
    return qn = 1;
  };
  var Bo = function() {
    return qn = 0;
  };
  var $t2 = function(e) {
    return e;
  };
  var Fi = function(e) {
    return Math.round(e * 1e5) / 1e5 || 0;
  };
  var hu = function() {
    return typeof window < "u";
  };
  var _u = function() {
    return D || hu() && (D = window.gsap) && D.registerPlugin && D;
  };
  var Hr = function(e) {
    return !!~oo.indexOf(e);
  };
  var du = function(e) {
    return (e === "Height" ? uo : G["inner" + e]) || vt2["client" + e] || te2["client" + e];
  };
  var pu = function(e) {
    return br(e, "getBoundingClientRect") || (Hr(e) ? function() {
      return Dn.width = G.innerWidth, Dn.height = uo, Dn;
    } : function() {
      return ir(e);
    });
  };
  var _f = function(e, r, t2) {
    var i3 = t2.d, n3 = t2.d2, s3 = t2.a;
    return (s3 = br(e, "getBoundingClientRect")) ? function() {
      return s3()[i3];
    } : function() {
      return (r ? du(n3) : e["client" + n3]) || 0;
    };
  };
  var df = function(e, r) {
    return !r || ~qt2.indexOf(e) ? pu(e) : function() {
      return Dn;
    };
  };
  var Ht2 = function(e, r) {
    var t2 = r.s, i3 = r.d2, n3 = r.d, s3 = r.a;
    return Math.max(0, (t2 = "scroll" + i3) && (s3 = br(e, t2)) ? s3() - pu(e)()[n3] : Hr(e) ? (vt2[t2] || te2[t2]) - du(i3) : e[t2] - e["offset" + i3]);
  };
  var pn = function(e, r) {
    for (var t2 = 0; t2 < oi.length; t2 += 3) (!r || ~r.indexOf(oi[t2 + 1])) && e(oi[t2], oi[t2 + 1], oi[t2 + 2]);
  };
  var mt2 = function(e) {
    return typeof e == "string";
  };
  var Qe2 = function(e) {
    return typeof e == "function";
  };
  var Li = function(e) {
    return typeof e == "number";
  };
  var Lr = function(e) {
    return typeof e == "object";
  };
  var Mi = function(e, r, t2) {
    return e && e.progress(r ? 0 : 1) && t2 && e.pause();
  };
  var as = function(e, r) {
    if (e.enabled) {
      var t2 = e._ctx ? e._ctx.add(function() {
        return r(e);
      }) : r(e);
      t2 && t2.totalTime && (e.callbackAnimation = t2);
    }
  };
  var ti2 = Math.abs;
  var gu = "left";
  var mu = "top";
  var lo = "right";
  var fo = "bottom";
  var Vr = "width";
  var $r = "height";
  var Ui = "Right";
  var Gi = "Left";
  var Hi = "Top";
  var qi = "Bottom";
  var Se2 = "padding";
  var Ot2 = "margin";
  var bi = "Width";
  var co = "Height";
  var Oe2 = "px";
  var Mt2 = function(e) {
    return G.getComputedStyle(e);
  };
  var pf = function(e) {
    var r = Mt2(e).position;
    e.style.position = r === "absolute" || r === "fixed" ? r : "relative";
  };
  var Yo = function(e, r) {
    for (var t2 in r) t2 in e || (e[t2] = r[t2]);
    return e;
  };
  var ir = function(e, r) {
    var t2 = r && Mt2(e)[Ds] !== "matrix(1, 0, 0, 1, 0, 0)" && D.to(e, { x: 0, y: 0, xPercent: 0, yPercent: 0, rotation: 0, rotationX: 0, rotationY: 0, scale: 1, skewX: 0, skewY: 0 }).progress(1), i3 = e.getBoundingClientRect();
    return t2 && t2.progress(0).kill(), i3;
  };
  var Xn = function(e, r) {
    var t2 = r.d2;
    return e["offset" + t2] || e["client" + t2] || 0;
  };
  var yu = function(e) {
    var r = [], t2 = e.labels, i3 = e.duration(), n3;
    for (n3 in t2) r.push(t2[n3] / i3);
    return r;
  };
  var gf = function(e) {
    return function(r) {
      return D.utils.snap(yu(e), r);
    };
  };
  var ho = function(e) {
    var r = D.utils.snap(e), t2 = Array.isArray(e) && e.slice(0).sort(function(i3, n3) {
      return i3 - n3;
    });
    return t2 ? function(i3, n3, s3) {
      s3 === void 0 && (s3 = 1e-3);
      var o2;
      if (!n3) return r(i3);
      if (n3 > 0) {
        for (i3 -= s3, o2 = 0; o2 < t2.length; o2++) if (t2[o2] >= i3) return t2[o2];
        return t2[o2 - 1];
      } else for (o2 = t2.length, i3 += s3; o2--; ) if (t2[o2] <= i3) return t2[o2];
      return t2[0];
    } : function(i3, n3, s3) {
      s3 === void 0 && (s3 = 1e-3);
      var o2 = r(i3);
      return !n3 || Math.abs(o2 - i3) < s3 || o2 - i3 < 0 == n3 < 0 ? o2 : r(n3 < 0 ? i3 - e : i3 + e);
    };
  };
  var mf = function(e) {
    return function(r, t2) {
      return ho(yu(e))(r, t2.direction);
    };
  };
  var gn = function(e, r, t2, i3) {
    return t2.split(",").forEach(function(n3) {
      return e(r, n3, i3);
    });
  };
  var Re2 = function(e, r, t2, i3, n3) {
    return e.addEventListener(r, t2, { passive: !i3, capture: !!n3 });
  };
  var Ae2 = function(e, r, t2, i3) {
    return e.removeEventListener(r, t2, !!i3);
  };
  var mn = function(e, r, t2) {
    t2 = t2 && t2.wheelHandler, t2 && (e(r, "wheel", t2), e(r, "touchmove", t2));
  };
  var Wo = { startColor: "green", endColor: "red", indent: 0, fontSize: "16px", fontWeight: "normal" };
  var yn = { toggleActions: "play", anticipatePin: 0 };
  var Vn = { top: 0, left: 0, center: 0.5, bottom: 1, right: 1 };
  var Pn = function(e, r) {
    if (mt2(e)) {
      var t2 = e.indexOf("="), i3 = ~t2 ? +(e.charAt(t2 - 1) + 1) * parseFloat(e.substr(t2 + 1)) : 0;
      ~t2 && (e.indexOf("%") > t2 && (i3 *= r / 100), e = e.substr(0, t2 - 1)), e = i3 + (e in Vn ? Vn[e] * r : ~e.indexOf("%") ? parseFloat(e) * r / 100 : parseFloat(e) || 0);
    }
    return e;
  };
  var vn = function(e, r, t2, i3, n3, s3, o2, u3) {
    var l3 = n3.startColor, f4 = n3.endColor, h2 = n3.fontSize, d2 = n3.indent, c = n3.fontWeight, g4 = oe2.createElement("div"), _7 = Hr(t2) || br(t2, "pinType") === "fixed", m3 = e.indexOf("scroller") !== -1, T2 = _7 ? te2 : t2, b4 = e.indexOf("start") !== -1, P3 = b4 ? l3 : f4, v3 = "border-color:" + P3 + ";font-size:" + h2 + ";color:" + P3 + ";font-weight:" + c + ";pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;";
    return v3 += "position:" + ((m3 || u3) && _7 ? "fixed;" : "absolute;"), (m3 || u3 || !_7) && (v3 += (i3 === Me2 ? lo : fo) + ":" + (s3 + parseFloat(d2)) + "px;"), o2 && (v3 += "box-sizing:border-box;text-align:left;width:" + o2.offsetWidth + "px;"), g4._isStart = b4, g4.setAttribute("class", "gsap-marker-" + e + (r ? " marker-" + r : "")), g4.style.cssText = v3, g4.innerText = r || r === 0 ? e + "-" + r : e, T2.children[0] ? T2.insertBefore(g4, T2.children[0]) : T2.appendChild(g4), g4._offset = g4["offset" + i3.op.d2], On(g4, 0, i3, b4), g4;
  };
  var On = function(e, r, t2, i3) {
    var n3 = { display: "block" }, s3 = t2[i3 ? "os2" : "p2"], o2 = t2[i3 ? "p2" : "os2"];
    e._isFlipped = i3, n3[t2.a + "Percent"] = i3 ? -100 : 0, n3[t2.a] = i3 ? "1px" : 0, n3["border" + s3 + bi] = 1, n3["border" + o2 + bi] = 0, n3[t2.p] = r + "px", D.set(e, n3);
  };
  var U = [];
  var Fs = {};
  var sn;
  var Xo = function() {
    return He2() - Rt2 > 34 && (sn || (sn = requestAnimationFrame(sr)));
  };
  var ri2 = function() {
    (!tt2 || !tt2.isPressed || tt2.startX > te2.clientWidth) && (H2.cache++, tt2 ? sn || (sn = requestAnimationFrame(sr)) : sr(), Rt2 || Qr("scrollStart"), Rt2 = He2());
  };
  var us = function() {
    cu = G.innerWidth, fu = G.innerHeight;
  };
  var Ni = function(e) {
    H2.cache++, (e === true || !Ge2 && !lu && !oe2.fullscreenElement && !oe2.webkitFullscreenElement && (!As || cu !== G.innerWidth || Math.abs(G.innerHeight - fu) > G.innerHeight * 0.25)) && Yn.restart(true);
  };
  var qr = {};
  var yf = [];
  var vu = function a16() {
    return Ae2(q4, "scrollEnd", a16) || Ir(true);
  };
  var Qr = function(e) {
    return qr[e] && qr[e].map(function(r) {
      return r();
    }) || yf;
  };
  var gt2 = [];
  var xu = function(e) {
    for (var r = 0; r < gt2.length; r += 5) (!e || gt2[r + 4] && gt2[r + 4].query === e) && (gt2[r].style.cssText = gt2[r + 1], gt2[r].getBBox && gt2[r].setAttribute("transform", gt2[r + 2] || ""), gt2[r + 3].uncache = 1);
  };
  var _o = function(e, r) {
    var t2;
    for (rt2 = 0; rt2 < U.length; rt2++) t2 = U[rt2], t2 && (!r || t2._ctx === r) && (e ? t2.kill(1) : t2.revert(true, true));
    Wn = true, r && xu(r), r || Qr("revert");
  };
  var wu = function(e, r) {
    H2.cache++, (r || !it2) && H2.forEach(function(t2) {
      return Qe2(t2) && t2.cacheID++ && (t2.rec = 0);
    }), mt2(e) && (G.history.scrollRestoration = ao = e);
  };
  var it2;
  var Ur = 0;
  var Vo;
  var vf = function() {
    if (Vo !== Ur) {
      var e = Vo = Ur;
      requestAnimationFrame(function() {
        return e === Ur && Ir(true);
      });
    }
  };
  var bu = function() {
    te2.appendChild(di), uo = !tt2 && di.offsetHeight || G.innerHeight, te2.removeChild(di);
  };
  var $o = function(e) {
    return nn(".gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end").forEach(function(r) {
      return r.style.display = e ? "none" : "block";
    });
  };
  var Ir = function(e, r) {
    if (vt2 = oe2.documentElement, te2 = oe2.body, oo = [G, oe2, vt2, te2], Rt2 && !e && !Wn) {
      Re2(q4, "scrollEnd", vu);
      return;
    }
    bu(), it2 = q4.isRefreshing = true, H2.forEach(function(i3) {
      return Qe2(i3) && ++i3.cacheID && (i3.rec = i3());
    });
    var t2 = Qr("refreshInit");
    uu && q4.sort(), r || _o(), H2.forEach(function(i3) {
      Qe2(i3) && (i3.smooth && (i3.target.style.scrollBehavior = "auto"), i3(0));
    }), U.slice(0).forEach(function(i3) {
      return i3.refresh();
    }), Wn = false, U.forEach(function(i3) {
      if (i3._subPinOffset && i3.pin) {
        var n3 = i3.vars.horizontal ? "offsetWidth" : "offsetHeight", s3 = i3.pin[n3];
        i3.revert(true, 1), i3.adjustPinSpacing(i3.pin[n3] - s3), i3.refresh();
      }
    }), zs = 1, $o(true), U.forEach(function(i3) {
      var n3 = Ht2(i3.scroller, i3._dir), s3 = i3.vars.end === "max" || i3._endClamp && i3.end > n3, o2 = i3._startClamp && i3.start >= n3;
      (s3 || o2) && i3.setPositions(o2 ? n3 - 1 : i3.start, s3 ? Math.max(o2 ? n3 : i3.start + 1, n3) : i3.end, true);
    }), $o(false), zs = 0, t2.forEach(function(i3) {
      return i3 && i3.render && i3.render(-1);
    }), H2.forEach(function(i3) {
      Qe2(i3) && (i3.smooth && requestAnimationFrame(function() {
        return i3.target.style.scrollBehavior = "smooth";
      }), i3.rec && i3(i3.rec));
    }), wu(ao, 1), Yn.pause(), Ur++, it2 = 2, sr(2), U.forEach(function(i3) {
      return Qe2(i3.vars.onRefresh) && i3.vars.onRefresh(i3);
    }), it2 = q4.isRefreshing = false, Qr("refresh");
  };
  var Ls = 0;
  var Mn = 1;
  var Qi;
  var sr = function(e) {
    if (e === 2 || !it2 && !Wn) {
      q4.isUpdating = true, Qi && Qi.update(0);
      var r = U.length, t2 = He2(), i3 = t2 - os >= 50, n3 = r && U[0].scroll();
      if (Mn = Ls > n3 ? -1 : 1, it2 || (Ls = n3), i3 && (Rt2 && !qn && t2 - Rt2 > 200 && (Rt2 = 0, Qr("scrollEnd")), Ri = os, os = t2), Mn < 0) {
        for (rt2 = r; rt2-- > 0; ) U[rt2] && U[rt2].update(0, i3);
        Mn = 1;
      } else for (rt2 = 0; rt2 < r; rt2++) U[rt2] && U[rt2].update(0, i3);
      q4.isUpdating = false;
    }
    sn = 0;
  };
  var Ns = [gu, mu, fo, lo, Ot2 + qi, Ot2 + Ui, Ot2 + Hi, Ot2 + Gi, "display", "flexShrink", "float", "zIndex", "gridColumnStart", "gridColumnEnd", "gridRowStart", "gridRowEnd", "gridArea", "justifySelf", "alignSelf", "placeSelf", "order"];
  var En = Ns.concat([Vr, $r, "boxSizing", "max" + bi, "max" + co, "position", Ot2, Se2, Se2 + Hi, Se2 + Ui, Se2 + qi, Se2 + Gi]);
  var xf = function(e, r, t2) {
    pi(t2);
    var i3 = e._gsap;
    if (i3.spacerIsNative) pi(i3.spacerState);
    else if (e._gsap.swappedIn) {
      var n3 = r.parentNode;
      n3 && (n3.insertBefore(e, r), n3.removeChild(r));
    }
    e._gsap.swappedIn = false;
  };
  var ls = function(e, r, t2, i3) {
    if (!e._gsap.swappedIn) {
      for (var n3 = Ns.length, s3 = r.style, o2 = e.style, u3; n3--; ) u3 = Ns[n3], s3[u3] = t2[u3];
      s3.position = t2.position === "absolute" ? "absolute" : "relative", t2.display === "inline" && (s3.display = "inline-block"), o2[fo] = o2[lo] = "auto", s3.flexBasis = t2.flexBasis || "auto", s3.overflow = "visible", s3.boxSizing = "border-box", s3[Vr] = Xn(e, nt2) + Oe2, s3[$r] = Xn(e, Me2) + Oe2, s3[Se2] = o2[Ot2] = o2[mu] = o2[gu] = "0", pi(i3), o2[Vr] = o2["max" + bi] = t2[Vr], o2[$r] = o2["max" + co] = t2[$r], o2[Se2] = t2[Se2], e.parentNode !== r && (e.parentNode.insertBefore(r, e), r.appendChild(e)), e._gsap.swappedIn = true;
    }
  };
  var wf = /([A-Z])/g;
  var pi = function(e) {
    if (e) {
      var r = e.t.style, t2 = e.length, i3 = 0, n3, s3;
      for ((e.t._gsap || D.core.getCache(e.t)).uncache = 1; i3 < t2; i3 += 2) s3 = e[i3 + 1], n3 = e[i3], s3 ? r[n3] = s3 : r[n3] && r.removeProperty(n3.replace(wf, "-$1").toLowerCase());
    }
  };
  var xn = function(e) {
    for (var r = En.length, t2 = e.style, i3 = [], n3 = 0; n3 < r; n3++) i3.push(En[n3], t2[En[n3]]);
    return i3.t = e, i3;
  };
  var bf = function(e, r, t2) {
    for (var i3 = [], n3 = e.length, s3 = t2 ? 8 : 0, o2; s3 < n3; s3 += 2) o2 = e[s3], i3.push(o2, o2 in r ? r[o2] : e[s3 + 1]);
    return i3.t = e.t, i3;
  };
  var Dn = { left: 0, top: 0 };
  var Uo = function(e, r, t2, i3, n3, s3, o2, u3, l3, f4, h2, d2, c, g4) {
    Qe2(e) && (e = e(u3)), mt2(e) && e.substr(0, 3) === "max" && (e = d2 + (e.charAt(4) === "=" ? Pn("0" + e.substr(3), t2) : 0));
    var _7 = c ? c.time() : 0, m3, T2, b4;
    if (c && c.seek(0), isNaN(e) || (e = +e), Li(e)) c && (e = D.utils.mapRange(c.scrollTrigger.start, c.scrollTrigger.end, 0, d2, e)), o2 && On(o2, t2, i3, true);
    else {
      Qe2(r) && (r = r(u3));
      var P3 = (e || "0").split(" "), v3, y3, S3, w4;
      b4 = at2(r, u3) || te2, v3 = ir(b4) || {}, (!v3 || !v3.left && !v3.top) && Mt2(b4).display === "none" && (w4 = b4.style.display, b4.style.display = "block", v3 = ir(b4), w4 ? b4.style.display = w4 : b4.style.removeProperty("display")), y3 = Pn(P3[0], v3[i3.d]), S3 = Pn(P3[1] || "0", t2), e = v3[i3.p] - l3[i3.p] - f4 + y3 + n3 - S3, o2 && On(o2, S3, i3, t2 - S3 < 20 || o2._isStart && S3 > 20), t2 -= t2 - S3;
    }
    if (g4 && (u3[g4] = e || -1e-3, e < 0 && (e = 0)), s3) {
      var C4 = e + t2, k3 = s3._isStart;
      m3 = "scroll" + i3.d2, On(s3, C4, i3, k3 && C4 > 20 || !k3 && (h2 ? Math.max(te2[m3], vt2[m3]) : s3.parentNode[m3]) <= C4 + 1), h2 && (l3 = ir(o2), h2 && (s3.style[i3.op.p] = l3[i3.op.p] - i3.op.m - s3._offset + Oe2));
    }
    return c && b4 && (m3 = ir(b4), c.seek(d2), T2 = ir(b4), c._caScrollDist = m3[i3.p] - T2[i3.p], e = e / c._caScrollDist * d2), c && c.seek(_7), c ? e : Math.round(e);
  };
  var Tf = /(webkit|moz|length|cssText|inset)/i;
  var Go = function(e, r, t2, i3) {
    if (e.parentNode !== r) {
      var n3 = e.style, s3, o2;
      if (r === te2) {
        e._stOrig = n3.cssText, o2 = Mt2(e);
        for (s3 in o2) !+s3 && !Tf.test(s3) && o2[s3] && typeof n3[s3] == "string" && s3 !== "0" && (n3[s3] = o2[s3]);
        n3.top = t2, n3.left = i3;
      } else n3.cssText = e._stOrig;
      D.core.getCache(e).uncache = 1, r.appendChild(e);
    }
  };
  var Tu = function(e, r, t2) {
    var i3 = r, n3 = i3;
    return function(s3) {
      var o2 = Math.round(e());
      return o2 !== i3 && o2 !== n3 && Math.abs(o2 - i3) > 3 && Math.abs(o2 - n3) > 3 && (s3 = o2, t2 && t2()), n3 = i3, i3 = Math.round(s3), i3;
    };
  };
  var wn = function(e, r, t2) {
    var i3 = {};
    i3[r.p] = "+=" + t2, D.set(e, i3);
  };
  var Ho = function(e, r) {
    var t2 = Cr(e, r), i3 = "_scroll" + r.p2, n3 = function s3(o2, u3, l3, f4, h2) {
      var d2 = s3.tween, c = u3.onComplete, g4 = {};
      l3 = l3 || t2();
      var _7 = Tu(t2, l3, function() {
        d2.kill(), s3.tween = 0;
      });
      return h2 = f4 && h2 || 0, f4 = f4 || o2 - l3, d2 && d2.kill(), u3[i3] = o2, u3.inherit = false, u3.modifiers = g4, g4[i3] = function() {
        return _7(l3 + f4 * d2.ratio + h2 * d2.ratio * d2.ratio);
      }, u3.onUpdate = function() {
        H2.cache++, s3.tween && sr();
      }, u3.onComplete = function() {
        s3.tween = 0, c && c.call(d2);
      }, d2 = s3.tween = D.to(e, u3), d2;
    };
    return e[i3] = t2, t2.wheelHandler = function() {
      return n3.tween && n3.tween.kill() && (n3.tween = 0);
    }, Re2(e, "wheel", t2.wheelHandler), q4.isTouch && Re2(e, "touchmove", t2.wheelHandler), n3;
  };
  var q4 = (function() {
    function a20(r, t2) {
      si2 || a20.register(D) || console.warn("Please gsap.registerPlugin(ScrollTrigger)"), Rs(this), this.init(r, t2);
    }
    var e = a20.prototype;
    return e.init = function(t2, i3) {
      if (this.progress = this.start = 0, this.vars && this.kill(true, true), !zi) {
        this.update = this.refresh = this.kill = $t2;
        return;
      }
      t2 = Yo(mt2(t2) || Li(t2) || t2.nodeType ? { trigger: t2 } : t2, yn);
      var n3 = t2, s3 = n3.onUpdate, o2 = n3.toggleClass, u3 = n3.id, l3 = n3.onToggle, f4 = n3.onRefresh, h2 = n3.scrub, d2 = n3.trigger, c = n3.pin, g4 = n3.pinSpacing, _7 = n3.invalidateOnRefresh, m3 = n3.anticipatePin, T2 = n3.onScrubComplete, b4 = n3.onSnapComplete, P3 = n3.once, v3 = n3.snap, y3 = n3.pinReparent, S3 = n3.pinSpacer, w4 = n3.containerAnimation, C4 = n3.fastScrollEnd, k3 = n3.preventOverlaps, O3 = t2.horizontal || t2.containerAnimation && t2.horizontal !== false ? nt2 : Me2, F3 = !h2 && h2 !== 0, M4 = at2(t2.scroller || G), A4 = D.core.getCache(M4), N5 = Hr(M4), B3 = ("pinType" in t2 ? t2.pinType : br(M4, "pinType") || N5 && "fixed") === "fixed", I2 = [t2.onEnter, t2.onLeave, t2.onEnterBack, t2.onLeaveBack], R4 = F3 && t2.toggleActions.split(" "), $3 = "markers" in t2 ? t2.markers : yn.markers, X4 = N5 ? 0 : parseFloat(Mt2(M4)["border" + O3.p2 + bi]) || 0, p3 = this, j3 = t2.onRefreshInit && function() {
        return t2.onRefreshInit(p3);
      }, se3 = _f(M4, N5, O3), ke3 = df(M4, N5), ae3 = 0, Fe2 = 0, We2 = 0, be2 = Cr(M4, O3), Ke2, Xe3, ur, Ze2, st2, J3, ge3, ot2, _t2, x4, dt2, jt2, lr, _e3, Kt2, fr, Pr, Ee3, cr, me3, zt2, kt2, Zt2, Ti, Te3, an, Jt2, Kr, Zr, hr, Or, Q4, Mr, Ft2, Lt2, Nt2, Er, Jr, er;
      if (p3._startClamp = p3._endClamp = false, p3._dir = O3, m3 *= 45, p3.scroller = M4, p3.scroll = w4 ? w4.time.bind(w4) : be2, Ze2 = be2(), p3.vars = t2, i3 = i3 || t2.animation, "refreshPriority" in t2 && (uu = 1, t2.refreshPriority === -9999 && (Qi = p3)), A4.tweenScroll = A4.tweenScroll || { top: Ho(M4, Me2), left: Ho(M4, nt2) }, p3.tweenTo = Ke2 = A4.tweenScroll[O3.p], p3.scrubDuration = function(E5) {
        Mr = Li(E5) && E5, Mr ? Q4 ? Q4.duration(E5) : Q4 = D.to(i3, { ease: "expo", totalProgress: "+=0", inherit: false, duration: Mr, paused: true, onComplete: function() {
          return T2 && T2(p3);
        } }) : (Q4 && Q4.progress(1).kill(), Q4 = 0);
      }, i3 && (i3.vars.lazy = false, i3._initted && !p3.isReverted || i3.vars.immediateRender !== false && t2.immediateRender !== false && i3.duration() && i3.render(0, true, true), p3.animation = i3.pause(), i3.scrollTrigger = p3, p3.scrubDuration(h2), hr = 0, u3 || (u3 = i3.vars.id)), v3 && ((!Lr(v3) || v3.push) && (v3 = { snapTo: v3 }), "scrollBehavior" in te2.style && D.set(N5 ? [te2, vt2] : M4, { scrollBehavior: "auto" }), H2.forEach(function(E5) {
        return Qe2(E5) && E5.target === (N5 ? oe2.scrollingElement || vt2 : M4) && (E5.smooth = false);
      }), ur = Qe2(v3.snapTo) ? v3.snapTo : v3.snapTo === "labels" ? gf(i3) : v3.snapTo === "labelsDirectional" ? mf(i3) : v3.directional !== false ? function(E5, Y5) {
        return ho(v3.snapTo)(E5, He2() - Fe2 < 500 ? 0 : Y5.direction);
      } : D.utils.snap(v3.snapTo), Ft2 = v3.duration || { min: 0.1, max: 2 }, Ft2 = Lr(Ft2) ? $i(Ft2.min, Ft2.max) : $i(Ft2, Ft2), Lt2 = D.delayedCall(v3.delay || Mr / 2 || 0.1, function() {
        var E5 = be2(), Y5 = He2() - Fe2 < 500, z2 = Ke2.tween;
        if ((Y5 || Math.abs(p3.getVelocity()) < 10) && !z2 && !qn && ae3 !== E5) {
          var W5 = (E5 - J3) / _e3, De2 = i3 && !F3 ? i3.totalProgress() : W5, K3 = Y5 ? 0 : (De2 - Or) / (He2() - Ri) * 1e3 || 0, ye3 = D.utils.clamp(-W5, 1 - W5, ti2(K3 / 2) * K3 / 0.185), Ve3 = W5 + (v3.inertia === false ? 0 : ye3), de3, ue3, re3 = v3, It2 = re3.onStart, fe3 = re3.onInterrupt, pt2 = re3.onComplete;
          if (de3 = ur(Ve3, p3), Li(de3) || (de3 = Ve3), ue3 = Math.max(0, Math.round(J3 + de3 * _e3)), E5 <= ge3 && E5 >= J3 && ue3 !== E5) {
            if (z2 && !z2._initted && z2.data <= ti2(ue3 - E5)) return;
            v3.inertia === false && (ye3 = de3 - W5), Ke2(ue3, { duration: Ft2(ti2(Math.max(ti2(Ve3 - De2), ti2(de3 - De2)) * 0.185 / K3 / 0.05 || 0)), ease: v3.ease || "power3", data: ti2(ue3 - E5), onInterrupt: function() {
              return Lt2.restart(true) && fe3 && fe3(p3);
            }, onComplete: function() {
              p3.update(), ae3 = be2(), i3 && !F3 && (Q4 ? Q4.resetTo("totalProgress", de3, i3._tTime / i3._tDur) : i3.progress(de3)), hr = Or = i3 && !F3 ? i3.totalProgress() : p3.progress, b4 && b4(p3), pt2 && pt2(p3);
            } }, E5, ye3 * _e3, ue3 - E5 - ye3 * _e3), It2 && It2(p3, Ke2.tween);
          }
        } else p3.isActive && ae3 !== E5 && Lt2.restart(true);
      }).pause()), u3 && (Fs[u3] = p3), d2 = p3.trigger = at2(d2 || c !== true && c), er = d2 && d2._gsap && d2._gsap.stRevert, er && (er = er(p3)), c = c === true ? d2 : at2(c), mt2(o2) && (o2 = { targets: d2, className: o2 }), c && (g4 === false || g4 === Ot2 || (g4 = !g4 && c.parentNode && c.parentNode.style && Mt2(c.parentNode).display === "flex" ? false : Se2), p3.pin = c, Xe3 = D.core.getCache(c), Xe3.spacer ? Kt2 = Xe3.pinState : (S3 && (S3 = at2(S3), S3 && !S3.nodeType && (S3 = S3.current || S3.nativeElement), Xe3.spacerIsNative = !!S3, S3 && (Xe3.spacerState = xn(S3))), Xe3.spacer = Ee3 = S3 || oe2.createElement("div"), Ee3.classList.add("pin-spacer"), u3 && Ee3.classList.add("pin-spacer-" + u3), Xe3.pinState = Kt2 = xn(c)), t2.force3D !== false && D.set(c, { force3D: true }), p3.spacer = Ee3 = Xe3.spacer, Zr = Mt2(c), Ti = Zr[g4 + O3.os2], me3 = D.getProperty(c), zt2 = D.quickSetter(c, O3.a, Oe2), ls(c, Ee3, Zr), Pr = xn(c)), $3) {
        jt2 = Lr($3) ? Yo($3, Wo) : Wo, x4 = vn("scroller-start", u3, M4, O3, jt2, 0), dt2 = vn("scroller-end", u3, M4, O3, jt2, 0, x4), cr = x4["offset" + O3.op.d2];
        var Si = at2(br(M4, "content") || M4);
        ot2 = this.markerStart = vn("start", u3, Si, O3, jt2, cr, 0, w4), _t2 = this.markerEnd = vn("end", u3, Si, O3, jt2, cr, 0, w4), w4 && (Jr = D.quickSetter([ot2, _t2], O3.a, Oe2)), !B3 && !(qt2.length && br(M4, "fixedMarkers") === true) && (pf(N5 ? te2 : M4), D.set([x4, dt2], { force3D: true }), an = D.quickSetter(x4, O3.a, Oe2), Kr = D.quickSetter(dt2, O3.a, Oe2));
      }
      if (w4) {
        var V4 = w4.vars.onUpdate, L2 = w4.vars.onUpdateParams;
        w4.eventCallback("onUpdate", function() {
          p3.update(0, 0, 1), V4 && V4.apply(w4, L2 || []);
        });
      }
      if (p3.previous = function() {
        return U[U.indexOf(p3) - 1];
      }, p3.next = function() {
        return U[U.indexOf(p3) + 1];
      }, p3.revert = function(E5, Y5) {
        if (!Y5) return p3.kill(true);
        var z2 = E5 !== false || !p3.enabled, W5 = Ge2;
        z2 !== p3.isReverted && (z2 && (Nt2 = Math.max(be2(), p3.scroll.rec || 0), We2 = p3.progress, Er = i3 && i3.progress()), ot2 && [ot2, _t2, x4, dt2].forEach(function(De2) {
          return De2.style.display = z2 ? "none" : "block";
        }), z2 && (Ge2 = p3, p3.update(z2)), c && (!y3 || !p3.isActive) && (z2 ? xf(c, Ee3, Kt2) : ls(c, Ee3, Mt2(c), Te3)), z2 || p3.update(z2), Ge2 = W5, p3.isReverted = z2);
      }, p3.refresh = function(E5, Y5, z2, W5) {
        if (!((Ge2 || !p3.enabled) && !Y5)) {
          if (c && E5 && Rt2) {
            Re2(a20, "scrollEnd", vu);
            return;
          }
          !it2 && j3 && j3(p3), Ge2 = p3, Ke2.tween && !z2 && (Ke2.tween.kill(), Ke2.tween = 0), Q4 && Q4.pause(), _7 && i3 && (i3.revert({ kill: false }).invalidate(), i3.getChildren && i3.getChildren(true, true, false).forEach(function(_r) {
            return _r.vars.immediateRender && _r.render(0, true, true);
          })), p3.isReverted || p3.revert(true, true), p3._subPinOffset = false;
          var De2 = se3(), K3 = ke3(), ye3 = w4 ? w4.duration() : Ht2(M4, O3), Ve3 = _e3 <= 0.01 || !_e3, de3 = 0, ue3 = W5 || 0, re3 = Lr(z2) ? z2.end : t2.end, It2 = t2.endTrigger || d2, fe3 = Lr(z2) ? z2.start : t2.start || (t2.start === 0 || !d2 ? 0 : c ? "0 0" : "0 100%"), pt2 = p3.pinnedContainer = t2.pinnedContainer && at2(t2.pinnedContainer, p3), Yt2 = d2 && Math.max(0, U.indexOf(p3)) || 0, Le3 = Yt2, Ne2, $e2, Dr, un, Ue2, Pe3, Wt2, Qn, po, Ci, Xt2, ki, ln;
          for ($3 && Lr(z2) && (ki = D.getProperty(x4, O3.p), ln = D.getProperty(dt2, O3.p)); Le3-- > 0; ) Pe3 = U[Le3], Pe3.end || Pe3.refresh(0, 1) || (Ge2 = p3), Wt2 = Pe3.pin, Wt2 && (Wt2 === d2 || Wt2 === c || Wt2 === pt2) && !Pe3.isReverted && (Ci || (Ci = []), Ci.unshift(Pe3), Pe3.revert(true, true)), Pe3 !== U[Le3] && (Yt2--, Le3--);
          for (Qe2(fe3) && (fe3 = fe3(p3)), fe3 = Lo(fe3, "start", p3), J3 = Uo(fe3, d2, De2, O3, be2(), ot2, x4, p3, K3, X4, B3, ye3, w4, p3._startClamp && "_startClamp") || (c ? -1e-3 : 0), Qe2(re3) && (re3 = re3(p3)), mt2(re3) && !re3.indexOf("+=") && (~re3.indexOf(" ") ? re3 = (mt2(fe3) ? fe3.split(" ")[0] : "") + re3 : (de3 = Pn(re3.substr(2), De2), re3 = mt2(fe3) ? fe3 : (w4 ? D.utils.mapRange(0, w4.duration(), w4.scrollTrigger.start, w4.scrollTrigger.end, J3) : J3) + de3, It2 = d2)), re3 = Lo(re3, "end", p3), ge3 = Math.max(J3, Uo(re3 || (It2 ? "100% 0" : ye3), It2, De2, O3, be2() + de3, _t2, dt2, p3, K3, X4, B3, ye3, w4, p3._endClamp && "_endClamp")) || -1e-3, de3 = 0, Le3 = Yt2; Le3--; ) Pe3 = U[Le3], Wt2 = Pe3.pin, Wt2 && Pe3.start - Pe3._pinPush <= J3 && !w4 && Pe3.end > 0 && (Ne2 = Pe3.end - (p3._startClamp ? Math.max(0, Pe3.start) : Pe3.start), (Wt2 === d2 && Pe3.start - Pe3._pinPush < J3 || Wt2 === pt2) && isNaN(fe3) && (de3 += Ne2 * (1 - Pe3.progress)), Wt2 === c && (ue3 += Ne2));
          if (J3 += de3, ge3 += de3, p3._startClamp && (p3._startClamp += de3), p3._endClamp && !it2 && (p3._endClamp = ge3 || -1e-3, ge3 = Math.min(ge3, Ht2(M4, O3))), _e3 = ge3 - J3 || (J3 -= 0.01) && 1e-3, Ve3 && (We2 = D.utils.clamp(0, 1, D.utils.normalize(J3, ge3, Nt2))), p3._pinPush = ue3, ot2 && de3 && (Ne2 = {}, Ne2[O3.a] = "+=" + de3, pt2 && (Ne2[O3.p] = "-=" + be2()), D.set([ot2, _t2], Ne2)), c && !(zs && p3.end >= Ht2(M4, O3))) Ne2 = Mt2(c), un = O3 === Me2, Dr = be2(), kt2 = parseFloat(me3(O3.a)) + ue3, !ye3 && ge3 > 1 && (Xt2 = (N5 ? oe2.scrollingElement || vt2 : M4).style, Xt2 = { style: Xt2, value: Xt2["overflow" + O3.a.toUpperCase()] }, N5 && Mt2(te2)["overflow" + O3.a.toUpperCase()] !== "scroll" && (Xt2.style["overflow" + O3.a.toUpperCase()] = "scroll")), ls(c, Ee3, Ne2), Pr = xn(c), $e2 = ir(c, true), Qn = B3 && Cr(M4, un ? nt2 : Me2)(), g4 ? (Te3 = [g4 + O3.os2, _e3 + ue3 + Oe2], Te3.t = Ee3, Le3 = g4 === Se2 ? Xn(c, O3) + _e3 + ue3 : 0, Le3 && (Te3.push(O3.d, Le3 + Oe2), Ee3.style.flexBasis !== "auto" && (Ee3.style.flexBasis = Le3 + Oe2)), pi(Te3), pt2 && U.forEach(function(_r) {
            _r.pin === pt2 && _r.vars.pinSpacing !== false && (_r._subPinOffset = true);
          }), B3 && be2(Nt2)) : (Le3 = Xn(c, O3), Le3 && Ee3.style.flexBasis !== "auto" && (Ee3.style.flexBasis = Le3 + Oe2)), B3 && (Ue2 = { top: $e2.top + (un ? Dr - J3 : Qn) + Oe2, left: $e2.left + (un ? Qn : Dr - J3) + Oe2, boxSizing: "border-box", position: "fixed" }, Ue2[Vr] = Ue2["max" + bi] = Math.ceil($e2.width) + Oe2, Ue2[$r] = Ue2["max" + co] = Math.ceil($e2.height) + Oe2, Ue2[Ot2] = Ue2[Ot2 + Hi] = Ue2[Ot2 + Ui] = Ue2[Ot2 + qi] = Ue2[Ot2 + Gi] = "0", Ue2[Se2] = Ne2[Se2], Ue2[Se2 + Hi] = Ne2[Se2 + Hi], Ue2[Se2 + Ui] = Ne2[Se2 + Ui], Ue2[Se2 + qi] = Ne2[Se2 + qi], Ue2[Se2 + Gi] = Ne2[Se2 + Gi], fr = bf(Kt2, Ue2, y3), it2 && be2(0)), i3 ? (po = i3._initted, ns(1), i3.render(i3.duration(), true, true), Zt2 = me3(O3.a) - kt2 + _e3 + ue3, Jt2 = Math.abs(_e3 - Zt2) > 1, B3 && Jt2 && fr.splice(fr.length - 2, 2), i3.render(0, true, true), po || i3.invalidate(true), i3.parent || i3.totalTime(i3.totalTime()), ns(0)) : Zt2 = _e3, Xt2 && (Xt2.value ? Xt2.style["overflow" + O3.a.toUpperCase()] = Xt2.value : Xt2.style.removeProperty("overflow-" + O3.a));
          else if (d2 && be2() && !w4) for ($e2 = d2.parentNode; $e2 && $e2 !== te2; ) $e2._pinOffset && (J3 -= $e2._pinOffset, ge3 -= $e2._pinOffset), $e2 = $e2.parentNode;
          Ci && Ci.forEach(function(_r) {
            return _r.revert(false, true);
          }), p3.start = J3, p3.end = ge3, Ze2 = st2 = it2 ? Nt2 : be2(), !w4 && !it2 && (Ze2 < Nt2 && be2(Nt2), p3.scroll.rec = 0), p3.revert(false, true), Fe2 = He2(), Lt2 && (ae3 = -1, Lt2.restart(true)), Ge2 = 0, i3 && F3 && (i3._initted || Er) && i3.progress() !== Er && i3.progress(Er || 0, true).render(i3.time(), true, true), (Ve3 || We2 !== p3.progress || w4 || _7 || i3 && !i3._initted) && (i3 && !F3 && (i3._initted || We2 || i3.vars.immediateRender !== false) && i3.totalProgress(w4 && J3 < -1e-3 && !We2 ? D.utils.normalize(J3, ge3, 0) : We2, true), p3.progress = Ve3 || (Ze2 - J3) / _e3 === We2 ? 0 : We2), c && g4 && (Ee3._pinOffset = Math.round(p3.progress * Zt2)), Q4 && Q4.invalidate(), isNaN(ki) || (ki -= D.getProperty(x4, O3.p), ln -= D.getProperty(dt2, O3.p), wn(x4, O3, ki), wn(ot2, O3, ki - (W5 || 0)), wn(dt2, O3, ln), wn(_t2, O3, ln - (W5 || 0))), Ve3 && !it2 && p3.update(), f4 && !it2 && !lr && (lr = true, f4(p3), lr = false);
        }
      }, p3.getVelocity = function() {
        return (be2() - st2) / (He2() - Ri) * 1e3 || 0;
      }, p3.endAnimation = function() {
        Mi(p3.callbackAnimation), i3 && (Q4 ? Q4.progress(1) : i3.paused() ? F3 || Mi(i3, p3.direction < 0, 1) : Mi(i3, i3.reversed()));
      }, p3.labelToScroll = function(E5) {
        return i3 && i3.labels && (J3 || p3.refresh() || J3) + i3.labels[E5] / i3.duration() * _e3 || 0;
      }, p3.getTrailing = function(E5) {
        var Y5 = U.indexOf(p3), z2 = p3.direction > 0 ? U.slice(0, Y5).reverse() : U.slice(Y5 + 1);
        return (mt2(E5) ? z2.filter(function(W5) {
          return W5.vars.preventOverlaps === E5;
        }) : z2).filter(function(W5) {
          return p3.direction > 0 ? W5.end <= J3 : W5.start >= ge3;
        });
      }, p3.update = function(E5, Y5, z2) {
        if (!(w4 && !z2 && !E5)) {
          var W5 = it2 === true ? Nt2 : p3.scroll(), De2 = E5 ? 0 : (W5 - J3) / _e3, K3 = De2 < 0 ? 0 : De2 > 1 ? 1 : De2 || 0, ye3 = p3.progress, Ve3, de3, ue3, re3, It2, fe3, pt2, Yt2;
          if (Y5 && (st2 = Ze2, Ze2 = w4 ? be2() : W5, v3 && (Or = hr, hr = i3 && !F3 ? i3.totalProgress() : K3)), m3 && c && !Ge2 && !dn && Rt2 && (!K3 && J3 < W5 + (W5 - st2) / (He2() - Ri) * m3 ? K3 = 1e-4 : K3 === 1 && ge3 > W5 + (W5 - st2) / (He2() - Ri) * m3 && (K3 = 0.9999)), K3 !== ye3 && p3.enabled) {
            if (Ve3 = p3.isActive = !!K3 && K3 < 1, de3 = !!ye3 && ye3 < 1, fe3 = Ve3 !== de3, It2 = fe3 || !!K3 != !!ye3, p3.direction = K3 > ye3 ? 1 : -1, p3.progress = K3, It2 && !Ge2 && (ue3 = K3 && !ye3 ? 0 : K3 === 1 ? 1 : ye3 === 1 ? 2 : 3, F3 && (re3 = !fe3 && R4[ue3 + 1] !== "none" && R4[ue3 + 1] || R4[ue3], Yt2 = i3 && (re3 === "complete" || re3 === "reset" || re3 in i3))), k3 && (fe3 || Yt2) && (Yt2 || h2 || !i3) && (Qe2(k3) ? k3(p3) : p3.getTrailing(k3).forEach(function(Dr) {
              return Dr.endAnimation();
            })), F3 || (Q4 && !Ge2 && !dn ? (Q4._dp._time - Q4._start !== Q4._time && Q4.render(Q4._dp._time - Q4._start), Q4.resetTo ? Q4.resetTo("totalProgress", K3, i3._tTime / i3._tDur) : (Q4.vars.totalProgress = K3, Q4.invalidate().restart())) : i3 && i3.totalProgress(K3, !!(Ge2 && (Fe2 || E5)))), c) {
              if (E5 && g4 && (Ee3.style[g4 + O3.os2] = Ti), !B3) zt2(Fi(kt2 + Zt2 * K3));
              else if (It2) {
                if (pt2 = !E5 && K3 > ye3 && ge3 + 1 > W5 && W5 + 1 >= Ht2(M4, O3), y3) if (!E5 && (Ve3 || pt2)) {
                  var Le3 = ir(c, true), Ne2 = W5 - J3;
                  Go(c, te2, Le3.top + (O3 === Me2 ? Ne2 : 0) + Oe2, Le3.left + (O3 === Me2 ? 0 : Ne2) + Oe2);
                } else Go(c, Ee3);
                pi(Ve3 || pt2 ? fr : Pr), Jt2 && K3 < 1 && Ve3 || zt2(kt2 + (K3 === 1 && !pt2 ? Zt2 : 0));
              }
            }
            v3 && !Ke2.tween && !Ge2 && !dn && Lt2.restart(true), o2 && (fe3 || P3 && K3 && (K3 < 1 || !ss)) && nn(o2.targets).forEach(function(Dr) {
              return Dr.classList[Ve3 || P3 ? "add" : "remove"](o2.className);
            }), s3 && !F3 && !E5 && s3(p3), It2 && !Ge2 ? (F3 && (Yt2 && (re3 === "complete" ? i3.pause().totalProgress(1) : re3 === "reset" ? i3.restart(true).pause() : re3 === "restart" ? i3.restart(true) : i3[re3]()), s3 && s3(p3)), (fe3 || !ss) && (l3 && fe3 && as(p3, l3), I2[ue3] && as(p3, I2[ue3]), P3 && (K3 === 1 ? p3.kill(false, 1) : I2[ue3] = 0), fe3 || (ue3 = K3 === 1 ? 1 : 3, I2[ue3] && as(p3, I2[ue3]))), C4 && !Ve3 && Math.abs(p3.getVelocity()) > (Li(C4) ? C4 : 2500) && (Mi(p3.callbackAnimation), Q4 ? Q4.progress(1) : Mi(i3, re3 === "reverse" ? 1 : !K3, 1))) : F3 && s3 && !Ge2 && s3(p3);
          }
          if (Kr) {
            var $e2 = w4 ? W5 / w4.duration() * (w4._caScrollDist || 0) : W5;
            an($e2 + (x4._isFlipped ? 1 : 0)), Kr($e2);
          }
          Jr && Jr(-W5 / w4.duration() * (w4._caScrollDist || 0));
        }
      }, p3.enable = function(E5, Y5) {
        p3.enabled || (p3.enabled = true, Re2(M4, "resize", Ni), N5 || Re2(M4, "scroll", ri2), j3 && Re2(a20, "refreshInit", j3), E5 !== false && (p3.progress = We2 = 0, Ze2 = st2 = ae3 = be2()), Y5 !== false && p3.refresh());
      }, p3.getTween = function(E5) {
        return E5 && Ke2 ? Ke2.tween : Q4;
      }, p3.setPositions = function(E5, Y5, z2, W5) {
        if (w4) {
          var De2 = w4.scrollTrigger, K3 = w4.duration(), ye3 = De2.end - De2.start;
          E5 = De2.start + ye3 * E5 / K3, Y5 = De2.start + ye3 * Y5 / K3;
        }
        p3.refresh(false, false, { start: No(E5, z2 && !!p3._startClamp), end: No(Y5, z2 && !!p3._endClamp) }, W5), p3.update();
      }, p3.adjustPinSpacing = function(E5) {
        if (Te3 && E5) {
          var Y5 = Te3.indexOf(O3.d) + 1;
          Te3[Y5] = parseFloat(Te3[Y5]) + E5 + Oe2, Te3[1] = parseFloat(Te3[1]) + E5 + Oe2, pi(Te3);
        }
      }, p3.disable = function(E5, Y5) {
        if (p3.enabled && (E5 !== false && p3.revert(true, true), p3.enabled = p3.isActive = false, Y5 || Q4 && Q4.pause(), Nt2 = 0, Xe3 && (Xe3.uncache = 1), j3 && Ae2(a20, "refreshInit", j3), Lt2 && (Lt2.pause(), Ke2.tween && Ke2.tween.kill() && (Ke2.tween = 0)), !N5)) {
          for (var z2 = U.length; z2--; ) if (U[z2].scroller === M4 && U[z2] !== p3) return;
          Ae2(M4, "resize", Ni), N5 || Ae2(M4, "scroll", ri2);
        }
      }, p3.kill = function(E5, Y5) {
        p3.disable(E5, Y5), Q4 && !Y5 && Q4.kill(), u3 && delete Fs[u3];
        var z2 = U.indexOf(p3);
        z2 >= 0 && U.splice(z2, 1), z2 === rt2 && Mn > 0 && rt2--, z2 = 0, U.forEach(function(W5) {
          return W5.scroller === p3.scroller && (z2 = 1);
        }), z2 || it2 || (p3.scroll.rec = 0), i3 && (i3.scrollTrigger = null, E5 && i3.revert({ kill: false }), Y5 || i3.kill()), ot2 && [ot2, _t2, x4, dt2].forEach(function(W5) {
          return W5.parentNode && W5.parentNode.removeChild(W5);
        }), Qi === p3 && (Qi = 0), c && (Xe3 && (Xe3.uncache = 1), z2 = 0, U.forEach(function(W5) {
          return W5.pin === c && z2++;
        }), z2 || (Xe3.spacer = 0)), t2.onKill && t2.onKill(p3);
      }, U.push(p3), p3.enable(false, false), er && er(p3), i3 && i3.add && !_e3) {
        var ee3 = p3.update;
        p3.update = function() {
          p3.update = ee3, H2.cache++, J3 || ge3 || p3.refresh();
        }, D.delayedCall(0.01, p3.update), _e3 = 0.01, J3 = ge3 = 0;
      } else p3.refresh();
      c && vf();
    }, a20.register = function(t2) {
      return si2 || (D = t2 || _u(), hu() && window.document && a20.enable(), si2 = zi), si2;
    }, a20.defaults = function(t2) {
      if (t2) for (var i3 in t2) yn[i3] = t2[i3];
      return yn;
    }, a20.disable = function(t2, i3) {
      zi = 0, U.forEach(function(s3) {
        return s3[i3 ? "kill" : "disable"](t2);
      }), Ae2(G, "wheel", ri2), Ae2(oe2, "scroll", ri2), clearInterval(_n), Ae2(oe2, "touchcancel", $t2), Ae2(te2, "touchstart", $t2), gn(Ae2, oe2, "pointerdown,touchstart,mousedown", Io), gn(Ae2, oe2, "pointerup,touchend,mouseup", Bo), Yn.kill(), pn(Ae2);
      for (var n3 = 0; n3 < H2.length; n3 += 3) mn(Ae2, H2[n3], H2[n3 + 1]), mn(Ae2, H2[n3], H2[n3 + 2]);
    }, a20.enable = function() {
      if (G = window, oe2 = document, vt2 = oe2.documentElement, te2 = oe2.body, D && (nn = D.utils.toArray, $i = D.utils.clamp, Rs = D.core.context || $t2, ns = D.core.suppressOverwrites || $t2, ao = G.history.scrollRestoration || "auto", Ls = G.pageYOffset || 0, D.core.globals("ScrollTrigger", a20), te2)) {
        zi = 1, di = document.createElement("div"), di.style.height = "100vh", di.style.position = "absolute", bu(), hf(), we2.register(D), a20.isTouch = we2.isTouch, dr = we2.isTouch && /(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent), As = we2.isTouch === 1, Re2(G, "wheel", ri2), oo = [G, oe2, vt2, te2], D.matchMedia ? (a20.matchMedia = function(l3) {
          var f4 = D.matchMedia(), h2;
          for (h2 in l3) f4.add(h2, l3[h2]);
          return f4;
        }, D.addEventListener("matchMediaInit", function() {
          return _o();
        }), D.addEventListener("matchMediaRevert", function() {
          return xu();
        }), D.addEventListener("matchMedia", function() {
          Ir(0, 1), Qr("matchMedia");
        }), D.matchMedia().add("(orientation: portrait)", function() {
          return us(), us;
        })) : console.warn("Requires GSAP 3.11.0 or later"), us(), Re2(oe2, "scroll", ri2);
        var t2 = te2.hasAttribute("style"), i3 = te2.style, n3 = i3.borderTopStyle, s3 = D.core.Animation.prototype, o2, u3;
        for (s3.revert || Object.defineProperty(s3, "revert", { value: function() {
          return this.time(-0.01, true);
        } }), i3.borderTopStyle = "solid", o2 = ir(te2), Me2.m = Math.round(o2.top + Me2.sc()) || 0, nt2.m = Math.round(o2.left + nt2.sc()) || 0, n3 ? i3.borderTopStyle = n3 : i3.removeProperty("border-top-style"), t2 || (te2.setAttribute("style", ""), te2.removeAttribute("style")), _n = setInterval(Xo, 250), D.delayedCall(0.5, function() {
          return dn = 0;
        }), Re2(oe2, "touchcancel", $t2), Re2(te2, "touchstart", $t2), gn(Re2, oe2, "pointerdown,touchstart,mousedown", Io), gn(Re2, oe2, "pointerup,touchend,mouseup", Bo), Ds = D.utils.checkPrefix("transform"), En.push(Ds), si2 = He2(), Yn = D.delayedCall(0.2, Ir).pause(), oi = [oe2, "visibilitychange", function() {
          var l3 = G.innerWidth, f4 = G.innerHeight;
          oe2.hidden ? (zo = l3, Fo = f4) : (zo !== l3 || Fo !== f4) && Ni();
        }, oe2, "DOMContentLoaded", Ir, G, "load", Ir, G, "resize", Ni], pn(Re2), U.forEach(function(l3) {
          return l3.enable(0, 1);
        }), u3 = 0; u3 < H2.length; u3 += 3) mn(Ae2, H2[u3], H2[u3 + 1]), mn(Ae2, H2[u3], H2[u3 + 2]);
      }
    }, a20.config = function(t2) {
      "limitCallbacks" in t2 && (ss = !!t2.limitCallbacks);
      var i3 = t2.syncInterval;
      i3 && clearInterval(_n) || (_n = i3) && setInterval(Xo, i3), "ignoreMobileResize" in t2 && (As = a20.isTouch === 1 && t2.ignoreMobileResize), "autoRefreshEvents" in t2 && (pn(Ae2) || pn(Re2, t2.autoRefreshEvents || "none"), lu = (t2.autoRefreshEvents + "").indexOf("resize") === -1);
    }, a20.scrollerProxy = function(t2, i3) {
      var n3 = at2(t2), s3 = H2.indexOf(n3), o2 = Hr(n3);
      ~s3 && H2.splice(s3, o2 ? 6 : 2), i3 && (o2 ? qt2.unshift(G, i3, te2, i3, vt2, i3) : qt2.unshift(n3, i3));
    }, a20.clearMatchMedia = function(t2) {
      U.forEach(function(i3) {
        return i3._ctx && i3._ctx.query === t2 && i3._ctx.kill(true, true);
      });
    }, a20.isInViewport = function(t2, i3, n3) {
      var s3 = (mt2(t2) ? at2(t2) : t2).getBoundingClientRect(), o2 = s3[n3 ? Vr : $r] * i3 || 0;
      return n3 ? s3.right - o2 > 0 && s3.left + o2 < G.innerWidth : s3.bottom - o2 > 0 && s3.top + o2 < G.innerHeight;
    }, a20.positionInViewport = function(t2, i3, n3) {
      mt2(t2) && (t2 = at2(t2));
      var s3 = t2.getBoundingClientRect(), o2 = s3[n3 ? Vr : $r], u3 = i3 == null ? o2 / 2 : i3 in Vn ? Vn[i3] * o2 : ~i3.indexOf("%") ? parseFloat(i3) * o2 / 100 : parseFloat(i3) || 0;
      return n3 ? (s3.left + u3) / G.innerWidth : (s3.top + u3) / G.innerHeight;
    }, a20.killAll = function(t2) {
      if (U.slice(0).forEach(function(n3) {
        return n3.vars.id !== "ScrollSmoother" && n3.kill();
      }), t2 !== true) {
        var i3 = qr.killAll || [];
        qr = {}, i3.forEach(function(n3) {
          return n3();
        });
      }
    }, a20;
  })();
  q4.version = "3.13.0";
  q4.saveStyles = function(a20) {
    return a20 ? nn(a20).forEach(function(e) {
      if (e && e.style) {
        var r = gt2.indexOf(e);
        r >= 0 && gt2.splice(r, 5), gt2.push(e, e.style.cssText, e.getBBox && e.getAttribute("transform"), D.core.getCache(e), Rs());
      }
    }) : gt2;
  };
  q4.revert = function(a20, e) {
    return _o(!a20, e);
  };
  q4.create = function(a20, e) {
    return new q4(a20, e);
  };
  q4.refresh = function(a20) {
    return a20 ? Ni(true) : (si2 || q4.register()) && Ir(true);
  };
  q4.update = function(a20) {
    return ++H2.cache && sr(a20 === true ? 2 : 0);
  };
  q4.clearScrollMemory = wu;
  q4.maxScroll = function(a20, e) {
    return Ht2(a20, e ? nt2 : Me2);
  };
  q4.getScrollFunc = function(a20, e) {
    return Cr(at2(a20), e ? nt2 : Me2);
  };
  q4.getById = function(a20) {
    return Fs[a20];
  };
  q4.getAll = function() {
    return U.filter(function(a20) {
      return a20.vars.id !== "ScrollSmoother";
    });
  };
  q4.isScrolling = function() {
    return !!Rt2;
  };
  q4.snapDirectional = ho;
  q4.addEventListener = function(a20, e) {
    var r = qr[a20] || (qr[a20] = []);
    ~r.indexOf(e) || r.push(e);
  };
  q4.removeEventListener = function(a20, e) {
    var r = qr[a20], t2 = r && r.indexOf(e);
    t2 >= 0 && r.splice(t2, 1);
  };
  q4.batch = function(a20, e) {
    var r = [], t2 = {}, i3 = e.interval || 0.016, n3 = e.batchMax || 1e9, s3 = function(l3, f4) {
      var h2 = [], d2 = [], c = D.delayedCall(i3, function() {
        f4(h2, d2), h2 = [], d2 = [];
      }).pause();
      return function(g4) {
        h2.length || c.restart(true), h2.push(g4.trigger), d2.push(g4), n3 <= h2.length && c.progress(1);
      };
    }, o2;
    for (o2 in e) t2[o2] = o2.substr(0, 2) === "on" && Qe2(e[o2]) && o2 !== "onRefreshInit" ? s3(o2, e[o2]) : e[o2];
    return Qe2(n3) && (n3 = n3(), Re2(q4, "refresh", function() {
      return n3 = e.batchMax();
    })), nn(a20).forEach(function(u3) {
      var l3 = {};
      for (o2 in t2) l3[o2] = t2[o2];
      l3.trigger = u3, r.push(q4.create(l3));
    }), r;
  };
  var qo = function(e, r, t2, i3) {
    return r > i3 ? e(i3) : r < 0 && e(0), t2 > i3 ? (i3 - r) / (t2 - r) : t2 < 0 ? r / (r - t2) : 1;
  };
  var fs = function a17(e, r) {
    r === true ? e.style.removeProperty("touch-action") : e.style.touchAction = r === true ? "auto" : r ? "pan-" + r + (we2.isTouch ? " pinch-zoom" : "") : "none", e === vt2 && a17(te2, r);
  };
  var bn = { auto: 1, scroll: 1 };
  var Sf = function(e) {
    var r = e.event, t2 = e.target, i3 = e.axis, n3 = (r.changedTouches ? r.changedTouches[0] : r).target, s3 = n3._gsap || D.core.getCache(n3), o2 = He2(), u3;
    if (!s3._isScrollT || o2 - s3._isScrollT > 2e3) {
      for (; n3 && n3 !== te2 && (n3.scrollHeight <= n3.clientHeight && n3.scrollWidth <= n3.clientWidth || !(bn[(u3 = Mt2(n3)).overflowY] || bn[u3.overflowX])); ) n3 = n3.parentNode;
      s3._isScroll = n3 && n3 !== t2 && !Hr(n3) && (bn[(u3 = Mt2(n3)).overflowY] || bn[u3.overflowX]), s3._isScrollT = o2;
    }
    (s3._isScroll || i3 === "x") && (r.stopPropagation(), r._gsapAllow = true);
  };
  var Su = function(e, r, t2, i3) {
    return we2.create({ target: e, capture: true, debounce: false, lockAxis: true, type: r, onWheel: i3 = i3 && Sf, onPress: i3, onDrag: i3, onScroll: i3, onEnable: function() {
      return t2 && Re2(oe2, we2.eventTypes[0], jo, false, true);
    }, onDisable: function() {
      return Ae2(oe2, we2.eventTypes[0], jo, true);
    } });
  };
  var Cf = /(input|label|select|textarea)/i;
  var Qo;
  var jo = function(e) {
    var r = Cf.test(e.target.tagName);
    (r || Qo) && (e._gsapAllow = true, Qo = r);
  };
  var kf = function(e) {
    Lr(e) || (e = {}), e.preventDefault = e.isNormalizer = e.allowClicks = true, e.type || (e.type = "wheel,touch"), e.debounce = !!e.debounce, e.id = e.id || "normalizer";
    var r = e, t2 = r.normalizeScrollX, i3 = r.momentum, n3 = r.allowNestedScroll, s3 = r.onRelease, o2, u3, l3 = at2(e.target) || vt2, f4 = D.core.globals().ScrollSmoother, h2 = f4 && f4.get(), d2 = dr && (e.content && at2(e.content) || h2 && e.content !== false && !h2.smooth() && h2.content()), c = Cr(l3, Me2), g4 = Cr(l3, nt2), _7 = 1, m3 = (we2.isTouch && G.visualViewport ? G.visualViewport.scale * G.visualViewport.width : G.outerWidth) / G.innerWidth, T2 = 0, b4 = Qe2(i3) ? function() {
      return i3(o2);
    } : function() {
      return i3 || 2.8;
    }, P3, v3, y3 = Su(l3, e.type, true, n3), S3 = function() {
      return v3 = false;
    }, w4 = $t2, C4 = $t2, k3 = function() {
      u3 = Ht2(l3, Me2), C4 = $i(dr ? 1 : 0, u3), t2 && (w4 = $i(0, Ht2(l3, nt2))), P3 = Ur;
    }, O3 = function() {
      d2._gsap.y = Fi(parseFloat(d2._gsap.y) + c.offset) + "px", d2.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + parseFloat(d2._gsap.y) + ", 0, 1)", c.offset = c.cacheID = 0;
    }, F3 = function() {
      if (v3) {
        requestAnimationFrame(S3);
        var $3 = Fi(o2.deltaY / 2), X4 = C4(c.v - $3);
        if (d2 && X4 !== c.v + c.offset) {
          c.offset = X4 - c.v;
          var p3 = Fi((parseFloat(d2 && d2._gsap.y) || 0) - c.offset);
          d2.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + p3 + ", 0, 1)", d2._gsap.y = p3 + "px", c.cacheID = H2.cache, sr();
        }
        return true;
      }
      c.offset && O3(), v3 = true;
    }, M4, A4, N5, B3, I2 = function() {
      k3(), M4.isActive() && M4.vars.scrollY > u3 && (c() > u3 ? M4.progress(1) && c(u3) : M4.resetTo("scrollY", u3));
    };
    return d2 && D.set(d2, { y: "+=0" }), e.ignoreCheck = function(R4) {
      return dr && R4.type === "touchmove" && F3() || _7 > 1.05 && R4.type !== "touchstart" || o2.isGesturing || R4.touches && R4.touches.length > 1;
    }, e.onPress = function() {
      v3 = false;
      var R4 = _7;
      _7 = Fi((G.visualViewport && G.visualViewport.scale || 1) / m3), M4.pause(), R4 !== _7 && fs(l3, _7 > 1.01 ? true : t2 ? false : "x"), A4 = g4(), N5 = c(), k3(), P3 = Ur;
    }, e.onRelease = e.onGestureStart = function(R4, $3) {
      if (c.offset && O3(), !$3) B3.restart(true);
      else {
        H2.cache++;
        var X4 = b4(), p3, j3;
        t2 && (p3 = g4(), j3 = p3 + X4 * 0.05 * -R4.velocityX / 0.227, X4 *= qo(g4, p3, j3, Ht2(l3, nt2)), M4.vars.scrollX = w4(j3)), p3 = c(), j3 = p3 + X4 * 0.05 * -R4.velocityY / 0.227, X4 *= qo(c, p3, j3, Ht2(l3, Me2)), M4.vars.scrollY = C4(j3), M4.invalidate().duration(X4).play(0.01), (dr && M4.vars.scrollY >= u3 || p3 >= u3 - 1) && D.to({}, { onUpdate: I2, duration: X4 });
      }
      s3 && s3(R4);
    }, e.onWheel = function() {
      M4._ts && M4.pause(), He2() - T2 > 1e3 && (P3 = 0, T2 = He2());
    }, e.onChange = function(R4, $3, X4, p3, j3) {
      if (Ur !== P3 && k3(), $3 && t2 && g4(w4(p3[2] === $3 ? A4 + (R4.startX - R4.x) : g4() + $3 - p3[1])), X4) {
        c.offset && O3();
        var se3 = j3[2] === X4, ke3 = se3 ? N5 + R4.startY - R4.y : c() + X4 - j3[1], ae3 = C4(ke3);
        se3 && ke3 !== ae3 && (N5 += ae3 - ke3), c(ae3);
      }
      (X4 || $3) && sr();
    }, e.onEnable = function() {
      fs(l3, t2 ? false : "x"), q4.addEventListener("refresh", I2), Re2(G, "resize", I2), c.smooth && (c.target.style.scrollBehavior = "auto", c.smooth = g4.smooth = false), y3.enable();
    }, e.onDisable = function() {
      fs(l3, true), Ae2(G, "resize", I2), q4.removeEventListener("refresh", I2), y3.kill();
    }, e.lockAxis = e.lockAxis !== false, o2 = new we2(e), o2.iOS = dr, dr && !c() && c(1), dr && D.ticker.add($t2), B3 = o2._dc, M4 = D.to(o2, { ease: "power4", paused: true, inherit: false, scrollX: t2 ? "+=0.1" : "+=0", scrollY: "+=0.1", modifiers: { scrollY: Tu(c, c(), function() {
      return M4.pause();
    }) }, onUpdate: sr, onComplete: B3.vars.onComplete }), o2;
  };
  q4.sort = function(a20) {
    if (Qe2(a20)) return U.sort(a20);
    var e = G.pageYOffset || 0;
    return q4.getAll().forEach(function(r) {
      return r._sortY = r.trigger ? e + r.trigger.getBoundingClientRect().top : r.start + G.innerHeight;
    }), U.sort(a20 || function(r, t2) {
      return (r.vars.refreshPriority || 0) * -1e6 + (r.vars.containerAnimation ? 1e6 : r._sortY) - ((t2.vars.containerAnimation ? 1e6 : t2._sortY) + (t2.vars.refreshPriority || 0) * -1e6);
    });
  };
  q4.observe = function(a20) {
    return new we2(a20);
  };
  q4.normalizeScroll = function(a20) {
    if (typeof a20 > "u") return tt2;
    if (a20 === true && tt2) return tt2.enable();
    if (a20 === false) {
      tt2 && tt2.kill(), tt2 = a20;
      return;
    }
    var e = a20 instanceof we2 ? a20 : kf(a20);
    return tt2 && tt2.target === e.target && tt2.kill(), Hr(e.target) && (tt2 = e), e;
  };
  q4.core = { _getVelocityProp: Es, _inputObserver: Su, _scrollers: H2, _proxies: qt2, bridge: { ss: function() {
    Rt2 || Qr("scrollStart"), Rt2 = He2();
  }, ref: function() {
    return Ge2;
  } } };
  _u() && D.registerPlugin(q4);
  var Af = Object.freeze(Object.defineProperty({ __proto__: null, ScrollTrigger: q4, default: q4 }, Symbol.toStringTag, { value: "Module" }));
  var Ei;
  var ii2;
  var Is;
  var Pf = () => Is || Ef.register(window.gsap);
  var Ko = typeof Intl < "u" ? new Intl.Segmenter() : 0;
  var $n = (a20) => typeof a20 == "string" ? $n(document.querySelectorAll(a20)) : "length" in a20 ? Array.from(a20) : [a20];
  var Zo = (a20) => $n(a20).filter((e) => e instanceof HTMLElement);
  var Bs = [];
  var cs = function() {
  };
  var Of = /\s+/g;
  var Jo = new RegExp("\\p{RI}\\p{RI}|\\p{Emoji}(\\p{EMod}|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?(\\u{200D}\\p{Emoji}(\\p{EMod}|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?)*|.", "gu");
  var ea = { left: 0, top: 0, width: 0, height: 0 };
  var ta = (a20, e) => {
    if (e) {
      let r = new Set(a20.join("").match(e) || Bs), t2 = a20.length, i3, n3, s3, o2;
      if (r.size) for (; --t2 > -1; ) {
        n3 = a20[t2];
        for (s3 of r) if (s3.startsWith(n3) && s3.length > n3.length) {
          for (i3 = 0, o2 = n3; s3.startsWith(o2 += a20[t2 + ++i3]) && o2.length < s3.length; ) ;
          if (i3 && o2.length === s3.length) {
            a20[t2] = s3, a20.splice(t2 + 1, i3);
            break;
          }
        }
      }
    }
    return a20;
  };
  var ra = (a20) => window.getComputedStyle(a20).display === "inline" && (a20.style.display = "inline-block");
  var ni2 = (a20, e, r) => e.insertBefore(typeof a20 == "string" ? document.createTextNode(a20) : a20, r);
  var Ys = (a20, e, r) => {
    let t2 = e[a20 + "sClass"] || "", { tag: i3 = "div", aria: n3 = "auto", propIndex: s3 = false } = e, o2 = a20 === "line" ? "block" : "inline-block", u3 = t2.indexOf("++") > -1, l3 = (f4) => {
      let h2 = document.createElement(i3), d2 = r.length + 1;
      return t2 && (h2.className = t2 + (u3 ? " " + t2 + d2 : "")), s3 && h2.style.setProperty("--" + a20, d2 + ""), n3 !== "none" && h2.setAttribute("aria-hidden", "true"), i3 !== "span" && (h2.style.position = "relative", h2.style.display = o2), h2.textContent = f4, r.push(h2), h2;
    };
    return u3 && (t2 = t2.replace("++", "")), l3.collection = r, l3;
  };
  var Mf = (a20, e, r, t2) => {
    let i3 = Ys("line", r, t2), n3 = window.getComputedStyle(a20).textAlign || "left";
    return (s3, o2) => {
      let u3 = i3("");
      for (u3.style.textAlign = n3, a20.insertBefore(u3, e[s3]); s3 < o2; s3++) u3.appendChild(e[s3]);
      u3.normalize();
    };
  };
  var Cu = (a20, e, r, t2, i3, n3, s3, o2, u3, l3) => {
    var f4;
    let h2 = Array.from(a20.childNodes), d2 = 0, { wordDelimiter: c, reduceWhiteSpace: g4 = true, prepareText: _7 } = e, m3 = a20.getBoundingClientRect(), T2 = m3, b4 = !g4 && window.getComputedStyle(a20).whiteSpace.substring(0, 3) === "pre", P3 = 0, v3 = r.collection, y3, S3, w4, C4, k3, O3, F3, M4, A4, N5, B3, I2, R4, $3, X4, p3, j3, se3;
    for (typeof c == "object" ? (w4 = c.delimiter || c, S3 = c.replaceWith || "") : S3 = c === "" ? "" : c || " ", y3 = S3 !== " "; d2 < h2.length; d2++) if (C4 = h2[d2], C4.nodeType === 3) {
      for (X4 = C4.textContent || "", g4 ? X4 = X4.replace(Of, " ") : b4 && (X4 = X4.replace(/\n/g, S3 + `
`)), _7 && (X4 = _7(X4, a20)), C4.textContent = X4, k3 = S3 || w4 ? X4.split(w4 || S3) : X4.match(o2) || Bs, j3 = k3[k3.length - 1], M4 = y3 ? j3.slice(-1) === " " : !j3, j3 || k3.pop(), T2 = m3, F3 = y3 ? k3[0].charAt(0) === " " : !k3[0], F3 && ni2(" ", a20, C4), k3[0] || k3.shift(), ta(k3, u3), n3 && l3 || (C4.textContent = ""), A4 = 1; A4 <= k3.length; A4++) if (p3 = k3[A4 - 1], !g4 && b4 && p3.charAt(0) === `
` && ((f4 = C4.previousSibling) == null || f4.remove(), ni2(document.createElement("br"), a20, C4), p3 = p3.slice(1)), !g4 && p3 === "") ni2(S3, a20, C4);
      else if (p3 === " ") a20.insertBefore(document.createTextNode(" "), C4);
      else {
        if (y3 && p3.charAt(0) === " " && ni2(" ", a20, C4), P3 && A4 === 1 && !F3 && v3.indexOf(P3.parentNode) > -1 ? (O3 = v3[v3.length - 1], O3.appendChild(document.createTextNode(t2 ? "" : p3))) : (O3 = r(t2 ? "" : p3), ni2(O3, a20, C4), P3 && A4 === 1 && !F3 && O3.insertBefore(P3, O3.firstChild)), t2) for (B3 = Ko ? ta([...Ko.segment(p3)].map((ke3) => ke3.segment), u3) : p3.match(o2) || Bs, se3 = 0; se3 < B3.length; se3++) O3.appendChild(B3[se3] === " " ? document.createTextNode(" ") : t2(B3[se3]));
        if (n3 && l3) {
          if (X4 = C4.textContent = X4.substring(p3.length + 1, X4.length), N5 = O3.getBoundingClientRect(), N5.top > T2.top && N5.left <= T2.left) {
            for (I2 = a20.cloneNode(), R4 = a20.childNodes[0]; R4 && R4 !== O3; ) $3 = R4, R4 = R4.nextSibling, I2.appendChild($3);
            a20.parentNode.insertBefore(I2, a20), i3 && ra(I2);
          }
          T2 = N5;
        }
        (A4 < k3.length || M4) && ni2(A4 >= k3.length ? " " : y3 && p3.slice(-1) === " " ? " " + S3 : S3, a20, C4);
      }
      a20.removeChild(C4), P3 = 0;
    } else C4.nodeType === 1 && (s3 && s3.indexOf(C4) > -1 ? (v3.indexOf(C4.previousSibling) > -1 && v3[v3.length - 1].appendChild(C4), P3 = C4) : (Cu(C4, e, r, t2, i3, n3, s3, o2, u3, true), P3 = 0), i3 && ra(C4));
  };
  var ku = class Pu {
    constructor(e, r) {
      this.isSplit = false, Pf(), this.elements = Zo(e), this.chars = [], this.words = [], this.lines = [], this.masks = [], this.vars = r, this._split = () => this.isSplit && this.split(this.vars);
      let t2 = [], i3, n3 = () => {
        let s3 = t2.length, o2;
        for (; s3--; ) {
          o2 = t2[s3];
          let u3 = o2.element.offsetWidth;
          if (u3 !== o2.width) {
            o2.width = u3, this._split();
            return;
          }
        }
      };
      this._data = { orig: t2, obs: typeof ResizeObserver < "u" && new ResizeObserver(() => {
        clearTimeout(i3), i3 = setTimeout(n3, 200);
      }) }, cs(this), this.split(r);
    }
    split(e) {
      this.isSplit && this.revert(), this.vars = e = e || this.vars || {};
      let { type: r = "chars,words,lines", aria: t2 = "auto", deepSlice: i3 = true, smartWrap: n3, onSplit: s3, autoSplit: o2 = false, specialChars: u3, mask: l3 } = this.vars, f4 = r.indexOf("lines") > -1, h2 = r.indexOf("chars") > -1, d2 = r.indexOf("words") > -1, c = h2 && !d2 && !f4, g4 = u3 && ("push" in u3 ? new RegExp("(?:" + u3.join("|") + ")", "gu") : u3), _7 = g4 ? new RegExp(g4.source + "|" + Jo.source, "gu") : Jo, m3 = !!e.ignore && Zo(e.ignore), { orig: T2, animTime: b4, obs: P3 } = this._data, v3;
      return (h2 || d2 || f4) && (this.elements.forEach((y3, S3) => {
        T2[S3] = { element: y3, html: y3.innerHTML, ariaL: y3.getAttribute("aria-label"), ariaH: y3.getAttribute("aria-hidden") }, t2 === "auto" ? y3.setAttribute("aria-label", (y3.textContent || "").trim()) : t2 === "hidden" && y3.setAttribute("aria-hidden", "true");
        let w4 = [], C4 = [], k3 = [], O3 = h2 ? Ys("char", e, w4) : null, F3 = Ys("word", e, C4), M4, A4, N5, B3;
        if (Cu(y3, e, F3, O3, c, i3 && (f4 || c), m3, _7, g4, false), f4) {
          let I2 = $n(y3.childNodes), R4 = Mf(y3, I2, e, k3), $3, X4 = [], p3 = 0, j3 = I2.map((ke3) => ke3.nodeType === 1 ? ke3.getBoundingClientRect() : ea), se3 = ea;
          for (M4 = 0; M4 < I2.length; M4++) $3 = I2[M4], $3.nodeType === 1 && ($3.nodeName === "BR" ? (X4.push($3), R4(p3, M4 + 1), p3 = M4 + 1, se3 = j3[p3]) : (M4 && j3[M4].top > se3.top && j3[M4].left <= se3.left && (R4(p3, M4), p3 = M4), se3 = j3[M4]));
          p3 < M4 && R4(p3, M4), X4.forEach((ke3) => {
            var ae3;
            return (ae3 = ke3.parentNode) == null ? void 0 : ae3.removeChild(ke3);
          });
        }
        if (!d2) {
          for (M4 = 0; M4 < C4.length; M4++) if (A4 = C4[M4], h2 || !A4.nextSibling || A4.nextSibling.nodeType !== 3) if (n3 && !f4) {
            for (N5 = document.createElement("span"), N5.style.whiteSpace = "nowrap"; A4.firstChild; ) N5.appendChild(A4.firstChild);
            A4.replaceWith(N5);
          } else A4.replaceWith(...A4.childNodes);
          else B3 = A4.nextSibling, B3 && B3.nodeType === 3 && (B3.textContent = (A4.textContent || "") + (B3.textContent || ""), A4.remove());
          C4.length = 0, y3.normalize();
        }
        this.lines.push(...k3), this.words.push(...C4), this.chars.push(...w4);
      }), l3 && this[l3] && this.masks.push(...this[l3].map((y3) => {
        let S3 = y3.cloneNode();
        return y3.replaceWith(S3), S3.appendChild(y3), y3.className && (S3.className = y3.className.replace(/(\b\w+\b)/g, "$1-mask")), S3.style.overflow = "clip", S3;
      }))), this.isSplit = true, ii2 && (o2 ? ii2.addEventListener("loadingdone", this._split) : ii2.status === "loading" && console.warn("SplitText called before fonts loaded")), (v3 = s3 && s3(this)) && v3.totalTime && (this._data.anim = b4 ? v3.totalTime(b4) : v3), f4 && o2 && this.elements.forEach((y3, S3) => {
        T2[S3].width = y3.offsetWidth, P3 && P3.observe(y3);
      }), this;
    }
    revert() {
      var e, r;
      let { orig: t2, anim: i3, obs: n3 } = this._data;
      return n3 && n3.disconnect(), t2.forEach(({ element: s3, html: o2, ariaL: u3, ariaH: l3 }) => {
        s3.innerHTML = o2, u3 ? s3.setAttribute("aria-label", u3) : s3.removeAttribute("aria-label"), l3 ? s3.setAttribute("aria-hidden", l3) : s3.removeAttribute("aria-hidden");
      }), this.chars.length = this.words.length = this.lines.length = t2.length = this.masks.length = 0, this.isSplit = false, ii2?.removeEventListener("loadingdone", this._split), i3 && (this._data.animTime = i3.totalTime(), i3.revert()), (r = (e = this.vars).onRevert) == null || r.call(e, this), this;
    }
    static create(e, r) {
      return new Pu(e, r);
    }
    static register(e) {
      Ei = Ei || e || window.gsap, Ei && ($n = Ei.utils.toArray, cs = Ei.core.context || cs), !Is && window.innerWidth > 0 && (ii2 = document.fonts, Is = true);
    }
  };
  ku.version = "3.13.0";
  var Ef = ku;

  // build/assets/pageNav-BWQMWhaW.js
  Ps.registerPlugin(q4);
  function N2() {
    const g4 = document.querySelectorAll(".pageNavLink"), v3 = document.querySelectorAll(".pageNavTarget"), s3 = document.querySelector(".pageNavCarousel");
    let u3;
    if (s3) {
      const t2 = s3.querySelector(".pageNavCarousel__carousel"), o2 = s3.querySelector(".pageNavCarousel__prev"), n3 = s3.querySelector(".pageNavCarousel__next");
      u3 = new _3(t2, { modules: [ri, Jt], slidesPerView: "auto", spaceBetween: 4, freeMode: true, centeredSlides: true, centeredSlidesBounds: true, focusableElements: "input, select, option, textarea, video, label", navigation: { prevEl: o2, nextEl: n3 } });
      const i3 = document.querySelector(".hero"), c = document.querySelector(".siteFooter"), e = s3.querySelector(".pageNavCarousel__container"), r = s3.querySelector(".pageNavCarousel__container > *");
      Ps.set(e, { clipPath: "inset(0px 100% 0% 0px round 100px)", xPercent: 50 }), Ps.set(r, { autoAlpha: 0 }), q4.create({ trigger: i3, start: "top top", end: "bottom 75%", onLeave: () => {
        let a20 = Ps.timeline({ onStart: () => u3.slideTo(0) });
        a20.to(e, { clipPath: "inset(0px 0% 0% 0px round 100px)", xPercent: 0, duration: 0.6, ease: "power3.inOut" }), a20.to(r, { autoAlpha: 1, duration: 0.6, ease: "power2.inOut" });
      }, onEnterBack: () => {
        let a20 = Ps.timeline();
        a20.to(r, { autoAlpha: 0, duration: 0.4, ease: "power2.inOut" }), a20.to(e, { clipPath: "inset(0px 100% 0% 0px round 100px)", xPercent: 50, duration: 0.4, ease: "power3.inOut" });
      } }), q4.create({ trigger: c, onEnter: () => {
        let a20 = Ps.timeline();
        a20.to(r, { autoAlpha: 0, duration: 0.4, ease: "power2.inOut" }), a20.to(e, { clipPath: "inset(0px 100% 0% 0px round 100px)", xPercent: 50, duration: 0.4, ease: "power3.inOut" });
      }, onLeaveBack: () => {
        let a20 = Ps.timeline();
        a20.to(e, { clipPath: "inset(0px 0% 0% 0px round 100px)", xPercent: 0, duration: 0.6, ease: "power3.inOut" }), a20.to(r, { autoAlpha: 1, duration: 0.6, ease: "power2.inOut" });
      } });
    }
    v3.forEach((t2, o2) => {
      const n3 = t2.id;
      q4.create({ trigger: t2, start: "0% 50%", end: "100% 50%", onEnter: () => {
        let i3 = document.querySelectorAll(`.pageNavLink[data-target="${n3}"`);
        i3.forEach((e) => e.classList.add("active")), s3 && u3.slideTo(o2), document.querySelectorAll(`.pageNavLink:not([data-target="${n3}"])`).forEach((e) => {
          e !== i3 && e.classList.remove("active");
        });
      }, onEnterBack: () => {
        let i3 = document.querySelectorAll(`.pageNavLink[data-target="${n3}"`);
        i3.forEach((e) => e.classList.add("active")), s3 && u3.slideTo(o2), document.querySelectorAll(`.pageNavLink:not([data-target="${n3}"])`).forEach((e) => {
          e !== i3 && e.classList.remove("active");
        });
      } });
    }), g4.forEach((t2) => {
      const o2 = document.querySelector(`#${t2.dataset.target}`);
      t2.addEventListener("click", () => {
        let n3 = document.querySelector(".siteHeader").offsetHeight, i3 = window.scrollY, c = window.scrollY + o2.getBoundingClientRect().top, e = document.querySelector(".px-container"), r = window.getComputedStyle(e).getPropertyValue("padding-left");
        r = r.replace("px", ""), i3 > c ? window.scrollTo({ top: c - n3 - r, behavior: "smooth" }) : window.scrollTo({ top: c - r, behavior: "smooth" });
      });
    });
    const p3 = document.querySelector(".pageNavDropdown");
    if (p3) {
      const t2 = p3.querySelector(".pageNavDropdown__trigger");
      window.addEventListener("click", (o2) => {
        p3.classList.contains("is-open") ? p3.classList.remove("is-open") : (o2.target == t2 || t2.contains(o2.target)) && p3.classList.add("is-open");
      });
    }
    document.querySelectorAll(".pageNavDropdown--fixed").forEach((t2) => {
      const o2 = t2.closest(".pageNavDropdown--fixed-container");
      Ps.matchMedia().add("(max-width: 1199px)", () => {
        q4.create({ trigger: o2, start: "top 25%", end: "bottom top", toggleClass: { targets: t2, className: "is-active" } });
      });
    });
  }

  // build/assets/filter-BhKxCLcr.js
  Ps.registerPlugin(q4);
  function l() {
    document.querySelectorAll(".filterSidebar--fixed").forEach((e) => {
      const i3 = e.closest(".filterSidebar--fixed-container");
      Ps.matchMedia().add("(max-width: 1199px)", () => {
        q4.create({ trigger: i3, start: "top 25%", end: "bottom top", toggleClass: { targets: e, className: "is-active" } });
      });
    });
  }

  // build/assets/map-Cz_uLUC5.js
  function v() {
    document.querySelectorAll(".interactiveMap").forEach((i3) => {
      const c = [...i3.querySelectorAll(".interactiveMap__link")], r = [...i3.querySelectorAll(".interactiveMap__content")], s3 = [...i3.querySelectorAll(".interactiveMap__region")], o2 = (t2) => {
        if (!t2) return null;
        const a20 = r.find((n3) => n3.dataset.content === t2), e = s3.find((n3) => n3.dataset.map === t2);
        return a20 && e ? { content: a20, svgRegion: e } : null;
      }, d2 = (t2) => {
        const a20 = o2(t2);
        a20 && (r.forEach((e) => {
          e.classList.toggle("active", e === a20.content);
        }), s3.forEach((e) => {
          e.classList.toggle("active", e === a20.svgRegion), e.getAttribute("role") === "button" && e.setAttribute("aria-pressed", String(e === a20.svgRegion));
        }));
      };
      c.forEach((t2) => {
        const a20 = () => d2(t2.dataset.link);
        t2.addEventListener("mouseenter", a20), t2.addEventListener("focus", a20);
      }), s3.forEach((t2) => {
        if (!t2.closest("[data-hover-regions]") || !o2(t2.dataset.map)) return;
        const a20 = c.find((n3) => n3.dataset.link === t2.dataset.map), e = () => d2(t2.dataset.map);
        t2.setAttribute("tabindex", "0"), t2.setAttribute("role", "button"), t2.setAttribute("aria-label", `Show ${a20?.textContent.trim() || t2.dataset.map}`), t2.setAttribute("aria-pressed", String(t2.classList.contains("active"))), t2.addEventListener("pointerenter", (n3) => {
          n3.pointerType !== "touch" && e();
        }), t2.addEventListener("focus", e), t2.addEventListener("click", e), t2.addEventListener("keydown", (n3) => {
          (n3.key === "Enter" || n3.key === " ") && (n3.preventDefault(), e());
        });
      });
      const u3 = r.find((t2) => t2.classList.contains("active")), f4 = s3.find((t2) => t2.classList.contains("active")), l3 = u3?.dataset.content;
      if (!l3 || f4?.dataset.map !== l3) {
        const t2 = c.find((a20) => o2(a20.dataset.link));
        d2(t2?.dataset.link);
      }
    });
  }

  // build/assets/marquee-Bezh54Iy.js
  Ps.registerPlugin(q4);
  function D2() {
    document.querySelectorAll("[data-marquee-scroll-direction-target]").forEach((e) => {
      const c = e.querySelector("[data-marquee-collection-target]"), t2 = e.querySelector("[data-marquee-scroll-target]");
      if (!c || !t2) return;
      const { marqueeSpeed: p3, marqueeDirection: g4, marqueeDuplicate: S3, marqueeScrollSpeed: q7 } = e.dataset, f4 = parseFloat(p3), r = g4 === "right" ? 1 : -1, s3 = parseInt(S3 || 0), n3 = parseFloat(q7), h2 = window.innerWidth < 479 ? 0.25 : window.innerWidth < 991 ? 0.5 : 1;
      let w4 = f4 * (c.offsetWidth / window.innerWidth) * h2;
      if (t2.style.marginLeft = `${n3 * -1}%`, t2.style.width = `${n3 * 2 + 100}%`, s3 > 0) {
        const a20 = document.createDocumentFragment();
        for (let o2 = 0; o2 < s3; o2++) a20.appendChild(c.cloneNode(true));
        t2.appendChild(a20);
      }
      const d2 = e.querySelectorAll("[data-marquee-collection-target]"), l3 = Ps.to(d2, { xPercent: -100, repeat: -1, duration: w4, ease: "linear" }).totalProgress(0.5);
      Ps.set(d2, { xPercent: r === 1 ? 100 : -100 }), l3.timeScale(r), l3.play(), e.setAttribute("data-marquee-status", "normal"), q4.create({ trigger: e, start: "top bottom", end: "bottom top", onUpdate: (a20) => {
        const o2 = a20.direction === 1, b4 = o2 ? -r : r;
        l3.timeScale(b4), e.setAttribute("data-marquee-status", o2 ? "normal" : "inverted");
      } });
      const A4 = Ps.timeline({ scrollTrigger: { trigger: e, start: "0% 100%", end: "100% 0%", scrub: 0 } }), u3 = r === -1 ? n3 : -n3, y3 = -u3;
      A4.fromTo(t2, { x: `${u3}vw` }, { x: `${y3}vw`, ease: "none" });
    });
  }

  // build/assets/vendor-venobox-BDbdDK2y.js
  var oe3;
  var V3;
  var p2;
  var x2;
  var se2;
  var B2;
  var s;
  var a18;
  var E3;
  var N3;
  var ee2;
  var Q3;
  var M2;
  var ne3;
  var A2;
  var q5;
  var k;
  var u2;
  var L;
  var g3;
  var U2;
  var y2;
  var h;
  var l2;
  var ae2;
  var ie3;
  var W3;
  var le3;
  var C2;
  var F2;
  var re2;
  var de2;
  var v2;
  var f3;
  var ce3;
  var te3;
  var G2;
  var P;
  var Z3 = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor">';
  var J2 = "</svg>";
  var ye2 = Z3 + '<path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>' + J2;
  var he3 = Z3 + '<path fill-rule="evenodd" d="M3.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 1 0-1h2A1.5 1.5 0 0 1 14 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-8A1.5 1.5 0 0 1 3.5 5h2a.5.5 0 0 1 0 1h-2z"/><path fill-rule="evenodd" d="M7.646.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 1.707V10.5a.5.5 0 0 1-1 0V1.707L5.354 3.854a.5.5 0 1 1-.708-.708l3-3z"/>' + J2;
  var xe3 = Z3 + '<path fill-rule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>' + J2;
  var $2 = 0;
  var _4 = 0;
  var T = 0;
  var Le2 = 50;
  var z = false;
  var Y3 = false;
  var R2 = false;
  var b2;
  var ve3 = false;
  var we3 = { bounce: ["sk-bounce", "sk-bounce-dot", 2], chase: ["sk-chase", "sk-chase-dot", 6], circle: ["sk-circle", "sk-circle-dot", 12], "circle-fade": ["sk-circle-fade", "sk-circle-fade-dot", 12], flow: ["sk-flow", "sk-flow-dot", 3], fold: ["sk-fold", "sk-fold-cube", 4], grid: ["sk-grid", "sk-grid-cube", 9], plane: ["sk-plane", "", 0], pulse: ["sk-pulse", "", 5], swing: ["sk-swing", "sk-swing-dot", 2], wander: ["sk-wander", "sk-wander-cube", 3], wave: ["sk-wave", "sk-wave-rect", 5] };
  var ke2 = { selector: ".venobox", autoplay: false, bgcolor: "#fff", border: "0", customClass: false, infinigall: false, maxWidth: "100%", navigation: true, navKeyboard: true, navTouch: true, navSpeed: 300, numeration: false, overlayClose: true, overlayColor: "rgba(23,23,23,0.95)", popup: false, ratio: "16x9", share: false, shareStyle: "pill", spinner: "bounce", spinColor: "#d2d2d2", titleattr: "title", titlePosition: "top", titleStyle: "bar", toolsBackground: "#1C1C1C", toolsColor: "#d2d2d2", onPreOpen: function() {
    return true;
  }, onPostOpen: function() {
  }, onPreClose: function() {
    return true;
  }, onNavComplete: function() {
  }, onContentLoaded: function() {
  }, onInit: function() {
  }, jQuerySelectors: false, focusItem: false, fitView: false, initialScale: 0.9, transitionSpeed: 200 };
  function Se3(e) {
    if (!e) return "Loading...";
    let t2 = '<div class="sk-center ' + e[0] + '">', o2 = 0;
    for (o2 = 0; o2 < e[2]; o2++) t2 += '<div class="' + e[1] + '"></div>';
    return t2 += "</div>", t2;
  }
  function I(e, t2, o2) {
    if (Object.prototype.toString.call(e) === "[object Object]") {
      let n3;
      for (n3 in e) Object.prototype.hasOwnProperty.call(e, n3) && t2.call(o2, e[n3], n3, e);
    } else {
      let n3 = 0, i3 = e.length;
      for (n3 = 0; n3 < i3; n3++) t2.call(o2, e[n3], n3, e);
    }
  }
  function Ce3(e, t2) {
    let o2 = {};
    return I(e, function(n3, i3) {
      o2[i3] = e[i3];
    }), I(t2, function(n3, i3) {
      o2[i3] = t2[i3];
    }), o2;
  }
  function X2(e) {
    return e;
  }
  function D3({ timing: e, draw: t2, duration: o2 }) {
    let n3 = performance.now();
    requestAnimationFrame(function i3(r) {
      let d2 = (r - n3) / o2;
      d2 > 1 && (d2 = 1);
      let c = e(d2);
      t2(c), d2 < 1 && requestAnimationFrame(i3);
    });
  }
  function Ae3(e) {
    let t2, o2, n3, i3 = /(https?:\/\/)?((www\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-z-]+)/i;
    if (o2 = e.match(i3), o2 && o2[7]) t2 = "youtube", n3 = o2[7];
    else {
      let r = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/;
      o2 = e.match(r), o2 && o2[5] && (t2 = "vimeo", n3 = o2[5]);
    }
    return { type: t2, id: n3 };
  }
  function Pe2(e) {
    let t2 = "", n3 = decodeURIComponent(e).split("?");
    if (n3[1] !== void 0) {
      let i3 = n3[1].split("&"), r, d2;
      for (d2 = 0; d2 < i3.length; d2++) r = i3[d2].split("="), t2 = t2 + "&" + r[0] + "=" + r[1];
    }
    return encodeURI(t2);
  }
  function Ee2(e) {
    return Y3.innerHTML = e, Y3.querySelectorAll("img");
  }
  function ue2(e) {
    if (!e) return false;
    L = true, a18 = e, y2 = false, h = false, ae2 = e.getAttribute("data-maxwidth") || e.settings.maxWidth, ie3 = e.getAttribute("data-overlay") || e.settings.overlayColor, W3 = e.getAttribute("data-ratio") || e.settings.ratio, le3 = e.hasAttribute("data-autoplay") || e.settings.autoplay, C2 = e.getAttribute("data-href") || e.getAttribute("href"), F2 = e.getAttribute("data-customclass") || e.settings.customClass, G2 = e.getAttribute(e.settings.titleattr) || "", ce3 = e.getAttribute("data-border") || e.settings.border, re2 = e.hasAttribute("data-fitview") || e.settings.fitView;
  }
  function j2() {
    if (!a18 || !document.body.classList.contains("vbox-open") || a18.settings.onPreClose && typeof a18.settings.onPreClose == "function" && a18.settings.onPreClose(a18, A2, v2, f3) === false) return false;
    document.body.removeEventListener("keydown", fe2), document.body.classList.remove("vbox-open"), a18.settings.focusItem && a18.focus(), D3({ duration: 200, timing: X2, draw: function(e) {
      l2.style.opacity = 1 - e, e === 1 && l2.remove();
    } });
  }
  function qe3() {
    w(v2);
  }
  function Me3() {
    w(f3);
  }
  function fe2(e) {
    e.keyCode === 27 && j2(), P || (e.keyCode == 37 && h === true && w(f3), e.keyCode == 39 && y2 === true && w(v2), P = setTimeout(() => {
      P = null;
    }, 100));
  }
  function Ie3() {
    L = false, s.style.opacity = 0, s.innerHTML = g3, Ye3();
    let e = s.querySelector(":first-child");
    e.classList.add("vbox-child"), e.style.backgroundColor = a18.settings.bgcolor, e.style.transform = "scale(" + a18.settings.initialScale + ")", e.style.transition = "transform " + a18.settings.transitionSpeed + "ms";
    let t2 = s.querySelector(".vbox-child img");
    t2 && t2.addEventListener("dragstart", function(o2) {
      o2.preventDefault();
    }), B2.scrollTo(0, 0), e.style.transform = "scale(1)", l2.style.setProperty("--vbox-padding", ce3), l2.style.setProperty("--vbox-max-width", ae2), I(l2.classList, function(o2) {
      o2 !== "vbox-overlay" && l2.classList.remove(o2);
    }), F2 && l2.classList.add(F2), re2 ? s.classList.add("vbox-fit") : s.classList.remove("vbox-fit"), D3({ duration: a18.settings.transitionSpeed, timing: X2, draw: function(o2) {
      s.style.opacity = o2, o2 === 1 && M2.classList.add("vbox-hidden");
    } }), a18.settings.onContentLoaded && typeof a18.settings.onContentLoaded == "function" && a18.settings.onContentLoaded(g3);
  }
  function m2(e) {
    s.classList.contains("vbox-" + e) || Ie3();
  }
  function Te2(e, t2) {
    s.classList.add("vbox-loading"), g3 = '<div class="venoratio venoratio-' + t2 + '"><iframe src="' + e + '"></iframe></div>', s.classList.remove("vbox-loading"), m2("animated");
  }
  function He3(e, t2, o2) {
    s.classList.add("vbox-loading");
    let n3, i3 = Ae3(e);
    if (i3.type == "vimeo" || i3.type == "youtube") {
      let r;
      n3 = o2 ? "?rel=0&autoplay=1" : "?rel=0";
      let d2 = n3 + Pe2(e);
      i3.type == "vimeo" ? r = "https://player.vimeo.com/video/" : i3.type == "youtube" && (r = "https://www.youtube-nocookie.com/embed/"), g3 = '<div class="venoratio venoratio-' + t2 + '"><iframe webkitallowfullscreen mozallowfullscreen allowfullscreen allow="autoplay" frameborder="0" src="' + r + i3.id + d2 + '"></iframe></div>';
    } else n3 = o2 ? " autoplay" : "", g3 = '<div class="venoratio venoratio-' + t2 + '"><video src="' + e + '"' + n3 + " controls>Your browser does not support the video tag.</video></div>";
    s.classList.remove("vbox-loading"), m2("animated");
  }
  function Oe3(e) {
    let t2 = document.querySelector(e);
    t2 && (s.classList.add("vbox-loading"), g3 = '<div class="vbox-inline">' + t2.innerHTML + "</div>", s.classList.remove("vbox-loading"), m2("animated"));
  }
  function Ve2() {
    if (q5 = Ee2(g3), q5.length) {
      let e = 0;
      I(q5, function(t2) {
        let o2 = t2.src;
        const n3 = new Image();
        n3.onload = function() {
          e++, e == q5.length && (s.classList.remove("vbox-loading"), m2("animated"));
        }, n3.onerror = function() {
          e++, e == q5.length && (s.classList.remove("vbox-loading"), m2("animated"));
        }, n3.src = o2;
      });
    } else s.classList.remove("vbox-loading"), m2("animated");
  }
  function Be3(e) {
    s.classList.add("vbox-loading");
    let t2 = new XMLHttpRequest();
    t2.open("GET", e, true), t2.onload = function() {
      g3 = '<div class="vbox-inline">' + t2.response + "</div>", Ve2();
    }, t2.onerror = function() {
      g3 = '<div class="vbox-inline"></div>', s.classList.remove("vbox-loading"), m2("animated");
    }, t2.send();
  }
  function _e2(e) {
    R2.onload = function() {
      g3 = '<div class="vbox-child"><img src="' + e + '"></div>', s.classList.remove("vbox-loading"), m2("animated");
    }, R2.src = e;
  }
  function H3(e) {
    if (!L) {
      let t2 = a18.settings.navSpeed * 0.84;
      s.style.transition = "margin " + t2 + "ms ease-out, opacity " + t2 + "ms ease-out", $2 = _4 = e.type === "touchstart" ? e.touches[0].pageX : e.pageX, de2 = Q3 = e.type === "touchstart" ? e.touches[0].pageY : e.pageY, z = true;
    }
  }
  function S2(e) {
    if (z) {
      z = false;
      let t2 = a18, o2 = false;
      T = _4 - $2, T < 0 && y2 && (t2 = v2, o2 = true), T > 0 && h && (t2 = f3, o2 = true), Math.abs(T) >= Le2 && o2 ? w(t2) : (s.style.marginLeft = 0, s.style.opacity = 1);
    }
  }
  function O(e) {
    if (z && !L) {
      _4 = e.type === "touchmove" ? e.touches[0].pageX : e.pageX, Q3 = e.type === "touchmove" ? e.touches[0].pageY : e.pageY, N3 = _4 - $2, ee2 = Q3 - de2;
      let t2 = Math.abs(N3), o2 = Math.abs(ee2);
      if (t2 > o2 && t2 <= 180) {
        let n3 = (1 - t2 / 180) * 1.5;
        e.preventDefault(), s.style.marginLeft = N3 + "px", s.style.opacity = n3;
      }
    }
  }
  function ze3(e) {
    if (navigator.canShare) {
      const o2 = { url: e };
      p2.insertAdjacentHTML("beforeend", '<div class="vbox-link-btn vbox-share-mobile">' + he3 + "</div>"), p2.querySelector(".vbox-share-mobile").addEventListener("click", function(i3) {
        i3.preventDefault(), navigator.share(o2);
      });
    }
    p2.insertAdjacentHTML("beforeend", '<a target="_blank" href="' + e + '" download>' + ye2 + "</a>"), p2.insertAdjacentHTML("beforeend", '<div class="vbox-tooltip"><div class="vbox-link-btn vbox-share-copy"><span class="vbox-tooltip-text" id="myTooltip"></span>' + xe3 + "</div ></div>"), p2.querySelector(".vbox-share-copy").addEventListener("click", function(o2) {
      o2.preventDefault();
      let n3 = document.getElementById("myTooltip");
      navigator.clipboard.writeText(e).then(function() {
        n3.innerHTML = '<div class="vbox-tooltip-inner">Copied</div>';
      }, function() {
        console.log("copy failed");
      });
    });
  }
  function Ye3() {
    ve3 ? (s.classList.add("vbox-grab"), s.addEventListener("touchstart", H3, false), s.addEventListener("touchend", S2, false), s.addEventListener("touchmove", O, false), s.addEventListener("mousedown", H3, false), s.addEventListener("mouseup", S2, false), s.addEventListener("mouseout", S2, false), s.addEventListener("mousemove", O, false)) : (s.classList.remove("vbox-grab"), s.removeEventListener("touchstart", H3, false), s.removeEventListener("touchend", S2, false), s.removeEventListener("touchmove", O, false), s.removeEventListener("mousedown", H3, false), s.removeEventListener("mouseup", S2, false), s.removeEventListener("mouseout", S2, false), s.removeEventListener("mousemove", O, false));
  }
  function pe3(e) {
    if (!e) return false;
    te3 = e.dataset.gall, U2 = e.settings.numeration, k = e.settings.infinigall, p2.innerHTML = "";
    let t2 = e.dataset.vbtype;
    e.settings.share && t2 !== "iframe" && t2 !== "inline" && t2 !== "ajax" && ze3(e.href), u2 = document.querySelectorAll('.vbox-item[data-gall="' + te3 + '"]'), E3 = Array.prototype.indexOf.call(u2, e), u2.length < 2 && (U2 = false), u2.length < 3 && (k = false), v2 = u2[E3 + 1], f3 = u2[E3 - 1], !v2 && k && (v2 = u2[0]), !f3 && k && (f3 = u2[u2.length - 1]), u2.length >= 1 ? (A2 = E3 + 1, V3.innerHTML = A2 + " / " + u2.length) : A2 = 1, U2 ? V3.classList.remove("vbox-hidden") : V3.classList.add("vbox-hidden"), G2 !== "" ? x2.classList.remove("vbox-hidden") : x2.classList.add("vbox-hidden"), x2.innerHTML = G2, h = false, y2 = false, (v2 || k) && (y2 = true), (E3 > 0 || k) && (h = true), ve3 = (h || y2) && e.settings.navTouch;
    let o2 = l2.querySelector(".vbox-next"), n3 = l2.querySelector(".vbox-prev");
    h ? n3.classList.remove("vbox-hidden") : n3.classList.add("vbox-hidden"), y2 ? o2.classList.remove("vbox-hidden") : o2.classList.add("vbox-hidden"), e.settings.navigation || (o2.classList.add("vbox-hidden"), n3.classList.add("vbox-hidden"));
  }
  function me2(e) {
    if (!e) return false;
    oe3.style.backgroundColor = ie3, ne3.innerHTML = Se3(we3[e.settings.spinner]), l2.style.setProperty("--sk-color", e.settings.spinColor), M2.classList.remove("vbox-hidden"), p2.classList.remove("vbox-top", "vbox-bottom"), x2.classList.remove("vbox-top", "vbox-bottom"), e.settings.titlePosition == "top" ? (x2.classList.add("vbox-top"), p2.classList.add("vbox-bottom")) : (x2.classList.add("vbox-bottom"), p2.classList.add("vbox-top"));
    let t2 = e.settings.titleStyle === "bar" ? "100%" : "auto", o2 = e.settings.titleStyle === "pill" ? "5em" : "0", n3 = e.settings.shareStyle === "bar" ? "100%" : "auto", i3 = e.settings.shareStyle === "pill" ? "5em" : "0", r = e.settings.titleStyle === "transparent" ? "transparent" : e.settings.toolsBackground, d2 = e.settings.shareStyle === "transparent" ? "transparent" : e.settings.toolsBackground;
    l2.style.setProperty("--vbox-title-width", t2), l2.style.setProperty("--vbox-title-radius", o2), l2.style.setProperty("--vbox-share-width", n3), l2.style.setProperty("--vbox-share-radius", i3), l2.style.setProperty("--vbox-tools-color", e.settings.toolsColor), l2.style.setProperty("--vbox-title-background", r), l2.style.setProperty("--vbox-share-background", d2);
  }
  function ge2() {
    if (!a18) return false;
    switch (a18.dataset.vbtype) {
      case "iframe":
        Te2(C2, W3);
        break;
      case "inline":
        Oe3(C2);
        break;
      case "ajax":
        Be3(C2);
        break;
      case "video":
        He3(C2, W3, le3);
        break;
      default:
        _e2(C2);
    }
  }
  function w(e) {
    if (!e || L || !document.body.classList.contains("vbox-open")) return false;
    ue2(e), me2(e);
    const t2 = a18.settings.navSpeed * 0.84;
    s.style.transition = "margin " + t2 + "ms ease-out, opacity " + t2 + "ms ease-out", e === f3 && s.classList.add("swipe-right"), e === v2 && s.classList.add("swipe-left"), M2.classList.remove("vbox-hidden");
    const o2 = s.style.opacity;
    s.classList.add("vbox-animated", "vbox-loading"), b2 = s.cloneNode(false), b2.classList.add("cloned"), b2.classList.remove("swipe-left", "swipe-right"), b2.style.opacity = 0, b2.style.marginLeft = "0", b2.style.marginRight = "0";
    const n3 = s;
    B2.append(b2), s = b2, s.classList.remove("cloned"), pe3(e), D3({ duration: a18.settings.navSpeed, timing: X2, draw: function(i3) {
      n3.style.opacity = o2 - i3 / o2, i3 === 1 && (n3.remove(), s.classList.remove("vbox-animated"), m2("loading"), L = false, a18.settings.onNavComplete && typeof a18.settings.onNavComplete == "function" && a18.settings.onNavComplete(a18, A2, v2, f3));
    } }), ge2();
  }
  function K2(e) {
    if (document.body.classList.contains("vbox-open") || !e || e.settings.onPreOpen && typeof e.settings.onPreOpen == "function" && e.settings.onPreOpen(e) === false) return false;
    ue2(e), document.body.insertAdjacentHTML("beforeend", se2), document.body.classList.add("vbox-open"), l2 = document.querySelector(".vbox-overlay"), oe3 = l2.querySelector(".vbox-backdrop"), B2 = l2.querySelector(".vbox-container"), s = B2.querySelector(".vbox-content"), V3 = l2.querySelector(".vbox-num"), p2 = l2.querySelector(".vbox-share"), x2 = l2.querySelector(".vbox-title"), M2 = l2.querySelector(".vbox-preloader"), ne3 = M2.querySelector(".vbox-preloader-inner"), l2.style.opacity = 0, me2(e), pe3(e), s.classList.add("vbox-animated", "vbox-loading"), D3({ duration: 200, timing: X2, draw: function(t2) {
      l2.style.opacity = t2, t2 === 1 && (s.classList.remove("vbox-animated"), L = false, m2("loading"), a18.settings.onPostOpen && typeof a18.settings.onPostOpen == "function" && a18.settings.onPostOpen(a18, A2, v2, f3));
    } }), ge2(), e.settings.navKeyboard && (document.body.addEventListener("keydown", fe2), document.body.addEventListener("keyup", () => {
      P && (clearTimeout(P), P = null);
    })), document.querySelector(".vbox-prev").addEventListener("click", function() {
      w(f3);
    }), document.querySelector(".vbox-next").addEventListener("click", function() {
      w(v2);
    }), l2.addEventListener("click", function(t2) {
      let o2 = document.querySelector(".vbox-close");
      o2 && (o2.contains(t2.target) || o2 === t2.target || a18.settings.overlayClose && (t2.target.classList.contains("vbox-overlay") || t2.target.classList.contains("vbox-content") || t2.target.classList.contains("vbox-backdrop") || t2.target.classList.contains("vbox-close") || t2.target.classList.contains("vbox-preloader") || t2.target.classList.contains("vbox-container"))) && j2();
    });
  }
  function Re3(e, t2) {
    t2.onInit && typeof t2.onInit == "function" && t2.onInit(e);
    let o2 = t2.jQuerySelectors || document.querySelectorAll(t2.selector);
    if (se2 = '<div class="vbox-overlay"><div class="vbox-backdrop"></div><div class="vbox-preloader"><div class="vbox-preloader-inner"></div></div><div class="vbox-container"><div class="vbox-content"></div></div><div class="vbox-title"></div><div class="vbox-left-corner"><div class="vbox-num">0/0</div></div><div class="vbox-close"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" class="vbox-close-icon" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"/><path fill-rule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"/></svg></div><a class="vbox-next"><span>Next</span></a><a class="vbox-prev"><span>Prev</span></a><div class="vbox-share"></div></div>', Y3 = Y3 || document.createElement("div"), R2 = R2 || new Image(), I(o2, function(c) {
      if (c instanceof Element) {
        if (c.classList.contains("vbox-item")) return true;
        c.settings = t2, c.classList.add("vbox-item"), c.addEventListener("click", function(be2) {
          return be2.preventDefault(), c.blur(), K2(c), false;
        });
      }
    }), t2.popup) {
      let c = document.querySelector(t2.popup);
      c.settings = t2, K2(c);
    }
  }
  var Xe2 = function(e) {
    const t2 = {};
    let o2 = Ce3(ke2, e || {});
    return t2.close = j2, t2.next = qe3, t2.prev = Me3, t2.open = K2, t2.settings = o2, Re3(t2, o2), t2;
  };
  typeof jQuery == "function" && (function(e) {
    e.fn.extend({ venobox: function(t2) {
      const o2 = t2 || {};
      o2.jQuerySelectors = this, new Xe2(o2);
    } });
  })(jQuery);

  // build/assets/modal-KcZojZ-m.js
  function n2() {
    new Xe2(), document.querySelectorAll(".venobox").forEach((e) => {
      e.addEventListener("click", () => {
        setTimeout(() => {
          document.querySelector(".vbox-overlay").setAttribute("data-lenis-prevent", "");
        }, 100);
      });
    });
  }

  // build/assets/home-CcwUgWZj.js
  function _5() {
    const e = document.querySelector(".homeDestinations");
    if (e) {
      const i3 = e.querySelector(".homeDestinationsCarousel"), a20 = e.querySelector(".homeDestinationsBackground"), r = e.querySelector(".homeDestinations__prev"), f4 = e.querySelector(".homeDestinations__next"), c = e.querySelector(".homeDestinations__pagination"), h2 = e.querySelectorAll(".homeDestinationsCarousel__slide");
      let d2 = [];
      h2.forEach((s3) => {
        d2.push(s3.dataset.slideTitle);
      });
      const v3 = new _3(a20, { modules: [ii, ai, Jt, ei, ti], loop: true, followFinger: false, parallax: true, speed: 1500, effect: "creative", creativeEffect: { prev: { translate: ["-100%", 0, -1] }, next: { translate: ["100%", 0, 0] } } });
      new _3(i3, { modules: [si, ii, ni, Jt, ei, ti], loop: true, followFinger: false, parallax: true, speed: 1500, effect: "fade", fadeEffect: { crossFade: true }, autoplay: { delay: 6e3, disableOnInteraction: false, pauseOnMouseEnter: true }, navigation: { prevEl: r, nextEl: f4 }, pagination: { el: c, clickable: true, renderBullet: function(s3, p3) {
        return '<button class="' + p3 + '"><span class="progress-indicator"></span><span class="label">' + d2[s3] + "</span></button>";
      } }, controller: { control: v3 }, on: { autoplayTimeLeft(s3, p3, P3) {
        c.style.setProperty("--progress", 1 - P3);
      } } });
    }
    const t2 = document.querySelector(".homeAccommodation");
    if (t2) {
      const i3 = t2.querySelector(".homeAccommodation__main"), a20 = t2.querySelector(".homeAccommodation__prev"), r = t2.querySelector(".homeAccommodation__next");
      new _3(i3, { modules: [ai, Jt, ti], slidesPerView: 1, centeredSlides: true, loop: true, parallax: true, speed: 500, effect: "creative", creativeEffect: { limitProgress: 2, prev: { opacity: 0.5, translate: ["-100%", 0, 0] }, next: { opacity: 0.5, translate: ["100%", 0, 0] } }, navigation: { prevEl: a20, nextEl: r }, breakpoints: { 720: { slidesPerView: 1.5 }, 960: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } } });
    }
    document.querySelector(".homeVideoReviews") && new _3(".homeVideoReviews", { modules: [Jt], slidesPerView: 1.5, spaceBetween: 12, centerInsufficientSlides: true, navigation: { prevEl: ".homeVideoReviews__prev", nextEl: ".homeVideoReviews__next" }, breakpoints: { 600: { spaceBetween: 14, slidesPerView: 2 }, 800: { spaceBetween: 16, slidesPerView: 3 }, 1e3: { spaceBetween: 18, slidesPerView: 3.5 }, 1200: { spaceBetween: 20, slidesPerView: 4 }, 1400: { spaceBetween: 22, slidesPerView: 4 }, 1600: { spaceBetween: 24, slidesPerView: 4 }, 1800: { spaceBetween: 26, slidesPerView: 4 }, 2e3: { spaceBetween: 28, slidesPerView: 4 }, 2200: { spaceBetween: 30, slidesPerView: 4 }, 2400: { spaceBetween: 32, slidesPerView: 4 } } });
  }

  // build/assets/hero-DnMSa2uM.js
  Ps.registerPlugin(q4);
  function a19() {
    const r = document.querySelector(".hero:not(.destinationsHero)");
    if (r) {
      const t2 = r.querySelector(".hero__main"), n3 = r.querySelector(".hero__background");
      Ps.to(t2, { y: 300, ease: "none", scrollTrigger: { trigger: r, start: "top top", end: "bottom top", scrub: true } }), n3 && Ps.to(n3, { y: 300, ease: "none", scrollTrigger: { trigger: r, start: "top top", end: "bottom top", scrub: true } });
    }
    const s3 = document.querySelector(".processHero");
    if (s3) {
      const t2 = s3.querySelector(".processHero__background");
      Ps.to(t2, { yPercent: 10, ease: "none", scrollTrigger: { trigger: s3, start: "top top", end: "bottom top", scrub: true } });
    }
    const e = document.querySelector(".destinationsHero");
    if (e) {
      const t2 = e.querySelector(".destinationsHero__images"), n3 = e.querySelector(".hero__main");
      Ps.to(e, { backgroundColor: "#efeeed", ease: "none", scrollTrigger: { trigger: e, start: "top top", end: "bottom top", scrub: true } }), Ps.to(t2, { yPercent: 100, autoAlpha: 0, scale: 1.5, filter: "blur(40px)", backgroundColor: "#efeeed", ease: "none", scrollTrigger: { trigger: e, start: "top top", end: "bottom top", scrub: true } }), Ps.to(n3, { yPercent: 50, autoAlpha: 0, scale: 1.1, filter: "blur(20px)", ease: "none", scrollTrigger: { trigger: e, start: "top top", end: "bottom 50%", scrub: true } });
    }
  }

  // build/assets/home-motion-DtuxTvIB.js
  Ps.registerPlugin(q4);
  function i2() {
    document.querySelector(".homeVideo") && (Ps.set(".homeVideo video", { clipPath: "inset(20%)" }), Ps.to(".homeVideo video", { clipPath: "inset(0%)", ease: "none", scrollTrigger: { trigger: ".homeVideo", start: "center bottom", end: "bottom bottom", scrub: true } }), Ps.to(".homeVideo__container", { yPercent: 30, ease: "none", scrollTrigger: { trigger: ".homeVideo", start: "bottom bottom", end: "bottom top", scrub: true } })), document.querySelectorAll(".homeJourney__image").forEach((o2) => {
      Ps.to(o2.querySelectorAll("img"), { yPercent: 20, ease: "none", scrollTrigger: { trigger: o2, start: "top bottom", end: "bottom top", scrub: true } });
    });
  }

  // build/assets/cursor-AbSUxP3_.js
  function q6() {
    let e = document.querySelector(".cursor"), u3 = e.querySelector("p"), x4 = document.querySelectorAll("[data-cursor]"), d2 = 0, a20 = 0, l3 = null, o2 = "";
    Ps.set(e, { xPercent: d2, yPercent: a20 });
    let y3 = Ps.quickTo(e, "x", { ease: "power3" }), m3 = Ps.quickTo(e, "y", { ease: "power3" });
    const i3 = () => e.offsetWidth + 16;
    window.addEventListener("mousemove", (t2) => {
      let r = window.innerWidth, p3 = window.innerHeight, s3 = window.scrollY, w4 = t2.clientX, f4 = t2.clientY + s3, h2 = d2, T2 = a20, g4 = i3();
      if (w4 > r - g4 && (h2 = -100), f4 > s3 + p3 * 0.9 && (T2 = -120), l3) {
        let c = l3.getAttribute("data-cursor");
        c !== o2 && (u3.innerHTML = c, o2 = c, g4 = i3());
      }
      Ps.to(e, { xPercent: h2, yPercent: T2, duration: 0.9, ease: "power3" }), y3(w4), m3(f4 - s3);
    }), x4.forEach((t2) => {
      t2.addEventListener("mouseenter", () => {
        l3 = t2;
        let r = t2.getAttribute("data-cursor");
        r !== o2 && (u3.innerHTML = r, o2 = r, i3());
      });
    });
  }

  // build/assets/animation-CTtElpXO.js
  Ps.registerPlugin(q4);
  Ps.registerPlugin(Ef);
  function w2() {
    if (document.querySelector(".handReveal") && Ps.set(".handReveal", { autoAlpha: 0 }), document.querySelector(".headingReveal") && Ps.set(".headingReveal", { autoAlpha: 0 }), document.querySelector(".fadeInReveal") && Ps.set(".fadeInReveal", { autoAlpha: 0, y: 40 }), document.querySelector(".cardCarousel") && Ps.set(".cardCarousel .card", { autoAlpha: 0, y: 40 }), document.querySelector(".homeVideoReviews") && Ps.set(".homeVideoReviews__slide", { autoAlpha: 0, y: 40 }), document.querySelectorAll(".imageMontage").forEach((r) => {
      const n3 = r.querySelector(".imageMontage__primary"), t2 = r.querySelector(".imageMontage__secondary img"), o2 = r.querySelector(".imageMontage__tertiary");
      function a20(i3, l3, c) {
        i3 && (Ps.set(i3, { yPercent: l3 }), Ps.to(i3, { yPercent: c, ease: "none", scrollTrigger: { trigger: r, start: "top bottom", end: "bottom top", scrub: true } }));
      }
      a20(n3, 5, -5), a20(t2, -5, 5), a20(o2, -5, 10);
    }), document.querySelectorAll(".processDrawers").forEach((r) => {
      const n3 = r.querySelectorAll(".processDrawers__section");
      n3.forEach((t2, o2) => {
        const a20 = t2.querySelector(".processDrawers__title"), i3 = t2.querySelector(".processDrawers__subheading"), l3 = t2.querySelector(".processDrawers__heading"), c = n3.length;
        let p3 = Ps.matchMedia();
        Ps.set(i3, { autoAlpha: 0 }), Ps.set(l3, { autoAlpha: 0 }), p3.add("(max-width: 959px)", () => {
          function g4() {
            Ps.set(t2, { "--title-width": `${a20.offsetHeight}px`, "--title-offset": `${a20.offsetHeight * o2}px`, width: "100%", height: () => window.innerHeight - document.querySelector(".siteHeader").offsetHeight - a20.offsetHeight * o2 }), Ps.set(r, { height: "auto" }), q4.refresh();
          }
          g4(), window.addEventListener("resize", g4), Ps.set(i3, { autoAlpha: 1 }), Ps.set(l3, { autoAlpha: 1 }), Ef.create(i3, { type: "words, chars", charsClass: "char", autoSplit: true, onSplit: (d2) => Ps.from(d2.chars, { autoAlpha: 0, filter: "blur(5px)", duration: 2, ease: "expo.out", stagger: 0.02, scrollTrigger: { trigger: t2, once: true, start: "bottom bottom+=200px" } }) }), Ef.create(l3, { type: "lines", charsClass: "line", autoSplit: true, onSplit: (d2) => Ps.from(d2.lines, { autoAlpha: 0, y: 40, filter: "blur(20px)", duration: 2, ease: "expo.out", stagger: 0.15, scrollTrigger: { trigger: t2, once: true, start: "bottom bottom+=200px" } }) });
        }), p3.add("(min-width: 960px)", () => {
          function g4() {
            Ps.set(t2, { "--title-width": `${a20.offsetHeight}px`, width: () => r.offsetWidth - a20.offsetHeight * (c - 1), height: "100%" }), Ps.set(r, { height: () => t2.offsetHeight * (c + 1) }), q4.refresh();
          }
          if (g4(), window.addEventListener("resize", g4), o2 !== 0) {
            let d2 = Ps.fromTo(t2, { x: () => r.offsetWidth - a20.offsetHeight * (c - o2) }, { x: () => 0 + a20.offsetHeight * o2, ease: "none", scrollTrigger: { trigger: r, start: () => `${t2.offsetHeight * o2} 50%`, end: () => `${t2.offsetHeight * (o2 + 1)} 50%`, scrub: true, invalidateOnRefresh: true } });
            Ps.set(i3, { autoAlpha: 1 }), Ps.set(l3, { autoAlpha: 1 }), Ef.create(i3, { type: "words, chars", charsClass: "char", autoSplit: true, onSplit: (y3) => Ps.from(y3.chars, { autoAlpha: 0, filter: "blur(5px)", duration: 2, ease: "expo.out", stagger: 0.02, scrollTrigger: { trigger: t2, containerAnimation: d2, once: true, start: "left 50%" } }) }), Ef.create(l3, { type: "lines", charsClass: "line", autoSplit: true, onSplit: (y3) => Ps.from(y3.lines, { autoAlpha: 0, y: 40, filter: "blur(20px)", duration: 2, ease: "expo.out", stagger: 0.15, scrollTrigger: { trigger: t2, containerAnimation: d2, once: true, start: "left 50%" } }) });
          } else Ps.set(i3, { autoAlpha: 1 }), Ps.set(l3, { autoAlpha: 1 });
        });
      });
    }), Ps.matchMedia().add("(hover: hover) and (pointer: fine)", () => {
      document.querySelectorAll(".tripListings--alternate").forEach((n3) => {
        n3.querySelectorAll(".tripListings__item").forEach((o2) => {
          const a20 = o2.querySelector(".tripListings__image"), i3 = o2.querySelector(".tripListings__image.right");
          let l3 = Ps.utils.random(10, 20, true), c = Ps.utils.random(-20, 10, true), p3 = Ps.utils.random(-10, 10, true);
          Ps.set(a20, { autoAlpha: 0, rotate: 0, yPercent: () => l3() }), Ps.set(i3, { autoAlpha: 0, rotate: 0, yPercent: () => l3() });
          let g4 = Ps.timeline({ paused: true });
          g4.to(a20, { autoAlpha: 1, rotate: () => p3(), yPercent: () => c(), duration: 0.5, ease: "power2.out", delay: 0.1 }), g4.to(i3, { autoAlpha: 1, rotate: () => p3(), yPercent: () => c(), duration: 0.5, ease: "power2.out" }, "<+0.2"), o2.addEventListener("mouseenter", () => {
            g4.timeScale(1).play();
          }), o2.addEventListener("mouseleave", () => {
            g4.timeScale(2).reverse();
          });
        });
      });
    }), document.querySelectorAll(".destinationsScrollSection").forEach((r) => {
      const n3 = r.querySelector(".destinationsScrollSection__inner"), t2 = r.querySelectorAll(".destinationsScrollSection__image--lg");
      let o2 = Ps.to(n3, { x: () => (n3.offsetWidth - document.body.clientWidth) * -1, ease: "none", scrollTrigger: { trigger: r, start: "top top", end: "bottom bottom", scrub: true, invalidateOnRefresh: true } });
      t2.forEach((a20) => {
        const i3 = a20.querySelector("img");
        Ps.to(i3, { xPercent: 20, ease: "none", scrollTrigger: { trigger: a20, containerAnimation: o2, start: "left right", end: "right left", scrub: true, invalidateOnRefresh: true } });
      });
    }), document.querySelector(".tailormadeScroll")) {
      const r = document.querySelectorAll(".tailormadeScroll__item"), n3 = document.querySelectorAll(".tailormadeScroll__image > img");
      Ps.set(n3, { scale: 1.1, autoAlpha: 0, filter: "blur(20px)" }), r.forEach((t2, o2) => {
        const a20 = t2.dataset.item, i3 = t2.children, l3 = document.querySelectorAll(`.tailormadeScroll__image[data-item="${a20}"] > img`);
        Ps.set(i3, { opacity: 0.2 }), q4.create({ trigger: () => o2 == 0 ? "html" : t2, endTrigger: () => o2 == r.length - 1 ? "html" : t2, start: "top 50%", end: "bottom 50%", onToggle: (c) => {
          c.isActive ? (Ps.to(i3, { opacity: 1 }), Ps.to(l3, { scale: 1, autoAlpha: 1, filter: "blur(0px)", duration: 1, ease: "power3.inOut", stagger: 0.1 })) : (Ps.to(i3, { opacity: 0.2 }), Ps.to(l3, { scale: 1.1, autoAlpha: 0, filter: "blur(20px)", duration: 1, ease: "power3.inOut", stagger: 0.1 }));
        } });
      });
    }
  }
  function b3() {
    q4.refresh(), document.fonts.ready.then(() => {
      document.querySelectorAll(".handReveal").forEach((u3) => {
        Ps.fromTo(u3, { autoAlpha: 0, filter: "blur(5px)" }, { autoAlpha: 1, filter: "blur(0px)", duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: u3, once: true, start: u3.getBoundingClientRect().top + window.scrollY > window.innerHeight ? "top 80%" : "top bottom" } });
      }), document.querySelectorAll(".headingReveal").forEach((u3) => {
        Ps.fromTo(u3, { autoAlpha: 0, y: 40, filter: "blur(20px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: u3, once: true, start: u3.getBoundingClientRect().top + window.scrollY > window.innerHeight ? "top 80%" : "top bottom" } });
      });
    }), document.querySelector(".fadeInReveal") && q4.batch(".fadeInReveal", { batchMax: 10, onEnter: (s3) => {
      Ps.to(s3, { autoAlpha: 1, y: 0, duration: 2, ease: "expo.out", stagger: 0.15 });
    }, start: (s3) => s3.trigger.getBoundingClientRect().top + window.scrollY > window.innerHeight ? "top bottom-=150px" : "top bottom", once: true }), document.querySelector(".homeVideoReviews") && Ps.to(".homeVideoReviews__slide", { autoAlpha: 1, y: 0, duration: 2, ease: "expo.out", stagger: 0.15, clearProps: "all", scrollTrigger: { trigger: ".homeVideoReviews", start: (s3) => s3.trigger.getBoundingClientRect().top + window.scrollY > window.innerHeight ? "top bottom-=150px" : "top bottom", once: true } }), document.querySelectorAll(".cardCarousel").forEach((s3) => {
      const f4 = s3.querySelectorAll(".card");
      Ps.to(f4, { autoAlpha: 1, y: 0, duration: 2, ease: "expo.out", stagger: 0.15, clearProps: "all", scrollTrigger: { trigger: s3, start: (u3) => u3.trigger.getBoundingClientRect().top + window.scrollY > window.innerHeight ? "top bottom-=150px" : "top bottom", once: true } });
    });
  }

  // build/assets/vendor-lenis-Dr-F7vXe.js
  var H4 = Object.defineProperty;
  var x3 = (t2, i3, e) => i3 in t2 ? H4(t2, i3, { enumerable: true, configurable: true, writable: true, value: e }) : t2[i3] = e;
  var s2 = (t2, i3, e) => x3(t2, typeof i3 != "symbol" ? i3 + "" : i3, e);
  var O2 = "1.3.4";
  function W4(t2, i3, e) {
    return Math.max(t2, Math.min(i3, e));
  }
  function M3(t2, i3, e) {
    return (1 - e) * t2 + e * i3;
  }
  function k2(t2, i3, e, o2) {
    return M3(t2, i3, 1 - Math.exp(-e * o2));
  }
  function D4(t2, i3) {
    return (t2 % i3 + i3) % i3;
  }
  var C3 = class {
    constructor() {
      s2(this, "isRunning", false);
      s2(this, "value", 0);
      s2(this, "from", 0);
      s2(this, "to", 0);
      s2(this, "currentTime", 0);
      s2(this, "lerp");
      s2(this, "duration");
      s2(this, "easing");
      s2(this, "onUpdate");
    }
    advance(t2) {
      if (!this.isRunning) return;
      let i3 = false;
      if (this.duration && this.easing) {
        this.currentTime += t2;
        const e = W4(0, this.currentTime / this.duration, 1);
        i3 = e >= 1;
        const o2 = i3 ? 1 : this.easing(e);
        this.value = this.from + (this.to - this.from) * o2;
      } else this.lerp ? (this.value = k2(this.value, this.to, this.lerp * 60, t2), Math.round(this.value) === this.to && (this.value = this.to, i3 = true)) : (this.value = this.to, i3 = true);
      i3 && this.stop(), this.onUpdate?.(this.value, i3);
    }
    stop() {
      this.isRunning = false;
    }
    fromTo(t2, i3, { lerp: e, duration: o2, easing: l3, onStart: n3, onUpdate: h2 }) {
      this.from = this.value = t2, this.to = i3, this.lerp = e, this.duration = o2, this.easing = l3, this.currentTime = 0, this.isRunning = true, n3?.(), this.onUpdate = h2;
    }
  };
  function X3(t2, i3) {
    let e;
    return function(...o2) {
      let l3 = this;
      clearTimeout(e), e = setTimeout(() => {
        e = void 0, t2.apply(l3, o2);
      }, i3);
    };
  }
  var Y4 = class {
    constructor(t2, i3, { autoResize: e = true, debounce: o2 = 250 } = {}) {
      s2(this, "width", 0);
      s2(this, "height", 0);
      s2(this, "scrollHeight", 0);
      s2(this, "scrollWidth", 0);
      s2(this, "debouncedResize");
      s2(this, "wrapperResizeObserver");
      s2(this, "contentResizeObserver");
      s2(this, "resize", () => {
        this.onWrapperResize(), this.onContentResize();
      });
      s2(this, "onWrapperResize", () => {
        this.wrapper instanceof Window ? (this.width = window.innerWidth, this.height = window.innerHeight) : (this.width = this.wrapper.clientWidth, this.height = this.wrapper.clientHeight);
      });
      s2(this, "onContentResize", () => {
        this.wrapper instanceof Window ? (this.scrollHeight = this.content.scrollHeight, this.scrollWidth = this.content.scrollWidth) : (this.scrollHeight = this.wrapper.scrollHeight, this.scrollWidth = this.wrapper.scrollWidth);
      });
      this.wrapper = t2, this.content = i3, e && (this.debouncedResize = X3(this.resize, o2), this.wrapper instanceof Window ? window.addEventListener("resize", this.debouncedResize, false) : (this.wrapperResizeObserver = new ResizeObserver(this.debouncedResize), this.wrapperResizeObserver.observe(this.wrapper)), this.contentResizeObserver = new ResizeObserver(this.debouncedResize), this.contentResizeObserver.observe(this.content)), this.resize();
    }
    destroy() {
      this.wrapperResizeObserver?.disconnect(), this.contentResizeObserver?.disconnect(), this.wrapper === window && this.debouncedResize && window.removeEventListener("resize", this.debouncedResize, false);
    }
    get limit() {
      return { x: this.scrollWidth - this.width, y: this.scrollHeight - this.height };
    }
  };
  var R3 = class {
    constructor() {
      s2(this, "events", {});
    }
    emit(t2, ...i3) {
      let e = this.events[t2] || [];
      for (let o2 = 0, l3 = e.length; o2 < l3; o2++) e[o2]?.(...i3);
    }
    on(t2, i3) {
      return this.events[t2]?.push(i3) || (this.events[t2] = [i3]), () => {
        this.events[t2] = this.events[t2]?.filter((e) => i3 !== e);
      };
    }
    off(t2, i3) {
      this.events[t2] = this.events[t2]?.filter((e) => i3 !== e);
    }
    destroy() {
      this.events = {};
    }
  };
  var N4 = 100 / 6;
  var w3 = { passive: false };
  var A3 = class {
    constructor(t2, i3 = { wheelMultiplier: 1, touchMultiplier: 1 }) {
      s2(this, "touchStart", { x: 0, y: 0 });
      s2(this, "lastDelta", { x: 0, y: 0 });
      s2(this, "window", { width: 0, height: 0 });
      s2(this, "emitter", new R3());
      s2(this, "onTouchStart", (t3) => {
        const { clientX: i4, clientY: e } = t3.targetTouches ? t3.targetTouches[0] : t3;
        this.touchStart.x = i4, this.touchStart.y = e, this.lastDelta = { x: 0, y: 0 }, this.emitter.emit("scroll", { deltaX: 0, deltaY: 0, event: t3 });
      });
      s2(this, "onTouchMove", (t3) => {
        const { clientX: i4, clientY: e } = t3.targetTouches ? t3.targetTouches[0] : t3, o2 = -(i4 - this.touchStart.x) * this.options.touchMultiplier, l3 = -(e - this.touchStart.y) * this.options.touchMultiplier;
        this.touchStart.x = i4, this.touchStart.y = e, this.lastDelta = { x: o2, y: l3 }, this.emitter.emit("scroll", { deltaX: o2, deltaY: l3, event: t3 });
      });
      s2(this, "onTouchEnd", (t3) => {
        this.emitter.emit("scroll", { deltaX: this.lastDelta.x, deltaY: this.lastDelta.y, event: t3 });
      });
      s2(this, "onWheel", (t3) => {
        let { deltaX: i4, deltaY: e, deltaMode: o2 } = t3;
        const l3 = o2 === 1 ? N4 : o2 === 2 ? this.window.width : 1, n3 = o2 === 1 ? N4 : o2 === 2 ? this.window.height : 1;
        i4 *= l3, e *= n3, i4 *= this.options.wheelMultiplier, e *= this.options.wheelMultiplier, this.emitter.emit("scroll", { deltaX: i4, deltaY: e, event: t3 });
      });
      s2(this, "onWindowResize", () => {
        this.window = { width: window.innerWidth, height: window.innerHeight };
      });
      this.element = t2, this.options = i3, window.addEventListener("resize", this.onWindowResize, false), this.onWindowResize(), this.element.addEventListener("wheel", this.onWheel, w3), this.element.addEventListener("touchstart", this.onTouchStart, w3), this.element.addEventListener("touchmove", this.onTouchMove, w3), this.element.addEventListener("touchend", this.onTouchEnd, w3);
    }
    on(t2, i3) {
      return this.emitter.on(t2, i3);
    }
    destroy() {
      this.emitter.destroy(), window.removeEventListener("resize", this.onWindowResize, false), this.element.removeEventListener("wheel", this.onWheel, w3), this.element.removeEventListener("touchstart", this.onTouchStart, w3), this.element.removeEventListener("touchmove", this.onTouchMove, w3), this.element.removeEventListener("touchend", this.onTouchEnd, w3);
    }
  };
  var _6 = (t2) => Math.min(1, 1.001 - Math.pow(2, -10 * t2));
  var P2 = class {
    constructor({ wrapper: t2 = window, content: i3 = document.documentElement, eventsTarget: e = t2, smoothWheel: o2 = true, syncTouch: l3 = false, syncTouchLerp: n3 = 0.075, touchInertiaMultiplier: h2 = 35, duration: p3, easing: a20, lerp: u3 = 0.1, infinite: d2 = false, orientation: v3 = "vertical", gestureOrientation: r = "vertical", touchMultiplier: c = 1, wheelMultiplier: f4 = 1, autoResize: S3 = true, prevent: m3, virtualScroll: y3, overscroll: E5 = true, autoRaf: T2 = false, anchors: L2 = false, autoToggle: g4 = false, allowNestedScroll: b4 = false, __experimental__naiveDimensions: z2 = false } = {}) {
      s2(this, "_isScrolling", false);
      s2(this, "_isStopped", false);
      s2(this, "_isLocked", false);
      s2(this, "_preventNextNativeScrollEvent", false);
      s2(this, "_resetVelocityTimeout", null);
      s2(this, "__rafID", null);
      s2(this, "isTouching");
      s2(this, "time", 0);
      s2(this, "userData", {});
      s2(this, "lastVelocity", 0);
      s2(this, "velocity", 0);
      s2(this, "direction", 0);
      s2(this, "options");
      s2(this, "targetScroll");
      s2(this, "animatedScroll");
      s2(this, "animate", new C3());
      s2(this, "emitter", new R3());
      s2(this, "dimensions");
      s2(this, "virtualScroll");
      s2(this, "onScrollEnd", (t3) => {
        t3 instanceof CustomEvent || (this.isScrolling === "smooth" || this.isScrolling === false) && t3.stopPropagation();
      });
      s2(this, "dispatchScrollendEvent", () => {
        this.options.wrapper.dispatchEvent(new CustomEvent("scrollend", { bubbles: this.options.wrapper === window, detail: { lenisScrollEnd: true } }));
      });
      s2(this, "onTransitionEnd", (t3) => {
        if (t3.propertyName.includes("overflow")) {
          const i4 = this.isHorizontal ? "overflow-x" : "overflow-y", e2 = getComputedStyle(this.rootElement)[i4];
          ["hidden", "clip"].includes(e2) ? this.stop() : this.start();
        }
      });
      s2(this, "onClick", (t3) => {
        const e2 = t3.composedPath().find((o3) => o3 instanceof HTMLAnchorElement && (o3.getAttribute("href")?.startsWith("#") || o3.getAttribute("href")?.startsWith("/#") || o3.getAttribute("href")?.startsWith("./#")));
        if (e2) {
          const o3 = e2.getAttribute("href");
          if (o3) {
            const l4 = typeof this.options.anchors == "object" && this.options.anchors ? this.options.anchors : void 0;
            let n4 = `#${o3.split("#")[1]}`;
            ["#", "/#", "./#", "#top", "/#top", "./#top"].includes(o3) && (n4 = 0), this.scrollTo(n4, l4);
          }
        }
      });
      s2(this, "onPointerDown", (t3) => {
        t3.button === 1 && this.reset();
      });
      s2(this, "onVirtualScroll", (t3) => {
        if (typeof this.options.virtualScroll == "function" && this.options.virtualScroll(t3) === false) return;
        const { deltaX: i4, deltaY: e2, event: o3 } = t3;
        if (this.emitter.emit("virtual-scroll", { deltaX: i4, deltaY: e2, event: o3 }), o3.ctrlKey || o3.lenisStopPropagation) return;
        const l4 = o3.type.includes("touch"), n4 = o3.type.includes("wheel");
        this.isTouching = o3.type === "touchstart" || o3.type === "touchmove";
        const h3 = i4 === 0 && e2 === 0;
        if (this.options.syncTouch && l4 && o3.type === "touchstart" && h3 && !this.isStopped && !this.isLocked) {
          this.reset();
          return;
        }
        const a21 = this.options.gestureOrientation === "vertical" && e2 === 0 || this.options.gestureOrientation === "horizontal" && i4 === 0;
        if (h3 || a21) return;
        let u4 = o3.composedPath();
        u4 = u4.slice(0, u4.indexOf(this.rootElement));
        const d3 = this.options.prevent;
        if (u4.find((m4) => m4 instanceof HTMLElement && (typeof d3 == "function" && d3?.(m4) || m4.hasAttribute?.("data-lenis-prevent") || l4 && m4.hasAttribute?.("data-lenis-prevent-touch") || n4 && m4.hasAttribute?.("data-lenis-prevent-wheel") || this.options.allowNestedScroll && this.checkNestedScroll(m4, { deltaX: i4, deltaY: e2 })))) return;
        if (this.isStopped || this.isLocked) {
          o3.preventDefault();
          return;
        }
        if (!(this.options.syncTouch && l4 || this.options.smoothWheel && n4)) {
          this.isScrolling = "native", this.animate.stop(), o3.lenisStopPropagation = true;
          return;
        }
        let r2 = e2;
        this.options.gestureOrientation === "both" ? r2 = Math.abs(e2) > Math.abs(i4) ? e2 : i4 : this.options.gestureOrientation === "horizontal" && (r2 = i4), (!this.options.overscroll || this.options.infinite || this.options.wrapper !== window && (this.animatedScroll > 0 && this.animatedScroll < this.limit || this.animatedScroll === 0 && e2 > 0 || this.animatedScroll === this.limit && e2 < 0)) && (o3.lenisStopPropagation = true), o3.preventDefault();
        const c2 = l4 && this.options.syncTouch, S4 = l4 && o3.type === "touchend" && Math.abs(r2) > 5;
        S4 && (r2 = this.velocity * this.options.touchInertiaMultiplier), this.scrollTo(this.targetScroll + r2, { programmatic: false, ...c2 ? { lerp: S4 ? this.options.syncTouchLerp : 1 } : { lerp: this.options.lerp, duration: this.options.duration, easing: this.options.easing } });
      });
      s2(this, "onNativeScroll", () => {
        if (this._resetVelocityTimeout !== null && (clearTimeout(this._resetVelocityTimeout), this._resetVelocityTimeout = null), this._preventNextNativeScrollEvent) {
          this._preventNextNativeScrollEvent = false;
          return;
        }
        if (this.isScrolling === false || this.isScrolling === "native") {
          const t3 = this.animatedScroll;
          this.animatedScroll = this.targetScroll = this.actualScroll, this.lastVelocity = this.velocity, this.velocity = this.animatedScroll - t3, this.direction = Math.sign(this.animatedScroll - t3), this.isStopped || (this.isScrolling = "native"), this.emit(), this.velocity !== 0 && (this._resetVelocityTimeout = setTimeout(() => {
            this.lastVelocity = this.velocity, this.velocity = 0, this.isScrolling = false, this.emit();
          }, 400));
        }
      });
      s2(this, "raf", (t3) => {
        const i4 = t3 - (this.time || t3);
        this.time = t3, this.animate.advance(i4 * 1e-3), this.options.autoRaf && (this.__rafID = requestAnimationFrame(this.raf));
      });
      window.lenisVersion = O2, (!t2 || t2 === document.documentElement) && (t2 = window), typeof p3 == "number" && typeof a20 != "function" ? a20 = _6 : typeof a20 == "function" && typeof p3 != "number" && (p3 = 1), this.options = { wrapper: t2, content: i3, eventsTarget: e, smoothWheel: o2, syncTouch: l3, syncTouchLerp: n3, touchInertiaMultiplier: h2, duration: p3, easing: a20, lerp: u3, infinite: d2, gestureOrientation: r, orientation: v3, touchMultiplier: c, wheelMultiplier: f4, autoResize: S3, prevent: m3, virtualScroll: y3, overscroll: E5, autoRaf: T2, anchors: L2, autoToggle: g4, allowNestedScroll: b4, __experimental__naiveDimensions: z2 }, this.dimensions = new Y4(t2, i3, { autoResize: S3 }), this.updateClassName(), this.targetScroll = this.animatedScroll = this.actualScroll, this.options.wrapper.addEventListener("scroll", this.onNativeScroll, false), this.options.wrapper.addEventListener("scrollend", this.onScrollEnd, { capture: true }), this.options.anchors && this.options.wrapper === window && this.options.wrapper.addEventListener("click", this.onClick, false), this.options.wrapper.addEventListener("pointerdown", this.onPointerDown, false), this.virtualScroll = new A3(e, { touchMultiplier: c, wheelMultiplier: f4 }), this.virtualScroll.on("scroll", this.onVirtualScroll), this.options.autoToggle && this.rootElement.addEventListener("transitionend", this.onTransitionEnd, { passive: true }), this.options.autoRaf && (this.__rafID = requestAnimationFrame(this.raf));
    }
    destroy() {
      this.emitter.destroy(), this.options.wrapper.removeEventListener("scroll", this.onNativeScroll, false), this.options.wrapper.removeEventListener("scrollend", this.onScrollEnd, { capture: true }), this.options.wrapper.removeEventListener("pointerdown", this.onPointerDown, false), this.options.anchors && this.options.wrapper === window && this.options.wrapper.removeEventListener("click", this.onClick, false), this.virtualScroll.destroy(), this.dimensions.destroy(), this.cleanUpClassName(), this.__rafID && cancelAnimationFrame(this.__rafID);
    }
    on(t2, i3) {
      return this.emitter.on(t2, i3);
    }
    off(t2, i3) {
      return this.emitter.off(t2, i3);
    }
    setScroll(t2) {
      this.isHorizontal ? this.options.wrapper.scrollTo({ left: t2, behavior: "instant" }) : this.options.wrapper.scrollTo({ top: t2, behavior: "instant" });
    }
    resize() {
      this.dimensions.resize(), this.animatedScroll = this.targetScroll = this.actualScroll, this.emit();
    }
    emit() {
      this.emitter.emit("scroll", this);
    }
    reset() {
      this.isLocked = false, this.isScrolling = false, this.animatedScroll = this.targetScroll = this.actualScroll, this.lastVelocity = this.velocity = 0, this.animate.stop();
    }
    start() {
      this.isStopped && (this.reset(), this.isStopped = false, this.emit());
    }
    stop() {
      this.isStopped || (this.reset(), this.isStopped = true, this.emit());
    }
    scrollTo(t2, { offset: i3 = 0, immediate: e = false, lock: o2 = false, duration: l3 = this.options.duration, easing: n3 = this.options.easing, lerp: h2 = this.options.lerp, onStart: p3, onComplete: a20, force: u3 = false, programmatic: d2 = true, userData: v3 } = {}) {
      if (!((this.isStopped || this.isLocked) && !u3)) {
        if (typeof t2 == "string" && ["top", "left", "start"].includes(t2)) t2 = 0;
        else if (typeof t2 == "string" && ["bottom", "right", "end"].includes(t2)) t2 = this.limit;
        else {
          let r;
          if (typeof t2 == "string" ? r = document.querySelector(t2) : t2 instanceof HTMLElement && t2?.nodeType && (r = t2), r) {
            if (this.options.wrapper !== window) {
              const f4 = this.rootElement.getBoundingClientRect();
              i3 -= this.isHorizontal ? f4.left : f4.top;
            }
            const c = r.getBoundingClientRect();
            t2 = (this.isHorizontal ? c.left : c.top) + this.animatedScroll;
          }
        }
        if (typeof t2 == "number") {
          if (t2 += i3, t2 = Math.round(t2), this.options.infinite) {
            if (d2) {
              this.targetScroll = this.animatedScroll = this.scroll;
              const r = t2 - this.animatedScroll;
              r > this.limit / 2 ? t2 = t2 - this.limit : r < -this.limit / 2 && (t2 = t2 + this.limit);
            }
          } else t2 = W4(0, t2, this.limit);
          if (t2 === this.targetScroll) {
            p3?.(this), a20?.(this);
            return;
          }
          if (this.userData = v3 ?? {}, e) {
            this.animatedScroll = this.targetScroll = t2, this.setScroll(this.scroll), this.reset(), this.preventNextNativeScrollEvent(), this.emit(), a20?.(this), this.userData = {}, requestAnimationFrame(() => {
              this.dispatchScrollendEvent();
            });
            return;
          }
          d2 || (this.targetScroll = t2), typeof l3 == "number" && typeof n3 != "function" ? n3 = _6 : typeof n3 == "function" && typeof l3 != "number" && (l3 = 1), this.animate.fromTo(this.animatedScroll, t2, { duration: l3, easing: n3, lerp: h2, onStart: () => {
            o2 && (this.isLocked = true), this.isScrolling = "smooth", p3?.(this);
          }, onUpdate: (r, c) => {
            this.isScrolling = "smooth", this.lastVelocity = this.velocity, this.velocity = r - this.animatedScroll, this.direction = Math.sign(this.velocity), this.animatedScroll = r, this.setScroll(this.scroll), d2 && (this.targetScroll = r), c || this.emit(), c && (this.reset(), this.emit(), a20?.(this), this.userData = {}, requestAnimationFrame(() => {
              this.dispatchScrollendEvent();
            }), this.preventNextNativeScrollEvent());
          } });
        }
      }
    }
    preventNextNativeScrollEvent() {
      this._preventNextNativeScrollEvent = true, requestAnimationFrame(() => {
        this._preventNextNativeScrollEvent = false;
      });
    }
    checkNestedScroll(t2, { deltaX: i3, deltaY: e }) {
      const o2 = Date.now(), l3 = t2._lenis ?? (t2._lenis = {});
      let n3, h2, p3, a20, u3, d2, v3, r;
      const c = this.options.gestureOrientation;
      if (o2 - (l3.time ?? 0) > 2e3) {
        l3.time = Date.now();
        const g4 = window.getComputedStyle(t2);
        l3.computedStyle = g4;
        const b4 = g4.overflowX, z2 = g4.overflowY;
        if (n3 = ["auto", "overlay", "scroll"].includes(b4), h2 = ["auto", "overlay", "scroll"].includes(z2), l3.hasOverflowX = n3, l3.hasOverflowY = h2, !n3 && !h2 || c === "vertical" && !h2 || c === "horizontal" && !n3) return false;
        u3 = t2.scrollWidth, d2 = t2.scrollHeight, v3 = t2.clientWidth, r = t2.clientHeight, p3 = u3 > v3, a20 = d2 > r, l3.isScrollableX = p3, l3.isScrollableY = a20, l3.scrollWidth = u3, l3.scrollHeight = d2, l3.clientWidth = v3, l3.clientHeight = r;
      } else p3 = l3.isScrollableX, a20 = l3.isScrollableY, n3 = l3.hasOverflowX, h2 = l3.hasOverflowY, u3 = l3.scrollWidth, d2 = l3.scrollHeight, v3 = l3.clientWidth, r = l3.clientHeight;
      if (!n3 && !h2 || !p3 && !a20 || c === "vertical" && (!h2 || !a20) || c === "horizontal" && (!n3 || !p3)) return false;
      let f4;
      if (c === "horizontal") f4 = "x";
      else if (c === "vertical") f4 = "y";
      else {
        const g4 = i3 !== 0, b4 = e !== 0;
        g4 && n3 && p3 && (f4 = "x"), b4 && h2 && a20 && (f4 = "y");
      }
      if (!f4) return false;
      let S3, m3, y3, E5, T2;
      if (f4 === "x") S3 = t2.scrollLeft, m3 = u3 - v3, y3 = i3, E5 = n3, T2 = p3;
      else if (f4 === "y") S3 = t2.scrollTop, m3 = d2 - r, y3 = e, E5 = h2, T2 = a20;
      else return false;
      return (y3 > 0 ? S3 < m3 : S3 > 0) && E5 && T2;
    }
    get rootElement() {
      return this.options.wrapper === window ? document.documentElement : this.options.wrapper;
    }
    get limit() {
      return this.options.__experimental__naiveDimensions ? this.isHorizontal ? this.rootElement.scrollWidth - this.rootElement.clientWidth : this.rootElement.scrollHeight - this.rootElement.clientHeight : this.dimensions.limit[this.isHorizontal ? "x" : "y"];
    }
    get isHorizontal() {
      return this.options.orientation === "horizontal";
    }
    get actualScroll() {
      const t2 = this.options.wrapper;
      return this.isHorizontal ? t2.scrollX ?? t2.scrollLeft : t2.scrollY ?? t2.scrollTop;
    }
    get scroll() {
      return this.options.infinite ? D4(this.animatedScroll, this.limit) : this.animatedScroll;
    }
    get progress() {
      return this.limit === 0 ? 1 : this.scroll / this.limit;
    }
    get isScrolling() {
      return this._isScrolling;
    }
    set isScrolling(t2) {
      this._isScrolling !== t2 && (this._isScrolling = t2, this.updateClassName());
    }
    get isStopped() {
      return this._isStopped;
    }
    set isStopped(t2) {
      this._isStopped !== t2 && (this._isStopped = t2, this.updateClassName());
    }
    get isLocked() {
      return this._isLocked;
    }
    set isLocked(t2) {
      this._isLocked !== t2 && (this._isLocked = t2, this.updateClassName());
    }
    get isSmooth() {
      return this.isScrolling === "smooth";
    }
    get className() {
      let t2 = "lenis";
      return this.options.autoToggle && (t2 += " lenis-autoToggle"), this.isStopped && (t2 += " lenis-stopped"), this.isLocked && (t2 += " lenis-locked"), this.isScrolling && (t2 += " lenis-scrolling"), this.isScrolling === "smooth" && (t2 += " lenis-smooth"), t2;
    }
    updateClassName() {
      this.cleanUpClassName(), this.rootElement.className = `${this.rootElement.className} ${this.className}`.trim();
    }
    cleanUpClassName() {
      this.rootElement.className = this.rootElement.className.replace(/lenis(-\w+)?/g, "").trim();
    }
  };

  // build/assets/destinationsmega-DlX3AMky.js
  function d() {
    const r = Array.from(document.querySelectorAll(".destinationsMega"));
    r.length && r.forEach((t2) => {
      if (t2.dataset.destinationsMegaInitialized === "true") return;
      t2.dataset.destinationsMegaInitialized = "true";
      const i3 = Array.from(t2.querySelectorAll(".destinationsMega__country")), a20 = t2.querySelector(".destinationsMega__view-all"), o2 = i3.find((e) => e.classList.contains("is-active")) || i3[0];
      function n3() {
        i3.forEach((e) => e.classList.remove("is-active"));
      }
      function s3(e) {
        e && (n3(), e.classList.add("is-active"));
      }
      i3.forEach((e) => {
        e.addEventListener("mouseenter", () => {
          window.innerWidth < 1200 || s3(e);
        }), e.addEventListener("focusin", () => {
          s3(e);
        });
      }), a20?.addEventListener("mouseenter", () => {
        window.innerWidth < 1200 || n3();
      }), a20?.addEventListener("focusin", n3), t2.addEventListener("mouseleave", () => {
        s3(o2);
      });
    });
  }

  // build/assets/inspirationmega-BMmVxmN4.js
  function E4() {
    const n3 = document.getElementById("inspirationMega");
    if (!n3) return;
    const a20 = n3.querySelector(".inspirationMega__level--1"), s3 = n3.querySelector(".inspirationMega__level--2"), i3 = n3.querySelector(".inspirationMega__level--3"), u3 = document.getElementById("inspirationDropdown"), v3 = document.querySelector('[data-dropdown="inspirationDropdown"]');
    function m3() {
      const e = n3.querySelectorAll(".inspirationMega__list");
      let t2 = 0;
      e.forEach((l3) => {
        const r = l3.offsetHeight;
        r > t2 && (t2 = r);
      }), n3.style.setProperty("min-height", t2 + "px"), a20.style.setProperty("min-height", t2 + "px");
    }
    function d2(e) {
      e && e.querySelectorAll(".inspirationMega__panel").forEach((t2) => {
        t2.classList.remove("is-active");
      });
    }
    function c(e) {
      e && e.querySelectorAll("li").forEach((t2) => {
        t2.classList.remove("is-active");
      });
    }
    function o2(e) {
      e && (e.classList.add("is-empty"), d2(e), c(e));
    }
    function _7(e) {
      e && e.classList.remove("is-empty");
    }
    function f4(e) {
      if (!e || !a20) return;
      c(a20);
      const t2 = e.closest("li");
      t2 && t2.classList.add("is-active"), o2(s3), o2(i3);
      const l3 = e.dataset.target;
      if (!l3) return;
      const r = s3 ? s3.querySelector("#" + l3) : null;
      r && (_7(s3), d2(s3), r.classList.add("is-active"));
    }
    function p3(e) {
      if (!e || !i3) return;
      const t2 = e.closest(".inspirationMega__panel");
      if (!t2) return;
      c(t2.querySelector(".inspirationMega__list"));
      const l3 = e.closest("li");
      l3 && l3.classList.add("is-active"), o2(i3);
      const r = e.dataset.target;
      if (!r) return;
      const L2 = i3.querySelector("#" + r);
      L2 && (_7(i3), d2(i3), L2.classList.add("is-active"));
    }
    o2(s3), o2(i3), n3.querySelectorAll(".inspirationMega__level--1 .inspirationMega__trigger").forEach((e) => {
      e.addEventListener("mouseenter", function() {
        window.innerWidth < 1200 || f4(e);
      }), e.addEventListener("click", function(t2) {
        t2.preventDefault(), f4(e);
      });
    }), n3.querySelectorAll(".inspirationMega__level--1 > .inspirationMega__list > li > a").forEach((e) => {
      e.addEventListener("mouseenter", function() {
        window.innerWidth < 1200 || f4(e);
      });
    }), n3.querySelectorAll(".inspirationMega__level--2 .inspirationMega__trigger").forEach((e) => {
      e.addEventListener("mouseenter", function() {
        window.innerWidth < 1200 || p3(e);
      }), e.addEventListener("click", function(t2) {
        t2.preventDefault(), p3(e);
      });
    }), n3.querySelectorAll(".inspirationMega__level--2 .inspirationMega__list > li > a").forEach((e) => {
      e.addEventListener("mouseenter", function() {
        window.innerWidth < 1200 || p3(e);
      });
    }), n3.addEventListener("mouseleave", function() {
      c(a20), o2(s3), o2(i3);
    });
    let y3 = window.scrollY, w4 = null;
    function h2() {
      u3 && (u3.classList.remove("is-active", "active", "open", "show"), u3.style.pointerEvents = "none", requestAnimationFrame(() => {
        u3.style.pointerEvents = "";
      })), v3 && v3.classList.remove("is-active", "active", "open", "show", "hover"), document.activeElement && document.activeElement.blur(), c(a20), o2(s3), o2(i3);
    }
    window.addEventListener("scroll", function() {
      const e = window.scrollY;
      Math.abs(e - y3) > 2 && (document.body.classList.add("is-scrolling"), h2()), clearTimeout(w4), w4 = setTimeout(function() {
        document.body.classList.remove("is-scrolling");
      }, 180), y3 = e;
    }, { passive: true }), m3(), window.addEventListener("resize", m3);
  }

  // build/assets/_entry.js
  var booted = false;
  function safeRun(fn2) {
    try {
      fn2();
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
        W();
        Q();
      }
    });
    safeRun(() => d());
    safeRun(() => E4());
    safeRun(() => {
      if (document.querySelector(".navMenu")) q2();
    });
    safeRun(() => t());
    safeRun(() => {
      if (document.querySelector(".dropdown-container")) g2();
    });
    safeRun(() => {
      if (document.querySelector(".processForm, [data-autoresize]")) _2();
    });
    safeRun(() => {
      if (document.querySelector(".filterSidebar, .accommodationAccordion, .itineraryAccordion, .faqAccordion")) f2();
    });
    safeRun(() => {
      if (document.querySelector(".collapse")) i();
    });
    safeRun(() => {
      if (document.querySelector(".breadcrumbs__carousel, .cardCarousel, .reviewsCarousel, .articleGallery, .accommodationGallery, .galleryCarousel")) q3();
    });
    safeRun(() => {
      if (document.querySelector(".tabs__container")) B();
    });
    safeRun(() => {
      if (document.querySelector(".pageNavLink, .pageNavCarousel")) N2();
    });
    safeRun(() => {
      if (document.querySelector(".filterSidebar--fixed")) l();
    });
    safeRun(() => {
      if (document.querySelector(".interactiveMap")) v();
    });
    safeRun(() => {
      if (document.querySelector(".homeDestinations, .homeVideo, .homeJourney, .homeAccommodation, .homeVideoReviews")) _5();
    });
    safeRun(() => {
      if (document.querySelector("[data-marquee-scroll-direction-target]")) D2();
    });
    safeRun(() => {
      if (document.querySelector(".venobox")) n2();
    });
    safeRun(() => {
      Ps.registerPlugin(q4);
      window.__refreshScrollTriggers = () => q4.refresh();
      const lenis = new P2();
      window.__lenis = lenis;
      lenis.on("scroll", q4.update);
      Ps.ticker.add((time) => lenis.raf(time * 1e3));
      Ps.ticker.lagSmoothing(0);
    });
    safeRun(() => {
      if (document.querySelector(".hero, .processHero")) a19();
    });
    safeRun(() => {
      if (document.querySelector(".homeVideo, .homeJourney")) i2();
    });
    safeRun(() => {
      if (document.querySelector(".cursor") && window.matchMedia("(min-width: 960px)").matches) q6();
    });
    safeRun(() => {
      if (document.querySelector(".handReveal, .headingReveal, .fadeInReveal, .processDrawers, .destinationsScrollSection, .tailormadeScroll")) {
        w2();
        b3();
      }
    });
    window.addEventListener("load", () => {
      safeRun(() => q4.refresh());
    }, { once: true });
    setTimeout(() => {
      safeRun(() => q4.refresh());
    }, 500);
    setTimeout(() => {
      safeRun(() => q4.refresh());
    }, 1800);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootSite, { once: true });
  } else {
    bootSite();
  }
})();
/*!
 * GSAP 3.13.0
 * https://gsap.com
 *
 * @license Copyright 2008-2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/
/*!
 * CSSPlugin 3.13.0
 * https://gsap.com
 *
 * Copyright 2008-2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/
/*!
 * Observer 3.13.0
 * https://gsap.com
 *
 * @license Copyright 2008-2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/
/*!
 * ScrollTrigger 3.13.0
 * https://gsap.com
 *
 * @license Copyright 2008-2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/
/*!
* SplitText 3.13.0
* https://gsap.com
*
* @license Copyright 2025, GreenSock. All rights reserved. Subject to the terms at https://gsap.com/standard-license.
* @author: Jack Doyle
*/
/**
 * VenoBox 2.1.8
 * Copyright 2013-2024 Nicola Franchini
 * @license: https://github.com/nicolafranchini/VenoBox/blob/master/LICENSE
 */
