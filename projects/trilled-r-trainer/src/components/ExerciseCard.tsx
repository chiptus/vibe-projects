import { exerciseBackground } from '../lib/format';
import type { Exercise } from '../types';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  total: number;
  timeLeft: number;
}

export function ExerciseCard({ exercise, index, total, timeLeft }: ExerciseCardProps) {
  const progress = ((exercise.duration - timeLeft) / exercise.duration) * 100;

  return (
    <div className={`mb-4 w-full rounded-xl p-6 ${exerciseBackground(exercise)}`}>
      <div className="mb-1 text-sm opacity-75">
        Exercise {index + 1} of {total}
      </div>
      <h2 className="mb-3 text-2xl">{exercise.name}</h2>
      <p className="mb-4 text-soft">{exercise.instruction}</p>
      <div className="h-1 overflow-hidden rounded-full bg-page-from">
        <div className="h-full bg-white transition-[width] duration-1000 ease-linear" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
