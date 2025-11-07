'use client';

import { Box, Button, Typography } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { PriceDiscoveryChart } from './PriceDiscoveryChart';

interface IntroductionScreenProps {
  onStart: () => void;
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
const pulseGlow = keyframes`
  0%, 100% {
    opacity: 1;
    filter: drop-shadow(0 0 8px ${COLORS.cyan}) drop-shadow(0 0 16px ${COLORS.cyan});
  }
  50% {
    opacity: 0.85;
    filter: drop-shadow(0 0 12px ${COLORS.cyan}) drop-shadow(0 0 24px ${COLORS.cyan}) drop-shadow(0 0 32px ${COLORS.cyan});
  }
`;

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

const glitch = keyframes`
  0%, 100% {
    text-shadow: 
      2px 0 ${COLORS.cyan},
      -2px 0 ${COLORS.magenta};
    transform: translate(0);
  }
  20% {
    text-shadow: 
      -2px 0 ${COLORS.cyan},
      2px 0 ${COLORS.magenta};
    transform: translate(2px, -2px);
  }
  40% {
    text-shadow: 
      2px 0 ${COLORS.magenta},
      -2px 0 ${COLORS.cyan};
    transform: translate(-2px, 2px);
  }
  60% {
    text-shadow: 
      -2px 0 ${COLORS.cyan},
      2px 0 ${COLORS.magenta};
    transform: translate(2px, 2px);
  }
  80% {
    text-shadow: 
      2px 0 ${COLORS.magenta},
      -2px 0 ${COLORS.cyan};
    transform: translate(-2px, -2px);
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

const gradientShift = keyframes`
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
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
  fontSize: '3.5rem',
  background: `linear-gradient(135deg, ${COLORS.cyan} 0%, ${COLORS.magenta} 50%, ${COLORS.purple} 100%)`,
  backgroundSize: '200% 200%',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  animation: `${glitch} 0.3s infinite, ${gradientShift} 3s ease infinite`,
  textShadow: `0 0 20px rgba(0, 240, 255, 0.5)`,
  marginBottom: '1rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  '@media (max-width: 768px)': {
    fontSize: '2.5rem',
  },
});

const Subtitle = styled(Typography)({
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '1.2rem',
  color: COLORS.silver,
  fontStyle: 'italic',
  marginBottom: '3rem',
  textShadow: `0 0 10px rgba(204, 204, 204, 0.3)`,
  letterSpacing: '0.05em',
  opacity: 0.9,
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

const HighlightText = styled(Typography)({
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '1.1rem',
  lineHeight: 1.9,
  fontWeight: 700,
  color: COLORS.magenta,
  marginBottom: '2rem',
  textShadow: `
    0 0 10px ${COLORS.magenta},
    0 0 20px ${COLORS.magenta},
    0 0 30px ${COLORS.magenta}
  `,
  letterSpacing: '0.02em',
});

const MissionCard = styled(Box)({
  margin: '3rem 0',
  padding: '2.5rem',
  background: `linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(42, 47, 54, 0.6) 100%)`,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: `1px solid ${COLORS.cyan}`,
  borderRadius: '8px',
  boxShadow: `
    0 0 20px rgba(0, 240, 255, 0.3),
    inset 0 0 20px rgba(0, 240, 255, 0.05),
    0 0 40px rgba(0, 240, 255, 0.1)
  `,
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
  '&:hover': {
    boxShadow: `
      0 0 30px rgba(0, 240, 255, 0.5),
      inset 0 0 30px rgba(0, 240, 255, 0.1),
      0 0 60px rgba(0, 240, 255, 0.2)
    `,
    borderColor: COLORS.cyan,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
});

const MissionTitle = styled(Typography)({
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '1.5rem',
  fontWeight: 700,
  color: COLORS.cyan,
  marginBottom: '1.5rem',
  textShadow: `
    0 0 10px ${COLORS.cyan},
    0 0 20px ${COLORS.cyan}
  `,
  letterSpacing: '0.05em',
});

const MissionBody = styled(Typography)({
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '1.1rem',
  lineHeight: 1.9,
  color: COLORS.silver,
  marginBottom: '1.5rem',
  letterSpacing: '0.02em',
});

const MissionSubtext = styled(Typography)({
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '0.95rem',
  fontStyle: 'italic',
  color: COLORS.silver,
  opacity: 0.7,
  letterSpacing: '0.02em',
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
  border: `2px solid ${COLORS.cyan}`,
  color: COLORS.cyan,
  borderRadius: '4px',
  position: 'relative',
  overflow: 'hidden',
  textShadow: `0 0 10px ${COLORS.cyan}`,
  boxShadow: `
    0 0 20px rgba(0, 240, 255, 0.3),
    inset 0 0 20px rgba(0, 240, 255, 0.05)
  `,
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
    boxShadow: `
      0 0 30px rgba(0, 240, 255, 0.5),
      inset 0 0 30px rgba(157, 78, 221, 0.1),
      0 0 60px rgba(157, 78, 221, 0.3)
    `,
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

const ChartContainer = styled(Box)({
  margin: '3rem 0',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-10px',
    left: '-10px',
    right: '-10px',
    bottom: '-10px',
    background: `linear-gradient(135deg, ${COLORS.cyan}, ${COLORS.purple}, ${COLORS.magenta})`,
    borderRadius: '12px',
    opacity: 0.3,
    filter: 'blur(20px)',
    zIndex: -1,
    animation: `${pulseGlow} 3s ease-in-out infinite`,
  },
});

export const IntroductionScreen = ({ onStart }: IntroductionScreenProps) => {
  return (
    <Container>
      <GlitchTitle variant='h1'>THE PRICE OF PROCESSING</GlitchTitle>

      <Subtitle variant='h6'>{'>'} When data is public, but not yet understood.</Subtitle>

      <BodyText variant='body1'>In financial markets, speed and understanding are everything.</BodyText>

      <BodyText variant='body1'>
        On a public blockchain, every transaction, even a hack, becomes visible the instant it happens. But visibility
        isn't the same as comprehension, there is a skill issue in the middle.
      </BodyText>

      <HighlightText variant='body1'>
        {'>'} Hidden within millions of transactions, a few lines of code can drain millions of dollars before anyone
        realizes what happened.
      </HighlightText>

      <BodyText variant='body1'>
        When some asshole pulls off a hack, the team usually throws up an announcement on social media. But that thing
        ain't instant, while they're fumbling around, the price has already tanked. It's only the sharp eyed players who
        caught the early signals who managed to bail out their sorry asses in time.
      </BodyText>

      <MissionCard>
        <MissionTitle variant='h6'>{'>'} MISSION: MEASURE THE INVISIBLE MARKET REACTION</MissionTitle>
        <MissionBody variant='body1'>
          How much of the total price drop happened before the public announcement?
        </MissionBody>
        <MissionSubtext variant='body2'>
          {'>'} You'll dig into real data, charts and tables from actual research, to uncover the number.
        </MissionSubtext>
      </MissionCard>

      <ChartContainer>
        <PriceDiscoveryChart showIncognita={true} />
      </ChartContainer>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <NeonButton variant='outlined' size='large' onClick={onStart}>
          {'>'} START CHALLENGE
        </NeonButton>
      </Box>
    </Container>
  );
};
