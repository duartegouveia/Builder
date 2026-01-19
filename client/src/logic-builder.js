import './styles.css';

const OPERATOR_CONFIG = {
  'VARIABLE': { label: 'Variable' },
  'INTEGER': { label: 'Integer' },
  'FLOAT': { label: 'Float' },
  'TEXT': { label: 'Text' },
  'MULTILINE': { label: 'Multiline Text' },
  'BOOLEAN': { label: 'Boolean' },
  'AND': { label: 'AND', min: null, max: null, default: 2 },
  'OR': { label: 'OR', min: null, max: null, default: 2 },
  'XOR': { label: 'XOR', min: 2, max: 2 },
  'IMP': { label: '=>', min: 2, max: 2 },
  'BIC': { label: '<=>', min: 2, max: 2 },
  'NOT': { label: 'NOT', min: 1, max: 1 },
};

const state = {
  builders: {},
  truthValues: {},
  nodeRegistry: {}
};

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function cloneTemplate(id) {
  const tpl = document.getElementById(id);
  return tpl.content.cloneNode(true).firstElementChild;
}

function autoResizeTextarea(textarea) {
  textarea.style.height = 'auto';
  const maxHeight = 200;
  const newHeight = Math.min(textarea.scrollHeight, maxHeight);
  textarea.style.height = newHeight + 'px';
  
  if (textarea.scrollHeight > maxHeight) {
    textarea.classList.add('has-scroll');
  } else {
    textarea.classList.remove('has-scroll');
  }
}

function isOperatorType(type) {
  return ['AND', 'OR', 'XOR', 'IMP', 'BIC', 'NOT'].includes(type);
}

function createNodeData(type) {
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

  const defaultCount = config?.default ?? node.minChildren ?? 0;
  if (node.children && defaultCount > 0) {
    for (let i = 0; i < defaultCount; i++) {
      node.children.push(createNodeData('VARIABLE'));
    }
  }

  return node;
}

function createInitialNodeData(type) {
  return createNodeData(type);
}

function registerNode(builderKey, nodeData) {
  if (!state.nodeRegistry[builderKey]) {
    state.nodeRegistry[builderKey] = {};
  }
  state.nodeRegistry[builderKey][nodeData.id] = nodeData;
  if (nodeData.children) {
    nodeData.children.forEach(child => registerNode(builderKey, child));
  }
}

function getNodeData(builderKey, nodeId) {
  return state.nodeRegistry[builderKey]?.[nodeId];
}

function findParentNode(rootNode, childId) {
  if (!rootNode.children) return null;
  for (let i = 0; i < rootNode.children.length; i++) {
    if (rootNode.children[i].id === childId) {
      return { parent: rootNode, index: i };
    }
    const found = findParentNode(rootNode.children[i], childId);
    if (found) return found;
  }
  return null;
}

function buildLeafNodeDOM(nodeData, builderKey, canRemove, parentId, childIndex) {
  const type = nodeData.type;
  let nodeEl;
  
  if (type === 'EMPTY') {
    nodeEl = cloneTemplate('tpl-node-empty');
  } else if (type === 'VARIABLE') {
    nodeEl = cloneTemplate('tpl-node-variable');
    nodeEl.querySelector('input').value = nodeData.textValue || '';
  } else if (type === 'INTEGER') {
    nodeEl = cloneTemplate('tpl-node-integer');
    nodeEl.querySelector('input').value = nodeData.integerValue || '';
  } else if (type === 'FLOAT') {
    nodeEl = cloneTemplate('tpl-node-float');
    nodeEl.querySelector('input').value = nodeData.floatValue || '';
  } else if (type === 'TEXT') {
    nodeEl = cloneTemplate('tpl-node-text');
    nodeEl.querySelector('input').value = nodeData.textValue || '';
  } else if (type === 'MULTILINE') {
    nodeEl = cloneTemplate('tpl-node-multiline');
    const textarea = nodeEl.querySelector('textarea');
    textarea.value = nodeData.textValue || '';
    setTimeout(() => autoResizeTextarea(textarea), 0);
  } else if (type === 'BOOLEAN') {
    nodeEl = cloneTemplate('tpl-node-boolean');
    const checkbox = nodeEl.querySelector('input[type="checkbox"]');
    const label = nodeEl.querySelector('.bool-label');
    checkbox.checked = nodeData.booleanValue || false;
    label.textContent = nodeData.booleanValue ? '1=True' : '0=False';
    label.classList.toggle('text-success', nodeData.booleanValue);
    label.classList.toggle('text-error', !nodeData.booleanValue);
  }
  
  nodeEl.dataset.nodeId = nodeData.id;
  nodeEl.dataset.builder = builderKey;
  
  const selector = cloneTemplate('tpl-type-selector');
  selector.dataset.nodeId = nodeData.id;
  selector.dataset.builder = builderKey;
  nodeEl.insertBefore(selector, nodeEl.firstChild);
  
  if (canRemove && parentId) {
    const removeBtn = cloneTemplate('tpl-remove-btn');
    removeBtn.dataset.parentId = parentId;
    removeBtn.dataset.childIndex = childIndex;
    removeBtn.dataset.builder = builderKey;
    nodeEl.appendChild(removeBtn);
  }
  
  return nodeEl;
}

