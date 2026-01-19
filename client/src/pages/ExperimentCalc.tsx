import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Calculator, FlaskConical, Settings2, Info, ChevronRight, ChevronDown, Network } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Variable, 
  computePropagation, 
  calculateUncertainty, 
  CalculationResult 
} from '@/lib/error-utils';
import { cn } from '@/lib/utils';

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

  // Auto-calculate when inputs change
  useEffect(() => {
    try {
      if (!expression || variables.length === 0) return;
      
      // Validate variable names
      const names = variables.map(v => v.name);
      if (new Set(names).size !== names.length) {
        throw new Error("Variable names must be unique");
      }

      const res = computePropagation(expression, variables);
      setResult(res);
      setError(null);
    } catch (err: any) {
      console.error(err);
      // Only show error if it's not just "typing in progress" (simple heuristic)
      if (expression.length > 0) {
        // setResult(null); // Keep last valid result? Or clear?
        // Let's keep last valid result but show error indicator?
        // Actually, clear result to avoid confusion
        // setResult(null);
        // setError(err.message); 
      }
    }
  }, [variables, expression]);

  const addVariable = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    // Suggest next name: z, a, b...
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
      
      // Auto-update uncertainty if type or resolution changes
      if (field === 'type' || field === 'resolution') {
        if (updated.type !== 'custom') {
          updated.uncertainty = calculateUncertainty(updated.type, updated.resolution);
        }
      }
      
      return updated;
    }));
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <FlaskConical className="w-6 h-6" />
            <span className="font-mono font-bold tracking-tight">LAB.CALC // v1.0</span>
          </div>
          <div className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                    Experimental Error Propagator
                </h1>
                <p className="text-muted-foreground max-w-2xl text-lg mt-1">
                    Define variables, choose equipment type (Analog/Digital), and calculate error propagation instantly.
                </p>
            </div>
            <Link href="/logic">
                <Button variant="outline" className="gap-2 hidden md:flex">
                    <Network className="w-4 h-4" />
                    Logic Builder
                </Button>
            </Link>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Column: Variables */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm ring-1 ring-border">
              <CardHeader className="pb-4 border-b border-border/50 flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Variables</CardTitle>
                  <CardDescription>Define your measured quantities</CardDescription>
                </div>
                <Button onClick={addVariable} size="sm" variant="outline" className="gap-2" data-testid="button-add-variable">
                  <Plus className="w-4 h-4" /> Add Variable
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  <AnimatePresence initial={false}>
                    {variables.map((variable) => (
                      <motion.div
                        key={variable.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 hover:bg-muted/30 transition-colors group"
                      >
                        <div className="flex flex-col gap-4">
                          {/* Top Row: Name, Value, Type */}
                          <div className="grid grid-cols-12 gap-4 items-end">
                            <div className="col-span-2">
                              <Label className="text-xs text-muted-foreground font-mono">Symbol</Label>
                              <Input 
                                value={variable.name} 
                                onChange={(e) => updateVariable(variable.id, 'name', e.target.value)}
                                className="font-mono font-bold bg-background/50 border-transparent focus:border-primary text-center"
                                data-testid={`input-name-${variable.id}`}
                              />
                            </div>
                            <div className="col-span-4">
                              <Label className="text-xs text-muted-foreground font-mono">Value</Label>
                              <Input 
                                type="number"
                                value={variable.value}
                                onChange={(e) => updateVariable(variable.id, 'value', parseFloat(e.target.value) || 0)}
                                className="font-mono bg-background/50"
                                data-testid={`input-value-${variable.id}`}
                              />
                            </div>
                            <div className="col-span-5">
                              <Label className="text-xs text-muted-foreground font-mono">Equipment Type</Label>
                              <Select 
                                value={variable.type} 
                                onValueChange={(v: any) => updateVariable(variable.id, 'type', v)}
                              >
                                <SelectTrigger className="bg-background/50 h-10" data-testid={`select-type-${variable.id}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="analog">Analog (½ div)</SelectItem>
                                  <SelectItem value="digital">Digital (1 div)</SelectItem>
                                  <SelectItem value="custom">Custom</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="col-span-1 flex justify-end">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => removeVariable(variable.id)}
                                className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                disabled={variables.length <= 1}
                                data-testid={`button-remove-${variable.id}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Bottom Row: Resolution & Uncertainty */}
                          <div className="grid grid-cols-12 gap-4 bg-muted/30 p-3 rounded-md items-center">
                            <div className="col-span-5">
                              <Label className="text-xs text-muted-foreground">
                                Resolution / Scale Division
                              </Label>
                              <div className="relative mt-1">
                                <Input 
                                  type="number"
                                  value={variable.resolution}
                                  onChange={(e) => updateVariable(variable.id, 'resolution', parseFloat(e.target.value) || 0)}
                                  className="h-8 font-mono text-sm pr-8"
                                  disabled={variable.type === 'custom'}
                                  data-testid={`input-resolution-${variable.id}`}
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                  unit
                                </span>
                              </div>
                            </div>
                            
                            <div className="col-span-2 flex justify-center">
                              <ChevronRight className="w-4 h-4 text-muted-foreground/50 mt-5" />
                            </div>

                            <div className="col-span-5">
                              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                Uncertainty (σ<sub>{variable.name}</sub>)
                                {variable.type !== 'custom' && (
                                  <Badge variant="secondary" className="text-[10px] h-4 px-1 py-0 font-normal">Auto</Badge>
                                )}
                              </Label>
                              <div className="relative mt-1">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground font-serif italic">±</span>
                                <Input 
                                  type="number"
                                  value={variable.uncertainty}
                                  onChange={(e) => updateVariable(variable.id, 'uncertainty', parseFloat(e.target.value) || 0)}
                                  className={cn(
                                    "h-8 font-mono text-sm pl-6",
                                    variable.type !== 'custom' && "bg-muted/50 text-muted-foreground"
                                  )}
                                  readOnly={variable.type !== 'custom'}
                                  data-testid={`input-uncertainty-${variable.id}`}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Calculation */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-none shadow-lg bg-background ring-1 ring-border sticky top-8">
              <CardHeader>
                <CardTitle>Expression</CardTitle>
                <CardDescription>Enter formula using variables (e.g., x * y^2)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="sr-only">Formula</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono font-bold text-lg">f =</div>
                    <Input 
                      value={expression}
                      onChange={(e) => setExpression(e.target.value)}
                      className="pl-12 py-6 text-lg font-mono bg-muted/20 border-primary/20 focus:border-primary shadow-sm"
                      placeholder="e.g. x * sin(y)"
                      data-testid="input-expression"
                    />
                  </div>
                </div>

                {result ? (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="rounded-xl bg-primary/5 border border-primary/10 p-6 text-center space-y-2">
                      <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Result</div>
                      <div className="text-4xl md:text-5xl font-mono font-bold text-foreground tracking-tighter">
                        {result.value.toPrecision(4)}
                      </div>
                      <div className="flex items-center justify-center gap-2 text-xl md:text-2xl text-muted-foreground font-mono">
                        <span>±</span>
                        <span className="text-destructive">{result.error.toPrecision(2)}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full flex justify-between text-muted-foreground"
                        onClick={() => setShowSteps(!showSteps)}
                        data-testid="button-toggle-steps"
                      >
                        <span className="flex items-center gap-2">
                          <Info className="w-4 h-4" /> Breakdown
                        </span>
                        <ChevronDown className={cn("w-4 h-4 transition-transform", showSteps && "rotate-180")} />
                      </Button>

                      <AnimatePresence>
                        {showSteps && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-3 pt-2">
                              {result.steps.map((step) => (
                                <div key={step.variable} className="text-sm border-l-2 border-muted pl-3 py-1">
                                  <div className="flex justify-between items-baseline">
                                    <span className="font-mono font-bold">∂f/∂{step.variable}</span>
                                    <span className="font-mono text-muted-foreground">= {step.derivativeValue.toPrecision(3)}</span>
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1 font-mono opacity-80">
                                    {step.symbolicDerivative}
                                  </div>
                                  <div className="text-xs text-destructive mt-1">
                                    Contribution: {(step.contribution / Math.pow(result.error, 2) * 100).toFixed(1)}%
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ) : (
                   <div className="h-40 flex items-center justify-center text-muted-foreground text-sm italic bg-muted/10 rounded-xl border border-dashed border-border">
                    {error ? <span className="text-destructive">{error}</span> : "Enter a valid expression..."}
                   </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
