// Portfolio interactions: intro, dot matrix, portals, projects, and contact form.

const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)];
const ov = $("#ov"),
  P = $$(".p"),
  N = P.length,
  dev = $("#dev"),
  home = $("#home");
/* home: live widgets, focus morph (circle to rounded square), boot sequence */
function tick() {
  const d = new Date(),
    f = (o) => d.toLocaleDateString("en-US", o).toUpperCase(),
    h = d.getHours();
  $("#dt").innerHTML =
    f({ weekday: "long" }) + "<br>" + f({ day: "2-digit" }) + "<br>" + f({ month: "short" });
  $("#tm").textContent = (h % 12 || 12) + ":" + (h < 12 ? "AM" : "PM");
}
tick();
setInterval(tick, 3e4);
$("#gl").innerHTML = [...Array(81)]
  .map((_, k) => {
    const x = k % 9,
      y = (k / 9) | 0,
      d = Math.hypot(x - 4, y - 4);
    return (d > 3.3 && d < 4.6) || ((x == 4 || y == 4) && d < 4.6)
      ? `<rect x="${x}" y="${y}" width="1" height="1"/>`
      : "";
  })
  .join("");
/* dot matrix: a grid that swells near the finger or cursor and ripples when focus moves */
const dm = $("#dm"),
  dg = dm.getContext("2d");
let mx = -999,
  my = -999,
  rp = null,
  dirty = 1;
const mobileMotion = matchMedia("(pointer: coarse)");
function dsz() {
  const d = Math.min(devicePixelRatio || 1, mobileMotion.matches ? 1.25 : 2);
  dm.width = dev.clientWidth * d;
  dm.height = dev.clientHeight * d;
  dg.setTransform(d, 0, 0, d, 0, 0);
  dirty = 1;
}
dsz();
addEventListener("resize", dsz);
dev.addEventListener("pointermove", (e) => {
  const r = dev.getBoundingClientRect();
  dirty = 1;
  mx = e.clientX - r.left;
  my = e.clientY - r.top;
});
dev.addEventListener("pointerup", () => { mx = -999; dirty = 1; });
dev.addEventListener("pointerleave", () => {
  mx = -999;
  dirty = 1;
});
(function dl(now) {
  requestAnimationFrame(dl);
  if (document.body.classList.contains("zoom") || (!rp && !dirty)) return;
  dirty = 0;
  const W = dev.clientWidth,
    H = dev.clientHeight,
    S = 20;
  if (rp && now - rp.t > 1500) {
    rp = null;
    dirty = 1;
  }
  dg.clearRect(0, 0, W, H);
  for (let y = S / 2; y < H; y += S)
    for (let x = S / 2; x < W; x += S) {
      let r = 0.9,
        a = 0.2;
      const q = Math.hypot(x - mx, y - my);
      if (q < 120) {
        const k = 1 - q / 120;
        r += k * k * 3.4;
        a += k * 0.6;
      }
      if (rp) {
        const q = Math.abs(Math.hypot(x - rp.x, y - rp.y) - (now - rp.t) * 0.35);
        if (q < 28) {
          const k = 1 - q / 28;
          r += k * 2.2;
          a += k * 0.45;
        }
      }
      dg.fillStyle = `rgba(38,31,23,${a})`;
      dg.beginPath();
      dg.arc(x, y, r, 0, 7);
      dg.fill();
    }
})(0);
let fi = Math.min(1, N - 1),
  lastSw = 0,
  bt,
  wa = 0,
  wt = 0,
  wr,
  ty = 0,
  tx = 0;
function setFocus(i, q, silentWave = false) {
  if (ov.classList.contains("on")) return;
  fi = Math.max(0, Math.min(N - 1, i));
  P.forEach((p, k) => p.classList.toggle("f", k == fi));
  $("#th").style.left = (fi / (N - 1)) * 100 + "%";
  $("#rd").textContent = P[fi].getAttribute("aria-label");
  dev.style.setProperty("--fi", fi);
  if (!silentWave) {
    const r = P[fi].getBoundingClientRect();
    rp = { x: r.left + r.width / 2, y: r.top + r.height / 2, t: performance.now() };
    dirty = 1;
  }
  q || (navigator.vibrate && navigator.vibrate(8));
}
let touring = 0,
  tt;
