import { configureStore } from '@reduxjs/toolkit';
import coursesReducer from './slices/coursesSlice';
import materialsReducer from './slices/materialsSlice';
import progressReducer from './slices/progressSlice';
import aiReducer from './slices/aiSlice';
import userReducer from './slices/userSlice';
import quizReducer from './slices/quizSlice';

const store = configureStore({
    reducer: {
        courses: coursesReducer,
        materials: materialsReducer,
        progress: progressReducer,
        ai: aiReducer,
        user: userReducer,
        quiz: quizReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;