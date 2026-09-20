import { useState } from 'react';
import type { Exercise } from '../types';

interface EditExerciseFormProps {
  exercise: Exercise;
  onSave: (exercise: Exercise) => void;
  onCancel: () => void;
}

export function EditExerciseForm({ exercise, onSave, onCancel }: EditExerciseFormProps) {
  const [name, setName] = useState(exercise.name);
  const [duration, setDuration] = useState(String(exercise.duration));
  const [instruction, setInstruction] = useState(exercise.instruction);

  return (
    <form className="edit-form" onSubmit={handleSubmit}>
      <label>
        Name
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Duration (seconds)
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          min={5}
        />
      </label>
      <label>
        Instructions
        <textarea value={instruction} onChange={(e) => setInstruction(e.target.value)} rows={3} />
      </label>
      <div className="edit-form-actions">
        <button type="submit" className="btn btn-save">
          Save
        </button>
        <button type="button" className="btn btn-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedDuration = parseInt(duration, 10);
    if (name && parsedDuration >= 5 && instruction) {
      onSave({ name, duration: parsedDuration, instruction });
    }
  }
}
