// MINIGAME VIEW - GAME 6 LEVEL INTERAKTIF "WABAH: PENJAGA KESEHATAN"
// TARGET AUDIENS: GEN ALPHA (VISUAL AKTIF, INTERAKTIF, GAMIFIKASI)
// PREMIUM EDITION WITH PNG GRAPHICS & ENHANCED GAMEPLAY

import { router } from '../core/router.js';
import { gameState } from '../core/state.js';
import { audioEngine } from '../core/audio.js';
import { showToast } from '../components/modals.js';
import { getLevelIllustrationSVG } from './mapView.js';

// ASSET PATHS
const ASSETS = {
  banner: '/images/game/game_level_banner.png',
  labCorona: '/images/game/lab_monitor_corona.png',
  labBacteria: '/images/game/lab_monitor_bacteria.png',
  village: '/images/game/village_river_cholera.png',
  vaccine: '/images/game/vaccine_factory_machine.png',
  hospital: '/images/game/hospital_isolation_rooms.png',
  victory: '/images/game/victory_celebration.png',
};

const INGREDIENT_KNOWLEDGE = {
  virus_lemah: {
    title: '🦠 Virus Cacar (Vaccinia / Cowpox)',
    category: 'Antigen Spesifik Cacar',
    function: 'Digunakan sebagai antigen utama yang dilemahkan untuk merangsang sistem kekebalan tubuh membentuk antibodi spesifik penangkal wabah Cacar (Smallpox).',
    origin: 'Ditemukan oleh Dr. Edward Jenner pada tahun 1796 dari jaringan cacar sapi (cowpox) yang terbukti memberikan kekebalan silang terhadap variola manusia.',
    facts: 'Vaksin Cacar merupakan vaksin pertama di dunia yang berhasil memusnahkan (eradikasi total) penyakit Cacar pada tahun 1980 dengan produksi massal Bio Farma.'
  },
  corona: {
    title: '👑 Virus Corona (SARS-CoV-2)',
    category: 'Antigen Spesifik COVID-19',
    function: 'Memicu pembentukan antibodi spesifik sel T dan sel B memori untuk mengenali protein lonjakan (spike protein) virus Corona.',
    origin: 'Diisolasi dari sampel pasien pandemi COVID-19. Dikembangkan menjadi berbagai platform vaksin (mRNA, vektor virus, dan inaktivasi).',
    facts: 'Di Indonesia, vaksinasi massal COVID-19 dilaksanakan secara gratis sejak 2021 untuk mencapai kekebalan kelompok (herd immunity) nasional.'
  },
  hpv: {
    title: '🔬 Virus HPV (Human Papillomavirus)',
    category: 'Antigen Pencegah Kanker Serviks',
    function: 'Melindungi sel-sel epitel tubuh dari infeksi virus HPV tipe risiko tinggi (16 & 18) penyebab kanker leher rahim.',
    origin: 'Penelitian perintis oleh Harald zur Hausen yang memenangkan Hadiah Nobel Kedokteran 2008 atas penemuan keterkaitan HPV dengan kanker.',
    facts: 'Pemerintah Indonesia memasukkan vaksin HPV ke dalam program Bulan Imunisasi Anak Sekolah (BIAS) bagi siswi Sekolah Dasar (SD).'
  },
  polio: {
    title: '🦵 Virus Polio (Sabin / Salk)',
    category: 'Antigen Spesifik Polio',
    function: 'Mencegah virus polio menyerang sistem saraf pusat yang dapat menyebabkan kelumpuhan layu permanen pada anak-anak.',
    origin: 'Dikembangkan oleh Dr. Jonas Salk (1955, vaksin suntik IPV) dan Dr. Albert Sabin (1961, vaksin tetes mulut OPV).',
    facts: 'Melalui program Pekan Imunisasi Nasional (PIN) dan Posyandu di seluruh pelosok Indonesia, Nusantara berhasil memperoleh sertifikat bebas Polio dari WHO.'
  },
  campak: {
    title: '🔴 Virus Campak (Paramyxovirus)',
    category: 'Antigen Spesifik Campak & Rubella',
    function: 'Memberikan kekebalan terhadap komplikasi campak seperti demam tinggi, ruam kulit, pneumonia, dan radang otak.',
    origin: 'Diisolasi pertama kali oleh John F. Enders pada tahun 1954 dari sampel darah pasien campak.',
    facts: 'Vaksinasi Campak umumnya digabungkan dalam formulasi kombinasi MR (Measles-Rubella) atau MMR untuk perlindungan ganda anak-anak.'
  },
  influenza: {
    title: '🤧 Virus Influenza (Flu Musiman)',
    category: 'Antigen Spesifik Influenza',
    function: 'Meningkatkan antibodi penangkal galur flu musiman (Influenza A & B) yang menginfeksi saluran pernapasan atas.',
    origin: 'Dikembangkan sejak era Perang Dunia II untuk melindungi tentara dan populasi dari wabah flu epidemi.',
    facts: 'Karena struktur virus influenza selalu bermutasi (antigenic drift), formulasi vaksin selalu diperbarui setiap tahun sesuai rekomendasi WHO.'
  },
  serum: {
    title: '🧪 Serum Antibodi (Imunitas Pasif & Aktif)',
    category: 'Bahan Penunjang Reaksi Imun',
    function: 'Menyediakan imunoglobulin pendukung yang membantu memfasilitasi pengenalan sel antigen virus oleh sel darah putih.',
    origin: 'Diisolasi dari bagian cair plasma darah yang bebas dari sel darah merah dan protein pembeku.',
    facts: 'Serum berperan penting dalam membantu proses formulasi vaksin agar respon imunitas tubuh bereaksi secara stabil dan tepat sasaran.'
  },
  stabilizer: {
    title: '🧪 Cairan Penstabil (Pengunci Suhu)',
    category: 'Bahan Pengawet & Penstabil Suhu',
    function: 'Menjaga keutuhan ikatan molekul vaksin dari kerusakan akibat kelembapan, keasaman, atau perubahan suhu lingkungan.',
    origin: 'Terbuat dari gula murni terstruktur (seperti laktosa, sorbitol) dan gelatin bermutu medis steril.',
    facts: 'Cairan penstabil sangat vital dalam jaringan rantai dingin (cold chain) pengiriman vaksin ke daerah-daerah terpencil di Indonesia.'
  },
  air_steril: {
    title: '💧 Air Steril (Aqua Pro Injectione)',
    category: 'Pelarut Murni Bebas Kuman',
    function: 'Berfungsi sebagai media pelarut murni yang mengencerkan konsentrat bahan aktif vaksin hingga mencapai dosis aman dan tepat.',
    origin: 'Air murni yang telah melalui proses distilasi bertingkat, penyaringan mikro, dan pemanasan autoklaf tinggi.',
    facts: 'Air steril bebas dari kandungan mineral, garam, pirogen, maupun mikroba sehingga tidak menimbulkan iritasi saat disuntikkan.'
  },
  poison: {
    title: '☠️ Racun Merkuri (Bahaya / Logam Berat)',
    category: 'Bahan Berbahaya (Bukan Bahan Vaksin)',
    function: 'Bukan bahan obat! Sangat berbahaya dan merusak sel-sel tubuh jika masuk ke dalam pembuluh darah.',
    origin: 'Logam raksa murni (Hg) yang beracun tinggi bagi jaringan saraf manusia (terkenal pada Kasus Pencemaran Minamata).',
    facts: 'Dalam industri farmasi modern, racun dan logam berat DILARANG KERAS digunakan sebagai bahan racikan obat maupun vaksin!'
  }
};

export function openIngredientInfoModal(ingId) {
  const data = INGREDIENT_KNOWLEDGE[ingId];
  if (!data) return;

  let modal = document.getElementById('modal-ingredient-info');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-ingredient-info';
    modal.className = 'modal-overlay hidden';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-card glass-panel" style="max-width: 540px; border-radius: 20px; background: #0f172a; border: 2px solid #38bdf8; color: #f8fafc; box-shadow: 0 20px 50px rgba(0,0,0,0.8);">
      <div class="modal-header" style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); border-bottom: 1.5px solid #38bdf8; padding: 14px 18px; border-radius: 18px 18px 0 0; display:flex; justify-content:space-between; align-items:center;">
        <h3 style="color: #ffffff; font-family: var(--font-heading); font-size: 1.1rem; font-weight: 800; margin: 0; display: flex; align-items: center; gap: 8px;">
          ${data.title}
        </h3>
        <button class="btn-close-modal" id="btn-close-ing-info" style="background: rgba(255,255,255,0.2); color: #ffffff; border: none; font-size: 1.4rem; cursor: pointer; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center;">&times;</button>
      </div>

      <div class="modal-body" style="padding: 20px; display: flex; flex-direction: column; gap: 14px; background: #0f172a; max-height: 75vh; overflow-y: auto;">
        
        <div style="background: rgba(56, 189, 248, 0.12); border-left: 4px solid #38bdf8; padding: 10px 14px; border-radius: 8px;">
          <span style="font-size: 0.72rem; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.5px;">KATEGORI & PERAN</span>
          <div style="font-size: 0.9rem; font-weight: 700; color: #fef08a; margin-top: 2px;">${data.category}</div>
        </div>

        <div style="background: rgba(30, 41, 59, 0.8); border: 1.5px solid #334155; border-radius: 12px; padding: 14px;">
          <h4 style="font-size: 0.85rem; font-weight: 800; color: #38bdf8; margin: 0 0 6px 0; display: flex; align-items: center; gap: 6px;">
            ⚙️ PERAN & FUNGSI DALAM VAKSIN:
          </h4>
          <p style="font-size: 0.85rem; color: #cbd5e1; margin: 0; line-height: 1.5;">
            ${data.function}
          </p>
        </div>

        <div style="background: rgba(30, 41, 59, 0.8); border: 1.5px solid #334155; border-radius: 12px; padding: 14px;">
          <h4 style="font-size: 0.85rem; font-weight: 800; color: #10b981; margin: 0 0 6px 0; display: flex; align-items: center; gap: 6px;">
            📜 ASAL-USUL & SEJARAH PENEMUAN:
          </h4>
          <p style="font-size: 0.85rem; color: #cbd5e1; margin: 0; line-height: 1.5;">
            ${data.origin}
          </p>
        </div>

        <div style="background: rgba(245, 158, 11, 0.12); border: 1.5px solid rgba(245, 158, 11, 0.3); border-radius: 12px; padding: 14px;">
          <h4 style="font-size: 0.85rem; font-weight: 800; color: #fef08a; margin: 0 0 6px 0; display: flex; align-items: center; gap: 6px;">
            💡 FAKTA PENTING KURIKULUM MERDEKA:
          </h4>
          <p style="font-size: 0.84rem; color: #fde68a; margin: 0; line-height: 1.5;">
            ${data.facts}
          </p>
        </div>

      </div>
    </div>
  `;

  modal.classList.remove('hidden');

  const closeBtn = modal.querySelector('#btn-close-ing-info');
  if (closeBtn) {
    closeBtn.onclick = () => modal.classList.add('hidden');
  }

  modal.onclick = (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  };
}

// LEVEL DATA
const LEVEL_METADATA = [
  {
    id: 1,
    title: 'Lab Digital',
    subtitle: 'Mystery Virus & Bakteri',
    icon: '🔬',
    color: '#0284c7',
    gradient: 'linear-gradient(135deg, #0284c7, #0369a1)',
    year: '1911 - Masa Kolonial',
    desc: 'Menganalisis & mengidentifikasi patogen penyebab wabah di bawah perbesaran mikroskop monitor digital 1000x! Ketuk gambar patogen untuk mencocokkan dengan kartu kategori yang tepat.',
    jenis: 'Action: Identifikasi Mikroskop Digital',
    kognitif: 'C2 (Memahami)',
    bgGradient: 'linear-gradient(135deg, #e0e7ff 0%, #bae6fd 100%)',
    artIcon: '🔬'
  },
  {
    id: 2,
    title: 'Jalur Penularan Kolera',
    subtitle: 'Drag & Drop Sanitasi Air Desa',
    icon: '🌊',
    color: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #0369a1, #0ea5e9)',
    year: '1950 - Pasca Kemerdekaan',
    desc: 'Hentikan rantai penularan kolera pada sumbernya! Seret dan lepas (drag & drop) kartu tindakan sanitasi (Air Bersih, Kaporitisasi, Jaga Kebersihan) ke pemukiman warga desa tepi sungai.',
    jenis: 'Simulation: Drag & Drop Sanitasi Desa',
    kognitif: 'C5 (Mengevaluasi)',
    bgGradient: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
    artIcon: '💧'
  },
  {
    id: 3,
    title: 'Misi Vaksin Cacar',
    subtitle: 'Vaksin Factory & Formulasi',
    icon: '🧪',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #6d28d9, #8b5cf6)',
    year: '1974 - Eradikasi Cacar WHO',
    desc: 'Racik kombinasi bahan baku yang sesuai untuk membuat vaksin cacar! Seret elemen bahan (Serum, Virus Lemah, Bakteri Lemah) ke dalam slot mesin peracik hingga pembuatan selesai.',
    jenis: 'Action: Formulasi Vaksin Factory',
    kognitif: 'C4 (Menganalisis)',
    bgGradient: 'linear-gradient(135deg, #f3e8ff 0%, #ddd6fe 100%)',
    artIcon: '🧪'
  },
  {
    id: 4,
    title: 'Ruang TBC',
    subtitle: 'Isolasi & Sanitasi Udara HEPA',
    icon: '🏥',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #047857, #10b981)',
    year: '2005 - Era Modern',
    desc: 'Pindahkan pasien terinfeksi TBC ke ruang isolasi yang memiliki fasilitas penyaring udara HEPA & UV! Seret ikon pasien bergejala batuk ke ruang isolasi bertekanan negatif.',
    jenis: 'Laboratory: Isolasi Airflow HEPA',
    kognitif: 'C3 (Mengaplikasikan)',
    bgGradient: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
    artIcon: '🏥'
  }
];


// HELPER: Timer bar component
function createTimerBar(durationSec, onTimeout) {
  const id = 'timer-' + Date.now();
  setTimeout(() => {
    const bar = document.getElementById(id);
    if (!bar) return;
    bar.style.transition = `width ${durationSec}s linear`;
    bar.style.width = '0%';
    setTimeout(() => {
      if (onTimeout) onTimeout();
    }, durationSec * 1000);
  }, 100);
  return `<div style="width:100%; height:8px; background:#1e293b; border-radius:99px; overflow:hidden; margin-bottom:8px;">
    <div id="${id}" style="width:100%; height:100%; background:linear-gradient(90deg, #10b981, #06b6d4); border-radius:99px;"></div>
  </div>`;
}

// HELPER: Score popup animation
function showScorePopup(container, points, x, y) {
  const popup = document.createElement('div');
  popup.textContent = `+${points}`;
  popup.style.cssText = `position:absolute; left:${x}px; top:${y}px; font-family:var(--font-heading); font-size:1.8rem; font-weight:900; color:#10b981; pointer-events:none; z-index:100; text-shadow:0 2px 8px rgba(16,185,129,0.5);`;
  popup.animate([
    { transform: 'translateY(0) scale(0.5)', opacity: 0 },
    { transform: 'translateY(-20px) scale(1.2)', opacity: 1, offset: 0.3 },
    { transform: 'translateY(-60px) scale(1)', opacity: 0 }
  ], { duration: 1200, easing: 'ease-out' });
  container.style.position = 'relative';
  setTimeout(() => popup.remove(), 1200);
}

