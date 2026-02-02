import './styles.css';

const COLUMN_TYPES = ['boolean', 'string', 'multilinestring', 'int', 'float', 'date', 'datetime', 'time', 'relation', 'select'];

function escapeHtml(text) {
  if (text === null || text === undefined) return '';
  const str = String(text);
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function getContrastTextColor(hexColor) {
  if (!hexColor || !hexColor.startsWith('#')) return null;
  
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance < 0.5 ? '#ffffff' : '#000000';
}

// Color palettes for conditional formatting
const COLOR_PALETTES = {
  pastel: {
    name: 'Pastel',
    colors: ['#ffd1dc', '#ffeeba', '#d4edda', '#d1ecf1', '#e2d4f0', '#ffe0b2', '#c8e6c9', '#bbdefb', '#f8bbd0', '#e1bee7']
  },
  vivid: {
    name: 'Vivid',
    colors: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']
  },
  dark: {
    name: 'Dark',
    colors: ['#991b1b', '#9a3412', '#854d0e', '#166534', '#115e59', '#1e40af', '#5b21b6', '#9d174d', '#0e7490', '#3f6212']
  },
  neutral: {
    name: 'Neutral',
    colors: ['#f5f5f5', '#d4d4d4', '#a3a3a3', '#737373', '#404040']
  },
  warm: {
    name: 'Warm',
    colors: ['#fde68a', '#f59e0b', '#d97706', '#b45309', '#dc2626']
  },
  cool: {
    name: 'Cool',
    colors: ['#cffafe', '#22d3ee', '#0891b2', '#0e7490', '#164e63']
  },
  danger: {
    name: 'Danger',
    colors: ['#fde047', '#f97316', '#dc2626', '#9333ea']
  },
  highlight: {
    name: 'Highlight',
    colors: ['#ff0000', '#ff8000', '#ffff00', '#00ff00', '#00ffff', '#0080ff', '#8000ff']
  }
};

// State management
let state = {
  relation: null,
  columnNames: [],
  columnTypes: [],
  options: {}, // {columnName: {key: htmlValue}}
  editable: false,
  
  // Current view
  currentView: 'table', // 'table', 'cards', 'pivot', 'correlation', 'diagram', 'ai'
  
  // Pagination
  pageSize: 10,
  currentPage: 1,
  
  // Cards view pagination
  cardsPageSize: 12, // Default: 4 cards per row * 3 rows
  cardsCurrentPage: 1,
  
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
  
  // Pivot table config
  pivotConfig: {
    rowColumn: null,
    colColumn: null,
    values: [] // [{column: idx, aggregation: 'count'|'pctTotal'|'pctRow'|'pctCol'}]
  },
  
  // Diagram/Clustering
  diagramNodes: [],
  
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
        const defaultCounter = { value: 1 };
        return generateNestedRelation(nestedRelationSchema, defaultCounter);
      }
      return null;
    default:
      return null;
  }
}

