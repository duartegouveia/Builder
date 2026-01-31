// Virtual Keyboard JavaScript
import { unicodeBlocks, pageHierarchy, transliterations, accentedVariants, keyboardLayouts, getBlockCharacters, getTransliteration } from './unicode-data.js';

const state = {
  currentBlock: 'Basic Latin',
  currentLayout: 'qwerty',
  recentBlocks: [],
  maxRecent: 6,
  output: '',
  longPressTimer: null,
  longPressDelay: 500,
  shiftState: 'lowercase' // 'lowercase', 'uppercase', 'capslock'
};

// Shift state icons
const SHIFT_ICONS = {
  lowercase: '⇧',
  uppercase: '⬆',
  capslock: '⇪'
};

// Symbol ordering by frequency (most common first)
const SYMBOL_ORDER = [
  // Punctuation
  '.', ',', '!', '?', ':', ';', '-', '\'', '"',
  // Parentheses and quotes
  '(', ')', '[', ']', '{', '}', '<', '>',
  // Math operators
  '+', '=', '*', '/', '%', '^',
  // Currency
  '$', '€', '£', '¥', '¢',
  // Special
  '@', '#', '&', '_', '|', '\\', '~', '`',
  // Other
  '©', '®', '™', '°', '§', '¶', '†', '‡'
];

// Check if character is a letter (has uppercase/lowercase pair)
function isLetter(char) {
  return char.toLowerCase() !== char.toUpperCase();
}

// Check if character is a digit
function isDigit(char) {
  return /^[0-9]$/.test(char);
}

// Check if character is a symbol (not letter, not digit, not space)
function isSymbol(char) {
  return !isLetter(char) && !isDigit(char) && char !== ' ' && char.trim() !== '';
}

// Get symbol sort order (lower = more frequent)
function getSymbolOrder(char) {
  const idx = SYMBOL_ORDER.indexOf(char);
  return idx >= 0 ? idx : SYMBOL_ORDER.length + char.charCodeAt(0);
}

document.addEventListener('DOMContentLoaded', init);

function init() {
  renderKeyboard();
  attachEventListeners();
}

function renderKeyboard() {
  const container = document.getElementById('keyboard-container');
  if (!container) return;
  
  container.innerHTML = `
    <div class="keyboard-wrapper">
      <div class="keyboard-output-section">
        <label class="keyboard-label">Output</label>
        <div class="keyboard-output-container">
          <textarea id="keyboard-output" class="keyboard-output" placeholder="Click characters to add them here..." readonly></textarea>
          <div class="keyboard-output-actions">
            <button id="btn-copy-output" class="btn btn-sm btn-outline" title="Copy to clipboard">Copy</button>
            <button id="btn-clear-output" class="btn btn-sm btn-outline" title="Clear output">Clear</button>
          </div>
        </div>
      </div>
      
      <div class="keyboard-nav-section">
        <div class="keyboard-breadcrumb" id="keyboard-breadcrumb"></div>
        <div class="keyboard-recent" id="keyboard-recent"></div>
      </div>
      
      <div class="keyboard-controls">
        <div class="keyboard-hierarchy" id="keyboard-hierarchy"></div>
        <div class="keyboard-controls-right">
          <div class="keyboard-shift-control">
            <button id="shift-button" class="btn btn-outline shift-btn" title="Shift: minúscula / maiúscula / maiúscula presa">
              <span id="shift-icon">⇧</span>
            </button>
            <span id="shift-label" class="shift-label">minúscula</span>
          </div>
          <div class="keyboard-layout-selector">
            <label>Layout:</label>
            <select id="layout-select" class="keyboard-select">
              <option value="unicode">Unicode Order</option>
              <option value="qwerty" selected>QWERTY</option>
              <option value="azerty">AZERTY</option>
              <option value="qwertz">QWERTZ</option>
              <option value="alphabetic">Alphabetic</option>
              <option value="hcesar">HCESAR</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="keyboard-grid-container">
        <div class="keyboard-grid" id="keyboard-grid"></div>
      </div>
      
      <div class="keyboard-variants-popup" id="variants-popup" style="display: none;"></div>
    </div>
  `;
  
  renderHierarchy();
  renderBreadcrumb();
  renderRecentBlocks();
  renderCharacterGrid();
}

