import './styles.css';
import { computePropagation, calculateUncertainty } from './lib/error-utils.js';

const state = {
  variables: [
    { id: '1', name: 'x', value: 10, type: 'analog', resolution: 0.1, uncertainty: 0.05 },
    { id: '2', name: 'y', value: 5, type: 'digital', resolution: 0.01, uncertainty: 0.01 },
  ],
  expression: 'x * y^2',
  result: null,
  showSteps: false
};

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function recalculate() {
  try {
    if (!state.expression || state.variables.length === 0) {
      state.result = null;
      return;
    }
    
    const names = state.variables.map(v => v.name);
    if (new Set(names).size !== names.length) {
      state.result = null;
      return;
    }

    state.result = computePropagation(state.expression, state.variables);
  } catch (err) {
    console.error(err);
    state.result = null;
  }
}

function renderVariables() {
  const container = document.getElementById('variables-container');
  if (!container) return;

  const typeLabels = {
    'analog': 'Analog (1/2 div)',
    'digital': 'Digital (1 div)',
    'custom': 'Custom'
  };

  container.innerHTML = state.variables.map((variable, idx) => `
    <div class="p-4 transition-colors" style="${idx < state.variables.length - 1 ? 'border-bottom: 1px solid var(--border);' : ''}">
      <div class="flex flex-col gap-4">
        <div class="exp-variable-grid">
          <div style="grid-column: span 2;">
            <label class="label text-xs text-muted-foreground font-mono">Symbol</label>
            <input 
              type="text"
              value="${variable.name}" 
              class="input font-mono font-bold text-center"
              style="background-color: rgba(0,0,0,0.02); border-color: transparent; margin-top: 4px;"
              data-id="${variable.id}"
              data-field="name"
              data-testid="input-name-${variable.id}"
            >
          </div>
          <div style="grid-column: span 4;">
            <label class="label text-xs text-muted-foreground font-mono">Value</label>
            <input 
              type="number"
              value="${variable.value}"
              class="input font-mono"
              style="background-color: rgba(0,0,0,0.02); margin-top: 4px;"
              data-id="${variable.id}"
              data-field="value"
              data-testid="input-value-${variable.id}"
            >
          </div>
          <div style="grid-column: span 5;">
            <label class="label text-xs text-muted-foreground font-mono">Equipment Type</label>
            <div style="margin-top: 4px;" class="relative">
              <button class="select-trigger" data-id="${variable.id}" data-testid="select-type-${variable.id}">
                <span>${typeLabels[variable.type]}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.5;"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <div class="select-content" data-select-id="${variable.id}">
                <div class="select-item" data-value="analog">Analog (1/2 div)</div>
                <div class="select-item" data-value="digital">Digital (1 div)</div>
                <div class="select-item" data-value="custom">Custom</div>
              </div>
            </div>
          </div>
          <div style="grid-column: span 1; display: flex; justify-content: flex-end; align-items: flex-end;">
            <button 
              class="btn btn-ghost btn-icon-sm text-muted-foreground"
              data-remove-id="${variable.id}"
              ${state.variables.length <= 1 ? 'disabled' : ''}
              style="${state.variables.length <= 1 ? 'opacity: 0.3;' : ''}"
              data-testid="button-remove-${variable.id}"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
          </div>
        </div>

        <div class="exp-resolution-grid">
          <div style="grid-column: span 5;">
            <label class="label text-xs text-muted-foreground">Resolution / Scale Division</label>
            <div class="relative mt-1">
              <input 
                type="number"
                value="${variable.resolution}"
                class="input font-mono text-sm"
                style="height: 32px; padding-right: 32px;"
                ${variable.type === 'custom' ? 'disabled' : ''}
                data-id="${variable.id}"
                data-field="resolution"
                data-testid="input-resolution-${variable.id}"
              >
              <span class="absolute text-xs text-muted-foreground" style="right: 8px; top: 50%; transform: translateY(-50%);">unit</span>
            </div>
          </div>
          
          <div style="grid-column: span 2; display: flex; justify-content: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--muted-foreground); opacity: 0.5; margin-top: 20px;"><path d="m9 18 6-6-6-6"/></svg>
          </div>

          <div style="grid-column: span 5;">
            <label class="label text-xs text-muted-foreground flex items-center gap-1">
              Uncertainty (s<sub>${variable.name}</sub>)
              ${variable.type !== 'custom' ? '<span class="badge badge-secondary" style="font-size: 10px; height: 16px; padding: 0 4px;">Auto</span>' : ''}
            </label>
            <div class="relative mt-1">
              <span class="absolute text-muted-foreground" style="left: 8px; top: 50%; transform: translateY(-50%); font-style: italic;">+/-</span>
              <input 
                type="number"
                value="${variable.uncertainty}"
                class="input font-mono text-sm"
                style="height: 32px; padding-left: 24px; ${variable.type !== 'custom' ? 'background-color: rgba(0,0,0,0.03); color: var(--muted-foreground);' : ''}"
                ${variable.type !== 'custom' ? 'readonly' : ''}
                data-id="${variable.id}"
                data-field="uncertainty"
                data-testid="input-uncertainty-${variable.id}"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  attachVariableListeners();
}

function renderResult() {
  const container = document.getElementById('result-container');
  if (!container) return;

  if (state.result) {
    container.innerHTML = `
      <div class="space-y-6 animate-fade-in">
        <div class="exp-result-box">
          <div class="text-sm text-muted-foreground uppercase tracking-wider font-medium">Result</div>
          <div class="exp-result-value" data-testid="text-result-value">
            ${state.result.value.toPrecision(4)}
          </div>
          <div class="exp-result-error" data-testid="text-result-error">
            <span>+/-</span>
            <span style="color: var(--error-500);">${state.result.error.toPrecision(2)}</span>
          </div>
        </div>

        <div class="space-y-2">
          <button id="btn-toggle-steps" class="btn btn-ghost w-full" style="justify-content: space-between;" data-testid="button-toggle-steps">
            <span class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              Breakdown
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: ${state.showSteps ? 'rotate(180deg)' : 'rotate(0)'}; transition: transform 0.15s;"><path d="m6 9 6 6 6-6"/></svg>
          </button>

          ${state.showSteps ? `
            <div class="animate-fade-in">
              <div class="space-y-3 pt-2">
                ${state.result.steps.map(step => `
                  <div class="exp-step-item">
                    <div class="flex justify-between items-baseline">
                      <span class="font-mono font-bold">df/d${step.variable}</span>
                      <span class="font-mono text-muted-foreground">= ${step.derivativeValue.toPrecision(3)}</span>
                    </div>
                    <div class="text-xs text-muted-foreground mt-1 font-mono" style="opacity: 0.8;">
                      ${step.symbolicDerivative}
                    </div>
                    <div class="text-xs mt-1" style="color: var(--error-500);">
                      Contribution: ${(step.contribution / Math.pow(state.result.error, 2) * 100).toFixed(1)}%
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    document.getElementById('btn-toggle-steps')?.addEventListener('click', () => {
      state.showSteps = !state.showSteps;
      renderResult();
    });
  } else {
    container.innerHTML = `
      <div class="flex items-center justify-center text-muted-foreground text-sm italic border border-dashed rounded-xl" style="height: 160px; background-color: rgba(0,0,0,0.02);">
        Enter a valid expression...
      </div>
    `;
  }
}

function attachVariableListeners() {
  document.querySelectorAll('[data-field="name"], [data-field="value"]').forEach(input => {
    input.addEventListener('change', (e) => {
      const id = e.target.dataset.id;
      const field = e.target.dataset.field;
      let value = e.target.value;
      if (field === 'value') value = parseFloat(value) || 0;
      updateVariable(id, field, value);
    });
  });

  document.querySelectorAll('[data-field="resolution"]').forEach(input => {
    input.addEventListener('change', (e) => {
      updateVariable(e.target.dataset.id, 'resolution', parseFloat(e.target.value) || 0);
    });
  });

  document.querySelectorAll('[data-field="uncertainty"]').forEach(input => {
    input.addEventListener('change', (e) => {
      updateVariable(e.target.dataset.id, 'uncertainty', parseFloat(e.target.value) || 0);
    });
  });

  document.querySelectorAll('[data-remove-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      removeVariable(btn.dataset.removeId);
    });
  });

  document.querySelectorAll('.select-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const content = document.querySelector(`[data-select-id="${id}"]`);
      document.querySelectorAll('.select-content.show').forEach(c => {
        if (c !== content) c.classList.remove('show');
      });
      content?.classList.toggle('show');
    });
  });

  document.querySelectorAll('.select-item').forEach(item => {
    item.addEventListener('click', () => {
      const content = item.closest('.select-content');
      const id = content?.dataset.selectId;
      if (id) {
        updateVariable(id, 'type', item.dataset.value);
      }
    });
  });
}

