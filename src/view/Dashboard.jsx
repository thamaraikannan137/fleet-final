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
  Typography,
  Chip
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
    <Box hidden={value !== index} >
      {value === index && children}
    </Box>
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
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
            Loading Fleet Data...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
        <Alert severity="error" sx={{ maxWidth: 'md' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header with Gradient */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #7367F0 0%, #9E95F5 100%)',
          boxShadow: '0px 4px 8px -4px rgba(115, 103, 240, 0.42)',
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}
      >
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  mb: 0.5
                }}
              >
                <DirectionsCar sx={{ fontSize: 36 }} />
                Fleet Tracking Dashboard
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                Real-time monitoring and analytics for your fleet
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Chip 
                label="Live"
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 600,
                  '&::before': {
                    content: '""',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: '#28C76F',
                    marginRight: 1,
                    marginLeft: 1,
                    display: 'inline-block',
                    animation: 'pulse 2s infinite',
                  }
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Playback Controls */}
        <Box sx={{ mb: 3 }}>
          <PlaybackControls />
        </Box>

        {/* Navigation Tabs */}
        <Box 
          sx={{ 
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 1,
            mb: 3,
            overflow: 'hidden'
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '0.9375rem',
                fontWeight: 500,
                minHeight: 48,
                color: 'text.secondary',
                '&.Mui-selected': {
                  color: 'primary.main',
                  fontWeight: 600,
                },
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
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
              <Box
                component="button"
                onClick={() => setSelectedTrip(null)}
                sx={{
                  mb: 3,
                  px: 3,
                  py: 1.5,
                  color: 'primary.main',
                  bgcolor: 'rgba(115, 103, 240, 0.08)',
                  border: 'none',
                  borderRadius: 2,
                  cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'rgba(115, 103, 240, 0.12)'
                  }
                }}
              >
                ← Back to All Trips
              </Box>
              <TripDetailedView tripId={selectedTrip} />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {tripMetadata.map((trip) => (
                <Grid item size={{ xs: 12, md: 6, lg: 4 }} key={trip.id}>
                  <Box onClick={() => setSelectedTrip(trip.id)} sx={{ cursor: 'pointer' }}>
                    <TripCard tripId={trip.id} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={3}>
            <Grid item size={12}>
              <EventTimeline limit={50} />
            </Grid>            
          </Grid>
        </TabPanel>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider', mt: 8, py: 3 }}>
        <Container maxWidth="xl">
          <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
            Fleet Tracking Dashboard © 2025 | Real-time Fleet Management System
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

