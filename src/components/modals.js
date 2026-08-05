import { gameState } from '../core/state.js';
import { router } from '../core/router.js';
import { audioEngine } from '../core/audio.js';
import { openHISbotModal } from './hisbot.js';
import { registerGuruAccount, loginGuruAccount, resetGuruPassword, joinClassWithPasscode } from '../core/firebase.js';

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

export function openModal(modalId) {
  audioEngine.playTap();
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    if (modalId === 'modal-user-type') {
      showRoleSelectorScreen();
    } else if (modalId === 'modal-kuis') {
      initQuizEngine();
    }
    renderModalContent(modalId);
  }
  updateModalScrollLock();
}

if (typeof window !== 'undefined') {
  window.openModal = openModal;
  window.closeModal = closeModal;
  window.openQuizModal = () => openModal('modal-kuis');
}

function showRoleSelectorScreen() {
  const containerRoleSelector = document.getElementById('container-role-selector');
  const formSiswa = document.getElementById('form-siswa-details');
  const formGuru = document.getElementById('form-guru-details');
  const viewResetPass = document.getElementById('view-guru-reset-pass');
  if (containerRoleSelector) {
    containerRoleSelector.style.display = 'block';
    containerRoleSelector.classList.remove('hidden');
  }
  if (formSiswa) {
    formSiswa.style.display = 'none';
    formSiswa.classList.add('hidden');
  }
  if (formGuru) {
    formGuru.style.display = 'none';
    formGuru.classList.add('hidden');
  }
  if (viewResetPass) viewResetPass.classList.add('hidden');
}

function showSiswaFormScreen() {
  const containerRoleSelector = document.getElementById('container-role-selector');
  const formSiswa = document.getElementById('form-siswa-details');
  const formGuru = document.getElementById('form-guru-details');
  if (containerRoleSelector) {
    containerRoleSelector.style.display = 'none';
    containerRoleSelector.classList.add('hidden');
  }
  if (formSiswa) {
    formSiswa.style.display = 'block';
    formSiswa.classList.remove('hidden');
  }
  if (formGuru) {
    formGuru.style.display = 'none';
    formGuru.classList.add('hidden');
  }
}

function showGuruFormScreen() {
  const containerRoleSelector = document.getElementById('container-role-selector');
  const formSiswa = document.getElementById('form-siswa-details');
  const formGuru = document.getElementById('form-guru-details');
  const viewResetPass = document.getElementById('view-guru-reset-pass');
  const viewGuruLoginEl = document.getElementById('view-guru-login');
  const viewGuruRegisterEl = document.getElementById('view-guru-register');
  if (containerRoleSelector) {
    containerRoleSelector.style.display = 'none';
    containerRoleSelector.classList.add('hidden');
  }
  if (formSiswa) {
    formSiswa.style.display = 'none';
    formSiswa.classList.add('hidden');
  }
  if (formGuru) {
    formGuru.style.display = 'block';
    formGuru.classList.remove('hidden');
  }
  if (viewResetPass) viewResetPass.classList.add('hidden');
  if (viewGuruLoginEl) viewGuruLoginEl.classList.remove('hidden');
  if (viewGuruRegisterEl) viewGuruRegisterEl.classList.add('hidden');
}

export function closeModal(modalId) {
  audioEngine.playTap();
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
    if (modalId === 'modal-kuis' && quizTimerInterval) {
      clearInterval(quizTimerInterval);
      quizTimerInterval = null;
    }
  }
  updateModalScrollLock();
}

