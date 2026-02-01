// Virtual Keyboard JavaScript
import { unicodeBlocks, pageHierarchy, transliterations, accentedVariants, keyboardLayouts, keyboardRows, getBlockCharacters, getTransliteration } from './unicode-data.js';
import { dictionaries } from './dictionaries.js';

const state = {
  currentBlock: 'Basic Latin',
  currentLayout: 'qwerty', // Default layout is QWERTY for Latin
  recentBlocks: ['Basic Latin'], // Pre-populate with Latin
  maxRecent: 6,
  output: '',
  longPressTimer: null,
  longPressDelay: 500,
  longPressTriggered: false, // Flag to prevent click after long-press
  shiftState: 'lowercase', // 'lowercase', 'uppercase', 'capslock'
  hierarchyCollapsed: true, // Start collapsed, show hierarchy when user clicks Browse
  compositionInput: '', // For CJK romanization input
  keyboardVisible: false, // Whether keyboard panel is visible (hidden by default)
  keyboardPosition: 'fullscreen', // 'bottom', 'top', 'left', 'right', 'fullscreen'
  floatingButtonPos: { x: null, y: null }, // Custom position for floating button
  activeExternalField: null, // Reference to external input/textarea being edited
  isMultilineField: false, // true for textarea, false for input[type=text]
  externalCursorPos: 0, // Cursor position from external field
  blockLayouts: { 'Basic Latin': 'qwerty' }, // Layout preferences per block
  hasPhysicalKeyboard: true, // Detected device type (desktop/laptop has keyboard)
  popupOriginalChar: null, // Original character that opened the variants popup
  dictionaryLanguage: 'none', // Autocomplete dictionary language
  physicalShiftPressed: false // Physical Shift key is being held down
};

// Unicode character names cache
const unicodeNames = {};

// Check if element is a valid text field for virtual keyboard
function isValidTextField(el) {
  if (!el) return false;
  if (el.tagName === 'TEXTAREA') return true;
  if (el.tagName === 'INPUT' && el.type === 'text') return true;
  return false;
}

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

// Detect if device has physical keyboard (desktop/laptop vs mobile/tablet)
function detectPhysicalKeyboard() {
  // Check for touch-only devices
  const isTouchOnly = navigator.maxTouchPoints > 0 && 
                      !window.matchMedia('(hover: hover)').matches;
  
  // Check screen width (mobile devices typically < 768px)
  const isSmallScreen = window.innerWidth < 768;
  
  // If it's a touch-only device OR a small screen, likely no physical keyboard
  // Otherwise, assume it's a desktop/laptop with keyboard
  return !isTouchOnly && !isSmallScreen;
}

function init() {
  state.hasPhysicalKeyboard = detectPhysicalKeyboard();
  renderKeyboard();
  attachEventListeners();
  setupExternalFieldTracking();
  setupControlKeyListener();
  setupPhysicalKeyboardListener();
  setupPhysicalShiftListener();
  updateFloatingButtonVisibility();
}

function renderKeyboard() {
  const container = document.getElementById('keyboard-container');
  if (!container) return;
  
  container.innerHTML = `
    <button id="keyboard-toggle-btn" class="keyboard-toggle-btn" style="display: none;" title="Toggle virtual keyboard"><span class="keyboard-toggle-icon">⌨</span><span class="keyboard-toggle-ctrl"></span></button>
    
    <div id="keyboard-panel" class="keyboard-panel keyboard-position-${state.keyboardPosition}${state.keyboardVisible ? '' : ' keyboard-panel-hidden'}">
      <div class="keyboard-panel-header">
        <span class="keyboard-panel-title">Virtual Keyboard</span>
        <div class="keyboard-position-controls">
          <button id="pos-top" class="btn btn-xs btn-outline" title="Top">↑</button>
          <button id="pos-bottom" class="btn btn-xs btn-outline" title="Bottom">↓</button>
          <button id="pos-left" class="btn btn-xs btn-outline" title="Left 1/3">←</button>
          <button id="pos-right" class="btn btn-xs btn-outline" title="Right 1/3">→</button>
          <button id="pos-fullscreen" class="btn btn-xs btn-outline" title="Fullscreen">⛶</button>
          <button id="keyboard-close-btn" class="btn btn-xs btn-outline" title="Close">✕</button>
        </div>
      </div>
      
      <div class="keyboard-wrapper">
        <div class="keyboard-output-section">
          <div class="keyboard-output-container">
            <div id="keyboard-output-wrapper"></div>
            <div class="keyboard-autocomplete" id="keyboard-autocomplete"></div>
          </div>
        </div>
        
        <div class="keyboard-controls-unified">
          <div class="keyboard-controls-left">
            <button id="btn-backspace" class="btn btn-sm btn-outline" title="Backspace">⌫</button>
            <button id="btn-delete" class="btn btn-sm btn-outline" title="Delete">Del</button>
            <button id="btn-enter" class="btn btn-sm btn-outline" title="New line">↵</button>
            <button id="btn-copy-output" class="btn btn-sm btn-outline" title="Copy to clipboard">Copy</button>
            <button id="btn-clear-output" class="btn btn-sm btn-outline" title="Clear output">Clear</button>
            <button id="btn-end" class="btn btn-sm btn-primary" title="Finish and send to input">End</button>
          </div>
          <div class="keyboard-controls-right">
            <button id="hierarchy-expand-btn" class="btn btn-sm btn-outline hierarchy-expand-btn" title="Browse all languages">☰</button>
            <div id="hierarchy-popup" class="hierarchy-popup" style="display: none;"></div>
            <div class="keyboard-shift-control">
              <button id="shift-button" class="btn btn-outline shift-btn" title="Shift: minúscula / maiúscula / maiúscula presa">
                <span id="shift-icon">⇧</span>
              </button>
              <span id="shift-label" class="shift-label">minúscula</span>
            </div>
            <div class="keyboard-layout-selector">
              <select id="layout-select" class="keyboard-select">
                <optgroup label="Clássicos">
                  <option value="qwerty">QWERTY</option>
                  <option value="azerty">AZERTY</option>
                  <option value="qwertz">QWERTZ</option>
                </optgroup>
                <optgroup label="Nacionais">
                  <option value="qwerty-pt">QWERTY PT</option>
                  <option value="abnt2">ABNT2</option>
                  <option value="bepo">BÉPO</option>
                </optgroup>
                <optgroup label="Ergonómicos">
                  <option value="dvorak">Dvorak</option>
                  <option value="colemak">Colemak</option>
                  <option value="workman">Workman</option>
                </optgroup>
                <optgroup label="Ordenação">
                  <option value="alphabetic" selected>Alfabética</option>
                  <option value="unicode">Unicode</option>
                </optgroup>
              </select>
              <select id="dictionary-language" class="keyboard-select" title="Autocomplete dictionary">
                <option value="none">-</option>
                <option value="pt">PT</option>
                <option value="en">EN</option>
                <option value="es">ES</option>
                <option value="fr">FR</option>
                <option value="de">DE</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="keyboard-blocks-bar" id="keyboard-hierarchy"></div>
        
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
    </div>
  `;
  
  renderOutputField();
  renderHierarchy();
  renderCompositionArea();
  updateLayoutOptions();
  renderCharacterGrid();
  updateEnterButtonVisibility();
  
  // Set initial active state for position button
  const activePos = state.keyboardPosition;
  ['top', 'bottom', 'left', 'right', 'fullscreen'].forEach(pos => {
    const btn = document.getElementById(`pos-${pos}`);
    if (btn) {
      btn.classList.toggle('btn-primary', pos === activePos);
      btn.classList.toggle('btn-outline', pos !== activePos);
    }
  });
}

function renderOutputField() {
  const wrapper = document.getElementById('keyboard-output-wrapper');
  if (!wrapper) return;
  
  const isMultiline = state.isMultilineField;
  const currentValue = state.output || '';
  
  if (isMultiline) {
    wrapper.innerHTML = `<textarea id="keyboard-output" class="keyboard-output" autocomplete="off" placeholder="Click characters to add them here..."></textarea>`;
  } else {
    wrapper.innerHTML = `<input type="text" id="keyboard-output" class="keyboard-output keyboard-output-single" autocomplete="off" placeholder="Click characters to add them here...">`;
  }
  
  const outputEl = document.getElementById('keyboard-output');
  if (outputEl) {
    outputEl.value = currentValue;
    // Focus and set cursor position after a short delay to ensure DOM is ready
    setTimeout(() => {
      outputEl.focus();
      outputEl.setSelectionRange(state.externalCursorPos, state.externalCursorPos);
    }, 10);
    outputEl.addEventListener('input', (e) => {
      state.output = e.target.value;
      // Update autocomplete suggestions when user types directly
      updateAutocomplete(e.target.value, e.target.selectionStart);
    });
  }
}