function buildRowDOM(nodeData, builderKey, childData, childIndex, canRemoveChild) {
  const row = cloneTemplate('tpl-row-grid');
  row.dataset.rowIndex = childIndex;
  
  const contentCell = row.querySelector('.logic-content-cell');
  contentCell.appendChild(buildNodeDOM(childData, builderKey, false, canRemoveChild, nodeData.id, childIndex));
  
  return row;
}

function buildOperatorNodeDOM(nodeData, builderKey, isRoot, canRemove, parentId, childIndex) {
  const config = OPERATOR_CONFIG[nodeData.type];
  const children = nodeData.children || [];
  const childCount = children.length;
  
  const operatorEl = cloneTemplate('tpl-node-operator');
  operatorEl.dataset.nodeId = nodeData.id;
  operatorEl.dataset.builder = builderKey;
  
  if (isRoot) {
    operatorEl.classList.add('is-root');
  }
  
  const rowsContainer = operatorEl.querySelector('.logic-rows-container');
  const addArea = operatorEl.querySelector('.logic-add-area');
  
  operatorEl.querySelector('.logic-operator-container').dataset.childCount = childCount;
  
  if (childCount === 0) {
    const row = cloneTemplate('tpl-row-grid');
    row.classList.add('logic-row-empty');
    rowsContainer.appendChild(row);
    
    const label = cloneTemplate('tpl-label-cell');
    label.textContent = config.label;
    rowsContainer.appendChild(label);
  } else if (childCount === 1) {
    const canRemoveChild = nodeData.minChildren == null || childCount > nodeData.minChildren;
    const row = buildRowDOM(nodeData, builderKey, children[0], 0, canRemoveChild);
    rowsContainer.appendChild(row);
    
    const label = cloneTemplate('tpl-label-cell');
    label.textContent = config.label;
    rowsContainer.appendChild(label);
  } else {
    const canRemoveChild = nodeData.minChildren == null || childCount > nodeData.minChildren;
    for (let i = 0; i < childCount; i++) {
      const row = buildRowDOM(nodeData, builderKey, children[i], i, canRemoveChild);
      rowsContainer.appendChild(row);
      
      const isLast = i === childCount - 1;
      if (!isLast) {
        const label = cloneTemplate('tpl-label-cell');
        label.textContent = config.label;
        label.dataset.afterRow = i;
        rowsContainer.appendChild(label);
      }
    }
  }
  
  const maxChildren = nodeData.maxChildren ?? config.max ?? null;
  const canAdd = maxChildren == null || childCount < maxChildren;
  if (canAdd) {
    const addBtn = cloneTemplate('tpl-add-btn');
    addBtn.dataset.nodeId = nodeData.id;
    addBtn.dataset.builder = builderKey;
    addArea.appendChild(addBtn);
  }
  
  if (!isRoot) {
    const wrapper = document.createElement('div');
    wrapper.className = 'logic-node';
    wrapper.dataset.nodeId = nodeData.id;
    wrapper.dataset.builder = builderKey;
    
    const selectorWrap = document.createElement('div');
    selectorWrap.className = 'mt-2 flex flex-col gap-1 items-center';
    const selector = cloneTemplate('tpl-type-selector');
    selector.dataset.nodeId = nodeData.id;
    selector.dataset.builder = builderKey;
    selectorWrap.appendChild(selector);
    wrapper.appendChild(selectorWrap);
    
    wrapper.appendChild(operatorEl);
    
    if (canRemove && parentId) {
      const removeWrap = document.createElement('div');
      removeWrap.className = 'mt-2';
      removeWrap.dataset.role = 'child-remove';
      const removeBtn = cloneTemplate('tpl-remove-btn');
      removeBtn.dataset.parentId = parentId;
      removeBtn.dataset.childIndex = childIndex;
      removeBtn.dataset.builder = builderKey;
      removeWrap.appendChild(removeBtn);
      wrapper.appendChild(removeWrap);
    }
    
    return wrapper;
  }
  
  return operatorEl;
}

