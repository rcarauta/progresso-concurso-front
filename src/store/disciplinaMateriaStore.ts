import { configureStore } from '@reduxjs/toolkit';
import disciplinaMateriaReducer from './disciplinaMateriaSlice';

const disciplinaMateriaStore = configureStore({
  reducer: {
    disciplinaMateria: disciplinaMateriaReducer,
  },
});

export type DisciplinaMateriaState = ReturnType<typeof disciplinaMateriaStore.getState>;
export type AppDispatch = typeof disciplinaMateriaStore.dispatch;

export default disciplinaMateriaStore;
