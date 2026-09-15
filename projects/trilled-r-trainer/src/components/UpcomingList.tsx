import { formatTime } from '../lib/format';
import type { Exercise } from '../types';

interface UpcomingListProps {
  exercises: Exercise[];
}

export function UpcomingList({ exercises }: UpcomingListProps) {
  return (
    <div className="upcoming">
      <h3>Coming up:</h3>
      {exercises.map((ex, i) => (
        <div className="upcoming-row" key={i}>
          <span>{ex.name}</span>
          <span>{formatTime(ex.duration)}</span>
        </div>
      ))}
    </div>
  );
}
