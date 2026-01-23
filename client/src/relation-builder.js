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
  const columnDef = ['int', 'string', 'boolean', 'float', 'date', 'datetime', 'time', 'multilinestring'];
  const columnNames = ['id', 'name', 'active', 'score', 'birth_date', 'created_at', 'start_time', 'notes'];
  
  const items = [];
  for (let i = 0; i < 50; i++) {
    const row = columnDef.map((type, idx) => {
      if (idx === 0) return i + 1;
      return generateRandomValue(type);
    });
    items.push(row);
  }
  
  return {
    pot: 'relation',
    column_names: columnNames,
    column_def: columnDef,
    items: items
  };
}

function parseRelation(jsonStr) {
  try {
    const data = JSON.parse(jsonStr);
    if (data.pot !== 'relation') {
      throw new Error('Invalid relation: pot must be "relation"');
    }
    if (!Array.isArray(data.column_def)) {
      throw new Error('Invalid relation: column_def must be an array');
    }
    if (!Array.isArray(data.items)) {
      throw new Error('Invalid relation: items must be an array');
    }
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

function createInputForType(type, value, rowIdx, colIdx) {
  const wrapper = document.createElement('div');
  wrapper.className = 'relation-cell-input';
  
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

function renderTable(relation) {
  const container = document.getElementById('relation-table-container');
  container.innerHTML = '';
  
  if (!relation || !relation.column_def || !relation.items) {
    container.innerHTML = '<p class="text-muted-foreground">No data to display</p>';
    return;
  }
  
  const tableWrapper = document.createElement('div');
  tableWrapper.className = 'relation-table-wrapper';
  
  const table = document.createElement('table');
  table.className = 'relation-table';
  
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  
  const indexTh = document.createElement('th');
  indexTh.textContent = '#';
  indexTh.className = 'relation-th-index';
  headerRow.appendChild(indexTh);
  
  relation.column_def.forEach((type, idx) => {
    const th = document.createElement('th');
    const name = relation.column_names ? relation.column_names[idx] : `col_${idx}`;
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
      const type = relation.column_def[colIdx];
      td.appendChild(createInputForType(type, value, rowIdx, colIdx));
      tr.appendChild(td);
    });
    
    tbody.appendChild(tr);
  });
  
  table.appendChild(tbody);
  tableWrapper.appendChild(table);
  container.appendChild(tableWrapper);
  
  window.currentRelation = relation;
}

function updateRelationFromTable() {
  if (!window.currentRelation) return;
  
  const relation = window.currentRelation;
  
  document.querySelectorAll('.relation-table tbody tr').forEach((tr, rowIdx) => {
    const cells = tr.querySelectorAll('td:not(.relation-td-index)');
    cells.forEach((td, colIdx) => {
      const type = relation.column_def[colIdx];
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
    if (result.success) {
      renderTable(result.data);
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
