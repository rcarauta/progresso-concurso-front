import { configureStore } from '@reduxjs/toolkit';
import concursoReducer from './concursoSlice';

const concursoStore = configureStore({
  reducer: {
    concurso: concursoReducer,
  },
});

export type ConcursoStore = ReturnType<typeof concursoStore.getState>;
export type AppDispatch = typeof concursoStore.dispatch;

export default concursoStore;
