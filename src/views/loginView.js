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

  let selectedRole = 'siswa'; // 'siswa' | 'guru' | 'tamu'
  let teacherSubMode = 'register'; // 'login' | 'register'

  container.innerHTML = `
    <div style="position: absolute; top: -10%; left: -10%; width: 450px; height: 450px; background: rgba(56, 189, 248, 0.15); border-radius: 50%; filter: blur(80px); pointer-events: none;"></div>
    <div style="position: absolute; bottom: -10%; right: -10%; width: 500px; height: 500px; background: rgba(16, 185, 129, 0.12); border-radius: 50%; filter: blur(90px); pointer-events: none;"></div>

    <div style="
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 2px solid rgba(255, 255, 255, 0.9);
      border-radius: 32px;
      padding: 40px 36px;
      max-width: 540px;
      width: 100%;
      box-shadow: 0 25px 60px rgba(15, 23, 42, 0.35);
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    ">
      
      <div style="width: 76px; height: 76px; border-radius: 50%; background: linear-gradient(135deg, #0284c7, #0369a1); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 2.3rem; margin-bottom: 14px; box-shadow: 0 10px 25px rgba(2, 132, 199, 0.4); border: 3px solid #ffffff;">
        🛡️
      </div>

      <h1 style="font-family: var(--font-heading, system-ui); font-size: 1.75rem; font-weight: 900; color: #0f172a; margin: 0 0 4px 0; letter-spacing: -0.5px;">
        Health Guardian
      </h1>
      <p style="font-size: 0.9rem; color: #0284c7; font-weight: 800; margin: 0 0 22px 0; letter-spacing: 0.5px; text-transform: uppercase;">
        Nusantara Sehat • Platform Edukasi
      </p>

      <div style="display: flex; background: #e2e8f0; padding: 4px; border-radius: 99px; width: 100%; margin-bottom: 20px;">
        <button type="button" id="tab-siswa" class="role-tab active" style="flex: 1; padding: 10px; border-radius: 99px; border: none; font-weight: 800; font-size: 0.88rem; cursor: pointer; transition: all 0.25s ease; background: #ffffff; color: #0284c7; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          🎓 Siswa
        </button>
        <button type="button" id="tab-guru" class="role-tab" style="flex: 1; padding: 10px; border-radius: 99px; border: none; font-weight: 700; font-size: 0.88rem; cursor: pointer; transition: all 0.25s ease; background: transparent; color: #64748b;">
          👨‍🏫 Portal Guru
        </button>
        <button type="button" id="tab-tamu" class="role-tab" style="flex: 1; padding: 10px; border-radius: 99px; border: none; font-weight: 700; font-size: 0.88rem; cursor: pointer; transition: all 0.25s ease; background: transparent; color: #64748b;">
          👤 Tamu
        </button>
      </div>

      <div id="wrapper-teacher-subtoggle" style="display: none; width: 100%; margin-bottom: 18px; background: #f1f5f9; padding: 4px; border-radius: 16px; border: 1px solid #cbd5e1;">
        <div style="display: flex; gap: 4px;">
          <button type="button" id="btn-guru-register" style="flex: 1; padding: 8px; border-radius: 12px; border: none; font-size: 0.82rem; font-weight: 800; cursor: pointer; background: #0284c7; color: #ffffff; transition: all 0.2s;">
            ✨ Buat Akun Guru Baru
          </button>
          <button type="button" id="btn-guru-login" style="flex: 1; padding: 8px; border-radius: 12px; border: none; font-size: 0.82rem; font-weight: 700; cursor: pointer; background: transparent; color: #64748b; transition: all 0.2s;">
            🔑 Masuk Akun Guru
          </button>
        </div>
      </div>

      <form id="form-login" style="width: 100%; display: flex; flex-direction: column; gap: 14px; text-align: left;">
        
        <div id="field-group-name">
          <label id="label-name" style="display: block; font-size: 0.85rem; font-weight: 800; color: #334155; margin-bottom: 6px;">
            Nama Lengkap Siswa
          </label>
          <input type="text" id="input-name" placeholder="Contoh: Budi Sanitarian" value="${gameState.data.player.name || ''}" style="width: 100%; padding: 13px 16px; border-radius: 14px; border: 2px solid #cbd5e1; font-size: 0.95rem; font-weight: 600; outline: none;">
        </div>

        <div id="field-group-school">
          <label id="label-school" style="display: block; font-size: 0.85rem; font-weight: 800; color: #334155; margin-bottom: 6px;">
            Asal Sekolah / Instansi
          </label>
          <input type="text" id="input-school" placeholder="Contoh: SMA Negeri 1 Nusantara" value="${gameState.data.player.school || ''}" style="width: 100%; padding: 13px 16px; border-radius: 14px; border: 2px solid #cbd5e1; font-size: 0.95rem; font-weight: 600; outline: none;">
        </div>

        <div id="field-group-class">
          <label style="display: block; font-size: 0.85rem; font-weight: 800; color: #334155; margin-bottom: 6px;">
            Kelas / Tingkat
          </label>
          <input type="text" id="input-class" placeholder="Contoh: XI MIPA 2" value="${gameState.data.player.className || ''}" style="width: 100%; padding: 13px 16px; border-radius: 14px; border: 2px solid #cbd5e1; font-size: 0.95rem; font-weight: 600; outline: none;">
        </div>

        <div id="field-group-nip" style="display: none;">
          <label style="display: block; font-size: 0.85rem; font-weight: 800; color: #334155; margin-bottom: 6px;">
            NIP / Email Guru (Opsional)
          </label>
          <input type="text" id="input-nip" placeholder="Contoh: 19850101... atau guru@sekolah.sch.id" style="width: 100%; padding: 13px 16px; border-radius: 14px; border: 2px solid #cbd5e1; font-size: 0.95rem; font-weight: 600; outline: none;">
        </div>

        <div id="info-tamu" style="display: none; background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 16px; padding: 16px; font-size: 0.9rem; color: #166534; font-weight: 600; line-height: 1.5; text-align: center;">
          ⚡ <b>Mode Tamu Langsung Aktif</b><br>
          Jelajahi seluruh materi edukasi, minigame simulasi wabah, dan fitur interaktif tanpa registrasi.
        </div>

        <div style="display: flex; align-items: center; gap: 10px; margin-top: 4px; justify-content: center; background: #f8fafc; padding: 10px 16px; border-radius: 99px; border: 1px solid #e2e8f0;">
          <input type="checkbox" id="chk-bgm" checked style="width: 18px; height: 18px; accent-color: #0284c7; cursor: pointer;">
          <label for="chk-bgm" style="font-size: 0.88rem; font-weight: 700; color: #334155; cursor: pointer;">
            🎵 Putar Musik Latar (BGM Carefree)
          </label>
        </div>

        <button type="submit" id="btn-submit-login" style="
          width: 100%;
          margin-top: 8px;
          padding: 16px;
          border-radius: 99px;
          border: none;
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
          color: #ffffff;
          font-weight: 900;
          font-size: 1.05rem;
          cursor: pointer;
          box-shadow: 0 10px 25px rgba(2, 132, 199, 0.4);
          transition: all 0.2s ease;
        ">
          🚀 Masuk & Mulai Pembelajaran ➔
        </button>

      </form>

      <button type="button" id="btn-skip-login" style="
        background: transparent;
        border: none;
        color: #64748b;
        font-size: 0.88rem;
        font-weight: 700;
        margin-top: 16px;
        cursor: pointer;
        text-decoration: underline;
      ">
        Atau Masuk Langsung Tanpa Login (Mode Tamu) ➔
      </button>

    </div>
  `;

  const tabSiswa = container.querySelector('#tab-siswa');
  const tabGuru = container.querySelector('#tab-guru');
  const tabTamu = container.querySelector('#tab-tamu');
  
  const teacherSubToggle = container.querySelector('#wrapper-teacher-subtoggle');
  const btnGuruRegister = container.querySelector('#btn-guru-register');
  const btnGuruLogin = container.querySelector('#btn-guru-login');

  const fieldNameGroup = container.querySelector('#field-group-name');
  const fieldSchoolGroup = container.querySelector('#field-group-school');
  const fieldClassGroup = container.querySelector('#field-group-class');
  const fieldNipGroup = container.querySelector('#field-group-nip');
  
  const labelName = container.querySelector('#label-name');
  const labelSchool = container.querySelector('#label-school');
  const inputName = container.querySelector('#input-name');
  const inputSchool = container.querySelector('#input-school');
  
  const infoTamu = container.querySelector('#info-tamu');
  const btnSubmit = container.querySelector('#btn-submit-login');

  const updateUI = () => {
    [tabSiswa, tabGuru, tabTamu].forEach(t => {
      t.style.background = 'transparent';
      t.style.color = '#64748b';
      t.style.fontWeight = '700';
      t.style.boxShadow = 'none';
    });

    const activeTab = selectedRole === 'siswa' ? tabSiswa : (selectedRole === 'guru' ? tabGuru : tabTamu);
    activeTab.style.background = '#ffffff';
    activeTab.style.color = '#0284c7';
    activeTab.style.fontWeight = '900';
    activeTab.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';

    if (selectedRole === 'tamu') {
      teacherSubToggle.style.display = 'none';
      fieldNameGroup.style.display = 'none';
      fieldSchoolGroup.style.display = 'none';
      fieldClassGroup.style.display = 'none';
      fieldNipGroup.style.display = 'none';
      infoTamu.style.display = 'block';

      btnSubmit.textContent = '⚡ Masuk Langsung (Mode Tamu) ➔';
      btnSubmit.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      btnSubmit.style.boxShadow = '0 10px 25px rgba(16, 185, 129, 0.4)';
    } 
    else if (selectedRole === 'siswa') {
      teacherSubToggle.style.display = 'none';
      fieldNameGroup.style.display = 'block';
      fieldSchoolGroup.style.display = 'block';
      fieldClassGroup.style.display = 'block';
      fieldNipGroup.style.display = 'none';
      infoTamu.style.display = 'none';

      labelName.textContent = 'Nama Lengkap Siswa';
      inputName.placeholder = 'Contoh: Budi Sanitarian';
      labelSchool.textContent = 'Asal Sekolah / Instansi';
      btnSubmit.textContent = '🎓 Masuk Sebagai Siswa ➔';
      btnSubmit.style.background = 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)';
      btnSubmit.style.boxShadow = '0 10px 25px rgba(2, 132, 199, 0.4)';
    } 
    else if (selectedRole === 'guru') {
      teacherSubToggle.style.display = 'block';
      fieldNameGroup.style.display = 'block';
      fieldSchoolGroup.style.display = 'block';
      fieldClassGroup.style.display = 'none';
      infoTamu.style.display = 'none';

      if (teacherSubMode === 'register') {
        btnGuruRegister.style.background = '#0284c7';
        btnGuruRegister.style.color = '#ffffff';
        btnGuruLogin.style.background = 'transparent';
        btnGuruLogin.style.color = '#64748b';

        fieldNipGroup.style.display = 'block';
        labelName.textContent = 'Nama Lengkap & Gelar Guru (Buat Akun Baru)';
        inputName.placeholder = 'Contoh: Dr. Supriadi, M.Pd.';
        labelSchool.textContent = 'Nama Sekolah / Tempat Mengajar';
        btnSubmit.textContent = '✨ Buat Akun Guru & Masuk Dashboard ➔';
        btnSubmit.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)';
        btnSubmit.style.boxShadow = '0 10px 25px rgba(139, 92, 246, 0.4)';
      } else {
        btnGuruLogin.style.background = '#0284c7';
        btnGuruLogin.style.color = '#ffffff';
        btnGuruRegister.style.background = 'transparent';
        btnGuruRegister.style.color = '#64748b';

        fieldNipGroup.style.display = 'none';
        labelName.textContent = 'Nama Guru Pengajar';
        inputName.placeholder = 'Contoh: Supriadi, S.Pd.';
        labelSchool.textContent = 'Nama Sekolah / Instansi';
        btnSubmit.textContent = '🔑 Masuk Dashboard Guru ➔';
        btnSubmit.style.background = 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)';
        btnSubmit.style.boxShadow = '0 10px 25px rgba(2, 132, 199, 0.4)';
      }
    }
  };

  tabSiswa.addEventListener('click', () => { selectedRole = 'siswa'; updateUI(); });
  tabGuru.addEventListener('click', () => { selectedRole = 'guru'; updateUI(); });
  tabTamu.addEventListener('click', () => { selectedRole = 'tamu'; updateUI(); });

  btnGuruRegister.addEventListener('click', () => { teacherSubMode = 'register'; updateUI(); });
  btnGuruLogin.addEventListener('click', () => { teacherSubMode = 'login'; updateUI(); });

  const executeLogin = (isGuestMode = false) => {
    const rawName = inputName.value.trim();
    const rawSchool = inputSchool.value.trim();
    const rawClass = container.querySelector('#input-class').value.trim();
    const shouldPlayBgm = container.querySelector('#chk-bgm').checked;

    let playerName = 'Penjaga Kesehatan (Tamu)';
    let playerType = 'siswa';

    if (!isGuestMode && selectedRole !== 'tamu') {
      if (selectedRole === 'guru') {
        playerType = 'guru';
        playerName = rawName || (teacherSubMode === 'register' ? 'Guru Pengajar Baru' : 'Guru Pengajar');
      } else {
        playerType = 'siswa';
        playerName = rawName || 'Siswa Indonesia';
      }
    }

    gameState.data.player = {
      ...gameState.data.player,
      id: gameState.data.player.id || `${playerType}_${Date.now()}`,
      name: playerName,
      userType: playerType,
      school: rawSchool || 'Sekolah Nusantara',
      className: rawClass || (playerType === 'guru' ? 'Kelas Pengajar' : 'Kelas X'),
      points: gameState.data.player.points || 100,
      level: gameState.data.player.level || 1
    };
    gameState.save();

    try {
      syncPlayerToCloud(gameState.data.player);
    } catch (err) {
      console.warn("Cloud Sync note:", err);
    }

    if (shouldPlayBgm) {
      audioEngine.startBgm();
    } else {
      audioEngine.stopBgm();
    }
    audioEngine.playSuccess();

    if (playerType === 'guru') {
      router.navigate('teacher-dashboard');
    } else {
      router.navigate('home');
    }
  };

  container.querySelector('#form-login').addEventListener('submit', (e) => {
    e.preventDefault();
    executeLogin(selectedRole === 'tamu');
  });

  container.querySelector('#btn-skip-login').addEventListener('click', (e) => {
    e.preventDefault();
    executeLogin(true);
  });

  updateUI();

  return container;
}