function renderHierarchy() {
  const container = document.getElementById('keyboard-hierarchy');
  const popup = document.getElementById('hierarchy-popup');
  if (!container) return;
  
  container.innerHTML = '';
  
  // Always show recent blocks in the compact section
  const compactNav = document.createElement('div');
  compactNav.className = 'hierarchy-compact';
  
  // Show all recent blocks, with CSS highlighting the current one
  state.recentBlocks.forEach(block => {
    const btn = document.createElement('button');
    const isActive = block === state.currentBlock;
    btn.className = 'btn btn-sm hierarchy-recent-btn' + (isActive ? ' active' : '');
    btn.dataset.block = block;
    btn.textContent = block;
    compactNav.appendChild(btn);
  });
  
  container.appendChild(compactNav);
  
  // Show/hide the floating hierarchy popup
  if (popup) {
    if (!state.hierarchyCollapsed) {
      // Render full hierarchy tree in popup
      popup.innerHTML = '';
      
      const header = document.createElement('div');
      header.className = 'hierarchy-popup-header';
      header.innerHTML = '<span>Browse Unicode Blocks</span><button id="hierarchy-close-btn" class="btn btn-xs btn-outline">✕</button>';
      popup.appendChild(header);
      
      const tree = document.createElement('div');
      tree.className = 'hierarchy-tree';
      buildHierarchyDOM(tree, pageHierarchy, '');
      popup.appendChild(tree);
      
      popup.style.display = 'block';
      positionHierarchyPopup(popup);
    } else {
      popup.style.display = 'none';
    }
  }
}

function positionHierarchyPopup(popup) {
  const expandBtn = document.getElementById('hierarchy-expand-btn');
  if (!expandBtn || !popup) return;
  
  const btnRect = expandBtn.getBoundingClientRect();
  const popupWidth = 320;
  const popupMaxHeight = window.innerHeight * 0.7; // 70% of viewport height
  
  // Try to position below the button first
  let top = btnRect.bottom + 5;
  let left = btnRect.left;
  
  // Ensure popup stays within viewport horizontally
  if (left + popupWidth > window.innerWidth - 10) {
    left = window.innerWidth - popupWidth - 10;
  }
  if (left < 10) left = 10;
  
  // Ensure popup stays within viewport vertically
  if (top + popupMaxHeight > window.innerHeight - 10) {
    // Position above the button instead
    top = btnRect.top - popupMaxHeight - 5;
    if (top < 10) top = 10;
  }
  
  popup.style.top = `${top}px`;
  popup.style.left = `${left}px`;
}