const endTour = () => {
  touring = 0;
  clearTimeout(tt);
};
/* intro like the video: portals rise from the bottom one after another, pill and dock slide in, focus steps through each portal */
function boot() {
  endTour();
  dev.classList.remove("go");
  P.forEach((p) => p.classList.remove("in", "f"));
  $("#th").style.left = "0%";
  $("#rd").textContent = "";
  void home.offsetWidth;
  const cb = $("#col").getBoundingClientRect().bottom;
  P.forEach((p, i) => {
    const r = p.getBoundingClientRect();
    p.style.setProperty("--dy", cb + 24 - (r.top + r.height / 2) + "px");
    p.style.setProperty("--d", 0.15 + i * 0.3 + "s");
    p.classList.add("in");
  });
  dev.classList.add("go");
  const seq = [...Array(N).keys(), Math.min(1, N - 1)];
  let k = 0;
  touring = 1;
  const step = () => {
    if (!touring) return;
    if (k >= seq.length) {
      touring = 0;
      return;
    }
    setFocus(seq[k++], 1, k > 1);
    tt = setTimeout(step, 380);
  };
  tt = setTimeout(step, 1300);
}
boot();
$("#bolt").onclick = boot;
home.addEventListener(
  "wheel",
  (e) => {
    endTour();
    wa += e.deltaY;
    clearTimeout(wr);
    wr = setTimeout(() => (wa = 0), 200);
    if (Math.abs(wa) > 50 && Date.now() - wt > 220) {
      setFocus(fi + Math.sign(wa));
      wa = 0;
      wt = Date.now();
    }
  },
  { passive: true },
);
home.addEventListener(
  "touchstart",
  (e) => {
    endTour();
    ty = e.touches[0].clientY;
    tx = e.touches[0].clientX;
  },
  { passive: true },
);
home.addEventListener(
  "touchend",
  (e) => {
    const t = e.changedTouches[0],
      dy = t.clientY - ty;
    if (Math.abs(dy) > 36 && Math.abs(dy) > Math.abs(t.clientX - tx)) {
      setFocus(fi - Math.sign(dy));
      lastSw = Date.now();
    }
  },
  { passive: true },
);
const sl = $("#sl"),
  dragTo = (e) => {
    const r = sl.getBoundingClientRect();
    setFocus(Math.round(((e.clientX - r.left) / r.width) * (N - 1)));
  };
sl.onpointerdown = (e) => {
  endTour();
  sl.setPointerCapture(e.pointerId);
  dragTo(e);
  sl.onpointermove = dragTo;
};
sl.onpointerup = () => (sl.onpointermove = null);
P.forEach((p, i) => {
  p.onmouseenter = () => !touring && matchMedia("(hover:hover)").matches && setFocus(i);
  p.onfocus = () => setFocus(i, 1);
});
function toast(t) {
  const e = $("#ts");
  e.textContent = t;
  e.classList.add("on");
  setTimeout(() => e.classList.remove("on"), 1800);
}
$("#dl").onclick = function (e) {
  if (Date.now() - lastSw < 350) return e.preventDefault();
  this.classList.add("dl");
  toast("SAVING // RESUME.PDF");
  setTimeout(() => this.classList.remove("dl"), 1200);
};
/* portal zoom: the orb's rectangle expands into the full screen */
let R,
  RR = 0,
  cur,
  PF,
  CF,
  hist = 0,
  stop = () => {};
