// Like the original prototype, each beep gets its own fresh AudioContext —
// a shared, reused context tends to get auto-suspended by the browser once
// it's mostly idle (which a workout timer's context is, between 0.5s beeps),
// especially while the tab is backgrounded, causing the beep to go silent.
// A fresh context starts "running" as long as the page already has audio
// permission from an earlier user gesture. Unlike the original, we close
// each context once its beep finishes instead of leaving it dangling, so a
// long session doesn't accumulate contexts toward the browser's limit.
export function playBeep(): void {
  try {
    const AudioContextCtor =
      window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const audioContext = new AudioContextCtor();
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
    oscillator.onended = () => void audioContext.close();
  } catch (error) {
    console.warn('Trilled R Trainer: could not play the beep', error);
  }
}
