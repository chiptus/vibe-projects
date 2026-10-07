import { Button } from './ui';

interface CompleteScreenProps {
  onRestart: () => void;
}

export function CompleteScreen({ onRestart }: CompleteScreenProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 text-6xl">🎉</div>
      <h2 className="text-2xl">Workout Complete!</h2>
      <p className="text-sm text-muted">Great job! Come back tomorrow.</p>
      <Button variant="primary" className="mt-4" onClick={onRestart}>
        Start Again
      </Button>
    </div>
  );
}
