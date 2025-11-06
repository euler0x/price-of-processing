'use client';

import * as React from 'react';
import { Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

interface PriceDiscoveryChartProps {
  /** If provided, show this %; if omitted, show "?" */
  percent?: number;
  /** Label shown above the % text (keep it short) */
  percentLabel?: string;
  /** Legacy prop for backward compatibility - if true, shows "?" */
  showIncognita?: boolean;
}

const ChartContainer = styled(Paper)(() => ({
  padding: '24px',
  borderRadius: 16,
  background: 'linear-gradient(135deg, #0b0c10 0%, #1a1a1a 50%, #0b0c10 100%)',
  border: '1px solid #00f0ff',
  boxShadow: '0 0 20px rgba(0, 240, 255, 0.3), inset 0 0 20px rgba(0, 240, 255, 0.05), 0 0 40px rgba(0, 240, 255, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      'radial-gradient(circle at 30% 40%, rgba(0, 240, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(255, 0, 230, 0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  '& > *': {
    position: 'relative',
    zIndex: 1,
  },
}));

const ChartSVG = styled('svg')({
  width: '100%',
  height: 520, // Increased to accommodate larger text
  overflow: 'visible',
  display: 'block',
});

export const PriceDiscoveryChart: React.FC<PriceDiscoveryChartProps> = ({
  percent,
  percentLabel = 'Price Discovery',
  showIncognita,
}) => {
  // If showIncognita is true (legacy prop), don't show percent
  const shouldShowIncognita = showIncognita || percent === undefined;

  // Geometry
  const W = 920;
  const H = 480; // Increased height to accommodate larger text
  const m = { t: 50, r: 50, b: 180, l: 80 }; // Increased bottom margin for larger text
  const iw = W - m.l - m.r;
  const ih = H - m.t - m.b;

  // Event positions (proportional, adjustable)
  const t0X = m.l + iw * 0.32;
  const tcX = m.l + iw * 0.67;
  const windowW = tcX - t0X;

  // "Conceptual" price path (starts flat, drops across window, then stabilizes)
  const yStart = m.t + ih * 0.28; // pre-hack level
  const yMid = m.t + ih * 0.62; // around announcement
  const yEnd = m.t + ih * 0.7; // post window

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

  // Colors - using cypherpunk palette
  const grid = COLORS.gunmetal;
  const price = COLORS.green; // neon green for price line
  const t0 = COLORS.magenta; // neon magenta for hack time
  const tC = COLORS.cyan; // neon cyan for announcement time
  const text = COLORS.silver;

  // Percent display
  const percentText = shouldShowIncognita
    ? '？'
    : typeof percent === 'number' && !Number.isNaN(percent)
      ? `${Math.round(percent)}%`
      : '？';

  return (
    <ChartContainer aria-label='Information asymmetry window chart'>
      <ChartSVG role='img' viewBox={`0 0 ${W} ${H}`} aria-labelledby='chart-title chart-desc'>
        <title id='chart-title'>Price reaction and information asymmetry window</title>
        <desc id='chart-desc'>
          The area between hack time and public announcement visualizes the information asymmetry window. The price path
          declines across this window, indicating pre-announcement price discovery.
        </desc>

        {/* ------- Defs: grid, gradient, shadow, line animation ------- */}
        <defs>
          {/* Subtle grid */}
          <pattern id='grid' width='24' height='24' patternUnits='userSpaceOnUse'>
            <path d='M 24 0 L 0 0 0 24' fill='none' stroke={grid} strokeWidth='1' opacity='0.35' />
          </pattern>

          {/* Gradient fill for the window - neon cyan */}
          <linearGradient id='winFill' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor='#00f0ff' stopOpacity='0.2' />
            <stop offset='50%' stopColor='#9d4edd' stopOpacity='0.15' />
            <stop offset='100%' stopColor='#00f0ff' stopOpacity='0.08' />
          </linearGradient>

          {/* Soft shadow for the window outline */}
          <filter id='softShadow' x='-20%' y='-20%' width='140%' height='140%'>
            <feDropShadow dx='0' dy='2' stdDeviation='4' floodOpacity='0.18' />
          </filter>

          {/* Enhanced glow filter for question mark - neon green */}
          <filter id='questionGlow' x='-100%' y='-100%' width='300%' height='300%'>
            <feGaussianBlur stdDeviation='6' result='coloredBlur' />
            <feColorMatrix in='coloredBlur' type='matrix' values='0 1 0 0 0  0 1 0 0 0  0 1 0 0 0  0 0 0 1 0' />
            <feMerge>
              <feMergeNode in='coloredBlur' />
              <feMergeNode in='SourceGraphic' />
            </feMerge>
          </filter>

          {/* Glow filter for window border - neon cyan */}
          <filter id='windowGlow' x='-50%' y='-50%' width='200%' height='200%'>
            <feGaussianBlur stdDeviation='3' result='coloredBlur' />
            <feMerge>
              <feMergeNode in='coloredBlur' />
              <feMergeNode in='SourceGraphic' />
            </feMerge>
          </filter>

          {/* Pulse animation for question mark */}
          <style>
            {`
              @keyframes draw {
                from { stroke-dashoffset: 1200; }
                to   { stroke-dashoffset: 0; }
              }
              @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.75; }
              }
            `}
          </style>
        </defs>

        {/* ------- Background grid ------- */}
        <rect x='0' y='0' width={W} height={H} fill='url(#grid)' />

        {/* ------- Information Asymmetry Window ------- */}
        <rect
          x={t0X}
          y={m.t + 2}
          width={windowW}
          height={ih - 4}
          fill='url(#winFill)'
          stroke={tC}
          strokeWidth='2'
          strokeDasharray='8 6'
          filter='url(#windowGlow)'
          rx='8'
          style={{
            boxShadow: `0 0 20px ${tC}, inset 0 0 20px ${tC}33`,
          }}
        />
        <text
          x={t0X + windowW / 2}
          y={m.t + 22}
          textAnchor='middle'
          fontSize={14}
          fontWeight={600}
          fill={tC}
          style={{ textShadow: `0 0 10px ${tC}, 0 0 20px ${tC}` }}
        >
          — Information Asymmetry Window —
        </text>
        <text
          x={t0X + windowW / 2}
          y={m.t + 42}
          textAnchor='middle'
          fontSize={16}
          fill={text}
          opacity={0.8}
          fontStyle='italic'
        >
          (Due to Processing Costs)
        </text>

        {/* ------- Smoothed price path ------- */}
        {/*
          Path goes:
          - from left flat to t0
          - curves downward through the window
          - flattens post-announcement
        */}
        <path
          d={[
            `M ${m.l} ${yStart}`,
            `L ${t0X - 6} ${yStart}`,
            // cubic Bezier downward across window
            `C ${t0X + windowW * 0.15} ${yStart + ih * 0.12}`,
            ` ${t0X + windowW * 0.55} ${yStart + ih * 0.3}`,
            ` ${tcX} ${yMid}`,
            // small overshoot then stabilize
            `S ${tcX + windowW * 0.2} ${yEnd}`,
            ` ${m.l + iw} ${yEnd}`,
          ].join(' ')}
          fill='none'
          stroke={price}
          strokeWidth={3.5}
          strokeLinecap='round'
          strokeLinejoin='round'
          style={{ strokeDasharray: 1200, strokeDashoffset: 1200, animation: 'draw 1500ms ease-out forwards' }}
        />

        {/* ------- Fancy Question Mark - THE CHALLENGE ------- */}
        {shouldShowIncognita && (
          <>
            {/* Large, prominent question mark with neon green glow and pulse */}
            <text
              x={t0X + windowW * 0.5}
              y={yStart + (yMid - yStart) * 0.5}
              textAnchor='middle'
              fontSize={64}
              fontWeight={900}
              fill={price}
              stroke='#0b0c10'
              strokeWidth='2'
              paintOrder='stroke fill'
              filter='url(#questionGlow)'
              style={{
                animation: 'pulse 2s ease-in-out infinite',
                textShadow: `0 0 20px ${price}, 0 0 40px ${price}, 0 0 60px ${price}`,
              }}
            >
              ?
            </text>
            {/* "Price Discovery" text below */}
            <text
              x={t0X + windowW * 0.5}
              y={yStart + (yMid - yStart) * 0.5 + 40}
              textAnchor='middle'
              fontSize={18}
              fill={text}
              fontWeight={500}
              style={{ textShadow: `0 0 5px ${text}33` }}
            >
              {percentLabel}
            </text>
          </>
        )}
        {!shouldShowIncognita && (
          <>
            {/* When showing percentage, display it prominently with neon green glow */}
            <text
              x={t0X + windowW * 0.5}
              y={yStart + (yMid - yStart) * 0.5}
              textAnchor='middle'
              fontSize={48}
              fontWeight={900}
              fill={price}
              stroke='#0b0c10'
              strokeWidth='1.5'
              paintOrder='stroke fill'
              filter='url(#questionGlow)'
              style={{
                textShadow: `0 0 20px ${price}, 0 0 40px ${price}`,
              }}
            >
              {percentText}
            </text>
            <text
              x={t0X + windowW * 0.5}
              y={yStart + (yMid - yStart) * 0.5 + 40}
              textAnchor='middle'
              fontSize={18}
              fill={text}
              fontWeight={500}
              style={{ textShadow: `0 0 5px ${text}33` }}
            >
              {percentLabel}
            </text>
          </>
        )}

        {/* ------- X axis (timeline) ------- */}
        <line
          x1={m.l}
          y1={m.t + ih + 20}
          x2={m.l + iw}
          y2={m.t + ih + 20}
          stroke={COLORS.gunmetal}
          strokeWidth='2'
          opacity={0.6}
        />

        {/* ------- Event markers & guide lines ------- */}
        {/* t0 - neon magenta */}
        <line
          x1={t0X}
          y1={m.t}
          x2={t0X}
          y2={m.t + ih}
          stroke={t0}
          strokeWidth={1.5}
          strokeDasharray='6 6'
          opacity={0.8}
          style={{ filter: `drop-shadow(0 0 4px ${t0})` }}
        />
        <circle
          cx={t0X}
          cy={m.t + ih + 20}
          r='10'
          fill={t0}
          style={{ filter: `drop-shadow(0 0 8px ${t0}) drop-shadow(0 0 16px ${t0})` }}
        />
        <text
          x={t0X}
          y={m.t + ih + 60}
          textAnchor='middle'
          fontSize={20}
          fontWeight={700}
          fill={text}
          style={{ textShadow: `0 0 5px ${text}33` }}
        >
          t₀
        </text>
        <text x={t0X} y={m.t + ih + 88} textAnchor='middle' fontSize={20} fill={text}>
          Hack Transaction
        </text>
        <text x={t0X} y={m.t + ih + 116} textAnchor='middle' fontSize={20} fill={text} fontStyle='italic'>
          Detected On-Chain
        </text>
        <text
          x={t0X}
          y={m.t + ih + 144}
          textAnchor='middle'
          fontSize={20}
          fontWeight={600}
          fill={t0}
          style={{ textShadow: `0 0 10px ${t0}, 0 0 20px ${t0}` }}
        >
          Complex Public Information
        </text>
        <text
          x={t0X}
          y={m.t + ih + 172}
          textAnchor='middle'
          fontSize={18}
          fill={t0}
          fontStyle='italic'
          opacity={0.9}
          style={{ textShadow: `0 0 8px ${t0}` }}
        >
          (High Processing Cost)
        </text>

        {/* t_common - neon cyan */}
        <line
          x1={tcX}
          y1={m.t}
          x2={tcX}
          y2={m.t + ih}
          stroke={tC}
          strokeWidth={1.5}
          strokeDasharray='6 6'
          opacity={0.8}
          style={{ filter: `drop-shadow(0 0 4px ${tC})` }}
        />
        <circle
          cx={tcX}
          cy={m.t + ih + 20}
          r='10'
          fill={tC}
          style={{ filter: `drop-shadow(0 0 8px ${tC}) drop-shadow(0 0 16px ${tC})` }}
        />
        <text
          x={tcX}
          y={m.t + ih + 60}
          textAnchor='middle'
          fontSize={20}
          fontWeight={700}
          fill={text}
          style={{ textShadow: `0 0 5px ${text}33` }}
        >
          t_common
        </text>
        <text x={tcX} y={m.t + ih + 88} textAnchor='middle' fontSize={20} fill={text}>
          Public Announcement
        </text>
        <text x={tcX} y={m.t + ih + 116} textAnchor='middle' fontSize={20} fill={text} fontStyle='italic'>
          via Social Media
        </text>
        <text
          x={tcX}
          y={m.t + ih + 144}
          textAnchor='middle'
          fontSize={20}
          fontWeight={600}
          fill={tC}
          style={{ textShadow: `0 0 10px ${tC}, 0 0 20px ${tC}` }}
        >
          Simple Common Knowledge
        </text>
        <text
          x={tcX}
          y={m.t + ih + 172}
          textAnchor='middle'
          fontSize={18}
          fill={tC}
          fontStyle='italic'
          opacity={0.9}
          style={{ textShadow: `0 0 8px ${tC}` }}
        >
          (Low Processing Cost)
        </text>

        {/* ------- Y axis label ------- */}
        <text
          x='25'
          y={H / 2}
          textAnchor='middle'
          fontSize={13}
          fontWeight={600}
          fill={text}
          transform={`rotate(-90, 25, ${H / 2})`}
        >
          Governance Token Price
        </text>
      </ChartSVG>
    </ChartContainer>
  );
};
