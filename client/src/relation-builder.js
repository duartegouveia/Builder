import './styles.css';

const COLUMN_TYPES = ['boolean', 'string', 'multilinestring', 'int', 'float', 'date', 'datetime', 'time'];

// State management
let state = {
  relation: null,
  columnNames: [],
  columnTypes: [],
  editable: true,
  
  // Pagination
  pageSize: 20,
  currentPage: 1,
  
  // Selection
  selectedRows: new Set(),
  
  // Sorting
  sortCriteria: [], // [{column: idx, direction: 'asc'|'desc'}]
  
  // Filtering
  filters: {}, // {columnIdx: {type: 'values'|'criteria', values: [], criteria: {}}}
  
  // Conditional formatting
  formatting: {}, // {columnIdx: [{condition: {}, style: {}}]}
  
  // Computed
  filteredIndices: [],
  sortedIndices: []
};

function generateRandomString(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateRandomValue(type) {
  switch (type) {
    case 'boolean':
      return Math.random() > 0.5;
    case 'string':
      const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Iris', 'Jack'];
      return names[Math.floor(Math.random() * names.length)] + '_' + generateRandomString(4);
    case 'multilinestring':
      const lines = Math.floor(Math.random() * 3) + 1;
      let text = '';
      for (let i = 0; i < lines; i++) {
        text += 'Line ' + (i + 1) + ': ' + generateRandomString(12) + '\n';
      }
      return text.trim();
    case 'int':
      return Math.floor(Math.random() * 1000) - 500;
    case 'float':
      return parseFloat((Math.random() * 1000 - 500).toFixed(3));
    case 'date':
      const d = new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000));
      return d.toISOString().split('T')[0];
    case 'datetime':
      const dt = new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000));
      return dt.toISOString().replace('T', ' ').substring(0, 19);
    case 'time':
      const h = String(Math.floor(Math.random() * 24)).padStart(2, '0');
      const m = String(Math.floor(Math.random() * 60)).padStart(2, '0');
      const s = String(Math.floor(Math.random() * 60)).padStart(2, '0');
      return `${h}:${m}:${s}`;
    default:
      return null;
  }
}

function generateDemoRelation() {
  const columns = {
    id: 'int',
    name: 'string',
    active: 'boolean',
    score: 'float',
    birth_date: 'date',
    created_at: 'datetime',
    start_time: 'time',
    notes: 'multilinestring'
  };
  
  const columnTypes = Object.values(columns);
  const items = [];
  for (let i = 0; i < 50; i++) {
    const row = columnTypes.map((type, idx) => {
      if (idx === 0) return i + 1;
      if (Math.random() < 0.05) return null; // 5% nulls
      return generateRandomValue(type);
    });
    items.push(row);
  }
  
  return {
    pot: 'relation',
    columns: columns,
    items: items
  };
}

