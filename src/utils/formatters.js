/**
 * Utility functions for formatting data
 */

/**
 * Format distance
 */
export function formatDistance(km) {
  if (km >= 1000) {
    return `${(km / 1000).toFixed(1)}k km`;
  }
  return `${Math.round(km)} km`;
}

/**
 * Format duration
 */
export function formatDuration(minutes) {
  if (minutes < 60) {
    return `${Math.round(minutes)}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
}

/**
 * Format timestamp
 */
export function formatTimestamp(timestamp) {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Format time only
 */
export function formatTime(timestamp) {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

/**
 * Format percentage
 */
export function formatPercentage(value) {
  return `${Math.round(value)}%`;
}

/**
 * Format speed
 */
export function formatSpeed(kmh) {
  return `${Math.round(kmh)} km/h`;
}

/**
 * Get status color for MUI
 */
export function getStatusColor(status) {
  const colors = {
    completed: 'success',
    in_progress: 'info',
    started: 'warning',
    cancelled: 'error',
    not_started: 'default'
  };
  return colors[status] || 'default';
}

/**
 * Get severity color
 */
export function getSeverityColor(severity) {
  const colors = {
    critical: 'error',
    moderate: 'warning',
    warning: 'warning',
    info: 'info'
  };
  return colors[severity] || 'default';
}

/**
 * Get event type icon name
 */
export function getEventTypeIcon(eventType) {
  const icons = {
    trip_started: 'PlayArrow',
    trip_completed: 'CheckCircle',
    trip_cancelled: 'Cancel',
    location_ping: 'LocationOn',
    signal_lost: 'SignalCellularConnectedNoInternet0Bar',
    signal_recovered: 'SignalCellular4Bar',
    vehicle_stopped: 'StopCircle',
    vehicle_moving: 'DirectionsCar',
    speed_violation: 'Speed',
    vehicle_telemetry: 'Engineering',
    device_error: 'Error',
    battery_low: 'BatteryAlert',
    fuel_level_low: 'LocalGasStation',
    refueling_started: 'LocalGasStation',
    refueling_completed: 'CheckCircle'
  };
  return icons[eventType] || 'Circle';
}

/**
 * Get alert severity
 */
export function getAlertSeverity(alertType) {
  const severities = {
    speed_violation: 'error',
    fuel_level_low: 'warning',
    battery_low: 'warning',
    device_error: 'error',
    signal_lost: 'warning',
    trip_cancelled: 'error'
  };
  return severities[alertType] || 'info';
}

