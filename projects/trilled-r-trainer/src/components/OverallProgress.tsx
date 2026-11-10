import { formatTime } from '../lib/format';

interface OverallProgressProps {
  elapsedSeconds: number;
  totalSeconds: number;
}

export function OverallProgress({ elapsedSeconds, totalSeconds }: OverallProgressProps) {
  const progress = (elapsedSeconds / totalSeconds) * 100;

  return (
    <div className="mb-4 w-full">
      <div className="mb-1 flex justify-between text-sm text-muted">
        <span>Progress</span>
        <span>
          {formatTime(Math.floor(elapsedSeconds))} / {formatTime(totalSeconds)}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-page-from">
        <div className="h-full bg-progress transition-[width] duration-300" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
