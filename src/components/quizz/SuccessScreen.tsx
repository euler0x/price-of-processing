'use client';

import { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import Confetti from 'react-confetti';

interface SuccessScreenProps {
  onRestart: () => void;
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

const pulseGlow = keyframes`
  0%, 100% {
    opacity: 1;
    filter: drop-shadow(0 0 20px ${COLORS.green}) drop-shadow(0 0 40px ${COLORS.green});
  }
  50% {
    opacity: 0.85;
    filter: drop-shadow(0 0 30px ${COLORS.green}) drop-shadow(0 0 60px ${COLORS.green}) drop-shadow(0 0 80px ${COLORS.green});
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
  textAlign: 'center',
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
      radial-gradient(circle at 50% 50%, rgba(57, 255, 20, 0.1) 0%, transparent 50%)
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
    background: `linear-gradient(90deg, transparent, ${COLORS.green}, transparent)`,
    animation: `${scanline} 3s linear infinite`,
    pointerEvents: 'none',
    zIndex: 1,
  },
  '& > *': {
    position: 'relative',
    zIndex: 2,
  },
});

const SuccessTitle = styled(Typography)({
  fontFamily: '"JetBrains Mono", "Space Grotesk", monospace',
  fontWeight: 900,
  fontSize: '3.5rem',
  background: `linear-gradient(135deg, ${COLORS.green} 0%, ${COLORS.cyan} 50%, ${COLORS.purple} 100%)`,
  backgroundSize: '200% 200%',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  animation: `${pulseGlow} 2s ease-in-out infinite, ${gradientShift} 3s ease infinite`,
  textShadow: `0 0 30px rgba(57, 255, 20, 0.8)`,
  marginBottom: '2rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  '@media (max-width: 768px)': {
    fontSize: '2.5rem',
  },
});

const HighlightText = styled(Typography)({
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '1.8rem',
  lineHeight: 1.9,
  color: COLORS.silver,
  marginBottom: '2rem',
  textShadow: `0 0 10px rgba(204, 204, 204, 0.3)`,
  letterSpacing: '0.02em',
  '& strong': {
    color: COLORS.green,
    textShadow: `0 0 15px ${COLORS.green}, 0 0 30px ${COLORS.green}`,
    fontSize: '2.2rem',
    fontWeight: 900,
  },
});

const BodyText = styled(Typography)({
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '1.1rem',
  lineHeight: 1.9,
  color: COLORS.silver,
  marginBottom: '2rem',
  textShadow: `0 0 5px rgba(204, 204, 204, 0.2)`,
  letterSpacing: '0.02em',
});

const CongratsTitle = styled(Typography)({
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '2rem',
  fontWeight: 700,
  marginTop: '3rem',
  marginBottom: '2rem',
  background: `linear-gradient(135deg, ${COLORS.cyan} 0%, ${COLORS.purple} 100%)`,
  backgroundSize: '200% 200%',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  animation: `${gradientShift} 3s ease infinite`,
  textShadow: `0 0 20px rgba(0, 240, 255, 0.5)`,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
});

const NeonButton = styled(Button)({
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '1.1rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  padding: '1rem 3rem',
  minWidth: '250px',
  background: 'transparent',
  border: `2px solid ${COLORS.green}`,
  color: COLORS.green,
  borderRadius: '4px',
  position: 'relative',
  overflow: 'hidden',
  textShadow: `0 0 15px ${COLORS.green}`,
  boxShadow: `0 0 30px rgba(57, 255, 20, 0.4), inset 0 0 30px rgba(57, 255, 20, 0.1)`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  animation: `${pulseGlow} 3s ease-in-out infinite`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: `linear-gradient(90deg, transparent, rgba(57, 255, 20, 0.3), transparent)`,
    transition: 'left 0.5s',
  },
  '&:hover': {
    background: `linear-gradient(135deg, rgba(57, 255, 20, 0.15), rgba(0, 240, 255, 0.15))`,
    borderColor: COLORS.cyan,
    color: COLORS.cyan,
    textShadow: `0 0 20px ${COLORS.cyan}`,
    boxShadow: `0 0 40px rgba(57, 255, 20, 0.6), inset 0 0 40px rgba(0, 240, 255, 0.15), 0 0 80px rgba(0, 240, 255, 0.4)`,
    transform: 'translateY(-2px)',
    '&::before': {
      left: '100%',
    },
  },
  '&:active': {
    animation: `${neonRipple} 0.4s ease-out`,
    transform: 'translateY(0)',
  },
});

export const SuccessScreen = ({ onRestart }: SuccessScreenProps) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showConfetti && dimensions.width > 0 && dimensions.height > 0 && (
        <Confetti width={dimensions.width} height={dimensions.height} recycle={false} />
      )}
      <Container>
        <SuccessTitle variant='h1'>36. THAT'S THE NUMBER. YOU GOT IT.</SuccessTitle>

        <HighlightText variant='h5'>
          An incredible <strong>36%</strong> of the price discovery happens in the shadows, between the onchain
          transaction and the social media alert.
        </HighlightText>

        <BodyText variant='body1'>
          You have successfully verified the study's central finding. It demonstrates that even in a transparent system
          like a blockchain, there is a significant cost and skill required to process raw information. Those who can
          pay this price in expertise and monitoring tools, gain a crucial head start.
        </BodyText>

        <CongratsTitle variant='h4'>{'>'} CONGRATULATIONS ON COMPLETING THE ANALYSIS</CongratsTitle>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <NeonButton variant='outlined' size='large' onClick={onRestart}>
            {'>'} RESTART QUIZZ
          </NeonButton>
        </Box>
      </Container>
    </>
  );
};
