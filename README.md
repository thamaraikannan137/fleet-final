# Fleet Tracking Dashboard - Complete Implementation

## 🎉 Implementation Complete

A **production-ready real-time fleet tracking dashboard** built with React, Material-UI, Tailwind CSS, and ApexCharts. Features clean architecture, pointer-based data management, and comprehensive fleet monitoring capabilities.

## ✨ Live Demo

🔗 **[View Live Dashboard](#)** *(Update with your deployment URL)*

## 📸 Screenshots

*(Add screenshots of your dashboard here)*

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Overview

This is a comprehensive **real-time fleet tracking dashboard** that monitors 5 simultaneous vehicle trips with realistic fleet tracking events. The dashboard provides interactive visualizations, real-time metrics, and operational insights for fleet management.

## Dataset

You have two options for obtaining your assessment data:

### Option 1: Generate Your Own Unique Data (Highly Recommended)
Generate your own unique trip data using our fleet tracking simulator. This ensures you have a completely unique dataset and demonstrates technical proficiency.

**📖 [HOW_TO_GENERATE_DATA.md](./HOW_TO_GENERATE_DATA.md)** - Complete instructions for generating your assessment data

### Option 2: Use Pre-generated Fallback Data
If you encounter issues with data generation, pre-generated sample data is available in the `assessment-fallback-data/` folder.

## Data Structure

Your dataset contains **5 simultaneous trips** being driven by different drivers across the United States:

1. **Cross-Country Long Haul** - Transcontinental freight delivery (10,000+ events)
2. **Urban Dense Delivery** - Dense urban route with frequent updates (500+ events) 
3. **Mountain Route Cancelled** - Trip cancelled due to weather conditions (100+ events)
4. **Southern Technical Issues** - Route with device and technical problems (1,000+ events)
5. **Regional Logistics** - Regional route with fuel management events (2,000+ events)

Each trip progresses independently with its own timeline, events, and challenges. Your dashboard should handle monitoring all trips simultaneously while providing both individual trip details and fleet-wide insights.

**📖 [FLEET_TRACKING_EVENT_TYPES.md](./FLEET_TRACKING_EVENT_TYPES.md)** - Complete reference for all 27 event types in your dataset

## Tasks

### Dashboard Creation:

Build a comprehensive fleet tracking dashboard that displays:

- **Individual Trip Data**: Show detailed metrics and progress for each of the 5 concurrent trips
- **Collective Fleet Metrics**: Display overall fleet insights (e.g., how many trips completed 50%, 80%, etc.)
- **Real-time Simulation**: Use event timestamps to simulate live fleet tracking

You have complete creative freedom in choosing what metrics to display, how to visualize the data, and what insights to highlight. Focus on creating a dashboard that would be valuable for fleet managers monitoring multiple simultaneous trips.

### Real-time Data Simulation:

Since the trip data contains timestamps, you'll need to simulate real-time behavior. Here are some implementation hints (feel free to use any other approach you prefer):

- **Local Interval Function**: Use `setInterval()` or similar to process events based on their timestamps
- **Streaming API**: Create a mock API endpoint that serves events in real-time sequence
- **Playback Controls**: Allow users to control the simulation speed (1x, 5x, 10x speed)
- **Time-based Processing**: Filter and display events as if they're happening "now" based on simulation time

These are just suggestions - you're welcome to implement real-time simulation using any method that works best for your chosen tech stack and demonstrates your skills effectively.

### Technical Requirements:

- **Event Stream Processing**: Process events chronologically to simulate real-time data
- **State Management**: Track vehicle status, trip progress, and alert states
- **Performance**: Efficiently handle datasets with 10,000+ events
- **Responsive Design**: Ensure dashboard works across different screen sizes
- **User Experience**: Create intuitive navigation and information hierarchy

### Deployment:

- Deploy your fleet tracking dashboard to a hosting platform of your choice
- Make sure the dashboard is publicly accessible
- Ensure it can load and process the generated trip data files

## Evaluation Criteria

Your submission will be evaluated based on:

- **Real-time Processing**: Effectiveness in simulating and consuming real-time fleet tracking events
- **Dashboard Design**: Clarity, aesthetics, and usability of the interface
- **Technical Implementation**: Code quality, performance, and architecture decisions
- **Data Insights**: Ability to present meaningful trip and fleet insights
- **User Experience**: Intuitive navigation and information presentation


## Submission Guidelines

**Repository Setup (choose one approach):**

**Option 1: Clean Fork**
- Fork this repository and remove all generator code (`data-generator/`, `HOW_TO_GENERATE_DATA.md`, etc.)
- Keep only your generated trip data files (if required) and your dashboard implementation
- Update the README with your dashboard description and live URL

**Option 2: New Repository** 
- Create a new private repository for your dashboard implementation
- Copy your generated trip data files to your new repository
- Create your own README describing your dashboard and include the live URL

**For both approaches:**
- Complete your fleet tracking dashboard implementation
- Deploy the dashboard to a hosting platform
- **Repository Access:** Keep your repository private to avoid visibility by other candidates. Add the following email addresses as collaborators:
  - vedantp@mapup.ai
  - ajayap@mapup.ai 
  - asijitp@mapup.ai 
  - atharvd@mapup.ai
  - karkuvelpandip@mapup.ai

- Finally, please fill out the google form that you received via email to submit the assessment for review

## Getting Started

1. **Generate Your Data**: Follow [HOW_TO_GENERATE_DATA.md](./HOW_TO_GENERATE_DATA.md) to create your unique dataset
2. **Study Event Types**: Review [FLEET_TRACKING_EVENT_TYPES.md](./FLEET_TRACKING_EVENT_TYPES.md) to understand the data structure
3. **Plan Your Dashboard**: Design your approach for real-time visualization and event processing
4. **Build & Deploy**: Implement your solution and deploy to a hosting platform

---

## 🏗️ Architecture Highlights

### Clean Architecture
- **Services Layer**: Data loading, event streaming, metrics calculation
- **Context Layer**: Global state management with React Context
- **Hooks Layer**: Custom hooks for business logic
- **Components Layer**: Reusable UI components with MUI
- **Views Layer**: Page-level layouts

### Pointer-Based Data Management
- Uses refs and pointers instead of deep cloning
- Optimal performance for 10,000+ events
- O(1) data access with Map structures
- Minimal re-renders with strategic useRef usage

### Technology Stack
- **React 19**: Latest React with modern hooks
- **Material-UI**: Professional component library
- **Tailwind CSS**: Utility-first styling
- **ApexCharts**: Interactive data visualizations
- **Vite**: Fast build tool and dev server

## 📊 Key Features

✅ **Real-Time Simulation** - Play, pause, speed control (1x to 100x)  
✅ **Fleet Overview** - High-level metrics and charts  
✅ **Individual Trip Monitoring** - Detailed trip cards with progress  
✅ **Interactive Charts** - Donut, bar, area, line, and radial charts  
✅ **Event Timeline** - Real-time event feed  
✅ **Alert System** - Track violations and issues  
✅ **Responsive Design** - Works on all devices  
✅ **Clean Code** - Well-documented, maintainable  

## 📖 Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Detailed architecture documentation
- **[FEATURES.md](FEATURES.md)** - Complete feature list
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment guide for various platforms
- **[eventype.md](eventype.md)** - Fleet tracking event types reference

## 🎯 Implementation Highlights

### Real-Time Event Processing
- Chronological event stream simulation
- Efficient pointer-based event tracking
- Observer pattern for state updates
- Configurable playback speed

### Performance Optimizations
- Data caching with Map structures
- Memoized calculations with useMemo
- Stable callbacks with useCallback
- Strategic use of refs to avoid re-renders
- Lazy evaluation of metrics

### UI/UX Excellence
- Material Design principles
- Smooth animations and transitions
- Loading and error states
- Accessible components
- Mobile-first responsive design

## 📁 Project Structure

```
src/
├── services/        # Business logic & data management
├── context/         # State management
├── hooks/           # Custom React hooks
├── components/      # Reusable UI components
├── view/            # Page-level views
├── utils/           # Utility functions
└── data/            # Trip JSON files
```

## 🔧 Development

```bash
# Run development server
npm run dev

# Run linter
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Deployment

Deployed on: *[Add your hosting platform]*

The application is fully static and can be deployed to:
- Vercel (Recommended)
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 📈 Metrics & Analytics

The dashboard tracks:
- Fleet-wide completion rates
- Individual trip progress
- Distance traveled
- Speed profiles
- Fuel consumption
- Alert frequencies
- Event distributions

## 🎨 Design System

- **Colors**: Blue (primary), Purple (secondary), Green (success), Red (error)
- **Typography**: System fonts for optimal performance
- **Spacing**: 8px base unit
- **Shadows**: Subtle elevation system
- **Corners**: 8-12px rounded corners

## 🔒 Code Quality

- ✅ No linter errors
- ✅ Clean architecture
- ✅ Documented with JSDoc
- ✅ Modular and testable
- ✅ Performance optimized
- ✅ Responsive design

## 🎓 Key Learnings

This project demonstrates:
- Clean architecture principles
- Performance optimization with pointers
- Complex state management
- Real-time data simulation
- Professional dashboard development
- Modern React patterns

---

**Built with ❤️ using React, MUI, Tailwind CSS, and ApexCharts**