function generateNestedRelation(schema, idCounter) {
  const numRows = Math.floor(Math.random() * 4) + 1; // 1-4 rows
  const columnNames = Object.keys(schema.columns);
  const columnTypes = Object.values(schema.columns);
  const items = [];
  
  for (let i = 0; i < numRows; i++) {
    const row = columnTypes.map((type, idx) => {
      const colName = columnNames[idx];
      if (colName.endsWith('_id') || colName === 'id') {
        return idCounter.value++;
      }
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
    country: 'select',
    active: 'boolean',
    score: 'float',
    birth_date: 'date',
    created_at: 'datetime',
    start_time: 'time',
    notes: 'multilinestring',
    orders: 'relation',
    tags: 'relation'
  };
  
  const ordersIdCounter = { value: 1 };
  const tagsIdCounter = { value: 1 };
  
  const options = {
    country: {
      pt: '🇵🇹 Portugal',
      es: '🇪🇸 España',
      fr: '🇫🇷 France',
      de: '🇩🇪 Deutschland',
      it: '🇮🇹 Italia',
      uk: '🇬🇧 United Kingdom',
      us: '🇺🇸 United States',
      br: '🇧🇷 Brasil',
      jp: '🇯🇵 Japan',
      cn: '🇨🇳 China'
    }
  };
  
  const countryKeys = Object.keys(options.country);
  
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
          return generateNestedRelation(ordersSchema, ordersIdCounter);
        } else if (colName === 'tags') {
          return generateNestedRelation(tagsSchema, tagsIdCounter);
        }
      }
      
      // Handle select type
      if (type === 'select' && colName === 'country') {
        return countryKeys[Math.floor(Math.random() * countryKeys.length)];
      }
      
      return generateRandomValue(type);
    });
    items.push(row);
  }
  
  return {
    pot: 'relation',
    columns: columns,
    options: options,
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

// Categorical Histogram SVG Generator
function generateCategoricalHistogramSVG(stats, colName) {
  if (!stats.freqTableDesc || stats.freqTableDesc.length === 0) return '';
  
  const colOptions = state.options[colName] || {};
  const data = stats.freqTableDesc;
  const maxCount = Math.max(...data.map(d => d.count));
  
  const barHeight = 22;
  const labelWidth = 100;
  const barMaxWidth = 120;
  const padding = { top: 10, bottom: 10, left: 10, right: 40 };
  const width = labelWidth + barMaxWidth + padding.left + padding.right;
  const height = data.length * barHeight + padding.top + padding.bottom;
  
  let svg = `<svg width="${width}" height="${height}" class="histogram-svg">`;
  
  data.forEach((item, i) => {
    const y = padding.top + i * barHeight;
    const barWidth = (item.count / maxCount) * barMaxWidth;
    const label = colOptions[item.key] || item.key;
    
    // Bar
    svg += `<rect x="${padding.left + labelWidth}" y="${y + 2}" width="${barWidth}" height="${barHeight - 4}" fill="rgba(74, 144, 226, 0.6)" rx="2"/>`;
    
    // Label (truncate if too long)
    const displayLabel = label.length > 15 ? label.substring(0, 12) + '...' : label;
    svg += `<text x="${padding.left + labelWidth - 5}" y="${y + barHeight/2 + 4}" text-anchor="end" font-size="11" fill="#333">${displayLabel}</text>`;
    
    // Count
    svg += `<text x="${padding.left + labelWidth + barWidth + 4}" y="${y + barHeight/2 + 4}" text-anchor="start" font-size="10" fill="#666">${item.count}</text>`;
  });
  
  svg += `</svg>`;
  
  return `<div class="histogram-container">${svg}</div>`;
}

// Generate combined frequency table HTML for select type (both asc and desc cumulative)
function generateFrequencyTableHTML(stats, colName) {
  const colOptions = state.options[colName] || {};
  const descData = stats.freqTableDesc;
  const ascData = stats.freqTableAsc;
  
  if (!descData || descData.length === 0) return '';
  
  // Build lookup for ascending cumulative values by key
  const ascLookup = {};
  ascData.forEach(item => {
    ascLookup[item.key] = { cumCount: item.cumCount, cumPercent: item.cumPercent };
  });
  
  let html = `<table class="freq-table">
    <thead>
      <tr>
        <th>Value</th>
        <th>n</th>
        <th>%</th>
        <th>Cum↓ n</th>
        <th>Cum↓ %</th>
        <th>Cum↑ n</th>
        <th>Cum↑ %</th>
      </tr>
    </thead>
    <tbody>`;
  
  descData.forEach(item => {
    const label = colOptions[item.key] || item.key;
    const displayLabel = label.length > 12 ? label.substring(0, 10) + '...' : label;
    const asc = ascLookup[item.key] || { cumCount: '—', cumPercent: '—' };
    html += `<tr>
      <td title="${label}">${displayLabel}</td>
      <td>${item.count}</td>
      <td>${item.percent}%</td>
      <td>${item.cumCount}</td>
      <td>${item.cumPercent}%</td>
      <td>${asc.cumCount}</td>
      <td>${asc.cumPercent}%</td>
    </tr>`;
  });
  
  html += `</tbody></table>`;
  return html;
}

// Boolean Histogram SVG Generator
function generateBooleanHistogramSVG(stats) {
  if (!stats.freqTableDesc || stats.freqTableDesc.length === 0) return '';
  
  const data = stats.freqTableDesc;
  const maxCount = Math.max(...data.map(d => d.count));
  
  const barHeight = 28;
  const labelWidth = 60;
  const barMaxWidth = 150;
  const padding = { top: 10, bottom: 10, left: 10, right: 50 };
  const width = labelWidth + barMaxWidth + padding.left + padding.right;
  const height = data.length * barHeight + padding.top + padding.bottom;
  
  let svg = `<svg width="${width}" height="${height}" class="histogram-svg">`;
  
  data.forEach((item, i) => {
    const y = padding.top + i * barHeight;
    const barWidth = (item.count / maxCount) * barMaxWidth;
    const label = item.key === 'true' ? '✓ True' : '✗ False';
    const color = item.key === 'true' ? 'rgba(34, 197, 94, 0.6)' : 'rgba(239, 68, 68, 0.6)';
    
    svg += `<rect x="${padding.left + labelWidth}" y="${y + 4}" width="${barWidth}" height="${barHeight - 8}" fill="${color}" rx="3"/>`;
    svg += `<text x="${padding.left + labelWidth - 5}" y="${y + barHeight/2 + 4}" text-anchor="end" font-size="12" fill="#333">${label}</text>`;
    svg += `<text x="${padding.left + labelWidth + barWidth + 4}" y="${y + barHeight/2 + 4}" text-anchor="start" font-size="11" fill="#666">${item.count} (${item.percent}%)</text>`;
  });
  
  svg += `</svg>`;
  
  return `<div class="histogram-container">${svg}</div>`;
}

// Boolean Frequency Table HTML Generator (combined asc and desc cumulative)
function generateBooleanFrequencyTableHTML(stats) {
  const descData = stats.freqTableDesc;
  const ascData = stats.freqTableAsc;
  
  if (!descData || descData.length === 0) return '';
  
  // Build lookup for ascending cumulative values by key
  const ascLookup = {};
  ascData.forEach(item => {
    ascLookup[item.key] = { cumCount: item.cumCount, cumPercent: item.cumPercent };
  });
  
  let html = `<table class="freq-table">
    <thead>
      <tr>
        <th>Value</th>
        <th>n</th>
        <th>%</th>
        <th>Cum↓ n</th>
        <th>Cum↓ %</th>
        <th>Cum↑ n</th>
        <th>Cum↑ %</th>
      </tr>
    </thead>
    <tbody>`;
  
  descData.forEach(item => {
    const label = item.key === 'true' ? '✓ True' : '✗ False';
    const asc = ascLookup[item.key] || { cumCount: '—', cumPercent: '—' };
    html += `<tr>
      <td>${label}</td>
      <td>${item.count}</td>
      <td>${item.percent}%</td>
      <td>${item.cumCount}</td>
      <td>${item.cumPercent}%</td>
      <td>${asc.cumCount}</td>
      <td>${asc.cumPercent}%</td>
    </tr>`;
  });
  
  html += `</tbody></table>`;
  return html;
}

// Box Plot SVG Generator
function generateBoxPlotSVG(stats) {
  if (!stats.allNumericValues || stats.allNumericValues.length === 0) return '';
  
  const width = 350;
  const height = 180;
  const padding = { top: 15, bottom: 25, left: 45, right: 15 };
  const plotHeight = height - padding.top - padding.bottom;
  const scatterX = 70;  // X position for scatter points
  const boxX = 115;     // X position for box plot
  const boxWidth = 30;
  const labelX = 170;   // X position for annotations
  
  const min = stats.min;
  const max = stats.max;
  const range = max - min || 1;
  
  // Scale function: value to Y position (inverted because SVG Y grows downward)
  const scaleY = (val) => padding.top + plotHeight - ((val - min) / range) * plotHeight;
  
  let svg = `<svg width="${width}" height="${height}" class="boxplot-svg">`;
  
  // Y-axis
  svg += `<line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${height - padding.bottom}" stroke="#666" stroke-width="1"/>`;
  
  // Y-axis ticks and labels
  const tickValues = [min, stats.q1, stats.median, stats.q3, max];
  tickValues.forEach(val => {
    const y = scaleY(val);
    svg += `<line x1="${padding.left - 4}" y1="${y}" x2="${padding.left}" y2="${y}" stroke="#666" stroke-width="1"/>`;
    svg += `<text x="${padding.left - 6}" y="${y + 3}" text-anchor="end" font-size="9" fill="#888">${val.toFixed(1)}</text>`;
  });
  
  // Scatter plot points (left column) with jitter
  const jitterRange = 15;
  stats.allNumericValues.forEach((val, i) => {
    const y = scaleY(val);
    const jitter = (Math.random() - 0.5) * jitterRange;
    const x = scatterX + jitter;
    
    // Determine color based on outlier status
    let color = 'rgba(74, 144, 226, 0.15)'; // Normal - blue with 10% opacity
    if (stats.farOutliers.includes(val)) {
      color = 'rgba(220, 53, 69, 0.5)'; // Far outlier - red
    } else if (stats.outliers.includes(val)) {
      color = 'rgba(255, 152, 0, 0.5)'; // Outlier - orange
    }
    
    svg += `<circle cx="${x}" cy="${y}" r="3" fill="${color}"/>`;
  });
  
  // Box plot (right side)
  const q1Y = scaleY(stats.q1);
  const q3Y = scaleY(stats.q3);
  const medianY = scaleY(stats.median);
  const whiskerLowY = scaleY(stats.whiskerLow);
  const whiskerHighY = scaleY(stats.whiskerHigh);
  
  // Whiskers (vertical lines)
  svg += `<line x1="${boxX + boxWidth/2}" y1="${whiskerHighY}" x2="${boxX + boxWidth/2}" y2="${q3Y}" stroke="#4a90e2" stroke-width="1.5"/>`;
  svg += `<line x1="${boxX + boxWidth/2}" y1="${q1Y}" x2="${boxX + boxWidth/2}" y2="${whiskerLowY}" stroke="#4a90e2" stroke-width="1.5"/>`;
  
  // Whisker caps (horizontal lines)
  svg += `<line x1="${boxX + boxWidth/4}" y1="${whiskerHighY}" x2="${boxX + 3*boxWidth/4}" y2="${whiskerHighY}" stroke="#4a90e2" stroke-width="1.5"/>`;
  svg += `<line x1="${boxX + boxWidth/4}" y1="${whiskerLowY}" x2="${boxX + 3*boxWidth/4}" y2="${whiskerLowY}" stroke="#4a90e2" stroke-width="1.5"/>`;
  
  // Box (Q1 to Q3)
  svg += `<rect x="${boxX}" y="${q3Y}" width="${boxWidth}" height="${q1Y - q3Y}" fill="rgba(74, 144, 226, 0.3)" stroke="#4a90e2" stroke-width="1.5"/>`;
  
  // Median line
  svg += `<line x1="${boxX}" y1="${medianY}" x2="${boxX + boxWidth}" y2="${medianY}" stroke="#2563eb" stroke-width="2"/>`;
  
  // Mean marker (diamond)
  const meanY = scaleY(stats.mean);
  svg += `<polygon points="${boxX + boxWidth/2},${meanY - 4} ${boxX + boxWidth/2 + 4},${meanY} ${boxX + boxWidth/2},${meanY + 4} ${boxX + boxWidth/2 - 4},${meanY}" fill="#22c55e" stroke="#16a34a" stroke-width="1"/>`;
  
  // Annotations (right side labels)
  const annotationStyle = 'font-size="8" fill="#666"';
  
  // Upper whisker annotation
  svg += `<line x1="${boxX + boxWidth}" y1="${whiskerHighY}" x2="${labelX - 5}" y2="${whiskerHighY}" stroke="#ddd" stroke-width="1" stroke-dasharray="2,2"/>`;
  svg += `<text x="${labelX}" y="${whiskerHighY + 3}" ${annotationStyle}>Upper: Q3+1.5×IQR (Q3−Q1)</text>`;
  
  // Q3 annotation
  svg += `<line x1="${boxX + boxWidth}" y1="${q3Y}" x2="${labelX - 5}" y2="${q3Y}" stroke="#ddd" stroke-width="1" stroke-dasharray="2,2"/>`;
  svg += `<text x="${labelX}" y="${q3Y + 3}" ${annotationStyle}>Q3 (75%)</text>`;
  
  // Median annotation
  svg += `<line x1="${boxX + boxWidth}" y1="${medianY}" x2="${labelX - 5}" y2="${medianY}" stroke="#ddd" stroke-width="1" stroke-dasharray="2,2"/>`;
  svg += `<text x="${labelX}" y="${medianY + 3}" ${annotationStyle}>Median (50%)</text>`;
  
  // Q1 annotation
  svg += `<line x1="${boxX + boxWidth}" y1="${q1Y}" x2="${labelX - 5}" y2="${q1Y}" stroke="#ddd" stroke-width="1" stroke-dasharray="2,2"/>`;
  svg += `<text x="${labelX}" y="${q1Y + 3}" ${annotationStyle}>Q1 (25%)</text>`;
  
  // Lower whisker annotation
  svg += `<line x1="${boxX + boxWidth}" y1="${whiskerLowY}" x2="${labelX - 5}" y2="${whiskerLowY}" stroke="#ddd" stroke-width="1" stroke-dasharray="2,2"/>`;
  svg += `<text x="${labelX}" y="${whiskerLowY + 3}" ${annotationStyle}>Lower: Q1−1.5×IQR (Q3−Q1)</text>`;
  
  // Outliers on box plot side
  stats.outliers.forEach(val => {
    const y = scaleY(val);
    svg += `<circle cx="${boxX + boxWidth/2}" cy="${y}" r="4" fill="none" stroke="#ff9800" stroke-width="1.5"/>`;
  });
  
  // Far outliers on box plot side
  stats.farOutliers.forEach(val => {
    const y = scaleY(val);
    svg += `<circle cx="${boxX + boxWidth/2}" cy="${y}" r="4" fill="none" stroke="#dc3545" stroke-width="2"/>`;
    svg += `<line x1="${boxX + boxWidth/2 - 2}" y1="${y - 2}" x2="${boxX + boxWidth/2 + 2}" y2="${y + 2}" stroke="#dc3545" stroke-width="1.5"/>`;
    svg += `<line x1="${boxX + boxWidth/2 - 2}" y1="${y + 2}" x2="${boxX + boxWidth/2 + 2}" y2="${y - 2}" stroke="#dc3545" stroke-width="1.5"/>`;
  });
  
  // Labels
  svg += `<text x="${scatterX}" y="${height - 8}" text-anchor="middle" font-size="9" fill="#888">Points</text>`;
  svg += `<text x="${boxX + boxWidth/2}" y="${height - 8}" text-anchor="middle" font-size="9" fill="#888">Box</text>`;
  
  svg += `</svg>`;
  
  // Legend
  let legend = `<div class="boxplot-legend">
    <span><span class="legend-dot legend-normal"></span>Normal</span>
    <span><span class="legend-dot legend-outlier"></span>Outlier</span>
    <span><span class="legend-dot legend-far"></span>Far outlier</span>
    <span><span class="legend-diamond"></span>Mean</span>
  </div>`;
  
  return `<div class="boxplot-container">${svg}${legend}</div>`;
}

// Skewness visualization SVG - compares with normal distribution (skewness = 0)
function generateSkewnessSVG(skewness) {
  if (skewness === null || skewness === undefined) return '';
  
  const width = 160;
  const height = 60;
  const centerX = width / 2;
  const baseY = height - 10;
  
  // Clamp skewness for display
  const clampedSkew = Math.max(-3, Math.min(3, skewness));
  
  // Generate normal curve points
  const normalPoints = [];
  for (let x = 0; x <= width; x += 2) {
    const t = (x - centerX) / 30;
    const y = baseY - 35 * Math.exp(-t * t / 2);
    normalPoints.push(`${x},${y}`);
  }
  
  // Generate skewed curve points (using skew-normal approximation)
  const skewedPoints = [];
  for (let x = 0; x <= width; x += 2) {
    const t = (x - centerX) / 30;
    // Shift peak based on skewness
    const shift = -clampedSkew * 0.3;
    const adjustedT = t - shift;
    // Asymmetric tails
    const asymmetry = 1 + clampedSkew * adjustedT * 0.15;
    const y = baseY - 35 * Math.exp(-adjustedT * adjustedT / 2) * Math.max(0.2, asymmetry);
    skewedPoints.push(`${x},${y}`);
  }
  
  let svg = `<svg width="${width}" height="${height}" class="shape-svg">`;
  
  // Baseline
  svg += `<line x1="10" y1="${baseY}" x2="${width-10}" y2="${baseY}" stroke="#ddd" stroke-width="1"/>`;
  
  // Normal distribution (dashed gray)
  svg += `<polyline points="${normalPoints.join(' ')}" fill="none" stroke="#aaa" stroke-width="1.5" stroke-dasharray="3,2"/>`;
  
  // Skewed distribution (solid blue)
  svg += `<polyline points="${skewedPoints.join(' ')}" fill="none" stroke="#4a90e2" stroke-width="2"/>`;
  
  // Center line
  svg += `<line x1="${centerX}" y1="${baseY - 40}" x2="${centerX}" y2="${baseY}" stroke="#ddd" stroke-width="1" stroke-dasharray="2,2"/>`;
  
  svg += `</svg>`;
  
  // Interpretation
  let interpretation = 'Symmetric';
  if (skewness > 0.5) interpretation = 'Right-skewed (positive)';
  else if (skewness < -0.5) interpretation = 'Left-skewed (negative)';
  
  return `
    <div class="shape-chart">
      <div class="shape-chart-title">Skewness: ${skewness.toFixed(3)}</div>
      ${svg}
      <div class="shape-chart-legend">
        <span class="legend-line legend-normal-line"></span> Normal (0)
        <span class="legend-line legend-data-line"></span> Data
      </div>
      <div class="shape-interpretation">${interpretation}</div>
    </div>
  `;
}

// Kurtosis visualization SVG - compares with normal distribution (kurtosis = 3)
function generateKurtosisSVG(kurtosis) {
  if (kurtosis === null || kurtosis === undefined) return '';
  
  const width = 160;
  const height = 60;
  const centerX = width / 2;
  const baseY = height - 10;
  
  // Excess kurtosis (normal = 0)
  const excessKurtosis = kurtosis - 3;
  const clampedKurt = Math.max(-3, Math.min(6, excessKurtosis));
  
  // Generate normal curve points (mesokurtic)
  const normalPoints = [];
  for (let x = 0; x <= width; x += 2) {
    const t = (x - centerX) / 30;
    const y = baseY - 35 * Math.exp(-t * t / 2);
    normalPoints.push(`${x},${y}`);
  }
  
  // Generate curve with different kurtosis
  const kurtPoints = [];
  for (let x = 0; x <= width; x += 2) {
    const t = (x - centerX) / 30;
    // Adjust peak height and tail weight based on kurtosis
    const peakFactor = 1 + clampedKurt * 0.08;
    const tailFactor = 1 + clampedKurt * 0.05;
    const exponent = 2 / (1 + clampedKurt * 0.1);
    const y = baseY - 35 * peakFactor * Math.exp(-Math.pow(Math.abs(t), exponent) * tailFactor / 2);
    kurtPoints.push(`${x},${y}`);
  }
  
  let svg = `<svg width="${width}" height="${height}" class="shape-svg">`;
  
  // Baseline
  svg += `<line x1="10" y1="${baseY}" x2="${width-10}" y2="${baseY}" stroke="#ddd" stroke-width="1"/>`;
  
  // Normal distribution (dashed gray)
  svg += `<polyline points="${normalPoints.join(' ')}" fill="none" stroke="#aaa" stroke-width="1.5" stroke-dasharray="3,2"/>`;
  
  // Data distribution (solid blue)
  svg += `<polyline points="${kurtPoints.join(' ')}" fill="none" stroke="#4a90e2" stroke-width="2"/>`;
  
  svg += `</svg>`;
  
  // Interpretation
  let interpretation = 'Mesokurtic (normal)';
  if (excessKurtosis > 1) interpretation = 'Leptokurtic (heavy tails)';
  else if (excessKurtosis < -1) interpretation = 'Platykurtic (light tails)';
  
  return `
    <div class="shape-chart">
      <div class="shape-chart-title">Kurtosis: ${kurtosis.toFixed(3)} (excess: ${excessKurtosis.toFixed(3)})</div>
      ${svg}
      <div class="shape-chart-legend">
        <span class="legend-line legend-normal-line"></span> Normal (3)
        <span class="legend-line legend-data-line"></span> Data
      </div>
      <div class="shape-interpretation">${interpretation}</div>
    </div>
  `;
}

// DateTime Box Plot SVG Generator (uses numeric milliseconds)
function generateDateTimeBoxPlotSVG(stats, type) {
  if (!stats.allNumericValues || stats.allNumericValues.length === 0) return '';
  
  const width = 350;
  const height = 180;
  const padding = { top: 15, bottom: 25, left: 45, right: 15 };
  const plotHeight = height - padding.top - padding.bottom;
  const scatterX = 70;
  const boxX = 115;
  const boxWidth = 30;
  const labelX = 170;
  
  const min = stats.numMin;
  const max = stats.numMax;
  const range = max - min || 1;
  
  const scaleY = (val) => padding.top + plotHeight - ((val - min) / range) * plotHeight;
  
  let svg = `<svg width="${width}" height="${height}" class="boxplot-svg">`;
  
  // Y-axis
  svg += `<line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${height - padding.bottom}" stroke="#666" stroke-width="1"/>`;
  
  // Scatter plot points with jitter
  const jitterRange = 15;
  stats.allNumericValues.forEach((val) => {
    const y = scaleY(val);
    const jitter = (Math.random() - 0.5) * jitterRange;
    const x = scatterX + jitter;
    
    let color = 'rgba(74, 144, 226, 0.15)';
    if (stats.farOutliers.includes(val)) {
      color = 'rgba(220, 53, 69, 0.5)';
    } else if (stats.outliers.includes(val)) {
      color = 'rgba(255, 152, 0, 0.5)';
    }
    
    svg += `<circle cx="${x}" cy="${y}" r="3" fill="${color}"/>`;
  });
  
  // Box plot
  const q1Y = scaleY(stats.numQ1);
  const q3Y = scaleY(stats.numQ3);
  const medianY = scaleY(stats.numMedian);
  const whiskerLowY = scaleY(stats.whiskerLow);
  const whiskerHighY = scaleY(stats.whiskerHigh);
  
  // Whiskers
  svg += `<line x1="${boxX + boxWidth/2}" y1="${whiskerHighY}" x2="${boxX + boxWidth/2}" y2="${q3Y}" stroke="#4a90e2" stroke-width="1.5"/>`;
  svg += `<line x1="${boxX + boxWidth/2}" y1="${q1Y}" x2="${boxX + boxWidth/2}" y2="${whiskerLowY}" stroke="#4a90e2" stroke-width="1.5"/>`;
  
  // Whisker caps
  svg += `<line x1="${boxX + boxWidth/4}" y1="${whiskerHighY}" x2="${boxX + 3*boxWidth/4}" y2="${whiskerHighY}" stroke="#4a90e2" stroke-width="1.5"/>`;
  svg += `<line x1="${boxX + boxWidth/4}" y1="${whiskerLowY}" x2="${boxX + 3*boxWidth/4}" y2="${whiskerLowY}" stroke="#4a90e2" stroke-width="1.5"/>`;
  
  // Box
  svg += `<rect x="${boxX}" y="${q3Y}" width="${boxWidth}" height="${q1Y - q3Y}" fill="rgba(74, 144, 226, 0.3)" stroke="#4a90e2" stroke-width="1.5"/>`;
  
  // Median line
  svg += `<line x1="${boxX}" y1="${medianY}" x2="${boxX + boxWidth}" y2="${medianY}" stroke="#2563eb" stroke-width="2"/>`;
  
  // Mean marker
  const meanY = scaleY(stats.numMean);
  svg += `<polygon points="${boxX + boxWidth/2},${meanY - 4} ${boxX + boxWidth/2 + 4},${meanY} ${boxX + boxWidth/2},${meanY + 4} ${boxX + boxWidth/2 - 4},${meanY}" fill="#22c55e" stroke="#16a34a" stroke-width="1"/>`;
  
  // Annotations
  const annotationStyle = 'font-size="8" fill="#666"';
  
  svg += `<line x1="${boxX + boxWidth}" y1="${whiskerHighY}" x2="${labelX - 5}" y2="${whiskerHighY}" stroke="#ddd" stroke-width="1" stroke-dasharray="2,2"/>`;
  svg += `<text x="${labelX}" y="${whiskerHighY + 3}" ${annotationStyle}>Upper: Q3+1.5×IQR (Q3−Q1)</text>`;
  
  svg += `<line x1="${boxX + boxWidth}" y1="${q3Y}" x2="${labelX - 5}" y2="${q3Y}" stroke="#ddd" stroke-width="1" stroke-dasharray="2,2"/>`;
  svg += `<text x="${labelX}" y="${q3Y + 3}" ${annotationStyle}>Q3 (75%)</text>`;
  
  svg += `<line x1="${boxX + boxWidth}" y1="${medianY}" x2="${labelX - 5}" y2="${medianY}" stroke="#ddd" stroke-width="1" stroke-dasharray="2,2"/>`;
  svg += `<text x="${labelX}" y="${medianY + 3}" ${annotationStyle}>Median (50%)</text>`;
  
  svg += `<line x1="${boxX + boxWidth}" y1="${q1Y}" x2="${labelX - 5}" y2="${q1Y}" stroke="#ddd" stroke-width="1" stroke-dasharray="2,2"/>`;
  svg += `<text x="${labelX}" y="${q1Y + 3}" ${annotationStyle}>Q1 (25%)</text>`;
  
  svg += `<line x1="${boxX + boxWidth}" y1="${whiskerLowY}" x2="${labelX - 5}" y2="${whiskerLowY}" stroke="#ddd" stroke-width="1" stroke-dasharray="2,2"/>`;
  svg += `<text x="${labelX}" y="${whiskerLowY + 3}" ${annotationStyle}>Lower: Q1−1.5×IQR (Q3−Q1)</text>`;
  
  // Outliers
  stats.outliers.forEach(val => {
    const y = scaleY(val);
    svg += `<circle cx="${boxX + boxWidth/2}" cy="${y}" r="4" fill="none" stroke="#ff9800" stroke-width="1.5"/>`;
  });
  
  stats.farOutliers.forEach(val => {
    const y = scaleY(val);
    svg += `<circle cx="${boxX + boxWidth/2}" cy="${y}" r="4" fill="none" stroke="#dc3545" stroke-width="2"/>`;
  });
  
  // Labels
  svg += `<text x="${scatterX}" y="${height - 8}" text-anchor="middle" font-size="9" fill="#888">Points</text>`;
  svg += `<text x="${boxX + boxWidth/2}" y="${height - 8}" text-anchor="middle" font-size="9" fill="#888">Box</text>`;
  
  svg += `</svg>`;
  
  let legend = `<div class="boxplot-legend">
    <span><span class="legend-dot legend-normal"></span>Normal</span>
    <span><span class="legend-dot legend-outlier"></span>Outlier</span>
    <span><span class="legend-dot legend-far"></span>Far outlier</span>
    <span><span class="legend-diamond"></span>Mean</span>
  </div>`;
  
  return `<div class="boxplot-container">${svg}${legend}</div>`;
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
    nullPercent: ((nullCount / total) * 100).toFixed(2)
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
      
      // Whiskers and outliers for box plot
      const lowerWhisker = stats.q1 - 1.5 * stats.iqr;
      const upperWhisker = stats.q3 + 1.5 * stats.iqr;
      const lowerFar = stats.q1 - 3 * stats.iqr;
      const upperFar = stats.q3 + 3 * stats.iqr;
      
      // Find actual whisker endpoints (min/max within bounds)
      stats.whiskerLow = nums.find(n => n >= lowerWhisker) ?? stats.min;
      stats.whiskerHigh = nums.slice().reverse().find(n => n <= upperWhisker) ?? stats.max;
      
      // Classify points
      stats.normalPoints = nums.filter(n => n >= lowerWhisker && n <= upperWhisker);
      stats.outliers = nums.filter(n => (n < lowerWhisker && n >= lowerFar) || (n > upperWhisker && n <= upperFar));
      stats.farOutliers = nums.filter(n => n < lowerFar || n > upperFar);
      stats.allNumericValues = nums;
      
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
  } else if (type === 'select') {
    // Categorical statistics for select type
    const freq = {};
    values.forEach(v => freq[v] = (freq[v] || 0) + 1);
    
    const k = Object.keys(freq).length; // Number of categories
    stats.categoryCount = k;
    
    // Frequency table sorted by count descending
    const sortedDesc = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    const sortedAsc = Object.entries(freq).sort((a, b) => a[1] - b[1]);
    
    // Build frequency table with absolute, relative, and cumulative frequencies
    let cumAsc = 0;
    let cumDesc = 0;
    const n = nonNull;
    
    stats.freqTableDesc = sortedDesc.map(([key, count]) => {
      cumDesc += count;
      return {
        key,
        count,
        percent: ((count / n) * 100).toFixed(2),
        cumCount: cumDesc,
        cumPercent: ((cumDesc / n) * 100).toFixed(2)
      };
    });
    
    stats.freqTableAsc = sortedAsc.map(([key, count]) => {
      cumAsc += count;
      return {
        key,
        count,
        percent: ((count / n) * 100).toFixed(2),
        cumCount: cumAsc,
        cumPercent: ((cumAsc / n) * 100).toFixed(2)
      };
    });
    
    // Mode (most frequent category/categories)
    const maxFreq = Math.max(...Object.values(freq));
    stats.mode = Object.keys(freq).filter(k => freq[k] === maxFreq);
    stats.modeCount = maxFreq;
    stats.modePercent = ((maxFreq / n) * 100).toFixed(2);
    
    // Entropy (Shannon entropy for diversity measurement)
    const probabilities = Object.values(freq).map(c => c / n);
    stats.entropy = -probabilities.reduce((sum, p) => {
      if (p > 0) return sum + p * Math.log2(p);
      return sum;
    }, 0);
    stats.maxEntropy = Math.log2(k); // Maximum possible entropy
    stats.normalizedEntropy = k > 1 ? (stats.entropy / stats.maxEntropy) : 0;
    
    // Gini-Simpson Index (probability that two random items are different)
    stats.giniSimpson = 1 - probabilities.reduce((sum, p) => sum + p * p, 0);
    
    // Variation Ratio (proportion of cases not in the mode)
    stats.variationRatio = 1 - (maxFreq / n);
    
    // Index of Qualitative Variation (IQV) - 0 to 1, 1 = max diversity
    if (k > 1) {
      const sumPSquared = probabilities.reduce((sum, p) => sum + p * p, 0);
      stats.iqv = (k / (k - 1)) * (1 - sumPSquared);
    } else {
      stats.iqv = 0;
    }
    
    stats.frequencies = freq;
  } else if (type === 'string' || type === 'multilinestring') {
    const freq = {};
    values.forEach(v => freq[v] = (freq[v] || 0) + 1);
    stats.uniqueCount = Object.keys(freq).length;
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    stats.topValues = sorted.slice(0, 5);
    
    // Length statistics (Unicode character count)
    const lengths = values.map(v => [...String(v)].length);
    lengths.sort((a, b) => a - b);
    
    if (lengths.length > 0) {
      stats.lengthStats = {};
      stats.lengthStats.allNumericValues = lengths;
      stats.lengthStats.min = Math.min(...lengths);
      stats.lengthStats.max = Math.max(...lengths);
      stats.lengthStats.sum = lengths.reduce((a, b) => a + b, 0);
      stats.lengthStats.mean = stats.lengthStats.sum / lengths.length;
      stats.lengthStats.range = stats.lengthStats.max - stats.lengthStats.min;
      
      // Median
      const mid = Math.floor(lengths.length / 2);
      stats.lengthStats.median = lengths.length % 2 ? lengths[mid] : (lengths[mid - 1] + lengths[mid]) / 2;
      
      // Mode
      const lenFreq = {};
      lengths.forEach(v => lenFreq[v] = (lenFreq[v] || 0) + 1);
      const maxLenFreq = Math.max(...Object.values(lenFreq));
      stats.lengthStats.mode = Object.keys(lenFreq).filter(k => lenFreq[k] === maxLenFreq).map(Number);
      
      // Variance and Std Dev
      stats.lengthStats.variance = lengths.reduce((sum, n) => sum + Math.pow(n - stats.lengthStats.mean, 2), 0) / lengths.length;
      stats.lengthStats.stdDev = Math.sqrt(stats.lengthStats.variance);
      
      // Quartiles
      const q1Idx = Math.floor(lengths.length * 0.25);
      const q3Idx = Math.floor(lengths.length * 0.75);
      stats.lengthStats.q1 = lengths[q1Idx];
      stats.lengthStats.q3 = lengths[q3Idx];
      stats.lengthStats.iqr = stats.lengthStats.q3 - stats.lengthStats.q1;
      
      // Whiskers for box plot
      const whiskerLow = stats.lengthStats.q1 - 1.5 * stats.lengthStats.iqr;
      const whiskerHigh = stats.lengthStats.q3 + 1.5 * stats.lengthStats.iqr;
      stats.lengthStats.whiskerLow = Math.max(whiskerLow, stats.lengthStats.min);
      stats.lengthStats.whiskerHigh = Math.min(whiskerHigh, stats.lengthStats.max);
      
      // Outliers
      stats.lengthStats.outliers = lengths.filter(n => n < whiskerLow || n > whiskerHigh);
      const farLow = stats.lengthStats.q1 - 3 * stats.lengthStats.iqr;
      const farHigh = stats.lengthStats.q3 + 3 * stats.lengthStats.iqr;
      stats.lengthStats.farOutliers = lengths.filter(n => n < farLow || n > farHigh);
      
      // Skewness
      const m3 = lengths.reduce((sum, n) => sum + Math.pow(n - stats.lengthStats.mean, 3), 0) / lengths.length;
      stats.lengthStats.skewness = stats.lengthStats.stdDev > 0 ? m3 / Math.pow(stats.lengthStats.stdDev, 3) : 0;
      
      // Kurtosis
      const m4 = lengths.reduce((sum, n) => sum + Math.pow(n - stats.lengthStats.mean, 4), 0) / lengths.length;
      stats.lengthStats.kurtosis = stats.lengthStats.variance > 0 ? (m4 / Math.pow(stats.lengthStats.variance, 2)) : 0;
    }
    
    // Line count statistics (only for multilinestring)
    if (type === 'multilinestring') {
      const lineCounts = values.map(v => String(v).split('\n').length);
      lineCounts.sort((a, b) => a - b);
      
      if (lineCounts.length > 0) {
        stats.lineStats = {};
        stats.lineStats.allNumericValues = lineCounts;
        stats.lineStats.min = Math.min(...lineCounts);
        stats.lineStats.max = Math.max(...lineCounts);
        stats.lineStats.sum = lineCounts.reduce((a, b) => a + b, 0);
        stats.lineStats.mean = stats.lineStats.sum / lineCounts.length;
        stats.lineStats.range = stats.lineStats.max - stats.lineStats.min;
        
        // Median
        const midLine = Math.floor(lineCounts.length / 2);
        stats.lineStats.median = lineCounts.length % 2 ? lineCounts[midLine] : (lineCounts[midLine - 1] + lineCounts[midLine]) / 2;
        
        // Mode
        const lineFreq = {};
        lineCounts.forEach(v => lineFreq[v] = (lineFreq[v] || 0) + 1);
        const maxLineFreq = Math.max(...Object.values(lineFreq));
        stats.lineStats.mode = Object.keys(lineFreq).filter(k => lineFreq[k] === maxLineFreq).map(Number);
        
        // Variance and Std Dev
        stats.lineStats.variance = lineCounts.reduce((sum, n) => sum + Math.pow(n - stats.lineStats.mean, 2), 0) / lineCounts.length;
        stats.lineStats.stdDev = Math.sqrt(stats.lineStats.variance);
        
        // Quartiles
        const q1LineIdx = Math.floor(lineCounts.length * 0.25);
        const q3LineIdx = Math.floor(lineCounts.length * 0.75);
        stats.lineStats.q1 = lineCounts[q1LineIdx];
        stats.lineStats.q3 = lineCounts[q3LineIdx];
        stats.lineStats.iqr = stats.lineStats.q3 - stats.lineStats.q1;
        
        // Whiskers for box plot
        const whiskerLineLow = stats.lineStats.q1 - 1.5 * stats.lineStats.iqr;
        const whiskerLineHigh = stats.lineStats.q3 + 1.5 * stats.lineStats.iqr;
        stats.lineStats.whiskerLow = Math.max(whiskerLineLow, stats.lineStats.min);
        stats.lineStats.whiskerHigh = Math.min(whiskerLineHigh, stats.lineStats.max);
        
        // Outliers
        stats.lineStats.outliers = lineCounts.filter(n => n < whiskerLineLow || n > whiskerLineHigh);
        const farLineLow = stats.lineStats.q1 - 3 * stats.lineStats.iqr;
        const farLineHigh = stats.lineStats.q3 + 3 * stats.lineStats.iqr;
        stats.lineStats.farOutliers = lineCounts.filter(n => n < farLineLow || n > farLineHigh);
        
        // Skewness
        const m3Line = lineCounts.reduce((sum, n) => sum + Math.pow(n - stats.lineStats.mean, 3), 0) / lineCounts.length;
        stats.lineStats.skewness = stats.lineStats.stdDev > 0 ? m3Line / Math.pow(stats.lineStats.stdDev, 3) : 0;
        
        // Kurtosis
        const m4Line = lineCounts.reduce((sum, n) => sum + Math.pow(n - stats.lineStats.mean, 4), 0) / lineCounts.length;
        stats.lineStats.kurtosis = stats.lineStats.variance > 0 ? (m4Line / Math.pow(stats.lineStats.variance, 2)) : 0;
      }
    }
  } else if (type === 'boolean') {
    // Treat boolean as categorical data
    const freq = {};
    values.forEach(v => {
      const key = v === true ? 'true' : 'false';
      freq[key] = (freq[key] || 0) + 1;
    });
    
    const trueCount = freq['true'] || 0;
    const falseCount = freq['false'] || 0;
    stats.trueCount = trueCount;
    stats.falseCount = falseCount;
    stats.truePercent = ((trueCount / nonNull) * 100).toFixed(1);
    stats.falsePercent = ((falseCount / nonNull) * 100).toFixed(1);
    
    const k = Object.keys(freq).length;
    stats.categoryCount = k;
    
    const n = nonNull;
    const sortedDesc = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    const sortedAsc = Object.entries(freq).sort((a, b) => a[1] - b[1]);
    
    let cumDesc = 0;
    let cumAsc = 0;
    
    stats.freqTableDesc = sortedDesc.map(([key, count]) => {
      cumDesc += count;
      return {
        key,
        count,
        percent: ((count / n) * 100).toFixed(2),
        cumCount: cumDesc,
        cumPercent: ((cumDesc / n) * 100).toFixed(2)
      };
    });
    
    stats.freqTableAsc = sortedAsc.map(([key, count]) => {
      cumAsc += count;
      return {
        key,
        count,
        percent: ((count / n) * 100).toFixed(2),
        cumCount: cumAsc,
        cumPercent: ((cumAsc / n) * 100).toFixed(2)
      };
    });
    
    // Mode
    const maxFreq = Math.max(...Object.values(freq));
    stats.mode = Object.keys(freq).filter(k => freq[k] === maxFreq);
    stats.modeCount = maxFreq;
    stats.modePercent = ((maxFreq / n) * 100).toFixed(2);
    
    // Entropy
    const probabilities = Object.values(freq).map(c => c / n);
    stats.entropy = -probabilities.reduce((sum, p) => {
      if (p > 0) return sum + p * Math.log2(p);
      return sum;
    }, 0);
    stats.maxEntropy = Math.log2(k);
    stats.normalizedEntropy = k > 1 ? (stats.entropy / stats.maxEntropy) : 0;
    
    // Gini-Simpson Index
    stats.giniSimpson = 1 - probabilities.reduce((sum, p) => sum + p * p, 0);
    
    // Variation Ratio
    stats.variationRatio = 1 - (maxFreq / n);
    
    // IQV
    if (k > 1) {
      const sumPSquared = probabilities.reduce((sum, p) => sum + p * p, 0);
      stats.iqv = (k / (k - 1)) * (1 - sumPSquared);
    } else {
      stats.iqv = 0;
    }
    
    stats.frequencies = freq;
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
      const q1Ms = nums[q1Idx];
      const q3Ms = nums[q3Idx];
      stats.q1 = formatValue(q1Ms);
      stats.q3 = formatValue(q3Ms);
      const iqrMs = q3Ms - q1Ms;
      if (type === 'time') {
        stats.iqr = formatValue(iqrMs);
      } else {
        stats.iqr = `${(iqrMs / (1000 * 60 * 60 * 24)).toFixed(1)} days`;
      }
      
      // Store numeric values for box plot generation
      stats.allNumericValues = nums;
      stats.numMin = Math.min(...nums);
      stats.numMax = Math.max(...nums);
      stats.numQ1 = q1Ms;
      stats.numQ3 = q3Ms;
      stats.numMedian = medianMs;
      stats.numMean = meanMs;
      stats.numIqr = iqrMs;
      
      // Whiskers for box plot
      const whiskerLow = q1Ms - 1.5 * iqrMs;
      const whiskerHigh = q3Ms + 1.5 * iqrMs;
      stats.whiskerLow = Math.max(whiskerLow, stats.numMin);
      stats.whiskerHigh = Math.min(whiskerHigh, stats.numMax);
      
      // Outliers
      stats.outliers = nums.filter(n => n < whiskerLow || n > whiskerHigh);
      const farLow = q1Ms - 3 * iqrMs;
      const farHigh = q3Ms + 3 * iqrMs;
      stats.farOutliers = nums.filter(n => n < farLow || n > farHigh);
      
      // Skewness (Fisher's)
      const m3 = nums.reduce((sum, n) => sum + Math.pow(n - meanMs, 3), 0) / nums.length;
      stats.skewness = m3 / Math.pow(stats.stdDev, 3);
      
      // Kurtosis (Fisher's)
      const m4 = nums.reduce((sum, n) => sum + Math.pow(n - meanMs, 4), 0) / nums.length;
      stats.kurtosis = (m4 / Math.pow(stats.variance, 2));
    }
  } else if (type === 'relation') {
    // Statistics based on row counts in nested relations
    const rowCounts = values.map(v => v?.items?.length || 0);
    
    if (rowCounts.length > 0) {
      rowCounts.sort((a, b) => a - b);
      
      stats.allNumericValues = rowCounts;
      stats.min = Math.min(...rowCounts);
      stats.max = Math.max(...rowCounts);
      stats.sum = rowCounts.reduce((a, b) => a + b, 0);
      stats.mean = stats.sum / rowCounts.length;
      stats.range = stats.max - stats.min;
      
      // Median
      const mid = Math.floor(rowCounts.length / 2);
      stats.median = rowCounts.length % 2 ? rowCounts[mid] : (rowCounts[mid - 1] + rowCounts[mid]) / 2;
      
      // Mode
      const freq = {};
      rowCounts.forEach(v => freq[v] = (freq[v] || 0) + 1);
      const maxFreq = Math.max(...Object.values(freq));
      stats.mode = Object.keys(freq).filter(k => freq[k] === maxFreq).map(Number);
      
      // Variance and Std Dev
      stats.variance = rowCounts.reduce((sum, n) => sum + Math.pow(n - stats.mean, 2), 0) / rowCounts.length;
      stats.stdDev = Math.sqrt(stats.variance);
      
      // Quartiles
      const q1Idx = Math.floor(rowCounts.length * 0.25);
      const q3Idx = Math.floor(rowCounts.length * 0.75);
      stats.q1 = rowCounts[q1Idx];
      stats.q3 = rowCounts[q3Idx];
      stats.iqr = stats.q3 - stats.q1;
      
      // Whiskers for box plot
      const whiskerLow = stats.q1 - 1.5 * stats.iqr;
      const whiskerHigh = stats.q3 + 1.5 * stats.iqr;
      stats.whiskerLow = Math.max(whiskerLow, stats.min);
      stats.whiskerHigh = Math.min(whiskerHigh, stats.max);
      
      // Outliers
      stats.outliers = rowCounts.filter(n => n < whiskerLow || n > whiskerHigh);
      const farLow = stats.q1 - 3 * stats.iqr;
      const farHigh = stats.q3 + 3 * stats.iqr;
      stats.farOutliers = rowCounts.filter(n => n < farLow || n > farHigh);
      
      // Skewness
      const m3 = rowCounts.reduce((sum, n) => sum + Math.pow(n - stats.mean, 3), 0) / rowCounts.length;
      stats.skewness = stats.stdDev > 0 ? m3 / Math.pow(stats.stdDev, 3) : 0;
      
      // Kurtosis
      const m4 = rowCounts.reduce((sum, n) => sum + Math.pow(n - stats.mean, 4), 0) / rowCounts.length;
      stats.kurtosis = stats.variance > 0 ? (m4 / Math.pow(stats.variance, 2)) : 0;
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
function formatCellValue(value, type, colName) {
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
  if (type === 'select') {
    const colOptions = state.options[colName];
    if (colOptions && colOptions[value] !== undefined) {
      return `<span class="select-display">${colOptions[value]}</span>`;
    }
    return `<span class="select-display-key">${value}</span>`;
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

function removeSelectedRows() {
  if (state.selectedRows.size === 0) return;
  
  if (!confirm(`Remove ${state.selectedRows.size} selected rows from the data?`)) return;
  
  // Get sorted indices to remove (descending to preserve indices)
  const indicesToRemove = [...state.selectedRows].sort((a, b) => b - a);
  
  indicesToRemove.forEach(idx => {
    state.relation.items.splice(idx, 1);
  });
  
  state.selectedRows.clear();
  state.currentPage = 1;
  renderTable();
  updateJsonOutput();
}

function removeUnselectedRows() {
  if (state.selectedRows.size === 0) return;
  
  const unselectedCount = state.sortedIndices.length - state.selectedRows.size;
  if (!confirm(`Remove ${unselectedCount} unselected rows from the data? Only ${state.selectedRows.size} selected rows will remain.`)) return;
  
  // Keep only selected rows (create new array with selected items)
  const selectedIndices = [...state.selectedRows].sort((a, b) => a - b);
  state.relation.items = selectedIndices.map(idx => state.relation.items[idx]);
  
  state.selectedRows.clear();
  state.currentPage = 1;
  renderTable();
  updateJsonOutput();
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
    
    if (type === 'select') {
      const colName = state.columnNames[colIdx];
      const colOptions = state.options[colName];
      const span = document.createElement('span');
      span.className = 'relation-cell-readonly select-display';
      if (colOptions && colOptions[value] !== undefined) {
        span.innerHTML = colOptions[value];
      } else if (value !== null && value !== undefined) {
        span.textContent = value;
      } else {
        span.textContent = '—';
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
  } else if (type === 'select') {
    const colName = state.columnNames[colIdx];
    const colOptions = state.options[colName] || {};
    const select = document.createElement('select');
    select.dataset.row = rowIdx;
    select.dataset.col = colIdx;
    select.className = 'relation-select';
    
    // Add empty option for null
    const emptyOpt = document.createElement('option');
    emptyOpt.value = '';
    emptyOpt.textContent = '— Select —';
    select.appendChild(emptyOpt);
    
    // Add options
    for (const [key, html] of Object.entries(colOptions)) {
      const opt = document.createElement('option');
      opt.value = key;
      opt.innerHTML = html;
      if (value === key) opt.selected = true;
      select.appendChild(opt);
    }
    
    wrapper.appendChild(select);
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

function applyConditionalFormatting(value, colIdx, cell, rowIdx) {
  const rules = state.formatting[colIdx];
  const type = state.columnTypes[colIdx];
  
  if (rules && rules.length > 0) {
    for (const rule of rules) {
      if (matchesFormattingCondition(value, rule.condition, type)) {
        if (rule.style.color) cell.style.color = rule.style.color;
        if (rule.style.backgroundColor) {
          cell.style.backgroundColor = rule.style.backgroundColor;
          if (!rule.style.color) {
            const textColor = getContrastTextColor(rule.style.backgroundColor);
            if (textColor) cell.style.color = textColor;
          }
        }
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
  
  applyPersistedColor(colIdx, cell, rowIdx);
}

function applyPersistedColor(colIdx, cell, rowIdx) {
  if (!state.relation || !state.relation.colored_items) return;
  if (!state.columnNames || !state.relation.items) return;
  
  const colName = state.columnNames[colIdx];
  const coloredItems = state.relation.colored_items[colName];
  if (!coloredItems || coloredItems.length === 0) return;
  
  const idColIdx = state.columnNames.indexOf('id');
  if (idColIdx < 0) return;
  
  const row = state.relation.items[rowIdx];
  if (!row) return;
  
  const rowId = row[idColIdx];
  
  if (rowId === null || rowId === undefined) return;
  
  const colorItem = coloredItems.find(item => item.id === rowId);
  if (colorItem) {
    cell.style.backgroundColor = colorItem.color;
    const textColor = getContrastTextColor(colorItem.color);
    if (textColor) cell.style.color = textColor;
  }
}

function matchesFormattingCondition(value, condition, type) {
  if (condition.activeFilter) return hasActiveFilter();
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
      <select id="selection-actions" class="selection-actions-select">
        <option value="" disabled selected>Selection Actions...</option>
        <option value="invert-page">↔ Invert Page</option>
        <option value="invert-all">↔ Invert All</option>
        <option value="remove-selected" ${selectedRecords === 0 ? 'disabled' : ''}>✕ Remove Selected (${selectedRecords})</option>
        <option value="remove-unselected" ${selectedRecords === 0 ? 'disabled' : ''}>✕ Remove Unselected (${filteredRecords - selectedRecords})</option>
      </select>
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
  
  document.getElementById('selection-actions').addEventListener('change', (e) => {
    const action = e.target.value;
    e.target.value = ''; // Reset to placeholder
    
    switch (action) {
      case 'invert-page':
        invertSelection(true);
        break;
      case 'invert-all':
        invertSelection(false);
        break;
      case 'remove-selected':
        removeSelectedRows();
        break;
      case 'remove-unselected':
        removeUnselectedRows();
        break;
    }
  });
  
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

function syncFooterColumnWidths(mainTable, footerTable) {
  // Wait for DOM to render, then sync widths
  requestAnimationFrame(() => {
    const mainCells = mainTable.querySelectorAll('thead th');
    const footerCells = footerTable.querySelectorAll('tfoot td');
    
    mainCells.forEach((th, idx) => {
      if (footerCells[idx]) {
        footerCells[idx].style.width = th.offsetWidth + 'px';
        footerCells[idx].style.minWidth = th.offsetWidth + 'px';
      }
    });
    
    // Match total table width
    footerTable.style.width = mainTable.offsetWidth + 'px';
  });
  
  // Sync horizontal scroll (footer has overflow hidden, main controls scroll)
  const tableWrapper = mainTable.closest('.relation-table-wrapper');
  const footerWrapper = footerTable.closest('.relation-footer-wrapper');
  
  if (tableWrapper && footerWrapper) {
    tableWrapper.addEventListener('scroll', () => {
      footerWrapper.scrollLeft = tableWrapper.scrollLeft;
    });
  }
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
      
      const colType = state.columnTypes[colIdx];
      groupHtml += `
        <div class="group-by-col" data-col="${colIdx}">
          <strong>${colName}:</strong>
          <select class="group-value-select" data-col="${colIdx}">
            <option value="__all__"${!hasSelection ? ' selected' : ''}>All (${uniqueValues.length})</option>
            ${uniqueValues.map(v => {
              const val = v === null ? '__null__' : v;
              let label;
              if (v === null) {
                label = '(null)';
              } else if (colType === 'select') {
                const colOptions = state.options[colName];
                label = (colOptions && colOptions[v] !== undefined) ? colOptions[v] : String(v);
              } else {
                label = String(v);
              }
              const selected = hasSelection && String(currentValue) === String(v) ? ' selected' : '';
              return `<option value="${val}"${selected}>${escapeHtml(label)}</option>`;
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
      applyConditionalFormatting(value, colIdx, td, rowIdx);
      tr.appendChild(td);
    });
    
    tbody.appendChild(tr);
  });
  
  table.appendChild(tbody);
  
  tableWrapper.appendChild(table);
  container.appendChild(tableWrapper);
  
  // Footer table (separate, outside scroll area)
  const footerWrapper = document.createElement('div');
  footerWrapper.className = 'relation-footer-wrapper';
  
  const footerTable = document.createElement('table');
  footerTable.className = 'relation-table relation-footer-table';
  
  const tfoot = document.createElement('tfoot');
  const footerRow = document.createElement('tr');
  
  footerRow.appendChild(document.createElement('td')); // Select column
  footerRow.appendChild(document.createElement('td')); // Operations column
  footerRow.appendChild(document.createElement('td')); // Index column
  
  state.columnNames.forEach((_, colIdx) => {
    if (state.groupByColumns.includes(colIdx)) return;
    
    const td = document.createElement('td');
    td.className = 'relation-td-stats';
    td.innerHTML = `<button class="btn-stats" data-col="${colIdx}" title="Statistics">Σ</button>`;
    footerRow.appendChild(td);
  });
  
  tfoot.appendChild(footerRow);
  footerTable.appendChild(tfoot);
  footerWrapper.appendChild(footerTable);
  container.appendChild(footerWrapper);
  
  // Sync column widths between main table and footer
  syncFooterColumnWidths(table, footerTable);
  
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
  
  // Re-add resize handle if it was removed
  const existingHandle = container.querySelector('.resize-handle');
  if (!existingHandle) {
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    resizeHandle.dataset.testid = 'resize-handle';
    container.appendChild(resizeHandle);
    setupResizeHandle();
  }
}

function attachTableEventListeners() {
  // Header click for sorting
  document.querySelectorAll('.relation-th-sortable').forEach(th => {
    th.addEventListener('click', (e) => {
      const colIdx = parseInt(th.dataset.col);
      if (e.ctrlKey || e.metaKey) {
        // Ctrl+click toggles column selection
        if (state.selectedColumns.has(colIdx)) {
          state.selectedColumns.delete(colIdx);
        } else {
          state.selectedColumns.add(colIdx);
        }
        renderTable();
      } else {
        // Normal click or shift+click for sorting
        handleSort(colIdx, e.shiftKey);
      }
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
    if (e.target.matches('.relation-input, .relation-textarea, .relation-select')) {
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
          <button class="column-menu-item" data-action="select-all-cols">Select All Columns</button>
          <button class="column-menu-item ${state.selectedColumns.size > 0 ? '' : 'disabled'}" data-action="group-selected-cols" ${state.selectedColumns.size > 0 ? '' : 'disabled'}>Group Selected → Relation</button>
          <button class="column-menu-item ${state.selectedColumns.size > 0 ? '' : 'disabled'}" data-action="clear-col-selection" ${state.selectedColumns.size > 0 ? '' : 'disabled'}>Clear Selection</button>
        </div>
      </div>
      <div class="accordion-section" data-section="formatting">
        <div class="accordion-header">Conditional Formatting <span class="accordion-arrow">▶</span></div>
        <div class="accordion-content">
          <button class="column-menu-item" data-action="format-databar">Color Bar</button>
          <button class="column-menu-item" data-action="format-color-scale">Color Scale</button>
          <button class="column-menu-item ${hasActiveFilter() ? '' : 'disabled'}" data-action="format-active-filter" ${hasActiveFilter() ? '' : 'disabled'}>Active Filter Color...</button>
          <button class="column-menu-item" data-action="format-clear">✕ Clear Formatting</button>
        </div>
      </div>
      <div class="accordion-section" data-section="remove">
        <div class="accordion-header">Remove <span class="accordion-arrow">▶</span></div>
        <div class="accordion-content">
          <button class="column-menu-item" data-action="remove-column">Remove Column</button>
          <button class="column-menu-item ${state.selectedColumns.size > 1 ? '' : 'disabled'}" data-action="remove-selected-cols" ${state.selectedColumns.size > 1 ? '' : 'disabled'}>Remove Selected Columns (${state.selectedColumns.size})</button>
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
      // Also clear persisted colors for this column
      if (state.relation.colored_items) {
        const colName = state.columnNames[colIdx];
        delete state.relation.colored_items[colName];
      }
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
    case 'select-all-cols':
      state.columnNames.forEach((_, idx) => {
        state.selectedColumns.add(idx);
      });
      break;
    case 'group-selected-cols':
      showGroupColumnsDialog();
      return;
    case 'clear-col-selection':
      state.selectedColumns.clear();
      break;
    case 'format-active-filter':
      showActiveFilterColorDialog(colIdx);
      return;
    case 'remove-column':
      removeColumn(colIdx);
      break;
    case 'remove-selected-cols':
      removeSelectedColumns();
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
  
  // Count occurrences of each value
  const valueCounts = new Map();
  const naturalOrder = [];
  state.relation.items.forEach(row => {
    const v = row[colIdx];
    if (!valueCounts.has(v)) {
      valueCounts.set(v, 0);
      naturalOrder.push(v);
    }
    valueCounts.set(v, valueCounts.get(v) + 1);
  });
  
  const currentFilter = state.filters[colIdx];
  const selectedValues = currentFilter?.type === 'values' ? new Set(currentFilter.values) : new Set();
  
  const dialog = document.createElement('div');
  dialog.className = 'filter-dialog';
  
  function sortValues(order) {
    let sorted = [...naturalOrder];
    if (order === 'asc') {
      sorted.sort((a, b) => {
        if (a === null) return -1;
        if (b === null) return 1;
        return String(a).localeCompare(String(b), undefined, { numeric: true });
      });
    } else if (order === 'desc') {
      sorted.sort((a, b) => {
        if (a === null) return 1;
        if (b === null) return -1;
        return String(b).localeCompare(String(a), undefined, { numeric: true });
      });
    } else if (order === 'histogram') {
      sorted.sort((a, b) => valueCounts.get(b) - valueCounts.get(a));
    }
    return sorted;
  }
  
  function renderValuesList(order) {
    const sorted = sortValues(order);
    const listEl = dialog.querySelector('.filter-values-list');
    listEl.innerHTML = sorted.map(v => {
      const label = v === null ? '(null)' : String(v).substring(0, 50);
      const count = valueCounts.get(v);
      const countLabel = count > 1 ? ` <span class="filter-value-count">#${count}</span>` : '';
      const checked = selectedValues.has(v) ? 'checked' : '';
      const dataValue = v === null ? '__null__' : String(v).replace(/"/g, '&quot;');
      return `<label class="filter-value-item"><input type="checkbox" data-value="${dataValue}" ${checked}><span>${label}${countLabel}</span></label>`;
    }).join('');
    
    // Re-attach checkbox listeners
    listEl.querySelectorAll('.filter-value-item input').forEach(cb => {
      cb.addEventListener('change', () => {
        const val = cb.dataset.value === '__null__' ? null : cb.dataset.value;
        if (cb.checked) {
          selectedValues.add(val);
        } else {
          selectedValues.delete(val);
        }
      });
    });
  }
  
  dialog.innerHTML = `
    <div class="filter-dialog-header">
      <span>Filter: ${state.columnNames[colIdx]}</span>
      <button class="btn-close-dialog">✕</button>
    </div>
    <div class="filter-dialog-actions">
      <button class="btn btn-sm" id="filter-select-all">Select All</button>
      <button class="btn btn-sm" id="filter-select-none">Select None</button>
      <select class="filter-sort-select" id="filter-sort">
        <option value="natural">Natural Order</option>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
        <option value="histogram">Histogram</option>
      </select>
    </div>
    <div class="filter-values-list"></div>
    <div class="filter-dialog-footer">
      <button class="btn btn-outline" id="filter-cancel">Cancel</button>
      <button class="btn btn-primary" id="filter-apply">Apply</button>
    </div>
  `;
  
  document.body.appendChild(dialog);
  renderValuesList('natural');
  
  dialog.querySelector('.btn-close-dialog').addEventListener('click', () => dialog.remove());
  dialog.querySelector('#filter-cancel').addEventListener('click', () => dialog.remove());
  
  dialog.querySelector('#filter-sort').addEventListener('change', (e) => {
    renderValuesList(e.target.value);
  });
  
  dialog.querySelector('#filter-select-all').addEventListener('click', () => {
    dialog.querySelectorAll('.filter-value-item input').forEach(cb => {
      cb.checked = true;
      const val = cb.dataset.value === '__null__' ? null : cb.dataset.value;
      selectedValues.add(val);
    });
  });
  
  dialog.querySelector('#filter-select-none').addEventListener('click', () => {
    dialog.querySelectorAll('.filter-value-item input').forEach(cb => cb.checked = false);
    selectedValues.clear();
  });
  
  dialog.querySelector('#filter-apply').addEventListener('click', () => {
    if (selectedValues.size === 0 || selectedValues.size === naturalOrder.length) {
      delete state.filters[colIdx];
    } else {
      state.filters[colIdx] = { type: 'values', values: [...selectedValues] };
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
  
  const nonNullPercent = ((stats.nonNull / stats.total) * 100).toFixed(2);
  
  let statsHtml = `
    <div class="stats-row"><span>Total Records:</span><span>${stats.total} (100.00%)</span></div>
    <div class="stats-row"><span>Non-null:</span><span>${stats.nonNull} (${nonNullPercent}%)</span></div>
    <div class="stats-row"><span>Null:</span><span>${stats.nullCount} (${stats.nullPercent}%)</span></div>
  `;
  
  if (type === 'int' || type === 'float') {
    // Add box plot visualization
    statsHtml += generateBoxPlotSVG(stats);
    
    statsHtml += `
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Min:</span><span>${stats.min?.toFixed(3) ?? '—'}</span></div>
      <div class="stats-row"><span>Max:</span><span>${stats.max?.toFixed(3) ?? '—'}</span></div>
      <div class="stats-row"><span>Range |max−min|:</span><span>${stats.range?.toFixed(3) ?? '—'}</span></div>
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
      <div class="stats-row"><span>IQR (Q3−Q1):</span><span>${stats.iqr?.toFixed(3) ?? '—'}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Outliers (&lt;Q1−1.5×IQR or &gt;Q3+1.5×IQR):</span><span>${stats.outliers?.length ?? 0}</span></div>
      <div class="stats-row"><span>Far Outliers (&lt;Q1−3×IQR or &gt;Q3+3×IQR):</span><span>${stats.farOutliers?.length ?? 0}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-subtitle">Distribution Shape</div>
      <div class="shape-charts-row">
        ${generateSkewnessSVG(stats.skewness)}
        ${generateKurtosisSVG(stats.kurtosis)}
      </div>
    `;
  } else if (type === 'select') {
    // Get mode display value
    const colOptions = state.options[name] || {};
    const modeDisplay = stats.mode?.map(k => colOptions[k] || k).join(', ') || '—';
    
    // Add histogram
    statsHtml += generateCategoricalHistogramSVG(stats, name);
    
    // Centrality measures
    statsHtml += `
      <div class="stats-divider"></div>
      <div class="stats-subtitle">Centrality</div>
      <div class="stats-row"><span>Categories:</span><span>${stats.categoryCount}</span></div>
      <div class="stats-row"><span>Mode:</span><span>${modeDisplay}</span></div>
      <div class="stats-row"><span>Mode Count:</span><span>${stats.modeCount} (${stats.modePercent}%)</span></div>
    `;
    
    // Dispersion measures
    statsHtml += `
      <div class="stats-divider"></div>
      <div class="stats-subtitle">Dispersion</div>
      <div class="stats-row"><span>Variation Ratio:</span><span>${stats.variationRatio?.toFixed(4) ?? '—'}</span></div>
      <div class="stats-row"><span>Entropy:</span><span>${stats.entropy?.toFixed(4) ?? '—'}</span></div>
      <div class="stats-row"><span>Max Entropy:</span><span>${stats.maxEntropy?.toFixed(4) ?? '—'}</span></div>
      <div class="stats-row"><span>Norm. Entropy:</span><span>${stats.normalizedEntropy?.toFixed(4) ?? '—'}</span></div>
      <div class="stats-row"><span>Gini-Simpson:</span><span>${stats.giniSimpson?.toFixed(4) ?? '—'}</span></div>
      <div class="stats-row"><span>IQV:</span><span>${stats.iqv?.toFixed(4) ?? '—'}</span></div>
    `;
    
    // Frequency table (combined)
    statsHtml += `
      <div class="stats-divider"></div>
      <div class="stats-subtitle">Frequency Table</div>
      ${generateFrequencyTableHTML(stats, name)}
    `;
  } else if (type === 'boolean') {
    // Generate boolean histogram (similar to categorical)
    statsHtml += generateBooleanHistogramSVG(stats);
    
    // Basic counts
    statsHtml += `
      <div class="stats-divider"></div>
      <div class="stats-subtitle">Centrality</div>
      <div class="stats-row"><span>Mode:</span><span>${stats.mode?.join(', ') ?? '—'} (${stats.modePercent}%)</span></div>
      <div class="stats-row"><span>Categories:</span><span>${stats.categoryCount}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-subtitle">Dispersion</div>
      <div class="stats-row"><span>Entropy H(X):</span><span>${stats.entropy?.toFixed(4) ?? '—'} bits</span></div>
      <div class="stats-row"><span>Max Entropy:</span><span>${stats.maxEntropy?.toFixed(4) ?? '—'} bits</span></div>
      <div class="stats-row"><span>Normalized Entropy:</span><span>${stats.normalizedEntropy?.toFixed(4) ?? '—'}</span></div>
      <div class="stats-row"><span>Gini-Simpson:</span><span>${stats.giniSimpson?.toFixed(4) ?? '—'}</span></div>
      <div class="stats-row"><span>IQV:</span><span>${stats.iqv?.toFixed(4) ?? '—'}</span></div>
      <div class="stats-row"><span>Variation Ratio:</span><span>${stats.variationRatio?.toFixed(4) ?? '—'}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-subtitle">Frequency Table</div>
      ${generateBooleanFrequencyTableHTML(stats)}
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
    
    // Length statistics (Unicode character count)
    if (stats.lengthStats) {
      const ls = stats.lengthStats;
      statsHtml += generateBoxPlotSVG(ls);
      statsHtml += `
        <div class="stats-divider"></div>
        <div class="stats-subtitle">Length Statistics (Unicode chars)</div>
        <div class="stats-row"><span>Min Length:</span><span>${ls.min ?? '—'}</span></div>
        <div class="stats-row"><span>Max Length:</span><span>${ls.max ?? '—'}</span></div>
        <div class="stats-row"><span>Range |max−min|:</span><span>${ls.range ?? '—'}</span></div>
        <div class="stats-row"><span>Total Chars:</span><span>${ls.sum ?? '—'}</span></div>
        <div class="stats-divider"></div>
        <div class="stats-row"><span>Mean:</span><span>${ls.mean?.toFixed(2) ?? '—'}</span></div>
        <div class="stats-row"><span>Median:</span><span>${ls.median ?? '—'}</span></div>
        <div class="stats-row"><span>Mode:</span><span>${ls.mode?.join(', ') ?? '—'}</span></div>
        <div class="stats-divider"></div>
        <div class="stats-row"><span>Std Dev σ:</span><span>${ls.stdDev?.toFixed(4) ?? '—'}</span></div>
        <div class="stats-row"><span>Variance σ²:</span><span>${ls.variance?.toFixed(4) ?? '—'}</span></div>
        <div class="stats-divider"></div>
        <div class="stats-row"><span>Q1 (25%):</span><span>${ls.q1 ?? '—'}</span></div>
        <div class="stats-row"><span>Q3 (75%):</span><span>${ls.q3 ?? '—'}</span></div>
        <div class="stats-row"><span>IQR (Q3−Q1):</span><span>${ls.iqr ?? '—'}</span></div>
        <div class="stats-divider"></div>
        <div class="stats-row"><span>Outliers (&lt;Q1−1.5×IQR or &gt;Q3+1.5×IQR):</span><span>${ls.outliers?.length ?? 0}</span></div>
        <div class="stats-row"><span>Far Outliers (&lt;Q1−3×IQR or &gt;Q3+3×IQR):</span><span>${ls.farOutliers?.length ?? 0}</span></div>
        <div class="stats-divider"></div>
        <div class="stats-subtitle">Distribution Shape</div>
        <div class="shape-charts-row">
          ${generateSkewnessSVG(ls.skewness)}
          ${generateKurtosisSVG(ls.kurtosis)}
        </div>
      `;
    }
    
    // Line count statistics (only for multilinestring)
    if (stats.lineStats) {
      const lns = stats.lineStats;
      statsHtml += generateBoxPlotSVG(lns);
      statsHtml += `
        <div class="stats-divider"></div>
        <div class="stats-subtitle">Line Count Statistics</div>
        <div class="stats-row"><span>Min Lines:</span><span>${lns.min ?? '—'}</span></div>
        <div class="stats-row"><span>Max Lines:</span><span>${lns.max ?? '—'}</span></div>
        <div class="stats-row"><span>Range |max−min|:</span><span>${lns.range ?? '—'}</span></div>
        <div class="stats-row"><span>Total Lines:</span><span>${lns.sum ?? '—'}</span></div>
        <div class="stats-divider"></div>
        <div class="stats-row"><span>Mean:</span><span>${lns.mean?.toFixed(2) ?? '—'}</span></div>
        <div class="stats-row"><span>Median:</span><span>${lns.median ?? '—'}</span></div>
        <div class="stats-row"><span>Mode:</span><span>${lns.mode?.join(', ') ?? '—'}</span></div>
        <div class="stats-divider"></div>
        <div class="stats-row"><span>Std Dev σ:</span><span>${lns.stdDev?.toFixed(4) ?? '—'}</span></div>
        <div class="stats-row"><span>Variance σ²:</span><span>${lns.variance?.toFixed(4) ?? '—'}</span></div>
        <div class="stats-divider"></div>
        <div class="stats-row"><span>Q1 (25%):</span><span>${lns.q1 ?? '—'}</span></div>
        <div class="stats-row"><span>Q3 (75%):</span><span>${lns.q3 ?? '—'}</span></div>
        <div class="stats-row"><span>IQR (Q3−Q1):</span><span>${lns.iqr ?? '—'}</span></div>
        <div class="stats-divider"></div>
        <div class="stats-row"><span>Outliers (&lt;Q1−1.5×IQR or &gt;Q3+1.5×IQR):</span><span>${lns.outliers?.length ?? 0}</span></div>
        <div class="stats-row"><span>Far Outliers (&lt;Q1−3×IQR or &gt;Q3+3×IQR):</span><span>${lns.farOutliers?.length ?? 0}</span></div>
        <div class="stats-divider"></div>
        <div class="stats-subtitle">Distribution Shape</div>
        <div class="shape-charts-row">
          ${generateSkewnessSVG(lns.skewness)}
          ${generateKurtosisSVG(lns.kurtosis)}
        </div>
      `;
    }
  } else if (type === 'date' || type === 'datetime' || type === 'time') {
    const label = type === 'time' ? 'Time' : 'Date';
    
    // Box plot for date/time values
    statsHtml += generateDateTimeBoxPlotSVG(stats, type);
    
    statsHtml += `
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Min ${label}:</span><span>${stats.min ?? '—'}</span></div>
      <div class="stats-row"><span>Max ${label}:</span><span>${stats.max ?? '—'}</span></div>
      <div class="stats-row"><span>Range |max−min|:</span><span>${stats.range ?? '—'}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Mean:</span><span>${stats.mean ?? '—'}</span></div>
      <div class="stats-row"><span>Median:</span><span>${stats.median ?? '—'}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Std Dev:</span><span>${stats.stdDevFormatted ?? '—'}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Q1 (25%):</span><span>${stats.q1 ?? '—'}</span></div>
      <div class="stats-row"><span>Q3 (75%):</span><span>${stats.q3 ?? '—'}</span></div>
      <div class="stats-row"><span>IQR (Q3−Q1):</span><span>${stats.iqr ?? '—'}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Outliers (&lt;Q1−1.5×IQR or &gt;Q3+1.5×IQR):</span><span>${stats.outliers?.length ?? 0}</span></div>
      <div class="stats-row"><span>Far Outliers (&lt;Q1−3×IQR or &gt;Q3+3×IQR):</span><span>${stats.farOutliers?.length ?? 0}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-subtitle">Distribution Shape</div>
      <div class="shape-charts-row">
        ${generateSkewnessSVG(stats.skewness)}
        ${generateKurtosisSVG(stats.kurtosis)}
      </div>
    `;
  } else if (type === 'relation') {
    // Statistics based on row counts in nested relations
    statsHtml += generateBoxPlotSVG(stats);
    statsHtml += `
      <div class="stats-divider"></div>
      <div class="stats-subtitle">Row Count Statistics</div>
      <div class="stats-row"><span>Min Rows:</span><span>${stats.min ?? '—'}</span></div>
      <div class="stats-row"><span>Max Rows:</span><span>${stats.max ?? '—'}</span></div>
      <div class="stats-row"><span>Range |max−min|:</span><span>${stats.range ?? '—'}</span></div>
      <div class="stats-row"><span>Total Rows:</span><span>${stats.sum ?? '—'}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Mean:</span><span>${stats.mean?.toFixed(2) ?? '—'}</span></div>
      <div class="stats-row"><span>Median:</span><span>${stats.median ?? '—'}</span></div>
      <div class="stats-row"><span>Mode:</span><span>${stats.mode?.join(', ') ?? '—'}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Std Dev σ:</span><span>${stats.stdDev?.toFixed(4) ?? '—'}</span></div>
      <div class="stats-row"><span>Variance σ²:</span><span>${stats.variance?.toFixed(4) ?? '—'}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Q1 (25%):</span><span>${stats.q1 ?? '—'}</span></div>
      <div class="stats-row"><span>Q3 (75%):</span><span>${stats.q3 ?? '—'}</span></div>
      <div class="stats-row"><span>IQR (Q3−Q1):</span><span>${stats.iqr ?? '—'}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-row"><span>Outliers (&lt;Q1−1.5×IQR or &gt;Q3+1.5×IQR):</span><span>${stats.outliers?.length ?? 0}</span></div>
      <div class="stats-row"><span>Far Outliers (&lt;Q1−3×IQR or &gt;Q3+3×IQR):</span><span>${stats.farOutliers?.length ?? 0}</span></div>
      <div class="stats-divider"></div>
      <div class="stats-subtitle">Distribution Shape</div>
      <div class="shape-charts-row">
        ${generateSkewnessSVG(stats.skewness)}
        ${generateKurtosisSVG(stats.kurtosis)}
      </div>
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
  document.querySelectorAll('.column-menu, .filter-dialog, .stats-panel, .row-ops-menu, .nested-relation-dialog, .group-cols-dialog, .color-palette-dialog').forEach(el => el.remove());
}

function hasActiveFilter() {
  return Object.keys(state.filters).length > 0;
}

function removeColumn(colIdx) {
  if (state.columnNames.length <= 1) return;
  
  const colName = state.columnNames[colIdx];
  
  state.columnNames.splice(colIdx, 1);
  state.columnTypes.splice(colIdx, 1);
  delete state.options[colName];
  
  state.relation.items = state.relation.items.map(row => {
    const newRow = [...row];
    newRow.splice(colIdx, 1);
    return newRow;
  });
  
  const newColumns = {};
  state.columnNames.forEach((name, idx) => {
    newColumns[name] = state.columnTypes[idx];
  });
  state.relation.columns = newColumns;
  
  state.sortCriteria = state.sortCriteria
    .filter(c => c.column !== colIdx)
    .map(c => ({ ...c, column: c.column > colIdx ? c.column - 1 : c.column }));
  
  const newFilters = {};
  for (const [idx, filter] of Object.entries(state.filters)) {
    const i = parseInt(idx);
    if (i < colIdx) newFilters[i] = filter;
    else if (i > colIdx) newFilters[i - 1] = filter;
  }
  state.filters = newFilters;
  
  const newFormatting = {};
  for (const [idx, fmt] of Object.entries(state.formatting)) {
    const i = parseInt(idx);
    if (i < colIdx) newFormatting[i] = fmt;
    else if (i > colIdx) newFormatting[i - 1] = fmt;
  }
  state.formatting = newFormatting;
  
  state.selectedColumns.clear();
  state.groupByColumns = state.groupByColumns
    .filter(c => c !== colIdx)
    .map(c => c > colIdx ? c - 1 : c);
  
  const newGroupBySelectedValues = {};
  for (const [idx, val] of Object.entries(state.groupBySelectedValues)) {
    const i = parseInt(idx);
    if (i < colIdx) newGroupBySelectedValues[i] = val;
    else if (i > colIdx) newGroupBySelectedValues[i - 1] = val;
  }
  state.groupBySelectedValues = newGroupBySelectedValues;
  
  state.selectedRows.clear();
  state.pivotConfig = { rowDim: null, colDim: null };
  state.expandedGroups = new Set();
  state.diagramNodes = [];
  
  applyFilters();
  applySorting();
}

function removeSelectedColumns() {
  const cols = [...state.selectedColumns].sort((a, b) => b - a);
  cols.forEach(colIdx => removeColumn(colIdx));
}

function showActiveFilterColorDialog(colIdx) {
  closeAllMenus();
  
  const dialog = document.createElement('div');
  dialog.className = 'color-palette-dialog';
  
  let palettesHtml = '';
  for (const [key, palette] of Object.entries(COLOR_PALETTES)) {
    palettesHtml += `
      <div class="palette-section" data-palette="${key}">
        <div class="palette-name">${palette.name}</div>
        <div class="palette-colors">
          ${palette.colors.map(c => {
            const textColor = getContrastTextColor(c);
            const showT = textColor === '#ffffff';
            return `<button class="color-swatch" data-color="${c}" style="background-color: ${c}">${showT ? '<span style="color: white; font-size: 10px; font-weight: bold;">T</span>' : ''}</button>`;
          }).join('')}
        </div>
      </div>
    `;
  }
  
  dialog.innerHTML = `
    <div class="color-palette-header">
      <span>Choose Color for Filtered Rows</span>
      <button class="btn-close-dialog">✕</button>
    </div>
    <div class="color-palettes-container">
      ${palettesHtml}
    </div>
  `;
  
  document.body.appendChild(dialog);
  
  dialog.querySelector('.btn-close-dialog').addEventListener('click', () => dialog.remove());
  
  dialog.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      applyActiveFilterColor(colIdx, swatch.dataset.color);
      dialog.remove();
    });
  });
}

function applyActiveFilterColor(colIdx, color) {
  if (!hasActiveFilter()) return;
  
  const colName = state.columnNames[colIdx];
  const idColIdx = state.columnNames.indexOf('id');
  
  if (idColIdx < 0) {
    alert('No "id" column found. Cannot persist color.');
    return;
  }
  
  if (!state.relation.colored_items) {
    state.relation.colored_items = {};
  }
  if (!state.relation.colored_items[colName]) {
    state.relation.colored_items[colName] = [];
  }
  
  const coloredItems = state.relation.colored_items[colName];
  
  state.sortedIndices.forEach(rowIdx => {
    const row = state.relation.items[rowIdx];
    const rowId = row[idColIdx];
    
    if (rowId === null || rowId === undefined) return;
    
    const existingIdx = coloredItems.findIndex(item => item.id === rowId);
    if (existingIdx >= 0) {
      coloredItems[existingIdx].color = color;
    } else {
      coloredItems.push({ id: rowId, color: color });
    }
  });
  
  renderTable();
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
  // Find ALL relation columns
  const relationColIndices = [];
  state.columnTypes.forEach((type, idx) => {
    if (type === 'relation') {
      relationColIndices.push(idx);
    }
  });
  
  if (relationColIndices.length === 0) return;
  
  // Collect all nested columns from all relation columns
  const allNestedColumns = {};
  state.relation.items.forEach(row => {
    relationColIndices.forEach(relColIdx => {
      const nestedRelation = row[relColIdx];
      if (nestedRelation && nestedRelation.columns) {
        Object.assign(allNestedColumns, nestedRelation.columns);
      }
    });
  });
  
  // Build new column structure: non-relation columns + all nested columns
  const newColumnsObj = {};
  state.columnNames.forEach((name, idx) => {
    if (state.columnTypes[idx] !== 'relation') {
      newColumnsObj[name] = state.columnTypes[idx];
    }
  });
  Object.assign(newColumnsObj, allNestedColumns);
  
  const nestedColNames = Object.keys(allNestedColumns);
  const nonRelationColIndices = [];
  state.columnTypes.forEach((type, idx) => {
    if (type !== 'relation') {
      nonRelationColIndices.push(idx);
    }
  });
  
  // Generate Cartesian product of all relation columns
  let newItems = [];
  
  state.relation.items.forEach(row => {
    // Start with base row (non-relation values)
    const baseValues = nonRelationColIndices.map(idx => row[idx]);
    
    // Collect arrays of rows from each relation column
    const relationRowArrays = relationColIndices.map(relColIdx => {
      const nestedRelation = row[relColIdx];
      if (!nestedRelation || !nestedRelation.items || nestedRelation.items.length === 0) {
        // No nested data - return array with nulls for all nested columns from this relation
        const nestedColCount = nestedRelation?.columns ? Object.keys(nestedRelation.columns).length : 0;
        return [new Array(nestedColCount).fill(null)];
      }
      return nestedRelation.items;
    });
    
    // Cartesian product of all relation row arrays
    function cartesianProduct(arrays) {
      if (arrays.length === 0) return [[]];
      return arrays.reduce((acc, curr) => {
        const result = [];
        acc.forEach(a => {
          curr.forEach(b => {
            result.push([...a, ...b]);
          });
        });
        return result;
      }, [[]]);
    }
    
    const cartesian = cartesianProduct(relationRowArrays);
    
    // Create new rows combining base values with cartesian product results
    cartesian.forEach(nestedValues => {
      // Map nested values to correct positions based on column names
      const newRow = [...baseValues];
      
      // Add values for each nested column (in order of allNestedColumns)
      let offset = 0;
      relationColIndices.forEach(relColIdx => {
        const nestedRelation = row[relColIdx];
        if (nestedRelation && nestedRelation.columns) {
          const nestedColNamesForThis = Object.keys(nestedRelation.columns);
          nestedColNamesForThis.forEach((ncName, ncIdx) => {
            const targetIdx = nestedColNames.indexOf(ncName);
            if (targetIdx >= 0) {
              const valueIdx = offset + ncIdx;
              if (valueIdx < nestedValues.length) {
                newRow[nonRelationColIndices.length + targetIdx] = nestedValues[valueIdx];
              }
            }
          });
          offset += nestedColNamesForThis.length;
        }
      });
      
      // Fill any missing nested columns with null
      while (newRow.length < nonRelationColIndices.length + nestedColNames.length) {
        newRow.push(null);
      }
      
      newItems.push(newRow);
    });
  });
  
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
  } else if (type === 'select') {
    value = input.value || null;
  } else {
    value = input.value;
  }
  
  state.relation.items[rowIdx][colIdx] = value;
  
  const textarea = document.getElementById('relation-json');
  textarea.value = JSON.stringify(state.relation, null, 2);
}

// AI Panel functions
async function askAI(question) {
  const responseDiv = document.getElementById('ai-response');
  responseDiv.innerHTML = '';
  responseDiv.classList.add('loading');
  
  try {
    const response = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        relation: state.relation
      })
    });
    
    if (!response.ok) throw new Error('AI request failed');
    
    const result = await response.json();
    responseDiv.classList.remove('loading');
    
    if (result.type === 'filter' && result.conditions) {
      // Display filter result with apply button
      responseDiv.innerHTML = `
        <div>${result.description || 'Filter suggestion:'}</div>
        <div class="ai-filter-result">
          <span>Filter: ${result.conditions.map(c => `${c.column} ${c.operator} ${c.value ?? ''}`).join(' AND ')}</span>
          <button id="btn-apply-ai-filter">Apply Filter</button>
        </div>
      `;
      
      document.getElementById('btn-apply-ai-filter').addEventListener('click', () => {
        applyAIFilter(result.conditions);
      });
    } else if (result.type === 'answer') {
      responseDiv.innerHTML = `<div>${result.text}</div>`;
    } else {
      responseDiv.innerHTML = `<div>${JSON.stringify(result)}</div>`;
    }
  } catch (error) {
    responseDiv.classList.remove('loading');
    responseDiv.innerHTML = `<div class="ai-error">Error: ${error.message}</div>`;
  }
}

function applyAIFilter(conditions) {
  // Apply AI-suggested filters to the table
  conditions.forEach(cond => {
    const colIdx = state.columnNames.indexOf(cond.column);
    if (colIdx === -1) return;
    
    const colType = state.columnTypes[colIdx];
    
    // Map AI operators to filter format
    let filterType, filterValue;
    switch (cond.operator) {
      case 'equals':
        filterType = 'values';
        filterValue = new Set([cond.value]);
        break;
      case 'contains':
        filterType = 'values';
        // Find matching values
        const matchingValues = new Set();
        state.relation.items.forEach(row => {
          const val = row[colIdx];
          if (val && String(val).toLowerCase().includes(String(cond.value).toLowerCase())) {
            matchingValues.add(val);
          }
        });
        filterValue = matchingValues;
        break;
      case 'gt':
      case 'gte':
      case 'lt':
      case 'lte':
        filterType = 'values';
        const numericMatches = new Set();
        state.relation.items.forEach(row => {
          const val = row[colIdx];
          const numVal = parseFloat(val);
          const condVal = parseFloat(cond.value);
          if (!isNaN(numVal) && !isNaN(condVal)) {
            if ((cond.operator === 'gt' && numVal > condVal) ||
                (cond.operator === 'gte' && numVal >= condVal) ||
                (cond.operator === 'lt' && numVal < condVal) ||
                (cond.operator === 'lte' && numVal <= condVal)) {
              numericMatches.add(val);
            }
          }
        });
        filterValue = numericMatches;
        break;
      case 'isNull':
        filterType = 'null';
        break;
      case 'isNotNull':
        filterType = 'notNull';
        break;
      default:
        return;
    }
    
    if (filterType === 'values' && filterValue) {
      state.filters[colIdx] = { type: 'values', values: filterValue };
    } else if (filterType === 'null') {
      state.filters[colIdx] = { type: 'null' };
    } else if (filterType === 'notNull') {
      state.filters[colIdx] = { type: 'notNull' };
    }
  });
  
  state.currentPage = 1;
  applyFilters();
  renderTable();
  showToast('AI filter applied');
}

function switchView(viewName) {
  state.currentView = viewName;
  
  // Update tab states
  document.querySelectorAll('.view-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.view === viewName);
  });
  
  // Show/hide view content
  document.querySelectorAll('.view-content').forEach(content => {
    content.style.display = 'none';
  });
  const viewEl = document.getElementById('view-' + viewName);
  if (viewEl) viewEl.style.display = 'block';
  
  // Render specific view content
  if (viewName === 'cards') {
    renderCardsView();
  } else if (viewName === 'pivot') {
    initPivotConfig();
  } else if (viewName === 'correlation') {
    initCorrelationConfig();
  } else if (viewName === 'diagram') {
    // Setup click handler for diagram canvas
    setupDiagramClickHandler();
  } else if (viewName === 'ai') {
    // AI view is always ready
  }
}

let cardsResizeObserver = null;

function renderCardsView() {
  if (!state.relation) return;
  
  const container = document.getElementById('cards-container');
  const indices = state.sortedIndices;
  
  // Setup resize observer if not already
  if (!cardsResizeObserver) {
    cardsResizeObserver = new ResizeObserver(() => {
      if (state.currentView === 'cards') {
        renderCardsView();
      }
    });
    cardsResizeObserver.observe(container.parentElement);
  }
  
  // Calculate cards per row based on container width
  const containerWidth = container.parentElement.offsetWidth || 900;
  const cardMinWidth = 200;
  const cardsPerRow = Math.max(2, Math.floor(containerWidth / cardMinWidth));
  
  // Calculate page sizes (3, 6, 9, 12 rows of cards)
  const pageSizeOptions = [3, 6, 9, 12].map(rows => rows * cardsPerRow);
  state.cardsPageSize = pageSizeOptions.find(s => s >= state.cardsPageSize) || pageSizeOptions[0];
  
  const totalItems = indices.length;
  const totalPages = Math.ceil(totalItems / state.cardsPageSize);
  const startIdx = (state.cardsCurrentPage - 1) * state.cardsPageSize;
  const endIdx = Math.min(startIdx + state.cardsPageSize, totalItems);
  const pageIndices = indices.slice(startIdx, endIdx);
  
  let html = '<div class="cards-grid" style="display: grid; grid-template-columns: repeat(' + cardsPerRow + ', 1fr); gap: 16px;">';
  
  pageIndices.forEach((rowIdx, i) => {
    const row = state.relation.items[rowIdx];
    const isSelected = state.selectedRows.has(rowIdx);
    
    html += '<div class="data-card' + (isSelected ? ' selected' : '') + '" data-row-idx="' + rowIdx + '">';
    html += '<div class="data-card-header">';
    html += '<input type="checkbox" class="data-card-checkbox" ' + (isSelected ? 'checked' : '') + ' data-row-idx="' + rowIdx + '">';
    html += '<span class="data-card-id">#' + (rowIdx + 1) + '</span>';
    html += '</div>';
    
    state.columnNames.forEach((colName, colIdx) => {
      const value = row[colIdx];
      const type = state.columnTypes[colIdx];
      let displayValue = formatCellValue(value, type, colIdx);
      const fullValue = value !== null && value !== undefined ? String(value) : '';
      
      html += '<div class="data-card-field">';
      html += '<div class="data-card-label">' + escapeHtml(colName) + '</div>';
      html += '<div class="data-card-value" title="' + escapeHtml(fullValue) + '">' + displayValue + '</div>';
      html += '</div>';
    });
    
    html += '</div>';
  });
  
  html += '</div>';
  
  // Pagination for cards
  html += '<div class="cards-pagination">';
  html += '<button class="btn btn-outline btn-sm" data-action="cards-first" ' + (state.cardsCurrentPage <= 1 ? 'disabled' : '') + '>⟨⟨</button>';
  html += '<button class="btn btn-outline btn-sm" data-action="cards-prev" ' + (state.cardsCurrentPage <= 1 ? 'disabled' : '') + '>⟨</button>';
  html += '<span>Page ' + state.cardsCurrentPage + ' of ' + totalPages + ' (' + totalItems + ' items)</span>';
  html += '<button class="btn btn-outline btn-sm" data-action="cards-next" ' + (state.cardsCurrentPage >= totalPages ? 'disabled' : '') + '>⟩</button>';
  html += '<button class="btn btn-outline btn-sm" data-action="cards-last" ' + (state.cardsCurrentPage >= totalPages ? 'disabled' : '') + '>⟩⟩</button>';
  html += '<select class="cards-page-size">';
  pageSizeOptions.forEach(size => {
    html += '<option value="' + size + '" ' + (state.cardsPageSize === size ? 'selected' : '') + '>' + size + ' cards</option>';
  });
  html += '</select>';
  html += '</div>';
  
  container.innerHTML = html;
  
  // Event listeners for cards
  container.querySelectorAll('.data-card-checkbox').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const idx = parseInt(e.target.dataset.rowIdx);
      if (e.target.checked) {
        state.selectedRows.add(idx);
      } else {
        state.selectedRows.delete(idx);
      }
      e.target.closest('.data-card').classList.toggle('selected', e.target.checked);
    });
  });
  
  container.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = e.target.dataset.action;
      if (action === 'cards-first') state.cardsCurrentPage = 1;
      else if (action === 'cards-prev') state.cardsCurrentPage = Math.max(1, state.cardsCurrentPage - 1);
      else if (action === 'cards-next') state.cardsCurrentPage = Math.min(totalPages, state.cardsCurrentPage + 1);
      else if (action === 'cards-last') state.cardsCurrentPage = totalPages;
      renderCardsView();
    });
  });
  
  container.querySelector('.cards-page-size')?.addEventListener('change', (e) => {
    state.cardsPageSize = parseInt(e.target.value);
    state.cardsCurrentPage = 1;
    renderCardsView();
  });
}

