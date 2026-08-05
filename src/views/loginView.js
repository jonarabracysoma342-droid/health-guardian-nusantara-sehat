// LOGIN & ENTRY VIEW - HEALTH GUARDIAN
import { router } from '../core/router.js';
import { gameState } from '../core/state.js';
import { audioEngine } from '../core/audio.js';
import { syncPlayerToCloud } from '../core/firebase.js';

export function renderLoginView() {
  const container = document.createElement('div');
  container.className = 'login-view-container';
  container.style.cssText = `
    min-height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: radial-gradient(circle at 50% 20%, #0369a1 0%, #0f172a 75%);
    font-family: var(--font-body, system-ui, sans-serif);
    position: relative;
    overflow: hidden;
  `;

  let selectedRole = 'siswa';

  container.innerHTML = `
    <div style="position: absolute; top: -10%; left: -10%; width: 450px; height: 450px; background: rgba(56, 189, 248, 0.15); border-radius: 50%; filter: blur(80px); pointer-events: none;"></div>
    <div style="position: absolute; bottom: -10%; right: -10%; width: 500px; height: 500px; background: rgba(16, 185, 129, 0.12); border-radius: 50%; filter: blur(90px); pointer-events: none;"></div>

    <div style="
      background: rgba(255, 255, 255, 0.94);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 2px solid rgba(255, 255, 255, 0.8);
      border-radius: 32px;
      padding: 44px 40px;
      max-width: 520px;
      width: 100%;
      box-shadow: 0 25px 60px rgba(15, 23, 42, 0.35);
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    ">
      
      <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #0284c7, #0369a1); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin-bottom: 16px; box-shadow: 0 10px 25px rgba(2, 132, 199, 0.4); border: 3px solid #ffffff;">
        🛡️
      </div>

      <h1 style="font-family: var(--font-heading, system-ui); font-size: 1.8rem; font-weight: 900; color: #0f172a; margin: 0 0 6px 0; letter-spacing: -0.5px;">
        Health Guardian
      </h1>
      <p style="font-size: 0.95rem; color: #0284c7; font-weight: 800; margin: 0 0 24px 0; letter-spacing: 0.5px; text-transform: uppercase;">
        Nusantara Sehat • Platform Edukasi
      </p>

      <div style="display: flex; background: #e2e8f0; padding: 4px; border-radius: 99px; width: 100%; margin-bottom: 24px;">
        <button id="tab-siswa" class="role-tab active" style="flex: 1; padding: 10px 12px; border-radius: 99px; border: none; font-weight: 800; font-size: 0.88rem; cursor: pointer; transition: all 0.25s ease; background: #ffffff; color: #0284c7; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          🎓 Siswa
        </button>
        <button id="tab-guru" class="role-tab" style="flex: 1; padding: 10px 12px; border-radius: 99px; border: none; font-weight: 700; font-size: 0.88rem; cursor: pointer; transition: all 0.25s ease; background: transparent; color: #64748b;">
          👨‍🏫 Guru
        </button>
        <button id="tab-tamu" class="role-tab" style="flex: 1; padding: 10px 12px; border-radius: 99px; border: none; font-weight: 700; font-size: 0.88rem; cursor: pointer; transition: all 0.25s ease; background: transparent; color: #64748b;">
          👤 Tamu
        </button>
      </div>

      <form id="form-login" style="width: 100%; display: flex; flex-direction: column; gap: 16px; text-align: left;">
        
        <div id="fields-login" style="display: flex; flex-direction: column; gap: 14px;">
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: 800; color: #334155; margin-bottom: 6px;">
              Nama Lengkap
            </label>
            <input type="text" id="input-name" placeholder="Contoh: Budi Sanitarian" value="${gameState.data.player.name || ''}" style="width: 100%; padding: 14px 18px; border-radius: 16px; border: 2px solid #cbd5e1; font-size: 0.95rem; font-weight: 600; outline: none; transition: border-color 0.2s;" required>
          </div>

          <div>
            <label id="label-school" style="display: block; font-size: 0.85rem; font-weight: 800; color: #334155; margin-bottom: 6px;">
              Asal Sekolah / Instansi
            </label>
            <input type="text" id="input-school" placeholder="Contoh: SMA Negeri 1 Indonesia" value="${gameState.data.player.school || ''}" style="width: 100%; padding: 14px 18px; border-radius: 16px; border: 2px solid #cbd5e1; font-size: 0.95rem; font-weight: 600; outline: none; transition: border-color 0.2s;">
          </div>

          <div id="group-class">
            <label style="display: block; font-size: 0.85rem; font-weight: 800; color: #334155; margin-bottom: 6px;">
              Kelas / Tingkat
            </label>
            <input type="text" id="input-class" placeholder="Contoh: XI MIPA 2" value="${gameState.data.player.className || ''}" style="width: 100%; padding: 14px 18px; border-radius: 16px; border: 2px solid #cbd5e1; font-size: 0.95rem; font-weight: 600; outline: none; transition: border-color 0.2s;">
          </div>
        </div>

        <div id="info-tamu" style="display: none; background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 16px; padding: 16px; font-size: 0.9rem; color: #166534; font-weight: 600; line-height: 1.5; text-align: center;">
          ⚡ <b>Mode Tamu Lengkap</b><br>
          Anda dapat menjelajahi seluruh modul edukasi, minigame, dan fitur simulasi tanpa perlu mengisi formulir pendaftaran.
        </div>

        <div style="display: flex; align-items: center; gap: 10px; margin-top: 6px; justify-content: center; background: #f8fafc; padding: 10px 16px; border-radius: 99px; border: 1px solid #e2e8f0;">
          <input type="checkbox" id="chk-bgm" checked style="width: 18px; height: 18px; accent-color: #0284c7; cursor: pointer;">
          <label for="chk-bgm" style="font-size: 0.88rem; font-weight: 700; color: #334155; cursor: pointer;">
            🎵 Putar Musik Latar (BGM Carefree)
          </label>
        </div>

        <button type="submit" id="btn-submit-login" style="
          width: 100%;
          margin-top: 10px;
          padding: 16px;
          border-radius: 99px;
          border: none;
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
          color: #ffffff;
          font-weight: 900;
          font-size: 1.05rem;
          cursor: pointer;
          box-shadow: 0 10px 25px rgba(2, 132, 199, 0.4);
          transition: transform 0.2s, box-shadow 0.2s;
        ">
          🚀 Masuk & Mulai Pembelajaran ➔
        </button>

      </form>

      <button id="btn-skip-login" style="
        background: transparent;
        border: none;
        color: #64748b;
        font-size: 0.88rem;
        font-weight: 700;
        margin-top: 18px;
        cursor: pointer;
        text-decoration: underline;
      ">
        Langsung Masuk Sebagai Tamu ➔
      </button>

    </div>
  `;

  const tabSiswa = container.querySelector('#tab-siswa');
  const tabGuru = container.querySelector('#tab-guru');
  const tabTamu = container.querySelector('#tab-tamu');
  const fieldsLogin = container.querySelector('#fields-login');
  const infoTamu = container.querySelector('#info-tamu');
  const btnSubmit = container.querySelector('#btn-submit-login');
  const groupClass = container.querySelector('#group-class');
  const labelSchool = container.querySelector('#label-school');

  const updateRoleUI = (role) => {
    selectedRole = role;
    [tabSiswa, tabGuru, tabTamu].forEach(t => {
      t.style.background = 'transparent';
      t.style.color = '#64748b';
      t.style.fontWeight = '700';
      t.style.boxShadow = 'none';
    });

    const activeTab = role === 'siswa' ? tabSiswa : (role === 'guru' ? tabGuru : tabTamu);
    activeTab.style.background = '#ffffff';
    activeTab.style.color = '#0284c7';
    activeTab.style.fontWeight = '900';
    activeTab.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';

    if (role === 'tamu') {
      fieldsLogin.style.display = 'none';
      infoTamu.style.display = 'block';
      btnSubmit.textContent = '⚡ Masuk Sebagai Tamu ➔';
      btnSubmit.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      btnSubmit.style.boxShadow = '0 10px 25px rgba(16, 185, 129, 0.4)';
    } else {
      fieldsLogin.style.display = 'flex';
      infoTamu.style.display = 'none';
      btnSubmit.style.background = 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)';
      btnSubmit.style.boxShadow = '0 10px 25px rgba(2, 132, 199, 0.4)';

      if (role === 'guru') {
        groupClass.style.display = 'none';
        labelSchool.textContent = 'Nama Sekolah / Instansi Mengajar';
        btnSubmit.textContent = '👨‍🏫 Masuk Portal Guru ➔';
      } else {
        groupClass.style.display = 'block';
        labelSchool.textContent = 'Asal Sekolah / Instansi';
        btnSubmit.textContent = '🎓 Masuk Sebagai Siswa ➔';
      }
    }
  };

  tabSiswa.addEventListener('click', (e) => { e.preventDefault(); updateRoleUI('siswa'); });
  tabGuru.addEventListener('click', (e) => { e.preventDefault(); updateRoleUI('guru'); });
  tabTamu.addEventListener('click', (e) => { e.preventDefault(); updateRoleUI('tamu'); });

  const handleProceed = (isGuest = false) => {
    const nameInput = container.querySelector('#input-name').value.trim();
    const schoolInput = container.querySelector('#input-school').value.trim();
    const classInput = container.querySelector('#input-class').value.trim();
    const shouldPlayBgm = container.querySelector('#chk-bgm').checked;

    let finalName = 'Penjaga Kesehatan (Tamu)';
    let finalRole = 'siswa';

    if (!isGuest && selectedRole !== 'tamu') {
      finalName = nameInput || (selectedRole === 'guru' ? 'Guru Pengajar' : 'Siswa Nusantara');
      finalRole = selectedRole;
    }

    gameState.data.player = {
      ...gameState.data.player,
      name: finalName,
      userType: finalRole,
      school: schoolInput || 'Sekolah Nusantara',
      className: classInput || 'Kelas X',
      points: gameState.data.player.points || 100,
      level: gameState.data.player.level || 1
    };
    gameState.save();

    try {
      syncPlayerToCloud(gameState.data.player);
    } catch (err) {}

    if (shouldPlayBgm) {
      audioEngine.startBgm();
    } else {
      audioEngine.stopBgm();
    }
    audioEngine.playSuccess();

    router.navigate('home');
  };

  container.querySelector('#form-login').addEventListener('submit', (e) => {
    e.preventDefault();
    handleProceed(selectedRole === 'tamu');
  });

  container.querySelector('#btn-skip-login').addEventListener('click', (e) => {
    e.preventDefault();
    handleProceed(true);
  });

  return container;
}
