// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { EditView } from './EditView';

afterEach(cleanup);

function setup(exercises: { name: string; duration: number; instruction: string }[]) {
  const onDeleteExercise = vi.fn();
  render(
    <EditView
      presetName="Test"
      exercises={exercises}
      onDone={vi.fn()}
      onSaveExercise={vi.fn()}
      onDeleteExercise={onDeleteExercise}
      onAddExercise={vi.fn()}
      onResetToDefault={vi.fn()}
      onExport={vi.fn()}
      onImport={vi.fn()}
    />,
  );
  return { onDeleteExercise, user: userEvent.setup() };
}

describe('EditView cancel', () => {
  it('removes a newly added blank exercise', async () => {
    const { onDeleteExercise, user } = setup([
      { name: 'Tap', duration: 30, instruction: 'Tap it' },
      { name: '', duration: 30, instruction: '' },
    ]);
    await user.click(screen.getAllByRole('button', { name: 'Edit' })[1]!);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onDeleteExercise).toHaveBeenCalledWith(1);
  });

  it('keeps an existing exercise when cancelling its edit', async () => {
    const { onDeleteExercise, user } = setup([{ name: 'Tap', duration: 30, instruction: 'Tap it' }]);
    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onDeleteExercise).not.toHaveBeenCalled();
    expect(screen.getByText('Tap')).toBeTruthy();
  });
});
