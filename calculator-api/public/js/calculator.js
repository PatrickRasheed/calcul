/**
 * ═══════════════════════════════════════════════════════════════════
 * RETRO CALC 9000 — Calculator Engine
 *
 * Features:
 *  - Full expression evaluation with operator precedence
 *  - Parentheses, √, %
 *  - Division-by-zero + syntax error handling
 *  - Keyboard bindings
 *  - Retro sounds via Web Audio API (optional)
 *  - CRT display animations
 * ═══════════════════════════════════════════════════════════════════
 */

/* ────────────────────────────────────────────────────────────────────
   DOM references
   ──────────────────────────────────────────────────────────────────── */
const mainDisplay   = document.getElementById('main-display');
const exprDisplay   = document.getElementById('expression-display');
const soundToggle   = document.getElementById('sound-toggle');
const soundIcon     = soundToggle.querySelector('.sound-icon');
const indErr        = document.getElementById('ind-err');
const indNeg        = document.getElementById('ind-neg');

/* ────────────────────────────────────────────────────────────────────
   State
   ──────────────────────────────────────────────────────────────────── */
const state = {
  current:      '0',        // What's shown in the main display
  expression:   '',         // Full expression string
  justEvaluated: false,     // Flag: last action was "="
  hasError:      false,
  soundEnabled:  false,
  audioCtx:      null,
};

/* ────────────────────────────────────────────────────────────────────
   Display helpers
   ──────────────────────────────────────────────────────────────────── */

/** Format a number for display — max 12 significant digits */
function formatNumber(n) {
  if (!isFinite(n)) return 'ERREUR';
  // Use toPrecision to avoid floating-point noise
  const s = parseFloat(n.toPrecision(12)).toString();
  // Replace '.' with ',' for French locale
  return s.replace('.', ',');
}

function setMainDisplay(text, { error = false, flash = false } = {}) {
  mainDisplay.classList.remove('error', 'flash');

  // Force reflow to restart animation
  void mainDisplay.offsetWidth;

  if (error) mainDisplay.classList.add('error');
  else if (flash) mainDisplay.classList.add('flash');

  mainDisplay.textContent = text;
  state.hasError = error;
}

function setExprDisplay(text) {
  exprDisplay.textContent = text;
}

function updateIndicators() {
  const isNeg = !state.hasError && parseFloat(state.current.replace(',', '.')) < 0;
  indNeg.classList.toggle('active', isNeg);
  indErr.classList.toggle('active', state.hasError);
}

function render() {
  setMainDisplay(state.current);
  setExprDisplay(state.expression);
  updateIndicators();
}

/* ────────────────────────────────────────────────────────────────────
   Expression manipulation
   ──────────────────────────────────────────────────────────────────── */

/** Convert the visual expression (with × ÷ , √) into a JS-eval-safe string */
function toEvalString(expr) {
  return expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/,/g, '.')       // French decimal
    .replace(/−/g, '-')
    .replace(/√\(/g, 'Math.sqrt(');
}

/** Count unmatched open parentheses */
function unmatchedParens(expr) {
  let count = 0;
  for (const ch of expr) {
    if (ch === '(') count++;
    else if (ch === ')' && count > 0) count--;
  }
  return count;
}

/** Check whether the last meaningful character is an operator */
function endsWithOperator(expr) {
  return /[+\-×÷*\/]$/.test(expr.trim());
}

/** Check whether the last token is a number (or closing paren) */
function endsWithNumber(expr) {
  return /[\d,)]$/.test(expr.trim());
}

/* ────────────────────────────────────────────────────────────────────
   Core actions
   ──────────────────────────────────────────────────────────────────── */

