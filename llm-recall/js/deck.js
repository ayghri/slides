import { figures } from './figures.js';
import { SvgTransition } from './transitions.js';

const params = new URLSearchParams(location.search);
const isPrint = params.has('print-pdf');
const isStatic = isPrint || params.has('static');
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
let reducedMotion = motionPreference.matches || isStatic;
let motionOverride = false;
const models = new Map();
const parser = RevealMarkdown().marked;
const parse = (source) => parser(source, { mangle: false, headerIds: false });
const escapeHTML = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

function renderMarkdown(source) {
  const equations = [];
  const safe = source.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
    const index = equations.push(math.trim()) - 1;
    return `\n\n<div data-equation="${index}"></div>\n\n`;
  });
  const wrapper = document.createElement('div');
  wrapper.innerHTML = parse(safe);
  wrapper.querySelectorAll('[data-equation]').forEach(el => {
    el.className = 'equation-display';
    katex.render(equations[Number(el.dataset.equation)], el, { displayMode: true, throwOnError: true, output: 'htmlAndMathml' });
  });
  return wrapper;
}

function setMotion() {
  document.body.classList.toggle('reduced-motion', reducedMotion);
  document.body.classList.toggle('motion-enabled', !reducedMotion);
  document.querySelector('#motion').textContent = reducedMotion ? 'Enable motion' : 'Reduce motion';
}

function currentStep(section) {
  const model = models.get(section.id);
  if (isStatic) return model.figure.steps;
  return Math.min(model.figure.steps, section.querySelectorAll('.step-marker.visible').length);
}

function paint(section, animate = true) {
  const model = models.get(section.id);
  if (!model) return;
  const step = currentStep(section);
  if (animate && model.lastStep === step) return;
  model.lastStep = step;
  section.dataset.step = String(step);
  const holder = section.querySelector('.diagram');
  model.motion ??= new SvgTransition(holder);
  const moving = animate && !reducedMotion;
  model.motion.update(model.figure.render(step, { hopfield: model.hopfield, motion: moving, id: section.id }), { animate: moving });
  model.motion.label(section.querySelector('.caption-text'), model.figure.captions[step], { animate: moving });
  section.querySelectorAll('.build-dot').forEach((dot, i) => dot.classList.toggle('done', i <= step));
}

function replay() {
  const index = Reveal.getIndices();
  Reveal.slide(index.h, index.v, -1);
  paint(Reveal.getCurrentSlide());
}

function finish() {
  const slide = Reveal.getCurrentSlide();
  const index = Reveal.getIndices();
  Reveal.slide(index.h, index.v, models.get(slide.id).figure.steps - 1);
  paint(slide);
}

function toggleMotion() {
  reducedMotion = !reducedMotion;
  motionOverride = true;
  setMotion();
  Reveal.configure({ transition: reducedMotion ? 'none' : 'fade' });
  paint(Reveal.getCurrentSlide(), false);
}

function updatePosition() {
  const index = Reveal.getIndices().h;
  document.querySelector('#position').textContent = `${String(index + 1).padStart(2, '0')} / ${figures.length}`;
  document.title = `${index + 1}. ${models.get(Reveal.getCurrentSlide().id).title} — How LLMs recall`;
}

