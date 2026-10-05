import { useForm } from '@tanstack/react-form';
import type { Exercise } from '../types';

interface EditExerciseFormProps {
  exercise: Exercise;
  onSave: (exercise: Exercise) => void;
  onCancel: () => void;
}

const MIN_DURATION = 5;

function parseDuration(value: string): number | null {
  const parsed = Number(value);
  return value.trim() !== '' && Number.isInteger(parsed) && parsed >= MIN_DURATION ? parsed : null;
}

export function EditExerciseForm({ exercise, onSave, onCancel }: EditExerciseFormProps) {
  const form = useForm({
    defaultValues: {
      name: exercise.name,
      duration: String(exercise.duration),
      instruction: exercise.instruction,
    },
    onSubmit: ({ value }) => {
      onSave({
        name: value.name,
        duration: parseDuration(value.duration) ?? MIN_DURATION,
        instruction: value.instruction,
      });
    },
  });

  return (
    <form
      className="edit-form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <form.Field
        name="name"
        validators={{ onSubmit: ({ value }) => (value ? undefined : 'Name is required') }}
      >
        {(field) => (
          <label>
            Name
            <input
              type="text"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            <FieldError errors={field.state.meta.errors} />
          </label>
        )}
      </form.Field>
      <form.Field
        name="duration"
        validators={{
          onSubmit: ({ value }) =>
            parseDuration(value) !== null
              ? undefined
              : `Duration must be a whole number of at least ${MIN_DURATION} seconds`,
        }}
      >
        {(field) => (
          <label>
            Duration (seconds)
            <input
              type="number"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              min={MIN_DURATION}
            />
            <FieldError errors={field.state.meta.errors} />
          </label>
        )}
      </form.Field>
      <form.Field
        name="instruction"
        validators={{ onSubmit: ({ value }) => (value ? undefined : 'Instructions are required') }}
      >
        {(field) => (
          <label>
            Instructions
            <textarea
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              rows={3}
            />
            <FieldError errors={field.state.meta.errors} />
          </label>
        )}
      </form.Field>
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
}

function FieldError({ errors }: { errors: unknown[] }) {
  const message = errors.find((error): error is string => typeof error === 'string');
  return message ? <span role="alert">{message}</span> : null;
}
