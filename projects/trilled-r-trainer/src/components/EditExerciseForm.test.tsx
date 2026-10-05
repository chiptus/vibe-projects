// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { EditExerciseForm } from './EditExerciseForm';

afterEach(cleanup);

const exercise = { name: 'Tongue tap', duration: 30, instruction: 'Tap the ridge.' };

function setup() {
  const onSave = vi.fn();
  const onCancel = vi.fn();
  render(<EditExerciseForm exercise={exercise} onSave={onSave} onCancel={onCancel} />);
  return { onSave, onCancel, user: userEvent.setup() };
}

describe('EditExerciseForm', () => {
  it('saves edited values', async () => {
    const { onSave, user } = setup();
    const name = screen.getByLabelText('Name');
    await user.clear(name);
    await user.type(name, 'Flap');
    const duration = screen.getByLabelText('Duration (seconds)');
    await user.clear(duration);
    await user.type(duration, '45');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() =>
      expect(onSave).toHaveBeenCalledWith({ name: 'Flap', duration: 45, instruction: 'Tap the ridge.' }),
    );
  });

  it('rejects a duration under 5 seconds and shows feedback', async () => {
    const { onSave, user } = setup();
    const duration = screen.getByLabelText('Duration (seconds)');
    await user.clear(duration);
    await user.type(duration, '3');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect((await screen.findByRole('alert')).textContent).toMatch(/at least 5 seconds/);
    expect(onSave).not.toHaveBeenCalled();
  });

  it('rejects an empty name', async () => {
    const { onSave, user } = setup();
    await user.clear(screen.getByLabelText('Name'));
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect((await screen.findByRole('alert')).textContent).toMatch(/Name is required/);
    expect(onSave).not.toHaveBeenCalled();
  });

  it('calls onCancel', async () => {
    const { onCancel, user } = setup();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalled();
  });
});
