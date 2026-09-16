// Web Audio API Synthesizer for Siren, Fake Call ring, and Alerts
class SoundManager {
  private ctx: AudioContext | null = null;
  private sirenOsc1: OscillatorNode | null = null;
  private sirenOsc2: OscillatorNode | null = null;
  private sirenGain: GainNode | null = null;
  private ringInterval: any = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Dual-tone piercing police siren
  startSiren() {
    try {
      this.stopSiren();
      const ctx = this.getContext();
      const now = ctx.currentTime;

      this.sirenGain = ctx.createGain();
      this.sirenGain.gain.setValueAtTime(0.8, now);
      this.sirenGain.connect(ctx.destination);

      this.sirenOsc1 = ctx.createOscillator();
      this.sirenOsc1.type = 'sawtooth';
      
      // Siren frequency modulation (wailing between 600Hz and 1300Hz)
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(1.5, now); // 1.5Hz sweep
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(350, now);

      lfo.connect(lfoGain);
      lfoGain.connect(this.sirenOsc1.frequency);
      this.sirenOsc1.frequency.setValueAtTime(950, now);

      this.sirenOsc1.connect(this.sirenGain);
      lfo.start(now);
      this.sirenOsc1.start(now);
    } catch (e) {
      console.warn("Could not start siren audio:", e);
    }
  }

  stopSiren() {
    try {
      if (this.sirenOsc1) {
        this.sirenOsc1.stop();
        this.sirenOsc1.disconnect();
        this.sirenOsc1 = null;
      }
      if (this.sirenGain) {
        this.sirenGain.disconnect();
        this.sirenGain = null;
      }
    } catch (e) {
      // ignore
    }
  }

  // Realistic phone ringtone (standard European/US ring cadence)
  startRingtone() {
    try {
      this.stopRingtone();
      const playBeep = () => {
        const ctx = this.getContext();
        const now = ctx.currentTime;
        
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.frequency.setValueAtTime(440, now); // 440 Hz
        osc2.frequency.setValueAtTime(480, now); // 480 Hz

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 1.8);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.8);
        osc2.stop(now + 1.8);
      };

      playBeep();
      this.ringInterval = setInterval(playBeep, 3000);
    } catch (e) {
      console.warn("Could not play ringtone:", e);
    }
  }

  stopRingtone() {
    if (this.ringInterval) {
      clearInterval(this.ringInterval);
      this.ringInterval = null;
    }
  }

  // Positive chime for "I'm Safe"
  playSafeChime() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        
        gain.gain.setValueAtTime(0.3, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.4);
      });
    } catch (e) {
      console.warn("Could not play safe chime:", e);
    }
  }
}

export const soundManager = new SoundManager();
