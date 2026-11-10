import { useState } from 'react';
import { EditExerciseForm } from './EditExerciseForm';
import { ImportExportPanel } from './ImportExportPanel';
import { formatTime } from '../lib/format';
import { Button } from './ui';
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
    <div className="flex min-h-screen flex-col items-center bg-linear-to-b from-page-from to-page-to p-4 text-white">
      <div className="w-full max-w-lg">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl">Edit {presetName}</h1>
          <div className="flex gap-2">
            <Button onClick={() => setShowImportExport((v) => !v)}>Import/Export</Button>
            <Button variant="primary" onClick={handleDone}>
              Done
            </Button>
          </div>
        </div>

        {showImportExport && <ImportExportPanel onExport={onExport} onImport={handleImport} />}

        <p className="mb-4 text-sm text-muted">Total: {formatTime(totalTime)}</p>

        <div className="mb-4 flex flex-col gap-3">
          {exercises.map((ex, i) => (
            <div className="mb-4 rounded-lg bg-panel p-4" key={i}>
              {editingIndex === i ? (
                <EditExerciseForm
                  exercise={ex}
                  onSave={(updated) => handleSaveExercise(i, updated)}
                  onCancel={() => handleCancelEdit(i)}
                />
              ) : (
                <>
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3 className="mb-1 text-lg font-semibold">{ex.name || 'Untitled exercise'}</h3>
                      <p className="text-sm text-muted">{formatTime(ex.duration)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => setEditingIndex(i)}>Edit</Button>
                      <Button variant="danger" onClick={() => handleDeleteExercise(i)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                  <p className="text-soft">{ex.instruction}</p>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button variant="save" className="flex-1" onClick={handleAddExercise}>
            + Add Exercise
          </Button>
          <Button variant="danger" onClick={handleResetToDefault}>
            Reset to Default
          </Button>
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

  // A newly added exercise is blank and can't be saved blank, so cancelling
  // its form discards it instead of leaving an empty row behind.
  function handleCancelEdit(index: number) {
    const ex = exercises[index];
    if (ex && !ex.name && !ex.instruction) {
      handleDeleteExercise(index);
    } else {
      setEditingIndex(null);
    }
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
