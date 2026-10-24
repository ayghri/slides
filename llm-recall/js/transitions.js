// Keep SVG elements alive across builds and interpolate from their displayed state.
// No animation framework or network dependency is required.
const motionNumber = /[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/gi;
const motionNumericAttributes = new Set(['x', 'y', 'cx', 'cy', 'r', 'rx', 'ry', 'width', 'height', 'opacity', 'fill-opacity', 'stroke-opacity', 'stroke-width', 'font-size']);
const motionDefaults = { opacity: '1', 'fill-opacity': '1', 'stroke-opacity': '1', 'stroke-width': '1', fill: '#000000', stroke: 'none' };
const motionDrawAttributes = ['pathLength', 'stroke-dasharray', 'stroke-dashoffset'];
const motionEase = t => t < .5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
const motionRound = n => String(Math.round(n * 10000) / 10000);

function motionColor(value) {
  if (value === 'none' || value === 'transparent') return [0, 0, 0, 0];
  if (/^#[\da-f]{3}$/i.test(value)) return [...value.slice(1)].map(c => parseInt(c + c, 16)).concat(1);
  if (/^#[\da-f]{6}$/i.test(value)) return value.slice(1).match(/../g).map(c => parseInt(c, 16)).concat(1);
  if (/^rgba?\(/.test(value)) {
    const channels = value.match(motionNumber).map(Number);
    return channels.length === 3 ? channels.concat(1) : channels;
  }
  return null;
}

export function interpolateAttribute(name, from, to) {
  const a = from ?? motionDefaults[name] ?? '0';
  const b = to ?? motionDefaults[name] ?? '0';
  if (name === 'fill' || name === 'stroke') {
    const start = motionColor(a), end = motionColor(b);
    if (!start || !end) return null;
    if (start[3] === 0) start.splice(0, 3, ...end.slice(0, 3));
    if (end[3] === 0) end.splice(0, 3, ...start.slice(0, 3));
    return t => `rgba(${start.slice(0, 3).map((v, i) => Math.round(v + (end[i] - v) * t)).join(',')},${motionRound(start[3] + (end[3] - start[3]) * t)})`;
  }
  if (motionNumericAttributes.has(name) && Number.isFinite(Number(a)) && Number.isFinite(Number(b))) {
    return t => motionRound(Number(a) + (Number(b) - Number(a)) * t);
  }
  if (['d', 'transform', 'viewBox'].includes(name) && a.replace(motionNumber, '#') === b.replace(motionNumber, '#')) {
    const start = a.match(motionNumber)?.map(Number), end = b.match(motionNumber)?.map(Number);
    if (!start || start.length !== end?.length) return null;
    return t => { let i = 0; return b.replace(motionNumber, () => { const index = i++; return motionRound(start[index] + (end[index] - start[index]) * t); }); };
  }
  return null;
}

export function cubicMotionPoint(d, t) {
  // The authored signal paths each contain one M followed by one cubic C.
  const p = d.match(motionNumber)?.map(Number);
  if (p?.length !== 8 || d.replace(motionNumber, '').replace(/[\s,]/g, '') !== 'MC') return null;
  const u = 1 - t;
  return [0, 1].map(i => u ** 3 * p[i] + 3 * u * u * t * p[i + 2] + 3 * u * t * t * p[i + 4] + t ** 3 * p[i + 6]);
}

function svgNodeKey(node) {
  const attr = name => node.getAttribute(name) ?? '';
  if (node.hasAttribute('data-key')) return `${node.tagName}:${attr('data-key')}`;
  if (node.id) return `${node.tagName}:#${node.id}`;
  const geometry = {
    text: ['x', 'y', 'text-anchor'], rect: ['x', 'y', 'width', 'height'],
    circle: ['cx', 'cy', 'r'], path: ['d'], line: ['x1', 'y1', 'x2', 'y2']
  }[node.localName];
  if (geometry) return `${node.tagName}:${geometry.map(attr).join('|')}`;
  if (node.localName === 'g') return `g:${attr('transform')}:${node.firstElementChild ? svgNodeKey(node.firstElementChild) : ''}`;
  return node.tagName;
}

export class SvgTransition {
  constructor(holder, { now = () => performance.now(), request = cb => requestAnimationFrame(cb), cancel = id => cancelAnimationFrame(id), duration = 900 } = {}) {
    this.holder = holder;
    this.now = now;
    this.request = request;
    this.cancel = cancel;
    this.duration = duration;
    this.jobs = new Set();
    this.byNode = new WeakMap();
    this.frame = null;
  }

  jobFor(node, key) { return this.byNode.get(node)?.get(key); }

  removeJob(job) {
    if (!job) return;
    this.jobs.delete(job);
    this.byNode.get(job.node)?.delete(job.key);
  }

  schedule(node, key, target, update, complete, duration = this.duration, delay = 0) {
    this.removeJob(this.jobFor(node, key));
    // Start on the first animation frame: DOM work must not consume the tween.
    const job = { node, key, target, update, complete, duration, delay, start: null };
    if (!this.byNode.has(node)) this.byNode.set(node, new Map());
    this.byNode.get(node).set(key, job);
    this.jobs.add(job);
    update(0);
    this.wake();
  }

  wake() {
    if (this.frame !== null || !this.jobs.size) return;
    this.frame = this.request(time => { this.frame = null; this.advance(time); this.wake(); });
  }

  advance(time) {
    for (const job of [...this.jobs]) {
      if (!job.node.isConnected) { this.removeJob(job); continue; }
      if (job.start === null) job.start = time + job.delay;
      if (time < job.start) continue;
      const t = Math.min(1, (time - job.start) / job.duration);
      job.update(motionEase(t));
      if (t === 1) { this.removeJob(job); job.complete?.(); }
    }
  }

  finish() {
    if (this.frame !== null) this.cancel(this.frame);
    this.frame = null;
    for (const job of [...this.jobs]) { job.update(1); this.removeJob(job); job.complete?.(); }
  }

  attribute(node, name, value, animate, { duration, delay = 0, complete } = {}) {
    const pending = this.jobFor(node, name);
    if (animate && pending?.target === value) return;
    const previous = node.getAttribute(name);
    const commit = () => { value === null ? node.removeAttribute(name) : node.setAttribute(name, value); complete?.(); };
    if (previous === value && !pending) { complete?.(); return; }
    this.removeJob(pending);
    const interpolate = animate && interpolateAttribute(name, previous, value);
    if (!interpolate) { commit(); return; }
    this.schedule(node, name, value, t => node.setAttribute(name, interpolate(t)), commit, duration ?? Number(node.dataset.duration || this.duration), delay || Number(node.dataset.delay || 0));
  }

  label(node, value, { animate = true, html = false, opacity = null } = {}) {
    const pending = this.jobFor(node, 'content');
    if (animate && pending?.target === value) return;
    const read = () => html ? node.innerHTML : node.textContent;
    const write = () => { if (html) node.innerHTML = value; else node.textContent = value; };
    const svgText = node.namespaceURI === 'http://www.w3.org/2000/svg';
    const setOpacity = v => { if (svgText) node.setAttribute('opacity', v); else node.style.opacity = v; };
    const resetOpacity = () => { if (svgText) opacity === null ? node.removeAttribute('opacity') : node.setAttribute('opacity', opacity); else node.style.removeProperty('opacity'); };
    if (read() === value && !pending) return;
    this.removeJob(pending);
    if (!animate) { write(); resetOpacity(); return; }
    if (node.hasAttribute('data-number') && Number.isFinite(Number(read())) && Number.isFinite(Number(value))) {
      const start = Number(read()), end = Number(value), precision = Number(node.dataset.precision || 0);
      this.schedule(node, 'content', value, t => {
        const n = Number((start + (end - start) * t).toFixed(precision));
        node.textContent = `${node.dataset.number === 'signed' && n >= 0 ? '+' : ''}${n.toFixed(precision)}`;
      }, write, Number(node.dataset.duration || this.duration));
      return;
    }
    this.removeJob(this.jobFor(node, 'opacity'));
    const start = Number((svgText ? node.getAttribute('opacity') : node.style.opacity) || 1);
    const end = Number(opacity ?? 1);
    let committed = false;
    this.schedule(node, 'content', value, t => {
      if (t < .4) setOpacity(motionRound(start * (1 - t / .4)));
      else { if (!committed) { write(); committed = true; } setOpacity(motionRound(end * (t - .4) / .6)); }
    }, () => { write(); resetOpacity(); }, 640);
  }

  syncAttributes(live, target, animate) {
    // Metadata changes first so geometry can use the new duration and delay.
    for (const attr of [...target.attributes]) {
      if (/^(data-|aria-|id$|role$)/.test(attr.name) && live.getAttribute(attr.name) !== attr.value) live.setAttribute(attr.name, attr.value);
    }
    const names = new Set([...live.attributes, ...target.attributes].map(a => a.name));
    for (const name of names) {
      if (name === 'data-exiting') continue;
      if (this.jobFor(live, 'draw') && motionDrawAttributes.includes(name)) continue;
      if (this.jobFor(live, 'content') && name === 'opacity') continue;
      if (this.jobFor(live, 'travel') && ['cx', 'cy'].includes(name)) continue;
      this.attribute(live, name, target.getAttribute(name), animate);
    }
  }

  enter(node, order) {
    const opacity = node.getAttribute('opacity');
    node.setAttribute('opacity', '0');
    this.attribute(node, 'opacity', opacity, true, { duration: 760, delay: Math.min(210, order * 45) });
    const paths = node.matches('path[data-draw]') ? [node] : [...node.querySelectorAll('path[data-draw]')];
    for (const p of paths) {
      if (p.hasAttribute('stroke-dasharray')) continue;
      p.setAttribute('pathLength', '1');
      p.setAttribute('stroke-dasharray', '1');
      p.setAttribute('stroke-dashoffset', '1');
      this.schedule(p, 'draw', 0, t => p.setAttribute('stroke-dashoffset', motionRound(1 - t)), () => motionDrawAttributes.forEach(a => p.removeAttribute(a)), 1000, Math.min(210, order * 45));
    }
    const travelers = node.matches('[data-motion-path]') ? [node] : [...node.querySelectorAll('[data-motion-path]')];
    for (const traveler of travelers) {
      const d = traveler.dataset.motionPath;
      if (!cubicMotionPoint(d, 0)) continue;
      const x = traveler.getAttribute('cx'), y = traveler.getAttribute('cy');
      this.schedule(traveler, 'travel', d, t => {
        const [cx, cy] = cubicMotionPoint(d, t);
        traveler.setAttribute('cx', motionRound(cx)); traveler.setAttribute('cy', motionRound(cy));
      }, () => { traveler.setAttribute('cx', x); traveler.setAttribute('cy', y); }, Number(traveler.dataset.duration || 1200));
    }
  }

  patch(live, target, animate) {
    live.removeAttribute('data-exiting');
    const structural = ['defs', 'marker', 'title'].includes(live.localName);
    this.syncAttributes(live, target, animate && !structural);
    if (live.localName === 'text') {
      this.label(live, target.textContent, { animate, opacity: target.getAttribute('opacity') });
      return;
    }
    if (!target.children.length) { if (live.textContent !== target.textContent) live.textContent = target.textContent; return; }
    const available = new Map();
    for (const child of [...live.children]) {
      const key = svgNodeKey(child);
      if (!available.has(key)) available.set(key, []);
      available.get(key).push(child);
    }
    let previous = null, additions = 0;
    for (const desired of [...target.children]) {
      const key = svgNodeKey(desired);
      const match = available.get(key)?.shift();
      const child = match || desired.cloneNode(true);
      const before = previous ? previous.nextSibling : live.firstChild;
      if (before !== child) live.insertBefore(child, before);
      if (match) this.patch(child, desired, animate && !structural);
      else if (animate && !structural) this.enter(child, additions++);
      previous = child;
    }
    for (const remaining of available.values()) for (const node of remaining) {
      if (!animate || structural) { node.remove(); continue; }
      if (node.hasAttribute('data-exiting')) continue;
      node.setAttribute('data-exiting', 'true');
      this.attribute(node, 'opacity', '0', true, { duration: 580, complete: () => node.remove() });
    }
  }

  update(markup, { animate = true } = {}) {
    if (!animate) this.finish();
    else this.advance(this.now());
    const template = this.holder.ownerDocument.createElement('template');
    template.innerHTML = markup;
    const next = template.content.querySelector('svg');
    if (!next) throw new Error('A diagram must contain an SVG root.');
    next.setAttribute('role', 'img');
    const current = this.holder.querySelector('svg');
    if (!current) this.holder.replaceChildren(next);
    else this.patch(current, next, animate);
  }
}
