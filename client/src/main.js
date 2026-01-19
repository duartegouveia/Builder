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
  const opCol = createElement('div', 'w-12 bg-muted/30 border-r flex flex-col relative min-h-[60px]');
  const accent = createElement('div', 'absolute inset-y-0 left-0 w-1 bg-primary/10');
  opCol.appendChild(accent);

  const childCount = node.children ? node.children.length : 0;

  if (childCount < 2) {
      // Case 0 or 1: Center, no rotation
      opCol.classList.add('items-center', 'justify-center');
      const label = createElement('span', 'text-[10px] font-black text-muted-foreground uppercase tracking-wider whitespace-nowrap select-none', config.label);
      opCol.appendChild(label);
  } else {
      // Case >= 2: Labels at junctions
      // We will add labels dynamically
      // But we need the children to be rendered first and sized.
      // We'll setup the observer after building the full structure.
  }
  
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

  // Setup ResizeObserver for Case >= 2
  if (childCount >= 2) {
      const updateLabels = () => {
          // Remove existing absolute labels (keep accent)
          // Note: Accent is first child.
          while (opCol.children.length > 1) {
              opCol.removeChild(opCol.lastChild);
          }

          const children = Array.from(childrenContainer.children);
          // We need labels between child i and child i+1
          // i goes from 0 to length - 2
          for (let i = 0; i < children.length - 1; i++) {
              const child = children[i];
              // Position is bottom of current child relative to container
              // Since childrenContainer is top aligned with opCol
              const y = child.offsetTop + child.offsetHeight;
              
              const label = createElement('span', 'absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground uppercase tracking-wider whitespace-nowrap select-none bg-muted/30 px-1', config.label);
              label.style.top = `${y}px`;
              
              // To improve visibility over the border line, maybe add a small background or border?
              // The user said "aligned with the passage".
              // Let's add a small background to the label so it covers the border line visually if needed, 
              // or just sits on top.
              // I added bg-muted/30 to match column background to mask lines if any? 
              // Actually opCol has bg-muted/30.
              // Let's just place it.
              
              opCol.appendChild(label);
          }
      };

      // Observe the children container for size changes
      // We also need to observe individual children if their content changes but not container width?
      // observing childrenContainer with box: 'border-box' should catch height changes of children affecting container height.
      // But we need the positions of internal boundaries.
      // It's safer to observe the container.
      
      const observer = new ResizeObserver(() => {
          // Use requestAnimationFrame to avoid loop limit errors and ensure layout is done
          requestAnimationFrame(updateLabels);
      });
      
      observer.observe(childrenContainer);
      
      // Cleanup observer when element is removed?
      // In this simple Vanilla implementation, we don't have a component unmount lifecycle.
      // But since we replace innerHTML of root on render(), the DOM nodes are garbage collected.
      // The observer should be GC'd too if the target node is GC'd. 
      // (JS WeakRefs logic applies to observers usually).
  }


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
    const wrapper = createElement('div', 'relative inline-block');
    
    // Trigger Button
    const trigger = createElement('button', 'h-8 w-8 p-0 shrink-0 font-bold bg-muted hover:bg-muted/80 text-muted-foreground rounded-md flex items-center justify-center transition-colors', ICONS.CHEVRON_RIGHT);
    
    // Dropdown Content
    const dropdown = createElement('div', 'absolute top-full left-0 mt-1 w-32 p-1 rounded-md border bg-popover text-popover-foreground shadow-md z-50 hidden flex flex-col gap-1 bg-white dark:bg-zinc-950');
    
    // Generate Options
    Object.entries(OPERATOR_CONFIG).forEach(([key, conf]) => {
        const isSelected = key === node.type;
        const optionBtn = createElement('button', `w-full text-left px-2 py-1.5 text-xs rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors ${isSelected ? 'bg-accent font-medium text-accent-foreground' : ''}`, conf.label);

        optionBtn.onclick = (e) => {
            e.stopPropagation(); // Prevent bubbling
            
            if (key === node.type) {
                 dropdown.classList.add('hidden');
                 return;
            }
            
            const newType = key;
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
        dropdown.appendChild(optionBtn);
    });

    // Toggle logic
    trigger.onclick = (e) => {
        e.stopPropagation();
        
        // Close all other open dropdowns
        document.querySelectorAll('.custom-dropdown').forEach(el => {
            if (el !== dropdown) el.classList.add('hidden');
        });

        dropdown.classList.toggle('hidden');
        dropdown.classList.add('custom-dropdown');
    };

    wrapper.appendChild(trigger);
    wrapper.appendChild(dropdown);
    
    return wrapper;
}

// Global click listener to close dropdowns
document.addEventListener('click', () => {
    document.querySelectorAll('.custom-dropdown').forEach(el => {
        el.classList.add('hidden');
    });
});


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