function renderHierarchy() {
  const container = document.getElementById('keyboard-hierarchy');
  if (!container) return;
  
  container.innerHTML = '';
  
  const tree = document.createElement('div');
  tree.className = 'hierarchy-tree';
  buildHierarchyDOM(tree, pageHierarchy, '');
  container.appendChild(tree);
}

function buildHierarchyDOM(parent, obj, path) {
  for (const key in obj) {
    const value = obj[key];
    const currentPath = path ? `${path}.${key}` : key;
    const isExpanded = isPathExpanded(currentPath);
    
    if (Array.isArray(value)) {
      // Leaf node - list of blocks
      const group = document.createElement('div');
      group.className = 'hierarchy-group';
      group.dataset.path = currentPath;
      
      const header = document.createElement('div');
      header.className = 'hierarchy-header hierarchy-leaf';
      header.dataset.path = currentPath;
      header.textContent = formatLabel(key);
      group.appendChild(header);
      
      const blocksDiv = document.createElement('div');
      blocksDiv.className = 'hierarchy-blocks';
      
      value.forEach(block => {
        const isActive = block === state.currentBlock;
        const btn = document.createElement('button');
        btn.className = 'hierarchy-block' + (isActive ? ' active' : '');
        btn.dataset.block = block;
        btn.textContent = block;
        blocksDiv.appendChild(btn);
      });
      
      group.appendChild(blocksDiv);
      parent.appendChild(group);
    } else {
      // Branch node
      const branch = document.createElement('div');
      branch.className = 'hierarchy-branch' + (isExpanded ? ' expanded' : '');
      branch.dataset.path = currentPath;
      
      const header = document.createElement('div');
      header.className = 'hierarchy-header';
      header.dataset.path = currentPath;
      
      const arrow = document.createElement('span');
      arrow.className = 'hierarchy-arrow';
      arrow.textContent = isExpanded ? '▼' : '▶';
      header.appendChild(arrow);
      
      const label = document.createElement('span');
      label.className = 'hierarchy-label';
      label.textContent = formatLabel(key);
      header.appendChild(label);
      
      branch.appendChild(header);
      
      const children = document.createElement('div');
      children.className = 'hierarchy-children';
      if (!isExpanded) children.style.display = 'none';
      buildHierarchyDOM(children, value, currentPath);
      
      branch.appendChild(children);
      parent.appendChild(branch);
    }
  }
}

function formatLabel(key) {
  return key.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
}

function isPathExpanded(path) {
  // Expand path to current block
  const blockPath = findBlockPath(state.currentBlock);
  return blockPath && blockPath.startsWith(path);
}

function findBlockPath(blockName) {
  function search(obj, path) {
    for (const key in obj) {
      const value = obj[key];
      const currentPath = path ? `${path}.${key}` : key;
      
      if (Array.isArray(value)) {
        if (value.includes(blockName)) {
          return currentPath;
        }
      } else {
        const result = search(value, currentPath);
        if (result) return result;
      }
    }
    return null;
  }
  return search(pageHierarchy, '');
}

