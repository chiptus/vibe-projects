import { formatTime } from '../lib/format';
import type { PresetMap } from '../types';

interface PresetMenuProps {
  presets: PresetMap;
  currentKey: string;
  onSelect: (key: string) => void;
}

export function PresetMenu({ presets, currentKey, onSelect }: PresetMenuProps) {
  return (
    <div className="preset-menu">
      {Object.entries(presets).map(([key, preset]) => (
        <button
          key={key}
          className={`preset-option ${currentKey === key ? 'preset-option-active' : ''}`}
          onClick={() => onSelect(key)}
        >
          <div className="preset-name">{preset.name}</div>
          <div className="muted">{preset.description}</div>
          <div className="preset-duration">
            {formatTime(preset.exercises.reduce((sum, ex) => sum + ex.duration, 0))} total
          </div>
        </button>
      ))}
    </div>
  );
}