const E = "transform .75s cubic-bezier(.75,0,.2,1),opacity .5s";
function mapT(F) {
  const o = ov.getBoundingClientRect(),
    k = R.width / F.rw;
  return `translate(${R.left + R.width / 2 - o.left - k * F.cx}px,${R.top + R.height / 2 - o.top - k * F.cy}px) scale(${k})`;
}
function flip(els, F, inn) {
  els.forEach((e) => {
    e.style.transformOrigin = "0 0";
    if (inn) {
      e.style.transition = "none";
      e.style.opacity = 1;
      e.style.transform = mapT(F);
      e.offsetWidth;
    }
    e.style.transition = E;
    e.style.transform = inn ? "none" : mapT(F);
  });
}
const clip = (r) => {
  const o = ov.getBoundingClientRect();
  return `inset(${r.top - o.top}px ${o.right - r.right}px ${o.bottom - r.bottom}px ${r.left - o.left}px round ${RR}px)`;
};
// Play the aperture once before the existing portal transition.
let shutterBusy = false;
function open(id, el, shutterPlayed = false, replaceHistory = false) {
  if (shutterBusy) return;
  if (id === "cam" && !shutterPlayed && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    endTour();
    shutterBusy = true;
    const orb = el.querySelector(".o-cam");
    orb.classList.add("shutter-active");
    orb.querySelectorAll("animate").forEach((blade) => blade.beginElement());
    setTimeout(() => {
      orb.classList.remove("shutter-active");
      shutterBusy = false;
      open(id, el, true);
    }, 480);
    return;
  }
  endTour();
  {
    const ob = el.querySelector(".orb") || el,
      br = getComputedStyle(ob).borderTopLeftRadius;
    R = ob.getBoundingClientRect();
    RR = br.endsWith("%") ? (parseFloat(br) * R.width) / 100 : parseFloat(br);
    cur = id;
  }
  $$(".s").forEach((s) => s.classList.toggle("on", s.dataset.screen == id));
  dev.dataset.s = id;
  ov.scrollTop = 0;
  ov.style.transition = "none";
  ov.style.clipPath = clip(R);
  ov.offsetWidth;
  ov.style.transition = "";
  ov.classList.add("on");
  ov.style.clipPath = "inset(0px 0px 0px 0px round 0px)";
  document.body.classList.add("zoom");
  {
    const F = { proj: PF, cam: CF }[id];
    if (F) flip(id == "proj" ? [$("#cv")] : [$("#cg"), $("#cf")], F, 1);
  }
  try {
    history[replaceHistory ? "replaceState" : "pushState"]({ o: 1 }, "");
    hist = 1;
  } catch (e) {
    hist = 0;
  }
  stop = ({ story, proj: forest, cam }[id] || (() => () => {}))();
}
function shut() {
  if (!ov.classList.contains("on")) return;
  stop();
  ov.classList.remove("on");
  ov.style.clipPath = clip(R);
  document.body.classList.remove("zoom");
  const c0 = cur,
    F = { proj: PF, cam: CF }[c0],
    els = c0 == "proj" ? [$("#cv")] : [$("#cg"), $("#cf")],
    rl = () => c0 == "cam" && $("#cf").contentWindow.location.reload();
  if (F) {
    flip(els, F, 0);
    if (c0 == "cam") $("#cf").style.opacity = 0;
    setTimeout(() => {
      els.forEach((e) => {
        e.style.transition = "none";
        e.style.transform = "none";
        e.style.opacity = 1;
      });
      rl();
    }, 850);
  } else setTimeout(rl, 850);
}
$("#x").onclick = () => (hist ? history.back() : shut());
addEventListener("popstate", shut);
addEventListener("keydown", (e) => {
  endTour();
  if (e.key == "Escape") $("#x").click();
  else if (/^Arrow(Up|Down)$/.test(e.key)) setFocus(fi + (e.key == "ArrowUp" ? -1 : 1));
});
$$("[data-o]").forEach(
  (b) =>
    (b.onclick = () => {
      if (Date.now() - lastSw > 350) open(b.dataset.o, b);
    }),
);
// Switch panels without adding an extra Back step; the link also works without JavaScript.
$("#story-contact").onclick = (event) => {
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  stop();
  open("contact", $("[data-o=contact]"), false, Boolean(hist));
};
/* MY_STORY: retain the subtle background rings for the short introduction. */
function story() {
  ov.style.setProperty("--k", 0);
  ov.onscroll = () => {
    const range = ov.scrollHeight - ov.clientHeight;
    ov.style.setProperty("--k", range ? ov.scrollTop / range : 0);
  };
  return () => {
    ov.onscroll = null;
  };
}
/* PROJECTS: moss-covered deadwood, drawn procedurally; a lime scan band lights the moss, targets open project info */
let TC = null;
function tree(W, H, d) {
  if (TC && TC.k == W + "x" + H) return TC;
  const mk = () => {
    const k = document.createElement("canvas");
    k.width = W * d;
    k.height = H * d;
    const x = k.getContext("2d");
    x.scale(d, d);
    return [k, x];
  };
  const [T, t] = mk(),
    [M, m] = mk(),
    [L, l] = mk();
  let sd = 7;
  const rn = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  const LM = [
    [
      [0, 0.9],
      [0.1, 0.7],
      [0.24, 0.55],
      [0.42, 0.52],
      [0.5, 0.64],
      [0.62, 0.6],
      [0.8, 0.52],
      [1.05, 0.47],
    ],
    [
      [0.3, 0.55],
      [0.3, 0.42],
      [0.37, 0.36],
    ],
    [
      [0.8, 0.53],
      [0.92, 0.62],
      [1, 0.76],
    ],
    [
      [0.5, 0.63],
      [0.48, 0.8],
      [0.58, 1.02],
    ],
    [
      [0.1, 0.72],
      [0.05, 0.9],
      [0.09, 1.02],
    ],
  ];
  const cr = (P, u) => {
    const i = Math.min(P.length - 2, u | 0),
      f = u - i,
      a = P[Math.max(i - 1, 0)],
      p = P[i],
      q = P[i + 1],
      e = P[Math.min(i + 2, P.length - 1)];
    return [0, 1].map(
      (k) =>
        0.5 *
        (2 * p[k] +
          (q[k] - a[k]) * f +
          (2 * a[k] - 5 * p[k] + 4 * q[k] - e[k]) * f * f +
          (3 * p[k] - a[k] - 3 * q[k] + e[k]) * f * f * f) *
        (k ? H : W),
    );
  };
  const dot = (x, y, r, col) => {
    x.fillStyle = col;
    x.beginPath();
    x.arc(y[0], y[1], r, 0, 7);
    x.fill();
  };
  LM.forEach((P, li) => {
    const n = P.length - 1,
      R = W * (li ? 0.045 : 0.075),
      S = 160;
    for (let k = 0; k <= S; k++) {
      const u = (k / S) * n,
        p = cr(P, u),
        p2 = cr(P, Math.min(n, u + 0.02)),
        r = R * (1 - (0.4 * u) / n) * (0.8 + 0.35 * rn()),
        an = Math.atan2(p2[1] - p[1], p2[0] - p[0]),
        [x, y] = p;
      dot(t, [x + r * 0.18, y + r * 0.22], r, "#43372f");
      dot(t, p, r * 0.88, "#86746a");
      dot(t, [x - r * 0.22, y - r * 0.3], r * 0.45, "#b9a898aa");
      t.strokeStyle = "#2a201a40";
      for (let j = 0; j < 3; j++) {
        const o = (rn() - 0.5) * r * 1.6,
          ox = x - Math.sin(an) * o,
          oy = y + Math.cos(an) * o;
        t.beginPath();
        t.moveTo(ox, oy);
        t.lineTo(ox + Math.cos(an) * r * 0.9, oy + Math.sin(an) * r * 0.9);
        t.stroke();
      }
      if (rn() < (li ? 0.5 : 0.75))
        for (let j = 0; j < 7; j++) {
          const q = [x + (rn() - 0.5) * r * 1.7, y - r * (0.35 + rn() * 0.6)],
            mr = 2 + rn() * 5.5,
            h = rn();
          dot(m, q, mr, `hsl(${95 + h * 30} ${45 + rn() * 20}% ${22 + h * 24}%)`);
          dot(l, q, mr, `hsl(${85 + h * 25} 90% ${44 + h * 20}%)`);
        }
    }
  });
  for (let j = 0; j < 120; j++) {
    const q = [rn() * W, H * (0.88 + rn() * 0.14)],
      r = 6 + rn() * 12;
    dot(m, q, r, `hsl(${100 + rn() * 25} 40% ${14 + rn() * 14}%)`);
    dot(l, q, r, `hsl(${95 + rn() * 20} 80% ${30 + rn() * 14}%)`);
  }
  return (TC = { k: W + "x" + H, T, M, L });
}

