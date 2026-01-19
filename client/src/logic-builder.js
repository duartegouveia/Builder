import './styles.css';

const OPERATOR_CONFIG = {
  'VARIABLE': { label: 'Variable' },
  'INTEGER': { label: 'Integer' },
  'FLOAT': { label: 'Float' },
  'TEXT': { label: 'Text' },
  'MULTILINE': { label: 'Multiline Text' },
  'BOOLEAN': { label: 'Boolean' },
  'AND': { label: 'AND', min: 0, max: null },
  'OR': { label: 'OR', min: 0, max: null },
  'XOR': { label: 'XOR', min: 2, max: 2 },
  'IMP': { label: '=>', min: 2, max: 2 },
  'BIC': { label: '<=>', min: 2, max: 2 },
  'NOT': { label: 'NOT', min: 1, max: 1 },
};

const state = {
  builders: {},
  truthValues: {}
};

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function createNode(type) {
  const config = OPERATOR_CONFIG[type];
  const isTextType = type === 'TEXT' || type === 'MULTILINE' || type === 'VARIABLE';
  const isBooleanType = type === 'BOOLEAN';
  const isIntegerType = type === 'INTEGER';
  const isFloatType = type === 'FLOAT';
  const isLeafType = isTextType || isBooleanType || isIntegerType || isFloatType;
  
  const node = {
    id: generateId(),
    type,
    children: isLeafType ? undefined : [],
    textValue: isTextType ? '' : undefined,
    booleanValue: isBooleanType ? false : undefined,
    integerValue: isIntegerType ? '' : undefined,
    floatValue: isFloatType ? '' : undefined,
    minChildren: config?.min ?? null,
    maxChildren: config?.max ?? null,
  };

  if (node.children && node.minChildren && node.minChildren > 0) {
    for (let i = 0; i < node.minChildren; i++) {
      node.children.push(createNode('VARIABLE'));
    }
  }

  return node;
}

function createInitialNode(type) {
  const node = createNode(type);
  let min = node.minChildren ?? 0;
  if ((type === 'AND' || type === 'OR') && min < 2) {
    min = 2;
  }
  if (node.children) {
    while (node.children.length < min) {
      node.children.push(createNode('VARIABLE'));
    }
  }
  return node;
}

function extractVariables(node) {
  const vars = new Set();
  
  const traverse = (n) => {
    if ((n.type === 'TEXT' || n.type === 'MULTILINE' || n.type === 'VARIABLE') && n.textValue) {
      vars.add(n.textValue);
    }
    if (n.children) {
      n.children.forEach(traverse);
    }
  };
  
  traverse(node);
  return Array.from(vars).sort();
}

function evaluateLogic(node, values) {
  if (node.type === 'TEXT' || node.type === 'MULTILINE' || node.type === 'VARIABLE') {
    return values[node.textValue || ''] || false;
  }
  
  if (node.type === 'BOOLEAN') {
    return node.booleanValue || false;
  }
  
  if (node.type === 'EMPTY') return false;
  
  const childResults = node.children?.map(c => evaluateLogic(c, values)) || [];
  
  switch (node.type) {
    case 'AND':
      return childResults.length > 0 && childResults.every(r => r);
    case 'OR':
      return childResults.some(r => r);
    case 'XOR':
      return childResults.filter(r => r).length % 2 === 1;
    case 'IMP':
      if (childResults.length < 2) return false;
      return !childResults[0] || childResults[1];
    case 'BIC':
      if (childResults.length < 2) return false;
      return childResults[0] === childResults[1];
    case 'NOT':
      if (childResults.length === 0) return true;
      return !childResults[0];
    default:
      return false;
  }
}

function updateNodeInTree(node, id, updater) {
  if (node.id === id) {
    return updater(node);
  }
  if (node.children) {
    return {
      ...node,
      children: node.children.map(child => updateNodeInTree(child, id, updater))
    };
  }
  return node;
}

