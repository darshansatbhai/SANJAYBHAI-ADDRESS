/**
 * ═══════════════════════════════════════════════════════════
 * DIGITAL VISITING CARD — INTERACTION & RENDER ENGINE
 * 3D Free-rotation with inertia, lazy drag, tap to flip,
 * tap to dial/email, long-press copy, QR & vCard generation.
 * ═══════════════════════════════════════════════════════════
 */
"use strict";

(function () {
  const $ = (id) => document.getElementById(id);
  const card = $("card");
  const reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Address text helper ────────────────────────────────── */
  function getFullAddressText() {
    return CONFIG.address + (CONFIG.landmark ? "\nLandmark: " + CONFIG.landmark : "");
  }

  function setLink(id, text, href) {
    const el = $(id);
    if (!el) return;
    el.textContent = text;
    el.href = href;
    el.setAttribute("data-copy", text);
  }

  /* ── Render Content from CONFIG ─────────────────────────── */
  function render() {
    // Front - owner info
    if ($("fName")) $("fName").textContent = CONFIG.ownerName;
    if ($("fRole")) $("fRole").textContent = CONFIG.tagline;
    if ($("fMono")) $("fMono").textContent = CONFIG.monogram || "S";

    // Front - Contact 1
    const c1Name = CONFIG.contact1.name || CONFIG.ownerName.split(" ")[0];
    if ($("l1")) $("l1").textContent = c1Name;
    setLink("p1", CONFIG.contact1.phone, "tel:" + CONFIG.contact1.phone.replace(/[^\d+]/g, ""));
    setLink("e1", CONFIG.contact1.email, "mailto:" + CONFIG.contact1.email);

    // Front - Contact 2
    const c2Label = (CONFIG.contact2.name || "Son") + (CONFIG.contact2.relation ? " · " + CONFIG.contact2.relation : "");
    if ($("l2")) $("l2").textContent = c2Label;
    setLink("p2", CONFIG.contact2.phone, "tel:" + CONFIG.contact2.phone.replace(/[^\d+]/g, ""));
    setLink("e2", CONFIG.contact2.email, "mailto:" + CONFIG.contact2.email);

    // Back - Address & Landmark
    if ($("bAddr")) $("bAddr").textContent = CONFIG.address;
    if ($("bLand")) $("bLand").textContent = CONFIG.landmark ? "Landmark: " + CONFIG.landmark : "";
    if ($("addrBox")) $("addrBox").setAttribute("data-copy", getFullAddressText());

    // Map Action button
    if ($("mapBtn")) $("mapBtn").href = CONFIG.mapsUrl;

    // QR Code generation
    const qrContainer = $("qr");
    if (qrContainer) {
      qrContainer.innerHTML = "";
      try {
        if (typeof QRCode !== "undefined") {
          new QRCode(qrContainer, {
            text: CONFIG.mapsUrl,
            width: 120,
            height: 120,
            colorDark: "#111111",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M,
          });
        }
      } catch (err) {
        console.warn("QR code render failed:", err);
        qrContainer.textContent = "QR";
      }
    }
  }

  /* ── Toast & Fallback Copy Sheet ────────────────────────── */
  let toastTimer = 0;
  function toast(msg) {
    const t = $("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2000);
  }

  function showSheet(text) {
    const s = $("sheet");
    const ta = $("sheetText");
    if (!s || !ta) return;
    ta.value = text;
    s.hidden = false;
    ta.focus();
    ta.select();
    try {
      ta.setSelectionRange(0, text.length);
    } catch (_) {}
  }

  const sheetClose = $("sheetClose");
  if (sheetClose) {
    sheetClose.addEventListener("click", () => {
      const s = $("sheet");
      if (s) s.hidden = true;
    });
  }

  function legacyCopy(text) {
    let ok = false;
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, text.length);
      ok = document.execCommand("copy");
      document.body.removeChild(ta);
    } catch (_) {
      ok = false;
    }
    if (ok) {
      toast(CONFIG.toastCopied);
    } else {
      showSheet(text);
    }
  }

  function copyText(text) {
    if (!text) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          () => toast(CONFIG.toastCopied),
          () => legacyCopy(text)
        );
      } else {
        legacyCopy(text);
      }
    } catch (_) {
      legacyCopy(text);
    }
  }

  const copyBtn = $("copyBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => copyText(getFullAddressText()));
  }

  /* ── vCard (.vcf) Download ──────────────────────────────── */
  function downloadVCard() {
    const vcards = [
      // Sanjaybhai Satbhai
      [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${CONFIG.ownerName}`,
        `N:Satbhai;Sanjaybhai;;;`,
        `TEL;TYPE=CELL,VOICE:${CONFIG.contact1.phone}`,
        `EMAIL;TYPE=PREF,INTERNET:${CONFIG.contact1.email}`,
        `ADR;TYPE=HOME:;;${CONFIG.address};;;;`,
        `NOTE:Landmark: ${CONFIG.landmark}`,
        `URL:${CONFIG.mapsUrl}`,
        "END:VCARD",
      ].join("\r\n"),
      // Darshan Satbhai (Son)
      [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${CONFIG.contact2.fullName || CONFIG.contact2.name + " Satbhai"}`,
        `N:Satbhai;${CONFIG.contact2.name};;;`,
        `TEL;TYPE=CELL,VOICE:${CONFIG.contact2.phone}`,
        `EMAIL;TYPE=PREF,INTERNET:${CONFIG.contact2.email}`,
        `ADR;TYPE=HOME:;;${CONFIG.address};;;;`,
        `NOTE:Son of Sanjaybhai Satbhai. Landmark: ${CONFIG.landmark}`,
        `URL:${CONFIG.mapsUrl}`,
        "END:VCARD",
      ].join("\r\n"),
    ];

    const blob = new Blob([vcards.join("\r\n")], {
      type: "text/vcard;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = CONFIG.vcardFilename || "Satbhai_Family.vcf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast(CONFIG.toastSaved);
  }

  const vcardBtn = $("vcardBtn");
  if (vcardBtn) {
    vcardBtn.addEventListener("click", downloadVCard);
  }

  /* ── 3D Inertia Engine ──────────────────────────────────── */
  const st = {
    rx: 5,
    ry: reduce ? -12 : -48,
    vx: 0,
    vy: 0,
    tx: null,
    ty: null,
    drag: false,
    raf: 0,
  };
  const RAD = Math.PI / 180;

  function apply() {
    card.style.transform = `rotateX(${st.rx}deg) rotateY(${st.ry}deg)`;
    const a = 40 + st.ry * 1.1 + st.rx * 0.6;
    const a2 = 40 - st.ry * 1.1 + st.rx * 0.6;
    const pf = 50 + 85 * Math.sin(st.ry * RAD) - 45 * Math.sin(st.rx * RAD);
    const pb = 50 - 85 * Math.sin(st.ry * RAD) - 45 * Math.sin(st.rx * RAD);

    card.style.setProperty("--a", a + "deg");
    card.style.setProperty("--a2", a2 + "deg");
    card.style.setProperty("--pf", pf + "%");
    card.style.setProperty("--pb", pb + "%");
  }

  function loop() {
    st.raf = 0;
    if (!st.drag) {
      if (st.tx !== null) {
        st.rx += (st.tx - st.rx) * 0.13;
        st.ry += (st.ty - st.ry) * 0.13;
        if (Math.abs(st.tx - st.rx) < 0.15 && Math.abs(st.ty - st.ry) < 0.15) {
          st.rx = st.tx;
          st.ry = st.ty;
          st.tx = st.ty = null;
        }
      } else {
        st.rx += st.vx;
        st.ry += st.vy;
        st.vx *= 0.95;
        st.vy *= 0.95;
        if (Math.abs(st.vx) < 0.03) st.vx = 0;
        if (Math.abs(st.vy) < 0.03) st.vy = 0;
      }
    }
    apply();
    if (st.drag || st.tx !== null || st.vx || st.vy) kick();
  }

  function kick() {
    if (!st.raf) st.raf = requestAnimationFrame(loop);
  }

  function goTo(rx, ry) {
    if (reduce) {
      st.rx = rx;
      st.ry = ry;
      st.tx = st.ty = null;
      st.vx = st.vy = 0;
      apply();
      return;
    }
    st.tx = rx;
    st.ty = ry;
    st.vx = st.vy = 0;
    kick();
  }

  function facingFront() {
    return Math.cos(st.rx * RAD) * Math.cos(st.ry * RAD) >= 0;
  }

  function flip() {
    const toBack = facingFront();
    const off = toBack ? 180 : 0;
    goTo(
      Math.round(st.rx / 360) * 360,
      Math.round((st.ry - off) / 360) * 360 + off
    );
  }

  /* ── Pointer Handling: Drag, Tap & Long Press ─────────────── */
  let down = null;
  let lp = 0;
  let suppress = false;

  function clearLP() {
    clearTimeout(lp);
    lp = 0;
  }

  card.addEventListener("contextmenu", (e) => e.preventDefault());
  card.addEventListener("dragstart", (e) => e.preventDefault());

  card.addEventListener(
    "click",
    (e) => {
      if (suppress) {
        e.preventDefault();
        e.stopPropagation();
        suppress = false;
      }
    },
    true
  );

  card.addEventListener("pointerdown", (e) => {
    suppress = false;
    clearLP();
    const t = e.target;
    const el = t.closest ? t.closest("[data-copy]") : null;

    down = {
      lx: e.clientX,
      ly: e.clientY,
      t: Date.now(),
      moved: 0,
      dragging: false,
      pid: e.pointerId,
      copied: false,
      link: !!(t.closest && t.closest("a")),
    };

    if (el) {
      lp = setTimeout(() => {
        if (down && !down.dragging && down.moved < 8) {
          down.copied = true;
          suppress = true;
          try {
            if (navigator.vibrate) navigator.vibrate(18);
          } catch (_) {}
          copyText(el.getAttribute("data-copy"));
        }
      }, 520);
    }
  });

  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--gx", ((e.clientX - r.left) / r.width) * 100 + "%");
    card.style.setProperty("--gy", ((e.clientY - r.top) / r.height) * 100 + "%");
    card.style.setProperty("--gi", e.pointerType === "touch" && !down ? "0" : ".9");

    if (!down) return;
    const dx = e.clientX - down.lx;
    const dy = e.clientY - down.ly;
    down.lx = e.clientX;
    down.ly = e.clientY;
    down.moved += Math.abs(dx) + Math.abs(dy);

    if (!down.dragging) {
      if (down.moved <= 6 || down.copied) return;
      down.dragging = true;
      suppress = true;
      clearLP();
      st.drag = true;
      st.tx = st.ty = null;
      st.vx = st.vy = 0;
      card.classList.add("drag");
      try {
        card.setPointerCapture(down.pid);
      } catch (_) {}
    }

    st.ry += dx * 0.55;
    st.rx -= dy * 0.55;
    st.vy = dx * 0.55;
    st.vx = -dy * 0.55;
    kick();
  });

  function pointerEnd() {
    clearLP();
    if (!down) return;
    const d = down;
    down = null;

    if (d.dragging) {
      st.drag = false;
      card.classList.remove("drag");
      if (reduce) {
        st.vx = st.vy = 0;
      }
      kick();
      return;
    }

    if (d.copied || d.link) return;
    if (Date.now() - d.t < 450 && d.moved < 8) flip();
  }

  card.addEventListener("pointerup", pointerEnd);
  card.addEventListener("pointercancel", () => {
    clearLP();
    down = null;
    st.drag = false;
    card.classList.remove("drag");
    kick();
  });
  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--gi", "0");
  });

  /* Keyboard controls */
  card.addEventListener("keydown", (e) => {
    const k = e.key;
    if (e.target !== card) return;
    if (k === "Enter" || k === " " || k === "f" || k === "F") {
      e.preventDefault();
      flip();
    } else if (k === "ArrowLeft") {
      e.preventDefault();
      st.vy = -9;
      st.tx = null;
      kick();
    } else if (k === "ArrowRight") {
      e.preventDefault();
      st.vy = 9;
      st.tx = null;
      kick();
    } else if (k === "ArrowUp") {
      e.preventDefault();
      st.vx = 9;
      st.tx = null;
      kick();
    } else if (k === "ArrowDown") {
      e.preventDefault();
      st.vx = -9;
      st.tx = null;
      kick();
    }
  });

  const flipBtn = $("flipBtn");
  if (flipBtn) flipBtn.addEventListener("click", flip);

  /* Initialize */
  render();
  apply();
  goTo(5, -12);
})();