function buildHierarchyDOM(parent, obj, path) {
  for (const key in obj) {
    const value = obj[key];
    const currentPath = path ? `${path}.${key}` : key;
    const isExpanded = isPathExpanded(currentPath);
    
    if (Array.isArray(value)) {
      // Leaf node - list of blocks with expandable header
      const group = document.createElement('div');
      group.className = 'hierarchy-branch' + (isExpanded ? ' expanded' : '');
      group.dataset.path = currentPath;
      
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
      
      group.appendChild(header);
      
      const blocksDiv = document.createElement('div');
      blocksDiv.className = 'hierarchy-children hierarchy-blocks';
      if (!isExpanded) blocksDiv.style.display = 'none';
      
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
      // Check if this branch has only one child - if so, flatten it
      const childKeys = Object.keys(value);
      if (childKeys.length === 1 && !Array.isArray(value[childKeys[0]])) {
        // Flatten: skip this level and show child directly with combined label
        const childKey = childKeys[0];
        const childValue = value[childKey];
        const flattenedPath = `${currentPath}.${childKey}`;
        const combinedLabel = `${formatLabel(key)}`;
        
        // Recurse with child value but show under parent label
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
        label.textContent = combinedLabel;
        header.appendChild(label);
        
        branch.appendChild(header);
        
        const children = document.createElement('div');
        children.className = 'hierarchy-children';
        if (!isExpanded) children.style.display = 'none';
        buildHierarchyDOM(children, childValue, flattenedPath);
        
        branch.appendChild(children);
        parent.appendChild(branch);
      } else {
        // Branch node - normal rendering
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
}

function formatLabel(key) {
  // First replace underscores with spaces
  let result = key.replace(/_/g, ' ');
  // Insert " e " before any uppercase letter that follows a lowercase letter
  // This handles CamelCase like "DiacriticosEFonetica" → "Diacriticos e Fonetica"
  result = result.replace(/([a-z])([A-Z])/g, '$1 e $2');
  return result;
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

// Breadcrumb removed per user request

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
  } else if (state.currentBlock !== 'Basic Latin') {
    // For non-Latin blocks: sort by transliteration name
    // Characters with transliteration come first (alphabetically), then others by code
    letters.sort((a, b) => {
      const aTranslit = getTransliteration(state.currentBlock, a.code);
      const bTranslit = getTransliteration(state.currentBlock, b.code);
      
      // Both have transliteration: sort alphabetically by transliteration
      if (aTranslit && bTranslit) {
        return aTranslit.localeCompare(bTranslit);
      }
      // Only a has transliteration: a comes first
      if (aTranslit && !bTranslit) return -1;
      // Only b has transliteration: b comes first
      if (!aTranslit && bTranslit) return 1;
      // Neither has transliteration: sort by Unicode code
      return a.code - b.code;
    });
    
    // Also sort symbols: those with transliteration first
    symbols.sort((a, b) => {
      const aTranslit = getTransliteration(state.currentBlock, a.code);
      const bTranslit = getTransliteration(state.currentBlock, b.code);
      
      if (aTranslit && bTranslit) {
        return aTranslit.localeCompare(bTranslit);
      }
      if (aTranslit && !bTranslit) return -1;
      if (!aTranslit && bTranslit) return 1;
      return getSymbolOrder(a.char) - getSymbolOrder(b.char);
    });
    
    // Also sort digits: those with transliteration first
    digits.sort((a, b) => {
      const aTranslit = getTransliteration(state.currentBlock, a.code);
      const bTranslit = getTransliteration(state.currentBlock, b.code);
      
      if (aTranslit && bTranslit) {
        return aTranslit.localeCompare(bTranslit);
      }
      if (aTranslit && !bTranslit) return -1;
      if (!aTranslit && bTranslit) return 1;
      return a.code - b.code;
    });
  }
  
  // Sort symbols by frequency (only for Basic Latin)
  if (state.currentBlock === 'Basic Latin') {
    symbols.sort((a, b) => getSymbolOrder(a.char) - getSymbolOrder(b.char));
  }
  
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
    btn.className = 'keyboard-key has-popup';
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
    
    // Add alternatives count badge (variants + skin tones)
    const variantCount = hasVariants ? accentedVariants[baseChar].length : 0;
    const skinToneCount = hasSkinTones ? SKIN_TONES.length : 0;
    const totalAlternatives = variantCount + skinToneCount;
    
    if (totalAlternatives > 0) {
      const badge = document.createElement('span');
      badge.className = 'key-alternatives-badge';
      badge.textContent = totalAlternatives;
      btn.appendChild(badge);
    }
    
    return btn;
  };
  
  // Create sections wrapper for side-by-side layout when space allows
  const sectionsWrapper = document.createElement('div');
  sectionsWrapper.className = 'keyboard-sections';
  
  // Top row: letters and digits side by side
  const topRow = document.createElement('div');
  topRow.className = 'keyboard-top-row';
  
  // Add letters section
  if (letters.length > 0) {
    const lettersSection = document.createElement('div');
    lettersSection.className = 'keyboard-letters-section';
    
    const isUppercase = shouldShowUppercase();
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
        
        lettersSection.appendChild(rowDiv);
      });
    } else {
      // Default: render all letters in a grid
      const lettersGrid = document.createElement('div');
      lettersGrid.className = 'keyboard-grid-inner';
      letters.forEach(item => {
        const displayChar = isUppercase ? item.upperChar : item.char;
        lettersGrid.appendChild(createKey(item, displayChar));
      });
      lettersSection.appendChild(lettersGrid);
    }
    
    // Add space key at the bottom of letters section
    const spaceBtn = document.createElement('button');
    spaceBtn.className = 'keyboard-key keyboard-space-key';
    spaceBtn.dataset.char = ' ';
    spaceBtn.dataset.isLetter = 'false';
    spaceBtn.title = 'Space';
    
    const spaceLabel = document.createElement('span');
    spaceLabel.className = 'key-char';
    spaceLabel.textContent = '␣';
    spaceBtn.appendChild(spaceLabel);
    
    lettersSection.appendChild(spaceBtn);
    topRow.appendChild(lettersSection);
  }
  
  // Add digits section
  if (digits.length > 0) {
    const digitsSection = document.createElement('div');
    digitsSection.className = 'keyboard-digits-section';
    
    const digitsGrid = document.createElement('div');
    digitsGrid.className = 'keyboard-grid-inner';
    digits.forEach(item => {
      digitsGrid.appendChild(createKey(item, item.char));
    });
    digitsSection.appendChild(digitsGrid);
    
    topRow.appendChild(digitsSection);
  }
  
  sectionsWrapper.appendChild(topRow);
  
  // Bottom row: symbols
  if (symbols.length > 0) {
    const symbolsSection = document.createElement('div');
    symbolsSection.className = 'keyboard-symbols-section';
    
    const symbolsGrid = document.createElement('div');
    symbolsGrid.className = 'keyboard-grid-inner';
    symbols.forEach(item => {
      symbolsGrid.appendChild(createKey(item, item.char));
    });
    symbolsSection.appendChild(symbolsGrid);
    
    sectionsWrapper.appendChild(symbolsSection);
  }
  
  container.appendChild(sectionsWrapper);
  
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
    const labels = { lowercase: 'minúscula', uppercase: 'MAIÚSCULA', capslock: 'MAIÚSCULA PRESA' };
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
  // Restore focus to output field
  const outputEl = document.getElementById('keyboard-output');
  if (outputEl) outputEl.focus();
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
      state.hierarchyCollapsed = !state.hierarchyCollapsed;
      renderHierarchy();
      return;
    }
    
    // Close hierarchy popup button
    const closeHierarchyBtn = e.target.closest('#hierarchy-close-btn');
    if (closeHierarchyBtn) {
      state.hierarchyCollapsed = true;
      renderHierarchy();
      // Restore focus to output field
      const outputEl = document.getElementById('keyboard-output');
      if (outputEl) outputEl.focus();
      return;
    }
    
    // Block selection from hierarchy popup
    const hierarchyBlockBtn = e.target.closest('.hierarchy-block');
    if (hierarchyBlockBtn) {
      state.hierarchyCollapsed = true; // Close popup after selection
      selectBlock(hierarchyBlockBtn.dataset.block, true); // true = from hierarchy popup
      return;
    }
    
    // Block selection from recent blocks bar (does not reorder)
    const recentBlockBtn = e.target.closest('.recent-block, .hierarchy-recent-btn');
    if (recentBlockBtn) {
      selectBlock(recentBlockBtn.dataset.block, false); // false = just select, don't reorder
      return;
    }
    
    const shiftBtn = e.target.closest('#shift-button');
    if (shiftBtn) {
      cycleShiftState();
      return;
    }
    
    const keyBtn = e.target.closest('.keyboard-key');
    if (keyBtn) {
      // Skip if this was a long-press
      if (state.longPressTriggered) {
        state.longPressTriggered = false;
        return;
      }
      const char = keyBtn.dataset.char;
      const isLetterKey = keyBtn.dataset.isLetter === 'true';
      addToOutput(char, isLetterKey);
      return;
    }
    
    const variantBtn = e.target.closest('.variant-key');
    if (variantBtn) {
      // Skip if this was a long-press
      if (state.longPressTriggered) {
        state.longPressTriggered = false;
        return;
      }
      const char = variantBtn.dataset.char;
      addToOutput(char, isLetter(char));
      hideVariantsPopup();
      return;
    }
  });
  
  // Long press for Unicode info (all characters, including variants) and skin tones
  container.addEventListener('mousedown', (e) => {
    const keyBtn = e.target.closest('.keyboard-key');
    const variantBtn = e.target.closest('.variant-key');
    
    state.longPressTriggered = false; // Reset flag on new press
    
    if (keyBtn) {
      const hasSkinTones = keyBtn.classList.contains('has-skin-tones');
      state.longPressTimer = setTimeout(() => {
        state.longPressTriggered = true; // Mark that long-press was triggered
        if (hasSkinTones) {
          showSkinTonePopup(keyBtn);
        } else {
          showUnicodeInfoPopup(keyBtn);
        }
      }, state.longPressDelay);
    } else if (variantBtn) {
      // Long-press on variant key shows info for that variant
      state.longPressTimer = setTimeout(() => {
        state.longPressTriggered = true;
        showUnicodeInfoPopupForChar(variantBtn.dataset.char);
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
  
  // Touch support for long press (Unicode info, variants, and skin tones)
  container.addEventListener('touchstart', (e) => {
    const keyBtn = e.target.closest('.keyboard-key');
    const variantBtn = e.target.closest('.variant-key');
    
    state.longPressTriggered = false; // Reset flag on new press
    
    if (keyBtn) {
      const hasSkinTones = keyBtn.classList.contains('has-skin-tones');
      state.longPressTimer = setTimeout(() => {
        state.longPressTriggered = true;
        e.preventDefault();
        if (hasSkinTones) {
          showSkinTonePopup(keyBtn);
        } else {
          showUnicodeInfoPopup(keyBtn);
        }
      }, state.longPressDelay);
    } else if (variantBtn) {
      state.longPressTimer = setTimeout(() => {
        state.longPressTriggered = true;
        e.preventDefault();
        showUnicodeInfoPopupForChar(variantBtn.dataset.char);
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
      // Save layout preference for current block
      state.blockLayouts[state.currentBlock] = state.currentLayout;
      renderCharacterGrid();
      // Restore focus to output field
      const outputEl = document.getElementById('keyboard-output');
      if (outputEl) outputEl.focus();
    });
  }
  
  // Dictionary language selector
  const dictSelect = document.getElementById('dictionary-language');
  if (dictSelect) {
    dictSelect.addEventListener('change', (e) => {
      state.dictionaryLanguage = e.target.value;
      // Update autocomplete with current output
      const outputEl = document.getElementById('keyboard-output');
      if (outputEl) {
        updateAutocomplete(outputEl.value, outputEl.selectionStart);
        outputEl.focus();
      }
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
  document.getElementById('btn-copy-output')?.addEventListener('click', (e) => { e.preventDefault(); copyOutput(); });
  document.getElementById('btn-clear-output')?.addEventListener('click', (e) => { e.preventDefault(); clearOutput(); });
  document.getElementById('btn-backspace')?.addEventListener('click', (e) => { e.preventDefault(); handleBackspace(); });
  document.getElementById('btn-delete')?.addEventListener('click', (e) => { e.preventDefault(); handleDelete(); });
  document.getElementById('btn-enter')?.addEventListener('click', (e) => { e.preventDefault(); handleEnter(); });
  document.getElementById('btn-end')?.addEventListener('click', (e) => { e.preventDefault(); handleEnd(); });
  
  // Note: The input event listener for keyboard-output is added in renderOutputField()
  // because that element is created dynamically
  
  // Show variants popup when user selects a single character in output
  // Use selectionchange event which is the most reliable for text selection
  let selectionTimeout = null;
  
  function checkOutputSelection() {
    const outputEl = document.getElementById('keyboard-output');
    if (!outputEl || document.activeElement !== outputEl) return;
    
    clearTimeout(selectionTimeout);
    const start = outputEl.selectionStart;
    const end = outputEl.selectionEnd;
    
    // Check if exactly one character is selected
    if (end - start === 1) {
      const selectedChar = outputEl.value.substring(start, end);
      
      // Wait 500ms before showing popup
      selectionTimeout = setTimeout(() => {
        showSelectionVariantsPopup(selectedChar, outputEl);
      }, 500);
    }
  }
  
  // Use selectionchange for most reliable detection
  document.addEventListener('selectionchange', checkOutputSelection);
  
  // Fallback: mouseup on document when output is focused
  document.addEventListener('mouseup', () => {
    const outputEl = document.getElementById('keyboard-output');
    if (outputEl && document.activeElement === outputEl) {
      checkOutputSelection();
    }
  });
  
  // Also handle keyboard selection (shift+arrow keys)
  document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Home' || e.key === 'End') {
      const outputEl = document.getElementById('keyboard-output');
      if (outputEl && document.activeElement === outputEl) {
        checkOutputSelection();
      }
    }
  });
  
  // Toggle button and position controls
  document.getElementById('keyboard-toggle-btn')?.addEventListener('click', toggleKeyboard);
  document.getElementById('keyboard-close-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    setKeyboardVisible(false);
  });
  document.getElementById('pos-top')?.addEventListener('click', (e) => { e.preventDefault(); setKeyboardPosition('top'); });
  document.getElementById('pos-bottom')?.addEventListener('click', (e) => { e.preventDefault(); setKeyboardPosition('bottom'); });
  document.getElementById('pos-left')?.addEventListener('click', (e) => { e.preventDefault(); setKeyboardPosition('left'); });
  document.getElementById('pos-right')?.addEventListener('click', (e) => { e.preventDefault(); setKeyboardPosition('right'); });
  document.getElementById('pos-fullscreen')?.addEventListener('click', (e) => { e.preventDefault(); setKeyboardPosition('fullscreen'); });
  
  // Make toggle button draggable
  setupToggleButtonDrag();
  
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

// Check if a block is Latin-based (supports QWERTY/AZERTY/QWERTZ layouts)
function isLatinBlock(blockName) {
  const latinBlocks = [
    'Basic Latin',
    'Latin-1 Supplement',
    'Latin Extended-A',
    'Latin Extended-B',
    'Latin Extended-C',
    'Latin Extended-D',
    'Latin Extended-E',
    'Latin Extended Additional',
    'IPA Extensions',
    'Phonetic Extensions',
    'Phonetic Extensions Supplement',
    'Latin Extended-F',
    'Latin Extended-G'
  ];
  return latinBlocks.includes(blockName);
}

// Update layout options based on current block
function updateLayoutOptions() {
  const select = document.getElementById('layout-select');
  if (!select) return;
  
  const isLatin = isLatinBlock(state.currentBlock);
  const latinOnlyLayouts = ['qwerty', 'azerty', 'qwertz', 'qwerty-pt', 'abnt2', 'bepo', 'dvorak', 'colemak', 'workman'];
  
  // Show/hide Latin-only options
  Array.from(select.options).forEach(option => {
    if (latinOnlyLayouts.includes(option.value)) {
      option.style.display = isLatin ? '' : 'none';
    }
  });
  
  // If current layout is Latin-only and block is not Latin, switch to alphabetic
  if (!isLatin && latinOnlyLayouts.includes(state.currentLayout)) {
    state.currentLayout = 'alphabetic';
  }
  
  // Sync select value with current layout state
  select.value = state.currentLayout;
}

function selectBlock(blockName, fromHierarchyPopup = false) {
  if (!unicodeBlocks[blockName]) return;
  
  state.currentBlock = blockName;
  state.hierarchyCollapsed = true; // Collapse hierarchy after selection
  
  // Only add to recent blocks if selected from hierarchy popup (not already in list)
  // Clicking an existing recent block does NOT change the order
  if (fromHierarchyPopup && !state.recentBlocks.includes(blockName)) {
    state.recentBlocks.unshift(blockName);
    if (state.recentBlocks.length > state.maxRecent) {
      state.recentBlocks.pop();
    }
  }
  
  state.compositionInput = ''; // Reset composition input when switching blocks
  
  // Restore saved layout for this block, or use default
  if (state.blockLayouts[blockName]) {
    state.currentLayout = state.blockLayouts[blockName];
  } else {
    // Default layout based on block type
    const isLatin = blockName.toLowerCase().includes('latin');
    state.currentLayout = isLatin ? 'qwerty' : 'unicode';
  }
  
  renderHierarchy();
  renderCompositionArea();
  updateLayoutOptions();
  renderCharacterGrid();
  
  // Restore focus to output field
  const outputEl = document.getElementById('keyboard-output');
  if (outputEl) outputEl.focus();
}

function addToOutput(char, isLetterChar = false) {
  // Always use the internal keyboard output field
  const targetEl = document.getElementById('keyboard-output');
  
  if (targetEl) {
    const start = targetEl.selectionStart;
    const end = targetEl.selectionEnd;
    const before = targetEl.value.substring(0, start);
    const after = targetEl.value.substring(end);
    targetEl.value = before + char + after;
    state.output = targetEl.value;
    
    const newPos = start + char.length;
    targetEl.setSelectionRange(newPos, newPos);
    targetEl.focus();
    
    // Update autocomplete suggestions
    updateAutocomplete(targetEl.value, newPos);
  } else {
    state.output += char;
  }
  
  // Handle shift state transition: uppercase (temporary) returns to lowercase after letter
  if (isLetterChar && state.shiftState === 'uppercase') {
    state.shiftState = 'lowercase';
    updateShiftUI();
    renderCharacterGrid();
  }
}

// Get the current word being typed (before cursor)
function getLastWord(text, cursorPos) {
  const beforeCursor = text.substring(0, cursorPos);
  const match = beforeCursor.match(/[\p{L}\p{M}]+$/u);
  return match ? match[0] : '';
}

// Get autocomplete suggestions for the current word
function getSuggestions(prefix, maxCount = 5) {
  if (!prefix || prefix.length < 1) return [];
  
  const dict = dictionaries[state.dictionaryLanguage];
  if (!dict) return [];
  
  const lowerPrefix = prefix.toLowerCase();
  const suggestions = [];
  
  for (const word of dict) {
    if (word.toLowerCase().startsWith(lowerPrefix) && word.toLowerCase() !== lowerPrefix) {
      suggestions.push(word);
      if (suggestions.length >= maxCount) break;
    }
  }
  
  return suggestions;
}

// Update autocomplete suggestions display
function updateAutocomplete(text, cursorPos) {
  const container = document.getElementById('keyboard-autocomplete');
  if (!container) return;
  
  // Clear if no dictionary selected
  if (state.dictionaryLanguage === 'none') {
    container.innerHTML = '';
    container.style.display = 'none';
    return;
  }
  
  const currentWord = getLastWord(text, cursorPos);
  const suggestions = getSuggestions(currentWord);
  
  if (suggestions.length === 0) {
    container.innerHTML = '';
    container.style.display = 'none';
    return;
  }
  
  container.style.display = 'flex';
  container.innerHTML = suggestions.map(word => {
    // Highlight the matched prefix
    const matchLen = currentWord.length;
    const prefix = word.substring(0, matchLen);
    const suffix = word.substring(matchLen);
    return `<button class="autocomplete-suggestion" data-word="${word}" data-prefix-len="${matchLen}"><span class="autocomplete-match">${prefix}</span>${suffix}</button>`;
  }).join('');
  
  // Attach click handlers
  container.querySelectorAll('.autocomplete-suggestion').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      applySuggestion(btn.dataset.word, parseInt(btn.dataset.prefixLen, 10));
    });
  });
}

// Apply the selected autocomplete suggestion
function applySuggestion(word, prefixLen) {
  const targetEl = document.getElementById('keyboard-output');
  if (!targetEl) return;
  
  const cursorPos = targetEl.selectionStart;
  const before = targetEl.value.substring(0, cursorPos - prefixLen);
  const after = targetEl.value.substring(cursorPos);
  
  // Insert the word (replacing the prefix already typed) plus a space
  targetEl.value = before + word + ' ' + after;
  state.output = targetEl.value;
  
  const newPos = before.length + word.length + 1;
  targetEl.setSelectionRange(newPos, newPos);
  targetEl.focus();
  
  // Clear autocomplete
  const container = document.getElementById('keyboard-autocomplete');
  if (container) {
    container.innerHTML = '';
    container.style.display = 'none';
  }
}

function handleBackspace() {
  // Always use the internal keyboard output field
  const targetEl = document.getElementById('keyboard-output');
  if (!targetEl) return;
  
  const start = targetEl.selectionStart;
  const end = targetEl.selectionEnd;
  
  if (start !== end) {
    const before = targetEl.value.substring(0, start);
    const after = targetEl.value.substring(end);
    targetEl.value = before + after;
    targetEl.setSelectionRange(start, start);
    targetEl.focus();
    updateAutocomplete(targetEl.value, start);
  } else if (start > 0) {
    const before = targetEl.value.substring(0, start - 1);
    const after = targetEl.value.substring(start);
    targetEl.value = before + after;
    targetEl.setSelectionRange(start - 1, start - 1);
    updateAutocomplete(targetEl.value, start - 1);
  }
  state.output = targetEl.value;
  targetEl.focus();
}

function handleDelete() {
  // Always use the internal keyboard output field
  const targetEl = document.getElementById('keyboard-output');
  if (!targetEl) return;
  
  const start = targetEl.selectionStart;
  const end = targetEl.selectionEnd;
  
  if (start !== end) {
    const before = targetEl.value.substring(0, start);
    const after = targetEl.value.substring(end);
    targetEl.value = before + after;
    targetEl.setSelectionRange(start, start);
  } else if (start < targetEl.value.length) {
    const before = targetEl.value.substring(0, start);
    const after = targetEl.value.substring(start + 1);
    targetEl.value = before + after;
    targetEl.setSelectionRange(start, start);
  }
  state.output = targetEl.value;
  targetEl.focus();
  updateAutocomplete(targetEl.value, targetEl.selectionStart);
}

function handleEnter() {
  // Allow Enter for multiline output (textarea) - the output adapts to external field type
  if (state.isMultilineField) {
    addToOutput('\n');
  }
  // Clear autocomplete after Enter (word is complete)
  const container = document.getElementById('keyboard-autocomplete');
  if (container) {
    container.innerHTML = '';
    container.style.display = 'none';
  }
}

function handleEnd() {
  const outputEl = document.getElementById('keyboard-output');
  if (!outputEl) return;
  
  const text = outputEl.value;
  const cursorPos = outputEl.selectionStart || 0;
  
  // Sync text and cursor back to external field
  if (state.activeExternalField) {
    state.activeExternalField.value = text;
    state.activeExternalField.setSelectionRange(cursorPos, cursorPos);
    state.activeExternalField.focus();
  } else {
    // No external field - copy to clipboard as fallback
    navigator.clipboard.writeText(text).then(() => {
      clearOutput();
    });
  }
  
  // Close the keyboard panel
  setKeyboardVisible(false);
}

function copyOutput() {
  const outputEl = document.getElementById('keyboard-output');
  const text = outputEl ? outputEl.value : state.output;
  const cursorPos = outputEl ? outputEl.selectionStart : 0;
  
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('btn-copy-output');
    if (btn) {
      const original = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = original; }, 1500);
    }
    // Restore focus and cursor position
    if (outputEl) {
      outputEl.focus();
      outputEl.setSelectionRange(cursorPos, cursorPos);
    }
  });
}