function renderNodeHtml(node, builderKey, isRoot = false, canRemove = true, parentId = null, childIndex = null) {
  const config = OPERATOR_CONFIG[node.type];
  
  const typeSelectorHtml = `
    <div class="popover-container" data-node-id="${node.id}" data-builder="${builderKey}">
      <button class="btn btn-secondary btn-icon-sm font-bold mr-2 popover-trigger" style="flex-shrink: 0;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>
      <div class="popover-content">
        <div class="flex flex-col gap-1" style="min-width: 160px;">
          ${Object.entries(OPERATOR_CONFIG).map(([key, conf]) => `
            <button class="btn btn-ghost justify-start type-select-btn" data-type="${key}" style="justify-content: flex-start; height: 32px; padding: 0 0.5rem; font-size: 0.875rem;">
              ${conf.label}
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  
  const removeButton = canRemove && !isRoot && parentId ? `
    <button class="btn btn-ghost btn-icon-sm text-muted-foreground remove-child-btn" data-parent-id="${parentId}" data-child-index="${childIndex}" data-builder="${builderKey}">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>
  ` : '';
  
  if (node.type === 'EMPTY') {
    return `
      <div class="logic-empty">
        ${typeSelectorHtml}
        <span class="text-sm text-muted-foreground italic flex-1">Select an operation...</span>
        ${removeButton}
      </div>
    `;
  }
  
  if (node.type === 'VARIABLE') {
    return `
      <div class="logic-text-node">
        ${typeSelectorHtml}
        <div class="flex-1 flex items-center gap-2">
          <div class="logic-text-badge">Var</div>
          <input type="text" value="${node.textValue || ''}" placeholder="Variable name..."
            class="input-inline flex-1 node-text-input" data-node-id="${node.id}" data-builder="${builderKey}" data-field="textValue">
        </div>
        ${removeButton}
      </div>
    `;
  }
  
  if (node.type === 'INTEGER') {
    return `
      <div class="logic-text-node">
        ${typeSelectorHtml}
        <div class="flex-1 flex items-center gap-2">
          <div class="logic-text-badge">123</div>
          <input type="text" value="${node.integerValue || ''}" placeholder="Enter integer..."
            class="input-inline flex-1 node-text-input" data-node-id="${node.id}" data-builder="${builderKey}" data-field="integerValue">
        </div>
        ${removeButton}
      </div>
    `;
  }
  
  if (node.type === 'FLOAT') {
    return `
      <div class="logic-text-node">
        ${typeSelectorHtml}
        <div class="flex-1 flex items-center gap-2">
          <div class="logic-text-badge">8.9</div>
          <input type="text" value="${node.floatValue || ''}" placeholder="Enter float..."
            class="input-inline flex-1 node-text-input" data-node-id="${node.id}" data-builder="${builderKey}" data-field="floatValue">
        </div>
        ${removeButton}
      </div>
    `;
  }
  
  if (node.type === 'TEXT') {
    return `
      <div class="logic-text-node">
        ${typeSelectorHtml}
        <div class="flex-1 flex items-center gap-2">
          <div class="logic-text-badge">abc</div>
          <input type="text" value="${node.textValue || ''}" placeholder="Enter text..."
            class="input-inline flex-1 node-text-input" data-node-id="${node.id}" data-builder="${builderKey}" data-field="textValue">
        </div>
        ${removeButton}
      </div>
    `;
  }
  
  if (node.type === 'MULTILINE') {
    return `
      <div class="logic-text-node items-start">
        ${typeSelectorHtml}
        <div class="flex-1 flex items-start gap-2">
          <div class="logic-text-badge-multiline">abc<br>abc</div>
          <textarea placeholder="Enter multiline text..."
            class="textarea-inline flex-1 node-textarea-input" data-node-id="${node.id}" data-builder="${builderKey}" data-field="textValue">${node.textValue || ''}</textarea>
        </div>
        ${removeButton}
      </div>
    `;
  }
  
  if (node.type === 'BOOLEAN') {
    return `
      <div class="logic-text-node">
        ${typeSelectorHtml}
        <div class="flex-1 flex items-center gap-3">
          <div class="logic-text-badge">01</div>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" ${node.booleanValue ? 'checked' : ''} 
              class="node-checkbox-input" data-node-id="${node.id}" data-builder="${builderKey}">
            <span class="font-mono font-bold ${node.booleanValue ? 'text-success' : 'text-error'}">
              ${node.booleanValue ? '1' : '0'}
            </span>
          </label>
        </div>
        ${removeButton}
      </div>
    `;
  }
  
  const minChildren = node.minChildren ?? config.min ?? 0;
  const maxChildren = node.maxChildren ?? config.max ?? null;
  const canAdd = maxChildren == null || (node.children?.length ?? 0) < maxChildren;
  const canRemoveChildren = minChildren == null || (node.children?.length ?? 0) > minChildren;
  const childCount = node.children?.length ?? 0;

  const renderRowsWithLabels = () => {
    if (childCount === 0) {
      return `
        <div class="logic-row-grid logic-row-empty">
          <div class="logic-label-cell">
            <span class="logic-operator-label">${config.label}</span>
          </div>
          <div class="logic-content-cell"></div>
        </div>
      `;
    }
    
    if (childCount === 1) {
      const child = node.children[0];
      return `
        <div class="logic-row-grid">
          <div class="logic-label-cell">
            <span class="logic-operator-label">${config.label}</span>
          </div>
          <div class="logic-content-cell">
            ${renderNodeHtml(child, builderKey, false, canRemoveChildren, node.id, 0)}
          </div>
        </div>
      `;
    }
    
    const rows = [];
    for (let i = 0; i < childCount; i++) {
      const child = node.children[i];
      const isLast = i === childCount - 1;
      
      rows.push(`
        <div class="logic-row-grid ${!isLast ? 'has-separator' : ''}">
          <div class="logic-label-cell">
            ${!isLast ? `<span class="logic-operator-label">${config.label}</span>` : ''}
          </div>
          <div class="logic-content-cell">
            ${renderNodeHtml(child, builderKey, false, canRemoveChildren, node.id, i)}
          </div>
        </div>
      `);
    }
    return rows.join('');
  };

  return `
    <div class="logic-node ${isRoot ? 'is-root' : ''}">
      ${!isRoot ? `<div class="mt-2 flex flex-col gap-1 items-center">${typeSelectorHtml}</div>` : ''}
      <div class="logic-operator-container" data-child-count="${childCount}">
        <div class="logic-rows-container">
          ${renderRowsWithLabels()}
        </div>
        ${canAdd ? `
          <div class="logic-add-area">
            <button class="btn btn-outline btn-icon-sm rounded-full shadow-sm add-child-btn" data-node-id="${node.id}" data-builder="${builderKey}">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary);"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            </button>
          </div>
        ` : ''}
      </div>
      ${!isRoot && removeButton ? `<div class="mt-2">${removeButton}</div>` : ''}
    </div>
  `;
}

