import React, { useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Chip,
    Breadcrumbs,
    Link,
    LinearProgress,
} from '@mui/material';
import { fetchCourseById } from '../redux/slices/coursesSlice';
import { fetchMaterialsByCourse } from '../redux/slices/materialsSlice';
import { fetchProgressForCourse } from '../redux/slices/progressSlice';
import ArticleIcon from '@mui/icons-material/Article';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const CourseDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { currentCourse, loading: courseLoading } = useSelector((state) => state.courses);
    const { materials, loading: materialsLoading } = useSelector((state) => state.materials);
    const { courseProgress, loading: progressLoading } = useSelector((state) => state.progress);

    useEffect(() => {
        dispatch(fetchCourseById(id));
        dispatch(fetchMaterialsByCourse(id));
        dispatch(fetchProgressForCourse(id));
    }, [dispatch, id]);

    const getProgressForMaterial = (materialId) => {
        return courseProgress.find(p => p.materialId === materialId);
    };

    const completedMaterials = courseProgress.filter(p => p.status === 'COMPLETED').length;
    const overallProgress = materials.length > 0 ? (completedMaterials / materials.length) * 100 : 0;

    if (courseLoading || materialsLoading || progressLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!currentCourse) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography variant="h5">Course not found</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Breadcrumbs */}
            <Breadcrumbs sx={{ mb: 2 }}>
                <Link component={RouterLink} to="/courses" color="inherit">
                    Courses
                </Link>
                <Typography color="text.primary">{currentCourse.title}</Typography>
            </Breadcrumbs>

            <Grid container spacing={3}>
                {/* Course Info */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h4" gutterBottom>
                                {currentCourse.title}
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                <Chip
                                    label={currentCourse.subject}
                                    color="primary"
                                    sx={{ mr: 1 }}
                                />
                                <Chip
                                    label={currentCourse.difficultyLevel}
                                    color={
                                        currentCourse.difficultyLevel === 'BEGINNER' ? 'success' :
                                            currentCourse.difficultyLevel === 'INTERMEDIATE' ? 'warning' : 'error'
                                    }
                                />
                            </Box>
                            <Typography variant="body1" paragraph>
                                {currentCourse.description}
                            </Typography>

                            {/* Progress Bar */}
                            <Box sx={{ mt: 3 }}>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography variant="subtitle1">Course Progress</Typography>
                                    <Typography variant="subtitle1">
                                        {completedMaterials}/{materials.length} completed ({Math.round(overallProgress)}%)
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={overallProgress}
                                    sx={{ height: 10, borderRadius: 5 }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Materials List */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h5">Course Materials</Typography>
                                <Button
                                    component={RouterLink}
                                    to="/generate"
                                    variant="contained"
                                    color="secondary"
                                >
                                    Generate New Material
                                </Button>
                            </Box>

                            {materials.length > 0 ? (
                                <List>
                                    {materials.map((material, index) => {
                                        const progress = getProgressForMaterial(material.id);
                                        return (
                                            <ListItem
                                                key={material.id}
                                                divider={index !== materials.length - 1}
                                                sx={{ py: 2 }}
                                            >
                                                <ListItemIcon>
                                                    {progress?.status === 'COMPLETED' ? (
                                                        <CheckCircleIcon color="success" />
                                                    ) : (
                                                        <RadioButtonUncheckedIcon />
                                                    )}
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={material.title}
                                                    secondary={
                                                        <Box>
                                                            <Box display="flex" alignItems="center" gap={1}>
                                                                <AccessTimeIcon fontSize="small" />
                                                                <Typography variant="body2">
                                                                    {material.estimatedTimeMinutes} minutes
                                                                </Typography>
                                                                {material.contentType === 'AI_GENERATED' && (
                                                                    <Chip label="AI Generated" size="small" color="info" />
                                                                )}
                                                            </Box>
                                                        </Box>
                                                    }
                                                />
                                                <Button
                                                    component={RouterLink}
                                                    to={`/materials/${material.id}`}
                                                    variant={progress?.status === 'COMPLETED' ? 'outlined' : 'contained'}
                                                    color="primary"
                                                >
                                                    {progress?.status === 'COMPLETED' ? 'Review' : 'Start'}
                                                </Button>
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            ) : (
                                <Box textAlign="center" py={4}>
                                    <ArticleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                    <Typography variant="h6" gutterBottom>
                                        No materials available
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" paragraph>
                                        Start by generating AI-powered learning materials for this course
                                    </Typography>
                                    <Button
                                        component={RouterLink}
                                        to="/generate"
                                        variant="contained"
                                        color="primary"
                                    >
                                        Generate Material
                                    </Button>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default CourseDetails;