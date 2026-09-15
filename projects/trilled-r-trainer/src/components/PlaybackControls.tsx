import { formatTime } from '../lib/format';

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
      <div className="timer">{formatTime(timeLeft)}</div>

      <div className="controls">
        <button className="btn" onClick={onPrev} disabled={isFirst}>
          ⏮ Prev
        </button>
        <button className={`btn btn-large ${isRunning ? 'btn-pause' : 'btn-start'}`} onClick={onStartPause}>
          {isRunning ? '⏸ Pause' : '▶ Start'}
        </button>
        <button className="btn" onClick={onSkip} disabled={isLast}>
          Skip ⏭
        </button>
      </div>

      <button className="link-button" onClick={onReset}>
        Reset Workout
      </button>
    </>
  );
}
