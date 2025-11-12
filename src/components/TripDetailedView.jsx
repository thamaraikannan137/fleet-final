/**
 * TripDetailedView Component
 * Detailed view of a single trip with charts and full event history
 */

import { Card, CardContent, Typography, Box, Chip, Grid, Divider, List, ListItem, Avatar, Alert } from '@mui/material';
import {
  PlayArrow,
  CheckCircle,
  Cancel,
  LocationOn,
  Warning,
  Speed,
  LocalGasStation,
  Error as ErrorIcon,
  BatteryAlert,
  SignalCellularConnectedNoInternet0Bar,
  SignalCellular4Bar
} from '@mui/icons-material';
import Chart from 'react-apexcharts';
import { useTripDetails } from '../hooks/useTripDetails';
import { getDistanceTimelineChartConfig, getSpeedChartConfig } from '../utils/chartConfigs';
import { formatDistance, formatDuration, getStatusColor, formatTimestamp } from '../utils/formatters';

export default function TripDetailedView({ tripId }) {
  const { tripMetadata, metrics, events, eventTypeCounts } = useTripDetails(tripId);

  if (!tripMetadata) return null;

  const distanceChartConfig = getDistanceTimelineChartConfig(events);
  const speedChartConfig = getSpeedChartConfig(events);

  // Filter alert/error events
  const alertEvents = events.filter(e => 
    ['speed_violation', 'fuel_level_low', 'battery_low', 'device_error', 'signal_lost', 'trip_cancelled'].includes(e.event_type)
  );

  // Get important events (all non-location_ping events)
  const importantEvents = events.filter(e => e.event_type !== 'location_ping');

  const getEventIcon = (eventType) => {
    const icons = {
      trip_started: <PlayArrow />,
      trip_completed: <CheckCircle />,
      trip_cancelled: <Cancel />,
      location_ping: <LocationOn />,
      speed_violation: <Speed />,
      fuel_level_low: <LocalGasStation />,
      battery_low: <BatteryAlert />,
      refueling_started: <LocalGasStation />,
      refueling_completed: <LocalGasStation />,
      device_error: <ErrorIcon />,
      signal_lost: <SignalCellularConnectedNoInternet0Bar />,
      signal_recovered: <SignalCellular4Bar />,
      vehicle_stopped: <Warning />,
      vehicle_moving: <PlayArrow />
    };
    return icons[eventType] || <LocationOn />;
  };

  const getEventColor = (eventType) => {
    const colors = {
      trip_started: '#10b981',
      trip_completed: '#10b981',
      trip_cancelled: '#ef4444',
      speed_violation: '#ef4444',
      fuel_level_low: '#f59e0b',
      battery_low: '#f59e0b',
      device_error: '#ef4444',
      signal_lost: '#f59e0b',
      signal_recovered: '#10b981',
      refueling_completed: '#10b981'
    };
    return colors[eventType] || '#6366f1';
  };

  const getAlertSeverity = (eventType) => {
    if (['speed_violation', 'device_error', 'trip_cancelled'].includes(eventType)) return 'error';
    if (['fuel_level_low', 'battery_low', 'signal_lost'].includes(eventType)) return 'warning';
    return 'info';
  };

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
                {metrics.currentSpeed !== null && metrics.currentSpeed !== undefined && !isNaN(metrics.currentSpeed) ? `${Math.round(metrics.currentSpeed)} km/h` : '-'}
              </Typography>
            </Grid>

            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Progress
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {metrics.progress !== null && metrics.progress !== undefined && !isNaN(metrics.progress) ? `${Math.round(metrics.progress)}%` : '-'}
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

      {/* Alerts & Errors Section */}
      {alertEvents.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Warning sx={{ color: '#f59e0b' }} />
              Alerts & Errors ({alertEvents.length})
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {alertEvents.map((event, idx) => (
                <Alert 
                  key={idx} 
                  severity={getAlertSeverity(event.event_type)}
                  icon={getEventIcon(event.event_type)}
                  sx={{ 
                    '& .MuiAlert-icon': { 
                      fontSize: 24 
                    }
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {event.event_type.replace(/_/g, ' ').toUpperCase()}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      {formatTimestamp(event.timestamp)}
                    </Typography>
                    {event.event_type === 'speed_violation' && (
                      <Typography variant="body2">
                        Speed: {Math.round(event.movement?.speed_kmh || 0)} km/h (Limit: {event.speed_limit_kmh} km/h)
                      </Typography>
                    )}
                    {event.event_type === 'fuel_level_low' && (
                      <Typography variant="body2">
                        Fuel Level: {event.fuel_level_percent}%
                      </Typography>
                    )}
                    {event.event_type === 'battery_low' && (
                      <Typography variant="body2">
                        Battery Level: {event.battery_level_percent}%
                      </Typography>
                    )}
                    {event.event_type === 'device_error' && (
                      <Typography variant="body2">
                        Error: {event.error_message || 'Device malfunction'}
                      </Typography>
                    )}
                    {event.event_type === 'trip_cancelled' && (
                      <Typography variant="body2">
                        Reason: {event.cancellation_reason?.replace(/_/g, ' ')}
                      </Typography>
                    )}
                  </Box>
                </Alert>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Event Timeline */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Trip Events Timeline ({importantEvents.length} events)
          </Typography>
          
          {/* Event Type Summary */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 3 }}>
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

          <Divider sx={{ my: 2 }} />

          {/* Event List */}
          <List sx={{ maxHeight: 500, overflow: 'auto' }}>
            {importantEvents.slice().reverse().map((event, idx) => (
              <ListItem
                key={idx}
                sx={{
                  borderLeft: `4px solid ${getEventColor(event.event_type)}`,
                  mb: 2,
                  bgcolor: 'rgba(0, 0, 0, 0.02)',
                  borderRadius: 1,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: getEventColor(event.event_type),
                    width: 40,
                    height: 40,
                    mr: 2
                  }}
                >
                  {getEventIcon(event.event_type)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {event.event_type.replace(/_/g, ' ').toUpperCase()}
                    </Typography>
                    <Chip 
                      label={formatTimestamp(event.timestamp)}
                      size="small"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {event.movement?.speed_kmh !== undefined && (
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Speed: {Math.round(event.movement.speed_kmh)} km/h
                      </Typography>
                    )}
                    {event.distance_travelled_km !== undefined && event.distance_travelled_km > 0 && (
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Distance: {Math.round(event.distance_travelled_km)} km
                      </Typography>
                    )}
                    {event.location && (
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Location: {event.location.lat.toFixed(4)}, {event.location.lng.toFixed(4)}
                      </Typography>
                    )}
                  </Box>

                  {/* Additional event-specific details */}
                  {event.error_message && (
                    <Typography variant="body2" sx={{ mt: 1, color: 'error.main' }}>
                      Error: {event.error_message}
                    </Typography>
                  )}
                  {event.cancellation_reason && (
                    <Typography variant="body2" sx={{ mt: 1, color: 'error.main' }}>
                      Reason: {event.cancellation_reason.replace(/_/g, ' ')}
                    </Typography>
                  )}
                  {event.refuel_duration_minutes && (
                    <Typography variant="body2" sx={{ mt: 1, color: 'success.main' }}>
                      Duration: {event.refuel_duration_minutes} minutes | Fuel added: {event.fuel_added_percent}%
                    </Typography>
                  )}
                </Box>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}

