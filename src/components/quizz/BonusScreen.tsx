'use client';

import { useState } from 'react';
import { Box, Button, Typography, Paper, Checkbox, FormControlLabel, FormGroup, Alert } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

interface BonusScreenProps {
  onNext: () => void;
  onBack: () => void;
  onValidate: (isCorrect: boolean) => void;
  validationStatus: 'pending' | 'correct' | 'incorrect';
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
  padding: '0.5rem 2rem',
  position: 'relative',
  background: `linear-gradient(135deg, ${COLORS.base} 0%, ${COLORS.charcoal} 50%, ${COLORS.base} 100%)`,
  backgroundSize: '200% 200%',
  animation: `${gradientShift} 15s ease infinite`,
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
  fontSize: '2rem',
  background: `linear-gradient(135deg, ${COLORS.cyan} 0%, ${COLORS.magenta} 50%, ${COLORS.purple} 100%)`,
  backgroundSize: '200% 200%',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  animation: `${gradientShift} 3s ease infinite`,
  textShadow: `0 0 20px rgba(0, 240, 255, 0.5)`,
  marginBottom: '0.25rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  '@media (max-width: 768px)': {
    fontSize: '2rem',
  },
});

const BodyText = styled(Typography)({
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '1rem',
  lineHeight: 1.4,
  color: COLORS.silver,
  marginBottom: '0.5rem',
  textShadow: `0 0 5px rgba(204, 204, 204, 0.2)`,
  letterSpacing: '0.02em',
});

const SectionTitle = styled(Typography)({
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '1.1rem',
  fontWeight: 700,
  color: COLORS.cyan,
  marginBottom: '0.5rem',
  textShadow: `0 0 10px ${COLORS.cyan}, 0 0 20px ${COLORS.cyan}`,
  letterSpacing: '0.05em',
});

const QuestionCard = styled(Paper)({
  padding: '1rem',
  marginBottom: '0.75rem',
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
});

const CategoryBox = styled(Box)({
  marginBottom: '0.5rem',
  padding: '0.75rem',
  background: `linear-gradient(135deg, rgba(26, 26, 26, 0.6) 0%, rgba(42, 47, 54, 0.4) 100%)`,
  border: `1px solid ${COLORS.gunmetal}`,
  borderRadius: '8px',
  boxShadow: `0 0 10px rgba(0, 0, 0, 0.3)`,
});

const CategoryTitle = styled(Typography)({
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '1rem',
  fontWeight: 700,
  color: COLORS.purple,
  marginBottom: '0.5rem',
  textShadow: `0 0 10px ${COLORS.purple}`,
  letterSpacing: '0.05em',
});

const StyledFormGroup = styled(FormGroup)({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
});

const StyledFormControlLabel = styled(FormControlLabel)({
  margin: 0,
  '& .MuiFormControlLabel-label': {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '0.9rem',
    color: COLORS.silver,
    letterSpacing: '0.02em',
    lineHeight: 1.3,
  },
  '& .MuiCheckbox-root': {
    color: COLORS.gunmetal,
    '&.Mui-checked': {
      color: COLORS.green,
    },
    '&:hover': {
      backgroundColor: `rgba(57, 255, 20, 0.1)`,
    },
  },
  '&:hover': {
    '& .MuiFormControlLabel-label': {
      color: COLORS.green,
      textShadow: `0 0 5px ${COLORS.green}`,
    },
  },
});