function parseRelation(jsonStr) {
  try {
    const data = JSON.parse(jsonStr);
    if (data.pot !== 'relation') {
      throw new Error('Invalid relation: pot must be "relation"');
    }
    if (typeof data.columns !== 'object' || data.columns === null) {
      throw new Error('Invalid relation: columns must be an object');
    }
    if (!Array.isArray(data.items)) {
      throw new Error('Invalid relation: items must be an array');
    }
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// Filtering functions
function applyFilters() {
  const items = state.relation.items;
  state.filteredIndices = [];
  
  for (let i = 0; i < items.length; i++) {
    let passes = true;
    
    for (const [colIdxStr, filter] of Object.entries(state.filters)) {
      const colIdx = parseInt(colIdxStr);
      const value = items[i][colIdx];
      
      if (filter.type === 'indices') {
        if (!filter.indices.has(i)) {
          passes = false;
          break;
        }
      } else if (filter.type === 'values') {
        // Handle null values comparison
        const matches = filter.values.some(v => {
          if (v === null) return value === null;
          if (value === null) return false;
          return String(v) === String(value);
        });
        if (!matches) {
          passes = false;
          break;
        }
      } else if (filter.type === 'criteria') {
        if (!matchesCriteria(value, filter.criteria, colIdx)) {
          passes = false;
          break;
        }
      }
    }
    
    if (passes) {
      state.filteredIndices.push(i);
    }
  }
}

function matchesCriteria(value, criteria, colIdx) {
  const type = state.columnTypes[colIdx];
  
  if (criteria.nullOnly) {
    return value === null || value === undefined;
  }
  if (criteria.notNull) {
    return value !== null && value !== undefined;
  }
  if (criteria.top !== undefined) {
    return true; // Handled in sorting
  }
  if (criteria.min !== undefined && value < criteria.min) return false;
  if (criteria.max !== undefined && value > criteria.max) return false;
  if (criteria.contains && typeof value === 'string') {
    return value.toLowerCase().includes(criteria.contains.toLowerCase());
  }
  
  return true;
}

// Sorting functions
function applySorting() {
  state.sortedIndices = [...state.filteredIndices];
  
  if (state.sortCriteria.length === 0) return;
  
  state.sortedIndices.sort((a, b) => {
    const rowA = state.relation.items[a];
    const rowB = state.relation.items[b];
    
    for (const criterion of state.sortCriteria) {
      const valA = rowA[criterion.column];
      const valB = rowB[criterion.column];
      
      let cmp = compareValues(valA, valB, state.columnTypes[criterion.column]);
      if (criterion.direction === 'desc') cmp = -cmp;
      
      if (cmp !== 0) return cmp;
    }
    return 0;
  });
}

function compareValues(a, b, type) {
  if (a === null || a === undefined) return b === null || b === undefined ? 0 : 1;
  if (b === null || b === undefined) return -1;
  
  if (type === 'int' || type === 'float') {
    return a - b;
  }
  if (type === 'boolean') {
    return (a ? 1 : 0) - (b ? 1 : 0);
  }
  if (type === 'date' || type === 'datetime' || type === 'time') {
    return String(a).localeCompare(String(b));
  }
  return String(a).localeCompare(String(b));
}

// Statistics functions
function calculateStatistics(colIdx) {
  const values = state.relation.items
    .map(row => row[colIdx])
    .filter(v => v !== null && v !== undefined);
  
  const type = state.columnTypes[colIdx];
  const total = state.relation.items.length;
  const nonNull = values.length;
  const nullCount = total - nonNull;
  
  const stats = {
    total,
    nonNull,
    nullCount,
    nullPercent: ((nullCount / total) * 100).toFixed(1)
  };
  
  if (type === 'int' || type === 'float') {
    const nums = values.map(Number).filter(n => !isNaN(n));
    if (nums.length > 0) {
      nums.sort((a, b) => a - b);
      
      stats.min = Math.min(...nums);
      stats.max = Math.max(...nums);
      stats.sum = nums.reduce((a, b) => a + b, 0);
      stats.mean = stats.sum / nums.length;
      
      // Median
      const mid = Math.floor(nums.length / 2);
      stats.median = nums.length % 2 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
      
      // Mode
      const freq = {};
      nums.forEach(n => freq[n] = (freq[n] || 0) + 1);
      const maxFreq = Math.max(...Object.values(freq));
      stats.mode = Object.keys(freq).filter(k => freq[k] === maxFreq).map(Number);
      
      // Variance and Std Dev
      const variance = nums.reduce((sum, n) => sum + Math.pow(n - stats.mean, 2), 0) / nums.length;
      stats.variance = variance;
      stats.stdDev = Math.sqrt(variance);
      
      // Quartiles
      const q1Idx = Math.floor(nums.length * 0.25);
      const q3Idx = Math.floor(nums.length * 0.75);
      stats.q1 = nums[q1Idx];
      stats.q3 = nums[q3Idx];
      stats.iqr = stats.q3 - stats.q1;
      
      // Skewness
      const n = nums.length;
      if (n >= 3 && stats.stdDev > 0) {
        const m3 = nums.reduce((sum, x) => sum + Math.pow(x - stats.mean, 3), 0) / n;
        stats.skewness = m3 / Math.pow(stats.stdDev, 3);
      }
      
      // Kurtosis
      if (n >= 4 && stats.stdDev > 0) {
        const m4 = nums.reduce((sum, x) => sum + Math.pow(x - stats.mean, 4), 0) / n;
        stats.kurtosis = m4 / Math.pow(stats.stdDev, 4) - 3;
      }
      
      // Range
      stats.range = stats.max - stats.min;
    }
  } else if (type === 'string' || type === 'multilinestring') {
    const freq = {};
    values.forEach(v => freq[v] = (freq[v] || 0) + 1);
    stats.uniqueCount = Object.keys(freq).length;
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    stats.topValues = sorted.slice(0, 5);
  } else if (type === 'boolean') {
    const trueCount = values.filter(v => v === true).length;
    stats.trueCount = trueCount;
    stats.falseCount = nonNull - trueCount;
    stats.truePercent = ((trueCount / nonNull) * 100).toFixed(1);
  } else if (type === 'date' || type === 'datetime') {
    const dates = values.map(v => new Date(v)).filter(d => !isNaN(d));
    if (dates.length > 0) {
      dates.sort((a, b) => a - b);
      stats.min = dates[0].toISOString().split('T')[0];
      stats.max = dates[dates.length - 1].toISOString().split('T')[0];
    }
  }
  
  return stats;
}

// Pagination functions
function getTotalPages() {
  if (state.pageSize === 'all') return 1;
  return Math.ceil(state.sortedIndices.length / state.pageSize);
}

function getCurrentPageIndices() {
  if (state.pageSize === 'all') {
    return state.sortedIndices;
  }
  const start = (state.currentPage - 1) * state.pageSize;
  const end = start + state.pageSize;
  return state.sortedIndices.slice(start, end);
}

// Selection functions
function updateHeaderCheckbox() {
  const headerCheckbox = document.getElementById('select-all-checkbox');
  if (!headerCheckbox) return;
  
  const pageIndices = getCurrentPageIndices();
  const selectedInPage = pageIndices.filter(i => state.selectedRows.has(i)).length;
  
  if (selectedInPage === 0) {
    headerCheckbox.checked = false;
    headerCheckbox.indeterminate = false;
  } else if (selectedInPage === pageIndices.length) {
    headerCheckbox.checked = true;
    headerCheckbox.indeterminate = false;
  } else {
    headerCheckbox.checked = false;
    headerCheckbox.indeterminate = true;
  }
}

function toggleSelectAll() {
  const pageIndices = getCurrentPageIndices();
  const allSelected = pageIndices.every(i => state.selectedRows.has(i));
  
  if (allSelected) {
    pageIndices.forEach(i => state.selectedRows.delete(i));
  } else {
    pageIndices.forEach(i => state.selectedRows.add(i));
  }
  
  renderTable();
}

function invertSelection(pageOnly = false) {
  const indices = pageOnly ? getCurrentPageIndices() : state.sortedIndices;
  
  indices.forEach(i => {
    if (state.selectedRows.has(i)) {
      state.selectedRows.delete(i);
    } else {
      state.selectedRows.add(i);
    }
  });
  
  renderTable();
}

// Render functions
function createInputForType(type, value, rowIdx, colIdx, editable) {
  const wrapper = document.createElement('div');
  wrapper.className = 'relation-cell-input';
  
  if (!editable) {
    const span = document.createElement('span');
    span.className = 'relation-cell-readonly';
    if (type === 'boolean') {
      span.textContent = value === null ? '—' : (value ? '✓' : '✗');
      span.className += value === null ? ' relation-bool-null' : (value ? ' relation-bool-true' : ' relation-bool-false');
    } else if (type === 'multilinestring') {
      span.className = 'relation-cell-multiline';
      span.textContent = value || '—';
    } else {
      span.textContent = value !== null && value !== undefined ? String(value) : '—';
    }
    wrapper.appendChild(span);
    return wrapper;
  }
  
  if (type === 'boolean') {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = value === true || value === 'true';
    checkbox.dataset.row = rowIdx;
    checkbox.dataset.col = colIdx;
    checkbox.className = 'relation-checkbox';
    wrapper.appendChild(checkbox);
  } else if (type === 'multilinestring') {
    const textarea = document.createElement('textarea');
    textarea.value = value || '';
    textarea.dataset.row = rowIdx;
    textarea.dataset.col = colIdx;
    textarea.className = 'relation-textarea';
    textarea.rows = 2;
    wrapper.appendChild(textarea);
  } else {
    const input = document.createElement('input');
    input.type = getInputType(type);
    input.value = formatValueForInput(type, value);
    input.dataset.row = rowIdx;
    input.dataset.col = colIdx;
    input.className = 'relation-input';
    if (type === 'int' || type === 'float') {
      input.step = type === 'float' ? '0.001' : '1';
    }
    wrapper.appendChild(input);
  }
  
  return wrapper;
}

function getInputType(type) {
  switch (type) {
    case 'int':
    case 'float':
      return 'number';
    case 'date':
      return 'date';
    case 'datetime':
      return 'datetime-local';
    case 'time':
      return 'time';
    default:
      return 'text';
  }
}

function formatValueForInput(type, value) {
  if (value === null || value === undefined) return '';
  if (type === 'datetime' && typeof value === 'string') {
    return value.replace(' ', 'T');
  }
  return String(value);
}

function getSortIndicator(colIdx) {
  const criterion = state.sortCriteria.find(c => c.column === colIdx);
  if (!criterion) return '';
  
  const priority = state.sortCriteria.length > 1 ? `<span class="sort-priority">${state.sortCriteria.indexOf(criterion) + 1}</span>` : '';
  const arrow = criterion.direction === 'asc' ? '↑' : '↓';
  return `<span class="sort-indicator">${arrow}${priority}</span>`;
}

function applyConditionalFormatting(value, colIdx, cell) {
  const rules = state.formatting[colIdx];
  if (!rules || rules.length === 0) return;
  
  const type = state.columnTypes[colIdx];
  
  for (const rule of rules) {
    if (matchesFormattingCondition(value, rule.condition, type)) {
      if (rule.style.color) cell.style.color = rule.style.color;
      if (rule.style.backgroundColor) cell.style.backgroundColor = rule.style.backgroundColor;
      if (rule.style.fontWeight) cell.style.fontWeight = rule.style.fontWeight;
      if (rule.style.fontStyle) cell.style.fontStyle = rule.style.fontStyle;
      
      if (rule.style.dataBar && (type === 'int' || type === 'float')) {
        const stats = calculateStatistics(colIdx);
        if (stats.min !== undefined && stats.max !== undefined && stats.max !== stats.min) {
          const percent = ((value - stats.min) / (stats.max - stats.min)) * 100;
          cell.style.background = `linear-gradient(to right, ${rule.style.dataBar} ${percent}%, transparent ${percent}%)`;
        }
      }
      
      if (rule.style.icon) {
        const iconSpan = document.createElement('span');
        iconSpan.className = 'format-icon';
        iconSpan.textContent = rule.style.icon;
        cell.insertBefore(iconSpan, cell.firstChild);
      }
    }
  }
}

function matchesFormattingCondition(value, condition, type) {
  if (condition.equals !== undefined) return value === condition.equals;
  if (condition.gt !== undefined && value <= condition.gt) return false;
  if (condition.gte !== undefined && value < condition.gte) return false;
  if (condition.lt !== undefined && value >= condition.lt) return false;
  if (condition.lte !== undefined && value > condition.lte) return false;
  if (condition.isNull) return value === null || value === undefined;
  if (condition.isNotNull) return value !== null && value !== undefined;
  if (condition.contains && typeof value === 'string') {
    return value.toLowerCase().includes(condition.contains.toLowerCase());
  }
  return true;
}

function renderPagination() {
  const container = document.getElementById('relation-pagination');
  if (!container) return;
  
  const totalPages = getTotalPages();
  const totalRecords = state.sortedIndices.length;
  
  container.innerHTML = `
    <div class="pagination-info">
      <span>${totalRecords} records</span>
      <span class="pagination-selected">${state.selectedRows.size} selected</span>
    </div>
    <div class="pagination-size">
      <label>Per page:</label>
      <select id="page-size-select">
        <option value="20" ${state.pageSize === 20 ? 'selected' : ''}>20</option>
        <option value="50" ${state.pageSize === 50 ? 'selected' : ''}>50</option>
        <option value="100" ${state.pageSize === 100 ? 'selected' : ''}>100</option>
        <option value="all" ${state.pageSize === 'all' ? 'selected' : ''}>All</option>
      </select>
    </div>
    <div class="pagination-nav">
      <button class="btn-page" id="btn-first" ${state.currentPage === 1 ? 'disabled' : ''}>⟨⟨</button>
      <button class="btn-page" id="btn-prev" ${state.currentPage === 1 ? 'disabled' : ''}>⟨</button>
      <span class="page-indicator">
        <input type="number" id="page-input" value="${state.currentPage}" min="1" max="${totalPages}" />
        <span>of ${totalPages}</span>
      </span>
      <button class="btn-page" id="btn-next" ${state.currentPage >= totalPages ? 'disabled' : ''}>⟩</button>
      <button class="btn-page" id="btn-last" ${state.currentPage >= totalPages ? 'disabled' : ''}>⟩⟩</button>
    </div>
    <div class="pagination-actions">
      <button class="btn btn-sm btn-outline" id="btn-invert-page">Invert Page</button>
      <button class="btn btn-sm btn-outline" id="btn-invert-all">Invert All</button>
    </div>
  `;
  
  // Event listeners
  document.getElementById('page-size-select').addEventListener('change', (e) => {
    state.pageSize = e.target.value === 'all' ? 'all' : parseInt(e.target.value);
    state.currentPage = 1;
    renderTable();
  });
  
  document.getElementById('btn-first').addEventListener('click', () => {
    state.currentPage = 1;
    renderTable();
  });
  
  document.getElementById('btn-prev').addEventListener('click', () => {
    if (state.currentPage > 1) {
      state.currentPage--;
      renderTable();
    }
  });
  
  document.getElementById('btn-next').addEventListener('click', () => {
    if (state.currentPage < getTotalPages()) {
      state.currentPage++;
      renderTable();
    }
  });
  
  document.getElementById('btn-last').addEventListener('click', () => {
    state.currentPage = getTotalPages();
    renderTable();
  });
  
  document.getElementById('page-input').addEventListener('change', (e) => {
    const page = parseInt(e.target.value);
    if (page >= 1 && page <= getTotalPages()) {
      state.currentPage = page;
      renderTable();
    }
  });
  
  document.getElementById('btn-invert-page').addEventListener('click', () => invertSelection(true));
  document.getElementById('btn-invert-all').addEventListener('click', () => invertSelection(false));
}

function renderTable() {
  const container = document.getElementById('relation-table-container');
  container.innerHTML = '';
  
  if (!state.relation || !state.relation.columns || !state.relation.items) {
    container.innerHTML = '<p class="text-muted-foreground">No data to display</p>';
    return;
  }
  
  // Apply filters and sorting
  applyFilters();
  applySorting();
  
  const pageIndices = getCurrentPageIndices();
  
  const tableWrapper = document.createElement('div');
  tableWrapper.className = 'relation-table-wrapper';
  
  const table = document.createElement('table');
  table.className = 'relation-table';
  if (!state.editable) {
    table.classList.add('relation-table-readonly');
  }
  
  // Header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  
  // Selection checkbox column
  const selectTh = document.createElement('th');
  selectTh.className = 'relation-th-select';
  selectTh.innerHTML = `<input type="checkbox" id="select-all-checkbox" />`;
  headerRow.appendChild(selectTh);
  
  // Index column
  const indexTh = document.createElement('th');
  indexTh.textContent = '#';
  indexTh.className = 'relation-th-index';
  headerRow.appendChild(indexTh);
  
  // Data columns
  state.columnNames.forEach((name, idx) => {
    const th = document.createElement('th');
    th.className = 'relation-th-sortable';
    th.dataset.col = idx;
    const type = state.columnTypes[idx];
    const sortIndicator = getSortIndicator(idx);
    const filterActive = state.filters[idx] ? ' filter-active' : '';
    th.innerHTML = `
      <div class="relation-th-content${filterActive}">
        <span class="relation-col-name">${name}${sortIndicator}</span>
        <span class="relation-col-type">${type}</span>
      </div>
    `;
    headerRow.appendChild(th);
  });
  
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  // Body
  const tbody = document.createElement('tbody');
  
  pageIndices.forEach((rowIdx) => {
    const row = state.relation.items[rowIdx];
    const tr = document.createElement('tr');
    tr.dataset.rowIdx = rowIdx;
    
    if (state.selectedRows.has(rowIdx)) {
      tr.classList.add('row-selected');
    }
    
    // Selection checkbox
    const selectTd = document.createElement('td');
    selectTd.className = 'relation-td-select';
    const selectCheckbox = document.createElement('input');
    selectCheckbox.type = 'checkbox';
    selectCheckbox.checked = state.selectedRows.has(rowIdx);
    selectCheckbox.dataset.rowIdx = rowIdx;
    selectCheckbox.className = 'row-select-checkbox';
    selectTd.appendChild(selectCheckbox);
    tr.appendChild(selectTd);
    
    // Index
    const indexTd = document.createElement('td');
    indexTd.textContent = rowIdx + 1;
    indexTd.className = 'relation-td-index';
    tr.appendChild(indexTd);
    
    // Data cells
    row.forEach((value, colIdx) => {
      const td = document.createElement('td');
      const type = state.columnTypes[colIdx];
      td.appendChild(createInputForType(type, value, rowIdx, colIdx, state.editable));
      applyConditionalFormatting(value, colIdx, td);
      tr.appendChild(td);
    });
    
    tbody.appendChild(tr);
  });
  
  table.appendChild(tbody);
  
  // Footer with statistics
  const tfoot = document.createElement('tfoot');
  const footerRow = document.createElement('tr');
  
  footerRow.appendChild(document.createElement('td')); // Select column
  footerRow.appendChild(document.createElement('td')); // Index column
  
  state.columnNames.forEach((_, colIdx) => {
    const td = document.createElement('td');
    td.className = 'relation-td-stats';
    td.innerHTML = `<button class="btn-stats" data-col="${colIdx}">Σ Stats</button>`;
    footerRow.appendChild(td);
  });
  
  tfoot.appendChild(footerRow);
  table.appendChild(tfoot);
  
  tableWrapper.appendChild(table);
  container.appendChild(tableWrapper);
  
  // Pagination
  const paginationDiv = document.createElement('div');
  paginationDiv.id = 'relation-pagination';
  paginationDiv.className = 'relation-pagination';
  container.appendChild(paginationDiv);
  renderPagination();
  
  // Update header checkbox state
  updateHeaderCheckbox();
  
  // Attach event listeners
  attachTableEventListeners();
}

function attachTableEventListeners() {
  // Header click for sorting
  document.querySelectorAll('.relation-th-sortable').forEach(th => {
    th.addEventListener('click', (e) => {
      const colIdx = parseInt(th.dataset.col);
      handleSort(colIdx, e.shiftKey);
    });
    
    th.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      const colIdx = parseInt(th.dataset.col);
      showColumnMenu(colIdx, e.clientX, e.clientY);
    });
  });
  
  // Select all checkbox
  document.getElementById('select-all-checkbox')?.addEventListener('click', toggleSelectAll);
  
  // Row selection
  document.querySelectorAll('.row-select-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const rowIdx = parseInt(e.target.dataset.rowIdx);
      if (e.target.checked) {
        state.selectedRows.add(rowIdx);
      } else {
        state.selectedRows.delete(rowIdx);
      }
      updateHeaderCheckbox();
      renderPagination();
      e.target.closest('tr').classList.toggle('row-selected', e.target.checked);
    });
  });
  
  // Statistics buttons
  document.querySelectorAll('.btn-stats').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const colIdx = parseInt(e.target.dataset.col);
      showStatisticsPanel(colIdx);
    });
  });
  
  // Cell editing
  document.getElementById('relation-table-container').addEventListener('change', (e) => {
    if (e.target.matches('.relation-input, .relation-textarea, .relation-checkbox')) {
      updateRelationFromInput(e.target);
    }
  });
}

