interface CompleteScreenProps {
  onRestart: () => void;
}

export function CompleteScreen({ onRestart }: CompleteScreenProps) {
  return (
    <div className="complete-screen">
      <div className="complete-emoji">🎉</div>
      <h2>Workout Complete!</h2>
      <p className="muted">Great job! Come back tomorrow.</p>
      <button className="btn btn-primary" onClick={onRestart}>
        Start Again
      </button>
    </div>
  );
}