function actionDigit(value) {
  playSound('key');
  if (state.hasError) return actionClearAll();

  if (state.justEvaluated) {
    // Start fresh expression after evaluation
    state.expression  = '';
    state.current     = value;
    state.justEvaluated = false;
    render();
    return;
  }

  if (state.current === '0' && value !== '0') {
    // Replace leading zero
    state.current = value;
  } else if (state.current === '0' && value === '0') {
    // Keep single zero
    return;
  } else {
    // Limit length
    if (state.current.replace(/[^0-9]/g, '').length >= 15) return;
    state.current += value;
  }

  state.expression += value;
  render();
}

function actionDecimal() {
  playSound('key');
  if (state.hasError) return;

  // Prevent double decimal in current token
  const tokens = state.expression.split(/[+\-×÷(]/);
  const lastToken = tokens[tokens.length - 1];
  if (lastToken.includes(',')) return;

  if (state.justEvaluated) {
    state.expression  = '0,';
    state.current     = '0,';
    state.justEvaluated = false;
    render();
    return;
  }

  if (state.current === '0' || state.current === '') {
    state.current = '0,';
    if (!state.expression || endsWithOperator(state.expression) || state.expression.endsWith('(')) {
      state.expression += '0,';
    }
  } else {
    state.current += ',';
    state.expression += ',';
  }

  render();
}

function actionOperator(op) {
  playSound('operator');
  if (state.hasError) return;

  if (state.justEvaluated) {
    // Continue chaining from the result
    state.expression   = state.current + op;
    state.justEvaluated = false;
    render();
    return;
  }

  // Replace last operator if expression already ends with one
  if (endsWithOperator(state.expression)) {
    state.expression = state.expression.slice(0, -1) + op;
  } else if (state.expression) {
    state.expression += op;
  }

  state.current = '0';
  render();
}

function actionPercent() {
  playSound('key');
  if (state.hasError) return;
  if (!state.current || state.current === '0') return;

  try {
    const val = parseFloat(state.current.replace(',', '.')) / 100;
    const formatted = formatNumber(val);
    // Replace last number in expression
    state.expression = state.expression.slice(0, -(state.current.length)) + formatted;
    state.current    = formatted;
    render();
  } catch {
    actionError('ERREUR %');
  }
}

function actionSqrt() {
  playSound('operator');
  if (state.hasError) return;

  if (state.justEvaluated || !state.expression) {
    state.expression   = '√(' + state.current + ')';
    state.justEvaluated = false;
  } else {
    state.expression += '√(';
    state.current     = '0';
  }
  render();
}

function actionParenOpen() {
  playSound('key');
  if (state.hasError) return;

  if (state.justEvaluated) {
    state.expression   = '(';
    state.current      = '0';
    state.justEvaluated = false;
    render();
    return;
  }

  // Auto-multiply if last char is a digit or )
  if (endsWithNumber(state.expression)) {
    state.expression += '×(';
  } else {
    state.expression += '(';
  }
  state.current = '0';
  render();
}

function actionParenClose() {
  playSound('key');
  if (state.hasError) return;
  if (unmatchedParens(state.expression) === 0) return; // nothing to close

  state.expression += ')';
  // Update current display with the last number
  const match = state.expression.match(/[\d,]+(?=[^,\d]*$)/);
  if (match) state.current = match[0];
  render();
}

function actionEquals() {
  playSound('equals');
  if (state.hasError) return;
  if (!state.expression) return;

  let expr = state.expression;

  // Auto-close unclosed parens
  const open = unmatchedParens(expr);
  for (let i = 0; i < open; i++) expr += ')';

  // Remove trailing operator
  if (endsWithOperator(expr)) expr = expr.slice(0, -1);

  // Show expression in history
  setExprDisplay(state.expression + '=');

  const evalStr = toEvalString(expr);

  try {
    // Safe evaluation — no eval(), using Function constructor with sandboxed scope
    const result = Function('"use strict"; return (' + evalStr + ')')();

    if (!isFinite(result)) {
      actionError('DIV/0!');
      return;
    }

    const formatted = formatNumber(result);
    state.current      = formatted;
    state.expression   = '';
    state.justEvaluated = true;

    setMainDisplay(formatted, { flash: true });
    updateIndicators();
  } catch {
    actionError('SYNTAXE');
  }
}

function actionBackspace() {
  playSound('key');
  if (state.hasError) { actionClear(); return; }
  if (state.justEvaluated) { actionClearAll(); return; }
  if (!state.expression) return;

  state.expression = state.expression.slice(0, -1);

  // Recompute current token
  const tokens = state.expression.split(/(?<=[+\-×÷(])|(?=[+\-×÷(])/);
  const lastTok = tokens.filter(Boolean).pop() || '0';
  state.current = /^[\d,]+$/.test(lastTok) ? lastTok : '0';

  if (!state.expression) {
    state.current = '0';
  }

  render();
}

function actionClear() {
  playSound('clear');
  if (state.hasError) { actionClearAll(); return; }

  // CE clears current input
  const lastNum = state.expression.match(/([\d,]+)$/);
  if (lastNum) {
    state.expression = state.expression.slice(0, -lastNum[0].length);
  }
  state.current  = '0';
  state.hasError = false;
  render();
}

function actionClearAll() {
  playSound('clear');
  state.current       = '0';
  state.expression    = '';
  state.justEvaluated = false;
  state.hasError      = false;
  mainDisplay.classList.remove('error', 'flash');
  render();
}

function actionError(msg) {
  state.hasError      = true;
  state.justEvaluated = false;
  state.expression    = '';
  state.current       = msg;
  setMainDisplay(msg, { error: true });
  indErr.classList.add('active');
  playSound('error');
}

/* ────────────────────────────────────────────────────────────────────
   Button press dispatch
   ──────────────────────────────────────────────────────────────────── */
const ACTIONS = {
  'digit':       (btn) => actionDigit(btn.dataset.value),
  'decimal':     ()    => actionDecimal(),
  'add':         ()    => actionOperator('+'),
  'subtract':    ()    => actionOperator('−'),
  'multiply':    ()    => actionOperator('×'),
  'divide':      ()    => actionOperator('÷'),
  'percent':     ()    => actionPercent(),
  'sqrt':        ()    => actionSqrt(),
  'paren-open':  ()    => actionParenOpen(),
  'paren-close': ()    => actionParenClose(),
  'equals':      ()    => actionEquals(),
  'backspace':   ()    => actionBackspace(),
  'clear':       ()    => actionClear(),
  'clear-all':   ()    => actionClearAll(),
};

document.querySelector('.keypad').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;

  const action = ACTIONS[btn.dataset.action];
  if (action) action(btn);

  // Visual press feedback (in case CSS :active misses on touch)
  btn.classList.add('pressed');
  setTimeout(() => btn.classList.remove('pressed'), 100);
});

/* ────────────────────────────────────────────────────────────────────
   Keyboard bindings
   ──────────────────────────────────────────────────────────────────── */
const KEY_MAP = {
  '0': () => actionDigit('0'),
  '1': () => actionDigit('1'),
  '2': () => actionDigit('2'),
  '3': () => actionDigit('3'),
  '4': () => actionDigit('4'),
  '5': () => actionDigit('5'),
  '6': () => actionDigit('6'),
  '7': () => actionDigit('7'),
  '8': () => actionDigit('8'),
  '9': () => actionDigit('9'),
  ',': () => actionDecimal(),
  '.': () => actionDecimal(),
  '+': () => actionOperator('+'),
  '-': () => actionOperator('−'),
  '*': () => actionOperator('×'),
  '/': () => actionOperator('÷'),
  '%': () => actionPercent(),
  '(': () => actionParenOpen(),
  ')': () => actionParenClose(),
  'Enter':     () => actionEquals(),
  '=':         () => actionEquals(),
  'Backspace': () => actionBackspace(),
  'Delete':    () => actionClear(),
  'Escape':    () => actionClearAll(),
};

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.altKey || e.metaKey) return;

  const fn = KEY_MAP[e.key];
  if (!fn) return;

  e.preventDefault();
  fn();

  // Highlight the corresponding button
  const keyToButton = {
    '0':'[data-value="0"]', '1':'[data-value="1"]', '2':'[data-value="2"]',
    '3':'[data-value="3"]', '4':'[data-value="4"]', '5':'[data-value="5"]',
    '6':'[data-value="6"]', '7':'[data-value="7"]', '8':'[data-value="8"]',
    '9':'[data-value="9"]',
    ',': '[data-action="decimal"]', '.': '[data-action="decimal"]',
    '+': '[data-action="add"]',     '-': '[data-action="subtract"]',
    '*': '[data-action="multiply"]', '/': '[data-action="divide"]',
    '%': '[data-action="percent"]',
    '(': '[data-action="paren-open"]', ')': '[data-action="paren-close"]',
    'Enter': '[data-action="equals"]', '=': '[data-action="equals"]',
    'Backspace': '[data-action="backspace"]',
    'Delete': '[data-action="clear"]',
    'Escape': '[data-action="clear-all"]',
  };

  const sel = keyToButton[e.key];
  if (sel) {
    const btn = document.querySelector(sel);
    if (btn) {
      btn.classList.add('pressed');
      setTimeout(() => btn.classList.remove('pressed'), 100);
    }
  }
});

