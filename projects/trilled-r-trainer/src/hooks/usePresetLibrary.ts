import { useState } from 'react';
import { DEFAULT_PRESETS } from '../data/presets';
import { loadPresets, loadSelectedPreset, savePresets, saveSelectedPreset } from '../lib/persistence';
import type { Exercise, Preset, PresetMap } from '../types';

/** Owns the preset map, the currently selected preset, and its persistence. */
export function usePresetLibrary() {
  const [presets, setPresets] = useState<PresetMap>(() => loadPresets());
  const [currentPresetKey, setCurrentPresetKey] = useState(() => loadSelectedPreset(presets));

  const currentPreset = presets[currentPresetKey]!;

  const persist = (newPresets: PresetMap) => {
    setPresets(newPresets);
    savePresets(newPresets);
  };

  const selectPreset = (key: string) => {
    setCurrentPresetKey(key);
    saveSelectedPreset(key);
  };

  const updateExercises = (exercises: Exercise[]) => {
    persist({ ...presets, [currentPresetKey]: { ...currentPreset, exercises } });
  };

  /** Resets the current preset to its shipped default. Returns the default, or null if there isn't one. */
  const resetToDefault = (): Preset | null => {
    const defaultPreset = DEFAULT_PRESETS[currentPresetKey];
    if (!defaultPreset) return null;
    persist({ ...presets, [currentPresetKey]: defaultPreset });
    return defaultPreset;
  };

  /** Imports a preset under a new key and selects it. */
  const importPreset = (key: string, preset: Preset) => {
    persist({ ...presets, [key]: preset });
    selectPreset(key);
  };

  return {
    presets,
    currentPresetKey,
    currentPreset,
    selectPreset,
    updateExercises,
    resetToDefault,
    importPreset,
  };
}