function handleSort(colIdx, addToExisting) {
  const existingIdx = state.sortCriteria.findIndex(c => c.column === colIdx);
  
  if (existingIdx >= 0) {
    const existing = state.sortCriteria[existingIdx];
    if (existing.direction === 'asc') {
      existing.direction = 'desc';
    } else {
      state.sortCriteria.splice(existingIdx, 1);
    }
  } else {
    if (!addToExisting) {
      state.sortCriteria = [];
    }
    state.sortCriteria.push({ column: colIdx, direction: 'asc' });
  }
  
  renderTable();
}

function showColumnMenu(colIdx, x, y) {
  closeAllMenus();
  
  const menu = document.createElement('div');
  menu.className = 'column-menu';
  menu.style.left = x + 'px';
  menu.style.top = y + 'px';
  
  const type = state.columnTypes[colIdx];
  const name = state.columnNames[colIdx];
  
  menu.innerHTML = `
    <div class="column-menu-header">${name} (${type})</div>
    <div class="column-menu-section">
      <div class="column-menu-title">Sort</div>
      <button class="column-menu-item" data-action="sort-asc">↑ Ascending</button>
      <button class="column-menu-item" data-action="sort-desc">↓ Descending</button>
      <button class="column-menu-item" data-action="sort-clear">✕ Clear Sort</button>
    </div>
    <div class="column-menu-section">
      <div class="column-menu-title">Filter</div>
      <button class="column-menu-item" data-action="filter-values">By Values...</button>
      <button class="column-menu-item" data-action="filter-null">Only Null</button>
      <button class="column-menu-item" data-action="filter-not-null">Not Null</button>
      ${type === 'int' || type === 'float' ? `
        <button class="column-menu-item" data-action="filter-top10">Top 10</button>
        <button class="column-menu-item" data-action="filter-top10p">Top 10%</button>
      ` : ''}
      <button class="column-menu-item" data-action="filter-clear">✕ Clear Filter</button>
    </div>
    <div class="column-menu-section">
      <div class="column-menu-title">Conditional Formatting</div>
      <button class="column-menu-item" data-action="format-databar">Data Bar</button>
      <button class="column-menu-item" data-action="format-color-scale">Color Scale</button>
      <button class="column-menu-item" data-action="format-clear">✕ Clear Formatting</button>
    </div>
  `;
  
  document.body.appendChild(menu);
  
  menu.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    if (!action) return;
    
    handleColumnMenuAction(colIdx, action);
    menu.remove();
  });
  
  document.addEventListener('click', function closeMenu(e) {
    if (!menu.contains(e.target)) {
      menu.remove();
      document.removeEventListener('click', closeMenu);
    }
  }, { once: false });
}

