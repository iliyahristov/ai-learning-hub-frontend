import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
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
    Breadcrumbs,
    Link,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tab,
    Tabs,
} from '@mui/material';
import { fetchMaterialById } from '../redux/slices/materialsSlice';
import { generateDiagram, generateQuiz } from '../redux/slices/aiSlice';
import { updateProgress } from '../redux/slices/progressSlice';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import QuizIcon from '@mui/icons-material/Quiz';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReactMarkdown from 'react-markdown';
import mermaid from 'mermaid';
import { toast } from 'react-toastify';

const MaterialView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentMaterial, loading: materialLoading } = useSelector((state) => state.materials);
    const { generatedDiagram, generatedQuiz, loading: aiLoading } = useSelector((state) => state.ai);
    const [diagramDialog, setDiagramDialog] = useState(false);
    const [quizDialog, setQuizDialog] = useState(false);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        dispatch(fetchMaterialById(id));
    }, [dispatch, id]);

    useEffect(() => {
        mermaid.initialize({ startOnLoad: true });
    }, []);

    const markAsComplete = async () => {
        try {
            await dispatch(updateProgress({
                materialId: id,
                progressData: { status: 'COMPLETED' }
            })).unwrap();
            toast.success('Material marked as complete!');
        } catch (error) {
            toast.error('Failed to update progress');
        }
    };

    const generateMaterialDiagram = async () => {
        try {
            await dispatch(generateDiagram(currentMaterial.content)).unwrap();
            setDiagramDialog(true);
        } catch (error) {
            toast.error('Failed to generate diagram');
        }
    };

    const generateMaterialQuiz = async () => {
        try {
            await dispatch(generateQuiz({
                materialId: id,
                difficultyLevel: currentMaterial.difficultyLevel
            })).unwrap();
            setQuizDialog(true);
        } catch (error) {
            toast.error('Failed to generate quiz');
        }
    };

    if (materialLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!currentMaterial) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography variant="h5">Material not found</Typography>
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
                <Link component={RouterLink} to={`/courses/${currentMaterial.courseId}`} color="inherit">
                    {currentMaterial.courseTitle}
                </Link>
                <Typography color="text.primary">{currentMaterial.title}</Typography>
            </Breadcrumbs>

            <Grid container spacing={3}>
                {/* Material Content */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h4" gutterBottom>
                                {currentMaterial.title}
                            </Typography>

                            <Box sx={{ mb: 3 }}>
                                <Chip
                                    icon={<AccessTimeIcon />}
                                    label={`${currentMaterial.estimatedTimeMinutes} minutes`}
                                    sx={{ mr: 1 }}
                                />
                                <Chip
                                    label={currentMaterial.difficultyLevel}
                                    color={
                                        currentMaterial.difficultyLevel === 'BEGINNER' ? 'success' :
                                            currentMaterial.difficultyLevel === 'INTERMEDIATE' ? 'warning' : 'error'
                                    }
                                    sx={{ mr: 1 }}
                                />
                                {currentMaterial.contentType === 'AI_GENERATED' && (
                                    <Chip label="AI Generated" color="info" />
                                )}
                            </Box>

                            <Box sx={{
                                mt: 4,
                                '& h1, & h2, & h3': { mt: 4, mb: 2 },
                                '& p': { mb: 2 },
                                '& pre': { bgcolor: 'grey.100', p: 2, borderRadius: 1, overflow: 'auto' },
                                '& code': { bgcolor: 'grey.100', px: 1, borderRadius: 0.5, fontFamily: 'monospace' },
                            }}>
                                <ReactMarkdown>{currentMaterial.content}</ReactMarkdown>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Sidebar */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Actions
                            </Typography>
                            <Box display="flex" flexDirection="column" gap={2}>
                                <Button
                                    variant="contained"
                                    startIcon={<CheckCircleIcon />}
                                    onClick={markAsComplete}
                                    fullWidth
                                >
                                    Mark as Complete
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<AccountTreeIcon />}
                                    onClick={generateMaterialDiagram}
                                    disabled={aiLoading}
                                    fullWidth
                                >
                                    Generate Diagram
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<QuizIcon />}
                                    onClick={generateMaterialQuiz}
                                    disabled={aiLoading}
                                    fullWidth
                                >
                                    Generate Quiz
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Key Concepts
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                AI will extract key concepts from this material (feature coming soon)
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Diagram Dialog */}
            <Dialog
                open={diagramDialog}
                onClose={() => setDiagramDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Material Visualization</DialogTitle>
                <DialogContent>
                    {aiLoading ? (
                        <Box display="flex" justifyContent="center" p={4}>
                            <CircularProgress />
                        </Box>
                    ) : generatedDiagram ? (
                        <Box sx={{ p: 2 }}>
                            <div className="mermaid">
                                {generatedDiagram}
                            </div>
                        </Box>
                    ) : (
                        <Typography>No diagram generated</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDiagramDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Quiz Dialog */}
            <Dialog
                open={quizDialog}
                onClose={() => setQuizDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Generated Quiz</DialogTitle>
                <DialogContent>
                    {aiLoading ? (
                        <Box display="flex" justifyContent="center" p={4}>
                            <CircularProgress />
                        </Box>
                    ) : generatedQuiz ? (
                        <Box sx={{ p: 2 }}>
                            <Typography>Quiz generated successfully!</Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => navigate(`/quiz/${generatedQuiz.id}`)}
                                sx={{ mt: 2 }}
                            >
                                Start Quiz
                            </Button>
                        </Box>
                    ) : (
                        <Typography>No quiz generated</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setQuizDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MaterialView;