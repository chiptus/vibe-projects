import { useState } from 'react';

interface ImportExportPanelProps {
  onExport: () => void;
  onImport: (key: string, json: string) => void;
}

export function ImportExportPanel({ onExport, onImport }: ImportExportPanelProps) {
  const [importText, setImportText] = useState('');
  const [newPresetKey, setNewPresetKey] = useState('');

  return (
    <div className="panel">
      <h3>Import/Export Preset</h3>
      <button className="btn btn-save full-width" onClick={onExport}>
        Copy Current Preset to Clipboard
      </button>
      <div className="panel-divider">
        <label>
          Preset Key (e.g. "my_custom")
          <input
            type="text"
            value={newPresetKey}
            onChange={(e) => setNewPresetKey(e.target.value)}
            placeholder="my_custom_preset"
          />
        </label>
        <label>
          Paste JSON to Import
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            rows={6}
            className="mono"
            placeholder='{"name": "My Preset", "description": "...", "exercises": [...]}'
          />
        </label>
        <button className="btn btn-primary full-width" onClick={handleImport} disabled={!importText || !newPresetKey}>
          Import as New Preset
        </button>
      </div>
    </div>
  );

  function handleImport() {
    onImport(newPresetKey, importText);
    setImportText('');
    setNewPresetKey('');
  }
}