function buildNodeDOM(nodeData, builderKey, isRoot = false, canRemove = true, parentId = null, childIndex = null) {
  if (isOperatorType(nodeData.type)) {
    return buildOperatorNodeDOM(nodeData, builderKey, isRoot, canRemove, parentId, childIndex);
  } else {
    return buildLeafNodeDOM(nodeData, builderKey, canRemove, parentId, childIndex);
  }
}

function initialRender(key) {
  const container = document.getElementById(`builder-${key}`);
  const nodeData = state.builders[key];
  if (!container || !nodeData) return;
  
  state.nodeRegistry[key] = {};
  registerNode(key, nodeData);
  
  container.innerHTML = '';
  container.appendChild(buildNodeDOM(nodeData, key, true));
}

function renderAllBuilders() {
  Object.keys(state.builders).forEach(initialRender);
  updateEvaluation();
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
      varContainer.innerHTML = '';
      variables.forEach(v => {
        const btn = cloneTemplate('tpl-variable-btn');
        const isTrue = state.truthValues[v] || false;
        btn.classList.add(isTrue ? 'is-true' : 'is-false');
        btn.dataset.var = v;
        btn.querySelector('.var-name').textContent = v;
        btn.querySelector('.var-separator').style.cssText = `height: 12px; width: 1px; margin: 0 0.25rem; background-color: ${isTrue ? 'var(--success-400)' : 'var(--error-400)'}; opacity: 0.3;`;
        const valEl = btn.querySelector('.var-value');
        valEl.textContent = isTrue ? 'T' : 'F';
        valEl.classList.add(isTrue ? 'text-success' : 'text-error');
        varContainer.appendChild(btn);
      });
    }
  }
}

function updateOperatorLabels(rowsContainer, nodeData) {
  const config = OPERATOR_CONFIG[nodeData.type];
  const labels = rowsContainer.querySelectorAll('.logic-label-cell');
  
  labels.forEach(label => {
    label.textContent = config.label;
  });
  
  updateLabelPositions(rowsContainer);
}

function updateLabelPositions(container) {
  if (!container) container = document;
  
  const rowsContainers = container.querySelectorAll ? 
    container.querySelectorAll('.logic-rows-container') : 
    [container];
  
  rowsContainers.forEach(rowsContainer => {
    const rows = Array.from(rowsContainer.querySelectorAll(':scope > .logic-row-grid'));
    const labels = Array.from(rowsContainer.querySelectorAll(':scope > .logic-label-cell'));
    
    labels.forEach((label, i) => {
      if (rows.length <= 1) {
        const row = rows[0];
        if (row) {
          const rowTop = row.offsetTop;
          const rowHeight = row.offsetHeight;
          const labelHeight = label.offsetHeight;
          label.style.top = (rowTop + (rowHeight - labelHeight) / 2) + 'px';
        }
      } else {
        const afterRowIndex = parseInt(label.dataset.afterRow, 10);
        const currentRow = rows[afterRowIndex];
        const nextRow = rows[afterRowIndex + 1];
        
        if (currentRow && nextRow) {
          const currentRowBottom = currentRow.offsetTop + currentRow.offsetHeight;
          const nextRowTop = nextRow.offsetTop;
          const labelHeight = label.offsetHeight;
          const midPoint = (currentRowBottom + nextRowTop) / 2;
          label.style.top = (midPoint - labelHeight / 2) + 'px';
        }
      }
    });
  });
}

