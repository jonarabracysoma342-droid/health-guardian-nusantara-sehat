// CORE LOGIC GAME (ENTRY POINT & SCENE MANAGER)

import { router } from './core/router.js';
import { gameState } from './core/state.js';
import { initHUD } from './components/hud.js';
import { initModals } from './components/modals.js';

import { renderLoginView } from './views/loginView.js';
import { renderMenuScene } from './scenes/menuScene.js';
import { renderMapView } from './views/mapView.js';
import { renderLabView } from './views/labView.js';
import { renderMinigameView } from './views/minigameView.js';
import { renderReportScene } from './scenes/reportScene.js';
import { renderMateriView } from './views/materiView.js';
import { renderTeacherDashboardView } from './views/teacherDashboardView.js';

export function initGameEngine() {
  const viewContainer = document.getElementById('view-container');
  
  if (!viewContainer) {
    console.error('App view container #view-container not found!');
    return;
  }

  // Register Scenes / Routes
  router.init(viewContainer);
  router.register('login', renderLoginView);
  router.register('home', renderMenuScene);
  router.register('materi', renderMateriView);
  router.register('map', renderMapView);
  router.register('lab', renderLabView);
  router.register('minigame', renderMinigameView);
  router.register('report', renderReportScene);
  router.register('teacher-dashboard', renderTeacherDashboardView);
  router.register('teacherDashboard', renderTeacherDashboardView);

  // Initialize UI Components & Modals
  initHUD();
  initModals();

  // Apply saved font size settings
  if (gameState.data.settings && gameState.data.settings.fontSize) {
    document.body.className = `${gameState.data.settings.fontSize} theme-light`;
  }

  // Navigate to default login scene
  router.navigate('login');
}

// Auto-boot when DOM ready or already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initGameEngine();
  });
} else {
  initGameEngine();
}
