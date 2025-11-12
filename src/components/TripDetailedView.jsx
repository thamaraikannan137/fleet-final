/**
 * TripDetailedView Component
 * Detailed view of a single trip with charts and full event history
 */

import { Card, CardContent, Typography, Box, Chip, Grid, Divider } from '@mui/material';
import Chart from 'react-apexcharts';
import { useTripDetails } from '../hooks/useTripDetails';
import { getDistanceTimelineChartConfig, getSpeedChartConfig } from '../utils/chartConfigs';
import { formatDistance, formatDuration, getStatusColor } from '../utils/formatters';

export default function TripDetailedView({ tripId }) {
  const { tripMetadata, metrics, events, eventTypeCounts } = useTripDetails(tripId);

  if (!tripMetadata) return null;

  const distanceChartConfig = getDistanceTimelineChartConfig(events);
  const speedChartConfig = getSpeedChartConfig(events);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                {tripMetadata.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {tripMetadata.id}
              </Typography>
            </Box>
            <Chip
              label={metrics.status?.replace('_', ' ').toUpperCase()}
              color={getStatusColor(metrics.status)}
              sx={{ fontWeight: 600 }}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3}>
            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Distance Traveled
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {formatDistance(metrics.distance || 0)}
              </Typography>
            </Grid>

            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Duration
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {formatDuration(metrics.duration || 0)}
              </Typography>
            </Grid>

            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Current Speed
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {Math.round(metrics.currentSpeed || 0)} km/h
              </Typography>
            </Grid>

            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Progress
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {Math.round(metrics.progress || 0)}%
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item size={{ xs: 12, lg: 7 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Distance Over Time
              </Typography>
              {distanceChartConfig.series[0].data.length > 0 ? (
                <Chart
                  options={distanceChartConfig.options}
                  series={distanceChartConfig.series}
                  type="area"
                  height={280}
                />
              ) : (
                <Box sx={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography sx={{ color: 'text.disabled' }}>No distance data available</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item size={{ xs: 12, lg: 5 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Speed Profile
              </Typography>
              {speedChartConfig.series[0].data.length > 0 ? (
                <Chart
                  options={speedChartConfig.options}
                  series={speedChartConfig.series}
                  type="line"
                  height={280}
                />
              ) : (
                <Box sx={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography sx={{ color: 'text.disabled' }}>No speed data available</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Event Type Summary */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Event Summary
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {Object.entries(eventTypeCounts).map(([type, count]) => (
              <Chip
                key={type}
                label={`${type.replace(/_/g, ' ')}: ${count}`}
                sx={{
                  bgcolor: 'rgba(115, 103, 240, 0.12)',
                  color: 'primary.main',
                  fontWeight: 500,
                  border: 'none'
                }}
                size="small"
              />
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