function handleColumnMenuAction(colIdx, action) {
  switch (action) {
    case 'sort-asc':
      state.sortCriteria = [{ column: colIdx, direction: 'asc' }];
      break;
    case 'sort-desc':
      state.sortCriteria = [{ column: colIdx, direction: 'desc' }];
      break;
    case 'sort-clear':
      state.sortCriteria = state.sortCriteria.filter(c => c.column !== colIdx);
      break;
    case 'filter-values':
      showFilterValuesDialog(colIdx);
      return;
    case 'filter-null':
      state.filters[colIdx] = { type: 'criteria', criteria: { nullOnly: true } };
      break;
    case 'filter-not-null':
      state.filters[colIdx] = { type: 'criteria', criteria: { notNull: true } };
      break;
    case 'filter-top10':
      applyTopFilter(colIdx, 10, false);
      break;
    case 'filter-top10p':
      applyTopFilter(colIdx, 10, true);
      break;
    case 'filter-clear':
      delete state.filters[colIdx];
      break;
    case 'format-databar':
      state.formatting[colIdx] = [{ condition: {}, style: { dataBar: 'var(--primary-200)' } }];
      break;
    case 'format-color-scale':
      applyColorScale(colIdx);
      break;
    case 'format-clear':
      delete state.formatting[colIdx];
      break;
  }
  
  state.currentPage = 1;
  renderTable();
}

