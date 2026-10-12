import { useState } from 'react';
import { Button, Field, Input, Textarea } from './ui';

interface ImportExportPanelProps {
  onExport: () => void;
  onImport: (key: string, json: string) => void;
}

export function ImportExportPanel({ onExport, onImport }: ImportExportPanelProps) {
  const [importText, setImportText] = useState('');
  const [newPresetKey, setNewPresetKey] = useState('');

  return (
    <div className="mb-4 rounded-lg bg-panel p-4">
      <h3 className="mt-0 mb-3 text-lg font-semibold">Import/Export Preset</h3>
      <Button variant="save" className="w-full" onClick={onExport}>
        Copy Current Preset to Clipboard
      </Button>
      <div className="mt-3 flex flex-col gap-2 border-t border-brand pt-3">
        <Field label={'Preset Key (e.g. "my_custom")'}>
          <Input
            type="text"
            value={newPresetKey}
            onChange={(e) => setNewPresetKey(e.target.value)}
            placeholder="my_custom_preset"
          />
        </Field>
        <Field label="Paste JSON to Import">
          <Textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            rows={6}
            className="font-mono text-xs"
            placeholder='{"name": "My Preset", "description": "...", "exercises": [...]}'
          />
        </Field>
        <Button variant="primary" className="w-full" onClick={handleImport} disabled={!importText || !newPresetKey}>
          Import as New Preset
        </Button>
      </div>
    </div>
  );

  function handleImport() {
    onImport(newPresetKey, importText);
    setImportText('');
    setNewPresetKey('');
  }
}
