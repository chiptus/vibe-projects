import { useState } from 'react';
import { EditExerciseForm } from './EditExerciseForm';
import { ImportExportPanel } from './ImportExportPanel';
import { formatTime } from '../lib/format';
import type { Exercise } from '../types';

interface EditViewProps {
  presetName: string;
  exercises: Exercise[];
  onDone: () => void;
  onSaveExercise: (index: number, exercise: Exercise) => void;
  onDeleteExercise: (index: number) => void;
  onAddExercise: () => void;
  onResetToDefault: () => void;
  onExport: () => void;
  onImport: (key: string, json: string) => void;
}

export function EditView({
  presetName,
  exercises,
  onDone,
  onSaveExercise,
  onDeleteExercise,
  onAddExercise,
  onResetToDefault,
  onExport,
  onImport,
}: EditViewProps) {
  const [showImportExport, setShowImportExport] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const totalTime = exercises.reduce((sum, ex) => sum + ex.duration, 0);

  return (
    <div className="app edit-mode">
      <div className="container">
        <div className="header-row">
          <h1>Edit {presetName}</h1>
          <div className="button-row">
            <button className="btn" onClick={() => setShowImportExport((v) => !v)}>
              Import/Export
            </button>
            <button className="btn btn-primary" onClick={handleDone}>
              Done
            </button>
          </div>
        </div>

        {showImportExport && <ImportExportPanel onExport={onExport} onImport={handleImport} />}

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

  function handleDone() {
    setEditingIndex(null);
    onDone();
  }

  function handleImport(key: string, json: string) {
    onImport(key, json);
    setShowImportExport(false);
  }

  function handleSaveExercise(index: number, updated: Exercise) {
    onSaveExercise(index, updated);
    setEditingIndex(null);
  }

  // Rows are keyed by index, so deleting one shifts every later row's
  // identity. Without this, an open edit form for a later row would keep
  // its stale local state but silently start saving into a different
  // exercise once the array shifts underneath it.
  function handleDeleteExercise(index: number) {
    onDeleteExercise(index);
    setEditingIndex((current) => {
      if (current === null || current === index) return null;
      return current > index ? current - 1 : current;
    });
  }

  function handleAddExercise() {
    onAddExercise();
    setEditingIndex(exercises.length);
  }

  function handleResetToDefault() {
    onResetToDefault();
    setEditingIndex(null);
  }
}
