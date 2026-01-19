import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, ChevronRight, Check, Download, ArrowLeftRight, ArrowUpDown } from 'lucide-react';

// --- Types ---

export type NodeType = 'VARIABLE' | 'AND' | 'OR' | 'XOR' | 'IMP' | 'BIC' | 'NOT' | 'TEXT' | 'MULTILINE' | 'BOOLEAN' | 'EMPTY';

export interface LogicNode {
  id: string;
  type: NodeType;
  children?: LogicNode[];
  textValue?: string;
  booleanValue?: boolean;
  minChildren?: number | null;
  maxChildren?: number | null;
  layoutPreference?: 'horizontal' | 'vertical';
}

// --- Constants ---

const OPERATOR_CONFIG: Record<string, { label: string; min?: number | null; max?: number | null }> = {
  'VARIABLE': { label: 'Variable' },
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

// --- Helper Functions ---

const extractVariables = (node: LogicNode): string[] => {
  const vars = new Set<string>();
  
  const traverse = (n: LogicNode) => {
    if ((n.type === 'TEXT' || n.type === 'MULTILINE' || n.type === 'VARIABLE') && n.textValue) {
      vars.add(n.textValue);
    }
    if (n.children) {
      n.children.forEach(traverse);
    }
  };
  
  traverse(node);
  return Array.from(vars).sort();
};

const evaluateLogic = (node: LogicNode, values: Record<string, boolean>): boolean => {
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
};

const createNode = (type: NodeType): LogicNode => {
  const config = OPERATOR_CONFIG[type];
  const isTextType = type === 'TEXT' || type === 'MULTILINE' || type === 'VARIABLE';
  const isBooleanType = type === 'BOOLEAN';
  const isLeafType = isTextType || isBooleanType;
  const node: LogicNode = {
    id: Math.random().toString(36).substr(2, 9),
    type,
    children: isLeafType ? undefined : [],
    textValue: isTextType ? '' : undefined,
    booleanValue: isBooleanType ? false : undefined,
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

// --- Components ---

const Popover: React.FC<{ 
  trigger: React.ReactNode; 
  children: React.ReactNode;
}> = ({ trigger, children }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div className="popover-content absolute top-full left-0 mt-1 z-10 animate-fade-in">
          <div onClick={() => setOpen(false)}>{children}</div>
        </div>
      )}
    </div>
  );
};

