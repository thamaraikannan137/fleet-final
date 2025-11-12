/**
 * EventTimeline Component
 * Displays recent events in a timeline format
 */

import { Card, CardContent, Typography, Box, Chip, List, ListItem, Avatar } from '@mui/material';
import {
  PlayArrow,
  CheckCircle,
  Cancel,
  LocationOn,
  Warning,
  Speed,
  LocalGasStation,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useFleet } from '../hooks/useFleet';
import { formatTimestamp } from '../utils/formatters';

export default function EventTimeline({ limit = 20 }) {
  const { currentEvents } = useFleet();

  // Get recent events
  const recentEvents = currentEvents.slice(-limit).reverse();

  const getEventIcon = (eventType) => {
    const icons = {
      trip_started: <PlayArrow />,
      trip_completed: <CheckCircle />,
      trip_cancelled: <Cancel />,
      location_ping: <LocationOn />,
      speed_violation: <Speed />,
      fuel_level_low: <LocalGasStation />,
      refueling_started: <LocalGasStation />,
      refueling_completed: <LocalGasStation />,
      device_error: <ErrorIcon />,
      signal_lost: <Warning />
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
      device_error: '#ef4444',
      signal_lost: '#f59e0b'
    };
    return colors[eventType] || '#3b82f6';
  };

  const getEventBgColor = (eventType) => {
    const colors = {
      trip_started: 'bg-green-50',
      trip_completed: 'bg-green-50',
      trip_cancelled: 'bg-red-50',
      speed_violation: 'bg-red-50',
      fuel_level_low: 'bg-amber-50',
      device_error: 'bg-red-50',
      signal_lost: 'bg-amber-50'
    };
    return colors[eventType] || 'bg-blue-50';
  };

  const formatEventName = (eventType) => {
    return eventType.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Card className="h-full">
      <CardContent>
        <Box className="flex items-center justify-between mb-4">
          <Typography variant="h6" className="font-semibold">
            Recent Events
          </Typography>
          <Chip
            label={`${currentEvents.length} total`}
            size="small"
            variant="outlined"
          />
        </Box>

        {recentEvents.length === 0 ? (
          <Box className="text-center py-8 text-gray-400">
            <Typography variant="body2">
              No events yet. Start the simulation to see events.
            </Typography>
          </Box>
        ) : (
          <List className="space-y-2 max-h-[600px] overflow-y-auto">
            {recentEvents.map((event, index) => (
              <ListItem
                key={`${event.event_id}-${index}`}
                className="border rounded-lg hover:shadow-md transition-shadow duration-200 flex-col items-start p-3"
              >
                <Box className="flex items-start gap-3 w-full">
                  <Avatar
                    className={`${getEventBgColor(event.event_type)} mt-1`}
                    sx={{
                      width: 40,
                      height: 40,
                      color: getEventColor(event.event_type),
                      backgroundColor: 'transparent'
                    }}
                  >
                    {getEventIcon(event.event_type)}
                  </Avatar>

                  <Box className="flex-1 min-w-0">
                    <Box className="flex items-start justify-between gap-2 mb-1">
                      <Typography variant="body2" className="font-semibold">
                        {formatEventName(event.event_type)}
                      </Typography>
                      <Chip
                        label={event.tripId?.replace('trip_', 'Trip ')}
                        size="small"
                        variant="outlined"
                        className="text-xs"
                      />
                    </Box>

                    <Typography variant="caption" color="textSecondary" className="block mb-1">
                      {formatTimestamp(event.timestamp)}
                    </Typography>

                    {/* Event-specific details */}
                    {event.movement?.speed_kmh !== undefined && (
                      <Typography variant="caption" className="text-gray-600">
                        Speed: {Math.round(event.movement.speed_kmh)} km/h
                      </Typography>
                    )}

                    {event.distance_travelled_km !== undefined && (
                      <Typography variant="caption" className="text-gray-600 ml-3">
                        Distance: {Math.round(event.distance_travelled_km)} km
                      </Typography>
                    )}

                    {event.error_message && (
                      <Typography variant="caption" className="text-red-600 block mt-1">
                        Error: {event.error_message}
                      </Typography>
                    )}

                    {event.cancellation_reason && (
                      <Typography variant="caption" className="text-red-600 block mt-1">
                        Reason: {event.cancellation_reason.replace('_', ' ')}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}

