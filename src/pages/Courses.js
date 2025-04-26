import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Container,
    Grid,
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    CircularProgress,
    TextField,
    MenuItem,
    Chip,
} from '@mui/material';
import { fetchCourses } from '../redux/slices/coursesSlice';
import FilterListIcon from '@mui/icons-material/FilterList';

const Courses = () => {
    const dispatch = useDispatch();
    const { courses, loading } = useSelector((state) => state.courses);
    const [searchTerm, setSearchTerm] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('');

    useEffect(() => {
        dispatch(fetchCourses());
    }, [dispatch]);

    const subjects = [...new Set(courses.map(course => course.subject))];
    const difficulties = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubject = !subjectFilter || course.subject === subjectFilter;
        const matchesDifficulty = !difficultyFilter || course.difficultyLevel === difficultyFilter;
        return matchesSearch && matchesSubject && matchesDifficulty;
    });

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Available Courses
            </Typography>

            {/* Filters */}
            <Box sx={{ mb: 4 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Search courses"
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            select
                            label="Subject"
                            value={subjectFilter}
                            onChange={(e) => setSubjectFilter(e.target.value)}
                        >
                            <MenuItem value="">All Subjects</MenuItem>
                            {subjects.map((subject) => (
                                <MenuItem key={subject} value={subject}>
                                    {subject}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            select
                            label="Difficulty"
                            value={difficultyFilter}
                            onChange={(e) => setDifficultyFilter(e.target.value)}
                        >
                            <MenuItem value="">All Levels</MenuItem>
                            {difficulties.map((difficulty) => (
                                <MenuItem key={difficulty} value={difficulty}>
                                    {difficulty}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
            </Box>

            {/* Course Grid */}
            <Grid container spacing={3}>
                {filteredCourses.map((course) => (
                    <Grid item xs={12} sm={6} md={4} key={course.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    {course.title}
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Chip
                                        label={course.subject}
                                        color="primary"
                                        size="small"
                                        sx={{ mr: 1 }}
                                    />
                                    <Chip
                                        label={course.difficultyLevel}
                                        color={
                                            course.difficultyLevel === 'BEGINNER' ? 'success' :
                                                course.difficultyLevel === 'INTERMEDIATE' ? 'warning' : 'error'
                                        }
                                        size="small"
                                    />
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    {course.description?.length > 150
                                        ? `${course.description.substring(0, 150)}...`
                                        : course.description}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    component={RouterLink}
                                    to={`/courses/${course.id}`}
                                    variant="contained"
                                    fullWidth
                                >
                                    View Course
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {filteredCourses.length === 0 && (
                <Box
                    sx={{
                        textAlign: 'center',
                        py: 8,
                        px: 2,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                    }}
                >
                    <FilterListIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                        No courses found
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Try adjusting your filters or search terms
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default Courses;