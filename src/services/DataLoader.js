/**
 * DataLoader Service
 * Responsible for loading trip data files and providing access to trip events
 * Uses lazy loading and caching for performance
 */

class DataLoader {
  constructor() {
    // Cache loaded trip data using Map for O(1) access
    this.tripDataCache = new Map();
    this.tripMetadata = [
      { id: 'trip_1', file: 'trip_1_cross_country.json', name: 'Cross-Country Long Haul' },
      { id: 'trip_2', file: 'trip_2_urban_dense.json', name: 'Urban Dense Delivery' },
      { id: 'trip_3', file: 'trip_3_mountain_cancelled.json', name: 'Mountain Route Cancelled' },
      { id: 'trip_4', file: 'trip_4_southern_technical.json', name: 'Southern Technical Issues' },
      { id: 'trip_5', file: 'trip_5_regional_logistics.json', name: 'Regional Logistics' }
    ];
  }

  /**
   * Load a specific trip's data
   * @param {string} tripId - The trip identifier
   * @returns {Promise<Array>} Trip events array
   */
  async loadTripData(tripId) {
    // Return cached data if available
    if (this.tripDataCache.has(tripId)) {
      return this.tripDataCache.get(tripId);
    }

    const metadata = this.tripMetadata.find(t => t.id === tripId);
    if (!metadata) {
      throw new Error(`Trip ${tripId} not found`);
    }

    try {
      const response = await fetch(`/src/data/${metadata.file}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${metadata.file}`);
      }
      
      const data = await response.json();
      
      // Cache the loaded data
      this.tripDataCache.set(tripId, data);
      
      return data;
    } catch (error) {
      console.error(`Error loading trip ${tripId}:`, error);
      throw error;
    }
  }

  /**
   * Load all trip data
   * @returns {Promise<Map<string, Array>>} Map of trip_id -> events
   */
  async loadAllTrips() {
    const loadPromises = this.tripMetadata.map(async (metadata) => {
      const events = await this.loadTripData(metadata.id);
      return [metadata.id, events];
    });

    const results = await Promise.all(loadPromises);
    return new Map(results);
  }

  /**
   * Get trip metadata
   * @returns {Array} Array of trip metadata objects
   */
  getTripMetadata() {
    return [...this.tripMetadata];
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.tripDataCache.clear();
  }
}

// Singleton instance
export const dataLoader = new DataLoader();

