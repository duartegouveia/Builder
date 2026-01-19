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
  'IMP': { label: '⇒', min: 2, max: 2 },
  'BIC': { label: '⇔', min: 2, max: 2 },
  'NOT': { label: 'NOT', min: 1, max: 1 },
};

let state = {
  builders: null,
  truthValues: {}
};

let container = null;

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
      node.children.push(createNode('EMPTY'));
    }
  }

  return node;
}

function createInitialNode(type) {
  const node = createNode(type);
  const min = node.minChildren ?? (type === 'AND' || type === 'OR' ? 2 : 0);
  if (node.children) {
    while (node.children.length < min) {
      node.children.push(createNode('EMPTY'));
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

function initState() {
  state.builders = {
    'and': createInitialNode('AND'),
    'or': createInitialNode('OR'),
    'xor': createInitialNode('XOR'),
    'imp': createInitialNode('IMP'),
    'bic': createInitialNode('BIC'),
    'not': createInitialNode('NOT'),
    'dynamic': createNode('EMPTY')
  };
  state.truthValues = {};
}

function findNodeById(node, id) {
  if (node.id === id) return node;
  if (node.children) {
    for (const child of node.children) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
  }
  return null;
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

function removeNodeFromTree(node, id) {
  if (!node.children) return node;
  return {
    ...node,
    children: node.children
      .filter(child => child.id !== id)
      .map(child => removeNodeFromTree(child, id))
  };
}

function updateBuilder(key, newNode) {
  state.builders[key] = newNode;
  
  if (key === 'dynamic') {
    const vars = extractVariables(newNode);
    vars.forEach(v => {
      if (v && !(v in state.truthValues)) {
        state.truthValues[v] = false;
      }
    });
  }
  
  render();
}

function handleNodeUpdate(builderKey, nodeId, updates) {
  const builder = state.builders[builderKey];
  const updated = updateNodeInTree(builder, nodeId, node => ({ ...node, ...updates }));
  updateBuilder(builderKey, updated);
}

function handleNodeTypeChange(builderKey, nodeId, newType) {
  const builder = state.builders[builderKey];
  const updated = updateNodeInTree(builder, nodeId, oldNode => {
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
  updateBuilder(builderKey, updated);
}

function handleAddChild(builderKey, nodeId) {
  const builder = state.builders[builderKey];
  const updated = updateNodeInTree(builder, nodeId, node => {
    if (!node.children) return node;
    return {
      ...node,
      children: [...node.children, createNode('EMPTY')]
    };
  });
  updateBuilder(builderKey, updated);
}

function handleRemoveChild(builderKey, nodeId, childIndex) {
  const builder = state.builders[builderKey];
  const updated = updateNodeInTree(builder, nodeId, node => {
    if (!node.children) return node;
    return {
      ...node,
      children: node.children.filter((_, i) => i !== childIndex)
    };
  });
  updateBuilder(builderKey, updated);
}

function toggleVariable(variable) {
  state.truthValues[variable] = !state.truthValues[variable];
  render();
}

function handleExport() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.builders['dynamic'], null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "logic_tree.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

function toggleLayout(builderKey, nodeId) {
  const builder = state.builders[builderKey];
  const updated = updateNodeInTree(builder, nodeId, node => {
    const defaultHorizontal = node.minChildren === node.maxChildren && (node.minChildren === 2 || node.minChildren === 3);
    const isHorizontal = node.layoutPreference ? node.layoutPreference === 'horizontal' : defaultHorizontal;
    return { ...node, layoutPreference: isHorizontal ? 'vertical' : 'horizontal' };
  });
  updateBuilder(builderKey, updated);
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
            class="input-inline flex-1 node-text-input" data-node-id="${node.id}" data-builder="${builderKey}" data-field="textValue" />
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
            class="input-inline flex-1 node-text-input" data-node-id="${node.id}" data-builder="${builderKey}" data-field="integerValue" />
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
            class="input-inline flex-1 node-text-input" data-node-id="${node.id}" data-builder="${builderKey}" data-field="floatValue" />
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
            class="input-inline flex-1 node-text-input" data-node-id="${node.id}" data-builder="${builderKey}" data-field="textValue" />
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
          <div class="logic-text-badge-multiline">abc<br/>abc</div>
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
              class="node-checkbox-input" data-node-id="${node.id}" data-builder="${builderKey}" />
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
  
  const defaultHorizontal = minChildren === maxChildren && (minChildren === 2 || minChildren === 3);
  const isHorizontalMode = node.layoutPreference ? node.layoutPreference === 'horizontal' : defaultHorizontal;
  
  if (isHorizontalMode) {
    return `
      <div class="logic-node ${isRoot ? 'is-root' : ''}">
        ${!isRoot ? `<div class="mt-2 flex flex-col gap-1 items-center">${typeSelectorHtml}</div>` : ''}
        <div class="logic-horizontal">
          <button class="logic-toggle-btn toggle-layout-btn" data-node-id="${node.id}" data-builder="${builderKey}" title="Switch to Vertical Layout">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>
          </button>
          ${node.children?.map((child, index) => `
            ${index > 0 ? `<div class="logic-operator-divider">${config.label}</div>` : ''}
            <div class="logic-horizontal-child">
              ${renderNodeHtml(child, builderKey, false, canRemoveChildren, node.id, index)}
            </div>
          `).join('') || ''}
        </div>
        ${!isRoot && removeButton ? `<div class="mt-2">${removeButton}</div>` : ''}
      </div>
    `;
  }
  
  return `
    <div class="logic-node ${isRoot ? 'is-root' : ''}">
      ${!isRoot ? `<div class="mt-2 flex flex-col gap-1 items-center">${typeSelectorHtml}</div>` : ''}
      <div class="logic-operator-container">
        <div class="flex">
          <div class="logic-operator-column">
            <div class="flex-1 flex items-center justify-center w-full">
              <span class="logic-operator-label">${config.label}</span>
            </div>
            <div class="logic-toggle-btn-vertical">
              <button class="logic-toggle-btn toggle-layout-btn" style="position: static; opacity: 0.4;" data-node-id="${node.id}" data-builder="${builderKey}" title="Switch to Horizontal Layout">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 3-4 4-4-4"/><path d="M12 21V7"/><path d="m8 21 4-4 4 4"/><path d="M12 3v14"/></svg>
              </button>
            </div>
          </div>
          
          <div class="logic-children-column">
            <div class="flex flex-col">
              ${node.children?.map((child, index) => `
                <div class="logic-child-row">
                  <div class="flex-1" style="min-width: 0;">
                    ${renderNodeHtml(child, builderKey, false, canRemoveChildren, node.id, index)}
                  </div>
                </div>
              `).join('') || ''}
            </div>
            
            ${canAdd ? `
              <div class="logic-add-area">
                <button class="btn btn-outline btn-icon-sm rounded-full shadow-sm add-child-btn" data-node-id="${node.id}" data-builder="${builderKey}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary);"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
      ${!isRoot && removeButton ? `<div class="mt-2">${removeButton}</div>` : ''}
    </div>
  `;
}

function renderSection(title, builderKey) {
  const node = state.builders[builderKey];
  return `
    <section class="space-y-4">
      <h2 class="text-lg font-semibold text-foreground">${title}</h2>
      ${renderNodeHtml(node, builderKey, true)}
    </section>
  `;
}

function render() {
  if (!container || !state.builders) return;
  
  const dynamicVariables = extractVariables(state.builders['dynamic']);
  const dynamicResult = evaluateLogic(state.builders['dynamic'], state.truthValues);
  
  container.innerHTML = `
    <div class="min-h-screen bg-background p-4" style="padding: 1rem;">
      <div class="max-w-3xl mx-auto space-y-12">
        
        <header class="space-y-2 text-center">
          <a href="#" class="btn btn-outline btn-sm gap-2" style="margin-bottom: 1rem;" data-testid="link-home">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.31"/><path d="M14 9.3V1.99"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><path d="M5.52 16h12.96"/></svg>
            Error Propagator
          </a>
          <h1 class="text-3xl font-bold text-foreground tracking-tight" style="font-size: 1.875rem;">
            Logic Builder
          </h1>
          <p class="text-muted-foreground text-lg" style="max-width: 42rem; margin: 0 auto;">
            Build and evaluate logical propositions visually
          </p>
        </header>
        
        ${renderSection('AND (min null, max null)', 'and')}
        ${renderSection('OR (min null, max null)', 'or')}
        ${renderSection('XOR (min 2, max 2)', 'xor')}
        ${renderSection('IMPLIES (min 2, max 2)', 'imp')}
        ${renderSection('BICONDITIONAL (min 2, max 2)', 'bic')}
        ${renderSection('NOT (min 1, max 1)', 'not')}
        
        <section class="space-y-4">
          <h2 class="text-lg font-semibold text-foreground">Dynamic Playground</h2>
          ${renderNodeHtml(state.builders['dynamic'], 'dynamic', true)}
        </section>
        
        <div class="logic-controls">
          <div class="flex-1 space-y-2 w-full">
            <div class="flex items-center justify-between gap-4">
              <h3 class="font-semibold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                Logic Evaluation
              </h3>
              <div class="md-hidden">
                <span class="logic-result-badge ${dynamicResult ? 'is-true' : 'is-false'}" style="font-size: 0.75rem; padding: 0.125rem 0.5rem;">
                  ${dynamicResult ? 'TRUE' : 'FALSE'}
                </span>
              </div>
            </div>
            
            ${dynamicVariables.length === 0 ? `
              <p class="text-sm text-muted-foreground italic">Add text variables to evaluate...</p>
            ` : `
              <div class="flex flex-wrap gap-3">
                ${dynamicVariables.map(v => `
                  <button class="logic-variable-btn ${state.truthValues[v] ? 'is-true' : 'is-false'} toggle-var-btn" data-var="${v}">
                    <span class="font-mono font-bold">${v}</span>
                    <div style="height: 12px; width: 1px; margin: 0 0.25rem; background-color: ${state.truthValues[v] ? 'var(--success-400)' : 'var(--error-400)'}; opacity: 0.3;"></div>
                    <span class="font-bold text-xs ${state.truthValues[v] ? 'text-success' : 'text-error'}">
                      ${state.truthValues[v] ? 'T' : 'F'}
                    </span>
                  </button>
                `).join('')}
              </div>
            `}
          </div>
          
          <div class="hidden md-block" style="width: 1px; height: 48px; background-color: var(--border);"></div>
          
          <div class="flex items-center gap-4 w-full justify-end" style="width: auto;">
            <div class="flex-col items-end gap-1 mr-2" style="display: flex;">
              <span class="text-xs text-muted-foreground uppercase tracking-wider font-bold" style="font-size: 10px;">Result</span>
              <span class="logic-result-badge ${dynamicResult ? 'is-true' : 'is-false'}" data-testid="text-logic-result">
                ${dynamicResult ? 'TRUE' : 'FALSE'}
              </span>
            </div>
            
            <button class="btn btn-outline btn-md gap-2" id="btn-export" data-testid="button-export">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              <span style="display: inline;">Export JSON</span>
            </button>
          </div>
        </div>
        
      </div>
    </div>
  `;
  
  attachEventListeners();
}

function attachEventListeners() {
  document.querySelectorAll('.popover-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const container = trigger.closest('.popover-container');
      const content = container.querySelector('.popover-content');
      
      document.querySelectorAll('.popover-content.show').forEach(c => {
        if (c !== content) c.classList.remove('show');
      });
      
      content.classList.toggle('show');
    });
  });
  
  document.querySelectorAll('.type-select-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const container = btn.closest('.popover-container');
      const nodeId = container.dataset.nodeId;
      const builderKey = container.dataset.builder;
      const newType = btn.dataset.type;
      handleNodeTypeChange(builderKey, nodeId, newType);
    });
  });
  
  document.querySelectorAll('.node-text-input').forEach(input => {
    input.addEventListener('input', (e) => {
      const nodeId = e.target.dataset.nodeId;
      const builderKey = e.target.dataset.builder;
      const field = e.target.dataset.field;
      handleNodeUpdate(builderKey, nodeId, { [field]: e.target.value });
    });
  });
  
  document.querySelectorAll('.node-textarea-input').forEach(textarea => {
    textarea.addEventListener('input', (e) => {
      const nodeId = e.target.dataset.nodeId;
      const builderKey = e.target.dataset.builder;
      handleNodeUpdate(builderKey, nodeId, { textValue: e.target.value });
    });
  });
  
  document.querySelectorAll('.node-checkbox-input').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const nodeId = e.target.dataset.nodeId;
      const builderKey = e.target.dataset.builder;
      handleNodeUpdate(builderKey, nodeId, { booleanValue: e.target.checked });
    });
  });
  
  document.querySelectorAll('.add-child-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const nodeId = btn.dataset.nodeId;
      const builderKey = btn.dataset.builder;
      handleAddChild(builderKey, nodeId);
    });
  });
  
  document.querySelectorAll('.remove-child-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parentId = btn.dataset.parentId;
      const childIndex = parseInt(btn.dataset.childIndex);
      const builderKey = btn.dataset.builder;
      handleRemoveChild(builderKey, parentId, childIndex);
    });
  });
  
  document.querySelectorAll('.toggle-layout-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const nodeId = btn.dataset.nodeId;
      const builderKey = btn.dataset.builder;
      toggleLayout(builderKey, nodeId);
    });
  });
  
  document.querySelectorAll('.toggle-var-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const varName = btn.dataset.var;
      toggleVariable(varName);
    });
  });
  
  document.getElementById('btn-export')?.addEventListener('click', handleExport);
  
  document.addEventListener('click', () => {
    document.querySelectorAll('.popover-content.show').forEach(c => {
      c.classList.remove('show');
    });
  });
}

export function renderLogicBuilder(containerEl) {
  container = containerEl;
  if (!state.builders) {
    initState();
  }
  render();
}

export function destroyLogicBuilder() {
  container = null;
}