function updateAllLabelPositions() {
  updateLabelPositions(document);
}

function updateRemoveButtons(rowsContainer, nodeData, builderKey) {
  const childCount = nodeData.children?.length ?? 0;
  const canRemove = nodeData.minChildren == null || childCount > nodeData.minChildren;
  
  const rows = rowsContainer.querySelectorAll('.logic-row-grid');
  rows.forEach((row, i) => {
    const contentCell = row.querySelector('.logic-content-cell');
    const nodeEl = contentCell.firstElementChild;
    if (!nodeEl) return;
    
    const childNodeData = nodeData.children?.[i];
    const isOperator = childNodeData && isOperatorType(childNodeData.type);
    
    const removeWrap = nodeEl.querySelector(':scope > [data-role="child-remove"]');
    const directBtn = nodeEl.querySelector(':scope > .remove-child-btn');
    
    if (canRemove) {
      if (isOperator) {
        if (removeWrap) {
          const btn = removeWrap.querySelector('.remove-child-btn');
          if (btn) btn.dataset.childIndex = i;
        } else {
          const newWrap = document.createElement('div');
          newWrap.className = 'mt-2';
          newWrap.dataset.role = 'child-remove';
          const removeBtn = cloneTemplate('tpl-remove-btn');
          removeBtn.dataset.parentId = nodeData.id;
          removeBtn.dataset.childIndex = i;
          removeBtn.dataset.builder = builderKey;
          newWrap.appendChild(removeBtn);
          nodeEl.appendChild(newWrap);
        }
      } else {
        if (directBtn) {
          directBtn.dataset.childIndex = i;
        } else {
          const removeBtn = cloneTemplate('tpl-remove-btn');
          removeBtn.dataset.parentId = nodeData.id;
          removeBtn.dataset.childIndex = i;
          removeBtn.dataset.builder = builderKey;
          nodeEl.appendChild(removeBtn);
        }
      }
    } else {
      if (removeWrap) removeWrap.remove();
      if (directBtn) directBtn.remove();
    }
  });
}

function updateAddButton(addArea, nodeData, builderKey) {
  const config = OPERATOR_CONFIG[nodeData.type];
  const childCount = nodeData.children?.length ?? 0;
  const maxChildren = nodeData.maxChildren ?? config.max ?? null;
  const canAdd = maxChildren == null || childCount < maxChildren;
  
  const existingBtn = addArea.querySelector('.add-child-btn');
  
  if (canAdd && !existingBtn) {
    const addBtn = cloneTemplate('tpl-add-btn');
    addBtn.dataset.nodeId = nodeData.id;
    addBtn.dataset.builder = builderKey;
    addArea.appendChild(addBtn);
  } else if (!canAdd && existingBtn) {
    existingBtn.remove();
  }
}

function handleNodeTypeChange(builderKey, nodeId, newType) {
  const oldNodeData = getNodeData(builderKey, nodeId);
  if (!oldNodeData) return;
  
  const newNodeData = createNodeData(newType);
  newNodeData.id = nodeId;
  
  if (oldNodeData.children && newNodeData.children) {
    newNodeData.children = [...oldNodeData.children];
  }
  
  if (newNodeData.children) {
    const config = OPERATOR_CONFIG[newType];
    const defaultCount = config?.default ?? newNodeData.minChildren ?? 0;
    while (newNodeData.children.length < defaultCount) {
      newNodeData.children.push(createNodeData('VARIABLE'));
    }
    if (newNodeData.maxChildren != null && newNodeData.children.length > newNodeData.maxChildren) {
      newNodeData.children = newNodeData.children.slice(0, newNodeData.maxChildren);
    }
  }
  
  state.nodeRegistry[builderKey][nodeId] = newNodeData;
  
  const rootNode = state.builders[builderKey];
  if (rootNode.id === nodeId) {
    state.builders[builderKey] = newNodeData;
    initialRender(builderKey);
  } else {
    const parentInfo = findParentNode(rootNode, nodeId);
    if (parentInfo) {
      parentInfo.parent.children[parentInfo.index] = newNodeData;
      
      const oldEl = document.querySelector(`[data-node-id="${nodeId}"][data-builder="${builderKey}"]`);
      if (oldEl) {
        const canRemove = parentInfo.parent.minChildren == null || parentInfo.parent.children.length > parentInfo.parent.minChildren;
        const newEl = buildNodeDOM(newNodeData, builderKey, false, canRemove, parentInfo.parent.id, parentInfo.index);
        oldEl.replaceWith(newEl);
        
        newNodeData.children?.forEach(child => registerNode(builderKey, child));
      }
    }
  }
  
  if (builderKey === 'dynamic') updateEvaluation();
}

