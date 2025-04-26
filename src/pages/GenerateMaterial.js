import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
    Box,
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    MenuItem,
    CircularProgress,
    Stepper,
    Step,
    StepLabel,
} from '@mui/material';
import { fetchCourses } from '../redux/slices/coursesSlice';
import { generateMaterial } from '../redux/slices/aiSlice';
import { createMaterial } from '../redux/slices/materialsSlice';
import { toast } from 'react-toastify';

const validationSchema = yup.object({
    courseId: yup.number().required('Course is required'),
    topic: yup.string().required('Topic is required').min(3, 'Topic should be at least 3 characters'),
    difficultyLevel: yup.string().required('Difficulty level is required'),
    aiPreferences: yup.string(),
});

const steps = ['Configure Settings', 'Generate with AI', 'Review & Save'];

const GenerateMaterial = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);

    const { courses, loading: coursesLoading } = useSelector((state) => state.courses);
    const { generatedMaterial, loading: aiLoading } = useSelector((state) => state.ai);
    const { loading: materialLoading } = useSelector((state) => state.materials);

    useEffect(() => {
        dispatch(fetchCourses());
    }, [dispatch]);

    const formik = useFormik({
        initialValues: {
            courseId: '',
            topic: '',
            difficultyLevel: 'INTERMEDIATE',
            aiPreferences: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                // Step 1: Generate content with AI
                setActiveStep(1);
                const generated = await dispatch(generateMaterial(values)).unwrap();

                // Step 2: Review
                setActiveStep(2);

                // Automatically save after a short delay for review
                setTimeout(async () => {
                    try {
                        const materialData = {
                            ...generated,
                            courseId: values.courseId,
                            title: generated.title || values.topic,
                            content: generated.content,
                            contentType: 'AI_GENERATED',
                            difficultyLevel: values.difficultyLevel,
                            estimatedTimeMinutes: generated.estimatedTimeMinutes || 30,
                            aiModelUsed: generated.model
                        };

                        const savedMaterial = await dispatch(createMaterial(materialData)).unwrap();
                        toast.success('Material created successfully!');
                        navigate(`/materials/${savedMaterial.id}`);
                    } catch (saveError) {
                        toast.error('Failed to save material');
                    }
                }, 2000);

            } catch (error) {
                toast.error('Failed to generate material');
                setActiveStep(0);
            }
        },
    });

    if (coursesLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Generate AI-Powered Learning Material
            </Typography>

            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            {activeStep === 0 && (
                                <form onSubmit={formik.handleSubmit}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                select
                                                id="courseId"
                                                name="courseId"
                                                label="Select Course"
                                                value={formik.values.courseId}
                                                onChange={formik.handleChange}
                                                error={formik.touched.courseId && Boolean(formik.errors.courseId)}
                                                helperText={formik.touched.courseId && formik.errors.courseId}
                                            >
                                                {courses.map((course) => (
                                                    <MenuItem key={course.id} value={course.id}>
                                                        {course.title}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                id="topic"
                                                name="topic"
                                                label="Material Topic"
                                                value={formik.values.topic}
                                                onChange={formik.handleChange}
                                                error={formik.touched.topic && Boolean(formik.errors.topic)}
                                                helperText={formik.touched.topic && formik.errors.topic}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                select
                                                id="difficultyLevel"
                                                name="difficultyLevel"
                                                label="Difficulty Level"
                                                value={formik.values.difficultyLevel}
                                                onChange={formik.handleChange}
                                                error={formik.touched.difficultyLevel && Boolean(formik.errors.difficultyLevel)}
                                                helperText={formik.touched.difficultyLevel && formik.errors.difficultyLevel}
                                            >
                                                <MenuItem value="BEGINNER">Beginner</MenuItem>
                                                <MenuItem value="INTERMEDIATE">Intermediate</MenuItem>
                                                <MenuItem value="ADVANCED">Advanced</MenuItem>
                                            </TextField>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={4}
                                                id="aiPreferences"
                                                name="aiPreferences"
                                                label="Additional AI Preferences (optional)"
                                                value={formik.values.aiPreferences}
                                                onChange={formik.handleChange}
                                                error={formik.touched.aiPreferences && Boolean(formik.errors.aiPreferences)}
                                                helperText={formik.touched.aiPreferences && formik.errors.aiPreferences}
                                                placeholder="Describe any specific requirements, focus areas, or style preferences..."
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                size="large"
                                                fullWidth
                                                disabled={formik.isSubmitting}
                                            >
                                                Generate Material
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            )}

                            {activeStep === 1 && (
                                <Box textAlign="center" py={8}>
                                    <CircularProgress size={60} sx={{ mb: 4 }} />
                                    <Typography variant="h6" gutterBottom>
                                        AI is generating your material...
                                    </Typography>
                                    <Typography color="text.secondary">
                                        This may take a few moments. Please wait.
                                    </Typography>
                                </Box>
                            )}

                            {activeStep === 2 && (
                                <Box py={4}>
                                    <Typography variant="h5" gutterBottom>
                                        Material Generated Successfully!
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" paragraph>
                                        Your material has been generated and saved. You will be redirected to the material page shortly.
                                    </Typography>
                                    <CircularProgress size={30} />
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Generation Tips
                            </Typography>
                            <Typography variant="body2" paragraph>
                                • Be specific with your topic for better results
                            </Typography>
                            <Typography variant="body2" paragraph>
                                • Choose the appropriate difficulty level
                            </Typography>
                            <Typography variant="body2" paragraph>
                                • Include any specific requirements in preferences
                            </Typography>
                            <Typography variant="body2" paragraph>
                                • The AI will generate content tailored to your needs
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default GenerateMaterial;