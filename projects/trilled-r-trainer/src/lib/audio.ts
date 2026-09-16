// Reused across calls instead of creating a new AudioContext per beep —
// browsers cap how many can be alive at once, and a fresh one each exercise
// transition would eventually hit that limit over a long session.
let sharedContext: AudioContext | null = null;

export function playBeep(): void {
  try {
    const audioContext = getAudioContext();
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
  } catch {
    // Web Audio unsupported or blocked — silently skip the beep.
  }
}

function getAudioContext(): AudioContext {
  if (!sharedContext) {
    sharedContext = new AudioContext();
  }
  return sharedContext;
}
