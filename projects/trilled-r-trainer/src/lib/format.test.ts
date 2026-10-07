import { describe, expect, it } from 'vitest';
import { exerciseBackground } from './format';

const exercise = (name: string) => ({ name, duration: 30, instruction: '' });

describe('exerciseBackground', () => {
  it.each([
    ['RELAX', 'bg-relax'],
    ['Cool Down', 'bg-relax'],
    ['Q-tip trill', 'bg-qtip'],
    ['Brrrr lips', 'bg-brrrr'],
    ['Tongue tap', 'bg-panel'],
  ])('maps %s to %s', (name, expected) => {
    expect(exerciseBackground(exercise(name))).toBe(expected);
  });
});
