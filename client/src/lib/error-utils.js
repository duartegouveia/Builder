import { derivative, evaluate } from 'mathjs';

export function calculateUncertainty(type, resolution) {
  if (type === 'analog') return resolution / 2;
  if (type === 'digital') return resolution;
  return resolution;
}

export function computePropagation(expression, variables) {
  try {
    const scope = variables.reduce((acc, v) => ({ ...acc, [v.name]: v.value }), {});

    const resultValue = evaluate(expression, scope);

    let sumSquaredError = 0;
    const steps = [];

    for (const v of variables) {
      const deriv = derivative(expression, v.name);
      const symbolicDeriv = deriv.toString();
      const derivValue = deriv.evaluate(scope);
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