function toggleKeyboard() {
  setKeyboardVisible(!state.keyboardVisible);
}

function setKeyboardVisible(visible) {
  state.keyboardVisible = visible;
  const panel = document.getElementById('keyboard-panel');
  const toggleBtn = document.getElementById('keyboard-toggle-btn');
  
  // Sync text and cursor from external field when opening
  if (visible && state.activeExternalField) {
    state.output = state.activeExternalField.value || '';
    state.externalCursorPos = state.activeExternalField.selectionStart || 0;
    renderOutputField();
  }
  
  if (panel) {
    panel.classList.toggle('keyboard-panel-hidden', !visible);
  }
  if (toggleBtn) {
    toggleBtn.classList.toggle('keyboard-toggle-active', visible);
  }
}

function setKeyboardPosition(position) {
  // Save cursor position before changing position
  const output = document.getElementById('keyboard-output');
  const cursorPos = output ? output.selectionStart : 0;
  
  state.keyboardPosition = position;
  const panel = document.getElementById('keyboard-panel');
  if (panel) {
    const hiddenClass = state.keyboardVisible ? '' : ' keyboard-panel-hidden';
    panel.className = `keyboard-panel keyboard-position-${position}${hiddenClass}`;
  }
  
  // Update active button state
  ['top', 'bottom', 'left', 'right', 'fullscreen'].forEach(pos => {
    const btn = document.getElementById(`pos-${pos}`);
    if (btn) {
      btn.classList.toggle('btn-primary', pos === position);
      btn.classList.toggle('btn-outline', pos !== position);
    }
  });
  
  // Restore focus and cursor position
  if (output) {
    output.focus();
    output.setSelectionRange(cursorPos, cursorPos);
  }
}

