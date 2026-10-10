// iOS Haptic Feedback & Web Audio System Sound Synthesizer
// Provides subtle, native-feeling Apple iOS tactile and audio micro-feedback

class IosFeedbackEngine {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = true;
    try {
      const saved = localStorage.getItem('nutrifit_ios_sound');
      if (saved !== null) {
        this.soundEnabled = saved === 'true';
      }
    } catch (e) {}
  }

  initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Trigger Apple Taptic Engine vibration via WebKit / standard Vibration API
  triggerHaptic(type = 'light') {
    if (typeof window === 'undefined' || !navigator.vibrate) return;
    try {
      switch (type) {
        case 'selection':
        case 'light':
          navigator.vibrate(6);
          break;
        case 'medium':
          navigator.vibrate(12);
          break;
        case 'heavy':
          navigator.vibrate(20);
          break;
        case 'success':
          navigator.vibrate([10, 35, 14]);
          break;
        case 'error':
          navigator.vibrate([15, 30, 15, 30, 20]);
          break;
        default:
          navigator.vibrate(8);
      }
    } catch (e) {}
  }

  // Synthesize an ultra-soft, native iOS keyboard / toggle tap click
  playIosClick(frequency = 1200, duration = 0.014) {
    if (!this.soundEnabled) return;
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.audioCtx.currentTime + duration);

      // Very soft gain (volume) for subtlety
      gain.gain.setValueAtTime(0.045, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {}
  }

  // Soft iOS completion chime for timers / goals
  playIosChime() {
    if (!this.soundEnabled) return;
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      [587.33, 880, 1174.66].forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.06, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    } catch (e) {}
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    try {
      localStorage.setItem('nutrifit_ios_sound', String(this.soundEnabled));
    } catch (e) {}
    if (this.soundEnabled) {
      this.playIosClick(1400, 0.02);
      this.triggerHaptic('success');
    }
    return this.soundEnabled;
  }

  isSoundEnabled() {
    return this.soundEnabled;
  }
}

export const iosFeedback = new IosFeedbackEngine();
