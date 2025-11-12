/**
 * TripCard Component
 * Displays individual trip information with metrics and progress
 */

import { Card, CardContent, Typography, Box, Chip, LinearProgress, IconButton, Collapse, Grid } from '@mui/material';
import {
  ExpandMore,
  DirectionsCar,
  Speed,
  LocalGasStation,
  Battery80,
  Warning
} from '@mui/icons-material';
import { useState } from 'react';
import Chart from 'react-apexcharts';
import { useTripDetails } from '../hooks/useTripDetails';
import { getTripProgressChartConfig } from '../utils/chartConfigs';
import { formatDistance, formatSpeed, getStatusColor } from '../utils/formatters';

export default function TripCard({ tripId }) {
  const [expanded, setExpanded] = useState(false);
  const { tripMetadata, metrics, latestLocation, totalEvents } = useTripDetails(tripId);

  if (!tripMetadata) return null;

  const progressChartConfig = getTripProgressChartConfig(
    isNaN(metrics.progress) ? 0 : (metrics.progress || 0), 
    tripMetadata.name
  );

  const getProgressColor = (status) => {
    if (status === 'completed') return '#28C76F';
    if (status === 'cancelled') return '#EA5455';
    return '#7367F0';
  };

  return (
    <Card 
      sx={{ 
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: '0px 8px 24px rgba(115, 103, 240, 0.2)',
          transform: 'translateY(-4px)'
        }
      }}
    >
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                color: 'text.primary',
                mb: 0.5,
                fontSize: '1.125rem'
              }}
            >
              {tripMetadata.name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>
              {tripMetadata.id}
            </Typography>
          </Box>
          <Chip
            label={metrics.status?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}
            color={getStatusColor(metrics.status)}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Box>

        {/* Progress Bar */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              Progress
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {metrics.progress !== null && metrics.progress !== undefined && !isNaN(metrics.progress) ? `${Math.round(metrics.progress)}%` : '-'}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={isNaN(metrics.progress) ? 0 : (metrics.progress || 0)}
            sx={{
              height: 8,
              borderRadius: 1,
              backgroundColor: 'rgba(115, 103, 240, 0.12)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: getProgressColor(metrics.status),
                borderRadius: 1
              }
            }}
          />
        </Box>

        {/* Metrics Grid */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item size={{ xs: 6 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                p: 1.5,
                borderRadius: 1.5,
                bgcolor: 'rgba(115, 103, 240, 0.08)',
              }}
            >
              <Box 
                sx={{ 
                  width: 36, 
                  height: 36, 
                  borderRadius: 1.5,
                  background: 'linear-gradient(135deg, #7367F0 0%, #9E95F5 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  '& svg': { fontSize: 20 }
                }}
              >
                <DirectionsCar />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  Distance
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {formatDistance(metrics.distance || 0)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item size={{ xs: 6 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                p: 1.5,
                borderRadius: 1.5,
                bgcolor: 'rgba(0, 207, 232, 0.08)',
              }}
            >
              <Box 
                sx={{ 
                  width: 36, 
                  height: 36, 
                  borderRadius: 1.5,
                  background: 'linear-gradient(135deg, #00CFE8 0%, #1CE7FF 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  '& svg': { fontSize: 20 }
                }}
              >
                <Speed />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  Speed
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {formatSpeed(metrics.currentSpeed || 0)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item size={{ xs: 6 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                p: 1.5,
                borderRadius: 1.5,
                bgcolor: 'rgba(255, 159, 67, 0.08)',
              }}
            >
              <Box 
                sx={{ 
                  width: 36, 
                  height: 36, 
                  borderRadius: 1.5,
                  background: 'linear-gradient(135deg, #FF9F43 0%, #FFB976 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  '& svg': { fontSize: 20 }
                }}
              >
                <LocalGasStation />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  Fuel
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {metrics.fuelLevel !== null && metrics.fuelLevel !== undefined && !isNaN(metrics.fuelLevel) ? `${Math.round(metrics.fuelLevel)}%` : 'No data'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item size={{ xs: 6 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                p: 1.5,
                borderRadius: 1.5,
                bgcolor: 'rgba(40, 199, 111, 0.08)',
              }}
            >
              <Box 
                sx={{ 
                  width: 36, 
                  height: 36, 
                  borderRadius: 1.5,
                  background: 'linear-gradient(135deg, #28C76F 0%, #48DA89 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  '& svg': { fontSize: 20 }
                }}
              >
                <Battery80 />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  Battery
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {metrics.batteryLevel !== null && metrics.batteryLevel !== undefined && !isNaN(metrics.batteryLevel) ? `${Math.round(metrics.batteryLevel)}%` : '-'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Alerts */}
        {metrics.alerts && metrics.alerts.length > 0 && (
          <Box 
            sx={{ 
              mb: 2,
              p: 1.5,
              bgcolor: 'rgba(234, 84, 85, 0.12)',
              borderRadius: 1.5,
              border: '1px solid rgba(234, 84, 85, 0.2)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Warning sx={{ color: '#EA5455', fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: '#EA5455', fontWeight: 600 }}>
                {metrics.alerts.length} Active Alert{metrics.alerts.length > 1 ? 's' : ''}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Expand Button */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            pt: 2, 
            borderTop: 1,
            borderColor: 'divider'
          }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            {totalEvents} events tracked
          </Typography>
          <IconButton
            onClick={() => setExpanded(!expanded)}
            sx={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
              color: 'primary.main'
            }}
            size="small"
          >
            <ExpandMore />
          </IconButton>
        </Box>

        {/* Expanded Content */}
        <Collapse in={expanded}>
          <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600, 
                color: 'text.primary',
                mb: 2 
              }}
            >
              Trip Progress
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Chart
                options={progressChartConfig.options}
                series={progressChartConfig.series}
                type="radialBar"
                height={200}
              />
            </Box>

            {latestLocation && (
              <Box 
                sx={{ 
                  mt: 3,
                  p: 2,
                  bgcolor: 'rgba(115, 103, 240, 0.08)',
                  borderRadius: 1.5
                }}
              >
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary',
                    display: 'block',
                    mb: 0.5,
                    fontWeight: 500
                  }}
                >
                  Latest Location
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    color: 'text.primary'
                  }}
                >
                  {latestLocation.lat.toFixed(4)}, {latestLocation.lng.toFixed(4)}
                </Typography>
              </Box>
            )}

            {metrics.alerts && metrics.alerts.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary',
                    display: 'block',
                    mb: 1,
                    fontWeight: 500
                  }}
                >
                  Recent Alerts
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {metrics.alerts.slice(0, 3).map((alert, idx) => (
                    <Box 
                      key={idx} 
                      sx={{ 
                        fontSize: '0.875rem',
                        p: 1.5,
                        bgcolor: 'rgba(234, 84, 85, 0.12)',
                        borderRadius: 1,
                        color: '#EA5455',
                        border: '1px solid rgba(234, 84, 85, 0.2)'
                      }}
                    >
                      {alert.message}
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}

