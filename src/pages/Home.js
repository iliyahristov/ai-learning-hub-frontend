import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Rating,
  Avatar,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

const Home = () => {
  const features = [
    {
      icon: <SmartToyIcon sx={{ fontSize: 40 }} />,
      title: 'AI-Powered Learning',
      description: 'Generate personalized learning materials tailored to your needs using advanced AI technology.',
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      title: 'Track Your Progress',
      description: 'Monitor your learning journey with detailed analytics and recommendations.',
    },
    {
      icon: <AccountTreeIcon sx={{ fontSize: 40 }} />,
      title: 'Interactive Visualization',
      description: 'Transform complex concepts into visual diagrams and interactive content.',
    },
  ];

  const testimonials = [
    {
      name: 'John Doe',
      role: 'Student',
      avatar: 'J',
      rating: 5,
      comment: 'AI Learning Hub transformed the way I study. The personalized materials are exactly what I need!',
    },
    {
      name: 'Jane Smith',
      role: 'Teacher',
      avatar: 'J',
      rating: 5,
      comment: 'As an educator, this platform helps me create engaging content for my students effortlessly.',
    },
    {
      name: 'Mike Johnson',
      role: 'Developer',
      avatar: 'M',
      rating: 4,
      comment: 'The AI-generated materials for programming topics are surprisingly accurate and helpful.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                AI Learning Hub
              </Typography>
              <Typography variant="h5" paragraph>
                Revolutionize your learning experience with AI-powered personalized education
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{ mr: 2 }}
                >
                  Get Started
                </Button>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  color="inherit"
                  size="large"
                >
                  Sign In
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" justifyContent="center">
                <SchoolIcon sx={{ fontSize: 200, opacity: 0.8 }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Why Choose AI Learning Hub?
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          Discover how our platform combines AI technology with educational excellence
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 3,
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {feature.icon}
                </Box>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography>{feature.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom>
            What Our Users Say
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar sx={{ mr: 2 }}>{testimonial.avatar}</Avatar>
                      <Box>
                        <Typography variant="h6">{testimonial.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                    <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                    <Typography variant="body1">{testimonial.comment}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ my: 8, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Ready to Transform Your Learning?
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Join thousands of learners who are already benefiting from AI-powered education
        </Typography>
        <Button
          component={RouterLink}
          to="/register"
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 3 }}
        >
          Start Learning Now
        </Button>
      </Container>
    </Box>
  );
};

export default Home;