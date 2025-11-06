'use client';

import { Box, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

interface FormulaScreenProps {
  onNext: () => void;
  onBack: () => void;
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
  marginBottom: '1rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  '@media (max-width: 768px)': {
    fontSize: '2rem',
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

const SectionTitle = styled(Typography)({
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '1.3rem',
  fontWeight: 700,
  color: COLORS.cyan,
  marginBottom: '1.5rem',
  textShadow: `0 0 10px ${COLORS.cyan}, 0 0 20px ${COLORS.cyan}`,
  letterSpacing: '0.05em',
});

const FormulaCard = styled(Paper)({
  padding: '2.5rem',
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
  '& .katex': {
    color: `${COLORS.green} !important`,
    textShadow: `0 0 10px ${COLORS.green}, 0 0 20px ${COLORS.green}`,
  },
  '& .katex *': {
    color: `${COLORS.green} !important`,
  },
});

const TableCard = styled(TableContainer)({
  marginBottom: '2rem',
  background: `linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(42, 47, 54, 0.6) 100%)`,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: `1px solid ${COLORS.purple}`,
  borderRadius: '8px',
  boxShadow: `0 0 20px rgba(157, 78, 221, 0.3), inset 0 0 20px rgba(157, 78, 221, 0.05)`,
  '& .MuiTableCell-root': {
    fontFamily: '"JetBrains Mono", monospace',
    color: COLORS.silver,
    borderColor: COLORS.gunmetal,
  },
  '& .MuiTableCell-head': {
    fontWeight: 700,
    color: COLORS.cyan,
    textShadow: `0 0 5px ${COLORS.cyan}`,
  },
});

const AnalystNote = styled(Paper)({
  padding: '2rem',
  marginBottom: '2rem',
  background: `linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(42, 47, 54, 0.6) 100%)`,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderLeft: `4px solid ${COLORS.cyan}`,
  borderRadius: '4px',
  fontStyle: 'italic',
  boxShadow: `0 0 15px rgba(0, 240, 255, 0.2)`,
});

const TimelineBox = styled(Box)({
  margin: '2rem 0',
  padding: '2rem',
  background: `linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(42, 47, 54, 0.6) 100%)`,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: `1px solid ${COLORS.gunmetal}`,
  borderRadius: '8px',
  boxShadow: `0 0 15px rgba(0, 0, 0, 0.3)`,
});

const TimelineLabel = styled(Typography)({
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '0.9rem',
  fontWeight: 700,
  textAlign: 'center',
  color: COLORS.silver,
  marginBottom: '1.5rem',
  letterSpacing: '0.05em',
});

const TimelineText = styled(Typography)({
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '0.95rem',
  fontWeight: 600,
  color: COLORS.silver,
  letterSpacing: '0.02em',
});

const TimelineLine = styled(Box)({
  flex: 1,
  height: '2px',
  background: `linear-gradient(90deg, ${COLORS.magenta}, ${COLORS.cyan})`,
  position: 'relative',
  boxShadow: `0 0 10px ${COLORS.cyan}, 0 0 20px ${COLORS.magenta}`,
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

export const FormulaScreen = ({ onNext, onBack }: FormulaScreenProps) => {
  return (
    <Container>
      <GlitchTitle variant='h1'>{'>'} STEP 1: THE ANALYST'S FORMULA</GlitchTitle>

      <BodyText variant='body1' sx={{ fontStyle: 'italic', opacity: 0.9 }}>
        Every analyst starts with a simple question: How fast does information travel into prices?
      </BodyText>

      <BodyText variant='body1'>
        This formula tells us how much of the total market reaction happened before the news became public.
      </BodyText>

      <SectionTitle variant='h6'>{'>'} THE FORMULA</SectionTitle>

      <FormulaCard>
        <Box sx={{ textAlign: 'center', my: 2 }}>
          <BlockMath math='\text{Pre-Announcement Price Discovery } (\%) = \frac{|\text{Price Drop Before Announcement}|}{|\text{Total Price Drop}|} \times 100' />
        </Box>
      </FormulaCard>

      <SectionTitle variant='h6'>{'>'} UNDERSTANDING THE VARIABLES</SectionTitle>

      <TableCard component={Paper}>
        <Table size='small'>
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', borderRight: `1px solid ${COLORS.gunmetal}`, width: '40%' }}>
                Price Drop Before Announcement
              </TableCell>
              <TableCell>
                The early decline — what happens in the hidden window when only expert traders react.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', borderRight: `1px solid ${COLORS.gunmetal}` }}>
                Total Price Drop
              </TableCell>
              <TableCell>The full reaction, once the news spreads to everyone.</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', borderRight: `1px solid ${COLORS.gunmetal}` }}>Result</TableCell>
              <TableCell>The fraction of the total impact that happened early — the "Price of Processing."</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableCard>

      <AnalystNote>
        <Typography
          variant='body2'
          sx={{ mb: 1, fontWeight: 'bold', color: COLORS.cyan, fontFamily: '"JetBrains Mono", monospace' }}
        >
          {'>'} RESEARCH ANALYST'S NOTE:
        </Typography>
        <Typography
          variant='body2'
          sx={{ color: COLORS.silver, fontFamily: '"JetBrains Mono", monospace', lineHeight: 1.8 }}
        >
          "If markets were perfectly efficient, this ratio would be zero — prices wouldn't move until the news was
          public."
        </Typography>
      </AnalystNote>

      <TimelineBox>
        <TimelineLabel variant='body2'>{'>'} SIMPLIFIED TIMELINE</TimelineLabel>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TimelineText variant='body2' sx={{ minWidth: '200px' }}>
              On-chain Hack (t₀)
            </TimelineText>
            <TimelineLine />
            <TimelineText variant='body2' sx={{ minWidth: '200px', textAlign: 'right' }}>
              Social Media Post (t_common)
            </TimelineText>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pl: 4 }}>
            <Typography
              variant='caption'
              sx={{
                minWidth: '200px',
                color: COLORS.magenta,
                fontWeight: 'bold',
                fontFamily: '"JetBrains Mono", monospace',
                textShadow: `0 0 5px ${COLORS.magenta}`,
              }}
            >
              ↑ Pre-Announcement Drop
            </Typography>
            <Box sx={{ flex: 1 }} />
            <Typography
              variant='caption'
              sx={{
                minWidth: '200px',
                textAlign: 'right',
                color: COLORS.green,
                fontWeight: 'bold',
                fontFamily: '"JetBrains Mono", monospace',
                textShadow: `0 0 5px ${COLORS.green}`,
              }}
            >
              ↑ Total Drop
            </Typography>
          </Box>
        </Box>
        <Typography
          variant='body2'
          sx={{
            mt: 3,
            textAlign: 'center',
            color: COLORS.silver,
            fontSize: '0.9rem',
            lineHeight: 1.6,
            fontFamily: '"JetBrains Mono", monospace',
            opacity: 0.8,
          }}
        >
          The magenta section shows the hidden reaction (numerator). The full cyan line shows the total drop
          (denominator).
        </Typography>
      </TimelineBox>

      <SectionTitle variant='h6'>{'>'} NEXT STEP</SectionTitle>
      <BodyText variant='body1'>Let's open the analyst's data and start uncovering those numbers.</BodyText>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
        <BackButton variant='outlined' size='large' onClick={onBack}>
          {'<'} BACK
        </BackButton>
        <NeonButton variant='outlined' size='large' onClick={onNext}>
          {'>'} NEXT
        </NeonButton>
      </Box>
    </Container>
  );
};
