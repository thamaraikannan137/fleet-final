/**
 * FleetContext
 * Global state management for fleet tracking using React Context
 * Uses refs for performance-critical operations
 */

import { useRef, useState, useEffect, useCallback } from 'react';
import { dataLoader } from '../services/DataLoader';
import { EventStreamManager } from '../services/EventStreamManager';
import { MetricsCalculator } from '../services/MetricsCalculator';
import { FleetContext } from './fleetContextDefinition';

export function FleetProvider({ children }) {
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [tripMetrics, setTripMetrics] = useState(new Map());
  const [fleetMetrics, setFleetMetrics] = useState({});
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(null);

  // Refs for pointer-based access (avoid re-renders)
  const eventStreamRef = useRef(null);
  const tripsDataRef = useRef(new Map());
  const cleanupFnRef = useRef(null);

  /**
   * Update all metrics based on current events
   */
  const updateMetrics = useCallback(() => {
    if (!eventStreamRef.current) return;

    const events = eventStreamRef.current.getCurrentEvents();
    setCurrentEvents(events);

    const latestEvents = eventStreamRef.current.getLatestEvents();
    const newTripMetrics = new Map();

    // Calculate metrics for each trip
    tripsDataRef.current.forEach((_, tripId) => {
      const tripEvents = events.filter(e => e.tripId === tripId);
      const latestEvent = latestEvents.get(tripId);
      const metrics = MetricsCalculator.calculateTripMetrics(tripEvents, latestEvent);
      newTripMetrics.set(tripId, metrics);
    });

    setTripMetrics(newTripMetrics);

    // Calculate fleet-wide metrics
    const fleetMetrics = MetricsCalculator.calculateFleetMetrics(newTripMetrics);
    setFleetMetrics(fleetMetrics);
  }, []);

  /**
   * Initialize fleet data
   */
  useEffect(() => {
    async function initializeFleet() {
      try {
        setIsLoading(true);
        
        // Load all trip data
        const tripsData = await dataLoader.loadAllTrips();
        tripsDataRef.current = tripsData;

        // Initialize event stream manager
        eventStreamRef.current = new EventStreamManager(tripsData);

        // Subscribe to event updates
        const unsubscribe = eventStreamRef.current.subscribe((update) => {
          if (update.type === 'event') {
            updateMetrics();
            setProgress(update.progress);
            setCurrentTime(eventStreamRef.current.getCurrentTime());
          } else if (update.type === 'reset') {
            setCurrentEvents([]);
            setProgress(0);
            setCurrentTime(null);
            setTripMetrics(new Map());
            setFleetMetrics({});
          } else if (update.type === 'skip') {
            updateMetrics();
            setProgress(update.progress);
            setCurrentTime(eventStreamRef.current.getCurrentTime());
          }
        });

        cleanupFnRef.current = unsubscribe;

        // Initial metrics calculation
        updateMetrics();

        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize fleet:', err);
        setError(err.message);
        setIsLoading(false);
      }
    }

    initializeFleet();

    return () => {
      if (cleanupFnRef.current) {
        cleanupFnRef.current();
      }
      if (eventStreamRef.current) {
        eventStreamRef.current.pause();
      }
    };
  }, [updateMetrics]);

  /**
   * Playback controls
   */
  const play = useCallback(() => {
    if (!eventStreamRef.current || isPlaying) return;

    setIsPlaying(true);
    eventStreamRef.current.play(50); // 50ms interval
  }, [isPlaying]);

  const pause = useCallback(() => {
    if (!eventStreamRef.current) return;

    eventStreamRef.current.pause();
    setIsPlaying(false);
  }, []);

  const reset = useCallback(() => {
    if (!eventStreamRef.current) return;

    eventStreamRef.current.reset();
    setIsPlaying(false);
  }, []);

  const skipTo = useCallback((index) => {
    if (!eventStreamRef.current) return;

    const wasPlaying = isPlaying;
    pause();
    eventStreamRef.current.skipTo(index);
    
    if (wasPlaying) {
      setTimeout(() => play(), 100);
    }
  }, [isPlaying, pause, play]);

  const changeSpeed = useCallback((speed) => {
    if (!eventStreamRef.current) return;

    eventStreamRef.current.setSpeed(speed);
    setPlaybackSpeed(speed);

    // Restart playback with new speed if playing
    if (isPlaying) {
      pause();
      setTimeout(() => play(), 50);
    }
  }, [isPlaying, pause, play]);

  /**
   * Get trip events
   */
  const getTripEvents = useCallback((tripId) => {
    if (!eventStreamRef.current) return [];
    return eventStreamRef.current.getTripEvents(tripId);
  }, []);

  /**
   * Get trip metadata
   */
  const getTripMetadata = useCallback(() => {
    return dataLoader.getTripMetadata();
  }, []);

  const value = {
    // State
    isLoading,
    error,
    currentEvents,
    tripMetrics,
    fleetMetrics,
    playbackSpeed,
    isPlaying,
    progress,
    currentTime,
    
    // Actions
    play,
    pause,
    reset,
    skipTo,
    changeSpeed,
    getTripEvents,
    getTripMetadata,
    
    // Refs (for direct access without re-render)
    eventStreamRef,
    tripsDataRef
  };

  return (
    <FleetContext.Provider value={value}>
      {children}
    </FleetContext.Provider>
  );
}

