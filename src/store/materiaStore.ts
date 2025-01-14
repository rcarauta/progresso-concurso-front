import { configureStore } from '@reduxjs/toolkit';
import materiaReducer from './materiaSlice';

const materiaStore = configureStore({
  reducer: {
    materia: materiaReducer,
  },
});

export type MateriaState = ReturnType<typeof materiaStore.getState>;
export type AppDispatch = typeof materiaStore.dispatch;

export default materiaStore;
