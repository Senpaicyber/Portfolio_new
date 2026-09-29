(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.desktop-nav');
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav?.classList.toggle('open', open);
  });
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('open'); menuButton?.setAttribute('aria-expanded', 'false');
  }));

  document.querySelectorAll('.details-toggle').forEach((button) => button.addEventListener('click', () => {
    const card = button.closest('.timeline-card');
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    button.querySelector('span').textContent = open ? '−' : '＋';
    card?.classList.toggle('open', open);
  }));

  const projectInfo = {
    ids: ['01 / NETWORK SECURITY', 'Signature-Based Intrusion Detection System', 'A web-based learning project exploring how signature matching and network telemetry can help surface suspicious activity for analyst review.', ['Detection areas explored: port scans, connection floods, and suspicious traffic patterns.', 'Built around Python and web-based monitoring components.', 'Project concepts include alerting, response workflows, and security intelligence context.', 'Detection output should be validated in a controlled environment; no accuracy guarantees are implied.']],
    sql: ['02 / WEB APPLICATION SECURITY', 'SQL Injection Security Lab', 'A practical lab for understanding injection risks and the coding patterns that help prevent them.', ['Explores common SQL injection concepts in a safe lab context.', 'Demonstrates parameterized query patterns and input handling.', 'Connects implementation choices to OWASP web security guidance.']],
    crypto: ['03 / CRYPTOGRAPHY RESEARCH', 'Cryptographic Algorithm Research', 'An academic exploration of cipher design and layered encryption, focused on understanding properties and tradeoffs.', ['Studies cryptographic concepts and layered approaches.', 'Reviews design considerations, key handling, and security tradeoffs.', 'Presented as academic research rather than a claim of novel, validated cryptography.']],
    lpg: ['04 / EMBEDDED SYSTEMS', 'LPG Gas Detection System', 'An IoT prototype combining a NodeMCU and gas sensor to monitor readings and support local alerting.', ['Integrates a microcontroller with gas-sensing hardware.', 'Explores real-time readings and threshold-based alerting.', 'Considers reliability and security in a connected embedded device.']],
    risk: ['05 / RISK MANAGEMENT', 'Risk Management: NVIDIA Data Breach', 'A case study examining breach impact, security controls, mitigation strategies, and risk management frameworks.', ['Maps reported incident context to business and security impact.', 'Reviews relevant control and response considerations.', 'Discusses mitigation strategies and security framework alignment.']],
  };
  const dialog = document.querySelector('.project-dialog');
  document.querySelectorAll('.project-open').forEach((button) => button.addEventListener('click', () => {
    const data = projectInfo[button.dataset.project];
    if (!data || !dialog) return;
    document.querySelector('#dialog-kicker').textContent = data[0];
    document.querySelector('#dialog-title').textContent = data[1];
    document.querySelector('#dialog-description').textContent = data[2];
    const list = document.createElement('ul');
    data[3].forEach((item) => { const li = document.createElement('li'); li.textContent = item; list.append(li); });
    const content = document.querySelector('.dialog-content'); content.replaceChildren(list);
    dialog.showModal();
  }));
  document.querySelector('.dialog-close')?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
  }, { threshold: 0.08 }) : null;
  document.querySelectorAll('.section-heading,.about-content,.timeline-item,.project-card,.skill-card,.credentials-layout,.security-note').forEach((el) => {
    el.classList.add('reveal'); if (reducedMotion || !revealObserver) el.classList.add('visible'); else revealObserver.observe(el);
  });

  if (!reducedMotion && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.profile-card,.timeline-card,.project-card,.skill-card,.credential-list,.education-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.setProperty('--tilt-y', `${(x * 3).toFixed(2)}deg`);
        card.style.setProperty('--tilt-x', `${(-y * 2.3).toFixed(2)}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--tilt-x', '0deg'); card.style.setProperty('--tilt-y', '0deg');
      });
    });
  }

  const scrollSections = [...document.querySelectorAll('main > .hero, main > .status-strip, main > .section, main > .expertise-section, main > .security-note, main > .arcade-teaser, main > .contact-section')];
  const scrollMotionAllowed = !reducedMotion && matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (scrollMotionAllowed && scrollSections.length) {
    let scrollFrame = 0;
    const updateSectionDepth = () => {
      const viewportMid = window.innerHeight * .5;
      scrollSections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionMid = rect.top + rect.height * .5;
        const distance = (sectionMid - viewportMid) / Math.max(viewportMid + rect.height * .5, 1);
        const progress = Math.max(-1, Math.min(1, distance));
        section.style.setProperty('--scroll-depth', `${(Math.abs(progress) * 20).toFixed(1)}px`);
        section.style.setProperty('--scroll-rotate', `${(progress * -1.15).toFixed(2)}deg`);
        section.classList.add('scroll-depth-ready');
      });
      scrollFrame = 0;
    };
    const scheduleSectionDepth = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateSectionDepth);
    };
    window.addEventListener('scroll', scheduleSectionDepth, { passive: true });
    window.addEventListener('resize', scheduleSectionDepth, { passive: true });
    updateSectionDepth();
  }

  const canvas = document.querySelector('#network');
  const context = canvas?.getContext('2d', { alpha: true });
  if (!canvas || !context) return;
  const visual = canvas.parentElement;
  let width = 0, height = 0, frame = 0, pointerX = 0, pointerY = 0;
  const mobile = matchMedia('(max-width: 720px)').matches;
  const count = mobile ? 23 : 42;
  const points = Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2;
    const radius = .12 + Math.random() * .36;
    return { x: .5 + Math.cos(angle) * radius, y: .49 + Math.sin(angle) * radius * .76, a: Math.random() * 6.28, r: 1 + Math.random() * 1.4 };
  });
  function resize() { const rect = visual.getBoundingClientRect(); const dpr = Math.min(window.devicePixelRatio || 1, 1.5); width = rect.width; height = rect.height; canvas.width = width * dpr; canvas.height = height * dpr; context.setTransform(dpr, 0, 0, dpr, 0, 0); }
  function draw(time = 0) {
    context.clearRect(0, 0, width, height);
    const t = reducedMotion ? 0 : time * .00018;
    const coords = points.map((p) => ({ x: (p.x + Math.sin(t + p.a) * .012 + pointerX * .012) * width, y: (p.y + Math.cos(t * 1.3 + p.a) * .012 + pointerY * .012) * height, r: p.r }));
    for (let i = 0; i < coords.length; i++) for (let j = i + 1; j < coords.length; j++) {
      const dx = coords[i].x - coords[j].x, dy = coords[i].y - coords[j].y, d = Math.hypot(dx, dy);
      if (d < (mobile ? 83 : 105)) { context.strokeStyle = `rgba(115,190,202,${(1 - d / 105) * .15})`; context.lineWidth = .65; context.beginPath(); context.moveTo(coords[i].x, coords[i].y); context.lineTo(coords[j].x, coords[j].y); context.stroke(); }
    }
    coords.forEach((p, index) => { context.fillStyle = index % 7 === 0 ? 'rgba(174,161,255,.75)' : 'rgba(135,218,214,.72)'; context.beginPath(); context.arc(p.x, p.y, p.r, 0, Math.PI * 2); context.fill(); });
    if (!reducedMotion) frame = requestAnimationFrame(draw);
  }
  visual.addEventListener('pointermove', (event) => { const rect = visual.getBoundingClientRect(); pointerX = ((event.clientX - rect.left) / width - .5) * 2; pointerY = ((event.clientY - rect.top) / height - .5) * 2; });
  visual.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; });
  window.addEventListener('resize', () => { cancelAnimationFrame(frame); resize(); if (!reducedMotion) draw(); else draw(); }, { passive: true });
  resize(); draw();
})();

