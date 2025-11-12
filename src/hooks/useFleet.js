/**
 * useFleet Hook
 * Custom hook to access fleet context
 */

import { useContext } from 'react';
import { FleetContext } from '../context/fleetContextDefinition';

export function useFleet() {
  const context = useContext(FleetContext);
  if (!context) {
    throw new Error('useFleet must be used within FleetProvider');
  }
  return context;
}

