// TIMELINE MAP & LEVEL SELECT VIEW (Peta Perjalanan Sejarah & Pilihan Level Interaktif)

import { router } from '../core/router.js';
import { gameState } from '../core/state.js';
import { showHistoryInfo } from '../components/modals.js';

// RICH DETAILED SVG ILLUSTRATION GENERATOR FOR EACH SPECIFIC GAME SCENARIO LEVEL
export function getLevelIllustrationSVG(levelId, isUnlocked = true) {
  if (!isUnlocked) {
    return `
      <svg viewBox="0 0 200 200" width="100%" height="100%" style="max-width: 180px; max-height: 180px;">
        <rect x="10" y="10" width="180" height="180" rx="28" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="3"/>
        <circle cx="100" cy="100" r="55" fill="#e2e8f0"/>
        <text x="100" y="116" text-anchor="middle" font-size="48" fill="#64748b">🔒</text>
      </svg>
    `;
  }

  switch (levelId) {
    case 1:
      // LEVEL 1: Lab Digital (Mystery Virus/Bakteri & Mikroskop)
      return `
        <svg viewBox="0 0 200 200" width="100%" height="100%" style="max-width: 180px; max-height: 180px; filter: drop-shadow(0 10px 20px rgba(2, 132, 199, 0.3));">
          <defs>
            <linearGradient id="bg-lab" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#0f172a"/>
              <stop offset="100%" stop-color="#0284c7"/>
            </linearGradient>
            <linearGradient id="screen-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#1e293b"/>
              <stop offset="100%" stop-color="#0f172a"/>
            </linearGradient>
            <linearGradient id="virus-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fb7185"/>
              <stop offset="100%" stop-color="#e11d48"/>
            </linearGradient>
            <filter id="glow-cyan">
              <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#38bdf8" flood-opacity="0.8"/>
            </filter>
          </defs>
          <rect x="10" y="10" width="180" height="180" rx="28" fill="url(#bg-lab)"/>
          <rect x="25" y="25" width="150" height="115" rx="14" fill="url(#screen-grad)" stroke="#38bdf8" stroke-width="3" filter="url(#glow-cyan)"/>
          <line x1="25" y1="63" x2="175" y2="63" stroke="rgba(56,189,248,0.2)" stroke-width="1"/>
          <line x1="25" y1="100" x2="175" y2="100" stroke="rgba(56,189,248,0.2)" stroke-width="1"/>
          <line x1="75" y1="25" x2="75" y2="140" stroke="rgba(56,189,248,0.2)" stroke-width="1"/>
          <line x1="125" y1="25" x2="125" y2="140" stroke="rgba(56,189,248,0.2)" stroke-width="1"/>
          <circle cx="100" cy="80" r="34" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="6,4"/>
          <circle cx="100" cy="80" r="42" fill="none" stroke="rgba(56,189,248,0.4)" stroke-width="1.5"/>
          <g transform="translate(100, 80)">
            <circle cx="0" cy="0" r="16" fill="url(#virus-grad)" stroke="#ffffff" stroke-width="2"/>
            <path d="M0,-16 L0,-24 M0,16 L0,24 M-16,0 L-24,0 M16,0 L24,0 M-11,-11 L-17,-17 M11,11 L17,17 M-11,11 L-17,17 M11,-11 L17,-17" stroke="#fb7185" stroke-width="4" stroke-linecap="round"/>
            <circle cx="0" cy="-24" r="3" fill="#e11d48"/>
            <circle cx="0" cy="24" r="3" fill="#e11d48"/>
            <circle cx="-24" cy="0" r="3" fill="#e11d48"/>
            <circle cx="24" cy="0" r="3" fill="#e11d48"/>
          </g>
          <rect x="42" y="45" width="22" height="10" rx="5" fill="#34d399" transform="rotate(-25, 53, 50)" stroke="#ffffff" stroke-width="1.5"/>
          <rect x="130" y="105" width="24" height="10" rx="5" fill="#a7f3d0" transform="rotate(15, 142, 110)" stroke="#ffffff" stroke-width="1.5"/>
          <rect x="85" y="140" width="30" height="15" fill="#334155"/>
          <rect x="65" y="155" width="70" height="10" rx="3" fill="#475569"/>
          <rect x="25" y="148" width="8" height="24" rx="4" fill="#38bdf8" opacity="0.9"/>
          <rect x="36" y="145" width="8" height="27" rx="4" fill="#f43f5e" opacity="0.9"/>
          <rect x="110" y="148" width="60" height="20" rx="10" fill="#0284c7" stroke="#ffffff" stroke-width="1.5"/>
          <text x="140" y="162" text-anchor="middle" font-size="10" font-weight="bold" fill="#ffffff">🔬 1000x</text>
        </svg>
      `;

    case 2:
      // LEVEL 2: Jalur Penularan Kolera (Drag & Drop Sanitasi Sungai Desa)
      return `
        <svg viewBox="0 0 200 200" width="100%" height="100%" style="max-width: 180px; max-height: 180px; filter: drop-shadow(0 10px 20px rgba(16, 185, 129, 0.3));">
          <defs>
            <linearGradient id="bg-kolera" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#d1fae5"/>
              <stop offset="100%" stop-color="#059669"/>
            </linearGradient>
            <linearGradient id="river-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#38bdf8"/>
              <stop offset="100%" stop-color="#0284c7"/>
            </linearGradient>
          </defs>
          <rect x="10" y="10" width="180" height="180" rx="28" fill="url(#bg-kolera)"/>
          <path d="M10,120 Q50,110 100,125 T190,120 L190,190 L10,190 Z" fill="#a7f3d0"/>
          <path d="M20,190 C60,160 80,140 100,145 C130,150 150,170 180,190 Z" fill="url(#river-grad)"/>
          <g transform="translate(30, 85)">
            <polygon points="20,15 5,30 35,30" fill="#b45309"/>
            <rect x="10" y="30" width="20" height="20" fill="#fef3c7" stroke="#78350f" stroke-width="1.5"/>
            <rect x="17" y="38" width="6" height="12" fill="#78350f"/>
          </g>
          <g transform="translate(130, 75)">
            <polygon points="20,12 5,28 35,28" fill="#b45309"/>
            <rect x="10" y="28" width="20" height="22" fill="#ffffff" stroke="#78350f" stroke-width="1.5"/>
            <rect x="18" y="36" width="6" height="14" fill="#0284c7"/>
          </g>
          <g transform="translate(85, 95)">
            <rect x="12" y="10" width="8" height="35" rx="3" fill="#94a3b8" stroke="#334155" stroke-width="1.5"/>
            <rect x="5" y="10" width="22" height="6" rx="2" fill="#0284c7"/>
            <path d="M20,18 L32,24" stroke="#0284c7" stroke-width="4" stroke-linecap="round"/>
            <circle cx="34" cy="30" r="5" fill="#38bdf8"/>
          </g>
          <g transform="translate(125, 25)">
            <circle cx="25" cy="25" r="22" fill="#10b981" stroke="#ffffff" stroke-width="3"/>
            <text x="25" y="33" text-anchor="middle" font-size="20" fill="#ffffff">💧</text>
          </g>
        </svg>
      `;

    case 3:
      // LEVEL 3: Misi Vaksin Cacar (Vaksin Factory Machine)
      return `
        <svg viewBox="0 0 200 200" width="100%" height="100%" style="max-width: 180px; max-height: 180px; filter: drop-shadow(0 10px 20px rgba(139, 92, 246, 0.3));">
          <defs>
            <linearGradient id="bg-vaksin" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#f3e8ff"/>
              <stop offset="100%" stop-color="#6d28d9"/>
            </linearGradient>
            <linearGradient id="machine-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#7c3aed"/>
              <stop offset="100%" stop-color="#4c1d95"/>
            </linearGradient>
          </defs>
          <rect x="10" y="10" width="180" height="180" rx="28" fill="url(#bg-vaksin)"/>
          <rect x="35" y="45" width="130" height="95" rx="16" fill="url(#machine-grad)" stroke="#ffffff" stroke-width="3"/>
          <circle cx="100" cy="90" r="30" fill="rgba(255,255,255,0.2)" stroke="#a78bfa" stroke-width="3"/>
          <path d="M75,98 C85,85 115,85 125,98 C125,115 75,115 75,98 Z" fill="#34d399" opacity="0.85"/>
          <circle cx="92" cy="85" r="4" fill="#ffffff"/>
          <circle cx="108" cy="92" r="3" fill="#ffffff"/>
          <path d="M85,25 L115,25 L108,45 L92,45 Z" fill="#ddd6fe" stroke="#6d28d9" stroke-width="2"/>
          <g transform="translate(130, 110)">
            <rect x="10" y="12" width="20" height="36" rx="4" fill="#ffffff" stroke="#4c1d95" stroke-width="2"/>
            <rect x="13" y="24" width="14" height="20" fill="#a7f3d0"/>
            <rect x="8" y="8" width="24" height="5" rx="2" fill="#ef4444"/>
          </g>
          <g transform="translate(22, 22)">
            <circle cx="22" cy="22" r="20" fill="#f59e0b" stroke="#ffffff" stroke-width="3"/>
            <text x="22" y="29" text-anchor="middle" font-size="18">🧪</text>
          </g>
        </svg>
      `;

    case 4:
      // LEVEL 4: Ruang TBC (Isolasi & Sanitasi Udara HEPA)
      return `
        <svg viewBox="0 0 200 200" width="100%" height="100%" style="max-width: 180px; max-height: 180px; filter: drop-shadow(0 10px 20px rgba(16, 185, 129, 0.3));">
          <defs>
            <linearGradient id="bg-tbc" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#e0f2fe"/>
              <stop offset="100%" stop-color="#047857"/>
            </linearGradient>
          </defs>
          <rect x="10" y="10" width="180" height="180" rx="28" fill="url(#bg-tbc)"/>
          <rect x="30" y="35" width="140" height="125" rx="10" fill="#ffffff" stroke="#047857" stroke-width="3.5"/>
          <line x1="30" y1="97" x2="170" y2="97" stroke="#047857" stroke-width="2.5"/>
          <line x1="76" y1="35" x2="76" y2="160" stroke="#047857" stroke-width="2.5"/>
          <line x1="124" y1="35" x2="124" y2="160" stroke="#047857" stroke-width="2.5"/>
          <rect x="33" y="38" width="40" height="56" rx="4" fill="#d1fae5"/>
          <rect x="40" y="55" width="26" height="30" rx="3" fill="#ffffff" stroke="#10b981" stroke-width="1.5"/>
          <circle cx="53" cy="63" r="6" fill="#facc15"/>
          <g transform="translate(130, 42)">
            <rect x="5" y="5" width="30" height="20" rx="3" fill="#0284c7"/>
            <line x1="10" y1="12" x2="30" y2="12" stroke="#ffffff" stroke-width="2"/>
            <line x1="10" y1="18" x2="30" y2="18" stroke="#ffffff" stroke-width="2"/>
            <circle cx="20" cy="38" r="4" fill="#38bdf8"/>
            <circle cx="20" cy="48" r="3" fill="#38bdf8"/>
          </g>
          <g transform="translate(130, 115)">
            <circle cx="20" cy="20" r="20" fill="#10b981" stroke="#ffffff" stroke-width="3"/>
            <path d="M20,10 L20,30 M10,20 L30,20" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>
          </g>
        </svg>
      `;

    case 5:
      // LEVEL 5: Perang Melawan DBD (Fogging Challenge & 3M Target 0:5)
      return `
        <svg viewBox="0 0 200 200" width="100%" height="100%" style="max-width: 180px; max-height: 180px; filter: drop-shadow(0 10px 20px rgba(245, 158, 11, 0.3));">
          <defs>
            <linearGradient id="bg-dbd" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fef3c7"/>
              <stop offset="100%" stop-color="#b45309"/>
            </linearGradient>
          </defs>
          <rect x="10" y="10" width="180" height="180" rx="28" fill="url(#bg-dbd)"/>
          <ellipse cx="100" cy="140" rx="55" ry="25" fill="#38bdf8" opacity="0.85" stroke="#ffffff" stroke-width="3"/>
          <ellipse cx="100" cy="140" rx="35" ry="14" fill="#7dd3fc"/>
          <g transform="translate(100, 80)">
            <ellipse cx="0" cy="0" rx="14" ry="8" fill="#1e293b"/>
            <ellipse cx="-8" cy="-12" rx="10" ry="5" fill="rgba(255,255,255,0.7)" transform="rotate(-30)"/>
            <ellipse cx="8" cy="-12" rx="10" ry="5" fill="rgba(255,255,255,0.7)" transform="rotate(30)"/>
            <line x1="-8" y1="-3" x2="-8" y2="3" stroke="#ffffff" stroke-width="2"/>
            <line x1="0" y1="-4" x2="0" y2="4" stroke="#ffffff" stroke-width="2"/>
            <line x1="8" y1="-3" x2="8" y2="3" stroke="#ffffff" stroke-width="2"/>
          </g>
          <g transform="translate(30, 60)">
            <rect x="0" y="20" width="45" height="14" rx="3" fill="#64748b" stroke="#ffffff" stroke-width="2"/>
            <circle cx="55" cy="22" r="14" fill="rgba(255,255,255,0.8)"/>
            <circle cx="75" cy="18" r="18" fill="rgba(255,255,255,0.9)"/>
            <circle cx="95" cy="25" r="22" fill="#ffffff"/>
          </g>
          <g transform="translate(125, 25)">
            <rect x="0" y="0" width="50" height="26" rx="13" fill="#ef4444" stroke="#ffffff" stroke-width="2"/>
            <text x="25" y="17" text-anchor="middle" font-size="11" font-weight="bold" fill="#ffffff">0 : 5 🎯</text>
          </g>
        </svg>
      `;

    case 6:
    default:
      // LEVEL 6: Strategi Lawan COVID-19 (Peta Keputusan Indonesia 3T)
      return `
        <svg viewBox="0 0 200 200" width="100%" height="100%" style="max-width: 180px; max-height: 180px; filter: drop-shadow(0 10px 20px rgba(239, 68, 68, 0.3));">
          <defs>
            <linearGradient id="bg-covid" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fee2e2"/>
              <stop offset="100%" stop-color="#991b1b"/>
            </linearGradient>
          </defs>
          <rect x="10" y="10" width="180" height="180" rx="28" fill="url(#bg-covid)"/>
          <g transform="translate(25, 55) scale(0.65)" stroke="#ffffff" stroke-width="2">
            <path d="M20,60 Q50,30 80,70 Q110,80 70,110 Z" fill="#22c55e"/>
            <path d="M75,120 Q130,110 170,125 Q130,135 75,130 Z" fill="#ef4444"/>
            <path d="M100,30 Q140,20 150,70 Q110,80 100,30 Z" fill="#22c55e"/>
            <path d="M165,40 Q190,50 180,90 Q160,80 165,40 Z" fill="#ef4444"/>
            <path d="M210,50 Q250,50 240,90 Q200,90 210,50 Z" fill="#22c55e"/>
          </g>
          <g transform="translate(85, 120)">
            <circle cx="10" cy="10" r="10" fill="#ef4444" stroke="#ffffff" stroke-width="2"/>
            <circle cx="10" cy="10" r="4" fill="#ffffff"/>
          </g>
          <g transform="translate(30, 142)">
            <rect x="0" y="0" width="40" height="24" rx="6" fill="#0284c7" stroke="#ffffff" stroke-width="1.5"/>
            <text x="20" y="16" text-anchor="middle" font-size="10" font-weight="bold" fill="#ffffff">3T 📡</text>
            <rect x="48" y="0" width="42" height="24" rx="6" fill="#10b981" stroke="#ffffff" stroke-width="1.5"/>
            <text x="69" y="16" text-anchor="middle" font-size="10" font-weight="bold" fill="#ffffff">5M 😷</text>
            <rect x="98" y="0" width="44" height="24" rx="6" fill="#f59e0b" stroke="#ffffff" stroke-width="1.5"/>
            <text x="120" y="16" text-anchor="middle" font-size="10" font-weight="bold" fill="#ffffff">Vaksin 💉</text>
          </g>
        </svg>
      `;
  }
}

