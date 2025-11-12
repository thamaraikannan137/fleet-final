/**
 * useTripDetails Hook
 * Custom hook for accessing detailed trip information
 */

import { useMemo } from 'react';
import { useFleet } from './useFleet';

export function useTripDetails(tripId) {
  const { tripMetrics, getTripEvents, getTripMetadata } = useFleet();

  const tripMetadata = useMemo(() => {
    const metadata = getTripMetadata();
    return metadata.find(t => t.id === tripId);
  }, [tripId, getTripMetadata]);

  const tripMetric = tripMetrics.get(tripId) || {};

  const events = useMemo(() => {
    return getTripEvents(tripId);
  }, [tripId, getTripEvents]);

  // Event type counts
  const eventTypeCounts = useMemo(() => {
    const counts = {};
    events.forEach(event => {
      counts[event.event_type] = (counts[event.event_type] || 0) + 1;
    });
    return counts;
  }, [events]);

  // Latest location
  const latestLocation = useMemo(() => {
    const locationEvents = events.filter(e => e.location);
    if (locationEvents.length === 0) return null;
    const latest = locationEvents[locationEvents.length - 1];
    return latest.location;
  }, [events]);

  return {
    tripId,
    tripMetadata,
    metrics: tripMetric,
    events,
    eventTypeCounts,
    latestLocation,
    totalEvents: events.length
  };
}