function renderBreadcrumb() {
  const container = document.getElementById('keyboard-breadcrumb');
  if (!container) return;
  
  container.innerHTML = '';
  
  const path = findBlockPath(state.currentBlock);
  if (!path) {
    const span = document.createElement('span');
    span.className = 'breadcrumb-item active';
    span.textContent = state.currentBlock;
    container.appendChild(span);
    return;
  }
  
  const parts = path.split('.');
  let currentPath = '';
  
  parts.forEach((part, idx) => {
    currentPath = currentPath ? `${currentPath}.${part}` : part;
    
    if (idx > 0) {
      const sep = document.createElement('span');
      sep.className = 'breadcrumb-sep';
      sep.textContent = ' › ';
      container.appendChild(sep);
    }
    
    const span = document.createElement('span');
    span.className = 'breadcrumb-item';
    span.dataset.path = currentPath;
    span.textContent = formatLabel(part);
    container.appendChild(span);
  });
  
  const sep = document.createElement('span');
  sep.className = 'breadcrumb-sep';
  sep.textContent = ' › ';
  container.appendChild(sep);
  
  const activeSpan = document.createElement('span');
  activeSpan.className = 'breadcrumb-item active';
  activeSpan.textContent = state.currentBlock;
  container.appendChild(activeSpan);
}

function renderRecentBlocks() {
  const container = document.getElementById('keyboard-recent');
  if (!container) return;
  
  container.innerHTML = '';
  
  if (state.recentBlocks.length === 0) {
    return;
  }
  
  const label = document.createElement('span');
  label.className = 'recent-label';
  label.textContent = 'Recent:';
  container.appendChild(label);
  
  state.recentBlocks.forEach(block => {
    const isActive = block === state.currentBlock;
    const btn = document.createElement('button');
    btn.className = 'recent-block' + (isActive ? ' active' : '');
    btn.dataset.block = block;
    btn.textContent = block;
    container.appendChild(btn);
  });
}

