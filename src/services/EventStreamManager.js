/**
 * EventStreamManager Service
 * Manages real-time event streaming simulation using pointer-based approach
 * Processes events chronologically across multiple trips
 */

export class EventStreamManager {
  constructor(tripsData) {
    // Map of trip_id -> events array (pointer to original data)
    this.tripsData = tripsData;
    
    // Map of trip_id -> current event index (pointer position)
    this.eventPointers = new Map();
    
    // Merged and sorted event timeline with pointers to original events
    this.eventTimeline = [];
    
    // Current simulation time
    this.currentTimeIndex = 0;
    
    // Simulation state
    this.isRunning = false;
    this.playbackSpeed = 1; // 1x, 5x, 10x, etc.
    
    // Event callbacks
    this.eventCallbacks = new Set();
    
    this._initialize();
  }

  /**
   * Initialize event timeline and pointers
   * @private
   */
  _initialize() {
    // Initialize pointers for each trip
    this.tripsData.forEach((_, tripId) => {
      this.eventPointers.set(tripId, 0);
    });

    // Create merged timeline with event references (pointers)
    const allEvents = [];
    this.tripsData.forEach((events, tripId) => {
      events.forEach((event, index) => {
        allEvents.push({
          tripId,
          eventIndex: index,
          timestamp: new Date(event.timestamp),
          eventRef: event // Pointer to original event object
        });
      });
    });

    // Sort by timestamp
    this.eventTimeline = allEvents.sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Get events up to current simulation time
   * @returns {Array} Array of events with their trip context
   */
  getCurrentEvents() {
    return this.eventTimeline.slice(0, this.currentTimeIndex).map(item => ({
      ...item.eventRef,
      tripId: item.tripId
    }));
  }

  /**
   * Get events for a specific trip up to current time
   * @param {string} tripId
   * @returns {Array} Events for the trip
   */
  getTripEvents(tripId) {
    const currentEvents = this.getCurrentEvents();
    return currentEvents.filter(event => event.tripId === tripId);
  }

  /**
   * Get the latest event for each trip
   * @returns {Map<string, Object>} Map of trip_id -> latest event
   */
  getLatestEvents() {
    const latestEvents = new Map();
    
    this.tripsData.forEach((_, tripId) => {
      const tripEvents = this.getTripEvents(tripId);
      if (tripEvents.length > 0) {
        latestEvents.set(tripId, tripEvents[tripEvents.length - 1]);
      }
    });

    return latestEvents;
  }

  /**
   * Advance simulation by one step
   * @returns {Object|null} Next event or null if at end
   */
  step() {
    if (this.currentTimeIndex >= this.eventTimeline.length) {
      this.pause();
      return null;
    }

    const nextEvent = this.eventTimeline[this.currentTimeIndex];
    this.currentTimeIndex++;

    // Notify subscribers
    this._notifySubscribers({
      type: 'event',
      event: { ...nextEvent.eventRef, tripId: nextEvent.tripId },
      progress: this.getProgress()
    });

    return nextEvent;
  }

  /**
   * Play simulation
   * @param {Function} callback - Optional callback for each event
   */
  play(intervalMs = 100) {
    if (this.isRunning) return;

    this.isRunning = true;
    
    const interval = setInterval(() => {
      if (!this.isRunning) {
        clearInterval(interval);
        return;
      }

      const event = this.step();
      if (!event) {
        clearInterval(interval);
      }
    }, intervalMs / this.playbackSpeed);

    return () => clearInterval(interval);
  }

  /**
   * Pause simulation
   */
  pause() {
    this.isRunning = false;
  }

  /**
   * Reset simulation to beginning
   */
  reset() {
    this.pause();
    this.currentTimeIndex = 0;
    this.eventPointers.forEach((_, tripId) => {
      this.eventPointers.set(tripId, 0);
    });

    this._notifySubscribers({
      type: 'reset',
      progress: 0
    });
  }

  /**
   * Skip to specific time index
   * @param {number} index
   */
  skipTo(index) {
    if (index < 0 || index > this.eventTimeline.length) return;
    
    this.currentTimeIndex = index;
    
    this._notifySubscribers({
      type: 'skip',
      progress: this.getProgress()
    });
  }

  /**
   * Set playback speed
   * @param {number} speed - 1x, 5x, 10x, etc.
   */
  setSpeed(speed) {
    this.playbackSpeed = speed;
  }

  /**
   * Get simulation progress
   * @returns {number} Progress percentage (0-100)
   */
  getProgress() {
    return (this.currentTimeIndex / this.eventTimeline.length) * 100;
  }

  /**
   * Subscribe to event updates
   * @param {Function} callback
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    this.eventCallbacks.add(callback);
    return () => this.eventCallbacks.delete(callback);
  }

  /**
   * Notify all subscribers
   * @private
   */
  _notifySubscribers(data) {
    this.eventCallbacks.forEach(callback => callback(data));
  }

  /**
   * Get total event count
   * @returns {number}
   */
  getTotalEvents() {
    return this.eventTimeline.length;
  }

  /**
   * Get current time
   * @returns {Date|null}
   */
  getCurrentTime() {
    if (this.currentTimeIndex === 0) return null;
    const current = this.eventTimeline[this.currentTimeIndex - 1];
    return current ? current.timestamp : null;
  }
}

