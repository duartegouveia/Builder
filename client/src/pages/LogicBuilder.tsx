import React, { useState, useEffect } from 'react';
import { Plus, X, ChevronRight, Check, AlertCircle, Download, FileJson } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---

export type NodeType = 'AND' | 'OR' | 'XOR' | 'IMP' | 'BIC' | 'NOT' | 'TEXT' | 'EMPTY';

export interface LogicNode {
  id: string;
  type: NodeType;
  children?: LogicNode[];
  textValue?: string;
  minChildren?: number | null;
  maxChildren?: number | null;
}

// --- Constants ---

const OPERATOR_CONFIG: Record<string, { label: string; min?: number | null; max?: number | null }> = {
  'TEXT': { label: 'Text' },
  'AND': { label: 'AND', min: 0, max: null }, // min 0 effectively means null in the original context (no strict constraint shown, but logic implies >=2 usually, original says null)
  'OR': { label: 'OR', min: 0, max: null },
  'XOR': { label: 'XOR', min: 2, max: 2 },
  'IMP': { label: '⇒', min: 2, max: 2 },
  'BIC': { label: '⇔', min: 2, max: 2 },
  'NOT': { label: 'NOT', min: 1, max: 1 },
};

// --- Helper Functions ---

// Get all unique variable names from the tree
const extractVariables = (node: LogicNode): string[] => {
  const vars = new Set<string>();
  
  const traverse = (n: LogicNode) => {
    if (n.type === 'TEXT' && n.textValue) {
      vars.add(n.textValue);
    }
    if (n.children) {
      n.children.forEach(traverse);
    }
  };
  
  traverse(node);
  return Array.from(vars).sort();
};