const LogicControls: React.FC<{ 
    variables: string[], 
    values: Record<string, boolean>, 
    onChange: (variable: string, value: boolean) => void,
    result: boolean,
    onExport: () => void
}> = ({ variables, values, onChange, result, onExport }) => {
    return (
        <div className="logic-controls">
            <div className="flex-1 space-y-2 w-full">
                <div className="flex items-center justify-between gap-4">
                     <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Check style={{ width: 12, height: 12 }} />
                        Logic Evaluation
                     </h3>
                     <div className="md-hidden">
                        <span className={`logic-result-badge ${result ? 'is-true' : 'is-false'}`} style={{ fontSize: '0.75rem', padding: '0.125rem 0.5rem' }}>
                            {result ? 'TRUE' : 'FALSE'}
                        </span>
                     </div>
                </div>

                {variables.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">Add text variables to evaluate...</p>
                ) : (
                    <div className="flex flex-wrap gap-3">
                        {variables.map(v => (
                            <button
                                key={v}
                                onClick={() => onChange(v, !values[v])}
                                className={`logic-variable-btn ${values[v] ? 'is-true' : 'is-false'}`}
                            >
                                <span className="font-mono font-bold">{v}</span>
                                <div style={{ 
                                    height: 12, 
                                    width: 1, 
                                    margin: '0 0.25rem',
                                    backgroundColor: values[v] ? 'var(--green-400)' : 'var(--red-400)',
                                    opacity: 0.3 
                                }} />
                                <span className={`font-bold text-xs ${values[v] ? 'text-green-700' : 'text-red-700'}`} style={{ color: values[v] ? 'var(--green-700)' : 'var(--red-700)' }}>
                                    {values[v] ? 'T' : 'F'}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="hidden md-block" style={{ width: 1, height: 48, backgroundColor: 'var(--border)' }} />

            <div className="flex items-center gap-4 w-full justify-end" style={{ width: 'auto' }}>
                <div className="hidden md-flex flex-col items-end gap-1 mr-2" style={{ display: 'none' }}>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold" style={{ fontSize: 10 }}>Result</span>
                    <span className={`logic-result-badge ${result ? 'is-true' : 'is-false'}`}>
                        {result ? 'TRUE' : 'FALSE'}
                    </span>
                </div>
                <div className="flex-col items-end gap-1 mr-2" style={{ display: 'flex' }}>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold" style={{ fontSize: 10 }}>Result</span>
                    <span className={`logic-result-badge ${result ? 'is-true' : 'is-false'}`}>
                        {result ? 'TRUE' : 'FALSE'}
                    </span>
                </div>

                <button className="btn btn-outline btn-md gap-2" onClick={onExport}>
                    <Download style={{ width: 16, height: 16 }} />
                    <span className="hidden sm-inline" style={{ display: 'inline' }}>Export JSON</span>
                </button>
            </div>
        </div>
    );
};

interface NodeEditorProps {
  node: LogicNode;
  onChange: (updated: LogicNode) => void;
  onRemove?: () => void;
  isRoot?: boolean;
}

const NodeEditor: React.FC<NodeEditorProps> = ({ node, onChange, onRemove, isRoot = false }) => {
  
  const addChild = () => {
    if (!node.children) return;
    const newNode = createNode('EMPTY');
    onChange({
      ...node,
      children: [...node.children, newNode]
    });
  };

  const updateChild = (index: number, updatedChild: LogicNode) => {
    if (!node.children) return;
    const newChildren = [...node.children];
    newChildren[index] = updatedChild;
    onChange({ ...node, children: newChildren });
  };

  const removeChild = (index: number) => {
    if (!node.children) return;
    const newChildren = node.children.filter((_, i) => i !== index);
    onChange({ ...node, children: newChildren });
  };

  const handleTypeChange = (newType: NodeType) => {
    if (newType === node.type) return;
    
    const newNode = createNode(newType);
    
    if (node.children && newNode.children) {
        newNode.children = [...node.children];
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

    onChange(newNode);
  };

  const renderTypeSelector = () => (
    <Popover
      trigger={
        <button className="btn btn-secondary btn-icon-sm font-bold mr-2" style={{ flexShrink: 0 }}>
          <ChevronRight style={{ width: 16, height: 16 }} />
        </button>
      }
    >
      <div className="flex flex-col gap-1" style={{ minWidth: 160 }}>
        {Object.entries(OPERATOR_CONFIG).map(([key, conf]) => (
          <button 
            key={key} 
            className="btn btn-ghost justify-start"
            style={{ justifyContent: 'flex-start', height: 32, padding: '0 0.5rem', fontSize: '0.875rem' }}
            onClick={() => handleTypeChange(key as NodeType)}
          >
            {conf.label}
          </button>
        ))}
      </div>
    </Popover>
  );

  // 1. Empty State
  if (node.type === 'EMPTY') {
    return (
      <div className="logic-empty">
         {renderTypeSelector()}
         <span className="text-sm text-muted-foreground italic flex-1">Select an operation...</span>
         {onRemove && (
             <button className="btn btn-ghost btn-icon-sm text-muted-foreground" onClick={onRemove}>
                 <X style={{ width: 16, height: 16 }} />
             </button>
         )}
      </div>
    );
  }

  // 1b. Variable Node
  if (node.type === 'VARIABLE') {
      return (
          <div className="logic-text-node">
             {renderTypeSelector()}
             <div className="flex-1 flex items-center gap-2">
                 <div className="logic-text-badge">Var</div>
                 <input 
                    type="text"
                    value={node.textValue} 
                    onChange={(e) => onChange({ ...node, textValue: e.target.value })}
                    placeholder="Variable name..."
                    className="input"
                    style={{ width: 200, borderColor: 'transparent', backgroundColor: 'transparent' }}
                 />
             </div>
             {onRemove && (
                 <button className="btn btn-ghost btn-icon-sm text-muted-foreground ml-2" onClick={onRemove}>
                     <X style={{ width: 16, height: 16 }} />
                 </button>
             )}
          </div>
      );
  }

  // 2. Text Node
  if (node.type === 'TEXT') {
      return (
          <div className="logic-text-node">
             {renderTypeSelector()}
             <div className="flex-1 flex items-center gap-2">
                 <div className="logic-text-badge">abc</div>
                 <input 
                    type="text"
                    value={node.textValue} 
                    onChange={(e) => onChange({ ...node, textValue: e.target.value })}
                    placeholder="Enter text..."
                    className="input flex-1"
                    style={{ borderColor: 'transparent', backgroundColor: 'transparent' }}
                 />
             </div>
             {onRemove && (
                 <button className="btn btn-ghost btn-icon-sm text-muted-foreground ml-2" onClick={onRemove}>
                     <X style={{ width: 16, height: 16 }} />
                 </button>
             )}
          </div>
      );
  }

  // 2b. Multiline Text Node
  if (node.type === 'MULTILINE') {
      return (
          <div className="logic-text-node" style={{ alignItems: 'flex-start' }}>
             {renderTypeSelector()}
             <div className="flex-1 flex items-start gap-2">
                 <div className="logic-text-badge" style={{ whiteSpace: 'pre-line', lineHeight: 1.2, padding: '4px 6px', height: 'auto' }}>abc{'\n'}abc</div>
                 <textarea 
                    value={node.textValue} 
                    onChange={(e) => onChange({ ...node, textValue: e.target.value })}
                    placeholder="Enter multiline text..."
                    className="input flex-1"
                    style={{ borderColor: 'transparent', backgroundColor: 'transparent', minHeight: 60, resize: 'vertical' }}
                 />
             </div>
             {onRemove && (
                 <button className="btn btn-ghost btn-icon-sm text-muted-foreground ml-2" onClick={onRemove}>
                     <X style={{ width: 16, height: 16 }} />
                 </button>
             )}
          </div>
      );
  }

  // 2c. Boolean Node
  if (node.type === 'BOOLEAN') {
      return (
          <div className="logic-text-node">
             {renderTypeSelector()}
             <div className="flex-1 flex items-center gap-3">
                 <div className="logic-text-badge">01</div>
                 <label className="flex items-center gap-2 cursor-pointer">
                     <input 
                        type="checkbox"
                        checked={node.booleanValue || false}
                        onChange={(e) => onChange({ ...node, booleanValue: e.target.checked })}
                        style={{ width: 18, height: 18, cursor: 'pointer' }}
                     />
                     <span className="font-mono font-bold" style={{ color: node.booleanValue ? 'var(--green-700)' : 'var(--red-700)' }}>
                        {node.booleanValue ? '1' : '0'}
                     </span>
                 </label>
             </div>
             {onRemove && (
                 <button className="btn btn-ghost btn-icon-sm text-muted-foreground ml-2" onClick={onRemove}>
                     <X style={{ width: 16, height: 16 }} />
                 </button>
             )}
          </div>
      );
  }

  // 3. Operator Node
  const config = OPERATOR_CONFIG[node.type];
  
  const minChildren = node.minChildren ?? config.min ?? 0;
  const maxChildren = node.maxChildren ?? config.max ?? null;

  const canAdd = maxChildren == null || (node.children?.length ?? 0) < maxChildren;
  const canRemove = minChildren == null || (node.children?.length ?? 0) > minChildren;

  const defaultHorizontal = minChildren === maxChildren && (minChildren === 2 || minChildren === 3);
  
  const isHorizontalMode = node.layoutPreference 
      ? node.layoutPreference === 'horizontal'
      : defaultHorizontal;

  const toggleLayout = () => {
      const newLayout = isHorizontalMode ? 'vertical' : 'horizontal';
      onChange({ ...node, layoutPreference: newLayout });
  };

  const renderChildren = () => {
    if (isHorizontalMode) {
         return (
             <div className="logic-horizontal">
                <button
                    className="logic-toggle-btn"
                    onClick={toggleLayout}
                    title="Mudar para Layout Vertical"
                >
                    <ArrowUpDown style={{ width: 12, height: 12 }} />
                </button>
                
                {node.children?.map((child, index) => (
                    <React.Fragment key={child.id}>
                        {index > 0 && (
                            <div className="logic-operator-divider">
                                {config.label}
                            </div>
                        )}
                        <div className="logic-horizontal-child">
                            <NodeEditor 
                                node={child} 
                                onChange={(updated) => updateChild(index, updated)} 
                            />
                        </div>
                    </React.Fragment>
                ))}
            </div>
         );
    } else {
        // Vertical Mode
        return (
            <div className="logic-operator-container">
                <div className="flex">
                    <div className="logic-operator-column">
                         <div className="flex-1 flex items-center justify-center w-full">
                            <span className="logic-operator-label">
                                {config.label}
                            </span>
                         </div>
                         
                         <div className="logic-toggle-btn-vertical">
                            <button
                                className="logic-toggle-btn"
                                style={{ position: 'static', opacity: 0.4 }}
                                onClick={toggleLayout}
                                title="Mudar para Layout Horizontal"
                            >
                                <ArrowLeftRight style={{ width: 12, height: 12 }} />
                            </button>
                         </div>
                    </div>
                    
                    <div className="logic-children-column">
                        <div className="flex flex-col">
                            {node.children?.map((child, index) => (
                                <div 
                                    key={child.id}
                                    className="logic-child-row"
                                >
                                    <div className="flex-1" style={{ minWidth: 0 }}>
                                        <NodeEditor 
                                            node={child} 
                                            onChange={(updated) => updateChild(index, updated)} 
                                            onRemove={canRemove ? () => removeChild(index) : undefined}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {canAdd && (
                            <div className="logic-add-area">
                                <button 
                                    className="btn btn-outline btn-icon-sm rounded-full shadow-sm"
                                    style={{ transform: 'scale(1)', transition: 'transform 0.15s' }}
                                    onClick={addChild}
                                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                >
                                    <Plus style={{ width: 16, height: 16, color: 'var(--primary)' }} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
  };

  return (
    <div className={`logic-node ${isRoot ? 'is-root' : ''}`}>
        {!isRoot && (
           <div className="mt-2 flex flex-col gap-1 items-center">
             {renderTypeSelector()}
           </div>
        )}
        
        {renderChildren()}
        
        {!isRoot && onRemove && (
            <button 
               className="btn btn-ghost btn-icon-sm text-muted-foreground mt-2"
               onClick={onRemove}
            >
                <X style={{ width: 16, height: 16 }} />
            </button>
        )}
    </div>
  );
};

// --- Section Component ---

const Section: React.FC<{ title: string; node: LogicNode; onChange: (n: LogicNode) => void }> = ({ title, node, onChange }) => {
    return (
        <section className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            <NodeEditor node={node} onChange={onChange} isRoot={true} />
        </section>
    );
};

// --- Main Page Component ---

export default function LogicBuilder() {
  
  const [builders, setBuilders] = useState<Record<string, LogicNode>>({
    'and': createInitialNode('AND'),
    'or': createInitialNode('OR'),
    'xor': createInitialNode('XOR'),
    'imp': createInitialNode('IMP'),
    'bic': createInitialNode('BIC'),
    'not': createInitialNode('NOT'),
    'dynamic': createNode('EMPTY')
  });

  const [truthValues, setTruthValues] = useState<Record<string, boolean>>({});

  const dynamicVariables = extractVariables(builders['dynamic']);
  const dynamicResult = evaluateLogic(builders['dynamic'], truthValues);

  useEffect(() => {
    const newValues = { ...truthValues };
    let changed = false;
    dynamicVariables.forEach(v => {
        if (v && !(v in newValues)) {
            newValues[v] = false;
            changed = true;
        }
    });
    if (changed) {
        setTruthValues(newValues);
    }
  }, [dynamicVariables, truthValues]);

  const toggleVariable = (variable: string, value: boolean) => {
      setTruthValues(prev => ({ ...prev, [variable]: value }));
  };

  function createInitialNode(type: NodeType): LogicNode {
      const node = createNode(type);
      const min = node.minChildren ?? (type === 'AND' || type === 'OR' ? 2 : 0);
      if (node.children) {
          while (node.children.length < min) {
              node.children.push(createNode('EMPTY'));
          }
      }
      return node;
  }

  const updateBuilder = (key: string, newNode: LogicNode) => {
      setBuilders(prev => ({ ...prev, [key]: newNode }));
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(builders['dynamic'], null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "logic_tree.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="min-h-screen bg-background p-4" style={{ padding: '1rem' }}>
      <div className="max-w-3xl mx-auto space-y-12">
        
        <header className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Logic Builder</h1>
            <p className="text-muted-foreground">Construct logical propositions visually</p>
        </header>

        <div className="space-y-12">
            <Section title="AND (min null, max null)" node={builders['and']} onChange={(n) => updateBuilder('and', n)} />
            <Section title="OR (min null, max null)" node={builders['or']} onChange={(n) => updateBuilder('or', n)} />
            <Section title="XOR (min 2, max 2)" node={builders['xor']} onChange={(n) => updateBuilder('xor', n)} />
            <Section title="IMPLIES (min 2, max 2)" node={builders['imp']} onChange={(n) => updateBuilder('imp', n)} />
            <Section title="BICONDITIONAL (min 2, max 2)" node={builders['bic']} onChange={(n) => updateBuilder('bic', n)} />
            <Section title="NOT (min 1, max 1)" node={builders['not']} onChange={(n) => updateBuilder('not', n)} />
        </div>

        <div className="pt-8 border-t space-y-6">
             <div className="text-center">
                <h2 className="text-xl font-semibold text-primary">Dynamic Playground</h2>
                <p className="text-sm text-muted-foreground mt-1">Build complex logic and evaluate it</p>
             </div>
             
             <div className="p-6 rounded-xl border border-dashed" style={{ backgroundColor: 'hsl(210, 40%, 96.1%, 0.1)' }}>
                <NodeEditor node={builders['dynamic']} onChange={(n) => updateBuilder('dynamic', n)} isRoot={true} />
             </div>

             <LogicControls 
                variables={dynamicVariables}
                values={truthValues}
                onChange={toggleVariable}
                result={dynamicResult}
                onExport={handleExport}
             />
        </div>
      </div>
    </div>
  );
}