function handleAddChild(builderKey, nodeId) {
  const nodeData = getNodeData(builderKey, nodeId);
  if (!nodeData || !nodeData.children) return;
  
  const newChild = createNodeData('VARIABLE');
  nodeData.children.push(newChild);
  registerNode(builderKey, newChild);
  
  const operatorContainer = document.querySelector(`[data-node-id="${nodeId}"][data-builder="${builderKey}"] .logic-operator-container`);
  if (!operatorContainer) return;
  
  const rowsContainer = operatorContainer.querySelector('.logic-rows-container');
  const addArea = operatorContainer.querySelector('.logic-add-area');
  const childCount = nodeData.children.length;
  
  operatorContainer.dataset.childCount = childCount;
  
  // If exceeds 3 children, switch to vertical layout
  if (childCount > 3 && operatorContainer.classList.contains('is-horizontal')) {
    operatorContainer.classList.remove('is-horizontal');
    operatorContainer.querySelectorAll('.logic-horizontal-divider').forEach(d => d.remove());
  }
  
  rowsContainer.querySelectorAll('.logic-label-cell').forEach(l => l.remove());
  const config = OPERATOR_CONFIG[nodeData.type];
  
  if (childCount === 1) {
    const emptyRow = rowsContainer.querySelector('.logic-row-empty');
    if (emptyRow) emptyRow.remove();
    
    const canRemoveChild = nodeData.minChildren == null || childCount > nodeData.minChildren;
    const newRow = buildRowDOM(nodeData, builderKey, newChild, 0, canRemoveChild);
    rowsContainer.appendChild(newRow);
    
    const label = cloneTemplate('tpl-label-cell');
    label.textContent = config.label;
    rowsContainer.appendChild(label);
  } else {
    const canRemoveChild = nodeData.minChildren == null || childCount > nodeData.minChildren;
    const newRow = buildRowDOM(nodeData, builderKey, newChild, childCount - 1, canRemoveChild);
    rowsContainer.appendChild(newRow);
    
    const allRows = rowsContainer.querySelectorAll('.logic-row-grid');
    allRows.forEach((row, i) => {
      row.dataset.rowIndex = i;
      if (i < childCount - 1) {
        const label = cloneTemplate('tpl-label-cell');
        label.textContent = config.label;
        label.dataset.afterRow = i;
        row.after(label);
      }
    });
    
    updateRemoveButtons(rowsContainer, nodeData, builderKey);
    
    // Update horizontal dividers if in horizontal mode
    if (operatorContainer.classList.contains('is-horizontal')) {
      const config = OPERATOR_CONFIG[nodeData.type];
      operatorContainer.querySelectorAll('.logic-horizontal-divider').forEach(d => d.remove());
      const rows = rowsContainer.querySelectorAll('.logic-row-grid');
      rows.forEach((row, i) => {
        if (i < rows.length - 1) {
          const divider = cloneTemplate('tpl-horizontal-divider');
          divider.querySelector('.logic-horizontal-label').textContent = config.label;
          row.after(divider);
        }
      });
    }
  }
  
  requestAnimationFrame(() => {
    updateLabelPositions(rowsContainer);
  });
  updateAddButton(addArea, nodeData, builderKey);
  
  if (builderKey === 'dynamic') updateEvaluation();
}