function renderBuilder(key) {
  const container = document.getElementById(`builder-${key}`);
  if (!container || !state.builders[key]) return;
  
  container.innerHTML = renderNodeHtml(state.builders[key], key, true);
  attachBuilderListeners(key);
}

function renderAllBuilders() {
  Object.keys(state.builders).forEach(renderBuilder);
  updateEvaluation();
}

function updateEvaluation() {
  const dynamicNode = state.builders['dynamic'];
  if (!dynamicNode) return;
  
  const variables = extractVariables(dynamicNode);
  const result = evaluateLogic(dynamicNode, state.truthValues);
  
  const resultEl = document.getElementById('logic-result');
  if (resultEl) {
    resultEl.textContent = result ? 'TRUE' : 'FALSE';
    resultEl.className = `logic-result-badge ${result ? 'is-true' : 'is-false'}`;
  }
  
  const varContainer = document.getElementById('variables-toggle-container');
  if (varContainer) {
    if (variables.length === 0) {
      varContainer.innerHTML = '<p class="text-sm text-muted-foreground italic">Add text variables to evaluate...</p>';
    } else {
      varContainer.innerHTML = variables.map(v => `
        <button class="logic-variable-btn ${state.truthValues[v] ? 'is-true' : 'is-false'} toggle-var-btn" data-var="${v}">
          <span class="font-mono font-bold">${v}</span>
          <div style="height: 12px; width: 1px; margin: 0 0.25rem; background-color: ${state.truthValues[v] ? 'var(--success-400)' : 'var(--error-400)'}; opacity: 0.3;"></div>
          <span class="font-bold text-xs ${state.truthValues[v] ? 'text-success' : 'text-error'}">
            ${state.truthValues[v] ? 'T' : 'F'}
          </span>
        </button>
      `).join('');
      
      varContainer.querySelectorAll('.toggle-var-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const varName = btn.dataset.var;
          state.truthValues[varName] = !state.truthValues[varName];
          updateEvaluation();
        });
      });
    }
  }
}

function handleNodeUpdate(builderKey, nodeId, updates) {
  state.builders[builderKey] = updateNodeInTree(state.builders[builderKey], nodeId, node => ({ ...node, ...updates }));
  renderBuilder(builderKey);
  if (builderKey === 'dynamic') updateEvaluation();
}

