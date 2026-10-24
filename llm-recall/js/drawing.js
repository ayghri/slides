export const C = { ink: '#f4f0e8', muted: '#b6c4d5', dim: '#8b9cb2', line: '#334153', panel: '#19222d', bg: '#11161d', teal: '#68dbcb', amber: '#f2c477', violet: '#b9a2ff', red: '#f18e91' };
export const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
export function text(x, y, label, size = 28, color = C.ink, anchor = 'start', extra = '') {
  return `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="${anchor}" ${extra}>${esc(label)}</text>`;
}
export function lines(x, y, labels, size = 26, color = C.ink, gap = 36, anchor = 'start') {
  return labels.map((label, i) => text(x, y + gap * i, label, size, color, anchor)).join('');
}
export function rect(x, y, w, h, stroke = C.line, fill = C.panel, radius = 16, extra = '') {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" stroke="${stroke}" fill="${fill}" stroke-width="2" ${extra}/>`;
}
export function edge(d, color = C.dim, width = 3, extra = '') {
  return `<path data-draw="true" d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#@arrow@-${color.slice(1)})" ${extra}/>`;
}
export function path(d, color = C.line, width = 2, extra = '') {
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
}
export function circle(x, y, r, color = C.violet, fill = C.bg, extra = '') {
  return `<circle cx="${x}" cy="${y}" r="${r}" stroke="${color}" fill="${fill}" stroke-width="3" ${extra}/>`;
}
export function tag(x, y, label, color = C.muted, anchor = 'start') {
  return text(x, y, label.toUpperCase(), 19, color, anchor, 'class="mono" letter-spacing="1.7"');
}
export function group(body, visible = true, extra = '') { return `<g opacity="${visible ? 1 : 0.17}" ${extra}>${body}</g>`; }
export function enter(body) { return `<g>${body}</g>`; }
export function svg(body, label, id, height = 620) {
  const markers = [...new Set(Object.values(C))].map(color => `<marker id="arrow-${id}-${color.slice(1)}" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M2 2 9 6 2 10" fill="none" stroke="${color}" stroke-width="2"/></marker>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 ${height}" font-family="Avenir Next, Segoe UI, Arial, sans-serif" aria-labelledby="${id}-title"><title id="${id}-title">${esc(label)}</title><defs>${markers}</defs>${body.replaceAll('@arrow@', `arrow-${id}`)}</svg>`;
}
export function vector(x, y, color = C.amber, values = [.5, .8, .25, .65], horizontal = false) {
  return values.map((v, i) => rect(x + (horizontal ? i * 23 : 0), y + (horizontal ? 0 : i * 23), 17, 17, color, color, 3, `opacity="${.2 + Math.abs(v) * .8}"`)).join('');
}
export function matrix(x, y, color = C.amber, rows = 4, cols = 4, seed = 1) {
  return Array.from({ length: rows * cols }, (_, i) => {
    const opacity = .2 + ((i * 7 + seed * 3) % 11) / 15;
    return rect(x + (i % cols) * 26, y + Math.floor(i / cols) * 26, 18, 18, color, color, 3, `opacity="${opacity}"`);
  }).join('');
}
export function pineapple(x, y, scale = 1) {
  return `<g transform="translate(${x} ${y}) scale(${scale})">${path('M0 -39 C-40 -82 -34 -101 -12 -81 L0 -112 13 -82 C40 -104 43 -78 1 -39', C.teal, 4)}<path d="M0 -43 C-60 -43 -64 55 -28 80 Q0 98 28 80 C64 55 60 -43 0 -43Z" fill="#332d23" stroke="${C.amber}" stroke-width="4"/>${path('M-32 -23 37 47 M-47 0 23 74 M-47 28 5 83 M32 -23 -37 47 M47 0 -23 74 M47 28 -5 83', C.amber, 2)}</g>`;
}
export function guitar(x, y, scale = 1) {
  return `<g transform="translate(${x} ${y}) scale(${scale}) rotate(23)"><path d="M-12 -114 12 -114 10 -9 C58 -15 63 18 42 35 C79 90 17 126 -26 102 C-66 80 -62 47 -39 30 C-66 -3 -24 -26 -10 -9Z" fill="#332d23" stroke="${C.amber}" stroke-width="4"/>${circle(0, 48, 17, C.amber)}${path('M-5 -101 -5 76 M5 -101 5 76 M-20 78 20 78 M-20 -102 20 -102 M-20 -85 20 -85', C.amber, 2)}</g>`;
}
export function cup(x, y, scale = 1, color = C.teal) {
  return `<g transform="translate(${x} ${y}) scale(${scale})">${path('M-40 -22 H28 V23 Q28 50 -5 50 Q-40 50 -40 23Z M28 -12 H43 Q68 -12 62 11 Q58 29 29 27 M-51 59 H45 M-22 -43 Q-36 -57 -19 -72 M4 -43 Q-10 -57 7 -72', color, 4)}</g>`;
}
export function avatar(x, y, scale = 1, color = C.teal) {
  return `<g transform="translate(${x} ${y}) scale(${scale})">${circle(0, -22, 22, color)}${path('M-44 47 Q-45 2 0 2 Q45 2 44 47', color, 4)}</g>`;
}
export function pixelGrid(pixels, x, y, cell = 18, color = C.teal, width = 12, changed = []) {
  const changedSet = new Set(changed);
  return pixels.map((value, i) => `<rect data-key="pixel-${x}-${y}-${cell}-${i}" data-duration="500" data-delay="${changedSet.has(i) ? changed.indexOf(i) * 70 : 0}" x="${x + i % width * cell}" y="${y + Math.floor(i / width) * cell}" width="${cell - 2}" height="${cell - 2}" rx="2" fill="${value ? color : '#223040'}" ${changedSet.has(i) ? `stroke="${C.violet}" stroke-width="2"` : ''}/>`).join('');
}
export function movingDot(d, endX, endY, color, motion, duration = '1.2s') {
  return `<circle data-key="signal-${esc(d)}" data-motion-path="${esc(d)}" data-duration="${parseFloat(duration) * 1000}" cx="${endX}" cy="${endY}" r="10" fill="${color}"/>`;
}
