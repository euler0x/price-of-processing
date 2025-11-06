'use client';

import { useReducer } from 'react';
import { Card, CardContent, Stepper, Step, StepLabel, Typography, Box, Paper } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import { EventStudyChart } from './EventStudyChart';
import { EventStudyTable } from './EventStudyTable';
import { FormulaScreen } from './FormulaScreen';
import { IntroductionScreen } from './IntroductionScreen';
import { QuestionScreen } from './QuestionScreen';
import { SuccessScreen } from './SuccessScreen';
import { QuizzState, QuizzAction } from './types';

// Cypherpunk color palette
const COLORS = {
  base: '#0b0c10',
  charcoal: '#1a1a1a',
  cyan: '#00f0ff',
  magenta: '#ff00e6',
  purple: '#9d4edd',
  green: '#39ff14',
  gunmetal: '#2a2f36',
  silver: '#cccccc',
};

// Animations
const gradientShift = keyframes`
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
`;

const initialState: QuizzState = {
  currentStep: 0,
  answers: {
    q1: '',
    q2: '',
    q3: '',
  },
  validationStatus: {
    q1: 'pending',
    q2: 'pending',
    q3: 'pending',
  },
};

function quizzReducer(state: QuizzState, action: QuizzAction): QuizzState {
  switch (action.type) {
    case 'ADVANCE_STEP':
      return {
        ...state,
        currentStep: state.currentStep + 1,
      };
    case 'GO_BACK':
      return {
        ...state,
        currentStep: Math.max(0, state.currentStep - 1),
      };
    case 'SET_ANSWER':
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.question]: action.payload.value,
        },
      };
    case 'VALIDATE_ANSWER':
      return {
        ...state,
        validationStatus: {
          ...state.validationStatus,
          [action.payload.question]: action.payload.isCorrect ? 'correct' : 'incorrect',
        },
      };
    case 'RESET_VALIDATION':
      return {
        ...state,
        validationStatus: {
          ...state.validationStatus,
          [action.payload.question]: 'pending',
        },
      };
    case 'RESTART':
      return initialState;
    default:
      return state;
  }
}

const expectedAnswers = {
  q1: 9.5,
  q2: 26.6,
  q3: 36,
};