async function start() {
  const embedded = document.querySelector('#embedded-content');
  let markdown, hopfield;
  if (embedded) {
    ({ markdown, hopfield } = JSON.parse(embedded.textContent));
  } else {
    const responses = await Promise.all([fetch('slides.md'), fetch('assets/hopfield.json')]);
    if (responses.some(r => !r.ok)) throw new Error('Could not load the slide text or figure data.');
    markdown = await responses[0].text();
    hopfield = await responses[1].json();
  }
  const parts = markdown.trim().split(/\r?\n---\r?\n/);
  if (parts.length !== figures.length) throw new Error('The manuscript and figure counts do not match.');

  parts.forEach((part, index) => {
    const number = index + 1;
    const id = `s${String(number).padStart(2, '0')}`;
    const [audience, notes] = part.split(/\r?\nNote:\r?\n/);
    if (!notes) throw new Error(`Missing speaker notes for slide ${number}.`);
    const clean = audience.replace(/<!--.*?-->/gs, '').replace(/^> \*\*\[FIG-\d+ \/ ANIM-\d+\]\*\*.*$/gm, '');
    const content = renderMarkdown(clean);
    const heading = content.querySelector('h1,h2');
    const title = heading.textContent;
    heading.remove();
    if (!content.textContent.trim()) content.innerHTML = '';
    const timing = notes.match(/\*\*Timing:\*\* (\d\d:\d\d)–(\d\d:\d\d) · (\d+) seconds/);
    if (!timing) throw new Error(`Missing timing for slide ${number}.`);
    const figure = figures[index];
    const section = document.createElement('section');
    section.id = id;
    section.dataset.backgroundColor = '#11161d';
    section.className = figure.cover ? 'slide-shell title-slide' : 'slide-shell';
    section.dataset.timing = timing[3];
    section.dataset.figure = `FIG-${String(number).padStart(2, '0')}`;
    const noteHTML = parse(notes);
    const sourceLine = notes.split('\n').find(l => /^\*\*(?:Source|Sources|Basis):\*\*/.test(l));
    const firstSource = sourceLine?.match(/\[([^\]]+)\]\(([^)]+)\)/);
    let source = '';
    if (firstSource) {
      const label = firstSource[1].split(',')[0].replaceAll('*', '');
      source = `<a href="${escapeHTML(firstSource[2])}" target="_blank" rel="noopener">${escapeHTML(label)}</a>`;
    }
    section.innerHTML = `<div class="slide-masthead"><span class="wordmark">HOW LLMS RECALL</span><span class="chapter-tag">${figure.chapter}</span></div>
      <header class="slide-heading">${heading.outerHTML}</header>
      <div class="content-layout"><div class="slide-copy">${content.innerHTML}</div><figure class="slide-visual" aria-label="${escapeHTML(figure.label)}">
      <div class="diagram"></div><figcaption class="figure-caption"><span class="build-dots" aria-hidden="true">${Array.from({ length: figure.steps + 1 }, () => '<span class="build-dot"></span>').join('')}</span><span class="caption-text" aria-live="polite"></span></figcaption></figure></div>
      <footer class="slide-bottom">${source}</footer>
      ${Array.from({ length: figure.steps }, (_, i) => `<span class="fragment step-marker" data-fragment-index="${i}" aria-hidden="true"></span>`).join('')}
      <aside class="notes">${noteHTML}</aside>`;
    models.set(id, { number, figure, hopfield, title });
    document.querySelector('.slides').append(section);
    paint(section, false);
  });

  setMotion();
  await Reveal.initialize({
    width: 1600, height: 900, margin: 0.035, minScale: 0.12, maxScale: 2,
    hash: true, history: true, controls: false, progress: true, center: false,
    transition: reducedMotion ? 'none' : 'fade', transitionSpeed: 'default',
    backgroundTransition: 'none', view: 'slide', scrollActivationWidth: null,
    autoSlide: 0, showNotes: false, pdfSeparateFragments: false, pdfMaxPagesPerSlide: 1,
    plugins: [RevealNotes],
    keyboard: { 82: replay, 65: finish, 77: toggleMotion }
  });
  Reveal.on('fragmentshown', event => paint(event.fragment.closest('section')));
  Reveal.on('fragmenthidden', event => paint(event.fragment.closest('section')));
  Reveal.on('slidechanged', event => { if (event.previousSlide) paint(event.previousSlide, false); paint(Reveal.getCurrentSlide(), false); updatePosition(); });
  Reveal.on('overviewshown', () => { document.querySelector('.deck-controls').hidden = true; for (const model of models.values()) model.motion?.finish(); });
  Reveal.on('overviewhidden', () => document.querySelector('.deck-controls').hidden = false);
  paint(Reveal.getCurrentSlide(), false);
  updatePosition();
  document.querySelector('#loading').hidden = true;

  document.querySelector('#next').addEventListener('click', () => Reveal.next());
  document.querySelector('#previous').addEventListener('click', () => Reveal.prev());
  document.querySelector('#replay').addEventListener('click', replay);
  const dialog = document.querySelector('#shortcuts');
  document.querySelector('#help').addEventListener('click', () => dialog.showModal());
  dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  document.querySelector('#motion').addEventListener('click', toggleMotion);
  document.addEventListener('keydown', e => {
    if (e.key === '?' && !dialog.open) { e.preventDefault(); dialog.showModal(); }
    if (dialog.open && !['Escape', 'Tab'].includes(e.key)) e.stopPropagation();
  }, true);
  motionPreference.addEventListener('change', e => {
    if (!motionOverride && !isStatic) { reducedMotion = e.matches; setMotion(); Reveal.configure({ transition: reducedMotion ? 'none' : 'fade' }); paint(Reveal.getCurrentSlide(), false); }
  });
}

start().catch(error => {
  console.error(error);
  const loading = document.querySelector('#loading');
  loading.hidden = false;
  loading.classList.add('error');
  loading.textContent = `The presentation could not start. ${error.message} Serve this folder with python3 -m http.server 8000, then open http://localhost:8000.`;
});
