import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchQuizById = createAsyncThunk(
    'quiz/fetchQuizById',
    async (id) => {
        const response = await api.get(`/quizzes/${id}`);
        return response.data;
    }
);

export const evaluateQuiz = createAsyncThunk(
    'quiz/evaluateQuiz',
    async ({ quizId, answers }) => {
        const response = await api.post(`/quizzes/evaluate/${quizId}`, answers);
        return response.data;
    }
);

const quizSlice = createSlice({
    name: 'quiz',
    initialState: {
        quiz: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearQuiz: (state) => {
            state.quiz = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuizById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuizById.fulfilled, (state, action) => {
                state.loading = false;
                state.quiz = action.payload;
            })
            .addCase(fetchQuizById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(evaluateQuiz.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(evaluateQuiz.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(evaluateQuiz.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { clearQuiz } = quizSlice.actions;
export default quizSlice.reducer;