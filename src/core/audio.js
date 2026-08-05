// WEB AUDIO SYNTHESIZER & CHEERFUL REAL BGM TRACK MANAGER ("Carefree" by Kevin MacLeod)

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.bgmVolume = 0.35;
    this.bgmPlaying = false;
    this.isDucked = false;

    this.audioSources = [
      '/audio/bgm_carefree.mp3',
      '/assets/audio/bgm_carefree.mp3',
      'assets/audio/bgm_carefree.mp3'
    ];
    this.currentSourceIdx = 0;
    this.bgmAudio = new Audio(this.audioSources[0]);
    this.bgmAudio.loop = true;
    this.bgmAudio.volume = this.bgmVolume;

    this.bgmAudio.onerror = () => {
      this.currentSourceIdx = (this.currentSourceIdx + 1) % this.audioSources.length;
      console.warn('BGM source fallback trying:', this.audioSources[this.currentSourceIdx]);
      this.bgmAudio.src = this.audioSources[this.currentSourceIdx];
      if (this.bgmPlaying) {
        this.bgmAudio.play().catch(() => {});
      }
    };

    if (typeof window !== 'undefined') {
      this.attachGestureListeners();
    }
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  attachGestureListeners() {
    const unlock = () => {
      this.init();
      if (this.bgmPlaying && this.bgmAudio.paused) {
        this.bgmAudio.play().catch(() => {});
      }
    };
    window.addEventListener('click', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });
  }

  playTap() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }

  playSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, index) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + index * 0.08);

        gain.gain.setValueAtTime(0.2, now + index * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + index * 0.08);
        osc.stop(now + index * 0.08 + 0.25);
      });
    } catch (e) {}
  }

  playWrong() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.setValueAtTime(140, now + 0.12);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  }

  playDropReagent() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.15);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {}
  }

  playFogging() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(150, now + 0.4);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {}
  }

  startBgm() {
    this.init();
    this.bgmPlaying = true;
    this.bgmAudio.volume = this.isDucked ? 0.06 : this.bgmVolume;
    this.bgmAudio.play().catch(err => {
      console.log('Autoplay waiting for click gesture:', err);
    });
  }

  stopBgm() {
    this.bgmPlaying = false;
    this.bgmAudio.pause();
  }

  setBgmVolume(val) {
    this.bgmVolume = val;
    if (!this.isDucked) {
      this.bgmAudio.volume = val;
    }
  }

  duckBgm(isDucked) {
    this.isDucked = isDucked;
    if (this.bgmPlaying) {
      this.bgmAudio.volume = isDucked ? 0.06 : this.bgmVolume;
    }
  }
}

export const audioEngine = new AudioEngine();
