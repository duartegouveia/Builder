import React, { useState, useEffect } from 'react';
import { Plus, X, ChevronRight, Check, AlertCircle } from 'lucide-react';
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
  'AND': { label: 'AND', min: 0, max: null }, // min 0 effectively means null in the original context (no strict constraint shown, but logic implies >=2 usually, original says null)
  'OR': { label: 'OR', min: 0, max: null },
  'XOR': { label: 'XOR', min: 2, max: 2 },
  'IMP': { label: '⇒', min: 2, max: 2 },
  'BIC': { label: '⇔', min: 2, max: 2 },
  'NOT': { label: 'NOT', min: 1, max: 1 },
  'TEXT': { label: 'Text' },
};

// --- Helper Functions ---

const createNode = (type: NodeType): LogicNode => {
  const config = OPERATOR_CONFIG[type];
  return {
    id: Math.random().toString(36).substr(2, 9),
    type,
    children: type === 'TEXT' ? undefined : [],
    textValue: type === 'TEXT' ? '' : undefined,
    minChildren: config?.min ?? null,
    maxChildren: config?.max ?? null,
  };
};

// --- Components ---

interface NodeEditorProps {
  node: LogicNode;
  onChange: (updated: LogicNode) => void;
  onRemove?: () => void;
  isRoot?: boolean;
}

const NodeEditor: React.FC<NodeEditorProps> = ({ node, onChange, onRemove, isRoot = false }) => {
  
  // -- Handlers for Children --
  
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
    // If switching between operators, try to preserve children if possible, 
    // but enforcing min/max limits might be complex. For now, let's just reset or adapt.
    // The original app creates a NEW builder inside the content area.
    
    const newNode = createNode(newType);
    
    // Optional: Preserve children if moving between compatible operators
    if (node.children && newNode.children) {
        // basic preservation
        newNode.children = [...node.children];
    }
    // If strictly changing structure (e.g. to Text), we lose children.
    
    // Enforce limits immediately? 
    // The original code initializes with min lines.
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

  // -- Render Logic --

  // 1. Empty State (Placeholder)
  if (node.type === 'EMPTY') {
    return (
      <div className="flex items-center gap-3 w-full p-2 border border-dashed border-muted-foreground/30 rounded-md bg-muted/20">
         <Popover>
            <PopoverTrigger asChild>
                <Button variant="secondary" size="sm" className="h-8 w-8 p-0 shrink-0 font-bold bg-muted hover:bg-muted/80 text-muted-foreground">
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
         <span className="text-sm text-muted-foreground italic">Select an operation...</span>
         {onRemove && (
             <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 text-muted-foreground hover:text-destructive" onClick={onRemove}>
                 <X className="h-4 w-4" />
             </Button>
         )}
      </div>
    );
  }

  // 2. Text Node
  if (node.type === 'TEXT') {
      return (
          <div className="flex items-center gap-3 w-full p-2 border rounded-md bg-background shadow-sm">
             <div className="h-8 w-8 flex items-center justify-center bg-blue-100 text-blue-700 rounded font-bold text-xs shrink-0">
                 Tx
             </div>
             <Input 
                value={node.textValue} 
                onChange={(e) => onChange({ ...node, textValue: e.target.value })}
                placeholder="Enter text..."
                className="flex-1 h-9 border-transparent focus:border-input bg-transparent"
             />
             {onRemove && (
                 <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={onRemove}>
                     <X className="h-4 w-4" />
                 </Button>
             )}
          </div>
      );
  }

  // 3. Operator Node (Recursive)
  const config = OPERATOR_CONFIG[node.type];
  const canAdd = node.maxChildren == null || (node.children?.length ?? 0) < node.maxChildren;
  const canRemove = node.minChildren == null || (node.children?.length ?? 0) > node.minChildren;

  return (
    <div className={cn("w-full border rounded-lg overflow-hidden bg-card shadow-sm", isRoot ? "ring-1 ring-border" : "")}>
        <div className="flex">
            {/* Operator Column */}
            <div className="w-12 bg-muted/30 border-r flex flex-col items-center justify-center relative py-4">
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
                                className="border-b last:border-b-0 p-3 hover:bg-muted/5 transition-colors flex gap-3 items-start group"
                            >
                                <div className="flex-1 min-w-0">
                                    <NodeEditor 
                                        node={child} 
                                        onChange={(updated) => updateChild(index, updated)} 
                                        onRemove={() => removeChild(index)}
                                    />
                                </div>
                                {!isRoot && canRemove && (
                                     <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => removeChild(index)}
                                        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Add Button Area */}
                {canAdd && (
                    <div className="p-2 flex justify-center border-t bg-muted/5">
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
        <div className="pt-8 border-t">
             <h2 className="text-xl font-semibold mb-6 text-center text-primary">Dynamic Playground</h2>
             <div className="bg-muted/10 p-6 rounded-xl border border-dashed">
                <NodeEditor node={builders['dynamic']} onChange={(n) => updateBuilder('dynamic', n)} isRoot={true} />
             </div>
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
            <NodeEditor node={node} onChange={onChange} isRoot={true} />
        </section>
    );
}
