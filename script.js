/* ═══════════════════════════════════════════════════════════
   UMBRA — site script
   👉 Edit the CONFIG block below. Everything else reads from it.
   ═══════════════════════════════════════════════════════════ */

const CONFIG = {
  // EDIT: your public contact email
  email: "mehrablone300@gmail.com",

  // EDIT: your GitHub username (project source buttons use it)
  githubUser: "0-umbra",

  // EDIT: social links. Leave a value as "" to hide that link.
  socials: {
    GitHub: "https://github.com/0-umbra",
    YouTube: "",
    Twitch: "",
    Discord: "",
    X: "",
    Instagram: ""
  },

  // EDIT: the games you're playing right now
  playing: ["Minecraft", "Valorant", "PUBG", "Call Of Duty"]
};

/* ═══════════════════════════════════════════════════════════
   PROJECTS — add a new one by copying an object.
   `demo` is a URL or a file in /demos. `repo` is the GitHub repo name.
   category must be one of: Game, Web App, Tool, Experiment
   ═══════════════════════════════════════════════════════════ */
const PROJECTS = [
  {
    name: "Neon Drift",
    category: "Game",
    blurb: "A one-button arcade drift racer at 60fps. Procedural track, neon trails, instant restarts and a local best score.",
    tech: ["Canvas", "JavaScript", "LocalStorage"],
    demo: "demos/neon-drift.html",
    repo: "neon-drift"
  },
  {
    name: "Focus Flow",
    category: "Web App",
    blurb: "A calm focus timer with session history, daily streaks and a seven-day chart. Works offline, needs no account.",
    tech: ["SVG", "Web Audio", "LocalStorage"],
    demo: "demos/focus-flow.html",
    repo: "focus-flow"
  },
  {
    name: "Snippet Vault",
    category: "Tool",
    blurb: "A keyboard-first snippet manager with search, syntax highlighting and JSON import and export. Fully local.",
    tech: ["JavaScript", "CSS", "LocalStorage"],
    demo: "demos/snippet-vault.html",
    repo: "snippet-vault"
  },
  {
    name: "Weather Window",
    category: "Web App",
    blurb: "A glassy weather dashboard with hourly and 7-day forecasts from the free Open-Meteo API. No keys, really works.",
    tech: ["JavaScript", "Open-Meteo API", "Geolocation"],
    demo: "demos/weather-window.html",
    repo: "weather-window"
  },
  {
    name: "CSS Lab",
    category: "Experiment",
    blurb: "A gallery of pure-CSS experiments: no JavaScript, just selectors, gradients and a bit of stubbornness.",
    tech: ["CSS", "HTML"],
    demo: "demos/css-lab.html",
    repo: "css-lab"
  }
];

/* ───────────────────────── Render: projects ───────────────────────── */
const KIND_LABEL = { "Game": "Game", "Web App": "Web app", "Tool": "Tool", "Experiment": "Experiment" };

function renderProjects() {
  const list = document.getElementById("projects");
  list.innerHTML = PROJECTS.map((p) => `
    <li class="project" data-category="${p.category}">
      <div>
        <h3>${p.name}</h3>
        <span class="kind">${KIND_LABEL[p.category] || p.category}</span>
      </div>
      <div>
        <p class="blurb">${p.blurb}</p>
        <ul class="tech">${p.tech.map((t) => `<li>${t}</li>`).join("")}</ul>
      </div>
      <div class="links">
        <a class="btn btn-primary" href="${p.demo}" target="_blank" rel="noopener">${p.category === "Game" ? "Play it" : "Open demo"}</a>
      </div>
    </li>`).join("");
}

function setupFilters() {
  const chips = document.querySelectorAll("#filters .chip");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => { c.classList.remove("is-on"); c.setAttribute("aria-pressed", "false"); });
      chip.classList.add("is-on");
      chip.setAttribute("aria-pressed", "true");
      const f = chip.dataset.filter;
      document.querySelectorAll(".project").forEach((row) => {
        row.hidden = !(f === "all" || row.dataset.category === f);
      });
    });
  });
}

/* ───────────────────────── Render: gaming + socials ───────────────────────── */
function renderPlaying() {
  document.getElementById("playing").innerHTML = CONFIG.playing.map((g) => `<li>${g}</li>`).join("");
}

function renderSocials() {
  const entries = Object.entries(CONFIG.socials).filter(([, url]) => url);
  document.getElementById("socials").innerHTML = entries
    .map(([label, url]) => `<li><a href="${url}" target="_blank" rel="noopener">${label}</a></li>`)
    .join("");

  // elements marked data-link="email" / "youtube" read from CONFIG
  document.querySelectorAll('[data-link="email"]').forEach((a) => { a.href = `mailto:${CONFIG.email}`; });
  document.querySelectorAll('[data-link="youtube"]').forEach((a) => {
    if (CONFIG.socials.YouTube) { a.href = CONFIG.socials.YouTube; a.target = "_blank"; a.rel = "noopener"; }
    else { a.textContent = "Say hi about collabs"; }
  });
}

