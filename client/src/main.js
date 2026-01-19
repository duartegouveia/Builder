import "./index.css";

// --- Constants & Types ---

const OPERATOR_CONFIG = {
  'TEXT': { label: 'Text' },
  'AND': { label: 'AND', min: 0, max: null },
  'OR': { label: 'OR', min: 0, max: null },
  'XOR': { label: 'XOR', min: 2, max: 2 },
  'IMP': { label: '⇒', min: 2, max: 2 },
  'BIC': { label: '⇔', min: 2, max: 2 },
  'NOT': { label: 'NOT', min: 1, max: 1 },
};

const ICONS = {
  PLUS: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-primary"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
  X: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  CHEVRON_RIGHT: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="m9 18 6-6-6-6"/></svg>`,
};

// --- Helper Functions ---

const createNode = (type) => {
  const config = OPERATOR_CONFIG[type];
  const node = {
    id: Math.random().toString(36).substr(2, 9),
    type,
    children: type === 'TEXT' ? undefined : [],
    textValue: type === 'TEXT' ? '' : undefined,
    minChildren: config?.min ?? null,
    maxChildren: config?.max ?? null,
  };

  if (node.children && node.minChildren && node.minChildren > 0) {
    for (let i = 0; i < node.minChildren; i++) {
      node.children.push(createNode('EMPTY'));
    }
  }

  return node;
};

const createInitialNode = (type) => {
    const node = createNode(type);
    const min = node.minChildren ?? (type === 'AND' || type === 'OR' ? 2 : 0);
    if (node.children) {
        while (node.children.length < min) {
            node.children.push(createNode('EMPTY'));
        }
    }
    return node;
};

// --- State ---

let state = {
  builders: {
    'and': createInitialNode('AND'),
    'or': createInitialNode('OR'),
    'xor': createInitialNode('XOR'),
    'imp': createInitialNode('IMP'),
    'bic': createInitialNode('BIC'),
    'not': createInitialNode('NOT'),
    'dynamic': createNode('EMPTY')
  }
};

// --- Actions ---

function updateBuilder(key, newNode) {
  state.builders[key] = newNode;
  render();
}

// --- DOM Rendering ---

function createElement(tag, className = "", innerHTML = "") {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (innerHTML) el.innerHTML = innerHTML;
  return el;
}

function renderNode(node, onChange, onRemove, isRoot = false) {
  // 1. Empty State
  if (node.type === 'EMPTY') {
    const container = createElement('div', 'flex items-center w-full p-2 border border-dashed border-muted-foreground/30 rounded-md bg-muted/20');
    
    const selector = renderTypeSelector(node, onChange);
    container.appendChild(selector);
    
    const label = createElement('span', 'text-sm text-muted-foreground italic flex-1 ml-2', 'Select an operation...');
    container.appendChild(label);

    if (onRemove) {
        const removeBtn = createElement('button', 'h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-destructive transition-colors', ICONS.X);
        removeBtn.onclick = onRemove;
        container.appendChild(removeBtn);
    }
    return container;
  }

  // 2. Text Node
  if (node.type === 'TEXT') {
    const container = createElement('div', 'flex items-center w-full p-2 border rounded-md bg-background shadow-sm');
    
    container.appendChild(renderTypeSelector(node, onChange));
    
    const wrapper = createElement('div', 'flex-1 flex items-center gap-2 ml-2');
    const icon = createElement('div', 'h-8 w-8 flex items-center justify-center bg-blue-100 text-blue-700 rounded font-bold text-xs shrink-0', 'Tx');
    
    const input = createElement('input', 'flex-1 h-9 border-none focus:ring-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground');
    input.value = node.textValue || '';
    input.placeholder = 'Enter text...';
    input.oninput = (e) => onChange({ ...node, textValue: e.target.value });
    
    wrapper.appendChild(icon);
    wrapper.appendChild(input);
    container.appendChild(wrapper);

    if (onRemove) {
        const removeBtn = createElement('button', 'ml-2 h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-destructive transition-colors', ICONS.X);
        removeBtn.onclick = onRemove;
        container.appendChild(removeBtn);
    }
    return container;
  }

  // 3. Operator Node
  const config = OPERATOR_CONFIG[node.type];
  const canAdd = node.maxChildren == null || (node.children?.length ?? 0) < node.maxChildren;
  const canRemove = node.minChildren == null || (node.children?.length ?? 0) > node.minChildren;

  const container = createElement('div', `w-full flex items-start gap-2 ${isRoot ? "p-4 border rounded-lg bg-card shadow-sm" : ""}`);

  if (!isRoot) {
    const selectorContainer = createElement('div', 'mt-2');
    selectorContainer.appendChild(renderTypeSelector(node, onChange));
    container.appendChild(selectorContainer);
  }

  const mainBlock = createElement('div', `flex-1 border rounded-lg overflow-hidden bg-card shadow-sm ${!isRoot ? "border-l-4 border-l-primary/20" : ""}`);
  
  const innerFlex = createElement('div', 'flex');
  
  // Operator Column
  const opCol = createElement('div', 'w-12 bg-muted/30 border-r flex flex-col items-center justify-center relative min-h-[60px]');
  const accent = createElement('div', 'absolute inset-y-0 left-0 w-1 bg-primary/10');
  const label = createElement('span', 'text-[10px] font-black text-muted-foreground uppercase tracking-wider rotate-[-90deg] whitespace-nowrap select-none', config.label);
  opCol.appendChild(accent);
  opCol.appendChild(label);
  
  // Children Column
  const childrenCol = createElement('div', 'flex-1 flex flex-col min-w-0');
  const childrenContainer = createElement('div', 'flex flex-col');
  
  if (node.children) {
    node.children.forEach((child, index) => {
        const childWrapper = createElement('div', 'border-b last:border-b-0 p-2 hover:bg-muted/5 transition-colors flex gap-3 items-start group');
        
        const childContent = createElement('div', 'flex-1 min-w-0');
        const updateChild = (updatedChild) => {
            const newChildren = [...node.children];
            newChildren[index] = updatedChild;
            onChange({ ...node, children: newChildren });
        };
        const removeChild = () => {
             const newChildren = node.children.filter((_, i) => i !== index);
             onChange({ ...node, children: newChildren });
        };
        
        childContent.appendChild(renderNode(child, updateChild, canRemove ? removeChild : undefined));
        childWrapper.appendChild(childContent);
        childrenContainer.appendChild(childWrapper);
    });
  }
  
  childrenCol.appendChild(childrenContainer);

  if (canAdd) {
      const addArea = createElement('div', 'p-2 flex justify-center border-t bg-muted/5 mt-[5px]');
      const addBtn = createElement('button', 'h-8 w-8 rounded-full shadow-sm hover:scale-110 transition-transform bg-background border flex items-center justify-center', ICONS.PLUS);
      addBtn.onclick = () => {
          const newNode = createNode('EMPTY');
          onChange({
              ...node,
              children: [...(node.children || []), newNode]
          });
      };
      addArea.appendChild(addBtn);
      childrenCol.appendChild(addArea);
  }

  innerFlex.appendChild(opCol);
  innerFlex.appendChild(childrenCol);
  mainBlock.appendChild(innerFlex);
  
  container.appendChild(mainBlock);

  if (!isRoot && onRemove) {
      const removeBtn = createElement('button', 'mt-2 h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-destructive transition-colors', ICONS.X);
      removeBtn.onclick = onRemove;
      container.appendChild(removeBtn);
  }

  return container;
}

function renderTypeSelector(node, onChange) {
    // Simple dropdown simulation or native select for vanilla simplicity
    // A custom popover is complex in vanilla without libs, let's use a native select styled to look okay-ish 
    // OR just a simple custom dropdown
    
    // Let's use a native select hidden behind a custom trigger for simplicity but ensuring it works
    const wrapper = createElement('div', 'relative inline-block');
    
    const trigger = createElement('button', 'h-8 w-8 p-0 shrink-0 font-bold bg-muted hover:bg-muted/80 text-muted-foreground rounded-md flex items-center justify-center', ICONS.CHEVRON_RIGHT);
    
    const select = createElement('select', 'absolute inset-0 opacity-0 cursor-pointer w-full h-full');
    
    Object.entries(OPERATOR_CONFIG).forEach(([key, conf]) => {
        const option = createElement('option', '', conf.label);
        option.value = key;
        option.selected = key === node.type;
        select.appendChild(option);
    });

    select.onchange = (e) => {
        const newType = e.target.value;
        if (newType === node.type) return;

        const newNode = createNode(newType);
        
        // Preserve children logic
        if (node.children && newNode.children) {
            newNode.children = [...node.children];
        }

        // Enforce limits
        if (newNode.children) {
             const min = newNode.minChildren ?? 0;
             while (newNode.children.length < min) {
                 newNode.children.push(createNode('EMPTY'));
             }
             if (newNode.maxChildren != null && newNode.children.length > newNode.maxChildren) {
                 newNode.children = newNode.children.slice(0, newNode.maxChildren);
             }
        }
        
        onChange(newNode);
    };

    wrapper.appendChild(trigger);
    wrapper.appendChild(select);
    
    return wrapper;
}

function renderSection(title, node, builderKey) {
    const section = createElement('section', 'space-y-4');
    const h2 = createElement('h2', 'text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center', title);
    const wrapper = createElement('div', 'bg-muted/5 p-2 rounded-lg');
    
    wrapper.appendChild(renderNode(node, (newNode) => updateBuilder(builderKey, newNode), undefined, true));
    
    section.appendChild(h2);
    section.appendChild(wrapper);
    return section;
}

function render() {
  const root = document.getElementById('root');
  root.innerHTML = '';
  
  const main = createElement('div', 'min-h-screen bg-background p-4 md:p-8 font-sans');
  const container = createElement('div', 'max-w-3xl mx-auto space-y-12');
  
  // Header
  const header = createElement('header', 'space-y-2 text-center');
  header.innerHTML = `
    <h1 class="text-3xl font-bold tracking-tight">Logic Builder</h1>
    <p class="text-muted-foreground">Construct logical propositions visually (Vanilla JS)</p>
  `;
  container.appendChild(header);

  // Predefined Builders
  const buildersContainer = createElement('div', 'space-y-12');
  buildersContainer.appendChild(renderSection('AND (min null, max null)', state.builders['and'], 'and'));
  buildersContainer.appendChild(renderSection('OR (min null, max null)', state.builders['or'], 'or'));
  buildersContainer.appendChild(renderSection('XOR (min 2, max 2)', state.builders['xor'], 'xor'));
  buildersContainer.appendChild(renderSection('IMPLIES (min 2, max 2)', state.builders['imp'], 'imp'));
  buildersContainer.appendChild(renderSection('BICONDITIONAL (min 2, max 2)', state.builders['bic'], 'bic'));
  buildersContainer.appendChild(renderSection('NOT (min 1, max 1)', state.builders['not'], 'not'));
  
  container.appendChild(buildersContainer);

  // Dynamic Builder
  const dynamicContainer = createElement('div', 'pt-8 border-t');
  dynamicContainer.innerHTML = `<h2 class="text-xl font-semibold mb-6 text-center text-primary">Dynamic Playground</h2>`;
  const dynamicWrapper = createElement('div', 'bg-muted/10 p-6 rounded-xl border border-dashed');
  dynamicWrapper.appendChild(renderNode(state.builders['dynamic'], (n) => updateBuilder('dynamic', n), undefined, true));
  dynamicContainer.appendChild(dynamicWrapper);
  
  container.appendChild(dynamicContainer);
  
  const spacer = createElement('div', 'h-20');
  container.appendChild(spacer);

  main.appendChild(container);
  root.appendChild(main);
}

// Initial render
render();