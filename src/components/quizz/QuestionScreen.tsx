'use client';

import * as React from 'react';
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

interface QuestionScreenProps {
  stepTitle: string;
  hint: React.ReactNode;
  questionText: string;
  value: string;
  validationStatus: 'pending' | 'correct' | 'incorrect';
  onValueChange: (value: string) => void;
  onSubmit: () => void;
  onNext: () => void;
  onBack: () => void;
  successMessage: string;
  errorMessage: string;
  instructions?: string;
  placeholder?: string;
  showReflection?: boolean;
}

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
const scanline = keyframes`
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(100%);
    opacity: 0;
  }
`;

const gradientShift = keyframes`
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
`;

const neonRipple = keyframes`
  0% {
    box-shadow: 
      0 0 0 0 ${COLORS.cyan},
      0 0 0 0 ${COLORS.cyan},
      inset 0 0 0 0 ${COLORS.cyan};
  }
  100% {
    box-shadow: 
      0 0 0 4px transparent,
      0 0 0 8px transparent,
      inset 0 0 20px 2px ${COLORS.cyan};
  }
`;

const Container = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '1000px',
  margin: '0 auto',
  padding: '3rem 2rem',
  position: 'relative',
  background: `linear-gradient(135deg, ${COLORS.base} 0%, ${COLORS.charcoal} 50%, ${COLORS.base} 100%)`,
  backgroundSize: '200% 200%',
  animation: `${gradientShift} 15s ease infinite`,
  minHeight: '100vh',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 30%, rgba(0, 240, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(255, 0, 230, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(157, 78, 221, 0.05) 0%, transparent 70%)
    `,
    pointerEvents: 'none',
    zIndex: 0,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: `linear-gradient(90deg, transparent, ${COLORS.cyan}, transparent)`,
    animation: `${scanline} 3s linear infinite`,
    pointerEvents: 'none',
    zIndex: 1,
  },
  '& > *': {
    position: 'relative',
    zIndex: 2,
  },
});

const GlitchTitle = styled(Typography)({
  fontFamily: '"JetBrains Mono", "Space Grotesk", monospace',
  fontWeight: 900,
  fontSize: '2.5rem',
  background: `linear-gradient(135deg, ${COLORS.cyan} 0%, ${COLORS.magenta} 50%, ${COLORS.purple} 100%)`,
  backgroundSize: '200% 200%',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  animation: `${gradientShift} 3s ease infinite`,
  textShadow: `0 0 20px rgba(0, 240, 255, 0.5)`,
  marginBottom: '2rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  '@media (max-width: 768px)': {
    fontSize: '2rem',
  },
});

const HintBox = styled(Paper)({
  padding: '2rem',
  marginBottom: '2rem',
  background: `linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(42, 47, 54, 0.7) 100%)`,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: `1px solid ${COLORS.cyan}`,
  borderRadius: '8px',
  boxShadow: `0 0 20px rgba(0, 240, 255, 0.3), inset 0 0 20px rgba(0, 240, 255, 0.05), 0 0 40px rgba(0, 240, 255, 0.1)`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: `linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.1), transparent)`,
    animation: `${scanline} 4s linear infinite`,
  },
  '& *': {
    color: `${COLORS.silver} !important`,
    fontFamily: '"JetBrains Mono", monospace',
  },
  '& .MuiTypography-root': {
    color: `${COLORS.silver} !important`,
  },
});

const QuestionLabel = styled(Typography)({
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '1.3rem',
  fontWeight: 700,
  color: COLORS.green,
  marginBottom: '1rem',
  marginTop: '2rem',
  textShadow: `0 0 10px ${COLORS.green}, 0 0 20px ${COLORS.green}`,
  letterSpacing: '0.05em',
});

const QuestionText = styled(Typography)({
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '1.1rem',
  lineHeight: 1.9,
  color: COLORS.silver,
  marginBottom: '2rem',
  textShadow: `0 0 5px rgba(204, 204, 204, 0.2)`,
  letterSpacing: '0.02em',
});

const InstructionBox = styled(Box)({
  marginBottom: '1.5rem',
  padding: '1.5rem',
  background: `linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(42, 47, 54, 0.6) 100%)`,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderRadius: '8px',
  borderLeft: `3px solid ${COLORS.cyan}`,
  boxShadow: `0 0 15px rgba(0, 240, 255, 0.2)`,
});

const ExampleBox = styled(Box)({
  marginBottom: '1.5rem',
  padding: '1.5rem',
  background: `linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(42, 47, 54, 0.6) 100%)`,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderRadius: '8px',
  borderLeft: `3px solid ${COLORS.green}`,
  boxShadow: `0 0 15px rgba(57, 255, 20, 0.2)`,
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    fontFamily: '"JetBrains Mono", monospace',
    color: COLORS.silver,
    backgroundColor: `rgba(26, 26, 26, 0.8)`,
    border: `1px solid ${COLORS.gunmetal}`,
    borderRadius: '4px',
    '& fieldset': {
      borderColor: COLORS.gunmetal,
    },
    '&:hover fieldset': {
      borderColor: COLORS.cyan,
      boxShadow: `0 0 10px rgba(0, 240, 255, 0.3)`,
    },
    '&.Mui-focused fieldset': {
      borderColor: COLORS.cyan,
      boxShadow: `0 0 15px rgba(0, 240, 255, 0.5)`,
    },
    '&.Mui-error fieldset': {
      borderColor: COLORS.magenta,
      boxShadow: `0 0 15px rgba(255, 0, 230, 0.5)`,
    },
  },
  '& .MuiInputLabel-root': {
    fontFamily: '"JetBrains Mono", monospace',
    color: COLORS.silver,
    '&.Mui-focused': {
      color: COLORS.cyan,
    },
  },
  '& .MuiInputBase-input': {
    fontFamily: '"JetBrains Mono", monospace',
    color: COLORS.silver,
    '&::placeholder': {
      color: COLORS.gunmetal,
      opacity: 0.7,
    },
  },
});

const NeonButton = styled(Button)({
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '1rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  padding: '1rem 2.5rem',
  minWidth: '150px',
  background: 'transparent',
  border: `2px solid ${COLORS.cyan}`,
  color: COLORS.cyan,
  borderRadius: '4px',
  position: 'relative',
  overflow: 'hidden',
  textShadow: `0 0 10px ${COLORS.cyan}`,
  boxShadow: `0 0 20px rgba(0, 240, 255, 0.3), inset 0 0 20px rgba(0, 240, 255, 0.05)`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: `linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.2), transparent)`,
    transition: 'left 0.5s',
  },
  '&:hover': {
    background: `linear-gradient(135deg, rgba(0, 240, 255, 0.1), rgba(157, 78, 221, 0.1))`,
    borderColor: COLORS.purple,
    color: COLORS.purple,
    textShadow: `0 0 15px ${COLORS.purple}`,
    boxShadow: `0 0 30px rgba(0, 240, 255, 0.5), inset 0 0 30px rgba(157, 78, 221, 0.1), 0 0 60px rgba(157, 78, 221, 0.3)`,
    transform: 'translateY(-2px)',
    '&::before': {
      left: '100%',
    },
  },
  '&:active': {
    animation: `${neonRipple} 0.4s ease-out`,
    transform: 'translateY(0)',
  },
  '&:disabled': {
    borderColor: COLORS.gunmetal,
    color: COLORS.gunmetal,
    textShadow: 'none',
    boxShadow: 'none',
    opacity: 0.5,
  },
});

const SubmitButton = styled(NeonButton)({
  borderColor: COLORS.green,
  color: COLORS.green,
  textShadow: `0 0 10px ${COLORS.green}`,
  boxShadow: `0 0 20px rgba(57, 255, 20, 0.3), inset 0 0 20px rgba(57, 255, 20, 0.05)`,
  whiteSpace: 'nowrap',
  '&:hover': {
    borderColor: COLORS.green,
    color: COLORS.green,
    background: `rgba(57, 255, 20, 0.1)`,
    boxShadow: `0 0 30px rgba(57, 255, 20, 0.5), inset 0 0 30px rgba(57, 255, 20, 0.1)`,
  },
});

const BackButton = styled(NeonButton)({
  borderColor: COLORS.gunmetal,
  color: COLORS.silver,
  textShadow: `0 0 5px ${COLORS.silver}`,
  boxShadow: `0 0 10px rgba(204, 204, 204, 0.2)`,
  '&:hover': {
    borderColor: COLORS.silver,
    color: COLORS.silver,
    background: `rgba(204, 204, 204, 0.1)`,
    boxShadow: `0 0 20px rgba(204, 204, 204, 0.4)`,
  },
});

const StyledAlert = styled(Alert)({
  fontFamily: '"JetBrains Mono", monospace',
  marginBottom: '1.5rem',
  borderRadius: '8px',
  '&.MuiAlert-standardSuccess': {
    backgroundColor: `rgba(57, 255, 20, 0.1)`,
    border: `1px solid ${COLORS.green}`,
    color: COLORS.green,
    boxShadow: `0 0 20px rgba(57, 255, 20, 0.3)`,
    '& .MuiAlert-icon': {
      color: COLORS.green,
    },
  },
  '&.MuiAlert-standardError': {
    backgroundColor: `rgba(255, 0, 230, 0.1)`,
    border: `1px solid ${COLORS.magenta}`,
    color: COLORS.magenta,
    boxShadow: `0 0 20px rgba(255, 0, 230, 0.3)`,
    '& .MuiAlert-icon': {
      color: COLORS.magenta,
    },
  },
});

const ReflectionBox = styled(Box)({
  marginTop: '1.5rem',
  padding: '2rem',
  background: `linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(42, 47, 54, 0.6) 100%)`,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderRadius: '8px',
  borderLeft: `4px solid ${COLORS.cyan}`,
  boxShadow: `0 0 20px rgba(0, 240, 255, 0.3)`,
});

export const QuestionScreen = ({
  stepTitle,
  hint,
  questionText,
  value,
  validationStatus,
  onValueChange,
  onSubmit,
  onNext,
  onBack,
  successMessage,
  errorMessage,
  instructions,
  placeholder,
  showReflection,
}: QuestionScreenProps) => {
  return (
    <Container>
      <GlitchTitle variant='h1'>
        {'>'} {stepTitle.toUpperCase()}
      </GlitchTitle>

      <HintBox>{hint}</HintBox>

      <QuestionLabel variant='h6'>{'>'} QUESTION:</QuestionLabel>

      <QuestionText variant='body1'>{questionText}</QuestionText>

      {instructions && !instructions.startsWith('Example:') && (
        <InstructionBox>
          <Typography
            variant='body2'
            sx={{ fontWeight: 'bold', mb: 1, color: COLORS.cyan, fontFamily: '"JetBrains Mono", monospace' }}
          >
            {'>'} INSTRUCTIONS:
          </Typography>
          <Typography
            variant='body2'
            sx={{ color: COLORS.silver, lineHeight: 1.6, fontFamily: '"JetBrains Mono", monospace' }}
          >
            {instructions}
          </Typography>
        </InstructionBox>
      )}

      <Typography
        variant='body2'
        paragraph
        sx={{ mb: 2, color: COLORS.cyan, fontFamily: '"JetBrains Mono", monospace' }}
      >
        Enter your answer with one decimal place.
      </Typography>

      {instructions && instructions.includes('Example:') && (
        <ExampleBox>
          <Typography
            variant='body2'
            sx={{ fontWeight: 'bold', mb: 1, color: COLORS.green, fontFamily: '"JetBrains Mono", monospace' }}
          >
            {'>'} EXAMPLE:
          </Typography>
          <Typography
            variant='body2'
            sx={{ color: COLORS.silver, lineHeight: 1.6, fontFamily: '"JetBrains Mono", monospace' }}
          >
            {instructions.replace(/^Example:\s*/i, '')}
          </Typography>
        </ExampleBox>
      )}

      {validationStatus === 'incorrect' && errorMessage && <StyledAlert severity='error'>{errorMessage}</StyledAlert>}

      {validationStatus === 'correct' && successMessage && (
        <>
          <StyledAlert severity='success'>{successMessage}</StyledAlert>
          {showReflection && (
            <ReflectionBox>
              <Typography
                variant='body1'
                sx={{ fontWeight: 'bold', mb: 1, color: COLORS.cyan, fontFamily: '"JetBrains Mono", monospace' }}
              >
                {'>'} REFLECTION:
              </Typography>
              <Typography
                variant='body2'
                sx={{ lineHeight: 1.7, color: COLORS.silver, fontFamily: '"JetBrains Mono", monospace' }}
              >
                In financial markets, speed isn't just about access to data — it's about the ability to process it.
              </Typography>
            </ReflectionBox>
          )}
        </>
      )}

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 3 }}>
        <StyledTextField
          label='Answer'
          type='number'
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onValueChange(e.target.value)}
          variant='outlined'
          fullWidth
          placeholder={placeholder}
          inputProps={{ step: '0.1' }}
          error={validationStatus === 'incorrect'}
          disabled={validationStatus === 'correct'}
        />
        <SubmitButton
          variant='outlined'
          size='large'
          onClick={onSubmit}
          sx={{ minWidth: '150px', height: '56px' }}
          disabled={validationStatus === 'correct'}
        >
          {'>'}SUBMIT
        </SubmitButton>
      </Box>

      {validationStatus === 'correct' && (
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
          <BackButton variant='outlined' size='large' onClick={onBack}>
            {'<'} BACK
          </BackButton>
          <NeonButton variant='outlined' size='large' onClick={onNext}>
            {'>'} NEXT
          </NeonButton>
        </Box>
      )}

      {validationStatus !== 'correct' && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
          <BackButton variant='outlined' size='medium' onClick={onBack}>
            {'<'} BACK
          </BackButton>
        </Box>
      )}
    </Container>
  );
};