const NeonButton = styled(Button)({
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '0.9rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  padding: '0.75rem 2rem',
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

const SuccessAlert = styled(Alert)({
  fontFamily: '"JetBrains Mono", monospace',
  backgroundColor: `rgba(57, 255, 20, 0.1)`,
  border: `1px solid ${COLORS.green}`,
  color: COLORS.green,
  boxShadow: `0 0 20px rgba(57, 255, 20, 0.3)`,
  '& .MuiAlert-icon': {
    color: COLORS.green,
  },
});

const ErrorAlert = styled(Alert)({
  fontFamily: '"JetBrains Mono", monospace',
  backgroundColor: `rgba(255, 0, 230, 0.1)`,
  border: `1px solid ${COLORS.magenta}`,
  color: COLORS.magenta,
  boxShadow: `0 0 20px rgba(255, 0, 230, 0.3)`,
  '& .MuiAlert-icon': {
    color: COLORS.magenta,
  },
});

// All winners organized by category
const winners = {
  directFinancialGainers: [
    'Algorithmic Trading Firms / Hedge Funds',
    'Sophisticated Individual Traders ("Whales")',
    'MEV Searchers/Builders',
    'Protocol Insiders',
  ],
  arbitrageFacilitators: ['Blockchain Validators/Proposers', 'Liquidity Aggregator Bots'],
  dataProviders: [
    'Low-Latency Data Providers (RPC Nodes/APIs)',
    'On-Chain Security and Analytics Firms',
    'Trading or Bot Development Platforms',
  ],
  lossMitigators: [
    'Lenders/Creditors (in DeFi Protocols)',
    'Users of Lending Protocols (Position Closers)',
    'Liquidity Providers (LPs) in DEX Pools',
  ],
};

// Flatten all winners into a single array with IDs
const allWinners = [
  ...winners.directFinancialGainers.map((w) => ({ id: `direct-${w}`, label: w })),
  ...winners.arbitrageFacilitators.map((w) => ({ id: `arbitrage-${w}`, label: w })),
  ...winners.dataProviders.map((w) => ({ id: `data-${w}`, label: w })),
  ...winners.lossMitigators.map((w) => ({ id: `loss-${w}`, label: w })),
];

export const BonusScreen = ({ onNext, onBack, onValidate, validationStatus }: BonusScreenProps) => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const handleCheckboxChange = (id: string) => {
    const newChecked = {
      ...checked,
      [id]: !checked[id],
    };
    setChecked(newChecked);

    // Check if all are checked
    const allChecked = allWinners.every((winner) => newChecked[winner.id] === true);
    // Only validate if all are checked, otherwise reset to pending
    if (allChecked) {
      onValidate(true);
    } else if (validationStatus === 'correct') {
      // If user unchecks after being correct, reset validation
      onValidate(false);
    }
  };

  const handleSubmit = () => {
    const allChecked = allWinners.every((winner) => checked[winner.id] === true);
    onValidate(allChecked);
  };

  return (
    <Container>
      <GlitchTitle variant='h1'>{'>'} WHO GAINS IN THIS ?</GlitchTitle>

      <BodyText variant='body1' sx={{ fontStyle: 'italic', opacity: 0.9 }}>
        An extra question to test your understanding of who benefits from on-chain inefficiencies.
      </BodyText>

      <SectionTitle variant='h6'>{'>'} THE QUESTION</SectionTitle>

      <QuestionCard>
        <Typography
          variant='h5'
          sx={{
            fontFamily: '"JetBrains Mono", monospace',
            fontWeight: 700,
            color: COLORS.cyan,
            marginBottom: '0.75rem',
            fontSize: '1.2rem',
            textShadow: `0 0 10px ${COLORS.cyan}`,
            letterSpacing: '0.05em',
            lineHeight: 1.3,
          }}
        >
          Who wins from a hacks's onchain inefficiency?
        </Typography>

        <CategoryBox>
          <CategoryTitle>I. Direct Financial Gainers</CategoryTitle>
          <StyledFormGroup>
            {winners.directFinancialGainers.map((winner) => {
              const id = `direct-${winner}`;
              return (
                <StyledFormControlLabel
                  key={id}
                  control={<Checkbox checked={checked[id] || false} onChange={() => handleCheckboxChange(id)} />}
                  label={winner}
                />
              );
            })}
          </StyledFormGroup>
        </CategoryBox>

        <CategoryBox>
          <CategoryTitle>II. Arbitrage and Liquidation Facilitators</CategoryTitle>
          <StyledFormGroup>
            {winners.arbitrageFacilitators.map((winner) => {
              const id = `arbitrage-${winner}`;
              return (
                <StyledFormControlLabel
                  key={id}
                  control={<Checkbox checked={checked[id] || false} onChange={() => handleCheckboxChange(id)} />}
                  label={winner}
                />
              );
            })}
          </StyledFormGroup>
        </CategoryBox>

        <CategoryBox>
          <CategoryTitle>III. Data and Tool Providers</CategoryTitle>
          <StyledFormGroup>
            {winners.dataProviders.map((winner) => {
              const id = `data-${winner}`;
              return (
                <StyledFormControlLabel
                  key={id}
                  control={<Checkbox checked={checked[id] || false} onChange={() => handleCheckboxChange(id)} />}
                  label={winner}
                />
              );
            })}
          </StyledFormGroup>
        </CategoryBox>

        <CategoryBox>
          <CategoryTitle>IV. Loss Mitigators</CategoryTitle>
          <StyledFormGroup>
            {winners.lossMitigators.map((winner) => {
              const id = `loss-${winner}`;
              return (
                <StyledFormControlLabel
                  key={id}
                  control={<Checkbox checked={checked[id] || false} onChange={() => handleCheckboxChange(id)} />}
                  label={winner}
                />
              );
            })}
          </StyledFormGroup>
        </CategoryBox>

        {validationStatus === 'correct' && (
          <SuccessAlert severity='success' sx={{ mt: 0.5, py: 0.5 }}>
            Skill issue ? Thanks for playing
          </SuccessAlert>
        )}

        {validationStatus === 'incorrect' && (
          <ErrorAlert severity='error' sx={{ mt: 0.5, py: 0.5 }}>
            Not quite, all are correct 🚬
          </ErrorAlert>
        )}
      </QuestionCard>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 1 }}>
        <BackButton variant='outlined' size='large' onClick={onBack}>
          {'<'} BACK
        </BackButton>
        <NeonButton variant='outlined' size='large' onClick={handleSubmit}>
          {'>'} SUBMIT
        </NeonButton>
        {validationStatus === 'correct' && (
          <NeonButton variant='outlined' size='large' onClick={onNext}>
            {'>'} NEXT
          </NeonButton>
        )}
      </Box>
    </Container>
  );
};