/* ───────────────────────── Console: load the game on demand ───────────────────────── */
function setupConsole() {
  const btn = document.getElementById("console-start");
  const screen = document.getElementById("console-screen");
  btn.addEventListener("click", () => {
    const frame = document.createElement("iframe");
    frame.src = "demos/neon-drift.html";
    frame.title = "Neon Drift, a playable one-button drift racer";
    frame.allow = "fullscreen";
    screen.replaceChildren(frame);
    frame.focus();
  });
}

/* ───────────────────────── Contact ───────────────────────── */
function setupCopy() {
  const btn = document.getElementById("copy-email");
  const status = document.getElementById("copy-status");
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(CONFIG.email);
      status.textContent = `Copied ${CONFIG.email}`;
    } catch {
      status.textContent = `Copy failed. My email is ${CONFIG.email}`;
    }
    setTimeout(() => { status.textContent = ""; }, 3500);
  });
}

/* ═══════════════════════════════════════════════════════════
   Hero: the eclipse. The cursor moves the moon across the sun.
   ═══════════════════════════════════════════════════════════ */
function setupEclipse() {
  const canvas = document.getElementById("eclipse");
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let size = 0, dpr = 1, raf = 0, running = false;
  let tx = 0, ty = 0;      // target moon offset (0..1 of radius)
  let mx = 0.55, my = -0.2; // current moon offset
  let pointerActive = false;
  let lastMove = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    size = canvas.clientWidth;
    canvas.width = canvas.height = Math.round(size * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw(t) {
    const c = size / 2;
    const R = size * 0.2;
    ctx.clearRect(0, 0, size, size);

    // faint orbit rings
    ctx.lineWidth = 1;
    for (let i = 1; i <= 3; i++) {
      ctx.strokeStyle = `rgba(124,134,255,${0.14 - i * 0.03})`;
      ctx.beginPath();
      ctx.arc(c, c, R * (1.7 + i * 0.55), 0, Math.PI * 2);
      ctx.stroke();
    }

    // corona glow
    const glow = ctx.createRadialGradient(c, c, R * 0.6, c, c, R * 2.6);
    glow.addColorStop(0, "rgba(255,179,71,0.55)");
    glow.addColorStop(0.35, "rgba(255,107,74,0.22)");
    glow.addColorStop(1, "rgba(255,107,74,0)");
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(c, c, R * 2.6, 0, Math.PI * 2); ctx.fill();

    // sun
    const sun = ctx.createRadialGradient(c - R * 0.2, c - R * 0.2, R * 0.1, c, c, R);
    sun.addColorStop(0, "#fff3d6");
    sun.addColorStop(0.55, "#ffb347");
    sun.addColorStop(1, "#ff6b4a");
    ctx.fillStyle = sun;
    ctx.beginPath(); ctx.arc(c, c, R, 0, Math.PI * 2); ctx.fill();

    // moon (the umbra)
    const mxp = c + mx * R * 1.15;
    const myp = c + my * R * 1.15;
    ctx.fillStyle = "#08080f";
    ctx.beginPath(); ctx.arc(mxp, myp, R * 1.01, 0, Math.PI * 2); ctx.fill();

    // thin rim light on the moon's edge for depth
    ctx.strokeStyle = "rgba(124,134,255,0.35)";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(mxp, myp, R * 1.01, 0, Math.PI * 2); ctx.stroke();

    // a few slow-drifting embers
    if (!reduce) {
      for (let i = 0; i < 14; i++) {
        const a = t * 0.00008 * (1 + (i % 4) * 0.3) + i * 1.9;
        const rr = R * (1.5 + ((i * 37) % 100) / 100 * 1.4);
        ctx.fillStyle = `rgba(255,179,71,${0.25 + ((i * 13) % 50) / 100})`;
        ctx.beginPath();
        ctx.arc(c + Math.cos(a) * rr, c + Math.sin(a) * rr, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function frame(t) {
    if (!pointerActive || t - lastMove > 2500) {
      // idle: the moon orbits slowly
      tx = Math.cos(t * 0.00028) * 0.8;
      ty = Math.sin(t * 0.00028 * 1.3) * 0.5;
    }
    mx += (tx - mx) * 0.06;
    my += (ty - my) * 0.06;
    draw(t);
    raf = requestAnimationFrame(frame);
  }

  function start() { if (!running && !reduce) { running = true; raf = requestAnimationFrame(frame); } }
  function stop() { running = false; cancelAnimationFrame(raf); }

  window.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const R = r.width * 0.2;
    let dx = (e.clientX - cx) / (R * 1.6);
    let dy = (e.clientY - cy) / (R * 1.6);
    const len = Math.hypot(dx, dy);
    if (len > 1.1) { dx = dx / len * 1.1; dy = dy / len * 1.1; }
    tx = dx; ty = dy;
    pointerActive = true;
    lastMove = performance.now();
  }, { passive: true });

  window.addEventListener("resize", () => { resize(); if (reduce) draw(0); });
  new IntersectionObserver(([en]) => { en.isIntersecting ? start() : stop(); }).observe(canvas);
  document.addEventListener("visibilitychange", () => { document.hidden ? stop() : start(); });

  resize();
  draw(0);
  start();
}

/* ───────────────────────── Boot ───────────────────────── */
document.getElementById("year").textContent = new Date().getFullYear();
renderProjects();
setupFilters();
renderPlaying();
renderSocials();
setupConsole();
setupCopy();
setupEclipse();
