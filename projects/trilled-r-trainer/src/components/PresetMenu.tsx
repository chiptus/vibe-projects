import { formatTime } from '../lib/format';
import type { PresetMap } from '../types';

interface PresetMenuProps {
  presets: PresetMap;
  currentKey: string;
  onSelect: (key: string) => void;
}

export function PresetMenu({ presets, currentKey, onSelect }: PresetMenuProps) {
  return (
    <div className="mb-4 flex w-full flex-col gap-2 rounded-lg bg-panel p-4">
      {Object.entries(presets).map(([key, preset]) => (
        <button
          key={key}
          className={`cursor-pointer rounded-md bg-brand p-3 text-left text-white hover:bg-brand-hover ${currentKey === key ? 'outline-2 outline-accent' : ''}`}
          onClick={() => onSelect(key)}
        >
          <div className="font-semibold">{preset.name}</div>
          <div className="text-sm text-muted">{preset.description}</div>
          <div className="mt-1 text-xs text-accent">
            {formatTime(preset.exercises.reduce((sum, ex) => sum + ex.duration, 0))} total
          </div>
        </button>
      ))}
    </div>
  );
}
