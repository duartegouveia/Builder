import './styles.css';

const COLUMN_TYPES = ['boolean', 'string', 'multilinestring', 'int', 'float', 'date', 'datetime', 'time'];

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

function createInputForType(type, value, rowIdx, colIdx, editable) {
  const wrapper = document.createElement('div');
  wrapper.className = 'relation-cell-input';
  
  if (!editable) {
    const span = document.createElement('span');
    span.className = 'relation-cell-readonly';
    if (type === 'boolean') {
      span.textContent = value ? '✓' : '✗';
      span.className += value ? ' relation-bool-true' : ' relation-bool-false';
    } else if (type === 'multilinestring') {
      span.className = 'relation-cell-multiline';
      span.textContent = value || '';
    } else {
      span.textContent = value !== null && value !== undefined ? String(value) : '';
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

function renderTable(relation, editable) {
  const container = document.getElementById('relation-table-container');
  container.innerHTML = '';
  
  if (!relation || !relation.columns || !relation.items) {
    container.innerHTML = '<p class="text-muted-foreground">No data to display</p>';
    return;
  }
  
  const columnNames = Object.keys(relation.columns);
  const columnTypes = Object.values(relation.columns);
  
  const tableWrapper = document.createElement('div');
  tableWrapper.className = 'relation-table-wrapper';
  
  const table = document.createElement('table');
  table.className = 'relation-table';
  if (!editable) {
    table.classList.add('relation-table-readonly');
  }
  
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  
  const indexTh = document.createElement('th');
  indexTh.textContent = '#';
  indexTh.className = 'relation-th-index';
  headerRow.appendChild(indexTh);
  
  columnNames.forEach((name, idx) => {
    const th = document.createElement('th');
    const type = columnTypes[idx];
    th.innerHTML = `<div class="relation-th-content"><span class="relation-col-name">${name}</span><span class="relation-col-type">${type}</span></div>`;
    headerRow.appendChild(th);
  });
  
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  const tbody = document.createElement('tbody');
  
  relation.items.forEach((row, rowIdx) => {
    const tr = document.createElement('tr');
    
    const indexTd = document.createElement('td');
    indexTd.textContent = rowIdx + 1;
    indexTd.className = 'relation-td-index';
    tr.appendChild(indexTd);
    
    row.forEach((value, colIdx) => {
      const td = document.createElement('td');
      const type = columnTypes[colIdx];
      td.appendChild(createInputForType(type, value, rowIdx, colIdx, editable));
      tr.appendChild(td);
    });
    
    tbody.appendChild(tr);
  });
  
  table.appendChild(tbody);
  tableWrapper.appendChild(table);
  container.appendChild(tableWrapper);
  
  window.currentRelation = relation;
  window.currentColumnTypes = columnTypes;
  window.currentEditable = editable;
}

function updateRelationFromTable() {
  if (!window.currentRelation || !window.currentColumnTypes) return;
  
  const relation = window.currentRelation;
  const columnTypes = window.currentColumnTypes;
  
  document.querySelectorAll('.relation-table tbody tr').forEach((tr, rowIdx) => {
    const cells = tr.querySelectorAll('td:not(.relation-td-index)');
    cells.forEach((td, colIdx) => {
      const type = columnTypes[colIdx];
      const input = td.querySelector('input, textarea');
      if (input) {
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
        relation.items[rowIdx][colIdx] = value;
      }
    });
  });
  
  const textarea = document.getElementById('relation-json');
  textarea.value = JSON.stringify(relation, null, 2);
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
      renderTable(result.data, editable);
    } else {
      alert('Parse error: ' + result.error);
    }
  });
  
  document.getElementById('relation-table-container').addEventListener('change', (e) => {
    if (e.target.matches('.relation-input, .relation-textarea, .relation-checkbox')) {
      updateRelationFromTable();
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
