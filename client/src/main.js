import './styles.css';
import { renderExperimentCalc, destroyExperimentCalc } from './pages/experiment-calc.js';
import { renderLogicBuilder, destroyLogicBuilder } from './pages/logic-builder.js';

const routes = {
  '': renderExperimentCalc,
  'logic': renderLogicBuilder
};

const destroyers = {
  '': destroyExperimentCalc,
  'logic': destroyLogicBuilder
};

let currentRoute = null;

function getRouteFromHash() {
  const hash = window.location.hash.slice(1);
  return hash || '';
}

function renderNotFound() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="not-found-page">
      <div class="not-found-card">
        <div class="not-found-icon">!</div>
        <h1>404 Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <a href="#" class="btn btn-primary">Go Home</a>
      </div>
    </div>
  `;
}

function navigate() {
  const route = getRouteFromHash();
  
  if (currentRoute !== null && destroyers[currentRoute]) {
    destroyers[currentRoute]();
  }
  
  currentRoute = route;
  
  const app = document.getElementById('app');
  app.innerHTML = '';
  
  const renderer = routes[route];
  if (renderer) {
    renderer(app);
  } else {
    renderNotFound();
  }
}

window.addEventListener('hashchange', navigate);
window.addEventListener('DOMContentLoaded', navigate);