export const HISTORICAL_ERAS = [
  {
    id: 1,
    levelNum: 1,
    badgeColor: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    badgeText: 'LEVEL 1',
    year: '1911 - Masa Kolonial',
    title: 'Lab Digital: Mystery Virus & Bakteri',
    subtitle: 'Pengenalan Jenis Mikroorganisme & Identifikasi Mikroskop',
    icon: '🔬',
    pathogen: 'Bakteri Yersinia pestis & Virus Corona',
    desc: 'Menganalisis & mengidentifikasi patogen penyebab wabah di bawah perbesaran mikroskop monitor digital 1000x! Ketuk gambar patogen untuk mencocokkan dengan kartu kategori yang tepat.',
    jenis: 'Action: Identifikasi Mikroskop Digital',
    kognitif: 'C2 (Memahami)',
    bgGradient: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
    artIcon: '🔬'
  },
  {
    id: 2,
    levelNum: 2,
    badgeColor: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    badgeText: 'LEVEL 2',
    year: '1950 - 1970 - Pasca Kemerdekaan',
    title: 'Jalur Penularan Kolera: Drag & Drop Sanitasi',
    subtitle: 'Memahami Transmisi Penyakit Lingkungan Sungai Desa',
    icon: '🌊',
    pathogen: 'Vibrio cholerae (Bakteri Kolera)',
    desc: 'Hentikan rantai penularan kolera pada sumbernya! Seret dan lepas (drag & drop) kartu tindakan sanitasi (Air Bersih, Kaporitisasi, Jaga Kebersihan) ke pemukiman warga desa tepi sungai.',
    jenis: 'Simulation: Drag & Drop Sanitasi Desa',
    kognitif: 'C5 (Mengevaluasi)',
    bgGradient: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
    artIcon: '💧'
  },
  {
    id: 3,
    levelNum: 3,
    badgeColor: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    badgeText: 'LEVEL 3',
    year: '2005 - Era Modern',
    title: 'Misi Vaksin Cacar: Vaksin Factory & Formulasi',
    subtitle: 'Konsep Dasar Formulasi Vaksin & Imunisasi Massal',
    icon: '🧪',
    pathogen: 'Virus Variola & Poliovirus',
    desc: 'Racik kombinasi bahan baku yang sesuai untuk membuat vaksin cacar! Seret elemen bahan (Serum, Virus Lemah, Bakteri Lemah) ke dalam slot mesin peracik hingga pembuatan selesai.',
    jenis: 'Action: Formulasi Vaksin Factory',
    kognitif: 'C4 (Menganalisis)',
    bgGradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    artIcon: '🧪'
  },
  {
    id: 4,
    levelNum: 4,
    badgeColor: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    badgeText: 'LEVEL 4',
    year: '2020 - Era Kontemporer',
    title: 'Ruang TBC: Isolasi & Sanitasi Udara HEPA',
    subtitle: 'Penanganan Menular Via Udara & Sistem Isolasi Medis',
    icon: '🏥',
    pathogen: 'Mycobacterium tuberculosis',
    desc: 'Pindahkan pasien terinfeksi TBC ke ruang isolasi yang memiliki fasilitas penyaring udara HEPA & UV! Seret ikon pasien bergejala batuk ke ruang isolasi bertekanan negatif.',
    jenis: 'Laboratory: Isolasi Airflow HEPA',
    kognitif: 'C3 (Mengaplikasikan)',
    bgGradient: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
    artIcon: '🏥'
  }
];

