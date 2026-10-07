import { formatTime } from '../lib/format';
import type { Exercise } from '../types';

interface UpcomingListProps {
  exercises: Exercise[];
}

export function UpcomingList({ exercises }: UpcomingListProps) {
  return (
    <div className="w-full">
      <h3 className="mb-2 text-sm font-semibold text-accent">Coming up:</h3>
      {exercises.map((ex, i) => (
        <div className="mb-1 flex justify-between rounded-md bg-panel/30 px-3 py-1 text-sm text-muted" key={i}>
          <span>{ex.name}</span>
          <span>{formatTime(ex.duration)}</span>
        </div>
      ))}
    </div>
  );
}
