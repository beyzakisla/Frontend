import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import LakeService from '../services/LakeService';
import ReactLoading from 'react-loading';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import GIF from 'gif.js.optimized';

const LakeDetailPage = () => {
  const { lakeId } = useParams();
  const [lakeData, setLakeData] = useState(null);
  const [lakeGraphData, setLakeGraphData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [mode, setMode] = useState('shape');
  const [heatmapImage, setHeatmapImage] = useState(null); 
  const [loadingHeatmap, setLoadingHeatmap] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchLakeData = async () => {
      try {
        const data = await LakeService.getLakePolygons(lakeId);
        if (data && data.data && data.data.length > 0) {
          setLakeData(data);
          setLoading(false);
          const firstDate = data.data[0].date;
          setSelectedDate(firstDate);
          if (canvasRef.current) {
            drawPolygon(data.data[0].polygon);
          }
        } else {
          throw new Error('No lake data found.');
        }

        const graphData = await LakeService.getLakeGraph(lakeId);
        setLakeGraphData(graphData);
      } catch (error) {
        console.error(error);
        setError('Failed to load lake details.');
        setLoading(false);
      }
    };

    fetchLakeData();
  }, [lakeId]);

  useEffect(() => {
    const fetchHeatmapImage = async () => {
      setLoadingHeatmap(true);
      try {
        let formattedDate = new Date(selectedDate).toISOString().split('T')[0];
        const cutoffDate = '2024-09-01';

        if (formattedDate > cutoffDate) {
          formattedDate = cutoffDate;
        }

        const response = await fetch(`https://ai.aquai.tech/api/v1/lakes/heatmap?gol=${encodeURIComponent(lakeId)}&start=${formattedDate}&end=2024-10-01`);
        const imageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
        setHeatmapImage(imageUrl);
        setLoadingHeatmap(false);
      } catch (error) {
        console.error('Error fetching heatmap:', error);
        setLoadingHeatmap(false);
      }
    };

    if (mode === 'heatmap') {
      fetchHeatmapImage();
    }
  }, [mode, selectedDate]);

  const downloadGifFromSelectedDate = async () => {
    if (!lakeData || !lakeData.data || lakeData.data.length === 0) {
      console.error('No lake data available.');
      return;
    }
  
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas reference is not available.');
      return;
    }
  
    const gif = new GIF({
      workers: 2,
      quality: 10,
      workerScript: '/scripts/gif.worker.js', // Worker script path updated here
      width: canvas.width,
      height: canvas.height,
    });
  
    const filteredData = lakeData.data.filter(
      (entry) => new Date(entry.date) >= new Date(selectedDate)
    );
  
    if (filteredData.length === 0) {
      console.error('No data available for the selected date onward.');
      return;
    }
  
    gif.on('error', (error) => {
      console.error('Error during GIF rendering:', error);
    });
  
    for (const entry of filteredData) {
      drawPolygon(entry.polygon);
      gif.addFrame(canvas, { copy: true, delay: 100 });
    }
  
    gif.on('finished', (blob) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${lakeId}_polygons_${selectedDate}_to_end.gif`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  
    gif.render();
  };
  

  const handleSliderChange = (event, newValue) => {
    if (lakeData && lakeData.data && lakeData.data[newValue]) {
      setSelectedDate(lakeData.data[newValue].date);
      if (canvasRef.current) {
        drawPolygon(lakeData.data[newValue].polygon);
      }
    }
  };

  const drawPolygon = (polygon) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas element is not available.");
      return;
    }
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (polygon && polygon.coordinates && polygon.coordinates.length > 0) {
        const coordinates = polygon.coordinates[0];
        const minX = Math.min(...coordinates.map((point) => point[0]));
        const maxX = Math.max(...coordinates.map((point) => point[0]));
        const minY = Math.min(...coordinates.map((point) => point[1]));
        const maxY = Math.max(...coordinates.map((point) => point[1]));
        const scaleX = canvas.width / (maxX - minX);
        const scaleY = canvas.height / (maxY - minY);
        const scale = Math.min(scaleX, scaleY);
        const offsetX = (canvas.width - (maxX - minX) * scale) / 2;
        const offsetY = (canvas.height - (maxY - minY) * scale) / 2;
  
        ctx.beginPath();
        const firstPoint = coordinates[0];
        ctx.moveTo(
          (firstPoint[0] - minX) * scale + offsetX,
          (firstPoint[1] - minY) * scale + offsetY
        );
  
        coordinates.forEach((point) => {
          ctx.lineTo(
            (point[0] - minX) * scale + offsetX,
            (point[1] - minY) * scale + offsetY
          );
        });
  
        ctx.closePath();
        // Set lake shape colors
        ctx.strokeStyle = "#3498db"; // Blue stroke
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "rgba(52, 152, 219, 0.5)"; // Light blue fill with transparency
        ctx.fill();
      }
    } else {
      console.error("Canvas context is not available.");
    }
  };

  useEffect(() => {
    if (mode === 'heatmap' && intervalId) {
      clearInterval(intervalId); // Stop the slider
      setIntervalId(null); // Reset the intervalId
      setPlaying(false); // Ensure the slider is marked as not playing
    }
  }, [mode, intervalId]);
  
  const handlePlayPause = () => {
    if (mode === 'heatmap') {
      console.warn('Slider is disabled in Heatmap mode.');
      return; // Prevent play action in heatmap mode
    }
  
    if (playing) {
      clearInterval(intervalId);
      setIntervalId(null);
      setPlaying(false);
    } else {
      const interval = setInterval(() => {
        setSelectedDate((prevDate) => {
          const currentIndex = lakeData.data.findIndex((item) => item.date === prevDate);
          const nextIndex = (currentIndex + 1) % lakeData.data.length;
          const nextDate = lakeData.data[nextIndex].date;
          drawPolygon(lakeData.data[nextIndex].polygon);
          return nextDate;
        });
      }, 50);
      setIntervalId(interval);
      setPlaying(true);
    }
  };

  if (loading) return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: (theme) => theme.palette.background.default, // Dark mode background
        color: (theme) => theme.palette.text.primary, // Adapts text color to theme
      }}
    >
      <ReactLoading 
        type="bubbles" 
        color={(theme) => theme.palette.text.primary} // Match loader color to text color
        height={100} 
        width={100} 
      />
    </Box>
  );

  if (error) return (
    <Box
  sx={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: (theme) => theme.palette.background.default,
    color: (theme) => theme.palette.text.primary,
  }}
>
      <Typography variant="h4" color="error">Error</Typography>
      <Typography variant="body1">{error}</Typography>
      <Button variant="contained" onClick={() => window.location.reload()}>Retry</Button>
    </Box>
  );

  return (
    <Box
  sx={{
    padding: 2,
    minHeight: '100vh', 
    backgroundColor: (theme) => theme.palette.background.default,
    color: (theme) => theme.palette.text.primary,
  }}
>
      <Typography variant="h4" align="center">{lakeId}</Typography>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', alignItems: 'stretch', marginTop: 2 }}>
        <Box sx={{ flex: 1, border: '2px solid #3498db', borderRadius: '8px', padding: 2, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ marginRight: 1 }}>Show Heatmap</Typography>
            <Switch
  checked={mode === 'heatmap'}
  onChange={() => setMode(mode === 'heatmap' ? 'shape' : 'heatmap')}
  title="Heatmap shows lake how much change between selected date and now"
  sx={{
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: (theme) => theme.palette.primary.main,
    },
    '& .MuiSwitch-track': {
      backgroundColor: (theme) => theme.palette.primary.main,
    },
  }}
/>
          </Box>

          <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
            <Typography variant="h6">Lake Shape at Selected Date</Typography>
            {mode === 'shape' ? (
              <canvas ref={canvasRef} width={540} height={360}></canvas>
            ) : (
              loadingHeatmap ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '360px' }}>
                  <ReactLoading
  type="bubbles"
  color={(theme) => theme.palette.text.primary}
  height={100}
  width={100}
/>
                </Box>
              ) : (
                <img
  src={heatmapImage}
  alt="Lake Heatmap"
  style={{
    width: '100%',
    maxWidth: '540px',
    borderRadius: '8px',
    backgroundColor: (theme) => theme.palette.background.default,
    border: `1px solid ${(theme) => theme.palette.divider}`,
  }}
/>
              )
            )}
          </Box>

          <Box sx={{ textAlign: 'center', paddingLeft: 5, paddingRight: 5 }}>
            {lakeData && lakeData.data && lakeData.data.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {mode !== 'heatmap' && (
  <Button
    variant="contained"
    onClick={handlePlayPause}
    sx={{
      borderRadius: '50%',
      minWidth: '40px',
      minHeight: '40px',
      padding: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    {playing ? (
      <span>&#10074;&#10074;</span> // Unicode for pause icon
    ) : (
      <span>&#9658;</span> // Unicode for play icon
    )}
  </Button>
)}

                <Slider
  value={lakeData.data.sort((a, b) => new Date(a.date) - new Date(b.date)).findIndex(item => item.date === selectedDate)}
  min={0}
  max={lakeData.data.length - 1}
  step={1}
  onChange={handleSliderChange}
  valueLabelDisplay="auto"
  valueLabelFormat={(value) => new Date(lakeData.data[value].date).toLocaleDateString('en-GB')}
  sx={{
    '& .MuiSlider-thumb': {
      backgroundColor: (theme) => theme.palette.primary.main,
    },
    '& .MuiSlider-track': {
      backgroundColor: (theme) => theme.palette.primary.main,
    },
    '& .MuiSlider-rail': {
      backgroundColor: (theme) => theme.palette.divider,
    },
  }}
/>
<Button
  variant="contained"
  onClick={downloadGifFromSelectedDate}
  sx={{
    borderRadius: '50%',
    minWidth: '40px',
    minHeight: '40px',
    padding: 0,
    display: mode === 'heatmap' ? 'none' : 'flex', // Hide in heatmap mode
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
  <span>&#128190;</span> {/* Unicode for floppy disk icon */}
</Button>

              </Box>
            )}
            <Typography variant="body1">Selected Date: {new Date(selectedDate).toLocaleDateString('en-GB')}</Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1, paddingBottom: 3, border: '2px solid #3498db', borderRadius: '8px', padding: 2, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" align="center">Lake Graph</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
            {lakeGraphData && (
              <img
              src={`data:image/png;base64,${lakeGraphData.data}`}
              alt="Lake Water Level Graph"
              style={{
                width: '100%',
                maxWidth: '600px',
                borderRadius: '8px',
                boxShadow: (theme) =>
                  theme.palette.mode === 'dark' ? '0 2px 5px rgba(255, 255, 255, 0.1)' : '0 2px 5px rgba(0, 0, 0, 0.1)',
                backgroundColor: (theme) => theme.palette.background.default,
              }}
            />
            
            )}
          </Box>
        </Box>
      </Box>

      <Box sx={{ textAlign: 'center', marginTop: 2 }}>
        <Button variant="outlined" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </Box>
    </Box>
  );
};

export default LakeDetailPage;
