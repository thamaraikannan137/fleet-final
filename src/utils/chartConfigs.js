/**
 * ApexCharts configuration utilities
 */

/**
 * Get base chart options for dark/light mode
 */
export function getBaseChartOptions(isDarkMode = false) {
  return {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    theme: {
      mode: isDarkMode ? 'dark' : 'light'
    },
    tooltip: {
      theme: isDarkMode ? 'dark' : 'light'
    }
  };
}

/**
 * Fleet progress donut chart config
 */
export function getFleetProgressChartConfig(fleetMetrics) {
  return {
    series: [
      fleetMetrics.completedTrips || 0,
      fleetMetrics.activeTrips || 0,
      fleetMetrics.cancelledTrips || 0
    ],
    options: {
      ...getBaseChartOptions(),
      chart: {
        type: 'donut',
        height: 280
      },
      labels: ['Completed', 'Active', 'Cancelled'],
      colors: ['#10b981', '#3b82f6', '#ef4444'],
      legend: {
        position: 'bottom'
      },
      dataLabels: {
        enabled: true
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total Trips',
                fontSize: '16px',
                fontWeight: 600
              }
            }
          }
        }
      }
    }
  };
}

/**
 * Trip progress radial bar config
 */
export function getTripProgressChartConfig(progress, tripName) {
  return {
    series: [Math.round(progress)],
    options: {
      ...getBaseChartOptions(),
      chart: {
        type: 'radialBar',
        height: 200
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: '60%'
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              fontSize: '24px',
              fontWeight: 'bold',
              formatter: (val) => `${val}%`
            }
          },
          track: {
            background: '#e5e7eb'
          }
        }
      },
      colors: ['#3b82f6'],
      labels: [tripName]
    }
  };
}

/**
 * Distance timeline chart config
 */
export function getDistanceTimelineChartConfig(events) {
  const data = events
    .filter(e => e.distance_travelled_km !== undefined)
    .map(e => ({
      x: new Date(e.timestamp).getTime(),
      y: Math.round(e.distance_travelled_km)
    }));

  return {
    series: [{
      name: 'Distance',
      data
    }],
    options: {
      ...getBaseChartOptions(),
      chart: {
        type: 'area',
        height: 250,
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      colors: ['#3b82f6'],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.1
        }
      },
      xaxis: {
        type: 'datetime',
        labels: {
          datetimeFormatter: {
            hour: 'HH:mm'
          }
        }
      },
      yaxis: {
        title: {
          text: 'Distance (km)'
        }
      },
      tooltip: {
        x: {
          format: 'MMM dd, HH:mm'
        }
      }
    }
  };
}

/**
 * Speed chart config
 */
export function getSpeedChartConfig(events) {
  const data = events
    .filter(e => e.movement?.speed_kmh !== undefined)
    .map(e => ({
      x: new Date(e.timestamp).getTime(),
      y: Math.round(e.movement.speed_kmh)
    }));

  return {
    series: [{
      name: 'Speed',
      data
    }],
    options: {
      ...getBaseChartOptions(),
      chart: {
        type: 'line',
        height: 200,
        zoom: {
          enabled: false
        }
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      colors: ['#8b5cf6'],
      xaxis: {
        type: 'datetime',
        labels: {
          datetimeFormatter: {
            hour: 'HH:mm'
          }
        }
      },
      yaxis: {
        title: {
          text: 'Speed (km/h)'
        }
      },
      tooltip: {
        x: {
          format: 'MMM dd, HH:mm'
        }
      }
    }
  };
}

/**
 * Fleet distance comparison bar chart
 */
export function getFleetDistanceChartConfig(tripsWithMetadata) {
  const tripNames = tripsWithMetadata.map(t => t.name?.split(' ').slice(0, 2).join(' ') || t.id);
  const distances = tripsWithMetadata.map(t => Math.round(t.distance || 0));

  return {
    series: [{
      name: 'Distance Traveled',
      data: distances
    }],
    options: {
      ...getBaseChartOptions(),
      chart: {
        type: 'bar',
        height: 300
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 8,
          dataLabels: {
            position: 'top'
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => `${val} km`,
        offsetY: -20,
        style: {
          fontSize: '12px'
        }
      },
      colors: ['#3b82f6'],
      xaxis: {
        categories: tripNames,
        labels: {
          rotate: -45,
          rotateAlways: true
        }
      },
      yaxis: {
        title: {
          text: 'Distance (km)'
        }
      }
    }
  };
}

