import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import customMarkerImg from '../assets/map_marker.webp';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const lakes = [
  { name: "Lake Van", coordinates: [38.68797695147662, 43.03818004640291], volume: 3713, location: "Van, Bitlis", type: "Volcanic Barrier Lake", id: "Van Gölü" },
  { name: "Atatürk Dam", coordinates: [37.48639950236077, 38.31223077897824], volume: 817, location: "Adıyaman, Şanlıurfa, Diyarbakır", type: "Dam Lake", id: "Atatürk Baraj Gölü" },
  { name: "Keban Dam", coordinates: [38.63179456241192, 39.48392894933453], volume: 675, location: "Elazığ, Tunceli, Erzincan", type: "Dam Lake", id: "Keban Baraj Gölü" },
  { name: "Lake Beyşehir", coordinates: [37.79795868925656, 31.507278851782264], volume: 651, location: "Isparta, Konya", type: "Tectonic Lake", id: "Beyşehir Gölü" },
  { name: "Lake Eğirdir", coordinates: [38.01433810473422, 30.89267600968655], volume: 468, location: "Isparta", type: "Freshwater Lake", id: "Eğirdir Gölü" },
  { name: "Lake İznik", coordinates: [40.441525754617444, 29.52472975605974], volume: 298, location: "Bursa", type: "Freshwater Lake", id: "İznik Gölü" },
  { name: "Lake Karakaya", coordinates: [38.51217223498356, 38.42574950094676], volume: 268, location: "Diyarbakır, Malatya", type: "Dam Lake", id: "Karakaya Baraj Gölü" },
  { name: "Hirfanlı Dam", coordinates: [39.17453825303532, 33.634553889207936], volume: 263, location: "Kırşehir", type: "Dam Lake", id: "Hirfanlı Baraj Gölü" },
  { name: "Lake Burdur", coordinates: [37.73937288545174, 30.178793356055213], volume: 250, location: "Isparta, Burdur", type: "Tectonic Lake", id: "Burdur Gölü" },
  { name: "Lake Manyas", coordinates: [40.19373706334707, 27.96212437558574], volume: 166, location: "Balıkesir", type: "Freshwater Lake", id: "Manyas Kuşgölü" },
  { name: "Akyatan Lagoon", coordinates: [36.635238203737416, 35.254163512751234], volume: 147, location: "Adana", type: "Lagoon", id: "Akyatan Gölü" },
  { name: "Lake Uluabat", coordinates: [40.14087613840761, 28.628141373929317], volume: 136, location: "Bursa", type: "Freshwater Lake", id: "Uluabat Gölü" },
  { name: "Lake Çıldır", coordinates: [41.0464470640574, 43.238820601783594], volume: 120, location: "Ardahan, Kars", type: "Freshwater Lake", id: "Çıldır Gölü" }
];


const AnalysisPage = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current, {
      center: [39.925, 32.866],
      zoom: 6,
      maxZoom: 11,
      minZoom: 6,
      maxBounds: [
        [35.8, 25.7],
        [42.1, 44.8]
      ],
      maxBoundsViscosity: 1.0
    });

    // GeoJSON dosyalarını dinamik olarak içe aktar
    const importGeoJSONs = () => {
      const context = require.context('../assets/geojsons', false, /\.geojson$/); // GeoJSON dosyalarını oku
      return context.keys().map(context);
    };

    const geojsonFiles = importGeoJSONs();

    geojsonFiles.forEach(file => {
      fetch(file)
        .then(response => response.json())
        .then(data => {
          if (data.features[0].properties.name === 'Türkiye') {
            L.geoJSON(data, {
              style: {
                color: '#077317',
                weight: 1,
                fillColor: '#0fa626',
                fillOpacity: 0.2
              }
            }).addTo(mapInstance.current);
          } else {
            L.geoJSON(data, {
              style: {
                color: '#0077b6',
                weight: 2,
                fillColor: '#72bcd4',
                fillOpacity: 0.8
              }
            }).addTo(mapInstance.current);
          }

        })
        .catch(err => console.error(`Error loading ${file}:`, err));
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapInstance.current);

    // Özel simgeyi tanımlama
    const customIcon = L.icon({
      iconUrl: customMarkerImg, // Bu URL yerine kendi simgenizi koyabilirsiniz
      iconSize: [32, 32],  // Simgenin boyutu
      iconAnchor: [16, 32], // Simgenin ankraj noktası
      popupAnchor: [0, -32]  // Popup'ın marker ile olan mesafesi
    });

    lakes.forEach(lake => {
      const marker = L.marker(lake.coordinates, { icon: customIcon }).addTo(mapInstance.current);

      marker.bindPopup(`
        <b>${lake.name}</b><br />
        <a href="/lake/${lake.id}">More Details</a>
      `);
    });
  }, []);

  return (
    <Box 
  sx={{ 
    padding: 3, 
    backgroundColor: 'background.default', 
    color: 'text.primary', 
    minHeight: '100vh' 
  }}
>

      <Typography variant="h3" color="text.primary" align="center" gutterBottom>
        Water Resources Overview
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Box
          ref={mapRef}
          sx={{
            width: '100%',
            height: '650px',
            borderRadius: 2,
            boxShadow: 2,
            overflow: 'hidden',
            mb: 4
          }}
        ></Box>

        <Typography variant="h5" gutterBottom>
          Available Resources
        </Typography>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell><Typography variant="h6">Name</Typography></TableCell>
                <TableCell align="right"><Typography variant="h6">Area (km²)</Typography></TableCell>
                <TableCell align="right"><Typography variant="h6">Location</Typography></TableCell>
                <TableCell align="right"><Typography variant="h6">Type</Typography></TableCell>
                <TableCell align="right"><Typography variant="h6">Action</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lakes.map((lake) => (
                <TableRow key={lake.id}>
                  <TableCell>{lake.name}</TableCell>
                  <TableCell align="right">{lake.volume}</TableCell>
                  <TableCell align="right">{lake.location}</TableCell>
                  <TableCell align="right">{lake.type}</TableCell>
                  <TableCell align="right">
                    <Button variant="contained" color="primary" component={Link} to={`/lake/${lake.id}`}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default AnalysisPage;
