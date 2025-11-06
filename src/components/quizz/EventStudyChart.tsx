'use client';

import { Box, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
// import * as React from 'react'; // Not needed

interface EventStudyChartProps {
  highlightRightChart?: boolean;
  showTargetPoint?: boolean;
  showOnlyRightChart?: boolean;
}

// Data points for Panel (a): Hack Time
const hackTimeData = [
  { t: -21, car: 0.026 },
  { t: -18, car: 0.028 },
  { t: -15, car: 0.022 },
  { t: -12, car: 0.029 },
  { t: -9, car: 0.022 },
  { t: -6, car: 0.016 },
  { t: -3, car: 0.002 },
  { t: 0, car: 0 },
  { t: 3, car: -0.172 },
  { t: 6, car: -0.191 },
  { t: 9, car: -0.263 },
  { t: 12, car: -0.255 },
  { t: 15, car: -0.268 },
  { t: 18, car: -0.274 },
  { t: 21, car: -0.262 },
  { t: 24, car: -0.266 },
];

// Data points for Panel (b): Announcement Time
const announcementTimeData = [
  { t: -21, car: 0.099 },
  { t: -18, car: 0.096 },
  { t: -15, car: 0.097 },
  { t: -12, car: 0.094 },
  { t: -9, car: 0.087 },
  { t: -6, car: 0.081 },
  { t: -3, car: 0.07 },
  { t: 0, car: 0 },
  { t: 3, car: -0.099 },
  { t: 6, car: -0.15 },
  { t: 9, car: -0.201 },
  { t: 12, car: -0.206 },
  { t: 15, car: -0.208 },
  { t: 18, car: -0.198 },
  { t: 21, car: -0.192 },
  { t: 24, car: -0.194 },
];

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
  height: '600px',
  overflow: 'visible',
  display: 'block',
});

