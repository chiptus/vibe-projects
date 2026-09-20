import { useState } from 'react';
import { DEFAULT_PRESETS } from '../data/presets';
import { loadPresets, loadSelectedPreset, savePresets, saveSelectedPreset } from '../lib/persistence';
import type { Exercise, Preset, PresetMap } from '../types';

/** Owns the preset map, the currently selected preset, and its persistence. */
export function usePresetLibrary() {
  const [presets, setPresets] = useState<PresetMap>(() => loadPresets());
  const [currentPresetKey, setCurrentPresetKey] = useState(() => loadSelectedPreset(presets));

  const currentPreset = presets[currentPresetKey]!;

  return {
    presets,
    currentPresetKey,
    currentPreset,
    selectPreset,
    updateExercises,
    resetToDefault,
    importPreset,
  };

  function persist(newPresets: PresetMap) {
    setPresets(newPresets);
    savePresets(newPresets);
  }

  function selectPreset(key: string) {
    setCurrentPresetKey(key);
    saveSelectedPreset(key);
  }

  function updateExercises(exercises: Exercise[]) {
    persist({ ...presets, [currentPresetKey]: { ...currentPreset, exercises } });
  }

  /** Resets the current preset to its shipped default. Returns the default, or null if there isn't one. */
  function resetToDefault(): Preset | null {
    const defaultPreset = DEFAULT_PRESETS[currentPresetKey];
    if (!defaultPreset) return null;
    persist({ ...presets, [currentPresetKey]: defaultPreset });
    return defaultPreset;
  }

  /** Imports a preset under a new key and selects it. */
  function importPreset(key: string, preset: Preset) {
    persist({ ...presets, [key]: preset });
    selectPreset(key);
  }
}