function setupToggleButtonDrag() {
  const btn = document.getElementById('keyboard-toggle-btn');
  if (!btn) return;
  
  let isDragging = false;
  let hasMoved = false;
  let startX, startY, initialX, initialY;
  
  btn.addEventListener('mousedown', startDrag);
  btn.addEventListener('touchstart', startDrag, { passive: false });
  
  function startDrag(e) {
    if (e.type === 'touchstart') {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    } else {
      startX = e.clientX;
      startY = e.clientY;
    }
    
    const rect = btn.getBoundingClientRect();
    initialX = rect.left;
    initialY = rect.top;
    isDragging = true;
    hasMoved = false;
    
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchmove', onDrag, { passive: false });
    document.addEventListener('touchend', endDrag);
  }
  
  function onDrag(e) {
    if (!isDragging) return;
    e.preventDefault();
    
    let currentX, currentY;
    if (e.type === 'touchmove') {
      currentX = e.touches[0].clientX;
      currentY = e.touches[0].clientY;
    } else {
      currentX = e.clientX;
      currentY = e.clientY;
    }
    
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      hasMoved = true;
    }
    
    const newX = Math.max(0, Math.min(window.innerWidth - btn.offsetWidth, initialX + deltaX));
    const newY = Math.max(0, Math.min(window.innerHeight - btn.offsetHeight, initialY + deltaY));
    
    btn.style.left = newX + 'px';
    btn.style.top = newY + 'px';
    btn.style.right = 'auto';
    btn.style.bottom = 'auto';
    
    state.floatingButtonPos = { x: newX, y: newY };
  }
  
  function endDrag(e) {
    isDragging = false;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('touchmove', onDrag);
    document.removeEventListener('touchend', endDrag);
    
    if (hasMoved) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
  
  // Prevent click from firing after drag
  btn.addEventListener('click', (e) => {
    if (hasMoved) {
      e.preventDefault();
      e.stopPropagation();
      hasMoved = false;
    }
  }, true);
}

function clearOutput() {
  state.output = '';
  const outputEl = document.getElementById('keyboard-output');
  if (outputEl) {
    outputEl.value = '';
    outputEl.focus();
  }
}

function hideVariantsPopup() {
  const popup = document.getElementById('variants-popup');
  if (popup) {
    popup.style.display = 'none';
  }
  // Clear the original character reference
  state.popupOriginalChar = null;
}

// Show variants popup when user selects a single character in output
function showSelectionVariantsPopup(char, targetEl) {
  const code = char.codePointAt(0);
  
  // Store original character for variant navigation
  state.popupOriginalChar = char;
  
  const popup = document.getElementById('variants-popup');
  if (!popup) return;
  
  popup.innerHTML = '';
  
  // Add close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'variants-popup-close';
  closeBtn.innerHTML = '×';
  closeBtn.title = 'Close';
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    hideVariantsPopup();
    targetEl.focus();
  });
  popup.appendChild(closeBtn);
  
  // Unicode info section
  const infoSection = document.createElement('div');
  infoSection.className = 'unicode-info-section';
  
  const hexCode = code.toString(16).toUpperCase().padStart(4, '0');
  const charName = getUnicodeName(code);
  
  const charDisplay = document.createElement('div');
  charDisplay.className = 'unicode-info-char';
  charDisplay.textContent = char;
  charDisplay.title = 'Character selected in output';
  infoSection.appendChild(charDisplay);
  
  const details = document.createElement('div');
  details.className = 'unicode-info-details';
  details.innerHTML = `
    <div class="unicode-info-row"><span class="info-label">U+</span><span class="info-value">${hexCode}</span></div>
    <div class="unicode-info-row"><span class="info-label">Hex:</span><span class="info-value">0x${hexCode}</span></div>
    <div class="unicode-info-row"><span class="info-label">Dec:</span><span class="info-value">${code}</span></div>
    <div class="unicode-info-row unicode-info-name"><span class="info-value">${charName}</span></div>
  `;
  infoSection.appendChild(details);
  popup.appendChild(infoSection);
  
  // Variants section - show if character has variants
  const variants = accentedVariants[char] || [];
  if (variants.length > 0) {
    const variantsSection = document.createElement('div');
    variantsSection.className = 'variants-section';
    
    const variantsTitle = document.createElement('div');
    variantsTitle.className = 'variants-title';
    variantsTitle.textContent = 'Variants';
    variantsSection.appendChild(variantsTitle);
    
    const grid = document.createElement('div');
    grid.className = 'variants-grid';
    
    variants.forEach(v => {
      const vCode = v.codePointAt(0);
      const vHex = vCode.toString(16).toUpperCase().padStart(4, '0');
      
      const btn = document.createElement('button');
      btn.className = 'variant-key';
      btn.dataset.char = v;
      btn.title = `U+${vHex}`;
      btn.textContent = v;
      
      // Click inserts the variant character at cursor position (keeps popup open)
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const start = targetEl.selectionStart;
        const end = targetEl.selectionEnd;
        const before = targetEl.value.substring(0, start);
        const after = targetEl.value.substring(end);
        targetEl.value = before + v + after;
        state.output = targetEl.value;
        const newPos = start + v.length;
        targetEl.setSelectionRange(newPos, newPos);
        // Keep popup open for multiple insertions - don't hide or change focus
      });
      
      grid.appendChild(btn);
    });
    
    variantsSection.appendChild(grid);
    popup.appendChild(variantsSection);
  }
  
  // Position popup near the output field
  popup.style.display = 'block';
  const rect = targetEl.getBoundingClientRect();
  positionPopupNearElement(popup, rect);
}

function showSkinTonePopup(keyBtn) {
  const char = keyBtn.dataset.char;
  const code = parseInt(keyBtn.dataset.code);
  
  if (!supportsSkinTone(code)) return;
  
  const popup = document.getElementById('variants-popup');
  if (!popup) return;
  
  popup.innerHTML = '';
  
  // Add close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'variants-popup-close';
  closeBtn.innerHTML = '×';
  closeBtn.title = 'Close';
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    hideVariantsPopup();
  });
  popup.appendChild(closeBtn);
  
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
  
  // Position popup near the key using fixed positioning
  const rect = keyBtn.getBoundingClientRect();
  positionPopupNearElement(popup, rect);
}

// External field tracking
function setupExternalFieldTracking() {
  document.addEventListener('focusin', (e) => {
    if (isValidTextField(e.target) && !e.target.closest('#keyboard-container')) {
      state.activeExternalField = e.target;
      state.isMultilineField = e.target.tagName === 'TEXTAREA';
      updateFloatingButtonVisibility();
      updateEnterButtonVisibility();
    }
  });
  
  document.addEventListener('focusout', (e) => {
    // Only clear if focus is leaving to something that's not a valid field or keyboard
    // Use requestAnimationFrame to ensure we check after DOM updates
    requestAnimationFrame(() => {
      // Never clear while keyboard is visible - user is actively using it
      if (state.keyboardVisible) {
        return;
      }
      
      const activeEl = document.activeElement;
      const isKeyboardElement = activeEl && activeEl.closest('#keyboard-container');
      const isValidField = isValidTextField(activeEl) && !activeEl.closest('#keyboard-container');
      
      // Also check if the click target was inside the keyboard container
      const clickedKeyboard = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('#keyboard-container');
      
      if (!isKeyboardElement && !isValidField && !clickedKeyboard) {
        state.activeExternalField = null;
        state.isMultilineField = false;
        updateFloatingButtonVisibility();
        updateEnterButtonVisibility();
      }
    });
  });
}

// Build reverse map of Latin keys to Unicode characters for current block
function buildKeyMap() {
  const block = unicodeBlocks[state.currentBlock];
  if (!block) return {};
  
  const keyMap = {};
  const blockTranslit = transliterations[state.currentBlock];
  
  if (blockTranslit) {
    // Map single-letter transliterations to their Unicode characters
    for (const [codePoint, translit] of Object.entries(blockTranslit)) {
      if (translit.length === 1) {
        const lowerTranslit = translit.toLowerCase();
        const code = parseInt(codePoint);
        const char = String.fromCodePoint(code);
        // Only use the first match for each key
        if (!keyMap[lowerTranslit]) {
          keyMap[lowerTranslit] = { code, char, translit };
        }
      }
    }
  }
  
  return keyMap;
}

// Handle physical keyboard input when panel is open
function setupPhysicalKeyboardListener() {
  document.addEventListener('keydown', (e) => {
    // Only intercept if keyboard panel is visible and output field is focused
    if (!state.keyboardVisible) return;
    
    const outputEl = document.getElementById('keyboard-output');
    if (!outputEl || document.activeElement !== outputEl) return;
    
    // Don't intercept special keys
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'Control' || e.key === 'Meta' || e.key === 'Alt' || e.key === 'Shift') return;
    if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Enter') return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') return;
    if (e.key === 'Home' || e.key === 'End' || e.key === 'Tab' || e.key === 'Escape') return;
    
    // For Basic Latin, let normal typing happen
    if (state.currentBlock === 'Basic Latin') return;
    
    // For non-Latin blocks, check if there's a mapping
    const keyMap = buildKeyMap();
    const lowerKey = e.key.toLowerCase();
    
    if (keyMap[lowerKey]) {
      e.preventDefault();
      const mapped = keyMap[lowerKey];
      // Apply shift state
      let charToInsert = mapped.char;
      if (shouldShowUppercase()) {
        charToInsert = charToInsert.toUpperCase();
      }
      addToOutput(charToInsert, isLetter(charToInsert));
    }
  });
}

