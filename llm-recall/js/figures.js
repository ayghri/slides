import { C, text, rect, edge, path, circle, tag, svg, vector, cup, avatar, pixelGrid, movingDot } from './drawing.js';

// Each named group persists across builds. Geometry and color interpolate in place.
const layer = (key, body, attrs = '') => `<g data-key="${key}" ${attrs}>${body}</g>`;
const reveal = (key, body, visible, attrs = '') => layer(key, body, `opacity="${visible ? 1 : 0}" ${attrs}`);
const frame = (body, ctx, label) => svg(body, label, ctx.id, 520);
const illustration = () => text(1160, 500, 'Illustration', 15, C.muted, 'end');
const filledPath = (d,color,fill) => path(d,color,2).replace('fill="none"',`fill="${fill}"`);
const drinkIcon = (x, y, value, scale = 1, color = C.teal) => value === 'orange juice' || value === 'fruit drink'
  ? layer('juice-icon', `<g transform="translate(${x} ${y}) scale(${scale})">${path('M-35 -45 H35 L24 55 H-24Z M-28 -12 H28 M10 -12 L23 -75 H48', color, 4)}${path('M-19 11 H19 M-17 25 H17', color, 3)}</g>`)
  : layer('cup-icon', cup(x, y, scale, color));

function person(key, x, y, { label = 'John', scale = 1 } = {}) {
  return layer(key, `<g transform="translate(${x} ${y}) scale(${scale})">${circle(0, 0, 84, C.violet, '#242236')}${avatar(0, -7, .9, C.violet)}${text(0, 132, label, 33, C.ink, 'middle')}</g>`);
}

function drinkNode(key, x, y, value = 'espresso', color = C.teal) {
  return layer(key, circle(x, y, 84, color, C.panel) + drinkIcon(x, y - 2, value, .86, color) + text(x, y + 132, value, 31, color, 'middle'));
}

function orderCard(key, x, y, name, value, width = 365, active = false) {
  return layer(key, rect(x, y, width, 90, active ? C.teal : C.line, C.panel, 12) +
    path(`M${x + width * .4} ${y + 17} V${y + 73}`, C.line, 1) +
    text(x + 22, y + 55, name, 28, active ? C.violet : C.ink) +
    text(x + width * .4 + 22, y + 55, value, 26, active ? C.teal : C.ink));
}

function titleSlide(step, ctx) {
  let body = text(35, 173, 'Ayoub Ghriss', 46, C.ink);
  body += `<a href="mailto:ghriss@wustl.edu">${text(35, 243, 'ghriss@wustl.edu', 29, C.teal)}</a>`;
  body += `<a href="https://ayghri.me" target="_blank" rel="noopener noreferrer">${text(35, 297, 'ayghri.me', 29, C.teal)}</a>`;
  const nodes = [[715,140],[715,265],[715,390]];
  nodes.forEach(([x,y],i) => {
    body += path(`M${x+20} ${y} C830 ${y} 830 265 930 265`, i===1 ? C.amber : C.line, i===1 ? 5 : 2);
    body += circle(x,y,13,i===1 ? C.amber : C.violet,i===1 ? C.amber : C.bg);
  });
  body += sharedState(3,950,170,24);
  return frame(body,ctx,'How LLMs recall. Ayoub Ghriss. Email ghriss@wustl.edu. Website ayghri.me.');
}