function applyTopFilter(colIdx, n, isPercent) {
  const values = state.relation.items
    .map((row, idx) => ({ value: row[colIdx], idx }))
    .filter(item => item.value !== null && item.value !== undefined)
    .sort((a, b) => b.value - a.value);
  
  const count = isPercent ? Math.ceil(values.length * n / 100) : Math.min(n, values.length);
  const topIndices = new Set(values.slice(0, count).map(item => item.idx));
  
  // Use indices-based filter for accuracy with duplicates
  state.filters[colIdx] = { type: 'indices', indices: topIndices };
}

function applyColorScale(colIdx) {
  const stats = calculateStatistics(colIdx);
  if (stats.min === undefined || stats.max === undefined) return;
  
  const range = stats.max - stats.min;
  if (range === 0) return;
  
  const rules = [];
  const steps = 5;
  const colors = ['#f87171', '#fb923c', '#facc15', '#a3e635', '#4ade80'];
  
  for (let i = 0; i < steps; i++) {
    const minVal = stats.min + (range / steps) * i;
    const maxVal = stats.min + (range / steps) * (i + 1);
    rules.push({
      condition: { gte: minVal, lt: maxVal },
      style: { backgroundColor: colors[i] }
    });
  }
  
  state.formatting[colIdx] = rules;
}

