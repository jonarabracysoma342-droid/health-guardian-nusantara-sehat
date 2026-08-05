// GAME STATE MANAGEMENT & LOCAL STORAGE PERSISTENCE

import { syncPlayerToCloud } from './firebase.js';

const STORAGE_KEY = 'wabah_penjaga_kesehatan_v1';

const DEFAULT_STATE = {
  player: {
    name: 'Raka',
    userType: 'siswa', // 'siswa' | 'guru'
    className: 'Kelas 5 IPAS / Sejarah',
    level: 3,
    points: 2450,
    lives: 5,
    activeBadge: 'Detektif Wabah'
  },
  unlockedEras: [1, 2, 3, 4], // All 4 Eras Unlocked by Default
  completedEras: [1, 2, 3, 4],
  minigameScores: {
    1: 3, 2: 3, 3: 3, 4: 3
  },
  leaderboard: [
    { rank: 1, name: 'Raka', points: 2450, badge: '⭐ Detektif Wabah' },
    { rank: 2, name: 'Siti Rahma', points: 2100, badge: '🩺 Perintis STOVIA' },
    { rank: 3, name: 'Budi Santoso', points: 1950, badge: '💉 Pahlawan Imunisasi' },
    { rank: 4, name: 'Ayu Lestari', points: 1800, badge: '🔬 Detektor Avian Flu' },
    { rank: 5, name: 'Doni Pratama', points: 1650, badge: '🛡️ Garda COVID-19' }
  ],
  inventory: [
    { id: 'stovia_doc', name: 'Dokumen Sejarah STOVIA 1902', icon: '📜', era: 'Masa Kolonial', desc: 'Catatan awal pendirian sekolah dokter bumiputra.' },
    { id: 'microscope_lens', name: 'Lensa Mikroskop Vintage', icon: '🔍', era: 'Masa Kolonial', desc: 'Alat ukur morfologi patogen kuno.' }
  ],
  badges: [
    { id: 'badge_starter', title: 'Detektif Wabah Pemula', icon: '🕵️‍♂️', desc: 'Memulai misi pertamamu sebagai Penjaga Kesehatan.', unlocked: true },
    { id: 'badge_stovia', title: 'Perintis STOVIA', icon: '🩺', desc: 'Meneliti wabah Pes & Cacar pada masa Kolonial.', unlocked: true },
    { id: 'badge_polio', title: 'Pahlawan Imunisasi', icon: '💉', desc: 'Mengatasi outbreak Polio & Kolera pasca Kemerdekaan.', unlocked: true },
    { id: 'badge_h5n1', title: 'Detektor Avian Flu', icon: '🔬', desc: 'Mengisolasi galur H5N1 pada era modern.', unlocked: true },
    { id: 'badge_covid', title: 'Garda Terdepan COVID-19', icon: '🛡️', desc: 'Menguasai strategi 3T & Vaksinasi massal.', unlocked: true },
    { id: 'badge_master', title: 'Penjaga Kesehatan Nusantara', icon: '🏆', desc: 'Menyelesaikan seluruh modul Kurikulum Merdeka.', unlocked: true }
  ],
  notifications: [
    { id: 'notif_welcome', text: 'Selamat datang di Misi Penjaga Kesehatan! Seluruh level telah terbuka penuh 🎉', read: false, time: 'Baru saja' }
  ],
  settings: {
    sfxEnabled: true,
    fontSize: 'font-normal',
    lang: 'id'
  }
};

class GameState {
  constructor() {
    this.data = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const loaded = { ...DEFAULT_STATE, ...JSON.parse(saved) };
        loaded.unlockedEras = [1, 2, 3, 4];
        return loaded;
      }
    } catch (e) {
      console.warn('Failed to load local storage:', e);
    }
    const state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    state.unlockedEras = [1, 2, 3, 4];
    return state;
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      syncPlayerToCloud(this.data.player);
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
    this.notifyListeners();
  }

  save() {
    this.saveState();
  }

  resetProgress() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.saveState();
  }

  // Player Updates
  setUserMode(userType, name, className = '') {
    this.data.player.userType = userType;
    if (name) this.data.player.name = name;
    if (className) this.data.player.className = className;

    // If Mode Guru, unlock all 5 eras for presentation purposes
    if (userType === 'guru') {
      this.data.unlockedEras = [1, 2, 3, 4];
      this.addNotification('Mode Guru Aktif: Seluruh era terbuka untuk keperluan presentasi proyektor kelas! 👨‍🏫');
    }


    this.saveState();
  }

  addPoints(amount) {
    this.data.player.points += amount;
    const newLevel = Math.floor(this.data.player.points / 150) + 1;
    if (newLevel > this.data.player.level) {
      this.data.player.level = newLevel;
      this.addNotification(`Selamat! Level kamu naik ke Level ${newLevel}! 🎉`);
    }
    this.saveState();
  }

  // Eras Progress
  unlockEra(eraId) {
    if (!this.data.unlockedEras.includes(eraId)) {
      this.data.unlockedEras.push(eraId);
      this.addNotification(`Bab Era ${eraId} Baru Telah Terbuka! 🗺️`);
      this.saveState();
    }
  }

  completeEra(eraId, stars = 3) {
    if (!this.data.completedEras.includes(eraId)) {
      this.data.completedEras.push(eraId);
    }
    this.data.minigameScores[eraId] = Math.max(this.data.minigameScores[eraId] || 0, stars);
    
    if (eraId < 4) {
      this.unlockEra(eraId + 1);
    }

    const badgeMap = { 1: 'badge_stovia', 2: 'badge_polio', 3: 'badge_h5n1', 4: 'badge_covid', 5: 'badge_master' };
    if (badgeMap[eraId]) {
      this.unlockBadge(badgeMap[eraId]);
    }

    this.saveState();
  }

  unlockBadge(badgeId) {
    const badge = this.data.badges.find(b => b.id === badgeId);
    if (badge && !badge.unlocked) {
      badge.unlocked = true;
      this.addNotification(`Lencana Baru Diterima: ${badge.title} ${badge.icon}! 🏆`);
      this.saveState();
    }
  }

  addNotification(text) {
    this.data.notifications.unshift({
      id: 'notif_' + Date.now(),
      text,
      read: false,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    });
  }

  listeners = [];
  subscribe(fn) {
    this.listeners.push(fn);
  }
  notifyListeners() {
    this.listeners.forEach(fn => fn(this.data));
  }
}

export const gameState = new GameState();
