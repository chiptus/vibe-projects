import { CompleteScreen } from './CompleteScreen';
import { ExerciseCard } from './ExerciseCard';
import { PlaybackControls } from './PlaybackControls';
import { UpcomingList } from './UpcomingList';
import type { Exercise } from '../types';

interface WorkoutViewProps {
  exercises: Exercise[];
  currentIndex: number;
  timeLeft: number;
  isRunning: boolean;
  isComplete: boolean;
  onStartPause: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onReset: () => void;
}

export function WorkoutView({
  exercises,
  currentIndex,
  timeLeft,
  isRunning,
  isComplete,
  onStartPause,
  onPrev,
  onSkip,
  onReset,
}: WorkoutViewProps) {
  if (isComplete) {
    return <CompleteScreen onRestart={onReset} />;
  }

  return (
    <>
      <ExerciseCard
        exercise={exercises[currentIndex]!}
        index={currentIndex}
        total={exercises.length}
        timeLeft={timeLeft}
      />
      <PlaybackControls
        timeLeft={timeLeft}
        isRunning={isRunning}
        isFirst={currentIndex === 0}
        isLast={currentIndex === exercises.length - 1}
        onStartPause={onStartPause}
        onPrev={onPrev}
        onSkip={onSkip}
        onReset={onReset}
      />
      <UpcomingList exercises={exercises.slice(currentIndex + 1, currentIndex + 4)} />
    </>
  );
}