function showFilterValuesDialog(colIdx) {
  closeAllMenus();
  
  const values = [...new Set(state.relation.items.map(row => row[colIdx]))];
  const currentFilter = state.filters[colIdx];
  const selectedValues = currentFilter?.type === 'values' ? new Set(currentFilter.values) : new Set(values);
  
  const dialog = document.createElement('div');
  dialog.className = 'filter-dialog';
  
  let valuesHtml = values.map(v => {
    const label = v === null ? '(null)' : String(v).substring(0, 50);
    const checked = selectedValues.has(v) ? 'checked' : '';
    return `<label class="filter-value-item"><input type="checkbox" value="${v === null ? '__null__' : v}" ${checked}><span>${label}</span></label>`;
  }).join('');
  
  dialog.innerHTML = `
    <div class="filter-dialog-header">
      <span>Filter: ${state.columnNames[colIdx]}</span>
      <button class="btn-close-dialog">✕</button>
    </div>
    <div class="filter-dialog-actions">
      <button class="btn btn-sm" id="filter-select-all">Select All</button>
      <button class="btn btn-sm" id="filter-select-none">Select None</button>
    </div>
    <div class="filter-values-list">${valuesHtml}</div>
    <div class="filter-dialog-footer">
      <button class="btn btn-outline" id="filter-cancel">Cancel</button>
      <button class="btn btn-primary" id="filter-apply">Apply</button>
    </div>
  `;
  
  document.body.appendChild(dialog);
  
  dialog.querySelector('.btn-close-dialog').addEventListener('click', () => dialog.remove());
  dialog.querySelector('#filter-cancel').addEventListener('click', () => dialog.remove());
  
  dialog.querySelector('#filter-select-all').addEventListener('click', () => {
    dialog.querySelectorAll('.filter-value-item input').forEach(cb => cb.checked = true);
  });
  
  dialog.querySelector('#filter-select-none').addEventListener('click', () => {
    dialog.querySelectorAll('.filter-value-item input').forEach(cb => cb.checked = false);
  });
  
  dialog.querySelector('#filter-apply').addEventListener('click', () => {
    const selected = [];
    dialog.querySelectorAll('.filter-value-item input:checked').forEach(cb => {
      selected.push(cb.value === '__null__' ? null : cb.value);
    });
    
    if (selected.length === values.length) {
      delete state.filters[colIdx];
    } else {
      state.filters[colIdx] = { type: 'values', values: selected };
    }
    
    state.currentPage = 1;
    dialog.remove();
    renderTable();
  });
}

