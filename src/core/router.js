// Router Engine
export const router = {
  routes: {},
  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  },
  handleRoute() {
    const hash = window.location.hash || '#/home';
    const handler = this.routes[hash] || this.routes['#/home'];
    if (handler) handler();
  }
};