// Control key listener
function setupControlKeyListener() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Control' && !e.repeat) {
      // Only toggle if there's an active valid field
      if (state.activeExternalField || isValidTextField(document.activeElement)) {
        if (!state.activeExternalField && isValidTextField(document.activeElement)) {
          state.activeExternalField = document.activeElement;
          state.isMultilineField = document.activeElement.tagName === 'TEXTAREA';
        }
        toggleKeyboard();
        e.preventDefault();
      }
    }
  });
}

// Calculate if letters should be displayed as uppercase
// Considers both interface shift state and physical shift key
function shouldShowUppercase() {
  if (state.physicalShiftPressed) {
    // Physical shift inverts the current state
    return state.shiftState === 'lowercase';
  }
  return state.shiftState !== 'lowercase';
}

// Physical Shift and CapsLock key listeners
function setupPhysicalShiftListener() {
  // CapsLock syncs interface to actual CapsLock state
  document.addEventListener('keydown', (e) => {
    if (e.key === 'CapsLock') {
      // Use getModifierState to get actual CapsLock state after this keypress
      // Note: getModifierState returns state BEFORE the key is processed,
      // so we invert it to get the new state
      const willBeCapsLock = !e.getModifierState('CapsLock');
      state.shiftState = willBeCapsLock ? 'capslock' : 'lowercase';
      updateShiftUI();
      renderCharacterGrid();
    }
  });
  
  // Shift key held down - temporary case inversion
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Shift' && !e.repeat) {
      state.physicalShiftPressed = true;
      renderCharacterGrid();
    }
  });
  
  document.addEventListener('keyup', (e) => {
    if (e.key === 'Shift') {
      state.physicalShiftPressed = false;
      renderCharacterGrid();
    }
  });
}

// Update floating button visibility
function updateFloatingButtonVisibility() {
  const btn = document.getElementById('keyboard-toggle-btn');
  if (!btn) return;
  
  const hasValidField = state.activeExternalField !== null;
  btn.style.display = hasValidField ? '' : 'none';
  
  // Update CTRL label visibility based on device type
  const ctrlSpan = btn.querySelector('.keyboard-toggle-ctrl');
  if (ctrlSpan) {
    ctrlSpan.textContent = state.hasPhysicalKeyboard ? 'CTRL' : '';
  }
  
  if (!hasValidField && state.keyboardVisible) {
    setKeyboardVisible(false);
  }
}

// Update Enter button visibility based on field type
function updateEnterButtonVisibility() {
  const enterBtn = document.getElementById('btn-enter');
  if (!enterBtn) return;
  
  // Hide Enter button for single-line inputs
  enterBtn.style.display = state.isMultilineField ? '' : 'none';
}

