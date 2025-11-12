/**
 * PlaybackControls Component
 * Controls for real-time simulation playback
 */

import { Card, CardContent, Box, IconButton, Slider, Chip, Typography, Select, MenuItem, FormControl } from '@mui/material';
import {
  PlayArrow,
  Pause,
  Replay,
  Speed
} from '@mui/icons-material';
import { useFleet } from '../hooks/useFleet';
import { formatTime } from '../utils/formatters';

export default function PlaybackControls() {
  const {
    isPlaying,
    playbackSpeed,
    progress,
    currentTime,
    play,
    pause,
    reset,
    skipTo,
    changeSpeed,
    eventStreamRef
  } = useFleet();

  const handleProgressChange = (_, newValue) => {
    if (!eventStreamRef.current) return;
    const totalEvents = eventStreamRef.current.getTotalEvents();
    const newIndex = Math.floor((newValue / 100) * totalEvents);
    skipTo(newIndex);
  };

  const speedOptions = [
    { value: 1, label: '1x' },
    { value: 5, label: '5x' },
    { value: 10, label: '10x' },
    { value: 50, label: '50x' },
    { value: 100, label: '100x' }
  ];

  return (
    <Card 
      sx={{ 
        position: 'sticky',
        top: 16,
        zIndex: 10,
        boxShadow: '0px 4px 16px rgba(115, 103, 240, 0.16)'
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          {/* Playback Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={reset}
              sx={{
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'rgba(115, 103, 240, 0.08)'
                }
              }}
              title="Reset"
            >
              <Replay />
            </IconButton>

            <IconButton
              onClick={isPlaying ? pause : play}
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #7367F0 0%, #9E95F5 100%)',
                color: 'white',
                boxShadow: '0px 4px 12px rgba(115, 103, 240, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5E50EE 0%, #7367F0 100%)',
                  boxShadow: '0px 6px 16px rgba(115, 103, 240, 0.6)'
                }
              }}
            >
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
          </Box>

          {/* Progress Slider */}
          <Box sx={{ flex: 1, minWidth: 250 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'text.secondary',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Simulation Progress
              </Typography>
              <Chip
                label={`${Math.round(progress)}%`}
                size="small"
                sx={{
                  bgcolor: 'rgba(115, 103, 240, 0.12)',
                  color: 'primary.main',
                  fontWeight: 600,
                  border: 'none'
                }}
              />
            </Box>
            <Slider
              value={progress}
              onChange={handleProgressChange}
              min={0}
              max={100}
              step={0.1}
              sx={{
                '& .MuiSlider-thumb': {
                  width: 18,
                  height: 18,
                  boxShadow: '0px 2px 8px rgba(115, 103, 240, 0.3)'
                },
                '& .MuiSlider-track': {
                  height: 6,
                  background: 'linear-gradient(90deg, #7367F0 0%, #9E95F5 100%)'
                },
                '& .MuiSlider-rail': {
                  height: 6,
                  bgcolor: 'rgba(115, 103, 240, 0.12)'
                }
              }}
            />
            {currentTime && (
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'text.secondary',
                  fontWeight: 500
                }}
              >
                Current Time: {formatTime(currentTime)}
              </Typography>
            )}
          </Box>

          {/* Speed Control */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 150 }}>
            <Speed sx={{ color: 'primary.main' }} />
            <FormControl size="small" sx={{ flex: 1 }}>
              <Select
                value={playbackSpeed}
                onChange={(e) => changeSpeed(e.target.value)}
                sx={{ 
                  minWidth: 100,
                  fontWeight: 600
                }}
              >
                {speedOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Status Indicator */}
          <Chip
            label={isPlaying ? 'Playing' : 'Paused'}
            icon={isPlaying ? <PlayArrow /> : <Pause />}
            sx={{
              fontWeight: 600,
              ...(isPlaying ? {
                bgcolor: 'rgba(40, 199, 111, 0.12)',
                color: '#28C76F',
                '& .MuiChip-icon': {
                  color: '#28C76F'
                }
              } : {
                bgcolor: 'rgba(168, 170, 174, 0.12)',
                color: 'text.secondary',
                '& .MuiChip-icon': {
                  color: 'text.secondary'
                }
              })
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

