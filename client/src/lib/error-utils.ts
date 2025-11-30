import { derivative, evaluate, parse } from 'mathjs';

export interface Variable {
  id: string;
  name: string;
  value: number;
  type: 'analog' | 'digital' | 'custom';
  resolution: number;
  uncertainty: number;
}

export interface CalculationResult {
  value: number;
  error: number;
  steps: Array<{
    variable: string;
    symbolicDerivative: string;
    derivativeValue: number;
    contribution: number; // (df/dx * sigma_x)^2
  }>;
}

export function calculateUncertainty(type: Variable['type'], resolution: number): number {
  if (type === 'analog') return resolution / 2;
  if (type === 'digital') return resolution;
  return resolution;
}

export function computePropagation(expression: string, variables: Variable[]): CalculationResult {
  try {
    // 1. Create scope for evaluation
    const scope = variables.reduce((acc, v) => ({ ...acc, [v.name]: v.value }), {});

    // 2. Calculate function value
    const resultValue = evaluate(expression, scope);

    // 3. Calculate partial derivatives and error contributions
    let sumSquaredError = 0;
    const steps = [];

    for (const v of variables) {
      // Calculate symbolic derivative
      // Note: mathjs derivative might throw if expression is invalid or not differentiable
      const deriv = derivative(expression, v.name);
      const symbolicDeriv = deriv.toString();

      // Evaluate derivative at the point
      const derivValue = deriv.evaluate(scope);

      // Calculate contribution: (df/dx * sigma_x)^2
      const contribution = Math.pow(derivValue * v.uncertainty, 2);
      
      sumSquaredError += contribution;

      steps.push({
        variable: v.name,
        symbolicDerivative: symbolicDeriv,
        derivativeValue: derivValue,
        contribution: contribution
      });
    }

    const totalError = Math.sqrt(sumSquaredError);

    return {
      value: resultValue,
      error: totalError,
      steps
    };

  } catch (err) {
    console.error("Calculation error:", err);
    throw err;
  }
}
