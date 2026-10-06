/* BossGoldenStudio — interakcje strony */
(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const SVG_NS = "http://www.w3.org/2000/svg";

  /* ---------- Nawigacja ---------- */
  const header = $(".site-header");
  const toggle = $(".nav-toggle");
  const menu = $("#menu");

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    toggle.setAttribute("aria-label", open ? "Otwórz menu" : "Zamknij menu");
    menu.classList.toggle("open", !open);
  });
  $$("a", menu).forEach((a) =>
    a.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      menu.classList.remove("open");
    })
  );
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Animacje wejścia ---------- */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    $$(".reveal").forEach((el) => io.observe(el));
  } else {
    $$(".reveal").forEach((el) => el.classList.add("visible"));
  }

  /* ---------- Ilustracje realizacji (zastępcze, do podmiany na zdjęcia) ---------- */
  function rng(seed) {
    return () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  }
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const c = (v) => Math.max(0, Math.min(255, v + amt));
    const r = c(n >> 16), g = c((n >> 8) & 255), b = c(n & 255);
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }
  function wavyEdge(x, rand, amp) {
    let d = "";
    for (let y = 0; y <= 500; y += 50) {
      const nx = x + (rand() - 0.5) * amp;
      d += (y === 0 ? "M" : " S") + (y === 0 ? `${nx} ${y}` : `${nx - (rand() - 0.5) * amp} ${y - 25} ${nx} ${y}`);
    }
    return d;
  }
  function grain(rand, x0, x1, color) {
    let g = "";
    for (let x = x0; x < x1; x += 14 + rand() * 18) {
      const w = 6 + rand() * 10;
      g += `<path d="M${x} 0 C${x + w} 120 ${x - w} 260 ${x + w / 2} 380 S${x - w / 2} 470 ${x} 500" stroke="${color}" stroke-opacity="${0.18 + rand() * 0.25}" stroke-width="${1 + rand() * 1.5}" fill="none"/>`;
    }
    return g;
  }
  function flower(x, y, r, color, rot) {
    let p = "";
    for (let i = 0; i < 5; i++) {
      p += `<ellipse rx="${r * 0.42}" ry="${r}" cy="${-r}" transform="rotate(${i * 72})" fill="${color}"/>`;
    }
    return `<g transform="translate(${x} ${y}) rotate(${rot})" opacity=".92">${p}<circle r="${r * 0.42}" fill="#f2cf6b"/></g>`;
  }

  function buildArt(tile, i) {
    const rand = rng(i * 97 + 13);
    const wood = tile.dataset.wood || "#7b5131";
    const resin = tile.dataset.resin || "#1f7a8c";
    const type = tile.dataset.art;
    const id = "t" + i;
    let body = "";
    const defs = `
      <linearGradient id="${id}w" x1="0" x2="1"><stop offset="0" stop-color="${shade(wood, -25)}"/><stop offset=".5" stop-color="${wood}"/><stop offset="1" stop-color="${shade(wood, 18)}"/></linearGradient>
      <linearGradient id="${id}r" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="${shade(resin, -35)}"/><stop offset=".5" stop-color="${resin}"/><stop offset="1" stop-color="${shade(resin, -45)}"/></linearGradient>
      <radialGradient id="${id}s" cx=".3" cy=".2" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>`;
    const grainColor = shade(wood, -60);

    if (type === "river") {
      const l = 150 + rand() * 30, r = 240 + rand() * 30;
      body = `<rect width="400" height="500" fill="url(#${id}r)"/>
        <path d="${wavyEdge(l, rand, 70)} L0 500 L0 0Z" fill="url(#${id}w)"/>
        <path d="${wavyEdge(r, rand, 70)} L400 500 L400 0Z" fill="url(#${id}w)"/>
        ${grain(rand, 10, l - 30, grainColor)}${grain(rand, r + 30, 395, grainColor)}`;
    } else if (type === "flowers") {
      const palette = ["#f3d9e4", "#d98aa6", "#c9d7f2", "#fff4e0", "#e9a07a", "#b9a2e0"];
      let fl = "";
      for (let k = 0; k < 9; k++) {
        const a = rand() * Math.PI * 2, d = rand() * 110;
        fl += flower(200 + Math.cos(a) * d * 0.8, 250 + Math.sin(a) * d, 9 + rand() * 9, palette[k % palette.length], rand() * 90);
      }
      let leaves = "";
      for (let k = 0; k < 6; k++) {
        const x = 130 + rand() * 140, y = 150 + rand() * 200;
        leaves += `<path d="M${x} ${y} q${10 + rand() * 15} ${-10 - rand() * 10} ${28} ${rand() * 8}" stroke="#7fae7a" stroke-width="2.4" fill="none" opacity=".75"/>`;
      }
      body = `<rect width="400" height="500" fill="url(#${id}w)"/>${grain(rand, 5, 395, grainColor)}
        <ellipse cx="200" cy="250" rx="${120 + rand() * 20}" ry="${170 + rand() * 20}" fill="url(#${id}r)" stroke="${shade(wood, -40)}" stroke-width="3"/>
        ${leaves}${fl}`;
    } else {
      let planks = "";
      const n = 3 + Math.floor(rand() * 2), w = 400 / n;
      for (let k = 0; k < n; k++) {
        planks += `<rect x="${k * w}" width="${w}" height="500" fill="${shade(wood, Math.round((rand() - 0.5) * 30))}"/>`;
        if (k) planks += `<line x1="${k * w}" x2="${k * w}" y2="500" stroke="${shade(wood, -55)}" stroke-opacity=".5"/>`;
      }
      const knots = Array.from({ length: 2 }, () => {
        const x = 40 + rand() * 320, y = 60 + rand() * 380;
        return `<ellipse cx="${x}" cy="${y}" rx="9" ry="15" fill="${shade(wood, -60)}" opacity=".55"/>`;
      }).join("");
      body = planks + grain(rand, 5, 395, grainColor) + knots;
    }

    const svg = `<svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" xmlns="${SVG_NS}" aria-hidden="true"><defs>${defs}</defs>${body}<rect width="400" height="500" fill="url(#${id}s)"/></svg>`;
    tile.insertAdjacentHTML("afterbegin", svg);
  }
  $$(".tile[data-art]").forEach(buildArt);

  /* ---------- Filtry galerii ---------- */
  const filters = $$(".filter");
  filters.forEach((btn) =>
    btn.addEventListener("click", () => {
      filters.forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-selected", String(b === btn));
      });
      const f = btn.dataset.filter;
      $$(".tile").forEach((t) => t.classList.toggle("is-hidden", f !== "all" && t.dataset.cat !== f));
    })
  );

  /* ---------- Lightbox ---------- */
  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.setAttribute("aria-label", "Podgląd realizacji");
  lb.innerHTML = '<button class="lightbox-close" aria-label="Zamknij podgląd">×</button><div class="lightbox-inner"></div>';
  document.body.appendChild(lb);
  const lbInner = $(".lightbox-inner", lb);
  const closeLb = () => lb.classList.remove("open");
  $$(".tile").forEach((tile) => {
    tile.tabIndex = 0;
    const open = () => {
      const media = tile.querySelector("svg, img").cloneNode(true);
      const cap = tile.querySelector("figcaption");
      lbInner.innerHTML = "";
      lbInner.appendChild(media);
      const p = document.createElement("p");
      p.textContent = cap ? cap.innerText.replace("\n", " — ") : "";
      lbInner.appendChild(p);
      lb.classList.add("open");
      $(".lightbox-close", lb).focus();
    };
    tile.addEventListener("click", open);
    tile.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
  });
  lb.addEventListener("click", (e) => {
    if (e.target === lb || e.target.classList.contains("lightbox-close")) closeLb();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLb();
  });

  /* ---------- Konfigurator wymiarów ---------- */
  const cf = $("#configForm");
  const svg = $("#previewSvg");
  const ptext = $("#previewText");
  const typeNames = { river: "River table", wood: "Lite drewno", flowers: "Drewno + żywica + kwiaty" };
  const shapeNames = { rect: "prostokąt", oval: "owal", round: "okrąg" };

  function seats(shape, L, W) {
    if (shape === "round") return Math.max(2, Math.floor((Math.PI * L) / 60));
    const side = Math.floor(L / 60) * 2;
    const ends = W >= 85 ? 2 : 0;
    return Math.max(2, side + ends);
  }
  function kind(H) {
    if (H < 55) return "stolik kawowy";
    if (H > 95) return "stół barowy / wyspa";
    if (H > 85) return "blat roboczy";
    return "stół jadalniany";
  }

  function renderConfig() {
    const type = cf.type.value;
    const shape = cf.shape.value;
    const L = +cf.length.value;
    let W = +cf.width.value;
    const H = +cf.height.value;
    const widthRow = $("[data-hide-round]", cf);
    widthRow.classList.toggle("is-hidden", shape === "round");
    if (shape === "round") W = L;
    cf.lenOut.value = (shape === "round" ? "Ø " : "") + L + " cm";
    cf.widOut.value = W + " cm";
    cf.heiOut.value = H + " cm";

    // skalowanie do pola 300 × 170
    const s = Math.min(300 / L, 170 / W);
    const w = L * s, h = W * s, x = (340 - w) / 2, y = (200 - h) / 2;
    const rx = shape === "rect" ? 6 : w / 2, ry = shape === "rect" ? 6 : h / 2;
    let deco = "";
    if (type === "river") {
      deco = `<path d="M${x} ${y + h * 0.42} C${x + w * 0.25} ${y + h * 0.3} ${x + w * 0.45} ${y + h * 0.62} ${x + w * 0.7} ${y + h * 0.45} S${x + w * 0.9} ${y + h * 0.38} ${x + w} ${y + h * 0.5}" stroke="#1f7a8c" stroke-width="${Math.max(8, h * 0.18)}" fill="none" stroke-linecap="round"/>`;
    } else if (type === "flowers") {
      const cx = x + w / 2, cy = y + h / 2;
      deco = `<ellipse cx="${cx}" cy="${cy}" rx="${w * 0.3}" ry="${h * 0.3}" fill="#cfe6ea" opacity=".9"/>` +
        [[-0.12, -0.08, "#d98aa6"], [0.1, 0.05, "#f3d9e4"], [-0.02, 0.1, "#c9d7f2"], [0.16, -0.1, "#e9a07a"]]
          .map(([dx, dy, c]) => flower(cx + dx * w, cy + dy * h, Math.max(4, h * 0.06), c, dx * 300))
          .join("");
    } else {
      deco = Array.from({ length: 6 }, (_, k) => {
        const yy = y + (h / 7) * (k + 1);
        return `<path d="M${x + 4} ${yy} C${x + w * 0.3} ${yy - 4} ${x + w * 0.6} ${yy + 4} ${x + w - 4} ${yy}" stroke="#5a3a22" stroke-opacity=".35" fill="none"/>`;
      }).join("");
    }
    svg.innerHTML = `<defs><clipPath id="pc"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" ry="${ry}"/></clipPath></defs>
      <g clip-path="url(#pc)"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#94643c"/>${deco}</g>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" ry="${ry}" fill="none" stroke="#c9982f" stroke-width="1.5"/>
      <text x="170" y="${y - 6 < 10 ? 10 : y - 6}" text-anchor="middle" font-size="11" fill="#5c4d40">${L} cm</text>`;

    const n = seats(shape, L, W);
    const k = kind(H);
    ptext.textContent = `${typeNames[type]} · ${shapeNames[shape]} · ${k}` +
      (k === "stół jadalniany" ? ` · ok. ${n} ${n < 5 ? "osoby" : "osób"}` : "");
  }
  cf.addEventListener("input", renderConfig);
  renderConfig();

  const contact = $("#contactForm");
  $("#useConfig").addEventListener("click", () => {
    const shape = cf.shape.value;
    const L = cf.length.value, W = shape === "round" ? L : cf.width.value, H = cf.height.value;
    contact.dims.value = shape === "round"
      ? `Ø ${L} cm, wys. ${H} cm, okrąg`
      : `${L} × ${W} × ${H} cm, ${shapeNames[shape]}`;
    const map = { river: 0, wood: 1, flowers: 2 };
    contact.product.selectedIndex = map[cf.type.value];
    $("#kontakt").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => contact.name.focus({ preventScroll: true }), 600);
  });

  /* ---------- Formularz kontaktowy ----------
     Brak backendu: formularz otwiera program pocztowy z gotową wiadomością.
     Aby wysyłać bezpośrednio, podepnij np. Formspree / Netlify Forms (atrybut action). */
  const STUDIO_EMAIL = "kontakt@bossgoldenstudio.pl";
  const note = $("#formNote");
  contact.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    ["name", "contact", "message"].forEach((f) => {
      const el = contact[f];
      const bad = !el.value.trim();
      el.classList.toggle("invalid", bad);
      if (bad) ok = false;
    });
    if (!contact.consent.checked) ok = false;
    if (!ok) {
      note.className = "form-note err";
      note.textContent = "Uzupełnij wymagane pola (*) i zaznacz zgodę na kontakt.";
      return;
    }
    const body = [
      `Imię i nazwisko: ${contact.name.value}`,
      `Kontakt: ${contact.contact.value}`,
      `Rodzaj mebla: ${contact.product.value}`,
      `Kwiaty: ${contact.flowers.value}`,
      `Wymiary: ${contact.dims.value || "do ustalenia"}`,
      "",
      contact.message.value,
    ].join("\n");
    const subject = `Zapytanie o wycenę — ${contact.product.value}`;
    window.location.href = `mailto:${STUDIO_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    note.className = "form-note ok";
    note.textContent = "Dziękujemy! Otwieramy Twój program pocztowy z gotową wiadomością.";
  });

  $("#year").textContent = new Date().getFullYear();
})();