export const EventStudyChart = ({
  highlightRightChart: _highlightRightChart = false, // eslint-disable-line @typescript-eslint/no-unused-vars
  showTargetPoint = false,
  showOnlyRightChart = false,
}: EventStudyChartProps) => {
  // Much larger chart dimensions
  const chartWidth = 1000;
  const chartHeight = 550;
  const margin = { top: 60, right: 50, bottom: 80, left: 80 };
  const innerWidth = chartWidth - margin.left - margin.right;
  const innerHeight = chartHeight - margin.top - margin.bottom;

  // Scales
  const xMin = -21;
  const xMax = 24;
  const yMin = -0.3;
  const yMax = 0.15;

  const xScale = (t: number) => margin.left + ((t - xMin) / (xMax - xMin)) * innerWidth;
  const yScale = (car: number) => margin.top + innerHeight - ((car - yMin) / (yMax - yMin)) * innerHeight;

  // Helper to create smooth path
  const createPath = (data: { t: number; car: number }[]) => {
    if (data.length === 0) return '';
    let path = `M ${xScale(data[0].t)} ${yScale(data[0].car)}`;
    for (let i = 1; i < data.length; i++) {
      const prev = data[i - 1];
      const curr = data[i];
      const next = data[i + 1];

      if (next) {
        // Use smooth curve
        const cp1x = xScale(prev.t) + (xScale(curr.t) - xScale(prev.t)) * 0.5;
        const cp1y = yScale(prev.car);
        const cp2x = xScale(curr.t) - (xScale(next.t) - xScale(curr.t)) * 0.5;
        const cp2y = yScale(curr.car);
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${xScale(curr.t)} ${yScale(curr.car)}`;
      } else {
        path += ` L ${xScale(curr.t)} ${yScale(curr.car)}`;
      }
    }
    return path;
  };

  // Helper to find point at t=-12 for right chart
  const getTargetPoint = () => {
    const point = announcementTimeData.find((p) => p.t === -12);
    if (!point) return null;
    return { x: xScale(point.t), y: yScale(point.car), car: point.car };
  };

  const targetPoint = getTargetPoint();

  // Render single chart (right chart when showOnlyRightChart is true)
  const renderChart = (
    data: { t: number; car: number }[],
    title: string,
    lineColor: string,
    isAnnouncementChart: boolean = false,
  ) => {
    return (
      <ChartContainer>
        <ChartSVG viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          <defs>
            {/* Grid pattern */}
            <pattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'>
              <path d='M 40 0 L 0 0 0 40' fill='none' stroke={COLORS.gunmetal} strokeWidth='1' opacity='0.4' />
            </pattern>

            {/* Glow filter for line */}
            <filter id='lineGlow' x='-50%' y='-50%' width='200%' height='200%'>
              <feGaussianBlur stdDeviation='3' result='coloredBlur' />
              <feMerge>
                <feMergeNode in='coloredBlur' />
                <feMergeNode in='SourceGraphic' />
              </feMerge>
            </filter>

            {/* Glow filter for data points */}
            <filter id='pointGlow' x='-100%' y='-100%' width='300%' height='300%'>
              <feGaussianBlur stdDeviation='4' result='coloredBlur' />
              <feMerge>
                <feMergeNode in='coloredBlur' />
                <feMergeNode in='SourceGraphic' />
              </feMerge>
            </filter>

            {/* Animations */}
            <style>
              {`
                @keyframes draw {
                  from { stroke-dashoffset: 2000; }
                  to { stroke-dashoffset: 0; }
                }
                @keyframes pulse {
                  0%, 100% { opacity: 1; transform: scale(1); }
                  50% { opacity: 0.8; transform: scale(1.1); }
                }
              `}
            </style>
          </defs>

          {/* Background grid */}
          <rect x='0' y='0' width={chartWidth} height={chartHeight} fill='url(#grid)' />

          {/* Grid lines - vertical */}
          <g stroke={COLORS.gunmetal} strokeWidth='1' opacity='0.3'>
            {[-21, -18, -15, -12, -9, -6, -3, 0, 3, 6, 9, 12, 15, 18, 21, 24].map((t) => (
              <line key={`v-${t}`} x1={xScale(t)} y1={margin.top} x2={xScale(t)} y2={margin.top + innerHeight} />
            ))}
          </g>

          {/* Grid lines - horizontal */}
          <g stroke={COLORS.gunmetal} strokeWidth='1' opacity='0.3'>
            {[-0.2, -0.15, -0.1, -0.05, 0, 0.05, 0.1, 0.15].map((car) => (
              <line key={`h-${car}`} x1={margin.left} y1={yScale(car)} x2={margin.left + innerWidth} y2={yScale(car)} />
            ))}
          </g>

          {/* Zero line - horizontal dashed */}
          <line
            x1={margin.left}
            y1={yScale(0)}
            x2={margin.left + innerWidth}
            y2={yScale(0)}
            stroke={COLORS.silver}
            strokeWidth='2'
            strokeDasharray='8,6'
            opacity='0.6'
          />

          {/* Vertical line at t=0 - white dashed */}
          <line
            x1={xScale(0)}
            y1={margin.top}
            x2={xScale(0)}
            y2={margin.top + innerHeight}
            stroke={COLORS.silver}
            strokeWidth='2.5'
            strokeDasharray='8,6'
            opacity='0.8'
            style={{ filter: `drop-shadow(0 0 4px ${COLORS.silver})` }}
          />

          {/* Data line with glow */}
          <path
            d={createPath(data)}
            fill='none'
            stroke={lineColor}
            strokeWidth='4'
            strokeLinecap='round'
            strokeLinejoin='round'
            filter='url(#lineGlow)'
            style={{
              strokeDasharray: 2000,
              strokeDashoffset: 2000,
              animation: 'draw 2s ease-out forwards',
            }}
          />

          {/* Data points */}
          {data.map((point) => {
            const isTarget = point.t === -12 && showTargetPoint && title.includes('Announcement');
            return (
              <g key={point.t}>
                <circle
                  cx={xScale(point.t)}
                  cy={yScale(point.car)}
                  r={isTarget ? '8' : '5'}
                  fill={isTarget ? COLORS.magenta : lineColor}
                  stroke={isTarget ? COLORS.silver : 'none'}
                  strokeWidth={isTarget ? '3' : '0'}
                  filter='url(#pointGlow)'
                  style={
                    isTarget
                      ? {
                          filter: `drop-shadow(0 0 10px ${COLORS.magenta}) drop-shadow(0 0 20px ${COLORS.magenta})`,
                          animation: 'pulse 2s ease-in-out infinite',
                        }
                      : {}
                  }
                />
                {/* Value labels for key points */}
                {(point.t === -12 ||
                  point.t === 0 ||
                  point.t === 24 ||
                  (point.t === -3 && title.includes('Announcement'))) && (
                  <text
                    x={xScale(point.t)}
                    y={yScale(point.car) - 15}
                    textAnchor='middle'
                    fontSize='12'
                    fontWeight='600'
                    fill={COLORS.silver}
                    style={{ textShadow: `0 0 5px ${COLORS.silver}` }}
                  >
                    {point.car.toFixed(3)}
                  </text>
                )}
              </g>
            );
          })}

          {/* Highlight t=-12 point with circle */}
          {showTargetPoint && targetPoint && title.includes('Announcement') && (
            <>
              <circle
                cx={targetPoint.x}
                cy={targetPoint.y}
                r='15'
                fill='none'
                stroke={COLORS.magenta}
                strokeWidth='2'
                strokeDasharray='6,6'
                opacity='0.7'
                style={{
                  filter: `drop-shadow(0 0 8px ${COLORS.magenta})`,
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              />
              <text
                x={targetPoint.x}
                y={targetPoint.y - 30}
                textAnchor='middle'
                fontSize='14'
                fontWeight='700'
                fill={COLORS.magenta}
                style={{ textShadow: `0 0 10px ${COLORS.magenta}, 0 0 20px ${COLORS.magenta}` }}
              >
                t = -12
              </text>
            </>
          )}

          {/* X-axis labels - larger and clearer */}
          <g transform={`translate(0, ${chartHeight - margin.bottom + 20})`}>
            {[-21, -18, -15, -12, -9, -6, -3, 0, 3, 6, 9, 12, 15, 18, 21, 24].map((t) => (
              <text
                key={t}
                x={xScale(t)}
                y='0'
                textAnchor='middle'
                fontSize='14'
                fontWeight='600'
                fill={COLORS.silver}
                fontFamily='"JetBrains Mono", monospace'
                style={{ textShadow: `0 0 5px ${COLORS.silver}` }}
              >
                {t}
              </text>
            ))}
          </g>

          {/* Y-axis labels - larger and clearer */}
          <g transform={`translate(${margin.left - 15}, 0)`}>
            {[-0.2, -0.15, -0.1, -0.05, 0, 0.05, 0.1, 0.15].map((car) => (
              <text
                key={car}
                x='0'
                y={yScale(car) + 5}
                textAnchor='end'
                fontSize='14'
                fontWeight='600'
                fill={COLORS.silver}
                fontFamily='"JetBrains Mono", monospace'
                style={{ textShadow: `0 0 5px ${COLORS.silver}` }}
              >
                {car.toFixed(2)}
              </text>
            ))}
          </g>

          {/* Title - larger and styled */}
          <text
            x={chartWidth / 2}
            y='35'
            textAnchor='middle'
            fontSize='20'
            fontWeight='700'
            fill={COLORS.cyan}
            fontFamily='"JetBrains Mono", monospace'
            style={{ textShadow: `0 0 10px ${COLORS.cyan}, 0 0 20px ${COLORS.cyan}` }}
          >
            {showOnlyRightChart && isAnnouncementChart ? 'Price Movement Around Public Announcement' : title}
          </text>

          {/* Axis labels - larger */}
          <text
            x={chartWidth / 2}
            y={chartHeight - 15}
            textAnchor='middle'
            fontSize='16'
            fontWeight='600'
            fill={COLORS.silver}
            fontFamily='"JetBrains Mono", monospace'
            style={{ textShadow: `0 0 5px ${COLORS.silver}` }}
          >
            {showOnlyRightChart && isAnnouncementChart ? 'Hours from announcement (t = 0)' : 't (hours)'}
          </text>
          <text
            x='25'
            y={chartHeight / 2}
            textAnchor='middle'
            fontSize='16'
            fontWeight='600'
            fill={COLORS.silver}
            fontFamily='"JetBrains Mono", monospace'
            transform={`rotate(-90, 25, ${chartHeight / 2})`}
            style={{ textShadow: `0 0 5px ${COLORS.silver}` }}
          >
            {showOnlyRightChart && isAnnouncementChart ? 'Cumulative Returns' : 'Returns'}
          </text>

          {/* Caption */}
          <text
            x={chartWidth / 2}
            y={chartHeight - 5}
            textAnchor='middle'
            fontSize='12'
            fill={COLORS.gunmetal}
            fontFamily='"JetBrains Mono", monospace'
            fontStyle='italic'
            opacity='0.8'
          >
            Price movement aligned to announcement time (49 hack events).
          </text>
        </ChartSVG>
      </ChartContainer>
    );
  };

  return (
    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center', my: 4 }}>
      {/* Panel (a): Hack Time - only show if not showOnlyRightChart */}
      {!showOnlyRightChart && renderChart(hackTimeData, '(a) t = t₀ (Hack Time)', COLORS.magenta)}

      {/* Panel (b): Announcement Time */}
      {renderChart(announcementTimeData, '(b) t = t_common (Announcement Time)', COLORS.cyan, true)}
    </Box>
  );
};
