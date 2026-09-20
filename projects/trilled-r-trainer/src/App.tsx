import { useState } from 'react';
import { EditView } from './components/EditView';
import { OverallProgress } from './components/OverallProgress';
import { PresetMenu } from './components/PresetMenu';
import { WorkoutView } from './components/WorkoutView';
import { usePresetLibrary } from './hooks/usePresetLibrary';
import { useWorkoutTimer } from './hooks/useWorkoutTimer';
import { parseImportedPreset } from './lib/presetImport';
import type { Exercise } from './types';
import './App.css';

export default function App() {
  const library = usePresetLibrary();
  const { presets, currentPresetKey, currentPreset } = library;
  const exercises = currentPreset.exercises;

  const timer = useWorkoutTimer(exercises);
  const [showPresetMenu, setShowPresetMenu] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const totalTime = exercises.reduce((sum, ex) => sum + ex.duration, 0);
  const elapsedTime =
    exercises.slice(0, timer.currentIndex).reduce((sum, ex) => sum + ex.duration, 0) +
    (exercises[timer.currentIndex]!.duration - timer.timeLeft);

  if (editMode) {
    return (
      <EditView
        presetName={currentPreset.name}
        exercises={exercises}
        onDone={() => setEditMode(false)}
        onSaveExercise={handleSaveExercise}
        onDeleteExercise={handleDeleteExercise}
        onAddExercise={handleAddExercise}
        onResetToDefault={handleResetToDefault}
        onExport={handleExport}
        onImport={handleImport}
      />
    );
  }

  return (
    <div className="app">
      <div className="container">
        <div className="header-row">
          <h1>Trilled R Workout</h1>
          <div className="button-row">
            <button className="btn" onClick={enterEditMode}>
              Edit
            </button>
            <button className="btn" onClick={() => setShowPresetMenu((v) => !v)}>
              {currentPreset.name} ▾
            </button>
          </div>
        </div>

        {showPresetMenu && (
          <PresetMenu presets={presets} currentKey={currentPresetKey} onSelect={handlePresetChange} />
        )}

        <OverallProgress elapsedSeconds={elapsedTime} totalSeconds={totalTime} />

        <WorkoutView
          exercises={exercises}
          currentIndex={timer.currentIndex}
          timeLeft={timer.timeLeft}
          isRunning={timer.isRunning}
          isComplete={timer.isComplete}
          onStartPause={timer.startPause}
          onPrev={timer.prev}
          onSkip={timer.skip}
          onReset={() => timer.reset()}
        />
      </div>
    </div>
  );

  // Editing runs in its own screen while the timer keeps ticking in the
  // background unless paused explicitly — pause it up front so a running
  // workout can't complete invisibly behind the editor.
  function enterEditMode() {
    timer.pause();
    setEditMode(true);
  }

  function handlePresetChange(key: string) {
    library.selectPreset(key);
    timer.reset(presets[key]!.exercises);
    setShowPresetMenu(false);
    setEditMode(false);
  }

  function handleSaveExercise(index: number, updated: Exercise) {
    const newExercises = [...exercises];
    newExercises[index] = updated;
    library.updateExercises(newExercises);
    timer.syncEditedExercise(index, newExercises);
  }

  function handleDeleteExercise(index: number) {
    if (exercises.length <= 1) {
      alert('Cannot delete the last exercise');
      return;
    }
    const newExercises = exercises.filter((_, i) => i !== index);
    library.updateExercises(newExercises);
    timer.syncAfterDelete(newExercises);
  }

  function handleAddExercise() {
    const newExercise: Exercise = { name: 'New Exercise', duration: 30, instruction: 'Add instructions here' };
    library.updateExercises([...exercises, newExercise]);
  }

  function handleResetToDefault() {
    if (!window.confirm('Reset this preset to default? This cannot be undone.')) return;
    const defaultPreset = library.resetToDefault();
    if (defaultPreset) timer.reset(defaultPreset.exercises);
  }

  function handleExport() {
    const exportData = JSON.stringify(currentPreset, null, 2);
    if (!navigator.clipboard) {
      alert('Clipboard access is not available in this browser.');
      return;
    }
    navigator.clipboard.writeText(exportData).then(
      () => alert('Preset copied to clipboard!'),
      () => alert('Could not copy to clipboard.'),
    );
  }

  function handleImport(key: string, json: string) {
    const preset = parseImportedPreset(json);
    if (!preset) {
      alert('Invalid preset format');
      return;
    }
    if (!key.trim()) {
      alert('Please enter a preset key');
      return;
    }

    const cleanKey = key.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    if (presets[cleanKey] && !window.confirm(`Preset "${cleanKey}" already exists. Overwrite it?`)) {
      return;
    }

    library.importPreset(cleanKey, preset);
    timer.reset(preset.exercises);
    alert(`Preset "${preset.name}" imported as "${cleanKey}"!`);
  }
}
