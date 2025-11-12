# Fleet Tracking Dashboard - Architecture Documentation

## 🏗️ Clean Architecture Overview

This project follows a **clean architecture** pattern with clear separation of concerns, using React with **pointer-based data management** for optimal performance.

## 📁 Project Structure

```
src/
├── services/           # Business logic & data management layer
│   ├── DataLoader.js          # Trip data loading with caching
│   ├── EventStreamManager.js  # Real-time event streaming (pointer-based)
│   └── MetricsCalculator.js   # Fleet & trip metrics calculation
│
├── context/           # State management layer
│   ├── fleetContextDefinition.js  # React context definition
│   └── FleetContext.jsx           # Fleet state provider
│
├── hooks/             # Custom React hooks layer
│   ├── useFleet.js           # Fleet context access hook
│   ├── useFleetMetrics.js    # Fleet metrics with memoization
│   └── useTripDetails.js     # Individual trip details hook
│
├── components/        # UI components layer
│   ├── FleetOverview.jsx      # Fleet-wide metrics & charts
│   ├── TripCard.jsx           # Individual trip card
│   ├── TripDetailedView.jsx   # Detailed trip view with charts
│   ├── PlaybackControls.jsx   # Simulation playback controls
│   └── EventTimeline.jsx      # Real-time event feed
│
├── view/              # Page-level views
│   └── Dashboard.jsx          # Main dashboard layout
│
├── utils/             # Utility functions
│   ├── formatters.js          # Data formatting utilities
│   └── chartConfigs.js        # ApexCharts configurations
│
└── data/              # Trip data files (JSON)
    ├── trip_1_cross_country.json
    ├── trip_2_urban_dense.json
    ├── trip_3_mountain_cancelled.json
    ├── trip_4_southern_technical.json
    └── trip_5_regional_logistics.json
```

## 🎯 Key Architectural Decisions

### 1. **Pointer-Based Data Management**

The application uses **refs and pointers** instead of deep cloning for optimal performance:

```javascript
// EventStreamManager uses pointers to original event data
this.eventTimeline = allEvents.map((event, index) => ({
  tripId,
  eventIndex: index,
  timestamp: new Date(event.timestamp),
  eventRef: event // Pointer to original event object
}));
```

**Benefits:**
- O(1) data access
- Minimal memory footprint
- No unnecessary re-renders
- Efficient for large datasets (10,000+ events)

### 2. **Service Layer Pattern**

All business logic is encapsulated in service classes:

- **DataLoader**: Handles data fetching with caching strategy
- **EventStreamManager**: Manages event streaming with pointer tracking
- **MetricsCalculator**: Pure functions for metric calculations

### 3. **React Context for Global State**

FleetContext manages global state with:
- `useRef` for performance-critical data (avoids re-renders)
- `useState` for UI state that needs reactivity
- `useCallback` for memoized functions

### 4. **Custom Hooks for Business Logic**

Hooks encapsulate business logic and provide clean APIs:

```javascript
const { tripsWithMetadata, activeTrips, completedTrips } = useFleetMetrics();
const { metrics, events, eventTypeCounts } = useTripDetails(tripId);
```

## 🔄 Real-Time Simulation Architecture

### Event Stream Processing

The `EventStreamManager` simulates real-time events using:

1. **Merged Timeline**: All trip events merged and sorted chronologically
2. **Pointer Tracking**: Current position in the timeline
3. **Playback Controls**: Play, pause, skip, speed adjustment
4. **Observer Pattern**: Subscribers notified of state changes

```javascript
// Subscribe to event updates
eventStreamRef.current.subscribe((update) => {
  if (update.type === 'event') {
    updateMetrics();
    setProgress(update.progress);
  }
});
```

### Playback Speeds

Supports multiple playback speeds (1x, 5x, 10x, 50x, 100x) for quick simulation testing.

## 🎨 UI Technology Stack

### Material-UI (MUI)
- Pre-built, accessible components
- Consistent theming system
- Responsive grid layout

### Tailwind CSS
- Utility-first styling
- Custom responsive design
- Quick prototyping

### ApexCharts
- **Donut Chart**: Fleet status distribution
- **Bar Chart**: Distance comparison
- **Area Chart**: Distance over time
- **Line Chart**: Speed profile
- **Radial Bar**: Trip progress

## 📊 Metrics & Analytics

### Fleet-Wide Metrics
- Total/Active/Completed/Cancelled trips
- Total distance traveled
- Average fuel level
- Critical alerts count
- Vehicles in motion
- Completion rate percentage

### Trip-Specific Metrics
- Progress percentage
- Distance traveled
- Duration
- Current speed
- Fuel & battery levels
- Signal quality
- Active alerts

## 🚀 Performance Optimizations

1. **Data Caching**: Loaded trip data cached in Map structure
2. **Pointer References**: No data cloning, direct references
3. **Memoization**: useMemo for expensive computations
4. **useCallback**: Stable function references
5. **Lazy Evaluation**: Metrics calculated only when needed
6. **Efficient Filtering**: Set-based lookups for O(1) operations

## 🔧 Configuration & Extensibility

### Adding New Event Types

1. Update `utils/formatters.js` with icon/color mappings
2. Add handler in `MetricsCalculator.js` if needed
3. Update chart configurations in `utils/chartConfigs.js`

### Adding New Metrics

1. Add calculation logic to `MetricsCalculator.js`
2. Update `FleetContext` to expose new metrics
3. Create UI components to display metrics

### Adding New Charts

1. Create chart config in `utils/chartConfigs.js`
2. Add ApexCharts component in relevant view
3. Pass data from hooks to chart component

## 🎯 Data Flow

```
JSON Files → DataLoader (cache) → EventStreamManager (pointers)
                                          ↓
                                    FleetContext
                                          ↓
                              Custom Hooks (memoization)
                                          ↓
                                   UI Components
                                          ↓
                                  MUI + Tailwind + Charts
```

## 🧪 Testing Strategy

The architecture supports easy testing:

1. **Services**: Pure functions, easy to unit test
2. **Hooks**: Can be tested with React Testing Library
3. **Components**: Isolated, testable with mock contexts
4. **E2E**: Simulation can be controlled programmatically

## 🔐 Key Design Patterns Used

1. **Singleton Pattern**: DataLoader instance
2. **Observer Pattern**: Event stream subscriptions
3. **Provider Pattern**: React Context
4. **Custom Hook Pattern**: Reusable logic
5. **Factory Pattern**: Chart configurations
6. **Strategy Pattern**: Different metric calculations

## 📝 Notes on Implementation

- **No prop drilling**: Context eliminates deep prop passing
- **Type safety**: JSDoc comments for better IDE support
- **Code organization**: Clear separation of concerns
- **Scalability**: Easy to add new features
- **Maintainability**: Well-documented, modular code

## 🚦 Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎓 Learning Points

This architecture demonstrates:
- Clean separation of concerns
- Performance optimization techniques
- Modern React patterns
- Real-time data simulation
- Complex state management
- Professional dashboard development

---

**Built with React 19, MUI, Tailwind CSS, and ApexCharts**

