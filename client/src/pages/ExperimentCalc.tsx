import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, FlaskConical, Info, ChevronRight, ChevronDown, Network } from 'lucide-react';
import { Link } from "wouter";
import { 
  Variable, 
  computePropagation, 
  calculateUncertainty, 
  CalculationResult 
} from '@/lib/error-utils';

// --- Simple Select Component ---

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  'data-testid'?: string;
}

const Select: React.FC<SelectProps> = ({ value, onValueChange, children, 'data-testid': testId }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  const options: { value: string; label: string }[] = [];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement<SelectItemProps>(child) && child.type === SelectItem) {
      options.push({ value: child.props.value, label: child.props.children as string });
    }
  });

  const selectedLabel = options.find(o => o.value === value)?.label || 'Select...';

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
      <button 
        className="select-trigger"
        onClick={() => setOpen(!open)}
        data-testid={testId}
      >
        <span>{selectedLabel}</span>
        <ChevronDown style={{ width: 16, height: 16, opacity: 0.5 }} />
      </button>
      {open && (
        <div className="select-content animate-fade-in" style={{ top: '100%', marginTop: 4, width: '100%' }}>
          {options.map(opt => (
            <div 
              key={opt.value}
              className="select-item"
              onClick={() => { onValueChange(opt.value); setOpen(false); }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SelectItem: React.FC<{ value: string; children: React.ReactNode }> = ({ children }) => {
  return null; // Just for prop extraction
};

// --- Constants ---

const INITIAL_VARIABLES: Variable[] = [
  { id: '1', name: 'x', value: 10, type: 'analog', resolution: 0.1, uncertainty: 0.05 },
  { id: '2', name: 'y', value: 5, type: 'digital', resolution: 0.01, uncertainty: 0.01 },
];

export default function ExperimentCalc() {
  const [variables, setVariables] = useState<Variable[]>(INITIAL_VARIABLES);
  const [expression, setExpression] = useState('x * y^2');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSteps, setShowSteps] = useState(false);

  useEffect(() => {
    try {
      if (!expression || variables.length === 0) return;
      
      const names = variables.map(v => v.name);
      if (new Set(names).size !== names.length) {
        throw new Error("Variable names must be unique");
      }

      const res = computePropagation(expression, variables);
      setResult(res);
      setError(null);
    } catch (err: any) {
      console.error(err);
    }
  }, [variables, expression]);

  const addVariable = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const usedNames = variables.map(v => v.name);
    const candidates = ['z', 't', 'm', 'v', 'a', 'b', 'c'];
    const nextName = candidates.find(n => !usedNames.includes(n)) || 'var' + (variables.length + 1);

    setVariables([...variables, {
      id: newId,
      name: nextName,
      value: 0,
      type: 'analog',
      resolution: 1,
      uncertainty: 0.5
    }]);
  };

  const removeVariable = (id: string) => {
    setVariables(variables.filter(v => v.id !== id));
  };

  const updateVariable = (id: string, field: keyof Variable, value: any) => {
    setVariables(variables.map(v => {
      if (v.id !== id) return v;
      
      const updated = { ...v, [field]: value };
      
      if (field === 'type' || field === 'resolution') {
        if (updated.type !== 'custom') {
          updated.uncertainty = calculateUncertainty(updated.type, updated.resolution);
        }
      }
      
      return updated;
    }));
  };

  return (
    <div className="min-h-screen bg-background p-4" style={{ padding: '1rem' }}>
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="space-y-2">
          <div className="exp-header">
            <FlaskConical style={{ width: 24, height: 24 }} />
            <span className="font-mono font-bold tracking-tight">LAB.CALC // v1.0</span>
          </div>
          <div className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight" style={{ fontSize: '1.875rem' }}>
                    Experimental Error Propagator
                </h1>
                <p className="text-muted-foreground text-lg mt-1" style={{ maxWidth: '42rem' }}>
                    Define variables, choose equipment type (Analog/Digital), and calculate error propagation instantly.
                </p>
            </div>
            <Link href="/logic">
                <button className="btn btn-outline gap-2" style={{ display: 'none' }}>
                    <Network style={{ width: 16, height: 16 }} />
                    Logic Builder
                </button>
            </Link>
            <Link href="/logic">
                <button className="btn btn-outline gap-2">
                    <Network style={{ width: 16, height: 16 }} />
                    Logic Builder
                </button>
            </Link>
          </div>
        </header>

        <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          
          {/* Left Column: Variables */}
          <div className="space-y-6" style={{ gridColumn: 'span 1' }}>
            <div className="card" style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
              <div className="card-header" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 className="card-title" style={{ fontSize: '1.25rem' }}>Variables</h2>
                  <p className="card-description">Define your measured quantities</p>
                </div>
                <button onClick={addVariable} className="btn btn-outline btn-sm gap-2" data-testid="button-add-variable">
                  <Plus style={{ width: 16, height: 16 }} /> Add Variable
                </button>
              </div>
              <div className="card-content" style={{ padding: 0 }}>
                <div>
                  {variables.map((variable, idx) => (
                    <div
                      key={variable.id}
                      className="p-4 transition-colors"
                      style={{ 
                        borderBottom: idx < variables.length - 1 ? '1px solid var(--border)' : 'none',
                      }}
                    >
                      <div className="flex flex-col gap-4">
                        {/* Top Row: Name, Value, Type */}
                        <div className="exp-variable-grid">
                          <div style={{ gridColumn: 'span 2' }}>
                            <label className="label text-xs text-muted-foreground font-mono">Symbol</label>
                            <input 
                              type="text"
                              value={variable.name} 
                              onChange={(e) => updateVariable(variable.id, 'name', e.target.value)}
                              className="input font-mono font-bold text-center"
                              style={{ backgroundColor: 'rgba(0,0,0,0.02)', borderColor: 'transparent', marginTop: 4 }}
                              data-testid={`input-name-${variable.id}`}
                            />
                          </div>
                          <div style={{ gridColumn: 'span 4' }}>
                            <label className="label text-xs text-muted-foreground font-mono">Value</label>
                            <input 
                              type="number"
                              value={variable.value}
                              onChange={(e) => updateVariable(variable.id, 'value', parseFloat(e.target.value) || 0)}
                              className="input font-mono"
                              style={{ backgroundColor: 'rgba(0,0,0,0.02)', marginTop: 4 }}
                              data-testid={`input-value-${variable.id}`}
                            />
                          </div>
                          <div style={{ gridColumn: 'span 5' }}>
                            <label className="label text-xs text-muted-foreground font-mono">Equipment Type</label>
                            <div style={{ marginTop: 4 }}>
                              <Select 
                                value={variable.type} 
                                onValueChange={(v: any) => updateVariable(variable.id, 'type', v)}
                                data-testid={`select-type-${variable.id}`}
                              >
                                <SelectItem value="analog">Analog (½ div)</SelectItem>
                                <SelectItem value="digital">Digital (1 div)</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                              </Select>
                            </div>
                          </div>
                          <div style={{ gridColumn: 'span 1', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                            <button 
                              className="btn btn-ghost btn-icon-sm text-muted-foreground"
                              onClick={() => removeVariable(variable.id)}
                              disabled={variables.length <= 1}
                              style={{ opacity: variables.length <= 1 ? 0.3 : 1 }}
                              data-testid={`button-remove-${variable.id}`}
                            >
                              <Trash2 style={{ width: 16, height: 16 }} />
                            </button>
                          </div>
                        </div>

                        {/* Bottom Row: Resolution & Uncertainty */}
                        <div className="exp-resolution-grid">
                          <div style={{ gridColumn: 'span 5' }}>
                            <label className="label text-xs text-muted-foreground">
                              Resolution / Scale Division
                            </label>
                            <div className="relative mt-1">
                              <input 
                                type="number"
                                value={variable.resolution}
                                onChange={(e) => updateVariable(variable.id, 'resolution', parseFloat(e.target.value) || 0)}
                                className="input font-mono text-sm"
                                style={{ height: 32, paddingRight: 32 }}
                                disabled={variable.type === 'custom'}
                                data-testid={`input-resolution-${variable.id}`}
                              />
                              <span className="absolute text-xs text-muted-foreground" style={{ right: 8, top: '50%', transform: 'translateY(-50%)' }}>
                                unit
                              </span>
                            </div>
                          </div>
                          
                          <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'center' }}>
                            <ChevronRight style={{ width: 16, height: 16, color: 'var(--muted-foreground)', opacity: 0.5, marginTop: 20 }} />
                          </div>

                          <div style={{ gridColumn: 'span 5' }}>
                            <label className="label text-xs text-muted-foreground flex items-center gap-1">
                              Uncertainty (σ<sub>{variable.name}</sub>)
                              {variable.type !== 'custom' && (
                                <span className="badge badge-secondary" style={{ fontSize: 10, height: 16, padding: '0 4px' }}>Auto</span>
                              )}
                            </label>
                            <div className="relative mt-1">
                              <span className="absolute text-muted-foreground" style={{ left: 8, top: '50%', transform: 'translateY(-50%)', fontStyle: 'italic' }}>±</span>
                              <input 
                                type="number"
                                value={variable.uncertainty}
                                onChange={(e) => updateVariable(variable.id, 'uncertainty', parseFloat(e.target.value) || 0)}
                                className="input font-mono text-sm"
                                style={{ 
                                  height: 32, 
                                  paddingLeft: 24,
                                  backgroundColor: variable.type !== 'custom' ? 'rgba(0,0,0,0.03)' : undefined,
                                  color: variable.type !== 'custom' ? 'var(--muted-foreground)' : undefined
                                }}
                                readOnly={variable.type !== 'custom'}
                                data-testid={`input-uncertainty-${variable.id}`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Calculation */}
          <div className="space-y-6" style={{ gridColumn: 'span 1' }}>
            <div className="card sticky" style={{ top: 32, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
              <div className="card-header">
                <h2 className="card-title" style={{ fontSize: '1.25rem' }}>Expression</h2>
                <p className="card-description">Enter formula using variables (e.g., x * y^2)</p>
              </div>
              <div className="card-content space-y-6">
                <div>
                  <label className="sr-only">Formula</label>
                  <div className="relative">
                    <div className="absolute text-muted-foreground font-mono font-bold text-lg" style={{ left: 12, top: '50%', transform: 'translateY(-50%)' }}>f =</div>
                    <input 
                      type="text"
                      value={expression}
                      onChange={(e) => setExpression(e.target.value)}
                      className="input font-mono"
                      style={{ 
                        paddingLeft: 48, 
                        paddingTop: 24, 
                        paddingBottom: 24, 
                        fontSize: '1.125rem',
                        backgroundColor: 'rgba(0,0,0,0.02)',
                        borderColor: 'hsl(221, 83%, 53%, 0.2)'
                      }}
                      placeholder="e.g. x * sin(y)"
                      data-testid="input-expression"
                    />
                  </div>
                </div>

                {result ? (
                  <div className="space-y-6 animate-fade-in">
                    <div className="exp-result-box">
                      <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Result</div>
                      <div className="exp-result-value">
                        {result.value.toPrecision(4)}
                      </div>
                      <div className="exp-result-error">
                        <span>±</span>
                        <span style={{ color: 'var(--destructive)' }}>{result.error.toPrecision(2)}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button 
                        className="btn btn-ghost w-full flex justify-between text-muted-foreground"
                        style={{ justifyContent: 'space-between' }}
                        onClick={() => setShowSteps(!showSteps)}
                        data-testid="button-toggle-steps"
                      >
                        <span className="flex items-center gap-2">
                          <Info style={{ width: 16, height: 16 }} /> Breakdown
                        </span>
                        <ChevronDown style={{ width: 16, height: 16, transform: showSteps ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.15s' }} />
                      </button>

                      {showSteps && (
                        <div className="animate-fade-in">
                          <div className="space-y-3 pt-2">
                            {result.steps.map((step) => (
                              <div key={step.variable} className="exp-step-item">
                                <div className="flex justify-between items-baseline">
                                  <span className="font-mono font-bold">∂f/∂{step.variable}</span>
                                  <span className="font-mono text-muted-foreground">= {step.derivativeValue.toPrecision(3)}</span>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1 font-mono" style={{ opacity: 0.8 }}>
                                  {step.symbolicDerivative}
                                </div>
                                <div className="text-xs mt-1" style={{ color: 'var(--destructive)' }}>
                                  Contribution: {(step.contribution / Math.pow(result.error, 2) * 100).toFixed(1)}%
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                   <div className="flex items-center justify-center text-muted-foreground text-sm italic border border-dashed rounded-xl" style={{ height: 160, backgroundColor: 'rgba(0,0,0,0.02)' }}>
                    {error ? <span style={{ color: 'var(--destructive)' }}>{error}</span> : "Enter a valid expression..."}
                   </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .grid {
            grid-template-columns: 7fr 5fr !important;
          }
        }
      `}</style>
    </div>
  );
}
