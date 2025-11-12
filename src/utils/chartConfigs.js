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
 * Fleet progress donut chart config - Materio colors
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
        height: 300
      },
      labels: ['Completed', 'Active', 'Cancelled'],
      colors: ['#28C76F', '#00CFE8', '#EA5455'],
      legend: {
        position: 'bottom',
        fontSize: '14px',
        fontWeight: 500,
        markers: {
          radius: 4
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          fontWeight: 600
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total Trips',
                fontSize: '16px',
                fontWeight: 600,
                color: '#4B465C'
              },
              value: {
                fontSize: '24px',
                fontWeight: 700,
                color: '#7367F0'
              }
            }
          }
        }
      }
    }
  };
}

/**
 * Trip progress radial bar config - Materio colors
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
              formatter: (val) => `${val}%`,
              color: '#7367F0'
            }
          },
          track: {
            background: 'rgba(115, 103, 240, 0.12)'
          }
        }
      },
      colors: ['#7367F0'],
      labels: [tripName]
    }
  };
}

/**
 * Distance timeline chart config - Materio colors
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
        width: 3,
        colors: ['#7367F0']
      },
      colors: ['#7367F0'],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.5,
          opacityTo: 0.1,
          stops: [0, 90, 100]
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
          text: 'Distance (km)',
          style: {
            fontWeight: 600
          }
        }
      },
      tooltip: {
        x: {
          format: 'MMM dd, HH:mm'
        }
      },
      grid: {
        borderColor: 'rgba(75, 70, 92, 0.12)'
      }
    }
  };
}

/**
 * Speed chart config - Materio colors
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
        width: 3,
        colors: ['#00CFE8']
      },
      colors: ['#00CFE8'],
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
          text: 'Speed (km/h)',
          style: {
            fontWeight: 600
          }
        }
      },
      tooltip: {
        x: {
          format: 'MMM dd, HH:mm'
        }
      },
      grid: {
        borderColor: 'rgba(75, 70, 92, 0.12)'
      }
    }
  };
}

/**
 * Fleet distance comparison bar chart - Materio colors
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
          columnWidth: '50%',
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
          fontSize: '12px',
          fontWeight: 600,
          colors: ['#4B465C']
        }
      },
      colors: ['#7367F0'],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.4,
          gradientToColors: ['#9E95F5'],
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 0.8,
          stops: [0, 100]
        }
      },
      xaxis: {
        categories: tripNames,
        labels: {
          rotate: -45,
          rotateAlways: true,
          style: {
            fontWeight: 500
          }
        }
      },
      yaxis: {
        title: {
          text: 'Distance (km)',
          style: {
            fontWeight: 600
          }
        }
      },
      grid: {
        borderColor: 'rgba(75, 70, 92, 0.12)'
      }
    }
  };
}