function getCategoricalOrNumericColumns() {
  const cols = [];
  state.columnNames.forEach((name, idx) => {
    const type = state.columnTypes[idx];
    if (['boolean', 'string', 'select', 'int', 'float', 'date', 'datetime', 'time'].includes(type)) {
      cols.push({ idx, name, type });
    }
  });
  return cols;
}

function initPivotConfig() {
  const cols = getCategoricalOrNumericColumns();
  
  const rowSelect = document.getElementById('pivot-rows');
  const colSelect = document.getElementById('pivot-cols');
  
  let options = '<option value="">Select column...</option>';
  cols.forEach(c => {
    options += '<option value="' + c.idx + '">' + escapeHtml(c.name) + ' (' + c.type + ')</option>';
  });
  
  rowSelect.innerHTML = options;
  colSelect.innerHTML = options;
  
  // Initialize values config
  renderPivotValuesConfig();
}

function renderPivotValuesConfig() {
  const container = document.getElementById('pivot-values-config');
  const cols = getCategoricalOrNumericColumns();
  
  let html = '';
  state.pivotConfig.values.forEach((v, i) => {
    const colName = v.column !== null ? state.columnNames[v.column] : '';
    html += '<div class="pivot-value-item">';
    html += '<select class="pivot-value-col" data-idx="' + i + '">';
    html += '<option value="">Column...</option>';
    cols.forEach(c => {
      html += '<option value="' + c.idx + '" ' + (v.column === c.idx ? 'selected' : '') + '>' + escapeHtml(c.name) + '</option>';
    });
    html += '</select>';
    html += '<select class="pivot-value-agg" data-idx="' + i + '">';
    html += '<option value="count" ' + (v.aggregation === 'count' ? 'selected' : '') + '>Count</option>';
    html += '<option value="sum" ' + (v.aggregation === 'sum' ? 'selected' : '') + '>Sum</option>';
    html += '<option value="average" ' + (v.aggregation === 'average' ? 'selected' : '') + '>Average</option>';
    html += '<option value="median" ' + (v.aggregation === 'median' ? 'selected' : '') + '>Median</option>';
    html += '<option value="stddev" ' + (v.aggregation === 'stddev' ? 'selected' : '') + '>Std Dev</option>';
    html += '<option value="pctTotal" ' + (v.aggregation === 'pctTotal' ? 'selected' : '') + '>% Total</option>';
    html += '<option value="pctRow" ' + (v.aggregation === 'pctRow' ? 'selected' : '') + '>% Row</option>';
    html += '<option value="pctCol" ' + (v.aggregation === 'pctCol' ? 'selected' : '') + '>% Col</option>';
    html += '</select>';
    html += '<button data-remove-idx="' + i + '">×</button>';
    html += '</div>';
  });
  
  container.innerHTML = html;
  
  // Event listeners
  container.querySelectorAll('.pivot-value-col').forEach(sel => {
    sel.addEventListener('change', (e) => {
      const idx = parseInt(e.target.dataset.idx);
      state.pivotConfig.values[idx].column = e.target.value ? parseInt(e.target.value) : null;
    });
  });
  
  container.querySelectorAll('.pivot-value-agg').forEach(sel => {
    sel.addEventListener('change', (e) => {
      const idx = parseInt(e.target.dataset.idx);
      state.pivotConfig.values[idx].aggregation = e.target.value;
    });
  });
  
  container.querySelectorAll('[data-remove-idx]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.removeIdx);
      state.pivotConfig.values.splice(idx, 1);
      renderPivotValuesConfig();
    });
  });
}

