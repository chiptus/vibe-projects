import { formatTime } from '../lib/format';
import { Button } from './ui';

interface PlaybackControlsProps {
  timeLeft: number;
  isRunning: boolean;
  isFirst: boolean;
  isLast: boolean;
  onStartPause: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onReset: () => void;
}

export function PlaybackControls({
  timeLeft,
  isRunning,
  isFirst,
  isLast,
  onStartPause,
  onPrev,
  onSkip,
  onReset,
}: PlaybackControlsProps) {
  return (
    <>
      <div className="mb-6 w-full text-center font-mono text-8xl font-bold">{formatTime(timeLeft)}</div>

      <div className="mb-6 flex justify-center gap-4">
        <Button onClick={onPrev} disabled={isFirst}>
          ⏮ Prev
        </Button>
        <Button large variant={isRunning ? 'pause' : 'start'} onClick={onStartPause}>
          {isRunning ? '⏸ Pause' : '▶ Start'}
        </Button>
        <Button onClick={onSkip} disabled={isLast}>
          Skip ⏭
        </Button>
      </div>

      <button className="mx-auto mb-4 block cursor-pointer text-sm text-accent underline hover:text-muted" onClick={onReset}>
        Reset Workout
      </button>
    </>
  );
}