function updateVariable(id, field, value) {
  state.variables = state.variables.map(v => {
    if (v.id !== id) return v;
    
    const updated = { ...v, [field]: value };
    
    if (field === 'type' || field === 'resolution') {
      if (updated.type !== 'custom') {
        updated.uncertainty = calculateUncertainty(updated.type, updated.resolution);
      }
    }
    
    return updated;
  });
  
  recalculate();
  renderVariables();
  renderResult();
}

function addVariable() {
  const usedNames = state.variables.map(v => v.name);
  const candidates = ['z', 't', 'm', 'v', 'a', 'b', 'c'];
  const nextName = candidates.find(n => !usedNames.includes(n)) || 'var' + (state.variables.length + 1);

  state.variables.push({
    id: generateId(),
    name: nextName,
    value: 0,
    type: 'analog',
    resolution: 1,
    uncertainty: 0.5
  });
  
  recalculate();
  renderVariables();
  renderResult();
}

function removeVariable(id) {
  state.variables = state.variables.filter(v => v.id !== id);
  recalculate();
  renderVariables();
  renderResult();
}

function init() {
  document.getElementById('btn-add-variable')?.addEventListener('click', addVariable);
  
  document.getElementById('input-expression')?.addEventListener('input', (e) => {
    state.expression = e.target.value;
    recalculate();
    renderResult();
  });
  
  document.addEventListener('click', () => {
    document.querySelectorAll('.select-content.show').forEach(c => {
      c.classList.remove('show');
    });
  });
  
  recalculate();
  renderVariables();
  renderResult();
}

document.addEventListener('DOMContentLoaded', init);
