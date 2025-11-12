/**
 * Dashboard View
 * Main dashboard layout integrating all components
 */

import { useState } from 'react';
import {
  Container,
  Box,
  Tabs,
  Tab,
  Grid,
  CircularProgress,
  Alert,
  Typography
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  DirectionsCar,
  Timeline
} from '@mui/icons-material';
import { useFleet } from '../hooks/useFleet';
import FleetOverview from '../components/FleetOverview';
import TripCard from '../components/TripCard';
import PlaybackControls from '../components/PlaybackControls';
import EventTimeline from '../components/EventTimeline';
import TripDetailedView from '../components/TripDetailedView';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} className="py-6">
      {value === index && children}
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const { isLoading, error, getTripMetadata } = useFleet();

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
    setSelectedTrip(null);
  };

  if (isLoading) {
    return (
      <Box className="min-h-screen flex items-center justify-center bg-gray-50">
        <Box className="text-center">
          <CircularProgress size={60} />
          <Typography variant="h6" className="mt-4 text-gray-600">
            Loading Fleet Data...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Alert severity="error" className="max-w-md">
          <Typography variant="h6" className="mb-2">
            Failed to Load Fleet Data
          </Typography>
          <Typography variant="body2">
            {error}
          </Typography>
        </Alert>
      </Box>
    );
  }

  const tripMetadata = getTripMetadata();

  return (
    <Box className="min-h-screen bg-gray-50">
      {/* Header */}
      <Box className="bg-white shadow-sm border-b sticky top-0 z-20">
        <Container maxWidth="xl" className="py-4">
          <Box className="flex items-center justify-between">
            <div>
              <Typography variant="h4" className="font-bold text-gray-900 flex items-center gap-2">
                <DirectionsCar className="text-blue-500" fontSize="large" />
                Fleet Tracking Dashboard
              </Typography>
              <Typography variant="body2" className="text-gray-600 mt-1">
                Real-time monitoring and analytics
              </Typography>
            </div>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" className="py-6">
        {/* Playback Controls */}
        <Box className="mb-6">
          <PlaybackControls />
        </Box>

        {/* Navigation Tabs */}
        <Box className="bg-white rounded-lg shadow-sm mb-6">
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500
              }
            }}
          >
            <Tab
              icon={<DashboardIcon />}
              label="Fleet Overview"
              iconPosition="start"
            />
            <Tab
              icon={<DirectionsCar />}
              label="Individual Trips"
              iconPosition="start"
            />
            <Tab
              icon={<Timeline />}
              label="Event Timeline"
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={activeTab} index={0}>
          <FleetOverview />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          {selectedTrip ? (
            <Box>
              <button
                onClick={() => setSelectedTrip(null)}
                className="mb-4 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                ← Back to All Trips
              </button>
              <TripDetailedView tripId={selectedTrip} />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {tripMetadata.map((trip) => (
                <Grid item xs={12} md={6} lg={4} key={trip.id}>
                  <div onClick={() => setSelectedTrip(trip.id)} className="cursor-pointer">
                    <TripCard tripId={trip.id} />
                  </div>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <EventTimeline limit={50} />
            </Grid>
            <Grid item xs={12} lg={4}>
              <Box className="space-y-4">
                <Typography variant="h6" className="font-semibold mb-4">
                  Quick Trip Status
                </Typography>
                {tripMetadata.map((trip) => (
                  <TripCard key={trip.id} tripId={trip.id} />
                ))}
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
      </Container>

      {/* Footer */}
      <Box className="bg-white border-t mt-12 py-6">
        <Container maxWidth="xl">
          <Typography variant="body2" className="text-center text-gray-600">
            Fleet Tracking Dashboard © 2025 | Real-time Fleet Management System
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

