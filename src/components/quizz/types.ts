export interface QuizzState {
  currentStep: number; // e.g., 0: Intro, 1: Formula, 2: Q1, etc.
  answers: {
    q1: string;
    q2: string;
    q3: string;
  };
  validationStatus: {
    q1: 'pending' | 'correct' | 'incorrect';
    q2: 'pending' | 'correct' | 'incorrect';
    q3: 'pending' | 'correct' | 'incorrect';
  };
}

export type QuizzAction =
  | { type: 'ADVANCE_STEP' }
  | { type: 'GO_BACK' }
  | { type: 'SET_ANSWER'; payload: { question: 'q1' | 'q2' | 'q3'; value: string } }
  | { type: 'VALIDATE_ANSWER'; payload: { question: 'q1' | 'q2' | 'q3'; isCorrect: boolean } }
  | { type: 'RESET_VALIDATION'; payload: { question: 'q1' | 'q2' | 'q3' } }
  | { type: 'RESTART' };
