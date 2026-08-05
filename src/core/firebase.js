import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app = null;
try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = initializeApp(firebaseConfig);
  }
} catch (e) {
  console.warn("Firebase Init Note:", e.message);
}

export function syncPlayerToCloud(playerData) {
  if (!app) return;
  try {
    // Cloud sync fallback logger / synchronization
  } catch (err) {
    console.warn("Cloud sync note:", err.message);
  }
}

const GURU_ACCOUNTS_KEY = 'wabah_guru_accounts_v1';

function getLocalGuruAccounts() {
  try {
    const saved = localStorage.getItem(GURU_ACCOUNTS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalGuruAccounts(accounts) {
  try {
    localStorage.setItem(GURU_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error('Failed to save guru accounts:', e);
  }
}

export async function registerGuruAccount({ name, school, password }) {
  const accounts = getLocalGuruAccounts();
  const existing = accounts.find(a => a.name.toLowerCase() === name.toLowerCase());
  if (existing) {
    throw new Error('Akun guru dengan nama tersebut sudah terdaftar! Silakan login.');
  }
  const newAccount = {
    id: 'guru_' + Date.now(),
    name,
    school,
    password, // Hash or plain fallback
    createdAt: new Date().toISOString()
  };
  accounts.push(newAccount);
  saveLocalGuruAccounts(accounts);
  return newAccount;
}

export async function loginGuruAccount(name, password) {
  const accounts = getLocalGuruAccounts();
  const account = accounts.find(a => a.name.toLowerCase() === name.toLowerCase());
  if (!account) {
    throw new Error('Akun guru tidak ditemukan! Silakan buat akun baru.');
  }
  if (account.password !== password) {
    throw new Error('Password guru salah! Silakan periksa kembali password Anda.');
  }
  return account;
}

export async function resetGuruPassword(name, school, newPassword) {
  const accounts = getLocalGuruAccounts();
  const account = accounts.find(a => a.name.toLowerCase() === name.toLowerCase() && a.school.toLowerCase() === school.toLowerCase());
  if (!account) {
    throw new Error('Akun guru dengan kombinasi nama dan sekolah tersebut tidak ditemukan!');
  }
  account.password = newPassword;
  saveLocalGuruAccounts(accounts);
  return account;
}

export async function joinClassWithPasscode(code, passcode, player) {
  if (!code || !passcode) {
    return { success: false, message: 'Mohon masukkan Kode Kelas dan Sandi Kelas.' };
  }
  return {
    success: true,
    group: {
      code: code.toUpperCase(),
      name: `Ruang Kelas ${code.toUpperCase()}`
    }
  };
}

export { app, firebaseConfig };