function generatePivotTable() {
  const rowColIdx = document.getElementById('pivot-rows').value;
  const colColIdx = document.getElementById('pivot-cols').value;
  
  if (!rowColIdx || !colColIdx) {
    alert('Please select both row and column dimensions');
    return;
  }
  
  const rowIdx = parseInt(rowColIdx);
  const colIdx = parseInt(colColIdx);
  
  if (rowIdx === colIdx) {
    alert('Row and column dimensions must be different');
    return;
  }
  
  // Get aggregation configs (default to count if none selected)
  const aggregations = state.pivotConfig.values.length > 0 ? state.pivotConfig.values : [{ column: null, aggregation: 'count' }];
  
  // Get unique values for rows and columns
  const rowValues = new Set();
  const colValues = new Set();
  
  state.sortedIndices.forEach(i => {
    const row = state.relation.items[i];
    if (row[rowIdx] !== null) rowValues.add(String(row[rowIdx]));
    if (row[colIdx] !== null) colValues.add(String(row[colIdx]));
  });
  
  const rowValuesArr = Array.from(rowValues).sort();
  const colValuesArr = Array.from(colValues).sort();
  
  // Build pivot data for each aggregation - store arrays of values for numeric aggregations
  const pivotData = {}; // { aggIdx: { rowVal: { colVal: [] or count } } }
  let grandTotal = 0;
  const rowTotals = {};
  const colTotals = {};
  const rowValuesData = {}; // { aggIdx: { rowVal: [] } } for row totals
  const colValuesData = {}; // { aggIdx: { colVal: [] } } for col totals
  const grandValuesData = {}; // { aggIdx: [] } for grand totals
  
  const numericAggs = ['sum', 'average', 'median', 'stddev'];
  
  aggregations.forEach((agg, aggIdx) => {
    pivotData[aggIdx] = {};
    rowValuesData[aggIdx] = {};
    colValuesData[aggIdx] = {};
    grandValuesData[aggIdx] = [];
    
    rowValuesArr.forEach(rv => {
      pivotData[aggIdx][rv] = {};
      rowValuesData[aggIdx][rv] = [];
      colValuesArr.forEach(cv => {
        pivotData[aggIdx][rv][cv] = numericAggs.includes(agg.aggregation) ? [] : 0;
      });
    });
    colValuesArr.forEach(cv => {
      colValuesData[aggIdx][cv] = [];
    });
  });
  
  rowValuesArr.forEach(rv => {
    rowTotals[rv] = 0;
  });
  colValuesArr.forEach(cv => {
    colTotals[cv] = 0;
  });
  
  state.sortedIndices.forEach(i => {
    const row = state.relation.items[i];
    const rv = row[rowIdx] !== null ? String(row[rowIdx]) : null;
    const cv = row[colIdx] !== null ? String(row[colIdx]) : null;
    
    if (rv !== null && cv !== null) {
      aggregations.forEach((agg, aggIdx) => {
        if (numericAggs.includes(agg.aggregation)) {
          if (agg.column !== null) {
            const val = parseFloat(row[agg.column]);
            if (!isNaN(val)) {
              pivotData[aggIdx][rv][cv].push(val);
              rowValuesData[aggIdx][rv].push(val);
              colValuesData[aggIdx][cv].push(val);
              grandValuesData[aggIdx].push(val);
            }
          }
          // If column is null, array stays empty and will show "-"
        } else {
          pivotData[aggIdx][rv][cv]++;
        }
      });
      rowTotals[rv]++;
      colTotals[cv]++;
      grandTotal++;
    }
  });
  
  // Helper functions for statistics
  function calcSum(arr) { return arr.reduce((a, b) => a + b, 0); }
  function calcMean(arr) { return arr.length > 0 ? calcSum(arr) / arr.length : 0; }
  function calcMedian(arr) {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }
  function calcStdDev(arr) {
    if (arr.length < 1) return 0;
    const mean = calcMean(arr);
    const sqDiffs = arr.map(v => (v - mean) ** 2);
    return Math.sqrt(calcSum(sqDiffs) / arr.length); // Population std dev for consistency
  }
  
  function computeAggValue(data, aggType) {
    if (Array.isArray(data)) {
      if (data.length === 0) return '-';
      if (aggType === 'sum') return calcSum(data).toFixed(2);
      if (aggType === 'average') return calcMean(data).toFixed(2);
      if (aggType === 'median') return calcMedian(data).toFixed(2);
      if (aggType === 'stddev') return calcStdDev(data).toFixed(2);
    }
    return data;
  }
  
  // Helper to format value based on aggregation type
  function formatValue(data, aggType, rowVal, colVal) {
    if (numericAggs.includes(aggType)) {
      return computeAggValue(data, aggType);
    }
    const count = data;
    if (aggType === 'count') return count;
    if (aggType === 'pctTotal') return grandTotal > 0 ? (count / grandTotal * 100).toFixed(1) + '%' : '0%';
    if (aggType === 'pctRow') return rowTotals[rowVal] > 0 ? (count / rowTotals[rowVal] * 100).toFixed(1) + '%' : '0%';
    if (aggType === 'pctCol') return colTotals[colVal] > 0 ? (count / colTotals[colVal] * 100).toFixed(1) + '%' : '0%';
    return count;
  }
  
  // Render pivot table
  let html = '<table class="pivot-table">';
  
  // Header row with column values
  html += '<thead><tr>';
  html += '<th class="pivot-row-header" rowspan="2">' + escapeHtml(state.columnNames[rowIdx]) + ' \\ ' + escapeHtml(state.columnNames[colIdx]) + '</th>';
  colValuesArr.forEach(cv => {
    html += '<th colspan="' + aggregations.length + '">' + escapeHtml(cv) + '</th>';
  });
  html += '<th colspan="' + aggregations.length + '" class="pivot-total">Total</th>';
  html += '</tr>';
  
  // Sub-header with aggregation labels
  html += '<tr>';
  for (let c = 0; c <= colValuesArr.length; c++) {
    aggregations.forEach(agg => {
      const labels = {
        count: 'Count', sum: 'Sum', average: 'Avg', median: 'Med', stddev: 'StdDev',
        pctTotal: '%Tot', pctRow: '%Row', pctCol: '%Col'
      };
      const label = labels[agg.aggregation] || agg.aggregation;
      html += '<th style="font-size: 0.75rem; font-weight: normal;">' + label + '</th>';
    });
  }
  html += '</tr></thead>';
  
  html += '<tbody>';
  
  rowValuesArr.forEach(rv => {
    html += '<tr>';
    html += '<td class="pivot-row-header">' + escapeHtml(rv) + '</td>';
    colValuesArr.forEach(cv => {
      aggregations.forEach((agg, aggIdx) => {
        const count = pivotData[aggIdx][rv][cv];
        const displayVal = formatValue(count, agg.aggregation, rv, cv);
        html += '<td>' + displayVal + '</td>';
      });
    });
    // Row totals
    aggregations.forEach((agg, aggIdx) => {
      let displayVal;
      if (numericAggs.includes(agg.aggregation)) {
        displayVal = computeAggValue(rowValuesData[aggIdx][rv], agg.aggregation);
      } else {
        const count = rowTotals[rv];
        displayVal = agg.aggregation === 'count' ? count : 
                     agg.aggregation === 'pctTotal' ? (grandTotal > 0 ? (count / grandTotal * 100).toFixed(1) + '%' : '0%') :
                     agg.aggregation === 'pctRow' ? '100%' :
                     (grandTotal > 0 ? (count / grandTotal * 100).toFixed(1) + '%' : '0%');
      }
      html += '<td class="pivot-total">' + displayVal + '</td>';
    });
    html += '</tr>';
  });
  
  // Total row
  html += '<tr class="pivot-total">';
  html += '<td class="pivot-row-header pivot-total">Total</td>';
  colValuesArr.forEach(cv => {
    aggregations.forEach((agg, aggIdx) => {
      let displayVal;
      if (numericAggs.includes(agg.aggregation)) {
        displayVal = computeAggValue(colValuesData[aggIdx][cv], agg.aggregation);
      } else {
        const count = colTotals[cv];
        displayVal = agg.aggregation === 'count' ? count :
                     agg.aggregation === 'pctTotal' ? (grandTotal > 0 ? (count / grandTotal * 100).toFixed(1) + '%' : '0%') :
                     agg.aggregation === 'pctRow' ? (grandTotal > 0 ? (count / grandTotal * 100).toFixed(1) + '%' : '0%') :
                     '100%';
      }
      html += '<td>' + displayVal + '</td>';
    });
  });
  // Grand total
  aggregations.forEach((agg, aggIdx) => {
    let displayVal;
    if (numericAggs.includes(agg.aggregation)) {
      displayVal = computeAggValue(grandValuesData[aggIdx], agg.aggregation);
    } else {
      displayVal = agg.aggregation === 'count' ? grandTotal : '100%';
    }
    html += '<td>' + displayVal + '</td>';
  });
  html += '</tr>';
  
  html += '</tbody></table>';
  
  document.getElementById('pivot-table-container').innerHTML = html;
}

