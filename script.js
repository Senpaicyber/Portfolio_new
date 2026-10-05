(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".desktop-nav");
  menuButton?.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    nav?.classList.toggle("open", open);
  });
  nav?.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton?.setAttribute("aria-expanded", "false");
    }),
  );

  document.querySelectorAll(".details-toggle").forEach((button) =>
    button.addEventListener("click", () => {
      const card = button.closest(".timeline-card");
      const open = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(open));
      button.querySelector("span").textContent = open ? "−" : "＋";
      card?.classList.toggle("open", open);
    }),
  );

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealObserver =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.08 },
        )
      : null;
  document
    .querySelectorAll(
      ".section-heading,.about-content,.timeline-item,.project-card,.skill-card,.credentials-layout,.security-note",
    )
    .forEach((el) => {
      el.classList.add("reveal");
      if (reducedMotion || !revealObserver) el.classList.add("visible");
      else revealObserver.observe(el);
    });

  const canvas = document.querySelector("#network");
  const context = canvas?.getContext("2d", { alpha: true });
  if (!canvas || !context) return;
  const visual = canvas.parentElement;
  let width = 0,
    height = 0,
    frame = 0,
    pointerX = 0,
    pointerY = 0;
  const mobile = matchMedia("(max-width: 720px)").matches;
  const count = mobile ? 23 : 42;
  const points = Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2;
    const radius = 0.12 + Math.random() * 0.36;
    return {
      x: 0.5 + Math.cos(angle) * radius,
      y: 0.49 + Math.sin(angle) * radius * 0.76,
      a: Math.random() * 6.28,
      r: 1 + Math.random() * 1.4,
    };
  });
  function resize() {
    const rect = visual.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function draw(time = 0) {
    context.clearRect(0, 0, width, height);
    const t = reducedMotion ? 0 : time * 0.00018;
    const coords = points.map((p) => ({
      x: (p.x + Math.sin(t + p.a) * 0.012 + pointerX * 0.012) * width,
      y: (p.y + Math.cos(t * 1.3 + p.a) * 0.012 + pointerY * 0.012) * height,
      r: p.r,
    }));
    for (let i = 0; i < coords.length; i++)
      for (let j = i + 1; j < coords.length; j++) {
        const dx = coords[i].x - coords[j].x,
          dy = coords[i].y - coords[j].y,
          d = Math.hypot(dx, dy);
        if (d < (mobile ? 83 : 105)) {
          context.strokeStyle = `rgba(115,190,202,${(1 - d / 105) * 0.15})`;
          context.lineWidth = 0.65;
          context.beginPath();
          context.moveTo(coords[i].x, coords[i].y);
          context.lineTo(coords[j].x, coords[j].y);
          context.stroke();
        }
      }
    coords.forEach((p, index) => {
      context.fillStyle = index % 7 === 0 ? "rgba(174,161,255,.75)" : "rgba(135,218,214,.72)";
      context.beginPath();
      context.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      context.fill();
    });
    if (!reducedMotion) frame = requestAnimationFrame(draw);
  }
  visual.addEventListener("pointermove", (event) => {
    const rect = visual.getBoundingClientRect();
    pointerX = ((event.clientX - rect.left) / width - 0.5) * 2;
    pointerY = ((event.clientY - rect.top) / height - 0.5) * 2;
  });
  visual.addEventListener("pointerleave", () => {
    pointerX = 0;
    pointerY = 0;
  });
  window.addEventListener(
    "resize",
    () => {
      cancelAnimationFrame(frame);
      resize();
      if (!reducedMotion) draw();
      else draw();
    },
    { passive: true },
  );
  resize();
  draw();
})();

