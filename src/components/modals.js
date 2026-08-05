import { gameState } from '../core/state.js';
import { router } from '../core/router.js';
import { audioEngine } from '../core/audio.js';
import { openHISbotModal } from './hisbot.js';
import { registerGuruAccount, loginGuruAccount, resetGuruPassword } from '../core/firebase.js';

export function updateModalScrollLock() {
  if (typeof document === 'undefined') return;
  const hasOpenModal = !!document.querySelector(
    '.modal-overlay:not(.hidden), .tutorial-modal-overlay:not(.hidden)'
  );
  if (hasOpenModal) {
    if (!document.body.classList.contains('modal-open')) {
      document.body.classList.add('modal-open');
    }
  } else {
    if (document.body.classList.contains('modal-open')) {
      document.body.classList.remove('modal-open');
    }
  }
}
