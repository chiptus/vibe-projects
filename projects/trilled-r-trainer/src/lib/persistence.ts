import { DEFAULT_PRESETS } from '../data/presets';
import type { PresetMap } from '../types';

const PRESETS_KEY = 'trilledRPresets';
const SELECTED_KEY = 'trilledRPreset';

/**
 * Loads saved presets merged with the code defaults, keyed by preset id.
 *
 * Previously this was an all-or-nothing read: any saved presets replaced
 * DEFAULT_PRESETS wholesale, so a newly added default preset never reached
 * a user who already had something in localStorage. Merging on load means
 * new defaults always show up, while a user's edits to an existing preset
 * (saved under the same key) still win.
 */
export function loadPresets(): PresetMap {
  const raw = localStorage.getItem(PRESETS_KEY);
  if (!raw) return DEFAULT_PRESETS;

  try {
    const saved = JSON.parse(raw) as PresetMap;
    return { ...DEFAULT_PRESETS, ...saved };
  } catch {
    return DEFAULT_PRESETS;
  }
}

export function savePresets(presets: PresetMap): void {
  localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
}

export function loadSelectedPreset(presets: PresetMap): string {
  const saved = localStorage.getItem(SELECTED_KEY);
  if (saved && saved in presets) return saved;
  return Object.keys(presets)[0] ?? 'beginner';
}

export function saveSelectedPreset(key: string): void {
  localStorage.setItem(SELECTED_KEY, key);
}
