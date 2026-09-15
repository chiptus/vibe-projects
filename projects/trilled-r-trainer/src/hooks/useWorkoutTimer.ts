import { useEffect, useState } from 'react';
import { playBeep } from '../lib/audio';
import type { Exercise } from '../types';

/**
 * Drives the countdown for a list of exercises: which one is current, time
 * left on it, and whether the timer is running. Auto-advances (with a beep)
 * when an exercise's time runs out, and marks the workout complete after the
 * last one.
 *
 * The caller passes the current exercise list on every render (so it always
 * ticks against up-to-date durations), but structural changes — switching
 * presets, resetting to default, deleting an exercise — are applied
 * explicitly via `reset`/`clampIndex` rather than inferred from prop
 * changes, since those need a specific target array or length.
 */
export function useWorkoutTimer(exercises: Exercise[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(exercises[0]!.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft === 0) {
      playBeep();
      if (currentIndex < exercises.length - 1) {
        setCurrentIndex((i) => i + 1);
        setTimeLeft(exercises[currentIndex + 1]!.duration);
      } else {
        setIsRunning(false);
        setIsComplete(true);
      }
      return;
    }

    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, currentIndex, exercises]);

  const startPause = () => setIsRunning((r) => !r);

  /** Resets to the first exercise. Pass the target list explicitly when it differs from `exercises` (e.g. a just-switched preset). */
  const reset = (targetExercises: Exercise[] = exercises) => {
    setIsRunning(false);
    setCurrentIndex(0);
    setTimeLeft(targetExercises[0]!.duration);
    setIsComplete(false);
  };

  const skip = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((i) => i + 1);
      setTimeLeft(exercises[currentIndex + 1]!.duration);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setTimeLeft(exercises[currentIndex - 1]!.duration);
    }
  };

  /** Keeps the current index in range after an exercise is deleted. */
  const clampIndex = (newLength: number) => {
    setCurrentIndex((i) => Math.min(i, Math.max(0, newLength - 1)));
  };

  return { currentIndex, timeLeft, isRunning, isComplete, startPause, reset, skip, prev, clampIndex };
}
