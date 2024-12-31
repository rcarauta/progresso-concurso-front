import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { DisciplinaMateria } from '../models/DisciplinaMateria';

// Estado inicial
interface DisciplinaState {
  loading: boolean;
  error: string | null;
  disciplinasMateria: DisciplinaMateria[];
}

const initialState: DisciplinaState = {
  loading: false,
  error: null,
  disciplinasMateria: [],
};


export const fetchDisciplinaMateria = createAsyncThunk<DisciplinaMateria[], { concursoId: string }, { rejectValue: string }>(
  'disciplinas/fetchDisciplinaMateria',
  async ({ concursoId }, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth.token; 

      const response = await axios.get(`http://localhost:8080/disciplina_materia/${concursoId}/questoes_total`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Erro desconhecido');
    }
  }
);

const disciplinaMateriaSlice = createSlice({
  name: 'disciplinas',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDisciplinaMateria.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDisciplinaMateria.fulfilled, (state, action) => {
        state.loading = false;
        state.disciplinasMateria = action.payload;
      })
      .addCase(fetchDisciplinaMateria.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar dados';
      });
  },
});

export default disciplinaMateriaSlice.reducer;