function initCorrelationConfig() {
  const cols = getCategoricalOrNumericColumns();
  
  const xSelect = document.getElementById('corr-col-x');
  const ySelect = document.getElementById('corr-col-y');
  
  let options = '<option value="">Select column...</option>';
  cols.forEach(c => {
    const typeLabel = ['int', 'float'].includes(c.type) ? 'numeric' : 
                      ['boolean', 'string', 'select'].includes(c.type) ? 'categorical' : 'temporal';
    options += '<option value="' + c.idx + '">' + escapeHtml(c.name) + ' (' + typeLabel + ')</option>';
  });
  
  xSelect.innerHTML = options;
  ySelect.innerHTML = options;
}

function calculateCorrelation() {
  const xColIdx = document.getElementById('corr-col-x').value;
  const yColIdx = document.getElementById('corr-col-y').value;
  
  if (!xColIdx || !yColIdx) {
    alert('Please select both X and Y columns');
    return;
  }
  
  const xIdx = parseInt(xColIdx);
  const yIdx = parseInt(yColIdx);
  const xType = state.columnTypes[xIdx];
  const yType = state.columnTypes[yIdx];
  
  const isNumericX = ['int', 'float'].includes(xType);
  const isNumericY = ['int', 'float'].includes(yType);
  const isTemporalX = ['date', 'datetime', 'time'].includes(xType);
  const isTemporalY = ['date', 'datetime', 'time'].includes(yType);
  
  // Convert temporal to numeric (timestamp)
  function toNumeric(val, type) {
    if (val === null) return null;
    if (['int', 'float'].includes(type)) return typeof val === 'number' ? val : null;
    if (['date', 'datetime'].includes(type)) {
      const d = new Date(val);
      return isNaN(d.getTime()) ? null : d.getTime();
    }
    if (type === 'time') {
      const parts = String(val).split(':');
      if (parts.length >= 2) {
        return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + (parseInt(parts[2]) || 0);
      }
      return null;
    }
    return null;
  }
  
  // Both numeric/temporal: use Pearson
  if ((isNumericX || isTemporalX) && (isNumericY || isTemporalY)) {
    const pairs = [];
    state.sortedIndices.forEach(i => {
      const row = state.relation.items[i];
      const x = toNumeric(row[xIdx], xType);
      const y = toNumeric(row[yIdx], yType);
      if (x !== null && y !== null) {
        pairs.push({ x, y });
      }
    });
    
    if (pairs.length < 2) {
      document.getElementById('correlation-result').innerHTML = '<p class="text-muted-foreground">Not enough data pairs for correlation</p>';
      return;
    }
    
    renderPearsonCorrelation(pairs, xIdx, yIdx);
  } else {
    // Categorical: use Cramér's V
    const contingency = {};
    const xCounts = {};
    const yCounts = {};
    let total = 0;
    
    state.sortedIndices.forEach(i => {
      const row = state.relation.items[i];
      const xVal = row[xIdx] !== null ? String(row[xIdx]) : null;
      const yVal = row[yIdx] !== null ? String(row[yIdx]) : null;
      
      if (xVal !== null && yVal !== null) {
        if (!contingency[xVal]) contingency[xVal] = {};
        if (!contingency[xVal][yVal]) contingency[xVal][yVal] = 0;
        contingency[xVal][yVal]++;
        
        xCounts[xVal] = (xCounts[xVal] || 0) + 1;
        yCounts[yVal] = (yCounts[yVal] || 0) + 1;
        total++;
      }
    });
    
    if (total < 2) {
      document.getElementById('correlation-result').innerHTML = '<p class="text-muted-foreground">Not enough data pairs for correlation</p>';
      return;
    }
    
    // Calculate Chi-squared
    let chiSquared = 0;
    const xKeys = Object.keys(xCounts);
    const yKeys = Object.keys(yCounts);
    
    xKeys.forEach(xVal => {
      yKeys.forEach(yVal => {
        const observed = (contingency[xVal] && contingency[xVal][yVal]) || 0;
        const expected = (xCounts[xVal] * yCounts[yVal]) / total;
        if (expected > 0) {
          chiSquared += Math.pow(observed - expected, 2) / expected;
        }
      });
    });
    
    // Calculate Cramér's V
    const k = Math.min(xKeys.length, yKeys.length);
    const cramersV = k > 1 ? Math.sqrt(chiSquared / (total * (k - 1))) : 0;
    
    renderCramersV(cramersV, total, xIdx, yIdx, xKeys.length, yKeys.length);
  }
}