// TUTORIAL DATA FOR ALL 4 LEVELS
const TUTORIAL_DATA = {

  1: {
    title: '🔬 TUTORIAL LEVEL 1: LAB DIGITAL — MYSTERY VIRUS & BAKTERI',
    subtitle: 'Menganalisis Morfologi Patogen di Bawah Perbesaran Mikroskop 1000x',
    icon: '🔬',
    steps: [
      {
        num: '1',
        title: 'Amati Slide Mikroskop Digital',
        desc: 'Perhatikan gambar sampel patogen yang muncul pada layar monitor mikroskop digital di tengah laboratorium.',
        badge: '🔍 TAHAP 1: PENGAMATAN'
      },
      {
        num: '2',
        title: 'Kenali Ciri Morfologi Patogen',
        desc: '• <strong>Bakteri 🧫</strong>: Bentuk bulat (Kokus), batang (Basil), atau spiral.<br/>• <strong>Virus 🦠</strong>: Struktur mahkota (Corona), ekor (Bakteriofag), atau ikosahedral.<br/>• <strong>Fungi 🍄</strong>: Struktur spora / miselium bercabang.',
        badge: '🧠 TAHAP 2: ANALISIS CIRI'
      },
      {
        num: '3',
        title: 'Pilih Kartu Kategori & Teka-Teki',
        desc: 'Klik / ketuk tombol kategori di panel bawah yang sesuai dengan hasil analisis mikroskopmu. Selesaikan juga teka-teki bagian struktur genom!',
        badge: '✅ TAHAP 3: IDENTIFIKASI'
      }
    ],
    tips: '💡 <strong>Tips Sanitarian:</strong> Setiap identifikasi tepat memberikan <strong>+20 Poin</strong> & meningkatkan akurasi diagnosa medis!'
  },
  2: {
    title: '🌊 TUTORIAL LEVEL 2: JALUR PENULARAN KOLERA (SANITASI DESA)',
    subtitle: 'Memutus Rantai Penularan Vibrio cholerae di Pemukiman Tepi Sungai',
    icon: '🌊',
    steps: [
      {
        num: '1',
        title: 'Identifikasi Titik Terkontaminasi',
        desc: 'Perhatikan 4 lokasi di kawasan desa tepi sungai yang berisiko menyebarkan kuman kolera (MCK Terbuka, Genangan Sungai, Dapur Warga, Sumber Air).',
        badge: '📍 TAHAP 1: SURVEI LAPANGAN'
      },
      {
        num: '2',
        title: 'Pilih & Seret Kartu Sanitasi',
        desc: 'Seret (drag & drop) atau klik kartu tindakan sanitasi dari rak bawah:<br/>• 🚰 <strong>Air Bersih / Sumur Terlindung</strong> -> Pasang di lokasi air tergenang/MCK<br/>• 🧪 <strong>Disinfeksi / Kaporitisasi</strong> -> Tuang ke genangan air terinfeksi<br/>• 🧼 <strong>Sabun Cuci Tangan (PHBS)</strong> -> Pasang di tempat cuci warga',
        badge: '🧰 TAHAP 2: INTERVENSI SANITASI'
      },
      {
        num: '3',
        title: 'Tingkatkan Kualitas Air Jadi 100%',
        desc: 'Selesaikan seluruh 4 titik penularan hingga indikator Kualitas Air Desa berubah menjadi <strong>100% HIJAU SEHAT</strong>!',
        badge: '🏆 TAHAP 3: ERADIKASI KOLERA'
      }
    ],
    tips: '💡 <strong>Tips Sanitarian:</strong> Sanitasi air & kebiasaan cuci tangan sabun (PHBS) adalah kunci utama membasmi wabah saluran pencernaan!'
  },
  3: {
    title: '🧪 TUTORIAL LEVEL 3: MISI VAKSIN CACAR (VAKSIN FACTORY)',
    subtitle: 'Meracik & Memformulasi Dosis Imunisasi Massal Eradikasi Cacar',
    icon: '🧪',
    steps: [
      {
        num: '1',
        title: 'Baca Resep Formulasi Mesin',
        desc: 'Perhatikan petunjuk resep di panel mesin peracik pabrik vaksin. Formulasi membutuhkan 3 slot bahan yang tepat!',
        badge: '📜 TAHAP 1: FORMULA MEDIS'
      },
      {
        num: '2',
        title: 'Masukkan Bahan Baku ke Slot',
        desc: 'Ketuk / seret vial bahan baku dari rak bawah ke dalam 3 slot mesin:<br/>• 🦠 <strong>Virus Cacar Lemah (Vaccinia/Cowpox)</strong><br/>• 💧 <strong>Air Steril Injeksi (Solvent)</strong><br/>• 🧪 <strong>Serum Stabilizer Antibodi</strong>',
        badge: '🧪 TAHAP 2: PERACIKAN SLOT'
      },
      {
        num: '3',
        title: 'Sintesis & Imunisasi Massal',
        desc: 'Tekan tombol <strong>"⚙️ MULAI RACIK & SINTESIS VAKSIN"</strong> untuk membuat dosis dan menyelamatkan 1000 warga desa!',
        badge: '💉 TAHAP 3: IMUNISASI MASSAL'
      }
    ],
    tips: '💡 <strong>Tips Sanitarian:</strong> Hati-hati! Memasukkan bahan berbahaya (seperti merkuri atau zat racun) akan menggagalkan formulasi!'
  },
  4: {
    title: '🏥 TUTORIAL LEVEL 4: RUANG TBC (ISOLASI & AIRFLOW HEPA)',
    subtitle: 'Mencegah Penularan Udara (Airborne) & Pengolahan Ruang Bertekanan Negatif',
    icon: '🏥',
    steps: [
      {
        num: '1',
        title: 'Periksa Rekam Medis Pasien',
        desc: 'Klik ikon ℹ️ pada setiap kartu pasien di antrean bawah untuk membaca keluhan, hasil rontgen/lab, dan rute penularan.',
        badge: '📋 TAHAP 1: DIAGNOSA PASIEN'
      },
      {
        num: '2',
        title: 'Pisahkan Pasien Airborne vs Kontak',
        desc: '• 🔴 <strong>Airborne (TBC / Flu Aerosol)</strong>: WAJIB ditaruh di <strong>Kamar HEPA Filter (Kamar 1, 3, atau 4)</strong>.<br/>• 🟢 <strong>Kontak / Non-Airborne (Demam/Pegal)</strong>: Ditaruh di <strong>Kamar Standar (Kamar 2, 5, atau 6)</strong>.',
        badge: '🚪 TAHAP 2: PENEMPATAN KAMAR'
      },
      {
        num: '3',
        title: 'Jalankan Simulasi Airflow',
        desc: 'Setelah seluruh 6 pasien terpasang di kamar isolasi, tekan tombol <strong>"CEK SIMULASI PENULARAN UDARA"</strong>!',
        badge: '💨 TAHAP 3: VERIFIKASI AIRFLOW'
      }
    ],
    tips: '💡 <strong>Tips Sanitarian:</strong> Mengisolasi pasien TBC di ruang HEPA mencegah aerosol kuman menyebar ke koridor dan pasien lain!'
  }
};

