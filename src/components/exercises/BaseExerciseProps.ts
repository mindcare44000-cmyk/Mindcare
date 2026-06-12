export interface BaseExerciseProps {
  onComplete: () => void;
  onCancel: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}