// Evaluate the logic tree
const evaluateLogic = (node: LogicNode, values: Record<string, boolean>): boolean => {
  if (node.type === 'TEXT') {
    return values[node.textValue || ''] || false;
  }
  
  if (node.type === 'EMPTY') return false; // Treat empty as false
  
  const childResults = node.children?.map(c => evaluateLogic(c, values)) || [];
  
  switch (node.type) {
    case 'AND':
      return childResults.length > 0 && childResults.every(r => r);
    case 'OR':
      return childResults.some(r => r);
    case 'XOR':
      // XOR for n inputs: true if odd number of inputs are true
      return childResults.filter(r => r).length % 2 === 1;
    case 'IMP':
      // p -> q is equivalent to !p || q
      // Only 2 children allowed/expected for IMP
      if (childResults.length < 2) return false;
      return !childResults[0] || childResults[1];
    case 'BIC':
      // p <-> q is equivalent to (p -> q) && (q -> p) or simply p === q
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
  const node: LogicNode = {
    id: Math.random().toString(36).substr(2, 9),
    type,
    children: type === 'TEXT' ? undefined : [],
    textValue: type === 'TEXT' ? '' : undefined,
    minChildren: config?.min ?? null,
    maxChildren: config?.max ?? null,
  };

  // Auto-fill min children
  if (node.children && node.minChildren && node.minChildren > 0) {
      for (let i = 0; i < node.minChildren; i++) {
          node.children.push(createNode('EMPTY'));
      }
  }

  return node;
};

// --- Components ---

const LogicControls: React.FC<{ 
    variables: string[], 
    values: Record<string, boolean>, 
    onChange: (variable: string, value: boolean) => void,
    result: boolean,
    onExport: () => void
}> = ({ variables, values, onChange, result, onExport }) => {
    return (
        <div className="bg-card border rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left: Logic Evaluation (Variables) */}
            <div className="flex-1 space-y-2 w-full md:w-auto">
                <div className="flex items-center justify-between md:justify-start gap-4">
                     <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Check className="w-3 h-3" />
                        Logic Evaluation
                     </h3>
                     {/* Result Badge (Mobile Only) */}
                     <div className="md:hidden">
                        <span className={cn(
                            "text-xs font-mono font-bold px-2 py-0.5 rounded",
                            result ? "bg-green-500 text-white" : "bg-red-500 text-white"
                        )}>
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
                                className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-md border transition-all text-sm group",
                                    values[v] ? "bg-green-50/50 border-green-200 hover:border-green-300" : "bg-red-50/50 border-red-200 hover:border-red-300"
                                )}
                            >
                                <span className="font-mono font-bold">{v}</span>
                                <div className={cn("h-3 w-px mx-1 group-hover:opacity-100 opacity-30 transition-opacity", values[v] ? "bg-green-400" : "bg-red-400")} />
                                <span className={cn("font-bold text-xs", values[v] ? "text-green-700" : "text-red-700")}>
                                    {values[v] ? 'T' : 'F'}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Divider */}
            <div className="hidden md:block w-px h-12 bg-border" />

            {/* Right: Result & Export */}
            <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                {/* Result Display (Desktop) */}
                <div className="hidden md:flex flex-col items-end gap-1 mr-2">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Result</span>
                    <span className={cn(
                        "text-lg font-mono font-bold px-3 py-1 rounded shadow-sm",
                        result ? "bg-green-500 text-white" : "bg-red-500 text-white"
                    )}>
                        {result ? 'TRUE' : 'FALSE'}
                    </span>
                </div>

                <Button variant="outline" className="gap-2" onClick={onExport}>
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export JSON</span>
                </Button>
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
  
  // -- Handlers --
  
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
    
    // If switching to TEXT, clear children. If switching from TEXT, init children.
    const newNode = createNode(newType);
    
    // Preserve children if moving between compatible operators
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

  const renderTypeSelector = () => (
    <Popover>
      <PopoverTrigger asChild>
          <Button 
            variant="secondary" 
            size="sm" 
            className="h-8 w-8 p-0 shrink-0 font-bold bg-muted hover:bg-muted/80 text-muted-foreground mr-2"
          >
              <ChevronRight className="h-4 w-4" />
          </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1" align="start">
          <div className="grid gap-1">
              {Object.entries(OPERATOR_CONFIG).map(([key, conf]) => (
                  <Button 
                      key={key} 
                      variant="ghost" 
                      className="justify-start h-8 px-2 text-sm"
                      onClick={() => handleTypeChange(key as NodeType)}
                  >
                      {conf.label}
                  </Button>
              ))}
          </div>
      </PopoverContent>
   </Popover>
  );

  // -- Render Logic --

  // 1. Empty State
  if (node.type === 'EMPTY') {
    return (
      <div className="flex items-center w-full p-2 border border-dashed border-muted-foreground/30 rounded-md bg-muted/20">
         {renderTypeSelector()}
         <span className="text-sm text-muted-foreground italic flex-1">Select an operation...</span>
         {onRemove && (
             <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={onRemove}>
                 <X className="h-4 w-4" />
             </Button>
         )}
      </div>
    );
  }

  // 2. Text Node
  if (node.type === 'TEXT') {
      return (
          <div className="flex items-center w-full p-2 border rounded-md bg-background shadow-sm">
             {renderTypeSelector()}
             <div className="flex-1 flex items-center gap-2">
                 <div className="h-8 w-8 flex items-center justify-center bg-blue-100 text-blue-700 rounded font-bold text-xs shrink-0">
                     Tx
                 </div>
                 <Input 
                    value={node.textValue} 
                    onChange={(e) => onChange({ ...node, textValue: e.target.value })}
                    placeholder="Enter text..."
                    className="flex-1 h-9 border-transparent focus:border-input bg-transparent"
                 />
             </div>
             {onRemove && (
                 <Button variant="ghost" size="icon" className="ml-2 h-8 w-8 text-muted-foreground hover:text-destructive" onClick={onRemove}>
                     <X className="h-4 w-4" />
                 </Button>
             )}
          </div>
      );
  }

  // 3. Operator Node
  const config = OPERATOR_CONFIG[node.type];
  
  // Robust check using config directly to avoid stale state issues
  const minChildren = node.minChildren ?? config.min ?? 0;
  const maxChildren = node.maxChildren ?? config.max ?? null;

  const canAdd = maxChildren == null || (node.children?.length ?? 0) < maxChildren;
  const canRemove = minChildren == null || (node.children?.length ?? 0) > minChildren;

  // Horizontal Mode Check for specific operators (min=max=2 or 3)
  const isHorizontalMode = 
      minChildren === maxChildren && 
      (minChildren === 2 || minChildren === 3);

  if (isHorizontalMode) {
      return (
        <div className={cn("w-full flex items-center gap-2", isRoot ? "p-4 border rounded-lg bg-card shadow-sm" : "")}>
            {!isRoot && (
               <div className="mr-2">
                 {renderTypeSelector()}
               </div>
            )}
            
            <div className={cn("flex-1 border rounded-lg p-4 bg-card shadow-sm flex flex-row items-center gap-4 overflow-x-auto", !isRoot && "border-l-4 border-l-primary/20")}>
                {node.children?.map((child, index) => (
                    <React.Fragment key={child.id}>
                        {index > 0 && (
                            <div className="font-bold text-muted-foreground px-2 py-1 bg-muted rounded text-sm uppercase shrink-0">
                                {config.label}
                            </div>
                        )}
                        <div className="flex-1 min-w-[200px]">
                            <NodeEditor 
                                node={child} 
                                onChange={(updated) => updateChild(index, updated)} 
                            />
                        </div>
                    </React.Fragment>
                ))}
            </div>

            {!isRoot && onRemove && (
                <Button 
                   variant="ghost" 
                   size="icon" 
                   className="ml-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                   onClick={onRemove}
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
      );
  }

  return (
    <div className={cn("w-full flex items-start gap-2", isRoot ? "p-4 border rounded-lg bg-card shadow-sm" : "")}>
        {!isRoot && (
           <div className="mt-2">
             {renderTypeSelector()}
           </div>
        )}
        
        <div className={cn("flex-1 border rounded-lg overflow-hidden bg-card shadow-sm", !isRoot && "border-l-4 border-l-primary/20")}>
            <div className="flex">
                {/* Operator Column */}
                <div className="w-12 bg-muted/30 border-r flex flex-col items-center justify-center relative">
                     <div className="absolute inset-y-0 left-0 w-1 bg-primary/10" />
                     <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider rotate-[-90deg] whitespace-nowrap">
                         {config.label}
                     </span>
                </div>
                
                {/* Lines Column */}
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex flex-col">
                        <AnimatePresence initial={false}>
                            {node.children?.map((child, index) => (
                                <motion.div 
                                    key={child.id}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="border-b last:border-b-0 p-2 hover:bg-muted/5 transition-colors flex gap-3 items-start group"
                                >
                                    <div className="flex-1 min-w-0">
                                        <NodeEditor 
                                            node={child} 
                                            onChange={(updated) => updateChild(index, updated)} 
                                            onRemove={canRemove ? () => removeChild(index) : undefined}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Add Button Area */}
                    {canAdd && (
                        <div className="p-2 flex justify-center border-t bg-muted/5 mt-[5px]">
                            <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8 rounded-full shadow-sm hover:scale-110 transition-transform bg-background"
                                onClick={addChild}
                            >
                                <Plus className="h-4 w-4 text-primary" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
        
        {/* If it's root, we might want a reset or something, but usually root doesn't have the > button unless we wrap it specifically. 
            The requirement says "when choosing an option... replacement should not eliminate > button".
            
            Wait, if I put the > button to the LEFT of the main block, it solves it.
        */}
        {!isRoot && onRemove && (
            <Button 
               variant="ghost" 
               size="icon" 
               className="mt-2 h-8 w-8 text-muted-foreground hover:text-destructive"
               onClick={onRemove}
            >
                <X className="h-4 w-4" />
            </Button>
        )}
    </div>
  );
};

// --- Main Page Component ---

export default function LogicBuilder() {
  
  // Initial state for the predefined sections
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

  // Dynamic builder variables and result
  const dynamicVariables = extractVariables(builders['dynamic']);
  const dynamicResult = evaluateLogic(builders['dynamic'], truthValues);

  // Auto-initialize new variables to false
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
      // Initialize with min children
      const min = node.minChildren ?? (type === 'AND' || type === 'OR' ? 2 : 0); // AND/OR usually start with 2 empty slots for UX
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
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-12">
        
        <header className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Logic Builder</h1>
            <p className="text-muted-foreground">Construct logical propositions visually</p>
        </header>

        {/* Predefined Builders */}
        <div className="space-y-12">
            <Section title="AND (min null, max null)" node={builders['and']} onChange={(n) => updateBuilder('and', n)} />
            <Section title="OR (min null, max null)" node={builders['or']} onChange={(n) => updateBuilder('or', n)} />
            <Section title="XOR (min 2, max 2)" node={builders['xor']} onChange={(n) => updateBuilder('xor', n)} />
            <Section title="IMPLIES (min 2, max 2)" node={builders['imp']} onChange={(n) => updateBuilder('imp', n)} />
            <Section title="BICONDITIONAL (min 2, max 2)" node={builders['bic']} onChange={(n) => updateBuilder('bic', n)} />
            <Section title="NOT (min 1, max 1)" node={builders['not']} onChange={(n) => updateBuilder('not', n)} />
        </div>

        {/* Dynamic Builder */}
        <div className="pt-8 border-t space-y-6">
             <div className="text-center">
                <h2 className="text-xl font-semibold text-primary">Dynamic Playground</h2>
                <p className="text-sm text-muted-foreground mt-1">Build complex logic and evaluate it</p>
             </div>
             
             <div className="bg-muted/10 p-6 rounded-xl border border-dashed">
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

        <div className="h-20" /> {/* Spacer */}
      </div>
    </div>
  );
}

function Section({ title, node, onChange }: { title: string, node: LogicNode, onChange: (n: LogicNode) => void }) {
    return (
        <section className="space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center">{title}</h2>
            <div className="bg-muted/5 p-2 rounded-lg">
                <NodeEditor node={node} onChange={onChange} isRoot={true} />
            </div>
        </section>
    );
}
