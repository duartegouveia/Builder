// Virtual Keyboard JavaScript
import { unicodeBlocks, pageHierarchy, transliterations, accentedVariants, keyboardLayouts, getBlockCharacters, getTransliteration } from './unicode-data.js';

const state = {
  currentBlock: 'Basic Latin',
  currentLayout: 'qwerty',
  recentBlocks: [],
  maxRecent: 6,
  output: '',
  longPressTimer: null,
  longPressDelay: 500
};

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
  
  let html = '<div class="hierarchy-tree">';
  html += buildHierarchyHTML(pageHierarchy, '', 0);
  html += '</div>';
  
  container.innerHTML = html;
}

function buildHierarchyHTML(obj, path, depth) {
  let html = '';
  
  for (const key in obj) {
    const value = obj[key];
    const currentPath = path ? `${path}.${key}` : key;
    const isExpanded = isPathExpanded(currentPath);
    
    if (Array.isArray(value)) {
      // Leaf node - list of blocks
      html += `<div class="hierarchy-group" data-path="${currentPath}">`;
      html += `<div class="hierarchy-header hierarchy-leaf" data-path="${currentPath}">${formatLabel(key)}</div>`;
      html += `<div class="hierarchy-blocks">`;
      value.forEach(block => {
        const isActive = block === state.currentBlock;
        html += `<button class="hierarchy-block${isActive ? ' active' : ''}" data-block="${block}">${block}</button>`;
      });
      html += `</div></div>`;
    } else {
      // Branch node
      html += `<div class="hierarchy-branch${isExpanded ? ' expanded' : ''}" data-path="${currentPath}">`;
      html += `<div class="hierarchy-header" data-path="${currentPath}">`;
      html += `<span class="hierarchy-arrow">${isExpanded ? '▼' : '▶'}</span>`;
      html += `<span class="hierarchy-label">${formatLabel(key)}</span>`;
      html += `</div>`;
      html += `<div class="hierarchy-children"${isExpanded ? '' : ' style="display:none"'}>`;
      html += buildHierarchyHTML(value, currentPath, depth + 1);
      html += `</div></div>`;
    }
  }
  
  return html;
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
  
  const path = findBlockPath(state.currentBlock);
  if (!path) {
    container.innerHTML = `<span class="breadcrumb-item active">${state.currentBlock}</span>`;
    return;
  }
  
  const parts = path.split('.');
  let html = '';
  let currentPath = '';
  
  parts.forEach((part, idx) => {
    currentPath = currentPath ? `${currentPath}.${part}` : part;
    if (idx > 0) html += ' <span class="breadcrumb-sep">›</span> ';
    html += `<span class="breadcrumb-item" data-path="${currentPath}">${formatLabel(part)}</span>`;
  });
  
  html += ' <span class="breadcrumb-sep">›</span> ';
  html += `<span class="breadcrumb-item active">${state.currentBlock}</span>`;
  
  container.innerHTML = html;
}

function renderRecentBlocks() {
  const container = document.getElementById('keyboard-recent');
  if (!container) return;
  
  if (state.recentBlocks.length === 0) {
    container.innerHTML = '';
    return;
  }
  
  let html = '<span class="recent-label">Recent:</span>';
  state.recentBlocks.forEach(block => {
    const isActive = block === state.currentBlock;
    html += `<button class="recent-block${isActive ? ' active' : ''}" data-block="${block}">${block}</button>`;
  });
  
  container.innerHTML = html;
}

function renderCharacterGrid() {
  const container = document.getElementById('keyboard-grid');
  if (!container) return;
  
  const block = unicodeBlocks[state.currentBlock];
  if (!block) {
    container.innerHTML = '<div class="keyboard-empty">Block not found</div>';
    return;
  }
  
  let chars = getBlockCharacters(state.currentBlock);
  
  // Apply layout ordering for Basic Latin
  if (state.currentBlock === 'Basic Latin' && state.currentLayout !== 'unicode') {
    chars = applyLayout(chars, state.currentLayout);
  }
  
  // Limit display for very large blocks (like CJK)
  const maxChars = 2000;
  const truncated = chars.length > maxChars;
  if (truncated) {
    chars = chars.slice(0, maxChars);
  }
  
  let html = '';
  
  chars.forEach(({ code, char }) => {
    const translit = getTransliteration(state.currentBlock, code);
    const hasVariants = accentedVariants[char] && accentedVariants[char].length > 0;
    const hexCode = code.toString(16).toUpperCase().padStart(4, '0');
    
    html += `<button class="keyboard-key${hasVariants ? ' has-variants' : ''}" 
      data-char="${escapeAttr(char)}" 
      data-code="${code}"
      title="U+${hexCode}${translit ? ' (' + translit + ')' : ''}">`;
    html += `<span class="key-char">${escapeHtml(char)}</span>`;
    if (translit) {
      html += `<span class="key-translit">${escapeHtml(translit)}</span>`;
    }
    if (hasVariants) {
      html += `<span class="key-indicator">•</span>`;
    }
    html += `</button>`;
  });
  
  if (truncated) {
    html += `<div class="keyboard-truncated">Showing first ${maxChars} of ${chars.length + (maxChars)} characters</div>`;
  }
  
  container.innerHTML = html;
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
    
    const keyBtn = e.target.closest('.keyboard-key');
    if (keyBtn) {
      const char = keyBtn.dataset.char;
      addToOutput(char);
      return;
    }
    
    const variantBtn = e.target.closest('.variant-key');
    if (variantBtn) {
      const char = variantBtn.dataset.char;
      addToOutput(char);
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

function addToOutput(char) {
  state.output += char;
  const outputEl = document.getElementById('keyboard-output');
  if (outputEl) {
    outputEl.value = state.output;
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
  
  let html = `<div class="variants-title">Variants of "${char}"</div><div class="variants-grid">`;
  variants.forEach(v => {
    const code = v.codePointAt(0);
    const hexCode = code.toString(16).toUpperCase().padStart(4, '0');
    html += `<button class="variant-key" data-char="${escapeAttr(v)}" title="U+${hexCode}">
      <span class="key-char">${escapeHtml(v)}</span>
    </button>`;
  });
  html += '</div>';
  
  popup.innerHTML = html;
  
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

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
