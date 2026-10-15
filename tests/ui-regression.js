// Evaluate in a loaded browser page at each supported viewport.
(() => {
  const failures = [];
  const check = (ok, message) => { if (!ok) failures.push(message); };
  const visible = el => getComputedStyle(el).display !== 'none';
  const cards = [...document.querySelectorAll('#projects-grid .project-card')];
  check(cards.length === 11, 'All eleven project cards must remain present');
  cards.forEach(card => {
    const title = card.querySelector('h3').textContent.trim();
    check(!!card.querySelector('.project-media'), `${title}: missing preview`);
    if (!visible(card)) return;
    const r = card.getBoundingClientRect();
    check(r.left >= -1 && r.right <= innerWidth + 1, `${title}: outside viewport`);
    check(card.scrollWidth <= card.clientWidth + 1, `${title}: clipped content`);
    const media = card.querySelector('.project-media');
    if (media) {
      const m = media.getBoundingClientRect();
      check(m.height > 100, `${title}: collapsed preview`);
      [...media.querySelectorAll('span, small')].forEach(text => {
        const t = text.getBoundingClientRect();
        check(t.left >= m.left && t.right <= m.right + 1, `${title}: overflowing preview text`);
      });
    }
  });
  const rows = new Map();
  cards.filter(visible).forEach(card => {
    const top = Math.round(card.getBoundingClientRect().top);
    if (!rows.has(top)) rows.set(top, []);
    rows.get(top).push(card);
  });
  [...rows.values()].forEach(row => {
    if (row.some(c => c.classList.contains('featured-project'))) return;
    const titles = row.map(c => c.querySelector('h3').getBoundingClientRect().top);
    check(Math.max(...titles) - Math.min(...titles) < 1, 'Project titles in a row must align');
  });
  const awards = [...document.querySelectorAll('.achievements-grid .achievement-card')];
  check(awards.length === 4, 'All four awards must remain present');
  if (innerWidth > 1024) {
    const r = awards.map(a => a.getBoundingClientRect());
    check(Math.abs(r[0].width-r[2].width) < 1, 'Left award cards must keep original width');
    check(Math.abs(r[1].width-r[3].width) < 1, 'Right award cards must keep original width');
    check(Math.abs(r[2].right-r[3].left) > 15, 'Award columns must have a gap');
  }
  [...document.querySelectorAll('.badge')].forEach(b => {
    check(b.scrollWidth <= b.clientWidth + 1, `Badge is clipped: ${b.textContent.trim()}`);
  });
  const filter = document.querySelector('.filter-chip.is-active').dataset.filter;
  cards.forEach(c => {
    const expected = filter === 'all' || c.dataset.tags.split(' ').includes(filter);
    check(visible(c) === expected, `${c.querySelector('h3').textContent}: incorrect filter visibility`);
  });
  const shown = cards.filter(visible);
  if (filter !== 'all' && shown.length > 1) {
    const first = shown[0].getBoundingClientRect();
    check(shown.every(c => Math.abs(c.getBoundingClientRect().width-first.width) < 1), 'Filtered project columns must be equal');
  }
  check([...document.images].every(i => i.complete && i.naturalWidth > 0), 'A local image failed to load');
  return { status: failures.length ? 'FAIL' : 'PASS', width: innerWidth,
    theme: document.documentElement.dataset.theme, filter, failures };
})()