// Get Unicode character name (simplified - uses codepoint description)
function getUnicodeName(codePoint) {
  // Extended Latin character names (Latin Extended-A, Latin Extended-B, Latin-1 Supplement)
  const latinExtended = {
    // Latin-1 Supplement (accented letters)
    0x00C0: 'LATIN CAPITAL LETTER A WITH GRAVE',
    0x00C1: 'LATIN CAPITAL LETTER A WITH ACUTE',
    0x00C2: 'LATIN CAPITAL LETTER A WITH CIRCUMFLEX',
    0x00C3: 'LATIN CAPITAL LETTER A WITH TILDE',
    0x00C4: 'LATIN CAPITAL LETTER A WITH DIAERESIS',
    0x00C5: 'LATIN CAPITAL LETTER A WITH RING ABOVE',
    0x00C6: 'LATIN CAPITAL LETTER AE',
    0x00C7: 'LATIN CAPITAL LETTER C WITH CEDILLA',
    0x00C8: 'LATIN CAPITAL LETTER E WITH GRAVE',
    0x00C9: 'LATIN CAPITAL LETTER E WITH ACUTE',
    0x00CA: 'LATIN CAPITAL LETTER E WITH CIRCUMFLEX',
    0x00CB: 'LATIN CAPITAL LETTER E WITH DIAERESIS',
    0x00CC: 'LATIN CAPITAL LETTER I WITH GRAVE',
    0x00CD: 'LATIN CAPITAL LETTER I WITH ACUTE',
    0x00CE: 'LATIN CAPITAL LETTER I WITH CIRCUMFLEX',
    0x00CF: 'LATIN CAPITAL LETTER I WITH DIAERESIS',
    0x00D0: 'LATIN CAPITAL LETTER ETH',
    0x00D1: 'LATIN CAPITAL LETTER N WITH TILDE',
    0x00D2: 'LATIN CAPITAL LETTER O WITH GRAVE',
    0x00D3: 'LATIN CAPITAL LETTER O WITH ACUTE',
    0x00D4: 'LATIN CAPITAL LETTER O WITH CIRCUMFLEX',
    0x00D5: 'LATIN CAPITAL LETTER O WITH TILDE',
    0x00D6: 'LATIN CAPITAL LETTER O WITH DIAERESIS',
    0x00D8: 'LATIN CAPITAL LETTER O WITH STROKE',
    0x00D9: 'LATIN CAPITAL LETTER U WITH GRAVE',
    0x00DA: 'LATIN CAPITAL LETTER U WITH ACUTE',
    0x00DB: 'LATIN CAPITAL LETTER U WITH CIRCUMFLEX',
    0x00DC: 'LATIN CAPITAL LETTER U WITH DIAERESIS',
    0x00DD: 'LATIN CAPITAL LETTER Y WITH ACUTE',
    0x00DE: 'LATIN CAPITAL LETTER THORN',
    0x00DF: 'LATIN SMALL LETTER SHARP S',
    0x00E0: 'LATIN SMALL LETTER A WITH GRAVE',
    0x00E1: 'LATIN SMALL LETTER A WITH ACUTE',
    0x00E2: 'LATIN SMALL LETTER A WITH CIRCUMFLEX',
    0x00E3: 'LATIN SMALL LETTER A WITH TILDE',
    0x00E4: 'LATIN SMALL LETTER A WITH DIAERESIS',
    0x00E5: 'LATIN SMALL LETTER A WITH RING ABOVE',
    0x00E6: 'LATIN SMALL LETTER AE',
    0x00E7: 'LATIN SMALL LETTER C WITH CEDILLA',
    0x00E8: 'LATIN SMALL LETTER E WITH GRAVE',
    0x00E9: 'LATIN SMALL LETTER E WITH ACUTE',
    0x00EA: 'LATIN SMALL LETTER E WITH CIRCUMFLEX',
    0x00EB: 'LATIN SMALL LETTER E WITH DIAERESIS',
    0x00EC: 'LATIN SMALL LETTER I WITH GRAVE',
    0x00ED: 'LATIN SMALL LETTER I WITH ACUTE',
    0x00EE: 'LATIN SMALL LETTER I WITH CIRCUMFLEX',
    0x00EF: 'LATIN SMALL LETTER I WITH DIAERESIS',
    0x00F0: 'LATIN SMALL LETTER ETH',
    0x00F1: 'LATIN SMALL LETTER N WITH TILDE',
    0x00F2: 'LATIN SMALL LETTER O WITH GRAVE',
    0x00F3: 'LATIN SMALL LETTER O WITH ACUTE',
    0x00F4: 'LATIN SMALL LETTER O WITH CIRCUMFLEX',
    0x00F5: 'LATIN SMALL LETTER O WITH TILDE',
    0x00F6: 'LATIN SMALL LETTER O WITH DIAERESIS',
    0x00F8: 'LATIN SMALL LETTER O WITH STROKE',
    0x00F9: 'LATIN SMALL LETTER U WITH GRAVE',
    0x00FA: 'LATIN SMALL LETTER U WITH ACUTE',
    0x00FB: 'LATIN SMALL LETTER U WITH CIRCUMFLEX',
    0x00FC: 'LATIN SMALL LETTER U WITH DIAERESIS',
    0x00FD: 'LATIN SMALL LETTER Y WITH ACUTE',
    0x00FE: 'LATIN SMALL LETTER THORN',
    0x00FF: 'LATIN SMALL LETTER Y WITH DIAERESIS',
    // Latin Extended-A
    0x0100: 'LATIN CAPITAL LETTER A WITH MACRON',
    0x0101: 'LATIN SMALL LETTER A WITH MACRON',
    0x0102: 'LATIN CAPITAL LETTER A WITH BREVE',
    0x0103: 'LATIN SMALL LETTER A WITH BREVE',
    0x0104: 'LATIN CAPITAL LETTER A WITH OGONEK',
    0x0105: 'LATIN SMALL LETTER A WITH OGONEK',
    0x0106: 'LATIN CAPITAL LETTER C WITH ACUTE',
    0x0107: 'LATIN SMALL LETTER C WITH ACUTE',
    0x010C: 'LATIN CAPITAL LETTER C WITH CARON',
    0x010D: 'LATIN SMALL LETTER C WITH CARON',
    0x010E: 'LATIN CAPITAL LETTER D WITH CARON',
    0x010F: 'LATIN SMALL LETTER D WITH CARON',
    0x0110: 'LATIN CAPITAL LETTER D WITH STROKE',
    0x0111: 'LATIN SMALL LETTER D WITH STROKE',
    0x0112: 'LATIN CAPITAL LETTER E WITH MACRON',
    0x0113: 'LATIN SMALL LETTER E WITH MACRON',
    0x0118: 'LATIN CAPITAL LETTER E WITH OGONEK',
    0x0119: 'LATIN SMALL LETTER E WITH OGONEK',
    0x011A: 'LATIN CAPITAL LETTER E WITH CARON',
    0x011B: 'LATIN SMALL LETTER E WITH CARON',
    0x0141: 'LATIN CAPITAL LETTER L WITH STROKE',
    0x0142: 'LATIN SMALL LETTER L WITH STROKE',
    0x0143: 'LATIN CAPITAL LETTER N WITH ACUTE',
    0x0144: 'LATIN SMALL LETTER N WITH ACUTE',
    0x0147: 'LATIN CAPITAL LETTER N WITH CARON',
    0x0148: 'LATIN SMALL LETTER N WITH CARON',
    0x0150: 'LATIN CAPITAL LETTER O WITH DOUBLE ACUTE',
    0x0151: 'LATIN SMALL LETTER O WITH DOUBLE ACUTE',
    0x0152: 'LATIN CAPITAL LIGATURE OE',
    0x0153: 'LATIN SMALL LIGATURE OE',
    0x0158: 'LATIN CAPITAL LETTER R WITH CARON',
    0x0159: 'LATIN SMALL LETTER R WITH CARON',
    0x015A: 'LATIN CAPITAL LETTER S WITH ACUTE',
    0x015B: 'LATIN SMALL LETTER S WITH ACUTE',
    0x0160: 'LATIN CAPITAL LETTER S WITH CARON',
    0x0161: 'LATIN SMALL LETTER S WITH CARON',
    0x0164: 'LATIN CAPITAL LETTER T WITH CARON',
    0x0165: 'LATIN SMALL LETTER T WITH CARON',
    0x016E: 'LATIN CAPITAL LETTER U WITH RING ABOVE',
    0x016F: 'LATIN SMALL LETTER U WITH RING ABOVE',
    0x0170: 'LATIN CAPITAL LETTER U WITH DOUBLE ACUTE',
    0x0171: 'LATIN SMALL LETTER U WITH DOUBLE ACUTE',
    0x0178: 'LATIN CAPITAL LETTER Y WITH DIAERESIS',
    0x0179: 'LATIN CAPITAL LETTER Z WITH ACUTE',
    0x017A: 'LATIN SMALL LETTER Z WITH ACUTE',
    0x017B: 'LATIN CAPITAL LETTER Z WITH DOT ABOVE',
    0x017C: 'LATIN SMALL LETTER Z WITH DOT ABOVE',
    0x017D: 'LATIN CAPITAL LETTER Z WITH CARON',
    0x017E: 'LATIN SMALL LETTER Z WITH CARON'
  };
  
  if (latinExtended[codePoint]) return latinExtended[codePoint];
  
  // Common symbols and punctuation
  const commonNames = {
    0x0020: 'SPACE',
    0x0021: 'EXCLAMATION MARK',
    0x0022: 'QUOTATION MARK',
    0x0023: 'NUMBER SIGN',
    0x0024: 'DOLLAR SIGN',
    0x0025: 'PERCENT SIGN',
    0x0026: 'AMPERSAND',
    0x0027: 'APOSTROPHE',
    0x0028: 'LEFT PARENTHESIS',
    0x0029: 'RIGHT PARENTHESIS',
    0x002A: 'ASTERISK',
    0x002B: 'PLUS SIGN',
    0x002C: 'COMMA',
    0x002D: 'HYPHEN-MINUS',
    0x002E: 'FULL STOP',
    0x002F: 'SOLIDUS',
    0x003A: 'COLON',
    0x003B: 'SEMICOLON',
    0x003C: 'LESS-THAN SIGN',
    0x003D: 'EQUALS SIGN',
    0x003E: 'GREATER-THAN SIGN',
    0x003F: 'QUESTION MARK',
    0x0040: 'COMMERCIAL AT',
    0x005B: 'LEFT SQUARE BRACKET',
    0x005C: 'REVERSE SOLIDUS',
    0x005D: 'RIGHT SQUARE BRACKET',
    0x005E: 'CIRCUMFLEX ACCENT',
    0x005F: 'LOW LINE',
    0x0060: 'GRAVE ACCENT',
    0x007B: 'LEFT CURLY BRACKET',
    0x007C: 'VERTICAL LINE',
    0x007D: 'RIGHT CURLY BRACKET',
    0x007E: 'TILDE',
    0x00A1: 'INVERTED EXCLAMATION MARK',
    0x00A2: 'CENT SIGN',
    0x00A3: 'POUND SIGN',
    0x00A4: 'CURRENCY SIGN',
    0x00A5: 'YEN SIGN',
    0x00A7: 'SECTION SIGN',
    0x00A9: 'COPYRIGHT SIGN',
    0x00AB: 'LEFT-POINTING DOUBLE ANGLE QUOTATION MARK',
    0x00AE: 'REGISTERED SIGN',
    0x00B0: 'DEGREE SIGN',
    0x00B1: 'PLUS-MINUS SIGN',
    0x00B2: 'SUPERSCRIPT TWO',
    0x00B3: 'SUPERSCRIPT THREE',
    0x00B5: 'MICRO SIGN',
    0x00B6: 'PILCROW SIGN',
    0x00B7: 'MIDDLE DOT',
    0x00B9: 'SUPERSCRIPT ONE',
    0x00BB: 'RIGHT-POINTING DOUBLE ANGLE QUOTATION MARK',
    0x00BF: 'INVERTED QUESTION MARK',
    0x00D7: 'MULTIPLICATION SIGN',
    0x00F7: 'DIVISION SIGN'
  };
  
  if (commonNames[codePoint]) return commonNames[codePoint];
  
  // Basic Latin letters
  if (codePoint >= 0x0041 && codePoint <= 0x005A) {
    return 'LATIN CAPITAL LETTER ' + String.fromCodePoint(codePoint);
  }
  if (codePoint >= 0x0061 && codePoint <= 0x007A) {
    return 'LATIN SMALL LETTER ' + String.fromCodePoint(codePoint).toUpperCase();
  }
  if (codePoint >= 0x0030 && codePoint <= 0x0039) {
    const digitNames = ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];
    return 'DIGIT ' + digitNames[codePoint - 0x0030];
  }
  
  // Greek letters
  if (codePoint >= 0x0391 && codePoint <= 0x03C9) {
    const translit = getTransliteration(state.currentBlock, codePoint);
    if (translit) return 'GREEK ' + (codePoint < 0x03B1 ? 'CAPITAL' : 'SMALL') + ' LETTER ' + translit.toUpperCase();
  }
  
  // Cyrillic letters
  if (codePoint >= 0x0400 && codePoint <= 0x04FF) {
    const isCapital = codePoint < 0x0430 || (codePoint >= 0x0400 && codePoint <= 0x040F);
    const translit = getTransliteration(state.currentBlock, codePoint);
    if (translit) return 'CYRILLIC ' + (isCapital ? 'CAPITAL' : 'SMALL') + ' LETTER ' + translit.toUpperCase();
    return 'CYRILLIC ' + (isCapital ? 'CAPITAL' : 'SMALL') + ' LETTER';
  }
  
  // Hebrew letters
  if (codePoint >= 0x05D0 && codePoint <= 0x05EA) {
    const hebrewNames = {
      0x05D0: 'ALEF', 0x05D1: 'BET', 0x05D2: 'GIMEL', 0x05D3: 'DALET',
      0x05D4: 'HE', 0x05D5: 'VAV', 0x05D6: 'ZAYIN', 0x05D7: 'HET',
      0x05D8: 'TET', 0x05D9: 'YOD', 0x05DA: 'FINAL KAF', 0x05DB: 'KAF',
      0x05DC: 'LAMED', 0x05DD: 'FINAL MEM', 0x05DE: 'MEM', 0x05DF: 'FINAL NUN',
      0x05E0: 'NUN', 0x05E1: 'SAMEKH', 0x05E2: 'AYIN', 0x05E3: 'FINAL PE',
      0x05E4: 'PE', 0x05E5: 'FINAL TSADI', 0x05E6: 'TSADI', 0x05E7: 'QOF',
      0x05E8: 'RESH', 0x05E9: 'SHIN', 0x05EA: 'TAV'
    };
    if (hebrewNames[codePoint]) return 'HEBREW LETTER ' + hebrewNames[codePoint];
  }
  
  // Arabic letters (basic)
  if (codePoint >= 0x0621 && codePoint <= 0x064A) {
    const translit = getTransliteration(state.currentBlock, codePoint);
    if (translit) return 'ARABIC LETTER ' + translit.toUpperCase();
  }
  
  // Hiragana
  if (codePoint >= 0x3041 && codePoint <= 0x3096) {
    const translit = getTransliteration(state.currentBlock, codePoint);
    if (translit) return 'HIRAGANA LETTER ' + translit.toUpperCase();
    return 'HIRAGANA LETTER';
  }
  
  // Katakana
  if (codePoint >= 0x30A1 && codePoint <= 0x30FA) {
    const translit = getTransliteration(state.currentBlock, codePoint);
    if (translit) return 'KATAKANA LETTER ' + translit.toUpperCase();
    return 'KATAKANA LETTER';
  }
  
  // Generate descriptive name based on character properties
  const char = String.fromCodePoint(codePoint);
  const hexCode = codePoint.toString(16).toUpperCase().padStart(4, '0');
  
  // Check if it's a letter
  if (/\p{Letter}/u.test(char)) {
    const blockName = state.currentBlock ? state.currentBlock.toUpperCase() : 'UNICODE';
    return blockName + ' LETTER (U+' + hexCode + ')';
  }
  
  // Check if it's a number
  if (/\p{Number}/u.test(char)) {
    const blockName = state.currentBlock ? state.currentBlock.toUpperCase() : 'UNICODE';
    return blockName + ' DIGIT (U+' + hexCode + ')';
  }
  
  // Check if it's punctuation
  if (/\p{Punctuation}/u.test(char)) {
    const blockName = state.currentBlock ? state.currentBlock.toUpperCase() : 'UNICODE';
    return blockName + ' PUNCTUATION (U+' + hexCode + ')';
  }
  
  // Check if it's a symbol
  if (/\p{Symbol}/u.test(char)) {
    const blockName = state.currentBlock ? state.currentBlock.toUpperCase() : 'UNICODE';
    return blockName + ' SYMBOL (U+' + hexCode + ')';
  }
  
  // Default: show block name with code point
  const blockName = state.currentBlock ? state.currentBlock.toUpperCase() : 'UNICODE';
  return blockName + ' (U+' + hexCode + ')';
}

