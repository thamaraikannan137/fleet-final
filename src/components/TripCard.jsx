/**
 * TripCard Component
 * Displays individual trip information with metrics and progress
 */

import { Card, CardContent, Typography, Box, Chip, LinearProgress, IconButton, Collapse } from '@mui/material';
import {
  ExpandMore,
  DirectionsCar,
  Speed,
  LocalGasStation,
  Battery80,
  SignalCellular4Bar,
  Warning
} from '@mui/icons-material';
import { useState } from 'react';
import Chart from 'react-apexcharts';
import { useTripDetails } from '../hooks/useTripDetails';
import { getTripProgressChartConfig } from '../utils/chartConfigs';
import { formatDistance, formatDuration, formatSpeed, getStatusColor } from '../utils/formatters';

export default function TripCard({ tripId }) {
  const [expanded, setExpanded] = useState(false);
  const { tripMetadata, metrics, latestLocation, totalEvents } = useTripDetails(tripId);

  if (!tripMetadata) return null;

  const progressChartConfig = getTripProgressChartConfig(metrics.progress || 0, tripMetadata.name);

  const getSignalColor = (quality) => {
    const colors = {
      excellent: '#10b981',
      good: '#3b82f6',
      fair: '#f59e0b',
      poor: '#ef4444'
    };
    return colors[quality] || '#9ca3af';
  };

  const getFuelColor = (level) => {
    if (level < 20) return '#ef4444';
    if (level < 50) return '#f59e0b';
    return '#10b981';
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300">
      <CardContent>
        {/* Header */}
        <Box className="flex items-start justify-between mb-4">
          <div>
            <Typography variant="h6" className="font-semibold mb-1">
              {tripMetadata.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {tripMetadata.id}
            </Typography>
          </div>
          <Chip
            label={metrics.status?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}
            color={getStatusColor(metrics.status)}
            size="small"
            className="font-semibold"
          />
        </Box>

        {/* Progress Bar */}
        <Box className="mb-4">
          <Box className="flex justify-between items-center mb-1">
            <Typography variant="body2" className="text-gray-600">
              Progress
            </Typography>
            <Typography variant="body2" className="font-semibold">
              {Math.round(metrics.progress || 0)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={metrics.progress || 0}
            className="h-2 rounded-full"
            sx={{
              backgroundColor: '#e5e7eb',
              '& .MuiLinearProgress-bar': {
                backgroundColor: metrics.status === 'completed' ? '#10b981' : '#3b82f6'
              }
            }}
          />
        </Box>

        {/* Metrics Grid */}
        <Grid container spacing={2} className="mb-4">
          <Grid item xs={6}>
            <Box className="flex items-center gap-2">
              <DirectionsCar className="text-blue-500" fontSize="small" />
              <div>
                <Typography variant="caption" color="textSecondary">
                  Distance
                </Typography>
                <Typography variant="body2" className="font-semibold">
                  {formatDistance(metrics.distance || 0)}
                </Typography>
              </div>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box className="flex items-center gap-2">
              <Speed className="text-purple-500" fontSize="small" />
              <div>
                <Typography variant="caption" color="textSecondary">
                  Speed
                </Typography>
                <Typography variant="body2" className="font-semibold">
                  {formatSpeed(metrics.currentSpeed || 0)}
                </Typography>
              </div>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box className="flex items-center gap-2">
              <LocalGasStation 
                className="text-amber-500" 
                fontSize="small"
                sx={{ color: getFuelColor(metrics.fuelLevel || 0) }}
              />
              <div>
                <Typography variant="caption" color="textSecondary">
                  Fuel
                </Typography>
                <Typography variant="body2" className="font-semibold">
                  {Math.round(metrics.fuelLevel || 0)}%
                </Typography>
              </div>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box className="flex items-center gap-2">
              <Battery80 className="text-green-500" fontSize="small" />
              <div>
                <Typography variant="caption" color="textSecondary">
                  Battery
                </Typography>
                <Typography variant="body2" className="font-semibold">
                  {Math.round(metrics.batteryLevel || 0)}%
                </Typography>
              </div>
            </Box>
          </Grid>
        </Grid>

        {/* Alerts */}
        {metrics.alerts && metrics.alerts.length > 0 && (
          <Box className="mb-3 p-2 bg-red-50 rounded-lg">
            <Box className="flex items-center gap-2">
              <Warning className="text-red-500" fontSize="small" />
              <Typography variant="body2" className="text-red-700 font-medium">
                {metrics.alerts.length} Active Alert{metrics.alerts.length > 1 ? 's' : ''}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Expand Button */}
        <Box className="flex justify-between items-center pt-2 border-t">
          <Typography variant="caption" color="textSecondary">
            {totalEvents} events tracked
          </Typography>
          <IconButton
            onClick={() => setExpanded(!expanded)}
            className="transition-transform duration-300"
            sx={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
            size="small"
          >
            <ExpandMore />
          </IconButton>
        </Box>

        {/* Expanded Content */}
        <Collapse in={expanded}>
          <Box className="mt-4 pt-4 border-t">
            <Typography variant="subtitle2" className="font-semibold mb-3">
              Trip Progress
            </Typography>
            <Box className="flex justify-center">
              <Chart
                options={progressChartConfig.options}
                series={progressChartConfig.series}
                type="radialBar"
                height={200}
              />
            </Box>

            {latestLocation && (
              <Box className="mt-4 p-3 bg-gray-50 rounded-lg">
                <Typography variant="caption" color="textSecondary" className="block mb-1">
                  Latest Location
                </Typography>
                <Typography variant="body2" className="font-mono">
                  {latestLocation.lat.toFixed(4)}, {latestLocation.lng.toFixed(4)}
                </Typography>
              </Box>
            )}

            {metrics.alerts && metrics.alerts.length > 0 && (
              <Box className="mt-3">
                <Typography variant="caption" color="textSecondary" className="block mb-2">
                  Recent Alerts
                </Typography>
                <div className="space-y-2">
                  {metrics.alerts.slice(0, 3).map((alert, idx) => (
                    <Box key={idx} className="text-sm p-2 bg-red-50 rounded text-red-700">
                      {alert.message}
                    </Box>
                  ))}
                </div>
              </Box>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}

// Import Grid from MUI
import { Grid } from '@mui/material';

