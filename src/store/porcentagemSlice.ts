import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PorcentagemSubDisciplina } from '../models/PorcentagemSubDisciplina';
import { PorcentagemDisciplina } from '../models/PorcentagemDisciplina';
import { http } from '../http';

export const fetchPercentages = createAsyncThunk(
  'disciplinas/fetchPercentages',
  async (disciplina: string) => {
    const response = await http.get(`http://localhost:5000/topics/percentages?disciplina=${disciplina}`);
    return response.data;
  }
);

export const fetchSubtopicsPercentages = createAsyncThunk(
    'subtopics/fetchSubtopicsPercentages',
    async (disciplina: string) => {
      const response = await http.get(`http://localhost:5001/subtopics/percentages?disciplina=${disciplina}`);
      return response.data;
    }
  );

const listaDisciplinaPorcentagemSlice = createSlice({
  name: 'disciplinas',
  initialState: {
    disciplinas: ['portugues', 'direitoConstitucional', 'direitoAdministrativo', 'nocoesInformatica',
    'direitoPenal', 'matematica', 'direitoProcessualPenal', 'direitoCivil', 'enfermagem',
    'codigoProcessoCivil', 'pedagogia', 'administracaoGeral', 'direitoEleitoral','psicologia'],
    percentages: []  as PorcentagemDisciplina[],
    subtopics: [] as unknown as PorcentagemSubDisciplina[],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPercentages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPercentages.fulfilled, (state, action) => {
        state.loading = false;
        state.percentages = action.payload;
      })
      .addCase(fetchPercentages.rejected, (state) => {
        state.loading = false;
       // state.error = action.error.message;
      })
      .addCase(fetchSubtopicsPercentages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubtopicsPercentages.fulfilled, (state, action) => {
        state.loading = false;
        state.subtopics = action.payload;
      })
      .addCase(fetchSubtopicsPercentages.rejected, (state) => {
        state.loading = false;
       // state.error = action.error.message;
      });
  },
});

export default listaDisciplinaPorcentagemSlice.reducer;