function showStatisticsPanel(colIdx) {
  closeAllMenus();
  
  const stats = calculateStatistics(colIdx);
  const type = state.columnTypes[colIdx];
  const name = state.columnNames[colIdx];
  
  const panel = document.createElement('div');
  panel.className = 'stats-panel';
  
  let statsHtml = `
    <div class="stats-row"><span>Total Records:</span><span>${stats.total}</span></div>
    <div class="stats-row"><span>Non-null:</span><span>${stats.nonNull}</span></div>
    <div class="stats-row"><span>Null:</span><span>${stats.nullCount} (${stats.nullPercent}%)</span></div>
  `;
  
  if (type === 'int' || type === 'float') {
    statsHtml += `
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Min:</span><span>${stats.min?.toFixed(3) ?? '—'}</span></div>
      <div class="stats-row"><span>Max:</span><span>${stats.max?.toFixed(3) ?? '—'}</span></div>
      <div class="stats-row"><span>Range:</span><span>${stats.range?.toFixed(3) ?? '—'}</span></div>
      <div class="stats-row"><span>Sum:</span><span>${stats.sum?.toFixed(3) ?? '—'}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Mean:</span><span>${stats.mean?.toFixed(3) ?? '—'}</span></div>
      <div class="stats-row"><span>Median:</span><span>${stats.median?.toFixed(3) ?? '—'}</span></div>
      <div class="stats-row"><span>Mode:</span><span>${stats.mode?.slice(0, 3).join(', ') ?? '—'}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Std Dev:</span><span>${stats.stdDev?.toFixed(3) ?? '—'}</span></div>
      <div class="stats-row"><span>Variance:</span><span>${stats.variance?.toFixed(3) ?? '—'}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Q1 (25%):</span><span>${stats.q1?.toFixed(3) ?? '—'}</span></div>
      <div class="stats-row"><span>Q3 (75%):</span><span>${stats.q3?.toFixed(3) ?? '—'}</span></div>
      <div class="stats-row"><span>IQR:</span><span>${stats.iqr?.toFixed(3) ?? '—'}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Skewness:</span><span>${stats.skewness?.toFixed(3) ?? '—'}</span></div>
      <div class="stats-row"><span>Kurtosis:</span><span>${stats.kurtosis?.toFixed(3) ?? '—'}</span></div>
    `;
  } else if (type === 'boolean') {
    statsHtml += `
      <div class="stats-divider"></div>
      <div class="stats-row"><span>True:</span><span>${stats.trueCount} (${stats.truePercent}%)</span></div>
      <div class="stats-row"><span>False:</span><span>${stats.falseCount}</span></div>
    `;
  } else if (type === 'string' || type === 'multilinestring') {
    statsHtml += `
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Unique Values:</span><span>${stats.uniqueCount}</span></div>
    `;
    if (stats.topValues) {
      statsHtml += `<div class="stats-subtitle">Top Values:</div>`;
      stats.topValues.forEach(([val, count]) => {
        statsHtml += `<div class="stats-row stats-row-small"><span>${String(val).substring(0, 20)}</span><span>${count}</span></div>`;
      });
    }
  } else if (type === 'date' || type === 'datetime') {
    statsHtml += `
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Min Date:</span><span>${stats.min ?? '—'}</span></div>
      <div class="stats-row"><span>Max Date:</span><span>${stats.max ?? '—'}</span></div>
    `;
  }
  
  panel.innerHTML = `
    <div class="stats-panel-header">
      <span>Statistics: ${name}</span>
      <button class="btn-close-dialog">✕</button>
    </div>
    <div class="stats-panel-content">${statsHtml}</div>
  `;
  
  document.body.appendChild(panel);
  
  panel.querySelector('.btn-close-dialog').addEventListener('click', () => panel.remove());
  
  document.addEventListener('click', function closePanel(e) {
    if (!panel.contains(e.target) && !e.target.classList.contains('btn-stats')) {
      panel.remove();
      document.removeEventListener('click', closePanel);
    }
  });
}