function handleNodeTypeChange(builderKey, nodeId, newType) {
  state.builders[builderKey] = updateNodeInTree(state.builders[builderKey], nodeId, oldNode => {
    const newNode = createNode(newType);
    
    if (oldNode.children && newNode.children) {
      newNode.children = [...oldNode.children];
    }
    
    if (newNode.children) {
      const min = newNode.minChildren ?? 0;
      while (newNode.children.length < min) {
        newNode.children.push(createNode('EMPTY'));
      }
      if (newNode.maxChildren != null && newNode.children.length > newNode.maxChildren) {
        newNode.children = newNode.children.slice(0, newNode.maxChildren);
      }
    }
    
    return newNode;
  });
  renderBuilder(builderKey);
  if (builderKey === 'dynamic') updateEvaluation();
}

function handleAddChild(builderKey, nodeId) {
  state.builders[builderKey] = updateNodeInTree(state.builders[builderKey], nodeId, node => {
    if (!node.children) return node;
    return { ...node, children: [...node.children, createNode('VARIABLE')] };
  });
  renderBuilder(builderKey);
}

function handleRemoveChild(builderKey, parentId, childIndex) {
  state.builders[builderKey] = updateNodeInTree(state.builders[builderKey], parentId, node => {
    if (!node.children) return node;
    return { ...node, children: node.children.filter((_, i) => i !== childIndex) };
  });
  renderBuilder(builderKey);
  if (builderKey === 'dynamic') updateEvaluation();
}

function attachBuilderListeners(builderKey) {
  const container = document.getElementById(`builder-${builderKey}`);
  if (!container) return;
  
  container.querySelectorAll('.popover-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const popover = trigger.closest('.popover-container');
      const content = popover?.querySelector('.popover-content');
      
      document.querySelectorAll('.popover-content.show').forEach(c => {
        if (c !== content) c.classList.remove('show');
      });
      
      content?.classList.toggle('show');
    });
  });
  
  container.querySelectorAll('.type-select-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const popover = btn.closest('.popover-container');
      const nodeId = popover?.dataset.nodeId;
      const builder = popover?.dataset.builder;
      if (nodeId && builder) {
        handleNodeTypeChange(builder, nodeId, btn.dataset.type);
      }
    });
  });
  
  container.querySelectorAll('.node-text-input').forEach(input => {
    input.addEventListener('input', (e) => {
      const { nodeId, builder, field } = e.target.dataset;
      if (nodeId && builder && field) {
        handleNodeUpdate(builder, nodeId, { [field]: e.target.value });
      }
    });
  });
  
  container.querySelectorAll('.node-textarea-input').forEach(textarea => {
    textarea.addEventListener('input', (e) => {
      const { nodeId, builder } = e.target.dataset;
      if (nodeId && builder) {
        handleNodeUpdate(builder, nodeId, { textValue: e.target.value });
      }
    });
  });
  
  container.querySelectorAll('.node-checkbox-input').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const { nodeId, builder } = e.target.dataset;
      if (nodeId && builder) {
        handleNodeUpdate(builder, nodeId, { booleanValue: e.target.checked });
      }
    });
  });
  
  container.querySelectorAll('.add-child-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const { nodeId, builder } = btn.dataset;
      if (nodeId && builder) {
        handleAddChild(builder, nodeId);
      }
    });
  });
  
  container.querySelectorAll('.remove-child-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const { parentId, childIndex, builder } = btn.dataset;
      if (parentId && childIndex !== undefined && builder) {
        handleRemoveChild(builder, parentId, parseInt(childIndex));
      }
    });
  });
}

function handleExport() {
  const data = JSON.stringify(state.builders['dynamic'], null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'logic_tree.json';
  a.click();
  URL.revokeObjectURL(url);
}

function init() {
  state.builders = {
    'and': createInitialNode('AND'),
    'or': createInitialNode('OR'),
    'xor': createInitialNode('XOR'),
    'imp': createInitialNode('IMP'),
    'bic': createInitialNode('BIC'),
    'not': createInitialNode('NOT'),
    'dynamic': createNode('EMPTY')
  };
  
  renderAllBuilders();
  
  document.getElementById('btn-export')?.addEventListener('click', handleExport);
  
  document.addEventListener('click', () => {
    document.querySelectorAll('.popover-content.show').forEach(c => {
      c.classList.remove('show');
    });
  });
}

document.addEventListener('DOMContentLoaded', init);