export function openLevelTutorialModal(levelNum = 1) {
  const data = TUTORIAL_DATA[levelNum] || TUTORIAL_DATA[1];
  audioEngine.playTap();

  const overlay = document.createElement('div');
  overlay.className = 'tutorial-modal-overlay';
  overlay.innerHTML = `
    <div class="tutorial-modal-card">
      <div class="tutorial-header-box">
        <div style="display:flex; align-items:center; gap:12px;">
          <span style="font-size:2rem;">${data.icon}</span>
          <div>
            <h3 class="tutorial-title-text">${data.title}</h3>
            <span class="tutorial-subtitle-text">${data.subtitle}</span>
          </div>
        </div>
        <button id="close-tutorial-modal" style="background:none; border:none; color:#94a3b8; font-size:1.5rem; cursor:pointer;">✖</button>
      </div>

      <div class="tutorial-steps-container">
        ${data.steps.map(s => `
          <div class="tutorial-step-card">
            <div class="tutorial-step-num-badge">${s.num}</div>
            <div class="tutorial-step-body">
              <span class="tutorial-step-tag">${s.badge}</span>
              <h4 class="tutorial-step-heading">${s.title}</h4>
              <div class="tutorial-step-desc">${s.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="tutorial-tips-box">
        ${data.tips}
      </div>

      <button id="btn-start-game-cta" class="btn-start-game-cta">
        🚀 SAYA SIAP BERMAIN! MULAI LEVEL ${levelNum}
      </button>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector('#close-tutorial-modal')?.addEventListener('click', () => overlay.remove());
  overlay.querySelector('#btn-start-game-cta')?.addEventListener('click', () => {
    audioEngine.playSuccess();
    overlay.remove();
  });
}

export function renderMinigameView(params = {}) {
  let activeLevel = params.level || params.eraId || 1;
  if (activeLevel > 4) activeLevel = 4;
  if (activeLevel < 1) activeLevel = 1;

  const container = document.createElement('div');
  container.className = 'minigame-container view-content';

  // ─── HEADER ─────────────────────────────────────────────────────────
  function renderHeader() {
    const meta = LEVEL_METADATA[activeLevel - 1];

    return `
      <div class="game-top-bar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; width: 100%;">
        <button id="btn-minigame-back" class="btn-pill-back">
          &larr; Pilihan Level
        </button>
        <div style="background: rgba(15, 23, 42, 0.9); border: 1.5px solid #0284c7; border-radius: 12px; padding: 8px 24px; color: #ffffff; font-weight: 800; font-family: var(--font-heading); letter-spacing: 0.5px; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.3);">
          LEVEL ${meta.id}: ${meta.title.toUpperCase()}
        </div>
        <button id="btn-open-tutorial" style="background: linear-gradient(135deg, #f59e0b, #d97706); border: 1.5px solid #fef08a; border-radius: 12px; padding: 8px 18px; color: #ffffff; font-weight: 800; font-size: 0.88rem; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);">
          ❓ CARA BERMAIN
        </button>
      </div>
    `;
  }

  function renderActiveLevelContent() {
    switch (activeLevel) {
      case 1: return renderLevel1LabDigital();
      case 2: return renderLevel2Kolera();
      case 3: return renderLevel3VaksinFactory();
      case 4: return renderLevel4RuangTBC();
      default: return renderLevel1LabDigital();
    }
  }

  function buildUI() {
    container.innerHTML = `
      ${renderHeader()}
      <div id="level-stage-container" class="game-stage">
        ${renderActiveLevelContent()}
      </div>
    `;
    attachGlobalEvents();

    // Trigger tutorial popup automatically every time a level starts
    setTimeout(() => {
      openLevelTutorialModal(activeLevel);
    }, 250);
  }


  function attachGlobalEvents() {
    container.querySelector('#btn-minigame-back')?.addEventListener('click', () => {
      audioEngine.playTap();
      router.navigate('map');
    });

    container.querySelector('#btn-open-tutorial')?.addEventListener('click', () => {
      openLevelTutorialModal(activeLevel);
    });
  }


  // ═══════════════════════════════════════════════════════════════════════
  // HELPER: PATHOGEN MODEL SVG RENDERER
  // ═══════════════════════════════════════════════════════════════════════
  function renderPathogenModelSVG(correctId) {
    if (correctId === 'opt-virus') {
      return `
        <div class="pathogen-interactive-stage">
          <div class="pathogen-img-wrapper">
            <img src="/images/game/pathogen_virus.png" alt="Virus Pathogen 3D" class="pathogen-illustration-img pathogen-glow-red" />
          </div>

          <!-- Garis Petunjuk Overlay (SVG Pointer Lines) -->
          <svg class="pointer-svg-overlay" viewBox="0 0 440 280">
            <!-- Line 1: Protein Spike (Top Right) -->
            <path d="M 260 90 L 310 50 L 330 50" class="pointer-line-path" />
            <circle cx="260" cy="90" r="5" class="pointer-dot-target" />

            <!-- Line 2: Kapsid Selubung (Top Left) -->
            <path d="M 180 85 L 130 50 L 110 50" class="pointer-line-path" />
            <circle cx="180" cy="85" r="5" class="pointer-dot-target" />

            <!-- Line 3: Materi Genetik RNA (Bottom Left) -->
            <path d="M 195 175 L 140 225 L 110 225" class="pointer-line-path" />
            <circle cx="195" cy="175" r="5" class="pointer-dot-target" />

            <!-- Line 4: Membran Lipid / Envelope (Bottom Right - TEKA TEKI) -->
            <path d="M 250 185 L 300 230 L 330 230" class="pointer-line-path line-puzzle" />
            <circle cx="250" cy="185" r="6" class="pointer-dot-target dot-puzzle" />
          </svg>

          <!-- Label Garis Petunjuk Callout Boxes -->
          <div class="pointer-label-box label-top-right">
            <span class="pointer-label-title">1. Glikoprotein Spike (S)</span>
            <span class="pointer-label-desc">Tonjolan penempel sel inang</span>
          </div>

          <div class="pointer-label-box label-top-left">
            <span class="pointer-label-title">2. Kapsid Protein</span>
            <span class="pointer-label-desc">Cangkang pelindung genom</span>
          </div>

          <div class="pointer-label-box label-bottom-left">
            <span class="pointer-label-title">3. Genom RNA Utuh</span>
            <span class="pointer-label-desc">Materi genetik utama virus</span>
          </div>

          <div class="pointer-label-box label-bottom-right label-puzzle" id="puzzle-label-callout">
            <span class="pointer-label-title">4. ❓ [TEKA-TEKI #1]</span>
            <span class="pointer-label-desc">Lapisan sasaran sabun/alkohol</span>
          </div>
        </div>
      `;
    } else if (correctId === 'opt-bakteri') {
      return `
        <div class="pathogen-interactive-stage">
          <div class="pathogen-img-wrapper">
            <img src="/images/game/pathogen_bacteria.png" alt="Bakteri Pathogen 3D" class="pathogen-illustration-img pathogen-glow-blue" />
          </div>

          <!-- Garis Petunjuk Overlay (SVG Pointer Lines) -->
          <svg class="pointer-svg-overlay" viewBox="0 0 440 280">
            <!-- Line 1: Flagela (Top Right - TEKA TEKI) -->
            <path d="M 270 75 L 310 45 L 330 45" class="pointer-line-path line-puzzle" />
            <circle cx="270" cy="75" r="6" class="pointer-dot-target dot-puzzle" />

            <!-- Line 2: Dinding Sel (Top Left) -->
            <path d="M 170 95 L 130 55 L 110 55" class="pointer-line-path" />
            <circle cx="170" cy="95" r="5" class="pointer-dot-target" />

            <!-- Line 3: Nukleoid DNA (Bottom Left) -->
            <path d="M 190 170 L 140 220 L 110 220" class="pointer-line-path" />
            <circle cx="190" cy="170" r="5" class="pointer-dot-target" />

            <!-- Line 4: Plasmid / Ribosom (Bottom Right) -->
            <path d="M 255 170 L 300 225 L 330 225" class="pointer-line-path" />
            <circle cx="255" cy="170" r="5" class="pointer-dot-target" />
          </svg>

          <!-- Label Garis Petunjuk Callout Boxes -->
          <div class="pointer-label-box label-top-right label-puzzle" id="puzzle-label-callout">
            <span class="pointer-label-title">1. ❓ [TEKA-TEKI #2]</span>
            <span class="pointer-label-desc">Filamen cambuk gerak berenang</span>
          </div>

          <div class="pointer-label-box label-top-left">
            <span class="pointer-label-title">2. Dinding Peptidoglikan</span>
            <span class="pointer-label-desc">Penyokong kaku & osmotik sel</span>
          </div>

          <div class="pointer-label-box label-bottom-left">
            <span class="pointer-label-title">3. Nukleoid DNA Sirkular</span>
            <span class="pointer-label-desc">Genom tanpa membran inti</span>
          </div>

          <div class="pointer-label-box label-bottom-right">
            <span class="pointer-label-title">4. Ribosom 70S & Plasmid</span>
            <span class="pointer-label-desc">Pabrik sintesis protein sel</span>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="pathogen-interactive-stage">
          <div class="pathogen-img-wrapper">
            <img src="/images/game/pathogen_fungus.png" alt="Jamur Pathogen 3D" class="pathogen-illustration-img pathogen-glow-amber" />
          </div>

          <!-- Garis Petunjuk Overlay (SVG Pointer Lines) -->
          <svg class="pointer-svg-overlay" viewBox="0 0 440 280">
            <!-- Line 1: Sporangium (Top Right - TEKA TEKI) -->
            <path d="M 260 80 L 310 45 L 330 45" class="pointer-line-path line-puzzle" />
            <circle cx="260" cy="80" r="6" class="pointer-dot-target dot-puzzle" />

            <!-- Line 2: Hifa Filamen (Top Left) -->
            <path d="M 175 100 L 130 60 L 110 60" class="pointer-line-path" />
            <circle cx="175" cy="100" r="5" class="pointer-dot-target" />

            <!-- Line 3: Spora Fungi (Bottom Left) -->
            <path d="M 185 180 L 140 225 L 110 225" class="pointer-line-path" />
            <circle cx="185" cy="180" r="5" class="pointer-dot-target" />

            <!-- Line 4: Dinding Kitin (Bottom Right) -->
            <path d="M 250 175 L 300 225 L 330 225" class="pointer-line-path" />
            <circle cx="250" cy="175" r="5" class="pointer-dot-target" />
          </svg>

          <!-- Label Garis Petunjuk Callout Boxes -->
          <div class="pointer-label-box label-top-right label-puzzle" id="puzzle-label-callout">
            <span class="pointer-label-title">1. ❓ [TEKA-TEKI #3]</span>
            <span class="pointer-label-desc">Wadah pembentuk spora fungi</span>
          </div>

          <div class="pointer-label-box label-top-left">
            <span class="pointer-label-title">2. Hifa Filamen Miselium</span>
            <span class="pointer-label-desc">Benang penyerap nutrisi inang</span>
          </div>

          <div class="pointer-label-box label-bottom-left">
            <span class="pointer-label-title">3. Spora Air-borne</span>
            <span class="pointer-label-desc">Sel tersebar bebas di udara</span>
          </div>

          <div class="pointer-label-box label-bottom-right">
            <span class="pointer-label-title">4. Dinding Kitin Eukariotik</span>
            <span class="pointer-label-desc">Pelindung dari polimer kitin</span>
          </div>
        </div>
      `;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // LEVEL 1: LAB DIGITAL (REFERENCE IMPLEMENTATION)
  // ═══════════════════════════════════════════════════════════════════════
  function renderLevel1LabDigital() {
    const cases = [
      {
        id: 1,
        sampleName: 'PATHOGEN A-113: STATUS - ANALYZING',
        correctId: 'opt-virus',
        title: 'Sampel 1/3 — Virus Pandemi 2020',
        clue: 'TUJUAN: Pecahkan teka-teki struktur [❓ TEKA-TEKI #1], lalu pilih klasifikasi jenis patogen di bawah.',
        puzzleTitle: 'TEKA-TEKI 1: Membran Pelindung Virus',
        puzzleQuestion: 'Perhatikan <strong>Garis Petunjuk 4 [❓ TEKA-TEKI #1]</strong>. Membran lemak (envelope) yang melingkupi kapsid virus ini sangat rapuh dan dapat dihancurkan oleh sabun & alkohol. Bagian apakah ini...?',
        puzzleOptions: [
          { text: 'Membran Lipid (Envelope)', isCorrect: true },
          { text: 'Dinding Sel Peptidoglikan', isCorrect: false },
          { text: 'Sporangium Fungi', isCorrect: false },
          { text: 'Flagela Cambuk', isCorrect: false }
        ],
        puzzleAnswerLabel: '4. Membran Lipid (Envelope)'
      },
      {
        id: 2,
        sampleName: 'PATHOGEN B-1911: STATUS - ANALYZING',
        correctId: 'opt-bakteri',
        title: 'Sampel 2/3 — Bakteri Pes 1911',
        clue: 'TUJUAN: Pecahkan teka-teki struktur [❓ TEKA-TEKI #2], lalu pilih klasifikasi jenis patogen di bawah.',
        puzzleTitle: 'TEKA-TEKI 2: Alat Gerak Berenang Bakteri',
        puzzleQuestion: 'Perhatikan <strong>Garis Petunjuk 1 [❓ TEKA-TEKI #2]</strong>. Struktur cambuk filamen panjang di permukaan bakteri ini bertugas mendorong pergerakan berenang di dalam cairan. Bagian apakah ini...?',
        puzzleOptions: [
          { text: 'Flagela (Cambuk Gerak)', isCorrect: true },
          { text: 'Protein Spike Glikoprotein', isCorrect: false },
          { text: 'Selubung Kapsid', isCorrect: false },
          { text: 'Spora Generatif', isCorrect: false }
        ],
        puzzleAnswerLabel: '1. Flagela (Cambuk Gerak)'
      },
      {
        id: 3,
        sampleName: 'PATHOGEN C-2005: STATUS - ANALYZING',
        correctId: 'opt-jamur',
        title: 'Sampel 3/3 — Fungi Spora Zoonosis',
        clue: 'TUJUAN: Pecahkan teka-teki struktur [❓ TEKA-TEKI #3], lalu pilih klasifikasi jenis patogen di bawah.',
        puzzleTitle: 'TEKA-TEKI 3: Wadah Pembentuk Spora Fungi',
        puzzleQuestion: 'Perhatikan <strong>Garis Petunjuk 1 [❓ TEKA-TEKI #3]</strong>. Kantung bulat di ujung hifa tempat pembentukan dan penyebaran jutaan spora ke udara dinamakan...?',
        puzzleOptions: [
          { text: 'Sporangium (Wadah Spora)', isCorrect: true },
          { text: 'Ribosom 70S', isCorrect: false },
          { text: 'Envelope Lipid', isCorrect: false },
          { text: 'Nukleoid Sirkular', isCorrect: false }
        ],
        puzzleAnswerLabel: '1. Sporangium (Wadah Spora)'
      }
    ];

    let caseIndex = 0;
    let score1 = 0;
    let puzzleSolved = false;

    setTimeout(() => {
      const stage = container.querySelector('#level1-stage');
      if (!stage) return;

      function loadCase() {
        const c = cases[caseIndex];
        puzzleSolved = false;

        stage.innerHTML = `
          <div class="lab-digital-ref-container">
            
            <!-- LEFT COLUMN: DIGITAL MICROSCOPE MONITOR -->
            <div class="lab-monitor-wrapper">
              
              <!-- Monitor Top Bezel -->
              <div class="monitor-top-bezel">
                <span class="bezel-btn">⑈</span>
                <span class="bezel-btn">ℹ</span>
                <div class="bezel-leds">
                  <span class="led"></span>
                  <span class="led"></span>
                  <span class="led"></span>
                  <span class="led blue"></span>
                </div>
              </div>

              <!-- Main Screen Display -->
              <div class="monitor-screen-display">
                <div class="screen-header-bar">
                  <span class="pathogen-id-text">${c.sampleName}</span>
                  <span class="screen-status-badge">4K DIGI</span>
                </div>

                <!-- Pathogen Render Stage -->
                <div class="pathogen-render-stage">
                  ${renderPathogenModelSVG(c.correctId)}
                </div>

                <!-- Screen Footer -->
                <div class="screen-footer-bar">
                  <span class="footer-level-text">LEVEL 1: LAB DIGITAL</span>
                  <div class="footer-leds">🟢 🔵 🔴</div>
                  <span class="footer-id-text">ID: 0047-Z</span>
                </div>
              </div>

              <!-- Stand Base -->
              <div class="monitor-stand-base"></div>
            </div>

            <!-- RIGHT COLUMN: CONTROL PANEL -->
            <div class="lab-control-panel">
              
              <!-- INSTRUKSI CARD -->
              <div class="panel-card instruksi-card">
                <div class="panel-card-header">INSTRUKSI</div>
                <div class="panel-card-body">
                  <strong>TUJUAN:</strong> ${c.clue}
                </div>
              </div>

              <!-- TEKA-TEKI DIAGNOSTIK CARD -->
              <div class="panel-card teka-teki-card">
                <div class="panel-card-header" style="display:flex; align-items:center; justify-content:space-between;">
                  <span>🧩 ${c.puzzleTitle}</span>
                  <span class="puzzle-badge">+100 POIN</span>
                </div>
                <div class="panel-card-body" style="padding: 10px 0 0 0;">
                  <p class="puzzle-question">${c.puzzleQuestion}</p>
                  <div class="puzzle-options-grid">
                    ${c.puzzleOptions.map((opt, idx) => `
                      <button class="puzzle-opt-btn" data-correct="${opt.isCorrect}">
                        <span class="opt-letter">${String.fromCharCode(65 + idx)}</span>
                        <span class="opt-text">${opt.text}</span>
                      </button>
                    `).join('')}
                  </div>
                </div>
              </div>

              <!-- KARTU PILIHAN KATEGORI CARD -->
              <div class="panel-card kategori-card locked-card">
                <div class="panel-card-header" style="display:flex; align-items:center; justify-content:space-between;">
                  <span>KLASIFIKASI PATOGEN</span>
                  <span class="lock-status-badge" id="category-lock-badge">🔒 SELESAIKAN TEKA-TEKI</span>
                </div>
                <div class="panel-card-body categories-stack">
                  
                  <!-- OPTION A: BAKTERI -->
                  <div class="category-option-item" data-id="opt-bakteri">
                    <div class="cat-icon-box">
                      <img src="/images/game/pathogen_bacteria.png" alt="Bakteri" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid #38bdf8; box-shadow: 0 0 10px rgba(56, 189, 248, 0.5);" />
                    </div>
                    <div class="cat-info">
                      <h4 class="cat-title">A. BAKTERI</h4>
                      <p class="cat-desc">Sel prokariotik, lebih besar, berbentuk batang/bola.</p>
                    </div>
                  </div>

                  <!-- OPTION B: VIRUS -->
                  <div class="category-option-item" data-id="opt-virus">
                    <div class="cat-icon-box">
                      <img src="/images/game/pathogen_virus.png" alt="Virus" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid #f43f5e; box-shadow: 0 0 10px rgba(244, 63, 94, 0.5);" />
                    </div>
                    <div class="cat-info">
                      <h4 class="cat-title">B. VIRUS</h4>
                      <p class="cat-desc">Mikroskopis, tidak bersel, memiliki materi genetik & selubung protein.</p>
                    </div>
                  </div>

                  <!-- OPTION C: JAMUR/FUNGI -->
                  <div class="category-option-item" data-id="opt-jamur">
                    <div class="cat-icon-box">
                      <img src="/images/game/pathogen_fungus.png" alt="Jamur" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid #f59e0b; box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);" />
                    </div>
                    <div class="cat-info">
                      <h4 class="cat-title">C. JAMUR/FUNGI</h4>
                      <p class="cat-desc">Eukariotik, struktur berfilamen (hifa/spora).</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>
        `;

        // Handle Puzzle Option Buttons
        stage.querySelectorAll('.puzzle-opt-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            if (puzzleSolved) return;
            const isCorrect = btn.getAttribute('data-correct') === 'true';

            if (isCorrect) {
              puzzleSolved = true;
              audioEngine.playSuccess();
              btn.classList.add('correct');
              score1 += 100;
              gameState.addPoints(100);

              // Unlock category selection card
              const katCard = stage.querySelector('.kategori-card');
              if (katCard) {
                katCard.classList.remove('locked-card');
                katCard.classList.add('unlocked-card');
              }
              const lockBadge = stage.querySelector('#category-lock-badge');
              if (lockBadge) {
                lockBadge.classList.add('unlocked');
                lockBadge.innerHTML = '🔓 TERBUKA - PILIH PATOGEN';
              }

              // Reveal name in puzzle callout box
              const callout = stage.querySelector('#puzzle-label-callout');
              if (callout) {
                callout.classList.remove('label-puzzle');
                callout.style.borderColor = '#10b981';
                callout.style.background = 'rgba(6, 78, 59, 0.95)';
                callout.innerHTML = `
                  <span class="pointer-label-title" style="color: #6ee7b7;">${c.puzzleAnswerLabel}</span>
                  <span class="pointer-label-desc" style="color: #a7f3d0;">✅ Terverifikasi Benar!</span>
                `;
              }

              showScorePopup(stage, 100, e.clientX - stage.getBoundingClientRect().left, e.clientY - stage.getBoundingClientRect().top);
              showToast('🔓 TEPAT SEKALI! Teka-teki terpecahkan & Pilihan Patogen Terbuka! (+100 Poin)');
            } else {
              audioEngine.playWrong();
              btn.classList.add('wrong');
              showToast('❌ Kurang tepat! Perhatikan clue garis petunjuk struktur di layar.');
              setTimeout(() => btn.classList.remove('wrong'), 800);
            }
          });
        });

        // Handle Category Option Selection
        stage.querySelectorAll('.category-option-item').forEach(card => {
          card.addEventListener('click', (e) => {
            if (!puzzleSolved) {
              audioEngine.playWrong();
              showToast('🔒 Selesaikan teka-teki struktur [❓ TEKA-TEKI] di atas terlebih dahulu!');
              const puzzleCard = stage.querySelector('.teka-teki-card');
              if (puzzleCard) {
                puzzleCard.classList.add('wrong');
                setTimeout(() => puzzleCard.classList.remove('wrong'), 800);
              }
              return;
            }

            const selected = card.getAttribute('data-id');
            if (selected === c.correctId) {
              audioEngine.playSuccess();
              card.classList.add('correct');
              score1 += 50;
              gameState.addPoints(50);
              showScorePopup(stage, 50, e.clientX - stage.getBoundingClientRect().left, e.clientY - stage.getBoundingClientRect().top);
              showToast('🎯 BENAR! Klasifikasi patogen terverifikasi! (+50 Poin)');

              setTimeout(() => {
                caseIndex++;
                if (caseIndex < cases.length) {
                  loadCase();
                } else {
                  renderVictoryScreen(1, 'Detektif Patogen', `Kamu berhasil mengidentifikasi seluruh sampel patogen & memecahkan teka-teki struktur laboratorium digital!`, score1);
                }
              }, 1200);
            } else {
              audioEngine.playWrong();
              card.classList.add('wrong');
              showToast('❌ Kurang tepat! Amati struktur visual patogen di monitor.');
              setTimeout(() => card.classList.remove('wrong'), 800);
            }
          });
        });
      }

      loadCase();
    }, 50);

    return `<div id="level1-stage"></div>`;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // LEVEL 2: JALUR PENULARAN KOLERA (DRAG & DROP SANITASI)
  // ═══════════════════════════════════════════════════════════════════════
  function renderLevel2Kolera() {
    let sanitizedCount = 0;
    const totalSpots = 4;

    const problemDetails = {
      air_bersih: {
        title: '📍 INVESTIGASI: Area Minum Warga Desa',
        status: '⚠️ TERCEMAR BAKTERI KOLERA!',
        desc: 'Warga desa sering mengambil air minum langsung dari gentong terbuka yang diisi air sungai tercemar tanpa proses penyaringan. Bakteri <i>Vibrio cholerae</i> berkembang cepat di wadah ini!',
        solusiIcon: '🚰',
        solusiName: 'AIR BERSIH & FILTER',
        solusiText: 'Sediakan pasokan air bersih terfilter & gentong tertutup higienis.'
      },
      masak_air: {
        title: '📍 INVESTIGASI: Area Cuci & Tempat Minum Mentah',
        status: '⚠️ BAHAYA AIR MENTAH!',
        desc: 'Warga meminum dan memasak memakai air mentah dari sungai tanpa mendidihkannya hingga 100°C. Bakteri kolera hidup masuk ke sistem pencernaan warga!',
        solusiIcon: '🫖',
        solusiName: 'MASAK AIR HINGGA MENDIDIH',
        solusiText: 'Rebus air hingga mendidih (100°C) sebelum dikonsumsi warga.'
      },
      jaga_kebersihan: {
        title: '📍 INVESTIGASI: Area Bermain Anak & Jalan Desa',
        status: '⚠️ BURUKNYA HYGIENE TANGAN!',
        desc: 'Anak-anak dan warga beraktivitas di tanah dan makan memakai tangan kotor tanpa mencuci tangan dengan sabun. Kuman kolera berpindah dari tangan ke mulut!',
        solusiIcon: '🧼',
        solusiName: 'JAGA KEBERSIHAN & SABUN',
        solusiText: 'Sediakan sarana cuci tangan dengan sabun di tempat umum.'
      },
      difantasi: {
        title: '📍 INVESTIGASI: Area Sanitasi & Kebun Pemukiman',
        status: '⚠️ BUANG AIR SEMBARANGAN (BABS)!',
        desc: 'Pemukiman desa belum memiliki jamban sehat (MCK tertutup). Kotoran warga mencemari tanah dan mengalir ke sungai saat hujan deras membawa kuman wabah!',
        solusiIcon: '🚽',
        solusiName: 'DIFANTASI (JAMBAN SEHAT MCK)',
        solusiText: 'Bangun fasilitas jamban sehat tertutup & septik tank desa.'
      }
    };

    const processFlows = {
      air_bersih: {
        icon: '🚰',
        title: 'PROSES LAB 1: Penyaringan Air Sungai Bertingkat',
        sub: 'Tumpuk 3 lapisan filter secara berurutan di dalam tabung penyaring!',
        steps: [
          {
            num: 1, icon: '🪨', title: 'Pasang Lapisan Kerikil & Batu (Dasar)',
            desc: 'Menyaring kotoran kasar, dedaunan, dan lumpur pekat.',
            cumulativeHTML: `
              <div class="visual-stack-container">
                <div class="process-png-card">
                  <img src="/images/game/filter_step1.png" alt="Filter Step 1 Kerikil" class="process-step-png-img" />
                </div>
                <div class="filter-cylinder-frame">
                  <div class="stack-layer layer-base">🪨 LAPISAN 1: Kerikil & Batu Dasar (Terpasang di Dasar Tabung)</div>
                </div>
                <div class="stack-status-desc">✨ Batu & Kerikil terpasang rapat di dasar tabung penyaring!</div>
              </div>
            `
          },
          {
            num: 2, icon: '🪵', title: 'Tambahkan Arang Kayu & Pasir (Tengah)',
            desc: 'Menyerap kuman, bau tak sedap, dan racun cemaran.',
            cumulativeHTML: `
              <div class="visual-stack-container">
                <div class="process-png-card">
                  <img src="/images/game/filter_step2.png" alt="Filter Step 2 Arang Kayu" class="process-step-png-img" />
                </div>
                <div class="filter-cylinder-frame">
                  <div class="stack-layer layer-mid">🪵 LAPISAN 2: Arang Kayu & Pasir (Menyerap Bau & Racun)</div>
                  <div class="stack-layer layer-base">🪨 LAPISAN 1: Kerikil & Batu Dasar (Terpasang)</div>
                </div>
                <div class="stack-status-desc">✨ Arang kayu & Pasir ditumpuk di atas lapisan kerikil dasar!</div>
              </div>
            `
          },
          {
            num: 3, icon: '🧻', title: 'Lapisi Kapas & Kain Filter (Atas)',
            desc: 'Menyaring partikel renik hingga air jernih berkilau.',
            cumulativeHTML: `
              <div class="visual-stack-container">
                <div class="process-png-card">
                  <img src="/images/game/filter_step3.png" alt="Filter Step 3 Air Bersih Sempurna" class="process-step-png-img" />
                </div>
                <div class="filter-cylinder-frame">
                  <div class="water-flow-stream">🌊 Air Sungai Keruh ➔ 🧻 ➔ 🪵 ➔ 🪨 ➔ 💧 ✨ AIR JERNIH</div>
                  <div class="stack-layer layer-top">🧻 LAPISAN 3: Kapas & Kain Filter (Menyaring Partikel Renik)</div>
                  <div class="stack-layer layer-mid">🪵 LAPISAN 2: Arang Kayu & Pasir (Menyerap Bau & Racun)</div>
                  <div class="stack-layer layer-base">🪨 LAPISAN 1: Kerikil & Batu Dasar (Menyaring Kotoran Kasar)</div>
                </div>
                <div class="stack-status-desc">🎉 Filter 3 lapis sempurna! Air sungai keruh berhasil disaring jernih!</div>
              </div>
            `
          }
        ]
      },
      masak_air: {
        icon: '🫖',
        title: 'PROSES LAB 2: Sterilisasi Mendidih (Suhu 100°C)',
        sub: 'Tumpuk tahapan api, panci air mentah, hingga mendidih 100°C!',
        steps: [
          {
            num: 1, icon: '🔥', title: 'Nyalakan Tungku Api Membara',
            desc: 'Siapkan energi panas pembunuh bakteri.',
            cumulativeHTML: `
              <div class="visual-stack-container">
                <div class="process-png-card">
                  <img src="/images/game/boil_step3.png" alt="Api Membara" class="process-step-png-img" style="opacity: 0.6; filter: hue-rotate(-20deg);" />
                </div>
                <div class="process-stage-illustration">
                  <div class="sim-item item-fire">🔥 Tungku Api Membara Panas</div>
                </div>
                <div class="stack-status-desc">✨ Api tungku telah membara di dasar perebusan.</div>
              </div>
            `
          },
          {
            num: 2, icon: '🫖', title: 'Tuangkan Air Sungai ke Panci',
            desc: 'Isi wadah perebusan dengan air mentah.',
            cumulativeHTML: `
              <div class="visual-stack-container">
                <div class="process-png-card">
                  <img src="/images/game/boil_step3.png" alt="Panci Di Atas Tungku" class="process-step-png-img" style="opacity: 0.85;" />
                </div>
                <div class="process-stage-illustration">
                  <div class="sim-item item-pot">🫖 Panci Berisi Air Sungai Mentah</div>
                  <div class="sim-item item-fire">🔥 Tungku Api Membara Panas (Sedang Memanasi Panci)</div>
                </div>
                <div class="stack-status-desc">✨ Panci air mentah diletakkan di atas api tungku.</div>
              </div>
            `
          },
          {
            num: 3, icon: '⏱️', title: 'Tahan Mendidih 100°C (3 Menit)',
            desc: 'Panas 100°C merusak sel bakteri kolera hingga mati total.',
            cumulativeHTML: `
              <div class="visual-stack-container">
                <div class="process-png-card">
                  <img src="/images/game/boil_step3.png" alt="Air Mendidih 100 Deg C" class="process-step-png-img" />
                </div>
                <div class="process-stage-illustration">
                  <div class="sim-item item-boiling">💨 🫖 Air Mendidih 100°C! (Uap Panas Steril)</div>
                  <div class="sim-item item-fire">🔥 Tungku Api Membara Panas</div>
                  <div class="sim-item item-dead-germs">💥 🦠 Sel Bakteri Kolera Mati Total!</div>
                </div>
                <div class="stack-status-desc">🎉 Mendidih 100°C! Seluruh kuman kolera musnah!</div>
              </div>
            `
          }
        ]
      },
      jaga_kebersihan: {
        icon: '🧼',
        title: 'PROSES LAB 3: Prosedur Cuci Tangan 6 Langkah',
        sub: 'Lakukan tahapan pembusaan sabun, penggosokan sela jari, dan pembilasan air!',
        steps: [
          {
            num: 1, icon: '🧼', title: 'Lumuri Sabun Antibakteri',
            desc: 'Merusak lapisan lemak sel bakteri pada kulit.',
            cumulativeHTML: `
              <div class="visual-stack-container">
                <div class="process-png-card">
                  <img src="/images/game/wash_step3.png" alt="Busa Sabun" class="process-step-png-img" style="opacity: 0.6;" />
                </div>
                <div class="process-stage-illustration">
                  <div class="sim-item item-soap">🧼 Busa Sabun Antibakteri Melingkupi Tangan</div>
                </div>
                <div class="stack-status-desc">✨ Busa sabun merusak dinding lemak sel kuman.</div>
              </div>
            `
          },
          {
            num: 2, icon: '🤲', title: 'Gosok Sela-sela Jari & Punggung',
            desc: 'Membersihkan area tersembunyi yang tertempel kuman.',
            cumulativeHTML: `
              <div class="visual-stack-container">
                <div class="process-png-card">
                  <img src="/images/game/wash_step3.png" alt="Gosok Sela Jari" class="process-step-png-img" style="opacity: 0.85;" />
                </div>
                <div class="process-stage-illustration">
                  <div class="sim-item item-scrub">🤲 Sela-sela Jari & Punggung Tangan Digosok</div>
                  <div class="sim-item item-soap">🧼 Busa Sabun Antibakteri Aktif</div>
                </div>
                <div class="stack-status-desc">✨ Gesekan sabun merontokkan kuman tersembunyi.</div>
              </div>
            `
          },
          {
            num: 3, icon: '🚰', title: 'Bilas Air Mengalir & Keringkan',
            desc: 'Menghanyutkan kuman mati keluar dari tangan.',
            cumulativeHTML: `
              <div class="visual-stack-container">
                <div class="process-png-card">
                  <img src="/images/game/wash_step3.png" alt="Bilas Tangan Bersih" class="process-step-png-img" />
                </div>
                <div class="process-stage-illustration">
                  <div class="sim-item item-rinse">🚰 Air Mengalir Membilas Busa & Kuman</div>
                  <div class="sim-item item-scrub">🤲 Sela-sela Jari Bersih Bebas Kuman</div>
                  <div class="sim-item item-soap">✨ Tangan 100% Higienis & Bebas Kuman!</div>
                </div>
                <div class="stack-status-desc">🎉 Pembilasan sempurna! Tangan bebas dari kuman wabah!</div>
              </div>
            `
          }
        ]
      },
      difantasi: {
        icon: '🚽',
        title: 'PROSES LAB 4: Pembangunan MCK & Septik Tank',
        sub: 'Tumpuk konstruksi galian resapan, kloset leher angsa, hingga bilik MCK!',
        steps: [
          {
            num: 1, icon: '⛏️', title: 'Gali Lubang Penampungan Resapan',
            desc: 'Membuat tempat penampungan kedap air tanah.',
            cumulativeHTML: `
              <div class="visual-stack-container">
                <div class="process-png-card">
                  <img src="/images/game/mck_step3.png" alt="Galian Septik Tank" class="process-step-png-img" style="opacity: 0.6; filter: sepia(0.6);" />
                </div>
                <div class="process-stage-illustration">
                  <div class="sim-item item-pit">⛏️ 🕳️ Lubang Septik Tank Digali Kedap Air</div>
                </div>
                <div class="stack-status-desc">✨ Lubang resapan septik tank selesai digali.</div>
              </div>
            `
          },
          {
            num: 2, icon: '🚽', title: 'Pasang Kloset Leher Angsa',
            desc: 'Menahan serangga lalat & mengunci bau kotoran.',
            cumulativeHTML: `
              <div class="visual-stack-container">
                <div class="process-png-card">
                  <img src="/images/game/mck_step3.png" alt="Kloset Leher Angsa" class="process-step-png-img" style="opacity: 0.85;" />
                </div>
                <div class="process-stage-illustration">
                  <div class="sim-item item-toilet">🚽 Kloset Leher Angsa Terpasang Kedap Bau</div>
                  <div class="sim-item item-pit">⛏️ 🕳️ Lubang Septik Tank Digali Kedap Air</div>
                </div>
                <div class="stack-status-desc">✨ Kloset leher angsa terpasang di atas lubang resapan.</div>
              </div>
            `
          },
          {
            num: 3, icon: '🛖', title: 'Tutup Bilik Bangunan MCK',
            desc: 'Mencegah pencemaran air sungai saat hujan deras.',
            cumulativeHTML: `
              <div class="visual-stack-container">
                <div class="process-png-card">
                  <img src="/images/game/mck_step3.png" alt="Bangunan MCK Lengkap" class="process-step-png-img" />
                </div>
                <div class="process-stage-illustration">
                  <div class="sim-item item-building">🛖 Bilik Pelindung MCK Tertutup Rapat</div>
                  <div class="sim-item item-toilet">🚽 Kloset Leher Angsa Terpasang Kedap Bau</div>
                  <div class="sim-item item-pit">⛏️ 🕳️ Lubang Septik Tank Digali Kedap Air</div>
                </div>
                <div class="stack-status-desc">🎉 Fasilitas MCK sehat desa selesai dibangun utuh!</div>
              </div>
            `
          }
        ]
      }
    };

    setTimeout(() => {
      const stage = container.querySelector('#level2-stage');
      if (!stage) return;

      const spots = stage.querySelectorAll('.scene-drop-zone');
      const cards = stage.querySelectorAll('.sanitation-action-card');
      const problemModal = stage.querySelector('#problem-investigation-modal');
      const processLabModal = stage.querySelector('#process-lab-modal');

      let draggedType = null;
      let draggedEl = null;
      let activeLocationReq = null;

      // Handle Problem Investigation Modal Controls
      function openProblemModal(reqType) {
        activeLocationReq = reqType;
        const prob = problemDetails[reqType];
        if (!prob || !problemModal) return;

        if (problemModal.parentElement !== document.body) {
          document.body.appendChild(problemModal);
        }

        audioEngine.playTap();
        document.querySelector('#modal-location-title').textContent = prob.title;
        document.querySelector('#modal-status-badge').textContent = prob.status;
        document.querySelector('#modal-problem-desc').innerHTML = prob.desc;
        document.querySelector('#modal-solusi-icon').textContent = prob.solusiIcon;
        document.querySelector('#modal-solusi-name').textContent = prob.solusiName;
        document.querySelector('#modal-solusi-text').textContent = prob.solusiText;

        problemModal.classList.add('active');
      }

      function closeProblemModal() {
        if (problemModal) problemModal.classList.remove('active');
      }

      document.querySelector('#modal-close-btn')?.addEventListener('click', closeProblemModal);
      problemModal?.addEventListener('click', (e) => {
        if (e.target === problemModal) closeProblemModal();
      });

      // Handle Interactive Drag & Drop Process Lab Assembly
      function openProcessLabModal(reqType, onCompleteCallback) {
        const flow = processFlows[reqType];
        if (!flow || !processLabModal) return;

        if (processLabModal.parentElement !== document.body) {
          document.body.appendChild(processLabModal);
        }

        let completedSlotsCount = 0;

        document.querySelector('#lab-icon').textContent = flow.icon;
        document.querySelector('#lab-main-title').textContent = flow.title;
        document.querySelector('#lab-sub-title').textContent = 'Seret & letakkan kartu langkah ke dalam slot urutan yang tepat!';
        document.querySelector('#progress-fill').style.width = '0%';
        document.querySelector('#progress-text').textContent = 'Step 0 / 3';

        const defaultPNGMap = {
          air_bersih: '/images/game/filter_step1.png',
          masak_air: '/images/game/boil_step3.png',
          jaga_kebersihan: '/images/game/wash_step3.png',
          difantasi: '/images/game/mck_step3.png'
        };

        const simCanvas = document.querySelector('#simulation-visual-canvas');
        if (simCanvas) {
          simCanvas.innerHTML = `
            <div class="visual-stack-container">
              <div class="process-png-card">
                <img src="${defaultPNGMap[reqType]}" alt="Preview Process" class="process-step-png-img" style="opacity:0.65; filter: grayscale(0.3);" />
              </div>
              <div class="stack-status-desc" style="font-size:0.85rem; color:#fef08a;">
                🧪 Seret kartu langkah di kiri ke dalam Slot Urutan 1, 2, dan 3!
              </div>
            </div>
          `;
        }

        // Shuffle steps so player has to sort them!
        const shuffledSteps = [...flow.steps].sort(() => Math.random() - 0.5);

        const stepsGrid = document.querySelector('#process-steps-grid');
        stepsGrid.innerHTML = `
          <!-- Target Drop Slots -->
          <div class="step-target-slots">
            <div class="step-slot-box" data-slot="1">
              <div class="slot-header">🎯 SLOT 1: TAHAPAN DASAR (LANGKAH KE-1)</div>
              <div class="slot-placeholder">✋ Seret Kartu Langkah ke-1 Di Sini</div>
            </div>
            <div class="step-slot-box" data-slot="2">
              <div class="slot-header">🎯 SLOT 2: TAHAPAN TENGAH (LANGKAH KE-2)</div>
              <div class="slot-placeholder">✋ Seret Kartu Langkah ke-2 Di Sini</div>
            </div>
            <div class="step-slot-box" data-slot="3">
              <div class="slot-header">🎯 SLOT 3: TAHAPAN ATAS / HILIR (LANGKAH KE-3)</div>
              <div class="slot-placeholder">✋ Seret Kartu Langkah ke-3 Di Sini</div>
            </div>
          </div>

          <!-- Shuffled Cards Dock -->
          <div class="scrambled-steps-dock">
            <div class="dock-header-label">🧩 PILIH & SERET KARTU TAHAPAN PROSES BERIKUT:</div>
            <div class="drag-cards-list">
              ${shuffledSteps.map(st => `
                <div class="drag-step-card" draggable="true" data-stepnum="${st.num}">
                  <span class="drag-handle">⋮⋮</span>
                  <span class="card-step-icon">${st.icon}</span>
                  <div class="card-step-text">
                    <span class="card-step-title">${st.title}</span>
                    <span class="card-step-desc">${st.desc}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;

        processLabModal.classList.add('active');

        // Drag & Drop + Tap-to-Place Event Listeners
        const dragCards = stepsGrid.querySelectorAll('.drag-step-card');
        const dropSlots = stepsGrid.querySelectorAll('.step-slot-box');

        let draggedCard = null;
        let draggedStepNum = null;

        let selectedStepCard = null;
        let selectedStepNum = null;

        function clearPopupSelection() {
          selectedStepCard = null;
          selectedStepNum = null;
          draggedCard = null;
          draggedStepNum = null;
          stepsGrid.querySelectorAll('.drag-step-card').forEach(c => c.classList.remove('selected', 'dragging'));
          stepsGrid.querySelectorAll('.step-slot-box').forEach(s => s.classList.remove('slot-target-glow', 'slot-hover-glow'));
        }

        function highlightSlotsForSelectedStep() {
          stepsGrid.querySelectorAll('.step-slot-box').forEach(s => {
            if (!s.classList.contains('slot-filled')) {
              s.classList.add('slot-target-glow');
            }
          });
        }

        function tryPlaceStepInSlot(slotElement) {
          if (slotElement.classList.contains('slot-filled')) {
            showToast('⚠️ Slot ini sudah terisi!');
            return;
          }

          const targetCard = selectedStepCard || draggedCard;
          const targetStepNum = selectedStepNum !== null ? selectedStepNum : draggedStepNum;

          if (targetStepNum === null || !targetCard) {
            showToast('💡 Ketuk kartu tahapan di bawah dulu, baru ketuk Slot 1, 2, atau 3!');
            return;
          }

          const slotNum = parseInt(slotElement.getAttribute('data-slot'), 10);

          if (targetStepNum === slotNum) {
            audioEngine.playTap();
            slotElement.classList.add('slot-filled');

            slotElement.innerHTML = `
              <div class="slot-header">✅ SLOT ${slotNum} SELESAI</div>
              <div class="drag-step-card" style="margin-top:2px; cursor:default; border-color:#10b981; background:rgba(16,185,129,0.15);">
                <span class="card-step-icon">${targetCard.querySelector('.card-step-icon').textContent}</span>
                <div class="card-step-text">
                  <span class="card-step-title" style="color:#6ee7b7;">${targetCard.querySelector('.card-step-title').textContent}</span>
                </div>
              </div>
            `;

            targetCard.remove();
            clearPopupSelection();

            const stepData = flow.steps[slotNum - 1];
            if (simCanvas && stepData.cumulativeHTML) {
              simCanvas.innerHTML = stepData.cumulativeHTML;
            }

            completedSlotsCount++;
            const percent = Math.round((completedSlotsCount / 3) * 100);
            document.querySelector('#progress-fill').style.width = `${percent}%`;
            document.querySelector('#progress-text').textContent = `Step ${completedSlotsCount} / 3`;

            if (completedSlotsCount >= 3) {
              audioEngine.playSuccess();
              setTimeout(() => {
                processLabModal.classList.remove('active');
                if (onCompleteCallback) onCompleteCallback();
              }, 1200);
            }
          } else {
            audioEngine.playWrong();
            slotElement.classList.add('wrong-drop');
            setTimeout(() => slotElement.classList.remove('wrong-drop'), 600);
            showToast(`⚠️ Urutan keliru! Kartu ini bukan untuk Slot ke-${slotNum}. Perhatikan deskripsinya!`);
          }
        }

        dragCards.forEach(card => {
          // Tap / Click Selection Handler inside Popup
          card.addEventListener('click', (e) => {
            e.stopPropagation();
            if (card.classList.contains('placed')) return;

            audioEngine.playTap();

            if (selectedStepCard === card) {
              clearPopupSelection();
              showToast('ℹ️ Pemilihan kartu langkah dibatalkan.');
              return;
            }

            stepsGrid.querySelectorAll('.drag-step-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedStepCard = card;
            selectedStepNum = parseInt(card.getAttribute('data-stepnum'), 10);
            draggedCard = card;
            draggedStepNum = selectedStepNum;
            highlightSlotsForSelectedStep();

            const stepTitle = card.querySelector('.card-step-title')?.textContent || 'kartu';
            showToast(`🧩 "${stepTitle}" dipilih! Sekarang ketuk Slot ke-1, 2, atau 3 di atas.`);
          });

          card.addEventListener('dragstart', (e) => {
            draggedCard = card;
            draggedStepNum = parseInt(card.getAttribute('data-stepnum'), 10);
            selectedStepCard = card;
            selectedStepNum = draggedStepNum;
            card.classList.add('dragging');
            highlightSlotsForSelectedStep();
            e.dataTransfer.setData('text/plain', draggedStepNum);
          });

          card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
          });

          // Touch Drag Support for Mobile
          let touchMoveHandler = null;
          let touchEndHandler = null;

          card.addEventListener('touchstart', (e) => {
            draggedCard = card;
            draggedStepNum = parseInt(card.getAttribute('data-stepnum'), 10);
            selectedStepCard = card;
            selectedStepNum = draggedStepNum;
            card.classList.add('dragging');
            highlightSlotsForSelectedStep();

            const touch = e.touches[0];
            const ghost = card.cloneNode(true);
            ghost.id = 'touch-drag-ghost';
            ghost.style.position = 'fixed';
            ghost.style.pointerEvents = 'none';
            ghost.style.zIndex = '999999';
            ghost.style.opacity = '0.9';
            ghost.style.left = `${touch.clientX - 40}px`;
            ghost.style.top = `${touch.clientY - 20}px`;
            ghost.style.width = `${card.offsetWidth}px`;
            document.body.appendChild(ghost);

            touchMoveHandler = (evt) => {
              evt.preventDefault();
              const t = evt.touches[0];
              const g = document.getElementById('touch-drag-ghost');
              if (g) {
                g.style.left = `${t.clientX - 40}px`;
                g.style.top = `${t.clientY - 20}px`;
              }
            };

            touchEndHandler = (evt) => {
              const g = document.getElementById('touch-drag-ghost');
              if (g) g.remove();

              card.classList.remove('dragging');
              const endTouch = evt.changedTouches[0];
              const dropTarget = document.elementFromPoint(endTouch.clientX, endTouch.clientY);
              const slot = dropTarget?.closest('.step-slot-box');

              if (slot) {
                tryPlaceStepInSlot(slot);
              }

              document.removeEventListener('touchmove', touchMoveHandler);
              document.removeEventListener('touchend', touchEndHandler);
            };

            document.addEventListener('touchmove', touchMoveHandler, { passive: false });
            document.addEventListener('touchend', touchEndHandler);
          });
        });

        dropSlots.forEach(slot => {
          slot.addEventListener('click', (e) => {
            e.stopPropagation();
            tryPlaceStepInSlot(slot);
          });

          slot.addEventListener('dragover', (e) => {
            e.preventDefault();
            slot.classList.add('slot-hover-glow');
          });

          slot.addEventListener('dragleave', () => {
            slot.classList.remove('slot-hover-glow');
          });

          slot.addEventListener('drop', (e) => {
            e.preventDefault();
            slot.classList.remove('slot-hover-glow');
            tryPlaceStepInSlot(slot);
          });
        });

        document.querySelector('#process-modal-close')?.addEventListener('click', () => {
          clearPopupSelection();
          processLabModal.classList.remove('active');
        });
      }

      function clearTargetHighlights() {
        spots.forEach(s => {
          s.classList.remove('target-active-glow');
          s.querySelector('.question-mark-badge')?.classList.remove('target-active-glow');
        });
      }

      function highlightTargetSpots() {
        clearTargetHighlights();
        spots.forEach(s => {
          if (!s.classList.contains('sanitized')) {
            s.classList.add('target-active-glow');
            s.querySelector('.question-mark-badge')?.classList.add('target-active-glow');
          }
        });
      }

      // Apply button inside problem modal opens Process Lab
      document.querySelector('#modal-btn-apply')?.addEventListener('click', () => {
        if (!activeLocationReq) return;
        closeProblemModal();

        const matchingSpot = Array.from(spots).find(s => s.getAttribute('data-req') === activeLocationReq);
        const matchingCard = Array.from(cards).find(c => c.getAttribute('data-type') === activeLocationReq);

        if (matchingSpot && !matchingSpot.classList.contains('sanitized')) {
          draggedType = activeLocationReq;
          draggedEl = matchingCard;

          openProcessLabModal(activeLocationReq, () => {
            finalizeSanitizeSpot(matchingSpot);
          });
        }
      });

      // Click-to-select + click-to-drop (mobile friendly) & Native Drag + Mobile Touch Drag Support
      cards.forEach(card => {
        card.addEventListener('click', () => {
          if (card.classList.contains('used')) return;
          audioEngine.playTap();

          if (card.classList.contains('selected')) {
            card.classList.remove('selected');
            draggedType = null;
            draggedEl = null;
            clearTargetHighlights();
            showToast('ℹ️ Pemilihan kartu dibatalkan.');
            return;
          }

          cards.forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          draggedType = card.getAttribute('data-type');
          draggedEl = card;
          highlightTargetSpots();
          const cardTitle = card.querySelector('.action-card-title').textContent;
          showToast(`📋 Kartu "${cardTitle}" dipilih! Ketuk lokasi ❓ bergaris cyan biru di peta untuk meletakkannya.`);
        });

        card.setAttribute('draggable', 'true');
        card.addEventListener('dragstart', (e) => {
          if (card.classList.contains('used')) return;
          draggedType = card.getAttribute('data-type');
          draggedEl = card;
          card.classList.add('dragging');
          highlightTargetSpots();
          e.dataTransfer.setData('text/plain', draggedType);
        });
        card.addEventListener('dragend', () => {
          card.classList.remove('dragging');
        });

        // Mobile Touch Drag Support
        let touchMoveHandler = null;
        let touchEndHandler = null;

        card.addEventListener('touchstart', (e) => {
          if (card.classList.contains('used')) return;
          draggedType = card.getAttribute('data-type');
          draggedEl = card;
          card.classList.add('dragging');
          highlightTargetSpots();

          const touch = e.touches[0];
          const ghost = card.cloneNode(true);
          ghost.id = 'touch-card-ghost';
          ghost.style.position = 'fixed';
          ghost.style.pointerEvents = 'none';
          ghost.style.zIndex = '999999';
          ghost.style.opacity = '0.88';
          ghost.style.left = `${touch.clientX - 45}px`;
          ghost.style.top = `${touch.clientY - 35}px`;
          ghost.style.width = `${card.offsetWidth}px`;
          document.body.appendChild(ghost);

          touchMoveHandler = (evt) => {
            evt.preventDefault();
            const t = evt.touches[0];
            const g = document.getElementById('touch-card-ghost');
            if (g) {
              g.style.left = `${t.clientX - 45}px`;
              g.style.top = `${t.clientY - 35}px`;
            }
          };

          touchEndHandler = (evt) => {
            const g = document.getElementById('touch-card-ghost');
            if (g) g.remove();

            card.classList.remove('dragging');
            const endTouch = evt.changedTouches[0];
            const dropTarget = document.elementFromPoint(endTouch.clientX, endTouch.clientY);
            const dropSpot = dropTarget?.closest('.scene-drop-zone');

            if (dropSpot) {
              triggerSanitizeSpot(dropSpot);
            }

            document.removeEventListener('touchmove', touchMoveHandler);
            document.removeEventListener('touchend', touchEndHandler);
          };

          document.addEventListener('touchmove', touchMoveHandler, { passive: false });
          document.addEventListener('touchend', touchEndHandler);
        });
      });

      function triggerSanitizeSpot(spot) {
        spot.classList.remove('drag-over');
        const reqType = spot.getAttribute('data-req');
        if (spot.classList.contains('sanitized')) return;

        if (draggedType === reqType) {
          clearTargetHighlights();
          openProcessLabModal(reqType, () => {
            finalizeSanitizeSpot(spot);
          });
        } else if (draggedType) {
          audioEngine.playWrong();
          spot.classList.add('wrong-drop');
          setTimeout(() => spot.classList.remove('wrong-drop'), 600);
          showToast('⚠️ Kartu tindakan ini tidak sesuai untuk lokasi tersebut!');
        } else {
          openProblemModal(reqType);
        }
      }

      function finalizeSanitizeSpot(spot) {
        const reqType = spot.getAttribute('data-req');
        audioEngine.playSuccess();
        spot.classList.add('sanitized');
        clearTargetHighlights();
        
        const label = spot.querySelector('.drop-zone-label');
        if (label) {
          label.innerHTML = `✅ ${label.textContent.replace('Drop ', '')} BERSIH!`;
        }

        const qBadge = spot.querySelector('.question-mark-badge');
        if (qBadge) {
          qBadge.style.background = 'radial-gradient(circle, #10b981 0%, #064e3b 100%)';
          qBadge.style.animation = 'none';
          qBadge.innerHTML = `<span class="q-icon">✅</span><span class="q-text">AMANKAN</span>`;
        }

        const cardInTray = stage.querySelector(`.sanitation-action-card[data-type="${reqType}"]`);
        if (cardInTray) {
          cardInTray.classList.remove('selected');
          cardInTray.classList.add('used');
          cardInTray.style.pointerEvents = 'none';
        }

        if (draggedEl) {
          draggedEl.classList.remove('selected');
          draggedEl.classList.add('used');
          draggedEl.style.pointerEvents = 'none';
        }

        draggedType = null;
        draggedEl = null;

        sanitizedCount++;
        score1 += 75;
        gameState.addPoints(75);
        showScorePopup(stage, 75, spot.offsetLeft + 40, spot.offsetTop + 10);

        if (sanitizedCount >= totalSpots) {
          setTimeout(() => renderVictoryScreen(2, 'Pahlawan Sanitasi Desa', 'Seluruh proses sanitasi & pembersihan sumber air desa telah selesai!', sanitizedCount * 75), 2000);
        }
      }

      function checkTrayEmptyState() {
        const visibleCards = Array.from(stage.querySelectorAll('.sanitation-action-card')).filter(c => c.style.display !== 'none');
        const emptyPlaceholder = stage.querySelector('#tray-empty-placeholder');
        if (visibleCards.length === 0 && emptyPlaceholder) {
          emptyPlaceholder.style.display = 'block';
          if (sanitizedCount >= totalSpots) {
            emptyPlaceholder.innerHTML = '🎉 Seluruh Kartu Sanitasi Telah Berhasil Diterapkan di Pemukiman Desa!';
            emptyPlaceholder.style.borderColor = '#10b981';
            emptyPlaceholder.style.color = '#6ee7b7';
          } else {
            emptyPlaceholder.innerHTML = '🔒 Kerjakan Investigasi Masalah (❓) & Selesaikan Proses Lab di lokasi desa untuk membuka Kartu Sanitasi!';
            emptyPlaceholder.style.borderColor = '#fbbf24';
            emptyPlaceholder.style.color = '#fef08a';
          }
        }
      }

      spots.forEach(spot => {
        const reqType = spot.getAttribute('data-req');

        spot.addEventListener('dragover', (e) => { e.preventDefault(); spot.classList.add('drag-over'); });
        spot.addEventListener('dragleave', () => spot.classList.remove('drag-over'));
        spot.addEventListener('drop', (e) => { e.preventDefault(); triggerSanitizeSpot(spot); });
        spot.addEventListener('click', () => triggerSanitizeSpot(spot));
      });
    }, 50);

    return `
      <div id="level2-stage" class="level2-container">
        <h2 class="level2-header-title">LEVEL 2: Jalur Penularan Kolera (Proses & Drag Sanitasi)</h2>
        ${createTimerBar(90, () => { showToast('⏰ Waktu habis!'); })}

        <!-- Task Dialog Banner -->
        <div class="scene-task-banner">
          <div class="task-banner-text">💡 Tugas: Klik ❓ pada peta untuk Investigasi & Selesaikan Sanitasi Desa!</div>
        </div>

        <div class="level2-scene-canvas" style="background-image: url('/images/game/village_river_cholera.png');">
          
          <!-- Location Badges -->
          <div class="scene-location-badge badge-area-minum">Area Minum</div>
          <div class="scene-location-badge badge-area-cuci">Area Cuci/Mandi</div>
          <div class="scene-location-badge badge-rumah-warga">Rumah Warga</div>
          <div class="scene-location-badge badge-area-bermain">Area Bermain</div>
          <div class="scene-location-badge badge-warga-1">Warga</div>

          <!-- Cholera Source Signboard -->
          <div class="scene-signboard-card">
            <div class="signboard-title">⚠️ Sumber Kolera:</div>
            <div class="signboard-desc">Air Sungai Tercemar & Kebersihan Buruk</div>
          </div>

          <!-- Interactive Drop Zones (Glowing Rings with Question Badges) -->
          <div class="scene-drop-zone zone-air-bersih" data-req="air_bersih">
            <div class="question-mark-badge">
              <span class="q-icon">❓</span>
              <span class="q-text">MASALAH</span>
            </div>
            <div class="drop-ring"></div>
            <div class="drop-zone-label">Drop Air Bersih</div>
          </div>

          <div class="scene-drop-zone zone-masak-air" data-req="masak_air">
            <div class="question-mark-badge">
              <span class="q-icon">❓</span>
              <span class="q-text">MASALAH</span>
            </div>
            <div class="drop-ring"></div>
            <div class="drop-zone-label">Drop Masak Air</div>
          </div>

          <div class="scene-drop-zone zone-jaga-kebersihan" data-req="jaga_kebersihan">
            <div class="question-mark-badge">
              <span class="q-icon">❓</span>
              <span class="q-text">MASALAH</span>
            </div>
            <div class="drop-ring"></div>
            <div class="drop-zone-label">Drop Jaga Kebersihan</div>
          </div>

          <div class="scene-drop-zone zone-difantasi" data-req="difantasi">
            <div class="question-mark-badge">
              <span class="q-icon">❓</span>
              <span class="q-text">MASALAH</span>
            </div>
            <div class="drop-ring"></div>
            <div class="drop-zone-label">Drop Difantasi</div>
          </div>

        </div>

        <!-- Bottom Action Card Tray Dock OUTSIDE illustration box -->
        <div class="card-tray-dock">
          <div class="tray-dock-header">Daftar Kartu Tindakan Sanitasi</div>
          <div class="tray-cards-row">
            <button class="tray-nav-btn nav-prev">‹</button>

            <!-- EMPTY TRAY PLACEHOLDER (Starts Visible) -->
            <div class="tray-empty-placeholder" id="tray-empty-placeholder">
              🔒 Kerjakan Investigasi Masalah (❓) & Selesaikan Proses Lab di lokasi desa untuk membuka Kartu Sanitasi!
            </div>

            <!-- Card 1: Air Bersih (Initially Hidden) -->
            <div class="sanitation-action-card card-frame-cyan" data-type="air_bersih" style="display: none;">
              <div class="action-card-icon">🚰</div>
              <div class="action-card-title">AIR BERSIH</div>
            </div>

            <!-- Card 2: Jaga Kebersihan (Initially Hidden) -->
            <div class="sanitation-action-card card-frame-amber" data-type="jaga_kebersihan" style="display: none;">
              <div class="action-card-icon">🧼</div>
              <div class="action-card-title">JAGA KEBERSIHAN</div>
            </div>

            <!-- Card 3: Difantasi (Initially Hidden) -->
            <div class="sanitation-action-card card-frame-emerald" data-type="difantasi" style="display: none;">
              <div class="action-card-icon">🚽</div>
              <div class="action-card-title">DIFANTASI</div>
            </div>

            <!-- Card 4: Masak Air (Initially Hidden) -->
            <div class="sanitation-action-card card-frame-rose" data-type="masak_air" style="display: none;">
              <div class="action-card-icon">🫖</div>
              <div class="action-card-title">MASAK AIR</div>
            </div>

            <button class="tray-nav-btn nav-next">›</button>
          </div>
        </div>

        <!-- POPUP MODAL INVESTIGASI MASALAH DESA -->
        <div class="problem-investigation-modal" id="problem-investigation-modal">
          <div class="problem-modal-content">
            <div class="problem-modal-header">
              <span class="modal-header-icon">🔍</span>
              <div class="modal-header-text">
                <h3 class="modal-location-title" id="modal-location-title">INVESTIGASI MASALAH LOKASI</h3>
                <span class="modal-status-badge" id="modal-status-badge">⚠️ PERMASALAHAN TERDETEKSI</span>
              </div>
              <button class="modal-close-btn" id="modal-close-btn">✕</button>
            </div>

            <div class="problem-modal-body">
              <div class="problem-description-box">
                <h4 class="box-subtitle">📋 Laporan Kondisi Lapangan:</h4>
                <p class="box-text" id="modal-problem-desc">Deskripsi masalah...</p>
              </div>

              <div class="problem-solution-box">
                <h4 class="box-subtitle">💡 Tindakan Sanitasi Diperlukan:</h4>
                <div class="solution-card-recommendation">
                  <span class="rec-icon" id="modal-solusi-icon">🚰</span>
                  <div>
                    <span class="rec-name" id="modal-solusi-name">AIR BERSIH</span>
                    <p class="box-text" id="modal-solusi-text" style="font-size:0.75rem; color:#cbd5e1; margin-top:2px;">Deskripsi solusi...</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="problem-modal-footer">
              <button class="btn-action-apply" id="modal-btn-apply">
                <span>🧪 Pelajari & Jalankan Proses Sanitasi Ini</span>
              </button>
            </div>
          </div>
        </div>

        <!-- DUAL-PANEL POPUP MODAL PROSES LAB SANITASI INTERAKTIF -->
        <div class="process-lab-modal" id="process-lab-modal">
          <div class="process-lab-dual-container">
            
            <!-- LEFT CONTROL PANEL -->
            <div class="lab-control-panel">
              <div class="lab-modal-header">
                <div class="lab-title-group">
                  <span class="lab-icon" id="lab-icon">🧪</span>
                  <div>
                    <h3 class="lab-main-title" id="lab-main-title">PROSES LAB SANITASI</h3>
                    <div class="lab-sub-title" id="lab-sub-title">Selesaikan 3 langkah berurutan...</div>
                  </div>
                </div>
                <button class="modal-close-btn" id="process-modal-close">✕</button>
              </div>

              <div class="process-progress-bar-container">
                <div class="progress-header">
                  <span>PROGRESS PROSES SANITASI</span>
                  <span id="progress-text">Step 0 / 3</span>
                </div>
                <div class="progress-track">
                  <div class="progress-fill" id="progress-fill"></div>
                </div>
              </div>

              <div class="process-steps-grid" id="process-steps-grid">
                <!-- Rendered dynamically -->
              </div>
            </div>

            <!-- RIGHT DEDICATED VISUAL PANEL -->
            <div class="lab-visual-panel">
              <div class="visual-panel-header">
                <span class="v-icon">🖼️</span>
                <span>VISUALISASI PROSES SANITASI</span>
              </div>

              <div class="simulation-visual-canvas" id="simulation-visual-canvas">
                <!-- Rendered dynamically (PNG image + stacking layers) -->
              </div>
            </div>

          </div>
        </div>

      </div>
    `;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // LEVEL 3: MISI VAKSIN CACAR (VAKSIN FACTORY) - COMBINED MASTER EDITION
  // ═══════════════════════════════════════════════════════════════════════
  // ═══════════════════════════════════════════════════════════════════════
  // LEVEL 3: MISI VAKSIN CACAR & WABAH VAKSIN FACTORY (DYNAMIC PATIENTS)
  // ═══════════════════════════════════════════════════════════════════════
  function renderLevel3VaksinFactory() {
    let slots = [null, null, null, null];
    let vaccinatedCount = 0;

    const patientQueue = [
      {
        id: 1,
        name: 'Pak Budi (42 thn)',
        icon: '🧑',
        disease: 'Wabah Cacar (Smallpox)',
        symptoms: [
          'Demam tinggi mendadak (39.5°C)',
          'Bintil nanah menyebar di kulit wajah & tangan',
          'Badan lemas hebat & nyeri sendi'
        ],
        requiredVirus: 'virus_lemah',
        requiredVirusName: 'Virus Cacar Lemah',
        formula: 'Virus Cacar Lemah + Serum Antibodi + Penstabil + Air Steril',
        doctorNotes: 'Terinfeksi Virus Cacar (Smallpox). Membutuhkan Vaksin Cacar (Cowpox) Spesifik!'
      },
      {
        id: 2,
        name: 'Anisa (9 thn)',
        icon: '👧',
        disease: 'Wabah COVID-19 (Corona)',
        symptoms: [
          'Batuk kering & sesak nafas hebat',
          'Kehilangan indra penciuman (Anosmia)',
          'Demam & menggigil'
        ],
        requiredVirus: 'corona',
        requiredVirusName: 'Virus Corona (Spike)',
        formula: 'Virus Corona + Serum Antibodi + Penstabil + Air Steril',
        doctorNotes: 'Terinfeksi Virus Corona (SARS-CoV-2). Membutuhkan Vaksin Corona Spike Protein!'
      },
      {
        id: 3,
        name: 'Doni (6 thn)',
        icon: '👦',
        disease: 'Wabah Polio (Lumpuh Layu)',
        symptoms: [
          'Otot kaki melemah & lemas tidak bisa berdiri',
          'Kelumpuhan layu mendadak di tungkai kaki',
          'Demam & leher kaku'
        ],
        requiredVirus: 'polio',
        requiredVirusName: 'Virus Polio (Sabin/Salk)',
        formula: 'Virus Polio + Serum Antibodi + Penstabil + Air Steril',
        doctorNotes: 'Terinfeksi Virus Polio. Membutuhkan Vaksin Polio Dilemahkan!'
      }
    ];

    let currentPatientIdx = 0;

    setTimeout(() => {
      const stage = container.querySelector('#level3-stage');
      if (!stage) return;

      const ingCards = stage.querySelectorAll('.vaccine-ingredient-card');
      const slotEls = stage.querySelectorAll('.machine-input-slot');
      const btnBrew = stage.querySelector('#btn-brew-master');
      const vatLiquid = stage.querySelector('#liquid-mixing-vat');
      const vatIcon = stage.querySelector('#vat-center-icon');
      const statusBadge = stage.querySelector('#machine-status-badge');
      const queueBox = stage.querySelector('#villagers-queue');
      const vaccinatedNum = stage.querySelector('#vaccinated-counter');

      // UI Elements for Left Sidebar Diagnosis
      const patientTitleEl = stage.querySelector('#sidebar-patient-title');
      const patientBadgeEl = stage.querySelector('#sidebar-patient-badge');
      const symptomsListEl = stage.querySelector('#sidebar-symptoms-list');
      const doctorNotesEl = stage.querySelector('#sidebar-doctor-notes');
      const formulaNotesEl = stage.querySelector('#sidebar-formula-notes');

      function updatePatientSidebarUI() {
        const p = patientQueue[currentPatientIdx];
        if (!p) return;

        if (patientTitleEl) patientTitleEl.textContent = `PASIEN ANTREAN #${p.id}`;
        if (patientBadgeEl) patientBadgeEl.textContent = `${p.icon} ${p.name}`;
        if (symptomsListEl) {
          symptomsListEl.innerHTML = p.symptoms.map(s => `<li>${s}</li>`).join('');
        }
        if (doctorNotesEl) doctorNotesEl.textContent = p.doctorNotes;
        if (formulaNotesEl) formulaNotesEl.innerHTML = `<strong>📋 FORMULASI DIBUTUHKAN:</strong><br/>Racik: <em>${p.formula}</em>. Hati-hati jangan tertukar virus!`;
      }

      updatePatientSidebarUI();

      // Clickable Timeline Nodes
      const timelineNodes = stage.querySelectorAll('.timeline-node');
      timelineNodes.forEach(node => {
        node.addEventListener('click', () => {
          audioEngine.playTap();
          const year = node.getAttribute('data-year');
          const info = node.getAttribute('data-info');
          showToast(`📜 SEJARAH KESEHATAN (${year}): ${info}`);
        });
      });

      // Info Buttons on Ingredient Cards
      const infoBtns = stage.querySelectorAll('.btn-card-info');
      infoBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          audioEngine.playTap();
          const ingId = btn.getAttribute('data-ing-info');
          openIngredientInfoModal(ingId);
        });
      });

      // Ingredient Card Click
      ingCards.forEach(card => {
        card.addEventListener('click', () => {
          const type = card.getAttribute('data-ing');
          const icon = card.getAttribute('data-icon');
          const name = card.getAttribute('data-name');

          if (type === 'poison') {
            audioEngine.playWrong();
            showToast('☠️ BAHAYA! Merkuri & Racun ini dapat merusak sel tubuh! Jangan dimasukkan ke vaksin!');
            card.classList.add('rejected');
            setTimeout(() => card.classList.remove('rejected'), 800);
            return;
          }

          const emptyIdx = slots.findIndex(s => s === null);
          if (emptyIdx === -1) {
            showToast('⚠️ Seluruh 4 slot bahan telah terisi! Tekan "MULAI RACIK" atau reset.');
            return;
          }

          if (slots.includes(type)) {
            showToast('⚠️ Bahan ini sudah dimasukkan ke dalam mesin pencampur!');
            return;
          }

          audioEngine.playDropReagent();
          slots[emptyIdx] = type;
          const imgSrc = card.querySelector('.ing-card-png')?.src || '';
          slotEls[emptyIdx].innerHTML = `
            <span class="slot-num-tag">SLOT ${emptyIdx + 1}</span>
            <img src="${imgSrc}" alt="${name}" style="width:36px; height:36px; object-fit:contain;" />
            <span style="font-size:0.68rem; font-weight:800; color:#6ee7b7;">${name}</span>
          `;
          slotEls[emptyIdx].classList.add('slot-filled');
          card.classList.add('used');

          if (slots.every(s => s !== null)) {
            btnBrew.style.display = 'inline-flex';
            statusBadge.textContent = 'STATUS: BAHAN LENGKAP - SIAP SINTESIS!';
            statusBadge.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
          }
        });
      });

      // Brew / Mixing Button Click
      if (btnBrew) {
        btnBrew.addEventListener('click', () => {
          btnBrew.disabled = true;
          audioEngine.playTap();
          const currentPatient = patientQueue[currentPatientIdx];
          
          const VIRUS_VACCINE_NAMES = {
            virus_lemah: 'Vaksin Cacar (Smallpox)',
            corona: 'Vaksin COVID-19',
            polio: 'Vaksin Polio',
            campak: 'Vaksin Campak (MMR)',
            hpv: 'Vaksin HPV Serviks',
            influenza: 'Vaksin Influenza'
          };

          const chosenVirus = slots.find(s => ['virus_lemah', 'corona', 'polio', 'campak', 'hpv', 'influenza'].includes(s));
          const craftedVaccineName = chosenVirus ? VIRUS_VACCINE_NAMES[chosenVirus] : 'Cairan Tanpa Antigen Virus';

          statusBadge.textContent = `STATUS: SINTESIS VAKSIN UNTUK ${currentPatient.name.toUpperCase()} (100°C)...`;
          statusBadge.style.background = 'linear-gradient(135deg, #d97706 0%, #b45309 100%)';

          if (vatLiquid) vatLiquid.classList.add('brewing');

          setTimeout(() => {
            const hasPoison = slots.includes('poison');
            const hasSerum = slots.includes('serum');
            const hasStabilizer = slots.includes('stabilizer');
            const hasWater = slots.includes('air_steril');
            const isVirusCorrect = chosenVirus === currentPatient.requiredVirus;
            const isFormulaComplete = isVirusCorrect && hasSerum && hasStabilizer && hasWater && !hasPoison;

            if (isFormulaComplete) {
              audioEngine.playSuccess();
              if (vatIcon) vatIcon.src = '/images/game/vial_serum.png';
              statusBadge.textContent = `STATUS: VAKSIN ${currentPatient.disease.toUpperCase()} SUKSES DIBUAT!`;
              statusBadge.style.background = 'linear-gradient(135deg, #10b981 0%, #064e3b 100%)';

              showToast(`🎉 VAKSIN BERHASIL! Pasien ${currentPatient.name} telah disuntik ${craftedVaccineName} & sembuh!`);

              // Animate Villager in Queue
              const villagers = queueBox.querySelectorAll('.villager-character');
              if (villagers[currentPatientIdx]) {
                villagers[currentPatientIdx].classList.add('vaccinated');
                villagers[currentPatientIdx].textContent = '🛡️' + villagers[currentPatientIdx].textContent;
              }

              vaccinatedCount += 334;
              if (vaccinatedCount > 1000) vaccinatedCount = 1000;
              if (vaccinatedNum) vaccinatedNum.textContent = `${vaccinatedCount} / 1000`;

              currentPatientIdx++;

              if (currentPatientIdx < patientQueue.length) {
                // Advance to next patient
                setTimeout(() => {
                  if (vatLiquid) vatLiquid.classList.remove('brewing');
                  statusBadge.textContent = `STATUS: MEMERIKSA PASIEN ANTREAN #${currentPatientIdx + 1}...`;
                  statusBadge.style.background = 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)';
                  btnBrew.disabled = false;
                  btnBrew.style.display = 'none';

                  // Reset Slots & Ingredient Cards
                  slots = [null, null, null, null];
                  slotEls.forEach((s, idx) => {
                    s.innerHTML = `<span class="slot-num-tag">SLOT ${idx + 1}</span><span style="color:#64748b; font-size:0.75rem;">KOSONG</span>`;
                    s.classList.remove('slot-filled');
                  });
                  ingCards.forEach(c => c.classList.remove('used'));

                  updatePatientSidebarUI();
                  showToast(`🏥 Pasien berikutnya tiba: ${patientQueue[currentPatientIdx].name}! Periksa gejalanya.`);
                }, 1800);

              } else {
                // All 3 Patients Vaccinated! Victory!
                gameState.addPoints(100);
                updateScore();

                setTimeout(() => {
                  renderVictoryScreen(
                    3,
                    'Pahlawan Vaksinasi Dunia',
                    'Seluruh 3 wabah penyakit (Cacar, Corona, Polio) berhasil diatasi dengan meracik Vaksin Spesifik sesuai gejala klinis pasien!',
                    100
                  );
                }, 2000);
              }

            } else {
              audioEngine.playWrong();
              if (vatLiquid) vatLiquid.classList.remove('brewing');

              if (hasPoison) {
                showToast(`☠️ RACIKAN GAGAL! Terkontaminasi Racun Merkuri yang sangat berbahaya!`);
                statusBadge.textContent = 'STATUS: GAGAL — TERKONTAMINASI RACUN MERKURI ☠️';
              } else if (!chosenVirus) {
                showToast(`❌ RACIKAN GAGAL! Kamu tidak memasukkan virus antigen spesifik ke dalam mesin!`);
                statusBadge.textContent = 'STATUS: GAGAL — TANPA VIRUS ANTIGEN';
              } else if (!isVirusCorrect) {
                showToast(`❌ RACIKAN GAGAL! Pasien ${currentPatient.name} menderita ${currentPatient.disease}, tetapi kamu meracik ${craftedVaccineName}! Vaksin ini tidak efektif.`);
                statusBadge.textContent = `STATUS: RACIKAN GAGAL (${craftedVaccineName.toUpperCase()} TIDAK COCOK UNTUK ${currentPatient.disease.toUpperCase()})`;
              } else {
                showToast(`❌ RACIKAN GAGAL! ${craftedVaccineName} membutuhkan Serum Antibodi, Penstabil, dan Air Steril!`);
                statusBadge.textContent = 'STATUS: RACIKAN GAGAL — BAHAN PENUNJANG KURANG LENGKAP';
              }
              
              statusBadge.style.background = 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)';
              btnBrew.disabled = false;

              // Reset Slots
              slots = [null, null, null, null];
              slotEls.forEach((s, idx) => {
                s.innerHTML = `<span class="slot-num-tag">SLOT ${idx + 1}</span><span style="color:#64748b; font-size:0.75rem;">KOSONG</span>`;
                s.classList.remove('slot-filled');
              });
              ingCards.forEach(c => c.classList.remove('used'));
              btnBrew.style.display = 'none';
            }
          }, 2400);
        });
      }
    }, 50);

    return `
      <div id="level3-stage" class="level3-master-container">
        
        <!-- TOP HISTORICAL TITLE HEADER -->
        <div class="level3-top-header">
          <div class="level3-title-row">
            <div>
              <div class="level3-title-text">LEVEL 3 (C3 - MENERAPKAN): MISI VAKSIN CACAR — VAKSIN FACTORY</div>
              <div class="level3-subtitle-text">Racik kombinasi bahan baku yang aman & efektif untuk memproduksi Vaksin Cacar massal!</div>
            </div>
            <div class="level3-score-badge" style="font-weight:900; color:#fef08a;">⭐ BONUS: +100 POIN</div>
          </div>
        </div>

        <!-- PLAYER GUIDE & STEP-BY-STEP DIRECTIONS BANNER -->
        <div class="player-guide-banner">
          <div class="guide-banner-header">
            <span class="guide-icon">💡</span>
            <span>PANDUAN & ARAHAN PERMAINAN LEVEL 3:</span>
          </div>
          <div class="guide-steps-grid">
            <div class="guide-step-card step-active">
              <span class="g-num">1</span>
              <div class="g-text">
                <strong>PILIH 4 BAHAN UTAMA:</strong>
                <p>Klik 4 bahan baku di rak bawah: <em>Virus Cacar Lemah</em>, <em>Serum Antibodi</em>, <em>Penstabil</em>, dan <em>Air Steril</em>.</p>
              </div>
            </div>
            <div class="guide-step-card">
              <span class="g-num">2</span>
              <div class="g-text">
                <strong>HINDARI VIRUS LAIN / MERKURI:</strong>
                <p>Jangan tertukar dengan <em>Virus Corona/HPV/Polio</em> atau <em>Racun Merkuri ☠️</em>!</p>
              </div>
            </div>
            <div class="guide-step-card">
              <span class="g-num">3</span>
              <div class="g-text">
                <strong>SINTESIS & IMUNISASI:</strong>
                <p>Tekan <em>⚙️ MULAI RACIK</em> untuk menyintesis vaksin & melarang wabah di Pos Imunisasi 1000 Warga!</p>
              </div>
            </div>
          </div>
        </div>

        <!-- MAIN THREE-PANEL WORKSPACE GRID -->
        <div class="level3-workspace-grid">
          
          <!-- LEFT PANEL: PATIENT SYMPTOMS & DIAGNOSIS -->
          <div class="level3-left-sidebar">
            <div class="sidebar-panel-title">📋 DIAGNOSIS GEJALA PASIEN</div>
            
            <div style="background:rgba(30,41,59,0.8); border:1.5px solid #38bdf8; border-radius:12px; padding:10px; display:flex; flex-direction:column; gap:6px;">
              <div style="display:flex; align-items:center; justify-content:space-between;">
                <span style="font-size:0.75rem; font-weight:900; color:#fef08a;" id="sidebar-patient-title">PASIEN ANTREAN #1</span>
                <span style="font-size:0.65rem; background:#0284c7; color:#fff; padding:2px 6px; border-radius:6px;" id="sidebar-patient-badge">🧑 Pak Budi (42 thn)</span>
              </div>
              <div style="font-size:0.7rem; color:#cbd5e1; line-height:1.3;">
                <strong>🤒 Keluhan & Gejala:</strong>
                <ul style="margin:4px 0 0 14px; padding:0; color:#cbd5e1;" id="sidebar-symptoms-list">
                  <li>Demam tinggi mendadak (39.5°C)</li>
                  <li>Bintil nanah menyebar di wajah & lengan</li>
                  <li>Badan sangat lemas & nyeri sendi</li>
                </ul>
              </div>
              <div style="background:rgba(239,68,68,0.15); border-left:3px solid #ef4444; padding:6px; border-radius:6px; font-size:0.68rem; color:#fca5a5;">
                <strong>🔬 Diagnosa Dokter STOVIA:</strong><br/>
                <span id="sidebar-doctor-notes">Terinfeksi Virus Cacar (Smallpox). Membutuhkan Vaksin Cacar Spesifik!</span>
              </div>
            </div>

            <div class="notes-clipboard-box" id="sidebar-formula-notes">
              <strong>📋 FORMULASI DIBUTUHKAN:</strong><br/>
              Racik: <em>Virus Cacar Lemah + Serum Antibodi + Penstabil + Air Steril</em>. Hati-hati jangan tertukar virus!
            </div>
          </div>

          <!-- CENTER PANEL: STEAMPUNK VACCINE MACHINE -->
          <div class="level3-center-machine-card">
            <div class="machine-header-badge" id="machine-status-badge">
              STATUS: MEMBUAT VAKSIN CACAR — SIAP RACIK
            </div>

            <div class="machine-vat-container">
              <div class="liquid-mixing-vat" id="liquid-mixing-vat"></div>
              <img src="/images/game/vaccine_vat_center.png" alt="Vaccine Mixing Vat" class="machine-vat-png" id="vat-center-icon" />
            </div>

            <div style="font-size:0.75rem; font-weight:800; color:#38bdf8;">SLOT INPUT BAHAN BAKU VAKSIN:</div>
            <div class="machine-four-slots-row">
              <div class="machine-input-slot">
                <span class="slot-num-tag">SLOT 1</span>
                <span style="color:#64748b; font-size:0.75rem;">KOSONG</span>
              </div>
              <div class="machine-input-slot">
                <span class="slot-num-tag">SLOT 2</span>
                <span style="color:#64748b; font-size:0.75rem;">KOSONG</span>
              </div>
              <div class="machine-input-slot">
                <span class="slot-num-tag">SLOT 3</span>
                <span style="color:#64748b; font-size:0.75rem;">KOSONG</span>
              </div>
              <div class="machine-input-slot">
                <span class="slot-num-tag">SLOT 4</span>
                <span style="color:#64748b; font-size:0.75rem;">KOSONG</span>
              </div>
            </div>
          </div>

          <!-- RIGHT PANEL: CLINIC & IMMUNIZATION QUEUE -->
          <div class="level3-right-clinic-card">
            <div class="sidebar-panel-title">POS IMUNISASI DESA</div>
            
            <div class="clinic-counter-box">
              <span class="counter-title">TARGET IMUNISASI MASSAL</span>
              <span class="counter-number" id="vaccinated-counter">0 / 1000</span>
              <span style="font-size:0.65rem; color:#94a3b8;">Warga Pemukiman Terproteksi</span>
            </div>

            <div style="font-size:0.72rem; font-weight:800; color:#cbd5e1; margin-top:4px;">🏥 ANTREAN WARGA DESA:</div>
            <div class="villagers-queue-box" id="villagers-queue">
              <span class="villager-character">🧑</span>
              <span class="villager-character">👧</span>
              <span class="villager-character">👦</span>
              <span class="villager-character">👩</span>
            </div>
          </div>

        </div>

        <!-- BOTTOM INGREDIENT SELECTION DOCK -->
        <div class="level3-bottom-dock">
          <div style="display:flex; align-items:center; justify-content:space-between;">
            <span class="dock-title-text">📦 SELECTION — RAK BAHAN BAKU VAKSIN (KLIK UNTUK MEMILIH):</span>
            <button id="btn-brew-master" class="btn-brew-master" style="display:none;">⚙️ MULAI RACIK & SINTESIS VAKSIN 🚀</button>
          </div>

          <div class="ingredients-grid-row">
            <div class="vaccine-ingredient-card" data-ing="virus_lemah" data-icon="🦠" data-name="Virus Cacar">
              <button class="btn-card-info" data-ing-info="virus_lemah" title="Informasi & Fungsi Virus Cacar">ℹ️</button>
              <img src="/images/game/vial_virus_cacar.png" alt="Virus Cacar Lemah" class="ing-card-png" />
              <span style="font-size:0.72rem; font-weight:800; color:#f8fafc;">Virus Cacar</span>
              <span style="font-size:0.6rem; color:#94a3b8;">Vaccinia/Cowpox</span>
            </div>

            <div class="vaccine-ingredient-card" data-ing="corona" data-icon="👑" data-name="Virus Corona">
              <button class="btn-card-info" data-ing-info="corona" title="Informasi & Fungsi Virus Corona">ℹ️</button>
              <img src="/images/game/vial_virus_corona.png" alt="Virus Corona" class="ing-card-png" />
              <span style="font-size:0.72rem; font-weight:800; color:#fed7aa;">Virus Corona</span>
              <span style="font-size:0.6rem; color:#ea580c;">SARS-CoV-2</span>
            </div>

            <div class="vaccine-ingredient-card" data-ing="hpv" data-icon="🔬" data-name="Virus HPV">
              <button class="btn-card-info" data-ing-info="hpv" title="Informasi & Fungsi Virus HPV">ℹ️</button>
              <img src="/images/game/vial_virus_hpv.png" alt="Virus HPV" class="ing-card-png" />
              <span style="font-size:0.72rem; font-weight:800; color:#fbcfe8;">Virus HPV</span>
              <span style="font-size:0.6rem; color:#ec4899;">Serviks</span>
            </div>

            <div class="vaccine-ingredient-card" data-ing="polio" data-icon="🦵" data-name="Virus Polio">
              <button class="btn-card-info" data-ing-info="polio" title="Informasi & Fungsi Virus Polio">ℹ️</button>
              <img src="/images/game/vial_virus_polio.png" alt="Virus Polio" class="ing-card-png" />
              <span style="font-size:0.72rem; font-weight:800; color:#cffafe;">Virus Polio</span>
              <span style="font-size:0.6rem; color:#06b6d4;">Sabin/Salk</span>
            </div>

            <div class="vaccine-ingredient-card" data-ing="campak" data-icon="🔴" data-name="Virus Campak">
              <button class="btn-card-info" data-ing-info="campak" title="Informasi & Fungsi Virus Campak">ℹ️</button>
              <img src="/images/game/vial_virus_campak.png" alt="Virus Campak" class="ing-card-png" />
              <span style="font-size:0.72rem; font-weight:800; color:#fca5a5;">Virus Campak</span>
              <span style="font-size:0.6rem; color:#ef4444;">Vaksin MMR</span>
            </div>

            <div class="vaccine-ingredient-card" data-ing="influenza" data-icon="🤧" data-name="Influenza">
              <button class="btn-card-info" data-ing-info="influenza" title="Informasi & Fungsi Virus Influenza">ℹ️</button>
              <img src="/images/game/vial_virus_influenza.png" alt="Virus Influenza" class="ing-card-png" />
              <span style="font-size:0.72rem; font-weight:800; color:#d1fae5;">Influenza</span>
              <span style="font-size:0.6rem; color:#10b981;">Flu Musiman</span>
            </div>

            <div class="vaccine-ingredient-card" data-ing="serum" data-icon="🧪" data-name="Serum Antibodi">
              <button class="btn-card-info" data-ing-info="serum" title="Informasi & Fungsi Serum Antibodi">ℹ️</button>
              <img src="/images/game/vial_serum.png" alt="Serum Antibodi" class="ing-card-png" />
              <span style="font-size:0.72rem; font-weight:800; color:#f8fafc;">Serum Antibodi</span>
              <span style="font-size:0.6rem; color:#94a3b8;">Imunitas Darah</span>
            </div>

            <div class="vaccine-ingredient-card" data-ing="stabilizer" data-icon="🧴" data-name="Penstabil">
              <button class="btn-card-info" data-ing-info="stabilizer" title="Informasi & Fungsi Cairan Penstabil">ℹ️</button>
              <img src="/images/game/vial_stabilizer.png" alt="Penstabil" class="ing-card-png" />
              <span style="font-size:0.72rem; font-weight:800; color:#f8fafc;">Cairan Penstabil</span>
              <span style="font-size:0.6rem; color:#94a3b8;">Pengunci Suhu</span>
            </div>

            <div class="vaccine-ingredient-card" data-ing="air_steril" data-icon="💧" data-name="Air Steril">
              <button class="btn-card-info" data-ing-info="air_steril" title="Informasi & Fungsi Air Steril">ℹ️</button>
              <img src="/images/game/vial_sterile_water.png" alt="Air Steril" class="ing-card-png" />
              <span style="font-size:0.72rem; font-weight:800; color:#f8fafc;">Air Steril</span>
              <span style="font-size:0.6rem; color:#94a3b8;">Pelarut Murni</span>
            </div>

            <div class="vaccine-ingredient-card" data-ing="poison" data-icon="☠️" data-name="Merkuri">
              <button class="btn-card-info" data-ing-info="poison" title="Informasi & Bahaya Racun Merkuri">ℹ️</button>
              <img src="/images/game/vial_toxic_mercury.png" alt="Merkuri" class="ing-card-png" />
              <span style="font-size:0.72rem; font-weight:800; color:#fca5a5;">Racun Merkuri</span>
              <span style="font-size:0.6rem; color:#ef4444;">BAHAYA / JEBAKAN</span>
            </div>
          </div>
        </div>

      </div>
    `;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // LEVEL 4: RUANG TBC (ISOLASI & SANITASI UDARA)
  // ═══════════════════════════════════════════════════════════════════════
  // ═══════════════════════════════════════════════════════════════════════
  // LEVEL 4: RUANG TBC (ISOLASI & SANITASI UDARA HEPA FILTER)
  // ═══════════════════════════════════════════════════════════════════════
  // ═══════════════════════════════════════════════════════════════════════
  // LEVEL 4: RUANG TBC (ISOLASI & SANITASI UDARA HEPA FILTER - 6 PASIEN)
  // ═══════════════════════════════════════════════════════════════════════
  // ═══════════════════════════════════════════════════════════════════════
  // LEVEL 4: RUANG TBC (ISOLASI & SANITASI UDARA HEPA FILTER - REKAM MEDIS)
  // ═══════════════════════════════════════════════════════════════════════
  // ═══════════════════════════════════════════════════════════════════════
  // LEVEL 4: RUANG TBC (ISOLASI & SANITASI UDARA HEPA FILTER - AUDIT EVALUASI)
  // ═══════════════════════════════════════════════════════════════════════
  function renderLevel4RuangTBC() {
    let placed = 0;
    const total = 6;
    let score = 0;
    const roomAssignments = {}; // { 1: patientData, 2: patientData, ... }

    const patientDetails = {
      'p1': {
        id: 'p1',
        name: 'Pak Budi (42 thn)',
        img: '/images/game/patient_coughing_tbc.png',
        airborne: true,
        tag: '🔴 TBC Aktif (Airborne)',
        symptoms: 'Batuk dahak berdarah >3 minggu, demam tinggi 39.2°C, lemas hebat.',
        labResult: 'Bakteri Mycobacterium tuberculosis (+), Rontgen: Kavitas Paru Aktif.',
        transmission: 'Aerosol Udara (Airborne)',
        advice: 'WAJIB ke Ruang Isolasi Bertekanan Negatif + HEPA Filter (Ruang 1, 3, atau 4)!'
      },
      'p2': {
        id: 'p2',
        name: 'Anisa (9 thn)',
        img: '/images/game/patient_coughing_tbc.png',
        airborne: true,
        tag: '🔴 Flu Aerosol (Airborne)',
        symptoms: 'Bersin-bersin keras, batuk sesak nafas mendadak, suhu 39.0°C.',
        labResult: 'Swab PCR Positif Virus Influenza Aerosol.',
        transmission: 'Aerosol Udara (Airborne)',
        advice: 'WAJIB ke Ruang HEPA Filter (Ruang 1, 3, atau 4)!'
      },
      'p3': {
        id: 'p3',
        name: 'Doni (6 thn)',
        img: '/images/game/patient_mild.png',
        airborne: false,
        tag: '🟢 Demam Biasa (Aman)',
        symptoms: 'Demam ringan 37.8°C, tidak ada batuk/gejala sirkulasi udara.',
        labResult: 'Infeksi ringan non-airborne.',
        transmission: 'Kontak Langsung (Non-Airborne)',
        advice: 'Boleh ditempatkan di Ruang Standar (Ruang 2, 5, atau 6).'
      },
      'p4': {
        id: 'p4',
        name: 'Ibu Rahma (55 thn)',
        img: '/images/game/patient_coughing_tbc.png',
        airborne: true,
        tag: '🔴 TBC Dahak (Airborne)',
        symptoms: 'Batuk kronis 1 bulan, keringat dingin malam, BB turun 8 kg.',
        labResult: 'Sputum Dahak BTA (+).',
        transmission: 'Aerosol Udara (Airborne)',
        advice: 'WAJIB ke Ruang HEPA Filter (Ruang 1, 3, atau 4)!'
      },
      'p5': {
        id: 'p5',
        name: 'Pak Eko (48 thn)',
        img: '/images/game/patient_mild.png',
        airborne: false,
        tag: '🟢 Pegal Linu (Aman)',
        symptoms: 'Nyeri otot & sendi setelah bekerja di ladang, suhu normal.',
        labResult: 'Pemeriksaan Fisik Normal.',
        transmission: 'Non-Menular Udara (Aman)',
        advice: 'Boleh ditempatkan di Ruang Standar (Ruang 2, 5, atau 6).'
      },
      'p6': {
        id: 'p6',
        name: 'Siti (12 thn)',
        img: '/images/game/patient_mild.png',
        airborne: false,
        tag: '🟢 Pusing Ringan (Aman)',
        symptoms: 'Pusing ringan kelelahan belajar, tidak ada gejala batuk/dahak.',
        labResult: 'Pemeriksaan Fisik Normal.',
        transmission: 'Non-Menular Udara (Aman)',
        advice: 'Boleh ditempatkan di Ruang Standar (Ruang 2, 5, atau 6).'
      }
    };

    setTimeout(() => {
      const stage = container.querySelector('#level4-stage');
      if (!stage) return;

      const patientCards = stage.querySelectorAll('.patient-selection-card');
      const roomCards = stage.querySelectorAll('.isolation-room-card');
      const infoBtns = stage.querySelectorAll('.btn-info-record');
      const scoreEl = stage.querySelector('#l4-score');
      const progressTextEl = stage.querySelector('#l4-progress-text');
      const progressFillEl = stage.querySelector('#l4-progress-fill');
      const btnCheckOutbreak = stage.querySelector('#btn-check-outbreak');
      let activePatient = null;

      function updateCheckButtonState() {
        if (!btnCheckOutbreak) return;
        if (placed >= total) {
          btnCheckOutbreak.disabled = false;
          btnCheckOutbreak.style.opacity = '1';
          btnCheckOutbreak.style.cursor = 'pointer';
          btnCheckOutbreak.style.animation = 'pulse 1.5s infinite';
          btnCheckOutbreak.textContent = '🔍 CEK SIMULASI PENULARAN & SANITASI UDARA 🚀';
        } else {
          btnCheckOutbreak.disabled = true;
          btnCheckOutbreak.style.opacity = '0.5';
          btnCheckOutbreak.style.cursor = 'not-allowed';
          btnCheckOutbreak.style.animation = 'none';
          btnCheckOutbreak.textContent = `🔒 SERET / PILIH 6 PASIEN KE KAMAR (${placed}/${total})`;
        }
      }

      function evaluateAllPlacements() {
        audioEngine.playTap();

        const errors = [];
        const successes = [];

        roomCards.forEach(room => {
          const rnum = room.getAttribute('data-room-num');
          const isHepa = room.getAttribute('data-hepa') === 'true';
          const patient = roomAssignments[rnum];

          if (patient) {
            if (patient.airborne && !isHepa) {
              errors.push({
                roomNum: rnum,
                patient: patient,
                reason: `Pasien ${patient.name} (${patient.tag}) menderita infeksi aerosol airborne! Karena ditaruh di KAMAR ${rnum} (Standar Tanpa HEPA Filter), kuman menyebar ke sirkulasi koridor!`
              });
            } else {
              successes.push({
                roomNum: rnum,
                patient: patient
              });
            }
          }
        });

        if (errors.length > 0) {
          audioEngine.playWrong();
          gameState.addPoints(-20);
          updateScore();

          const errorListHtml = errors.map(err => `
            <div style="background:rgba(239,68,68,0.2); border:1.5px solid #ef4444; border-radius:14px; padding:12px; font-size:0.8rem; line-height:1.4; color:#fecdd3;">
              <strong style="color:#fca5a5;">🚨 KAMAR ISOLASI ${err.roomNum}: KONTAMINASI TERJADI!</strong><br/>
              ${err.reason}
            </div>
          `).join('');

          const overlay = document.createElement('div');
          overlay.className = 'rekam-medis-overlay';
          overlay.innerHTML = `
            <div class="failure-overlay-card" style="max-width:600px;">
              <span style="font-size:3rem;">🚨 OUTBREAK AUDIT REPORT</span>
              <h2 style="margin:0; color:#fca5a5; font-size:1.3rem;">EVALUASI SANITASI: DITEMUKAN ${errors.length} KONTAMINASI PENULARAN!</h2>
              <div style="display:flex; flex-direction:column; gap:10px; width:100%; text-align:left; max-height:240px; overflow-y:auto; padding-right:4px;">
                ${errorListHtml}
              </div>
              <div style="font-size:0.75rem; color:#f8fafc; background:rgba(0,0,0,0.4); padding:10px; border-radius:12px;">
                💡 <strong>SOLUSI SANITARIAN:</strong> Pasien TBC/Flu Aerosol (🔴) WAJIB dipindahkan ke Kamar 1, 3, atau 4 (HEPA Filter Aktif 🟢)!
              </div>
              <button id="btn-rearrange-l4" style="background:#ef4444; color:#fff; border:none; border-radius:12px; padding:12px 24px; font-weight:900; font-size:0.95rem; cursor:pointer; box-shadow:0 4px 15px rgba(239,68,68,0.5);">
                🔄 PERBAIKI PENEMPATAN ISOLASI
              </button>
            </div>
          `;
          document.body.appendChild(overlay);

          overlay.querySelector('#btn-rearrange-l4').addEventListener('click', () => {
            overlay.remove();
          });
        } else {
          audioEngine.playSuccess();
          score = 300;
          if (scoreEl) scoreEl.textContent = score;

          gameState.addPoints(100);
          updateScore();

          setTimeout(() => {
            renderVictoryScreen(
              4,
              'Sanitator Isolasi Medis Perfect',
              'Luar Biasa! Evaluasi Sanitasi Udara 100% Bebas Penularan Silang! Seluruh 6 pasien berhasil terisolasi dengan aman!',
              score
            );
          }, 600);
        }
      }

      function removePatientFromRoom(roomNum) {
        const patientData = roomAssignments[roomNum];
        if (!patientData) return;

        audioEngine.playTap();

        const roomEl = stage.querySelector(`.isolation-room-card[data-room-num="${roomNum}"]`);
        if (roomEl) {
          roomEl.classList.remove('occupied');
          const badge = roomEl.querySelector('.placed-patient-badge');
          if (badge) badge.remove();
        }

        delete roomAssignments[roomNum];

        const cardEl = stage.querySelector(`.patient-selection-card[data-pid="${patientData.id}"]`);
        if (cardEl) {
          cardEl.classList.remove('placed', 'selected');
        }

        if (placed > 0) placed--;

        if (progressTextEl) progressTextEl.textContent = `${placed} / ${total} Pasien`;
        if (progressFillEl) progressFillEl.style.width = `${(placed / total) * 100}%`;

        updateCheckButtonState();
        showToast(`🔄 Pasien ${patientData.name} dipindahkan kembali ke antrean dock!`);
      }

      function resetAllRoomAssignments() {
        audioEngine.playTap();
        for (let rnum = 1; rnum <= 6; rnum++) {
          if (roomAssignments[rnum]) {
            const pData = roomAssignments[rnum];
            const roomEl = stage.querySelector(`.isolation-room-card[data-room-num="${rnum}"]`);
            if (roomEl) {
              roomEl.classList.remove('occupied');
              const badge = roomEl.querySelector('.placed-patient-badge');
              if (badge) badge.remove();
            }
            const cardEl = stage.querySelector(`.patient-selection-card[data-pid="${pData.id}"]`);
            if (cardEl) {
              cardEl.classList.remove('placed', 'selected');
            }
            delete roomAssignments[rnum];
          }
        }
        placed = 0;
        if (progressTextEl) progressTextEl.textContent = `0 / ${total} Pasien`;
        if (progressFillEl) progressFillEl.style.width = `0%`;
        updateCheckButtonState();
        showToast('🔄 seluruh 6 posisi pasien berhasil di-reset!');
      }

      function handlePlacement(room, patientData) {
        const roomNum = room.getAttribute('data-room-num');
        
        // If room is already occupied, remove existing patient first
        if (room.classList.contains('occupied')) {
          removePatientFromRoom(roomNum);
        }

        audioEngine.playTap();
        room.classList.add('occupied');
        roomAssignments[roomNum] = patientData;

        const badge = document.createElement('div');
        badge.className = 'placed-patient-badge';
        badge.innerHTML = `
          <span>✅ DITEMPATKAN</span>
          <span style="font-size:0.75rem; font-weight:800; color:#fef08a;">${patientData.name}</span>
          <button class="btn-vacate-room" data-rnum="${roomNum}" style="background:#ef4444; color:#fff; border:none; border-radius:6px; padding:3px 8px; font-size:0.65rem; font-weight:800; cursor:pointer; margin-top:4px; box-shadow:0 2px 6px rgba(0,0,0,0.3);">
            🔄 Pindahkan
          </button>
        `;
        room.appendChild(badge);

        badge.querySelector('.btn-vacate-room').addEventListener('click', (e) => {
          e.stopPropagation();
          removePatientFromRoom(roomNum);
        });

        const cardEl = stage.querySelector(`.patient-selection-card[data-pid="${patientData.id}"]`);
        if (cardEl) {
          cardEl.classList.add('placed');
          cardEl.classList.remove('selected', 'dragging');
        }

        activePatient = null;
        placed++;

        if (progressTextEl) progressTextEl.textContent = `${placed} / ${total} Pasien`;
        if (progressFillEl) progressFillEl.style.width = `${(placed / total) * 100}%`;

        updateCheckButtonState();
        showToast(`✅ ${patientData.name} ditempatkan di Kamar ${roomNum}. (${placed}/${total} Pasien)`);
      }

      const btnResetAll = stage.querySelector('#btn-reset-all-placements');
      if (btnResetAll) {
        btnResetAll.addEventListener('click', () => resetAllRoomAssignments());
      }

      function openRekamMedisModal(pId) {
        const p = patientDetails[pId];
        if (!p) return;

        audioEngine.playTap();

        const overlay = document.createElement('div');
        overlay.className = 'rekam-medis-overlay';
        overlay.innerHTML = `
          <div class="rekam-medis-card">
            <div class="rm-header">
              <div style="display:flex; align-items:center; gap:10px;">
                <span style="font-size:1.3rem;">📋</span>
                <div>
                  <h3 style="margin:0; font-size:1.15rem; color:#38bdf8;">KARTU REKAM MEDIS PASIEN</h3>
                  <span style="font-size:0.72rem; color:#94a3b8;">STOVIA Medical Center ID: #${p.id}</span>
                </div>
              </div>
              <button id="close-rm-modal" style="background:none; border:none; color:#94a3b8; font-size:1.3rem; cursor:pointer;">✖</button>
            </div>

            <div class="rm-body">
              <div class="rm-avatar-box">
                <img src="${p.img}" alt="${p.name}" class="rm-avatar-img" />
              </div>
              <div class="rm-details">
                <strong style="font-size:0.95rem; color:#fef08a;">${p.name}</strong>
                <span style="font-size:0.75rem; font-weight:800; color:${p.airborne ? '#fca5a5' : '#6ee7b7'};">${p.tag}</span>
                <div><strong>🤒 Keluhan & Gejala:</strong> ${p.symptoms}</div>
                <div><strong>🔬 Hasil Lab/Rontgen:</strong> ${p.labResult}</div>
                <div><strong>💨 Transmisi:</strong> ${p.transmission}</div>
                <div style="background:rgba(2,132,199,0.2); border-left:3px solid #38bdf8; padding:6px; border-radius:6px; font-size:0.75rem; color:#bae6fd; margin-top:4px;">
                  <strong>💡 SARAN SANITARIAN:</strong><br/>${p.advice}
                </div>
              </div>
            </div>

            <div style="border-top:1.5px solid #334155; padding-top:12px;">
              <span style="font-size:0.78rem; font-weight:900; color:#cbd5e1;">🏥 PILIH KAMAR ISOLASI UNTUK PASIEN INI:</span>
              <div class="rm-room-buttons">
                <button class="btn-assign-room hepa" data-rnum="1">Kamar 1 (HEPA 🟢)</button>
                <button class="btn-assign-room danger" data-rnum="2">Kamar 2 (Standar 🔴)</button>
                <button class="btn-assign-room hepa" data-rnum="3">Kamar 3 (HEPA 🟢)</button>
                <button class="btn-assign-room hepa" data-rnum="4">Kamar 4 (HEPA 🟢)</button>
                <button class="btn-assign-room danger" data-rnum="5">Kamar 5 (Standar 🔴)</button>
                <button class="btn-assign-room danger" data-rnum="6">Kamar 6 (Standar 🔴)</button>
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(overlay);

        overlay.querySelector('#close-rm-modal').addEventListener('click', () => overlay.remove());

        const assignBtns = overlay.querySelectorAll('.btn-assign-room');
        assignBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            const rnum = btn.getAttribute('data-rnum');
            const roomEl = stage.querySelector(`.isolation-room-card[data-room-num="${rnum}"]`);
            overlay.remove();
            if (roomEl) handlePlacement(roomEl, p);
          });
        });
      }

      if (btnCheckOutbreak) {
        btnCheckOutbreak.addEventListener('click', () => {
          if (placed < total) return;
          evaluateAllPlacements();
        });
      }

      // Info Buttons Click
      infoBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const pid = btn.getAttribute('data-pid');
          openRekamMedisModal(pid);
        });
      });

      // Drag & Drop for Patient Cards
      patientCards.forEach(card => {
        const pid = card.getAttribute('data-pid');
        const pData = patientDetails[pid] || {
          id: pid,
          name: card.getAttribute('data-name'),
          airborne: card.getAttribute('data-airborne') === 'true'
        };

        card.addEventListener('dragstart', (e) => {
          if (card.classList.contains('placed')) {
            e.preventDefault();
            return;
          }
          audioEngine.playTap();
          card.classList.add('dragging');
          activePatient = pData;
          e.dataTransfer.setData('text/plain', JSON.stringify({ pid }));
        });

        card.addEventListener('dragend', () => {
          card.classList.remove('dragging');
        });

        card.addEventListener('click', () => {
          if (card.classList.contains('placed')) return;
          audioEngine.playTap();
          patientCards.forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          activePatient = pData;
          showToast(`💡 Seret (drag), klik kamar, atau tekan ℹ️ Rekam Medis untuk ${pData.name}!`);
        });
      });

      // Drop Targets: Isolation Rooms
      roomCards.forEach(room => {
        room.addEventListener('dragover', (e) => {
          e.preventDefault();
          if (!room.classList.contains('occupied')) {
            room.classList.add('drag-over');
          }
        });

        room.addEventListener('dragleave', () => {
          room.classList.remove('drag-over');
        });

        room.addEventListener('drop', (e) => {
          e.preventDefault();
          room.classList.remove('drag-over');
          if (room.classList.contains('occupied')) return;
          if (!activePatient) return;

          handlePlacement(room, activePatient);
        });

        room.addEventListener('click', () => {
          if (room.classList.contains('occupied')) return;
          if (!activePatient) {
            showToast('💡 Klik tombol ℹ️ Rekam Medis atau seret pasien dari antrean bawah!');
            return;
          }
          handlePlacement(room, activePatient);
        });
      });
    }, 50);

    return `
      <div id="level4-stage" class="level4-master-container">
        
        <!-- LEVEL 4 TOP HEADER -->
        <div style="display:flex; align-items:center; justify-content:space-between; background:linear-gradient(135deg, #0f172a, #1e293b); border:3px solid #0284c7; border-radius:20px; padding:14px 22px; box-shadow:0 8px 25px rgba(15,23,42,0.3);">
          <div style="display:flex; align-items:center; gap:14px;">
            <div>
              <h3 style="margin:0; font-size:1.2rem; font-weight:900; color:#f8fafc;">LEVEL 4 (C4 - MENGANALISIS): RUANG TBC — ISOLASI & SANITASI UDARA</h3>
              <span style="font-size:0.75rem; color:#94a3b8;">Tempatkan seluruh 6 pasien ke kamar, lalu tekan tombol "CEK SIMULASI PENULARAN UDARA"!</span>
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:10px; background:rgba(30,41,59,0.8); padding:6px 14px; border-radius:14px; border:1px solid #38bdf8;">
            <img src="/images/game/doctor_guide_avatar.png" alt="Doctor Avatar" style="width:38px; height:38px; border-radius:50%; border:2px solid #38bdf8;" />
            <div style="display:flex; flex-direction:column;">
              <span style="font-size:0.75rem; font-weight:900; color:#fef08a;">DOKTER STOVIA</span>
              <span style="font-size:0.65rem; color:#38bdf8;">Panduan Sanitarian</span>
            </div>
          </div>
        </div>

        <!-- MAIN 2-COLUMN DASHBOARD GRID -->
        <div class="level4-main-grid">
          
          <!-- LEFT SIDEBAR: OBJECTIVES, SCORE & RULES -->
          <div class="level4-left-sidebar">
            <div class="l4-panel-title">📋 ANALISIS & ATURAN ISOLASI</div>

            <div class="l4-info-box">
              <strong>🎯 TUJUAN ISOLASI:</strong>
              Menganalisis rute penularan patogen (Airborne vs Droplet/Kontak) dan mencegah penularan silang di rumah sakit.
            </div>

            <div class="l4-info-box">
              <strong>⚠️ ATURAN KESELAMATAN:</strong>
              Pasien dengan gejala <strong>Batuk Dahak / TBC / Flu Aerosol 🔴</strong> WAJIB diisolasikan ke ruang bertekanan negatif dengan <strong>HEPA Filter Aktif 🟢</strong>!
            </div>

            <!-- SCORE & PROGRESS CARD -->
            <div style="background:rgba(2,6,23,0.85); border:2px solid #0284c7; border-radius:18px; padding:14px; display:flex; flex-direction:column; gap:10px;">
              <div style="display:flex; align-items:center; justify-content:space-between;">
                <span style="font-size:0.8rem; font-weight:900; color:#cbd5e1;">⭐ TOTAL SKOR:</span>
                <span style="font-size:1.4rem; font-weight:900; color:#fef08a;" id="l4-score">0</span>
              </div>

              <div style="display:flex; flex-direction:column; gap:6px;">
                <div style="display:flex; align-items:center; justify-content:space-between; font-size:0.75rem; font-weight:800; color:#94a3b8;">
                  <span>PROGRESS ISOLASI:</span>
                  <span id="l4-progress-text" style="color:#6ee7b7;">0 / 6 Pasien</span>
                </div>
                <div style="width:100%; height:12px; background:rgba(30,41,59,0.8); border-radius:10px; overflow:hidden; border:1px solid #0284c7;">
                  <div id="l4-progress-fill" style="width:0%; height:100%; background:linear-gradient(90deg, #38bdf8, #10b981); transition:width 0.4s ease;"></div>
                </div>
              </div>
            </div>

            <!-- ACTION BUTTON: CEK SIMULASI PENULARAN -->
            <button id="btn-check-outbreak" disabled style="background:linear-gradient(135deg, #10b981 0%, #059669 100%); color:#ffffff; border:2px solid #6ee7b7; border-radius:16px; padding:14px; font-weight:900; font-size:0.88rem; opacity:0.5; cursor:not-allowed; box-shadow:0 6px 20px rgba(16,185,129,0.4); margin-top:8px;">
              🔒 SERET / PILIH 6 PASIEN KE KAMAR (0/6)
            </button>

            <!-- RESET POSISI BUTTON -->
            <button id="btn-reset-all-placements" style="background:rgba(239,68,68,0.2); color:#fca5a5; border:1.5px solid #ef4444; border-radius:12px; padding:8px 12px; font-weight:800; font-size:0.75rem; cursor:pointer; margin-top:4px; transition:all 0.2s ease;">
              🔄 RESET SEMUA POSISI PASIEN
            </button>

          </div>

          <!-- CENTER SECTION: 6 ROOMS GRID -->
          <div class="level4-center-section">
            
            <div style="display:flex; align-items:center; justify-content:space-between; background:#ffffff; border:2px solid #0284c7; border-radius:16px; padding:10px 16px;">
              <span style="font-size:0.88rem; font-weight:900; color:#0f172a;">🏥 DENAH 6 RUANG ISOLASI RUMAH SAKIT:</span>
              <span style="font-size:0.75rem; font-weight:800; color:#0284c7;">3 HEPA Aktif | 3 Standar</span>
            </div>

            <!-- 6 ISOLATION ROOMS GRID (3x2) -->
            <div class="level4-rooms-grid">
              
              <!-- ROOM 1: HEPA ACTIVE -->
              <div class="isolation-room-card hepa-active" data-hepa="true" data-room-num="1">
                <span class="room-title-tag">KAMAR 1 (HEPA 🟢)</span>
                <img src="/images/game/room_hepa_active.png" alt="Ruang Isolasi 1" class="room-png-img" />
              </div>

              <!-- ROOM 2: NON-STANDARD -->
              <div class="isolation-room-card non-standard" data-hepa="false" data-room-num="2">
                <span class="room-title-tag danger">KAMAR 2 (STANDAR 🔴)</span>
                <img src="/images/game/room_non_standard.png" alt="Ruang Isolasi 2" class="room-png-img" />
              </div>

              <!-- ROOM 3: HEPA ACTIVE -->
              <div class="isolation-room-card hepa-active" data-hepa="true" data-room-num="3">
                <span class="room-title-tag">KAMAR 3 (HEPA 🟢)</span>
                <img src="/images/game/room_hepa_active.png" alt="Ruang Isolasi 3" class="room-png-img" />
              </div>

              <!-- ROOM 4: HEPA ACTIVE -->
              <div class="isolation-room-card hepa-active" data-hepa="true" data-room-num="4">
                <span class="room-title-tag">KAMAR 4 (HEPA 🟢)</span>
                <img src="/images/game/room_hepa_active.png" alt="Ruang Isolasi 4" class="room-png-img" />
              </div>

              <!-- ROOM 5: NON-STANDARD -->
              <div class="isolation-room-card" data-hepa="false" data-room-num="5">
                <span class="room-title-tag">KAMAR 5 (STANDAR 🔴)</span>
                <img src="/images/game/room_non_standard.png" alt="Ruang Isolasi 5" class="room-png-img" />
              </div>

              <!-- ROOM 6: NON-STANDARD -->
              <div class="isolation-room-card" data-hepa="false" data-room-num="6">
                <span class="room-title-tag">KAMAR 6 (STANDAR 🔴)</span>
                <img src="/images/game/room_non_standard.png" alt="Ruang Isolasi 6" class="room-png-img" />
              </div>

            </div>

          </div>

        </div>

        <!-- BOTTOM DOCK: 6 PATIENTS QUEUE CARDS -->
        <div style="margin-top:16px; background:#0f172a; border:2px solid #0284c7; border-radius:18px; padding:14px 18px; box-shadow:0 8px 25px rgba(15,23,42,0.4);">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:1.2rem;">🧑‍⚕️</span>
              <span style="font-family:var(--font-heading); font-size:0.9rem; font-weight:800; color:#f8fafc;">
                ANTREAN 6 PASIEN RUMAH SAKIT (SERET ATAU KLIK PASIEN UNTUK MEMILIH KAMAR):
              </span>
            </div>
            <span style="font-size:0.75rem; color:#94a3b8;">
              💡 Klik ikon ℹ️ untuk membaca Rekam Medis & Gejala Pasien
            </span>
          </div>

          <div style="display:grid; grid-template-columns:repeat(6, 1fr); gap:12px;" class="patients-cards-row">

            <div class="patient-selection-card" draggable="true" data-pid="p1" data-name="Pak Budi (42 thn)" data-airborne="true">
              <div style="display:flex; align-items:center; justify-content:space-between; width:100%; font-size:0.68rem; font-weight:800;">
                <span style="background:#ef4444; color:#fff; padding:2px 6px; border-radius:4px;">🔴 Airborne</span>
                <button class="btn-info-record" data-pid="p1" style="background:#0284c7; color:#fff; border:none; border-radius:4px; padding:2px 6px; cursor:pointer;">ℹ️</button>
              </div>
              <img src="/images/game/patient_coughing_tbc.png" alt="Pak Budi" class="patient-card-png" style="width:48px; height:48px; margin:4px 0;" />
              <strong style="font-size:0.78rem; color:#0f172a;">Pak Budi (42th)</strong>
              <span style="font-size:0.65rem; color:#ef4444; font-weight:700;">🔴 TBC Aktif</span>
            </div>

            <div class="patient-selection-card" draggable="true" data-pid="p2" data-name="Anisa (9 thn)" data-airborne="true">
              <div style="display:flex; align-items:center; justify-content:space-between; width:100%; font-size:0.68rem; font-weight:800;">
                <span style="background:#ef4444; color:#fff; padding:2px 6px; border-radius:4px;">🔴 Airborne</span>
                <button class="btn-info-record" data-pid="p2" style="background:#0284c7; color:#fff; border:none; border-radius:4px; padding:2px 6px; cursor:pointer;">ℹ️</button>
              </div>
              <img src="/images/game/patient_coughing_tbc.png" alt="Anisa" class="patient-card-png" style="width:48px; height:48px; margin:4px 0;" />
              <strong style="font-size:0.78rem; color:#0f172a;">Anisa (9th)</strong>
              <span style="font-size:0.65rem; color:#ef4444; font-weight:700;">🔴 Flu Aerosol</span>
            </div>

            <div class="patient-selection-card" draggable="true" data-pid="p3" data-name="Doni (6 thn)" data-airborne="false">
              <div style="display:flex; align-items:center; justify-content:space-between; width:100%; font-size:0.68rem; font-weight:800;">
                <span style="background:#10b981; color:#fff; padding:2px 6px; border-radius:4px;">🟢 Kontak</span>
                <button class="btn-info-record" data-pid="p3" style="background:#0284c7; color:#fff; border:none; border-radius:4px; padding:2px 6px; cursor:pointer;">ℹ️</button>
              </div>
              <img src="/images/game/patient_mild.png" alt="Doni" class="patient-card-png" style="width:48px; height:48px; margin:4px 0;" />
              <strong style="font-size:0.78rem; color:#0f172a;">Doni (6th)</strong>
              <span style="font-size:0.65rem; color:#10b981; font-weight:700;">🟢 Demam Biasa</span>
            </div>

            <div class="patient-selection-card" draggable="true" data-pid="p4" data-name="Ibu Rahma (55 thn)" data-airborne="true">
              <div style="display:flex; align-items:center; justify-content:space-between; width:100%; font-size:0.68rem; font-weight:800;">
                <span style="background:#ef4444; color:#fff; padding:2px 6px; border-radius:4px;">🔴 Airborne</span>
                <button class="btn-info-record" data-pid="p4" style="background:#0284c7; color:#fff; border:none; border-radius:4px; padding:2px 6px; cursor:pointer;">ℹ️</button>
              </div>
              <img src="/images/game/patient_coughing_tbc.png" alt="Ibu Rahma" class="patient-card-png" style="width:48px; height:48px; margin:4px 0;" />
              <strong style="font-size:0.78rem; color:#0f172a;">Ibu Rahma (55th)</strong>
              <span style="font-size:0.65rem; color:#ef4444; font-weight:700;">🔴 TBC Dahak</span>
            </div>

            <div class="patient-selection-card" draggable="true" data-pid="p5" data-name="Pak Eko (48 thn)" data-airborne="false">
              <div style="display:flex; align-items:center; justify-content:space-between; width:100%; font-size:0.68rem; font-weight:800;">
                <span style="background:#10b981; color:#fff; padding:2px 6px; border-radius:4px;">🟢 Kontak</span>
                <button class="btn-info-record" data-pid="p5" style="background:#0284c7; color:#fff; border:none; border-radius:4px; padding:2px 6px; cursor:pointer;">ℹ️</button>
              </div>
              <img src="/images/game/patient_mild.png" alt="Pak Eko" class="patient-card-png" style="width:48px; height:48px; margin:4px 0;" />
              <strong style="font-size:0.78rem; color:#0f172a;">Pak Eko (48th)</strong>
              <span style="font-size:0.65rem; color:#10b981; font-weight:700;">🟢 Pegal Linu</span>
            </div>

            <div class="patient-selection-card" draggable="true" data-pid="p6" data-name="Siti (12 thn)" data-airborne="false">
              <div style="display:flex; align-items:center; justify-content:space-between; width:100%; font-size:0.68rem; font-weight:800;">
                <span style="background:#10b981; color:#fff; padding:2px 6px; border-radius:4px;">🟢 Kontak</span>
                <button class="btn-info-record" data-pid="p6" style="background:#0284c7; color:#fff; border:none; border-radius:4px; padding:2px 6px; cursor:pointer;">ℹ️</button>
              </div>
              <img src="/images/game/patient_mild.png" alt="Siti" class="patient-card-png" style="width:48px; height:48px; margin:4px 0;" />
              <strong style="font-size:0.78rem; color:#0f172a;">Siti (12th)</strong>
              <span style="font-size:0.65rem; color:#10b981; font-weight:700;">🟢 Pusing Ringan</span>
            </div>

          </div>
        </div>

      </div>
    `;
  }


  // ═══════════════════════════════════════════════════════════════════════
  // VICTORY SCREEN
  // ═══════════════════════════════════════════════════════════════════════
  function renderVictoryScreen(levelNum, badgeTitle, message, levelScore) {
    const stage = container.querySelector('#level-stage-container');
    if (!stage) return;

    gameState.completeEra(levelNum, 3);
    const stars = levelScore >= 100 ? 3 : levelScore >= 60 ? 2 : 1;

    stage.innerHTML = `
      <div class="game-victory-card" style="background-image:url('${ASSETS.victory}');">
        <div class="victory-overlay">
          <div class="victory-stars">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
          <h2 class="victory-title">🏆 LEVEL ${levelNum} SELESAI!</h2>
          <p class="victory-message">${message}</p>

          <div class="victory-badge-box">
            <span class="victory-badge-icon">🎖️</span>
            <span class="victory-badge-text">Lencana: ${badgeTitle}</span>
          </div>

          <div class="victory-score-box">
            <span>Poin Diraih: <strong>+${levelScore}</strong></span>
          </div>

          <div class="victory-actions">
            ${levelNum < 4 ? `
              <button id="btn-next-level" class="game-btn-primary">Lanjut Level ${levelNum + 1} →</button>
            ` : `
              <button id="btn-finish-all" class="game-btn-primary">🎓 Lihat Sertifikat!</button>
            `}
            <button id="btn-replay" class="game-btn-secondary">🔄 Main Lagi</button>
          </div>
        </div>
      </div>
    `;

    stage.querySelector('#btn-next-level')?.addEventListener('click', () => { activeLevel = levelNum + 1; buildUI(); });
    stage.querySelector('#btn-finish-all')?.addEventListener('click', () => router.navigate('report'));
    stage.querySelector('#btn-replay')?.addEventListener('click', () => buildUI());
  }

  // ─── HELPER ─────────────────────────────────────────────────────────
  function updateScore() {
    const el = container.querySelector('#game-total-score');
    if (el) el.textContent = gameState.data.player.points;
  }

  buildUI();
  return container;
}
