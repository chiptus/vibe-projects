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
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditingIndex(null);
                onDone();
              }}
            >
              Done
            </button>
          </div>
        </div>

        {showImportExport && (
          <ImportExportPanel
            onExport={onExport}
            onImport={(key, json) => {
              onImport(key, json);
              setShowImportExport(false);
            }}
          />
        )}

        <p className="total-time">Total: {formatTime(totalTime)}</p>

        <div className="exercise-list">
          {exercises.map((ex, i) => (
            <div className="panel" key={i}>
              {editingIndex === i ? (
                <EditExerciseForm
                  exercise={ex}
                  onSave={(updated) => {
                    onSaveExercise(i, updated);
                    setEditingIndex(null);
                  }}
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
                      <button className="btn btn-danger" onClick={() => onDeleteExercise(i)}>
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
          <button
            className="btn btn-save flex-1"
            onClick={() => {
              onAddExercise();
              setEditingIndex(exercises.length);
            }}
          >
            + Add Exercise
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              onResetToDefault();
              setEditingIndex(null);
            }}
          >
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
}
