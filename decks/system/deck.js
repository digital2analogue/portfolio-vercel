/* ============================================================================
   Master case-study deck — runtime
   ----------------------------------------------------------------------------
   Authoring contract: each <section class="slide"> declares
     data-layout   one of cover|statement|metric|metrics|split|figure|list|
                   decision|quote|end
     data-section  the rail label (also groups the overview)
     data-title    short title, used by the overview grid
   plus an optional <template data-notes> for speaker notes.

   The runtime injects the rail, wires keyboard nav, notes, overview, timer,
   and scales the fixed 1280x720 stage to the viewport.
   ========================================================================= */

(function () {
  "use strict";

  var stage = document.querySelector(".stage");
  if (!stage) return;

  var slides = Array.prototype.slice.call(stage.querySelectorAll(".slide"));
  var total = slides.length;
  var index = 0;
  var deckName = document.body.getAttribute("data-deck") || "Deck";

  /* --------------------------------------------------------------------
     Build per-slide chrome: rail + body wrapper
     -------------------------------------------------------------------- */

  slides.forEach(function (slide, i) {
    // Wrap authored children in .body unless the author already did.
    if (!slide.querySelector(":scope > .body")) {
      var body = document.createElement("div");
      body.className = "body";
      while (slide.firstChild) body.appendChild(slide.firstChild);
      slide.appendChild(body);
    }

    var rail = document.createElement("div");
    rail.className = "rail";

    var section = document.createElement("span");
    section.className = "rail__section";
    section.textContent = slide.getAttribute("data-section") || "";

    var num = document.createElement("span");
    num.className = "rail__num";
    num.textContent = pad(i + 1) + " / " + pad(total);

    rail.appendChild(section);
    rail.appendChild(num);
    slide.insertBefore(rail, slide.firstChild);
  });

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  /* --------------------------------------------------------------------
     Chrome: progress, HUD, notes drawer, overview
     -------------------------------------------------------------------- */

  var chrome = el("div", "chrome");
  var fill = el("div", "chrome__fill");
  chrome.appendChild(fill);

  var hud = el("div", "hud");
  hud.innerHTML =
    '<span class="hud__deck"></span>' +
    '<span class="hud__count"></span>' +
    "<span><kbd>←</kbd><kbd>→</kbd> move · <kbd>S</kbd> notes · <kbd>O</kbd> overview · <kbd>F</kbd> full</span>";
  hud.querySelector(".hud__deck").textContent = deckName;

  var notes = el("aside", "notes");
  notes.setAttribute("aria-live", "polite");
  notes.innerHTML =
    '<div class="notes__head">' +
    '<span class="notes__title">Speaker notes</span>' +
    '<span class="notes__timer">00:00</span>' +
    "</div>" +
    '<div class="notes__body"></div>';

  var overview = el("div", "overview");

  document.body.appendChild(chrome);
  document.body.appendChild(hud);
  document.body.appendChild(notes);
  document.body.appendChild(overview);

  function el(tag, cls) {
    var n = document.createElement(tag);
    n.className = cls;
    return n;
  }

  /* --------------------------------------------------------------------
     Overview grid
     -------------------------------------------------------------------- */

  slides.forEach(function (slide, i) {
    var card = document.createElement("button");
    card.className = "ov-card";
    card.type = "button";
    card.innerHTML =
      '<span class="ov-card__n"></span>' +
      '<span class="ov-card__t"></span>' +
      '<span class="ov-card__s"></span>';
    card.querySelector(".ov-card__n").textContent = pad(i + 1);
    card.querySelector(".ov-card__t").textContent =
      slide.getAttribute("data-title") || "—";
    card.querySelector(".ov-card__s").textContent =
      slide.getAttribute("data-section") || "";
    card.addEventListener("click", function () {
      go(i);
      closeOverview();
    });
    overview.appendChild(card);
  });

  var ovCards = Array.prototype.slice.call(overview.children);

  function openOverview() {
    overview.setAttribute("data-open", "");
    ovCards.forEach(function (c, i) {
      if (i === index) c.setAttribute("data-current", "");
      else c.removeAttribute("data-current");
    });
    ovCards[index].focus();
  }

  function closeOverview() {
    overview.removeAttribute("data-open");
  }

  function toggleOverview() {
    if (overview.hasAttribute("data-open")) closeOverview();
    else openOverview();
  }

  /* --------------------------------------------------------------------
     Navigation
     -------------------------------------------------------------------- */

  function go(next) {
    if (next < 0) next = 0;
    if (next > total - 1) next = total - 1;
    if (next === index && slides[index].hasAttribute("data-active")) return;

    slides[index].removeAttribute("data-active");
    index = next;
    var slide = slides[index];
    slide.setAttribute("data-active", "");

    // Restart entrance animations deterministically.
    slide.querySelectorAll("[data-rise]").forEach(function (n) {
      n.style.animation = "none";
      // eslint-disable-next-line no-unused-expressions
      n.offsetHeight;
      n.style.animation = "";
    });

    // Autoplay any video on the entered slide; pause the rest.
    slides.forEach(function (s) {
      s.querySelectorAll("video").forEach(function (v) {
        if (s === slide) {
          var p = v.play();
          if (p && p.catch) p.catch(function () {});
        } else {
          v.pause();
        }
      });
    });

    // Let interactive slide widgets know they are on screen.
    slide.dispatchEvent(new CustomEvent("slide:enter", { bubbles: true }));

    fill.style.width = ((index + 1) / total) * 100 + "%";
    hud.querySelector(".hud__count").textContent =
      pad(index + 1) + " / " + pad(total);

    var tpl = slide.querySelector("template[data-notes]");
    notes.querySelector(".notes__body").innerHTML = tpl
      ? tpl.innerHTML
      : '<p style="color:var(--color-foreground-muted)">No notes for this slide.</p>';

    if (history.replaceState) history.replaceState(null, "", "#" + (index + 1));
  }

  document.addEventListener("keydown", function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    if (overview.hasAttribute("data-open")) {
      if (e.key === "Escape" || e.key.toLowerCase() === "o") {
        e.preventDefault();
        closeOverview();
      }
      return;
    }

    // Don't hijack typing inside the live playground.
    var t = e.target;
    var typing =
      t &&
      (t.tagName === "TEXTAREA" ||
        t.tagName === "INPUT" ||
        t.isContentEditable);

    switch (e.key) {
      case "ArrowRight":
      case "PageDown":
        e.preventDefault();
        go(index + 1);
        break;
      case " ":
      case "Spacebar":
        if (typing) return;
        e.preventDefault();
        go(index + 1);
        break;
      case "ArrowLeft":
      case "PageUp":
        e.preventDefault();
        go(index - 1);
        break;
      case "Home":
        e.preventDefault();
        go(0);
        break;
      case "End":
        e.preventDefault();
        go(total - 1);
        break;
      case "Escape":
        notes.removeAttribute("data-open");
        break;
      default:
        if (typing) return;
        var k = e.key.toLowerCase();
        if (k === "s") {
          e.preventDefault();
          notes.toggleAttribute("data-open");
        } else if (k === "o") {
          e.preventDefault();
          toggleOverview();
        } else if (k === "f") {
          e.preventDefault();
          if (document.fullscreenElement) document.exitFullscreen();
          else document.documentElement.requestFullscreen();
        } else if (k === "t") {
          e.preventDefault();
          resetTimer();
        }
    }
  });

  /* --------------------------------------------------------------------
     Stage scaling — fit 1280x720 into the viewport, never upscale past 1
     on small screens, allow upscale on large displays.
     -------------------------------------------------------------------- */

  function fit() {
    var pad = 0;
    var sw = (window.innerWidth - pad) / 1280;
    var sh = (window.innerHeight - pad) / 720;
    var scale = Math.min(sw, sh);
    stage.style.transform = "scale(" + scale + ")";
  }

  window.addEventListener("resize", fit);
  fit();

  /* --------------------------------------------------------------------
     Presenter timer — starts on first advance, T resets
     -------------------------------------------------------------------- */

  var started = null;
  var timerEl = notes.querySelector(".notes__timer");

  function resetTimer() {
    started = Date.now();
  }

  setInterval(function () {
    if (!started) return;
    var s = Math.floor((Date.now() - started) / 1000);
    timerEl.textContent =
      pad(Math.floor(s / 60)) + ":" + pad(s % 60) + "  elapsed";
  }, 1000);

  var origGo = go;
  go = function (n) {
    if (started === null && n > 0) started = Date.now();
    origGo(n);
  };

  /* --------------------------------------------------------------------
     Boot
     -------------------------------------------------------------------- */

  var hash = parseInt((location.hash || "").replace("#", ""), 10);
  origGo(isFinite(hash) && hash >= 1 ? hash - 1 : 0);
})();
