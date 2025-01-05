import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { PorcentagemSubDisciplina } from '../models/PorcentagemSubDisciplina';

export const fetchPercentages = createAsyncThunk(
  'disciplinas/fetchPercentages',
  async (disciplina: string) => {
    const response = await axios.get(`http://localhost:5000/topics/percentages?disciplina=${disciplina}`);
    return response.data;
  }
);

export const fetchSubtopicsPercentages = createAsyncThunk(
    'subtopics/fetchSubtopicsPercentages',
    async (disciplina: string) => {
      const response = await axios.get(`http://localhost:5001/subtopics/percentages?disciplina=${disciplina}`);
      return response.data;
    }
  );

const listaDisciplinaPorcentagemSlice = createSlice({
  name: 'disciplinas',
  initialState: {
    disciplinas: ['portugues', 'direitoConstitucional', 'direitoAdministrativo', 'nocoesInformatica'],
    percentages: null,
    subtopics: [] as unknown as PorcentagemSubDisciplina,
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