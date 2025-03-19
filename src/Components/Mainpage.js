import React from 'react';
import { Link } from 'react-router-dom';
import GlobeComponent from './GlobeComponent';
import { Box, Typography, Button, Container, Grid, Card, CardContent, CardMedia } from '@mui/material';

const MainPage = () => {
  return (
    <Box 
  sx={{ 
    textAlign: 'center', 
    padding: 4, 
    backgroundColor: 'background.default', 
    color: 'text.primary' 
  }}
>

      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 500,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#004f66',
          borderRadius: 2,
        }}
      >
        <Box sx={{ position: 'absolute', height: '140%', zIndex: 0 }}>
          <GlobeComponent />
        </Box>
        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: 4 }}>
          <Typography variant="h3" color="white" fontWeight="bold" sx={{ mb: 2, letterSpacing: 2 }}>
            Welcome to AquAI
          </Typography>
          <Typography variant="body1" color="white" sx={{ maxWidth: 800, mx: 'auto', lineHeight: 1.6 }}>
          Explore Türkiye's water resources and their critical role in ecosystems and communities.
          </Typography>
        </Box>
      </Box>

      {/* Introduction Section */}
      <Container sx={{ my: 8 }}>
        <Typography variant="h4" color="#004f66" fontWeight="bold" sx={{ mb: 4, textAlign: 'center' }}>
          About AquAI
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', textAlign: 'center', mb: 4 }}>
        AquAI is an innovative platform dedicated to monitoring and analyzing water resources globally. Using advanced AI technologies, we provide predictive insights and real-time data to support environmental sustainability and water management.
        </Typography>
      </Container>

      {/* Features Section */}
      <Container sx={{ my: 8 }}>
      <Link 
  to="/analysis"
  style={{ 
    textDecoration: 'none', 
    display: 'inline-block', 
    textAlign: 'center' 
  }}
>
  <Button 
    variant="contained" 
    sx={{ 
      mb: 4, 
      px: 4, 
      py: 2, 
      backgroundColor: '#004f66', 
      color: 'white', 
      fontWeight: 'bold', 
      fontSize: '1.5rem', 
      borderRadius: '20px', 
      '&:hover': { backgroundColor: '#003f55' } 
    }}
  >
    Features
  </Button>
</Link>
  <Grid container spacing={4} justifyContent="center">
    {features.map((feature, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Card sx={{ maxWidth: 345, boxShadow: 3, transition: 'transform 0.3s ease', '&:hover': { transform: 'translateY(-10px)' } }}>
          <CardMedia component="img" height="140" image={feature.image} alt={feature.title} />
          <CardContent>
            <Typography gutterBottom variant="h6" color="#004f66" fontWeight="bold">
              {feature.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {feature.description}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
</Container>

      {/* Footer */}
      <Box sx={{ mt: 8, py: 4, backgroundColor: '#004f66', color: 'white' }}>
        <Typography variant="body1">&copy; 2025 AquaTech. All Rights Reserved.</Typography>
      </Box>
    </Box>
  );
};

const features = [
  {
    title: 'Real-Time Data',
    description: 'Track water levels in real time with accurate, global data.',
    image: '/images/realtime.webp',
    link: '/analysis',
  },
  {
    title: 'Detailed Insights',
    description: 'Get detailed insights and forecasts to manage water resources effectively.',
    image: '/images/detailed.webp',
    link: '/analysis',
  },
  {
    title: 'Predictive Modeling',
    description: 'Utilize AI-driven predictive models to forecast water trends.',
    image: '/images/predictive.webp',
    link: '/analysis',
  },
];

export default MainPage;