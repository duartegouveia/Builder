import "./index.css";

// --- Constants & Types ---

const OPERATOR_CONFIG = {
  'TEXT': { label: 'Text' },
  'AND': { label: 'AND' },
  'OR': { label: 'OR' },
  'XOR': { label: 'XOR' },
  'IMP': { label: '⇒' },
  'BIC': { label: '⇔' },
  'NOT': { label: 'NOT' },
};

const ICONS = {
  PLUS: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-primary"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
  X: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  CHEVRON_RIGHT: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="m9 18 6-6-6-6"/></svg>`,
};

// --- Configuration Logic ---

const CONFIG_RULES = {
    // Determine min/max children based on node type
    getConstraints: (type) => {
        switch(type) {
            case 'AND':
            case 'OR':
                return { min: 0, max: null };
            case 'XOR':
            case 'IMP':
            case 'BIC':
                return { min: 2, max: 2 };
            case 'NOT':
                return { min: 1, max: 1 };
            case 'TEXT':
                return { min: 0, max: 0 };
            default:
                return { min: 0, max: null };
        }
    },
    
    // Determine allowed options in popup based on parent type and hierarchy path
    getOptions: (parentType, path) => {
        const allOps = Object.keys(OPERATOR_CONFIG);
        
        // Example dynamic logic:
        // You can use parentType or path to filter allOps
        // e.g., if (parentType === 'AND') return ['OR', 'NOT', 'TEXT'];
        
        return allOps;
    }
};

// --- JSON Export Logic ---

function extractJSONFromDOM(element) {
    if (!element) return null;
    
    // Find the actual logic node element if the passed element is a wrapper
    const nodeEl = element.classList.contains('logic-node') ? element : element.querySelector('.logic-node');
    if (!nodeEl) return null;

    const kind = nodeEl.dataset.kind || '';
    const result = { kind, items: [] };

    if (kind === 'TEXT') {
        const input = nodeEl.querySelector('input');
        if (input) {
            result.items = [input.value];
        }
    } else {
        // Find children
        // We look for the specific structure we created
        // .children-container > .child-wrapper > .child-content > .logic-node
        const childrenContainer = nodeEl.querySelector('.children-container');
        if (childrenContainer) {
            // Iterate over direct children (wrappers)
            Array.from(childrenContainer.children).forEach(wrapper => {
                // The wrapper might contain the node directly or inside .child-content
                // Our structure: wrapper > childContent > renderNode(div.logic-node)
                // But wait, renderNode returns the div.logic-node.
                // So wrapper > childContent > div.logic-node
                
                // We must be careful not to find nested nodes deeper down.
                // querySelector inside the wrapper should find the immediate child node.
                const childNodeEl = wrapper.querySelector('.logic-node');
                if (childNodeEl) {
                    result.items.push(extractJSONFromDOM(childNodeEl));
                }
            });
        }
    }

    return result;
}

// --- Helper Functions ---
const DEFAULT_TYPE = Object.keys(OPERATOR_CONFIG)[0];

const createNode = (type) => {
  const constraints = CONFIG_RULES.getConstraints(type);
  const node = {
    id: Math.random().toString(36).substr(2, 9),
    type,
    children: type === 'TEXT' ? undefined : [],
    textValue: type === 'TEXT' ? '' : undefined,
    minChildren: constraints.min,
    maxChildren: constraints.max,
  };

  if (node.children && node.minChildren && node.minChildren > 0) {
    for (let i = 0; i < node.minChildren; i++) {
      node.children.push(createNode(DEFAULT_TYPE));
    }
  }

  return node;
};

const createInitialNode = (type) => {
    const node = createNode(type);
    const min = node.minChildren ?? (type === 'AND' || type === 'OR' ? 2 : 0);
    if (node.children) {
        while (node.children.length < min) {
            node.children.push(createNode(DEFAULT_TYPE));
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
    'dynamic': createNode(DEFAULT_TYPE)
  }
};

// --- Actions ---

function updateBuilder(key, newNode, skipRender = false) {
  state.builders[key] = newNode;
  if (!skipRender) render();
}

// --- DOM Rendering ---

function createElement(tag, className = "", innerHTML = "") {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (innerHTML) el.innerHTML = innerHTML;
  return el;
}

function renderNode(node, onChange, onRemove, isRoot = false, path = []) {
  // 1. Empty State
  if (node.type === 'EMPTY') {
    const container = createElement('div', 'flex items-center w-full p-2 border border-dashed border-muted-foreground/30 rounded-md bg-muted/20 logic-node');
    container.dataset.kind = 'EMPTY';
    
    const selector = renderTypeSelector(node, onChange, path);
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
    const container = createElement('div', 'flex items-center w-full p-2 border rounded-md bg-background shadow-sm logic-node');
    container.dataset.kind = 'TEXT';
    
    container.appendChild(renderTypeSelector(node, onChange, path));
    
    const wrapper = createElement('div', 'flex-1 flex items-center gap-2 ml-2');
    const icon = createElement('div', 'h-8 w-8 flex items-center justify-center bg-blue-100 text-blue-700 rounded font-bold text-xs shrink-0', 'Tx');
    
    const input = createElement('input', 'flex-1 h-9 border-none focus:ring-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground');
    input.value = node.textValue || '';
    input.placeholder = 'Enter text...';
    input.oninput = (e) => onChange({ ...node, textValue: e.target.value }, true);
    
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
  const constraints = CONFIG_RULES.getConstraints(node.type);
  const canAdd = constraints.max === null || (node.children?.length ?? 0) < constraints.max;
  const canRemove = constraints.min === null || (node.children?.length ?? 0) > constraints.min;

  const container = createElement('div', `w-full flex items-start gap-2 logic-node ${isRoot ? "p-4 border rounded-lg bg-card shadow-sm" : ""}`);
  container.dataset.kind = node.type;

  if (!isRoot) {
    const selectorContainer = createElement('div', 'mt-2');
    selectorContainer.appendChild(renderTypeSelector(node, onChange, path));
    container.appendChild(selectorContainer);
  }

  const mainBlock = createElement('div', `flex-1 border rounded-lg overflow-hidden bg-card shadow-sm ${!isRoot ? "border-l-4 border-l-primary/20" : ""}`);
  
  const innerFlex = createElement('div', 'flex');
  
  // Operator Column
  const opCol = createElement('div', 'w-12 bg-muted/30 border-r flex flex-col relative min-h-[60px]');
  const accent = createElement('div', 'absolute inset-y-0 left-0 w-1 bg-primary/10');
  opCol.appendChild(accent);

  const childCount = node.children ? node.children.length : 0;

  if (childCount === 0) {
      // Case 0: Center, no rotation (in empty box)
      opCol.classList.add('items-center', 'justify-center');
      const label = createElement('span', 'text-[10px] font-black text-muted-foreground uppercase tracking-wider whitespace-nowrap select-none', config.label);
      opCol.appendChild(label);
  } else {
      // Case >= 1: Dynamic Labels
      // We will add labels dynamically via ResizeObserver
  }
  
  // Children Column
  const childrenCol = createElement('div', 'flex-1 flex flex-col min-w-0');
  const childrenContainer = createElement('div', 'flex flex-col children-container');
  
  if (node.children) {
    node.children.forEach((child, index) => {
        const childWrapper = createElement('div', 'border-b last:border-b-0 p-2 hover:bg-muted/5 transition-colors flex gap-3 items-start group');
        
        const childContent = createElement('div', 'flex-1 min-w-0');
        const updateChild = (updatedChild, skipRender = false) => {
            const newChildren = [...node.children];
            newChildren[index] = updatedChild;
            onChange({ ...node, children: newChildren }, skipRender);
        };
        const removeChild = () => {
             const newChildren = node.children.filter((_, i) => i !== index);
             onChange({ ...node, children: newChildren });
        };
        
        // Pass updated path
        const childPath = [...path, node];
        childContent.appendChild(renderNode(child, updateChild, canRemove ? removeChild : undefined, false, childPath));
        childWrapper.appendChild(childContent);
        childrenContainer.appendChild(childWrapper);
    });
  }
  
  childrenCol.appendChild(childrenContainer);

  // Setup ResizeObserver for Case >= 1
  if (childCount >= 1) {
      const updateLabels = () => {
          // Check if opCol is still in DOM (it might be detached if re-rendered quickly)
          if (!opCol.isConnected) return;

          // Remove existing absolute labels (keep accent)
          // Note: Accent is first child.
          // We start removing from the end until we only have the accent left.
          while (opCol.children.length > 1) {
              opCol.removeChild(opCol.lastChild);
          }

          const children = Array.from(childrenContainer.children);
          const opRect = opCol.getBoundingClientRect();

          if (children.length === 1) {
             // Case 1: Center on the single child
             const child = children[0];
             const childRect = child.getBoundingClientRect();
             // Calculate Y center of the child relative to opCol top
             const relativeY = (childRect.top + childRect.height / 2) - opRect.top;
             
             const label = createElement('span', 'absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground uppercase tracking-wider whitespace-nowrap select-none px-1 rounded-sm z-10', config.label);
             label.style.top = `${relativeY}px`;
             opCol.appendChild(label);
          } else {
             // Case >= 2: Labels at junctions
             // We need labels between child i and child i+1
             for (let i = 0; i < children.length - 1; i++) {
                 const child = children[i];
                 const childRect = child.getBoundingClientRect();
                 
                 // Calculate Y relative to opCol
                 // We want the label centered on the bottom edge of the child
                 const relativeY = childRect.bottom - opRect.top;
                 
                 const label = createElement('span', 'absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground uppercase tracking-wider whitespace-nowrap select-none bg-muted/30 px-1 rounded-sm z-10', config.label);
                 label.style.top = `${relativeY}px`;
                 
                 opCol.appendChild(label);
             }
          }
      };

      // Observe both container and children for robust updates
      const observer = new ResizeObserver(() => {
          requestAnimationFrame(updateLabels);
      });
      
      observer.observe(childrenContainer);
      // Also observe children to catch height changes
      Array.from(childrenContainer.children).forEach(child => observer.observe(child));
      
      // Initial update
      requestAnimationFrame(updateLabels);
  }


  if (canAdd) {
      const addArea = createElement('div', 'p-2 flex justify-center border-t bg-muted/5 mt-[5px]');
      const addBtn = createElement('button', 'h-8 w-8 rounded-full shadow-sm hover:scale-110 transition-transform bg-background border flex items-center justify-center', ICONS.PLUS);
      addBtn.onclick = () => {
          const newNode = createNode(DEFAULT_TYPE);
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

function renderTypeSelector(node, onChange, path) {
    const wrapper = createElement('div', 'relative inline-block');
    
    // Determine parent type from path (last element is parent)
    const parentNode = path.length > 0 ? path[path.length - 1] : null;
    const parentType = parentNode ? parentNode.type : null;
    
    const allowedOptions = CONFIG_RULES.getOptions(parentType, path);

    // Trigger Button
    const trigger = createElement('button', 'h-8 w-8 p-0 shrink-0 font-bold bg-muted hover:bg-muted/80 text-muted-foreground rounded-md flex items-center justify-center transition-colors', ICONS.CHEVRON_RIGHT);
    
    // Dropdown Content (We create it but don't append it to wrapper yet)
    const dropdown = createElement('div', 'fixed w-32 p-1 rounded-md border bg-popover text-popover-foreground shadow-md z-[9999] hidden flex flex-col gap-1 bg-white dark:bg-zinc-950');
    
    // Generate Options based on allowedOptions
    allowedOptions.forEach(key => {
        const conf = OPERATOR_CONFIG[key];
        if (!conf) return; // Skip if config missing
        
        const isSelected = key === node.type;
        const optionBtn = createElement('button', `w-full text-left px-2 py-1.5 text-xs rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors ${isSelected ? 'bg-accent font-medium text-accent-foreground' : ''}`, conf.label);

        optionBtn.onclick = (e) => {
            e.stopPropagation(); // Prevent bubbling
            
            closeDropdown();
            
            if (key === node.type) return;
            
            const newType = key;
            const newNode = createNode(newType);
            
             // Preserve children logic
            if (node.children && newNode.children) {
                newNode.children = [...node.children];
            }

            // Enforce limits from CONFIG_RULES
            const constraints = CONFIG_RULES.getConstraints(newType);

            if (newNode.children) {
                 const min = constraints.min ?? 0;
                 while (newNode.children.length < min) {
                     newNode.children.push(createNode(DEFAULT_TYPE));
                 }
                 if (constraints.max != null && newNode.children.length > constraints.max) {
                     newNode.children = newNode.children.slice(0, constraints.max);
                 }
            }
            
            // Update node constraints properties too (optional if we always use rules)
            newNode.minChildren = constraints.min;
            newNode.maxChildren = constraints.max;

            onChange(newNode);
        };
        dropdown.appendChild(optionBtn);
    });

    const closeDropdown = () => {
        dropdown.classList.add('hidden');
        if (dropdown.parentNode === document.body) {
            document.body.removeChild(dropdown);
        }
    };

    // Toggle logic
    trigger.onclick = (e) => {
        e.stopPropagation();
        
        const isHidden = dropdown.classList.contains('hidden') || dropdown.parentNode !== document.body;

        // Close all other open dropdowns first
        document.querySelectorAll('.custom-dropdown-active').forEach(el => {
            // We can't easily access the close function of others, 
            // but we can remove them from DOM if we marked them.
            if (el.parentNode === document.body) {
                document.body.removeChild(el);
            }
        });

        if (isHidden) {
            document.body.appendChild(dropdown);
            dropdown.classList.remove('hidden');
            dropdown.classList.add('custom-dropdown-active');
            
            // Calculate position
            const rect = trigger.getBoundingClientRect();
            dropdown.style.top = `${rect.bottom + 4}px`;
            dropdown.style.left = `${rect.left}px`;
        } else {
            closeDropdown();
        }
    };

    // We store the close function on the trigger element to access it globally if needed, 
    // or rely on the global click listener cleaning up DOM nodes.
    // The global listener below removes .custom-dropdown-active from body.
    
    wrapper.appendChild(trigger);
    // wrapper.appendChild(dropdown); // Don't append to wrapper, we portal it to body
    
    return wrapper;
}

// Global click listener to close dropdowns
document.addEventListener('click', (e) => {
    // If click is inside a dropdown, don't close (handled by stopPropagation in option click)
    // But options close it manually.
    // If click is outside, close all.
    document.querySelectorAll('.custom-dropdown-active').forEach(el => {
        if (!el.contains(e.target)) {
            if (el.parentNode === document.body) {
                document.body.removeChild(el);
            }
        }
    });
});

// Update scroll listener to close dropdowns on scroll to prevent detached floating
window.addEventListener('scroll', () => {
     document.querySelectorAll('.custom-dropdown-active').forEach(el => {
        if (el.parentNode === document.body) {
            document.body.removeChild(el);
        }
    });
}, true); // Capture phase to catch scrolling of any element


function renderSection(title, node, builderKey) {
    const section = createElement('section', 'space-y-4');
    const h2 = createElement('h2', 'text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center', title);
    const wrapper = createElement('div', 'bg-muted/5 p-2 rounded-lg');
    
    wrapper.appendChild(renderNode(node, (newNode, skipRender) => updateBuilder(builderKey, newNode, skipRender), undefined, true));
    
    // Export Button
    const exportBtn = createElement('button', 'w-full mt-2 py-2 px-4 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors', 'Export JSON');
    exportBtn.onclick = () => {
        const rootNode = wrapper.querySelector('.logic-node');
        const json = extractJSONFromDOM(rootNode);
        if (json) {
            alert(JSON.stringify(json, null, 2));
        } else {
            alert('No logic to export');
        }
    };
    
    section.appendChild(h2);
    section.appendChild(wrapper);
    section.appendChild(exportBtn);
    return section;
}

function render() {
  let root = document.getElementById('logic-builder-app');
  
  if (!root) {
      root = document.createElement('div');
      root.id = 'logic-builder-app';
      document.body.appendChild(root);
  }

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
  dynamicWrapper.appendChild(renderNode(state.builders['dynamic'], (n, skipRender) => updateBuilder('dynamic', n, skipRender), undefined, true));
  
  const dynamicExportBtn = createElement('button', 'w-full mt-4 py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm', 'Export JSON');
  dynamicExportBtn.onclick = () => {
      const rootNode = dynamicWrapper.querySelector('.logic-node');
      const json = extractJSONFromDOM(rootNode);
      if (json) {
          alert(JSON.stringify(json, null, 2));
      } else {
          alert('No logic to export');
      }
  };
  dynamicWrapper.appendChild(dynamicExportBtn);

  dynamicContainer.appendChild(dynamicWrapper);
  
  container.appendChild(dynamicContainer);
  
  const spacer = createElement('div', 'h-20');
  container.appendChild(spacer);

  main.appendChild(container);
  root.appendChild(main);
}

// Initial render
render();