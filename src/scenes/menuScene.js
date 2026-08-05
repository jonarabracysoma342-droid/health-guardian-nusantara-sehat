// MENU UTAMA DASHBOARD SCENE - HEALTH GUARDIAN NUSANTARA SEHAT
import { router } from '../core/router.js';
import { gameState } from '../core/state.js';
import { audioEngine } from '../core/audio.js';
import { openHISbotModal } from '../components/hisbot.js';

export function renderMenuScene() {
  const player = gameState.data.player || { name: 'Siswa', userType: 'siswa', points: 100, level: 1 };
  const isGuru = player.userType === 'guru';

  const container = document.createElement('div');
  container.className = 'scene-menu-container';
  container.style.cssText = `
    min-height: 100vh;
    width: 100%;
    padding: 32px 24px 60px;
    background: radial-gradient(circle at 50% 10%, #0369a1 0%, #0f172a 80%);
    color: #ffffff;
    font-family: var(--font-body, system-ui, sans-serif);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
  `;

  container.innerHTML = `
    <div style="max-width: 1100px; width: 100%; display: flex; flex-direction: column; gap: 28px;">
      
      <!-- HERO WELCOME BANNER -->
      <div style="
        background: linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(240,249,255,0.96) 100%);
        border: 2px solid rgba(56, 189, 248, 0.4);
        border-radius: 28px;
        padding: 30px 36px;
        color: #0f172a;
        box-shadow: 0 20px 50px rgba(15, 23, 42, 0.3);
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 20px;
      ">
        <div style="display: flex; align-items: center; gap: 20px;">
          <div style="width: 76px; height: 76px; border-radius: 50%; background: linear-gradient(135deg, #0284c7, #0369a1); display: flex; align-items: center; justify-content: center; font-size: 2.4rem; box-shadow: 0 10px 25px rgba(2,132,199,0.35); border: 3px solid #ffffff;">
            ${isGuru ? '👨‍🏫' : '🎓'}
          </div>
          <div>
            <div style="font-size: 0.8rem; font-weight: 800; color: #0284c7; text-transform: uppercase; letter-spacing: 0.8px;">
              ${isGuru ? '👨‍🏫 Portal Pengajar Guru' : '🎓 Selamat Datang, Garda Kesehatan'}
            </div>
            <h1 style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 900; color: #0f172a; margin: 4px 0 6px 0;">
              ${player.name || 'Siswa Penjaga Kesehatan'}
            </h1>
            <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap; font-size: 0.85rem; font-weight: 700; color: #475569;">
              <span style="background: #e0f2fe; color: #0369a1; padding: 4px 12px; border-radius: 99px; border: 1px solid #bae6fd;">
                ${player.className || (isGuru ? 'Mode Guru' : 'Kelas V IPAS')}
              </span>
              <span style="color: #10b981; font-weight: 800;">💚 ${player.points || 100} Poin Sehat</span>
              <span style="color: #d97706; font-weight: 800;">⭐ Level ${player.level || 1}</span>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 12px;">
          <button id="btn-menu-open-map" class="btn btn-primary" style="padding: 12px 24px; border-radius: 16px; font-weight: 800; background: linear-gradient(135deg, #0284c7, #00288e); color: #ffffff; box-shadow: 0 6px 18px rgba(2,132,199,0.35); font-size: 0.95rem;">
            🗺️ Buka Peta Level &rarr;
          </button>
        </div>
      </div>

      <!-- MAIN DASHBOARD MENU TILES GRID -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px;">
        
        <!-- CARD 1: PETA SEJARAH WABAH -->
        <div class="menu-action-card" id="card-nav-map" style="background: #ffffff; border: 2px solid #bae6fd; border-radius: 24px; padding: 26px 22px; color: #0f172a; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 8px 24px rgba(15,23,42,0.06); display: flex; flex-direction: column; justify-content: space-between; min-height: 200px;">
          <div>
            <div style="width: 52px; height: 52px; border-radius: 16px; background: #e0f2fe; color: #0284c7; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin-bottom: 14px;">
              🗺️
            </div>
            <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; margin: 0 0 6px 0; color: #0f172a;">
              Peta Sejarah Wabah
            </h3>
            <p style="font-size: 0.85rem; color: #64748b; margin: 0; line-height: 1.45;">
              Jelajahi 4 Era Wabah di Nusantara dari Masa Kolonial 1911 hingga COVID-19.
            </p>
          </div>
          <div style="font-size: 0.85rem; font-weight: 800; color: #0284c7; margin-top: 16px; display: flex; align-items: center; justify-content: space-between;">
            <span>Mulai Petualangan</span>
            <span>&rarr;</span>
          </div>
        </div>

        <!-- CARD 2: MINI GAME MITIGASI (LEVEL 1-4) -->
        <div class="menu-action-card" id="card-nav-minigame" style="background: #ffffff; border: 2px solid #a7f3d0; border-radius: 24px; padding: 26px 22px; color: #0f172a; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 8px 24px rgba(15,23,42,0.06); display: flex; flex-direction: column; justify-content: space-between; min-height: 200px;">
          <div>
            <div style="width: 52px; height: 52px; border-radius: 16px; background: #ecfdf5; color: #059669; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin-bottom: 14px;">
              🎮
            </div>
            <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; margin: 0 0 6px 0; color: #0f172a;">
              Mini Game & Simulasi
            </h3>
            <p style="font-size: 0.85rem; color: #64748b; margin: 0; line-height: 1.45;">
              Racik vaksin bebas Level 3, simulasi mitigasi Pes, dan penanganan wabah.
            </p>
          </div>
          <div style="font-size: 0.85rem; font-weight: 800; color: #059669; margin-top: 16px; display: flex; align-items: center; justify-content: space-between;">
            <span>Mainkan Mini Game</span>
            <span>&rarr;</span>
          </div>
        </div>

        <!-- CARD 3: PORTAL KUIS EVALUASI -->
        <div class="menu-action-card" id="card-nav-kuis" style="background: #ffffff; border: 2px solid #fde68a; border-radius: 24px; padding: 26px 22px; color: #0f172a; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 8px 24px rgba(15,23,42,0.06); display: flex; flex-direction: column; justify-content: space-between; min-height: 200px;">
          <div>
            <div style="width: 52px; height: 52px; border-radius: 16px; background: #fffbeb; color: #d97706; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin-bottom: 14px;">
              📝
            </div>
            <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; margin: 0 0 6px 0; color: #0f172a;">
              Kuis Evaluasi Kompetensi
            </h3>
            <p style="font-size: 0.85rem; color: #64748b; margin: 0; line-height: 1.45;">
              20 soal evaluasi Kurikulum Merdeka dengan pembahasan & kunci jawaban lengkap.
            </p>
          </div>
          <div style="font-size: 0.85rem; font-weight: 800; color: #d97706; margin-top: 16px; display: flex; align-items: center; justify-content: space-between;">
            <span>Buka Portal Kuis</span>
            <span>&rarr;</span>
          </div>
        </div>

        <!-- CARD 4: HISBOT AI ASSISTANT -->
        <div class="menu-action-card" id="card-nav-hisbot" style="background: #ffffff; border: 2px solid #ddd6fe; border-radius: 24px; padding: 26px 22px; color: #0f172a; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 8px 24px rgba(15,23,42,0.06); display: flex; flex-direction: column; justify-content: space-between; min-height: 200px;">
          <div>
            <div style="width: 52px; height: 52px; border-radius: 16px; background: #f5f3ff; color: #7c3aed; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin-bottom: 14px;">
              🤖
            </div>
            <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; margin: 0 0 6px 0; color: #0f172a;">
              HISbot AI Assistant
            </h3>
            <p style="font-size: 0.85rem; color: #64748b; margin: 0; line-height: 1.45;">
              Tanya jawab interaktif seputar sejarah wabah Indonesia & literasi sains.
            </p>
          </div>
          <div style="font-size: 0.85rem; font-weight: 800; color: #7c3aed; margin-top: 16px; display: flex; align-items: center; justify-content: space-between;">
            <span>Tanya HISbot AI</span>
            <span>&rarr;</span>
          </div>
        </div>

        <!-- CARD 5: RAPOR DIGITAL & SERTIFIKAT -->
        <div class="menu-action-card" id="card-nav-report" style="background: #ffffff; border: 2px solid #fed7aa; border-radius: 24px; padding: 26px 22px; color: #0f172a; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 8px 24px rgba(15,23,42,0.06); display: flex; flex-direction: column; justify-content: space-between; min-height: 200px;">
          <div>
            <div style="width: 52px; height: 52px; border-radius: 16px; background: #fff7ed; color: #ea580c; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin-bottom: 14px;">
              📜
            </div>
            <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; margin: 0 0 6px 0; color: #0f172a;">
              Rapor & Sertifikat Digital
            </h3>
            <p style="font-size: 0.85rem; color: #64748b; margin: 0; line-height: 1.45;">
              Lihat sertifikat kelulusan modul & statistik nilai evaluasi belajar.
            </p>
          </div>
          <div style="font-size: 0.85rem; font-weight: 800; color: #ea580c; margin-top: 16px; display: flex; align-items: center; justify-content: space-between;">
            <span>Cetak Sertifikat</span>
            <span>&rarr;</span>
          </div>
        </div>

        ${isGuru ? `
          <!-- CARD GURU: DASHBOARD GURU -->
          <div class="menu-action-card" id="card-nav-teacher" style="background: #ffffff; border: 2px solid #93c5fd; border-radius: 24px; padding: 26px 22px; color: #0f172a; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 8px 24px rgba(15,23,42,0.06); display: flex; flex-direction: column; justify-content: space-between; min-height: 200px;">
            <div>
              <div style="width: 52px; height: 52px; border-radius: 16px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin-bottom: 14px;">
                👨‍🏫
              </div>
              <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; margin: 0 0 6px 0; color: #0f172a;">
                Dashboard Guru Pengajar
              </h3>
              <p style="font-size: 0.85rem; color: #64748b; margin: 0; line-height: 1.45;">
                Kelola Kode Sandi Kelas, pantau nilai kuis siswa, & mode presentasi.
              </p>
            </div>
            <div style="font-size: 0.85rem; font-weight: 800; color: #2563eb; margin-top: 16px; display: flex; align-items: center; justify-content: space-between;">
              <span>Buka Dashboard Guru</span>
              <span>&rarr;</span>
            </div>
          </div>
        ` : ''}

      </div>
    </div>
  `;

  // Attach Event Listeners
  setTimeout(() => {
    container.querySelector('#btn-menu-open-map')?.addEventListener('click', () => {
      audioEngine.playTap();
      router.navigate('map');
    });

    container.querySelector('#card-nav-map')?.addEventListener('click', () => {
      audioEngine.playTap();
      router.navigate('map');
    });

    container.querySelector('#card-nav-minigame')?.addEventListener('click', () => {
      audioEngine.playTap();
      router.navigate('minigame', { level: 3, eraId: 3 });
    });

    container.querySelector('#card-nav-kuis')?.addEventListener('click', () => {
      audioEngine.playTap();
      if (typeof window.openModal === 'function') {
        window.openModal('modal-select-kuis');
      } else {
        router.navigate('map');
      }
    });

    container.querySelector('#card-nav-hisbot')?.addEventListener('click', () => {
      audioEngine.playTap();
      openHISbotModal();
    });

    container.querySelector('#card-nav-report')?.addEventListener('click', () => {
      audioEngine.playTap();
      router.navigate('report');
    });

    container.querySelector('#card-nav-teacher')?.addEventListener('click', () => {
      audioEngine.playTap();
      router.navigate('teacher-dashboard');
    });
  }, 0);

  return container;
}