function hebbian(step, ctx) {
  const recalling = step >= 3;
  let body = tag(600, 60, ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Friday'][step], C.muted, 'middle');
  body += person('john', 245, 250);
  body += path('M350 250 C490 210 690 290 835 250', C.amber, [3, 7, 12, 12, 12][step], 'data-key="association" data-duration="1200"');
  body += reveal('espresso', drinkNode('order', 950, 250), step !== 3, step === 4 ? 'data-delay="500"' : '');
  body += reveal('question', text(950, 270, '?', 80, C.muted, 'middle'), step === 3);
  body += tag(600, 440, recalling ? 'Recall' : 'Learning', recalling ? C.teal : C.amber, 'middle');
  if (step === 4) body += movingDot('M350 250 C490 210 690 290 835 250', 835, 250, C.violet, ctx.motion, '1.2s');
  return frame(body, ctx, 'John repeatedly orders espresso. The connection strengthens, then stays fixed as John’s cue recalls the order.');
}

// A row activity vector gives the raw Hebbian increment a^T a, including its diagonal.
export const hebbianActivity = [1,1,0];
export function hebbianWeights(repeats = 1) {
  return hebbianActivity.flatMap(a => hebbianActivity.map(b => repeats*a*b));
}

function hebbianVectors(step, ctx) {
  const repeats = step >= 4 ? 3 : 1;
  let body = tag(220,42,'Neurons',C.muted,'middle');
  ['A','B','C'].forEach((label,i) => {
    const x = 95+i*125, active = hebbianActivity[i];
    body += circle(x,110,37,active ? C.amber : C.line,active ? '#3b3022' : C.bg,`data-key="neuron-${label}"`);
    body += text(x,122,label,33,active ? C.amber : C.muted,'middle');
    body += reveal('activity-link-'+label,path(`M${x} 158 V230`,active ? C.amber : C.line,2),step>=1);
    body += reveal('activity-'+label,text(x,283,String(active),40,active ? C.amber : C.muted,'middle'),step>=1);
  });
  body += path('M140 110 H175',C.amber,step>=4 ? 10 : 4,'data-key="ab-wire" data-duration="1400"');
  body += reveal('vector-brackets',path('M60 239 H48 V302 H60 M380 239 H392 V302 H380',C.muted,3) + text(220,355,'a = [1, 1, 0]',32,C.ink,'middle'),step>=1);
  body += reveal('outer-product-arrow',edge('M425 270 H650',C.amber,3) + text(535,218,step>=4 ? '3 aᵀa' : 'aᵀa',50,C.amber,'middle','font-family="Georgia, serif"') + tag(535,332,'Outer product',C.muted,'middle'),step>=2);
  let matrix = text(859,57,'Connection weights',27,C.ink,'middle');
  ['A','B','C'].forEach((label,i) => {
    matrix += text(771+i*88,115,label,28,i<2 ? C.amber : C.muted,'middle');
    matrix += text(691,175+i*88,label,28,i<2 ? C.amber : C.muted,'middle');
  });
  hebbianWeights(repeats).forEach((value,i) => {
    const r=Math.floor(i/3),c=i%3,focus=step>=3 && i===1;
    matrix += rect(731+c*88,133+r*88,80,80,focus ? C.amber : C.line,value ? (focus ? '#66502d' : '#332e26') : C.panel,9,`data-key="hebb-cell-${i}" data-duration="1400"`);
    matrix += text(771+c*88,187+r*88,String(value),37,value ? C.amber : C.muted,'middle',`data-key="hebb-value-${i}" data-number="unsigned" data-duration="1400"`);
  });
  body += reveal('hebbian-matrix',matrix,step>=2);
  body += reveal('ab-entry',text(859,463,step>=4 ? 'A–B: 1 + 1 + 1 = 3' : 'A–B: 1 × 1 = 1',29,C.amber,'middle'),step>=3);
  body += tag(220,463,step>=4 ? 'Repeated together' : 'A + B active · C quiet',C.muted,'middle');
  return frame(body,ctx,`Neurons A and B are active and C is quiet: a = [1,1,0]. The outer product a transpose a has A–B entry 1. After ${repeats} paired activations it is ${repeats}; entries involving C stay zero.`);
}

function recognition(step, ctx) {
  const whole = ctx.hopfield.patterns[0].pixels;
  const pixels = step ? whole : whole.map((v, i) => Math.floor(i / 12) < 5 || i % 5 === 0 ? 0 : v);
  return frame(pixelGrid(pixels, 432, 74, 28, C.teal), ctx, step ? 'The complete cup.' : 'A partial cup invites the audience to complete the pattern.');
}

function recovery(step, ctx) {
  const data = ctx.hopfield, current = data.frames[step];
  let body = tag(180, 80, 'Stored', C.amber, 'middle');
  data.patterns.forEach((p, i) => {
    body += layer(`stored-${i}`, pixelGrid(p.pixels, 122, 110 + i * 123, 8, C.amber));
  });
  body += path('M340 70 V460', C.line, 1);
  body += pixelGrid(current.pixels, 545, 100, 27, C.teal, 12, current.changedIndices);
  body += tag(706, 475, step === 6 ? 'Recovered' : 'Recall', C.teal, 'middle');
  return frame(body, ctx, `Verified Hopfield recall: ${current.errorCount} incorrect pixels. Connections stay fixed.`);
}

function associativeLookup(step, ctx) {
  let body = person('john', 145, 250, { label: 'John?' });
  body += tag(145, 100, 'Cue', C.violet, 'middle');
  body += tag(490, 50, 'Key', C.muted) + tag(645, 50, 'Value', C.muted);
  [['John', 'espresso'], ['Theo', 'tea'], ['Mina', 'cocoa']].forEach(([name, value], i) => {
    body += orderCard(`association-${i}`, 435, 80 + i * 135, name, value, 365, step >= 1 && i === 0);
  });
  body += reveal('matching-key', edge('M250 250 C340 250 335 125 422 125', C.violet, 5), step >= 1);
  body += reveal('recalled-value', edge('M815 125 C915 125 890 250 949 250', C.teal, 6) + drinkNode('order', 1050, 250), step >= 2);
  return frame(body, ctx, 'A content cue matches a key and brings back its associated value. This is a conceptual associative lookup.');
}

function contextMemory(step, ctx) {
  let body = tag(270, 65, 'Context', C.teal, 'middle');
  body += rect(40, 100, 470, 310, C.teal, C.panel, 14);
  ['John ordered an espresso.', 'Theo ordered tea.', 'Mina ordered cocoa.'].forEach((line, i) => {
    body += text(75, 180 + i * 85, line, 29, i ? C.ink : C.teal);
  });
  body += reveal('project-context', edge('M535 255 C590 255 640 255 705 255', C.teal, 4), step >= 1);
  body += reveal('key-label', tag(815, 65, 'Keys', C.violet, 'middle'), step >= 1);
  body += reveal('value-label', tag(1030, 65, 'Values', C.teal, 'middle'), step >= 2);
  [['John', 'espresso'], ['Theo', 'tea'], ['Mina', 'cocoa']].forEach(([name, value], i) => {
    const y = 110 + i * 120;
    body += reveal(`key-${i}`, rect(735, y, 155, 80, C.violet, '#242236', 10) + text(812, y + 50, name, 28, C.violet, 'middle'), step >= 1);
    body += reveal(`value-${i}`, rect(915, y, 235, 80, C.teal, C.panel, 10) + text(1032, y + 50, value, 28, C.teal, 'middle'), step >= 2);
  });
  body += illustration();
  return frame(body, ctx, 'Today’s prompt supplies the information from which attention derives keys and values. Cards summarize token vectors.');
}

function attentionScene(step, ctx, exchange = false) {
  const stage = exchange ? 3 : step;
  const juice = exchange && (step === 1 || step === 2);
  const answerVisible = exchange ? step !== 1 : stage >= 3;
  const value = juice ? 'orange juice' : 'espresso';
  let body = reveal('query-label', tag(145, 155, 'Query', C.violet, 'middle'), stage >= 1);
  body += layer('query', rect(45, 195, 205, 110, C.violet, '#242236') + text(147, 263, 'John?', 38, C.violet, 'middle'));
  body += reveal('key-value-labels', tag(490, 50, 'Key', C.muted) + tag(645, 50, 'Value', C.muted), stage >= 1);
  const pairs = [['John', value], ['Theo', 'tea'], ['Mina', 'cocoa']];
  pairs.forEach(([name, order], i) => {
    const y = 80 + i * 135;
    body += reveal(`compare-${i}`, edge(`M260 250 C330 250 340 ${y + 45} 422 ${y + 45}`, C.violet, i === 0 ? 6 : 2), stage >= 1);
    body += orderCard(`order-${i}`, 435, y, name, order, 365, stage >= 1 && i === 0);
    body += reveal(`gather-${i}`, edge(`M815 ${y + 45} C890 ${y + 45} 900 250 949 250`, C.teal, [11, 3, 2][i]), stage >= 2);
    if (!exchange) body += reveal(`weight-${i}`, text(850, y + 16, ['80%', '15%', '5%'][i], 20, C.teal), stage >= 2);
  });
  body += reveal('value-mix', vector(985, 240, C.teal, [.8, .4, .7, .6], true), stage === 2);
  body += reveal('answer', drinkNode('answer-drink', 1050, 250, value), answerVisible);
  if (exchange) body += tag(600, 475, 'Same parameters', C.amber, 'middle');
  body += illustration();
  return frame(body, ctx, `Illustrative attention: John’s current order is ${value}. Keys and values come from context; learned projections stay fixed.`);
}


function mathVariable(name, color = C.ink, sub = '', transpose = false) {
  return text(0, 0, name, 54, color, 'start', 'font-family="Georgia, serif" font-style="italic"') +
    (sub ? text(29, 13, sub, 22, color, 'start', 'font-family="Georgia, serif" font-style="italic"') : '') +
    (transpose ? text(30, -28, 'T', 21, color, 'start', 'font-family="Georgia, serif"') : '');
}

function formulaPiece(key, x, y, body, visible = true) {
  return layer('formula-' + key, body, `transform="translate(${x} ${y})" opacity="${visible ? 1 : 0}" data-duration="1200"`);
}

// Stage 0 -> 1 changes the matching rule. Subsequent stages are algebraic regroupings.
// q, k and v are row vectors. Scaling and normalization are omitted in this illustration.
function recallFormula(stage) {
  const s = Math.min(stage, 4);
  let body = formulaPiece('sum', [360,420,470,470,470][s], 88,
    text(0, 0, '∑', 69, C.ink) + text(20, 27, 'i', 21, C.ink, 'middle', 'font-style="italic"'), s < 4);
  body += formulaPiece('exp', 425, 88, text(0, 0, 'exp', 48, C.amber), s === 0);
  body += formulaPiece('open', [525,480,420,420,420][s], 88, text(0, 0, '(', 57, C.ink), s < 4);
  body += formulaPiece('q', [555,515,360,360,510][s], 88, mathVariable('q', C.violet));
  body += formulaPiece('dot', [606,565,565,565,565][s], 88, text(0, 0, '·', 52, C.ink), s < 2);
  body += formulaPiece('k', [640,605,555,555,555][s], 88, mathVariable('k', C.ink, 'i', s >= 2), s < 4);
  body += formulaPiece('close', [695,660,715,715,715][s], 88, text(0, 0, ')', 57, C.ink), s < 4);
  body += formulaPiece('v', [740,705,645,645,645][s], 88, mathVariable('v', C.teal, 'i'), s < 4);
  body += reveal('sum-box', rect(455, 24, 250, 104, C.teal, 'none', 10), s === 3);
  body += formulaPiece('S', s === 4 ? 600 : 560, s === 4 ? 88 : 175, mathVariable('S', C.teal), s >= 3);
  body += tag(1050, 77, ['Softmax', 'New rule', 'Regroup', 'Store the sum', 'Read'][s], C.muted, 'middle');
  body += text(35, 507, 'Scaling and normalization omitted', 16, C.muted);
  return layer('recall-formula', body);
}

function softmaxCache(step, ctx) {
  let body = recallFormula(0);
  body += reveal('exp-highlight', rect(414, 29, 310, 78, C.amber, 'none', 10), step >= 1);
  body += rect(55, 275, 210, 95, C.violet, '#242236') + text(160, 334, 'John?', 36, C.violet, 'middle');
  body += tag(160, 245, 'Query', C.violet, 'middle');
  const pairs = [['John','espresso'], ['Theo','tea'], ['Mina','cocoa']];
  pairs.forEach(([name,value],i) => {
    const y = 195 + i * 95;
    body += reveal('extra-pairs-' + i, rect(450, y - 13, 365, 90, C.line, C.panel, 12), step >= 2);
    body += orderCard('cached-pair-' + i, 435, y, name, value, 365, i === 0);
    body += reveal('query-pair-' + i, edge(`M280 322 C345 322 350 ${y+45} 422 ${y+45}`, C.violet, i === 0 ? 5 : 2), step >= 1);
  });
  body += tag(615, 170, 'KV cache', C.teal, 'middle');
  body += text(1000, 285, 'Separate pairs', 29, C.ink, 'middle');
  body += reveal('growing-cache', text(1000, 330, '+ more context', 25, C.muted, 'middle'), step >= 2);
  return frame(body, ctx, 'Softmax numerator: sum of exp(q dot key) times value. Each query scores the separate cached key–value pairs.');
}

const baseKeys = [
  [1,1,1,1,-1,-1,-1,-1],
  [1,1,-1,-1,1,1,-1,-1],
  [1,-1,1,-1,1,-1,1,-1]
];
const baseValues = [
  [1,.6,-.2,-.7,.9,-.3,.4,-.8],
  [.3,1,.7,-.4,-.8,.1,.7,.5],
  [-.7,.2,.9,.8,-.1,-.8,.6,.4]
];
export const johnKey = baseKeys[0].map(v => v / Math.sqrt(8));
export const espressoValue = baseValues[0];
export const juiceValue = [-.4,.9,.5,.2,-.6,.8,-.3,.7];

export function memoryRead(state, key) {
  return Array.from({length:8}, (_,c) => key.reduce((sum,k,r) => sum + k * state[r*8+c], 0));
}
export function memoryWrite(state, key, value, strength = 1) {
  return state.map((v,i) => v + strength * key[Math.floor(i/8)] * value[i%8]);
}
export function deltaWrite(state, key, value, strength = 1) {
  const prediction = memoryRead(state,key);
  return memoryWrite(state,key,value.map((v,i) => v-prediction[i]),strength);
}
export function toyState(count) {
  let state = Array(64).fill(0);
  for(let i=0;i<count;i++) {
    const raw = i<3 ? baseKeys[i] : baseKeys[0].map((v,j) => .65*v + Math.sin((i+2)*(j+1)));
    const norm = Math.hypot(...raw), key = raw.map(v => v/norm);
    const value = i<3 ? baseValues[i] : Array.from({length:8},(_,j) => Math.cos((i+1)*(j+2)));
    state = memoryWrite(state,key,value);
  }
  return state;
}

function sharedState(input, x=472, y=112, cell=33) {
  const values = Array.isArray(input) ? input : toyState(input);
  let body = rect(x-14,y-14,cell*8+24,cell*8+24,C.muted,C.bg,12,'data-key="state-outline"');
  values.forEach((value,i) => {
    const v = Math.abs(value)<1e-12 ? 0 : value;
    body += rect(x+(i%8)*cell,y+Math.floor(i/8)*cell,cell-5,cell-5,'none',v<0 ? C.red : C.teal,3,
      `data-key="state-cell-${i}" opacity="${v ? .14+Math.min(.8,Math.abs(v)*.65) : .08}" data-duration="1200"`);
  });
  body += tag(x+cell*4-2,y-42,'S',C.teal,'middle');
  return layer('shared-state',body);
}

function factorization(step, ctx) {
  let body = recallFormula(step);
  const pairs = [['John','espresso'],['Theo','tea'],['Mina','cocoa']];
  pairs.forEach(([name,value],i) => {
    const x = step>=4 ? 900 : step>=3 ? 780 : 55;
    const y = step>=4 ? 310 : step>=3 ? 245+i*25 : 190+i*100;
    const scale = step>=4 ? .08 : step>=3 ? .25 : 1;
    body += layer('compress-pair-' + i,orderCard('pair',0,0,name,value,325,false),
      `transform="translate(${x} ${y}) scale(${scale})" opacity="${step>=4 ? 0 : step>=3 ? .25 : 1}" data-duration="1400"`);
    let binding = '';
    const key = baseKeys[i].map(v => v/Math.sqrt(8));
    memoryWrite(Array(64).fill(0),key,baseValues[i]).forEach((v,j) => {
      binding += rect(470+(j%8)*7,205+i*100+Math.floor(j/8)*7,5,5,'none',v<0 ? C.red : C.teal,1);
    });
    body += reveal('outer-product-' + i,binding + edge(`M395 ${235+i*100} C420 ${235+i*100} 435 ${235+i*100} 455 ${235+i*100}`,C.teal,2),step===2);
  });
  body += reveal('pooled-state',sharedState(3,820,230,28),step>=3);
  body += reveal('factored-query',person('john',220,325,{label:'John?'}) + edge('M330 325 C505 325 615 325 785 325',C.violet,4),step>=4);
  body += reveal('fixed-state-label',text(930,492,'Fixed size',27,C.teal,'middle'),step>=3);
  return frame(body,ctx,[
    'Start from the softmax numerator.',
    'Replace exponential matching with a dot product. This changes the attention rule.',
    'Regroup the linear sum: sum_i (q dot k_i) v_i equals q times sum_i k_i transpose v_i.',
    'The query-independent sum is the fixed-size state S.',
    'Read with q S. The key–value pairs have been accumulated into the shared state.'
  ][step]);
}

function writeAndRead(step,ctx) {
  const writing = step<=3, count = Math.min(step,3);
  let body = text(600,58,writing ? 'S ← S + kᵀv' : 'read = qS',42,C.ink,'middle','font-family="Georgia, serif"');
  const pairs = [['John','espresso'],['Theo','tea'],['Mina','cocoa']];
  body += reveal('incoming-pair',orderCard('incoming',30,240,...pairs[Math.max(0,count-1)],300,true),writing);
  body += reveal('read-cue',person('john',155,285,{label:'John?'}),!writing);
  body += edge('M345 285 C390 285 410 285 445 285',writing ? (step ? C.teal : C.line) : C.violet,4);
  body += sharedState(count,472,155,33);
  body += reveal('write-count',text(985,285,String(count),80,C.teal,'middle','data-key="write-number" data-number="unsigned"') + tag(985,335,count===1 ? 'Write' : 'Writes',C.muted,'middle'),writing);
  body += reveal('read-answer',edge('M765 285 C845 285 865 285 940 285',C.teal,6) + drinkNode('order',1045,285),step>=5);
  body += illustration();
  return frame(body,ctx,writing ? `${count} outer-product writes into the same state.` : 'Read John’s espresso from the state with q S. Reading leaves the state unchanged.');
}

function interference(step,ctx) {
  let body = person('john',155,245,{label:'John?'});
  body += edge('M260 245 C335 245 365 245 445 245',C.violet,4);
  body += sharedState([3,8,15][step]);
  body += edge('M765 245 C800 245 800 245 840 245',C.teal,4);
  body += text(865,145,'Espresso',26,C.teal) + rect(865,170,255,24,'none',C.teal,4);
  body += text(865,300,'Other orders',26,C.red) + rect(865,325,[0,70,220][step],24,'none',C.red,4,'data-key="interference" data-duration="1200"');
  body += illustration();
  return frame(body,ctx,'Capacity: as more associations share the fixed state, overlapping keys bring unwanted values into the readout. Bars are schematic.');
}

function sphereGuide(key,x,y,r) {
  return layer(key,circle(x,y,r,C.line,'none') +
    `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*.28}" fill="none" stroke="${C.line}" stroke-width="1.5"/>` +
    `<ellipse cx="${x}" cy="${y}" rx="${r*.3}" ry="${r}" fill="none" stroke="${C.line}" stroke-width="1.5"/>`);
}

const polar = (x,y,r,degrees) => [x+r*Math.cos(degrees*Math.PI/180),y-r*Math.sin(degrees*Math.PI/180)];
export const psdExampleKey = [2/3,-2/3,1/3];
export const psdFeature = key => key.flatMap(a=>key.map(b=>a*b));

function unitKeys(step,ctx) {
  let body = sphereGuide('key-sphere',360,260,180);
  body += circle(360,260,5,C.muted,C.muted);
  [-25,35,105,165,230].forEach((angle,i)=>{
    const radius=180*(step ? 1 : [.55,1.22,.73,.45,.84][i]);
    const [x,y]=polar(360,260,radius,angle),color=i===1 ? C.violet : C.teal;
    body += path(`M360 260 L${x} ${y}`,color,i===1 ? 4 : 2,`data-key="key-radius-${i}" data-duration="1400"`);
    body += circle(x,y,9,color,color,`data-key="unit-key-${i}" data-duration="1400"`);
  });
  body += text(875,200,step ? 'Length = 1' : 'Different lengths',38,step ? C.teal : C.muted,'middle');
  body += reveal('directions-label',text(875,275,'Direction is the address',30,C.ink,'middle'),step>=1);
  body += text(360,492,'Sphere · great-circle slice',18,C.muted,'middle');
  return frame(body,ctx,'Normalize keys to unit length. Their directions lie on a sphere; the diagram shows a great-circle slice.');
}

function spreadKeys(step,ctx) {
  const angles=step ? [0,45,90] : [35,45,55];
  const overlap=Math.cos((step ? 45 : 10)*Math.PI/180);
  const cx=350,cy=230,radius=175;
  let body = circle(cx,cy,radius,C.line,'none');
  body += filledPath(`M${cx} ${cy} L${cx+radius} ${cy} A${radius} ${radius} 0 0 0 ${cx} ${cy-radius} Z`,C.teal,'#1a3537');
  angles.forEach((angle,i)=>{
    const color=i===1 ? C.violet : C.teal;
    const label=layer('position-label-'+i,text(0,9,String(i+1),27,color,'middle'),
      `transform="translate(${radius+29} 0) rotate(${angle})" data-duration="1600"`);
    body += layer('packing-direction-'+i,path(`M0 0 L${radius} 0`,color,2) + circle(radius,0,11,color,color) + label,
      `transform="translate(${cx} ${cy}) rotate(${-angle})" data-duration="1600"`);
  });
  body += text(350,450,step ? 'Spread in sequence' : 'Crowded',35,step ? C.teal : C.amber,'middle');
  body += text(350,490,'Positional embeddings',24,C.muted,'middle');
  body += text(740,115,'Read position 2',27,C.ink);
  body += text(740,180,'Self',24,C.violet) + rect(740,200,330,22,'none',C.violet,4) + text(1100,220,'1',23,C.violet);
  body += text(740,290,'Largest other match',24,C.teal);
  body += rect(740,310,330*overlap,22,'none',C.teal,4,'data-key="packing-overlap" data-duration="1600"');
  body += text(1100,330,overlap.toFixed(2),23,C.teal);
  body += reveal('less-interference',text(905,420,'Less interference',31,C.teal,'middle'),step>=1);
  return frame(body,ctx,'Positional embeddings supply sequence information. In this illustrative ordered packing, unit addresses 1, 2, and 3 spread evenly along a positive quarter-circle while retaining their order. Reading position 2, the largest other-key match falls from about 0.98 to 0.71; self-match stays 1.');
}

function psdTile(key,x,y,values,cell=42,withNumbers=false) {
  let body='';
  values.forEach((v,i)=>{
    body += rect(x+(i%3)*cell,y+Math.floor(i/3)*cell,cell-5,cell-5,C.line,v<0 ? '#413039' : '#1d4141',5,`data-key="${key}-cell-${i}"`);
    if(withNumbers) body += text(x+(i%3)*cell+(cell-5)/2,y+Math.floor(i/3)*cell+cell*.61,v.toFixed(2).replace(/^0\./,'.').replace(/^-0\./,'−.'),25,v<0 ? C.red : C.teal,'middle');
    else body += circle(x+(i%3)*cell+(cell-5)/2,y+Math.floor(i/3)*cell+(cell-5)/2,Math.max(3,10*Math.sqrt(Math.abs(v))),v<0 ? C.red : C.teal,v<0 ? C.red : C.teal);
  });
  return layer(key,body);
}

function coneFamilies(step,ctx) {
  let orthant = text(200,65,'Positive orthant',31,C.ink,'middle');
  // A schematic positive octant: three coordinate rays, joined by spherical arcs.
  orthant += filledPath('M200 340 L90 255 Q90 150 200 145 Q310 150 310 255 Z',C.teal,'#183235');
  orthant += path('M200 340 V145 M200 340 L90 255 M200 340 L310 255 M90 255 Q200 220 310 255',C.teal,2);
  [[90,255],[200,145],[310,255]].forEach(([x,y])=>orthant+=circle(x,y,8,C.teal,C.teal));
  orthant += text(200,422,'Positive coordinates',24,C.muted,'middle');
  let lorentz = text(600,65,'Lorentz cone',31,C.ink,'middle');
  lorentz += filledPath('M480 185 L600 365 L720 185',C.amber,'#342e25');
  lorentz += `<ellipse cx="600" cy="185" rx="120" ry="36" stroke="${C.amber}" stroke-width="2" fill="#3b3327"/>`;
  lorentz += path('M600 365 L510 162 M600 365 L600 221 M600 365 L690 162',C.amber,2);
  [[510,162],[600,221],[690,162]].forEach(([x,y])=>lorentz+=circle(x,y,8,C.amber,C.amber));
  lorentz += text(600,422,'A constrained cap',24,C.muted,'middle');
  let psd = text(1000,65,'PSD matrices',31,C.ink,'middle');
  psd += psdTile('psd-back',1014,145,psdFeature([1/3,2/3,-2/3]),39);
  psd += rect(905,213,137,137,C.teal,C.bg,9);
  psd += psdTile('psd-front',913,221,psdFeature(psdExampleKey),42);
  psd += text(1000,422,'Matrix-valued addresses',24,C.muted,'middle');
  let body = orthant + reveal('lorentz-family',lorentz,step>=1) + reveal('psd-family',psd,step>=2);
  body += reveal('cone-common',text(600,500,'Different geometries. Nonnegative matches.',25,C.teal,'middle'),step>=2);
  return frame(body,ctx,'Three symmetric-cone feature families: the positive orthant, Lorentz cone, and positive semidefinite matrices. The first two drawings are schematic; PSD addresses are shown as matrices, with signed off-diagonal entries.');
}

function psdKeys(step,ctx) {
  let body = text(200,94,'k',49,C.violet,'middle','font-family="Georgia, serif" font-style="italic"');
  psdExampleKey.forEach((v,i)=>{
    body += rect(155,135+i*88,90,78,C.violet,'#242236',8);
    body += text(200,187+i*88,['⅔','−⅔','⅓'][i],34,C.violet,'middle');
  });
  body += text(200,456,'Unit vector',25,C.muted,'middle');
  body += reveal('psd-lift',edge('M300 265 H480',C.teal,4) + text(675,94,'kᵀk',48,C.teal,'middle','font-family="Georgia, serif"') + psdTile('lift-matrix',550,135,psdFeature(psdExampleKey),88,true) + text(675,456,'Unit PSD matrix',25,C.teal,'middle'),step>=1);
  body += reveal('squared-match',text(1020,165,'⟨q, k⟩ → ⟨q, k⟩²',30,C.ink,'middle','font-family="Georgia, serif"') + text(1020,245,'1 → 1',41,C.violet,'middle') + text(1020,325,'0.1 → 0.01',34,C.teal,'middle') + text(1020,395,'Sharper retrieval',26,C.teal,'middle'),step>=2);
  return frame(body,ctx,'Lift unit keys and queries to rank-one PSD outer products. Their matrix inner product is the squared original dot product: 1 stays 1, while 0.1 becomes 0.01. Sharper retrieval suppresses weak cross-matches.');
}

function psdCapacity(step,ctx) {
  let body = tag(600,45,'Idealized recall · same projection width p',C.muted,'middle');
  body += text(275,135,'Linear',33,C.ink,'middle');
  for(let i=0;i<7;i++) body += rect(149+i*37,193,29,29,C.amber,'#3b3022',4);
  body += text(275,395,'~ p',69,C.amber,'middle','font-family="Georgia, serif"');
  let lifted = text(925,135,'PSD',33,C.teal,'middle');
  for(let r=0;r<7;r++) for(let c=0;c<7;c++) lifted += rect(848+c*23,159+r*23,17,17,'none',r===c ? C.teal : '#376b68',3);
  lifted += text(925,395,'~ p²',69,C.teal,'middle','font-family="Georgia, serif"');
  body += reveal('capacity-lift',edge('M480 262 H665',C.teal,4) + lifted,step>=1);
  body += reveal('capacity-cost',text(600,495,'Larger feature state. Still fixed as context grows.',27,C.ink,'middle'),step>=2);
  return frame(body,ctx,'Under the paper’s idealized Welch-scale, isotropic-value readout, linear retrieval scales with projection width p, while the PSD lift extends it to order p squared. The feature-value state is larger; its size remains independent of sequence length. These are conditional scaling results, not measured accuracies or an equal-byte comparison.');
}

function overwrite(step,ctx) {
  const initial = toyState(3);
  const state = step>=1 ? memoryWrite(initial,johnKey,juiceValue) : initial;
  let body = reveal('new-order',rect(325,15,550,70,C.teal,C.panel,12) + text(600,60,'John: orange juice, please.',29,C.teal,'middle'),step>=1);
  body += person('john',155,285,{label:'John?'});
  body += edge('M260 285 C335 285 365 285 445 285',C.violet,4);
  body += sharedState(state,472,155,33);
  body += reveal('overwrite-read',edge('M765 285 C800 285 810 285 850 285',C.teal,4),step!==1);
  body += reveal('old-order-result',cup(925,245,.54,C.teal) + text(1000,255,'espresso',26,C.teal),step!==1);
  body += reveal('new-order-result',text(925,320,'+',38,C.muted,'middle') + drinkIcon(925,375,'orange juice',.5,C.teal) + text(1000,385,'orange juice',24,C.teal),step>=2);
  body += reveal('added-twice',tag(600,487,'Added ≠ replaced',C.amber,'middle'),step>=2);
  body += illustration();
  return frame(body,ctx,'Overwrite problem: adding a second value at John’s key makes both espresso and orange juice contribute. Addition does not replace the previous association.');
}

function correctionGlyph(x,y,values) {
  let body = '';
  values.forEach((v,i) => body += rect(x+(i%4)*30,y+Math.floor(i/4)*30,23,23,'none',v<0 ? C.red : C.teal,3,`opacity="${.2+Math.min(.8,Math.abs(v)*.5)}"`));
  return body;
}

function predictedValueSymbol() {
  return mathVariable('v',C.muted,'t') + path('M5 -49 L16 -58 L27 -49',C.muted,2);
}

function predictionEquation() {
  return layer('delta-prediction-equation',
    formulaPiece('delta-prediction',440,65,predictedValueSymbol()) +
    formulaPiece('delta-prediction-equals',520,65,text(0,0,'=',46,C.ink)) +
    formulaPiece('delta-read-key',590,65,mathVariable('k',C.violet,'t')) +
    formulaPiece('delta-read-state',675,65,mathVariable('S',C.teal,'t−1')));
}

function correctionEquation(step) {
  const expanded=step>=2;
  let body=formulaPiece('delta-error',expanded ? 360 : 405,480,mathVariable('e',C.amber,'t'));
  body+=formulaPiece('delta-error-equals',expanded ? 430 : 475,480,text(0,0,'=',46,C.ink));
  body+=formulaPiece('delta-target',expanded ? 500 : 545,480,mathVariable('v',C.teal,'t'));
  body+=formulaPiece('delta-minus',expanded ? 570 : 615,480,text(0,0,'−',46,C.ink));
  body+=formulaPiece('delta-prediction-reference',690,480,predictedValueSymbol(),!expanded);
  body+=formulaPiece('delta-correction-key',645,480,mathVariable('k',C.violet,'t'),expanded);
  body+=formulaPiece('delta-correction-state',730,480,mathVariable('S',C.teal,'t−1'),expanded);
  return reveal('delta-correction-equation',body,step>=1);
}

function deltaUpdateEquation(step) {
  const applied=step>=1;
  let body=formulaPiece('delta-update-delta',395,65,text(0,0,'Δ',54,C.teal,'start','font-family="Georgia, serif"'),!applied);
  body+=formulaPiece('delta-new-state',applied ? 325 : 445,65,mathVariable('S',C.teal,'t'));
  body+=formulaPiece('delta-update-equals',applied ? 400 : 520,65,text(0,0,'=',46,C.ink));
  body+=formulaPiece('delta-old-state',480,65,mathVariable('S',C.teal,'t−1'),applied);
  body+=formulaPiece('delta-update-plus',580,65,text(0,0,'+',46,C.ink),applied);
  body+=formulaPiece('delta-write-strength',applied ? 655 : 600,65,mathVariable('β',C.muted,'t'));
  body+=formulaPiece('delta-write-key',applied ? 735 : 680,65,mathVariable('k',C.violet,'t',true));
  body+=formulaPiece('delta-write-error',applied ? 815 : 760,65,mathVariable('e',C.amber,'t'));
  return layer('delta-update-equation',body);
}

function correction(step,ctx) {
  const old = toyState(3), predicted = memoryRead(old,johnKey);
  const error = juiceValue.map((v,i) => v-predicted[i]);
  let body = predictionEquation();
  body += reveal('read-old-state',person('john',155,285,{label:'John?'}) + edge('M260 285 C335 285 365 285 445 285',C.violet,4) + sharedState(old,472,155,33) + edge('M765 285 C845 285 865 285 940 285',C.teal,5),step===0);
  body += layer('recalled-location',drinkNode('recalled',0,0,'espresso',C.muted),`transform="translate(${step ? 620 : 1045} 285)" data-duration="1200"`);
  body += reveal('desired-value',drinkNode('new-value',195,285,'orange juice') + tag(195,150,'New',C.teal,'middle'),step>=1);
  body += reveal('subtract',text(405,308,'−',58,C.muted,'middle') + tag(620,150,'Recalled',C.muted,'middle') + text(815,308,'=',48,C.muted,'middle'),step>=1);
  body += reveal('error',correctionGlyph(975,255,error) + text(1030,417,'correction',29,C.amber,'middle'),step>=2);
  body += correctionEquation(step);
  body += illustration();
  return frame(body,ctx,'Read the prediction v-hat_t = k_t S_(t−1). Then form the value correction e_t = v_t − v-hat_t = v_t − k_t S_(t−1). The key, value, and error are row vectors. Icons denote value representations.');
}

function deltaUpdate(step,ctx) {
  const old = toyState(3), predicted = memoryRead(old,johnKey);
  const error = juiceValue.map((v,i) => v-predicted[i]);
  const updated = deltaWrite(old,johnKey,juiceValue);
  let body = deltaUpdateEquation(step);
  body += reveal('correction-write',rect(35,235,300,100,C.teal,C.panel,12) + text(65,293,'John',29,C.violet) + correctionGlyph(210,254,error) + tag(185,195,'Correction',C.amber,'middle'),step<2);
  body += reveal('updated-query',person('john',155,285,{label:'John?'}),step>=2);
  body += edge('M350 285 C390 285 410 285 445 285',step>=2 ? C.violet : C.teal,4);
  body += sharedState(step>=1 ? updated : old,472,155,33);
  body += reveal('latest-answer',edge('M765 285 C845 285 865 285 940 285',C.teal,5) + drinkNode('latest',1045,285,'orange juice'),step>=2);
  body += tag(600,490,step>=2 ? 'Same state size' : 'Write the correction',C.muted,'middle');
  body += illustration();
  return frame(body,ctx,'Form the matrix update ΔS_t = β_t k_t transpose e_t, then add it: S_t = S_(t−1) + β_t k_t transpose e_t. Beta controls write strength. In this unit-key, beta-equals-one example the next read gives orange juice.');
}

function ending(step,ctx) {
  const updated = deltaWrite(toyState(3),johnKey,juiceValue);
  let body = person('john',155,245);
  body += edge('M260 245 C335 245 365 245 445 245',C.violet,5) + sharedState(updated);
  body += reveal('last-read',edge('M765 245 C845 245 865 245 940 245',C.teal,6) + drinkNode('latest-order',1045,245,'orange juice'),step>=1);
  body += tag(430,470,'Geometry → capacity',C.muted,'middle') + tag(820,470,'Delta → update',C.muted,'middle');
  body += illustration();
  return frame(body,ctx,'A fixed associative state has two concerns: how many associations remain recoverable, and how to update them when their values change.');
}

function mainIdeas(step,ctx) {
  const colors=[C.violet,C.teal,C.teal,C.amber];
  const headings=['Recall','Compress','Separate','Update'];
  const cues=['Match the cue','Pairs → one state','Geometry sets capacity','Write the error'];
  const icons=[];
  icons[0]=circle(35,100,15,C.violet,C.violet) + edge('M65 100 H155',C.violet,4) + circle(185,100,25,C.teal,'none');
  icons[1]='';
  for(let i=0;i<3;i++) icons[1]+=rect(0,60+i*30,33,18,C.violet,'#242236',3) + rect(40,60+i*30,33,18,C.teal,'#1d4141',3);
  icons[1]+=edge('M84 100 H109',C.teal,3) + sharedState(3,135,63,11);
  icons[2]=filledPath('M40 165 L155 165 A115 115 0 0 0 40 50 Z',C.teal,'#1a3537');
  [0,45,90].forEach(angle=>{
    const [x,y]=polar(40,165,115,angle);
    icons[2]+=path(`M40 165 L${x} ${y}`,C.teal,2) + circle(x,y,8,C.teal,C.teal);
  });
  const error=juiceValue.map((v,i)=>v-espressoValue[i]);
  icons[3]=correctionGlyph(65,75,error) + edge('M195 116 C235 176 45 203 35 126 C29 86 41 55 72 42',C.amber,3);
  let body=path('M600 35 V485 M25 260 H1175',C.line,1);
  headings.forEach((heading,i)=>{
    const x=i%2 ? 630 : 25,y=i<2 ? 0 : 260;
    const item=icons[i] + text(255,94,heading,40,colors[i]) + text(255,143,cues[i],27,C.ink);
    body+=reveal('main-idea-'+i,layer('idea-content-'+i,item,`transform="translate(${x} ${y})"`),step>=i);
  });
  return frame(body,ctx,'Main ideas: recall by matching a cue; compress separate pairs into one state; separate addresses through geometry to improve capacity; update associations by writing the prediction error.');
}

function openQuestions(step,ctx) {
  const questions=['Recall per byte?','Order without collisions?','What should we forget?'];
  let body='';
  questions.forEach((question,i)=>{
    const y=110+i*120;
    body+=reveal('open-question-'+i,text(70,y,String(i+1).padStart(2,'0'),25,C.teal,'start','class="mono"') + text(150,y,question,46,C.ink),step>=i);
  });
  body+=reveal('discussion-contact',path('M70 421 H1130',C.line,1) +
    `<a href="mailto:ghriss@wustl.edu">${text(70,481,'ghriss@wustl.edu',24,C.muted)}</a>` +
    `<a href="https://ayghri.me" target="_blank" rel="noopener noreferrer">${text(1130,481,'ayghri.me',24,C.teal,'end')}</a>`,step>=2);
  return frame(body,ctx,'Questions for discussion: how much reliable recall can we obtain per byte of state; can positional structure and separated addresses coexist as context grows; and which associations should be overwritten, retained, or forgotten?');
}

const figure = (render,label,chapter,captions) => ({render,label,chapter,captions,steps:captions.length-1});
export const figures = [
  {...figure(titleSlide,'How LLMs recall — Ayoub Ghriss.','ASSOCIATIVE MEMORY & ATTENTION',['How LLMs recall']),cover:true},
  figure(hebbian,'John’s usual order: Hebbian learning and recall.','01 / ASSOCIATION',['Monday','Tuesday','Wednesday','Friday: a cue','Recall']),
  figure(hebbianVectors,'A three-neuron activity vector builds a Hebbian association matrix.','01 / ASSOCIATION',['A and B active','Encode the activity','Take the outer product','Find the A–B entry','Repeat the association']),
  figure(recognition,'A few pixels suggest the cup.','01 / ASSOCIATION',['A partial cue','A complete cup']),
  figure(recovery,'Actual Hopfield recovery of a noisy cup.','01 / ASSOCIATION',['24 errors','20 errors','16 errors','12 errors','8 errors','4 errors','Recovered']),
  figure(associativeLookup,'A cue matches a key and retrieves an association.','02 / ASSOCIATIVE LOOKUP',['Cue','Key','Value']),
  figure(contextMemory,'The prompt supplies attention’s keys and values.','03 / ATTENTION',['Today’s orders','Keys','Values']),
  figure((s,c)=>attentionScene(s,c),'Attention compares, weights, and recalls.','03 / ATTENTION',['Query','Compare','Weight','Recall']),
  figure((s,c)=>attentionScene(s,c,true),'A changed prompt supplies a new association.','03 / ATTENTION',['Espresso','A new order','Orange juice','Back to espresso']),
  figure(softmaxCache,'Softmax scores each cached key–value pair separately.','04 / SOFTMAX',['The weighted sum','Query-dependent scores','Keep the pairs']),
  figure(factorization,'Remove exp, regroup the sum, and store one state.','05 / LINEAR ATTENTION',['Softmax numerator','Change the match','Regroup','Name the state S','Read q S']),
  figure(writeAndRead,'Write associations into S and read them with a cue.','05 / LINEAR ATTENTION',['Empty state','John → espresso','Theo → tea','Mina → cocoa','Query John','Read espresso']),
  figure(interference,'Fixed-state associations interfere at readout.','06 / CAPACITY',['Three associations','More overlap','Interference']),
  figure(unitKeys,'Normalized keys lie on a sphere.','07 / KATA · KEY GEOMETRY',['Keys of different lengths','Unit-length directions']),
  figure(spreadKeys,'Spread successive position-aware addresses while preserving sequence order.','07 / KATA · KEY GEOMETRY',['Crowded positions 1, 2, 3','Spread evenly in sequence']),
  figure(coneFamilies,'Orthant, Lorentz, and PSD feature geometries.','07 / KATA · KEY GEOMETRY',['Positive orthant','Lorentz cone','PSD matrices']),
  figure(psdKeys,'A rank-one PSD feature squares the match for sharper retrieval.','07 / KATA · KEY GEOMETRY',['A unit key','A matrix address','Sharper retrieval: 0.1 → 0.01; 1 → 1']),
  figure(psdCapacity,'PSD expands the idealized recall regime with a larger state.','07 / KATA · CAPACITY',['Linear recall scaling','PSD recall scaling','The state tradeoff']),
  figure(overwrite,'An additive write does not replace an old value.','08 / OVERWRITE',['Original order','John changes his order','Both values contribute']),
  figure(correction,'Read the current prediction and compute a correction.','09 / DELTA RULE',['Read before writing','New minus recalled','The correction']),
  figure(deltaUpdate,'Write the correction and recall the new value.','09 / DELTA RULE',['Correction for John','Update the state','Read the current order']),
  figure(ending,'Return to John’s current order.','10 / RECALL & UPDATE',['A familiar cue','The current order']),
  figure(mainIdeas,'Four ideas: recall, compress, separate, and update.','11 / MAIN IDEAS',['Recall by matching','Compress into one state','Geometry sets capacity','Write the error']),
  figure(openQuestions,'Questions about recall per byte, positional structure, and forgetting.','12 / OPEN QUESTIONS',['Recall per byte?','Order without collisions?','What should we forget?'])
];
