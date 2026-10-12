import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import type { Exercise } from '../types';
import { Button, Field, Input, Textarea } from './ui';

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
          <Field label="Name" error={fieldError(field.state.meta.errors)}>
            <Input
              type="text"
              placeholder="e.g. Tongue tap"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </Field>
        )}
      </form.Field>
      <form.Field
        name="duration">
        {(field) => (
          <Field label="Duration (seconds)" error={fieldError(field.state.meta.errors)}>
            <Input
              type="number"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              min={MIN_DURATION}
            />
          </Field>
        )}
      </form.Field>
      <form.Field
        name="instruction">
        {(field) => (
          <Field label="Instructions" error={fieldError(field.state.meta.errors)}>
            <Textarea
              placeholder="Describe how to do this exercise"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              rows={3}
            />
          </Field>
        )}
      </form.Field>
      <div className="flex gap-2">
        <Button type="submit" variant="save">
          Save
        </Button>
        <Button type="button" variant="cancel" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function fieldError(errors: unknown[]) {
  return errors.map((error) => (error as { message?: string } | undefined)?.message).find(Boolean);
}