function unregisterNodeRecursive(builderKey, nodeData) {
  if (!nodeData) return;
  delete state.nodeRegistry[builderKey][nodeData.id];
  if (nodeData.children) {
    nodeData.children.forEach(child => unregisterNodeRecursive(builderKey, child));
  }
}

function handleRemoveChild(builderKey, parentId, childIndex) {
  const parentData = getNodeData(builderKey, parentId);
  if (!parentData || !parentData.children) return;
  
  const removedChild = parentData.children[childIndex];
  if (removedChild) {
    unregisterNodeRecursive(builderKey, removedChild);
  }
  
  parentData.children.splice(childIndex, 1);
  
  const operatorContainer = document.querySelector(`[data-node-id="${parentId}"][data-builder="${builderKey}"] .logic-operator-container`);
  if (!operatorContainer) return;
  
  const rowsContainer = operatorContainer.querySelector('.logic-rows-container');
  const addArea = operatorContainer.querySelector('.logic-add-area');
  const rows = rowsContainer.querySelectorAll('.logic-row-grid');
  const childCount = parentData.children.length;
  
  operatorContainer.dataset.childCount = childCount;
  
  if (rows[childIndex]) {
    rows[childIndex].remove();
  }
  
  rowsContainer.querySelectorAll('.logic-label-cell').forEach(l => l.remove());
  
  const config = OPERATOR_CONFIG[parentData.type];
  
  if (childCount === 0) {
    const emptyRow = cloneTemplate('tpl-row-grid');
    emptyRow.classList.add('logic-row-empty');
    rowsContainer.appendChild(emptyRow);
    
    const label = cloneTemplate('tpl-label-cell');
    label.textContent = config.label;
    rowsContainer.appendChild(label);
  } else if (childCount === 1) {
    const label = cloneTemplate('tpl-label-cell');
    label.textContent = config.label;
    rowsContainer.appendChild(label);
    
    updateRemoveButtons(rowsContainer, parentData, builderKey);
  } else {
    const remainingRows = rowsContainer.querySelectorAll('.logic-row-grid');
    remainingRows.forEach((row, i) => {
      row.dataset.rowIndex = i;
      if (i < childCount - 1) {
        const label = cloneTemplate('tpl-label-cell');
        label.textContent = config.label;
        label.dataset.afterRow = i;
        row.after(label);
      }
    });
    
    updateRemoveButtons(rowsContainer, parentData, builderKey);
  }
  
  requestAnimationFrame(() => {
    updateLabelPositions(rowsContainer);
  });
  
  updateAddButton(addArea, parentData, builderKey);
  
  if (builderKey === 'dynamic') updateEvaluation();
}

