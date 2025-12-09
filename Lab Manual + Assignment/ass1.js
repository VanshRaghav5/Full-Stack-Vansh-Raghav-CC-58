// script.js - Number Pattern Generator
document.addEventListener('DOMContentLoaded', () => {
  const patternSelect = document.getElementById('patternSelect');
  const rowsInput = document.getElementById('rowsInput');
  const generateBtn = document.getElementById('generateBtn');
  const clearBtn = document.getElementById('clearBtn');
  const patternArea = document.getElementById('patternArea');
  const note = document.getElementById('note');
  const useNumbers = document.getElementById('useNumbers');
  const colorToggle = document.getElementById('colorToggle');

  function clearPattern() {
    patternArea.innerHTML = '';
    note.textContent = '';
  }

  function safeRows() {
    let n = parseInt(rowsInput.value, 10);
    if (Number.isNaN(n) || n < 1) n = 1;
    // Cap to prevent extremely large outputs
    if (n > 200) n = 200;
    return n;
  }

  // Build a single line: returns a string where elements are separated by a single space.
  function buildLine(contentArray) {
    return contentArray.join(' ');
  }

  // Render lines into patternArea using spans (allows even/odd coloring & transitions)
  function renderLines(lines, useAltColors) {
    patternArea.innerHTML = '';
    const fragment = document.createDocumentFragment();
    lines.forEach((ln, idx) => {
      const span = document.createElement('div');
      span.className = 'row fade-in ' + ((idx % 2 === 0) ? 'even' : 'odd');
      if (!useAltColors) {
        // remove background if colorToggle off
        span.classList.remove('even', 'odd');
      }
      span.textContent = ln;
      fragment.appendChild(span);
    });
    patternArea.appendChild(fragment);
    // focus for keyboard users
    patternArea.focus();
  }

  // Patterns:

  // Right triangle
  function rightTriangle(n, options) {
    const { useNums } = options;
    const lines = [];
    for (let r = 1; r <= n; r++) {
      const row = [];
      for (let c = 1; c <= r; c++) {
        row.push(useNums ? String(c) : '*');
      }
      lines.push(buildLine(row));
    }
    return lines;
  }

  // Pyramid (centered)
  function pyramid(n, options) {
    const { useNums } = options;
    const lines = [];
    for (let r = 1; r <= n; r++) {
      const starsCount = 2 * r - 1;
      const row = [];
      for (let s = 1; s <= starsCount; s++) {
        row.push(useNums ? String(r) : '*');
      }
      // For centering in monospace, prepend spaces (we use regular spaces)
      const leftPadding = ' '.repeat(n - r);
      lines.push(leftPadding + buildLine(row));
    }
    return lines;
  }

  // Diamond: uses n as number of rows in top half (including middle)
  function diamond(n, options) {
    const { useNums } = options;
    const lines = [];
    // top half
    for (let r = 1; r <= n; r++) {
      const starsCount = 2 * r - 1;
      const row = [];
      for (let s = 1; s <= starsCount; s++) {
        row.push(useNums ? String(r) : '*');
      }
      const leftPadding = ' '.repeat(n - r);
      lines.push(leftPadding + buildLine(row));
    }
    // bottom half
    for (let r = n - 1; r >= 1; r--) {
      const starsCount = 2 * r - 1;
      const row = [];
      for (let s = 1; s <= starsCount; s++) {
        row.push(useNums ? String(r) : '*');
      }
      const leftPadding = ' '.repeat(n - r);
      lines.push(leftPadding + buildLine(row));
    }
    return lines;
  }

  // Format lines to pad evenly for better visual alignment when numbers have multiple digits
  function normalizeSpacing(lines) {
    // Find max token length to align columns
    const tokensGrid = lines.map(line => line.split(' '));
    let maxTokenLen = 1;
    for (const row of tokensGrid) {
      for (const t of row) {
        if (t.length > maxTokenLen) maxTokenLen = t.length;
      }
    }
    // pad each token to width
    const padded = tokensGrid.map(row => row.map(t => t.padStart(maxTokenLen, ' ')).join(' '));
    return padded;
  }

  // Primary generate handler
  function generatePattern() {
    const n = safeRows();
    const pattern = patternSelect.value;
    const useNums = useNumbers.checked;
    const useAlt = colorToggle.checked;

    // quick note adjustments
    note.textContent = '';
    if (pattern === 'diamond' && n > 70) {
      note.textContent = 'Large diamond heights may be wide — reduced performance risk avoided by capping rows to 200.';
    }

    let lines = [];
    if (pattern === 'right') lines = rightTriangle(n, { useNums });
    else if (pattern === 'pyramid') lines = pyramid(n, { useNums });
    else if (pattern === 'diamond') lines = diamond(n, { useNums });
    else lines = rightTriangle(n, { useNums });

    // normalize spacing (makes numbers align better in columns)
    lines = normalizeSpacing(lines);

    renderLines(lines, useAlt);
  }

  // Attach events
  generateBtn.addEventListener('click', generatePattern);
  clearBtn.addEventListener('click', clearPattern);

  // Enter key on rowsInput => generate
  rowsInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') generatePattern();
  });

  // initial generation
  generatePattern();
});
