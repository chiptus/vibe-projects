import { useCallback, useEffect, useState } from 'react';
import { EditExerciseForm } from './components/EditExerciseForm';
import { DEFAULT_PRESETS } from './data/presets';
import { playBeep } from './lib/audio';
import {
  loadPresets,
  loadSelectedPreset,
  saveSelectedPreset,
  savePresets,
} from './lib/persistence';
import type { Exercise, PresetMap } from './types';
import './App.css';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function exerciseClass(exercise: Exercise): string {
  if (exercise.name.includes('RELAX') || exercise.name.includes('Cool Down')) return 'exercise-relax';
  if (exercise.name.includes('Q-tip')) return 'exercise-qtip';
  if (exercise.name.includes('Brrrr')) return 'exercise-brrrr';
  return 'exercise-default';
}

export default function App() {
  const [presets, setPresets] = useState<PresetMap>(() => loadPresets());
  const [currentPreset, setCurrentPreset] = useState(() => loadSelectedPreset(presets));
  const [exercises, setExercises] = useState<Exercise[]>(() => presets[currentPreset]!.exercises);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [timeLeft, setTimeLeft] = useState(exercises[0]!.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showPresetMenu, setShowPresetMenu] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showImportExport, setShowImportExport] = useState(false);
  const [importText, setImportText] = useState('');
  const [newPresetKey, setNewPresetKey] = useState('');

  const persistPresets = (newPresets: PresetMap) => {
    setPresets(newPresets);
    savePresets(newPresets);
  };

  const totalTime = exercises.reduce((sum, ex) => sum + ex.duration, 0);
  const elapsedTime =
    exercises.slice(0, currentExercise).reduce((sum, ex) => sum + ex.duration, 0) +
    (exercises[currentExercise]!.duration - timeLeft);

  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft === 0) {
      playBeep();
      if (currentExercise < exercises.length - 1) {
        setCurrentExercise((c) => c + 1);
        setTimeLeft(exercises[currentExercise + 1]!.duration);
      } else {
        setIsRunning(false);
        setIsComplete(true);
      }
      return;
    }

    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, currentExercise, exercises]);

  const handlePresetChange = (presetKey: string) => {
    setIsRunning(false);
    setCurrentPreset(presetKey);
    setExercises(presets[presetKey]!.exercises);
    setCurrentExercise(0);
    setTimeLeft(presets[presetKey]!.exercises[0]!.duration);
    setIsComplete(false);
    setShowPresetMenu(false);
    setEditMode(false);
    saveSelectedPreset(presetKey);
  };

  const updateCurrentPresetExercises = (newExercises: Exercise[]) => {
    setExercises(newExercises);
    persistPresets({
      ...presets,
      [currentPreset]: { ...presets[currentPreset]!, exercises: newExercises },
    });
  };

  const handleSaveExercise = (index: number, updated: Exercise) => {
    const newExercises = [...exercises];
    newExercises[index] = updated;
    updateCurrentPresetExercises(newExercises);
    setEditingIndex(null);
  };

  const handleDeleteExercise = (index: number) => {
    if (exercises.length <= 1) {
      alert('Cannot delete the last exercise');
      return;
    }
    const newExercises = exercises.filter((_, i) => i !== index);
    updateCurrentPresetExercises(newExercises);
    if (currentExercise >= newExercises.length) {
      setCurrentExercise(Math.max(0, newExercises.length - 1));
    }
  };

  const handleAddExercise = () => {
    const newExercise: Exercise = { name: 'New Exercise', duration: 30, instruction: 'Add instructions here' };
    updateCurrentPresetExercises([...exercises, newExercise]);
    setEditingIndex(exercises.length);
  };

  const handleResetToDefault = () => {
    const defaultPreset = DEFAULT_PRESETS[currentPreset];
    if (!defaultPreset) return;
    if (!window.confirm('Reset this preset to default? This cannot be undone.')) return;

    persistPresets({ ...presets, [currentPreset]: defaultPreset });
    setExercises(defaultPreset.exercises);
    setCurrentExercise(0);
    setTimeLeft(defaultPreset.exercises[0]!.duration);
    setEditMode(false);
    setEditingIndex(null);
  };

  const handleExport = () => {
    const exportData = JSON.stringify(presets[currentPreset], null, 2);
    navigator.clipboard.writeText(exportData).then(
      () => alert('Preset copied to clipboard!'),
      () => {
        setImportText(exportData);
        setShowImportExport(true);
      },
    );
  };

  const handleImport = () => {
    let imported: unknown;
    try {
      imported = JSON.parse(importText);
    } catch {
      alert('Invalid JSON format');
      return;
    }

    if (
      !imported ||
      typeof imported !== 'object' ||
      !('name' in imported) ||
      !('exercises' in imported) ||
      !Array.isArray((imported as { exercises: unknown }).exercises)
    ) {
      alert('Invalid preset format');
      return;
    }

    if (!newPresetKey.trim()) {
      alert('Please enter a preset key');
      return;
    }

    const cleanKey = newPresetKey.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    if (presets[cleanKey] && !window.confirm(`Preset "${cleanKey}" already exists. Overwrite it?`)) {
      return;
    }

    const importedPreset = imported as PresetMap[string];
    persistPresets({ ...presets, [cleanKey]: importedPreset });

    setCurrentPreset(cleanKey);
    setExercises(importedPreset.exercises);
    setCurrentExercise(0);
    setTimeLeft(importedPreset.exercises[0]!.duration);
    saveSelectedPreset(cleanKey);

    setImportText('');
    setNewPresetKey('');
    setShowImportExport(false);
    alert(`Preset "${importedPreset.name}" imported as "${cleanKey}"!`);
  };

  const handleStartPause = () => setIsRunning((r) => !r);

  const handleReset = () => {
    setIsRunning(false);
    setCurrentExercise(0);
    setTimeLeft(exercises[0]!.duration);
    setIsComplete(false);
  };

  const handleSkip = useCallback(() => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise((c) => c + 1);
      setTimeLeft(exercises[currentExercise + 1]!.duration);
    }
  }, [currentExercise, exercises]);

  const handlePrev = () => {
    if (currentExercise > 0) {
      setCurrentExercise((c) => c - 1);
      setTimeLeft(exercises[currentExercise - 1]!.duration);
    }
  };

  const progress = (elapsedTime / totalTime) * 100;
  const exerciseProgress = ((exercises[currentExercise]!.duration - timeLeft) / exercises[currentExercise]!.duration) * 100;

  if (editMode) {
    return (
      <div className="app edit-mode">
        <div className="container">
          <div className="header-row">
            <h1>Edit {presets[currentPreset]!.name}</h1>
            <div className="button-row">
              <button className="btn" onClick={() => setShowImportExport((v) => !v)}>
                Import/Export
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditMode(false);
                  setEditingIndex(null);
                }}
              >
                Done
              </button>
            </div>
          </div>

          {showImportExport && (
            <div className="panel">
              <h3>Import/Export Preset</h3>
              <button className="btn btn-save full-width" onClick={handleExport}>
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
                <button
                  className="btn btn-primary full-width"
                  onClick={handleImport}
                  disabled={!importText || !newPresetKey}
                >
                  Import as New Preset
                </button>
              </div>
            </div>
          )}

          <p className="total-time">Total: {formatTime(totalTime)}</p>

          <div className="exercise-list">
            {exercises.map((ex, i) => (
              <div className="panel" key={i}>
                {editingIndex === i ? (
                  <EditExerciseForm
                    exercise={ex}
                    onSave={(updated) => handleSaveExercise(i, updated)}
                    onCancel={() => setEditingIndex(null)}
                  />
                ) : (
                  <>
                    <div className="exercise-row">
                      <div>
                        <h3>{ex.name}</h3>
                        <p className="muted">{formatTime(ex.duration)}</p>
                      </div>
                      <div className="button-row">
                        <button className="btn" onClick={() => setEditingIndex(i)}>
                          Edit
                        </button>
                        <button className="btn btn-danger" onClick={() => handleDeleteExercise(i)}>
                          Delete
                        </button>
                      </div>
                    </div>
                    <p>{ex.instruction}</p>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="button-row">
            <button className="btn btn-save flex-1" onClick={handleAddExercise}>
              + Add Exercise
            </button>
            <button className="btn btn-danger" onClick={handleResetToDefault}>
              Reset to Default
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <div className="header-row">
          <h1>Trilled R Workout</h1>
          <div className="button-row">
            <button className="btn" onClick={() => setEditMode(true)}>
              Edit
            </button>
            <button className="btn" onClick={() => setShowPresetMenu((v) => !v)}>
              {presets[currentPreset]!.name} ▾
            </button>
          </div>
        </div>

        {showPresetMenu && (
          <div className="preset-menu">
            {Object.entries(presets).map(([key, preset]) => (
              <button
                key={key}
                className={`preset-option ${currentPreset === key ? 'preset-option-active' : ''}`}
                onClick={() => handlePresetChange(key)}
              >
                <div className="preset-name">{preset.name}</div>
                <div className="muted">{preset.description}</div>
                <div className="preset-duration">
                  {formatTime(preset.exercises.reduce((sum, ex) => sum + ex.duration, 0))} total
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="overall-progress">
          <div className="progress-label">
            <span>Progress</span>
            <span>
              {formatTime(Math.floor(elapsedTime))} / {formatTime(totalTime)}
            </span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {isComplete ? (
          <div className="complete-screen">
            <div className="complete-emoji">🎉</div>
            <h2>Workout Complete!</h2>
            <p className="muted">Great job! Come back tomorrow.</p>
            <button className="btn btn-primary" onClick={handleReset}>
              Start Again
            </button>
          </div>
        ) : (
          <>
            <div className={`exercise-card ${exerciseClass(exercises[currentExercise]!)}`}>
              <div className="exercise-counter">
                Exercise {currentExercise + 1} of {exercises.length}
              </div>
              <h2>{exercises[currentExercise]!.name}</h2>
              <p>{exercises[currentExercise]!.instruction}</p>
              <div className="progress-track progress-track-inner">
                <div className="progress-fill progress-fill-light" style={{ width: `${exerciseProgress}%` }} />
              </div>
            </div>

            <div className="timer">{formatTime(timeLeft)}</div>

            <div className="controls">
              <button className="btn" onClick={handlePrev} disabled={currentExercise === 0}>
                ⏮ Prev
              </button>
              <button
                className={`btn btn-large ${isRunning ? 'btn-pause' : 'btn-start'}`}
                onClick={handleStartPause}
              >
                {isRunning ? '⏸ Pause' : '▶ Start'}
              </button>
              <button className="btn" onClick={handleSkip} disabled={currentExercise === exercises.length - 1}>
                Skip ⏭
              </button>
            </div>

            <button className="link-button" onClick={handleReset}>
              Reset Workout
            </button>

            <div className="upcoming">
              <h3>Coming up:</h3>
              {exercises.slice(currentExercise + 1, currentExercise + 4).map((ex, i) => (
                <div className="upcoming-row" key={i}>
                  <span>{ex.name}</span>
                  <span>{formatTime(ex.duration)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
