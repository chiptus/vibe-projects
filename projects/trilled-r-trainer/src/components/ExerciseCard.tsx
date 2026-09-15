import { exerciseClass } from '../lib/format';
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
    <div className={`exercise-card ${exerciseClass(exercise)}`}>
      <div className="exercise-counter">
        Exercise {index + 1} of {total}
      </div>
      <h2>{exercise.name}</h2>
      <p>{exercise.instruction}</p>
      <div className="progress-track progress-track-inner">
        <div className="progress-fill progress-fill-light" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
