/**
 * Procedural Web Audio Synthesizer for Tactile Skeuomorphic Controls
 * Provides realistic physical switch clicks, fader notches, relay chimes, and CRT buzzes.
 */

let audioCtx: AudioContext | null = null;
let soundMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function setSoundMuted(muted: boolean) {
  soundMuted = muted;
}

export function toggleAudio(): boolean {
  soundMuted = !soundMuted;
  return soundMuted;
}

export function isAudioMuted(): boolean {
  return soundMuted;
}

export function isSoundMuted(): boolean {
  return soundMuted;
}

export function playRelayChime() {
  playRelayEngage();
}

export function playSwitchToggle() {
  playSwitchClick('up');
}


// Heavy mechanical toggle switch click (spring and contact sound)
export function playSwitchClick(type: 'up' | 'down' = 'up') {
  if (soundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(type === 'up' ? 1800 : 1200, now);
  filter.Q.setValueAtTime(3.0, now);

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(type === 'up' ? 240 : 180, now);
  osc.frequency.exponentialRampToValueAtTime(type === 'up' ? 40 : 30, now + 0.04);

  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.05);

  // Secondary metallic transient
  const bufferSize = ctx.sampleRate * 0.015;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.15, now + 0.005);
  noiseGain.gain.linearRampToValueAtTime(0.001, now + 0.02);

  noise.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(now + 0.005);
}

// Console fader notch tick
export function playFaderTick() {
  if (soundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(850, now);
  osc.frequency.exponentialRampToValueAtTime(120, now + 0.012);

  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.02);
}

// Push button tactile solenoid click
export function playPushButton() {
  if (soundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'square';
  osc.frequency.setValueAtTime(140, now);
  osc.frequency.exponentialRampToValueAtTime(30, now + 0.06);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.07);
}

// CRT Power surge / Relay engage chime
export function playRelayEngage() {
  if (soundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, now);
  osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.13);
}

// Terminal beep
export function playTerminalBeep(freq = 1200, duration = 0.05) {
  if (soundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0.1, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration + 0.01);
}
