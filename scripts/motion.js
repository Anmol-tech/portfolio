/* Progressive enhancement: all content stays readable without this file. */
(() => {
  'use strict';
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const precision = matchMedia('(hover: hover) and (pointer: fine)');
  const surfaces = [...document.querySelectorAll('.experience-item, .project-card, .education-card, .skill-category')];
  // Abstract flow diagrams, not product screenshots or performance claims.
  const diagrams = [
    {path:'M24 82H104L164 32H264L324 82H376M104 82L164 132H264L324 82', points:[[24,82],[104,82],[164,32],[264,32],[324,82],[376,82],[164,132],[264,132]]},
    {path:'M24 82H68L100 38L140 126L184 48L226 116L264 58L302 82H376', points:[[24,82],[100,38],[140,126],[184,48],[226,116],[264,58],[376,82]]},
    {path:'M40 38H142L200 82L258 38H360M40 126H142L200 82L258 126H360', points:[[40,38],[142,38],[200,82],[258,38],[360,38],[40,126],[142,126],[258,126],[360,126]]}
  ];
  document.querySelectorAll('.project-visual').forEach((preview, index) => {
    const diagram = diagrams[index % diagrams.length];
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'signal-art');
    svg.setAttribute('viewBox', '0 0 400 164');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.innerHTML = `<path class="signal-track" d="${diagram.path}"/><path class="signal-packet" d="${diagram.path}"/>` + diagram.points.map(([x,y],i) => `<circle class="signal-node" cx="${x}" cy="${y}" r="${i === 2 ? 6 : 3}" style="--node-delay:${i * -0.4}s"/>`).join('');
    preview.prepend(svg);
    preview.style.setProperty('--signal-phase', `${index * -0.65}s`);
  });

  const portrait = document.querySelector('.profile-image-container');
  if (portrait) {
    const orbit = document.createElement('span');
    orbit.className = 'hero-orbit';
    orbit.setAttribute('aria-hidden', 'true');
    portrait.append(orbit);
  }

  const activeReveals = new Set();
  const touched = new Set();
  const frames = new Map();
  const enabled = () => root.dataset.motion === 'on';
  const clearTilt = surface => {
    const frame = frames.get(surface);
    if (frame) cancelAnimationFrame(frame);
    frames.delete(surface);
    surface.style.removeProperty('--tilt-x');
    surface.style.removeProperty('--tilt-y');
    surface.classList.remove('is-tilting');
    touched.delete(surface);
  };
  function syncMotion() {
    root.dataset.motion = reduced.matches ? 'reduced' : 'on';
    const on = enabled();
    if (!on) {
      activeReveals.forEach(animation => animation.cancel());
      activeReveals.clear();
      [...touched].forEach(clearTilt);
    }
  }
  reduced.addEventListener('change', syncMotion);
  precision.addEventListener('change', () => [...touched].forEach(clearTilt));
  syncMotion();
  const syncVisibility = () => { root.dataset.pageState = document.hidden ? 'hidden' : 'visible'; };
  document.addEventListener('visibilitychange', syncVisibility);
  syncVisibility();

  if ('IntersectionObserver' in window) {
    const seen = new WeakSet();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const target = entry.target;
        target.classList.toggle('is-in-view', entry.isIntersecting);
        if (!entry.isIntersecting || seen.has(target)) return;
        seen.add(target);
        if (!enabled() || !target.animate || target.classList.contains('hero')) return;
        // Use additive translate rather than transform, so existing hover effects survive.
        const animation = target.animate([
          {opacity:0, translate:'0 18px'},
          {opacity:1, translate:'0 0'}
        ], {duration:precision.matches ? 560 : 320, easing:'cubic-bezier(0.2,0.65,0.3,1)', delay:Math.min(entries.indexOf(entry) * 45, 135)});
        activeReveals.add(animation);
        animation.finished.then(() => activeReveals.delete(animation), () => activeReveals.delete(animation));
      });
    }, {threshold:0.06});
    document.querySelectorAll('.hero, .section-title, .section-intro, .experience-item, .project-card, .education-card, .skill-category, .project-archive, .contact-form, footer').forEach(el => observer.observe(el));
  }

  surfaces.forEach(surface => {
    if (!surface.classList.contains('project-card')) return;
    surface.addEventListener('pointermove', event => {
      if (!enabled() || !['mouse','pen'].includes(event.pointerType)) return;
      root.dataset.pointer = 'fine';
      const {clientX,clientY} = event;
      if (frames.has(surface)) return;
      touched.add(surface);
      frames.set(surface, requestAnimationFrame(() => {
        frames.delete(surface);
        const bounds = surface.getBoundingClientRect();
        const x = Math.max(-1, Math.min(1, (clientX - bounds.left) / bounds.width * 2 - 1));
        const y = Math.max(-1, Math.min(1, (clientY - bounds.top) / bounds.height * 2 - 1));
        surface.style.setProperty('--tilt-x', `${(-y * 2.6).toFixed(2)}deg`);
        surface.style.setProperty('--tilt-y', `${(x * 2.6).toFixed(2)}deg`);
        surface.classList.add('is-tilting');
      }));
    }, {passive:true});
    surface.addEventListener('pointerleave', () => clearTilt(surface));
    surface.addEventListener('pointercancel', () => clearTilt(surface));
    surface.addEventListener('focusout', () => clearTilt(surface));
  });
})();