function renderPearsonCorrelation(pairs, xIdx, yIdx) {
  const n = pairs.length;
  const sumX = pairs.reduce((s, p) => s + p.x, 0);
  const sumY = pairs.reduce((s, p) => s + p.y, 0);
  const sumXY = pairs.reduce((s, p) => s + p.x * p.y, 0);
  const sumX2 = pairs.reduce((s, p) => s + p.x * p.x, 0);
  const sumY2 = pairs.reduce((s, p) => s + p.y * p.y, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  const r = denominator === 0 ? 0 : numerator / denominator;
  
  const absR = Math.abs(r);
  let strength = 'No correlation';
  if (absR >= 0.9) strength = 'Very strong';
  else if (absR >= 0.7) strength = 'Strong';
  else if (absR >= 0.5) strength = 'Moderate';
  else if (absR >= 0.3) strength = 'Weak';
  else if (absR >= 0.1) strength = 'Very weak';
  
  const colorClass = r > 0.1 ? 'correlation-positive' : r < -0.1 ? 'correlation-negative' : 'correlation-neutral';
  
  let html = '<div class="correlation-chart">';
  html += '<div class="correlation-label">Pearson Correlation (r)</div>';
  html += '<div class="correlation-value ' + colorClass + '">' + r.toFixed(4) + '</div>';
  html += '<div class="correlation-label">' + strength + ' ' + (r > 0 ? 'positive' : r < 0 ? 'negative' : '') + ' correlation</div>';
  html += '<div class="correlation-label">n = ' + n + ' pairs</div>';
  
  // SVG scatter plot
  const width = 400;
  const height = 300;
  const padding = 40;
  
  const xMin = Math.min(...pairs.map(p => p.x));
  const xMax = Math.max(...pairs.map(p => p.x));
  const yMin = Math.min(...pairs.map(p => p.y));
  const yMax = Math.max(...pairs.map(p => p.y));
  
  const xScale = (v) => padding + ((v - xMin) / (xMax - xMin || 1)) * (width - 2 * padding);
  const yScale = (v) => height - padding - ((v - yMin) / (yMax - yMin || 1)) * (height - 2 * padding);
  
  html += '<svg class="correlation-scatter" viewBox="0 0 ' + width + ' ' + height + '">';
  html += '<line x1="' + padding + '" y1="' + (height - padding) + '" x2="' + (width - padding) + '" y2="' + (height - padding) + '" stroke="#ccc" stroke-width="1"/>';
  html += '<line x1="' + padding + '" y1="' + padding + '" x2="' + padding + '" y2="' + (height - padding) + '" stroke="#ccc" stroke-width="1"/>';
  html += '<text x="' + (width/2) + '" y="' + (height - 5) + '" text-anchor="middle" font-size="12">' + escapeHtml(state.columnNames[xIdx]) + '</text>';
  html += '<text x="15" y="' + (height/2) + '" text-anchor="middle" font-size="12" transform="rotate(-90 15 ' + (height/2) + ')">' + escapeHtml(state.columnNames[yIdx]) + '</text>';
  
  pairs.forEach(p => {
    const cx = xScale(p.x);
    const cy = yScale(p.y);
    html += '<circle cx="' + cx + '" cy="' + cy + '" r="4" fill="#3b82f6" opacity="0.6"/>';
  });
  
  const meanX = sumX / n;
  const meanY = sumY / n;
  const slope = numerator / (n * sumX2 - sumX * sumX || 1);
  const intercept = meanY - slope * meanX;
  
  const lineX1 = xMin;
  const lineY1 = slope * lineX1 + intercept;
  const lineX2 = xMax;
  const lineY2 = slope * lineX2 + intercept;
  
  html += '<line x1="' + xScale(lineX1) + '" y1="' + yScale(lineY1) + '" x2="' + xScale(lineX2) + '" y2="' + yScale(lineY2) + '" stroke="#ef4444" stroke-width="2" stroke-dasharray="5,5"/>';
  html += '</svg>';
  html += '</div>';
  
  document.getElementById('correlation-result').innerHTML = html;
}

function renderCramersV(v, n, xIdx, yIdx, xCategories, yCategories) {
  let strength = 'No association';
  if (v >= 0.5) strength = 'Strong';
  else if (v >= 0.3) strength = 'Moderate';
  else if (v >= 0.1) strength = 'Weak';
  else if (v >= 0.05) strength = 'Very weak';
  
  const colorClass = v >= 0.3 ? 'correlation-positive' : v >= 0.1 ? 'correlation-neutral' : 'correlation-neutral';
  
  let html = '<div class="correlation-chart">';
  html += '<div class="correlation-label">Cramér\'s V (categorical association)</div>';
  html += '<div class="correlation-value ' + colorClass + '">' + v.toFixed(4) + '</div>';
  html += '<div class="correlation-label">' + strength + ' association</div>';
  html += '<div class="correlation-label">n = ' + n + ' pairs | ' + xCategories + ' × ' + yCategories + ' categories</div>';
  
  // Visual bar for Cramér's V (0 to 1)
  const width = 300;
  const barHeight = 30;
  
  html += '<svg viewBox="0 0 ' + width + ' ' + (barHeight + 20) + '" style="width: 300px; height: 50px;">';
  html += '<rect x="0" y="0" width="' + width + '" height="' + barHeight + '" fill="#e5e7eb" rx="4"/>';
  html += '<rect x="0" y="0" width="' + (v * width) + '" height="' + barHeight + '" fill="#10b981" rx="4"/>';
  html += '<text x="10" y="' + (barHeight + 15) + '" font-size="11" fill="#666">0</text>';
  html += '<text x="' + (width - 10) + '" y="' + (barHeight + 15) + '" font-size="11" fill="#666" text-anchor="end">1</text>';
  html += '</svg>';
  
  html += '</div>';
  
  document.getElementById('correlation-result').innerHTML = html;
}

function runClustering() {
  if (!state.relation || state.sortedIndices.length === 0) {
    alert('No data to cluster');
    return;
  }
  
  const n = state.sortedIndices.length;
  const maxPoints = 500;
  
  if (n > maxPoints) {
    if (!confirm('You have ' + n + ' rows. t-SNE with more than ' + maxPoints + ' points may be slow and freeze the browser. Continue anyway?')) {
      return;
    }
  }
  
  // Get t-SNE parameters from UI
  const perplexity = parseInt(document.getElementById('tsne-perplexity')?.value) || 30;
  const iterations = parseInt(document.getElementById('tsne-iterations')?.value) || 500;
  
  // Get categorical/numeric columns for similarity calculation
  const cols = [];
  state.columnTypes.forEach((type, idx) => {
    if (['boolean', 'string', 'select', 'int', 'float'].includes(type)) {
      cols.push(idx);
    }
  });
  
  if (cols.length === 0) {
    alert('No suitable columns for clustering');
    return;
  }
  
  // Prepare data matrix
  const data = state.sortedIndices.map(i => {
    const row = state.relation.items[i];
    return cols.map(colIdx => {
      const val = row[colIdx];
      const type = state.columnTypes[colIdx];
      if (val === null) return 0;
      if (type === 'boolean') return val ? 1 : 0;
      if (type === 'int' || type === 'float') return val;
      if (type === 'string' || type === 'select') {
        let hash = 0;
        const str = String(val);
        for (let i = 0; i < str.length; i++) {
          hash = ((hash << 5) - hash) + str.charCodeAt(i);
          hash |= 0;
        }
        return hash;
      }
      return 0;
    });
  });
  
  // Normalize each column to zero mean and unit variance
  const nCols = cols.length;
  const nRows = data.length;
  
  for (let c = 0; c < nCols; c++) {
    let mean = 0;
    for (let r = 0; r < nRows; r++) mean += data[r][c];
    mean /= nRows;
    
    let variance = 0;
    for (let r = 0; r < nRows; r++) variance += (data[r][c] - mean) ** 2;
    variance /= nRows;
    const std = Math.sqrt(variance) || 1;
    
    for (let r = 0; r < nRows; r++) {
      data[r][c] = (data[r][c] - mean) / std;
    }
  }
  
  // Show progress
  const progressEl = document.getElementById('tsne-progress');
  if (progressEl) progressEl.style.display = 'block';
  
  // Run t-SNE asynchronously
  setTimeout(() => {
    const result = tSNE(data, {
      perplexity: Math.min(perplexity, Math.floor(nRows / 3)),
      iterations: iterations,
      learningRate: 200,
      onProgress: (iter, total) => {
        if (progressEl) {
          progressEl.textContent = 't-SNE: ' + Math.round(iter / total * 100) + '%';
        }
      }
    });
    
    // Convert to nodes for rendering
    const canvas = document.getElementById('diagram-canvas');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    
    // Find bounds
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    result.forEach(p => {
      minX = Math.min(minX, p[0]);
      maxX = Math.max(maxX, p[0]);
      minY = Math.min(minY, p[1]);
      maxY = Math.max(maxY, p[1]);
    });
    
    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;
    
    // Calculate ball radius based on number of records
    const ballRadius = Math.max(4, Math.min(12, 200 / Math.sqrt(nRows)));
    
    // Create initial nodes
    let nodes = result.map((p, i) => ({
      idx: state.sortedIndices[i],
      x: padding + ((p[0] - minX) / rangeX) * (width - 2 * padding),
      y: padding + ((p[1] - minY) / rangeY) * (height - 2 * padding),
      rawData: data[i],
      radius: ballRadius
    }));
    
    // Apply k-means clustering for colors
    const numClusters = Math.min(8, Math.max(2, Math.floor(Math.sqrt(nRows / 2))));
    const clusterColors = [
      '#e41a1c', '#377eb8', '#4daf4a', '#984ea3',
      '#ff7f00', '#ffff33', '#a65628', '#f781bf'
    ];
    
    const clusterAssignments = kMeansClustering(result, numClusters);
    nodes.forEach((node, i) => {
      node.cluster = clusterAssignments[i];
      node.color = clusterColors[clusterAssignments[i] % clusterColors.length];
    });
    
    // Apply collision detection to prevent overlapping
    nodes = applyCollisionDetection(nodes, width, height, padding);
    
    state.diagramNodes = nodes;
    state.diagramBallRadius = ballRadius;
    
    if (progressEl) progressEl.style.display = 'none';
    renderDiagram();
  }, 50);
}

// K-means clustering algorithm
function kMeansClustering(points, k, maxIterations = 50) {
  const n = points.length;
  if (n === 0) return [];
  
  // Initialize centroids randomly from data points
  const centroidIndices = [];
  while (centroidIndices.length < k) {
    const idx = Math.floor(Math.random() * n);
    if (!centroidIndices.includes(idx)) {
      centroidIndices.push(idx);
    }
  }
  let centroids = centroidIndices.map(i => [...points[i]]);
  
  let assignments = new Array(n).fill(0);
  
  for (let iter = 0; iter < maxIterations; iter++) {
    // Assign points to nearest centroid
    let changed = false;
    for (let i = 0; i < n; i++) {
      let minDist = Infinity;
      let minCluster = 0;
      for (let c = 0; c < k; c++) {
        const dist = (points[i][0] - centroids[c][0]) ** 2 + (points[i][1] - centroids[c][1]) ** 2;
        if (dist < minDist) {
          minDist = dist;
          minCluster = c;
        }
      }
      if (assignments[i] !== minCluster) {
        assignments[i] = minCluster;
        changed = true;
      }
    }
    
    if (!changed) break;
    
    // Update centroids
    const counts = new Array(k).fill(0);
    const sums = centroids.map(() => [0, 0]);
    for (let i = 0; i < n; i++) {
      const c = assignments[i];
      counts[c]++;
      sums[c][0] += points[i][0];
      sums[c][1] += points[i][1];
    }
    for (let c = 0; c < k; c++) {
      if (counts[c] > 0) {
        centroids[c][0] = sums[c][0] / counts[c];
        centroids[c][1] = sums[c][1] / counts[c];
      }
    }
  }
  
  return assignments;
}

// Collision detection with gentle force-based separation
function applyCollisionDetection(nodes, width, height, padding, iterations = 15) {
  const minDist = (nodes[0]?.radius || 8) * 2.1;
  
  for (let iter = 0; iter < iterations; iter++) {
    let moved = false;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < minDist && dist > 0) {
          const overlap = (minDist - dist) / 2;
          const ux = dx / dist;
          const uy = dy / dist;
          
          nodes[i].x -= ux * overlap;
          nodes[i].y -= uy * overlap;
          nodes[j].x += ux * overlap;
          nodes[j].y += uy * overlap;
          moved = true;
        }
      }
    }
    
    // Keep nodes within bounds
    for (let i = 0; i < nodes.length; i++) {
      const r = nodes[i].radius;
      nodes[i].x = Math.max(padding + r, Math.min(width - padding - r, nodes[i].x));
      nodes[i].y = Math.max(padding + r, Math.min(height - padding - r, nodes[i].y));
    }
    
    if (!moved) break;
  }
  
  return nodes;
}

