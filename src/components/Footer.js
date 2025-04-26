import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: 'background.paper',
                py: 6,
                mt: 'auto',
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" color="text.primary" gutterBottom>
                            AI Learning Hub
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Empowering education through AI-generated content and personalized learning experiences.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" color="text.primary" gutterBottom>
                            Quick Links
                        </Typography>
                        <Link component={RouterLink} to="/courses" color="text.secondary" display="block">
                            Courses
                        </Link>
                        <Link component={RouterLink} to="/generate" color="text.secondary" display="block">
                            Generate Material
                        </Link>
                        <Link component={RouterLink} to="/progress" color="text.secondary" display="block">
                            My Progress
                        </Link>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" color="text.primary" gutterBottom>
                            Connect With Us
                        </Typography>
                        <Box>
                            <IconButton color="primary" aria-label="Facebook">
                                <FacebookIcon />
                            </IconButton>
                            <IconButton color="primary" aria-label="Twitter">
                                <TwitterIcon />
                            </IconButton>
                            <IconButton color="primary" aria-label="LinkedIn">
                                <LinkedInIcon />
                            </IconButton>
                            <IconButton color="primary" aria-label="GitHub">
                                <GitHubIcon />
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>
                <Box mt={5}>
                    <Typography variant="body2" color="text.secondary" align="center">
                        {'© '}
                        {new Date().getFullYear()}
                        {' AI Learning Hub. All rights reserved.'}
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;