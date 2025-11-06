'use client';

import { styled } from '@mui/material/styles';
import { QuizzContainer } from '~/components/quizz';
import { SURROUND_HEIGHT, DISCLAIMER_HEIGHT } from '~/utils';

export const Landing = () => {
  return (
    <LandingContainer>
      <QuizzContainer />
    </LandingContainer>
  );
};

const LandingContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  minHeight: `calc(100vh - ${SURROUND_HEIGHT}rem - ${DISCLAIMER_HEIGHT}rem)`,
});
