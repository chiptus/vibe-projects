import { DEFAULT_PRESETS } from '../data/presets';
import type { PresetMap } from '../types';

// Bumped whenever DEFAULT_PRESETS changes shape in a way older stored blobs
// need migrating for. Not currently used for migrations, but kept so a
// future change has somewhere to hook in.
const STORAGE_VERSION = 1;

const PRESETS_KEY = 'trilledRPresets';
const SELECTED_KEY = 'trilledRPreset';

interface StoredPresets {
  version: number;
  presets: PresetMap;
}

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
    const saved = parseStoredPresets(raw);
    return { ...DEFAULT_PRESETS, ...saved };
  } catch {
    return DEFAULT_PRESETS;
  }
}

function parseStoredPresets(raw: string): PresetMap {
  const parsed = JSON.parse(raw);
  // Old format: a bare `{ [key]: Preset }` map with no version envelope.
  if (parsed && typeof parsed === 'object' && !('version' in parsed) && !('presets' in parsed)) {
    return parsed as PresetMap;
  }
  return (parsed as StoredPresets).presets ?? {};
}

export function savePresets(presets: PresetMap): void {
  const blob: StoredPresets = { version: STORAGE_VERSION, presets };
  localStorage.setItem(PRESETS_KEY, JSON.stringify(blob));
}

export function loadSelectedPreset(presets: PresetMap): string {
  const saved = localStorage.getItem(SELECTED_KEY);
  if (saved && saved in presets) return saved;
  return Object.keys(presets)[0] ?? 'beginner';
}

export function saveSelectedPreset(key: string): void {
  localStorage.setItem(SELECTED_KEY, key);
}
