/**
 * useFleetMetrics Hook
 * Custom hook for accessing fleet metrics with memoization
 */

import { useMemo } from 'react';
import { useFleet } from './useFleet';

export function useFleetMetrics() {
  const { fleetMetrics, tripMetrics, getTripMetadata } = useFleet();

  const tripMetadata = useMemo(() => getTripMetadata(), [getTripMetadata]);

  // Enhanced trip data with metadata
  const tripsWithMetadata = useMemo(() => {
    return tripMetadata.map(metadata => {
      const metrics = tripMetrics.get(metadata.id) || {};
      return {
        ...metadata,
        ...metrics
      };
    });
  }, [tripMetadata, tripMetrics]);

  // Active trips
  const activeTrips = useMemo(() => {
    return tripsWithMetadata.filter(t => 
      t.status === 'in_progress' || t.status === 'started'
    );
  }, [tripsWithMetadata]);

  // Completed trips
  const completedTrips = useMemo(() => {
    return tripsWithMetadata.filter(t => t.status === 'completed');
  }, [tripsWithMetadata]);

  // Trips with alerts
  const tripsWithAlerts = useMemo(() => {
    return tripsWithMetadata.filter(t => t.alerts && t.alerts.length > 0);
  }, [tripsWithMetadata]);

  return {
    fleetMetrics,
    tripMetrics,
    tripsWithMetadata,
    activeTrips,
    completedTrips,
    tripsWithAlerts
  };
}

