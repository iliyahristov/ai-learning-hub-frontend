import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Container,
    Card,
    CardContent,
    Typography,
    Button,
    RadioGroup,
    FormControlLabel,
    Radio,
    CircularProgress,
    LinearProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { fetchQuizById, evaluateQuiz } from '../redux/slices/quizSlice';
import { updateProgress } from '../redux/slices/progressSlice';
import { toast } from 'react-toastify';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const Quiz = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(null);
    const [startTime, setStartTime] = useState(null);

    const { quiz, loading } = useSelector((state) => state.quiz);

    useEffect(() => {
        dispatch(fetchQuizById(quizId));
        setStartTime(Date.now());
    }, [dispatch, quizId]);

    const handleAnswerChange = (questionId, answerId) => {
        setAnswers({
            ...answers,
            [questionId]: answerId,
        });
    };

    const handleNext = () => {
        if (currentQuestion < quiz.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleSubmit = async () => {
        try {
            // Evaluate quiz
            const response = await dispatch(evaluateQuiz({ quizId, answers })).unwrap();
            setScore(response);

            // Update progress
            const completionTime = Math.round((Date.now() - startTime) / 60000); // minutes
            await dispatch(updateProgress({
                materialId: quiz.materialId,
                progressData: {
                    status: 'COMPLETED',
                    score: response,
                    completionTime: completionTime,
                }
            })).unwrap();

            setShowResults(true);
            toast.success('Quiz completed successfully!');
        } catch (error) {
            toast.error('Failed to submit quiz');
        }
    };

    if (loading || !quiz) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
    const currentQ = quiz.questions[currentQuestion];

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        {quiz.title}
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                        <LinearProgress variant="determinate" value={progress} />
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Question {currentQuestion + 1} of {quiz.questions.length}
                        </Typography>
                    </Box>

                    {!showResults ? (
                        <>
                            <Typography variant="h6" sx={{ mb: 3 }}>
                                {currentQ.questionText}
                            </Typography>

                            <RadioGroup
                                value={answers[currentQ.id] || ''}
                                onChange={(e) => handleAnswerChange(currentQ.id, parseInt(e.target.value))}
                            >
                                {currentQ.answers.map((answer) => (
                                    <FormControlLabel
                                        key={answer.id}
                                        value={answer.id}
                                        control={<Radio />}
                                        label={answer.answerText}
                                    />
                                ))}
                            </RadioGroup>

                            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                                <Button
                                    onClick={handlePrevious}
                                    disabled={currentQuestion === 0}
                                >
                                    Previous
                                </Button>

                                {currentQuestion === quiz.questions.length - 1 ? (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSubmit}
                                        disabled={Object.keys(answers).length !== quiz.questions.length}
                                    >
                                        Submit Quiz
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        onClick={handleNext}
                                    >
                                        Next
                                    </Button>
                                )}
                            </Box>
                        </>
                    ) : (
                        <Box textAlign="center">
                            <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                            <Typography variant="h4" gutterBottom>
                                Quiz Completed!
                            </Typography>
                            <Typography variant="h5" color="primary" gutterBottom>
                                Your Score: {score?.toFixed(1)}%
                            </Typography>
                            <Button
                                variant="contained"
                                sx={{ mt: 3 }}
                                onClick={() => navigate(`/materials/${quiz.materialId}`)}
                            >
                                Back to Material
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Results Dialog */}
            <Dialog open={showResults} onClose={() => {}} maxWidth="md" fullWidth>
                <DialogTitle>Quiz Results</DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            Your Score: {score?.toFixed(1)}%
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Review your answers below:
                        </Typography>
                    </Box>

                    {quiz.questions.map((question) => {
                        const userAnswer = question.answers.find(a => a.id === answers[question.id]);
                        const correctAnswer = question.answers.find(a => a.correct);
                        const isCorrect = userAnswer?.id === correctAnswer?.id;

                        return (
                            <Box key={question.id} sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    {question.questionText}
                                </Typography>
                                <Box sx={{ pl: 2 }}>
                                    <Typography
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            color: isCorrect ? 'success.main' : 'error.main',
                                            mb: 1,
                                        }}
                                    >
                                        {isCorrect ? <CheckCircleIcon sx={{ mr: 1 }} /> : <CancelIcon sx={{ mr: 1 }} />}
                                        Your answer: {userAnswer?.answerText || 'Not answered'}
                                    </Typography>
                                    {!isCorrect && (
                                        <Typography
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                color: 'success.main',
                                            }}
                                        >
                                            <CheckCircleIcon sx={{ mr: 1 }} />
                                            Correct answer: {correctAnswer?.answerText}
                                        </Typography>
                                    )}
                                    {correctAnswer?.explanation && (
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                            Explanation: {correctAnswer.explanation}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        );
                    })}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => navigate(`/materials/${quiz.materialId}`)}>
                        Back to Material
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Quiz;