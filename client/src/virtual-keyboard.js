// Virtual Keyboard JavaScript
import { unicodeBlocks, pageHierarchy, transliterations, accentedVariants, keyboardLayouts, keyboardRows, getBlockCharacters, getTransliteration } from './unicode-data.js';

const state = {
  currentBlock: 'Basic Latin',
  currentLayout: 'qwerty',
  recentBlocks: [],
  maxRecent: 6,
  output: '',
  longPressTimer: null,
  longPressDelay: 500,
  shiftState: 'lowercase', // 'lowercase', 'uppercase', 'capslock'
  hierarchyCollapsed: false, // true when block is selected, shows compact nav
  compositionInput: '' // For CJK romanization input
};

// Blocks that support composition (romanization to character)
const COMPOSITION_BLOCKS = [
  'Hiragana', 'Katakana', 'Katakana Phonetic Extensions',
  'Hangul Compatibility Jamo'
];

// Shift state icons
const SHIFT_ICONS = {
  lowercase: '⇧',
  uppercase: '⬆',
  capslock: '⇪'
};

// Skin tone modifiers for emoji
const SKIN_TONES = [
  { code: 0x1F3FB, name: 'light', char: '\u{1F3FB}' },
  { code: 0x1F3FC, name: 'medium-light', char: '\u{1F3FC}' },
  { code: 0x1F3FD, name: 'medium', char: '\u{1F3FD}' },
  { code: 0x1F3FE, name: 'medium-dark', char: '\u{1F3FE}' },
  { code: 0x1F3FF, name: 'dark', char: '\u{1F3FF}' }
];

// Emoji codepoint ranges that support skin tone modifiers
// Includes hand gestures, people, and body parts
const SKIN_TONE_EMOJI_RANGES = [
  // Hand gestures
  [0x1F44A, 0x1F44D], // 👊-👍 fist bump to thumbs up
  [0x1F44E, 0x1F44F], // 👎-👏 thumbs down, clapping
  [0x1F450, 0x1F450], // 👐 open hands
  [0x1F4AA, 0x1F4AA], // 💪 flexed biceps
  [0x1F590, 0x1F590], // 🖐 raised hand with fingers splayed
  [0x1F595, 0x1F596], // 🖕-🖖 middle finger, vulcan salute
  [0x1F918, 0x1F91F], // 🤘-🤟 various hand signs
  [0x1F926, 0x1F926], // 🤦 facepalm
  [0x1F930, 0x1F939], // 🤰-🤹 pregnant to juggling
  [0x1F9B5, 0x1F9B6], // 🦵-🦶 leg, foot
  [0x1F9BB, 0x1F9BB], // 🦻 ear with hearing aid
  [0x1F9D1, 0x1F9DD], // 🧑-🧝 person to elf
  // Pointing fingers
  [0x261D, 0x261D],   // ☝ index pointing up
  [0x270A, 0x270D],   // ✊-✍ fist to writing hand
  // People
  [0x1F466, 0x1F469], // 👦-👩 boy to woman
  [0x1F46E, 0x1F46E], // 👮 police officer
  [0x1F470, 0x1F478], // 👰-👸 bride to princess
  [0x1F47C, 0x1F47C], // 👼 baby angel
  [0x1F481, 0x1F487], // 💁-💇 person tipping hand to person getting haircut
  [0x1F574, 0x1F575], // 🕴-🕵 man in suit, detective
  [0x1F57A, 0x1F57A], // 🕺 man dancing
  [0x1F645, 0x1F647], // 🙅-🙇 gestures
  [0x1F64B, 0x1F64F], // 🙋-🙏 raising hand to person with folded hands
];

