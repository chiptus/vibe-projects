import { formatTime } from '../lib/format';

interface OverallProgressProps {
  elapsedSeconds: number;
  totalSeconds: number;
}

export function OverallProgress({ elapsedSeconds, totalSeconds }: OverallProgressProps) {
  const progress = (elapsedSeconds / totalSeconds) * 100;

  return (
    <div className="overall-progress">
      <div className="progress-label">
        <span>Progress</span>
        <span>
          {formatTime(Math.floor(elapsedSeconds))} / {formatTime(totalSeconds)}
        </span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
