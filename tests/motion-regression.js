// Evaluate in the browser. Return failures rather than stopping at the first.
(async () => {
  const failures = [];
  const check = (ok, message) => { if (!ok) failures.push(message); };
  const root = document.documentElement;
  check(!document.querySelector('#motion-toggle'), 'Motion control must not be displayed');
  check(['on','reduced'].includes(root.dataset.motion), 'Motion must follow the system preference');
  check(document.querySelectorAll('.project-visual .signal-art').length === document.querySelectorAll('.project-visual').length, 'Every abstract project preview needs signal artwork');
  check([...document.querySelectorAll('.signal-art')].every(s => s.getAttribute('aria-hidden') === 'true'), 'Signal artwork must be decorative');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  check(root.dataset.motion === (reduced ? 'reduced' : 'on'), 'System reduced motion must take priority');
  if (reduced) {
    check(document.getAnimations().filter(a => a.playState === 'running').length === 0, 'Reduced motion must stop running animations');
  }
  const card = document.querySelector('#projects-grid .project-card');
  check(!!card?.querySelector('a'), 'Project links must remain intact');
  if (card && !reduced) {
    card.scrollIntoView({behavior:'instant',block:'center'});
    await new Promise(resolve => setTimeout(resolve, 650));
    const r = card.getBoundingClientRect();
    card.dispatchEvent(new PointerEvent('pointermove', {pointerType:'mouse',clientX:r.x+r.width*.8,clientY:r.y+r.height*.3}));
    await new Promise(resolve => setTimeout(resolve, 80));
    check(card.classList.contains('is-tilting'), 'Mouse movement must activate card tilt');
    check(!!card.style.getPropertyValue('--tilt-y'), 'Pointer position must update tilt angle');
    card.dispatchEvent(new PointerEvent('pointerleave'));
    check(!card.classList.contains('is-tilting'), 'Pointer exit must reset tilt');
    card.dispatchEvent(new PointerEvent('pointermove', {pointerType:'touch',clientX:r.x,clientY:r.y}));
    await new Promise(resolve => setTimeout(resolve, 40));
    check(!card.classList.contains('is-tilting'), 'Touch movement must not activate tilt');
  }
  return {status:failures.length?'FAIL':'PASS', reduced, state:root.dataset.motion, failures};
})()
