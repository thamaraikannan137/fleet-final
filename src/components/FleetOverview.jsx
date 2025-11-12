/**
 * FleetOverview Component
 * Displays high-level fleet metrics and charts
 */

import { Grid, Card, CardContent, Typography, Box, Chip } from '@mui/material';
import {
  DirectionsCar,
  CheckCircle,
  Cancel,
  Warning,
  TrendingUp,
  LocalGasStation
} from '@mui/icons-material';
import Chart from 'react-apexcharts';
import { useFleetMetrics } from '../hooks/useFleetMetrics';
import { getFleetProgressChartConfig, getFleetDistanceChartConfig } from '../utils/chartConfigs';
import { formatDistance } from '../utils/formatters';

export default function FleetOverview() {
  const { fleetMetrics, tripsWithMetadata } = useFleetMetrics();

  const statsCards = [
    {
      title: 'Total Trips',
      value: fleetMetrics.totalTrips || 0,
      icon: <DirectionsCar />,
      color: '#7367F0',
      gradient: 'linear-gradient(135deg, #7367F0 0%, #9E95F5 100%)',
      shadowColor: 'rgba(115, 103, 240, 0.4)'
    },
    {
      title: 'Active Trips',
      value: fleetMetrics.activeTrips || 0,
      icon: <TrendingUp />,
      color: '#00CFE8',
      gradient: 'linear-gradient(135deg, #00CFE8 0%, #1CE7FF 100%)',
      shadowColor: 'rgba(0, 207, 232, 0.4)'
    },
    {
      title: 'Completed',
      value: fleetMetrics.completedTrips || 0,
      icon: <CheckCircle />,
      color: '#28C76F',
      gradient: 'linear-gradient(135deg, #28C76F 0%, #48DA89 100%)',
      shadowColor: 'rgba(40, 199, 111, 0.4)'
    },
    {
      title: 'Cancelled',
      value: fleetMetrics.cancelledTrips || 0,
      icon: <Cancel />,
      color: '#EA5455',
      gradient: 'linear-gradient(135deg, #EA5455 0%, #EE7D7E 100%)',
      shadowColor: 'rgba(234, 84, 85, 0.4)'
    },
    {
      title: 'Total Distance',
      value: formatDistance(fleetMetrics.totalDistance || 0),
      icon: <TrendingUp />,
      color: '#7367F0',
      gradient: 'linear-gradient(135deg, #9E95F5 0%, #7367F0 100%)',
      shadowColor: 'rgba(115, 103, 240, 0.4)'
    },
    {
      title: 'Avg Fuel Level',
      value: `${fleetMetrics.avgFuelLevel || 0}%`,
      icon: <LocalGasStation />,
      color: '#FF9F43',
      gradient: 'linear-gradient(135deg, #FF9F43 0%, #FFB976 100%)',
      shadowColor: 'rgba(255, 159, 67, 0.4)'
    },
    {
      title: 'Critical Alerts',
      value: fleetMetrics.criticalAlerts || 0,
      icon: <Warning />,
      color: '#EA5455',
      gradient: 'linear-gradient(135deg, #EA5455 0%, #EE7D7E 100%)',
      shadowColor: 'rgba(234, 84, 85, 0.4)'
    },
    {
      title: 'Vehicles Moving',
      value: fleetMetrics.vehiclesMoving || 0,
      icon: <DirectionsCar />,
      color: '#00CFE8',
      gradient: 'linear-gradient(135deg, #00CFE8 0%, #1CE7FF 100%)',
      shadowColor: 'rgba(0, 207, 232, 0.4)'
    }
  ];

  const progressChartConfig = getFleetProgressChartConfig(fleetMetrics);
  const distanceChartConfig = getFleetDistanceChartConfig(tripsWithMetadata);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
            Fleet Overview
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Real-time monitoring of all fleet operations
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Chip 
            label={`${fleetMetrics.completionRate || 0}% Completion`}
            sx={{
              bgcolor: 'rgba(40, 199, 111, 0.12)',
              color: '#28C76F',
              fontWeight: 600,
              border: 'none'
            }}
          />
          <Chip 
            label={`${fleetMetrics.progress50Plus || 0} trips 50%+`}
            sx={{
              bgcolor: 'rgba(0, 207, 232, 0.12)',
              color: '#00CFE8',
              fontWeight: 600,
              border: 'none'
            }}
          />
        </Box>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3}>
        {statsCards.map((stat, index) => (
          <Grid item size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card 
              sx={{ 
                position: 'relative',
                overflow: 'visible',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: `0px 8px 24px ${stat.shadowColor}`,
                }
              }}
            >
              <CardContent sx={{ pb: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        mb: 1.5,
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        fontSize: '0.75rem',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {stat.title}
                    </Typography>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 700,
                        color: 'text.primary',
                        fontSize: '1.75rem'
                      }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box 
                    sx={{ 
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      background: stat.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      boxShadow: `0 2px 8px ${stat.shadowColor}`,
                      '& svg': {
                        fontSize: 24
                      }
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item size={{ xs: 12, sm: 6, md: 5 }}>
          <Card>
            <CardContent>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  color: 'text.primary',
                  mb: 3,
                  fontSize: '1.125rem'
                }}
              >
                Fleet Status Distribution
              </Typography>
              {progressChartConfig.series.reduce((a, b) => a + b, 0) > 0 ? (
                <Chart
                  options={progressChartConfig.options}
                  series={progressChartConfig.series}
                  type="donut"
                  height={300}
                />
              ) : (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography sx={{ color: 'text.disabled' }}>No data available</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item size={{ xs: 12, sm: 6, md: 7 }} >
          <Card>
            <CardContent>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  color: 'text.primary',
                  mb: 3,
                  fontSize: '1.125rem'
                }}
              >
                Distance Traveled by Trip
              </Typography>
              {distanceChartConfig.series[0].data.some(d => d > 0) ? (
                <Chart
                  options={distanceChartConfig.options}
                  series={distanceChartConfig.series}
                  type="bar"
                  height={300}
                />
              ) : (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography sx={{ color: 'text.disabled' }}>No distance data available</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

