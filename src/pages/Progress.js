import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    LinearProgress,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Tabs,
    Tab,
} from '@mui/material';
import { fetchUserProgress, fetchUserStatistics } from '../redux/slices/progressSlice';
import { analyzeProgress } from '../redux/slices/aiSlice';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const TabPanel = ({ children, value, index }) => {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
};

const Progress = () => {
    const dispatch = useDispatch();
    const [tabValue, setTabValue] = React.useState(0);

    const { userProgress, statistics, loading: progressLoading } = useSelector((state) => state.progress);
    const { progressAnalysis, loading: aiLoading } = useSelector((state) => state.ai);

    useEffect(() => {
        dispatch(fetchUserProgress());
        dispatch(fetchUserStatistics());
        dispatch(analyzeProgress());
    }, [dispatch]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    if (progressLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    // Prepare data for charts
    const subjectData = userProgress.reduce((acc, progress) => {
        const subject = progress.materialTitle.split(' ')[0]; // Simplistic subject extraction
        if (!acc[subject]) {
            acc[subject] = { completed: 0, total: 0 };
        }
        acc[subject].total++;
        if (progress.status === 'COMPLETED') {
            acc[subject].completed++;
        }
        return acc;
    }, {});

    const barChartData = {
        labels: Object.keys(subjectData),
        datasets: [
            {
                label: 'Completed',
                data: Object.values(subjectData).map(d => d.completed),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: 'Total',
                data: Object.values(subjectData).map(d => d.total),
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
            },
        ],
    };

    const pieChartData = {
        labels: ['Completed', 'In Progress', 'Not Started'],
        datasets: [
            {
                data: [
                    userProgress.filter(p => p.status === 'COMPLETED').length,
                    userProgress.filter(p => p.status === 'IN_PROGRESS').length,
                    userProgress.filter(p => p.status === 'NOT_STARTED').length,
                ],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                ],
            },
        ],
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                My Progress
            </Typography>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Materials
                            </Typography>
                            <Typography variant="h4">
                                {statistics?.totalMaterials || 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Completed
                            </Typography>
                            <Typography variant="h4">
                                {statistics?.completedMaterials || 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Avg Score
                            </Typography>
                            <Typography variant="h4">
                                {statistics?.averageScore?.toFixed(1) || '0'}%
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Time Spent
                            </Typography>
                            <Typography variant="h4">
                                {Math.round((statistics?.totalTimeSpent || 0) / 60)}h
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Tabs */}
            <Paper sx={{ mb: 4 }}>
                <Tabs value={tabValue} onChange={handleTabChange} centered>
                    <Tab label="Overview" />
                    <Tab label="Details" />
                    <Tab label="AI Analysis" />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Progress by Subject
                                    </Typography>
                                    <Bar data={barChartData} />
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Status Distribution
                                    </Typography>
                                    <Pie data={pieChartData} />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Material</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Score</TableCell>
                                    <TableCell>Time Spent</TableCell>
                                    <TableCell>Last Interaction</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {userProgress.map((progress) => (
                                    <TableRow key={progress.id}>
                                        <TableCell>{progress.materialTitle}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={progress.status}
                                                color={
                                                    progress.status === 'COMPLETED' ? 'success' :
                                                        progress.status === 'IN_PROGRESS' ? 'warning' : 'default'
                                                }
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{progress.score ? `${progress.score}%` : '-'}</TableCell>
                                        <TableCell>{progress.completionTime ? `${progress.completionTime} min` : '-'}</TableCell>
                                        <TableCell>
                                            {new Date(progress.lastInteraction).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                AI Progress Analysis
                            </Typography>
                            {aiLoading ? (
                                <Box display="flex" justifyContent="center" p={4}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                    {progressAnalysis || 'No analysis available yet. Complete more materials to get personalized recommendations.'}
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </TabPanel>
            </Paper>
        </Container>
    );
};

export default Progress;