export function initModals() {
  document.querySelectorAll('.btn-close-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal-overlay, .tutorial-modal-overlay');
      if (modal) {
        modal.classList.add('hidden');
        updateModalScrollLock();
      }
    });
  });

  document.querySelectorAll('.modal-overlay, .tutorial-modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.add('hidden');
        updateModalScrollLock();
      }
    });
  });

  if (typeof document !== 'undefined' && document.body) {
    document.body.addEventListener('touchmove', (e) => {
      if (document.body.classList.contains('modal-open')) {
        const scrollable = e.target.closest('.modal-body, .tutorial-modal-body, .modal-card, .modal-card-body, #hisbot-chat-body');
        if (!scrollable) {
          e.preventDefault();
        }
      }
    }, { passive: false });

    updateModalScrollLock();
  }

  const cardSiswa = document.getElementById('card-mode-siswa');
  const cardGuru = document.getElementById('card-mode-guru');

  const inputSiswaName = document.getElementById('input-siswa-name');
  const inputSiswaClass = document.getElementById('input-siswa-class');
  const inputSiswaSchool = document.getElementById('input-siswa-school');
  const btnSubmitSiswa = document.getElementById('btn-submit-siswa');

  const tabGuruLogin = document.getElementById('tab-guru-login');
  const tabGuruRegister = document.getElementById('tab-guru-register');
  const viewGuruLogin = document.getElementById('view-guru-login');
  const viewGuruRegister = document.getElementById('view-guru-register');
  
  const inputGuruLoginName = document.getElementById('input-guru-login-name');
  const inputGuruLoginPass = document.getElementById('input-guru-login-pass');
  const btnSubmitGuruLogin = document.getElementById('btn-submit-guru-login');

  const inputGuruRegName = document.getElementById('input-guru-reg-name');
  const inputGuruRegSchool = document.getElementById('input-guru-reg-school');
  const inputGuruRegPass = document.getElementById('input-guru-reg-pass');
  const inputGuruRegPassConfirm = document.getElementById('input-guru-reg-pass-confirm');
  const btnSubmitGuruRegister = document.getElementById('btn-submit-guru-register');

  if (cardSiswa) {
    cardSiswa.addEventListener('click', () => {
      showSiswaFormScreen();
      if (inputSiswaName) inputSiswaName.value = gameState.data.player.name || '';
      if (inputSiswaClass) inputSiswaClass.value = gameState.data.player.className || '';
      if (inputSiswaSchool) inputSiswaSchool.value = gameState.data.player.school || '';
    });
  }

  if (cardGuru) {
    cardGuru.addEventListener('click', () => {
      showGuruFormScreen();
    });
  }

  document.querySelectorAll('.btn-back-role').forEach(btn => {
    btn.addEventListener('click', () => {
      showRoleSelectorScreen();
    });
  });

  if (btnSubmitSiswa) {
    btnSubmitSiswa.addEventListener('click', () => {
      const nameVal = inputSiswaName ? inputSiswaName.value.trim() : '';
      const classVal = inputSiswaClass ? inputSiswaClass.value.trim() : '';
      const schoolVal = inputSiswaSchool ? inputSiswaSchool.value.trim() : '';

      if (!nameVal) {
        showToast('Mohon masukkan Nama Lengkap Siswa!', 'warning');
        return;
      }

      const fullClassSchool = [classVal, schoolVal].filter(Boolean).join(' - ');
      gameState.data.player.school = schoolVal;
      gameState.setUserMode('siswa', nameVal, fullClassSchool);

      closeModal('modal-user-type');
      showToast(`Selamat belajar, ${nameVal}! (Mode Siswa Terdaftar) 🎓`);
      router.navigate('home');
    });
  }

  if (tabGuruLogin && tabGuruRegister) {
    tabGuruLogin.addEventListener('click', () => {
      tabGuruLogin.classList.add('active');
      tabGuruRegister.classList.remove('active');
      if (viewGuruLogin) viewGuruLogin.classList.remove('hidden');
      if (viewGuruRegister) viewGuruRegister.classList.add('hidden');
      const viewResetPass = document.getElementById('view-guru-reset-pass');
      if (viewResetPass) viewResetPass.classList.add('hidden');
    });

    tabGuruRegister.addEventListener('click', () => {
      tabGuruRegister.classList.add('active');
      tabGuruLogin.classList.remove('active');
      if (viewGuruRegister) viewGuruRegister.classList.remove('hidden');
      if (viewGuruLogin) viewGuruLogin.classList.add('hidden');
      const viewResetPass = document.getElementById('view-guru-reset-pass');
      if (viewResetPass) viewResetPass.classList.add('hidden');
    });
  }

  if (btnSubmitGuruLogin) {
    btnSubmitGuruLogin.addEventListener('click', async () => {
      const nameVal = inputGuruLoginName ? inputGuruLoginName.value.trim() : '';
      const passVal = inputGuruLoginPass ? inputGuruLoginPass.value.trim() : '';

      if (!nameVal || !passVal) {
        showToast('Mohon masukkan Nama/Username & Password Guru!', 'warning');
        return;
      }

      btnSubmitGuruLogin.disabled = true;
      btnSubmitGuruLogin.textContent = '🔄 Memverifikasi...';

      const res = await loginGuruAccount(nameVal, passVal);

      btnSubmitGuruLogin.disabled = false;
      btnSubmitGuruLogin.textContent = '🔑 Login Mode Guru →';

      if (res.success) {
        const guru = res.guru;
        gameState.data.player.school = guru.school || '';
        gameState.setUserMode('guru', guru.name, guru.school || 'Mode Guru Pengajar');
        closeModal('modal-user-type');
        showToast(`Selamat datang kembali, ${guru.name}! Akses Mode Guru Aktif 👨‍🏫`);
        router.navigate('home');
      } else {
        showToast(res.message, 'error');
      }
    });
  }

  if (btnSubmitGuruRegister) {
    btnSubmitGuruRegister.addEventListener('click', async () => {
      const nameVal = inputGuruRegName ? inputGuruRegName.value.trim() : '';
      const schoolVal = inputGuruRegSchool ? inputGuruRegSchool.value.trim() : '';
      const passVal = inputGuruRegPass ? inputGuruRegPass.value.trim() : '';
      const passConfirmVal = inputGuruRegPassConfirm ? inputGuruRegPassConfirm.value.trim() : '';

      if (!nameVal || !schoolVal || !passVal) {
        showToast('Mohon lengkapi Nama, Sekolah, dan Password Guru!', 'warning');
        return;
      }

      if (passVal.length < 4) {
        showToast('Password minimal 4 karakter!', 'warning');
        return;
      }

      if (passVal !== passConfirmVal) {
        showToast('Konfirmasi password tidak cocok!', 'warning');
        return;
      }

      btnSubmitGuruRegister.disabled = true;
      btnSubmitGuruRegister.textContent = '⏳ Mendaftarkan Akun Guru...';

      const newGuru = await registerGuruAccount({
        name: nameVal,
        school: schoolVal,
        password: passVal
      });

      btnSubmitGuruRegister.disabled = false;
      btnSubmitGuruRegister.textContent = '✨ Registrasi & Buat Akun Guru →';

      gameState.data.player.school = schoolVal;
      gameState.setUserMode('guru', newGuru.name, schoolVal);

      closeModal('modal-user-type');
      showToast(`Akun Guru Berhasil Dibuat! Selamat datang, ${newGuru.name} 👨‍🏫`);
      router.navigate('home');
    });
  }

  const viewGuruResetPass = document.getElementById('view-guru-reset-pass');
  const btnForgotGuruPass = document.getElementById('btn-forgot-guru-pass');
  const btnCancelGuruResetPass = document.getElementById('btn-cancel-guru-reset-pass');
  const btnSubmitGuruResetPass = document.getElementById('btn-submit-guru-reset-pass');

  const inputGuruResetName = document.getElementById('input-guru-reset-name');
  const inputGuruResetSchool = document.getElementById('input-guru-reset-school');
  const inputGuruResetPass = document.getElementById('input-guru-reset-pass');
  const inputGuruResetPassConfirm = document.getElementById('input-guru-reset-pass-confirm');

  if (btnForgotGuruPass && viewGuruResetPass && viewGuruLogin) {
    btnForgotGuruPass.addEventListener('click', () => {
      viewGuruLogin.classList.add('hidden');
      if (viewGuruRegister) viewGuruRegister.classList.add('hidden');
      viewGuruResetPass.classList.remove('hidden');
    });
  }

  if (btnCancelGuruResetPass && viewGuruResetPass && viewGuruLogin) {
    btnCancelGuruResetPass.addEventListener('click', () => {
      viewGuruResetPass.classList.add('hidden');
      viewGuruLogin.classList.remove('hidden');
    });
  }

  if (btnSubmitGuruResetPass) {
    btnSubmitGuruResetPass.addEventListener('click', async () => {
      const nameVal = inputGuruResetName ? inputGuruResetName.value.trim() : '';
      const schoolVal = inputGuruResetSchool ? inputGuruResetSchool.value.trim() : '';
      const passVal = inputGuruResetPass ? inputGuruResetPass.value.trim() : '';
      const passConfirmVal = inputGuruResetPassConfirm ? inputGuruResetPassConfirm.value.trim() : '';

      if (!nameVal || !passVal) {
        showToast('Mohon lengkapi Nama/Username dan Password Baru Guru!', 'warning');
        return;
      }

      if (passVal.length < 4) {
        showToast('Password minimal 4 karakter!', 'warning');
        return;
      }

      if (passVal !== passConfirmVal) {
        showToast('Konfirmasi password baru tidak cocok!', 'warning');
        return;
      }

      btnSubmitGuruResetPass.disabled = true;
      btnSubmitGuruResetPass.textContent = '🔄 Memproses Reset Password...';

      const res = await resetGuruPassword(nameVal, schoolVal, passVal);

      btnSubmitGuruResetPass.disabled = false;
      btnSubmitGuruResetPass.textContent = '🔄 Simpan & Update Password Baru →';

      if (res.success) {
        showToast(res.message, 'success');
        if (viewGuruResetPass) viewGuruResetPass.classList.add('hidden');
        if (viewGuruLogin) viewGuruLogin.classList.remove('hidden');
        if (inputGuruLoginName) inputGuruLoginName.value = nameVal;
        if (inputGuruLoginPass) inputGuruLoginPass.value = passVal;
      } else {
        showToast(res.message, 'error');
      }
    });
  }

  document.querySelectorAll('.menu-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      const action = tile.getAttribute('data-action');
      if (tile.id === 'card-mode-siswa' || tile.id === 'card-mode-guru') return;

      closeModal('modal-menu');

      if (action === 'nav-map') router.navigate('map');
      else if (action === 'nav-lab') router.navigate('lab', { eraId: 1 });
      else if (action === 'nav-minigame') router.navigate('minigame', { eraId: 1 });
      else if (action === 'nav-hisbot') openHISbotModal();
      else if (action === 'nav-lessons') showHistoryInfo('phbs');
      else if (action === 'nav-report') router.navigate('report');
      else if (action === 'nav-teacher-dashboard') router.navigate('teacher-dashboard');
    });
  });

  const sfxToggle = document.getElementById('setting-sound-sfx');
  const fontSelect = document.getElementById('setting-font-size');
  const btnReset = document.getElementById('btn-reset-progress');

  if (sfxToggle) {
    sfxToggle.addEventListener('change', (e) => {
      audioEngine.enabled = e.target.checked;
      gameState.data.settings.sfxEnabled = e.target.checked;
      gameState.saveState();
    });
  }

  if (fontSelect) {
    fontSelect.addEventListener('change', (e) => {
      document.body.className = `${e.target.value} theme-dark`;
      gameState.data.settings.fontSize = e.target.value;
      gameState.saveState();
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (confirm('Apakah Anda yakin ingin mereset seluruh progres game? Data lokal akan terhapus.')) {
        gameState.resetProgress();
        closeModal('modal-settings');
        showToast('Progres game berhasil di-reset! 🔄');
        router.navigate('home');
      }
    });
  }

  const btnStartKuisMandiri = document.getElementById('btn-start-kuis-mandiri');
  if (btnStartKuisMandiri) {
    btnStartKuisMandiri.addEventListener('click', () => {
      closeModal('modal-select-kuis');
      openModal('modal-kuis');
    });
  }

  const btnStartKuisHots = document.getElementById('btn-start-kuis-hots');
  if (btnStartKuisHots) {
    btnStartKuisHots.addEventListener('click', () => {
      closeModal('modal-select-kuis');
      openModal('modal-kuis');
    });
  }

  const tabPortalMandiri = document.getElementById('tab-portal-kuis-mandiri');
  const tabPortalKelas = document.getElementById('tab-portal-kuis-kelas');
  const viewPortalMandiri = document.getElementById('view-portal-kuis-mandiri');
  const viewPortalKelas = document.getElementById('view-portal-kuis-kelas');

  if (tabPortalMandiri && tabPortalKelas && viewPortalMandiri && viewPortalKelas) {
    tabPortalMandiri.addEventListener('click', () => {
      audioEngine.playTap();
      viewPortalMandiri.style.display = 'flex';
      viewPortalKelas.style.display = 'none';

      tabPortalMandiri.style.background = '#0284c7';
      tabPortalMandiri.style.color = '#ffffff';
      tabPortalMandiri.style.borderColor = '#0284c7';

      tabPortalKelas.style.background = '#ffffff';
      tabPortalKelas.style.color = '#64748b';
      tabPortalKelas.style.borderColor = '#cbd5e1';
    });

    tabPortalKelas.addEventListener('click', () => {
      audioEngine.playTap();
      viewPortalMandiri.style.display = 'none';
      viewPortalKelas.style.display = 'flex';

      tabPortalKelas.style.background = '#0284c7';
      tabPortalKelas.style.color = '#ffffff';
      tabPortalKelas.style.borderColor = '#0284c7';

      tabPortalMandiri.style.background = '#ffffff';
      tabPortalMandiri.style.color = '#64748b';
      tabPortalMandiri.style.borderColor = '#cbd5e1';

      renderKuisKelasView();
    });
  }
}