function tSNE(X, options = {}) {
  const n = X.length;
  const dim = 2;
  const perplexity = options.perplexity || 30;
  const iterations = options.iterations || 500;
  const learningRate = options.learningRate || 200;
  const onProgress = options.onProgress || (() => {});
  const earlyExaggeration = 4;
  const earlyExaggerationEnd = 100;
  
  // Compute pairwise distances
  const D = [];
  for (let i = 0; i < n; i++) {
    D[i] = [];
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < X[i].length; k++) {
        sum += (X[i][k] - X[j][k]) ** 2;
      }
      D[i][j] = sum;
    }
  }
  
  // Compute P (joint probabilities in high-dimensional space)
  const P = computeJointProbabilities(D, perplexity, n);
  
  // Apply early exaggeration to P
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      P[i][j] *= earlyExaggeration;
    }
  }
  
  // Initialize Y randomly
  const Y = [];
  for (let i = 0; i < n; i++) {
    Y[i] = [Math.random() * 0.0001, Math.random() * 0.0001];
  }
  
  // Initialize momentum, gains, and previous gradients
  const gains = [];
  const Ymom = [];
  const prevGrads = [];
  for (let i = 0; i < n; i++) {
    gains[i] = [1, 1];
    Ymom[i] = [0, 0];
    prevGrads[i] = [0, 0];
  }
  
  // Optimization loop
  for (let iter = 0; iter < iterations; iter++) {
    // End early exaggeration
    if (iter === earlyExaggerationEnd) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          P[i][j] /= earlyExaggeration;
        }
      }
    }
    
    // Compute low-dimensional affinities Q
    const Qnum = [];
    let Qsum = 0;
    
    for (let i = 0; i < n; i++) {
      Qnum[i] = [];
      for (let j = 0; j < n; j++) {
        if (i === j) {
          Qnum[i][j] = 0;
        } else {
          const dist = (Y[i][0] - Y[j][0]) ** 2 + (Y[i][1] - Y[j][1]) ** 2;
          Qnum[i][j] = 1 / (1 + dist);
          Qsum += Qnum[i][j];
        }
      }
    }
    
    // Normalize Q
    const Q = [];
    for (let i = 0; i < n; i++) {
      Q[i] = [];
      for (let j = 0; j < n; j++) {
        Q[i][j] = Math.max(Qnum[i][j] / Qsum, 1e-12);
      }
    }
    
    // Compute gradients
    const grads = [];
    for (let i = 0; i < n; i++) {
      let gx = 0, gy = 0;
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          const mult = (P[i][j] - Q[i][j]) * Qnum[i][j];
          gx += mult * (Y[i][0] - Y[j][0]);
          gy += mult * (Y[i][1] - Y[j][1]);
        }
      }
      grads[i] = [4 * gx, 4 * gy];
    }
    
    // Update with momentum and adaptive gains
    const momentum = iter < 250 ? 0.5 : 0.8;
    
    for (let i = 0; i < n; i++) {
      for (let d = 0; d < dim; d++) {
        // Compare current gradient sign with previous gradient sign (not momentum)
        const sameSign = Math.sign(grads[i][d]) === Math.sign(prevGrads[i][d]);
        gains[i][d] = sameSign ? gains[i][d] * 0.8 : gains[i][d] + 0.2;
        gains[i][d] = Math.max(gains[i][d], 0.01);
        
        Ymom[i][d] = momentum * Ymom[i][d] - learningRate * gains[i][d] * grads[i][d];
        Y[i][d] += Ymom[i][d];
        
        prevGrads[i][d] = grads[i][d];
      }
    }
    
    // Center Y
    let meanX = 0, meanY = 0;
    for (let i = 0; i < n; i++) {
      meanX += Y[i][0];
      meanY += Y[i][1];
    }
    meanX /= n;
    meanY /= n;
    for (let i = 0; i < n; i++) {
      Y[i][0] -= meanX;
      Y[i][1] -= meanY;
    }
    
    if (iter % 50 === 0) {
      onProgress(iter, iterations);
    }
  }
  
  onProgress(iterations, iterations);
  return Y;
}

