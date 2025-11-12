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
      color: '#3b82f6',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Trips',
      value: fleetMetrics.activeTrips || 0,
      icon: <TrendingUp />,
      color: '#10b981',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Completed',
      value: fleetMetrics.completedTrips || 0,
      icon: <CheckCircle />,
      color: '#10b981',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Cancelled',
      value: fleetMetrics.cancelledTrips || 0,
      icon: <Cancel />,
      color: '#ef4444',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Total Distance',
      value: formatDistance(fleetMetrics.totalDistance || 0),
      icon: <TrendingUp />,
      color: '#8b5cf6',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Avg Fuel Level',
      value: `${fleetMetrics.avgFuelLevel || 0}%`,
      icon: <LocalGasStation />,
      color: '#f59e0b',
      bgColor: 'bg-amber-50'
    },
    {
      title: 'Critical Alerts',
      value: fleetMetrics.criticalAlerts || 0,
      icon: <Warning />,
      color: '#ef4444',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Vehicles Moving',
      value: fleetMetrics.vehiclesMoving || 0,
      icon: <DirectionsCar />,
      color: '#3b82f6',
      bgColor: 'bg-blue-50'
    }
  ];

  const progressChartConfig = getFleetProgressChartConfig(fleetMetrics);
  const distanceChartConfig = getFleetDistanceChartConfig(tripsWithMetadata);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h4" className="font-bold text-gray-900">
            Fleet Overview
          </Typography>
          <Typography variant="body2" className="text-gray-600 mt-1">
            Real-time monitoring of all fleet operations
          </Typography>
        </div>
        <Box className="flex gap-2">
          <Chip 
            label={`${fleetMetrics.completionRate || 0}% Completion Rate`}
            color="success"
            variant="outlined"
          />
          <Chip 
            label={`${fleetMetrics.progress50Plus || 0} trips 50%+`}
            color="info"
            variant="outlined"
          />
        </Box>
      </div>

      {/* Stats Grid */}
      <Grid container spacing={3}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent>
                <Box className="flex items-start justify-between">
                  <div>
                    <Typography variant="body2" color="textSecondary" className="mb-2">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" className="font-bold">
                      {stat.value}
                    </Typography>
                  </div>
                  <Box 
                    className={`${stat.bgColor} p-3 rounded-lg`}
                    sx={{ color: stat.color }}
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
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="font-semibold mb-4">
                Fleet Status Distribution
              </Typography>
              {progressChartConfig.series.reduce((a, b) => a + b, 0) > 0 ? (
                <Chart
                  options={progressChartConfig.options}
                  series={progressChartConfig.series}
                  type="donut"
                  height={280}
                />
              ) : (
                <Box className="h-[280px] flex items-center justify-center text-gray-400">
                  <Typography>No data available</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="font-semibold mb-4">
                Distance Traveled by Trip
              </Typography>
              {distanceChartConfig.series[0].data.some(d => d > 0) ? (
                <Chart
                  options={distanceChartConfig.options}
                  series={distanceChartConfig.series}
                  type="bar"
                  height={280}
                />
              ) : (
                <Box className="h-[280px] flex items-center justify-center text-gray-400">
                  <Typography>No distance data available</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