/* ────────────────────────────────────────────────────────────────────
   Web Audio — Retro sounds
   ──────────────────────────────────────────────────────────────────── */

function getAudioCtx() {
  if (!state.audioCtx) {
    state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return state.audioCtx;
}

/**
 * Play a small retro beep/blip
 * @param {'key'|'operator'|'equals'|'error'|'clear'} type
 */
function playSound(type) {
  if (!state.soundEnabled) return;

  try {
    const ctx  = getAudioCtx();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const profiles = {
      key:      { type: 'square', freq: 880,  dur: 0.05, vol: 0.04 },
      operator: { type: 'square', freq: 660,  dur: 0.07, vol: 0.05 },
      equals:   { type: 'square', freq: 1320, dur: 0.12, vol: 0.06 },
      error:    { type: 'sawtooth', freq: 220, dur: 0.25, vol: 0.06 },
      clear:    { type: 'square', freq: 440,  dur: 0.06, vol: 0.04 },
    };

    const p = profiles[type] || profiles.key;
    osc.type              = p.type;
    osc.frequency.value   = p.freq;
    gain.gain.setValueAtTime(p.vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + p.dur);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + p.dur);
  } catch {
    // Silently ignore — audio not critical
  }
}

/* ────────────────────────────────────────────────────────────────────
   Sound toggle button
   ──────────────────────────────────────────────────────────────────── */
soundToggle.addEventListener('click', () => {
  state.soundEnabled = !state.soundEnabled;
  soundToggle.setAttribute('aria-pressed', String(state.soundEnabled));
  soundIcon.textContent = state.soundEnabled ? '🔊' : '🔇';

  if (state.soundEnabled) {
    // Unlock audio context on first interaction (iOS requirement)
    getAudioCtx().resume().then(() => playSound('equals'));
  }
});

/* ────────────────────────────────────────────────────────────────────
   Boot sequence — tiny power-on animation
   ──────────────────────────────────────────────────────────────────── */
(function bootSequence() {
  const messages = ['RETRO', 'CALC', '9000', 'READY'];
  let i = 0;

  function tick() {
    if (i < messages.length) {
      setMainDisplay(messages[i]);
      i++;
      setTimeout(tick, 220);
    } else {
      setTimeout(() => {
        mainDisplay.classList.remove('flash');
        setMainDisplay('0');
        setExprDisplay('');
      }, 300);
    }
  }

  tick();
})();