function renderCharacterGrid() {
  const container = document.getElementById('keyboard-grid');
  if (!container) return;
  
  const block = unicodeBlocks[state.currentBlock];
  if (!block) {
    container.innerHTML = '<div class="keyboard-empty">Block not found</div>';
    return;
  }
  
  const maxChars = 2000;
  let chars = getBlockCharacters(state.currentBlock, maxChars + 1);
  const totalChars = chars.length;
  const truncated = totalChars > maxChars;
  
  if (truncated) {
    chars = chars.slice(0, maxChars);
  }
  
  // Separate characters by type
  const letters = [];
  const digits = [];
  const symbols = [];
  
  chars.forEach(item => {
    if (isLetter(item.char)) {
      // Show only lowercase letters by default (will show uppercase version based on shift state)
      const lowerChar = item.char.toLowerCase();
      const upperChar = item.char.toUpperCase();
      // Add only if we haven't added this letter pair yet
      if (!letters.find(l => l.char.toLowerCase() === lowerChar)) {
        letters.push({ ...item, char: lowerChar, upperChar: upperChar });
      }
    } else if (isDigit(item.char)) {
      digits.push(item);
    } else if (isSymbol(item.char)) {
      symbols.push(item);
    }
  });
  
  // Apply layout ordering for letters (only for Basic Latin)
  if (state.currentBlock === 'Basic Latin' && state.currentLayout !== 'unicode') {
    const layout = keyboardLayouts[state.currentLayout];
    if (layout) {
      letters.sort((a, b) => {
        const aIdx = layout.indexOf(a.char.toLowerCase());
        const bIdx = layout.indexOf(b.char.toLowerCase());
        if (aIdx === -1 && bIdx === -1) return a.code - b.code;
        if (aIdx === -1) return 1;
        if (bIdx === -1) return -1;
        return aIdx - bIdx;
      });
    }
  }
  
  // Sort symbols by frequency
  symbols.sort((a, b) => getSymbolOrder(a.char) - getSymbolOrder(b.char));
  
  // Build grid using DOM for security
  container.innerHTML = '';
  
  // Helper to create a character key
  const createKey = (item, displayChar) => {
    const translit = getTransliteration(state.currentBlock, item.code);
    const baseChar = item.char;
    const hasVariants = accentedVariants[baseChar] && accentedVariants[baseChar].length > 0;
    const hexCode = item.code.toString(16).toUpperCase().padStart(4, '0');
    
    const btn = document.createElement('button');
    btn.className = 'keyboard-key' + (hasVariants ? ' has-variants' : '');
    btn.dataset.char = displayChar;
    btn.dataset.baseChar = baseChar;
    btn.dataset.code = item.code;
    btn.dataset.isLetter = isLetter(displayChar) ? 'true' : 'false';
    btn.title = `U+${hexCode}${translit ? ' (' + translit + ')' : ''}`;
    
    const charSpan = document.createElement('span');
    charSpan.className = 'key-char';
    charSpan.textContent = displayChar;
    btn.appendChild(charSpan);
    
    if (translit) {
      const translitSpan = document.createElement('span');
      translitSpan.className = 'key-translit';
      translitSpan.textContent = translit;
      btn.appendChild(translitSpan);
    }
    
    if (hasVariants) {
      const indicator = document.createElement('span');
      indicator.className = 'key-indicator';
      indicator.textContent = '•';
      btn.appendChild(indicator);
    }
    
    return btn;
  };
  
  // Add letters first
  if (letters.length > 0) {
    const isUppercase = state.shiftState !== 'lowercase';
    letters.forEach(item => {
      const displayChar = isUppercase ? item.upperChar : item.char;
      container.appendChild(createKey(item, displayChar));
    });
  }
  
  // Add separator and digits
  if (digits.length > 0 && letters.length > 0) {
    const sep = document.createElement('div');
    sep.className = 'keyboard-separator';
    container.appendChild(sep);
  }
  
  if (digits.length > 0) {
    digits.forEach(item => {
      container.appendChild(createKey(item, item.char));
    });
  }
  
  // Add separator and symbols
  if (symbols.length > 0 && (letters.length > 0 || digits.length > 0)) {
    const sep = document.createElement('div');
    sep.className = 'keyboard-separator';
    container.appendChild(sep);
  }
  
  if (symbols.length > 0) {
    symbols.forEach(item => {
      container.appendChild(createKey(item, item.char));
    });
  }
  
  // Add space key for language pages
  if (letters.length > 0) {
    const sep = document.createElement('div');
    sep.className = 'keyboard-separator';
    container.appendChild(sep);
    
    const spaceBtn = document.createElement('button');
    spaceBtn.className = 'keyboard-key keyboard-space-key';
    spaceBtn.dataset.char = ' ';
    spaceBtn.dataset.isLetter = 'false';
    spaceBtn.title = 'Space';
    
    const spaceLabel = document.createElement('span');
    spaceLabel.className = 'key-char';
    spaceLabel.textContent = '␣';
    spaceBtn.appendChild(spaceLabel);
    
    container.appendChild(spaceBtn);
  }
  
  if (truncated) {
    const truncMsg = document.createElement('div');
    truncMsg.className = 'keyboard-truncated';
    truncMsg.textContent = `Showing first ${maxChars} of ${block.end - block.start + 1}+ characters`;
    container.appendChild(truncMsg);
  }
}

function updateShiftUI() {
  const icon = document.getElementById('shift-icon');
  const label = document.getElementById('shift-label');
  const btn = document.getElementById('shift-button');
  
  if (icon) icon.textContent = SHIFT_ICONS[state.shiftState];
  if (label) {
    const labels = { lowercase: 'minúscula', uppercase: 'maiúscula', capslock: 'PRESA' };
    label.textContent = labels[state.shiftState];
  }
  if (btn) {
    btn.classList.remove('shift-lowercase', 'shift-uppercase', 'shift-capslock');
    btn.classList.add('shift-' + state.shiftState);
  }
}

function cycleShiftState() {
  if (state.shiftState === 'lowercase') {
    state.shiftState = 'uppercase';
  } else if (state.shiftState === 'uppercase') {
    state.shiftState = 'capslock';
  } else {
    state.shiftState = 'lowercase';
  }
  updateShiftUI();
  renderCharacterGrid();
}

