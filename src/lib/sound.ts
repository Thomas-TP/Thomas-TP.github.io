/**
 * WebAudio-synthesized UI sounds — zero asset weight, zero network cost.
 * All effects are generated on-the-fly with oscillators / filtered noise.
 *
 * Mute state persists in localStorage and broadcasts via a CustomEvent so
 * any component can subscribe (see useSound hook).
 */

const STORAGE_KEY = 'sound-muted';
const EVENT = 'sound-mute-change';

let ctx: AudioContext | null = null;
let muted = false;
let initialized = false;

function init() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;
  muted = localStorage.getItem(STORAGE_KEY) === '1';
}

function ensureCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  init();
  if (!ctx) {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    try {
      ctx = new Ctx();
    } catch {
      return null;
    }
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => undefined);
  return ctx;
}

export function isMuted(): boolean {
  init();
  return muted;
}

export function setMuted(value: boolean): void {
  init();
  muted = value;
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, value ? '1' : '0');
    window.dispatchEvent(new CustomEvent(EVENT, { detail: value }));
  }
}

export const SOUND_EVENT = EVENT;

interface ToneOpts {
  freq: number;
  dur?: number;
  type?: OscillatorType;
  vol?: number;
  slideTo?: number;
  delay?: number;
}

function tone({ freq, dur = 0.08, type = 'sine', vol = 0.05, slideTo, delay = 0 }: ToneOpts) {
  if (muted) return;
  const c = ensureCtx();
  if (!c) return;
  const start = c.currentTime + delay;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, start + dur);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.linearRampToValueAtTime(vol, start + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(start);
  osc.stop(start + dur + 0.02);
}

function noiseBurst(dur: number, vol: number, hpStart: number, hpEnd: number) {
  if (muted) return;
  const c = ensureCtx();
  if (!c) return;
  const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    // Decaying envelope so the burst tails off naturally
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 1.4);
  }
  const src = c.createBufferSource();
  src.buffer = buf;
  const filter = c.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(hpStart, c.currentTime);
  filter.frequency.exponentialRampToValueAtTime(hpEnd, c.currentTime + dur);
  const gain = c.createGain();
  gain.gain.value = vol;
  src.connect(filter).connect(gain).connect(c.destination);
  src.start();
  src.stop(c.currentTime + dur);
}

export const sfx = {
  /** Soft mechanical click — buttons, taps */
  click: () => tone({ freq: 1200, dur: 0.035, type: 'square', vol: 0.025 }),

  /** Switch turning on — rising chirp */
  switchOn: () => tone({ freq: 520, dur: 0.06, type: 'sine', vol: 0.06, slideTo: 920 }),

  /** Switch turning off — falling chirp */
  switchOff: () => tone({ freq: 520, dur: 0.06, type: 'sine', vol: 0.06, slideTo: 220 }),

  /** Whoosh — message sent / panel slides in */
  whoosh: () => noiseBurst(0.28, 0.08, 1800, 400),

  /** Three-note success chime */
  success: () => {
    tone({ freq: 523.25, dur: 0.13, vol: 0.045 }); // C5
    tone({ freq: 659.25, dur: 0.13, vol: 0.045, delay: 0.07 }); // E5
    tone({ freq: 783.99, dur: 0.2, vol: 0.045, delay: 0.14 }); // G5
  },

  /** Quick error buzz */
  error: () => tone({ freq: 220, dur: 0.18, type: 'sawtooth', vol: 0.05, slideTo: 110 }),

  /** Subtle hover tick — barely audible, used sparingly */
  hover: () => tone({ freq: 2400, dur: 0.018, type: 'sine', vol: 0.012 }),

  /** Boot blip — used during the loader sequence */
  bootBlip: () => tone({ freq: 180, dur: 0.05, type: 'square', vol: 0.04, slideTo: 540 }),

  /** Boot finish — short triumphant arpeggio */
  bootDone: () => {
    tone({ freq: 440, dur: 0.1, type: 'triangle', vol: 0.05 });
    tone({ freq: 659.25, dur: 0.1, type: 'triangle', vol: 0.05, delay: 0.06 });
    tone({ freq: 880, dur: 0.18, type: 'triangle', vol: 0.05, delay: 0.12 });
  },

  /** Theme toggle — soft pop */
  pop: () => tone({ freq: 600, dur: 0.04, type: 'triangle', vol: 0.04, slideTo: 1100 }),
};