export const QuizzContainer = () => {
  const [state, dispatch] = useReducer(quizzReducer, initialState);

  const handleStart = () => {
    dispatch({ type: 'ADVANCE_STEP' });
  };

  const handleNext = () => {
    dispatch({ type: 'ADVANCE_STEP' });
  };

  const handleBack = () => {
    dispatch({ type: 'GO_BACK' });
  };

  const handleAnswerChange = (question: 'q1' | 'q2' | 'q3', value: string) => {
    dispatch({ type: 'SET_ANSWER', payload: { question, value } });
    // Reset validation status when answer changes
    if (state.validationStatus[question] !== 'pending') {
      dispatch({
        type: 'RESET_VALIDATION',
        payload: { question },
      });
    }
  };

  const handleSubmit = (question: 'q1' | 'q2' | 'q3') => {
    const answer = question === 'q3' ? parseInt(state.answers[question], 10) : parseFloat(state.answers[question]);
    const expected = expectedAnswers[question];

    // Validation with ~5% error margin
    // q1: 9.5% ± 5% = 9.5 * 0.95 to 9.5 * 1.05 = 9.025 to 9.975 → use 9.0 to 10.0 (inclusive)
    // q2: 26% ± 5% = 26 * 0.95 to 26 * 1.05 = 24.7 to 27.3 → use 25.0 to 27.0 (inclusive)
    // q3: 36% ± 5% = 36 * 0.95 to 36 * 1.05 = 34.2 to 37.8 → use 34 to 38 (inclusive)
    let isCorrect = false;
    if (question === 'q1') {
      // Pre-announcement drop: 9.5% ± 5% = 9.025 to 9.975, rounded to 9.0 to 10.0
      isCorrect = !isNaN(answer) && answer >= 9.0 && answer <= 10.0;
    } else if (question === 'q2') {
      // Total drop: 26% ± 5% = 24.7 to 27.3, rounded to 25.0 to 27.0
      isCorrect = !isNaN(answer) && answer >= 25.0 && answer <= 27.0;
    } else if (question === 'q3') {
      // Final calculation: Calculate expected from user's q1 and q2, then apply ±5% margin
      const numerator = parseFloat(state.answers.q1);
      const denominator = parseFloat(state.answers.q2);
      if (!isNaN(numerator) && !isNaN(denominator) && denominator > 0) {
        const expectedValue = (numerator / denominator) * 100;
        const margin = expectedValue * 0.05; // 5% margin
        const minValue = Math.max(0, Math.floor(expectedValue - margin)); // Floor to be more lenient
        const maxValue = Math.ceil(expectedValue + margin); // Ceil to be more lenient
        isCorrect = !isNaN(answer) && answer >= minValue && answer <= maxValue;
      } else {
        // Fallback to fixed range if inputs are invalid
        isCorrect = !isNaN(answer) && answer >= 34 && answer <= 38;
      }
    } else {
      isCorrect = !isNaN(answer) && answer === expected;
    }

    dispatch({
      type: 'VALIDATE_ANSWER',
      payload: { question, isCorrect },
    });
  };

  const handleRestart = () => {
    dispatch({ type: 'RESTART' });
  };

  const steps = ['Intro', 'The Formula', 'Pre-Announcement', 'Total Impact', 'Final Step'];

  const getActiveStep = () => {
    if (state.currentStep === 0) return 0;
    if (state.currentStep === 1) return 1;
    if (state.currentStep === 2) return 2;
    if (state.currentStep === 3) return 3;
    if (state.currentStep === 4) return 4;
    if (state.currentStep === 5) return 4; // Success screen
    return 0;
  };

  const renderStepContent = () => {
    if (state.currentStep === 0) {
      return <IntroductionScreen onStart={handleStart} />;
    }
    if (state.currentStep === 1) {
      return <FormulaScreen onNext={handleNext} onBack={handleBack} />;
    }
    if (state.currentStep === 2) {
      return (
        <QuestionScreen
          stepTitle='Step 2: Find the Total Price Drop After the Hack'
          hint={
            <>
              <Typography
                variant='body1'
                paragraph
                sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.8, fontFamily: '"JetBrains Mono", monospace' }}
              >
                Before we can measure how much of the reaction happened before the news became public, we first need to
                know the total market reaction to a hack.
              </Typography>
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  backgroundColor: 'rgba(0, 240, 255, 0.1)',
                  borderRadius: 1,
                  borderLeft: `4px solid ${COLORS.cyan}`,
                  boxShadow: `0 0 10px rgba(0, 240, 255, 0.2)`,
                }}
              >
                <Typography
                  variant='body1'
                  sx={{
                    mb: 1.5,
                    fontWeight: 'bold',
                    fontFamily: '"JetBrains Mono", monospace',
                    color: COLORS.cyan,
                    textShadow: `0 0 5px ${COLORS.cyan}`,
                  }}
                >
                  {'>'} THINK OF IT LIKE THIS:
                </Typography>
                <Typography variant='body2' sx={{ mb: 1, lineHeight: 1.7, fontFamily: '"JetBrains Mono", monospace' }}>
                  First, find how big the entire price drop was after the hack — that's your denominator.
                </Typography>
                <Typography variant='body2' sx={{ mb: 1, lineHeight: 1.7, fontFamily: '"JetBrains Mono", monospace' }}>
                  Then, in the next step, you'll find how much of that drop happened before the public announcement —
                  the numerator.
                </Typography>
                <Typography variant='body2' sx={{ lineHeight: 1.7, fontFamily: '"JetBrains Mono", monospace' }}>
                  Once you have both, you'll calculate what share of the total movement occurred in the hidden window,
                  before the world found out.
                </Typography>
              </Box>
              <Typography
                variant='body2'
                sx={{ mb: 3, fontStyle: 'italic', color: COLORS.gunmetal, fontFamily: '"JetBrains Mono", monospace' }}
              >
                You're starting from the "big picture" (total drop), then zooming into the "hidden window" next.
              </Typography>
              <Typography
                variant='body1'
                paragraph
                sx={{
                  mb: 2,
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  fontWeight: 'bold',
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              >
                The table below shows the average price movement of DeFi tokens around 49 hack events.
              </Typography>
              <Typography
                variant='body1'
                paragraph
                sx={{ mb: 2, fontSize: '1.1rem', lineHeight: 1.8, fontFamily: '"JetBrains Mono", monospace' }}
              >
                The left-hand block measures time from the moment of the on-chain hack itself — the very first sign of
                trouble.
              </Typography>
              <Typography
                variant='body1'
                paragraph
                sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.8, fontFamily: '"JetBrains Mono", monospace' }}
              >
                Each row tells you how far prices have moved after a given number of hours.
              </Typography>
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  backgroundColor: 'rgba(57, 255, 20, 0.1)',
                  borderRadius: 1,
                  borderLeft: `4px solid ${COLORS.green}`,
                  boxShadow: `0 0 10px rgba(57, 255, 20, 0.2)`,
                }}
              >
                <Typography
                  variant='body2'
                  sx={{
                    mb: 1,
                    fontWeight: 'bold',
                    fontFamily: '"JetBrains Mono", monospace',
                    color: COLORS.green,
                    textShadow: `0 0 5px ${COLORS.green}`,
                  }}
                >
                  {'>'} ABOUT THE CHECKPOINTS:
                </Typography>
                <Typography variant='body2' sx={{ lineHeight: 1.7, fontFamily: '"JetBrains Mono", monospace' }}>
                  The study reports cumulative abnormal returns (CARs) at fixed checkpoints: −24, −12, −6, −3, 0, +3,
                  +6, +12, +24 hours. After a hack, prices typically drop quickly and then stabilize. To capture the
                  complete market reaction, you need to find the checkpoint where the price drop has fully materialized
                  and stabilized — look for where the values plateau rather than continuing to change.
                </Typography>
              </Box>
              <Typography
                variant='body2'
                sx={{
                  mb: 3,
                  fontStyle: 'italic',
                  color: COLORS.gunmetal,
                  p: 2,
                  backgroundColor: 'rgba(42, 47, 54, 0.5)',
                  borderRadius: 1,
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              >
                {'>'} HINT: First, identify which column measures time from the hack itself. Then, scan the rows to find
                where the price change stabilizes (stops changing significantly). That checkpoint represents the
                complete reaction. Convert that value to a positive percentage.
              </Typography>
              <EventStudyTable showSparkline={true} />
            </>
          }
          questionText='Using the table, what is the total price drop after the hack (as a positive percent)? Find the checkpoint where the market reaction has stabilized.'
          value={state.answers.q2}
          validationStatus={state.validationStatus.q2}
          onValueChange={(value) => handleAnswerChange('q2', value)}
          onSubmit={() => handleSubmit('q2')}
          onNext={handleNext}
          onBack={handleBack}
          successMessage="Nice work! The average total price drop was about 26% in the 24 hours after a hack. You've now established the full market reaction — next, you'll figure out how much of that happened before the public even knew."
          errorMessage={(() => {
            const answer = parseFloat(state.answers.q2);
            if (!isNaN(answer)) {
              if (answer < 25.0) {
                return "That's a bit low — make sure you're looking at the 24-hour row in the left block ('From Hack Time').";
              } else if (answer > 27.0) {
                return 'Check your conversion — remember to take the absolute value of the number and round to one decimal.';
              }
            }
            return "Not quite. Remember: Look in the left-hand block ('From Hack Time'), find the row where t = +24 hours, convert to a percentage (multiply by 100), ignore any minus sign, and round to one decimal. The value should be around 26% (±5%).";
          })()}
          instructions="Example: If the table says '-0.085', you'd type '8.5'."
        />
      );
    }
    if (state.currentStep === 3) {
      const showTargetPoint = state.validationStatus.q1 === 'correct';

      return (
        <QuestionScreen
          stepTitle='Step 3: Estimate the Price Drop Before the Public Announcement'
          hint={
            <>
              <Typography
                variant='body1'
                paragraph
                sx={{ mb: 2, fontSize: '1.1rem', lineHeight: 1.8, fontFamily: '"JetBrains Mono", monospace' }}
              >
                You've already found the total price drop (≈ 26%) after the hack.
              </Typography>
              <Typography
                variant='body1'
                paragraph
                sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.8, fontFamily: '"JetBrains Mono", monospace' }}
              >
                Now, let's see how much of that fall happened before the news became public.
              </Typography>
              <Typography
                variant='body1'
                paragraph
                sx={{
                  mb: 2,
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  fontWeight: 'bold',
                  fontFamily: '"JetBrains Mono", monospace',
                  color: COLORS.cyan,
                  textShadow: `0 0 5px ${COLORS.cyan}`,
                }}
              >
                {'>'} WHAT TO LOOK AT:
              </Typography>
              <Typography
                variant='body1'
                paragraph
                sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.8, fontFamily: '"JetBrains Mono", monospace' }}
              >
                The chart below tracks average token prices around the announcement moment (dashed line = announcement).
                This chart re-centers time on the first public post, so you can see what happened before everyone knew.
              </Typography>
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  backgroundColor: 'rgba(57, 255, 20, 0.1)',
                  borderRadius: 1,
                  borderLeft: `4px solid ${COLORS.green}`,
                  boxShadow: `0 0 10px rgba(57, 255, 20, 0.2)`,
                }}
              >
                <Typography
                  variant='body2'
                  sx={{
                    mb: 1,
                    fontWeight: 'bold',
                    fontFamily: '"JetBrains Mono", monospace',
                    color: COLORS.green,
                    textShadow: `0 0 5px ${COLORS.green}`,
                  }}
                >
                  {'>'} ABOUT THE CHECKPOINTS:
                </Typography>
                <Typography variant='body2' sx={{ lineHeight: 1.7, fontFamily: '"JetBrains Mono", monospace' }}>
                  The study uses the same fixed checkpoints when re-centered on announcement time: −24, −12, −6, −3, 0,
                  +3, +6, +12, +24 hours. To measure the pre-announcement drop, you need a checkpoint that's safely
                  before the public disclosure but still captures meaningful price movement. Look for a point where the
                  line shows a clear decline from the baseline, well before the dashed announcement line.
                </Typography>
              </Box>
              <Typography
                variant='body2'
                sx={{
                  mb: 3,
                  fontStyle: 'italic',
                  color: COLORS.gunmetal,
                  p: 2,
                  backgroundColor: 'rgba(42, 47, 54, 0.5)',
                  borderRadius: 1,
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              >
                {'>'} TIP: Look at the cyan line in the period before the announcement. Find a checkpoint where the line
                shows a clear drop from the baseline — one that's well before the dashed line but captures the early
                reaction. Estimate that value relative to zero, convert to a positive percent, and round to one decimal.
                Example: if the line is around –0.085, type '8.5'.
              </Typography>
              <EventStudyChart showOnlyRightChart={true} showTargetPoint={showTargetPoint} />
            </>
          }
          questionText="Using the chart, what's the approximate price drop before the announcement (as a positive %)?"
          value={state.answers.q1}
          validationStatus={state.validationStatus.q1}
          onValueChange={(value) => handleAnswerChange('q1', value)}
          onSubmit={() => handleSubmit('q1')}
          onNext={handleNext}
          onBack={handleBack}
          successMessage="Excellent! Around 9½ percent of the total drop happened before the announcement — that's your numerator. You've now measured how much the market reacted while the news was still hidden in blockchain data."
          errorMessage={(() => {
            const answer = parseFloat(state.answers.q1);
            if (!isNaN(answer)) {
              if (answer < 9.0) {
                return 'That seems a bit low — check the point about 12 hours before the announcement (around t = -12).';
              } else if (answer > 10.0) {
                return "That's higher than expected — make sure you're looking before the announcement (negative t values) and estimating from the chart.";
              }
            }
            return 'Not quite. Remember: Find the point at t = –12 hours, estimate how far below zero the line is, convert to a positive percentage, and round to one decimal. The value should be around 9.5% (±5%).';
          })()}
        />
      );
    }
    if (state.currentStep === 4) {
      return (
        <QuestionScreen
          stepTitle='Final Step: The Price of Processing'
          hint={
            <>
              <Typography
                variant='body1'
                paragraph
                sx={{ mb: 2, fontSize: '1.1rem', lineHeight: 1.8, fontFamily: '"JetBrains Mono", monospace' }}
              >
                This is the final calculation. You have both pieces of the puzzle:
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant='body1'
                  sx={{ mb: 1, fontSize: '1.1rem', fontFamily: '"JetBrains Mono", monospace' }}
                >
                  <strong style={{ color: COLORS.magenta, textShadow: `0 0 5px ${COLORS.magenta}` }}>
                    Price Drop Before Announcement (Numerator):
                  </strong>{' '}
                  <span style={{ color: COLORS.green, textShadow: `0 0 5px ${COLORS.green}` }}>
                    {state.answers.q1}%
                  </span>
                </Typography>
                <Typography
                  variant='body1'
                  sx={{ mb: 1, fontSize: '1.1rem', fontFamily: '"JetBrains Mono", monospace' }}
                >
                  <strong style={{ color: COLORS.cyan, textShadow: `0 0 5px ${COLORS.cyan}` }}>
                    Total Price Drop (Denominator):
                  </strong>{' '}
                  <span style={{ color: COLORS.green, textShadow: `0 0 5px ${COLORS.green}` }}>
                    {state.answers.q2}%
                  </span>
                </Typography>
              </Box>
              <Typography
                variant='body1'
                paragraph
                sx={{
                  mb: 2,
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  fontWeight: 'bold',
                  fontFamily: '"JetBrains Mono", monospace',
                  color: COLORS.cyan,
                  textShadow: `0 0 5px ${COLORS.cyan}`,
                }}
              >
                {'>'} FORMULA REMINDER:
              </Typography>
              <Paper
                sx={{
                  p: 3,
                  mb: 3,
                  backgroundColor: 'rgba(26, 26, 26, 0.9)',
                  border: `2px solid ${COLORS.cyan}`,
                  color: COLORS.silver,
                  boxShadow: `0 0 20px rgba(0, 240, 255, 0.3), inset 0 0 20px rgba(0, 240, 255, 0.05)`,
                  '& .katex': {
                    color: `${COLORS.green} !important`,
                    textShadow: `0 0 10px ${COLORS.green} !important`,
                  },
                  '& .katex *': { color: `${COLORS.green} !important` },
                }}
              >
                <Box sx={{ textAlign: 'center', my: 2 }}>
                  <BlockMath
                    math={`\\text{Price of Processing } (\\%) = \\frac{|\\text{Price Drop Before Announcement}|}{|\\text{Total Price Drop}|} \\times 100`}
                  />
                </Box>
                <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${COLORS.gunmetal}`, textAlign: 'center' }}>
                  <Typography
                    variant='body2'
                    sx={{ mb: 1, color: COLORS.silver, opacity: 0.9, fontFamily: '"JetBrains Mono", monospace' }}
                  >
                    Using your values:{' '}
                    <strong style={{ color: COLORS.green, textShadow: `0 0 5px ${COLORS.green}` }}>
                      {state.answers.q1}% ÷ {state.answers.q2}% × 100
                    </strong>
                  </Typography>
                </Box>
              </Paper>
              <Typography
                variant='body2'
                sx={{
                  mt: 2,
                  fontStyle: 'italic',
                  color: COLORS.gunmetal,
                  fontSize: '1rem',
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              >
                Round your answer to the nearest whole number. This is the "Price of Processing". What is the final
                percentage?
              </Typography>
            </>
          }
          questionText='Calculate the final result:'
          value={state.answers.q3}
          validationStatus={state.validationStatus.q3}
          onValueChange={(value) => handleAnswerChange('q3', value)}
          onSubmit={() => {
            handleSubmit('q3');
            // Don't auto-advance - let user click "Next" when ready to see success screen
            // This gives users full control to read the success message and reflection
          }}
          onNext={handleNext}
          onBack={handleBack}
          successMessage="You nailed it! The Price of Processing is about 36%. That means roughly one-third of the total price drop happened before the public announcement — when only a few traders could interpret on-chain data. Transparency doesn't always mean instant understanding — information still has a cost."
          errorMessage={(() => {
            const answer = parseInt(state.answers.q3, 10);
            const numerator = parseFloat(state.answers.q1);
            const denominator = parseFloat(state.answers.q2);

            if (!isNaN(numerator) && !isNaN(denominator) && denominator > 0) {
              const expectedValue = (numerator / denominator) * 100;
              const margin = expectedValue * 0.05;
              const minValue = Math.max(0, Math.floor(expectedValue - margin));
              const maxValue = Math.ceil(expectedValue + margin);

              if (!isNaN(answer)) {
                if (answer < minValue) {
                  return `That seems too low. Re-check your division: (${numerator}% ÷ ${denominator}%) × 100. Make sure you're dividing the pre-announcement drop by the total drop.`;
                } else if (answer > maxValue) {
                  return `That seems too high. Double-check your calculation — remember to divide ${numerator}% by ${denominator}%, then multiply by 100.`;
                } else if (answer >= minValue && answer <= maxValue) {
                  return `You're in the right range! The answer should be around ${Math.round(expectedValue)}%. Re-check your division and rounding.`;
                }
              }
              return `Not quite. Double-check your calculation: (${numerator}% ÷ ${denominator}%) × 100, rounded to the nearest whole number. The result should be around ${Math.round(expectedValue)}% (±5%).`;
            }
            return 'Not quite. Double-check your calculation: (numerator ÷ denominator) × 100, rounded to the nearest whole number.';
          })()}
          placeholder='Enter your calculation here (e.g., 9 ÷ 26 × 100 = ?)'
          showReflection={true}
        />
      );
    }
    if (state.currentStep === 5) {
      return <SuccessScreen onRestart={handleRestart} />;
    }
    return null;
  };

  return (
    <Container>
      <StyledCard>
        <StyledCardContent>
          {state.currentStep > 0 && state.currentStep < 5 && (
            <StyledStepper activeStep={getActiveStep()}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label.toUpperCase()}</StepLabel>
                </Step>
              ))}
            </StyledStepper>
          )}
          {renderStepContent()}
        </StyledCardContent>
      </StyledCard>
    </Container>
  );
};

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0',
  width: '100%',
  minHeight: '100vh',
  background: `linear-gradient(135deg, ${COLORS.base} 0%, ${COLORS.charcoal} 50%, ${COLORS.base} 100%)`,
  backgroundSize: '200% 200%',
  animation: `${gradientShift} 15s ease infinite`,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 30%, rgba(0, 240, 255, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(255, 0, 230, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(157, 78, 221, 0.04) 0%, transparent 70%)
    `,
    pointerEvents: 'none',
    zIndex: 0,
  },
  '& > *': {
    position: 'relative',
    zIndex: 1,
  },
});

const StyledCard = styled(Card)({
  maxWidth: '100%',
  width: '100%',
  margin: '0 auto',
  background: 'transparent',
  boxShadow: 'none',
});

const StyledCardContent = styled(CardContent)({
  padding: '0 !important',
});

const StyledStepper = styled(Stepper)({
  marginBottom: '3rem',
  padding: '1.5rem 1rem',
  maxWidth: '1100px',
  marginLeft: 'auto',
  marginRight: 'auto',
  background: `linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(42, 47, 54, 0.6) 100%)`,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: `1px solid ${COLORS.cyan}`,
  borderRadius: '8px',
  boxShadow: `0 0 20px rgba(0, 240, 255, 0.3), inset 0 0 20px rgba(0, 240, 255, 0.05)`,
  '& .MuiStep-root': {
    flex: '1 1 0',
    minWidth: 0,
    padding: '0 0.5rem',
  },
  '& .MuiStepLabel-root': {
    width: '100%',
    '& .MuiStepLabel-label': {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '0.85rem',
      fontWeight: 600,
      color: COLORS.silver,
      letterSpacing: '0.05em',
      whiteSpace: 'normal',
      lineHeight: '1.3',
      textAlign: 'center',
      wordBreak: 'break-word',
      maxWidth: '100%',
      '&.Mui-active': {
        color: COLORS.cyan,
        textShadow: `0 0 10px ${COLORS.cyan}`,
      },
      '&.Mui-completed': {
        color: COLORS.green,
        textShadow: `0 0 10px ${COLORS.green}`,
      },
    },
  },
  '& .MuiStepIcon-root': {
    color: COLORS.gunmetal,
    fontSize: '1.8rem',
    '&.Mui-active': {
      color: COLORS.cyan,
      filter: `drop-shadow(0 0 8px ${COLORS.cyan})`,
    },
    '&.Mui-completed': {
      color: COLORS.green,
      filter: `drop-shadow(0 0 8px ${COLORS.green})`,
    },
    '& .MuiStepIcon-text': {
      fontFamily: '"JetBrains Mono", monospace',
      fontWeight: 700,
    },
  },
  '& .MuiStepConnector-root': {
    '& .MuiStepConnector-line': {
      borderColor: COLORS.gunmetal,
      borderTopWidth: '2px',
    },
  },
  '& .MuiStepConnector-active': {
    '& .MuiStepConnector-line': {
      borderColor: COLORS.cyan,
      boxShadow: `0 0 5px ${COLORS.cyan}`,
    },
  },
  '& .MuiStepConnector-completed': {
    '& .MuiStepConnector-line': {
      borderColor: COLORS.green,
      boxShadow: `0 0 5px ${COLORS.green}`,
    },
  },
});
