import { useEffect, useState } from 'react';
import { playBeep, startKeepAlive, stopKeepAlive } from '../lib/audio';
import type { Exercise } from '../types';

/**
 * Drives the countdown for a list of exercises: which one is current, time
 * left on it, and whether the timer is running. Auto-advances (with a beep)
 * when an exercise's time runs out, and marks the workout complete after the
 * last one.
 *
 * The caller passes the current exercise list on every render (so it always
 * ticks against up-to-date durations), but structural changes — switching
 * presets, resetting to default, editing or deleting an exercise — are
 * applied explicitly via `reset`/`syncEditedExercise`/`syncAfterDelete`
 * rather than inferred from prop changes, since those need a specific
 * target array, index, or length.
 */
export function useWorkoutTimer(exercises: Exercise[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(exercises[0]!.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isRunning) {
      stopKeepAlive();
      return;
    }
    startKeepAlive();
    return stopKeepAlive;
  }, [isRunning]);

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

  return {
    currentIndex,
    timeLeft,
    isRunning,
    isComplete,
    pause,
    startPause,
    reset,
    skip,
    prev,
    syncEditedExercise,
    syncAfterDelete,
  };

  function pause() {
    setIsRunning(false);
  }

  function startPause() {
    setIsRunning((r) => !r);
  }

  /** Resets to the first exercise. Pass the target list explicitly when it differs from `exercises` (e.g. a just-switched preset). */
  function reset(targetExercises: Exercise[] = exercises) {
    setIsRunning(false);
    setCurrentIndex(0);
    setTimeLeft(targetExercises[0]!.duration);
    setIsComplete(false);
  }

  function skip() {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((i) => i + 1);
      setTimeLeft(exercises[currentIndex + 1]!.duration);
    }
  }

  function prev() {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setTimeLeft(exercises[currentIndex - 1]!.duration);
    }
  }

  /**
   * Called after saving an edit to `nextExercises[index]`. If that's the
   * exercise currently being timed, its stale `timeLeft` (from before the
   * edit) could be negative or overshoot 100% against the new duration —
   * restart its countdown at the new duration instead.
   */
  function syncEditedExercise(index: number, nextExercises: Exercise[]) {
    if (index !== currentIndex) return;
    setIsRunning(false);
    setTimeLeft(nextExercises[index]!.duration);
  }

  /**
   * Called after an exercise is deleted. The current index may now point at
   * a different exercise (or be out of range), so clamp it and restart that
   * exercise's countdown at its own duration.
   */
  function syncAfterDelete(nextExercises: Exercise[]) {
    setIsRunning(false);
    setCurrentIndex((i) => {
      const clamped = Math.min(i, Math.max(0, nextExercises.length - 1));
      setTimeLeft(nextExercises[clamped]!.duration);
      return clamped;
    });
  }
}
