'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
} from '@mui/material';

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

interface EventStudyTableProps {
  showSparkline?: boolean; // Whether to show the sparkline helper above the table
}

const tableData = [
  { t: -21, beta_t0: { value: 0.026, tstat: 1.13 }, beta_tcommon: { value: 0.099, tstat: 1.54 } },
  { t: -18, beta_t0: { value: 0.028, tstat: 1.33 }, beta_tcommon: { value: 0.096, tstat: 1.61 } },
  { t: -15, beta_t0: { value: 0.022, tstat: 1.19 }, beta_tcommon: { value: 0.097, tstat: 1.77, significant: '*' } },
  {
    t: -12,
    beta_t0: { value: 0.029, tstat: 1.75, significant: '*' },
    beta_tcommon: { value: 0.094, tstat: 1.9, significant: '*' },
  },
  { t: -9, beta_t0: { value: 0.022, tstat: 1.57 }, beta_tcommon: { value: 0.087, tstat: 2.0, significant: '**' } },
  {
    t: -6,
    beta_t0: { value: 0.016, tstat: 1.67, significant: '*' },
    beta_tcommon: { value: 0.081, tstat: 2.31, significant: '**' },
  },
  { t: -3, beta_t0: { value: 0.002, tstat: 0.46 }, beta_tcommon: { value: 0.07, tstat: 2.73, significant: '***' } },
  { t: 0, beta_t0: { value: 0, tstat: null }, beta_tcommon: { value: 0, tstat: null } },
  {
    t: 3,
    beta_t0: { value: -0.172, tstat: -3.45, significant: '***' },
    beta_tcommon: { value: -0.099, tstat: -2.03, significant: '**' },
  },
  {
    t: 6,
    beta_t0: { value: -0.191, tstat: -2.64, significant: '***' },
    beta_tcommon: { value: -0.15, tstat: -1.91, significant: '*' },
  },
  {
    t: 9,
    beta_t0: { value: -0.263, tstat: -2.73, significant: '***' },
    beta_tcommon: { value: -0.201, tstat: -1.92, significant: '*' },
  },
  {
    t: 12,
    beta_t0: { value: -0.255, tstat: -2.26, significant: '**' },
    beta_tcommon: { value: -0.206, tstat: -1.66, significant: '*' },
  },
  { t: 15, beta_t0: { value: -0.268, tstat: -2.11, significant: '**' }, beta_tcommon: { value: -0.208, tstat: -1.48 } },
  { t: 18, beta_t0: { value: -0.274, tstat: -1.96, significant: '*' }, beta_tcommon: { value: -0.198, tstat: -1.27 } },
  { t: 21, beta_t0: { value: -0.262, tstat: -1.74, significant: '*' }, beta_tcommon: { value: -0.192, tstat: -1.13 } },
  { t: 24, beta_t0: { value: -0.266, tstat: -1.65, significant: '*' }, beta_tcommon: { value: -0.194, tstat: -1.05 } },
];

