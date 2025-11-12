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
    <Card className="sticky top-4 z-10 shadow-lg">
      <CardContent>
        <Box className="flex items-center gap-4">
          {/* Playback Buttons */}
          <Box className="flex items-center gap-2">
            <IconButton
              onClick={reset}
              color="primary"
              className="hover:bg-blue-50"
              title="Reset"
            >
              <Replay />
            </IconButton>

            <IconButton
              onClick={isPlaying ? pause : play}
              color="primary"
              size="large"
              className="bg-blue-500 hover:bg-blue-600 text-white"
              sx={{
                backgroundColor: '#3b82f6',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#2563eb'
                }
              }}
            >
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
          </Box>

          {/* Progress Slider */}
          <Box className="flex-1">
            <Box className="flex justify-between items-center mb-1">
              <Typography variant="caption" color="textSecondary">
                Simulation Progress
              </Typography>
              <Chip
                label={`${Math.round(progress)}%`}
                size="small"
                color="primary"
                variant="outlined"
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
                  width: 16,
                  height: 16
                }
              }}
            />
            {currentTime && (
              <Typography variant="caption" color="textSecondary">
                Current Time: {formatTime(currentTime)}
              </Typography>
            )}
          </Box>

          {/* Speed Control */}
          <Box className="flex items-center gap-2 min-w-[150px]">
            <Speed className="text-gray-600" />
            <FormControl size="small" className="flex-1">
              <Select
                value={playbackSpeed}
                onChange={(e) => changeSpeed(e.target.value)}
                sx={{ minWidth: 100 }}
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
            color={isPlaying ? 'success' : 'default'}
            icon={isPlaying ? <PlayArrow /> : <Pause />}
            variant="outlined"
          />
        </Box>
      </CardContent>
    </Card>
  );
}