// Each project is authored here. Relative project URLs link to a local case study;
// Source URL is the confirmed public Drive Aware repository.
const portfolioProjects = [
  {
    title: "01 / DRIVE AWARE",
    summary:
      "An edge-device prototype for retrieving dashcam recordings and logging motion data through a Raspberry Pi and Flask API. Phone sensors and voice alerts were explored, not delivered end to end.",
    role: "Personal project · system design, backend implementation, integration troubleshooting",
    tools: "Raspberry Pi · Python · Flask · HTTP/JSON · HTML · Cordova (experimental)",
    outcome: "Previously demonstrated local video browsing and test motion POSTs; documented hardware and mobile integration limits.",
    status: "ARCHIVED PROTOTYPE / NOT LIVE",
    stackShort: "PI + FLASK",
    image: "images/drive-aware-system.svg", // Conceptual diagram, not a product screenshot.
    imageAlt: "Drive Aware architecture diagram: dashcam files, Raspberry Pi Flask service, browser",
    liveUrl: "projects/drive-aware/index.html", // Local case study; works without a GitHub repository.
    liveLabel: "Read case study ↗",
    sourceUrl: "https://github.com/oocalder/Drive-Aware", // Published project source.
  },
  {
    title: "Project 02 / Technical build",
    summary: "Explain the problem, how the system works, and the part you built.",
    role: "Your role / contribution",
    tools: "Stack and integrations",
    outcome: "Result, learning, or measurable impact",
    image: "",
    liveUrl: "",
    sourceUrl: "",
    status: "COMING SOON",
    stackShort: "TBD",
  },
  {
    title: "Project 03 / Creative work",
    summary: "Show a photography, video, audio, or design project and the idea behind it.",
    role: "Your role / contribution",
    tools: "Creative tools and workflow",
    outcome: "Final deliverable or creative result",
    image: "",
    liveUrl: "",
    sourceUrl: "",
    status: "COMING SOON",
    stackShort: "TBD",
  },
];
function showProject(number) {
  const item = portfolioProjects[number - 1];
  if (!item) return;
  for (const key of ["title", "summary", "role", "tools", "outcome"])
    $("#project-" + key).textContent = item[key];
  $("#project-status").textContent = item.status || "PROJECT";
  const visual = $("#project-visual");
  visual.replaceChildren();
  if (item.image) {
    const im = document.createElement("img");
    im.src = item.image;
    im.alt = item.imageAlt || item.title;
    visual.append(im);
  } else visual.textContent = "0" + number + " / PREVIEW";
  const links = $("#project-links");
  links.replaceChildren();
  for (const [label, url] of [
    [item.liveLabel || "View project ↗", item.liveUrl],
    ["Source ↗", item.sourceUrl],
  ]) {
    // Allow trusted internal case-study paths as well as published HTTPS URLs.
    if (!url || !(/^https:\/\//i.test(url) || /^projects\/(?:[a-z0-9_-]+\/)+index\.html$/i.test(url))) continue;
    const a = document.createElement("a");
    a.textContent = label;
    a.href = url;
    if (/^https:\/\//i.test(url)) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    links.append(a);
  }
  $$("#project-tabs button").forEach((b) =>
    b.setAttribute("aria-pressed", String(+b.dataset.project === number)),
  );
  $$(".rt").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.p === number)));
}
$$("#project-tabs button").forEach((b) => (b.onclick = () => showProject(+b.dataset.project)));

