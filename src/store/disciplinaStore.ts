import { configureStore } from '@reduxjs/toolkit';
import disciplinaReducer from './disciplinaSlice';

export const disciplinaStore = configureStore({
  reducer: {
    disciplina: disciplinaReducer,
  },
});

export type RootState = ReturnType<typeof disciplinaStore.getState>;
export type AppDispatch = typeof disciplinaStore.dispatch;
