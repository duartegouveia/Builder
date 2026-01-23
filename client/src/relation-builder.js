import './styles.css';

const COLUMN_TYPES = ['boolean', 'string', 'multilinestring', 'int', 'float', 'date', 'datetime', 'time', 'relation'];

// State management
let state = {
  relation: null,
  columnNames: [],
  columnTypes: [],
  editable: false,
  
  // Pagination
  pageSize: 20,
  currentPage: 1,
  
  // Selection
  selectedRows: new Set(),
  
  // Sorting
  sortCriteria: [], // [{column: idx, direction: 'asc'|'desc'}]
  
  // Filtering
  filters: {}, // {columnIdx: {type: 'values'|'criteria'|'indices', values: [], criteria: {}, indices: Set}}
  
  // Conditional formatting
  formatting: {}, // {columnIdx: [{condition: {}, style: {}}]}
  
  // Group By
  groupByColumns: [], // Column indices to group by
  groupedData: null, // Grouped data structure
  expandedGroups: new Set(), // Set of expanded group keys
  groupBySelectedValues: {}, // {columnIdx: selectedValue} - the value selected for each grouped column
  
  // Column selection (for multi-column operations)
  selectedColumns: new Set(),
  
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

function generateRandomValue(type, nestedRelationSchema = null) {
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
    case 'relation':
      if (nestedRelationSchema) {
        return generateNestedRelation(nestedRelationSchema);
      }
      return null;
    default:
      return null;
  }
}

function generateNestedRelation(schema) {
  const numRows = Math.floor(Math.random() * 4) + 1; // 1-4 rows
  const columnTypes = Object.values(schema.columns);
  const items = [];
  
  for (let i = 0; i < numRows; i++) {
    const row = columnTypes.map((type, idx) => {
      if (Math.random() < 0.1) return null; // 10% nulls
      return generateRandomValue(type);
    });
    items.push(row);
  }
  
  return {
    pot: 'relation',
    columns: schema.columns,
    items: items
  };
}