function forest() {
  showProject(1);
  const c = $("#cv"),
    g = c.getContext("2d"),
    d = Math.min(devicePixelRatio || 1, mobileMotion.matches ? 1 : 1.5),
    W = ov.clientWidth,
    H = ov.clientHeight;
  c.width = W * d;
  c.height = H * d;
  g.setTransform(d, 0, 0, d, 0, 0);
  const { T, M, L } = tree(W, H, d),
    B = document.createElement("canvas");
  B.width = W * d;
  B.height = H * d;
  const b = B.getContext("2d");
  b.scale(d, d);
  let on = 1,
    px = -99,
    py = -99,
    info = 0;
  const la = {},
    t0 = performance.now(),
    set = (el, v) => {
      if (la[el.id] !== v) {
        la[el.id] = v;
        el.textContent = v;
      }
    };
  c.onpointermove = (e) => {
    const r = c.getBoundingClientRect();
    px = e.clientX - r.left;
    py = e.clientY - r.top;
  };
  c.onpointerleave = () => (px = -99);
  $$(".rt").forEach(
    (r) =>
      (r.onclick = () => {
        info = r.dataset.p;
        showProject(+info);
      }),
  );
  (function f(now) {
    if (!on) return;
    const e = (now - t0) / 1e3,
      ez = 1 - (1 - Math.min(1, e / 2.4)) ** 3,
      sx = px > 0 ? (0.5 - px / W) * 8 : 0;
    g.clearRect(0, 0, W, H);
    g.drawImage(T, sx, 0, W, H);
    g.globalAlpha = ez;
    g.drawImage(M, sx, 0, W, H);
    b.globalCompositeOperation = "source-over";
    b.clearRect(0, 0, W, H);
    b.drawImage(L, 0, 0, W, H);
    b.globalCompositeOperation = "destination-in";
    const bx = (((e * 0.3) % 1.6) - 0.3) * W * 1.3,
      q = b.createLinearGradient(bx - W * 0.18, 0, bx + W * 0.18, 0);
    q.addColorStop(0, "#0000");
    q.addColorStop(0.5, "#000");
    q.addColorStop(1, "#0000");
    b.fillStyle = q;
    b.fillRect(0, 0, W, H);
    g.globalAlpha = ez * 0.85;
    g.drawImage(B, sx, 0, W, H);
    g.globalAlpha = 1;
    g.fillStyle = "#ffffff59";
    if (e > 1.4)
      for (let x = 10; x < W * 0.6; x += 7)
        for (let y = H * 0.43; y < H * 0.55; y += 7) g.fillRect(x, y, 1.4, 1.4);
    if (px > 0)
      for (let x = px - 84; x < px + 84; x += 8)
        for (let y = py - 84; y < py + 84; y += 8) {
          const k = Math.hypot(x - px, y - py);
          if (k < 84) {
            g.fillStyle = `rgba(255,255,255,${(1 - k / 84) * 0.75})`;
            g.fillRect(x - (x % 8), y - (y % 8), 2, 2);
          }
        }
    set($("#az"), "CALCULATE\nD_AZIMU\nTH: 345°".slice(0, Math.max(0, Math.floor((e - 0.4) * 14))));
    set($("#dn"), e > 1 ? "+" + Math.round(Math.min(1, (e - 1) / 2.2) * 80) : "");
    set(
      $("#an"),
      info
        ? `PROJECT_0${info}\nSTACK ${portfolioProjects[info - 1].stackShort}\nSTATUS ${portfolioProjects[info - 1].status}`
        : "ANALYZING_SURFACE_\nBIOME...".slice(0, Math.max(0, Math.floor((e - 2) * 18))),
    );
    requestAnimationFrame(f);
  })(t0);
  return () => {
    on = 0;
    c.onpointermove = null;
  };
}
/* CAM_VIEW: the digicam engine from the nomad zip lives in cam/ and runs inside the screen */
function cam() {
  setTimeout(() => {
    const w = $("#cf").contentWindow;
    w && w.postMessage({ go: 1 }, location.origin);
  }, 450);
  return () => {};
}
// Bottom-left hamburger is intentionally commented out in index.html.
// Restore both the markup and the handler below if the control is needed later.
// $("#mn").onclick = () => ov.classList.contains("on") && $("#x").click();
/* icons: the Projects and Cam View portals show the real scenes, so opening them is one continuous zoom */
function focalBg(o, url, F, W, H) {
  const A = W / F.rw,
    ih = (A * H) / W;
  Object.assign(o.style, {
    backgroundImage: `url(${url})`,
    backgroundSize: `${A * 100}% auto`,
    backgroundPosition: `${((0.5 - (F.cx / W) * A) / (1 - A)) * 100}% ${((0.5 - (F.cy / H) * ih) / (1 - ih)) * 100}%`,
    backgroundRepeat: "no-repeat",
  });
  o.classList.add("ic");
}
function icons() {
  const W = dev.clientWidth,
    H = dev.clientHeight,
    d = Math.min(devicePixelRatio || 1, mobileMotion.matches ? 1 : 1.5),
    { T, M } = tree(W, H, d),
    c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const x = c.getContext("2d");
  x.fillStyle = "#c7bdb4";
  x.fillRect(0, 0, W, H);
  x.drawImage(T, 0, 0, W, H);
  x.drawImage(M, 0, 0, W, H);
  PF = { cx: 0.48 * W, cy: 0.6 * H, rw: 0.55 * W };
  const o = $(".o-proj");
  o.style.backgroundColor = "#c7bdb4";
  focalBg(o, c.toDataURL("image/jpeg", 0.9), PF, W, H);
}
function camIcon(d) {
  if (CF) return;
  const im = new Image();
  im.onload = () => {
    const W = dev.clientWidth,
      H = dev.clientHeight,
      k = im.width / W,
      c = document.createElement("canvas");
    c.width = im.width;
    c.height = im.height;
    const x = c.getContext("2d", { willReadFrequently: true });
    x.drawImage(im, 0, 0);
    const a = x.getImageData(0, 0, c.width, c.height).data;
    let x0 = 1e9,
      y0 = 1e9,
      x1 = 0,
      y1 = 0;
    for (let y = 0; y < c.height; y += 2)
      for (let X = 0; X < c.width; X += 2)
        if (a[(y * c.width + X) * 4 + 3] > 230) {
          X < x0 && (x0 = X);
          X > x1 && (x1 = X);
          y < y0 && (y0 = y);
          y > y1 && (y1 = y);
        }
    if (x1 <= x0) return;
    CF = { cx: (x0 + x1) / 2 / k, cy: (y0 + y1) / 2 / k, rw: (x1 - x0) / k / 0.8 };
    dev.style.setProperty("--cb", d.bg);
    $("#cg").src = d.icon;
    const o = $(".o-cam");
    o.style.backgroundColor = d.bg;
    focalBg(o, d.icon, CF, W, H);
  };
  im.src = d.icon;
}
addEventListener("message", (e) => {
  if (e.origin !== location.origin || !e.data) return;
  const m = e.data;
  if (m.cam == "ready") return camIcon(m);
  if (!m.route) return;
  const id = m.route == "about" ? "story" : "contact";
  shut();
  setTimeout(() => open(id, id == "story" ? $(".av") : $("[data-o=contact]")), 900);
});
setTimeout(icons, 60); // Camera intro disabled. To restore it, change gallery.html to index.html.
$("#cf").src = "cam/gallery.html";
let rt;
addEventListener("resize", () => {
  clearTimeout(rt);
  rt = setTimeout(icons, 500);
});