// Show Unicode info popup on long-press
function showUnicodeInfoPopup(keyBtn) {
  const char = keyBtn.dataset.char;
  // Use actual displayed character's code point, not stored base code
  const code = char.codePointAt(0);
  const baseChar = keyBtn.dataset.baseChar || char;
  const variants = accentedVariants[baseChar];
  
  // Store the original character that opened this popup
  state.popupOriginalChar = char;
  
  const popup = document.getElementById('variants-popup');
  if (!popup) return;
  
  popup.innerHTML = '';
  
  // Add close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'variants-popup-close';
  closeBtn.innerHTML = '×';
  closeBtn.title = 'Close';
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    hideVariantsPopup();
  });
  popup.appendChild(closeBtn);
  
  // Unicode info section
  const infoSection = document.createElement('div');
  infoSection.className = 'unicode-info-section';
  
  const hexCode = code.toString(16).toUpperCase().padStart(4, '0');
  const charName = getUnicodeName(code);
  
  const charDisplay = document.createElement('div');
  charDisplay.className = 'unicode-info-char';
  charDisplay.textContent = char;
  charDisplay.title = 'Click to insert';
  charDisplay.addEventListener('click', () => {
    addToOutput(char, isLetter(char));
    hideVariantsPopup();
  });
  infoSection.appendChild(charDisplay);
  
  const details = document.createElement('div');
  details.className = 'unicode-info-details';
  details.innerHTML = `
    <div class="unicode-info-row"><span class="info-label">U+</span><span class="info-value">${hexCode}</span></div>
    <div class="unicode-info-row"><span class="info-label">Hex:</span><span class="info-value">0x${hexCode}</span></div>
    <div class="unicode-info-row"><span class="info-label">Dec:</span><span class="info-value">${code}</span></div>
    <div class="unicode-info-row unicode-info-name"><span class="info-value">${charName}</span></div>
  `;
  infoSection.appendChild(details);
  
  popup.appendChild(infoSection);
  
  // Variants section (if any)
  if (variants && variants.length > 0) {
    const variantsSection = document.createElement('div');
    variantsSection.className = 'variants-section';
    
    const variantsTitle = document.createElement('div');
    variantsTitle.className = 'variants-title';
    variantsTitle.textContent = 'Variants';
    variantsSection.appendChild(variantsTitle);
    
    const grid = document.createElement('div');
    grid.className = 'variants-grid';
    
    variants.forEach(v => {
      const vCode = v.codePointAt(0);
      const vHex = vCode.toString(16).toUpperCase().padStart(4, '0');
      
      const btn = document.createElement('button');
      btn.className = 'variant-key';
      btn.dataset.char = v;
      btn.title = `U+${vHex}`;
      
      const charSpan = document.createElement('span');
      charSpan.className = 'key-char';
      charSpan.textContent = v;
      btn.appendChild(charSpan);
      
      grid.appendChild(btn);
    });
    
    variantsSection.appendChild(grid);
    popup.appendChild(variantsSection);
  }
  
  // Position popup near the key using fixed positioning
  const rect = keyBtn.getBoundingClientRect();
  positionPopupNearElement(popup, rect);
}

// Show Unicode info popup for a character (used for variants long-press)
// When viewing a variant, show the original character's variants with original first
function showUnicodeInfoPopupForChar(char) {
  const code = char.codePointAt(0);
  
  // Use the original character's variants, not the current variant's
  const originalChar = state.popupOriginalChar || char;
  const originalVariants = accentedVariants[originalChar] || [];
  
  // Build the list: original char first, then all variants (excluding current char)
  const allChars = [originalChar, ...originalVariants.filter(v => v !== originalChar)];
  
  const popup = document.getElementById('variants-popup');
  if (!popup) return;
  
  popup.innerHTML = '';
  
  // Add close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'variants-popup-close';
  closeBtn.innerHTML = '×';
  closeBtn.title = 'Close';
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    hideVariantsPopup();
  });
  popup.appendChild(closeBtn);
  
  // Unicode info section for current character
  const infoSection = document.createElement('div');
  infoSection.className = 'unicode-info-section';
  
  const hexCode = code.toString(16).toUpperCase().padStart(4, '0');
  const charName = getUnicodeName(code);
  
  const charDisplay = document.createElement('div');
  charDisplay.className = 'unicode-info-char';
  charDisplay.textContent = char;
  charDisplay.title = 'Click to insert';
  charDisplay.addEventListener('click', () => {
    addToOutput(char, isLetter(char));
    hideVariantsPopup();
  });
  infoSection.appendChild(charDisplay);
  
  const details = document.createElement('div');
  details.className = 'unicode-info-details';
  details.innerHTML = `
    <div class="unicode-info-row"><span class="info-label">U+</span><span class="info-value">${hexCode}</span></div>
    <div class="unicode-info-row"><span class="info-label">Hex:</span><span class="info-value">0x${hexCode}</span></div>
    <div class="unicode-info-row"><span class="info-label">Dec:</span><span class="info-value">${code}</span></div>
    <div class="unicode-info-row unicode-info-name"><span class="info-value">${charName}</span></div>
  `;
  infoSection.appendChild(details);
  
  popup.appendChild(infoSection);
  
  // Variants section - always show if original had variants
  if (allChars.length > 1) {
    const variantsSection = document.createElement('div');
    variantsSection.className = 'variants-section';
    
    const variantsTitle = document.createElement('div');
    variantsTitle.className = 'variants-title';
    variantsTitle.textContent = 'Variants';
    variantsSection.appendChild(variantsTitle);
    
    const grid = document.createElement('div');
    grid.className = 'variants-grid';
    
    allChars.forEach(v => {
      // Skip the current character being displayed
      if (v === char) return;
      
      const vCode = v.codePointAt(0);
      const vHex = vCode.toString(16).toUpperCase().padStart(4, '0');
      
      const btn = document.createElement('button');
      btn.className = 'variant-key';
      btn.dataset.char = v;
      btn.title = `U+${vHex}`;
      
      const charSpan = document.createElement('span');
      charSpan.className = 'key-char';
      charSpan.textContent = v;
      btn.appendChild(charSpan);
      
      grid.appendChild(btn);
    });
    
    variantsSection.appendChild(grid);
    popup.appendChild(variantsSection);
  }
  
  // Recalculate popup position after content change
  popup.style.position = 'fixed';
  popup.style.display = 'block';
  
  // Get popup dimensions and recalculate position
  const popupRect = popup.getBoundingClientRect();
  let top = parseFloat(popup.style.top) || 100;
  let left = parseFloat(popup.style.left) || 100;
  
  // Ensure popup stays within viewport
  if (left + popupRect.width > window.innerWidth - 10) {
    left = window.innerWidth - popupRect.width - 10;
  }
  if (left < 10) left = 10;
  
  if (top + popupRect.height > window.innerHeight - 10) {
    top = window.innerHeight - popupRect.height - 10;
  }
  if (top < 10) top = 10;
  
  popup.style.top = `${top}px`;
  popup.style.left = `${left}px`;
}

// Helper function to position popup near an element
function positionPopupNearElement(popup, rect) {
  popup.style.position = 'fixed';
  popup.style.display = 'block';
  
  // Try to position below the key first
  let top = rect.bottom + 5;
  let left = rect.left;
  
  // Get popup dimensions after it's visible
  const popupRect = popup.getBoundingClientRect();
  
  // Ensure popup stays within viewport horizontally
  if (left + popupRect.width > window.innerWidth - 10) {
    left = window.innerWidth - popupRect.width - 10;
  }
  if (left < 10) {
    left = 10;
  }
  
  // Ensure popup stays within viewport vertically
  // If not enough space below, position above the key
  if (top + popupRect.height > window.innerHeight - 10) {
    top = rect.top - popupRect.height - 5;
  }
  if (top < 10) {
    top = 10;
  }
  
  popup.style.left = `${left}px`;
  popup.style.top = `${top}px`;
}