function applyLayout(chars, layoutName) {
  const layout = keyboardLayouts[layoutName];
  if (!layout) return chars;
  
  // Separate letters and non-letters
  const letters = [];
  const upperLetters = [];
  const nonLetters = [];
  
  chars.forEach(item => {
    const lower = item.char.toLowerCase();
    if (layout.includes(lower)) {
      if (item.char === item.char.toUpperCase() && item.char !== item.char.toLowerCase()) {
        upperLetters.push(item);
      } else {
        letters.push(item);
      }
    } else {
      nonLetters.push(item);
    }
  });
  
  // Sort letters by layout order
  const sortByLayout = (a, b) => {
    const aIdx = layout.indexOf(a.char.toLowerCase());
    const bIdx = layout.indexOf(b.char.toLowerCase());
    return aIdx - bIdx;
  };
  
  letters.sort(sortByLayout);
  upperLetters.sort(sortByLayout);
  
  // Combine: non-letters first (digits, punctuation), then letters
  return [...nonLetters, ...letters, ...upperLetters];
}

function attachEventListeners() {
  const container = document.getElementById('keyboard-container');
  if (!container) return;
  
  // Hierarchy navigation
  container.addEventListener('click', (e) => {
    const header = e.target.closest('.hierarchy-header');
    if (header && !header.classList.contains('hierarchy-leaf')) {
      const branch = header.closest('.hierarchy-branch');
      if (branch) {
        branch.classList.toggle('expanded');
        const children = branch.querySelector('.hierarchy-children');
        if (children) {
          children.style.display = branch.classList.contains('expanded') ? '' : 'none';
        }
        const arrow = header.querySelector('.hierarchy-arrow');
        if (arrow) {
          arrow.textContent = branch.classList.contains('expanded') ? '▼' : '▶';
        }
      }
      return;
    }
    
    const blockBtn = e.target.closest('.hierarchy-block, .recent-block');
    if (blockBtn) {
      selectBlock(blockBtn.dataset.block);
      return;
    }
    
    const shiftBtn = e.target.closest('#shift-button');
    if (shiftBtn) {
      cycleShiftState();
      return;
    }
    
    const keyBtn = e.target.closest('.keyboard-key');
    if (keyBtn) {
      const char = keyBtn.dataset.char;
      const isLetterKey = keyBtn.dataset.isLetter === 'true';
      addToOutput(char, isLetterKey);
      return;
    }
    
    const variantBtn = e.target.closest('.variant-key');
    if (variantBtn) {
      const char = variantBtn.dataset.char;
      addToOutput(char, isLetter(char));
      hideVariantsPopup();
      return;
    }
  });
  
  // Long press for variants
  container.addEventListener('mousedown', (e) => {
    const keyBtn = e.target.closest('.keyboard-key');
    if (keyBtn && keyBtn.classList.contains('has-variants')) {
      state.longPressTimer = setTimeout(() => {
        showVariantsPopup(keyBtn);
      }, state.longPressDelay);
    }
  });
  
  container.addEventListener('mouseup', () => {
    if (state.longPressTimer) {
      clearTimeout(state.longPressTimer);
      state.longPressTimer = null;
    }
  });
  
  container.addEventListener('mouseleave', () => {
    if (state.longPressTimer) {
      clearTimeout(state.longPressTimer);
      state.longPressTimer = null;
    }
  });
  
  // Touch support for long press
  container.addEventListener('touchstart', (e) => {
    const keyBtn = e.target.closest('.keyboard-key');
    if (keyBtn && keyBtn.classList.contains('has-variants')) {
      state.longPressTimer = setTimeout(() => {
        e.preventDefault();
        showVariantsPopup(keyBtn);
      }, state.longPressDelay);
    }
  });
  
  container.addEventListener('touchend', () => {
    if (state.longPressTimer) {
      clearTimeout(state.longPressTimer);
      state.longPressTimer = null;
    }
  });
  
  // Layout selector
  const layoutSelect = document.getElementById('layout-select');
  if (layoutSelect) {
    layoutSelect.addEventListener('change', (e) => {
      state.currentLayout = e.target.value;
      renderCharacterGrid();
    });
  }
  
  // Output actions
  document.getElementById('btn-copy-output')?.addEventListener('click', copyOutput);
  document.getElementById('btn-clear-output')?.addEventListener('click', clearOutput);
  
  // Close variants popup on outside click
  document.addEventListener('click', (e) => {
    const popup = document.getElementById('variants-popup');
    if (popup && popup.style.display !== 'none') {
      if (!popup.contains(e.target) && !e.target.closest('.keyboard-key')) {
        hideVariantsPopup();
      }
    }
  });
}

