import type { Exercise } from '../types';

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function exerciseBackground(exercise: Exercise): string {
  if (exercise.name.includes('RELAX') || exercise.name.includes('Cool Down')) return 'bg-relax';
  if (exercise.name.includes('Q-tip')) return 'bg-qtip';
  if (exercise.name.includes('Brrrr')) return 'bg-brrrr';
  return 'bg-panel';
}
