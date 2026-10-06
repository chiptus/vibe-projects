// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_PRESETS } from '../data/presets';
import { loadPresets, savePresets } from './persistence';

const KEY = 'trilledRPresets';

const custom = {
  name: 'Custom',
  description: 'mine',
  exercises: [{ name: 'Tap', duration: 10, instruction: 'tap' }],
};

describe('loadPresets', () => {
  beforeEach(() => localStorage.clear());

  it('returns defaults when nothing is stored', () => {
    expect(loadPresets()).toEqual(DEFAULT_PRESETS);
  });

  it('merges valid saved presets over defaults', () => {
    savePresets({ custom });
    expect(loadPresets()).toEqual({ ...DEFAULT_PRESETS, custom });
  });

  it('falls back to defaults on invalid JSON', () => {
    localStorage.setItem(KEY, '{nope');
    expect(loadPresets()).toEqual(DEFAULT_PRESETS);
  });

  it.each(['null', '[]', '"str"', '42'])(
    'falls back to defaults when stored value is %s',
    (raw) => {
      localStorage.setItem(KEY, raw);
      expect(loadPresets()).toEqual(DEFAULT_PRESETS);
    },
  );

  it('drops malformed entries but keeps valid ones', () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ custom, bad: { name: 1 }, worse: { name: 'x', description: 'y', exercises: [{ name: 'a' }] } }),
    );
    expect(loadPresets()).toEqual({ ...DEFAULT_PRESETS, custom });
  });
});