function selectBlock(blockName) {
  if (!unicodeBlocks[blockName]) return;
  
  state.currentBlock = blockName;
  
  // Update recent blocks
  const idx = state.recentBlocks.indexOf(blockName);
  if (idx > -1) {
    state.recentBlocks.splice(idx, 1);
  }
  state.recentBlocks.unshift(blockName);
  if (state.recentBlocks.length > state.maxRecent) {
    state.recentBlocks.pop();
  }
  
  renderHierarchy();
  renderBreadcrumb();
  renderRecentBlocks();
  renderCharacterGrid();
}

function addToOutput(char, isLetterChar = false) {
  state.output += char;
  const outputEl = document.getElementById('keyboard-output');
  if (outputEl) {
    outputEl.value = state.output;
  }
  
  // Handle shift state transition: uppercase (temporary) returns to lowercase after letter
  if (isLetterChar && state.shiftState === 'uppercase') {
    state.shiftState = 'lowercase';
    updateShiftUI();
    renderCharacterGrid();
  }
}

function copyOutput() {
  navigator.clipboard.writeText(state.output).then(() => {
    const btn = document.getElementById('btn-copy-output');
    if (btn) {
      const original = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = original; }, 1500);
    }
  });
}

function clearOutput() {
  state.output = '';
  const outputEl = document.getElementById('keyboard-output');
  if (outputEl) {
    outputEl.value = '';
  }
}

function showVariantsPopup(keyBtn) {
  const char = keyBtn.dataset.char;
  const variants = accentedVariants[char];
  if (!variants || variants.length === 0) return;
  
  const popup = document.getElementById('variants-popup');
  if (!popup) return;
  
  popup.innerHTML = '';
  
  const title = document.createElement('div');
  title.className = 'variants-title';
  title.textContent = `Variants of "${char}"`;
  popup.appendChild(title);
  
  const grid = document.createElement('div');
  grid.className = 'variants-grid';
  
  variants.forEach(v => {
    const code = v.codePointAt(0);
    const hexCode = code.toString(16).toUpperCase().padStart(4, '0');
    
    const btn = document.createElement('button');
    btn.className = 'variant-key';
    btn.dataset.char = v;
    btn.title = `U+${hexCode}`;
    
    const charSpan = document.createElement('span');
    charSpan.className = 'key-char';
    charSpan.textContent = v;
    btn.appendChild(charSpan);
    
    grid.appendChild(btn);
  });
  
  popup.appendChild(grid);
  
  // Position popup near the key
  const rect = keyBtn.getBoundingClientRect();
  const containerRect = document.getElementById('keyboard-container').getBoundingClientRect();
  
  popup.style.display = 'block';
  popup.style.left = `${rect.left - containerRect.left}px`;
  popup.style.top = `${rect.bottom - containerRect.top + 5}px`;
  
  // Ensure popup stays within bounds
  const popupRect = popup.getBoundingClientRect();
  if (popupRect.right > containerRect.right) {
    popup.style.left = `${containerRect.right - popupRect.width - containerRect.left}px`;
  }
}

function hideVariantsPopup() {
  const popup = document.getElementById('variants-popup');
  if (popup) {
    popup.style.display = 'none';
  }
}
