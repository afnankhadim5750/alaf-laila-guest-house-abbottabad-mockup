/* Alaf Laila Guest House — interactions: mobile menu (instant toggle),
   lightbox gallery, scroll-spy nav, reveal on scroll. */
(function () {
  "use strict";

  /* ---- Mobile menu: instant open/close, no transitions ---- */
  var toggle = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-mobile-menu]");
  if (toggle && menu) {
    var setOpen = function (open) {
      menu.classList.toggle("open", open);
      menu.hidden = !open;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    toggle.addEventListener("click", function () {
      setOpen(!menu.classList.contains("open"));
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("open")) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ---- Scroll-spy: highlight the current section in the desktop nav ---- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".desktop-nav a"));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(function (s) { return s; });
  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = "#" + entry.target.id;
        navLinks.forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("href") === id);
        });
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---- Lightbox gallery ---- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxCaption = document.getElementById("lightbox-caption");
  var items = Array.prototype.slice.call(document.querySelectorAll(".gallery-item"));
  var current = 0;
  var lastFocus = null;
  function show(i) {
    current = (i + items.length) % items.length;
    var item = items[current];
    lightboxImg.src = item.getAttribute("data-full");
    lightboxImg.alt = item.querySelector("img").alt;
    lightboxCaption.textContent = item.getAttribute("data-caption") || "";
  }
  function openLightbox(i) {
    lastFocus = document.activeElement;
    show(i);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightbox.querySelector(".lightbox-close").focus();
  }
  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  if (lightbox) {
    items.forEach(function (item, i) {
      item.addEventListener("click", function () { openLightbox(i); });
    });
    lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
    lightbox.querySelector(".lightbox-prev").addEventListener("click", function () { show(current - 1); });
    lightbox.querySelector(".lightbox-next").addEventListener("click", function () { show(current + 1); });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (lightbox.hidden) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
  }

  /* ---- Reveal on scroll (content stays visible if JS/IO is unavailable) ---- */
  var revealTargets = document.querySelectorAll(".room-card, .around-card, .why-card, .shared-grid figure, .gallery-item");
  if ("IntersectionObserver" in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          ro.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(function (el) {
      el.classList.add("reveal");
      ro.observe(el);
    });
  }
})();