export const EventStudyTable = ({ showSparkline = false }: EventStudyTableProps) => {
  // Sparkline data: "From Hack Time" values (only positive t values for stabilization visualization)
  const sparklineData = tableData.filter((row) => row.t >= 0).map((row) => ({ t: row.t, value: row.beta_t0.value }));

  // Sparkline dimensions - narrower
  const sparklineWidth = 500;
  const sparklineHeight = 100; // Increased to accommodate labels
  const sparklinePadding = 10;
  const labelPadding = 25; // Space for labels below
  const innerWidth = sparklineWidth - sparklinePadding * 2;
  const innerHeight = sparklineHeight - sparklinePadding * 2 - labelPadding;

  // Scales for sparkline
  const sparklineXScale = (t: number) => {
    const tMin = Math.min(...sparklineData.map((d) => d.t));
    const tMax = Math.max(...sparklineData.map((d) => d.t));
    return sparklinePadding + ((t - tMin) / (tMax - tMin)) * innerWidth;
  };

  const sparklineYScale = (value: number) => {
    const valueMin = Math.min(...sparklineData.map((d) => d.value));
    const valueMax = Math.max(...sparklineData.map((d) => d.value));
    return sparklinePadding + innerHeight - ((value - valueMin) / (valueMax - valueMin)) * innerHeight;
  };

  // Create sparkline path
  const createSparklinePath = () => {
    if (sparklineData.length === 0) return '';
    let path = `M ${sparklineXScale(sparklineData[0].t)} ${sparklineYScale(sparklineData[0].value)}`;
    for (let i = 1; i < sparklineData.length; i++) {
      path += ` L ${sparklineXScale(sparklineData[i].t)} ${sparklineYScale(sparklineData[i].value)}`;
    }
    return path;
  };

  return (
    <>
      {showSparkline && (
        <Box
          sx={{
            mb: 2,
            p: 2,
            background: `linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(42, 47, 54, 0.7) 100%)`,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: `1px solid ${COLORS.cyan}`,
            borderRadius: '8px',
            boxShadow: `0 0 15px rgba(0, 240, 255, 0.2)`,
          }}
        >
          <Typography
            variant='caption'
            sx={{
              display: 'block',
              mb: 1,
              fontFamily: '"JetBrains Mono", monospace',
              color: COLORS.green,
              textShadow: `0 0 5px ${COLORS.green}`,
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            {'>'} VISUAL HELPER: Notice how the curve flattens after the sharp drop — that's where the reaction
            stabilizes.
          </Typography>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <svg width={sparklineWidth} height={sparklineHeight} style={{ display: 'block' }}>
              <defs>
                <filter id='sparklineGlow' x='-50%' y='-50%' width='200%' height='200%'>
                  <feGaussianBlur stdDeviation='2' result='coloredBlur' />
                  <feMerge>
                    <feMergeNode in='coloredBlur' />
                    <feMergeNode in='SourceGraphic' />
                  </feMerge>
                </filter>
                <filter id='pointGlow24' x='-100%' y='-100%' width='300%' height='300%'>
                  <feGaussianBlur stdDeviation='3' result='coloredBlur' />
                  <feMerge>
                    <feMergeNode in='coloredBlur' />
                    <feMergeNode in='SourceGraphic' />
                  </feMerge>
                </filter>
              </defs>

              {/* Sparkline path */}
              <path
                d={createSparklinePath()}
                fill='none'
                stroke={COLORS.cyan}
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                filter='url(#sparklineGlow)'
                style={{
                  strokeDasharray: 1000,
                  strokeDashoffset: 1000,
                  animation: 'draw 1.5s ease-out forwards',
                }}
              />

              {/* Stabilization zone highlight (t=9 to t=24) - more prominent */}
              {(() => {
                const t9Point = sparklineData.find((p) => p.t === 9);
                const t24Point = sparklineData.find((p) => p.t === 24);
                if (t9Point && t24Point) {
                  const x9 = sparklineXScale(9);
                  const x24 = sparklineXScale(24);
                  // Get min/max values in the stabilization zone
                  const stabilizationPoints = sparklineData.filter((p) => p.t >= 9 && p.t <= 24);
                  const valueMin = Math.min(...stabilizationPoints.map((p) => p.value));
                  const valueMax = Math.max(...stabilizationPoints.map((p) => p.value));
                  const yMin = sparklineYScale(valueMax); // Note: yMin is visually at top (higher value)
                  const yMax = sparklineYScale(valueMin); // Note: yMax is visually at bottom (lower value)
                  // Find the highest value label position to avoid overlap
                  const highestValueLabelY = Math.min(...sparklineData.map((p) => sparklineYScale(p.value) - 10));
                  return (
                    <>
                      <rect
                        x={x9}
                        y={yMin - 3}
                        width={x24 - x9}
                        height={yMax - yMin + 6}
                        fill={COLORS.green}
                        opacity='0.15'
                        rx='3'
                        stroke={COLORS.green}
                        strokeWidth='1.5'
                        strokeDasharray='4,4'
                        style={{ filter: `drop-shadow(0 0 8px ${COLORS.green})` }}
                      />
                      <text
                        x={(x9 + x24) / 2}
                        y={highestValueLabelY - 15}
                        textAnchor='middle'
                        fontSize='10'
                        fontWeight='700'
                        fill={COLORS.green}
                        fontFamily='"JetBrains Mono", monospace'
                        style={{ textShadow: `0 0 6px ${COLORS.green}, 0 0 12px ${COLORS.green}` }}
                      >
                        STABILIZATION ZONE
                      </text>
                    </>
                  );
                }
                return null;
              })()}

              {/* Data points - ALL points with values */}
              {sparklineData.map((point) => {
                return (
                  <g key={point.t}>
                    <circle
                      cx={sparklineXScale(point.t)}
                      cy={sparklineYScale(point.value)}
                      r='3'
                      fill={COLORS.cyan}
                      filter='url(#sparklineGlow)'
                    />
                    {/* Value labels for ALL points - white for negative values */}
                    <text
                      x={sparklineXScale(point.t)}
                      y={sparklineYScale(point.value) - 10}
                      textAnchor='middle'
                      fontSize='8'
                      fontWeight='600'
                      fill='#ffffff'
                      fontFamily='"JetBrains Mono", monospace'
                      style={{ textShadow: `0 0 3px rgba(255, 255, 255, 0.8)` }}
                    >
                      {point.value.toFixed(3)}
                    </text>
                  </g>
                );
              })}

              {/* Time labels below - ALL time points */}
              <g transform={`translate(0, ${sparklineHeight - labelPadding + 8})`}>
                {sparklineData.map((point) => {
                  const isInStabilizationZone = point.t >= 9 && point.t <= 24;
                  return (
                    <g key={`label-${point.t}`}>
                      <line
                        x1={sparklineXScale(point.t)}
                        y1={-innerHeight - 5}
                        x2={sparklineXScale(point.t)}
                        y2={-innerHeight - 2}
                        stroke={isInStabilizationZone ? COLORS.silver : COLORS.silver}
                        strokeWidth='1'
                        opacity={isInStabilizationZone ? 0.8 : 0.4}
                      />
                      <text
                        x={sparklineXScale(point.t)}
                        y='0'
                        textAnchor='middle'
                        fontSize='10'
                        fontWeight={isInStabilizationZone ? '700' : '500'}
                        fill={isInStabilizationZone ? COLORS.silver : COLORS.silver}
                        fontFamily='"JetBrains Mono", monospace'
                        style={
                          isInStabilizationZone
                            ? {
                                textShadow: `0 0 4px ${COLORS.silver}`,
                              }
                            : {}
                        }
                      >
                        {point.t}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* Style for animations */}
              <style>
                {`
                  @keyframes draw {
                    from { stroke-dashoffset: 1000; }
                    to { stroke-dashoffset: 0; }
                  }
                  @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.2); }
                  }
                `}
              </style>
            </svg>
          </Box>
        </Box>
      )}
      <TableContainer
        component={Paper}
        sx={{
          mb: 3,
          overflowX: 'auto',
          background: `linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(42, 47, 54, 0.7) 100%)`,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: `1px solid ${COLORS.gunmetal}`,
          borderRadius: '8px',
          boxShadow: `0 0 15px rgba(0, 0, 0, 0.3)`,
        }}
      >
        <Table size='small' sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 'bold',
                  borderRight: `1px solid ${COLORS.gunmetal}`,
                  fontFamily: '"JetBrains Mono", monospace',
                  color: COLORS.silver,
                }}
              >
                Hours
              </TableCell>
              <TableCell
                align='center'
                colSpan={2}
                sx={{
                  fontWeight: 'bold',
                  borderRight: `1px solid ${COLORS.gunmetal}`,
                  fontFamily: '"JetBrains Mono", monospace',
                  color: COLORS.silver,
                }}
              >
                From Hack Time
              </TableCell>
              <TableCell
                align='center'
                colSpan={2}
                sx={{
                  fontWeight: 'bold',
                  fontFamily: '"JetBrains Mono", monospace',
                  color: COLORS.silver,
                }}
              >
                From Public Announcement
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ borderRight: `1px solid ${COLORS.gunmetal}` }}></TableCell>
              <TableCell
                align='center'
                sx={{
                  fontWeight: 'bold',
                  borderRight: `1px solid ${COLORS.gunmetal}`,
                  fontFamily: '"JetBrains Mono", monospace',
                  color: COLORS.silver,
                  fontSize: '0.85rem',
                }}
              >
                Price Change
              </TableCell>
              <TableCell
                align='center'
                sx={{
                  fontWeight: 'bold',
                  borderRight: `1px solid ${COLORS.gunmetal}`,
                  fontFamily: '"JetBrains Mono", monospace',
                  color: COLORS.gunmetal,
                  fontSize: '0.75rem',
                  fontStyle: 'italic',
                }}
              >
                t-stat
              </TableCell>
              <TableCell
                align='center'
                sx={{
                  fontWeight: 'bold',
                  borderRight: `1px solid ${COLORS.gunmetal}`,
                  fontFamily: '"JetBrains Mono", monospace',
                  color: COLORS.silver,
                  fontSize: '0.85rem',
                }}
              >
                Price Change
              </TableCell>
              <TableCell
                align='center'
                sx={{
                  fontWeight: 'bold',
                  fontFamily: '"JetBrains Mono", monospace',
                  color: COLORS.gunmetal,
                  fontSize: '0.75rem',
                  fontStyle: 'italic',
                }}
              >
                t-stat
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row) => {
              return (
                <TableRow
                  key={row.t}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      borderRight: `1px solid ${COLORS.gunmetal}`,
                      fontFamily: '"JetBrains Mono", monospace',
                      color: COLORS.silver,
                    }}
                  >
                    {row.t}
                  </TableCell>
                  <TableCell
                    align='center'
                    sx={{
                      borderRight: `1px solid ${COLORS.gunmetal}`,
                      fontFamily: '"JetBrains Mono", monospace',
                      color: COLORS.silver,
                    }}
                  >
                    {row.beta_t0.value.toFixed(3)}
                  </TableCell>
                  <TableCell
                    align='center'
                    sx={{
                      borderRight: `1px solid ${COLORS.gunmetal}`,
                      fontFamily: '"JetBrains Mono", monospace',
                      color: COLORS.gunmetal,
                      fontSize: '0.85rem',
                    }}
                  >
                    {row.beta_t0.tstat !== null ? `(${row.beta_t0.tstat.toFixed(2)})` : '(.)'}
                  </TableCell>
                  <TableCell
                    align='center'
                    sx={{
                      borderRight: `1px solid ${COLORS.gunmetal}`,
                      fontFamily: '"JetBrains Mono", monospace',
                      color: COLORS.silver,
                    }}
                  >
                    {row.beta_tcommon.value.toFixed(3)}
                  </TableCell>
                  <TableCell
                    align='center'
                    sx={{
                      fontFamily: '"JetBrains Mono", monospace',
                      color: COLORS.gunmetal,
                      fontSize: '0.85rem',
                    }}
                  >
                    {row.beta_tcommon.tstat !== null ? `(${row.beta_tcommon.tstat.toFixed(2)})` : '(.)'}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Box sx={{ p: 2, borderTop: `1px solid ${COLORS.gunmetal}` }}>
          <Typography
            variant='caption'
            sx={{
              display: 'block',
              mb: 1,
              fontStyle: 'italic',
              fontWeight: 'bold',
              fontFamily: '"JetBrains Mono", monospace',
              color: COLORS.cyan,
              textShadow: `0 0 5px ${COLORS.cyan}`,
            }}
          >
            {'>'} ANALYST'S RESULTS TABLE
          </Typography>
          <Typography
            variant='caption'
            sx={{ color: COLORS.silver, display: 'block', mb: 0.5, fontFamily: '"JetBrains Mono", monospace' }}
          >
            Rows show hours relative to the event. "–" means before the event, "+" means after.
          </Typography>
          <Typography
            variant='caption'
            sx={{ color: COLORS.silver, display: 'block', mb: 0.5, fontFamily: '"JetBrains Mono", monospace' }}
          >
            The "Price Change" columns show total price changes (cumulative abnormal returns). Focus on these values.
          </Typography>
          <Typography
            variant='caption'
            sx={{
              color: COLORS.gunmetal,
              display: 'block',
              mb: 0.5,
              fontFamily: '"JetBrains Mono", monospace',
              fontStyle: 'italic',
              fontSize: '0.7rem',
            }}
          >
            Note: The "t-stat" columns measure statistical confidence in the price change estimates. You don't need
            these values for your calculation — they're just part of the analyst's full report.
          </Typography>
        </Box>
      </TableContainer>
    </>
  );
};