function setupEventDelegation() {
  document.addEventListener('click', (e) => {
    const popoverTrigger = e.target.closest('.popover-trigger');
    if (popoverTrigger) {
      e.stopPropagation();
      const popover = popoverTrigger.closest('.popover-container');
      const content = popover?.querySelector('.popover-content');
      
      document.querySelectorAll('.popover-content.show').forEach(c => {
        if (c !== content) c.classList.remove('show');
      });
      
      content?.classList.toggle('show');
      return;
    }
    
    const typeBtn = e.target.closest('.type-select-btn');
    if (typeBtn) {
      e.stopPropagation();
      const popover = typeBtn.closest('.popover-container');
      const nodeId = popover?.dataset.nodeId;
      const builder = popover?.dataset.builder;
      const newType = typeBtn.dataset.type;
      if (nodeId && builder && newType) {
        handleNodeTypeChange(builder, nodeId, newType);
      }
      return;
    }
    
    const addBtn = e.target.closest('.add-child-btn');
    if (addBtn) {
      const { nodeId, builder } = addBtn.dataset;
      if (nodeId && builder) {
        handleAddChild(builder, nodeId);
      }
      return;
    }
    
    const removeBtn = e.target.closest('.remove-child-btn');
    if (removeBtn) {
      const { parentId, childIndex, builder } = removeBtn.dataset;
      if (parentId && childIndex !== undefined && builder) {
        handleRemoveChild(builder, parentId, parseInt(childIndex));
      }
      return;
    }
    
    const varBtn = e.target.closest('.toggle-var-btn');
    if (varBtn) {
      const varName = varBtn.dataset.var;
      state.truthValues[varName] = !state.truthValues[varName];
      updateEvaluation();
      return;
    }
    
    const layoutBtn = e.target.closest('.layout-toggle-btn');
    if (layoutBtn) {
      const container = layoutBtn.closest('.logic-operator-container');
      if (container) {
        const isHorizontal = container.classList.toggle('is-horizontal');
        const rowsContainer = container.querySelector('.logic-rows-container');
        const nodeEl = container.closest('[data-node-id]');
        const nodeId = nodeEl?.dataset.nodeId;
        const builder = nodeEl?.dataset.builder;
        const nodeData = nodeId && builder ? getNodeData(builder, nodeId) : null;
        const config = nodeData ? OPERATOR_CONFIG[nodeData.type] : null;
        
        if (isHorizontal && config) {
          container.querySelectorAll('.logic-horizontal-divider').forEach(d => d.remove());
          const rows = rowsContainer.querySelectorAll('.logic-row-grid');
          rows.forEach((row, i) => {
            if (i < rows.length - 1) {
              const divider = cloneTemplate('tpl-horizontal-divider');
              divider.querySelector('.logic-horizontal-label').textContent = config.label;
              row.after(divider);
            }
          });
        } else {
          container.querySelectorAll('.logic-horizontal-divider').forEach(d => d.remove());
        }
      }
      return;
    }
    
    document.querySelectorAll('.popover-content.show').forEach(c => {
      c.classList.remove('show');
    });
  });
  
  document.addEventListener('input', (e) => {
    const input = e.target.closest('.node-text-input');
    if (input) {
      const nodeId = input.closest('[data-node-id]')?.dataset.nodeId;
      const builder = input.closest('[data-builder]')?.dataset.builder;
      const field = input.dataset.field;
      if (nodeId && builder && field) {
        const nodeData = getNodeData(builder, nodeId);
        if (nodeData) {
          nodeData[field] = input.value;
        }
        if (builder === 'dynamic') updateEvaluation();
      }
      return;
    }
    
    const textarea = e.target.closest('.node-textarea-input');
    if (textarea) {
      const nodeId = textarea.closest('[data-node-id]')?.dataset.nodeId;
      const builder = textarea.closest('[data-builder]')?.dataset.builder;
      if (nodeId && builder) {
        const nodeData = getNodeData(builder, nodeId);
        if (nodeData) {
          nodeData.textValue = textarea.value;
        }
        autoResizeTextarea(textarea);
        updateAllLabelPositions();
        if (builder === 'dynamic') updateEvaluation();
      }
      return;
    }
  });
  
  document.addEventListener('change', (e) => {
    const checkbox = e.target.closest('.node-checkbox-input');
    if (checkbox) {
      const nodeId = checkbox.closest('[data-node-id]')?.dataset.nodeId;
      const builder = checkbox.closest('[data-builder]')?.dataset.builder;
      if (nodeId && builder) {
        const nodeData = getNodeData(builder, nodeId);
        if (nodeData) {
          nodeData.booleanValue = checkbox.checked;
        }
        const label = checkbox.closest('label')?.querySelector('.bool-label');
        if (label) {
          label.textContent = checkbox.checked ? '1=True' : '0=False';
          label.classList.toggle('text-success', checkbox.checked);
          label.classList.toggle('text-error', !checkbox.checked);
        }
        if (builder === 'dynamic') updateEvaluation();
      }
      return;
    }
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
    'and': createInitialNodeData('AND'),
    'or': createInitialNodeData('OR'),
    'xor': createInitialNodeData('XOR'),
    'imp': createInitialNodeData('IMP'),
    'bic': createInitialNodeData('BIC'),
    'not': createInitialNodeData('NOT'),
    'dynamic': createNodeData('EMPTY')
  };
  
  setupEventDelegation();
  renderAllBuilders();
  
  requestAnimationFrame(updateAllLabelPositions);
  
  document.getElementById('btn-export')?.addEventListener('click', handleExport);
}

document.addEventListener('DOMContentLoaded', init);
