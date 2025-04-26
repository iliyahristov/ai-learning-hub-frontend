import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    CircularProgress,
    LinearProgress,
    Avatar,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Divider,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { fetchUserCourses } from '../redux/slices/coursesSlice';
import { fetchLatestMaterials } from '../redux/slices/materialsSlice';
import { fetchUserStatistics } from '../redux/slices/progressSlice';
import { analyzeProgress } from '../redux/slices/aiSlice';
import SchoolIcon from '@mui/icons-material/School';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { user } = useAuth();
    const { userCourses, loading: coursesLoading } = useSelector((state) => state.courses);
    const { latestMaterials, loading: materialsLoading } = useSelector((state) => state.materials);
    const { statistics, loading: statsLoading } = useSelector((state) => state.progress);
    const { progressAnalysis, loading: aiLoading } = useSelector((state) => state.ai);

    useEffect(() => {
        dispatch(fetchUserCourses());
        dispatch(fetchLatestMaterials());
        dispatch(fetchUserStatistics());
        dispatch(analyzeProgress());
    }, [dispatch]);

    if (coursesLoading || materialsLoading || statsLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                {/* Welcome Section */}
                <Grid item xs={12}>
                    <Typography variant="h4" gutterBottom>
                        Welcome back, {user?.name}!
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        Here's an overview of your learning journey
                    </Typography>
                </Grid>

                {/* Statistics Cards */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={2}>
                                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                    <SchoolIcon />
                                </Avatar>
                                <Typography variant="h6">Courses</Typography>
                            </Box>
                            <Typography variant="h4">{userCourses?.length || 0}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Enrolled courses
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={2}>
                                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                                    <AutoStoriesIcon />
                                </Avatar>
                                <Typography variant="h6">Materials</Typography>
                            </Box>
                            <Typography variant="h4">{statistics?.totalMaterials || 0}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total materials
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={2}>
                                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                                    <CheckCircleIcon />
                                </Avatar>
                                <Typography variant="h6">Completed</Typography>
                            </Box>
                            <Typography variant="h4">{statistics?.completedMaterials || 0}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Completed materials
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={2}>
                                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                                    <TrendingUpIcon />
                                </Avatar>
                                <Typography variant="h6">Progress</Typography>
                            </Box>
                            <Typography variant="h4">
                                {statistics?.totalMaterials > 0
                                    ? Math.round((statistics.completedMaterials / statistics.totalMaterials) * 100)
                                    : 0}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Overall completion
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Courses */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Recent Courses
                            </Typography>
                            {userCourses?.length > 0 ? (
                                <List>
                                    {userCourses.slice(0, 3).map((course, index) => (
                                        <React.Fragment key={course.id}>
                                            <ListItem>
                                                <ListItemText
                                                    primary={course.title}
                                                    secondary={`${course.subject} - ${course.difficultyLevel}`}
                                                />
                                                <Box sx={{ minWidth: 100 }}>
                                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                                        {course.completedMaterialCount}/{course.materialCount} completed
                                                    </Typography>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={
                                                            course.materialCount > 0
                                                                ? (course.completedMaterialCount / course.materialCount) * 100
                                                                : 0
                                                        }
                                                    />
                                                </Box>
                                            </ListItem>
                                            {index < userCourses.length - 1 && <Divider />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No courses enrolled yet
                                </Typography>
                            )}
                            <Box mt={2}>
                                <Button component={RouterLink} to="/courses" variant="outlined" fullWidth>
                                    View All Courses
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Latest Materials */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Latest Materials
                            </Typography>
                            {latestMaterials?.length > 0 ? (
                                <List>
                                    {latestMaterials.slice(0, 3).map((material, index) => (
                                        <React.Fragment key={material.id}>
                                            <ListItem>
                                                <ListItemText
                                                    primary={material.title}
                                                    secondary={`${material.courseTitle} - ${material.contentType}`}
                                                />
                                                <Button
                                                    component={RouterLink}
                                                    to={`/materials/${material.id}`}
                                                    variant="contained"
                                                    size="small"
                                                >
                                                    View
                                                </Button>
                                            </ListItem>
                                            {index < latestMaterials.length - 1 && <Divider />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No materials available
                                </Typography>
                            )}
                            <Box mt={2}>
                                <Button component={RouterLink} to="/generate" variant="outlined" fullWidth>
                                    Generate New Material
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* AI Analysis */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                AI Progress Analysis
                            </Typography>
                            {aiLoading ? (
                                <Box display="flex" justifyContent="center" p={3}>
                                    <CircularProgress />
                                </Box>
                            ) : progressAnalysis ? (
                                <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-line' }}>
                                    {progressAnalysis}
                                </Typography>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No analysis available yet. Complete more materials to get personalized recommendations.
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;