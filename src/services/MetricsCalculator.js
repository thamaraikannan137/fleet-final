/**
 * MetricsCalculator Service
 * Calculates fleet-wide and trip-specific metrics using pointer-based efficient computation
 */

export class MetricsCalculator {
  /**
   * Calculate metrics for a single trip
   * @param {Array} events - Trip events (references)
   * @param {Object} latestEvent - Latest event for the trip
   * @returns {Object} Trip metrics
   */
  static calculateTripMetrics(events, latestEvent) {
    if (!events || events.length === 0) {
      return {
        status: 'not_started',
        progress: 0,
        distance: 0,
        duration: 0,
        alerts: []
      };
    }

    // Use Set for O(1) lookup of event types
    const eventTypes = new Set(events.map(e => e.event_type));
    
    // Determine trip status
    let status = 'in_progress';
    if (eventTypes.has('trip_completed')) {
      status = 'completed';
    } else if (eventTypes.has('trip_cancelled')) {
      status = 'cancelled';
    } else if (eventTypes.has('trip_started') && events.length === 1) {
      status = 'started';
    }

    // Calculate distance traveled
    // For completed trips, use total_distance_km from trip_completed event
    let distance = 0;
    if (status === 'completed' && latestEvent?.total_distance_km !== undefined) {
      distance = latestEvent.total_distance_km;
    } else {
      distance = latestEvent?.distance_travelled_km || 0;
    }

    // Calculate duration
    const startEvent = events.find(e => e.event_type === 'trip_started');
    const endEvent = events[events.length - 1];
    const duration = startEvent && endEvent
      ? (new Date(endEvent.timestamp) - new Date(startEvent.timestamp)) / 1000 / 60
      : 0;

    // Calculate progress percentage
    let progress = 0;
    if (startEvent?.planned_distance_km && distance) {
      progress = Math.min((distance / startEvent.planned_distance_km) * 100, 100);
    }

    // Collect alerts and violations
    const alerts = this._extractAlerts(events);

    // Current speed
    const currentSpeed = latestEvent?.movement?.speed_kmh || 0;

    // Fuel level - find the most recent event with telemetry data
    let fuelLevel = null; // null means no data available
    // First, check for the most recent telemetry event
    const latestTelemetryEvent = [...events].reverse().find(e => e.telemetry?.fuel_level_percent !== undefined);
    if (latestTelemetryEvent) {
      fuelLevel = latestTelemetryEvent.telemetry.fuel_level_percent;
    } else if (eventTypes.has('refueling_completed')) {
      // If no telemetry but there's a refueling event, use that
      const refuelEvent = [...events].reverse().find(e => e.event_type === 'refueling_completed');
      fuelLevel = refuelEvent?.fuel_level_after_refuel || null;
    }

    // Battery level
    const batteryLevel = latestEvent?.device?.battery_level || 100;

    // Signal quality
    const signalQuality = latestEvent?.signal_quality || 'unknown';

    return {
      status,
      progress,
      distance,
      duration,
      alerts,
      currentSpeed,
      fuelLevel,
      batteryLevel,
      signalQuality,
      isMoving: latestEvent?.movement?.moving || false,
      lastUpdate: latestEvent?.timestamp
    };
  }

  /**
   * Calculate fleet-wide metrics
   * @param {Map} tripMetricsMap - Map of trip_id -> trip metrics
   * @returns {Object} Fleet metrics
   */
  static calculateFleetMetrics(tripMetricsMap) {
    const tripsArray = Array.from(tripMetricsMap.values());
    
    const totalTrips = tripsArray.length;
    const completedTrips = tripsArray.filter(t => t.status === 'completed').length;
    const cancelledTrips = tripsArray.filter(t => t.status === 'cancelled').length;
    const activeTrips = tripsArray.filter(t => t.status === 'in_progress' || t.status === 'started').length;

    // Progress milestones (only count active trips, not completed/cancelled)
    const progress50Plus = tripsArray.filter(t => 
      (t.status === 'in_progress' || t.status === 'started') && t.progress >= 50
    ).length;
    const progress80Plus = tripsArray.filter(t => 
      (t.status === 'in_progress' || t.status === 'started') && t.progress >= 80
    ).length;

    // Total distance
    const totalDistance = tripsArray.reduce((sum, t) => sum + t.distance, 0);

    // Active alerts count
    const totalAlerts = tripsArray.reduce((sum, t) => sum + t.alerts.length, 0);

    // Average fuel level (only for trips with fuel data)
    const tripsWithFuel = tripsArray.filter(t => 
      t.fuelLevel !== null && 
      t.fuelLevel !== undefined && 
      !isNaN(t.fuelLevel)
    );
    const avgFuelLevel = tripsWithFuel.length > 0
      ? tripsWithFuel.reduce((sum, t) => sum + t.fuelLevel, 0) / tripsWithFuel.length
      : null;

    // Critical alerts (speed violations, low fuel, signal loss)
    const criticalAlerts = tripsArray.reduce((count, trip) => {
      return count + trip.alerts.filter(a => 
        a.type === 'speed_violation' || 
        a.type === 'fuel_level_low' ||
        a.type === 'signal_lost'
      ).length;
    }, 0);

    // Vehicles moving
    const vehiclesMoving = tripsArray.filter(t => t.isMoving).length;

    return {
      totalTrips,
      completedTrips,
      cancelledTrips,
      activeTrips,
      progress50Plus,
      progress80Plus,
      totalDistance: Math.round(totalDistance),
      totalAlerts,
      criticalAlerts,
      avgFuelLevel: avgFuelLevel !== null ? Math.round(avgFuelLevel) : null,
      vehiclesMoving,
      completionRate: totalTrips > 0 ? (completedTrips / totalTrips * 100).toFixed(1) : 0
    };
  }

  /**
   * Extract alerts from trip events
   * @private
   */
  static _extractAlerts(events) {
    const alerts = [];
    const alertTypes = new Set([
      'speed_violation',
      'fuel_level_low',
      'battery_low',
      'device_error',
      'signal_lost',
      'trip_cancelled'
    ]);

    // Use pointer approach - iterate once and collect alert references
    events.forEach(event => {
      if (alertTypes.has(event.event_type)) {
        alerts.push({
          type: event.event_type,
          timestamp: event.timestamp,
          severity: event.severity || 'warning',
          message: this._getAlertMessage(event)
        });
      }
    });

    return alerts;
  }

  /**
   * Generate alert message
   * @private
   */
  static _getAlertMessage(event) {
    const messages = {
      speed_violation: `Speed violation: ${event.movement?.speed_kmh}km/h (limit: ${event.speed_limit_kmh}km/h)`,
      fuel_level_low: `Low fuel: ${event.fuel_level_percent}% remaining`,
      battery_low: `Low battery: ${event.battery_level_percent}% remaining`,
      device_error: event.error_message || 'Device error occurred',
      signal_lost: 'GPS signal lost',
      trip_cancelled: `Trip cancelled: ${event.cancellation_reason}`
    };

    return messages[event.event_type] || 'Alert';
  }
}

