// Reused across calls instead of creating a new AudioContext per beep —
// browsers cap how many can be alive at once, and a fresh one each exercise
// transition would eventually hit that limit over a long session.
let sharedContext: AudioContext | null = null;

// Browsers throttle timers in background tabs (Chrome clamps setInterval to
// once a second, then to once a minute after several minutes hidden) to save
// power — but exempt tabs that are actively producing audio, since throttling
// those would cause audible glitches. Playing this near-silent, continuous
// tone while a workout is running keeps the tab "audible" so the countdown
// (and its beep) keeps firing on schedule even when it's not the focused tab.
let keepAliveOscillator: OscillatorNode | null = null;

export function startKeepAlive(): void {
  if (keepAliveOscillator) return;
  try {
    const audioContext = getAudioContext();
    if (audioContext.state === 'suspended') {
      void audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 20;
    gainNode.gain.value = 0.0001;

    oscillator.start();
    keepAliveOscillator = oscillator;
  } catch {
    // Web Audio unsupported or blocked — background throttling may apply.
  }
}

export function stopKeepAlive(): void {
  if (!keepAliveOscillator) return;
  try {
    keepAliveOscillator.stop();
  } catch {
    // Already stopped.
  }
  keepAliveOscillator = null;
}

export function playBeep(): void {
  try {
    const audioContext = getAudioContext();
    // Browsers suspend the context when the tab is backgrounded (and it
    // starts "suspended" until a user gesture resumes it), so a beep fired
    // while unfocused would otherwise be silent unless we resume first and
    // wait for it, rather than scheduling nodes against a frozen clock.
    if (audioContext.state === 'suspended') {
      audioContext.resume().then(() => emitBeep(audioContext)).catch(() => {});
      return;
    }
    emitBeep(audioContext);
  } catch {
    // Web Audio unsupported or blocked — silently skip the beep.
  }
}

function emitBeep(audioContext: AudioContext): void {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 800;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
}

function getAudioContext(): AudioContext {
  if (!sharedContext) {
    sharedContext = new AudioContext();
  }
  return sharedContext;
}