(function () {
  var form = document.getElementById("contact-form");
  var statusEl = document.getElementById("form-status");
  var button = form.querySelector(".submit-btn");
  var TO_EMAIL = "OscarOCalder@gmail.com";

  function setStatus(msg, type) {
    statusEl.textContent = msg;
    statusEl.className = "form-status " + (type || "");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Spam trap filled in? Pretend success and do nothing.
    if (form.elements["_gotcha"].value) {
      setStatus("Thanks! Your message was sent.", "success");
      return;
    }

    var first = form.elements["first_name"].value.trim();
    var last = form.elements["last_name"].value.trim();
    var subject = form.elements["subject"].value.trim() || "Website inquiry";
    var email = form.elements["email"].value.trim();
    var message = form.elements["message"].value.trim();
    var fullName = (first + " " + last).trim();

    // Formspree not set up yet -> open the visitor's email app instead
    if (form.action.indexOf("YOUR_FORM_ID") !== -1) {
      var body =
        (fullName ? "Name: " + fullName + "\n" : "") + "Email: " + email + "\n\n" + message;
      window.location.href =
        "mailto:" +
        TO_EMAIL +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);
      setStatus("Opening your email app...", "success");
      return;
    }

    // Formspree is set up -> send it in the background
    button.disabled = true;
    setStatus("Sending...", "");

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    })
      .then(function (response) {
        if (response.ok) {
          form.reset();
          setStatus("Thanks! Your message was sent.", "success");
        } else {
          setStatus("Something went wrong. Please email " + TO_EMAIL + " directly.", "error");
        }
      })
      .catch(function () {
        setStatus("Something went wrong. Please email " + TO_EMAIL + " directly.", "error");
      })
      .finally(function () {
        button.disabled = false;
      });
  });
})();

addEventListener("message", (e) => {
  if (e.origin === location.origin && e.source === $("#cf").contentWindow && e.data?.galleryBack)
    $("#x").click();
});