function generateDemoRelation() {
  // Define nested relation schemas (consistent across all rows)
  const ordersSchema = {
    columns: {
      order_id: 'int',
      product: 'string',
      quantity: 'int',
      price: 'float'
    }
  };
  
  const tagsSchema = {
    columns: {
      tag_name: 'string',
      priority: 'int'
    }
  };
  
  const columns = {
    id: 'int',
    name: 'string',
    active: 'boolean',
    score: 'float',
    birth_date: 'date',
    created_at: 'datetime',
    start_time: 'time',
    notes: 'multilinestring',
    orders: 'relation',
    tags: 'relation'
  };
  
  const columnKeys = Object.keys(columns);
  const columnTypes = Object.values(columns);
  const items = [];
  
  for (let i = 0; i < 50; i++) {
    const row = columnTypes.map((type, idx) => {
      const colName = columnKeys[idx];
      if (colName === 'id') return i + 1;
      if (Math.random() < 0.05) return null; // 5% nulls
      
      // Handle nested relations with their schemas
      if (type === 'relation') {
        if (colName === 'orders') {
          return generateRandomValue('relation', ordersSchema);
        } else if (colName === 'tags') {
          return generateRandomValue('relation', tagsSchema);
        }
      }
      
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
    
    // Also check group by selected values
    if (passes) {
      for (const [colIdxStr, selectedValue] of Object.entries(state.groupBySelectedValues)) {
        const colIdx = parseInt(colIdxStr);
        const value = items[i][colIdx];
        // Compare with proper null handling
        if (selectedValue === null) {
          if (value !== null) {
            passes = false;
            break;
          }
        } else if (value === null || String(value) !== String(selectedValue)) {
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

function getUniqueValuesForColumn(colIdx) {
  const values = new Set();
  state.relation.items.forEach(row => {
    values.add(row[colIdx]);
  });
  return Array.from(values).sort((a, b) => {
    if (a === null) return 1;
    if (b === null) return -1;
    return String(a).localeCompare(String(b));
  });
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
  
  // Comparison operators for numeric and date/time types
  if (criteria.comparison) {
    if (value === null || value === undefined) return false;
    
    let numValue = value;
    let compValue = criteria.value;
    let compValue2 = criteria.value2;
    
    // Convert to comparable numbers
    if (type === 'int' || type === 'float') {
      numValue = Number(value);
      compValue = Number(compValue);
      if (compValue2 !== undefined) compValue2 = Number(compValue2);
    } else if (type === 'date' || type === 'datetime') {
      numValue = new Date(value).getTime();
      compValue = new Date(compValue).getTime();
      if (compValue2 !== undefined) compValue2 = new Date(compValue2).getTime();
    } else if (type === 'time') {
      numValue = parseTimeToMs(value);
      compValue = parseTimeToMs(compValue);
      if (compValue2 !== undefined) compValue2 = parseTimeToMs(compValue2);
    }
    
    switch (criteria.comparison) {
      case 'eq': return numValue === compValue;
      case 'neq': return numValue !== compValue;
      case 'gt': return numValue > compValue;
      case 'gte': return numValue >= compValue;
      case 'lt': return numValue < compValue;
      case 'lte': return numValue <= compValue;
      case 'between': return numValue >= compValue && numValue <= compValue2;
      default: return true;
    }
  }
  
  return true;
}

function parseTimeToMs(timeStr) {
  const parts = String(timeStr).split(':').map(Number);
  if (parts.length >= 2) {
    const hours = parts[0] || 0;
    const minutes = parts[1] || 0;
    const seconds = parts[2] || 0;
    return (hours * 3600 + minutes * 60 + seconds) * 1000;
  }
  return 0;
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
  } else if (type === 'date' || type === 'datetime' || type === 'time') {
    // Convert to milliseconds for statistical calculations
    let nums;
    if (type === 'time') {
      // Parse time strings (HH:MM:SS or HH:MM) to milliseconds since midnight
      nums = values.map(v => {
        const parts = String(v).split(':').map(Number);
        if (parts.length >= 2) {
          const hours = parts[0] || 0;
          const minutes = parts[1] || 0;
          const seconds = parts[2] || 0;
          return (hours * 3600 + minutes * 60 + seconds) * 1000;
        }
        return NaN;
      }).filter(n => !isNaN(n));
    } else {
      nums = values.map(v => new Date(v).getTime()).filter(n => !isNaN(n));
    }
    
    if (nums.length > 0) {
      nums.sort((a, b) => a - b);
      
      // Format functions for display
      const formatValue = (ms) => {
        if (type === 'time') {
          const totalSec = Math.floor(ms / 1000);
          const h = Math.floor(totalSec / 3600);
          const m = Math.floor((totalSec % 3600) / 60);
          const s = totalSec % 60;
          return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        } else if (type === 'date') {
          return new Date(ms).toISOString().split('T')[0];
        } else {
          return new Date(ms).toISOString().replace('T', ' ').slice(0, 19);
        }
      };
      
      stats.min = formatValue(Math.min(...nums));
      stats.max = formatValue(Math.max(...nums));
      stats.sum = nums.reduce((a, b) => a + b, 0);
      stats.mean = formatValue(stats.sum / nums.length);
      
      // Median
      const mid = Math.floor(nums.length / 2);
      const medianMs = nums.length % 2 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
      stats.median = formatValue(medianMs);
      
      // Range in human-readable format
      const rangeMs = Math.max(...nums) - Math.min(...nums);
      if (type === 'time') {
        stats.range = formatValue(rangeMs);
      } else {
        // For dates, show range in days
        const rangeDays = rangeMs / (1000 * 60 * 60 * 24);
        stats.range = `${rangeDays.toFixed(1)} days`;
      }
      
      // Variance and Std Dev (in milliseconds, shown as duration)
      const meanMs = stats.sum / nums.length;
      const variance = nums.reduce((sum, n) => sum + Math.pow(n - meanMs, 2), 0) / nums.length;
      stats.variance = variance;
      stats.stdDev = Math.sqrt(variance);
      
      // Format std dev as duration
      if (type === 'time') {
        stats.stdDevFormatted = formatValue(stats.stdDev);
      } else {
        const stdDevDays = stats.stdDev / (1000 * 60 * 60 * 24);
        stats.stdDevFormatted = `${stdDevDays.toFixed(2)} days`;
      }
      
      // Quartiles
      const q1Idx = Math.floor(nums.length * 0.25);
      const q3Idx = Math.floor(nums.length * 0.75);
      stats.q1 = formatValue(nums[q1Idx]);
      stats.q3 = formatValue(nums[q3Idx]);
      const iqrMs = nums[q3Idx] - nums[q1Idx];
      if (type === 'time') {
        stats.iqr = formatValue(iqrMs);
      } else {
        stats.iqr = `${(iqrMs / (1000 * 60 * 60 * 24)).toFixed(1)} days`;
      }
    }
  }
  
  return stats;
}

// Group By functions
function applyGroupBy() {
  if (state.groupByColumns.length === 0) {
    state.groupedData = null;
    return;
  }
  
  const groups = new Map();
  
  state.filteredIndices.forEach(idx => {
    const row = state.relation.items[idx];
    const key = state.groupByColumns.map(colIdx => JSON.stringify(row[colIdx])).join('|');
    
    if (!groups.has(key)) {
      groups.set(key, {
        keyValues: state.groupByColumns.map(colIdx => row[colIdx]),
        indices: []
      });
    }
    groups.get(key).indices.push(idx);
  });
  
  state.groupedData = groups;
}

function getVisibleColumns() {
  return state.columnNames
    .map((name, idx) => ({ name, type: state.columnTypes[idx], idx }))
    .filter((_, idx) => !state.groupByColumns.includes(idx));
}





// Relation type functions
function formatCellValue(value, type) {
  if (value === null || value === undefined) return '<span class="null-value">null</span>';
  
  if (type === 'relation') {
    const count = value?.items?.length || 0;
    return `<span class="relation-cell-icon" title="${count} rows">📋 ${count}</span>`;
  }
  if (type === 'boolean') {
    // Checkboxes are handled separately in renderTable to allow interaction
    if (value === true) return '<span class="bool-display bool-display-true">✓</span>';
    if (value === false) return '<span class="bool-display bool-display-false">✗</span>';
    return '<span class="bool-display bool-display-null">—</span>';
  }
  if (type === 'multilinestring') {
    return `<span class="multiline-preview">${String(value).substring(0, 50)}${value.length > 50 ? '...' : ''}</span>`;
  }
  
  return String(value);
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

function updateTextarea() {
  const textarea = document.getElementById('relation-json');
  textarea.value = JSON.stringify(state.relation, null, 2);
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
    if (type === 'boolean') {
      // Boolean uses tri-state checkbox even in read-only mode
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.dataset.row = rowIdx;
      checkbox.dataset.col = colIdx;
      checkbox.className = 'bool-tristate';
      if (value === true) {
        checkbox.checked = true;
        checkbox.classList.add('bool-tristate-true');
      } else if (value === false) {
        checkbox.checked = false;
        checkbox.classList.add('bool-tristate-false');
      } else {
        checkbox.checked = false;
        checkbox.indeterminate = true;
        checkbox.classList.add('bool-tristate-null');
      }
      wrapper.appendChild(checkbox);
      return wrapper;
    }
    
    const span = document.createElement('span');
    span.className = 'relation-cell-readonly';
    if (type === 'multilinestring') {
      span.className = 'relation-cell-multiline';
      span.textContent = value || '—';
    } else {
      span.textContent = value !== null && value !== undefined ? String(value) : '—';
    }
    wrapper.appendChild(span);
    return wrapper;
  }
  
  if (type === 'relation') {
    const btn = document.createElement('button');
    btn.className = 'relation-cell-btn';
    const count = value?.items?.length || 0;
    btn.innerHTML = `📋 ${count}`;
    btn.title = `View nested relation (${count} rows)`;
    btn.dataset.row = rowIdx;
    btn.dataset.col = colIdx;
    wrapper.appendChild(btn);
  } else if (type === 'boolean') {
    // Boolean uses tri-state checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.dataset.row = rowIdx;
    checkbox.dataset.col = colIdx;
    checkbox.className = 'bool-tristate';
    if (value === true) {
      checkbox.checked = true;
      checkbox.classList.add('bool-tristate-true');
    } else if (value === false) {
      checkbox.checked = false;
      checkbox.classList.add('bool-tristate-false');
    } else {
      checkbox.checked = false;
      checkbox.indeterminate = true;
      checkbox.classList.add('bool-tristate-null');
    }
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
  const totalRecords = state.relation.items.length;
  const filteredRecords = state.sortedIndices.length;
  const selectedRecords = state.selectedRows.size;
  
  const hasFilter = filteredRecords !== totalRecords;
  
  container.innerHTML = `
    <div class="pagination-info">
      <span class="pagination-total">${totalRecords} total</span>
      ${hasFilter ? `<span class="pagination-filtered">${filteredRecords} filtered</span>` : ''}
      <span class="pagination-selected">${selectedRecords} selected</span>
    </div>
    <div class="pagination-size">
      <label>Per page:</label>
      <select id="page-size-select">
        <option value="10" ${state.pageSize === 10 ? 'selected' : ''}>10</option>
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
  
  // Row operations buttons, nested relation buttons, and boolean checkboxes - single click handler
  document.getElementById('relation-table-container').addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-row-ops')) {
      const rowIdx = parseInt(e.target.dataset.row);
      const rect = e.target.getBoundingClientRect();
      showRowOperationsMenu(rowIdx, rect.left, rect.bottom + 5);
      e.stopPropagation();
      return;
    }
    
    if (e.target.classList.contains('relation-cell-btn')) {
      const rowIdx = parseInt(e.target.dataset.row);
      const colIdx = parseInt(e.target.dataset.col);
      showNestedRelationDialog(rowIdx, colIdx);
      e.stopPropagation();
      return;
    }
    
    // Tri-state boolean checkboxes (cycle: true → false → null → true)
    if (e.target.matches('.bool-tristate')) {
      e.preventDefault();
      e.stopPropagation();
      
      const checkbox = e.target;
      const rowIdx = parseInt(checkbox.dataset.row);
      const colIdx = parseInt(checkbox.dataset.col);
      const currentValue = state.relation.items[rowIdx][colIdx];
      
      // Cycle: true → false → null → true
      let newValue;
      if (currentValue === true) {
        newValue = false;
      } else if (currentValue === false) {
        newValue = null;
      } else {
        newValue = true;
      }
      
      state.relation.items[rowIdx][colIdx] = newValue;
      updateTextarea();
      
      // Update checkbox state immediately
      updateBoolCheckbox(checkbox, newValue);
      return;
    }
  });
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
  
  // Operations column header (position 2)
  const opsTh = document.createElement('th');
  opsTh.className = 'relation-th-ops';
  opsTh.textContent = '';
  headerRow.appendChild(opsTh);
  
  // Index column
  const indexTh = document.createElement('th');
  indexTh.textContent = '#';
  indexTh.className = 'relation-th-index';
  headerRow.appendChild(indexTh);
  
  // Group info header (if any groups)
  if (state.groupByColumns.length > 0) {
    const groupInfo = document.createElement('div');
    groupInfo.className = 'group-by-indicator';
    
    let groupHtml = '<span>Grouped by:</span>';
    state.groupByColumns.forEach(colIdx => {
      const colName = state.columnNames[colIdx];
      const uniqueValues = getUniqueValuesForColumn(colIdx);
      const currentValue = state.groupBySelectedValues[colIdx];
      const hasSelection = currentValue !== undefined;
      
      groupHtml += `
        <div class="group-by-col" data-col="${colIdx}">
          <strong>${colName}:</strong>
          <select class="group-value-select" data-col="${colIdx}">
            <option value="__all__"${!hasSelection ? ' selected' : ''}>All (${uniqueValues.length})</option>
            ${uniqueValues.map(v => {
              const val = v === null ? '__null__' : v;
              const label = v === null ? '(null)' : String(v);
              const selected = hasSelection && String(currentValue) === String(v) ? ' selected' : '';
              return `<option value="${val}"${selected}>${label}</option>`;
            }).join('')}
          </select>
        </div>
      `;
    });
    groupHtml += '<button class="btn-clear-groups" data-testid="button-clear-groups">✕ Clear</button>';
    
    groupInfo.innerHTML = groupHtml;
    container.appendChild(groupInfo);
    
    groupInfo.querySelector('.btn-clear-groups').addEventListener('click', () => {
      state.groupByColumns = [];
      state.groupBySelectedValues = {};
      renderTable();
    });
    
    groupInfo.querySelectorAll('.group-value-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const colIdx = parseInt(e.target.dataset.col);
        const value = e.target.value;
        
        if (value === '__all__') {
          delete state.groupBySelectedValues[colIdx];
        } else if (value === '__null__') {
          state.groupBySelectedValues[colIdx] = null;
        } else {
          state.groupBySelectedValues[colIdx] = value;
        }
        
        state.currentPage = 1;
        renderTable();
      });
    });
  }
  
  // Data columns (skip grouped columns)
  state.columnNames.forEach((name, idx) => {
    if (state.groupByColumns.includes(idx)) return;
    
    const th = document.createElement('th');
    th.className = 'relation-th-sortable';
    th.dataset.col = idx;
    const type = state.columnTypes[idx];
    const sortIndicator = getSortIndicator(idx);
    const filterActive = state.filters[idx] ? ' filter-active' : '';
    const colSelected = state.selectedColumns.has(idx) ? ' col-selected' : '';
    th.innerHTML = `
      <div class="relation-th-content${filterActive}${colSelected}">
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
    
    // Operations button (position 2)
    const opsTd = document.createElement('td');
    opsTd.className = 'relation-td-ops';
    opsTd.innerHTML = `<button class="btn-row-ops" data-row="${rowIdx}" title="Row operations">⋮</button>`;
    tr.appendChild(opsTd);
    
    // Index
    const indexTd = document.createElement('td');
    indexTd.textContent = rowIdx + 1;
    indexTd.className = 'relation-td-index';
    tr.appendChild(indexTd);
    
    // Data cells (skip grouped columns)
    row.forEach((value, colIdx) => {
      if (state.groupByColumns.includes(colIdx)) return;
      
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
  footerRow.appendChild(document.createElement('td')); // Operations column
  footerRow.appendChild(document.createElement('td')); // Index column
  
  state.columnNames.forEach((_, colIdx) => {
    if (state.groupByColumns.includes(colIdx)) return;
    
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
    if (e.target.matches('.relation-input, .relation-textarea')) {
      updateRelationFromInput(e.target);
    }
  });
}

function updateBoolCheckbox(checkbox, value) {
  checkbox.classList.remove('bool-tristate-true', 'bool-tristate-false', 'bool-tristate-null');
  
  // Use setTimeout to ensure DOM properties are set after the event cycle completes
  setTimeout(() => {
    if (value === true) {
      checkbox.checked = true;
      checkbox.indeterminate = false;
      checkbox.classList.add('bool-tristate-true');
    } else if (value === false) {
      checkbox.checked = false;
      checkbox.indeterminate = false;
      checkbox.classList.add('bool-tristate-false');
    } else {
      checkbox.checked = false;
      checkbox.indeterminate = true;
      checkbox.classList.add('bool-tristate-null');
    }
  }, 0);
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
  
  const isGrouped = state.groupByColumns.includes(colIdx);
  const isSelected = state.selectedColumns.has(colIdx);
  
  menu.innerHTML = `
    <div class="column-menu-header">${name} (${type})</div>
    <div class="column-menu-accordion">
      <div class="accordion-section" data-section="sort">
        <div class="accordion-header">Sort <span class="accordion-arrow">▶</span></div>
        <div class="accordion-content">
          <button class="column-menu-item" data-action="sort-asc">↑ Ascending</button>
          <button class="column-menu-item" data-action="sort-desc">↓ Descending</button>
          <button class="column-menu-item" data-action="sort-clear">✕ Clear Sort</button>
        </div>
      </div>
      <div class="accordion-section" data-section="filter">
        <div class="accordion-header">Filter <span class="accordion-arrow">▶</span></div>
        <div class="accordion-content">
          <button class="column-menu-item" data-action="filter-values">By Values...</button>
          ${type === 'int' || type === 'float' || type === 'date' || type === 'datetime' || type === 'time' ? `
            <button class="column-menu-item" data-action="filter-comparison">By Comparison...</button>
            <button class="column-menu-item" data-action="filter-top10">Top 10</button>
            <button class="column-menu-item" data-action="filter-top10p">Top 10%</button>
          ` : ''}
          <button class="column-menu-item" data-action="filter-null">Only Null</button>
          <button class="column-menu-item" data-action="filter-not-null">Not Null</button>
          <button class="column-menu-item" data-action="filter-clear">✕ Clear Filter</button>
        </div>
      </div>
      <div class="accordion-section" data-section="group">
        <div class="accordion-header">Group By <span class="accordion-arrow">▶</span></div>
        <div class="accordion-content">
          <button class="column-menu-item ${isGrouped ? 'active' : ''}" data-action="toggle-group">${isGrouped ? '✓ Grouped' : 'Group by this column'}</button>
          <button class="column-menu-item" data-action="clear-groups">✕ Clear All Groups</button>
        </div>
      </div>
      ${type === 'relation' ? `
      <div class="accordion-section" data-section="relation">
        <div class="accordion-header">Relation <span class="accordion-arrow">▶</span></div>
        <div class="accordion-content">
          <button class="column-menu-item" data-action="expand-relation">⊗ Cartesian Product</button>
        </div>
      </div>
      ` : ''}
      <div class="accordion-section" data-section="selection">
        <div class="accordion-header">Column Selection <span class="accordion-arrow">▶</span></div>
        <div class="accordion-content">
          <button class="column-menu-item ${isSelected ? 'active' : ''}" data-action="toggle-select-col">${isSelected ? '✓ Selected' : 'Select Column'}</button>
          ${state.selectedColumns.size > 0 ? `
            <button class="column-menu-item" data-action="group-selected-cols">Group Selected → Relation</button>
            <button class="column-menu-item" data-action="clear-col-selection">Clear Selection</button>
          ` : ''}
        </div>
      </div>
      <div class="accordion-section" data-section="formatting">
        <div class="accordion-header">Conditional Formatting <span class="accordion-arrow">▶</span></div>
        <div class="accordion-content">
          <button class="column-menu-item" data-action="format-databar">Data Bar</button>
          <button class="column-menu-item" data-action="format-color-scale">Color Scale</button>
          <button class="column-menu-item" data-action="format-clear">✕ Clear Formatting</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(menu);
  
  // Accordion behavior - only one open at a time
  menu.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', (e) => {
      e.stopPropagation();
      const section = header.parentElement;
      const isOpen = section.classList.contains('open');
      
      // Close all sections
      menu.querySelectorAll('.accordion-section').forEach(s => s.classList.remove('open'));
      
      // Open clicked section if it was closed
      if (!isOpen) {
        section.classList.add('open');
      }
    });
  });
  
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
    case 'filter-comparison':
      showFilterComparisonDialog(colIdx);
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
    case 'toggle-group':
      toggleGroupBy(colIdx);
      return;
    case 'clear-groups':
      state.groupByColumns = [];
      state.groupBySelectedValues = {};
      break;
    case 'expand-relation':
      expandRelationColumn(colIdx);
      return;
    case 'toggle-select-col':
      if (state.selectedColumns.has(colIdx)) {
        state.selectedColumns.delete(colIdx);
      } else {
        state.selectedColumns.add(colIdx);
      }
      break;
    case 'group-selected-cols':
      showGroupColumnsDialog();
      return;
    case 'clear-col-selection':
      state.selectedColumns.clear();
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

function showFilterComparisonDialog(colIdx) {
  closeAllMenus();
  
  const type = state.columnTypes[colIdx];
  const name = state.columnNames[colIdx];
  const currentFilter = state.filters[colIdx];
  
  const isDateTime = type === 'date' || type === 'datetime' || type === 'time';
  let inputType = 'number';
  if (type === 'date') inputType = 'date';
  if (type === 'datetime') inputType = 'datetime-local';
  if (type === 'time') inputType = 'time';
  
  const currentComparison = currentFilter?.criteria?.comparison || 'eq';
  const currentValue = currentFilter?.criteria?.value || '';
  const currentValue2 = currentFilter?.criteria?.value2 || '';
  
  const dialog = document.createElement('div');
  dialog.className = 'filter-dialog';
  
  dialog.innerHTML = `
    <div class="filter-dialog-header">
      <span>Filter: ${name}</span>
      <button class="btn-close-dialog">✕</button>
    </div>
    <div class="filter-comparison-form">
      <div class="filter-form-row">
        <label>Operator:</label>
        <select id="filter-comparison-op" class="filter-select">
          <option value="eq" ${currentComparison === 'eq' ? 'selected' : ''}>=  Equal</option>
          <option value="neq" ${currentComparison === 'neq' ? 'selected' : ''}>≠  Not Equal</option>
          <option value="gt" ${currentComparison === 'gt' ? 'selected' : ''}>>  Greater Than</option>
          <option value="gte" ${currentComparison === 'gte' ? 'selected' : ''}>≥  Greater or Equal</option>
          <option value="lt" ${currentComparison === 'lt' ? 'selected' : ''}><  Less Than</option>
          <option value="lte" ${currentComparison === 'lte' ? 'selected' : ''}>≤  Less or Equal</option>
          <option value="between" ${currentComparison === 'between' ? 'selected' : ''}>↔  Between</option>
        </select>
      </div>
      <div class="filter-form-row">
        <label id="filter-value-label">Value:</label>
        <input type="${inputType}" id="filter-comparison-value" class="filter-input" value="${currentValue}" ${type === 'float' ? 'step="0.001"' : ''}>
      </div>
      <div class="filter-form-row" id="filter-value2-row" style="display: ${currentComparison === 'between' ? 'flex' : 'none'}">
        <label>To:</label>
        <input type="${inputType}" id="filter-comparison-value2" class="filter-input" value="${currentValue2}" ${type === 'float' ? 'step="0.001"' : ''}>
      </div>
    </div>
    <div class="filter-dialog-footer">
      <button class="btn btn-outline" id="filter-cancel">Cancel</button>
      <button class="btn btn-primary" id="filter-apply">Apply</button>
    </div>
  `;
  
  document.body.appendChild(dialog);
  
  const opSelect = dialog.querySelector('#filter-comparison-op');
  const value2Row = dialog.querySelector('#filter-value2-row');
  const valueLabel = dialog.querySelector('#filter-value-label');
  
  opSelect.addEventListener('change', () => {
    const isBetween = opSelect.value === 'between';
    value2Row.style.display = isBetween ? 'flex' : 'none';
    valueLabel.textContent = isBetween ? 'From:' : 'Value:';
  });
  
  dialog.querySelector('.btn-close-dialog').addEventListener('click', () => dialog.remove());
  dialog.querySelector('#filter-cancel').addEventListener('click', () => dialog.remove());
  
  dialog.querySelector('#filter-apply').addEventListener('click', () => {
    const comparison = opSelect.value;
    const value = dialog.querySelector('#filter-comparison-value').value;
    const value2 = dialog.querySelector('#filter-comparison-value2').value;
    
    if (!value) {
      dialog.remove();
      return;
    }
    
    const criteria = { comparison, value };
    if (comparison === 'between' && value2) {
      criteria.value2 = value2;
    }
    
    state.filters[colIdx] = { type: 'criteria', criteria };
    state.currentPage = 1;
    dialog.remove();
    renderTable();
  });
}

function showStatisticsPanel(colIdx) {
  // Check if panel for this column is already open - if so, close it (toggle behavior)
  const existingPanel = document.querySelector(`.stats-panel[data-col="${colIdx}"]`);
  if (existingPanel) {
    existingPanel.remove();
    return;
  }
  
  closeAllMenus();
  
  const stats = calculateStatistics(colIdx);
  const type = state.columnTypes[colIdx];
  const name = state.columnNames[colIdx];
  
  const panel = document.createElement('div');
  panel.className = 'stats-panel';
  panel.dataset.col = colIdx;
  
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
  } else if (type === 'date' || type === 'datetime' || type === 'time') {
    const label = type === 'time' ? 'Time' : 'Date';
    statsHtml += `
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Min ${label}:</span><span>${stats.min ?? '—'}</span></div>
      <div class="stats-row"><span>Max ${label}:</span><span>${stats.max ?? '—'}</span></div>
      <div class="stats-row"><span>Range:</span><span>${stats.range ?? '—'}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Mean:</span><span>${stats.mean ?? '—'}</span></div>
      <div class="stats-row"><span>Median:</span><span>${stats.median ?? '—'}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Std Dev:</span><span>${stats.stdDevFormatted ?? '—'}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Q1 (25%):</span><span>${stats.q1 ?? '—'}</span></div>
      <div class="stats-row"><span>Q3 (75%):</span><span>${stats.q3 ?? '—'}</span></div>
      <div class="stats-row"><span>IQR:</span><span>${stats.iqr ?? '—'}</span></div>
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
  document.querySelectorAll('.column-menu, .filter-dialog, .stats-panel, .row-ops-menu, .nested-relation-dialog, .group-cols-dialog').forEach(el => el.remove());
}

function toggleGroupBy(colIdx) {
  const idx = state.groupByColumns.indexOf(colIdx);
  if (idx >= 0) {
    state.groupByColumns.splice(idx, 1);
    // Also remove selected value for this column
    delete state.groupBySelectedValues[colIdx];
  } else {
    state.groupByColumns.push(colIdx);
  }
  state.currentPage = 1;
  renderTable();
}

function expandRelationColumn(colIdx) {
  if (state.columnTypes[colIdx] !== 'relation') return;
  
  const newItems = [];
  const nestedColumns = {};
  
  state.relation.items.forEach(row => {
    const nestedRelation = row[colIdx];
    if (!nestedRelation || !nestedRelation.items || nestedRelation.items.length === 0) {
      const newRow = [...row];
      newRow[colIdx] = null;
      newItems.push(newRow);
    } else {
      Object.assign(nestedColumns, nestedRelation.columns);
      nestedRelation.items.forEach(nestedRow => {
        const newRow = [...row];
        newRow[colIdx] = null;
        nestedRow.forEach((val, i) => {
          newRow.push(val);
        });
        newItems.push(newRow);
      });
    }
  });
  
  const newColumnsObj = {...state.relation.columns};
  delete newColumnsObj[state.columnNames[colIdx]];
  Object.assign(newColumnsObj, nestedColumns);
  
  state.relation = {
    pot: 'relation',
    columns: newColumnsObj,
    items: newItems
  };
  
  state.columnNames = Object.keys(newColumnsObj);
  state.columnTypes = Object.values(newColumnsObj);
  state.filteredIndices = [...Array(newItems.length).keys()];
  state.sortedIndices = [...state.filteredIndices];
  state.selectedRows = new Set();
  state.sortCriteria = [];
  state.filters = {};
  state.formatting = {};
  state.groupByColumns = [];
  state.groupBySelectedValues = {};
  state.currentPage = 1;
  
  document.getElementById('relation-json').value = JSON.stringify(state.relation, null, 2);
  renderTable();
}

function showGroupColumnsDialog() {
  closeAllMenus();
  
  const selectedCols = [...state.selectedColumns];
  if (selectedCols.length === 0) return;
  
  const dialog = document.createElement('div');
  dialog.className = 'group-cols-dialog';
  
  const colNames = selectedCols.map(i => state.columnNames[i]).join(', ');
  
  dialog.innerHTML = `
    <div class="filter-dialog-header">
      <span>Group Columns into Relation</span>
      <button class="btn-close-dialog">✕</button>
    </div>
    <div class="group-cols-content">
      <p>Selected columns: <strong>${colNames}</strong></p>
      <label>New relation column name:</label>
      <input type="text" id="group-col-name" value="nested_data" class="relation-input" />
    </div>
    <div class="filter-dialog-footer">
      <button class="btn btn-outline" id="group-cancel">Cancel</button>
      <button class="btn btn-primary" id="group-apply">Group</button>
    </div>
  `;
  
  document.body.appendChild(dialog);
  
  dialog.querySelector('.btn-close-dialog').addEventListener('click', () => dialog.remove());
  dialog.querySelector('#group-cancel').addEventListener('click', () => dialog.remove());
  
  dialog.querySelector('#group-apply').addEventListener('click', () => {
    const newColName = dialog.querySelector('#group-col-name').value.trim() || 'nested_data';
    groupColumnsIntoRelation(selectedCols, newColName);
    dialog.remove();
  });
}

function groupColumnsIntoRelation(colIndices, newColName) {
  const nestedColumnNames = colIndices.map(i => state.columnNames[i]);
  const nestedColumnTypes = colIndices.map(i => state.columnTypes[i]);
  
  const nestedColumns = {};
  nestedColumnNames.forEach((name, i) => {
    nestedColumns[name] = nestedColumnTypes[i];
  });
  
  const newItems = state.relation.items.map(row => {
    const nestedRow = colIndices.map(i => row[i]);
    const nestedRelation = {
      pot: 'relation',
      columns: nestedColumns,
      items: [nestedRow]
    };
    
    const newRow = row.filter((_, i) => !colIndices.includes(i));
    newRow.push(nestedRelation);
    return newRow;
  });
  
  const newColumnsObj = {};
  state.columnNames.forEach((name, i) => {
    if (!colIndices.includes(i)) {
      newColumnsObj[name] = state.columnTypes[i];
    }
  });
  newColumnsObj[newColName] = 'relation';
  
  state.relation = {
    pot: 'relation',
    columns: newColumnsObj,
    items: newItems
  };
  
  state.columnNames = Object.keys(newColumnsObj);
  state.columnTypes = Object.values(newColumnsObj);
  state.filteredIndices = [...Array(newItems.length).keys()];
  state.sortedIndices = [...state.filteredIndices];
  state.selectedRows = new Set();
  state.selectedColumns = new Set();
  state.sortCriteria = [];
  state.filters = {};
  state.formatting = {};
  state.groupByColumns = [];
  state.groupBySelectedValues = {};
  state.currentPage = 1;
  
  document.getElementById('relation-json').value = JSON.stringify(state.relation, null, 2);
  renderTable();
}

function showRowOperationsMenu(rowIdx, x, y) {
  closeAllMenus();
  
  const menu = document.createElement('div');
  menu.className = 'row-ops-menu';
  menu.style.left = x + 'px';
  menu.style.top = y + 'px';
  
  const hasSelection = state.selectedRows.size > 0;
  
  menu.innerHTML = `
    <div class="column-menu-header">Row ${rowIdx + 1}</div>
    <button class="column-menu-item" data-action="view-row" data-testid="button-row-view">👁 View</button>
    ${state.editable ? `
      <button class="column-menu-item" data-action="edit-row" data-testid="button-row-edit">✏ Edit</button>
      <button class="column-menu-item" data-action="copy-row" data-testid="button-row-copy">📋 Copy</button>
      <button class="column-menu-item" data-action="delete-row" data-testid="button-row-delete">🗑 Delete</button>
    ` : ''}
    ${hasSelection ? `
      <div class="column-menu-section">
        <div class="column-menu-title">Selection (${state.selectedRows.size} rows)</div>
        <button class="column-menu-item" data-action="delete-selected" data-testid="button-delete-selected">🗑 Delete Selected</button>
      </div>
    ` : ''}
  `;
  
  document.body.appendChild(menu);
  
  menu.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    if (!action) return;
    
    handleRowOperation(rowIdx, action);
    menu.remove();
  });
  
  setTimeout(() => {
    document.addEventListener('click', function closeMenu(e) {
      if (!menu.contains(e.target)) {
        menu.remove();
        document.removeEventListener('click', closeMenu);
      }
    });
  }, 0);
}

function handleRowOperation(rowIdx, action) {
  switch (action) {
    case 'view-row':
      showRowViewDialog(rowIdx);
      break;
    case 'edit-row':
      showRowEditDialog(rowIdx);
      break;
    case 'copy-row':
      const rowCopy = [...state.relation.items[rowIdx]];
      state.relation.items.push(rowCopy);
      state.filteredIndices = [...Array(state.relation.items.length).keys()];
      state.sortedIndices = [...state.filteredIndices];
      document.getElementById('relation-json').value = JSON.stringify(state.relation, null, 2);
      renderTable();
      break;
    case 'delete-row':
      if (confirm('Delete this row?')) {
        state.relation.items.splice(rowIdx, 1);
        state.selectedRows.delete(rowIdx);
        state.filteredIndices = [...Array(state.relation.items.length).keys()];
        state.sortedIndices = [...state.filteredIndices];
        document.getElementById('relation-json').value = JSON.stringify(state.relation, null, 2);
        renderTable();
      }
      break;
    case 'delete-selected':
      if (confirm(`Delete ${state.selectedRows.size} selected rows?`)) {
        const indices = [...state.selectedRows].sort((a, b) => b - a);
        indices.forEach(i => state.relation.items.splice(i, 1));
        state.selectedRows.clear();
        state.filteredIndices = [...Array(state.relation.items.length).keys()];
        state.sortedIndices = [...state.filteredIndices];
        document.getElementById('relation-json').value = JSON.stringify(state.relation, null, 2);
        renderTable();
      }
      break;
  }
}

function showRowViewDialog(rowIdx) {
  closeAllMenus();
  
  const row = state.relation.items[rowIdx];
  const dialog = document.createElement('div');
  dialog.className = 'filter-dialog';
  
  let content = '<div class="row-view-content">';
  state.columnNames.forEach((name, i) => {
    const type = state.columnTypes[i];
    let val = row[i];
    if (type === 'relation' && val) {
      val = `<em>${val.items?.length || 0} nested rows</em>`;
    } else {
      val = val === null ? '<em>null</em>' : String(val);
    }
    content += `<div class="row-view-item"><strong>${name}:</strong> ${val}</div>`;
  });
  content += '</div>';
  
  dialog.innerHTML = `
    <div class="filter-dialog-header">
      <span>Row ${rowIdx + 1} Details</span>
      <button class="btn-close-dialog">✕</button>
    </div>
    ${content}
    <div class="filter-dialog-footer">
      <button class="btn btn-outline" id="close-view">Close</button>
    </div>
  `;
  
  document.body.appendChild(dialog);
  dialog.querySelector('.btn-close-dialog').addEventListener('click', () => dialog.remove());
  dialog.querySelector('#close-view').addEventListener('click', () => dialog.remove());
}

function showRowEditDialog(rowIdx) {
  closeAllMenus();
  
  const row = state.relation.items[rowIdx];
  const dialog = document.createElement('div');
  dialog.className = 'filter-dialog';
  
  let content = '<div class="row-edit-content">';
  state.columnNames.forEach((name, i) => {
    const type = state.columnTypes[i];
    const val = row[i];
    let input = '';
    
    if (type === 'relation') {
      input = `<span class="text-muted-foreground">(nested relation - edit in JSON)</span>`;
    } else if (type === 'boolean') {
      input = `<input type="checkbox" data-col="${i}" ${val ? 'checked' : ''} />`;
    } else if (type === 'multilinestring') {
      input = `<textarea data-col="${i}" rows="3">${val || ''}</textarea>`;
    } else {
      const inputType = type === 'int' || type === 'float' ? 'number' : type === 'date' ? 'date' : type === 'time' ? 'time' : type === 'datetime' ? 'datetime-local' : 'text';
      input = `<input type="${inputType}" data-col="${i}" value="${val || ''}" />`;
    }
    
    content += `<div class="row-edit-item"><label>${name} (${type}):</label>${input}</div>`;
  });
  content += '</div>';
  
  dialog.innerHTML = `
    <div class="filter-dialog-header">
      <span>Edit Row ${rowIdx + 1}</span>
      <button class="btn-close-dialog">✕</button>
    </div>
    ${content}
    <div class="filter-dialog-footer">
      <button class="btn btn-outline" id="cancel-edit">Cancel</button>
      <button class="btn btn-primary" id="save-edit">Save</button>
    </div>
  `;
  
  document.body.appendChild(dialog);
  dialog.querySelector('.btn-close-dialog').addEventListener('click', () => dialog.remove());
  dialog.querySelector('#cancel-edit').addEventListener('click', () => dialog.remove());
  
  dialog.querySelector('#save-edit').addEventListener('click', () => {
    state.columnNames.forEach((name, i) => {
      const type = state.columnTypes[i];
      if (type === 'relation') return;
      
      const input = dialog.querySelector(`[data-col="${i}"]`);
      if (!input) return;
      
      let value;
      if (type === 'boolean') {
        value = input.checked;
      } else if (type === 'int') {
        value = parseInt(input.value) || 0;
      } else if (type === 'float') {
        value = parseFloat(input.value) || 0;
      } else {
        value = input.value;
      }
      
      state.relation.items[rowIdx][i] = value;
    });
    
    document.getElementById('relation-json').value = JSON.stringify(state.relation, null, 2);
    dialog.remove();
    renderTable();
  });
}

function showNestedRelationDialog(rowIdx, colIdx) {
  closeAllMenus();
  
  const nestedRelation = state.relation.items[rowIdx][colIdx];
  if (!nestedRelation || !nestedRelation.columns) return;
  
  const dialog = document.createElement('div');
  dialog.className = 'nested-relation-dialog';
  
  const colNames = Object.keys(nestedRelation.columns);
  const colTypes = Object.values(nestedRelation.columns);
  
  let tableHtml = '<table class="nested-relation-table"><thead><tr>';
  colNames.forEach(name => tableHtml += `<th>${name}</th>`);
  tableHtml += '</tr></thead><tbody>';
  
  (nestedRelation.items || []).forEach(row => {
    tableHtml += '<tr>';
    row.forEach((val, i) => {
      const type = colTypes[i];
      let display = val === null ? '<em>null</em>' : String(val);
      if (type === 'relation') display = `<em>${val?.items?.length || 0} rows</em>`;
      tableHtml += `<td>${display}</td>`;
    });
    tableHtml += '</tr>';
  });
  
  tableHtml += '</tbody></table>';
  
  dialog.innerHTML = `
    <div class="filter-dialog-header">
      <span>Nested Relation (${nestedRelation.items?.length || 0} rows)</span>
      <button class="btn-close-dialog">✕</button>
    </div>
    <div class="nested-relation-content">${tableHtml}</div>
    <div class="filter-dialog-footer">
      <button class="btn btn-outline" id="close-nested">Close</button>
    </div>
  `;
  
  document.body.appendChild(dialog);
  dialog.querySelector('.btn-close-dialog').addEventListener('click', () => dialog.remove());
  dialog.querySelector('#close-nested').addEventListener('click', () => dialog.remove());
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
