// CORE LOGIC GAME (ENTRY POINT & SCENE MANAGER)

import { router } from './core/router.js';
import { gameState } from './core/state.js';
import { initHUD } from './components/hud.js';
import { initModals } from './components/modals.js';

import { renderLoginView } from './views/loginView.js';
import { renderMenuScene } from './scenes/menuScene.js';
import { renderMapScene } from './scenes/mapScene.js';
import { renderLabScene } from './scenes/labScene.js';
import { renderMinigameScene } from './scenes/minigameScene.js';
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
  router.register('map', renderMapScene);
  router.register('lab', renderLabScene);
  router.register('minigame', renderMinigameScene);
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

// Auto-boot when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initGameEngine();
});
