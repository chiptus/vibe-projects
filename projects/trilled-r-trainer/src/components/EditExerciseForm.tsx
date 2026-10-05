import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import type { Exercise } from '../types';

interface EditExerciseFormProps {
  exercise: Exercise;
  onSave: (exercise: Exercise) => void;
  onCancel: () => void;
}

const MIN_DURATION = 5;

// The duration input holds a string; the schema validates it and parses it to a number.
const exerciseFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  duration: z
    .string()
    .trim()
    .transform(Number)
    .pipe(
      z
        .number('Duration must be a number')
        .int('Duration must be a whole number')
        .min(MIN_DURATION, `Duration must be at least ${MIN_DURATION} seconds`),
    ),
  instruction: z.string().min(1, 'Instructions are required'),
});

export function EditExerciseForm({ exercise, onSave, onCancel }: EditExerciseFormProps) {
  const form = useForm({
    defaultValues: {
      name: exercise.name,
      duration: String(exercise.duration),
      instruction: exercise.instruction,
    },
    validators: { onSubmit: exerciseFormSchema },
    onSubmit: ({ value }) => {
      onSave(exerciseFormSchema.parse(value));
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
        name="name">
        {(field) => (
          <label>
            Name
            <input
              type="text"
              placeholder="e.g. Tongue tap"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            <FieldError errors={field.state.meta.errors} />
          </label>
        )}
      </form.Field>
      <form.Field
        name="duration">
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
        name="instruction">
        {(field) => (
          <label>
            Instructions
            <textarea
              placeholder="Describe how to do this exercise"
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
  const message = errors.map((error) => (error as { message?: string } | undefined)?.message).find(Boolean);
  return message ? <span role="alert" className="field-error">{message}</span> : null;
}
