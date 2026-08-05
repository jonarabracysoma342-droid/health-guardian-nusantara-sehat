// SPA Router Engine for Health Guardian Nusantara Sehat

class Router {
  constructor() {
    this.routes = {};
    this.container = null;
    this.currentRoute = null;
    this.currentParams = {};
  }

  init(container) {
    if (container) {
      this.container = container;
    }
    window.addEventListener('hashchange', () => this.handleHashChange());
  }

  register(name, handler) {
    this.routes[name] = handler;
  }

  navigate(routeName, params = {}) {
    this.currentRoute = routeName;
    this.currentParams = params;
    
    // Update location hash without triggering hashchange recursion
    const hash = `#/${routeName}`;
    if (window.location.hash !== hash) {
      try {
        window.history.pushState(null, '', hash);
      } catch (e) {
        window.location.hash = hash;
      }
    }

    this.renderCurrent();
  }

  handleHashChange() {
    const rawHash = window.location.hash.replace(/^#\/?/, '') || 'login';
    const routeName = rawHash.split('/')[0] || 'login';
    
    if (this.routes[routeName] && this.currentRoute !== routeName) {
      this.currentRoute = routeName;
      this.renderCurrent();
    }
  }

  renderCurrent() {
    const routeName = this.currentRoute || 'login';
    const handler = this.routes[routeName] || this.routes['login'] || this.routes['home'];

    if (!handler) {
      console.warn(`No handler registered for route: ${routeName}`);
      return;
    }

    if (!this.container) {
      this.container = document.getElementById('view-container');
    }

    if (!this.container) {
      console.error('Router view container not found!');
      return;
    }

    // Clear previous view
    this.container.innerHTML = '';

    try {
      const rendered = handler(this.currentParams);
      if (rendered instanceof HTMLElement) {
        this.container.appendChild(rendered);
      } else if (typeof rendered === 'string') {
        this.container.innerHTML = rendered;
      }
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(`Error rendering route "${routeName}":`, err);
    }
  }
}

export const router = new Router();