function renderModalContent(modalId) {
  const data = gameState.data;

  if (modalId === 'modal-menu') {
    const tileGuru = document.querySelector('.menu-tile[data-action="nav-teacher-dashboard"]');
    if (tileGuru) {
      tileGuru.style.display = data.player.userType === 'guru' ? 'flex' : 'none';
    }
  } else if (modalId === 'modal-select-kuis') {
    renderKuisKelasView();
  } else if (modalId === 'modal-achievements') {
    const grid = document.getElementById('badge-grid');
    const countEl = document.getElementById('achieve-count');
    const starsEl = document.getElementById('total-stars-count');

    if (grid) {
      grid.innerHTML = data.badges.map(b => `
        <div class="badge-item-card ${b.unlocked ? 'unlocked' : 'locked'}">
          <div class="badge-icon-lg">${b.unlocked ? b.icon : '🔒'}</div>
          <div class="badge-item-title">${b.title}</div>
          <div class="badge-item-desc">${b.desc}</div>
        </div>
      `).join('');
    }

    const unlockedCount = data.badges.filter(b => b.unlocked).length;
    if (countEl) countEl.textContent = `${unlockedCount}/${data.badges.length}`;

    let totalStars = 0;
    Object.values(data.minigameScores).forEach(s => totalStars += s);
    if (starsEl) starsEl.textContent = `⭐ ${totalStars}`;

  } else if (modalId === 'modal-inventory') {
    const grid = document.getElementById('inventory-grid');
    if (grid) {
      if (data.inventory.length === 0) {
        grid.innerHTML = '<p class="text-muted" style="grid-column: 1/-1; text-align: center;">Inventaris masih kosong. Selesaikan eksplorasi era untuk mendapatkan dokumen dan item medis!</p>';
      } else {
        grid.innerHTML = data.inventory.map(item => `
          <div class="inv-card">
            <div class="inv-icon">${item.icon}</div>
            <div class="inv-name">${item.name}</div>
            <div class="inv-era">${item.era}</div>
            <div class="inv-desc" style="font-size:0.75rem; color:#94a3b8; margin-top:4px;">${item.desc}</div>
          </div>
        `).join('');
      }
    }
  } else if (modalId === 'modal-notif') {
    const container = document.getElementById('notif-list-container');
    if (container) {
      container.innerHTML = data.notifications.map(n => `
        <div class="notif-item-card" style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.08); display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-size:0.9rem; font-weight:600;">${n.text}</div>
            <div style="font-size:0.75rem; color:#94a3b8; margin-top:2px;">${n.time}</div>
          </div>
        </div>
      `).join('');
      data.notifications.forEach(n => n.read = true);
      gameState.saveState();
    }
  } else if (modalId === 'modal-join-group') {
    const container = document.getElementById('group-modal-body');
    if (container) {
      const currentGroup = data.player.group || null;

      container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 20px;">
          
          <div style="background: linear-gradient(135deg, #ecfdf5 0%, #e0f2fe 100%); border: 1.5px solid #a7f3d0; border-radius: 20px; padding: 20px; text-align: center;">
            <div style="font-size: 2.5rem; margin-bottom: 6px;">👥</div>
            <h3 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 800; color: #065f46; margin-bottom: 4px;">
              Ruang Kelompok Belajar & Kolaborasi Tim
            </h3>
            <p style="font-size: 0.88rem; color: #047857; max-width: 540px; margin: 0 auto; line-height: 1.45;">
              Gabung dengan kelompok belajar Anda untuk menyelesaikan Misi Sejarah Wabah, kumpulkan Poin Sehat bersama, dan raih posisi teratas di Papan Peringkat Tim!
            </p>
          </div>

          ${currentGroup ? `
            <div style="background: #ffffff; border: 1.5px solid #10b981; border-radius: 18px; padding: 20px; box-shadow: 0 4px 14px rgba(16,185,129,0.12);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span style="font-size: 0.78rem; font-weight: 800; padding: 3px 12px; background: #ecfdf5; color: #059669; border-radius: 99px;">
                  ✅ KELOMPOK AKTIF
                </span>
                <span style="font-size: 0.8rem; font-weight: 700; color: #64748b;">
                  Kode PIN: <code style="background:#f1f5f9; padding:2px 8px; border-radius:6px; font-weight:800; color:#0284c7;">${currentGroup.code}</code>
                </span>
              </div>

              <h4 style="font-family: var(--font-heading); font-size: 1.3rem; font-weight: 800; color: #065f46; margin-bottom: 6px;">
                ${currentGroup.name}
              </h4>
              
              <div style="display: flex; gap: 16px; margin-bottom: 16px; font-size: 0.85rem; font-weight: 700; color: #475569; flex-wrap: wrap;">
                <span>👤 Anggota: <strong style="color:#0284c7;">5 Siswa</strong></span>
                <span>💚 Poin Tim: <strong style="color:#10b981;">${(data.player.points || 100) + 380} Poin Sehat</strong></span>
                <span>⭐ Bintang: <strong style="color:#d97706;">12 Star</strong></span>
              </div>

              <div style="display: flex; gap: 10px;">
                <button id="btn-leave-group" class="btn btn-outline-danger btn-sm" style="border-radius: 99px;">
                  🚪 Keluar Kelompok
                </button>
              </div>
            </div>
          ` : `
            <div style="background: #ffffff; border: 1.5px solid #bae6fd; border-radius: 18px; padding: 20px; box-shadow: var(--shadow-sm);">
              <h4 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: #0369a1; margin-bottom: 12px;">
                🔑 Masukkan Kode Kelas & Kode Sandi:
              </h4>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
                <div>
                  <label style="font-size: 0.8rem; font-weight: 700; color: #334155; display: block; margin-bottom: 4px;">Kode Kelas:</label>
                  <input type="text" id="input-group-code" placeholder="Contoh: SD-502" style="width: 100%; min-height: 44px; font-size: 0.95rem; font-weight: 800; text-transform: uppercase; border-radius: 10px; border: 1.5px solid #0284c7; padding: 0 14px; background: #ffffff; color: #0f172a;">
                </div>
                <div>
                  <label style="font-size: 0.8rem; font-weight: 700; color: #b45309; display: block; margin-bottom: 4px;">🔒 Kode Sandi Kelas:</label>
                  <input type="text" id="input-group-passcode" placeholder="Contoh: 1234" style="width: 100%; min-height: 44px; font-size: 0.95rem; font-weight: 800; border-radius: 10px; border: 1.5px solid #fde68a; padding: 0 14px; background: #fffbeb; color: #b45309;">
                </div>
              </div>

              <button id="btn-submit-join-group" class="btn btn-primary btn-full" style="min-height: 44px; padding: 0 24px; font-weight: 800; border-radius: 12px; background: linear-gradient(135deg, #0284c7, #0369a1); color: #ffffff;">
                🚀 Verifikasi Sandi & Gabung Kelas &rarr;
              </button>
            </div>
          `}

          <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 18px; padding: 20px; margin-top: 18px;">
            <h4 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              🏆 Papan Peringkat Kelompok Teratas (Group Leaderboard)
            </h4>

            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center; background: #fef3c7; border: 1px solid #fde68a; padding: 12px 16px; border-radius: 12px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span style="font-size: 1.3rem;">🥇</span>
                  <div>
                    <div style="font-family: var(--font-heading); font-weight: 800; color: #b45309; font-size: 0.95rem;">
                      Prajurit Sehat STOVIA 01
                    </div>
                    <div style="font-size: 0.75rem; color: #d97706;">5 Anggota Siswa • PIN: KELOMPOK-STOVIA-01</div>
                  </div>
                </div>
                <span style="font-size: 0.95rem; font-weight: 800; color: #b45309;">💚 480 Poin</span>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; background: #f1f5f9; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 12px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span style="font-size: 1.3rem;">🥈</span>
                  <div>
                    <div style="font-family: var(--font-heading); font-weight: 800; color: #475569; font-size: 0.95rem;">
                      Tim Mitigasi Vaksinasi 02
                    </div>
                    <div style="font-size: 0.75rem; color: #64748b;">4 Anggota Siswa • PIN: TIM-VAKSIN-02</div>
                  </div>
                </div>
                <span style="font-size: 0.95rem; font-weight: 800; color: #475569;">💚 420 Poin</span>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; background: #fff7ed; border: 1px solid #ffedd5; padding: 12px 16px; border-radius: 12px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span style="font-size: 1.3rem;">🥉</span>
                  <div>
                    <div style="font-family: var(--font-heading); font-weight: 800; color: #c2410c; font-size: 0.95rem;">
                      Detektif Zoonosis One Health 03
                    </div>
                    <div style="font-size: 0.75rem; color: #ea580c;">4 Anggota Siswa • PIN: ONE-HEALTH-03</div>
                  </div>
                </div>
                <span style="font-size: 0.95rem; font-weight: 800; color: #c2410c;">💚 360 Poin</span>
              </div>
            </div>
          </div>

        </div>
      `;

      const joinBtn = container.querySelector('#btn-submit-join-group');
      const inputCode = container.querySelector('#input-group-code');
      const inputPasscode = container.querySelector('#input-group-passcode');
      const leaveBtn = container.querySelector('#btn-leave-group');

      const processJoin = async (code, pass) => {
        if (!code || !pass) {
          showToast('Mohon isi Kode Kelas dan Kode Sandi Kelas.', 'warning');
          return;
        }

        const res = await joinClassWithPasscode(code, pass, data.player);
        if (res.success) {
          data.player.group = {
            code: code.toUpperCase(),
            name: res.group.name || `Kelompok ${code.toUpperCase()}`
          };
          gameState.saveState();
          showToast(`Berhasil bergabung dengan ${data.player.group.name}! 🎉`, 'success');
          renderModalContent('modal-join-group');
        } else {
          showToast(res.message, 'error');
        }
      };


      if (joinBtn && inputCode) {
        joinBtn.addEventListener('click', () => {
          const valCode = inputCode.value.trim();
          const valPass = inputPasscode ? inputPasscode.value.trim() : '';
          processJoin(valCode, valPass);
        });
      }

      container.querySelectorAll('.chip-group-shortcut').forEach(chip => {
        chip.addEventListener('click', () => {
          const code = chip.getAttribute('data-code');
          const name = chip.getAttribute('data-name');
          processJoin(code, name);
        });
      });

      if (leaveBtn) {
        leaveBtn.addEventListener('click', () => {
          data.player.group = null;
          gameState.saveState();
          showToast('Anda telah keluar dari kelompok.');
          renderModalContent('modal-join-group');
        });
      }
    }
  }
}

export function openLeaderboardModal() {
  let modal = document.getElementById('modal-leaderboard');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-leaderboard';
    modal.className = 'modal-overlay hidden';
    modal.innerHTML = `
      <div class="modal-card glass-panel modal-lg" style="max-height:85vh; display:flex; flex-direction:column;">
        <div class="modal-header" style="background:#e0f2fe; border-bottom:1.5px solid #0284c7;">
          <h3 style="color:#0369a1;"><span class="icon">🏆</span> Klasemen Poin Sehat Penjaga Kesehatan</h3>
          <button class="btn-close-modal" id="btn-close-leaderboard">&times;</button>
        </div>

        <div class="modal-body" style="padding:20px; overflow-y:auto; flex:1;">
          <div style="background:#f0f9ff; border:1px solid #bae6fd; padding:14px; border-radius:12px; margin-bottom:16px; font-size:0.85rem; color:#0369a1;">
            💡 Selesaikan kuis PHBS dan misi mitigasi era untuk menaikkan peringkatmu di Peringkat Klasemen Nasional!
          </div>

          <div style="display:flex; flex-direction:column; gap:10px;" id="leaderboard-rows-container">
          </div>
        </div>
      </div>
    `;
    document.getElementById('app').appendChild(modal);

    const btnClose = modal.querySelector('#btn-close-leaderboard');
    if (btnClose) btnClose.addEventListener('click', () => modal.classList.add('hidden'));
  }

  const container = modal.querySelector('#leaderboard-rows-container');
  const lb = gameState.data.leaderboard || [];

  container.innerHTML = lb.map(item => `
    <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 16px; background:${item.name === gameState.data.player.name ? '#ecfdf5' : '#ffffff'}; border:${item.name === gameState.data.player.name ? '2px solid #10b981' : '1px solid #e2e8f0'}; border-radius:12px; box-shadow:var(--shadow-sm);">
      <div style="display:flex; align-items:center; gap:14px;">
        <div style="font-family:var(--font-heading); font-size:1.2rem; font-weight:800; width:36px; height:36px; border-radius:50%; background:${item.rank === 1 ? '#fef3c7' : item.rank === 2 ? '#e2e8f0' : item.rank === 3 ? '#ffedd5' : '#f1f5f9'}; color:${item.rank === 1 ? '#d97706' : item.rank === 2 ? '#475569' : item.rank === 3 ? '#c2410c' : '#64748b'}; display:flex; align-items:center; justify-content:center;">
          ${item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : item.rank}
        </div>

        <div>
          <div style="font-family:var(--font-heading); font-size:1rem; font-weight:800; color:var(--text-main);">
            ${item.name} ${item.name === gameState.data.player.name ? ' (Kamu)' : ''}
          </div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${item.badge}</div>
        </div>
      </div>

      <div style="font-family:var(--font-heading); font-size:1.1rem; font-weight:800; color:#10b981; display:flex; align-items:center; gap:4px;">
        ⭐ ${item.points.toLocaleString('id-ID')} <span style="font-size:0.75rem; color:#64748b; font-weight:600;">Poin</span>
      </div>
    </div>
  `).join('');

  modal.classList.remove('hidden');
}

export function showHistoryInfo(type) {
  const modalTitle = document.getElementById('history-modal-title');
  const modalBody = document.getElementById('history-modal-body');

  if (type === 'stovia') {
    modalTitle.innerHTML = '<span class="icon">📜</span> Fakta Sejarah STOVIA & Dokter Perintis';
    modalBody.innerHTML = `
      <div class="history-card-content">
        <h4 style="color:#00d2ff; font-size:1.1rem; margin-bottom:8px;">STOVIA (School tot Opleiding van Inlandsche Artsen)</h4>
        <p style="line-height:1.6; color:#e2e8f0; margin-bottom:12px;">
          Ketika wabah Pes dan Cacar melanda Kepulauan Nusantara pada abad ke-19 dan awal abad ke-20, pemerintah kolonial menyadari kebutuhan mendesak akan tenaga medis pribumi. Hal ini mendorong pendirian <strong>Dokter Djawa School</strong> pada tahun 1851 yang kemudian bertransformasi menjadi <strong>STOVIA</strong> di Batavia pada tahun 1902.
        </p>
        <div style="background:rgba(0,210,255,0.1); border-left:4px solid #00d2ff; padding:12px; border-radius:6px; margin-bottom:12px;">
          <strong>Point Kurikulum Merdeka (Sejarah):</strong> Lulusan STOVIA seperti Dr. Soetomo dan Dr. Tjipto Mangoenkoesoemo tidak hanya berjuang menanggulangi wabah penyakit, tetapi juga menjadi perintis pergerakan nasional Indonesia (Budi Utomo 1908).
        </div>
      </div>
    `;
  } else if (type === 'phbs') {
    modalTitle.innerHTML = '<span class="icon">💡</span> Pelajaran dari Wabah: PHBS & Mitigasi Sanitasi';
    modalBody.innerHTML = `
      <div class="history-card-content">
        <h4 style="color:#34d399; font-size:1.1rem; margin-bottom:8px;">Perilaku Hidup Bersih & Sehat (PHBS)</h4>
        <p style="line-height:1.6; color:#e2e8f0; margin-bottom:12px;">
          Setiap wabah besar dalam sejarah Indonesia membawa pembelajaran penting yang memperkuat sistem kesehatan nasional:
        </p>
        <ul style="padding-left:20px; line-height:1.8; color:#cbd5e1;">
          <li><strong>Vaksinasi Massal:</strong> Kunci utama pemutusan rantai penularan (seperti eradikasi cacar & polio).</li>
          <li><strong>Cuci Tangan Pakai Sabun (CTPS):</strong> Tindakan higienis sederhana namun paling efektif membunuh patogen.</li>
          <li><strong>Sistem Triase & Karantina:</strong> Isolasi kasus terkonfirmasi guna melindungi komunitas luas.</li>
          <li><strong>Literasi Kesehatan Digital:</strong> Melawan hoaks dan disinformasi medis demi kesiapsiagaan masa depan.</li>
        </ul>
      </div>
    `;
  }

  openModal('modal-history-info');
}

export function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toastEl = document.createElement('div');
  const icon = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : type === 'success' ? '🎉' : '🔔';
  const bgClass = type === 'error' ? 'toast-danger' : type === 'success' ? 'toast-success' : '';
  
  toastEl.className = `toast ${bgClass}`;
  toastEl.style.cssText = 'pointer-events: auto; font-weight: 700; box-shadow: 0 10px 25px rgba(15,23,42,0.18);';
  toastEl.innerHTML = `<span style="font-size: 1.2rem;">${icon}</span> <span>${message}</span>`;
  
  container.appendChild(toastEl);

  setTimeout(() => {
    toastEl.style.opacity = '0';
    toastEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toastEl.style.transform = 'translateY(-10px)';
    setTimeout(() => toastEl.remove(), 300);
  }, 3500);
}

const quizQuestions = [
  {
    id: 1,
    question: "Bakteri pembawa penyakit Pes pada era kolonial 1911 ditularkan melalui vektor utama yaitu",
    highlightText: "Yersinia pestis",
    options: [
      { key: "A", text: "Kutu Busuk (Cimex lectularius)" },
      { key: "B", text: "Pinjal Tikus (Xenopsylla cheopis)" },
      { key: "C", text: "Nyamuk Anopheles" },
      { key: "D", text: "Lalat Rumah" }
    ],
    correctAnswer: "B",
    tips: "Bakteri Pes melanda Jawa Timur pada tahun 1911 melalui rantai penularan pinjal tikus (Xenopsylla cheopis) pada tikus rumah/kapal."
  },
  {
    id: 2,
    question: "Dokter Bumiputra lulusan STOVIA yang terjun langsung memimpin penanganan wabah Pes di Malang adalah",
    highlightText: "Dokter Tjipto Mangoenkoesoemo",
    options: [
      { key: "A", text: "Dr. Soetomo" },
      { key: "B", text: "Dr. Tjipto Mangoenkoesoemo" },
      { key: "C", text: "Dr. Wahidin Soedirohoesodo" },
      { key: "D", text: "Dr. Christiaan Eijkman" }
    ],
    correctAnswer: "B",
    tips: "Dr. Tjipto Mangoenkoesoemo dikenal sangat pemberani merawat pasien Pes di daerah penyebaran wabah di Malang tanpa ragu."
  },
  {
    id: 3,
    question: "Mengapa perbaikan rumah bambu menjadi strategi utama penanggulangan Pes oleh tim kesehatan STOVIA?",
    highlightText: "Rongga bambu bersarang tikus",
    options: [
      { key: "A", text: "Rumah bambu mudah terbakar" },
      { key: "B", text: "Rongga bambu berpotensi menjadi tempat bersarang tikus rumah" },
      { key: "C", text: "Bambu menyerap air hujan" },
      { key: "D", text: "Bambu mempercepat penularan udara" }
    ],
    correctAnswer: "B",
    tips: "Ujung rongga bambu pada bangunan rumah tradisional yang tidak tertutup rapi menjadi tempat favorit tikus berkembang biak."
  },
  {
    id: 4,
    question: "Strategi utama yang berhasil mengantarkan Indonesia memperoleh sertifikasi bebas Cacar (Smallpox) dari WHO pada 1974 adalah",
    highlightText: "Vaksinasi Massal Cincin (Ring Vaccination)",
    options: [
      { key: "A", text: "Penggunaan Antibiotik Dosis Tinggi" },
      { key: "B", text: "Karantina Total 10 Tahun" },
      { key: "C", text: "Vaksinasi Cincin & Pekan Imunisasi Massal" },
      { key: "D", text: "Pengasapan Kimia (Fogging)" }
    ],
    correctAnswer: "C",
    tips: "Indonesia secara sukses mengisolasi wilayah terjangkit dan menerapkan imunisasi cincin oleh petugas Puskesmas keliling."
  },
  {
    id: 5,
    question: "Pemberian Vaksin Polio Tetes (OPV) melalui program Pekan Imunisasi Nasional (PIN) bertujuan mencegah infeksi pada",
    highlightText: "Sistem Saraf Pusat & Kelumpuhan",
    options: [
      { key: "A", text: "Pernapasan Paru-paru" },
      { key: "B", text: "Sistem Saraf Pusat & Kelumpuhan (Lumpuh Layu)" },
      { key: "C", text: "Pencernaan Lambung" },
      { key: "D", text: "Peredaran Darah" }
    ],
    correctAnswer: "B",
    tips: "Poliovirus menyerang sistem saraf pusat yang dapat menyebabkan kelumpuhan permanen, namun sangat efektif dicegah lewat imunisasi tetes."
  },
  {
    id: 6,
    question: "Penyakit zoonosis yang merebak pada tahun 2005-2008 akibat penularan dari ternak unggas ke manusia disebabkan oleh virus",
    highlightText: "Influenza A Subtipe H5N1",
    options: [
      { key: "A", text: "Virus Dengue (DBD)" },
      { key: "B", text: "Virus H5N1 (Avian Influenza)" },
      { key: "C", text: "Bakteri Vibrio Cholerae" },
      { key: "D", text: "Virus Measles" }
    ],
    correctAnswer: "B",
    tips: "Flu Burung H5N1 adalah infeksi zoonotik yang menular dari unggas terinfeksi ke manusia, memicu lahirnya protokol biosafety pasar hewan."
  },
  {
    id: 7,
    question: "Dalam mitigasi pandemi COVID-19 (2020-2022), istilah strategi 3T merupakan singkatan dari",
    highlightText: "Testing, Tracing, Treatment",
    options: [
      { key: "A", text: "Training, Testing, Tracking" },
      { key: "B", text: "Testing, Tracing, Treatment" },
      { key: "C", text: "Treatment, Triage, Transport" },
      { key: "D", text: "Tracking, Testing, Transfer" }
    ],
    correctAnswer: "B",
    tips: "3T (Testing / Pemeriksaan swab, Tracing / Pelacakan kontak erat, Treatment / Perawatan medis) adalah pilar pencegahan penyebaran virus."
  },
  {
    id: 8,
    question: "Menurut panduan WHO & Kemkes, durasi ideal mencuci tangan memakai sabun dan air mengalir adalah",
    highlightText: "20 hingga 40 detik",
    options: [
      { key: "A", text: "5 detik" },
      { key: "B", text: "20 hingga 40 detik" },
      { key: "C", text: "3 menit" },
      { key: "D", text: "5 menit" }
    ],
    correctAnswer: "B",
    tips: "Mencuci tangan dengan sabun dan air mengalir selama minimal 20-40 detik secara efektif meluruhkan membran lemak protektif virus dan bakteri."
  },
  {
    id: 9,
    question: "Institusi riset sejarah di Bandung yang memproduksi vaksin cacar & polio pertama di Indonesia dan hingga kini menjadi BUMN Farmasi bernama",
    highlightText: "PT Bio Farma (Persero)",
    options: [
      { key: "A", text: "STOVIA Jakarta" },
      { key: "B", text: "PT Bio Farma" },
      { key: "C", text: "Rumah Sakit Cipto Mangunkusumo" },
      { key: "D", text: "Puskesmas Nusantara" }
    ],
    correctAnswer: "B",
    tips: "Bio Farma berawal dari Instituut Pasteur di Bandung (1890) yang bertransformasi menjadi produsen vaksin terkemuka di tingkat dunia."
  },
  {
    id: 10,
    question: "Penerapan budaya PHBS di lingkungan sekolah dan kesiapsiagaan laboratorium genomik bertujuan mewujudkan",
    highlightText: "Ketahanan Kesehatan Nusantara",
    options: [
      { key: "A", text: "Penghentian Seluruh Riset Biologi" },
      { key: "B", text: "Ketahanan Kesehatan Nusantara yang Mandiri & Tangguh" },
      { key: "C", text: "Penutupan Pasar Tradisional" },
      { key: "D", text: "Pengurangan Fasilitas Medis" }
    ],
    correctAnswer: "B",
    tips: "Literasi kesehatan sejak dini membekali generasi muda Indonesia agar siap menghadapi krisis pandemi global di masa depan."
  },
  {
    id: 11,
    question: "Kepanjangan dari nama Sekolah Dokter Bumiputra yang didirikan pada tahun 1902 di Batavia adalah",
    highlightText: "STOVIA",
    options: [
      { key: "A", text: "School tot Opleiding van Inlandsche Artsen" },
      { key: "B", text: "Sekolah Tinggi Obat & Vaksin Indonesia Artsen" },
      { key: "C", text: "Societeit Tot Opleiding Van Inlandsche Artsen" },
      { key: "D", text: "School Tinggi Opleiding Vor Inlandsche Artsen" }
    ],
    correctAnswer: "A",
    tips: "STOVIA (School tot Opleiding van Inlandsche Artsen) didirikan tahun 1902 dan menjadi cikal bakal Fakultas Kedokteran Universitas Indonesia."
  },
  {
    id: 12,
    question: "Penyakit diare akut akibat infeksi saluran pencernaan yang disebabkan oleh air minum tercemar bakteri dinamakan",
    highlightText: "Vibrio cholerae",
    options: [
      { key: "A", text: "Salmonella typhi" },
      { key: "B", text: "Vibrio cholerae (Kolera)" },
      { key: "C", text: "Mycobacterium tuberculosis" },
      { key: "D", text: "Escherichia coli O157" }
    ],
    correctAnswer: "B",
    tips: "Kolera disebabkan oleh bakteri Vibrio cholerae yang menular melalui air minum atau makanan yang terkontaminasi sanitasi buruk."
  },
  {
    id: 13,
    question: "Pendekatan kolaboratif lintas sektor yang mengintegrasikan kesehatan manusia, hewan, dan lingkungan hidup dinamakan",
    highlightText: "One Health System",
    options: [
      { key: "A", text: "Single Health System" },
      { key: "B", text: "One Health System" },
      { key: "C", text: "Eco Health Emergency" },
      { key: "D", text: "Global Medicine Network" }
    ],
    correctAnswer: "B",
    tips: "Konsep One Health menyadari bahwa kesehatan manusia sangat erat berkaitan dengan kesehatan hewan ternak/liar dan kelestarian lingkungan."
  },
  {
    id: 14,
    question: "Berikut ini yang BUKAN merupakan bagian dari protokol kesehatan 5M saat pencegahan lonjakan pandemi COVID-19 adalah",
    highlightText: "Protokol Kesehatan 5M",
    options: [
      { key: "A", text: "Memakai masker dengan benar" },
      { key: "B", text: "Mencuci tangan dengan sabun" },
      { key: "C", text: "Mengkonsumsi antibiotik setiap hari tanpa resep" },
      { key: "D", text: "Menjaga jarak aman minimal 1.5 meter" }
    ],
    correctAnswer: "C",
    tips: "Protokol 5M mencakup Memakai masker, Mencuci tangan, Menjaga jarak, Menjauhi kerumunan, dan Membatasi mobilitas (bukan meminum antibiotik sembarangan)."
  },
  {
    id: 15,
    question: "Fasilitas pelayanan kesehatan primer tingkat pertama di kecamatan yang dibangun pemerintah RI sejak era 1970-an adalah",
    highlightText: "Puskesmas",
    options: [
      { key: "A", text: "Puskesmas (Pusat Kesehatan Masyarakat)" },
      { key: "B", text: "Apotek Nasional" },
      { key: "C", text: "Laboratorium Sentral Bio Farma" },
      { key: "D", text: "Klinik Karantina Pelabuhan" }
    ],
    correctAnswer: "A",
    tips: "Puskesmas merupakan garda terdepan sistem pelayanan kesehatan masyarakat di Indonesia untuk cegah tangkal penyakit di tingkat daerah."
  },
  {
    id: 16,
    question: "Ilmuwan laboratorium Batavia yang meraih Hadiah Nobel atas penemuan vitamin B1 dalam pengobatan penyakit Beri-Beri adalah",
    highlightText: "Dr. Christiaan Eijkman",
    options: [
      { key: "A", text: "Dr. Louis Pasteur" },
      { key: "B", text: "Dr. Christiaan Eijkman" },
      { key: "C", text: "Dr. Alexander Fleming" },
      { key: "D", text: "Dr. Robert Koch" }
    ],
    correctAnswer: "B",
    tips: "Dr. Christiaan Eijkman meneliti beras sosah pada ayam di Batavia dan menemukan hubungan defisiensi vitamin B1 dengan penyakit beri-beri."
  },
  {
    id: 17,
    question: "Langkah pertama yang harus dilakukan dalam prosedur 6 langkah cuci tangan pakai sabun (CTPS) rekomendasi WHO adalah",
    highlightText: "CTPS 6 Langkah WHO",
    options: [
      { key: "A", text: "Menggosok sela-sela jari tangan" },
      { key: "B", text: "Menggosok kedua telapak tangan dengan sabun" },
      { key: "C", text: "Menggosok ibu jari tangan kanan dan kiri" },
      { key: "D", text: "Membilas langsung dengan air tanpa sabun" }
    ],
    correctAnswer: "B",
    tips: "Langkah pertama CTPS diawali dengan meratakan sabun pada kedua telapak tangan yang telah dibasahi air bersih."
  },
  {
    id: 18,
    question: "Penggunaan cairan antiseptik atau hand sanitizer pada kulit berguna untuk membunuh patogen karena kandungan utamanya berupa",
    highlightText: "Alkohol 70%",
    options: [
      { key: "A", text: "Air Garam Pekat" },
      { key: "B", text: "Alkohol minimal 60-70%" },
      { key: "C", text: "Minyak Kelapa Murni" },
      { key: "D", text: "Glukosa Cair" }
    ],
    correctAnswer: "B",
    tips: "Kandungan alkohol 60-70% mampu melembekkan dan merusak dinding sel bakteri serta selubung lipid virus secara efektif."
  },
  {
    id: 19,
    question: "Mengapa isolasi mandiri (Isoman) sangat penting diterapkan bagi seseorang yang mengidap gejala infeksi penyakit menular?",
    highlightText: "Memutus Rantai Penularan Komunitas",
    options: [
      { key: "A", text: "Agar tidak perlu belajar lagi" },
      { key: "B", text: "Memutus rantai penularan patogen ke keluarga dan masyarakat luas" },
      { key: "C", text: "Untuk menghabiskan persediaan obat" },
      { key: "D", text: "Menghindari udara segar di luar rumah" }
    ],
    correctAnswer: "B",
    tips: "Isolasi mandiri membatasi kontak fisik langsung sehingga patogen tidak dapat berpindah menyebar ke anggota kelompok atau masyarakat."
  },
  {
    id: 20,
    question: "Sikap utama Profil Pelajar Pancasila yang ditunjukkan siswa saat bekerja sama mempraktikkan kebersihan lingkungan sekolah adalah",
    highlightText: "Gotong Royong & Mandiri",
    options: [
      { key: "A", text: "Individualis dan Acuh" },
      { key: "B", text: "Bernalar Kritis, Mandiri, & Gotong Royong" },
      { key: "C", text: "Bergantung sepenuhnya pada orang lain" },
      { key: "D", text: "Menunggu instruksi tanpa inisiatif" }
    ],
    correctAnswer: "B",
    tips: "Gotong royong dan bernalar kritis adalah pilar penting Kurikulum Merdeka dalam membangun kepedulian terhadap kesehatan lingkungan."
  }
];

let currentQuizIndex = 0;
let userAnswers = {};
let quizTimerSeconds = 1200;
let quizTimerInterval = null;

export function initQuizEngine() {
  currentQuizIndex = 0;
  userAnswers = {};
  quizTimerSeconds = 1200;

  const modalCard = document.querySelector('#modal-kuis .modal-card');
  if (modalCard) {
    modalCard.innerHTML = `
        <div style="background: #ffffff; padding: 18px 24px; border-bottom: 1.5px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 0.78rem; font-weight: 700; color: #0284c7; display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">
              <span>Kuis</span> &rsaquo; <span style="font-weight: 800; color: #0369a1;">Evaluasi Kompetensi Health Defender</span>
            </div>
            <h3 id="quiz-title-display" style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 800; color: #0f172a; margin: 0;">
              Kuis Evaluasi Utama: PHBS & Sejarah Kesehatan
            </h3>
            <p style="font-size: 0.82rem; color: #64748b; margin: 2px 0 0 0;">
              Jawab 20 soal evaluasi berikut. Pembahasan & kunci jawaban lengkap akan ditampilkan setelah kuis dikirim.
            </p>
          </div>
          
          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 16px; padding: 10px 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); min-width: 220px;">
              <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 800; margin-bottom: 6px;">
                <span style="color: #00288e;">Kemajuan</span>
                <span id="quiz-progress-text" style="color: #475569;">Pertanyaan 1 dari 20</span>
              </div>
              <div style="width: 100%; height: 8px; background: #e2e8f0; border-radius: 99px; overflow: hidden;">
                <div id="quiz-progress-bar" style="width: 5%; height: 100%; background: linear-gradient(90deg, #0284c7, #00288e); border-radius: 99px; transition: width 0.3s ease;"></div>
              </div>
            </div>
            
            <button class="btn-close-modal" style="background: #f1f5f9; border: none; font-size: 1.4rem; color: #64748b; width: 38px; height: 38px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">&times;</button>
          </div>
        </div>

        <div style="padding: 24px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 20px;">
          <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 20px; padding: 24px; box-shadow: 0 4px 16px rgba(15,23,42,0.04);">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
              <div style="width: 36px; height: 36px; border-radius: 10px; background: #00288e; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem;">
                📝
              </div>
              <span id="quiz-question-number" style="font-size: 0.82rem; font-weight: 800; color: #64748b; letter-spacing: 0.8px; text-transform: uppercase;">
                SOAL NOMOR 1
              </span>
            </div>

            <div id="quiz-question-container" style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; color: #0f172a; line-height: 1.5; margin-bottom: 24px;">
            </div>

            <div id="quiz-options-container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 24px;">
            </div>

            <div style="border-top: 1px solid #f1f5f9; padding-top: 20px;">
              <div style="text-align: center; font-size: 0.72rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
                NAVIGASI SOAL
              </div>
              <div id="quiz-nav-buttons" style="display: flex; justify-content: center; align-items: center; gap: 8px; flex-wrap: wrap;">
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 18px; width: 100%; gap: 12px;">
              <button id="btn-quiz-prev" class="btn btn-outline" style="border-radius: 12px; padding: 10px 22px; font-weight: 700; border-color: #00288e; color: #00288e; background: #ffffff; white-space: nowrap; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; gap: 6px;">
                &larr; Sebelumnya
              </button>

              <div id="quiz-dot-indicators" style="display: flex; gap: 6px; align-items: center; overflow-x: auto; max-width: 50%;">
              </div>

              <button id="btn-quiz-next" class="btn btn-primary" style="border-radius: 12px; padding: 10px 24px; font-weight: 800; background: #00288e; color: #ffffff; box-shadow: 0 4px 12px rgba(0,40,142,0.3); white-space: nowrap; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; gap: 6px;">
                Selanjutnya &rarr;
              </button>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 300px; gap: 16px;">
            <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 18px; padding: 16px 20px; display: flex; gap: 16px; align-items: center;">
              <div style="width: 54px; height: 54px; border-radius: 14px; background: linear-gradient(135deg, #e0f2fe, #bae6fd); display: flex; align-items: center; justify-content: center; font-size: 1.7rem; flex-shrink: 0; border: 1px solid #7dd3fc;">
                💡
              </div>
              <div>
                <h5 style="font-family: var(--font-heading); font-size: 0.95rem; font-weight: 800; color: #0369a1; margin: 0 0 4px 0;">
                  Status Jawaban
                </h5>
                <p id="quiz-tips-text" style="font-size: 0.83rem; color: #475569; margin: 0; line-height: 1.45;">
                  Pilih salah satu jawaban di atas untuk mengumpulkannya.
                </p>
              </div>
            </div>

            <div style="background: linear-gradient(135deg, #00288e, #0369a1); border-radius: 18px; padding: 16px 20px; color: #ffffff; display: flex; align-items: center; gap: 16px; box-shadow: 0 6px 18px rgba(0,40,142,0.25);">
              <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; flex-shrink: 0;">
                ⏱️
              </div>
              <div>
                <div style="font-size: 0.72rem; font-weight: 700; color: #93c5fd; text-transform: uppercase; letter-spacing: 0.5px;">
                  Sisa Waktu
                </div>
                <div id="quiz-timer-display" style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: #ffffff; letter-spacing: 1px;">
                  20:00
                </div>
              </div>
            </div>
          </div>
        </div>
    `;

    const closeBtnTop = modalCard.querySelector('.btn-close-modal');
    if (closeBtnTop) {
      closeBtnTop.onclick = () => closeModal('modal-kuis');
    }
  }

  if (quizTimerInterval) clearInterval(quizTimerInterval);
  quizTimerInterval = setInterval(() => {
    quizTimerSeconds--;
    const min = Math.floor(quizTimerSeconds / 60);
    const sec = quizTimerSeconds % 60;
    const timerEl = document.getElementById('quiz-timer-display');
    if (timerEl) {
      timerEl.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    }
    if (quizTimerSeconds <= 0) {
      clearInterval(quizTimerInterval);
      finishQuiz();
    }
  }, 1000);

  renderQuizQuestion();

  const btnPrev = document.getElementById('btn-quiz-prev');
  const btnNext = document.getElementById('btn-quiz-next');

  if (btnPrev) {
    btnPrev.onclick = () => {
      audioEngine.playTap();
      if (currentQuizIndex > 0) {
        currentQuizIndex--;
        renderQuizQuestion();
      }
    };
  }

  if (btnNext) {
    btnNext.onclick = () => {
      audioEngine.playTap();
      if (currentQuizIndex < quizQuestions.length - 1) {
        currentQuizIndex++;
        renderQuizQuestion();
      } else {
        finishQuiz();
      }
    };
  }
}

function renderQuizQuestion() {
  const q = quizQuestions[currentQuizIndex];
  if (!q) return;

  const questionNumEl = document.getElementById('quiz-question-number');
  const progressTextEl = document.getElementById('quiz-progress-text');
  const progressBarEl = document.getElementById('quiz-progress-bar');
  const containerEl = document.getElementById('quiz-question-container');
  const optionsEl = document.getElementById('quiz-options-container');
  const navBtnsEl = document.getElementById('quiz-nav-buttons');
  const dotsEl = document.getElementById('quiz-dot-indicators');
  const tipsEl = document.getElementById('quiz-tips-text');
  const btnNext = document.getElementById('btn-quiz-next');
  const btnPrev = document.getElementById('btn-quiz-prev');

  if (questionNumEl) questionNumEl.textContent = `SOAL NOMOR ${currentQuizIndex + 1}`;
  if (progressTextEl) progressTextEl.textContent = `Pertanyaan ${currentQuizIndex + 1} dari ${quizQuestions.length}`;
  if (progressBarEl) progressBarEl.style.width = `${((currentQuizIndex + 1) / quizQuestions.length) * 100}%`;

  if (containerEl) {
    containerEl.innerHTML = `${q.question} <span style="background: #e0f2fe; color: #00288e; padding: 4px 12px; border-radius: 8px; font-weight: 800; border: 1px solid #bae6fd; display: inline-block; margin-left: 4px;">${q.highlightText}</span> ?`;
  }

  if (optionsEl) {
    const selectedKey = userAnswers[currentQuizIndex];
    optionsEl.innerHTML = q.options.map(opt => {
      const isSelected = selectedKey === opt.key;
      return `
        <div class="quiz-option-card" data-key="${opt.key}" style="background: ${isSelected ? '#00288e' : '#ffffff'}; color: ${isSelected ? '#ffffff' : '#0f172a'}; border: 2px solid ${isSelected ? '#00288e' : '#e2e8f0'}; border-radius: 16px; padding: 18px 20px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; transition: all 0.2s ease; box-shadow: ${isSelected ? '0 6px 18px rgba(0,40,142,0.25)' : '0 2px 6px rgba(0,0,0,0.02)'}; font-weight: 700;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 34px; height: 34px; border-radius: 50%; background: ${isSelected ? '#ffffff' : '#f1f5f9'}; color: ${isSelected ? '#00288e' : '#475569'}; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; flex-shrink: 0;">
              ${opt.key}
            </div>
            <span style="font-size: 1rem; font-family: var(--font-heading);">${opt.text}</span>
          </div>
          ${isSelected ? '<span style="background: #ffffff; color: #00288e; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 800;">✓</span>' : ''}
        </div>
      `;
    }).join('');

    optionsEl.querySelectorAll('.quiz-option-card').forEach(card => {
      card.addEventListener('click', () => {
        audioEngine.playTap();
        const key = card.getAttribute('data-key');
        userAnswers[currentQuizIndex] = key;
        renderQuizQuestion();
      });
    });
  }

  if (navBtnsEl) {
    navBtnsEl.innerHTML = quizQuestions.map((item, idx) => {
      const isAnswered = userAnswers[idx] !== undefined;
      const isActive = idx === currentQuizIndex;
      return `
        <button class="btn-quiz-nav-num" data-idx="${idx}" style="width: 38px; height: 38px; border-radius: 10px; border: ${isActive ? '2px solid #00288e' : isAnswered ? '1.5px solid #00288e' : '1.5px solid #cbd5e1'}; background: ${isActive ? '#00288e' : isAnswered ? '#e0f2fe' : '#ffffff'}; color: ${isActive ? '#ffffff' : isAnswered ? '#00288e' : '#64748b'}; font-weight: 800; font-size: 0.88rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;">
          ${isAnswered && !isActive ? '✓' : idx + 1}
        </button>
      `;
    }).join('');

    navBtnsEl.querySelectorAll('.btn-quiz-nav-num').forEach(btn => {
      btn.addEventListener('click', () => {
        audioEngine.playTap();
        currentQuizIndex = parseInt(btn.getAttribute('data-idx'));
        renderQuizQuestion();
      });
    });
  }

  if (dotsEl) {
    dotsEl.innerHTML = quizQuestions.map((_, idx) => `
      <div style="width: ${idx === currentQuizIndex ? '20px' : '8px'}; height: 8px; border-radius: 99px; background: ${idx === currentQuizIndex ? '#00288e' : '#cbd5e1'}; transition: all 0.3s ease;"></div>
    `).join('');
  }

  if (tipsEl) {
    const selectedKey = userAnswers[currentQuizIndex];
    if (selectedKey) {
      tipsEl.innerHTML = `
        <strong style="color: #0284c7;">📌 Jawaban Tersimpan: Pilihan ${selectedKey}</strong><br>
        <span style="font-size: 0.8rem; color: #64748b;">Pilihan Anda tersimpan. Pembahasan & kunci jawaban akan muncul setelah menekan Kirim Kuis.</span>
      `;
    } else {
      tipsEl.textContent = 'Pilih salah satu opsi jawaban di atas untuk menjawab pertanyaan ini.';
    }
  }

  if (btnPrev) {
    btnPrev.style.visibility = currentQuizIndex === 0 ? 'hidden' : 'visible';
  }

  if (btnNext) {
    const answeredCount = Object.keys(userAnswers).length;
    if (currentQuizIndex === quizQuestions.length - 1) {
      btnNext.textContent = `Kirim & Lihat Hasil (${answeredCount}/${quizQuestions.length}) 🚀`;
      btnNext.style.background = '#10b981';
    } else {
      btnNext.textContent = 'Selanjutnya →';
      btnNext.style.background = '#00288e';
    }
  }
}

function finishQuiz() {
  if (quizTimerInterval) {
    clearInterval(quizTimerInterval);
    quizTimerInterval = null;
  }

  let correctCount = 0;
  quizQuestions.forEach((q, idx) => {
    if (userAnswers[idx] === q.correctAnswer) {
      correctCount++;
    }
  });

  const bonusPoints = correctCount * 20;
  let starsCount = 1;
  if (correctCount >= 16) starsCount = 3;
  else if (correctCount >= 10) starsCount = 2;

  if (!gameState.data.player.points) gameState.data.player.points = 100;
  gameState.data.player.points += bonusPoints;

  if (!gameState.data.minigameScores) gameState.data.minigameScores = {};
  gameState.data.minigameScores['kuis_phbs'] = starsCount;
  gameState.saveState();

  showToast(`Kuis Selesai! Skor: ${correctCount}/${quizQuestions.length} Benar (+${bonusPoints} Poin Sehat 💚, ⭐ ${starsCount} Bintang)`, 'success');

  const modalCard = document.querySelector('#modal-kuis .modal-card');
  if (!modalCard) return;

  const percentage = Math.round((correctCount / quizQuestions.length) * 100);
  const gradeText = percentage >= 80 ? '🎉 Luar Biasa! Sangat Memahami Materi' : percentage >= 50 ? '👍 Cukup Baik! Terus Tingkatkan Pemahaman' : '💪 Perlu Lebih Banyak Belajar Materi';

  modalCard.innerHTML = `
    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 24px; color: #ffffff; display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid #334155; position: relative;">
      <div>
        <div style="font-size: 0.78rem; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px;">
          HASIL EVALUASI & PEMBAHASAN SOAL (GOOGLE FORMS MODE)
        </div>
        <h3 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 800; margin: 0; color: #ffffff;">
          📊 Laporan Jawaban & Pembahasan Kuis
        </h3>
        <p style="font-size: 0.85rem; color: #94a3b8; margin: 4px 0 0 0;">
          ${gradeText}
        </p>
      </div>
      <button class="btn-close-modal" style="background: rgba(255,255,255,0.12); border: none; font-size: 1.4rem; color: #ffffff; width: 38px; height: 38px; border-radius: 50%; cursor: pointer; position: absolute; top: 18px; right: 18px;">&times;</button>
    </div>

    <div style="background: #ffffff; padding: 18px 24px; border-bottom: 1.5px solid #e2e8f0; display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 14px;">
      <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; padding: 12px 16px; border-radius: 14px; text-align: center;">
        <div style="font-size: 0.75rem; font-weight: 800; color: #166534; text-transform: uppercase;">Skor Akhir</div>
        <div style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 900; color: #15803d; margin-top: 2px;">
          ${correctCount} / ${quizQuestions.length} <span style="font-size: 0.9rem; font-weight: 700;">(${percentage}%)</span>
        </div>
      </div>

      <div style="background: #f0f9ff; border: 1.5px solid #bae6fd; padding: 12px 16px; border-radius: 14px; text-align: center;">
        <div style="font-size: 0.75rem; font-weight: 800; color: #0369a1; text-transform: uppercase;">Poin Sehat Diperoleh</div>
        <div style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 900; color: #0284c7; margin-top: 2px;">
          +${bonusPoints} Poin 💚
        </div>
      </div>

      <div style="background: #fffbeb; border: 1.5px solid #fde68a; padding: 12px 16px; border-radius: 14px; text-align: center;">
        <div style="font-size: 0.75rem; font-weight: 800; color: #b45309; text-transform: uppercase;">Lencana Bintang</div>
        <div style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 900; color: #d97706; margin-top: 2px;">
          ⭐ ${starsCount} Bintang
        </div>
      </div>
    </div>

    <div style="padding: 24px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 16px; background: #f8fafc;">
      <div style="font-size: 0.88rem; font-weight: 800; color: #334155; margin-bottom: 4px; display: flex; align-items: center; justify-content: space-between;">
        <span>📝 Ringkasan Jawaban & Pembahasan Lengkap (${quizQuestions.length} Soal):</span>
        <span style="font-size: 0.78rem; font-weight: 700; color: #64748b;">Periksa kunci jawaban & tips di bawah ini</span>
      </div>

      ${quizQuestions.map((q, idx) => {
        const userAnsKey = userAnswers[idx];
        const isCorrect = userAnsKey === q.correctAnswer;
        const userAnsOpt = q.options.find(o => o.key === userAnsKey);
        const correctAnsOpt = q.options.find(o => o.key === q.correctAnswer);

        return `
          <div style="background: #ffffff; border: 1.5px solid ${isCorrect ? '#a7f3d0' : userAnsKey ? '#fca5a5' : '#fed7aa'}; border-radius: 18px; padding: 18px 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.03); display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 0.8rem; font-weight: 800; background: #f1f5f9; color: #475569; padding: 4px 10px; border-radius: 8px;">
                  Soal ${idx + 1}
                </span>
                <span style="font-size: 0.75rem; font-weight: 800; padding: 4px 12px; border-radius: 99px; background: ${isCorrect ? '#ecfdf5' : userAnsKey ? '#fef2f2' : '#fff7ed'}; color: ${isCorrect ? '#059669' : userAnsKey ? '#dc2626' : '#ea580c'}; border: 1px solid ${isCorrect ? '#6ee7b7' : userAnsKey ? '#fca5a5' : '#fdba74'};">
                  ${isCorrect ? '✅ BENAR (+20 Poin)' : userAnsKey ? '❌ BELUM TEPAT' : '⚠️ TIDAK DIJAWAB'}
                </span>
              </div>
            </div>

            <div style="font-family: var(--font-heading); font-size: 1rem; font-weight: 700; color: #0f172a; line-height: 1.45;">
              ${q.question} <strong style="color: #0284c7;">${q.highlightText}</strong>?
            </div>

            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.88rem; background: #f8fafc; padding: 12px 14px; border-radius: 12px; border: 1px solid #e2e8f0;">
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <span style="font-weight: 800; color: #475569; min-width: 120px;">Jawaban Anda:</span>
                <span style="font-weight: 800; color: ${isCorrect ? '#059669' : '#dc2626'};">
                  ${userAnsOpt ? `[${userAnsOpt.key}] ${userAnsOpt.text}` : '--- Tidak dijawab ---'}
                </span>
              </div>

              ${!isCorrect ? `
                <div style="display: flex; align-items: center; gap: 8px; border-top: 1px dashed #cbd5e1; padding-top: 6px; flex-wrap: wrap;">
                  <span style="font-weight: 800; color: #059669; min-width: 120px;">Kunci Jawaban:</span>
                  <span style="font-weight: 800; color: #059669;">
                    [${correctAnsOpt.key}] ${correctAnsOpt.text}
                  </span>
                </div>
              ` : ''}
            </div>

            <div style="background: #f0f9ff; border-left: 4px solid #0284c7; padding: 10px 14px; border-radius: 6px 10px 10px 6px; font-size: 0.83rem; color: #0369a1; line-height: 1.45;">
              💡 <strong>Pembahasan:</strong> ${q.tips}
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <div style="background: #ffffff; padding: 16px 24px; border-top: 1.5px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap;">
      <button id="btn-quiz-retry" class="btn btn-outline" style="padding: 10px 20px; border-radius: 12px; font-weight: 800; border-color: #0284c7; color: #0284c7;">
        🔄 Coba Ulangi Kuis
      </button>

      <button id="btn-quiz-close-result" class="btn btn-primary" style="padding: 10px 24px; border-radius: 12px; font-weight: 800; background: linear-gradient(135deg, #0284c7, #00288e); color: #ffffff;">
        ✅ Selesai & Simpan Evaluasi →
      </button>
    </div>
  `;

  const btnCloseResult = modalCard.querySelector('#btn-quiz-close-result');
  const btnCloseTop = modalCard.querySelector('.btn-close-modal');
  const btnRetry = modalCard.querySelector('#btn-quiz-retry');

  if (btnCloseResult) {
    btnCloseResult.onclick = () => {
      audioEngine.playTap();
      closeModal('modal-kuis');
    };
  }

  if (btnCloseTop) {
    btnCloseTop.onclick = () => {
      audioEngine.playTap();
      closeModal('modal-kuis');
    };
  }

  if (btnRetry) {
    btnRetry.onclick = () => {
      audioEngine.playTap();
      initQuizEngine();
    };
  }
}

function renderKuisKelasView() {
  const container = document.getElementById('container-kuis-kelas-list');
  if (!container) return;

  const currentGroup = gameState.data.player.group || null;

  if (!currentGroup) {
    container.innerHTML = `
      <div style="background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); border: 1.5px solid #fed7aa; border-radius: 20px; padding: 24px; text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 8px;">🔒</div>
        <h4 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: #9a3412; margin: 0 0 6px 0;">
          Belum Bergabung dengan Kelas Guru
        </h4>
        <p style="font-size: 0.88rem; color: #c2410c; max-width: 560px; margin: 0 auto 18px auto; line-height: 1.5;">
          Fitur <strong>Kuis Kelas</strong> hanya dapat diakses setelah Anda bergabung ke ruang kelas kelompok dengan Kode PIN & Sandi yang diberikan oleh Gurumu!
        </p>
        <button id="btn-portal-join-group" class="btn btn-primary" style="padding: 12px 24px; border-radius: 14px; font-weight: 800; background: linear-gradient(135deg, #ea580c, #c2410c); color: #ffffff; box-shadow: 0 4px 14px rgba(234,88,12,0.3);">
          🔑 Gabung Kelompok & Masukkan Kode Sandi Kelas &rarr;
        </button>
      </div>
    `;

    const btnJoin = container.querySelector('#btn-portal-join-group');
    if (btnJoin) {
      btnJoin.onclick = () => {
        audioEngine.playTap();
        closeModal('modal-select-kuis');
        openModal('modal-join-group');
      };
    }
  } else {
    container.innerHTML = `
      <div style="background: #ecfdf5; border: 1.5px solid #a7f3d0; border-radius: 16px; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
        <div>
          <span style="font-size: 0.75rem; font-weight: 800; color: #059669; background: #ffffff; padding: 3px 10px; border-radius: 99px; border: 1px solid #6ee7b7;">
            ✅ KELOMPOK AKTIF
          </span>
          <h4 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: #065f46; margin: 6px 0 0 0;">
            ${currentGroup.name} (Kode PIN: <code style="background: #d1fae5; padding: 2px 8px; border-radius: 6px;">${currentGroup.code}</code>)
          </h4>
        </div>
        <span style="font-size: 0.82rem; font-weight: 700; color: #047857;">🎓 Terdaftar</span>
      </div>

      <div style="font-size: 0.85rem; font-weight: 800; color: #334155; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
        <span>📋 Daftar Kuis Evaluasi Kelas (${currentGroup.code}):</span>
        <span style="font-weight: 600; font-size: 0.78rem; color: #64748b;">Diterbitkan oleh Guru</span>
      </div>

      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 18px; padding: 18px 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.03); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
          <div style="display: flex; gap: 14px; align-items: center;">
            <div style="width: 48px; height: 48px; border-radius: 14px; background: #e0e7ff; color: #4338ca; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0;">
              👨‍🏫
            </div>
            <div>
              <div style="font-size: 0.72rem; font-weight: 800; color: #4338ca; text-transform: uppercase;">
                KUIS RESMI GURU • KELAS ${currentGroup.code}
              </div>
              <h5 style="font-family: var(--font-heading); font-size: 1.05rem; font-weight: 800; color: #0f172a; margin: 2px 0 2px 0;">
                Evaluasi Mandiri: Sanitasi & Pencegahan Pandemi
              </h5>
              <div style="font-size: 0.78rem; color: #64748b;">
                Kurator: <strong>Guru Budi Darmawan</strong> • 5 Soal • Durasi 15 Menit
              </div>
            </div>
          </div>

          <button class="btn-start-class-quiz btn btn-primary" style="padding: 10px 20px; border-radius: 12px; font-weight: 800; background: #4338ca; color: #ffffff;">
            Kerjakan Kuis Kelas &rarr;
          </button>
        </div>

        <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 18px; padding: 18px 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.03); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
          <div style="display: flex; gap: 14px; align-items: center;">
            <div style="width: 48px; height: 48px; border-radius: 14px; background: #faf5ff; color: #9333ea; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0;">
              🤖
            </div>
            <div>
              <div style="font-size: 0.72rem; font-weight: 800; color: #9333ea; text-transform: uppercase;">
                HISBOT AI GENERATED • SOAL HOTS
              </div>
              <h5 style="font-family: var(--font-heading); font-size: 1.05rem; font-weight: 800; color: #0f172a; margin: 2px 0 2px 0;">
                Kuis AI: Wabah Pes & STOVIA (HOTS)
              </h5>
              <div style="font-size: 0.78rem; color: #64748b;">
                Kurator: <strong>Hisbot AI (Disetujui Guru)</strong> • 5 Soal • Durasi 15 Menit
              </div>
            </div>
          </div>

          <button class="btn-start-class-quiz btn btn-outline" style="padding: 10px 20px; border-radius: 12px; font-weight: 800; border-color: #9333ea; color: #9333ea; background: #ffffff;">
            Kerjakan Kuis AI &rarr;
          </button>
        </div>
      </div>
    `;

    container.querySelectorAll('.btn-start-class-quiz').forEach(btn => {
      btn.onclick = () => {
        audioEngine.playTap();
        closeModal('modal-select-kuis');
        openModal('modal-kuis');
      };
    });
  }
}
