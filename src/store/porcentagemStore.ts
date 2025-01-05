import { configureStore } from '@reduxjs/toolkit';
import listaDisciplinaPorcentagemReducer from './porcentagemSlice'

const porcentagemDisciplinaStore = configureStore({
  reducer: {
    porcentagemDisciplina: listaDisciplinaPorcentagemReducer
  },
});

export type PorcentagemDisciplinaState = ReturnType<typeof porcentagemDisciplinaStore.getState>;
export type AppDispatch = typeof porcentagemDisciplinaStore.dispatch;

export default porcentagemDisciplinaStore;