export function renderMapView() {
  const container = document.createElement('div');
  container.className = 'level-select-container';

  const isGuru = gameState.data.player.userType === 'guru';
  const unlocked = [1, 2, 3, 4];
  const completed = gameState.data.completedEras || [1, 2, 3, 4];

  container.innerHTML = `
    <!-- LEVEL SELECT HEADER CONTROL BAR -->
    <div class="level-select-header-bar">
      <button id="btn-map-back-home" class="btn-pill-back">
        &larr; Kembali
      </button>

      <div class="header-actions-right">
        <button id="btn-info-level" class="btn-icon-circle" title="Petunjuk & Cara Bermain">
          ℹ️
        </button>
        <button id="btn-toggle-cheat" class="btn-cheat-pill ${isGuru ? 'active' : ''}">
          🚀 ${isGuru ? 'MODE GURU (ALL UNLOCKED)' : 'CHEAT: BUKA SEMUA LEVEL'}
        </button>
      </div>
    </div>

    <!-- MAIN TITLE BANNER -->
    <div class="level-select-hero-banner">
      <div class="hero-title-group">
        <h2>🎮 Petualangan Edukasi: Penjaga Kesehatan Indonesia</h2>
        <p>Jelajahi level interaktif untuk menguasai ilmu sejarah & literasi kesehatan (C2-C5) dan selesaikan tantangan wabah demi memulihkan kesehatan bangsa!</p>
      </div>
    </div>

    <!-- LEVEL CARDS VERTICAL LIST -->
    <div class="level-cards-stack">
      ${HISTORICAL_ERAS.map(era => {
        const isUnlocked = unlocked.includes(era.id);
        const isCompleted = completed.includes(era.id);
        const stars = gameState.data.minigameScores[era.id] || (isCompleted ? 3 : 0);

        return `
          <div class="level-select-card ${isCompleted ? 'completed' : isUnlocked ? 'unlocked' : 'locked'}">
            
            <!-- THUMBNAIL BOX (LEFT WITH SCENARIO SVG ILLUSTRATION) -->
            <div class="level-thumb-box" style="background: ${era.bgGradient}; padding: 12px;">
              ${getLevelIllustrationSVG(era.id, isUnlocked)}
            </div>

            <!-- LEVEL DETAILS (RIGHT) -->
            <div class="level-card-body">
              
              <!-- LEVEL BADGE PILL -->
              <div class="level-badge-row">
                <span class="level-pill" style="background: ${era.badgeColor};">
                  ${era.badgeText}
                </span>
                ${isCompleted ? `
                  <span class="stars-badge-pill">
                    ${'⭐'.repeat(stars)} (${stars}/3 Bintang)
                  </span>
                ` : ''}
                ${!isUnlocked ? `<span class="locked-badge-pill">🔒 Terkunci</span>` : ''}
              </div>

              <!-- LEVEL TITLE -->
              <h3 class="level-card-title">
                <span class="title-icon">${era.icon}</span> ${era.title}
              </h3>

              <!-- LEVEL DESCRIPTION -->
              <p class="level-card-desc">
                ${era.desc}
              </p>

              <!-- TAG BADGES (JENIS GAME & TAKSONOMI KOGNITIF) -->
              <div class="level-tags-row">
                <span class="badge-tag tag-jenis">
                  🎮 Jenis: ${era.jenis}
                </span>
                <span class="badge-tag tag-kognitif">
                  🧠 Kognitif: ${era.kognitif}
                </span>
              </div>

              <!-- ACTION BUTTONS -->
              <div class="level-actions-row">
                ${isUnlocked ? `
                  <button class="btn btn-success btn-md btn-start-level-play" data-era="${era.id}">
                    ▶️ Mulai Permainan
                  </button>
                ` : `
                  <span class="lock-hint-text">
                    🔒 Selesaikan level sebelumnya untuk membuka level ini.
                  </span>
                `}
              </div>

            </div>

          </div>
        `;
      }).join('')}
    </div>

    <!-- BOTTOM CERTIFICATE & RAPOR CTA -->
    <div class="level-select-footer-cta">
      <button id="btn-view-certificate" class="btn btn-primary btn-lg">
        📜 Tampilkan Rapor & Sertifikat Digital Murid
      </button>
    </div>
  `;

  // Attach event listeners asynchronously
  setTimeout(() => {
    // Back button
    const btnBackHome = container.querySelector('#btn-map-back-home');
    if (btnBackHome) {
      btnBackHome.addEventListener('click', () => router.navigate('home'));
    }

    // Cheat Toggle
    const btnCheat = container.querySelector('#btn-toggle-cheat');
    if (btnCheat) {
      btnCheat.addEventListener('click', () => {
        if (!gameState.data.unlockedEras || gameState.data.unlockedEras.length < 4) {
          gameState.data.unlockedEras = [1, 2, 3, 4];
          gameState.save();
          router.navigate('map');
        } else {
          gameState.data.unlockedEras = [1];
          gameState.save();
          router.navigate('map');
        }
      });
    }

    // Info modal button
    const btnInfo = container.querySelector('#btn-info-level');
    if (btnInfo) {
      btnInfo.addEventListener('click', () => showHistoryInfo('stovia'));
    }

    // Start Level Game Trigger
    container.querySelectorAll('.btn-start-level-play').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const eraId = parseInt(e.currentTarget.getAttribute('data-era'));
        router.navigate('minigame', { level: eraId, eraId });
      });
    });

    // Certificate / Report trigger
    const btnCert = container.querySelector('#btn-view-certificate');
    if (btnCert) {
      btnCert.addEventListener('click', () => router.navigate('report'));
    }
  }, 0);

  return container;
}