// Check if an emoji supports skin tone modifiers
function supportsSkinTone(codePoint) {
  return SKIN_TONE_EMOJI_RANGES.some(([start, end]) => 
    codePoint >= start && codePoint <= end
  );
}

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
      
      <div class="keyboard-composition" id="keyboard-composition" style="display: none;">
        <label>Type romanization:</label>
        <input type="text" id="composition-input" class="keyboard-input" placeholder="e.g., ka, shi, tsu..." autocomplete="off">
        <div class="composition-matches" id="composition-matches"></div>
      </div>
      
      <div class="keyboard-grid-container">
        <div class="keyboard-grid" id="keyboard-grid"></div>
      </div>
      
      <div class="keyboard-variants-popup" id="variants-popup" style="display: none;"></div>
    </div>
  `;
  
  renderHierarchy();
  renderBreadcrumb();
  renderCompositionArea();
  renderRecentBlocks();
  renderCharacterGrid();
}

function renderHierarchy() {
  const container = document.getElementById('keyboard-hierarchy');
  if (!container) return;
  
  container.innerHTML = '';
  
  if (state.hierarchyCollapsed) {
    // Compact mode: show current block and recent blocks in a horizontal line
    const compactNav = document.createElement('div');
    compactNav.className = 'hierarchy-compact';
    
    // Button to expand hierarchy
    const expandBtn = document.createElement('button');
    expandBtn.className = 'btn btn-sm btn-outline hierarchy-expand-btn';
    expandBtn.id = 'hierarchy-expand-btn';
    expandBtn.title = 'Show all languages';
    expandBtn.textContent = '☰ Browse';
    compactNav.appendChild(expandBtn);
    
    // Current block label
    const currentLabel = document.createElement('span');
    currentLabel.className = 'hierarchy-current';
    currentLabel.textContent = state.currentBlock;
    compactNav.appendChild(currentLabel);
    
    // Recent blocks (excluding current)
    const recentFiltered = state.recentBlocks.filter(b => b !== state.currentBlock);
    if (recentFiltered.length > 0) {
      const recentContainer = document.createElement('div');
      recentContainer.className = 'hierarchy-recent-compact';
      
      recentFiltered.forEach(block => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-sm btn-ghost hierarchy-recent-btn';
        btn.dataset.block = block;
        btn.textContent = block;
        recentContainer.appendChild(btn);
      });
      
      compactNav.appendChild(recentContainer);
    }
    
    container.appendChild(compactNav);
  } else {
    // Full hierarchy tree
    const tree = document.createElement('div');
    tree.className = 'hierarchy-tree';
    buildHierarchyDOM(tree, pageHierarchy, '');
    container.appendChild(tree);
  }
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

function renderCompositionArea() {
  const container = document.getElementById('keyboard-composition');
  const input = document.getElementById('composition-input');
  if (!container) return;
  
  // Show composition area only for blocks that support it
  if (COMPOSITION_BLOCKS.includes(state.currentBlock)) {
    container.style.display = 'flex';
    if (input) {
      input.value = state.compositionInput;
    }
    updateCompositionMatches();
  } else {
    container.style.display = 'none';
  }
}

function updateCompositionMatches() {
  const container = document.getElementById('composition-matches');
  const input = state.compositionInput.toLowerCase().trim();
  if (!container) return;
  
  container.innerHTML = '';
  
  if (!input) return;
  
  // Get transliterations for current block
  const blockTranslit = transliterations[state.currentBlock];
  if (!blockTranslit) return;
  
  // Find all matching characters
  const matches = [];
  for (const [codePoint, translit] of Object.entries(blockTranslit)) {
    if (translit.toLowerCase().startsWith(input)) {
      const code = parseInt(codePoint);
      const char = String.fromCodePoint(code);
      matches.push({ code, char, translit });
    }
  }
  
  // Sort by transliteration length (shorter first = exact match first)
  matches.sort((a, b) => a.translit.length - b.translit.length);
  
  // Show up to 10 matches
  matches.slice(0, 10).forEach(({ code, char, translit }) => {
    const hexCode = code.toString(16).toUpperCase().padStart(4, '0');
    const btn = document.createElement('button');
    btn.className = 'composition-match';
    btn.dataset.char = char;
    btn.title = `U+${hexCode}`;
    
    const charSpan = document.createElement('span');
    charSpan.className = 'match-char';
    charSpan.textContent = char;
    btn.appendChild(charSpan);
    
    const translitSpan = document.createElement('span');
    translitSpan.className = 'match-translit';
    translitSpan.textContent = translit;
    btn.appendChild(translitSpan);
    
    container.appendChild(btn);
  });
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
    const hasSkinTones = supportsSkinTone(item.code);
    const hexCode = item.code.toString(16).toUpperCase().padStart(4, '0');
    
    const btn = document.createElement('button');
    btn.className = 'keyboard-key';
    if (hasVariants) btn.classList.add('has-variants');
    if (hasSkinTones) btn.classList.add('has-skin-tones');
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
    
    if (hasVariants || hasSkinTones) {
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
    const rows = keyboardRows[state.currentLayout];
    
    // Use row-based layout for Basic Latin with row-supporting layouts
    if (state.currentBlock === 'Basic Latin' && rows) {
      // Create a map from letter to item for quick lookup
      const letterMap = {};
      letters.forEach(item => {
        letterMap[item.char.toLowerCase()] = item;
      });
      
      // Render each row
      rows.forEach((rowLetters, rowIndex) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'keyboard-row';
        
        rowLetters.forEach(letter => {
          const item = letterMap[letter];
          if (item) {
            const displayChar = isUppercase ? item.upperChar : item.char;
            rowDiv.appendChild(createKey(item, displayChar));
          }
        });
        
        container.appendChild(rowDiv);
      });
    } else {
      // Default: render all letters in a single flow
      letters.forEach(item => {
        const displayChar = isUppercase ? item.upperChar : item.char;
        container.appendChild(createKey(item, displayChar));
      });
    }
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
    
    // Expand hierarchy button in compact mode
    const expandBtn = e.target.closest('#hierarchy-expand-btn');
    if (expandBtn) {
      state.hierarchyCollapsed = false;
      renderHierarchy();
      return;
    }
    
    // Block selection from hierarchy, recent, or compact recent
    const blockBtn = e.target.closest('.hierarchy-block, .recent-block, .hierarchy-recent-btn');
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
  
  // Long press for variants and skin tones
  container.addEventListener('mousedown', (e) => {
    const keyBtn = e.target.closest('.keyboard-key');
    if (keyBtn) {
      const hasVariants = keyBtn.classList.contains('has-variants');
      const hasSkinTones = keyBtn.classList.contains('has-skin-tones');
      if (hasVariants || hasSkinTones) {
        state.longPressTimer = setTimeout(() => {
          if (hasSkinTones) {
            showSkinTonePopup(keyBtn);
          } else {
            showVariantsPopup(keyBtn);
          }
        }, state.longPressDelay);
      }
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
  
  // Touch support for long press (variants and skin tones)
  container.addEventListener('touchstart', (e) => {
    const keyBtn = e.target.closest('.keyboard-key');
    if (keyBtn) {
      const hasVariants = keyBtn.classList.contains('has-variants');
      const hasSkinTones = keyBtn.classList.contains('has-skin-tones');
      if (hasVariants || hasSkinTones) {
        state.longPressTimer = setTimeout(() => {
          e.preventDefault();
          if (hasSkinTones) {
            showSkinTonePopup(keyBtn);
          } else {
            showVariantsPopup(keyBtn);
          }
        }, state.longPressDelay);
      }
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
  
  // Composition input
  const compositionInput = document.getElementById('composition-input');
  if (compositionInput) {
    compositionInput.addEventListener('input', (e) => {
      state.compositionInput = e.target.value;
      updateCompositionMatches();
    });
    compositionInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        // Select first match on Enter
        const firstMatch = document.querySelector('.composition-match');
        if (firstMatch) {
          addToOutput(firstMatch.dataset.char, false);
          state.compositionInput = '';
          compositionInput.value = '';
          updateCompositionMatches();
        }
      }
    });
  }
  
  // Composition match click
  container.addEventListener('click', (e) => {
    const matchBtn = e.target.closest('.composition-match');
    if (matchBtn) {
      addToOutput(matchBtn.dataset.char, false);
      state.compositionInput = '';
      const input = document.getElementById('composition-input');
      if (input) input.value = '';
      updateCompositionMatches();
      return;
    }
  });
  
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
  state.hierarchyCollapsed = true; // Collapse hierarchy after selection
  
  // Update recent blocks
  const idx = state.recentBlocks.indexOf(blockName);
  if (idx > -1) {
    state.recentBlocks.splice(idx, 1);
  }
  state.recentBlocks.unshift(blockName);
  if (state.recentBlocks.length > state.maxRecent) {
    state.recentBlocks.pop();
  }
  
  state.compositionInput = ''; // Reset composition input when switching blocks
  
  renderHierarchy();
  renderBreadcrumb();
  renderCompositionArea();
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

function showSkinTonePopup(keyBtn) {
  const char = keyBtn.dataset.char;
  const code = parseInt(keyBtn.dataset.code);
  
  if (!supportsSkinTone(code)) return;
  
  const popup = document.getElementById('variants-popup');
  if (!popup) return;
  
  popup.innerHTML = '';
  
  const title = document.createElement('div');
  title.className = 'variants-title';
  title.textContent = `Skin tones for ${char}`;
  popup.appendChild(title);
  
  const grid = document.createElement('div');
  grid.className = 'variants-grid';
  
  // Add default (no skin tone)
  const defaultBtn = document.createElement('button');
  defaultBtn.className = 'variant-key';
  defaultBtn.dataset.char = char;
  defaultBtn.title = 'Default';
  const defaultSpan = document.createElement('span');
  defaultSpan.className = 'key-char';
  defaultSpan.textContent = char;
  defaultBtn.appendChild(defaultSpan);
  grid.appendChild(defaultBtn);
  
  // Add each skin tone variant
  SKIN_TONES.forEach(tone => {
    const combined = char + tone.char;
    const btn = document.createElement('button');
    btn.className = 'variant-key';
    btn.dataset.char = combined;
    btn.title = tone.name;
    
    const charSpan = document.createElement('span');
    charSpan.className = 'key-char';
    charSpan.textContent = combined;
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
