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
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardContent>
          <Box className="flex items-start justify-between">
            <div>
              <Typography variant="h5" className="font-bold mb-2">
                {tripMetadata.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {tripMetadata.id}
              </Typography>
            </div>
            <Chip
              label={metrics.status?.replace('_', ' ').toUpperCase()}
              color={getStatusColor(metrics.status)}
              className="font-semibold"
            />
          </Box>

          <Divider className="my-4" />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="textSecondary">
                Distance Traveled
              </Typography>
              <Typography variant="h6" className="font-semibold">
                {formatDistance(metrics.distance || 0)}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="textSecondary">
                Duration
              </Typography>
              <Typography variant="h6" className="font-semibold">
                {formatDuration(metrics.duration || 0)}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="textSecondary">
                Current Speed
              </Typography>
              <Typography variant="h6" className="font-semibold">
                {Math.round(metrics.currentSpeed || 0)} km/h
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="textSecondary">
                Progress
              </Typography>
              <Typography variant="h6" className="font-semibold">
                {Math.round(metrics.progress || 0)}%
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="font-semibold mb-4">
                Distance Over Time
              </Typography>
              {distanceChartConfig.series[0].data.length > 0 ? (
                <Chart
                  options={distanceChartConfig.options}
                  series={distanceChartConfig.series}
                  type="area"
                  height={250}
                />
              ) : (
                <Box className="h-[250px] flex items-center justify-center text-gray-400">
                  <Typography>No distance data available</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="font-semibold mb-4">
                Speed Profile
              </Typography>
              {speedChartConfig.series[0].data.length > 0 ? (
                <Chart
                  options={speedChartConfig.options}
                  series={speedChartConfig.series}
                  type="line"
                  height={250}
                />
              ) : (
                <Box className="h-[250px] flex items-center justify-center text-gray-400">
                  <Typography>No speed data available</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Event Type Summary */}
      <Card>
        <CardContent>
          <Typography variant="h6" className="font-semibold mb-3">
            Event Summary
          </Typography>
          <Box className="flex flex-wrap gap-2">
            {Object.entries(eventTypeCounts).map(([type, count]) => (
              <Chip
                key={type}
                label={`${type.replace(/_/g, ' ')}: ${count}`}
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}