function closeAllMenus() {
  document.querySelectorAll('.column-menu, .filter-dialog, .stats-panel').forEach(el => el.remove());
}

function updateRelationFromInput(input) {
  const rowIdx = parseInt(input.dataset.row);
  const colIdx = parseInt(input.dataset.col);
  const type = state.columnTypes[colIdx];
  
  let value;
  if (type === 'boolean') {
    value = input.checked;
  } else if (type === 'int') {
    value = parseInt(input.value) || 0;
  } else if (type === 'float') {
    value = parseFloat(input.value) || 0;
  } else if (type === 'datetime') {
    value = input.value.replace('T', ' ');
  } else {
    value = input.value;
  }
  
  state.relation.items[rowIdx][colIdx] = value;
  
  const textarea = document.getElementById('relation-json');
  textarea.value = JSON.stringify(state.relation, null, 2);
}

function init() {
  const textarea = document.getElementById('relation-json');
  const btnGenerate = document.getElementById('btn-generate-demo');
  const btnParse = document.getElementById('btn-parse-relation');
  
  btnGenerate.addEventListener('click', () => {
    const demo = generateDemoRelation();
    textarea.value = JSON.stringify(demo, null, 2);
  });
  
  btnParse.addEventListener('click', () => {
    const result = parseRelation(textarea.value);
    const editable = document.getElementById('relation-editable').checked;
    
    if (result.success) {
      state.relation = result.data;
      state.columnNames = Object.keys(result.data.columns);
      state.columnTypes = Object.values(result.data.columns);
      state.editable = editable;
      state.currentPage = 1;
      state.selectedRows = new Set();
      state.sortCriteria = [];
      state.filters = {};
      state.formatting = {};
      state.filteredIndices = [...Array(result.data.items.length).keys()];
      state.sortedIndices = [...state.filteredIndices];
      
      renderTable();
    } else {
      alert('Parse error: ' + result.error);
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
