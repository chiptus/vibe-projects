import type { Exercise, Preset } from '../types';

/** Parses and validates a preset pasted in as JSON. Returns null if it doesn't parse or doesn't match the shape. */
export function parseImportedPreset(json: string): Preset | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return null;
  }
  return isValidPreset(parsed) ? parsed : null;
}

function isValidPreset(value: unknown): value is Preset {
  if (!value || typeof value !== 'object') return false;
  const preset = value as Record<string, unknown>;
  return (
    typeof preset.name === 'string' &&
    typeof preset.description === 'string' &&
    Array.isArray(preset.exercises) &&
    preset.exercises.length > 0 &&
    preset.exercises.every(isValidExercise)
  );
}

function isValidExercise(value: unknown): value is Exercise {
  if (!value || typeof value !== 'object') return false;
  const exercise = value as Record<string, unknown>;
  return (
    typeof exercise.name === 'string' &&
    typeof exercise.instruction === 'string' &&
    typeof exercise.duration === 'number' &&
    Number.isInteger(exercise.duration) &&
    exercise.duration > 0
  );
}