function computeJointProbabilities(D, perplexity, n) {
  const P = [];
  const targetEntropy = Math.log(perplexity);
  
  for (let i = 0; i < n; i++) {
    P[i] = [];
    
    // Binary search for sigma
    let sigma = 1;
    let sigmaMin = -Infinity;
    let sigmaMax = Infinity;
    
    for (let attempt = 0; attempt < 50; attempt++) {
      // Compute conditional probabilities
      let sumP = 0;
      const pRow = [];
      
      for (let j = 0; j < n; j++) {
        if (i === j) {
          pRow[j] = 0;
        } else {
          pRow[j] = Math.exp(-D[i][j] / (2 * sigma * sigma));
          sumP += pRow[j];
        }
      }
      
      // Normalize and compute entropy
      let entropy = 0;
      for (let j = 0; j < n; j++) {
        pRow[j] = sumP > 0 ? pRow[j] / sumP : 0;
        if (pRow[j] > 1e-12) {
          entropy -= pRow[j] * Math.log(pRow[j]);
        }
      }
      
      // Check if entropy is close enough
      const diff = entropy - targetEntropy;
      if (Math.abs(diff) < 1e-5) {
        P[i] = pRow;
        break;
      }
      
      // Binary search update
      if (diff > 0) {
        sigmaMax = sigma;
        sigma = sigmaMin === -Infinity ? sigma / 2 : (sigma + sigmaMin) / 2;
      } else {
        sigmaMin = sigma;
        sigma = sigmaMax === Infinity ? sigma * 2 : (sigma + sigmaMax) / 2;
      }
      
      if (attempt === 49) {
        P[i] = pRow;
      }
    }
  }
  
  // Symmetrize
  const Psym = [];
  for (let i = 0; i < n; i++) {
    Psym[i] = [];
    for (let j = 0; j < n; j++) {
      Psym[i][j] = Math.max((P[i][j] + P[j][i]) / (2 * n), 1e-12);
    }
  }
  
  return Psym;
}

function renderDiagram() {
  const canvas = document.getElementById('diagram-canvas');
  const ctx = canvas.getContext('2d');
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw background
  ctx.fillStyle = '#fafafa';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw nodes
  state.diagramNodes.forEach(node => {
    const radius = node.radius || 8;
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = node.color;
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.stroke();
  });
  
  // Draw cluster legend
  const clusters = [...new Set(state.diagramNodes.map(n => n.cluster))].sort((a, b) => a - b);
  const clusterColors = [
    '#e41a1c', '#377eb8', '#4daf4a', '#984ea3',
    '#ff7f00', '#ffff33', '#a65628', '#f781bf'
  ];
  
  let legendX = 10;
  ctx.font = '11px sans-serif';
  clusters.forEach((cluster, i) => {
    const color = clusterColors[cluster % clusterColors.length];
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(legendX + 6, canvas.height - 20, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#333';
    const label = 'C' + (cluster + 1);
    ctx.fillText(label, legendX + 15, canvas.height - 16);
    legendX += 40;
  });
  
  // Add info text
  ctx.fillStyle = '#666';
  ctx.font = '12px sans-serif';
  ctx.fillText('Rows: ' + state.diagramNodes.length + ' | Click a point to see data', 10, canvas.height - 40);
}

function setupDiagramClickHandler() {
  const canvas = document.getElementById('diagram-canvas');
  if (!canvas) return;
  
  // Remove existing listener if any
  canvas.removeEventListener('click', handleDiagramClick);
  canvas.addEventListener('click', handleDiagramClick);
}

function handleDiagramClick(event) {
  const canvas = event.target;
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  // Find clicked node
  let clickedNode = null;
  for (let i = state.diagramNodes.length - 1; i >= 0; i--) {
    const node = state.diagramNodes[i];
    const dx = x - node.x;
    const dy = y - node.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist <= (node.radius || 8)) {
      clickedNode = node;
      break;
    }
  }
  
  if (clickedNode) {
    showDiagramPopup(clickedNode, event.clientX, event.clientY);
  } else {
    hideDiagramPopup();
  }
}

function showDiagramPopup(node, clientX, clientY) {
  // Remove existing popup
  hideDiagramPopup();
  
  // Get row data
  const rowIdx = node.idx;
  const rowData = state.relation.items[rowIdx];
  
  // Create popup using DOM methods for security
  const popup = document.createElement('div');
  popup.id = 'diagram-popup';
  popup.className = 'diagram-popup';
  
  // Header
  const header = document.createElement('div');
  header.className = 'diagram-popup-header';
  header.textContent = 'Row ' + (rowIdx + 1) + ' ';
  
  const badge = document.createElement('span');
  badge.className = 'cluster-badge';
  badge.style.background = node.color;
  badge.textContent = 'Cluster ' + (node.cluster + 1);
  header.appendChild(badge);
  
  popup.appendChild(header);
  
  // Content
  const content = document.createElement('div');
  content.className = 'diagram-popup-content';
  
  state.columnNames.forEach((col, i) => {
    const value = rowData[i];
    const type = state.columnTypes[i];
    
    const field = document.createElement('div');
    field.className = 'popup-field';
    
    const label = document.createElement('span');
    label.className = 'popup-label';
    label.textContent = col + ': ';
    field.appendChild(label);
    
    const valueSpan = document.createElement('span');
    valueSpan.className = 'popup-value';
    
    if (value === null || value === undefined) {
      valueSpan.className += ' null-value';
      valueSpan.textContent = 'null';
    } else if (type === 'relation') {
      valueSpan.textContent = '[Relation: ' + (value.items?.length || 0) + ' rows]';
    } else if (typeof value === 'object') {
      valueSpan.textContent = JSON.stringify(value);
    } else if (type === 'multilinestring') {
      const str = String(value);
      valueSpan.textContent = str.substring(0, 100) + (str.length > 100 ? '...' : '');
    } else {
      const str = String(value);
      valueSpan.textContent = str.substring(0, 50) + (str.length > 50 ? '...' : '');
    }
    
    field.appendChild(valueSpan);
    content.appendChild(field);
  });
  
  popup.appendChild(content);
  
  // Position popup
  document.body.appendChild(popup);
  
  const popupRect = popup.getBoundingClientRect();
  let left = clientX + 10;
  let top = clientY + 10;
  
  // Keep within viewport
  if (left + popupRect.width > window.innerWidth) {
    left = clientX - popupRect.width - 10;
  }
  if (top + popupRect.height > window.innerHeight) {
    top = clientY - popupRect.height - 10;
  }
  
  popup.style.left = left + 'px';
  popup.style.top = top + 'px';
  
  // Close on outside click
  setTimeout(() => {
    document.addEventListener('click', closeDiagramPopupOnOutsideClick);
  }, 10);
}

function hideDiagramPopup() {
  const existing = document.getElementById('diagram-popup');
  if (existing) existing.remove();
  document.removeEventListener('click', closeDiagramPopupOnOutsideClick);
}

function closeDiagramPopupOnOutsideClick(event) {
  const popup = document.getElementById('diagram-popup');
  if (popup && !popup.contains(event.target)) {
    hideDiagramPopup();
  }
}

function init() {
  const textarea = document.getElementById('relation-json');
  const btnGenerate = document.getElementById('btn-generate-demo');
  const btnParse = document.getElementById('btn-parse-relation');
  const btnAiAsk = document.getElementById('btn-ai-ask');
  const aiQuestion = document.getElementById('ai-question');
  
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
      state.options = result.data.options || {};
      state.editable = editable;
      state.currentPage = 1;
      state.selectedRows = new Set();
      state.sortCriteria = [];
      state.filters = {};
      state.formatting = {};
      state.filteredIndices = [...Array(result.data.items.length).keys()];
      state.sortedIndices = [...state.filteredIndices];
      state.pivotConfig = { rowColumn: null, colColumn: null, values: [] };
      state.diagramNodes = [];
      
      // Show view tabs when data is loaded
      document.getElementById('view-tabs').style.display = 'flex';
      
      // Reset to table view
      state.currentView = 'table';
      switchView('table');
      
      renderTable();
    } else {
      alert('Parse error: ' + result.error);
    }
  });
  
  // View tabs event listeners
  document.querySelectorAll('.view-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const view = e.currentTarget.dataset.view;
      switchView(view);
    });
  });
  
  // Pivot table events
  document.getElementById('btn-add-pivot-value')?.addEventListener('click', () => {
    if (state.pivotConfig.values.length < 4) {
      state.pivotConfig.values.push({ column: null, aggregation: 'count' });
      renderPivotValuesConfig();
    }
  });
  
  document.getElementById('btn-generate-pivot')?.addEventListener('click', generatePivotTable);
  
  // Correlation events
  document.getElementById('btn-calculate-corr')?.addEventListener('click', calculateCorrelation);
  
  // Diagram events
  document.getElementById('btn-run-clustering')?.addEventListener('click', runClustering);
  
  // AI events
  btnAiAsk?.addEventListener('click', () => {
    const question = aiQuestion.value.trim();
    if (question) {
      askAI(question);
    }
  });
  
  aiQuestion?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const question = aiQuestion.value.trim();
      if (question) {
        askAI(question);
      }
    }
  });
  
  // Resize handle functionality
  setupResizeHandle();
  
  // Voice input button
  const btnVoice = document.getElementById('btn-ai-voice');
  let recognition = null;
  
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      aiQuestion.value = transcript;
      btnVoice.classList.remove('recording');
      btnVoice.querySelector('svg').style.color = '';
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      btnVoice.classList.remove('recording');
      btnVoice.querySelector('svg').style.color = '';
      if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please allow microphone access to use voice input.');
      }
    };
    
    recognition.onend = () => {
      btnVoice.classList.remove('recording');
      btnVoice.querySelector('svg').style.color = '';
    };
    
    btnVoice?.addEventListener('click', () => {
      if (btnVoice.classList.contains('recording')) {
        recognition.stop();
      } else {
        btnVoice.classList.add('recording');
        btnVoice.querySelector('svg').style.color = '#ef4444';
        recognition.start();
      }
    });
  } else {
    // Browser doesn't support speech recognition
    btnVoice?.addEventListener('click', () => {
      alert('Voice input is not supported in this browser. Please use Chrome or Edge.');
    });
  }
}

function setupResizeHandle() {
  const container = document.getElementById('relation-table-container');
  const handle = container?.querySelector('.resize-handle');
  const wrapper = container?.querySelector('.relation-table-wrapper');
  
  if (!handle || !container) return;
  
  let isResizing = false;
  let startY = 0;
  let startHeight = 0;
  
  // Get the main content area for adding padding
  const mainContent = document.querySelector('.main-content') || document.body;
  
  handle.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isResizing = true;
    startY = e.clientY;
    startHeight = wrapper ? wrapper.offsetHeight : container.offsetHeight;
    document.body.style.cursor = 'nwse-resize';
    document.body.style.userSelect = 'none';
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    
    const deltaY = e.clientY - startY;
    const newHeight = Math.max(200, startHeight + deltaY);
    
    if (wrapper) {
      wrapper.style.maxHeight = newHeight + 'px';
    }
    container.style.minHeight = (newHeight + 50) + 'px';
    
    // Add padding to allow page to grow when dragging near bottom
    const viewportHeight = window.innerHeight;
    const containerBottom = container.getBoundingClientRect().bottom;
    if (containerBottom > viewportHeight - 100) {
      mainContent.style.paddingBottom = (newHeight + 200) + 'px';
    }
  });
  
  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      // Remove extra padding after resize ends
      mainContent.style.paddingBottom = '';
    }
  });
  
  handle.addEventListener('touchstart', (e) => {
    isResizing = true;
    startY = e.touches[0].clientY;
    startHeight = wrapper ? wrapper.offsetHeight : container.offsetHeight;
  }, { passive: true });
  
  document.addEventListener('touchmove', (e) => {
    if (!isResizing) return;
    
    const deltaY = e.touches[0].clientY - startY;
    const newHeight = Math.max(200, startHeight + deltaY);
    
    if (wrapper) {
      wrapper.style.maxHeight = newHeight + 'px';
    }
    container.style.minHeight = (newHeight + 50) + 'px';
    
    // Add padding to allow page to grow when dragging near bottom
    const viewportHeight = window.innerHeight;
    const containerBottom = container.getBoundingClientRect().bottom;
    if (containerBottom > viewportHeight - 100) {
      mainContent.style.paddingBottom = (newHeight + 200) + 'px';
    }
  }, { passive: true });
  
  document.addEventListener('touchend', () => {
    if (isResizing) {
      // Remove extra padding after resize ends
      mainContent.style.paddingBottom = '';
    }
    isResizing = false;
  });
}

document.addEventListener('DOMContentLoaded', init);
